import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

function Home() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main className='mx-auto max-w-7xl px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28'>
        <div className="text-center">
          <h1 className='text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl'>
            <span className="block">Find your next</span>
            <span className="block text-blue-600">dream career today.</span>
          </h1>
          <p className='mt-6 mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl'>
            Join thousands of professionals finding great jobs, tracking their applications, and connecting with top-tier companies.
          </p>
          <div className='mt-10 flex justify-center gap-4'>
            <Link to='/jobs' className='rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200'>
              Find Jobs
            </Link>
            <Link to='/signup' className='rounded-full bg-white border border-slate-200 px-8 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50 transition-colors shadow-sm'>
              Post a Job
            </Link>
          </div>
        </div>
      </main>

      {/* Stats/Features Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-black text-blue-600 mb-2">10k+</div>
              <div className="text-lg font-semibold text-slate-900">Active Jobs</div>
              <p className="text-slate-500 mt-2">New opportunities added daily from top tech companies.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-blue-600 mb-2">500+</div>
              <div className="text-lg font-semibold text-slate-900">Hiring Companies</div>
              <p className="text-slate-500 mt-2">Startups to enterprise, find employers that match your vibe.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-blue-600 mb-2">Smart</div>
              <div className="text-lg font-semibold text-slate-900">Application Tracking</div>
              <p className="text-slate-500 mt-2">Manage your pipeline, track statuses, and ace your interviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Are you hiring?</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Connect with millions of talented professionals eager to make an impact at your company.
          </p>
          <Link to='/signup' className="rounded-full bg-white px-8 py-3 text-base font-bold text-slate-900 hover:bg-slate-100 transition-colors">
            Start Hiring Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
