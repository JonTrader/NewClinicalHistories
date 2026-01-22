function InputSelect({ label, onChange, children, value='Seleccione', disabled = false }) {
    console.log(value)
    return (
        <fieldset className="fieldset w-3/4" >
            <p className="label">{label}</p>
            <select value={value} disabled={disabled} className="select input-sm" onChange={onChange}>
                <option disabled>Seleccione</option>
                {children}
            </select>
        </fieldset >
    )
}

export default InputSelect


