function Pagination({ currentPage, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  const activeBtn = 'join-item btn btn-sm text-lightOcre'
  const defaultBtn = 'join-item btn btn-sm'

  return (
    <div className="flex flex-col items-center gap-2 mt-8 mb-16">
      <div className="join">
        <button
          className={defaultBtn}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>
        {start > 1 && (
          <>
            <button className={defaultBtn} onClick={() => onPageChange(1)}>1</button>
            {start > 2 && <span className="join-item btn btn-sm btn-disabled">...</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            className={p === currentPage ? activeBtn : defaultBtn}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="join-item btn btn-sm btn-disabled">...</span>}
            <button className={defaultBtn} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </>
        )}
        <button
          className={defaultBtn}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
        </button>
      </div>
      <p className="text-sm text-gray-400">
        Página {currentPage} de {totalPages} ({total} pacientes)
      </p>
    </div>
  )
}

export default Pagination
