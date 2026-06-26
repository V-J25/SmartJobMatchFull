import { Link } from 'react-router-dom'

function JobCard({
  job,
  handleSaveJob,
  handleApplyJob,
  isSaved = false,
  isApplied = false,
  applicationStatus = '',
  isNew = false,
}) {
  const isApplyDisabled = isApplied || job.isExpired
  const applyLabel =
    job.isExpired
      ? 'Applications Closed'
      : applicationStatus === 'Rejected'
        ? 'Apply Again'
        : isApplied
          ? 'Applied'
          : 'Apply'

  return (
    <article className='flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-xl font-bold'>{job.title}</h2>
          <p className='text-sm font-medium text-slate-600'>{job.company}</p>
        </div>
        <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold'>
          {job.type}
        </span>
      </div>
      <div className='mt-2 flex flex-wrap gap-2'>
        {isNew && (
          <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700'>
            NEW
          </span>
        )}
        {job.isExpired && (
          <span className='rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700'>
            No Longer Accepting Applications
          </span>
        )}
      </div>
      <div className='mt-4 grid gap-1 text-sm text-slate-600'>
        <p>{job.location}</p>
        <p>{job.salary}</p>
        <p>{job.experience}</p>
      </div>
      <div className='mt-4 flex flex-wrap gap-2'>
        {job.skills.map((skill) => (
          <span key={skill} className='rounded-md bg-slate-100 px-2 py-1 text-xs'>
            {skill}
          </span>
        ))}
      </div>
      <div className='mt-auto flex flex-wrap gap-3 pt-5'>
        <button
          type='button'
          onClick={() => handleSaveJob(job)}
          disabled={isSaved}
          className='rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400'
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          type='button'
          onClick={() => handleApplyJob(job)}
          disabled={isApplyDisabled}
          className='rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-emerald-300'
        >
          {applyLabel}
        </button>
        <Link to={`/jobs/${encodeURIComponent(job.id)}`} state={{ job }}>
          <button className='rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold'>
            Details
          </button>
        </Link>
      </div>
    </article>
  )
}

export default JobCard
