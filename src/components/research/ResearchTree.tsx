import React from "react";
import ResearchBlock from "./ResearchBlock";
import "./ResearchTree.css";

const researchData = [
  {
    title: "Pottery",
    description:
      "The ancient craft of creating vessels from clay and other materials. Used primarily for storage and daily household activities.",
    metadata: { science_cost: 15 },
  },
  {
    title: "Alphabet",
    description:
      "A set of letters or symbols representing the basic speech sounds of a language. Paved the way for written communication.",
    metadata: { science_cost: 15 },
  },
  {
    title: "Iron Working",
    description:
      "The skill of creating tools, weapons, and structures using iron. This led to stronger and more durable products.",
    metadata: { science_cost: 15 },
  },
  {
    title: "Market",
    description:
      "A place where goods and services are bought and sold. This facilitated trade and economic growth in ancient cities.",
    metadata: { science_cost: 15 },
  },
  {
    title: "University",
    description:
      "An institution of higher learning. Played a vital role in the dissemination of knowledge and scientific research during medieval times.",
    metadata: { science_cost: 15 },
  },
  {
    title: "Printing Press",
    description:
      "A device for applying pressure to inked surface resting upon a print medium, thereby transferring the ink. Revolutionized the spread of information.",
    metadata: { science_cost: 15 },
  },
  {
    title: "Railroads",
    description:
      "A track or set of tracks made of steel rails along which passenger and freight trains run. Transformed transportation and trade during the industrial age.",
    metadata: { science_cost: 15 },
  },
  {
    title: "Electricity",
    description:
      "A form of energy resulting from the existence of charged particles. Led to numerous innovations and modern conveniences.",
    metadata: { science_cost: 15 },
  },
  {
    title: "Internet",
    description:
      "A global computer network providing a variety of information and communication facilities. Changed the way the modern world communicates and accesses information.",
    metadata: { science_cost: 15 },
  },
];

const ResearchTree = () => {
  const column1 = researchData.filter((_, index) => index % 3 === 0);
  const column2 = researchData.filter((_, index) => index % 3 === 1);
  const column3 = researchData.filter((_, index) => index % 3 === 2);

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
