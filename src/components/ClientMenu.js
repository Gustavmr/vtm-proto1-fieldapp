/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState} from "react"
import { UserContext } from "./context/userContext"
import { OverlayPopUp } from "./general/PopUpMenus"
import { postRequest } from "./general/ServerRequests"
import { arraySorter, duplicateObject, formatValue } from "./general/supportFunctions"
import Tabs from "./general/Tabs"

function ClientMenu ({selection, setSelection}) {
  const {inputs: {client}} = selection
  const [user,] = useContext(UserContext)

  const clientCheckout = () => {
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
    display: "grid", gridTemplateRows: "auto minmax(0, 70%) auto 1fr", gap: "20px",
    height: "100%", padding: "20px", boxSizing: "border-box"
  }

  useEffect(()=> {
    postRequest("field/clients/get_info", {clientId: client.client_id, user})
    .then((output)=> {
      setSelection((current)=> {
        let updated = duplicateObject(current)
        updated.inputs.client = output
        return updated
      })
    })
  },[])
  if (user && client) return(
    <div style={layout}>
      <div style={{display:"grid", gridTemplateColumns: "1fr auto"}}>
        <div className="title overflow-ellipsis">{client.client_name}</div>
        <button onClick={cancelCheckIn}>cancel</button>
      </div>
      <div className="box outline" style={{height: "100%"}}>
        <Tabs titleArray={["Overview", "Tasks", "History"]}  >
          <ClientOverview client={client} />
          <ClientTasks client={client} />
          <ClientHistory client={client} />
        </Tabs>
      </div>
      <button onClick={clientCheckout}>CheckOut</button>
      <div></div>
    </div>
  )
  return <div>Loading Data</div>
}
function ClientOverview ({client}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "5px"}
  const statusColor = (status) => {
    if (status === "inactive" || status === "dropoutRisk" || status === "declining") return "red text-color"
    if (status === "growing") return "green text-color"
    return "text-color dark"
  }

  const salesGrowth = {
    value: formatValue(client.sales/client.sales_py - 1, "+X.0%"), 
    color: client.sales >= client.sales_py? "green" : "coral"
  }
  return (
    <div className="box" style={{padding: "10px"}}>
      <div style={layout}>
        <div style={{display: "grid", gridTemplateColumns: "100px minmax(0, 1fr"}}>
          <div className="mid-text bold">Client Status</div>
          <div className={`box-section full shade ${statusColor(client.status)} `} style={{textAlign:"center"}}>
            <div>{client.status}</div>
          </div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "100px minmax(0, 1fr"}}>
          <div className="mid-text bold">Sales Last Year</div>
          <div className={`box-section full shade flex-center-all`} >
            {formatValue(client.sales_py, "$auto")}
          </div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "100px minmax(0, 1fr"}}>
          <div className="mid-text bold">Sales This Year</div>
          <div className={`box-section full shade ${salesGrowth.color}`} 
          style={{display: "flex", gap: "10px", justifyContent: "center", alignItems: "center"}}>
            <div>{formatValue(client.sales, "$auto")}</div>
            <div className={`text-color ${salesGrowth.color} bold`}>{salesGrowth.value}</div>
          </div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "100px minmax(0, 1fr"}}>
          <div className="mid-text bold">Sales Potential</div>
          <div className={`box-section full shade`} style={{display: "flex", gap: "10px", justifyContent: "center", alignItems: "center"}}>
            <div>{formatValue(client.potential, "$auto")}</div>
            <div className="text-color dark bold">{formatValue(client.sales/client.potential, "X.0%")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
function ClientTasks ({client}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px"}

  return (
    <div className="box">
      <div style={layout}>
        <div style={{textAlign: "center"}}>No Tasks</div>
        <div></div>
      </div>
    </div>
  )
}
function ClientHistory ({client}) {
  const [selected, setSelected] = useState(undefined)
  const [descending, setDescending] = useState(true)
  const layout = {
    display: "grid", gridTemplateRows: "auto minmax(0, 1fr) auto", gap: "5px", padding: "10px", 
    boxSizing: "border-box", height: "100%", overflow: "auto"
  }
  const listLayout = {
    display: "flex", flexDirection: "column", gap: "5px", height: "100%", overflow: "auto"
  }
  const itemLayout = {display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "10px"}
  // const sortedArray = arraySorter(client.history, "date")
  const popupLayout = {maxHeight: "70vh", width: "80vw", overflow: "auto"}

  const toggleDescending = () => {
    setDescending((current)=> !current)
  }
  const closePopup = () => setSelected(undefined)

  return (
    <div className="box" style={layout}>
      <div>
        <span className="small-text bold">Transaction & Visit History  </span>
        <button className="small" onClick={toggleDescending}>{descending? "descending": "ascending"}</button>
      </div>
      <div style={listLayout}>
        {arraySorter(client.history, "date", descending).map((item, index)=> 
          <div className="box-section full light" key={index} style={itemLayout} onClick={()=>setSelected(item)}>
            <div>
              <div className="small-text text-color dark">{displayDate(item.date)}</div>
              <div className="mid-text overflow-ellipsis">{item.type}</div>
            </div>
            <div className="bold flex-center-all">
              <div >{item.type === "Sale"? formatValue(item.display, "$auto") : item.display}</div>
            </div>
          </div>
        )}
      </div>
      {
        !selected ? <div></div> 
        : selected.type === "Sale" ?
        <OverlayPopUp title={"Sale Details"} setStatus={closePopup}>
          <div style={popupLayout}>
            {selected.by_product.map((prod, index) => 
              <div className="box-section full light" key={index} style={itemLayout}>
                <div className="small-text ">{prod.product_name}</div>
                <div className="flex-center-all bold">{formatValue(prod.sales, "$auto")}</div>
              </div>
            )}
          </div>
        </OverlayPopUp>
        :<OverlayPopUp title={"Visit Notes"} setStatus={closePopup}>
        </OverlayPopUp>
      }
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

function displayDate(dateString) {
  const year = dateString.substring(0,4)
  let month = dateString.substring(5,7)
  let day = dateString.substring(8,10)

  // return `${year}${divider}${month}${divider}${day}`
  return `${year}/${month}/${day}`
}