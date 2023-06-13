
function sumObjectKeys (objectArray) {
  const refObject = objectArray[0]
  let output = {}
  for (const key in refObject) {
    output[key] = objectArray.reduce((total,current) => total + (current[key] || 0),0)
  }
  return(output)
}

function formatValue (value, type) {
  let formattedValue = value;
  if (!value && value !== 0) return "NA"
  switch(type) {
    case "auto":
      formattedValue = `${parseFloat((value).toFixed(0)).toLocaleString() || "0"}`
      if (Math.abs(Math.floor(value/1000))>=1) formattedValue = `${parseFloat((value/1000).toFixed(1)).toLocaleString() || "0"}k`
      if (Math.abs(Math.floor(value/1000000))>=1) formattedValue = `${parseFloat((value/1000000).toFixed(1)).toLocaleString() || "0"}M`;
      if (value === 0) formattedValue  = "0"     
      break;
    case "X":
      formattedValue = `${(value).toFixed(0) || "0"}`
      break;
    case "X.0":
      formattedValue = `${(value).toFixed(1) || "0"}`
      break;
    case "X.0 min":
      formattedValue = `${(value).toFixed(1) || "0"} min`
      break;
    case "x X.0":
      formattedValue = `x ${(value).toFixed(1) || "0"}`
      break;
    case "X%":
      formattedValue = `${(value*100).toFixed(0) || "0"}%`
      break;
    case "+X%":
      formattedValue = `${value>0? "+":""}${(value*100).toFixed(0) || "0"}%`
      break;
    case "X.0%":
      formattedValue = `${(value*100).toFixed(1) || "0"}%`
      break;
    case "+X.0%":
      formattedValue = `${value>0? "+":""}${(value*100).toFixed(1) || "0"}%`
      break;
    case "Xk":
      formattedValue = `${parseFloat((value/1000).toFixed(0)).toLocaleString() || "0"}k`
      break;
    case "X.0k":
      formattedValue = `${parseFloat((value/1000).toFixed(1)).toLocaleString() || "0"}k`
      break;
    case "$auto":
      formattedValue = `$${parseFloat((value).toFixed(0)).toLocaleString() || "0"}`
      if (Math.abs(Math.floor(value/1000))>=1) formattedValue = `$${parseFloat((value/1000).toFixed(1)).toLocaleString() || "0"}k`
      if (Math.abs(Math.floor(value/1000000))>=1) formattedValue = `$${parseFloat((value/1000000).toFixed(1)).toLocaleString() || "0"}M`;  
      if (value === 0) formattedValue  = "$0" 
      break;
    case "+$auto":
      formattedValue = `$${parseFloat((value).toFixed(0)).toLocaleString() || "0"}`
      if (Math.abs(Math.floor(value/1000))>=1) formattedValue = `$${parseFloat((value/1000).toFixed(1)).toLocaleString() || "0"}k`
      if (Math.abs(Math.floor(value/1000000))>=1) formattedValue = `$${parseFloat((value/1000000).toFixed(1)).toLocaleString() || "0"}M`;
      if (value === 0) formattedValue  = "$0" 
      formattedValue = `${value>0? "+":""}${formattedValue}`    
      break;
    case "$Xk":
      formattedValue = `$${parseFloat((value/1000).toFixed(0)).toLocaleString() || "0"}k`
      break;
    case "$X.0k":
      formattedValue = `$${parseFloat((value/1000).toFixed(1)).toLocaleString() || "0"}k`
      break;
    case "$XM":
      formattedValue = `$${parseFloat((value/1000000).toFixed(0)).toLocaleString() || "0"}M`
      break;
    case "$X.0M":
      formattedValue = `$${parseFloat((value/1000000).toFixed(1)).toLocaleString() || "0"}M`
      break;
    default:
  }
  return formattedValue
}

function duplicateObject (object) {
  if (!object) return undefined
  return JSON.parse(JSON.stringify(object));
}

const objectsEqual = (...objects) => objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]));

const uniqueValues = (array, variable) => {
  return [...new Set(array.map((item) => item[variable]))]
}

const mergeArrays = (arrayofArrays) => [].concat(...arrayofArrays)

const flattenParams = (paramsInput) => {
  const params = duplicateObject(paramsInput)
  let flatParams = {}
  flatParams.salary = params.salary
  if (params.bandwidth) {
    flatParams.bandwidthWeeksYear = params.bandwidth.weeks_year || 0
    flatParams.bandwidthHoursWeek = params.bandwidth.hours_week || 0
  }
  if (params.routine) {
    flatParams.routineAdmin = params.routine.admin || 0
    flatParams.routineField = params.routine.field || 0
    flatParams.routineOther = params.routine.other || 0
  }
  return flatParams
}

const summarizeByKeys = (objectArray, aggregationKeys, valueObject) => {
  const indexedArray = objectArray.map((row) => {
    const values = aggregationKeys.map((filterKey)=> Object.entries(row).find(([key, value])=> key === filterKey)[1]) 
    const concatKey = values.join("|")
    return {...row, concatKey}
  })
  const uniqueIndexes = uniqueValues(indexedArray, "concatKey")

  let outputArray = uniqueIndexes.map((concatKey) => {
    let outputElement = {}
    concatKey.split("|").forEach((value, index)=> outputElement[aggregationKeys[index]] = value)
    const filteredValueObjects = indexedArray.filter((item)=> concatKey === item.concatKey).map((row)=> row[valueObject])
    outputElement[valueObject] = sumObjectKeys(filteredValueObjects)
    return outputElement
  })
  return outputArray
}
const uniqueMultipeValues = (objectArray, aggregationKeys) => {
  const indexedArray = objectArray.map((row) => {
    const values = aggregationKeys.map((filterKey)=> Object.entries(row).find(([key, value])=> key === filterKey)[1]) 
    const concatKey = values.join("|")
    return {...row, concatKey}
  })
  const uniqueIndexes = [...new Set(indexedArray.map((item) => item["concatKey"]))] // Unique values

  let outputArray = uniqueIndexes.map((concatKey) => {
    let outputElement = {}
    concatKey.split("|").forEach((value, index)=> outputElement[aggregationKeys[index]] = value)
    // const filteredValueObjects = indexedArray.filter((item)=> concatKey === item.concatKey).map((row)=> row[valueObject])
    // outputElement[valueObject] = sumObjectKeys(filteredValueObjects)
    return outputElement
  })
  return outputArray
}

const arraySorter = (objectArray, sortVariableName, descending = true) => {
  const testValue = objectArray.find((item)=> item[sortVariableName])
  if (!testValue) {
    console.log("No items found with this variable name")
    return objectArray
  }
  // const type = testValue[sortVariableName].isFinite()? "number" : typeof(testValue[sortVariableName]) === "string"? "string" : undefined

  if (testValue[sortVariableName] && (typeof(testValue[sortVariableName]) === "number" || typeof(testValue[sortVariableName]) === "boolean")) {
    if (descending) return objectArray.sort((a,b) => b[sortVariableName]-a[sortVariableName])
    return objectArray.sort((a,b) => a[sortVariableName]-b[sortVariableName])
  }
  if (testValue[sortVariableName] && typeof(testValue[sortVariableName]) === "string") {
    if (descending) return objectArray.sort((a,b) => b[sortVariableName].localeCompare(a[sortVariableName]))
    return objectArray.sort((a,b) => a[sortVariableName].localeCompare(b[sortVariableName]))
  }
}

function matchAndReplace(initialArray, ReplacementArray, matchingVariableArray, replacementVariableArray) {
  // Replaces (replacementVariableArray) variables in an initial array, to those from a replacement array 
  // where all (matchingVariableArray) variables match
  const updatedArray = duplicateObject(initialArray)
  ReplacementArray.forEach((replacement)=> updatedArray.forEach((initial, index)=>{ 
    const matchCheck = matchingVariableArray.every((variable) => initial[variable] === replacement[variable])
    if (matchCheck) {
      replacementVariableArray.forEach((variable)=> {
        if (variable === "update" ) updatedArray[index].update = updatedArray[index].update === "add"? "add" : replacement[variable]
        else {
          updatedArray[index][variable] = replacement[variable]
        }
      })
    }
  })) 
  return updatedArray
}

function sumObjectValues (valueObject) {
  const valueArray = Object.entries(valueObject).map(([,value])=> value)
  const output = valueArray.reduce((acum, curr)=> acum + curr, 0)
  return output
}

export {
  formatValue, duplicateObject, objectsEqual, flattenParams, uniqueValues, uniqueMultipeValues, mergeArrays, summarizeByKeys, 
  matchAndReplace, arraySorter, sumObjectValues, sumObjectKeys
}
