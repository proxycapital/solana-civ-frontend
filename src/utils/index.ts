import config from "../config.json";

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

// Function to calculate distance between two points on the grid
function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function formatLargeNumber(number: number): string {
  const absNumber = Math.abs(number);

  if (absNumber >= 1e6) {
    return (number / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absNumber >= 1e3) {
    return (number / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  }

  return number.toString();
}

function formatAddress(address: string, symbols: number = 4): string {
  if (!address) return ''
  return `${address.substring(0, symbols)}...${address.slice(-symbols)}`
}

type BuildingType = {
  type: "building";
  resourceName: "science" | "gold" | "food" | "production" | "housing" | "defence";
  income: number;
  extra?: "housing";
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
    "Barracks":           { type: "building", resourceName: "defence", income: 2, extra: "housing", extraValue: 2 },
    "Settler":            { type: "unit", attack: 0, movement: 2, maintenance: 0},
    "Builder":            { type: "unit", attack: 0, movement: 2, maintenance: 0},
    "Warrior":            { type: "unit", attack: 8, movement: 2, maintenance: 0 },
    "Wall":               { type: "wall", health: 50, attack: 5},

    // available from research
    "Library":            { type: "building", resourceName: "science", income: 2 },
    "School":             { type: "building", resourceName: "science", income: 3 },
    "University":         { type: "building", resourceName: "science", income: 4, extra: "housing", extraValue: 1},
    "Observatory":        { type: "building", resourceName: "science", income: 5 },

    "Market":             { type: "building", resourceName: "gold", income: 2},
    "Bank":               { type: "building", resourceName: "gold", income: 3},
    "Stock Exchange":     { type: "building", resourceName: "gold", income: 4},

    "Granary":            { type: "building", resourceName: "food", income: 2, extra: "housing", extraValue: 2},
    "Mill":               { type: "building", resourceName: "food", income: 2 },
    "Bakery":             { type: "building", resourceName: "food", income: 3 },
    "Supermarket":        { type: "building", resourceName: "food", income: 4 },

    "Forge":              { type: "building", resourceName: "production", income: 2 },
    "Factory":            { type: "building", resourceName: "production", income: 3 },
    "Energy Plant":       { type: "building", resourceName: "production", income: 4 },
    "Residential Complex":{ type: "building", resourceName: "housing", income: 5 },

    "Archer":             { type: "unit", attack: 10, movement: 2, maintenance: 1 },
    "Horseman":           { type: "unit", attack: 14, movement: 3, maintenance: 2 },
    "Swordsman":          { type: "unit", attack: 14, movement: 2, maintenance: 1 },
    "Crossbowman":        { type: "unit", attack: 24, movement: 2, maintenance: 2 },
    "Musketman":          { type: "unit", attack: 32, movement: 2, maintenance: 2 },
    "Rifleman":           { type: "unit", attack: 40, movement: 2, maintenance: 4 },
    "Tank":               { type: "unit", attack: 50, movement: 2, maintenance: 7 },
    
    "Medieval Wall":      { type: "wall", health: 100, attack: 10  },
    "Renaissance Wall":   { type: "wall", health: 150, attack: 20  },
    "Industrial Wall":    { type: "wall", health: 200, attack: 30  },
  }

  return BuildingsAndUnits[unitOrBuildingName];
}

function sleep(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  toCamelCase,
  capitalizeWords,
  canUpgradeUnit,
  getRandomCoordinates,
  calculateDistance,
  formatLargeNumber,
  formatAddress,
  getUnitOrBuildingStats,
  sleep,
};
