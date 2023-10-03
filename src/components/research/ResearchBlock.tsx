import React from "react";
import "./ResearchTree.css";

interface IResearch {
  title: string;
  description: string;
  metadata: {
    science_cost: number;
  };
}

const ResearchBlock = ({ title, description, metadata }: IResearch) => {
  return (
    <div className="research-block">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="metadata">Research points: {metadata.science_cost}</div>
    </div>
  );
};

export default ResearchBlock;
