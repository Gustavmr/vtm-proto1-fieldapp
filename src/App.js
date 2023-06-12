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

  const requestUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.REACT_APP_API_ENDPOINT}user`,
    }).then((res) => {
      setUser(res.data);
      console.log(res.data);
      setLoading(false)
    });
  };

  useEffect (() => {
    requestUser();
    console.log("test user request here")
  },[])
  
  if (loading) return (<LoadingScreen />)
  return (
    <div className="App-container">
      { !user ? <Auth /> : user.authorized ? <UserLanding /> : <Auth />}
    </div>
  )
}

export default App
