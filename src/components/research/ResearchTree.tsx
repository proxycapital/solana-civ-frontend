import React from "react";
import ResearchBlock from "./ResearchBlock";
import "./ResearchTree.css";

import config from "../../config.json";
const researchData = config.science;

const ResearchTree = () => {
  const column1 = researchData["Science and Economy Tree"];
  const column2 = researchData["Production and Agriculture Tree"];
  const column3 = researchData["Military Tree"];

  return (
    <div className="research-tree">
      <div className="research-column">
        {column1.map((data) => (
          <ResearchBlock {...data} />
        ))}
      </div>
      <div className="research-column">
        {column2.map((data) => (
          <ResearchBlock {...data} />
        ))}
      </div>
      <div className="research-column">
        {column3.map((data) => (
          <ResearchBlock {...data} />
        ))}
      </div>
    </div>
  );
};

export default ResearchTree;
