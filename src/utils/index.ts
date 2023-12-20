import config from '../config.json'

function toCamelCase(str: string) {
  if (!str) return '';

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
  if (!str) return '';

  return str
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

}

function canUpgradeUnit(currentLevel: number, currentExp: number): boolean {
  if (!currentExp) return false;
  const maxExpLevels = [config.expForLevel1, config.expForLevel2, config.expForLevel3];

  let maxExp = maxExpLevels[currentLevel];
  return maxExp === currentExp;
}

export {
  toCamelCase,
  capitalizeWords,
  canUpgradeUnit,
}