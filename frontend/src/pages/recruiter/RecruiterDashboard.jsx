import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Loader from '../../components/Loader.jsx'
import { authApi } from '../../api/authApi'

function RecruiterDashboard() {
  const [stats, setStats] = useState({ jobs: 0, applicants: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadStats = async () => {
      try {
        const session = await authApi.getSession()
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
        const response = await fetch(`${backendUrl}/api/jobs/my`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        const data = await response.json()
        if (active && Array.isArray(data)) {
          const totalApplicants = data.reduce((acc, job) => acc + (job.applications?.[0]?.count || 0), 0)
          setStats({ jobs: data.length, applicants: totalApplicants })
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadStats()
    return () => { active = false }
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-black text-slate-900">Recruiter Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome to your employer portal. Manage jobs, applicants, and company profile.</p>

        {loading ? (
          <div className="mt-8"><Loader message="Loading dashboard..." /></div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">Active Jobs</h2>
              <p className="text-4xl font-black text-blue-600 mt-2">{stats.jobs}</p>
              <Link to="/recruiter/jobs" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
                View & Manage Jobs &rarr;
              </Link>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">Total Applicants</h2>
              <p className="text-4xl font-black text-emerald-600 mt-2">{stats.applicants}</p>
              <Link to="/recruiter/jobs" className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:underline">
                Select a Job to Review Applicants &rarr;
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/recruiter/jobs/post" className="bg-slate-900 text-white rounded-lg p-4 text-center font-bold hover:bg-slate-800 transition">
            + Post a New Job
          </Link>
          <Link to="/recruiter/company" className="bg-white border border-slate-300 text-slate-800 rounded-lg p-4 text-center font-bold hover:bg-slate-50 transition">
            Manage Company Profile
          </Link>
        </div>
      </main>
    </div>
  )
}

export default RecruiterDashboard
