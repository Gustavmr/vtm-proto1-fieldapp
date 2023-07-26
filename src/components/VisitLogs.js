/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./context/userContext"
import { DateSelectionKey, TextAreaInputKey, ValueSelectionDrop, ValueSelectionDropKey } from "./general/inputs"
import { OverlayPopUp } from "./general/PopUpMenus"
import { postRequest } from "./general/ServerRequests"
import { SortingColumnArray } from "./general/sorters"
import { duplicateObject } from "./general/supportFunctions"

function VisitLogs ({setSelection, visitTypes, refresh}) {
  const [user,] = useContext(UserContext)
  const [timeframe, setTimeframe] = useState("1 month")
  const [visitList, setVisitList] = useState(undefined) // Std Output client list from all search options
  const [selectedVisit, setSelectedVisit] = useState(undefined)
  const [updateCounter, setUpdateCounter] = useState(0)

  const layout = {
    display: "grid", gridTemplateRows: "auto auto auto minmax(0, 1fr) auto", gap: "20px",
    height: "100%", padding: "10px", boxSizing: "border-box"
  }
  const listLayout = {height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "5px"}
  const listRowLayout = {display: "grid", gridTemplateColumns: "80px 100px minmax(0,1fr) ", gap: "10px", padding: "3px 10px"}

  const timeframeOptions = ["1 month", "3 months", "6 months", "12 months"]
  const tableHeaders = [
    {name: "checkin_date", display: "Fecha", format: {textAlign: "center", fontWeight: "bold", fontSize: "16pt"}},
    {name: "visit_type", display: "Tipo", format: {textAlign: "center", fontWeight: "bold", fontSize: "16pt"}},
    {name: "client_name", display: "Nombre", format: {textAlign: "left" , fontWeight: "bold", fontSize: "16pt"}},
  ]

  const cancelCheckIn = () => {
    setSelection({screen: "checkin", inputs:{}})
  }
  useEffect(()=> {
    postRequest("field/visits/get_logs", {timeframe, user})
    .then((output)=> {
      setVisitList(output)
    }).catch((err) => console.log(err))
  },[timeframe, updateCounter])
  if (user && visitList) return (
    <div style={layout}>
      <div style={{display:"grid", gridTemplateColumns: "1fr auto"}}>
        <div className="subtitle overflow-ellipsis">Visitas Anteriores</div>
        <button className="small full coral" onClick={cancelCheckIn}>cancel</button>
      </div> 
      <div>
        <div className="mid-text bold">Tiempo</div>
        <ValueSelectionDrop valueArray={timeframeOptions} current={timeframe} selectFunc={setTimeframe} />
      </div>
      <div>
        <SortingColumnArray nameFormatArray={tableHeaders} layout={listRowLayout} setFunction={setVisitList} />
        {visitList.length === 0?
          <div style={{textAlign: "center"}}>Sin Visitas Anteriores</div> :
          <div style={listLayout}>
            {visitList.map((visit, index)=>
              <div key={index} style={listRowLayout} onClick={()=> setSelectedVisit(visit)} className="full shade">
                <div style={{overflowWrap: "break-word", fontSize:"11pt"}}>{displayDate(visit.checkin_date)}</div>
                <div className="small-text overflow-ellipsis">{visit.visit_type}</div> 
                <div className="small-text overflow-ellipsis">{visit.client_name}</div> 
              </div>
            )}
          </div>
        }
      </div>
      {selectedVisit? 
        <VisitPopup setSelectedVisit={setSelectedVisit} selectedVisit={selectedVisit} setUpdateCounter={setUpdateCounter} 
        visitTypes={visitTypes} refresh={refresh}/>
        : <div></div>
      }
    </div>
  )
  return <div>Loading Data</div>
}

function VisitPopup ({setSelectedVisit, selectedVisit, setUpdateCounter, visitTypes, refresh}) {
  const [updatedVisit, setUpdatedVisit] = useState(undefined)

  const layout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "10px", width: "75vw", padding: "10px"}
  const outcomeOptions = ["NA", "Client Not Available","Visit Successful", "Visit Unsuccessful"]

  const cancelSelect = () => {
    setSelectedVisit(undefined)
  }
  const updateData = (key, value) => {
    setUpdatedVisit((current)=> {
      let updated = duplicateObject(current)
      if (key === "visit_type") updated.action_id = visitTypes.find(({action_name})=> action_name === value).action_id
      updated[key] = value
      return updated
    })
  }
  const applyChanges = () => {
    postRequest("field/visits/edit_log", {updatedVisit})
    .then((output)=>{
      setSelectedVisit(undefined)
      setUpdateCounter((current)=> current+1)
      refresh()
    }).catch((err)=>(console.log(err)))
  }

  const {client_id, client_name} = selectedVisit || {}
  useEffect(()=> {
    let editDates = duplicateObject(selectedVisit)

    editDates.checkin_date = formatDate(editDates.checkin_date, "-")
    editDates.checkout_date = formatDate(editDates.checkout_date, "-")

    setUpdatedVisit(editDates)
  },[])
  if (updatedVisit) return (
    <OverlayPopUp title={"Editar a Visita"} setStatus={cancelSelect}>
      <div style={layout}>
        <div className="box-section full shade small-text" style={{width: "calc(75vw - 10px"}}>
          <div className="bold overflow-ellipsis">{`${client_name} (${client_id})`}</div>
          <DateSelectionKey name={"checkin_date"} label={"Fecha"} value={updatedVisit.checkin_date} setFunct={updateData}/>
          <ValueSelectionDropKey name={"visit_type"} label={"Tipo"} current={updatedVisit.visit_type} 
          valueArray={visitTypes.map(({action_name})=> action_name)} selectFunc={updateData} />
          <ValueSelectionDropKey name={"outcome"} label={"Resultado"} current={updatedVisit.outcome} 
          valueArray={outcomeOptions} selectFunc={updateData} />
          {/* <DateSelectionKey name={"checkout_date"} label={"Check-out"} value={updatedVisit.checkin_date} setFunct={updateData}/> */}
          <div>Notas</div>
          <TextAreaInputKey name={"notes"} value={updatedVisit.notes} setFunc={updateData}/>
        </div>
        <button onClick={applyChanges}>Guardar Cambios</button>
        <button className="full coral" onClick={cancelSelect}>cancelar</button>
      </div>
    </OverlayPopUp>
  )
}


export default VisitLogs

function formatDate(dateString) {
  const year = dateString.substring(0,4)
  let month = dateString.substring(5,7)
  let day = dateString.substring(8,10)

  // return `${year}${divider}${month}${divider}${day}`
  return `${year}-${month}-${day}`
}
function displayDate(dateString) {
  const year = dateString.substring(0,4)
  let month = dateString.substring(5,7)
  let day = dateString.substring(8,10)

  // return `${year}${divider}${month}${divider}${day}`
  return `${year}/${month}/${day}`
}