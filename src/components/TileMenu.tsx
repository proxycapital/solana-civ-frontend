import React, { CSSProperties } from "react";
import { City } from "../context/GameStateContext";
import { Unit } from "./GameMap";

interface CustomStyle extends CSSProperties {
  "--index"?: number;
  "--count"?: number;
}

interface TileMenuProps {
  units: Array<Unit | City | any>;
  onClick: (unitTile: Unit | City | any) => void;
}

const TileMenu = ({ units, onClick }: TileMenuProps) => {
  return (
    <div className="circle-menu">
      {Array.from({ length: units.length }).map((_, index) => (
        <div
          key={index}
          className="circle-menu-wrapper"
          style={{ "--index": index + 1, "--count": units.length } as CustomStyle}
          onClick={() => {
            onClick(units[index]);
          }}
        >
          <div className="circle-menu-content">
            {units[index].type ||
              (units[index].cityId !== undefined && "City") ||
              Object.keys(units[index].tileType || {})[0]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TileMenu;
