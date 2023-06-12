import { useContext, useEffect, useState } from "react"
import { UserContext } from "./context/userContext"
import { postRequest } from "./general/ServerRequests"

function CheckIn () {
  const [user,] = useContext(UserContext)
  const [locationStatus, setLocationStatus] = useState(true)

  const layout = {height: "100vh", width: "100vw"}
  const checkClients = () => {
    navigator.geolocation.getCurrentPosition((position)=> {
      const lat =  position.coords.latitude
      const lng = position.coords.longitude
      const areaKm = 5 
      // const limitCoordinates = coordinationBoundaries (25.674939,-100.309731, 2)
      const limitCoordinates = coordinationBoundaries (lat, lng, areaKm)
      console.log({limitCoordinates})
      postRequest("field/clients/search_location", {limitCoordinates})
      .then((output)=> {
        console.log(output)
      }).catch((err)=> console.log(err))
    }, (error)=> {
      console.log({error})
    })
  }

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=> {
      console.log({position, lat: position.coords.latitude, lng: position.coords.longitude})
      setLocationStatus(true)
    }, (error)=> {
      console.log({error})
      setLocationStatus(false)
    })
  },[])
  if (user) return(
    <div className="flex-center-all" style={layout}>
      <div>{user.username}</div>
      {locationStatus? <div></div> : <div>Please enable location services</div>}
      <button onClick={checkClients}>Client Check-in</button>
      <button>New Client</button>
    </div>
  )
  return <div>Loading Data</div>
}

export default CheckIn

function coordinationBoundaries(lat, lng, km) {
  const lat_min = lat - km/110.574
  const lat_max = lat + km/110.574
  const lng_min = lng - km/(111.320*Math.cos(lat_min*0.0174533))
  const lng_max = lng + km/(111.320*Math.cos(lat_max*0.0174533))
  return  {lat, lat_min, lat_max, lng, lng_min, lng_max}
}