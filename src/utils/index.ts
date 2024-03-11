import config from "../config.json";
import SeaMaps from "../mapVersions.json"

import { weightedRandomTile } from "../components/Terrain";

const AllMaps: Array<{
  game_map: undefined | Array<number>,
  npc_position_1?: { x: number, y: number },
  npc_position_2?: { x: number, y: number }}
> = [{
  // ground map has randomly setted barbarians
  game_map: undefined,
}, {
  game_map: SeaMaps.sea_v1,
  npc_position_1: { x: 16, y: 3},
  npc_position_2: { x: 18, y: 12 },
}, {
  game_map: SeaMaps.sea_v2,
  npc_position_1: { x: 10, y: 10 },
}, {
  game_map: SeaMaps.sea_v3,
  npc_position_1: { x: 3, y: 17}
}]

function toCamelCase(str: string) {
  if (!str) return "";

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

function capitalizeWords(str: string) {
  if (!str) return "";

  return str
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function canUpgradeUnit(currentLevel: number, currentExp: number): boolean {
  const { expThresholds } = config;

  if (!currentExp || currentLevel < 0 || currentLevel >= expThresholds.length) {
    return false;
  }

  return currentExp === expThresholds[currentLevel];
}

// Helper function to generate random coordinates during game initialization
function getRandomCoordinates() {
  // don't spawn on the border tiles, skipping the first and last row and column
  const min = 1;
  const max = 18;
  const x = Math.floor(Math.random() * (max - min + 1)) + min;
  const y = Math.floor(Math.random() * (max - min + 1)) + min;
  return { x, y };
}

// Helper function that will not allow to spawn player/npc's on sea tiles
function isInSea(position: { x: number, y: number }, map?: Array<number>): boolean {
  if (!map) return false
  // size of the map
  const MAP_BOUND = 20;
  const mapIdx = position.y * MAP_BOUND + position.x;

  return map[mapIdx] === config.seaTerrain ? true : false; 
}

// Function to calculate distance between two points on the grid
function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function formatLargeNumber(number: number): string {
  const absNumber = Math.abs(number);

  if (absNumber >= 1e6) {
    return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (absNumber >= 1e3) {
    return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  }

  return number.toString();
}

function formatAddress(address: string, symbols: number = 4): string {
  if (!address) return "";
  return `${address.substring(0, symbols)}...${address.slice(-symbols)}`;
}

function getRandomCoordinatesNotInSea(map: Array<number>): { x: number, y: number } {
  let position
  do {
    position = getRandomCoordinates()
  } while (isInSea(position, map))
  return position
}

function getInitialPositions(): {
  map: Array<number>,
  userPosition: { x: number, y: number },
  npcPosition1: { x: number, y: number },
  npcPosition2: { x: number, y: number}
} {
  let finalRandomMap;
  const randomSelectedMap = AllMaps[Math.floor(Math.random() * AllMaps.length)]
  
  if (randomSelectedMap && Array.isArray(randomSelectedMap?.game_map)) {
    // change all ground tile to random but dont change any sea tile
    finalRandomMap = randomSelectedMap?.game_map.map((tile) => tile === 17 ? 17 : weightedRandomTile())
  } else {
    finalRandomMap = Array.from({ length: 400 }, () => weightedRandomTile());
  }

  let userPosition, npcPosition1, npcPosition2;

  // Render npc1 position
  if (randomSelectedMap && randomSelectedMap.npc_position_1) {
    npcPosition1 = randomSelectedMap.npc_position_1
  } else {
    // npcPosition1 will be always not in sea
    npcPosition1 = getRandomCoordinates();
  }

  // Render npc2 position
  if (randomSelectedMap && randomSelectedMap.npc_position_2) {
    npcPosition2 = randomSelectedMap.npc_position_2
  } else {
    do {
      npcPosition2 = getRandomCoordinatesNotInSea(finalRandomMap);
    } while (calculateDistance(npcPosition1, npcPosition2) < 10);
  }

  do {
    // Generate random player location not in sea
    userPosition = getRandomCoordinatesNotInSea(finalRandomMap);
  } while (
    // as we spawn builder and warrior - they should be on the sea
    calculateDistance({ x: userPosition.x + 1, y: userPosition.y + 1}, npcPosition1) < 10 ||
    calculateDistance({ x: userPosition.x + 1, y: userPosition.y + 1 }, npcPosition2) < 10);

  return {
    map: finalRandomMap,
    userPosition,
    npcPosition1,
    npcPosition2,
  }
}


type BuildingType = {
  type: "building";
  resourceName: "science" | "gold" | "food" | "production" | "housing" | "defence";
  income: number;
  extra?: "housing" | "gold";
  extraValue?: number;
};

type UnitType = {
  type: "unit";
  attack: number;
  movement: number;
  maintenance: number;
};

type WallType = {
  type: "wall";
  health: number;
  attack: number;
};

function getUnitOrBuildingStats(unitOrBuildingName: string): BuildingType | UnitType | WallType {
  const BuildingsAndUnits: Record<string, BuildingType | UnitType | WallType> = {
    // @todo: fix Archery as it unlock Unlocks Archery
    // initially avaiable
    Barracks: { type: "building", resourceName: "defence", income: 2, extra: "housing", extraValue: 2 },
    Settler: { type: "unit", attack: 0, movement: 2, maintenance: 0 },
    Builder: { type: "unit", attack: 0, movement: 2, maintenance: 0 },
    Warrior: { type: "unit", attack: 8, movement: 2, maintenance: 0 },
    Wall: { type: "wall", health: 50, attack: 5 },

    // available from research
    Library: { type: "building", resourceName: "science", income: 2 },
    School: { type: "building", resourceName: "science", income: 3 },
    University: { type: "building", resourceName: "science", income: 4, extra: "housing", extraValue: 1 },
    Observatory: { type: "building", resourceName: "science", income: 5 },

    Market: { type: "building", resourceName: "gold", income: 2 },
    Bank: { type: "building", resourceName: "gold", income: 3 },
    "Stock Exchange": { type: "building", resourceName: "gold", income: 4 },

    Granary: { type: "building", resourceName: "food", income: 2, extra: "housing", extraValue: 2 },
    Mill: { type: "building", resourceName: "food", income: 2 },
    Bakery: { type: "building", resourceName: "food", income: 3 },
    Supermarket: { type: "building", resourceName: "food", income: 4 },

    Forge: { type: "building", resourceName: "production", income: 2 },
    Factory: { type: "building", resourceName: "production", income: 3 },
    "Energy Plant": { type: "building", resourceName: "production", income: 4 },
    "Residential Complex": { type: "building", resourceName: "housing", income: 5 },

    Archer: { type: "unit", attack: 10, movement: 2, maintenance: 1 },
    Horseman: { type: "unit", attack: 14, movement: 3, maintenance: 2 },
    Swordsman: { type: "unit", attack: 14, movement: 2, maintenance: 1 },
    Crossbowman: { type: "unit", attack: 24, movement: 2, maintenance: 2 },
    Musketman: { type: "unit", attack: 32, movement: 2, maintenance: 2 },
    Rifleman: { type: "unit", attack: 40, movement: 2, maintenance: 4 },
    Tank: { type: "unit", attack: 50, movement: 2, maintenance: 7 },
    // naval units
    Galley: { type: "unit", attack: 10, movement: 3, maintenance: 0 },
    Frigate: { type: "unit", attack: 14, movement: 4, maintenance: 1 },
    Battleship: { type: "unit", attack: 24, movement: 5, maintenance: 3 },

    "Medieval Wall": { type: "wall", health: 100, attack: 10 },
    "Renaissance Wall": { type: "wall", health: 150, attack: 20 },
    "Industrial Wall": { type: "wall", health: 200, attack: 30 },

    // naval buildings
    "Sea Port": { type: "building", resourceName: "gold", income: 2, extra: "housing", extraValue: 1 },
    Shipyard: { type: "building", resourceName: "production", income: 2, extra: "gold", extraValue: 1 },
    Lighthouse: { type: "building", resourceName: "food", income: 1, extra: "gold", extraValue: 1 },
  };

  return BuildingsAndUnits[unitOrBuildingName];
}

function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export {
  toCamelCase,
  capitalizeWords,
  canUpgradeUnit,
  getRandomCoordinates,
  isInSea,
  calculateDistance,
  formatLargeNumber,
  formatAddress,
  getUnitOrBuildingStats,
  sleep,
  getInitialPositions,
};
