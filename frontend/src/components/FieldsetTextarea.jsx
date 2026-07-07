function FieldsetTextarea({ label, text, onChange, size, disabled = false }) {
    return (
        <fieldset className="fieldset w-full">
            {label && (
                <legend className="label text-xs font-medium text-lightOcre uppercase tracking-wide mb-1">
                    {label}
                </legend>
            )}
            <textarea
                disabled={disabled}
                value={text ?? ''}
                className={`w-full min-h-24 bg-blueDeep text-lightBone border border-blueSteel rounded-md px-3 py-2 text-sm font-body placeholder:text-blueSky/50 focus:outline-none focus:border-blueSky focus:ring-1 focus:ring-blueSky disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 resize-y ${size || ''}`}
                onChange={onChange}
            />
        </fieldset>
    )
}

export default FieldsetTextarea