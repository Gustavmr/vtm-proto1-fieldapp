import { useState } from 'react'
import { TextAreaInputKey } from './inputs'
import { postRequest } from './ServerRequests'
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

export {GeolocationUpdate} 