import React, { ReactNode } from "react";

interface TippyUnitStasProps {
  attack: number,
  movement: number,
  maintenance: number,
  name: string,
}

interface TippyBuildingStatsProps {
  value: number,
  resourceName: "science" | "gold" | "food" | "production",
}

const TippyUnitStats = ({ attack, movement, maintenance, name}: TippyUnitStasProps) => {
  return (
    <div className="unit-stats-container">
      <img width="50" src={`./${name.toLowerCase()}.png`} alt="Archer" />
      <div className="unit-stats">
        <p>Attack: <span>{attack}</span></p>
        <p>Movement: <span>{movement}</span></p>
        <p>Maintenance: <span>{maintenance}</span></p>
      </div>
    </div>
  )
}

const TippyBuildingStats = ({ value, resourceName }: TippyBuildingStatsProps) => {
  return (
    <div className="building-stats-container">
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
      return <TippyBuildingStats value={4} resourceName="science" />
    case "Observatory":
      return <TippyBuildingStats value={5} resourceName="science" />
    case "Market":
      return <TippyBuildingStats value={2} resourceName="gold" />
    case "Bank":
      return <TippyBuildingStats value={3} resourceName="gold" />
    case "StockExchange":
      return <TippyBuildingStats value={4} resourceName="gold" />
    case "Granary":
      return <TippyBuildingStats value={2} resourceName="food" />
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
    case "EnergyPlant":
      return <TippyBuildingStats value={4} resourceName="production" />

    case "Archer": 
      return <TippyUnitStats name={researchName} attack={10} movement={2} maintenance={1} />
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
      
    case "WallMedieval":
      return <span>New Wall, that have <span className="bold-text">100 HP</span> and <span className="bold-text">10 attack</span></span>
    case "WallRenaissance":
      return <span>New Wall, that have <span className="bold-text">150 HP</span> and <span className="bold-text">20 attack</span></span>
    case "WallIndustrial":
      return <span>New Wall, that have <span className="bold-text">200 HP</span> and <span className="bold-text">30 attack</span></span>
    default: 
      return null
  }
}

export default ResearchTippy