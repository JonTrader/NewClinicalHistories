function InputSelect({ label, onChange, children, value='Seleccione', disabled = false }) {
    return (
        <fieldset className="fieldset w-full">
            <legend className="label text-xs font-medium text-lightOcre uppercase tracking-wide mb-1">
                {label}
            </legend>
            <select
                value={value}
                disabled={disabled}
                className="w-full bg-blueDeep text-lightBone border border-blueSteel rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:border-blueSky focus:ring-1 focus:ring-blueSky disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 appearance-none"
                onChange={onChange}
            >
                <option disabled>Seleccione</option>
                {children}
            </select>
        </fieldset>
    )
}

export default InputSelect


