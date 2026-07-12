import { useState } from 'react'
import Navbar from '../../components/Navbar.jsx'
import { authApi } from '../../api/authApi'
import { useNavigate, Link } from 'react-router-dom'

function PostJob() {
  const [job, setJob] = useState({
    title: '',
    location: '',
    job_type: 'Full Time',
    salary_range: '',
    description: '',
    requirements: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const session = await authApi.getSession()
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(job)
      })
      const data = await response.json()
      if (!response.ok) {
        if (data.error === 'Please create a company profile first') {
          navigate('/recruiter/company')
        }
        throw new Error(data.error || 'Failed to post job')
      }
      navigate('/recruiter/jobs')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    setJob(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900">Post a Job</h1>
          <Link to="/recruiter/dashboard" className="text-sm font-semibold text-slate-600 hover:underline">
            &larr; Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={job.location}
                onChange={handleChange}
                required
                placeholder="e.g. Remote, Bangalore, India"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Job Type</label>
              <select
                name="job_type"
                value={job.job_type}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Salary Range</label>
              <input
                type="text"
                name="salary_range"
                value={job.salary_range}
                onChange={handleChange}
                placeholder="e.g. $100k - $120k"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Job Description</label>
            <textarea
              name="description"
              value={job.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Requirements & Skills</label>
            <textarea
              name="requirements"
              value={job.requirements}
              onChange={handleChange}
              rows="4"
              required
              placeholder="List required skills and experience..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            ></textarea>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving || !job.title}
              className="px-6 py-2 font-bold text-white bg-slate-900 rounded-md disabled:bg-slate-400"
            >
              {saving ? 'Publishing...' : 'Publish Job'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default PostJob
