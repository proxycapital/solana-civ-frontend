export type BuildingType = {
  type: string;
  label: string;
  description?: string;
  productionCost: number;
  goldCost: number;
  requirement?: string;
};

export const AllBuildings: BuildingType[] = [
  {
    type: "barracks",
    description: "Produces warriors",
    label: "Barracks",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "wall",
    label: "Wall",
    description: "Enhances defense",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "wallMedieval",
    label: "Medieval Wall",
    goldCost: 4,
    productionCost: 4,
    requirement: "Wall Lvl1",
  },
  {
    type: "barwallRenaissanceracks",
    label: "Renaissance Wall",
    goldCost: 4,
    productionCost: 4,
    requirement: "Wall Lvl2",
  },
  {
    type: "wallIndustrial",
    label: "Industrial Wall",
    goldCost: 4,
    productionCost: 4,
    requirement: "Wall Lvl3",
  },
  {
    type: "library",
    label: "Library",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "school",
    label: "School",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "university",
    label: "University",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "observatory",
    label: "Observatory",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "forge",
    label: "Forge",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "factory",
    label: "Factory",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "energyPlant",
    label: "Energy Plant",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "market",
    label: "Market",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "bank",
    label: "Bank",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "stockExchange",
    label: "Stock Excahnge",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "granary",
    label: "Granary",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "mill",
    label: "Mill",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "bakery",
    label: "Bakery",
    goldCost: 4,
    productionCost: 4,
  },
  {
    type: "supermarket",
    label: "Supermarket",
    goldCost: 4,
    productionCost: 4,
  },
];
