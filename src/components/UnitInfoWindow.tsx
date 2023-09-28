import React from 'react';
import { foundCity, upgradeLandPlot } from '../utils/solanaUtils';
import { useWorkspace } from '../context/AnchorContext';
import { useGameState } from '../context/GameStateContext';
import { useSound } from "../context/SoundContext";

interface UnitInfoProps {
  unit: {
    x: number;
    y: number;
    unitId: number;
    type: string;
    movementRange: number;
    health: number;
    builds?: number;
    strength?: number;
  };
}

const UnitInfoWindow: React.FC<UnitInfoProps> = ({unit}) => {
  const { program, provider } = useWorkspace();
  const { fetchPlayerState } = useGameState();
  const { playSound } = useSound();
  const { type, movementRange, builds, strength } = unit;
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);

  const handleFoundCity = async (x: number, y: number, unitId: number) => {
    const unit = { x, y, unitId };
    const result = await foundCity(provider!, program!, unit);
    if (result === true) {
      playSound("construction");
    }
    await fetchPlayerState();
  }

  const handleBuild = async (x: number, y: number, unitId: number) => {
    const unit = { x, y, unitId };
    const result = await upgradeLandPlot(provider!, program!, unit);
    if (result === true) {
      playSound("construction");
    }
    await fetchPlayerState();
  }
  return (
    <div className="unit-info-window">
      <img src={`/${type}.png`} alt={type} />
      <div><strong>{displayType}</strong></div>
      <div>HP: {unit.health}/100</div>
      <div>Movements: {movementRange}/{movementRange}</div>
      {builds !== undefined && <div>Builds: {builds}/1</div>}
      {strength !== undefined && <div>Strength: {strength}</div>}
      {type === "settler" && <button className="unit-action-button" onClick={() => handleFoundCity(unit.x, unit.y, unit.unitId)}>Found a City</button>}
      {type === "builder" && <button className="unit-action-button" onClick={() => handleBuild(unit.x, unit.y, unit.unitId)}>Build</button>}
    </div>
  );
};

export default UnitInfoWindow;