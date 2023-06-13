import { useContext, useEffect, useState } from "react"
import CheckIn from "./CheckIn"
import ClientSelect from "./ClientSelect"
import { UserContext } from "./context/userContext"
import ScreenToggler from "./general/ScreenToggler"

function UserLanding () {
  const [user,] = useContext(UserContext)
  const [selection, setSelection] = useState({screen: "checkin", inputs: {}})

  const layout = {height: "100vh", width: "100vw", display: "grid", gridTemplateRows: "auto minmax(0,1fr)"}
  const headerLayout = {padding: "5px", display: "grid", gridTemplateColumns: "1fr auto", zIndex: 2}
  const screenLayout = {height: "100%", boxSizing: "border-box", }

  useEffect(()=> {
    console.log("landing")
  },[])
  if (user) return(
    <div style={layout}>
      <div className="has-shadow" style={headerLayout}>
        <div className="large-title">VTM Field</div>
        <button>Log out</button>
      </div>
      <ScreenToggler screenNames={["checkin", "clientSelect", "clientMenu", "map", "checkout"]} selectedScreen={selection.screen} 
      className="full light" style={screenLayout}>
        <CheckIn setSelection={setSelection}/>
        <ClientSelect setSelection={setSelection} />
        <div>Client Select Screen</div>
        <div>Client Menu</div>
        <div>Check Out</div>
      </ScreenToggler>
    </div>

  )
  return <div>Loading Data</div>
}


export default UserLanding
