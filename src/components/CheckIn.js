import { useContext } from "react"
import { UserContext } from "./context/userContext"

function CheckIn ({setSelection}) {
  const [user,] = useContext(UserContext)

  const layout = {
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px",
    height: "100%",
  }

  const goToClientSelect = () => {
    setSelection({screen: "clientSelect", inputs: {}})
  }

  if (user) return(
    <div className="flex-center-all" style={layout}>
      <div className="label">{user.username}</div>
      <button className="large" onClick={goToClientSelect} style={{width: "200px"}}>
        Client Check-in
      </button>
      <button className="large" style={{width: "200px"}}>
        New Client
      </button>
    </div>
  )
  return <div>Loading Data</div>
}

export default CheckIn

