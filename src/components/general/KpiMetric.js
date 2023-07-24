
import './KpiMetric.css'
import { formatValue } from './supportFunctions';

function kpiColor (label) {
    let outputColor = "";
    switch (label) {
        case "bad" : outputColor = "red";
        break;
        case "warning" : outputColor = "red";
        break;
        case "ok" : outputColor = "red";
        break;
        default : outputColor = "ok"
    }
    return outputColor
}

function KpiMetric ({value, className, ranges = [0, 0.5, 0.9, 1], status= ["bad","ok","good"], vertical = false, labels, format}) { //  ranges, labels,
  const horizontalLayout = { height: "25px", width: "100%"}
  const verticalLayout = {display: "grid", gridTemplateRows: "auto auto auto", padding: "3px", gap: "5px"}

  const min = ranges[0] 
  const max = ranges[ranges.length-1]
  const ratio = 100/(max - min);
  const bar = ranges.map((value, index, array) => {
    if(index !== 0){
      return (
        <div style={{width: `${((value-array[index-1])*ratio).toFixed(1)}%`}} key={index} 
          className={"bar-section "+(index === 1? "first" : index === array.length-1? "last": "middle")}>
        </div>
      )
    }
  }) 
  
  return (
    <div className={className} >
      <div style={vertical? verticalLayout : horizontalLayout}>
        {value === "NA" || !value || !ratio? <div>NA</div> : 
          <div className="kpi-bar">
            <div className='metric flex-center-all' style={{width:`calc(${(value*ratio).toFixed(1) || 0}% - 9px)`, backgroundColor: "#46C2A6"}}>
              {`${(value*ratio).toFixed(0) || 0}%`}
            </div>
            {bar}
          </div>
        }
        {labels? 
          <div style={{display: "grid", gridTemplateColumns: "1fr", gridAutoColumns: "1fr",gridAutoFlow: "column"}}>
            {labels.map((label, index)=> 
              <div key={index}>
                <div className='label small'>{label}</div>
                <div>{formatValue(ranges[index+1] || 0, format )}</div>
              </div>
            )}
          </div>
          : <div></div>
        }
        {/* <div className="status">OK</div> */}
      </div>
    </div>
  )
}


export {KpiMetric}

