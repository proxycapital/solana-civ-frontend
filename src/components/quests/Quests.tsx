import React from "react";
import QuestBlock from "./QuestBlock";
import { useGameState } from "../../context/GameStateContext";
import "./Quests.css";

const Quests = () => {
  const { upgradedTiles, allUnits, cities, technologies, npcUnits, npcCities } = useGameState();
  const questData = [
    {
      title: "Found a City",
      description: "Establish a city by clicking the 'Found a City' button when the Settler unit is selected.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Construct an Iron Mine",
      description:
        "Select a Builder unit and move to the land tile with the iron icon. Construct a mine by clicking the 'Build' button when the Builder unit is selected. Iron is essential for producing Swordsman units, which are more powerful than Warriors.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Recruit 2 Warriors in Your City",
      description:
        "There are many barbarians around your city and they may attack your units or even destroy your city. Continuously recruit new military units to defend your territory.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Defeat a Barbarian Unit",
      description:
        "Attack barbarians using your military units. Note that Settlers and Builders are non-combat units. Locate barbarians by exploring the map and attack them with your Warrior.",
      status: "pending",
      reward: "1 gem",
    },
    {
      title: "Research 'Archery' and Recruit Archer Units",
      description:
        "Archers are slightly more powerful than Warriors and are available at the same production cost. Make sure to unlock them early on.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Build Barracks and Walls in Your City",
      description:
        "Your city starts unprotected. Build barracks and walls to safeguard your city from barbarian invasions. As you progress, you'll have the chance to unlock advanced buildings and fortifications.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Construct a Forge to Boost Your City's Production",
      description:
        "Facilities like the Forge, Factory, and Energy Plant enhance your cities' production capabilities. With augmented production, you can recruit units and construct buildings much faster.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Establish a Second City",
      description:
        "To triumph in the game, you must broaden your empire. Aim to establish a second city promptly. For this, recruit a Settler unit and position it at the desired site. Remember, Settlers require additional food resources, and this cost increasing with each new city.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Master All Available Technologies",
      description:
        "Achieve global dominance by mastering all available technologies. New technologies can be researched under the 'Research' tab.",
      status: "pending",
      reward: "-",
    },
    {
      title: "Eliminate All Barbarian Camps",
      description:
        "Conclude the demo by annihilating all barbarian camps. Explore the map to locate these camps. Before the demo ends, ensure you transfer your gems to a personal wallet.",
      status: "pending",
      reward: "100 gems",
    },
  ];

  const hasFoundedCity = (cities: any) => {
    return cities.length > 0;
  };

  const hasConstructedIronMine = (upgradedTiles: any) => {
    return upgradedTiles.some((tile: any) => tile.tileType && tile.tileType.ironMine);
  };

  const hasRecruitedTwoWarriors = (allUnits: any) => {
    const warriorCount = allUnits.filter((unit: any) => unit.unitType && unit.unitType.warrior).length;
    return warriorCount >= 2;
  };

  const hasDefeatedBarbarian = (npcs: any) => {
    return !npcs.some((npc: any) => npc.unitType && npc.unitId === 0);
  };

  const hasResearchedArchery = (technologies: any) => {
    return technologies.researchedTechnologies.some((tech: any) => tech.hasOwnProperty("archery"));
  };

  const hasBuiltBarracksAndWalls = (cities: any) => {
    return cities.some((city: any) => {
      const buildings = city.buildings || [];
      const hasBarracks = buildings.some((building: any) => building.hasOwnProperty("barracks"));
      const hasWalls = buildings.some((building: any) => building.hasOwnProperty("wall"));
      return hasBarracks && hasWalls;
    });
  };

  const hasConstructedForge = (cities: any) => {
    return cities.some((city: any) => {
      const buildings = city.buildings || [];
      return buildings.some((building: any) => building.hasOwnProperty("forge"));
    });
  };

  const hasEstablishedSecondCity = (cities: any) => {
    return cities.length >= 2;
  };

  const hasMasteredAllTechnologies = (technologies: any) => {
    return technologies.researchedTechnologies.length >= 17;
  };

  const hasEliminatedAllBarbarianCamps = (npcCities: any) => {
    return npcCities.length === 0;
  };

  questData[0].status = hasFoundedCity(cities) ? "completed" : "pending";
  questData[1].status = hasConstructedIronMine(upgradedTiles) ? "completed" : "pending";
  questData[2].status = hasRecruitedTwoWarriors(allUnits) ? "completed" : "pending";
  questData[3].status = hasDefeatedBarbarian(npcUnits) ? "completed" : "pending";
  questData[4].status = hasResearchedArchery(technologies) ? "completed" : "pending";
  questData[5].status = hasBuiltBarracksAndWalls(cities) ? "completed" : "pending";
  questData[6].status = hasConstructedForge(cities) ? "completed" : "pending";
  questData[7].status = hasEstablishedSecondCity(cities) ? "completed" : "pending";
  questData[8].status = hasMasteredAllTechnologies(technologies) ? "completed" : "pending";
  questData[9].status = hasEliminatedAllBarbarianCamps(npcCities) ? "completed" : "pending";

  return (
    <div className="quests">
      {questData.map((quest) => (
        <QuestBlock {...quest} />
      ))}
    </div>
  );
};

export default Quests;
