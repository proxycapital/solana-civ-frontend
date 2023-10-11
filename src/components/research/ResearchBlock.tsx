import React from "react";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import "./ResearchTree.scss";

interface IResearch {
  name: string;
  cost: number;
  unlocks: string[];
  currentResearch: any;
  researchAccumulatedPoints: number;
  researchedTechnologies: any[];
  index: number;
  prevResearched: boolean;
  onResearchClick: (name: string) => void;
}

function toCamelCase(str: string) {
  return str
    .replace(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

const ResearchBlock = ({
  name,
  cost,
  unlocks,
  currentResearch,
  researchAccumulatedPoints,
  researchedTechnologies,
  onResearchClick,
  index,
  prevResearched,
}: IResearch) => {
  const researchedKeys = researchedTechnologies.map((tech) => Object.keys(tech)[0]);
  const currentResearchKey = currentResearch ? Object.keys(currentResearch)[0] : null;
  const isCurrentResearch = toCamelCase(name) === currentResearchKey;
  const progressPercentage = isCurrentResearch ? (researchAccumulatedPoints / cost) * 100 : 0;
  const isUnlocked = researchedKeys.includes(toCamelCase(name));
  const isLocked = index !== 0 && !prevResearched;

  return (
    <div className={`research-block ${isUnlocked ? "unlocked" : ""} ${isLocked ? "locked" : ""}`}>
      <div className="top-section">
        {/* <img src="/research.png" width="100" alt="" className="research-icon" /> */}
        <div className="research-content">
          <h3>{name}</h3>
          <p>Unlocks: {unlocks.join(", ")}</p>
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
            {!isLocked && (
              <Button
                className="research-button"
                variant="outlined"
                //disabled={currentResearch}
                onClick={() => {
                  onResearchClick(name);
                }}
              >
                Research
              </Button>
            )}
          </div>
        )}
      </div>
      <img src="/icons/research-star.png" className="star-icon" alt="" />
    </div>
  );
};

export default ResearchBlock;
