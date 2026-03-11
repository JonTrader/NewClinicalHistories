function InputFieldset({ label, onChange, value, id, disabled = false, required = false, type = 'text' }) {
    let styleClass = `input input-sm ${required ? 'validator' : ''}`
    const isTypeTel = type === 'tel'

    const typeTel = (
        <fieldset className="fieldset w-3/4">
            <p className="label">{label}</p>
            <label className="input input-sm">
                <input
                    id={id}
                    disabled={disabled}
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
    )

    const notTypeTel = (
        < fieldset className="fieldset w-3/4" >
            <p className="label">{label}</p>
            <input id={id} disabled={disabled} required={required} type={type} className={styleClass} onChange={onChange} value={value} />
        </fieldset >
    )

    return !isTypeTel ? notTypeTel : typeTel
}

export default InputFieldset


