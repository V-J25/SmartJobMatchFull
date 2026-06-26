import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { AuthContext } from '../context/authContextValue.js'

function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSignup = async (event) => {
    event.preventDefault()
    if (!fullName.trim() || !email.trim() || !password) return

    setLoading(true)
    setError('')
    try {
      await signup(email.trim(), password, fullName.trim())
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-md px-4 py-12'>
        <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          <h1 className='text-3xl font-black'>Create Account</h1>
          {error && <p className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</p>}
          <form onSubmit={handleSignup} className='mt-5 grid gap-4'>
            <div>
              <label className='text-xs font-bold uppercase text-slate-500' htmlFor='fullName'>Full Name</label>
              <input
                id='fullName'
                type='text'
                placeholder='Enter your full name'
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                required
              />
            </div>
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
            <div>
              <label className='text-xs font-bold uppercase text-slate-500' htmlFor='password'>Password</label>
              <input
                id='password'
                type='password'
                placeholder='Enter a password (min 6 chars)'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                required
                minLength={6}
              />
            </div>
            <button
              type='submit'
              disabled={loading || !fullName.trim() || !email.trim() || !password}
              className='mt-2 w-full rounded-md bg-slate-950 px-4 py-2 font-semibold text-white disabled:bg-slate-400 text-sm'
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <p className='mt-4 text-center text-sm text-slate-600'>
            Already have an account?{' '}
            <Link to='/login' className='font-bold text-slate-950 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Signup
