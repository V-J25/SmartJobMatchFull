import { useContext, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { JobContext } from '../context/jobContextValue.js'

const statuses = ['Applied', 'Interview', 'Offer', 'Rejected']

function Tracker() {
  const { appliedJobs, savedJobs, updateApplicationStatus } = useContext(JobContext)
  const [statusFilter, setStatusFilter] = useState('All')
  const visibleJobs =
    statusFilter === 'All'
      ? appliedJobs
      : appliedJobs.filter((job) => job.status === statusFilter)

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-6xl px-4 py-8'>
        <h1 className='text-3xl font-black'>Placement Tracker</h1>
        <section className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {[
            ['Applied', appliedJobs.filter((job) => job.status === 'Applied').length],
            ['Interview', appliedJobs.filter((job) => job.status === 'Interview').length],
            ['Offer', appliedJobs.filter((job) => job.status === 'Offer').length],
            ['Rejected', appliedJobs.filter((job) => job.status === 'Rejected').length],
            ['Saved', savedJobs.length],
          ].map(([label, value]) => (
            <div key={label} className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
              <p className='text-sm font-semibold text-slate-500'>{label}</p>
              <p className='mt-1 text-3xl font-black'>{value}</p>
            </div>
          ))}
        </section>
        <div className='mt-5 flex flex-wrap gap-2'>
          {['All', ...statuses].map((status) => (
            <button
              type='button'
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                statusFilter === status
                  ? 'bg-slate-950 text-white'
                  : 'border border-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className='mt-6 grid gap-4'>
          {!visibleJobs.length && (
            <div className='rounded-lg border border-slate-200 bg-white p-8 text-center'>
              Apply to jobs first, then manage their status here.
            </div>
          )}
          {visibleJobs.map((job) => (
            <article key={job.id} className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <h2 className='font-bold'>{job.title}</h2>
                  <p className='text-sm text-slate-600'>{job.company}</p>
                </div>
                <select
                  value={job.status}
                  onChange={(event) => updateApplicationStatus(job.id, event.target.value)}
                  className='rounded-md border border-slate-300 px-3 py-2 text-sm'
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Tracker
