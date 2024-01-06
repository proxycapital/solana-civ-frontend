interface UnitProps {
  x: number;
  y: number;
  type: string;
  unitId: number;
  npc?: boolean | undefined;
  health?: number;
  level?: number;
  isSelected: boolean;
  onClick: (x: number, y: number) => void;
}

const Unit: React.FC<UnitProps> = ({ x, y, type, npc, health, level, isSelected, unitId, onClick }) => {
  const handleClick = () => {
    onClick(x, y);
  };

  const img = npc ? `npc-${type}` : type;

  return (
    <div id={`unit-${unitId}`} className={`unit unit-${type} ${isSelected ? "selected" : ""} ${npc ? "npc" : ""}`} onClick={handleClick}>
      <div className="unit-header">
        {level ? (
          <div className="level">
            <span>{level}</span>
          </div>
        ) : null}
        {health && health < 100 && (
          <div className="health-bar">
            <div className="health" style={{ width: `${health}%` }}></div>
          </div>
        )}
      </div>
      <img src={`/${img}.png`} alt={type} />
    </div>
  );
};

export default Unit;
