import  "./auth.css"
import Register from "./Register"
import { useState } from "react"
import AuthInProgress from "./AuthInProgress"
import { postRequest } from "../general/ServerRequests"

function Auth ({checkUser}) {
  const [email, setEmail] = useState("")
  const [alert, setAlert] = useState(undefined)
  const [password, setPassword] = useState("")

  const contentLayout = { 
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    boxSizing: "border-box", margin: "0px", padding: "10px", height: "100%"
  }

  const loginUser = () => {
    postRequest('user/mobile/login', {email, password}, setAlert)
    .then((output, fail)=> {
      console.log({loginOutput: output, fail})
      if (output) {
        localStorage.setItem('loginToken', output.token)
        checkUser()
        return
      }
    }).catch((err)=> {
      console.log({loginError: err})
      setAlert("Something Went Wrong")
    })
  };

  return (
    <div style={contentLayout}>
      <div className="auth-form">
        <section> 
          <label htmlFor="email">Email</label>
          <input id="email" placeholder="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)}/>
        </section>
        <section> 
          <label htmlFor="password">Password</label>
          <input id="password" placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}/>
        </section>
        <button onClick={loginUser}>Log in</button>
        <button onClick={checkUser}>check protected</button>

        {alert? <div>{alert}</div> : <div></div>}
      </div>
      
      {/* <div>
        not a user yet? <span className="auth" onClick={() => setCurrentTab("register")}>register here</span> to get started on your VTM journey
      </div> */}
      {/* <div>
        <button type="custom" onClick={checkUser}>check user</button>
        {data? data.email : "no user"}
        {user? user.email : "no user"}
      </div> */}
    </div>
  )
}

export default Auth