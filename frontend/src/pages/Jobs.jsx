import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Filters from '../components/Filters.jsx'
import JobCard from '../components/JobCard.jsx'
import Loader from '../components/Loader.jsx'
import Navbar from '../components/Navbar.jsx'
import Pagination from '../components/Pagination.jsx'
import { JobContext } from '../context/jobContextValue.js'
import { AuthContext } from '../context/authContextValue.js'
import { savedSearchesApi } from '../api/savedSearchesApi.js'
import useDebounce from '../hooks/useDebounce.js'
import useFetchJobs from '../hooks/useFetchJobs.js'
import usePagination from '../hooks/usePagination.js'
import { filterJobs, getUniqueValues } from '../utils/helpers.js'

const initialFilters = {
  search: '',
  company: '',
  location: '',
  type: '',
  skill: '',
  experience: '',
  sort: 'newest',
}

function Jobs() {
  const [source, setSource] = useState('external')
  const [filters, setFilters] = useState(initialFilters)
  const [savedSearches, setSavedSearches] = useState([])
  const [activeSavedSearch, setActiveSavedSearch] = useState(null)
  const [newJobIds, setNewJobIds] = useState([])
  const [savedSearchMessage, setSavedSearchMessage] = useState('')
  const lastComparisonRef = useRef('')
  const debouncedSearch = useDebounce(filters.search, 4000)
  const { jobs, loading, error, resolvedSearchQuery } = useFetchJobs(debouncedSearch, source)
  const { user } = useContext(AuthContext)
  const { saveJob, applyJob, savedJobs, appliedJobs } = useContext(JobContext)

  useEffect(() => {
    if (!user) return

    let active = true
    savedSearchesApi.getSavedSearches(user.id)
      .then((searches) => active && setSavedSearches(searches))
      .catch((err) => console.error('Failed to load saved searches:', err))

    return () => {
      active = false
    }
  }, [user])

  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  )
  const filterOptions = useMemo(
    () => ({
      companies: getUniqueValues(jobs, 'company'),
      locations: getUniqueValues(jobs, 'location'),
      types: getUniqueValues(jobs, 'type'),
      skills: getUniqueValues(jobs, 'skills'),
      experienceLevels: getUniqueValues(jobs, 'experience'),
    }),
    [jobs],
  )
  const filteredJobs = useMemo(
    () => filterJobs(jobs, activeFilters),
    [jobs, activeFilters],
  )
  const pagination = usePagination(filteredJobs, 4)
  const handleSaveJob = useCallback((job) => saveJob(job), [saveJob])
  const handleApplyJob = useCallback((job) => applyJob(job), [applyJob])
  const normalizedSearch = filters.search.trim().toLowerCase()
  const isCurrentSearchSaved = savedSearches.some(
    (savedSearch) => savedSearch.search_query.trim().toLowerCase() === normalizedSearch,
  )

  const handleSaveSearch = async () => {
    const searchQuery = filters.search.trim()
    if (!user) {
      setSavedSearchMessage('Log in to save this search.')
      return
    }
    if (!searchQuery) return

    try {
      const savedSearch = await savedSearchesApi.saveSearch(
        user.id,
        searchQuery,
        filteredJobs.map((job) => job.id),
      )
      setSavedSearches((current) => {
        if (current.some((item) => item.id === savedSearch.id)) return current
        return [savedSearch, ...current]
      })
      setSavedSearchMessage('Search saved.')
    } catch (err) {
      console.error('Failed to save search:', err)
      setSavedSearchMessage('Unable to save this search.')
    }
  }

  const runSavedSearch = (savedSearch) => {
    setFilters({ ...initialFilters, search: savedSearch.search_query })
    setActiveSavedSearch(savedSearch)
    setNewJobIds([])
    setSavedSearchMessage('')
    lastComparisonRef.current = ''
  }

  useEffect(() => {
    if (!activeSavedSearch || loading || error) return
    if (
      resolvedSearchQuery.trim().toLowerCase() !==
      activeSavedSearch.search_query.trim().toLowerCase()
    ) return

    const jobIds = jobs.map((job) => String(job.id))
    const comparisonKey = `${activeSavedSearch.id}:${jobIds.join('|')}`
    if (lastComparisonRef.current === comparisonKey) return
    lastComparisonRef.current = comparisonKey

    savedSearchesApi.compareAndUpdateResults(activeSavedSearch.id, jobIds)
      .then((ids) => setNewJobIds(ids.map(String)))
      .catch((err) => {
        lastComparisonRef.current = ''
        console.error('Failed to compare saved search results:', err)
      })
  }, [activeSavedSearch, error, jobs, loading, resolvedSearchQuery])

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-6xl px-4 py-8'>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className='text-3xl font-black'>Jobs and Internships</h1>
            <p className='mt-2 text-slate-600'>Filter jobs by skills, location, type, and level.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setSource('external')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${source === 'external' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              External Web
            </button>
            <button
              onClick={() => setSource('platform')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${source === 'platform' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              SmartJob Platform
            </button>
          </div>
        </div>
        
        <div className='mt-6'>
          <Filters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(initialFilters)}
            options={filterOptions}
          />
        </div>
        {filters.search.trim() && (
          <div className='mt-4 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={handleSaveSearch}
              disabled={isCurrentSearchSaved}
              className='rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400'
            >
              {isCurrentSearchSaved ? 'Search Saved' : 'Save Search'}
            </button>
            {savedSearchMessage && <p className='text-sm text-slate-600'>{savedSearchMessage}</p>}
          </div>
        )}
        {user && savedSearches.length > 0 && (
          <section className='mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
            <h2 className='font-bold'>Saved Searches</h2>
            <div className='mt-3 flex flex-wrap gap-2'>
              {savedSearches.map((savedSearch) => (
                <button
                  type='button'
                  key={savedSearch.id}
                  onClick={() => runSavedSearch(savedSearch)}
                  className='rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold'
                >
                  {savedSearch.search_query}
                </button>
              ))}
            </div>
          </section>
        )}
        {loading && <Loader message='Finding matching jobs...' />}
        {error && <p className='mt-6 rounded-md bg-red-50 p-4 text-red-700'>{error}</p>}
        {!loading && !error && (
          <>
            <p className='mt-5 text-sm font-medium text-slate-500'>
              Showing {filteredJobs.length} matching opportunities
            </p>
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              {pagination.currentData.map((job) => {
                const appliedJob = appliedJobs.find((item) => item.id === job.id)
                const isApplyDisabled = Boolean(
                  appliedJob && appliedJob.status !== 'Rejected',
                )

                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    handleSaveJob={handleSaveJob}
                    handleApplyJob={handleApplyJob}
                    isSaved={savedJobs.some((item) => item.id === job.id)}
                    isApplied={isApplyDisabled}
                    applicationStatus={appliedJob?.status}
                    isNew={newJobIds.includes(String(job.id))}
                  />
                )
              })}
            </div>
            {!filteredJobs.length && (
              <div className='mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center'>
                No jobs found. Try changing the filters.
              </div>
            )}
            <Pagination {...pagination} onPageChange={pagination.goToPage} />
          </>
        )}
      </main>
    </div>
  )
}

export default Jobs
