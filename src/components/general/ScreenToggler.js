/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

function ScreenToggler ({screenNames, selectedScreen, layout, children, className = undefined }) {
    const [selection, setSelection] = useState(0);
    
    useEffect(()=>{
        setSelection(()=> screenNames.indexOf(selectedScreen))
    },[selectedScreen])

    return (

    <div style={layout || {}} className={className}>
        {children[selection]}
    </div>
    )
}


export default ScreenToggler 