function RecordSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="relative">
        <div className="inline-block px-4 py-1.5 text-sm font-display font-medium rounded-t-lg bg-blueSteel/30 text-lightOcre border-t border-x border-blueSteel">
          {title}
        </div>
      </div>
      <div className="bg-blueSteel/30 border border-blueSteel rounded-tr-lg rounded-b-lg p-4 sm:p-6">
        {children}
      </div>
    </section>
  )
}

export default RecordSection
