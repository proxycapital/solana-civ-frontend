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
      <h3>{name}</h3>
      <p>Unlocks: {unlocks.join(", ")}</p>
      <div className="metadata">
        Research points: {cost}{" "}
        <img src="/icons/science.png" style={{ display: "inline-block", width: "24px" }} alt="" />
      </div>
    </div>
  );
};

export default ResearchBlock;
