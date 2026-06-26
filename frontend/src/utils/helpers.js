export function getUniqueValues(items, key) {
  return [...new Set(items.flatMap((item) => item[key] ?? []))].sort()
}

export function filterJobs(jobs, filters) {
  const search = filters.search.trim().toLowerCase()

  const filteredJobs = jobs.filter((job) => {
    const skills = Array.isArray(job.skills) ? job.skills : []
    const searchableText = [
      job.title,
      job.company,
      job.location,
      job.type,
      job.experience,
      ...skills,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return (
      (!search || searchableText.includes(search)) &&
      (!filters.company || job.company === filters.company) &&
      (!filters.location || job.location === filters.location) &&
      (!filters.type || job.type === filters.type) &&
      (!filters.skill || skills.includes(filters.skill)) &&
      (!filters.experience || job.experience === filters.experience)
    )
  })

  return filteredJobs.sort((a, b) => {
    const aTime = new Date(a.postedDate || 0).getTime()
    const bTime = new Date(b.postedDate || 0).getTime()
    return filters.sort === 'oldest' ? aTime - bTime : bTime - aTime
  })
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
