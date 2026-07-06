function TableSkeleton() {
    return (
        <div className="mt-8 rounded-lg border border-blueSteel overflow-hidden">
            <table className="table table-xs lg:table-md text-center w-full font-body">
                <thead className="bg-blueDeep text-lightBone text-xs uppercase tracking-wide">
                    <tr>
                        <th className="font-medium py-3">Nombre</th>
                        <th className="font-medium py-3"># ID</th>
                        <th className="font-medium py-3">Detalles</th>
                        <th className="hidden sm:table-cell font-medium py-3">Odontograma</th>
                        <th className="font-medium py-3">Evolución</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-blueSteel">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i}>
                            <td className="py-3"><div className="skeleton h-4 w-24 mx-auto bg-blueDeep-100"></div></td>
                            <td className="py-3"><div className="skeleton h-4 w-20 mx-auto bg-blueDeep-100"></div></td>
                            <td className="py-3"><div className="skeleton h-4 w-16 mx-auto bg-blueDeep-100"></div></td>
                            <td className="hidden sm:table-cell py-3"><div className="skeleton h-4 w-16 mx-auto bg-blueDeep-100"></div></td>
                            <td className="py-3"><div className="skeleton h-4 w-12 mx-auto bg-blueDeep-100"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableSkeleton
