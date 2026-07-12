import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar.jsx'
import Loader from '../../components/Loader.jsx'
import { authApi } from '../../api/authApi'
import { Link } from 'react-router-dom'

function RecruiterJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadJobs = async () => {
      try {
        const session = await authApi.getSession()
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
        const response = await fetch(`${backendUrl}/api/jobs/my`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        const data = await response.json()
        if (active && Array.isArray(data)) {
          setJobs(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadJobs()
    return () => { active = false }
  }, [])

  const handleStatusChange = async (jobId, currentStatus) => {
    const newStatus = currentStatus?.toLowerCase() === 'active' ? 'closed' : 'active'
    try {
      const session = await authApi.getSession()
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      
      setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to completely remove this job? This action cannot be undone.')) return;
    try {
      const session = await authApi.getSession()
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete job')
      
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900">My Posted Jobs</h1>
          <Link to="/recruiter/jobs/post" className="bg-slate-900 text-white px-4 py-2 rounded-md font-bold text-sm">
            + Post New Job
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading jobs..." />
        ) : jobs.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg border border-slate-200">
            <p className="text-slate-600">You haven't posted any jobs yet.</p>
            <Link to="/recruiter/jobs/post" className="mt-4 inline-block text-blue-600 font-bold hover:underline">
              Create your first job post &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${job.status?.toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {job.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{job.location} &bull; {job.employment_type}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/recruiter/jobs/${job.id}/applicants`} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Applicants ({(job.applications && job.applications[0]?.count) || 0})
                  </Link>
                  <button 
                    onClick={() => handleStatusChange(job.id, job.status)}
                    className="px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {job.status?.toLowerCase() === 'active' ? 'Make Inactive' : 'Make Active'}
                  </button>
                  <button 
                    onClick={() => handleDeleteJob(job.id)}
                    className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-semibold hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default RecruiterJobs
