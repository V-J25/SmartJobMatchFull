import { Link, useLocation, useParams } from 'react-router-dom'
import { useState, useContext } from 'react'
import Navbar from '../components/Navbar.jsx'
import ApplyModal from '../components/ApplyModal.jsx'
import { JobContext } from '../context/jobContextValue.js'
import jobsData from '../data/jobs.js'

const renderList = (items, fallback = 'Not specified') => {
  if (!items?.length) return <p className='mt-2 text-slate-600'>{fallback}</p>
  return (
    <ul className='mt-2 list-disc space-y-1 pl-5 text-slate-700'>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function JobDetails() {
  const { id } = useParams()
  const { state } = useLocation()
  const job = state?.job ?? jobsData.find((item) => String(item.id) === id)
  const { appliedJobs, handleApplyJob } = useContext(JobContext)
  const [showModal, setShowModal] = useState(false)
  
  const isApplied = appliedJobs?.some((item) => item.id === job?.id)
  const isApplyDisabled = isApplied || job?.isExpired

  if (!job) {
    return (
      <div>
        <Navbar />
        <main className='mx-auto max-w-3xl px-4 py-12 text-center'>
          <h1 className='text-3xl font-black'>Job not found</h1>
          <Link to='/jobs' className='mt-6 inline-block rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white'>
            Back to Jobs
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <main className='mx-auto max-w-4xl px-4 py-8'>
        <article className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
          <h1 className='text-3xl font-black'>{job.title}</h1>
          <p className='mt-2 text-lg font-semibold text-slate-700'>{job.company}</p>
          {job.isExpired && (
            <span className='mt-4 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700'>
              No Longer Accepting Applications
            </span>
          )}

          <section className='mt-6'>
            <h2 className='text-lg font-bold'>Job description</h2>
            <p className='mt-2 whitespace-pre-line text-slate-700'>{job.description || 'Not specified'}</p>
          </section>
          <section className='mt-6'>
            <h2 className='text-lg font-bold'>Required skills</h2>
            <p className='mt-2 text-slate-700'>{job.skills?.length ? job.skills.join(', ') : 'Not specified'}</p>
          </section>
          <section className='mt-6'>
            <h2 className='text-lg font-bold'>Qualifications</h2>
            {renderList(job.qualifications)}
          </section>
          <section className='mt-6'>
            <h2 className='text-lg font-bold'>Experience requirements</h2>
            <p className='mt-2 text-slate-700'>{job.experience || 'Not specified'}</p>
          </section>
          <section className='mt-6'>
            <h2 className='text-lg font-bold'>Responsibilities</h2>
            {renderList(job.responsibilities)}
          </section>
          <section className='mt-6'>
            <h2 className='text-lg font-bold'>Employment type</h2>
            <p className='mt-2 text-slate-700'>{job.type || 'Not specified'}</p>
          </section>
          {(job.companyInfo || job.companyWebsite) && (
            <section className='mt-6'>
              <h2 className='text-lg font-bold'>Company information</h2>
              {job.companyInfo && <p className='mt-2 text-slate-700'>{job.companyInfo}</p>}
              {job.companyWebsite && (
                <a href={job.companyWebsite} target='_blank' rel='noreferrer' className='mt-2 inline-block text-sm font-semibold text-blue-700'>
                  Visit company website
                </a>
              )}
            </section>
          )}
          {job.isPlatformJob ? (
            <button
              onClick={() => setShowModal(true)}
              disabled={isApplyDisabled}
              className={`mt-6 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white ${
                isApplyDisabled ? 'cursor-not-allowed bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {job.isExpired ? 'Applications Closed' : isApplied ? 'Applied' : 'Apply Now'}
            </button>
          ) : (
            job.apply_url && (
              <a
                href={job.apply_url}
                target='_blank'
                rel='noreferrer'
                onClick={(event) => {
                  if (job.isExpired) event.preventDefault()
                  else handleApplyJob?.(job)
                }}
                aria-disabled={job.isExpired}
                className={`mt-6 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white ${
                  job.isExpired ? 'cursor-not-allowed bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {job.isExpired ? 'Applications Closed' : isApplied ? 'Applied' : 'Apply on company website'}
              </a>
            )
          )}
        </article>
      </main>

      {showModal && (
        <ApplyModal 
          job={job} 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false)
            handleApplyJob?.(job)
          }} 
        />
      )}
    </div>
  )
}

export default JobDetails
