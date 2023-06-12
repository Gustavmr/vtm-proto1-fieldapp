import React from "react"

function AuthInProgress ({setCurrentTab}) {
  return (
    <div>
      <div>
        Your authorization request is in progress
      </div>
      <div>
        We are reviewing your registration request and will get back to you promptly. Thank you for registering for Zenga.
      </div>
      <div onClick={() => setCurrentTab('login')}>
        go back to login
      </div>
    </div>
  )
}

export default AuthInProgress