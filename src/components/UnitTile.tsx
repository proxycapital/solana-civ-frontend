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
  experience: number,
}

const UnitTile: React.FC<UnitTileProps> = ({
  x, y, type, npc, health, level, isSelected, unitId, onClick, experience
}) => {
  const img = npc ? `npc-${type}` : type;

  return (
    <div
      id={`unit-${unitId}`} className={`unit unit-${type} ${isSelected ? "selected" : ""} ${npc ? "npc" : ""}`}
      onClick={() => onClick(x, y)}
    > 
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
