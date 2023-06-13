/* eslint-disable react-hooks/exhaustive-deps */
import {useState} from "react";

function Tabs ({titleArray, children, color, boxStyle, initialIndex = 0}) {
    const [selection, setSelection] = useState(initialIndex);

    // Tab Selection    

    return (
        <div style={{display:"grid", gridTemplateRows: "auto minmax(0, 1fr)"}}>
            <div className="tab-container">
              {titleArray.map((title, index) => {
                if (index === selection) return <div className={`tab ${color ? color : ""} selected`} key={index}>{title}</div>;
                return <div className={`tab ${color ? color : ""}`} onClick={()=> setSelection(index)} key={index}>{title}</div>
              })}
            </div>
            <div className="tab-content" style={boxStyle || {}}>
                {children[selection]}
            </div>
        </div>
    )
}

export default Tabs