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
    maintenanceCost?: number;
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
      resourceCost: "-1 population",
    },
  },
  {
    type: "builder",
    label: "Builder",
    description: "Builders can upgrade tiles",
    productionCost: 20,
    goldCost: 100,
    requirement: "",
    stats: {
      builds: 1,
      movement: 2,
    },
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
    },
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
      maintenanceCost: 1,
    },
  },
  {
    type: "horseman",
    label: "Horseman",
    productionCost: 30,
    goldCost: 280,
    requirement: "horsebackRiding",
    tech: "Horseback Riding",
    stats: {
      attack: 14,
      movement: 3,
      resourceCost: "Cost: 10",
      resourceType: "horses",
      maintenanceCost: 2,
    },
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
      maintenanceCost: 1,
    },
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
      maintenanceCost: 2,
    },
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
      maintenanceCost: 2,
    },
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
      maintenanceCost: 4,
    },
  },
  {
    type: "tank",
    label: "Tank",
    productionCost: 80,
    goldCost: 500,
    requirement: "tanksAndArmor",
    tech: "Tanks And Armor",
    stats: {
      attack: 50,
      movement: 4,
      maintenanceCost: 7,
    },
  },
];
