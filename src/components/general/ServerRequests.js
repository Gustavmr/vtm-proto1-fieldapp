import Axios from "axios"

const getRequest = async (path) => {
  const output = await Axios({
    method: "GET",
    withCredentials: true,
    url: `${process.env.REACT_APP_API_ENDPOINT}${path}`,
  }).then((res) => {
    if (res.data) {
      if (res.data.status === "success") return res.data.output
      console.log("Data fail")
      console.log(res.data.output)
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

const postRequest = async (path, dataInputs) => {
  const output = await Axios({
    method: "POST",
    data: dataInputs,
    withCredentials: true,
    url: `${process.env.REACT_APP_API_ENDPOINT}${path}`,
  }).then((res) => {
    if (res.data) {
      if (res.data.status === "success") return res.data.output
      console.log("Data fail")
      console.log(res.data.output)
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