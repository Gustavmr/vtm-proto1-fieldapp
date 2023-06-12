import React, { useContext } from "react"
import { UserContext } from "../context/userContext"
import Axios from "axios"

function Landing () {
    const [user, setUser] = useContext(UserContext)
    
    const testOrg = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: `${process.env.REACT_APP_API_ENDPOINT}user/org`,
          }).then((res) => {
            console.log(res);
          });
    }

    return user ? ( 
        <div> 
            <div>Welcome {user.username} ! </div>
            <button onClick={testOrg}>get org info</button> 
        </div>
    ) : ( <div> Error Loading User details </div>) 
}

export default Landing