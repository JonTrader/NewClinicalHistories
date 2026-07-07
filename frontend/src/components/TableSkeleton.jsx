function TableSkeleton() {
    return (
        <div className="mt-8 rounded-lg border border-blueSteel overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[16rem] text-center text-sm font-body">
                <thead className="bg-blueDeep text-lightBone text-xs uppercase tracking-wide">
                    <tr>
                        <th className="px-2 sm:px-4 py-3 font-medium text-left whitespace-nowrap">Nombre</th>
                        <th className="hidden sm:table-cell px-2 sm:px-4 py-3 font-medium whitespace-nowrap"># ID</th>
                        <th className="px-2 sm:px-4 py-3 font-medium whitespace-nowrap">
                            <div className="skeleton h-4 w-4 mx-auto sm:hidden bg-blueDeep-100"></div>
                            <span className="hidden sm:inline">Detalles</span>
                        </th>
                        <th className="px-2 sm:px-4 py-3 font-medium whitespace-nowrap">
                            <div className="skeleton h-4 w-4 mx-auto sm:hidden bg-blueDeep-100"></div>
                            <span className="hidden sm:inline">Odontograma</span>
                        </th>
                        <th className="px-2 sm:px-4 py-3 font-medium whitespace-nowrap">
                            <div className="skeleton h-4 w-4 mx-auto sm:hidden bg-blueDeep-100"></div>
                            <span className="hidden sm:inline">Evolución</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-blueSteel">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i}>
                            <td className="px-2 sm:px-4 py-3"><div className="skeleton h-4 w-24 mx-auto sm:mx-0 bg-blueDeep-100"></div></td>
                            <td className="hidden sm:table-cell px-2 sm:px-4 py-3"><div className="skeleton h-4 w-20 mx-auto bg-blueDeep-100"></div></td>
                            <td className="px-2 sm:px-4 py-3"><div className="skeleton h-4 w-4 mx-auto bg-blueDeep-100"></div></td>
                            <td className="px-2 sm:px-4 py-3"><div className="skeleton h-4 w-4 mx-auto bg-blueDeep-100"></div></td>
                            <td className="px-2 sm:px-4 py-3"><div className="skeleton h-4 w-4 mx-auto bg-blueDeep-100"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableSkeleton
