export type BuildingType = {
  type: string;
  label: string;
  description?: string;
  productionCost: number;
  goldCost: number;
  requirement?: string;
  tech?: string;
  stats?: {
    yield?: string;
    builds?: number;
    attack?: number;
    movement?: number;
    resourceCost?: string;
    resourceType?: string;
    maintenanceCost?: number;
  };
  isUnlocked?: boolean;
};

export const AllBuildings: BuildingType[] = [
  {
    type: "barracks",
    label: "Barracks",
    goldCost: 100,
    productionCost: 6,
    stats: {
      yield: "+2 city defense | +1 housing"
    }
  },
  {
    type: "wall",
    label: "Wall",
    goldCost: 100,
    productionCost: 10,
    stats: {
      yield: "+5 city defense"
    }
  },
  {
    type: "wallMedieval",
    label: "Medieval Wall",
    goldCost: 200,
    productionCost: 16,
    stats: {
      yield: "+10 city defense"
    },
    requirement: "medievalWarfare",
    tech: "Medieval Warfare"
  },
  {
    type: "wallRenaissance",
    label: "Renaissance Wall",
    goldCost: 250,
    productionCost: 20,
    stats: {
      yield: "+10 city defense"
    },
    requirement: "gunpowder",
    tech: "Gunpowder"
  },
  {
    type: "wallIndustrial",
    label: "Industrial Wall",
    goldCost: 300,
    productionCost: 28,
    stats: {
      yield: "+10 city defense"
    },
    requirement: "tanksAndArmor",
    tech: "Tanks and Armor"
  },
  {
    type: "library",
    label: "Library",
    goldCost: 100,
    productionCost: 10,
    stats: {
      yield: "+2 science"
    },
    requirement: "writing",
    tech: "Writing"
  },
  {
    type: "school",
    label: "School",
    goldCost: 150,
    productionCost: 20,
    stats: {
      yield: "+3 science"
    },
    requirement: "education",
    tech: "Education"
  },
  {
    type: "university",
    label: "University",
    goldCost: 200,
    productionCost: 30,
    stats: {
      yield: "+4 science | +1 housing"
    },
    requirement: "academia",
    tech: "Academia"
  },
  {
    type: "observatory",
    label: "Observatory",
    goldCost: 300,
    productionCost: 40,
    stats: {
      yield: "+5 science"
    },
    requirement: "astronomy",
    tech: "Astronomy"
  },
  {
    type: "forge",
    label: "Forge",
    goldCost: 100,
    productionCost: 10,
    stats: {
      yield: "+2 production"
    },
    requirement: "ironWorking",
    tech: "Iron Working"
  },
  {
    type: "factory",
    label: "Factory",
    goldCost: 200,
    productionCost: 20,
    stats: {
      yield: "+3 production"
    },
    requirement: "industrialization",
    tech: "Industrialization"
  },
  {
    type: "energyPlant",
    label: "Energy Plant",
    goldCost: 300,
    productionCost: 30,
    stats: {
      yield: "+4 production"
    },
    requirement: "electricalPower",
    tech: "Electrical Power"
  },
  {
    type: "market",
    label: "Market",
    goldCost: 100,
    productionCost: 10,
    stats: {
      yield: "+2 gold"
    },
    requirement: "economics",
    tech: "Economics"
  },
  {
    type: "bank",
    label: "Bank",
    goldCost: 200,
    productionCost: 20,
    stats: {
      yield: "+3 gold"
    },
    requirement: "economics",
    tech: "Economics"
  },
  {
    type: "stockExchange",
    label: "Stock Excahnge",
    goldCost: 300,
    productionCost: 30,
    stats: {
      yield: "+4 gold"
    },
    requirement: "capitalism",
    tech: "Capitalism"
  },
  {
    type: "granary",
    label: "Granary",
    goldCost: 100,
    productionCost: 10,
    stats: {
      yield: "+2 food | +2 housing"
    },
    requirement: "agriculture",
    tech: "Agriculture"
  },
  {
    type: "mill",
    label: "Mill",
    goldCost: 200,
    productionCost: 20,
    stats: {
      yield: "+2 food"
    },
    requirement: "agriculture",
    tech: "Agriculture"
  },
  {
    type: "bakery",
    label: "Bakery",
    goldCost: 300,
    productionCost: 30,
    stats: {
      yield: "+3 food"
    },
    requirement: "construction",
    tech: "Construction"
  },
  {
    type: "supermarket",
    label: "Supermarket",
    goldCost: 400,
    productionCost: 40,
    stats: {
      yield: "+4 food"
    },
    requirement: "modernFarming",
    tech: "Modern Farming"
  },
  {
    type: "residentialComplex",
    label: "Residential Complex",
    goldCost: 600,
    productionCost: 40,
    stats: {
      yield: "+5 housing"
    },
    requirement: "urbanization",
    tech: "Urbanization"
  },
];
