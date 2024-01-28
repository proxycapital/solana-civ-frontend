import React from "react"

const MobileMapControls = () => {
  const gameMap = document.getElementsByClassName("game-container");

  const handleMapControl = (direction: "top" | "bottom" | "left" | "right") => {
    if (!gameMap[0]) return;

    const offsetSize = 100;

    switch (direction) {
      case 'left':
        gameMap[0].scrollLeft -= offsetSize;
        break;
      case 'right':
        gameMap[0].scrollLeft += offsetSize;
        break;
      case 'top':
        gameMap[0].scrollTop -= offsetSize;
        break;
      case 'bottom':
        gameMap[0].scrollTop += offsetSize;
        break;
      default:
        break;
    }
  }

  return (
    <div className="mobile-map-controls">
      <div className="top-controls">
        <div onClick={() => handleMapControl("top")} className="control">Top</div>
      </div>
      <div className="bottom-controls">
        <div onClick={() => handleMapControl("left")} className="control">Left</div>
        <div onClick={() => handleMapControl("bottom")} className="control">Bottom</div>
        <div onClick={() => handleMapControl("right")} className="control">Right</div>
      </div>
    </div>
  )
}

export default MobileMapControls