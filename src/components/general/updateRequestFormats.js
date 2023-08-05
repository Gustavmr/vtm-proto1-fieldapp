/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import { TextAreaInput, TextAreaInputKey, ValueSelectionDrop } from './inputs'
import { getRequest, postRequest } from './ServerRequests'
import { duplicateObject } from './supportFunctions'


function GeolocationUpdate ({setLocation, location}) {
  const [findOptions, setFindOptions] = useState(false)
  const [options, setOptions] = useState([])
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px", height: "100%", boxSizing: "border-box"}

  const getCurrentAddress = () => {
    navigator.geolocation.getCurrentPosition((position)=> {
      const lat =  position.coords.latitude
      const lng = position.coords.longitude
      postRequest("field/get_address", {lat, lng})
      .then((output)=> {
        const locationUpdate = {
          score: 100,
          attributes: output.address,
          address: output.address.Match_addr,
          geometry : {type: "point",  coordinates: [output.location.x, output.location.y]}
        }
        setLocation(locationUpdate)
        setFindOptions(false)
        setOptions([])
      }).catch((err)=> console.log(err))
    }, (error)=> {
      console.log({error})
    })
  }
  const updateAddress = (key, value) => {
    setLocation((current)=> {
      let updated = duplicateObject(current)
      updated[key] = value
      return updated
    })
    setFindOptions(true)
  }
  const searchAddress = async () => {
    postRequest("client/geolocation/check", {
      clientId: undefined, stdInputs: {address: location.address}
    }).then((output)=> {
      setOptions(output.candidates.filter(({score})=> score >= 50))
    }).catch((err)=> console.log(err))
  }
  const selectOption = (selectedLocation) => {
    const {address, attributes, location}= selectedLocation
    const updatedLocation = {
      score: 100,
      attributes, address,
      geometry : {type: "point",  coordinates: [location.x, location.y]}
    }
    setLocation(updatedLocation)
    setFindOptions(false)
    setOptions([])
  }

  return (
    <div className="box" style={{height: "100%", boxSizing: "border-box"}}>
      <div style={layout}>
        {options.length > 0? 
          <div className="" style={{height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "5px"}}>
            {options.map((loc, index)=> 
              <div className="small-text box full light" key={index} onClick={()=> selectOption(loc)}>
                {loc.address}
              </div>
            )}
          </div>
        : <div style={{display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "10px"}}>
            <TextAreaInputKey name={"address"} value={location.address} setFunc={updateAddress} />
            {findOptions? 
              <button className="small inv" onClick={searchAddress} disabled={!findOptions} style={{width: "70px", fontSize: "11pt"}}>
                Ver Opciones 
              </button>
              :<div></div>
            }
          </div>
        }
        <button className={"small inv"} onClick={getCurrentAddress}>Usar Ubicación Actual</button>        
    </div>
  </div>
  )
}
function StatusUpdate({client, setStatus}) {
  const [newStatus, setNewStatus] = useState(client.status)
  const [stage, setStage] = useState(client.status_attributes.stage)
  const [activity, setActivity] = useState(client.status_attributes.activity)
  const [notes, setNotes] = useState("")
  const [statusArray, setStatusArray] = useState(undefined)
  const [user,] = useContext(UserContext)


  const stageTypes = ["new client", "onboarded"]
  const activityTypes = ["active", "inactive", "delisted"]

  const contentLayout = {display: "flex", flexDirection: "column", gap:"10px", padding: "10px"}
  const inlineLayout = {display: "grid", gridTemplateColumns: "100px 1fr", gap: "5px"}

  const sendRequest = () => {
    // console.log({stage, activity, newStatus, notes})
    const requestInfo = {
      date: new Date(),
      type: "updateRequest", // updateRequest, response,
      sub_type: "updateClientStatus",
      from_type: "field_user",
      from_id: user._id,
      from_name: user.email,
      to_type: "vtm",
      to_id: ["lifecycle_manager"],
      content: {
        client_id: client.client_id, 
        previous_status: client.status,
        previous_stage: client.status_attributes.stage,
        previous_activity: client.status_attributes.activity,
        new_status: newStatus, new_stage: stage, new_activity: activity, 
        notes
      },
      response_status: "Not Reviewed",
    }
    postRequest("field/new_request", {requestInfo}).then((output)=> {
      console.log(output)
      setStatus(false)
    }).catch((err)=> console.log(err))
  }

  useEffect(()=> {
    if (stage && activity && statusArray) {
      let findStatus = {}
      if (stage === "onboarded" && activity === "active" ) {
        findStatus = statusArray.find((stat)=> stat.stage === stage && stat.activity === activity && client.status_attributes.trend === stat.trend)
      } else {
        findStatus = statusArray.find((stat)=> stat.stage === stage && stat.activity === activity)
      }
      // const trend = !client.status_attributes.trend || client.status_attributes.trend === "NA" ? ["NA", "incomplete"] : [client.status_attributes.trend]
      // const findStatus = statusArray.find((stat)=> stat.stage === stage && stat.activity === activity && trend.includes(stat.trend))
      if (findStatus) setNewStatus(findStatus.name)
    }
  },[stage, activity, statusArray])
  useEffect(()=> {
    getRequest("data/lifecycle/status_array").then((output)=> {
      console.log(output)
      setStatusArray(output)
    }).catch((err)=> console.log(err))
  },[])
  if (client.type === "Current") return (
    <div className='outline' style={contentLayout}>
      <div className={`box-section full shade`} style={{textAlign:"center"}}>
        <div>{newStatus}</div>
      </div> 
      <div style={inlineLayout}>
        <div className="small-text bold">Stage</div>
        <ValueSelectionDrop current={stage} valueArray={stageTypes} selectFunc={setStage} />
      </div>
      <div style={inlineLayout}>
        <div className="small-text bold">Activity</div>
        <ValueSelectionDrop current={activity} valueArray={activityTypes} selectFunc={setActivity} />
      </div>
      <div style={inlineLayout}>
        <div className="small-text bold">Trend</div>
        <div>{client.status_attributes.trend}</div>
        {/* <ValueSelectionDrop current={activity} valueArray={activityTypes} selectFunc={setActivity} /> */}
      </div>
    
      <div>
        <div className="small-text bold">Razón de Ajuste</div>
        <TextAreaInput value={notes} setFunc={setNotes} />
      </div>
      <div style={{display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px"}}>
        <button className="full coral" onClick={()=> setStatus(false)}>Cancelar</button>
        <button onClick={sendRequest}>Enviar</button>
      </div>
    </div>
  )

} 

export {GeolocationUpdate, StatusUpdate} 