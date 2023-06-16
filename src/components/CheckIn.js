import { useContext } from "react"
import { UserContext } from "./context/userContext"

function CheckIn ({setSelection, visitCounts}) {
  const [user,] = useContext(UserContext)

  const layout = {
    display: "flex", flexDirection: "column", gap: "20px",
    alignItems: "center"
  }
  const userBox = {display: "grid", gridTemplateRows: "auto auto auto", padding: "20px", gap: "10px",  width: "min(500px , 70%)"}
  const buttonLayout = {display: "flex", flexDirection:"column", gap: "20px", width: "min(500px , 70%)"}


  const goToClientSelect = () => {
    setSelection({screen: "clientSelect", inputs: {}})
  }
  const goToVisitLog = () => {
    setSelection({screen: "visitLogs", inputs: {}})
    // setSelection({screen: "clientSelect", inputs: {}})
  }
  const goToNewClient = () => {
    console.log("New Prospect")
    // setSelection({screen: "clientSelect", inputs: {}})
  }

  if (user) return(
    <div style={layout}>
      <div></div>
      <div className="box" style={userBox}>
        <div className="title">{user.displayName}</div>
        <div style={{display: "flex", gap: "5px"}}>
          <span className="text-bubble mid-text"> {visitCounts.visits_1m}</span>
          <span className="small-text flex-center-all">Visits last month</span>
        </div>
        <div style={{display: "flex", gap: "5px"}}>
          <span className="text-bubble mid-text"> {visitCounts.visits_3m}</span>
          <span className="small-text flex-center-all">Visits in 3 months</span>
        </div>
        <div style={{display: "flex", gap: "5px"}}>
          <span className="text-bubble mid-text"> {visitCounts.visits_12m}</span>
          <span className="small-text flex-center-all">Visits in 12 months</span>
        </div>
        <button className={"full dark"} onClick={goToVisitLog}>
          Visit Log
        </button>
      </div>
      <div style={buttonLayout}>
        <button className onClick={goToClientSelect}>
          Client Check-in
        </button>
        <button onClick={goToNewClient}>
          New Prospect
        </button>
      </div>
    </div>
  )
  return <div>Loading Data</div>
}

export default CheckIn

