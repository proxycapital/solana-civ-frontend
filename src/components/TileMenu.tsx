import React, { CSSProperties } from 'react';
import {City} from "../context/GameStateContext";

interface CustomStyle extends CSSProperties {
  '--index'?: number;
  '--count'?: number;
}

interface Unit {
  unitId: number;
  npc?: boolean;
  health: number;
  x: number;
  y: number;
  type: string;
  isSelected: boolean;
  movementRange: number;
}

interface CircleMenuProps {
  units: Array<Unit | City | any>,
  onClick: (unitTile: Unit | City | any) => void
}

const TileMenu = ({ units, onClick }: CircleMenuProps) => {
  return (
    <div className="circle-menu">
      {Array.from({ length: units.length }).map((_, index) => (
        <div key={index} className="circle-menu-wrapper" style={{'--index': index + 1, '--count': units.length} as CustomStyle} onClick={() => {
          onClick(units[index])
        }}>
          <div className="circle-menu-content">
            {units[index].type || (units[index].cityId !== undefined && 'City') ||  Object.keys(units[index].tileType || {})[0]}
          </div>
        </div>
      ))}

    </div>
  );
}


export default TileMenu;

