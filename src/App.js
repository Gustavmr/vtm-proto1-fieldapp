/* eslint-disable react-hooks/exhaustive-deps */
import './styles/App.css'
import './styles/boxes.css'
import './styles/texts.css'
import './styles/buttons.css'
import './styles/effects.css'
import { useContext,  useEffect, useState } from "react"
import { UserContext } from "./components/context/userContext"
import UserLanding from './components/UserLanding'
import Axios from 'axios'
import Auth from "./components/auth/Auth"
import LoadingScreen from './components/general/LoadingScreen'

function App() {
  const [user, setUser] = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  const checkUser = () => {
    const token = localStorage.getItem('loginToken')

    Axios.get(
      `${process.env.NODE_ENV === "production"? `${process.env.REACT_APP_API_ENDPOINT}` : "http://localhost:8081/"}user/mobile/protected`,
      {headers: {Authorization: token}}
    ).then((res) => {
      console.log({checkSuccess: res.data})
      if (res.data.output && res.data.output.email) setUser(res.data.output);
      setLoading(false)
    }).catch((err)=> {
      console.log({checkError: err})
      setUser(undefined)
      setLoading(false)
    });
  };

  useEffect (() => {
    checkUser();
  },[])
  
  if (loading) return (<LoadingScreen />)
  return (
    <div className="App-container">
      { !user ? <Auth checkUser={checkUser}/> : user.authorized ? <UserLanding /> : <Auth checkUser={checkUser}/>}
    </div>
  )
}

export default App
