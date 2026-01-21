function InputFieldset({ label, onChange, value, required = false, type = 'text' }) {
    let styleClass = `input input-sm ${required ? 'validator' : ''}`
    const isTypeTel = type === 'tel'

    const returnValue = (!isTypeTel ? (
        < fieldset className="fieldset w-3/4" >
            <p className="label">{label}</p>
            <input required={required} type={type} className={styleClass} onChange={onChange} value={value} />
        </fieldset >
    ) : (
        <fieldset className="fieldset w-3/4">
            <p className="label">{label}</p>
            <label className="input input-sm">
                <input
                    type='tel'
                    className="tabular-nums"
                    placeholder=""
                    pattern="[0-9]*"
                    minLength="1"
                    maxLength="20"
                    onChange={onChange}
                    value={value}
                />
            </label>
        </fieldset>
    ))
    return returnValue
}

export default InputFieldset


