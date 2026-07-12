import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { AuthContext } from '../context/authContextValue.js'

function Profile() {
  const { user, logout, updateProfile } = useContext(AuthContext)
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [skillInput, setSkillInput] = useState('')
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || [])
  const [designation, setDesignation] = useState(user?.role === 'recruiter' ? (user?.skills?.[0] || '') : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleAddSkill = (e) => {
    e.preventDefault()
    const cleanSkill = skillInput.trim()
    if (cleanSkill && !selectedSkills.includes(cleanSkill)) {
      setSelectedSkills([...selectedSkills, cleanSkill])
    }
    setSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setError('')
    setSuccessMsg('')
    try {
      const finalSkills = user?.role === 'recruiter' 
        ? (designation.trim() ? [designation.trim()] : []) 
        : selectedSkills;
      await updateProfile(name.trim(), finalSkills)
      setSuccessMsg('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-3xl px-4 py-8'>
        <h1 className='text-3xl font-black'>User Profile</h1>
        <form onSubmit={handleSubmit} className='mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          {error && <p className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</p>}
          {successMsg && <p className='mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700'>{successMsg}</p>}

          <label className='text-sm font-semibold' htmlFor='name'>Name</label>
          <input
            id='name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            className='mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
            required
          />

          {user?.role === 'recruiter' ? (
            <>
              <p className='mt-5 text-sm font-semibold'>Designation</p>
              <input
                type='text'
                placeholder='e.g. HR Manager, Talent Acquisition Specialist'
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className='mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
              />
            </>
          ) : (
            <>
              <p className='mt-5 text-sm font-semibold'>Skills</p>
              <div className='mt-2 flex gap-2'>
                <input
                  type='text'
                  placeholder='Type a skill and press Enter (e.g. React, Node.js)'
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill(e)
                    }
                  }}
                  className='flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm'
                />
                <button
                  type='button'
                  onClick={handleAddSkill}
                  className='rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white'
                >
                  Add
                </button>
              </div>

              <div className='mt-3 flex flex-wrap gap-2'>
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className='inline-flex items-center gap-1 rounded-md bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white'
                  >
                    {skill}
                    <button
                      type='button'
                      onClick={() => handleRemoveSkill(skill)}
                      className='ml-1 text-slate-300 hover:text-white font-bold text-xs'
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {!selectedSkills.length && (
                  <p className='text-sm text-slate-500 italic'>No skills added yet.</p>
                )}
              </div>
            </>
          )}

          <div className='mt-6 flex gap-3'>
            <button
              type='submit'
              disabled={saving}
              className='rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400'
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type='button'
              onClick={handleLogout}
              className='rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold'
            >
              Logout
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Profile
