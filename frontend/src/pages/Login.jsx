import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { AuthContext } from '../context/authContextValue.js'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-md px-4 py-12'>
        <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          <h1 className='text-3xl font-black'>Login</h1>
          {error && <p className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>{error}</p>}
          <form onSubmit={handleLogin} className='mt-5 grid gap-4'>
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
              <div className='flex justify-between items-center'>
                <label className='text-xs font-bold uppercase text-slate-500' htmlFor='password'>Password</label>
                <Link to='/forgot-password' className='text-xs font-semibold text-slate-600 hover:text-slate-950 hover:underline'>
                  Forgot Password?
                </Link>
              </div>
              <input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className='mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading || !email.trim() || !password}
              className='mt-2 w-full rounded-md bg-slate-950 px-4 py-2 font-semibold text-white disabled:bg-slate-400 text-sm'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className='mt-4 text-center text-sm text-slate-600'>
            Don't have an account?{' '}
            <Link to='/signup' className='font-bold text-slate-950 hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
