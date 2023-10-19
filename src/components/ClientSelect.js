/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./context/userContext"
import { BasicInput, NumberInput, ValueSelectionDrop } from "./general/inputs"
import { OverlayPopUp } from "./general/PopUpMenus"
import {  postRequest } from "./general/ServerRequests"
import { SortingColumnArray } from "./general/sorters"
import Tabs from "./general/Tabs"

function ClientSelect ({setSelection, visitTypes, viewMode}) {
  const [user,] = useContext(UserContext)
  const [iniIndex, setIniIndex] = useState(undefined) // Initial screen (depending on location activated or not)
  const [clientList, setClientList] = useState([]) // Std Output client list from all search options
  const [selectedClient, setSelectedClient] = useState(undefined)
  const [geolocation, setGeolocation] = useState(undefined)
  const [clientNotFound, setClientNotFound] = useState(false)

  const layout = {
    display: "grid", gridTemplateRows: "auto auto minmax(0, 1fr) auto", gap: "10px",
    height: "100%",  padding: "10px 20px", boxSizing: "border-box"
  }
  const listLayout = {height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "5px"}
  const listRowLayout = {display: "grid", gridTemplateColumns: "minmax(0,1fr) 80px", gap: "10px", padding: "3px 10px"}

  const tableHeaders = [
    {name: "client_name", display: "Nombre", format: {textAlign: "left" , fontWeight: "bold", fontSize: "14pt"}},
    {name: "type", display: "Tipo", format: {textAlign: "center", fontWeight: "bold", fontSize: "14pt"}},
  ]

  const cancelCheckIn = () => {
    setSelection({screen: "checkin", inputs:{}})
  }
  const selectClient = (client) => {
    if (viewMode) return setSelection({screen: "clientMenu", inputs: {client}})
    setSelectedClient(client)
  }

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=> {
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
        <div className="subtitle overflow-ellipsis">Selecciona un Cliente</div>
        <button className="small full coral" onClick={cancelCheckIn}>cancelar</button>
      </div>
      <div className="box outline">
        <Tabs titleArray={["Cerca de Mi", "Por Nombre"]} initialIndex={iniIndex} >
          <FindAroundMe setClientList={setClientList} iniIndex={iniIndex}/>
          <FindByName setClientList={setClientList} />
          <FindByMap setClientList={setClientList} />
        </Tabs>
      </div>
      
      {!clientList || clientList.length === 0?
        <div className="flex-center-all" style={{textAlign: "center"}}>
          <div>
            <div className="mid-text">Ningun cliente cumple los criterios de búsqueda </div>
            {viewMode?
              <div></div>
              :<button className="full shade" onClick={()=> setClientNotFound(true)}>Check-in Cliente No Econtrado</button>
            }
          </div>
        </div> :
        <div style={listLayout}>
          <SortingColumnArray nameFormatArray={tableHeaders} layout={listRowLayout} setFunction={setClientList} />
          {clientList.map((client, index)=>
            <div key={index} style={listRowLayout} onClick={()=> selectClient(client)} className="full shade">
              <div className="overflow-ellipsis" style={{fontSize: "12pt"}}>{client.client_name}</div> 
              <div className="overflow-ellipsis" style={{fontSize: "12pt"}}>{client.type}</div> 
            </div>
          )}
        </div>
      }

      {selectedClient? 
        <ClientPopup setSelectedClient={setSelectedClient} selectedClient={selectedClient} setSelection={setSelection} geolocation={geolocation}
        visitTypes={visitTypes}/>
        : clientNotFound? 
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

      postRequest("field/clients/search_location", {limitCoordinates})
      .then((output)=> {
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
            <div className="label">{"Distancia de Búsqueda (kms)"}</div>
            <NumberInput value={distance} setFunc={setDistance} />
          </div>
          <button onClick={getClients}>Buscar Clientes</button>
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
        <div className="label">{"Nombre de Cliente"}</div>
        <BasicInput value={clientName} setFunc={setClientName} />
      </div>
      <button onClick={getClients}>Buscar Clientes</button>
    </div>
  )
}
function FindByMap ({setClientList}) {
  // const [clientName, setClientName] = useState("")

  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px"}

  // const getClients = () => {
  //   console.log("get map clients")
  // }

  useEffect(()=>{
    setClientList([])
  },[])
  return (
    <div style={layout}>
      <div></div>
      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
        <div>No Disponible Actualmente</div>
      </div>
      {/* <button onClick={getClients}>Search Clients</button> */}
    </div>
  )
}
function ClientPopup ({setSelectedClient, selectedClient, setSelection, geolocation, visitTypes}) {
  const [visitType, setVisitType] = useState(visitTypes[0])

  const layout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "10px", maxWidth: "75vw", padding: "10px"}
  const selectType = (type) => {
    const selected = visitTypes.find(({action_name})=> action_name === type)
    setVisitType(selected)
  }
  const cancelSelect = () => {
    setSelectedClient(undefined)
  }
  const checkInClient = ()=> {
    setSelection({screen: "clientMenu", inputs: {client: selectedClient, visitType, checkinDate: new Date(), geolocation}})
  }
  const {client_id, client_name, region, address} = selectedClient || {}
  
  return (
    <OverlayPopUp title={"Continuar con Check-in"} setStatus={cancelSelect}>
      <div style={layout}>
        <div className="box-section full shade small-text">
          <div style={{display: "flex", flexDirection: "column", gap: "5px", width: "70vw"}}>
            <div className="bold overflow-ellipsis">{`${client_name} (${client_id})`}</div>
            {/* <div className="bold overflow-ellipsis">{channel} - {segment}</div> */}
            <div className="bold overflow-ellipsis">{region}</div>
            <div style={{fontSize: "10pt"}}>{address}</div>
          </div>
        </div>
        <div className="bold mid-text">Tipo de Visita</div>
        <ValueSelectionDrop valueArray={visitTypes.map(({action_name})=> action_name)} current={visitType.action_name} selectFunc={selectType} />
        <button onClick={checkInClient}>Check-in</button>
        <button className="full coral" onClick={cancelSelect}>cancelar</button>
      </div>
    </OverlayPopUp>
  )
}
function NotFoundPopup ({setClientNotFound, setSelection, user, visitTypes, geolocation}) {
  const [visitType, setVisitType] = useState(visitTypes[0])
  const [clientName, setClientName] = useState("")


  const layout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "10px", maxWidth: "75vw", padding: "10px"}
  const cancelSelect = () => {
    setClientNotFound(false)
  }
  const selectType = (type) => {
    const selected = visitTypes.find(({action_name})=> action_name === type)
    setVisitType(selected)
  }
  const checkInClient = () => {
    postRequest("field/clients/log_visit", {
      user, geolocation, visitType,
      client: {client_id: "NA", client_name: clientName, client_type: "Current"}, 
      checkinDate: new Date(), checkoutDate: new Date(), 
      visitOutcome: "Client not found", 
      visitNotes: "Could not find client in app",
      
    }).then((output)=> {
      setSelection({screen: "checkin", inputs: {}})
    }).catch((err)=> console.log({err}))
  }
  
  return (
    <OverlayPopUp title={"Cliente no Econtrado"} setStatus={cancelSelect}>
      <div style={layout}>
        <div className="small-text">Registra una visita para un cliente que no pudiste encontrar</div>
        <BasicInput label={"Nombre de Cliente"} value={clientName} setFunc={setClientName}/>
        <ValueSelectionDrop valueArray={visitTypes.map(({action_name})=> action_name)} current={visitType.action_name} selectFunc={selectType} />
        <button onClick={checkInClient}>Check-in</button>
        <button className="full coral" onClick={cancelSelect}>cancelar</button>
      </div>
    </OverlayPopUp>
  )
}


export default ClientSelect

