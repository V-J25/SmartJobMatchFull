import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/authContextValue.js'

function Navbar() {
  const { user } = useContext(AuthContext)

  let links = [
    ['/', 'Home'],
    ['/jobs', 'Jobs'],
    ['/login', 'Login'],
    ['/signup', 'Signup'],
  ]

  if (user) {
    if (user.role === 'recruiter') {
      links = [
        ['/recruiter/dashboard', 'Dashboard'],
        ['/recruiter/jobs', 'My Jobs'],
        ['/recruiter/company', 'Company'],
        ['/recruiter/jobs/post', 'Post Job'],
        ['/profile', 'Profile'],
      ]
    } else {
      links = [
        ['/', 'Home'],
        ['/jobs', 'Jobs'],
        ['/dashboard', 'Dashboard'],
        ['/saved', 'Saved'],
        ['/tracker', 'Tracker'],
        ['/profile', 'Profile'],
      ]
    }
  }
  return (
    <nav className='sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 shadow-sm'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3'>
        <NavLink to='/' className='text-lg font-black'>
          SmartJob
        </NavLink>
        <div className='flex flex-wrap gap-1'>
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
