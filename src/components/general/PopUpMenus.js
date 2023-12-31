import "./PopUpMenus.css"
function FullScreenPopUp ({title, children, setStatus}) {

  return (
    <div className="fs-container">
      <div className="fs-top has-shadow">
        <div>{title}</div>
        <button className="inv" onClick={()=>setStatus(false)}>close</button>
      </div>
      <div className="fs-content">
        {children}
      </div>
    </div>
  )
}

function SideMenuPopUp ({title, children, setStatus}) {

  return (
    <div className="sm-container">
      <div className="sm-screen" onClick={()=>setStatus(false)}></div>
      <div className="sm-main">
        <div className="sm-title">
          <div>{title}</div>
          <button className="inv small" onClick={()=>setStatus(false)}>close</button>
        </div>
        <div className="sm-content">{children}</div>
      </div>
    </div>
  )
}

function OverlayPopUp ({title, children, setStatus, layout={}}) {
  const titleLayout = {display: "grid", gridTemplateColumns: "1fr auto"}
  return (
    <div className="overlay-container" onClick={()=>setStatus(false)}>
      <div className="box-section white has-shadow" onClick={(e) => e.stopPropagation()} style={layout}>
        <div style={titleLayout}>
          <div className="label">{title}</div>
          <div className="clickable text-color coral" onClick={()=>setStatus(false)}>{'\u2716'}</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export {FullScreenPopUp, SideMenuPopUp, OverlayPopUp}