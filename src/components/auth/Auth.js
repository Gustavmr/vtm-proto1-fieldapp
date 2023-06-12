import  "./auth.css"
import Register from "./Register"
import { useContext, useState } from "react"
import { UserContext } from "../context/userContext"
import Axios from "axios"
import AuthInProgress from "./AuthInProgress"

function Auth () {
  const [email, setEmail] = useState("")
  const [alert, setAlert] = useState(undefined)
  const [password, setPassword] = useState("")
  const [user, setUser] = useContext(UserContext)

  const contentLayout = { 
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    boxSizing: "border-box", margin: "0px", padding: "10px", height: "100%"
  }

  const checkUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.REACT_APP_API_ENDPOINT}user/`,
    }).then((res) => {
      console.log(res.data)
      setUser(res.data);
    });
  };

  const loginUser = () => {
    Axios({
      method: "POST",
      data: {email, password},
      withCredentials: true,
      url: `${process.env.REACT_APP_API_ENDPOINT}user/login`,
    }).then((res) => {
      if (res.data === 'Successfully Authenticated') {
        checkUser()
        setAlert(undefined)
      } else {
        setAlert(res.data)
      }
    });
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