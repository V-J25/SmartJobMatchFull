import { useContext } from 'react'
import Navbar from '../components/Navbar.jsx'
import { JobContext } from '../context/jobContextValue.js'

function SavedJobs() {
  const { savedJobs, removeSavedJob } = useContext(JobContext)

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-6xl px-4 py-8'>
        <h1 className='mb-6 text-3xl font-black'>Saved Jobs</h1>
        {!savedJobs.length && (
          <div className='rounded-lg border border-slate-200 bg-white p-8 text-center'>
            Save jobs from the Jobs page and they will appear here.
          </div>
        )}
        <div className='grid gap-4 md:grid-cols-2'>
          {savedJobs.map((job) => (
            <article key={job.id} className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
              <h2 className='text-lg font-bold'>{job.title}</h2>
              <p className='text-sm text-slate-600'>{job.company} - {job.location}</p>
              <button
                type='button'
                onClick={() => removeSavedJob(job.id)}
                className='mt-4 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold'
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default SavedJobs
