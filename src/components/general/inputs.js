import { formatValue } from "../general/supportFunctions";

const styles = {
  standard: {display: "flex", flexDirection: "column", gap: "5px"},
  noLabel: {display: "flex", flexDirection: "column"},
  inLine: {display: "flex", flexDirection: "row", gap: "3px"},
  inLineSmall: {display: "flex", flexDirection: "row", gap: "10px", fontSize: "12pt", fontWeight: "bold"}
}
const defaultClass = "text-bubble dark text-content"
// Basic
function BasicInput ({label, value, setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type={"text"} className={className} value={value} onChange={(e) => setFunc(e.target.value)}/>
    </div>
  )
}
function BasicInputKey ({name, label, value,  setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type={"text"} className={className} value={value} onChange={(e) => setFunc(name, e.target.value)}/>
    </div>
  )
}
function BasicInputIndex ({index, value, label , setFunc, className = defaultClass, labelStyle= "standard"}) {

  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input className={className} placeholder="0" value={value} onChange={(e) => setFunc(index, e.target.value)}/>
    </div>
  )
}
function BasicInputParams ({params, value, label , setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input className={className} placeholder="0" value={value} onChange={(e) => setFunc(params, e.target.value)}/>
    </div>
  )
}
// Basic number input
function NumberInput ({label, value, setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type="number" style={{textAlign: "right"}}  className={className} value={value} onChange={(e) => setFunc(parseFloat(e.target.value))}/>
    </div>
  )
}
function NumberInputKey ({name, label, value,  setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type="number" className={className} value={value} onChange={(e) => setFunc(name, parseFloat(e.target.value))}/>
    </div>
  )
}
function NumberInputIndex ({index, value, label , setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type="number" className={className} value={value} onChange={(e) => setFunc(index, parseFloat(e.target.value))}/>
    </div>
  )
}
function NumberInputParams ({params, value, label , setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type="number" className={className} value={value} onChange={(e) => setFunc(params, parseFloat(e.target.value))}/>
    </div>
  )
}
function PasswordInput ({label, value, setFunc, className = defaultClass, labelStyle= "standard"}) {
  return(  
    <div style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type="password"  style={{textAlign: "right"}}  className={className} value={value} 
      onChange={(e) => setFunc(e.target.value)}/>
    </div>
  )
}
// Text Area
function TextAreaInput ({name, label, value, setFunc, rows}) {
  const textRows = rows || 3
  return(  
    <div className={name} style={{display: "flex", flexDirection: "column", gap: "5px"}}>
      <label htmlFor={`input-${name}`}>{label}</label>
      <textarea className={defaultClass} id={`input-${name}`} rows={textRows} placeholder="-" value={value} 
      onChange={(e) => setFunc(e.target.value)}/>
    </div>
  )
}
function TextAreaInputKey ({name, description, value, setFunc, rows}) {
  const textRows = rows || 3
  return(  
    <div className={name} style={{display: "flex", flexDirection: "column", gap: "5px"}}>
      <label htmlFor={`input-${name}`}>{description}</label>
      <textarea className={defaultClass} id={`input-${name}`} rows={textRows} placeholder="-" value={value} 
      onChange={(e) => setFunc(name, e.target.value)}/>
    </div>
  )
}

// Split into Simple increment KEY and simple increment
function SimpleIncrement ({className, title, value, setFunct, increment, color} ) {
  const layout = {display: "grid", gridTemplateColumns: "1fr auto 30px auto", gap: "5px"}
  return (
  <div className={className} onClick={(e)=> e.stopPropagation()}>
    <div className={`box-section outline ${color}`} style={layout}>
      <div>{title}</div>  
      <div className={`btn-round-sm ${color}`} onClick={((e)=> setFunct(className, Math.max(value-increment,0), e))}>
        <div className="btn-round-sm-text">-</div>
      </div>
      <div className="value">{value}</div>
      <div className={`btn-round-sm ${color}`} onClick={((e)=> setFunct(className, value+increment, e))}>
        <div className="btn-round-sm-text">+</div>
      </div>
    </div>
  </div>
  )
}
function SimpleIncrementIndex ({index, title, value, setFunct, increment, color} ) {
  const layout = {display: "grid", gridTemplateColumns: "1fr auto 30px auto", gap: "5px"}
  return (
  <div onClick={(e)=> e.stopPropagation()}>
    <div className={`box-section outline ${color}`} style={layout}>
      <div>{title}</div>  
      <div className={`btn-round-sm ${color}`} onClick={((e)=> setFunct(index, Math.max(value-increment,0), e))}>
        <div className="btn-round-sm-text">-</div>
      </div>
      <div className="value">{value}</div>
      <div className={`btn-round-sm ${color}`} onClick={((e)=> setFunct(index, value+increment, e))}>
        <div className="btn-round-sm-text">+</div>
      </div>
    </div>
  </div>
  )
}

// Date Selection
function DateSelection ({label, value, setFunct, hideLabel} ) {
  return(  
    <div onClick={(e)=> e.stopPropagation()}>
      {hideLabel? <div></div> : <label>{label}</label>}
      <input className="text-bubble small" type="date" placeholder="-" value={value} onChange={(e) => setFunct(e.target.value)}/>
    </div>
  )
}
function DateSelectionIndex ({index, label, value, setFunct, hideLabel} ) {
  return(  
    <div onClick={(e)=> e.stopPropagation()}>
      {hideLabel? <div></div> : <label>{label}</label>}
      <input className="text-bubble small" type="date" placeholder="-" value={value} onChange={(e) => setFunct(index, label ,e.target.value)}/>
    </div>
  )
}
function DateSelectionKey ({name, label, value, setFunct} ) {
  return(  
    <div onClick={(e)=> e.stopPropagation()}>
      {label? <label>{label}</label> : <div></div>}
      <input className="text-bubble small" type="date" placeholder="-" value={value} onChange={(e) => setFunct(name, e.target.value)}/>
    </div>
  )
}

// Dropdown
function ValueSelectionDrop ({label, current, valueArray, selectFunc, className='text-bubble dark bold', 
labelStyle = "standard", hiddenValues = [], disabled = false}) {
  if (!current && selectFunc) selectFunc(valueArray[0])
  return (
    <div  style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <select className={className} name="selector" value={current} onChange={(e)=> selectFunc(e.target.value)} disabled={disabled}>
        {valueArray.map((value) => 
          <option className="bold" value={value} key={value} hidden={hiddenValues.includes(value)}>{value}</option> 
        )}
      </select>
    </div>
  )
}
function ValueSelectionDropKey (
  {label, name, current, valueArray, selectFunc, className='text-bubble dark', labelStyle = "standard", hiddenValues = [], disabled = false}
) {
  return (
    <div  style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <select className={className} name="selector" value={current} onChange={(e)=> selectFunc(name, e.target.value)} disabled={disabled}>
        {valueArray.map((value) => <option value={value} key={value} hidden={hiddenValues.includes(value)}>{value}</option> )}
      </select>
    </div>
  )
}

// Slider
function ValueSlider ({label, min, max, value, selectFunct, labelStyle= "standard", prefix="", suffix=""}) {
  // const layout = vertical? {display: "grid", gridTemplateRows: "auto auto", gap: "3px"} : {display: "grid", gridTemplateColumns: "75px 1fr", gap: "3px"}
  const sliderLayout = {display: "grid", gridTemplateColumns: "30px 1fr 30px 50px", gap: "3px"}
  return (
    <div  style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <div className="slidecontainer" style={sliderLayout}>
        <div style={{textAlign: "right"}}>{`${prefix || ""}${min}${suffix || ""}`}</div>
        <input type="range" min={min || 0} max={max || 100} value={value} className="slider" id="myRange"
        onChange={(e)=> selectFunct(e.target.value)} />
       <div>{`${prefix || ""}${max}${suffix || ""}`}</div>
       <div className='text-bubble' style={{textAlign: "center"}}>{`${prefix || ""}${value}${suffix || ""}`}</div>
      </div>
    </div>
  )
}
function ValueSliderKey ({label, varName, min, max, value, selectFunct, vertical, prefix, suffix}) {
  const layout = vertical? {display: "grid", gridTemplateRows: "auto auto", gap: "3px"} : {display: "grid", gridTemplateColumns: "75px 1fr", gap: "3px"}
  const sliderLayout = {display: "grid", gridTemplateColumns: "30px 1fr 30px 50px", gap: "3px"}
  return (
    <div style={layout}>
      <div className='label'>{label}</div>
      <div className="slidecontainer" style={sliderLayout}>
        <div style={{textAlign: "right"}}>{`${prefix || ""}${min}${suffix || ""}`}</div>
        <input type="range" min={min || 0} max={max || 100} value={value} className="slider" id="myRange"
        onChange={(e)=> selectFunct(varName, e.target.value)} />
       <div>{`${prefix || ""}${max}${suffix || ""}`}</div>
       <div className='text-bubble' style={{textAlign: "center"}}>{`${prefix || ""}${value}${suffix || ""}`}</div>
      </div>
    </div>
  )
}

// Checkbox
// Use Checked for manual control of "Check" status, don't use otherwaise for automatic checking / unchecking
function SimpleCheckbox ({label, value, setFunct, checked = false, defaultChecked = false, labelStyle = "inLine"}) {
  return(  
    <div onClick={(e)=> e.stopPropagation()} style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      {checked? 
        <input type="checkbox" checked={checked} defaultChecked={checked || false} onChange={(e) => setFunct(e.target.checked, value)}/>
        : <input type="checkbox" defaultChecked={defaultChecked} onChange={(e) => setFunct(e.target.checked, value)}/>
      }
    </div>
  )
}
function SimpleCheckboxKey ({varName, label, value, setFunct, checked = false,  labelStyle = "inLine"}) {
  return(  
    <div onClick={(e)=> e.stopPropagation()} style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input type="checkbox" checked={checked} value={value} defaultChecked={checked} onChange={(e) => setFunct(varName ,e.target.value, e.target.checked)}/>
    </div>
  )
}
function SimpleCheckboxIndex ({index, label, value, setFunct, labelStyle = "inLine"}) {
  return(  
    <div onClick={(e)=> e.stopPropagation()}  style={label? styles[labelStyle] : styles["noLabel"]}>
      {label? <label>{label}</label> : <div></div>}
      <input className="text-bubble small" type="checkbox" value={value} onChange={(e) => setFunct(index ,e.target.value, e.target.checked)}/>
    </div>
  )
}


// TBD
function ActionIncrement ({className, title, value, setFunct, increment, format} ) {
  return (
  <div className={className}>
    <div className="action">
      <div>{title}</div>  
      <div className="increment" onClick={(()=> setFunct(Math.max(value-increment,0)))}>-</div>
      <div className="value">{formatValue(value,format)}</div>
      <div className="increment" onClick={(()=> setFunct(value+increment))}>+</div>
    </div>
  </div>
  )
}
function ParameterIncrement ({className, title, value, setFunct, increment, children} ) {
  return (
  <div className={className}>
    <div className="parameter">
      <div>{title}</div>  
      <div className="increment" onClick={(()=> setFunct(Math.max(value-increment,0)))}>-</div>
      <div className="value">{children}</div>
      <div className="increment" onClick={(()=> setFunct(value+increment))}>+</div>
    </div>
  </div>
  )
}


export {
  BasicInput, BasicInputKey, BasicInputIndex, BasicInputParams,
  NumberInput, NumberInputKey, NumberInputIndex, NumberInputParams,
  PasswordInput,
  TextAreaInput, TextAreaInputKey,
  ValueSelectionDrop, ValueSelectionDropKey,
  ActionIncrement, 
  ParameterIncrement, 
  SimpleIncrement, SimpleIncrementIndex,
  DateSelection, DateSelectionIndex, DateSelectionKey,
  ValueSlider, ValueSliderKey,
  SimpleCheckbox, SimpleCheckboxKey, SimpleCheckboxIndex
 }