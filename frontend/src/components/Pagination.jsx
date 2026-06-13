import { useMemo } from 'react'

function Pagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
  maxVisible = 5,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
}) {
  const { start, end, pages } = useMemo(() => {
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return { start, end, pages }
  }, [currentPage, totalPages, maxVisible])

  if (totalPages <= 1) return null

  const activeBtn = 'join-item btn btn-sm text-lightOcre'
  const defaultBtn = 'join-item btn btn-sm'

  return (
    <div className="flex flex-col items-center gap-2 mt-8 mb-16">
      <div className="join" role="navigation" aria-label="Paginación">
        <button
          className={defaultBtn}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          {previousLabel}
        </button>
        {start > 1 && (
          <>
            <button className={defaultBtn} onClick={() => onPageChange(1)} aria-label="Ir a página 1">1</button>
            {start > 2 && <span className="join-item btn btn-sm btn-disabled" aria-hidden="true">...</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            className={p === currentPage ? activeBtn : defaultBtn}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            aria-label={`Ir a página ${p}`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="join-item btn btn-sm btn-disabled" aria-hidden="true">...</span>}
            <button className={defaultBtn} onClick={() => onPageChange(totalPages)} aria-label={`Ir a página ${totalPages}`}>{totalPages}</button>
          </>
        )}
        <button
          className={defaultBtn}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Página siguiente"
        >
          {nextLabel}
        </button>
      </div>
      {typeof total === 'number' && (
        <p className="text-sm text-gray-400">
          Página {currentPage} de {totalPages} ({total} pacientes)
        </p>
      )}
    </div>
  )
}

export default Pagination
