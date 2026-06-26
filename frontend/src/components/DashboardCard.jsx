function DashboardCard({ title, value, description }) {
  return (
    <article className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
      <h2 className='text-sm font-medium text-slate-500'>{title}</h2>
      <p className='text-3xl font-bold'>{value}</p>
      {description && <p className='mt-2 text-sm text-slate-500'>{description}</p>}
    </article>
  )
}

export default DashboardCard
