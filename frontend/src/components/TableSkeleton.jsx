

function TableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <table className="table sm:table-lg table-xs">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th># Id</th>
                        <th>Detalles</th>
                        <th>Odontograma</th>
                        <th>Evolucion</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="mb-2">
                        <th className="skeleton bg-[#1E232Ba1]"></th>
                        <td className="skeleton bg-[#1E232Ba1]"></td>
                        <td className="skeleton bg-[#1E232Ba1]"></td>
                        <td className="skeleton bg-[#1E232Ba1]"></td>
                        <td className="skeleton bg-[#1e232ba1]"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TableSkeleton