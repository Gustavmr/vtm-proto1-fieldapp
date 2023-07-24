/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState} from "react"
import { UserContext } from "./context/userContext"
import { ExpandableSection } from "./general/Expandables"
import { GeolocationUpdate } from "./general/GeolocationUpdate"
import { BasicInput, NumberInput, TextAreaInput } from "./general/inputs"
import { KpiMetric } from "./general/KpiMetric"
import { OverlayPopUp } from "./general/PopUpMenus"
import { postRequest } from "./general/ServerRequests"
import { SortingColumnArray } from "./general/sorters"
import { arraySorter, duplicateObject, formatValue, groupBySum } from "./general/supportFunctions"
import Tabs from "./general/Tabs"

function ClientMenu ({selection, setSelection}) {
  const {inputs: {client}} = selection
  const [user,] = useContext(UserContext)

  const clientCheckout = () => {
    setSelection((current)=> {
      let updated = duplicateObject(current)
      updated.screen = "checkout"
      return updated 
    })
  }
  const cancelCheckIn = () => {
    setSelection({screen: "clientSelect", inputs:{}})
  }
 
  const layout = {
    display: "grid", gridTemplateRows: "auto minmax(0, 1fr) auto", gap: "10px",
    height: "100%", padding: "10px 20px", boxSizing: "border-box"
  }

  useEffect(()=> {
    postRequest("field/clients/get_info", {clientId: client.client_id, user, type: client.type})
    .then((output)=> {
      setSelection((current)=> {
        let updated = duplicateObject(current)
        updated.inputs.client = output
        return updated
      })
    })
  },[])
  if (user && client) return(
    <div style={layout}>
      <div style={{display:"grid", gridTemplateRows: "auto auto"}}>
        <div style={{display:"grid", gridTemplateColumns: "1fr auto", gap: "5px"}}>
          <div className="subtitle overflow-ellipsis">{client.client_name}</div>
          <button className="full coral small" onClick={cancelCheckIn}>atras</button>
        </div>
      </div>
      <div className="box outline" style={{height: "100%"}}>
        <Tabs titleArray={["Perfil","Ventas", "Pendientes", "Actividad"]} boxStyle={{height: "100%"}} >
          <ProfileSection client={client} setSelection={setSelection} user={user}/>
          <SalesOverview client={client} user={user} />
          <ClientTasks client={client} />
          <ClientHistory client={client} />
        </Tabs>
      </div>
      <button onClick={clientCheckout}>CheckOut</button>
    </div>
  )
  return <div>Loading Data</div>
}

function ProfileSection ({client, user, setSelection}) {
  const [editLocation, setEditLocation] = useState(undefined)
  const statusColor = (status) => {
    if (status === "inactive" || status === "dropoutRisk" || status === "declining") return "red text-color"
    if (status === "growing") return "green text-color"
    return "text-color dark"
  }
  
  const layout = {
    display: "flex", flexDirection: "column", gap: "10px", 
    padding: "5px", height: "100%", boxSizing: "border-box", overflow: "auto"
  }  

  const applyUpdate = () => {
    postRequest("field/clients/update_location", {user, client, location: editLocation})
    .then((output)=>{ 
      console.log(output)
      setSelection((current)=> {
        let updated = duplicateObject(current)
        updated.inputs.client.address = duplicateObject(editLocation.address)
        updated.inputs.client.region = duplicateObject(output.region)

        setEditLocation(undefined)
        return updated
      })
    })
  }
  const cancelUpdate = () => setEditLocation(undefined)

  return (
    <div style={layout}>
      <div style={{display: "grid", gridTemplateColumns: "100px minmax(0, 1fr"}}>
        <div className="mid-text bold">Status</div>
        <div className={`box-section full shade ${statusColor(client.status)} `} style={{textAlign:"center"}}>
          <div>{client.status}</div>
        </div>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "100px minmax(0, 1fr"}}>
        <div className="mid-text bold">Segmento</div>
        <div className={`box-section full shade ${statusColor(client.status)} `} style={{textAlign:"center"}}>
          <div className="overflow-ellipsis">{client.channel} - {client.segment}</div>
        </div>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "100px minmax(0, 1fr"}}>
        <div className="mid-text bold">Zona</div>
        <div className={`box-section full shade `} style={{textAlign:"center"}}>
          <div>{client.region}</div>
        </div>
      </div>
      <div>
        <div style={{display:"flex", gap: "10px"}}>
          <div className="mid-text bold">Dirección</div>
          <div className="text-color blue flex-center-all" onClick={()=> setEditLocation(editLocation? undefined : {address: client.address})}>
            {'\u270E'}
          </div>
        </div>
        {editLocation ?
          <div>
            <GeolocationUpdate setLocation={setEditLocation} location={editLocation}/>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px"}}>
              <button className='full coral' onClick={cancelUpdate}>Cancelar </button>
              <button onClick={applyUpdate}>Guardar</button>
            </div>
          </div>
          :<div>
            <div className="small-text">{client.address}</div>
          </div>
        }
      </div>
    </div>
  )
}
// SALES SECTION
function SalesOverview ({client, user}) {
  const [editPotential, setEditPotential] = useState(false)
  const salesGrowth = {
    value: formatValue((client.sales || 0)/client.sales_py - 1, "+X.0%"), 
    color: client.sales >= client.sales_py? "green" : "coral"
  }

  const layout = {
    display: "grid", gridTemplateRows: "auto auto minmax(0, 1fr)", gap: "10px", 
    padding: "5px", height: "100%", boxSizing: "border-box", 
  }
 

  if (client) return (
    <div className="box" style={{padding: "10px", height: "100%", boxSizing: "border-box", overflow:"auto"}}>
      <div style={layout}>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
          <div >
            <div className="mid-text bold">Ventas</div>
            <div className={`box-section full shade `} style={{textAlign:"center"}}>
              <div>{formatValue(client.sales, "$auto")}</div>
            </div>
          </div>
          <div>
            <div className="mid-text bold">Vs Año Anterior</div>
            <div className={`box-section full shade ${salesGrowth.color}`} style={{textAlign:"center"}}>
              <div className={`text-color ${salesGrowth.color} bold`} style={{display: "flex", gap:"5px", justifyContent:"center"}}>
                {salesGrowth.value} 
                {/* <label className={`text-color ${salesGrowth.color} bold small-text`}>
                  {`(${formatValue(client.sales- client.sales_py, "$auto")})`}
                </label> */}
              </div>
            </div>
          </div>
        </div>
        <div >
          <div style={{display: "flex", gap: "10px"}}>
            <div className="mid-text bold">Potencial Capturado</div>
            <div className="text-color blue flex-center-all" onClick={()=> setEditPotential((current)=> !current)}>
              {' \u270E'}
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr auto", gap: "10px"}}>
            <KpiMetric value={client.sales/client.potential} format={"X%"}/>
            <div className="bold mid-text">{formatValue(client.potential, "$auto")}</div>
          </div>
          { editPotential  ? <UpdatePotential client={client} user={user} setEditPotential={setEditPotential}/> : <div></div>}
        </div>
        <ProductSales client={client}/>         
      </div>
    </div>
  )
}
function ProductSales ({client}) {
  const [displayTable, setDisplayTable] = useState(undefined)
  const tableHeaders = [
    {name: "item_name", display: "Producto", format: {textAlign: "left" , fontWeight: "bold", fontSize: "10pt"}},
    {name: "sales_py", display: "Año Previo", format: {textAlign: "center", fontWeight: "bold", fontSize: "10pt"}},
    {name: "sales_cy", display: "Año Actual", format: {textAlign: "center", fontWeight: "bold", fontSize: "10pt"}},
  ]

  const layout = {display: "flex", flexDirection: "column"}
  const tableLayout = {display: "flex", flexDirection: "column", gap: "3px"}
  const rowLayout = {display: "grid", gridTemplateColumns: "150px 1fr 1fr", padding: "3px"}
  
  useEffect(()=> {
    console.log(client.sales_by_product)
    let flatTable = duplicateObject(client.sales_by_product || [])
    flatTable = flatTable.map(({product = {}, sales_cy, sales_py}) => {
      return {
        product_name: product.product_name || product.product_id , 
        item_name: product.subcategory_name || product.subcategory_id || product.product_id ,sales_cy, sales_py
      }
    })
    const categoryTable = groupBySum(flatTable,["item_name"], ["sales_cy", "sales_py"])
    setDisplayTable(categoryTable)
  },[client])
  if (displayTable) return (
    <ExpandableSection title={"Ventas por Producto"}>
      <div style={layout}>
        {/* <div className="mid-text bold">Ventas por Producto</div> */}
        <SortingColumnArray nameFormatArray={tableHeaders} layout={rowLayout} setFunction={setDisplayTable} />
        <div className={`box-section outline shade`} style={tableLayout}>
          {displayTable.map(({item_name, sales_cy, sales_py}, index)=> 
            <div key={index} style={rowLayout}>
              <div className="small-text" style={{maxHeight: "35px", fontSize: "8pt", overflow: "hidden"}}>{item_name}</div>
              <div className="small-text flex-center-all" style={{textAlign: "right"}}>{formatValue( sales_py, "$auto")}</div>
              <div className={`full ${sales_cy >= sales_py? "green": "coral"} shade small-text flex-center-all`} style={{textAlign: "right"}}>
                {formatValue( sales_cy, "$auto")}
              </div>
            </div>
          )}
        </div>
      </div>
    </ExpandableSection>
  )
}
function UpdatePotential ({client, user, setEditPotential}) {
  const [newPotential, setNewPotential] = useState(duplicateObject(client.potential))
  const [notes, setNotes] = useState("")

  const contentLayout = {display: "flex", flexDirection: "column", gap:"10px"}

  const sendRequest = () => {
    const requestInfo = {
      date: new Date(),
      type: "updateRequest", // updateRequest, response,
      sub_type: "total potential",
      from_type: "field_user",
      from_id: user._id,
      to_type: "vtm general",
      to_id: "NA",
      content: {client_id: client.client_id, potential: newPotential, notes},
      response_status: "Not Reviewed",
    }
    postRequest("field/new_request", {requestInfo}).then((output)=> {
      console.log(output)
      setEditPotential(false)
    }).catch((err)=> console.log(err))
  } 

  return (
    
    <div className={`box-section outline shade`} style={contentLayout}>
      <div>
        <div className="small-text bold">Nuevo Potencial</div>
        <NumberInput value={newPotential} setFunc={setNewPotential} />
      </div>
      <div>
        <div className="small-text bold">Razón de Ajuste</div>
        <TextAreaInput value={notes} setFunc={setNotes} />
      </div>
      <div style={{display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px"}}>
        <button className="full coral" onClick={()=> setEditPotential(false)}>Cancelar</button>
        <button onClick={sendRequest}>Enviar</button>
      </div>
      
        {/* <div>{formatValue(client.potential, "$auto")}</div> */}
        {/* <div className="text-color dark bold">{formatValue(client.sales/client.potential, "X.0%")}</div> */}
    </div>
  )
}


function ClientTasks ({client}) {
  const layout = {display: "grid", gridTemplateRows: "auto auto auto", gap: "10px", padding: "10px"}

  return (
    <div className="box">
      <div style={layout}>
        <div style={{textAlign: "center"}}>No Tasks</div>
        <div></div>
      </div>
    </div>
  )
}
function ClientHistory ({client}) {
  const [selected, setSelected] = useState(undefined)
  const [descending, setDescending] = useState(true)
  const layout = {
    display: "grid", gridTemplateRows: "auto minmax(0, 1fr) auto", gap: "5px", padding: "10px", 
    boxSizing: "border-box", height: "100%", overflow: "auto"
  }
  const listLayout = {
    display: "flex", flexDirection: "column", gap: "5px", height: "100%", overflow: "auto"
  }
  const itemLayout = {display: "grid", gridTemplateColumns: "minmax(0, 1fr) 100px", gap: "10px"}
  // const sortedArray = arraySorter(client.history, "date")
  const popupLayout = {maxHeight: "70vh", width: "80vw", overflow: "auto"}

  const toggleDescending = () => {
    setDescending((current)=> !current)
  }
  const closePopup = () => setSelected(undefined)

  return (
    <div className="box" style={layout}>
      <div>
        <span className="small-text bold">Transaction & Visit History  </span>
        <button className="small" onClick={toggleDescending}>{descending? "descending": "ascending"}</button>
      </div>
      <div style={listLayout}>
        {arraySorter(client.history, "date", descending).map((item, index)=> 
          <div className="box-section full light" key={index} style={itemLayout} onClick={()=>setSelected(item)}>
            <div>
              <div className="small-text text-color dark">{displayDate(item.date)}</div>
              <div className="mid-text overflow-ellipsis">{item.type}</div>
            </div>
            <div className="bold flex-center-all">
              <div className="mid-text" style={{textAlign: "center"}}>{item.type === "Sale"? formatValue(item.display, "$auto") : item.display}</div>
            </div>
          </div>
        )}
      </div>
      {
        !selected ? <div></div> 
        : selected.type === "Sale" ?
        <OverlayPopUp title={"Sale Details"} setStatus={closePopup}>
          <div style={popupLayout}>
            {selected.by_product.map((prod, index) => 
              <div className="box-section full light" key={index} style={itemLayout}>
                <div className="small-text ">{prod.product_name}</div>
                <div className="flex-center-all bold">{formatValue(prod.sales, "$auto")}</div>
              </div>
            )}
          </div>
        </OverlayPopUp>
        :<OverlayPopUp title={"Visit Notes"} setStatus={closePopup}>
        </OverlayPopUp>
      }
    </div>

  )
}

export default ClientMenu

function displayDate(dateString) {
  const year = dateString.substring(0,4)
  let month = dateString.substring(5,7)
  let day = dateString.substring(8,10)

  // return `${year}${divider}${month}${divider}${day}`
  return `${year}/${month}/${day}`
}