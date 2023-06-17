/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { UserContext } from "./context/userContext"
import { BasicInputKey, NumberInputKey,  TextAreaInputKey, ValueSelectionDropKey } from "./general/inputs"
import { postRequest } from "./general/ServerRequests"
import { duplicateObject } from "./general/supportFunctions"
import Tabs from "./general/Tabs"

function NewProspect ({setSelection, channelTypes}) {
  const [newProspect, setNewProspect] = useState(undefined)
  const [user,] = useContext(UserContext)

  const contactTypes =["No Contact", "First Contact", "Multiple Contacts"]
  const difficultyLevels =["Low", "Medium", "High"]
  const blankProspect = {
    prospect_name: "",
    added_date: new Date (),
    status: "no contact",
    sales_potential: 0,
    sales_difficulty: "Medium",
    notes: "",
    channel: channelTypes[0],
    contact: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    location: {
      score: 0,
      attributes: "",
      address: "Write Address",
      geometry: {type: "point",  coordinates: []},
    },
  }

  const layout = {
    display: "grid", gridTemplateRows: "auto auto minmax(0, 1fr) auto auto", alignItems: "center", gap: "10px",
    height: "100%", width: "100%", padding: "20px", boxSizing: "border-box"
  }
  const formLayout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "10px", height: "100%"}

  const difficultyClassName = (difficulty) => {
    const color = difficulty === "Low" ? "green" : difficulty === "Medium" ? "orange" : difficulty === "High" ? "coral" : ""
    return `text-bubble full shade ${color} bold`
  }
  const cancelNewProspect = () => {
    setSelection({screen: "checkin", inputs:{}})
  }
  const updateProspect = (key, value) => {
    setNewProspect((current)=> {
      let updated = duplicateObject(current)
      updated[key] = value
      return updated
    })
  }
  
  const saveNewProspect = () => {
    postRequest("field/prospect/save", {newProspect})
    .then((output)=> {
      setSelection({screen: "checkin", inputs: {}})
    }).catch((err)=> console.log({err}))
  }
  useEffect(()=>{
    setNewProspect(blankProspect)
  },[])
  if (user && newProspect) return(
    <div  style={layout}>
      <div style={{display:"grid", gridTemplateColumns: "1fr auto"}}>
        <div className="title">{"Add New Prospect"}</div>
        <button onClick={cancelNewProspect}>back</button>
      </div>
      <div style={formLayout}>
        <BasicInputKey name={"prospect_name"} value={newProspect.name} setFunc={updateProspect}
        label={"Name"} labelStyle={"inLineSmall"}/>
        <ValueSelectionDropKey name={"channel"} valueArray={channelTypes} current={newProspect.channel} selectFunc={updateProspect}
        label={"Channel"} labelStyle={"inLineSmall"}/>
        <ValueSelectionDropKey name={"status"} valueArray={contactTypes} current={newProspect.status} selectFunc={updateProspect}
        label={"Status"} labelStyle={"inLineSmall"}/>
        <NumberInputKey name={"sales_potential"} value={newProspect.sales_potential} setFunc={updateProspect} 
        label={"Potential Sales"} labelStyle={"inLineSmall"}/>
        <ValueSelectionDropKey name={"sales_difficulty"} valueArray={difficultyLevels} current={newProspect.sales_difficulty} selectFunc={updateProspect}
        label={"Sales Difficulty"} labelStyle={"inLineSmall"} className={difficultyClassName(newProspect.sales_difficulty)}/>
      </div>
      <div className="box outline" style={{height: "100%"}}>
        <Tabs titleArray={["Location", "Contact", "Notes"]} initialIndex={0} >
          <ProspectLocation setNewProspect={setNewProspect} newProspect={newProspect}/>
          <ProspectContact setNewProspect={setNewProspect} newProspect={newProspect} />
          <ProspectNotes setNewProspect={setNewProspect} newProspect={newProspect} updateProspect={updateProspect}/>
        </Tabs>
      </div>
      <div style={{display: "grid", gridTemplateColumns:"1fr auto", gap: "10px"}}>
        <button  onClick={saveNewProspect}>Save Prospect</button>
        <button  onClick={cancelNewProspect}>Cancel</button>
      </div>
    </div>
  )
  return <div>Loading Data</div>
}
function ProspectLocation ({setNewProspect, newProspect}) {
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
        setNewProspect((current)=> {
          let updated = duplicateObject(current)
          updated.location = locationUpdate
          return updated
        })
        setFindOptions(false)
        setOptions([])
      }).catch((err)=> console.log(err))
    }, (error)=> {
      console.log({error})
    })
  }
  const updateProspectLocation = (key, value) => {
    setNewProspect((current)=> {
      let updated = duplicateObject(current)
      updated["location"][key] = value
      return updated
    })
    setFindOptions(true)
  }
  const searchAddress = async () => {
    postRequest("client/geolocation/check", {
      clientId: undefined, stdInputs: {address: newProspect.location.address}
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
    setNewProspect((current)=> {
      let updated = duplicateObject(current)
      updated.location = updatedLocation
      return updated
    })
    setFindOptions(false)
    setOptions([])
  }

  return (
    <div className="box" style={{height: "100%", boxSizing: "border-box"}}>
      <div style={layout}>
        <button className={"small"} onClick={getCurrentAddress}>Use Current Location</button>        
        {options.length > 0? 
          <div className="" style={{height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "5px"}}>
            {options.map((loc, index)=> 
              <div className="small-text box full light" key={index} onClick={()=> selectOption(loc)}>
                {loc.address}
              </div>
            )}
          </div>
        : <div style={{display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "10px"}}>
            <TextAreaInputKey name={"address"} value={newProspect.location.address} setFunc={updateProspectLocation} />
            {findOptions? 
              <button className={"small"} onClick={searchAddress} disabled={!findOptions} style={{width: "70px", fontSize: "11pt"}}>
                Search Options
              </button>
            :<div></div>
            }
          </div>
        }
    </div>
  </div>
  )
}
function ProspectContact ({setNewProspect, newProspect}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px", height: "100%"}

  const updateProspectContact = (key, value) => {
    setNewProspect((current)=> {
      let updated = duplicateObject(current)
      updated["contact"][key] = value
      return updated
    })
  }

  return (
    <div className="box">
      <div style={layout}>
        <BasicInputKey name={"first_name"} value={newProspect.contact.first_name} setFunc={updateProspectContact}
        label={"First Name"} labelStyle={"inLineSmall"}/>        
        <BasicInputKey name={"last_name"} value={newProspect.contact.last_name} setFunc={updateProspectContact}
        label={"Last Name"} labelStyle={"inLineSmall"}/>     
        <BasicInputKey name={"email"} value={newProspect.contact.email} setFunc={updateProspectContact}
        label={"E-mail"} labelStyle={"inLineSmall"}/>    
        <BasicInputKey name={"phone"} value={newProspect.contact.phone} setFunc={updateProspectContact}
        label={"Phone"} labelStyle={"inLineSmall"}/>          
      </div>
  </div>
  )
}
function ProspectNotes ({newProspect, updateProspect}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px", height: "100%"}

  return (
    <div className="box">
      <div style={layout}>
        <TextAreaInputKey name={"notes"} value={newProspect.notes} setFunc={updateProspect} rows={4}/>        
      </div>
  </div>
  )
}

export default NewProspect

