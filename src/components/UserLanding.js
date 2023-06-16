import { useContext, useEffect, useState } from "react"
import CheckIn from "./CheckIn"
import CheckOut from "./Checkout"
import ClientMenu from "./ClientMenu"
import ClientSelect from "./ClientSelect"
import { UserContext } from "./context/userContext"
import ScreenToggler from "./general/ScreenToggler"
import VisitLogs from "./VisitLogs"

function UserLanding () {
  const [user, setUser] = useContext(UserContext)
  const [selection, setSelection] = useState({screen: "checkin", inputs: {}})

  const layout = {height: "100%", maxHeight: "100%",width: "100%", display: "grid", gridTemplateRows: "auto minmax(0,1fr)", fontSize:"16pt"}
  const headerLayout = {padding: "10px", display: "grid", gridTemplateColumns: "1fr auto", zIndex: 2}
  const screenLayout = {height: "100%", boxSizing: "border-box", }

  const logoutUser = () => {
    localStorage.removeItem('loginToken')
    setUser(undefined)
  };

  useEffect(()=> {
    console.log("landing")
  },[])
  if (user) return(
    <div style={layout}>
      <div className="has-shadow" style={headerLayout}>
        <div className="large-title">VTM Field</div>
        <button onClick={logoutUser}>Log out</button>
      </div>
      <ScreenToggler screenNames={["checkin", "clientSelect", "clientMenu", "checkout", "visitLogs"]} selectedScreen={selection.screen} 
      className="full light" style={screenLayout}>
        <CheckIn setSelection={setSelection}/>
        <ClientSelect setSelection={setSelection} />
        <ClientMenu selection={selection} setSelection={setSelection}/>
        <CheckOut selection={selection} setSelection={setSelection} />
        <VisitLogs selection={selection} setSelection={setSelection} />
      </ScreenToggler>
    </div>

  )
  return <div>Loading Data</div>
}


export default UserLanding
