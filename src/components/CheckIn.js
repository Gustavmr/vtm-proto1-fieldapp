import { useContext } from "react"
import { UserContext } from "./context/userContext"

function CheckIn ({setSelection}) {
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
    console.log("Visit History")
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
        <div>{"Visits 12 months"}</div>
        <div>{"Visits 1 month"}</div>
        <div>{"Progress vs annual plan"}</div>
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

