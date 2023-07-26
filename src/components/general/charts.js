import {  useState } from "react"

import { arraySorter,  formatValue,  } from "./supportFunctions"

// General Chart Parts


function ChartBar ({baseHeight, baseValue, currentValue, valueFormat, color, disableLabel = false}) {
  const chartBarLayout = {display: "grid", gridTemplateRows: "1fr auto auto"}

  return (
    <div style={chartBarLayout}>
      <div></div>
      {disableLabel? <div></div> : <div style={{textAlign: "center"}}>{formatValue(currentValue || 0, valueFormat || "$auto")}</div> }
      <div className={`full ${color || ""}`} style={{height: `${baseHeight*(currentValue/baseValue)}px`}}></div>
    </div>
  )
}

// Specific Usecase Charts

function GrowthCharts ({TtmInputs, color = "green"}) {
  let {cy, py, ppy} = TtmInputs
  cy = cy || {}
  py = py || {}
  ppy = ppy || {}

  const layout = {display: "grid", gridTemplateColumns: "1fr", gap: "5px"}
  const chartRowLayout = {display: "grid", gridTemplateRows: " auto auto 1fr auto", gap: "5px"}
  const chartColumnLayout = {display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px"}

  const metric = "sales"
  const refHeight = 80
  const maxMetric = Math.max(cy[metric] || 0, py[metric] || 0, ppy[metric] || 0)

  return (
    <div style={layout}>
      <div style={chartRowLayout}>
        {/* growth */}
        <div style={chartColumnLayout}>
          <div></div>
          <div className={`label text-color ${!ppy[metric] || !py[metric]? "dark" : py[metric] / ppy[metric] -1 >= 0 ? "green" : "coral"}`} 
          style={{textAlign: "center"}}>
            {formatValue(py[metric] / ppy[metric] -1, "+X%")}
          </div>
          <div className={`label text-color ${!py[metric] || !cy[metric]? "" : cy[metric] / py[metric] -1 >= 0 ? "green" : "coral"}`} 
          style={{textAlign: "center"}}>
            {formatValue(cy[metric] / py[metric] -1, "+X%")}
          </div>      
        </div>
        {/* Bars */}
        <div style={chartColumnLayout}>
          <ChartBar baseHeight={refHeight} baseValue={maxMetric} currentValue={ppy[metric]} color={color}/>
          <ChartBar baseHeight={refHeight} baseValue={maxMetric} currentValue={py[metric]} color={color}/>
          <ChartBar baseHeight={refHeight} baseValue={maxMetric} currentValue={cy[metric]} color={color}/>
        </div>
        {/* labels */}
        <div style={chartColumnLayout}>
          <div className='label small' style={{textAlign: "center"}}>Actual - 2</div>
          <div className='label small'style={{textAlign: "center"}}>Anterior</div>
          <div className='label small'style={{textAlign: "center"}}>12 meses</div>
        </div>
      </div>
    </div>
  )

}
function TransactionHistoryChart ({calendarInputs, metric, color ="green"}) {
  const [timeUnits, setTimeUnits] = useState("year")
  const sortedArray = arraySorter(calendarInputs, "year", false)

  const yearLayout = {display: "grid", gridAutoFlow: "column", gridAutoColumns: "1fr", gap: "5px"}
  const monthLayout = {display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "2px"} 
  const chartRowLayout = {display: "grid", gridTemplateRows: " auto auto 1fr auto", gap: "5px"}
 
  let maxMetricArray = calendarInputs.map((year)=> {
    if (timeUnits === "year") return year[metric]
    const valueArray = year.months.map((month) => month[metric])
    return Math.max(...valueArray)
  })
  const maxValue = Math.max(...maxMetricArray)
  const monthArray = [1,2,3,4,5,6,7,8,9,10,11,12]

  return (
    <div style={chartRowLayout}>
      <div className='subtitle'>Transaction History</div>
      <div style={{display: "grid", gridTemplateColumns: "auto auto auto 1fr", gap: "5px"}}>
        <div onClick={() => setTimeUnits("year")} className={`label text-color ${timeUnits === "year"? color : "light"}`}>Year</div>
        <div onClick={() => setTimeUnits("month")} className={`label text-color ${timeUnits === "month"? color : "light"}`}>Month</div>
        <div></div>
      </div>
      <div style={yearLayout}>
        {sortedArray.map((year)=> <div key={year.year}>{year.year}</div>)}
      </div>
      <div style={yearLayout}>
        {sortedArray.map((year)=> {
          if (timeUnits === "year") {
            return <ChartBar key={year.year} baseHeight={80} baseValue={maxValue} currentValue={year[metric]} color={color}/>
          }
          if (timeUnits === "month") return (
            <div className='full shade green' key={year.year} style={monthLayout}>
              {monthArray.map((mth)=> {
                const currentMonth = year.months.find((yearMonth)=> yearMonth.month === mth)
                return (
                  <ChartBar key={mth} baseHeight={80} baseValue={maxValue} disableLabel={true} color={color}
                  currentValue={currentMonth? currentMonth[metric] : 0}/>
                )
              })}
            </div>
          )
          return <div key={year.year}>NA</div>
        })}
      </div>

    </div>
  )
}



export {GrowthCharts, TransactionHistoryChart, ChartBar}