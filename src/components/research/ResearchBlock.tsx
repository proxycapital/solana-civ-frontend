import React from "react";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import "./ResearchTree.css";

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
  console.log(`${name} is locked:`, isLocked);
  console.log(`${name} is unlocked:`, isUnlocked);
  return (
    <div key={name} className={`research-block ${isUnlocked ? "unlocked" : ""} ${isLocked ? "locked" : ""}`}>
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
        {isUnlocked && <div className="researched-text">✅ Researched</div>}
        {!isCurrentResearch && !currentResearch && !isUnlocked && (
          <div className="bottom-section">
            <div className="bottom-section">
              <img src="/icons/science.png" style={{ display: "inline-block", width: "24px" }} alt="" />
              <span className="research-cost">
                Research points: <b>{cost}</b>
              </span>
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
