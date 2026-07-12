import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { authApi } from '../api/authApi.js'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await authApi.forgotPassword(email.trim())
      setSuccess('If the email is registered, a password reset link has been sent.')
      setEmail('')
    } catch (err) {
      setError(err.message || 'Failed to request password reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-md px-4 py-12'>
        <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          <h1 className='text-3xl font-black'>Reset Password</h1>
          <p className='mt-2 text-sm text-slate-600'>
            Enter your registered email address below, and we will send you instructions to reset your password.
          </p>

          {error && <p className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</p>}
          {success && <p className='mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700'>{success}</p>}

          <form onSubmit={handleForgotPassword} className='mt-5 grid gap-4'>
            <div>
              <label className='text-xs font-bold uppercase text-slate-500' htmlFor='email'>Email</label>
              <input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading || !email.trim()}
              className='mt-2 w-full rounded-md bg-slate-950 px-4 py-2 font-semibold text-white disabled:bg-slate-400 text-sm cursor-pointer'
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
          <p className='mt-4 text-center text-sm text-slate-600'>
            Remembered your password?{' '}
            <Link to='/login' className='font-bold text-slate-950 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword
