function InputSelect({ label, onChange, children}) {
    return (
        < fieldset className="fieldset w-3/4" >
            <p className="label">{label}</p>
            <select defaultValue="Seleccione" className="select input-sm" onChange={onChange}>
                <option disabled={true}>Seleccione</option>
                {children}
            </select>
        </fieldset >
    )
}

export default InputSelect


