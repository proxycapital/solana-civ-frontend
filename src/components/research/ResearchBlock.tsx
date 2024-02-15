import LinearProgress from "@mui/material/LinearProgress";
import Tippy from "@tippyjs/react";

import { toCamelCase, getUnitOrBuildingStats } from "../../utils";
import ResearchTippy from "./ResearchTippy";
import "./ResearchTree.scss";

interface IResearch {
  name: string;
  cost: number;
  unlocks: string[];
  treeType: string;
  currentResearch: any;
  researchAccumulatedPoints: number;
  researchedTechnologies: any[];
  index: number;
  prevResearched: boolean;
  onResearchQueueClick: (index: number, treeType: string, name: string) => void;
  researchQueue?: Array<any>;
  isMobile: boolean;
}

const MobileResearchInfo = (researchName: string) => {
  const stats = getUnitOrBuildingStats(researchName);

  if (!stats) return <span>Unlocks Archery</span>;

  if (stats.type === "building" && stats.extra) {
    return (
      <span>
        (+{stats.income} {stats.resourceName} and +{stats.extraValue} {stats.extra})
      </span>
    );
  } else if (stats.type === "building") {
    return (
      <span>
        (+{stats.income} {stats.resourceName})
      </span>
    );
  } else if (stats.type === "unit") {
    return (
      <div className="unit-stats-container">
        <img width="50" src={`./${researchName.toLowerCase()}.png`} alt="Archer" />
        <div className="unit-stats-tippy">
          <p>
            Attack: <span>{stats.attack}</span>
          </p>
          <p>
            Movement: <span>{stats.movement}</span>
          </p>
          <p>
            Maintenance: <span>{stats.maintenance}</span>
          </p>
        </div>
      </div>
    );
  }
  // if (stats.type === "building" && stats.extra) {
  //   return <span><span className="bold-text">+{stats.income} {stats.resourceName}</span> | <span className="bold-text">+{stats.extraValue} {stats.extra}</span></span>
  // } else if (stats.type === "building") {
  //   return <TippyBuildingStats value={stats.income} resourceName={stats.resourceName} />
  // } else if (stats.type === "unit") {
  //   return <TippyUnitStats name={researchName} attack={stats.attack} movement={stats.movement} maintenance={stats.movement} />
  // } else if (stats.type === "wall") {
  //   return <span>Wall with <span className="bold-text">{stats.health} HP</span> and <span className="bold-text">{stats.attack} attack</span></span>
  // }
};

const ResearchBlock = ({
  name,
  cost,
  unlocks,
  treeType,
  currentResearch,
  researchAccumulatedPoints,
  researchedTechnologies,
  onResearchQueueClick,
  index,
  prevResearched,
  researchQueue = [],
  isMobile,
}: IResearch) => {
  const researchedKeys = researchedTechnologies.map((tech) => Object.keys(tech)[0]);
  const currentResearchKey = currentResearch ? Object.keys(currentResearch)[0] : null;
  const isCurrentResearch = toCamelCase(name) === currentResearchKey;
  const progressPercentage = isCurrentResearch ? (researchAccumulatedPoints / cost) * 100 : 0;
  const isUnlocked = researchedKeys.includes(toCamelCase(name));
  const isLocked = index !== 0 && !prevResearched;

  return (
    <div
      className={`research-block ${isUnlocked ? "unlocked" : ""} ${isLocked ? "locked" : ""}`}
      onClick={() => {
        if (isUnlocked) return;
        onResearchQueueClick(index, treeType, name);
      }}
    >
      <div className="top-section">
        {/* <img src="/research.png" width="100" alt="" className="research-icon" /> */}
        {researchQueue.includes(toCamelCase(name)) ? (
          <div className="research-queue-number">{researchQueue.indexOf(toCamelCase(name)) + 1}</div>
        ) : null}
        <div className="research-content">
          <h3>{name}</h3>
          {isMobile ? (
            <div
              style={{
                display: unlocks.length > 1 ? "block" : "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: unlocks.length > 1 ? "1rem" : 0,
              }}
            >
              <p>Unlocks:&nbsp;</p>
              {unlocks.map((unlock, index) => (
                <span key={unlock}>
                  <span className="mobile-research-unlock">
                    <span className="underline-text">{unlock}</span>&nbsp;
                    {MobileResearchInfo(unlock)}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p>Unlocks:&nbsp;</p>
              {unlocks.map((unlock, index) => (
                <span key={unlock}>
                  <Tippy
                    touch={false}
                    className="research-tippy"
                    content={ResearchTippy(unlock)}
                    placement="top"
                    key="test"
                  >
                    <span className="underline-text">{unlock}</span>
                  </Tippy>
                  {index !== unlocks.length - 1 ? ", " : null}&nbsp;
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="research-status">
        {isCurrentResearch && (
          <div className="progress-wrapper">
            <LinearProgress
              variant="determinate"
              style={{ height: "14px", backgroundColor: "rgb(159 129 83)" }}
              value={progressPercentage}
            />
            <span className="progress-text">{progressPercentage.toFixed(2)}%</span>
          </div>
        )}
        {isUnlocked && (
          <div className="researched-wrapper">
            <img width="32" src="/icons/maps.png" alt="maps" />
            <span>Researched</span>
          </div>
        )}
        {!isCurrentResearch && !currentResearch && !isUnlocked && (
          <div className="bottom-section">
            <div className="bottom-section">
              {isLocked ? (
                <>
                  <img src="/icons/padlock.png" alt="padlock" width="32" />
                  <span>Locked</span>
                </>
              ) : (
                <>
                  <img src="/icons/reward.png" width="32" alt="" />
                  <span className="research-cost">
                    Research points: <b>{cost}</b>
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <img src="/icons/research-star.png" className="star-icon" alt="" />
    </div>
  );
};

export default ResearchBlock;
