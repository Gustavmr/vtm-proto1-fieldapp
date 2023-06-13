import { useEffect, useState } from "react"
import { arraySorter, duplicateObject } from "./supportFunctions"

function SortingColumn ({title, variableName ,setFunction, reset, format}) {
  const [descending, setDescending] = useState(true)
  const sortData = () => {
    setFunction((current)=>{
      let updatedArray = duplicateObject(current)
      updatedArray = arraySorter(updatedArray, variableName, descending)
      setDescending((current)=> {
        if (current === undefined) return true
        console.log(current, !current)
        return  !current
      })
      return updatedArray
    })
  }
  useEffect(()=>{
    setDescending(undefined)
  },[reset])
  return (
      <div onClick={sortData} style={format}><span>{descending === undefined? "" : descending ? '\u2191' : '\u2193' }</span>{title}</div>
  )
}

function SortingColumnArray ({nameFormatArray, layout ,setFunction, reset, subsetVariableName}) {
  const [selectedVariable, setSelectedVariable] = useState(undefined)
  const [descending, setDescending] = useState(true)
  const sortData = (name) => {
    setFunction((current)=>{
      let updatedArray = duplicateObject(current)
      const descendingUpdate = name !== selectedVariable? true :  !descending
      updatedArray = arraySorter(updatedArray, name, descendingUpdate)
      if (subsetVariableName) {
        updatedArray = updatedArray.map((row)=> {
          row[subsetVariableName] = arraySorter(row[subsetVariableName], name, descendingUpdate)
          return row
        })
      }
      setDescending(descendingUpdate)
      return updatedArray
    })
    setSelectedVariable(name)
  }
  useEffect(()=>{
    setDescending(undefined)
  },[reset])
  return (
    <div style={layout}>
      {nameFormatArray.map(({name, display,format})=> 
        <div onClick={()=>sortData(name)} style={format} key={name}>
          <span>{selectedVariable !== name? "" : descending ? '\u2191' : '\u2193' }</span>{display}
        </div>
      )}
    </div>
  )
}

export {SortingColumn, SortingColumnArray}