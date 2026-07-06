function FieldsetInput({ label, onChange, value, disabled = false, required = false, type = 'text' }) {
    const isTel = type === 'tel'
    const inputClasses = [
        'w-full',
        'bg-blueDeep',
        'text-lightBone',
        'border',
        'border-blueSteel',
        'rounded-md',
        'px-3',
        'py-2',
        'text-sm',
        'font-body',
        'placeholder:text-blueSky/50',
        'focus:outline-none',
        'focus:border-blueSky',
        'focus:ring-1',
        'focus:ring-blueSky',
        'disabled:opacity-60',
        'disabled:cursor-not-allowed',
        'transition-colors',
        'duration-150',
        isTel ? 'tabular-nums' : ''
    ].join(' ')

    return (
        <fieldset className="fieldset w-full">
            <legend className="label text-xs font-medium text-lightOcre uppercase tracking-wide mb-1">
                {label}
                {required && <span className="text-lightOcre ml-0.5">*</span>}
            </legend>
            <input
                disabled={disabled}
                required={required}
                type={isTel ? 'tel' : type}
                pattern={isTel ? '[0-9]*' : undefined}
                minLength={isTel ? 1 : undefined}
                maxLength={isTel ? 20 : undefined}
                className={inputClasses}
                onChange={onChange}
                value={value}
                aria-required={required}
            />
        </fieldset>
    )
}

export default FieldsetInput


