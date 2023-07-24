import { useState } from 'react'


function ExpandableRow ({children, customClass, side = "left", arrowColor = undefined}) {
  const [expanded, setExpanded] = useState(false)
  const layout = {display: "grid", gridTemplateColumns: "14px 1fr", gap: "5px", padding: "3px"}
  const layoutRight = {display: "grid", gridTemplateColumns: "1fr 14px ", gap: "5px"}


  const toggleExpand = (e) =>{
    e.stopPropagation()
    setExpanded((current)=> !current)
  } 
  if (side === "right") return (
    <div className={customClass || "table-row expandable orange"}>
      <div style={expanded? {...layoutRight, paddingBottom: "3px"}: layoutRight} >
        {children[0]}
        <i className={`arrow ${expanded? "up": "down"} ${arrowColor || ""}`} onClick={(e) => toggleExpand(e)}></i>
      </div>
      {expanded? children[1] : <div></div>}
    </div>
  )
  return (
    <div className={customClass || "table-row expandable orange"} >
    <div style={layout} >
      <i className={`arrow ${expanded? "up": "down"} ${arrowColor || ""}`} onClick={(e) => toggleExpand(e)}></i>
      {children[0]}
    </div>
    {expanded? children[1] : <div></div>}
  </div>
  )
}

function ExpandableSection ({title, children, customClass, color}) {
  const [expanded, setExpanded] = useState(false)
  const layout = {display: "grid", gridTemplateRows: "auto  minmax(0, 1fr)", gap: "5px"}
  const layoutRight = {display: "grid", gridTemplateColumns: "1fr 14px ", gap: "5px"}


  const toggleExpand = (e) =>{
    e.stopPropagation()
    setExpanded((current)=> !current)
  } 
  return (
    <div className={customClass || ""} style={layout}>
      <div style={layoutRight}>
        <div className={`mid-text bold ${color? `text-color ${color}`:""}`}>{title}</div>
        <i className={`arrow ${expanded? "up": "down"} ${color || ""}`} onClick={(e) => toggleExpand(e)}></i>
      </div>
      {expanded? children : <div></div>}
    </div>
  )

}

export {ExpandableRow, ExpandableSection} 