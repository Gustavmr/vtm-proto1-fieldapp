/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./context/userContext"
import { duplicateObject } from "./general/supportFunctions"
import Tabs from "./general/Tabs"

function ClientMenu ({selection, setSelection}) {
  const {inputs: {client, checkInDate, visitType}} = selection
  const [user,] = useContext(UserContext)

  const clientCheckout = () => {
    console.log("checkout")
    setSelection((current)=> {
      let updated = duplicateObject(current)
      updated.screen = "checkout"
      return updated 
    })
  }
  const cancelCheckIn = () => {
    setSelection({screen: "checkin", inputs:{}})
  }

  const layout = {
    display: "grid", gridTemplateRows: "auto minmax(0, 1fr) auto", gap: "20px",
    height: "100%", padding: "10px", boxSizing: "border-box"
  }

  useEffect(()=> {
    console.log({selection})
  },[])
  if (user && client) return(
    <div style={layout}>
      <div style={{display:"grid", gridTemplateColumns: "1fr auto"}}>
        <div className="title">{client.client_name}</div>
        <button onClick={cancelCheckIn}>cancel</button>
      </div>
      <div className="box outline">
        <Tabs titleArray={["Overview", "Tasks", "History"]}  >
          <ClientOverview client={client} />
          <ClientTasks client={client} />
          <ClientHistory client={client} />
        </Tabs>
      </div>
      <button onClick={clientCheckout}>CheckOut</button>
    </div>
  )
  return <div>Loading Data</div>
}
function ClientOverview ({client}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "5px"}

  return (
    <div className="box">
      <div style={layout}>
        <div>Overview</div>
        <div>{client.client_name}</div>
        <div></div>
      </div>
    </div>
  )
}
function ClientTasks ({client}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "5px"}

  return (
    <div className="box">
      <div style={layout}>
        <div>Tasks</div>
        <div>{client.client_name}</div>
        <div></div>
      </div>
    </div>
  )
}
function ClientHistory ({client}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "5px"}

  return (
    <div className="box">
      <div style={layout}>
        <div>Visit History</div>
        <div>{client.client_name}</div>
        <div></div>
      </div>
    </div>
  )
}
// function ClientPopup ({setSelectedClient, selectedClient, setSelection}) {
//   const [visitType, setVisitType] = useState("Sales Visit")

//   const layout = {height: "50%", width: "70%"}

//   const visitOptions = ["Sales Visit", "Merchandising", "Technical Visit"]

//   const cancelSelect = () => {
//     setSelectedClient(undefined)
//   }
//   const checkInClient = ()=> {
//     setSelection({screen: "clientMenu", inputs: {client: selectedClient, visitType, date: new Date()}})
//   }
//   const {client_id, client_name, status, sales, region, address, channel, segment} = selectedClient || {}
  
//   return (
//     <OverlayPopUp title={"Confirm Client Check-in"} setStatus={cancelSelect}>
//       <div style={layout}>
//         <div className="box-section full shade">
//           <div>{`${client_name} (${client_id})`}</div>
//           <div>Status: {status}</div>
//           <div>{"Sales (last 12 months):"} {formatValue(sales, "$auto")}</div>
//           <div>Segment: {channel} {segment}</div>
//           <div>Region: {region}</div>
//           <div>Address: {address}</div>
//         </div>
//         <ValueSelectionDrop label={"Visit Types"} valueArray={visitOptions} selectFunc={setVisitType} />
//         <button onClick={checkInClient}>Client Check-in</button>
//         <button onClick={cancelSelect}>cancel</button>
//       </div>
//     </OverlayPopUp>
//   )
// }


export default ClientMenu

