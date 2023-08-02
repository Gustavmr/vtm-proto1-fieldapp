/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import CheckIn from "./CheckIn"
import CheckOut from "./Checkout"
import ClientMenu from "./ClientMenu"
import ClientSelect from "./ClientSelect"
import { UserContext } from "./context/userContext"
import ScreenToggler from "./general/ScreenToggler"
import { getRequest, postRequest } from "./general/ServerRequests"
import NewProspect from "./NewProspect"
import VisitLogs from "./VisitLogs"

function UserLanding () {
  const [user, setUser] = useContext(UserContext)
  const [selection, setSelection] = useState({screen: "checkin", inputs: {}})
  const [channelTypes, setChannelTypes] = useState(["NA"])
  const [visitTypes, setVisitTypes] = useState(["NA"])
  const [visitCounts, setVisitCounts] = useState(undefined)
  const [refresher, setRefresher] = useState(0)

  const layout = {height: "100%", maxHeight: "100%",width: "100%", display: "grid", gridTemplateRows: "auto minmax(0,1fr)", fontSize:"16pt"}
  const headerLayout = {padding: "10px", display: "grid", gridTemplateColumns: "1fr auto"}
  const menuLayout = {display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center", paddingBottom: "5px"}
  const screenLayout = {height: "100%", boxSizing: "border-box"}

  const checkinScreens = ["checkin", "clientSelect", "clientMenu", "checkout", "newProspect"]

  const logoutUser = () => {
    localStorage.removeItem('loginToken')
    setUser(undefined)
  };
  const refresh = () => setRefresher((current)=> current + 1)

  useEffect(()=> {
    postRequest("field/visits/get_log_counts", {user})
    .then((output)=> {
      setVisitCounts(output || {})      
    }).catch((err)=> console.log(err))
  }, [refresher])
  useEffect(()=> {
    postRequest("field/visits/types", {resourceId: user.resource_id})
    .then((output)=> {
      setVisitTypes(output)
    }).catch((err)=> console.log(err))
    postRequest("field/visits/get_log_counts", {user})
    .then((output)=> {
      setVisitCounts(output || {})      
    }).catch((err)=> console.log(err))
    getRequest("field/channels", {user})
    .then((output)=> {
      setChannelTypes(output)
    }).catch((err)=> console.log(err))
  },[])
  if (user && visitCounts && channelTypes) return(
    <div style={layout}>
      <div className="has-shadow" style={{zIndex: 2}}>
        <div style={headerLayout}>
          <div className="label mid-text">VTM Field</div>
          <div className="small label text-color coral" onClick={logoutUser}>Log out</div>
        </div>
        <div style={menuLayout}>
          <div className={`small-text text-color ${checkinScreens.includes(selection.screen)? "blue bold": "" }`}
          onClick={()=> setSelection({screen: "checkin", inputs: {}})} >
            Check-in
          </div>
          {/* <div className={`small-text text-color ${checkinScreens.includes(selection.screen)? "blue bold": "" }`}
          onClick={()=> setSelection({screen: "clientView", inputs: {}})} >
            Clientes
          </div> */}
          <div className={`small-text text-color ${selection.screen === "visitLogs"? "blue bold": "" }`} 
          onClick={()=> setSelection({screen: "visitLogs", inputs: {}})} >
            Visitas
          </div>
          <div className={`small-text text-color ${selection.screen === "tareas"? "blue bold": "" }`}>
            Tareas
          </div>
        </div>
      </div>
      <ScreenToggler screenNames={["checkin", "clientSelect", "clientMenu", "checkout", "newProspect", "visitLogs"]} selectedScreen={selection.screen} 
      className="full light" layout={screenLayout}>
        {/* Checkin flows */}
        <CheckIn setSelection={setSelection} visitCounts={visitCounts}/>
        <ClientSelect setSelection={setSelection} visitTypes={visitTypes} mode={"checkin"}/>
        <ClientMenu selection={selection} setSelection={setSelection} mode={"checkin"}/>
        <CheckOut selection={selection} setSelection={setSelection} refresh={refresh}/>
        <NewProspect selection={selection} setSelection={setSelection} channelTypes={channelTypes}/>
        {/* Logs menu */}
        <VisitLogs selection={selection} setSelection={setSelection} visitTypes={visitTypes} refresh={refresh}/>
        {/* TBD Tareas pendientes */}
      </ScreenToggler>
    </div>

  )
  return <div>Loading Data</div>
}


export default UserLanding
