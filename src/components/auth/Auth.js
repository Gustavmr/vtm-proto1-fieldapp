import Register from "./Register"
import { useState } from "react"
import AuthInProgress from "./AuthInProgress"
import { postRequest } from "../general/ServerRequests"
import { BasicInput, PasswordInput } from "../general/inputs"

function Auth ({checkUser}) {
  const [email, setEmail] = useState("")
  const [alert, setAlert] = useState(undefined)
  const [password, setPassword] = useState("")

  // const contentLayout = { 
  //   display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  //   boxSizing: "border-box", margin: "0px", padding: "10px", height: "100%"
  // }
  const contentLayout = { 
    display: "grid", gridTemplateRows: "auto 1fr auto", 
    margin: "0px",  height: "100%", justifyItems: "center"
  }
  const formLayout = {
    display: "flex", flexDirection:"column", gap: "20px", width: "min(500px , 70%)", justifyContent: "center",
    padding: "10px"
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
      <div></div>
      <div style={formLayout}>
        <div> 
          <label htmlFor="email" className="mid-text bold">Email</label>
          <BasicInput value={email} setFunc={setEmail}/>
        </div>
        <section> 
          <label htmlFor="password" className="mid-text bold">Password</label>
          <PasswordInput value={password} setFunc={setPassword} />
          {/* <input id="password" placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}/> */}
        </section>
        <button onClick={loginUser}>Log in</button>
        {alert? 
          <div className="box-section full shade coral text-color small-text">{alert}</div> 
          : <div className="box small-text text-color-inv">_</div>
        }
      </div>
      <div></div>
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