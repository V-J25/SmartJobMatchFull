import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar.jsx'
import Loader from '../../components/Loader.jsx'
import { authApi } from '../../api/authApi'
import { useNavigate } from 'react-router-dom'

function RecruiterCompany() {
  const [company, setCompany] = useState({ name: '', website: '', description: '', logo_url: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const loadCompany = async () => {
      try {
        const session = await authApi.getSession()
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
        const response = await fetch(`${backendUrl}/api/companies/my`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        const data = await response.json()
        if (active && data) {
          setCompany({
            name: data.name || '',
            website: data.website || '',
            description: data.description || '',
            logo_url: data.logo_url || ''
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCompany()
    return () => { active = false }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const session = await authApi.getSession()
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(company)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save company profile')
      setSuccess('Company profile saved successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    setCompany(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-black text-slate-900">Company Profile</h1>
        <p className="mt-2 text-slate-600 mb-6">Complete your company profile to start posting jobs.</p>

        {loading ? (
          <Loader message="Loading profile..." />
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}
            {success && <div className="bg-emerald-50 text-emerald-700 p-3 rounded text-sm">{success}</div>}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Website URL</label>
              <input
                type="url"
                name="website"
                value={company.website}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Logo URL</label>
              <input
                type="url"
                name="logo_url"
                value={company.logo_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={company.description}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              ></textarea>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/recruiter/dashboard')}
                className="px-4 py-2 font-semibold text-slate-600 rounded-md border border-slate-300"
              >
                Back to Dashboard
              </button>
              <button
                type="submit"
                disabled={saving || !company.name}
                className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md disabled:bg-blue-400"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default RecruiterCompany
