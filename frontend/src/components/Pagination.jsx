function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
}) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className='mt-6 flex flex-wrap justify-center gap-2'>
      <button
        type='button'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className='rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-40'
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            type='button'
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-md text-sm font-semibold ${
              page === currentPage
                ? 'bg-slate-950 text-white'
                : 'border border-slate-300'
            }`}
          >
            {page}
          </button>
        ),
      )}
      <button
        type='button'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className='rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-40'
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
