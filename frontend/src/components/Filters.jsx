function Filters({ filters, onChange, onReset, options }) {
  const updateFilter = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <section className='grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4'>
      <input
        type='search'
        placeholder='Search by role, company, or skill'
        value={filters.search}
        onChange={(event) => updateFilter('search', event.target.value)}
        className='rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2'
      />
      {[ 
        ['company', 'All companies', options.companies],
        ['location', 'All locations', options.locations],
        ['type', 'All job types', options.types],
        ['skill', 'All skills', options.skills],
        ['experience', 'All levels', options.experienceLevels],
      ].map(([key, label, values]) => (
        <select
          key={key}
          value={filters[key]}
          onChange={(event) => updateFilter(key, event.target.value)}
          className='rounded-md border border-slate-300 px-3 py-2 text-sm'
        >
          <option value=''>{label}</option>
          {(values ?? []).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ))}
      <select
        value={filters.sort}
        onChange={(event) => updateFilter('sort', event.target.value)}
        className='rounded-md border border-slate-300 px-3 py-2 text-sm'
        aria-label='Sort by posting date'
      >
        <option value='newest'>Newest First</option>
        <option value='oldest'>Oldest First</option>
      </select>
      <button
        type='button'
        onClick={onReset}
        className='rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold'
      >
        Reset
      </button>
    </section>
  )
}

export default Filters
