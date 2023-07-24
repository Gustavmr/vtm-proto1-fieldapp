import { useContext, useState } from "react"
import { UserContext } from "./context/userContext"
import { TextAreaInput, ValueSelectionDrop } from "./general/inputs"
import { postRequest } from "./general/ServerRequests"
import { duplicateObject } from "./general/supportFunctions"

function CheckOut ({selection, setSelection, refresh}) {
  const {client} = selection.inputs
  const [visitOutcome, setVisitOutcome] = useState("NA")
  const [visitNotes, setVisitNotes] = useState("")

  const [user,] = useContext(UserContext)

  const layout = {
    display: "grid", gridTemplateRows: "auto 1fr auto auto auto auto 1fr", alignItems: "center", gap: "20px",
    height: "100%", width: "100%", padding: "10px 20px", boxSizing: "border-box"
  }
  const buttonLayout = {display: "grid", gridTemplateRows:"auto auto auto auto", gap: "20px"}

  const checkoutOptions = ["NA", "Client Not Available","Visit Successful", "Visit Unsuccessful"]

  const backToClientMenu = () => {
    setSelection((current)=> {
      let updated = duplicateObject(current)
      updated.screen = "clientMenu"
      return updated 
    })
  }
  const clientCheckOut = () => {
    postRequest("field/clients/log_visit", {...selection.inputs, visitOutcome, checkoutDate: new Date(), user, visitNotes})
    .then((output)=> {
      setSelection({screen: "checkin", inputs: {}})
      refresh()
    }).catch((err)=> console.log({err}))
  }
  const cancel = () => {
    setSelection({screen: "checkin", inputs: {}})
  }

  if (user && client) return(
    <div  style={layout}>
      <div style={{display:"grid", gridTemplateColumns: "1fr auto"}}>
        <div className="subtitle overflow-ellipsis">{client.client_name}</div>
        <button className="small full coral" onClick={backToClientMenu}>atras</button>
      </div>
      <div style={buttonLayout}>
        <ValueSelectionDrop label={"Resultado de Visita"} valueArray={checkoutOptions} current={visitOutcome} selectFunc={setVisitOutcome}/>
        <TextAreaInput label={"Notas de Visita:"} rows={3} setFunc={setVisitNotes} />
        <button className="large" onClick={clientCheckOut}  disabled={!visitOutcome || visitOutcome === "NA"}>
          Check-out
        </button>
        <button className="large" onClick={cancel}>Cancelar</button>
      </div>
      <div></div>
    </div>
  )
  return <div>Loading Data</div>
}

export default CheckOut

