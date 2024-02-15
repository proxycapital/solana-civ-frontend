import React from "react";

interface MobileMapControlsProps {
  isSelectedUnit: boolean;
}

const MobileMapControls = ({ isSelectedUnit }: MobileMapControlsProps) => {
  const gameMap = document.getElementsByClassName("game-container");

  const handleMapControl = (direction: "top" | "bottom" | "left" | "right") => {
    if (!gameMap[0]) return;

    const offsetSize = 150;

    switch (direction) {
      case "left":
        gameMap[0].scrollTo({
          left: gameMap[0].scrollLeft - offsetSize,
          behavior: "smooth",
        });
        break;
      case "right":
        gameMap[0].scrollTo({
          left: gameMap[0].scrollLeft + offsetSize,
          behavior: "smooth",
        });
        break;
      case "top":
        gameMap[0].scrollTo({
          top: gameMap[0].scrollTop - offsetSize,
          behavior: "smooth",
        });
        break;
      case "bottom":
        gameMap[0].scrollTo({
          top: gameMap[0].scrollTop + offsetSize,
          behavior: "smooth",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className={`mobile-map-controls ${isSelectedUnit ? "unit-selected" : "unit-not-selected"}`}>
      <div className="top-controls">
        <div onClick={() => handleMapControl("top")} className="control">
          <img width={28} src="./icons/triangle.png" alt="Triangle Top" />
        </div>
      </div>
      <div className="bottom-controls">
        <div onClick={() => handleMapControl("left")} className="control">
          <img width={28} className="left" src="./icons/triangle.png" alt="Triangle Left" />
        </div>
        <div onClick={() => handleMapControl("bottom")} className="control">
          <img width={28} className="bottom" src="./icons/triangle.png" alt="Triangle Bottom" />
        </div>
        <div onClick={() => handleMapControl("right")} className="control">
          <img width={28} className="right" src="./icons/triangle.png" alt="Triangle Right" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileMapControls);
