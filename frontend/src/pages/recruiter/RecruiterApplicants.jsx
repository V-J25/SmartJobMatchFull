import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Loader from '../../components/Loader.jsx'
import { authApi } from '../../api/authApi'

function RecruiterApplicants() {
  const { id } = useParams()
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadApplicants = async () => {
      try {
        const session = await authApi.getSession()
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
        const response = await fetch(`${backendUrl}/api/jobs/${id}/applicants`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        const data = await response.json()
        if (active && Array.isArray(data)) {
          setApplicants(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadApplicants()
    return () => { active = false }
  }, [id])

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900">Job Applicants</h1>
          <Link to="/recruiter/jobs" className="text-sm font-semibold text-slate-600 hover:underline">
            &larr; Back to Jobs
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading applicants..." />
        ) : applicants.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg border border-slate-200">
            <p className="text-slate-600">No applications received yet for this job.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applicants.map(app => (
              <div key={app.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {app.name || 'Anonymous Applicant'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">{app.email}</p>
                    <p className="text-xs text-slate-400 mt-2">Applied on: {new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {app.resume_url && (
                      <a 
                        href={app.resume_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-semibold hover:bg-blue-100"
                      >
                        View LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
                {app.cover_letter && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Cover Letter</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{app.cover_letter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default RecruiterApplicants
