function InputSelect({ label, onChange, children, id, value='Seleccione', disabled = false }) {
    return (
        <fieldset className="fieldset w-3/4" >
            <p className="label">{label}</p>
            <select id={id} value={value} disabled={disabled} className="select input-sm" onChange={onChange}>
                <option disabled>Seleccione</option>
                {children}
            </select>
        </fieldset >
    )
}

export default InputSelect


