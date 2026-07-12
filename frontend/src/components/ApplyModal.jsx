import { useState } from 'react'
import { authApi } from '../api/authApi'

function ApplyModal({ job, onClose, onSuccess }) {
  const [resumeUrl, setResumeUrl] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resumeUrl.trim()) {
      setError('LinkedIn URL is required.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const session = await authApi.getSession()
      if (!session) throw new Error('You must be logged in to apply')

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          resume_url: resumeUrl.trim(),
          cover_letter: coverLetter.trim()
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to apply')

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">Apply for {job.title}</h2>
        {error && <p className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
            <input 
              type="url" 
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter (Optional)</label>
            <textarea 
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="4"
              className="w-full rounded-md border border-slate-300 p-2 text-sm"
              placeholder="Why are you a good fit?"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-md border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white disabled:bg-blue-400"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplyModal
