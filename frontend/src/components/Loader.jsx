function Loader({ message = 'Loading...' }) {
  return (
    <div className='flex min-h-40 items-center justify-center'>
      <div className='flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm'>
        <span className='h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950' />
        <span className='text-sm font-medium'>{message}</span>
      </div>
    </div>
  )
}

export default Loader
