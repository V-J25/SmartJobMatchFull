// Common skills list to extract skills from job descriptions
const COMMON_SKILLS = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python', 'Java', 'C++',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Finance', 'Excel', 'Marketing', 'Sales',
  'Design', 'Photoshop', 'Figma', 'UI/UX', 'Operations', 'HR', 'Data Science', 'Data Analysis',
  'Tableau', 'PowerBI', 'SEO', 'Communication', 'Recruiting', 'Management'
]

function extractSkillsFromText(text) {
  if (!text) return ['JavaScript', 'HTML']
  const normalized = text.toLowerCase()
  const matched = COMMON_SKILLS.filter((skill) => {
    const escapedSkill = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(^|\\W)${escapedSkill}(?=\\W|$)`, 'i')
    return regex.test(normalized)
  })
  return matched.length ? matched : ['Communication', 'Management']
}

// Rich fallback jobs to support all requested categories offline or without JSearch API key
export const FALLBACK_JOBS = [
  // SOFTWARE
  {
    id: 'f-1',
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Bangalore',
    salary: '15 LPA',
    skills: ['React', 'JavaScript', 'CSS', 'Testing'],
    type: 'Full Time',
    experience: 'Entry Level',
    postedDate: '2026-06-20',
    description: 'Build accessible React interfaces for hiring tools.',
    apply_url: 'https://careers.google.com',
  },
  {
    id: 'f-2',
    title: 'React Intern',
    company: 'Amazon',
    location: 'Hyderabad',
    salary: '35k/month',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'Git'],
    type: 'Internship',
    experience: 'Student',
    postedDate: '2026-06-19',
    description: 'Ship reusable UI components with product mentors.',
    apply_url: 'https://www.amazon.jobs',
  },
  {
    id: 'f-3',
    title: 'Senior Fullstack Engineer',
    company: 'Netflix',
    location: 'Remote',
    salary: '45 LPA',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    type: 'Remote',
    experience: 'Senior Level',
    postedDate: '2026-06-18',
    description: 'Lead architecture of internal dashboard and data-processing tools.',
    apply_url: 'https://jobs.netflix.com',
  },
  // FINANCE
  {
    id: 'f-4',
    title: 'Financial Analyst',
    company: 'JPMorgan Chase',
    location: 'Mumbai',
    salary: '12 LPA',
    skills: ['Finance', 'Excel', 'Data Analysis'],
    type: 'Full Time',
    experience: 'Entry Level',
    postedDate: '2026-06-17',
    description: 'Perform market risk analysis and prepare financial reports using Excel and financial models.',
    apply_url: 'https://careers.jpmorganchase.com',
  },
  {
    id: 'f-5',
    title: 'Portfolio Manager',
    company: 'Goldman Sachs',
    location: 'Bangalore',
    salary: '30 LPA',
    skills: ['Finance', 'Management', 'Data Analysis', 'Python'],
    type: 'Full Time',
    experience: 'Senior Level',
    postedDate: '2026-06-15',
    description: 'Direct investment strategy and lead asset allocation portfolios for high-net-worth clients.',
    apply_url: 'https://www.goldmansachs.com/careers',
  },
  // MARKETING
  {
    id: 'f-6',
    title: 'SEO Specialist',
    company: 'HubSpot',
    location: 'Remote',
    salary: '8 LPA',
    skills: ['Marketing', 'SEO', 'Data Analysis'],
    type: 'Remote',
    experience: 'Entry Level',
    postedDate: '2026-06-20',
    description: 'Execute search engine optimization audits and organic growth strategies for blogs.',
    apply_url: 'https://careers.hubspot.com',
  },
  {
    id: 'f-7',
    title: 'Marketing Manager',
    company: 'Coca-Cola',
    location: 'Delhi',
    salary: '18 LPA',
    skills: ['Marketing', 'Sales', 'Communication', 'Management'],
    type: 'Full Time',
    experience: 'Senior Level',
    postedDate: '2026-06-14',
    description: 'Manage beverage brand campaigns and execute cross-functional regional advertising campaigns.',
    apply_url: 'https://www.coca-colacompany.com/careers',
  },
  // SALES
  {
    id: 'f-8',
    title: 'Sales Associate',
    company: 'Salesforce',
    location: 'Hyderabad',
    salary: '6 LPA',
    skills: ['Sales', 'Communication', 'Excel'],
    type: 'Full Time',
    experience: 'Fresher',
    postedDate: '2026-06-21',
    description: 'Conduct product demonstrations, manage pipeline leads, and drive software license sales.',
    apply_url: 'https://www.salesforce.com/company/careers',
  },
  {
    id: 'f-9',
    title: 'Business Development Intern',
    company: 'Zomato',
    location: 'Gurugram',
    salary: '25k/month',
    skills: ['Sales', 'Communication', 'Management'],
    type: 'Internship',
    experience: 'Student',
    postedDate: '2026-06-20',
    description: 'Engage restaurant partners, evaluate commissions, and drive merchant onboarding campaigns.',
    apply_url: 'https://www.zomato.com/careers',
  },
  // HR
  {
    id: 'f-10',
    title: 'HR Recruiter',
    company: 'TCS',
    location: 'Chennai',
    salary: '5 LPA',
    skills: ['HR', 'Recruiting', 'Communication'],
    type: 'Full Time',
    experience: 'Fresher',
    postedDate: '2026-06-16',
    description: 'Screen resumes, schedule candidate interviews, and coordinate onboarding protocols.',
    apply_url: 'https://www.tcs.com/careers',
  },
  {
    id: 'f-11',
    title: 'HR Director',
    company: 'Microsoft',
    location: 'Noida',
    salary: '32 LPA',
    skills: ['HR', 'Management', 'Communication', 'Recruiting'],
    type: 'Full Time',
    experience: 'Senior Level',
    postedDate: '2026-06-12',
    description: 'Design global employee retention policies, compensation packages, and lead recruiting divisions.',
    apply_url: 'https://careers.microsoft.com',
  },
  // DESIGN
  {
    id: 'f-12',
    title: 'UI/UX Designer',
    company: 'Figma',
    location: 'Remote',
    salary: '20 LPA',
    skills: ['Design', 'Figma', 'UI/UX'],
    type: 'Remote',
    experience: 'Entry Level',
    postedDate: '2026-06-19',
    description: 'Create high-fidelity wireframes and prototype workflows for web features.',
    apply_url: 'https://www.figma.com/careers',
  },
  {
    id: 'f-13',
    title: 'Graphic Designer Intern',
    company: 'Adobe',
    location: 'Bangalore',
    salary: '40k/month',
    skills: ['Design', 'Photoshop', 'Figma'],
    type: 'Internship',
    experience: 'Student',
    postedDate: '2026-06-18',
    description: 'Design visual collateral, logos, and banners using Creative Cloud suite.',
    apply_url: 'https://www.adobe.com/careers.html',
  },
  // DATA SCIENCE & ANALYSIS
  {
    id: 'f-14',
    title: 'Data Analyst',
    company: 'Meta',
    location: 'Remote',
    salary: '22 LPA',
    skills: ['Data Science', 'Data Analysis', 'SQL', 'Tableau'],
    type: 'Remote',
    experience: 'Entry Level',
    postedDate: '2026-06-20',
    description: 'Analyze user behavior data streams, build dashboards, and provide metrics reports.',
    apply_url: 'https://www.metacareers.com',
  },
  {
    id: 'f-15',
    title: 'Data Science Specialist',
    company: 'Apple',
    location: 'Hyderabad',
    salary: '38 LPA',
    skills: ['Data Science', 'Python', 'SQL', 'Management'],
    type: 'Full Time',
    experience: 'Senior Level',
    postedDate: '2026-06-17',
    description: 'Train machine learning models for natural language parsing and voice assistant interfaces.',
    apply_url: 'https://www.apple.com/careers',
  },
  // OPERATIONS
  {
    id: 'f-16',
    title: 'Operations Coordinator',
    company: 'FedEx',
    location: 'Mumbai',
    salary: '7 LPA',
    skills: ['Operations', 'Management', 'Communication'],
    type: 'Full Time',
    experience: 'Entry Level',
    postedDate: '2026-06-15',
    description: 'Streamline logistics routing, manage warehouse inventory levels, and compile performance metrics.',
    apply_url: 'https://careers.fedex.com',
  },
  {
    id: 'f-17',
    title: 'Operations Manager',
    company: 'Uber',
    location: 'Bangalore',
    salary: '25 LPA',
    skills: ['Operations', 'Management', 'Data Analysis'],
    type: 'Full Time',
    experience: 'Senior Level',
    postedDate: '2026-06-14',
    description: 'Oversee city driver-partner onboarding pipelines, supply levels, and market pricing adjustments.',
    apply_url: 'https://www.uber.com/careers',
  },
]

const mapJSearchToJob = (j) => {
  const city = j.job_city || ''
  const state = j.job_state || ''
  const country = j.job_country || ''
  const locationParts = [city, state, country].filter(Boolean)
  const isRemote = j.job_is_remote || false
  const expirationDate =
    j.job_offer_expiration_datetime_utc ||
    (j.job_offer_expiration_timestamp
      ? new Date(j.job_offer_expiration_timestamp * 1000).toISOString()
      : '')
  const status = (j.job_status || '').toLowerCase()
  const isExpired = Boolean(
    j.job_is_expired ||
      status === 'expired' ||
      status === 'closed' ||
      (expirationDate && new Date(expirationDate).getTime() < Date.now()),
  )

  return {
    id: j.job_id || Math.random().toString(),
    title: j.job_title || 'Untitled Position',
    company: j.employer_name || 'Anonymous Employer',
    location: isRemote ? 'Remote' : (locationParts.join(', ') || 'Remote'),
    salary: j.job_min_salary
      ? `${j.job_min_salary} - ${j.job_max_salary} ${j.job_salary_currency}/${j.job_salary_period || 'year'}`
      : 'Competitive Salary',
    skills: j.job_required_skills && j.job_required_skills.length
      ? j.job_required_skills
      : extractSkillsFromText(j.job_description || ''),
    type: j.job_employment_type
      ? (j.job_employment_type.toUpperCase().includes('FULLTIME')
          ? 'Full Time'
          : j.job_employment_type.toUpperCase().includes('INTERN')
            ? 'Internship'
            : j.job_employment_type.toUpperCase().includes('CONTRACTOR')
              ? 'Contract'
              : j.job_employment_type)
      : 'Full Time',
    experience: j.job_required_experience?.required_experience_in_months
      ? `${Math.round(j.job_required_experience.required_experience_in_months / 12)}+ Years`
      : 'Entry Level',
    postedDate: j.job_posted_at_datetime_utc
      ? j.job_posted_at_datetime_utc.split('T')[0]
      : new Date().toISOString().split('T')[0],
    description: j.job_description || '',
    qualifications: Array.isArray(j.job_highlights?.Qualifications)
      ? j.job_highlights.Qualifications
      : j.job_highlights?.Qualifications
        ? [j.job_highlights.Qualifications]
        : [],
    responsibilities: Array.isArray(j.job_highlights?.Responsibilities)
      ? j.job_highlights.Responsibilities
      : j.job_highlights?.Responsibilities
        ? [j.job_highlights.Responsibilities]
        : [],
    companyInfo: j.employer_company_type || '',
    companyWebsite: j.employer_website || '',
    companyLogo: j.employer_logo || '',
    expirationDate,
    isExpired,
    apply_url: j.job_apply_link || '',
  }
}

const deduplicateJobs = (jobs) =>
  Array.from(new Map(jobs.map((job) => [String(job.id), job])).values())

export const jobsApi = {
  async fetchJobs(filters = {}) {
    const queryParts = []

    if (filters.search) {
      queryParts.push(filters.search)
    }

    if (filters.skill) {
      queryParts.push(filters.skill)
    }

    if (filters.location && filters.location.toLowerCase() !== 'remote') {
      queryParts.push(filters.location)
    }

    let query = queryParts.join(' ').trim()
    if (!query) {
      query = 'jobs in India'
    }

    // 1. Try to fetch from backend proxy
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
    const proxyUrl = new URL(`${backendUrl}/api/jobs`)
    if (filters.search) proxyUrl.searchParams.append('search', filters.search)
    if (filters.location) proxyUrl.searchParams.append('location', filters.location)
    if (filters.type) proxyUrl.searchParams.append('type', filters.type)

    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY

    try {
      const response = await fetch(proxyUrl.toString(), {
        method: 'GET',
        headers: rapidApiKey ? { 'x-rapidapi-key': rapidApiKey } : {},
      })
      if (response.ok) {
        const json = await response.json()
        const jobs = deduplicateJobs((json.data || []).map(mapJSearchToJob))
        return this.localFilter(jobs, filters)
      }
      throw new Error(`Proxy returned status ${response.status}`)
    } catch (proxyError) {
      console.warn('Backend proxy fetch failed, attempting direct JSearch request:', proxyError.message)

      // 2. Direct client-side API call fallback (if key is configured on frontend)
      if (!rapidApiKey) {
        throw new Error('JSearch API key is not configured. Add VITE_RAPIDAPI_KEY to frontend/.env.')
      }

      try {
        const url = new URL('https://jsearch.p.rapidapi.com/search')
        url.searchParams.append('query', query)
        url.searchParams.append('page', '1')
        url.searchParams.append('num_pages', '10')

        if (filters.type) {
          const type = filters.type.toLowerCase()
          if (type.includes('full')) url.searchParams.append('employment_types', 'FULLTIME')
          else if (type.includes('part')) url.searchParams.append('employment_types', 'PARTTIME')
          else if (type.includes('intern')) url.searchParams.append('employment_types', 'INTERN')
          else if (type.includes('contract')) url.searchParams.append('employment_types', 'CONTRACTOR')
        }

        if (filters.location && filters.location.toLowerCase() === 'remote') {
          url.searchParams.append('remote_jobs_only', 'true')
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          },
        })

        if (!response.ok) {
          throw new Error(`JSearch returned status ${response.status}`)
        }

        const json = await response.json()
        const jobs = deduplicateJobs((json.data || []).map(mapJSearchToJob))
        return this.localFilter(jobs, filters)
      } catch (directError) {
        throw new Error(`Unable to load live jobs: ${directError.message}`)
      }
    }
  },

  // Finer client-side filtering on JSearch results to ensure precise matching
  localFilter(jobsList, filters) {
    const search = (filters.search || '').trim().toLowerCase()
    const location = (filters.location || '').trim().toLowerCase()
    const type = (filters.type || '').trim().toLowerCase()
    const skill = (filters.skill || '').trim().toLowerCase()
    const experience = (filters.experience || '').trim().toLowerCase()

    return jobsList.filter((job) => {
      const jobTitle = job.title.toLowerCase()
      const jobCompany = job.company.toLowerCase()
      const jobDesc = job.description.toLowerCase()
      const jobLoc = job.location.toLowerCase()
      const jobType = job.type.toLowerCase()
      const jobExp = job.experience.toLowerCase()
      const jobSkills = job.skills.map((s) => s.toLowerCase())

      // 1. Search term (matches title, company, description, or skills)
      if (search) {
        const matchesSearch =
          jobTitle.includes(search) ||
          jobCompany.includes(search) ||
          jobDesc.includes(search) ||
          jobSkills.some((s) => s.includes(search))
        if (!matchesSearch) return false
      }

      // 2. Location filter
      if (location) {
        if (location === 'remote') {
          if (!jobLoc.includes('remote')) return false
        } else {
          if (!jobLoc.includes(location)) return false
        }
      }

      // 3. Employment Type filter
      if (type) {
        if (type.includes('full')) {
          if (!jobType.includes('full')) return false
        } else if (type.includes('intern')) {
          if (!jobType.includes('intern')) return false
        } else if (type.includes('contract')) {
          if (!jobType.includes('contract')) return false
        } else if (type.includes('remote')) {
          if (!jobLoc.includes('remote')) return false
        }
      }

      // 4. Skills filter
      if (skill) {
        if (!jobSkills.includes(skill)) return false
      }

      // 5. Experience level filter
      if (experience) {
        if (experience.includes('student') || experience.includes('fresher') || experience.includes('entry')) {
          if (
            !jobExp.includes('student') &&
            !jobExp.includes('fresher') &&
            !jobExp.includes('entry') &&
            !jobExp.includes('0-1') &&
            !jobExp.includes('0+')
          )
            return false
        } else if (experience.includes('senior')) {
          if (!jobExp.includes('senior') && !jobExp.includes('lead') && !jobExp.includes('5+') && !jobExp.includes('8+'))
            return false
        } else {
          const expNum = experience.replace(/[^0-9]/g, '')
          if (expNum && !jobExp.includes(expNum)) return false
        }
      }

      return true
    })
  },
}
