export type BuildingType = {
  type: string,
  label: string,
  description?: string,
  goldCost: number;
  numberOfTurns: number;
  requirement?: string,
}

export const AllBuildings: BuildingType[] = [
  {
    "type": "barracks",
    "description": "Produces warriors",
    "label": "Barracks",
    "goldCost": 200,
    "numberOfTurns": 1,
  },{
    "type": "wall",
    "label": "Wall",
    "description": "Enhances defense",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "wallMedieval",
    "label": "Medieval Wall",
    "goldCost": 200,
    "numberOfTurns": 1,
    "requirement": "Wall Lvl1",
  },{
    "type": "barwallRenaissanceracks",
    "label": "Renaissance Wall",
    "goldCost": 200,
    "numberOfTurns": 1,
    "requirement": "Wall Lvl2",
  },{
    "type": "wallIndustrial",
    "label": "Industrial Wall",
    "goldCost": 200,
    "numberOfTurns": 1,
    "requirement": "Wall Lvl3",
  },{
    "type": "library",
    "label": "Library",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "school",
    "label": "School",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "university",
    "label": "University",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "observatory",
    "label": "Observatory",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "forge",
    "label": "Forge",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "factory",
    "label": "Factory",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "energyPlant",
    "label": "Energy Plant",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "market",
    "label": "Market",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "bank",
    "label": "Bank",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "stockExchange",
    "label": "Stock Excahnge",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "granary",
    "label": "Granary",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "mill",
    "label": "Mill",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "bakery",
    "label": "Bakery",
    "goldCost": 200,
    "numberOfTurns": 1
  },{
    "type": "supermarket",
    "label": "Supermarket",
    "goldCost": 200,
    "numberOfTurns": 1
  }
]
