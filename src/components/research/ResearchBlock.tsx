import React from "react";
import "./ResearchTree.css";

interface IResearch {
  name: string;
  cost: number;
  unlocks: string[];
}

const ResearchBlock = ({ name, cost, unlocks }: IResearch) => {
  return (
    <div className="research-block">
      <img src="/research.png" width="100" alt="" className="research-icon" />
      <div className="research-content">
        <h3>{name}</h3>
        <p>Unlocks: {unlocks.join(", ")}</p>
        <div className="metadata">
          Research points: {cost}{" "}
          <img src="/icons/science.png" style={{ display: "inline-block", width: "24px" }} alt="" />
        </div>
      </div>
      <div className="research-status">
        <button className="research-button">Research</button>
      </div>
    </div>
  );
};

export default ResearchBlock;
