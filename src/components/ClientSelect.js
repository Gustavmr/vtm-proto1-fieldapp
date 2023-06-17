/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./context/userContext"
import { BasicInput, NumberInput, ValueSelectionDrop } from "./general/inputs"
import { OverlayPopUp } from "./general/PopUpMenus"
import {  postRequest } from "./general/ServerRequests"
import { SortingColumnArray } from "./general/sorters"
import Tabs from "./general/Tabs"

function ClientSelect ({setSelection, visitTypes}) {
  const [user,] = useContext(UserContext)
  const [iniIndex, setIniIndex] = useState(undefined) // Initial screen (depending on location activated or not)
  const [clientList, setClientList] = useState([]) // Std Output client list from all search options
  const [selectedClient, setSelectedClient] = useState(undefined)
  const [geolocation, setGeolocation] = useState(undefined)
  const [clientNotFound, setClientNotFound] = useState(false)

  const layout = {
    display: "grid", gridTemplateRows: "auto auto auto minmax(0, 1fr) auto", gap: "20px",
    height: "100%", padding: "10px", boxSizing: "border-box"
  }
  const listLayout = {height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "5px"}
  const listRowLayout = {display: "grid", gridTemplateColumns: "70px minmax(0,1fr)", gap: "10px", padding: "3px 10px"}

  const tableHeaders = [
    {name: "client_id", display: "ID", format: {textAlign: "center", fontWeight: "bold", fontSize: "16pt"}},
    {name: "client_name", display: "Name", format: {textAlign: "left" , fontWeight: "bold", fontSize: "16pt"}},
  ]

  const cancelCheckIn = () => {
    setSelection({screen: "checkin", inputs:{}})
  }
  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=> {
      console.log({position, lat: position.coords.latitude, lng: position.coords.longitude})
      setGeolocation({lat: position.coords.latitude, lng: position.coords.longitude})
      setIniIndex(0)
    }, (error)=> {
      console.log({error})
      setIniIndex(1)
    })
  },[])
  if (user && (iniIndex || iniIndex === 0)) return(
    <div style={layout}>
      <div style={{display:"grid", gridTemplateColumns: "1fr auto"}}>
        <div className="title overflow-ellipsis">Select Client</div>
        <button onClick={cancelCheckIn}>cancel</button>
      </div>
      <div className="box outline">
        <Tabs titleArray={["Around Me", "By Name", "Map"]} initialIndex={iniIndex} >
          <FindAroundMe setClientList={setClientList} iniIndex={iniIndex}/>
          <FindByName setClientList={setClientList} />
          <FindByMap setClientList={setClientList} />
        </Tabs>
      </div>
      <SortingColumnArray nameFormatArray={tableHeaders} layout={listRowLayout} setFunction={setClientList} />
      {clientList.length === 0?
        <div style={{textAlign: "center"}}>
          <div>No Clients Found </div>
          <button className="full shade" onClick={()=> setClientNotFound(true)}>Check-in Not Found</button>
        </div> :
        <div style={listLayout}>
          {clientList.map((client, index)=>
            <div key={index} style={listRowLayout} onClick={()=> setSelectedClient(client)} className="full shade">
              <div style={{fontSize: "16pt"}}>{client.client_id}</div> 
              <div className="overflow-ellipsis" style={{fontSize: "16pt"}}>{client.client_name}</div> 
            </div>
          )}
        </div>
      }

      {selectedClient? 
        <ClientPopup setSelectedClient={setSelectedClient} selectedClient={selectedClient} setSelection={setSelection} geolocation={geolocation}
        visitTypes={visitTypes}/>
        : <div></div>
      }
      {clientNotFound? 
        <NotFoundPopup setClientNotFound={setClientNotFound} user={user} setSelection={setSelection} geolocation={geolocation}
        visitTypes={visitTypes}/>
        : <div></div>
      }
    </div>
  )
  return <div>Loading Data</div>
}
function FindAroundMe ({setClientList, iniIndex}) {
  const defaultDistance = 2
  const [distance, setDistance] = useState(defaultDistance)

  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px"}

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
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
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

  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px"}

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
      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
        <div className="subtitle">{"Client Name"}</div>
        <BasicInput value={clientName} setFunc={setClientName} />
      </div>
      <button onClick={getClients}>Search Clients</button>
    </div>
  )
}
function FindByMap ({setClientList}) {
  // const [clientName, setClientName] = useState("")

  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px"}

  const getClients = () => {
    console.log("get map clients")
  }

  useEffect(()=>{
    setClientList([])
  },[])
  return (
    <div style={layout}>
      <div></div>
      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
        <div className="subtitle">{"Find By Map"}</div>
        <div>WIP</div>
      </div>
      <button onClick={getClients}>Search Clients</button>
    </div>
  )
}
function ClientPopup ({setSelectedClient, selectedClient, setSelection, geolocation, visitTypes}) {
  const [visitType, setVisitType] = useState("Sales Visit")

  const layout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "10px", maxWidth: "75vw", padding: "10px"}
  const cancelSelect = () => {
    setSelectedClient(undefined)
  }
  const checkInClient = ()=> {
    setSelection({screen: "clientMenu", inputs: {client: selectedClient, visitType, checkinDate: new Date(), geolocation}})
  }
  const {client_id, client_name, region, address, channel, segment} = selectedClient || {}
  
  return (
    <OverlayPopUp title={"Confirm Check-in"} setStatus={cancelSelect}>
      <div style={layout}>
        <div className="box-section full shade small-text">
          <div style={{display: "flex", flexDirection: "column", gap: "5px", width: "70vw"}}>
            <div className="bold overflow-ellipsis">{`${client_name} (${client_id})`}</div>
            <div className="bold overflow-ellipsis">{channel} - {segment}</div>
            <div className="bold overflow-ellipsis">{region}</div>
            <div style={{fontSize: "10pt"}}>{address}</div>
          </div>
        </div>
        <div className="bold mid-text">Select Visit Type</div>
        <ValueSelectionDrop valueArray={visitTypes} selectFunc={setVisitType} />
        <button onClick={checkInClient}>Client Check-in</button>
        <button onClick={cancelSelect}>cancel</button>
      </div>
    </OverlayPopUp>
  )
}
function NotFoundPopup ({setClientNotFound, setSelection, user, visitTypes, geolocation}) {
  const [visitType, setVisitType] = useState("Sales Visit")
  const [clientName, setClientName] = useState("")

  const layout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "10px", maxWidth: "75vw", padding: "10px"}
  const cancelSelect = () => {
    setClientNotFound(false)
  }
  const checkInClient = () => {
    postRequest("field/clients/log_visit", {
      user, geolocation, visitType,
      client: {client_id: "NA", client_name: clientName}, 
      checkinDate: new Date(), checkoutDate: new Date(), 
      visitOutcome: "Client not found", 
      visitNotes: "Could not find client in app",
      
    }).then((output)=> {
      console.log({output})
      setSelection({screen: "checkin", inputs: {}})
    }).catch((err)=> console.log({err}))
  }
  
  return (
    <OverlayPopUp title={"Client Not Found"} setStatus={cancelSelect}>
      <div style={layout}>
        <div>Log visit for a client that could not be found with this app</div>
        <BasicInput label={"Client Name"} value={clientName} setFunc={setClientName}/>
        <ValueSelectionDrop valueArray={visitTypes} selectFunc={setVisitType} />
        <button onClick={checkInClient}>Client Check-in</button>
        <button onClick={cancelSelect}>cancel</button>
      </div>
    </OverlayPopUp>
  )
}


export default ClientSelect

