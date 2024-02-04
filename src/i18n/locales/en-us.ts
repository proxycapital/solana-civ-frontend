const enUs = {
  messages: {
    TileNotControlled: 'Tile not controlled',
    TileOccupied: 'Tile is occupied by another construction',
    NoMovementPoints: 'No movement points left this turn',
    WithinControlledTerritory: 'Settler can build new cities only in neutral tiles',
    OutOfAttackRange: 'Target is too far away',
    CannotResearch: 'You need to research the previous technology first!',
    ResearchAlreadyCompleted: 'You already researched this technology!',
    AlreadyResearching: 'Other research already in progress',
    NotDamagedCity: 'City is not damaged',
    InsufficientStone: 'Insufficient stone',
    InsufficientWood: 'Insufficient wood',
    InsufficientGold: 'Insufficient gold',
    InsufficientPopulationForSettler: 'Insufficient population to purchase a settler. Minimum is 2 citizens.',
    QueueFull: 'Production queue is at full capacity.',
    TechnologyNotResearched: 'You need to unlock this technology via Research.',
    InsufficientResources: 'Not enough resources. See unit tooltip for more info.',
    InsufficientGoldForMaintenance: 'You don\'t have enough of gold for unit maintenance.',
  },
  errors: {
    ErrorBuildingConstruction: 'Error building construction',
    CityBuildFailed: 'Failed to build a city',
    ErrorResearchTechnology: 'Research: Something went wrong',
    PurchaseFailed: 'Failed to purchase {{label}}',
    RepairFailed: 'Error repairing city {{cityId}}',
    ErrorProductionQueue: 'Error adding to production queue {{cityId}}'
  }
}

export default enUs
