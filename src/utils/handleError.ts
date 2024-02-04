import { toast } from "react-toastify";

interface HandleError {
  error: any
  logMessage: string
  defaultError?: string,
  closeTimer?: number
}

export function handleError({ logMessage, defaultError, error, closeTimer }: HandleError) {
  console.log(`${logMessage}: `, error);
  if (error instanceof Error) {
    const keyError = extractErrorCode(error.message);
    if(!keyError) return;

    toast.error(errorsMessages[keyError], { autoClose: closeTimer || 3000 });
  } else if (defaultError) {
    toast.error('An error occurred', { autoClose: closeTimer || 3000 });
  }
}

function extractErrorCode(message: string): ErrorsEnum | null {
  const regex = /Error Code: (\w+)/;
  const match = message.match(regex);

  if (match && match[1]) {
    return match[1] as unknown as ErrorsEnum;
  }

  return null;
}

export enum ErrorsEnum {
  TileNotControlled = 'TileNotControlled',
  TileOccupied = 'TileOccupied',
  NoMovementPoints = 'NoMovementPoints',
  WithinControlledTerritory = 'WithinControlledTerritory',
  OutOfAttackRange = 'OutOfAttackRange',
  CannotResearch = 'CannotResearch',
  ResearchAlreadyCompleted = 'ResearchAlreadyCompleted',
  AlreadyResearching = 'AlreadyResearching',
  NotDamagedCity = 'NotDamagedCity',
  InsufficientStone = 'InsufficientStone',
  InsufficientWood = 'InsufficientWood',
  InsufficientGold = 'InsufficientGold',
  InsufficientPopulationForSettler = 'InsufficientPopulationForSettler',
  QueueFull = 'QueueFull',
  TechnologyNotResearched = 'TechnologyNotResearched',
  InsufficientResources = 'InsufficientResources',
  InsufficientGoldForMaintenance = 'InsufficientGoldForMaintenance',
}

const errorsMessages: Record<ErrorsEnum, string> = {
  [ErrorsEnum.TileNotControlled]: 'Tile not controlled',
  [ErrorsEnum.TileOccupied]: 'Tile is occupied by another construction',
  [ErrorsEnum.NoMovementPoints]: 'No movement points left this turn',
  [ErrorsEnum.WithinControlledTerritory]: 'Settler can build new cities only in neutral tiles',
  [ErrorsEnum.OutOfAttackRange]: 'Target is too far away',
  [ErrorsEnum.CannotResearch]: 'You need to research the previous technology first!',
  [ErrorsEnum.ResearchAlreadyCompleted]: 'You already researched this technology!',
  [ErrorsEnum.AlreadyResearching]: 'Other research already in progress',
  [ErrorsEnum.NotDamagedCity]: 'City is not damaged',
  [ErrorsEnum.InsufficientStone]: 'Insufficient stone',
  [ErrorsEnum.InsufficientWood]: 'Insufficient wood',
  [ErrorsEnum.InsufficientGold]: 'Insufficient gold',
  [ErrorsEnum.InsufficientPopulationForSettler]: 'Insufficient population to purchase a settler. Minimum is 2 citizens.',
  [ErrorsEnum.QueueFull]: 'Production queue is at full capacity.',
  [ErrorsEnum.TechnologyNotResearched]: 'You need to unlock this technology via Research.',
  [ErrorsEnum.InsufficientResources]: 'Not enough resources. See unit tooltip for more info.',
  [ErrorsEnum.InsufficientGoldForMaintenance]: 'You don\'t have enough of gold for unit maintenance.',
};
