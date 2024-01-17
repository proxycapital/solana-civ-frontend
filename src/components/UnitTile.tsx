import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import { canUpgradeUnit } from "../utils";

interface UnitTileProps {
  x: number;
  y: number;
  type: string;
  unitId: number;
  npc?: boolean | undefined;
  health?: number;
  level?: number;
  isSelected: boolean;
  onClick: (x: number, y: number) => void;
  experience: number;
  turn: number;
}

const UnitTile: React.FC<UnitTileProps> = ({
  x, y, type, npc, health, level, isSelected, unitId, onClick, experience, turn,
}) => {
  const img = npc ? `npc-${type}` : type;
  const [nextTurn, setNextTurn] = useState(false);
  const [prevLevel, setPrevLevel] = useState(0);

  // useEffect(() => {
  //   setNextTurn(true);
  //   setTimeout(() => {
  //     setNextTurn(false);
  //   }, 2000);
  // }, [turn]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setPrevLevel(Number(level));
  //   }, 2000);
  // }, [level])

  // const isHealing = health !== 100;

  return (
    <div
      id={`unit-${unitId}`} className={`unit unit-${type} ${isSelected ? "selected" : ""} ${npc ? "npc" : ""}`}
      onClick={() => onClick(x, y)}
    > 
      {false && nextTurn && !npc && (
        <div className="yield-effect">
          +5&nbsp;
          <img
            src={`/icons/health.png`}
            alt="Health increase"
            className="health-icon"
          />
        </div>
      )}
      {prevLevel !== level && (
        <div className="yield-effect">
          +30&nbsp;
          <img
            src={`/icons/health.png`}
            alt="Health increase"
            className="health-icon"
          />
        </div>
      )}
      <div className="unit-header">
        {!npc && canUpgradeUnit(level || 0, experience || 0) ? (
          <div className="level">
            <Tippy placement="right" content={<span>Level Up available</span>}>
              <div className="upgrade-image-container">
                <img src="./icons/upgrade.png" alt="Upgrade" />
              </div>
            </Tippy> 
          </div>
        ) : (
          level ? (
            <div className="level">
              <span>{level}</span>
            </div>
          ) : null
        )}
        {health && health < 100 && (
          <div className="health-bar">
            <div className="health" style={{ width: `${health}%` }}></div>
          </div>
        )}
      </div>
      <img className="unit-image" src={`/${img}.png`} alt={type} />
    </div>
  );
};

export default UnitTile;
