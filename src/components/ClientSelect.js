/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./context/userContext"
import { BasicInput, NumberInput, ValueSelectionDrop } from "./general/inputs"
import { OverlayPopUp } from "./general/PopUpMenus"
import {  postRequest } from "./general/ServerRequests"
import { SortingColumnArray } from "./general/sorters"
import { formatValue } from "./general/supportFunctions"
import Tabs from "./general/Tabs"

function ClientSelect ({setSelection}) {
  const [user,] = useContext(UserContext)
  const [iniIndex, setIniIndex] = useState(undefined) // Initial screen (depending on location activated or not)
  const [clientList, setClientList] = useState([]) // Std Output client list from all search options
  const [selectedClient, setSelectedClient] = useState(undefined)

  const layout = {
    display: "grid", gridTemplateRows: "auto auto auto minmax(0, 1fr) auto", gap: "20px",
    height: "100%", padding: "10px", boxSizing: "border-box"
  }
  const listLayout = {height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "5px"}
  const listRowLayout = {display: "grid", gridTemplateColumns: "70px minmax(0,1fr)", gap: "10px"}

  const tableHeaders = [
    {name: "client_id", display: "ID", format: {textAlign: "center", fontWeight: "bold", fontSize: "15px"}},
    {name: "client_name", display: "Name", format: {textAlign: "left" , fontWeight: "bold", fontSize: "15px"}},
  ]

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=> {
      console.log({position, lat: position.coords.latitude, lng: position.coords.longitude})
      setIniIndex(0)
    }, (error)=> {
      console.log({error})
      setIniIndex(1)
    })
  },[])
  if (user && (iniIndex || iniIndex === 0)) return(
    <div style={layout}>
      <div className="title">Select Client</div>
      <div className="box outline">
        <Tabs titleArray={["Around Me", "By Name", "Map"]} initialIndex={iniIndex} >
          <FindAroundMe setClientList={setClientList} iniIndex={iniIndex}/>
          <FindByName setClientList={setClientList} />
          <FindByMap setClientList={setClientList} />
        </Tabs>
      </div>
      <SortingColumnArray nameFormatArray={tableHeaders} layout={listRowLayout} setFunction={setClientList} />
      {clientList.length === 0?
        <div>No Clients Found </div> :
        <div style={listLayout}>
          {clientList.map((client, index)=>
            <div key={index} style={listRowLayout} onClick={()=> setSelectedClient(client)}>
              <div style={{fontSize: "12px"}}>{client.client_id}</div> 
              <div className="overflow-ellipsis" style={{fontSize: "12px"}}>{client.client_name}</div> 
            </div>
          )}
        </div>
      }

      {selectedClient? 
        <ClientPopup setSelectedClient={setSelectedClient} selectedClient={selectedClient} setSelection={setSelection}/>
        : <div></div>
      }
    </div>
  )
  return <div>Loading Data</div>
}
function FindAroundMe ({setClientList, iniIndex}) {
  const defaultDistance = 2
  const [distance, setDistance] = useState(defaultDistance)

  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "5px"}

  function coordinationBoundaries(lat, lng, km) {
    const lat_min = lat - km/110.574
    const lat_max = lat + km/110.574
    const lng_min = lng - km/(111.320*Math.cos(lat_min*0.0174533))
    const lng_max = lng + km/(111.320*Math.cos(lat_max*0.0174533))
    return  {lat, lat_min, lat_max, lng, lng_min, lng_max}
  }

  const getClients = () => {
    navigator.geolocation.getCurrentPosition((position)=> {
      const lat =  position.coords.latitude
      const lng = position.coords.longitude
      const limitCoordinates = coordinationBoundaries (lat, lng, distance || defaultDistance)
      // const limitCoordinates = coordinationBoundaries (25.674939,-100.309731, 2)
      // console.log({limitCoordinates})
      postRequest("field/clients/search_location", {limitCoordinates})
      .then((output)=> {
        console.log(output)
        setClientList(output)
      }).catch((err)=> console.log(err))
    }, (error)=> {
      console.log({error})
    })
  }

  useEffect(()=>{
    if (iniIndex === 0) {
      getClients()
    } else {
      setClientList([])
    }
  },[])
  return (
    <div className="box">
      {iniIndex === 0 ? 
        <div style={layout}>
          <div></div>
          <div style={{display: "flex", gap: "10px"}}>
            <div className="subtitle">{"Search Distance (km)"}</div>
            <NumberInput value={distance} setFunc={setDistance} />
          </div>
          <button onClick={getClients}>Find Clients Around Me</button>
        </div>
        :<div className="box-section full coral shade">
          Location tracking is disabled, please accept "location tracking" on popup
        </div>
      }
    </div>
  )
}
function FindByName ({setClientList}) {
  const [clientName, setClientName] = useState("")

  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "5px"}

  const getClients = () => {
    postRequest("field/clients/search_name", {clientName})
    .then((output)=> {
      console.log(output)
      setClientList(output)
    }).catch((err)=> console.log(err))
  }

  useEffect(()=>{
    setClientList([])
  },[])
  return (
    <div className="box" style={layout}>
      <div></div>
      <div style={{display: "flex", gap: "10px"}}>
        <div className="subtitle">{"Client Name"}</div>
        <BasicInput value={clientName} setFunc={setClientName} />
      </div>
      <button onClick={getClients}>Search Clients</button>
    </div>
  )
}
function FindByMap ({setClientList}) {
  // const [clientName, setClientName] = useState("")

  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "5px"}

  const getClients = () => {
    console.log("get map clients")
  }

  useEffect(()=>{
    setClientList([])
  },[])
  return (
    <div style={layout}>
      <div></div>
      <div style={{display: "flex", gap: "10px"}}>
        <div className="subtitle">{"Find By Map"}</div>
        <div>WIP</div>
      </div>
      <button onClick={getClients}>Search Clients</button>
    </div>
  )
}
function ClientPopup ({setSelectedClient, selectedClient, setSelection}) {
  const [visitType, setVisitType] = useState("Sales Visit")

  const layout = {height: "50%", width: "70%"}

  const visitOptions = ["Sales Visit", "Merchandising", "Technical Visit"]

  const cancelSelect = () => {
    setSelectedClient(undefined)
  }
  const checkInClient = ()=> {
    setSelection({screen: "clientMenu", inputs: {client: selectedClient, visitType, checkinDate: new Date()}})
  }
  const {client_id, client_name, status, sales, region, address, channel, segment} = selectedClient || {}
  
  return (
    <OverlayPopUp title={"Confirm Client Check-in"} setStatus={cancelSelect}>
      <div style={layout}>
        <div className="box-section full shade">
          <div>{`${client_name} (${client_id})`}</div>
          <div>Status: {status}</div>
          <div>{"Sales (last 12 months):"} {formatValue(sales, "$auto")}</div>
          <div>Segment: {channel} {segment}</div>
          <div>Region: {region}</div>
          <div>Address: {address}</div>
        </div>
        <ValueSelectionDrop label={"Visit Types"} valueArray={visitOptions} selectFunc={setVisitType} />
        <button onClick={checkInClient}>Client Check-in</button>
        <button onClick={cancelSelect}>cancel</button>
      </div>
    </OverlayPopUp>
  )
}


export default ClientSelect

