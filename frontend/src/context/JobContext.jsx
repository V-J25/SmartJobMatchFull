import { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import { AuthContext } from './authContextValue'
import { JobContext } from './jobContextValue'
import { savedJobsApi } from '../api/savedJobsApi'
import { trackerApi } from '../api/trackerApi'

function JobProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [savedJobs, setSavedJobs] = useState([])
  const [tracker, setTracker] = useState({
    applied: [],
    interview: [],
    offer: [],
    rejected: [],
  })
  const [loading, setLoading] = useState(false)

  // Fetch data from database when user is set/authenticated
  useEffect(() => {
    if (!user) {
      setSavedJobs([])
      setTracker({
        applied: [],
        interview: [],
        offer: [],
        rejected: [],
      })
      return
    }

    let active = true
    const loadUserData = async () => {
      setLoading(true)
      try {
        const [dbSavedJobs, dbTracker] = await Promise.all([
          savedJobsApi.getSavedJobs(user.id),
          trackerApi.getTracker(user.id),
        ])

        if (active) {
          setSavedJobs(dbSavedJobs)
          setTracker({
            applied: dbTracker.applied || [],
            interview: dbTracker.interview || [],
            offer: dbTracker.offer || [],
            rejected: dbTracker.rejected || [],
          })
        }
      } catch (err) {
        console.error('Failed to load user data from database:', err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadUserData()

    return () => {
      active = false
    }
  }, [user])

  // Combine the individual status arrays in the database record into a single appliedJobs array for the UI
  const appliedJobs = useMemo(() => {
    return [
      ...(tracker.applied || []).map((j) => ({ ...j, status: 'Applied' })),
      ...(tracker.interview || []).map((j) => ({ ...j, status: 'Interview' })),
      ...(tracker.offer || []).map((j) => ({ ...j, status: 'Offer' })),
      ...(tracker.rejected || []).map((j) => ({ ...j, status: 'Rejected' })),
    ]
  }, [tracker])

  const saveJob = useCallback(
    async (job) => {
      if (!user) return
      try {
        const saved = await savedJobsApi.saveJob(user.id, job)
        if (saved) {
          setSavedJobs((current) => [
            ...current,
            {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location || '',
              apply_url: job.apply_url || job.applyUrl || '',
            },
          ])
        }
      } catch (err) {
        console.error('Failed to save job:', err)
      }
    },
    [user],
  )

  const removeSavedJob = useCallback(
    async (jobId) => {
      if (!user) return
      const removedIndex = savedJobs.findIndex((job) => String(job.id) === String(jobId))
      const removedJob = removedIndex >= 0 ? savedJobs[removedIndex] : null

      setSavedJobs((current) =>
        current.filter((job) => String(job.id) !== String(jobId)),
      )

      try {
        await savedJobsApi.removeSavedJob(user.id, jobId)
      } catch (err) {
        console.error('Failed to remove saved job:', err)
        if (removedJob) {
          setSavedJobs((current) => {
            if (current.some((job) => String(job.id) === String(jobId))) return current
            const restored = [...current]
            restored.splice(Math.max(removedIndex, 0), 0, removedJob)
            return restored
          })
        }
      }
    },
    [user, savedJobs],
  )

  const updateApplicationStatus = useCallback(
    async (jobId, newStatus) => {
      if (!user) return
      try {
        let jobToMove = null
        const cleanTracker = {
          applied: (tracker.applied || []).filter((j) => {
            if (j.id === jobId) {
              jobToMove = j
              return false
            }
            return true
          }),
          interview: (tracker.interview || []).filter((j) => {
            if (j.id === jobId) {
              jobToMove = j
              return false
            }
            return true
          }),
          offer: (tracker.offer || []).filter((j) => {
            if (j.id === jobId) {
              jobToMove = j
              return false
            }
            return true
          }),
          rejected: (tracker.rejected || []).filter((j) => {
            if (j.id === jobId) {
              jobToMove = j
              return false
            }
            return true
          }),
        }

        if (!jobToMove) return

        const targetKey = newStatus.toLowerCase()
        if (cleanTracker[targetKey]) {
          cleanTracker[targetKey].push(jobToMove)
        }

        await trackerApi.updateTracker(user.id, cleanTracker)
        setTracker(cleanTracker)
      } catch (err) {
        console.error('Failed to update application status:', err)
      }
    },
    [user, tracker],
  )

  const applyJob = useCallback(
    async (job) => {
      const url = job.apply_url || job.applyUrl || ''
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }

      if (!user) return

      try {
        // Check if job is already tracked
        const allTrackerJobs = [
          ...(tracker.applied || []),
          ...(tracker.interview || []),
          ...(tracker.offer || []),
          ...(tracker.rejected || []),
        ]
        const existing = allTrackerJobs.find((j) => j.id === job.id)

        if (existing) {
          // If previously marked as Rejected, apply again resets it to Applied
          if (existing.status === 'Rejected') {
            await updateApplicationStatus(job.id, 'Applied')
          }
          return
        }

        const updatedTracker = {
          ...tracker,
          applied: [
            ...(tracker.applied || []),
            {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location || '',
              apply_url: url,
              skills: job.skills || [],
              type: job.type || '',
              experience: job.experience || '',
            },
          ],
        }

        await trackerApi.updateTracker(user.id, updatedTracker)
        setTracker(updatedTracker)
      } catch (err) {
        console.error('Failed to register job application:', err)
      }
    },
    [user, tracker, updateApplicationStatus],
  )

  const value = useMemo(
    () => ({
      savedJobs,
      appliedJobs,
      loading,
      saveJob,
      applyJob,
      removeSavedJob,
      updateApplicationStatus,
    }),
    [
      savedJobs,
      appliedJobs,
      loading,
      saveJob,
      applyJob,
      removeSavedJob,
      updateApplicationStatus,
    ],
  )

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}

export default JobProvider
