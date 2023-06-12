import React, { useState } from "react"
import Axios from "axios"

const Register = ({setCurrentTab}) => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const registerUser = () => {
    Axios({
      method: "POST",
      data: {email, password, firstName, lastName},
      withCredentials: true,
      url: `${process.env.REACT_APP_API_ENDPOINT}user/register`,
    }).then((res) => {
      if (res.data === 'User Created') setCurrentTab('inProgress');
    });
  };
  
  return (
    <div>
      <div className="auth-form">
        <section>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" placeholder="First Name" value={firstName}
          onChange={e => setFirstName(e.target.value)} />
        </section>
        <section>
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" placeholder="Last Name" value={lastName}
          onChange={e => setLastName(e.target.value)}/>
        </section>
        <section>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} />
        </section>
        <section>
          <label htmlFor="password">Password</label>
          <input id="password" placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)} />
        </section>
        <button type="submit" onClick={registerUser}>Register</button>
      </div>

      <div>
        Already a user? <span className="auth" onClick={() => setCurrentTab("login")}>login here</span> to jump in!
      </div>
    </div>
  )
}

export default Register