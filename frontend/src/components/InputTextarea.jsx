function InputTextarea({ label, text, onChange, size }) {
    let styleClass = `textarea ${size}`
    return (
        <fieldset className="fieldset">
            <div className="label">{label}</div>
            <textarea defaultValue={text} className={styleClass} onChange={onChange}></textarea>
        </fieldset>
    )
}

export default InputTextarea