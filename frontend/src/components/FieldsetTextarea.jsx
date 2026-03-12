function InputTextarea({ label, text, id, onChange, size, disabled = false }) {
    let styleClass = `textarea ${size}`
    return (
        <fieldset className="fieldset">
            <div className="label">{label}</div>
            <textarea id={id} disabled={disabled} defaultValue={text} className={styleClass} onChange={onChange}></textarea>
        </fieldset>
    )
}

export default InputTextarea