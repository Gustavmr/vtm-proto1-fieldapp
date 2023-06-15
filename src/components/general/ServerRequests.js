import Axios from "axios"

const getRequest = async (path, setFail) => {
  const output = await Axios({
    method: "GET",
    withCredentials: true,
    url: process.env.NODE_ENV === "production"? `${process.env.REACT_APP_API_ENDPOINT}${path}` : `http://localhost:8081/${path}`,
  }).then((res) => {
    if (res.data) {
      if (res.data.status === "success") return res.data.output
      console.log("Data fail")
      console.log(res.data.output)
      if (setFail) setFail(res.data.output.message)
      return undefined
    } else {
      console.log("Data not sent")
      return undefined
    }
  }).catch((err) =>{
    console.log(err)
    return undefined
  })
  return output
}

const postRequest = async (path, dataInputs, setFail) => {
  const output = await Axios({
    method: "POST",
    data: dataInputs,
    withCredentials: true,
    url: process.env.NODE_ENV === "production"? `${process.env.REACT_APP_API_ENDPOINT}${path}` : `http://localhost:8081/${path}`,
  }).then((res) => {
    if (res.data) {
      if (res.data.status === "success") return res.data.output
      console.log("Data fail")
      console.log(res.data.output)
      if (setFail) setFail(res.data.output.message)
      return undefined
    } 
    console.log("Data not sent")
    return undefined
  }).catch((err) =>{
    console.log(err)
    return undefined
  })
  return output
}


export {getRequest, postRequest}