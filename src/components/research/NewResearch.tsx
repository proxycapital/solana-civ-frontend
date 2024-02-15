import { useGameState } from "../../context/GameStateContext";
import { capitalizeWords } from "../../utils";
import { AllBuildings } from "../../Buildings";
import { AllUnits } from "../../Units";
import { getUnitOrBuildingStats } from "../../utils";
import "./ResearchTree.scss";

const BuildingStats = ({ researchName, productionCost }: any) => {
  const stats = getUnitOrBuildingStats(researchName);

  if (!stats) return <span>Unlocks Archery</span>;

  return (
    <div>
      {stats.type === "building" && (
        <div className="unit-stats-container">
          <div className="unit-stats">
            <div className="flex-align-center">
              <img
                width={24}
                src={`../icons/${stats.resourceName === "production" ? "hammer" : stats.resourceName}.png`}
                alt={stats.resourceName}
              />
              {stats.resourceName}
            </div>
            <span>+{stats?.income}</span>
          </div>
          <div className="unit-stats">
            <div className="flex-align-center">
              <img width={24} src="../icons/gear.png" alt={stats.resourceName} />
              Production Cost
            </div>
            <span>{productionCost}</span>
          </div>
          {stats?.type === "building" && stats.extra && (
            <div className="unit-stats">
              <div className="flex-align-center">
                {/* @todo: update icon to housing */}
                <img width={24} src="../icons/population.png" alt={stats.resourceName} />
                {stats.extra}
              </div>
              <span>{stats.extraValue}</span>
            </div>
          )}
        </div>
      )}
      {stats.type === "wall" && (
        <div className="unit-stats-container">
          <div className="unit-stats">
            <div className="flex-align-center">
              <img src="/icons/attack.png" alt="" className="unit-icon" />
              Attack
            </div>
            <span>{stats?.attack}</span>
          </div>
          <div className="unit-stats">
            <div className="flex-align-center">
              <img src="/icons/health.png" alt="" className="unit-icon" />
              Health
            </div>
            <span>{stats?.health}</span>
          </div>
        </div>
      )}
    </div>
  );
};
const NewResearch = () => {
  const { technologies } = useGameState();

  const technologiesKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);
  const lastResearch = technologiesKeys ? capitalizeWords(technologiesKeys[technologiesKeys.length - 1]) : "";

  const newUnitUnlocked = AllUnits.find((unit) => unit.tech === lastResearch);
  const newBuildingsUnlocked = AllBuildings.filter((building) => building.tech === lastResearch);

  return (
    <div className="new-research-block">
      {newUnitUnlocked?.label && (
        <>
          <div className="unit-image-container">
            <img className="unit-image" src={`./${newUnitUnlocked.label.toLowerCase()}.png`} alt="Unit" />
          </div>
          <span className="header-text">You have researched {newUnitUnlocked.label}!</span>
          <p className="header-sub-text">Now you can train new unit:</p>
          <div className="unit-stats-container">
            <div className="unit-stats">
              <div className="flex-align-center">
                <img src="/icons/attack.png" alt="" className="unit-icon" />
                Attack
              </div>
              <span>{newUnitUnlocked.stats?.attack}</span>
            </div>
            <div className="unit-stats">
              <div className="flex-align-center">
                <img src="/icons/health.png" alt="" className="unit-icon" />
                Health
              </div>
              <span>100</span>
            </div>
            <div className="unit-stats">
              <div className="flex-align-center">
                <img src="/icons/movement.png" alt="" className="unit-icon" />
                Movements
              </div>
              <b>{newUnitUnlocked.stats?.movement}</b>
            </div>
            {newUnitUnlocked?.stats?.maintenanceCost && (
              <div className="unit-stats">
                <div className="flex-align-center">
                  {/* @todo: change icon to gold */}
                  <img src="/icons/health.png" alt="" className="unit-icon" />
                  Maintenance Cost
                </div>
                <b>{newUnitUnlocked.stats?.maintenanceCost}</b>
              </div>
            )}
          </div>
        </>
      )}
      {newBuildingsUnlocked.length > 0 &&
        newBuildingsUnlocked.map((newBuildingUnlocked) => (
          <div key={newBuildingUnlocked.label} style={newBuildingUnlocked && newUnitUnlocked && { marginTop: "1rem" }}>
            <span className="header-text">You have researched {newBuildingUnlocked.label}!</span>
            <p className="header-sub-text">Now you can construct new building for:</p>
            <BuildingStats researchName={newBuildingUnlocked?.label} productionCost={newBuildingUnlocked?.productionCost} />
          </div>
        ))}
      <br />
    </div>
  );
};

export default NewResearch;
