import { useMemo, useState } from 'react'

function usePagination(data = [], itemsPerPage = 4) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const currentData = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  }, [data, itemsPerPage, safeCurrentPage])

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return {
    currentData,
    currentPage: safeCurrentPage,
    totalPages,
    goToPage,
    hasNextPage: safeCurrentPage < totalPages,
    hasPreviousPage: safeCurrentPage > 1,
  }
}

export default usePagination
