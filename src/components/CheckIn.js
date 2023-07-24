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
  const goToNewProspect = () => {
    setSelection({screen: "newProspect", inputs: {}})
  }

  if (user) return(
    <div style={layout}>
      <div></div>
      <div className="box" style={userBox}>
        <div className="title">{user.displayName}</div>
        <div style={{display: "flex", gap: "5px"}}>
          <span className="text-bubble mid-text"> {visitCounts.visits_1m || 0}</span>
          <span className="small-text flex-center-all">Visits last month</span>
        </div>
        <div style={{display: "flex", gap: "5px"}}>
          <span className="text-bubble mid-text"> {visitCounts.visits_3m || 0}</span>
          <span className="small-text flex-center-all">Visits in 3 months</span>
        </div>
        <div style={{display: "flex", gap: "5px"}}>
          <span className="text-bubble mid-text"> {visitCounts.visits_12m || 0}</span>
          <span className="small-text flex-center-all">Visits in 12 months</span>
        </div>
      </div>
      <div style={buttonLayout}>
        <button className onClick={goToClientSelect}>
          Check-in Cliente Actual
        </button>
        <button onClick={goToNewProspect}>
          Agregar Prospecto
        </button>
      </div>
    </div>
  )
  return <div>Loading Data</div>
}

export default CheckIn

