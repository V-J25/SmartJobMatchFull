import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

function Home() {
  return (
    <div>
      <Navbar />
      <main className='mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:items-center'>
        <section>
          <h1 className='text-4xl font-black leading-tight md:text-6xl'>
            Smart Job Match & Placement Preparation Platform
          </h1>
          <p className='mt-5 max-w-2xl text-lg text-slate-600'>
            Find jobs, track applications, analyze skills, prepare for
            interviews, and get personalized recommendations.
          </p>
          <div className='mt-7 flex flex-wrap gap-3'>
            <Link to='/jobs' className='rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white'>
              Explore Jobs
            </Link>
          </div>
        </section>
        <section className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          {[
            'Personalized recommendations',
            'Application tracker',
            'Interview experiences',
            'LocalStorage progress',
          ].map((item) => (
            <p key={item} className='border-b border-slate-100 py-4 font-semibold last:border-b-0'>
              {item}
            </p>
          ))}
        </section>
      </main>
    </div>
  )
}

export default Home
