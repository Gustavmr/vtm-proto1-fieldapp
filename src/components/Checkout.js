import { useContext, useState } from "react"
import { UserContext } from "./context/userContext"
import { TextAreaInput, ValueSelectionDrop } from "./general/inputs"
import { postRequest } from "./general/ServerRequests"
import { duplicateObject } from "./general/supportFunctions"

function CheckOut ({selection, setSelection}) {
  const {client} = selection.inputs
  const [visitOutcome, setVisitOutcome] = useState("NA")
  const [visitNotes, setVisitNotes] = useState("")

  const [user,] = useContext(UserContext)
  console.log({user})

  const layout = {
    display: "grid", gridTemplateRows: "auto 1fr auto auto auto auto 1fr", alignItems: "center", gap: "20px",
    height: "100%", width: "100%", padding: "20px", boxSizing: "border-box"
  }
  const buttonLayout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "20px"}

  const checkoutOptions = ["NA", "Client Not Available","Visit Successful", "Visit Unsuccessful"]

  const backToClientMenu = () => {
    console.log("checkout")
    setSelection((current)=> {
      let updated = duplicateObject(current)
      updated.screen = "clientMenu"
      return updated 
    })
  }
  const clientCheckOut = () => {
    postRequest("field/clients/log_visit", {...selection.inputs, visitOutcome, checkoutDate: new Date(), user, visitNotes})
    .then((output)=> {
      console.log({output})
      setSelection({screen: "checkin", inputs: {}})
    }).catch((err)=> console.log({err}))
  }
  const cancel = () => {
    console.log("cancel")
    setSelection({screen: "checkin", inputs: {}})
  }

  if (user && client) return(
    <div  style={layout}>
      <div style={{display:"grid", gridTemplateColumns: "1fr auto"}}>
        <div className="title overflow-ellipsis">{client.client_name}</div>
        <button onClick={backToClientMenu}>back</button>
      </div>
      <div style={buttonLayout}>
        <ValueSelectionDrop label={"Visit Outcome"} valueArray={checkoutOptions} current={visitOutcome} selectFunc={setVisitOutcome}/>
        <TextAreaInput label={"Visit Notes:"} rows={3} setFunc={setVisitNotes} />
        <button className="large" onClick={clientCheckOut}  disabled={!visitOutcome || visitOutcome === "NA"}>
          Client Check-out
        </button>
        <button className="large" onClick={cancel}>Cancel</button>
      </div>
      <div></div>
    </div>
  )
  return <div>Loading Data</div>
}

export default CheckOut

