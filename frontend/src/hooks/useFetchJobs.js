import { useEffect, useState } from 'react'
import { jobsApi } from '../api/jobsApi'

const JOBS_CACHE_DURATION = 2 * 60 * 60 * 1000

const jobsCache = new Map()
const pendingJobsRequests = new Map()

function getJobs(searchQuery, source = 'external') {
  const cacheKey = `${source}:${searchQuery.trim().toLowerCase()}`
  const cached = jobsCache.get(cacheKey)
  const isCacheValid = cached && Date.now() - cached.createdAt < JOBS_CACHE_DURATION

  if (isCacheValid) {
    return Promise.resolve(cached.jobs)
  }

  if (!pendingJobsRequests.has(cacheKey)) {
    const requestPromise = source === 'platform' 
      ? jobsApi.fetchPlatformJobs({ search: searchQuery })
      : jobsApi.fetchJobs({ search: searchQuery })

    const request = requestPromise
      .then((data) => {
        jobsCache.set(cacheKey, { jobs: data, createdAt: Date.now() })
        return data
      })
      .finally(() => {
        pendingJobsRequests.delete(cacheKey)
      })
    pendingJobsRequests.set(cacheKey, request)
  }

  return pendingJobsRequests.get(cacheKey)
}

function useFetchJobs(searchQuery = '', source = 'external') {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolvedSearchQuery, setResolvedSearchQuery] = useState('')

  useEffect(() => {
    let active = true

    const loadJobs = async () => {
      setLoading(true)
      try {
        const data = await getJobs(searchQuery, source)
        if (active) {
          setJobs(data)
          setResolvedSearchQuery(searchQuery)
          setError('')
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load jobs.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadJobs()

    return () => {
      active = false
    }
  }, [searchQuery, source])

  return { jobs, loading, error, resolvedSearchQuery }
}

export default useFetchJobs
