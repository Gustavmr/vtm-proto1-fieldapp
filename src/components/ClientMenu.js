/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState} from "react"
import { UserContext } from "./context/userContext"
import { GrowthCharts } from "./general/charts"
import { ExpandableSection } from "./general/Expandables"
import { GeolocationUpdate } from "./general/GeolocationUpdate"
import { NumberInput, TextAreaInput, ValueSelectionDrop } from "./general/inputs"
import { KpiMetric } from "./general/KpiMetric"
import { OverlayPopUp } from "./general/PopUpMenus"
import { getRequest, postRequest } from "./general/ServerRequests"
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
        console.log(output)
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
    padding: "10px", height: "100%", boxSizing: "border-box", overflow: "auto"
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
  const layout = {
    display: "flex", flexDirection: "Column", gap: "10px", 
    padding: "10px", height: "100%", boxSizing: "border-box",  overflow: "auto"
  }
 
  if (client && client.type === "Current") return (
    <div className="box" style={layout}>
      <div className="box full shade" style={{padding: "5px"}}>
        <div className="mid-text bold">Ventas</div>
        <GrowthCharts TtmInputs={client.ttm} />
      </div>
      <div className="box full shade" style={{padding: "5px"}}>
        <div style={{display: "flex", gap: "10px"}}>
          <div className="mid-text bold">Potencial Capturado</div>
          <div></div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr auto", gap: "10px"}}>
          <KpiMetric value={client.sales/client.potential} format={"X%"}/>
          <div className="bold mid-text">{formatValue(client.potential, "$auto")}</div>
        </div>
      </div>
      <ProductSales client={client}/>     
      <ProductPotential client={client} />    
    </div>
  )
  if (client && client.type === "Prospect") return (
    <div className="box flex-center-all" style={{...layout, textAlign: "center"}}>
      Nuevo Prospecto - No tiene Historial de Ventas
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
  const rowLayout = {display: "grid", gridTemplateColumns: "130px 1fr 1fr", padding: "3px"}
  
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

function ProductPotential ({client}) {
  const [displayTable, setDisplayTable] = useState(undefined)
  const [addProduct, setAddProduct] = useState(false)
  const tableHeaders = [
    {name: "item_name", display: "Producto", format: {textAlign: "left" , fontWeight: "bold", fontSize: "10pt"}},
    {name: "current_sales", display: "Actuales", format: {textAlign: "center", fontWeight: "bold", fontSize: "10pt"}},
    {name: "sales_potential", display: "Potencial", format: {textAlign: "center", fontWeight: "bold", fontSize: "10pt"}},
  ]

  const layout = {display: "flex", flexDirection: "column"}
  const tableLayout = {display: "flex", flexDirection: "column", gap: "3px"}
  const rowLayout = {display: "grid", gridTemplateColumns: "130px 1fr 1fr 18px", padding: "3px"}
  
  useEffect(()=> {
    let flatTable = duplicateObject(client.potential_by_product || [])
    setDisplayTable(flatTable)
  },[client])
  if (displayTable) return (
    <ExpandableSection title={"Potencial por Producto"}>
      <div style={layout}>
        {/* <div className="mid-text bold">Ventas por Producto</div> */}
        <SortingColumnArray nameFormatArray={tableHeaders} layout={rowLayout} setFunction={setDisplayTable} />
        <div className={`box-section outline shade`} style={tableLayout}>
          {displayTable.map((prod, index)=> 
            <PotentialProductRow key={index} prod={prod} client={client} />
          )}
        </div>
        <button onClick={()=> setAddProduct(true)}>Agregar Producto</button>
      </div>
      {addProduct ? 
        <OverlayPopUp title={"Agregar Producto"} setStatus={setAddProduct} layout={{width: "80%"}}>
          <AddProductPopup client={client} currentPotentials={displayTable} setStatus={setAddProduct}/>
        </OverlayPopUp>
        :<div></div>
      }
    </ExpandableSection>
  )
}
function PotentialProductRow ({prod, client}) {
  const [editPotential, setEditPotential] = useState(false)

  const closeEditPotential = () => setEditPotential(false)
  const rowLayout = {display: "grid", gridTemplateColumns: "130px 1fr 1fr 18px", padding: "3px"}
  const {group_name, current_sales, sales_potential} = prod

  return (
    <div>
      <div style={rowLayout}>
        <div className="small-text" style={{maxHeight: "35px", fontSize: "8pt", overflow: "hidden"}}>{group_name}</div>
        <div className="small-text flex-center-all" style={{textAlign: "right"}}>
          {formatValue( current_sales, "$auto")}
        </div>
        <div className="small-text flex-center-all" style={{textAlign: "right"}}>
          {formatValue( sales_potential, "$auto")}
        </div>
        {/* <div className="text-color blue flex-center-all" onClick={()=> console.log({edit: product_attributes})}> */}
        <div className="text-color blue flex-center-all" onClick={()=> setEditPotential((current)=> !current)}>
          {'\u270E'}
        </div>
      </div>
      { editPotential  ? 
        <OverlayPopUp title={"Solicitar Ajuste de Potencial"} setStatus={closeEditPotential} layout={{width: "90%"}}>
          <UpdatePotential client={client} product={prod} setEditPotential={setEditPotential}/>
        </OverlayPopUp>
        : <div></div>}
    </div>
  )
}
function UpdatePotential ({client, product, setEditPotential}) {
  const [newPotential, setNewPotential] = useState(duplicateObject(product.sales_potential))
  const [notes, setNotes] = useState("")
  const [user,] = useContext(UserContext)


  const contentLayout = {display: "flex", flexDirection: "column", gap:"10px", paddingTop: "10px"}

  const sendRequest = () => {
    const requestInfo = {
      date: new Date(),
      type: "updateRequest", // updateRequest, response,
      sub_type: "updateProductPotential",
      from_type: "field_user",
      from_id: user._id,
      from_name: user.email,
      to_type: "vtm",
      to_id: ["potential_manager"],
      content: {
        client_id: client.client_id, 
        group_key: product.group_key, group_name: product.group_name, 
        sales_potential: newPotential, previous_potential: product.sales_potential, notes
      },
      response_status: "Not Reviewed",
    }
    console.log({requestInfo})
    postRequest("field/new_request", {requestInfo}).then((output)=> {
      console.log(output)
      setEditPotential(false)
    }).catch((err)=> console.log(err))
  } 

  return (
    
    <div  style={contentLayout}>
      <div>
        <div className="small-text bold">Tipo de Producto</div>
        <div className="small-text">{product.group_name}</div>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px"}}>
        <div>
          <div className="small-text bold">Actual</div>
          <div className="small-text">{formatValue(product.sales_potential,"$auto")}</div>
        </div>
        <div>
          <div className="small-text bold">Nuevo Potencial</div>
          <NumberInput value={newPotential} setFunc={setNewPotential} />
        </div>
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
function AddProductPopup ({client, currentPotentials, setStatus}) {
  const [products, setProducts] = useState(undefined)
  const [dropOptions, setDropOptions] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(undefined)
  const [updateValue, setUpdateValue] = useState(0)
  const [notes, setNotes] = useState("")
  const [user,] = useContext(UserContext)

  const layout = {display: "flex", flexDirection: "column", gap: "5px"}

  const sendRequest = () => {
    const productInfo = products.find(({group_name})=> selectedProduct === group_name)
    const requestInfo = {
      date: new Date(),
      type: "updateRequest", // updateRequest, response,
      sub_type: "addProductPotential",
      from_type: "field_user",
      from_id: user._id,
      from_name: user.email,
      to_type: "vtm",
      to_id: ["potential_manager"],
      content: {
        client_id: client.client_id, 
        group_key: productInfo.group_key, group_name: productInfo.group_name, 
        sales_potential: updateValue, previous_potential: 0, notes
      },
      response_status: "Not Reviewed",
    }
    console.log({requestInfo})
    postRequest("field/new_request", {requestInfo}).then((output)=> {
      console.log(output)
      setStatus(false)
    }).catch((err)=> console.log(err))
  } 

  useEffect(()=>{
    getRequest("data/potential/product_group_list").then((output)=> {
      const currentKeys = currentPotentials.map(({group_key})=> group_key)
      const filteredNames = output.filter(({group_key})=> !currentKeys.includes(group_key)).map(({group_name})=> group_name)
      setProducts(output)
      setDropOptions(filteredNames)
      setSelectedProduct(filteredNames[0])
    }).catch((err)=> console.log(err))
  },[])
  if (dropOptions && selectedProduct) return (
    <div style={layout}>
      <div>Product a agregar</div>
      <ValueSelectionDrop value={selectedProduct} selectFunc={setSelectedProduct} valueArray={dropOptions}/>
      <div>Adjust Potential</div>
      <NumberInput value={updateValue} setFunc={setUpdateValue} />
      <div>
        <div className="small-text bold">Razón de Ajuste</div>
        <TextAreaInput value={notes} setFunc={setNotes} />
      </div>
      <button onClick={sendRequest}>Enviar</button>
    </div>
  )
}

function ClientTasks ({client}) {
  const layout = {
    display: "flex", flexDirection: "column", gap: "10px", 
    padding: "10px", height: "100%", boxSizing: "border-box", overflow: "auto"
  }  
  
  return (
    <div className="box" style={layout}>
      <div className="flex-center-all" style={{height: "100%"}}>
        <div style={{textAlign: "center"}}>Sin Tareas Pendientes</div>
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
        <span className="small-text bold">Historial de Visitas y Ventas</span>
        <button className="small" onClick={toggleDescending}>{descending? "descendiente": "ascendente"}</button>
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