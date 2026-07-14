import { useContext, useEffect, useState, useMemo } from 'react'
import DashboardCard from '../components/DashboardCard.jsx'
import Navbar from '../components/Navbar.jsx'
import Loader from '../components/Loader.jsx'
import { AuthContext } from '../context/authContextValue.js'
import { JobContext } from '../context/jobContextValue.js'
import { jobsApi } from '../api/jobsApi.js'
import getRecommendedJobs from '../utils/recommendationLogic.js'

const RECS_CACHE_DURATION = 2 * 60 * 60 * 1000
const recsCache = new Map()
const pendingRecsRequests = new Map()

function Dashboard() {
  const { user } = useContext(AuthContext)
  const { savedJobs, appliedJobs } = useContext(JobContext)
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(false)

  const userSkills = useMemo(
    () => (user?.skills?.length ? user.skills : []),
    [user],
  )

  useEffect(() => {
    if (!userSkills.length) {
      setRecommendedJobs([])
      return
    }

    let active = true
    const cacheKey = [...userSkills].sort().join(',')

    const loadRecommendations = async () => {
      setLoadingRecs(true)
      try {
        const cached = recsCache.get(cacheKey)
        const isCacheValid = cached && Date.now() - cached.createdAt < RECS_CACHE_DURATION
        if (isCacheValid) {
          if (active) {
            setRecommendedJobs(cached.jobs)
            setLoadingRecs(false)
          }
          return
        }

        if (!pendingRecsRequests.has(cacheKey)) {
          const fetchPromise = (async () => {
            const query = userSkills.join(' ')
            const jobs = await jobsApi.fetchJobs({ search: query, isRecommendation: true })
            return getRecommendedJobs(jobs, userSkills, 3)
          })()

          const request = fetchPromise
            .then((data) => {
              recsCache.set(cacheKey, { jobs: data, createdAt: Date.now() })
              return data
            })
            .finally(() => {
              pendingRecsRequests.delete(cacheKey)
            })
          pendingRecsRequests.set(cacheKey, request)
        }

        const data = await pendingRecsRequests.get(cacheKey)
        if (active) {
          setRecommendedJobs(data)
        }
      } catch (err) {
        console.error('Error fetching recommended jobs:', err)
      } finally {
        if (active) {
          setLoadingRecs(false)
        }
      }
    }

    loadRecommendations()

    return () => {
      active = false
    }
  }, [userSkills])

  const interviewCount = appliedJobs.filter((job) => job.status === 'Interview').length

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-6xl px-4 py-8'>
        <h1 className='text-3xl font-black'>Hi {user?.name || 'Student'}, here is your dashboard</h1>
        <section className='mt-6 grid gap-4 md:grid-cols-4'>
          <DashboardCard title='Saved Jobs' value={savedJobs.length} description='Shortlisted opportunities' />
          <DashboardCard title='Applied Jobs' value={appliedJobs.length} description='Submitted applications' />
          <DashboardCard title='Interviews' value={interviewCount} description='Interview stage applications' />
          <DashboardCard title='Profile Skills' value={userSkills.length} description={userSkills.length ? userSkills.join(', ') : 'Add skills in Profile'} />
        </section>
        <section className='mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-bold'>Recommended Jobs</h2>
          {loadingRecs && <Loader message='Finding recommendations matching your skills...' />}
          {!loadingRecs && !recommendedJobs.length && (
            <p className='mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-600'>
              {!userSkills.length
                ? 'Add skills in your profile to see recommendations.'
                : 'No job recommendations found matching your skills. Try adding more skills in your profile.'}
            </p>
          )}
          {!loadingRecs && recommendedJobs.length > 0 && (
            <div className='mt-4 grid gap-3'>
              {recommendedJobs.map((job) => (
                <div key={job.id} className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-100 p-4'>
                  <div>
                    <p className='font-semibold'>{job.title}</p>
                    <p className='text-sm text-slate-500'>{job.company} - {job.location}</p>
                  </div>
                  <span className='rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700'>
                    {job.matchScore}% match
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard
