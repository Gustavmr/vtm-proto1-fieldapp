import React, { useState, useContext } from "react"
import { UserContext } from "../context/userContext"
import Axios from "axios"

function Login ({setCurrentTab}) {
  const [email, setEmail] = useState("")
  const [data, setData] = useState(undefined)
  const [password, setPassword] = useState("")
  const [user, setUser] = useContext(UserContext)

  const checkUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.REACT_APP_API_ENDPOINT}user/`,
    }).then((res) => {
      setData(res.data);
      setUser(res.data);
      if (!user) { setCurrentTab('inProgress'); return;}
      if (!user.authorized) { setCurrentTab('inProgress')}
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
      }
    });
  };

  return (
    <div>
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

export default Login