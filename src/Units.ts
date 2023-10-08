export type UnitType = {
  type: string;
  label: string;
  description?: string;
  productionCost: number;
  goldCost: number;
  requirement?: string;
  tech?: string;
  stats?: {
    builds?: number;
    attack?: number;
    movement?: number;
    resourceCost?: string;
    resourceType?: string;
    yield?: string;
  };
  isUnlocked?: boolean;
};

export const AllUnits: UnitType[] = [
  {
    type: "settler",
    description: "Settlers can found new cities",
    label: "Settler",
    productionCost: 20,
    goldCost: 100,
    requirement: "",
    stats: {
      builds: 1,
      movement: 2,
      resourceCost: "Cost: 60",
      resourceType: "food",
    }
  },
  {
    type: "builder",
    label: "Builder",
    description: "Builders can upgrade tiles to produce more resources",
    productionCost: 20,
    goldCost: 100,
    requirement: "",
    stats: {
      builds: 1,
      movement: 2,
    }
  },
  {
    type: "warrior",
    label: "Warrior",
    description: "The most basic combat unit",
    productionCost: 20,
    goldCost: 200,
    requirement: "",
    stats: {
      attack: 8,
      movement: 2,
    }
  },
  {
    type: "archer",
    label: "Archer",
    productionCost: 20,
    goldCost: 200,
    requirement: "archery",
    tech: "Archery",
    stats: {
      attack: 10,
      movement: 2,
    }
  },
  {
    type: "swordsman",
    label: "Swordsman",
    productionCost: 30,
    goldCost: 240,
    requirement: "ironWorking",
    tech: "Iron Working",
    stats: {
      attack: 14,
      movement: 2,
      resourceCost: "Cost: 10",
      resourceType: "iron",
    }
  },
  {
    type: "crossbowman",
    label: "Crossbowman",
    productionCost: 40,
    goldCost: 240,
    requirement: "medievalWarfare",
    tech: "Medieval Warfare",
    stats: {
      attack: 24,
      movement: 2,
    }
  },
  {
    type: "musketman",
    label: "Musketman",
    productionCost: 50,
    goldCost: 360,
    requirement: "gunpowder",
    tech: "Gunpowder",
    stats: {
      attack: 32,
      movement: 2,
    }
  },
  {
    type: "rifleman",
    label: "Rifleman",
    productionCost: 60,
    goldCost: 420,
    requirement: "ballistics",
    tech: "Ballistics",
    stats: {
      attack: 40,
      movement: 3,
    }
  },
  {
    type: "tank",
    label: "Tank",
    productionCost: 80,
    goldCost: 500,
    requirement: "tanksAndArmor",
    tech: "Tanks and Armor",
    stats: {
      attack: 50,
      movement: 4,
    }
  },
];
