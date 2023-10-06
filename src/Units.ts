export type UnitType = {
  type: string;
  label: string;
  description?: string;
  productionCost: number;
  goldCost: number;
  requirement?: string;
};

export const AllUnits: UnitType[] = [
  {
    type: "settler",
    description: "",
    label: "Settler",
    productionCost: 20,
    goldCost: 500,
  },
  {
    type: "builder",
    label: "Builder",
    description: "Can build and gather resources",
    productionCost: 20,
    goldCost: 2,
  },
  {
    type: "warrior",
    label: "Warrior",
    description: "Basic combat unit",
    productionCost: 20,
    goldCost: 240,
  },
  {
    type: "archer",
    label: "Archer",
    productionCost: 20,
    goldCost: 240,
  },
  {
    type: "swordsman",
    label: "Swordsman",
    productionCost: 30,
    goldCost: 240,
  },
  {
    type: "crossbowman",
    label: "Crossbowman",
    productionCost: 40,
    goldCost: 300,
  },
  {
    type: "musketman",
    label: "Musketman",
    productionCost: 50,
    goldCost: 360,
  },
  {
    type: "rifleman",
    label: "Rifleman",
    productionCost: 60,
    goldCost: 420,
  },
  {
    type: "tank",
    label: "Tank",
    productionCost: 80,
    goldCost: 500,
    requirement: "Need to find Oil first",
  },
];
