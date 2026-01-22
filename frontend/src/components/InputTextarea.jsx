function InputTextarea({ label, text, onChange, size, disabled = false }) {
    let styleClass = `textarea ${size}`
    return (
        <fieldset className="fieldset">
            <div className="label">{label}</div>
            <textarea disabled={disabled} defaultValue={text} className={styleClass} onChange={onChange}></textarea>
        </fieldset>
    )
}

export default InputTextarea