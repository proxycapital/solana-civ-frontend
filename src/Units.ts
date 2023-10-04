export type UnitType = {
  type: string,
  label: string,
  description?: string,
  goldCost: number;
  numberOfTurns: number;
  requirement?: string,
}

export const AllUnits: UnitType[] = [
  {
    "type": "settler",
    "description": "",
    "label": "Settler",
    "goldCost": 500,
    "numberOfTurns": 1
  },{
    "type": "builder",
    "label": "Builder",
    "description": "Can build and gather resources",
    "goldCost": 2,
    "numberOfTurns": 1
  },{
    "type": "warrior",
    "label": "Warrior",
    "description": "Basic combat unit",
    "goldCost": 240,
    "numberOfTurns": 1
  },{
    "type": "archer",
    "label": "Archer",
    "goldCost": 240,
    "numberOfTurns": 1
  },{
    "type": "swordsman",
    "label": "Swordsman",
    "goldCost": 240,
    "numberOfTurns": 1
  },{
    "type": "crossbowman",
    "label": "Crossbowman",
    "goldCost": 300,
    "numberOfTurns": 1
  },{
    "type": "musketman",
    "label": "Musketman",
    "goldCost": 360,
    "numberOfTurns": 1
  },{
    "type": "rifleman",
    "label": "Rifleman",
    "goldCost": 420,
    "numberOfTurns": 1
  },{
    "type": "tank",
    "label": "Tank",
    "goldCost": 500,
    "numberOfTurns": 1,
    "requirement": "Need to find Oil first"
  }
]
