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
export {
  toCamelCase,
  capitalizeWords,
  canUpgradeUnit,
  getRandomCoordinates,
  calculateDistance,
  formatLargeNumber,
  formatAddress,
};
