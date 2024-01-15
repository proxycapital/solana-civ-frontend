import React, { ReactNode } from "react";

interface TippyUnitStasProps {
  attack: number,
  movement: number,
  maintenance: number,
  name: string,
}

interface TippyBuildingStatsProps {
  value: number,
  resourceName: "science" | "gold" | "food" | "production" | "housing",
}

const TippyUnitStats = ({ attack, movement, maintenance, name}: TippyUnitStasProps) => {
  return (
    <div className="unit-stats-container">
      <img width="50" src={`./${name.toLowerCase()}.png`} alt="Archer" />
      <div className="unit-stats-tippy">
        <p>Attack: <span>{attack}</span></p>
        <p>Movement: <span>{movement}</span></p>
        <p>Maintenance: <span>{maintenance}</span></p>
      </div>
    </div>
  )
}

const TippyBuildingStats = ({ value, resourceName }: TippyBuildingStatsProps) => {
  return (
    <div>
      {/* @todo: need to add image of each building */}
      <span>+{value} {resourceName}</span>
    </div>
  )
}

const ResearchTippy = (researchName: string): ReactNode => {
  switch (researchName) {
    case "Archery":
      // @todo: change it
      return <span>Unlocks Archery</span>
    case "Library":
      return <TippyBuildingStats value={2} resourceName="science" />
    case "School":
      return <TippyBuildingStats value={3} resourceName="science" />
    case "University":
      return <span><span className="bold-text">+4 science</span> | <span className="bold-text">+1 housing</span></span>
    case "Observatory":
      return <TippyBuildingStats value={5} resourceName="science" />
    case "Market":
      return <TippyBuildingStats value={2} resourceName="gold" />
    case "Bank":
      return <TippyBuildingStats value={3} resourceName="gold" />
    case "Stock Exchange":
      return <TippyBuildingStats value={4} resourceName="gold" />
    case "Granary":
      return <span><span className="bold-text">+2 food</span> | <span className="bold-text">+2 housing</span></span>
    case "Mill":
      return <TippyBuildingStats value={2} resourceName="food" />
    case "Bakery":
      return <TippyBuildingStats value={3} resourceName="food" />
    case "Supermarket":
      return <TippyBuildingStats value={4} resourceName="food" />
    case "Forge":
      return <TippyBuildingStats value={2} resourceName="production" />
      case "Factory":
      return <TippyBuildingStats value={3} resourceName="production" />
    case "Energy Plant":
      return <TippyBuildingStats value={4} resourceName="production" />
    case "Residential Complex":
      return <TippyBuildingStats value={5} resourceName="housing" />

    case "Archer": 
      return <TippyUnitStats name={researchName} attack={10} movement={2} maintenance={1} />
    case "Horseman":
      return <TippyUnitStats name={researchName} attack={14} movement={3} maintenance={2} />
    case "Swordsman":
      return <TippyUnitStats name={researchName} attack={14} movement={2} maintenance={1} />
    case "Crossbowman":
      return <TippyUnitStats name={researchName} attack={24} movement={2} maintenance={2} />
    case "Musketman":
      return <TippyUnitStats name={researchName} attack={32} movement={2} maintenance={2} />
    case "Rifleman":
      return <TippyUnitStats name={researchName} attack={40} movement={2} maintenance={4} />
    case "Tank":
      return <TippyUnitStats name={researchName} attack={50} movement={2} maintenance={7} />
      
    case "Medieval Wall":
      return <span>Wall with <span className="bold-text">100 HP</span> and <span className="bold-text">10 attack</span></span>
    case "Renaissance Wall":
      return <span>Wall with <span className="bold-text">150 HP</span> and <span className="bold-text">20 attack</span></span>
    case "Industrial Wall":
      return <span>Wall with <span className="bold-text">200 HP</span> and <span className="bold-text">30 attack</span></span>
    default: 
      return null
  }
}

export default ResearchTippy