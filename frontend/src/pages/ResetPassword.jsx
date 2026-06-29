import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Loader from '../components/Loader.jsx'
import { authApi } from '../api/authApi.js'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No reset token provided. Please request a new link.')
      setVerifying(false)
      return
    }

    const checkToken = async () => {
      try {
        const data = await authApi.verifyResetToken(token)
        if (data.valid) {
          setTokenValid(true)
          setEmail(data.email || '')
        } else {
          setError('Invalid or expired reset token. Please request a new link.')
        }
      } catch (err) {
        setError(err.message || 'Invalid or expired reset token. Please request a new link.')
      } finally {
        setVerifying(false)
      }
    }

    checkToken()
  }, [token])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) return

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await authApi.resetPassword(token, password)
      setSuccess('Your password has been successfully reset!')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return <Loader message="Verifying reset link..." />
  }

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-md px-4 py-12'>
        <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          <h1 className='text-3xl font-black'>Set New Password</h1>

          {error && <p className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</p>}
          {success && (
            <div className='mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700'>
              <p className='font-bold'>{success}</p>
              <p className='mt-1 text-xs text-green-600'>Redirecting to login page in 3 seconds...</p>
            </div>
          )}

          {!tokenValid ? (
            <div className='mt-5'>
              <p className='text-sm text-slate-600 mb-4'>
                The password reset link you used is invalid, expired, or has already been used.
              </p>
              <Link
                to='/forgot-password'
                className='block w-full rounded-md bg-slate-950 px-4 py-2 text-center font-semibold text-white text-sm hover:bg-slate-800'
              >
                Request a New Reset Link
              </Link>
            </div>
          ) : (
            !success && (
              <form onSubmit={handleResetPassword} className='mt-5 grid gap-4'>
                {email && (
                  <div>
                    <label className='text-xs font-bold uppercase text-slate-400'>Resetting Password For</label>
                    <input
                      type='text'
                      value={email}
                      disabled
                      className='mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed'
                    />
                  </div>
                )}
                <div>
                  <label className='text-xs font-bold uppercase text-slate-500' htmlFor='password'>New Password</label>
                  <input
                    id='password'
                    type='password'
                    placeholder='Enter new password (min 6 chars)'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className='text-xs font-bold uppercase text-slate-500' htmlFor='confirmPassword'>Confirm Password</label>
                  <input
                    id='confirmPassword'
                    type='password'
                    placeholder='Confirm your new password'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type='submit'
                  disabled={loading || !password || !confirmPassword}
                  className='mt-2 w-full rounded-md bg-slate-950 px-4 py-2 font-semibold text-white disabled:bg-slate-400 text-sm cursor-pointer'
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )
          )}
          
          <div className='mt-4 text-center text-sm'>
            <Link to='/login' className='font-bold text-slate-950 hover:underline'>
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResetPassword
