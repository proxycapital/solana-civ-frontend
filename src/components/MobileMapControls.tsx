import React from "react"

const MobileMapControls = () => {
  const handleMapControl = (direction: "top" | "bottom" | "left" | "right") => {

  }

  return (
    <div className="mobile-map-controls">
      <div className="top-controls">
        <div onClick={() => handleMapControl("top")} className="control">Top</div>
      </div>
      <div className="bottom-controls">
        <div onClick={() => handleMapControl("left")} className="control">Left</div>
        <div onClick={() => handleMapControl("right")} className="control">Right</div>
        <div onClick={() => handleMapControl("bottom")} className="control">Bottom</div>
      </div>
    </div>
  )
}

export default MobileMapControls