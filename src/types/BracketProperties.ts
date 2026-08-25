export interface BracketProperties {
  round: number;

  roundGameNumber: number;

  winnerNextRoundGameNumber: number;

  loserNextRoundGameNumber?: number;

  previousLayerGame1Number?: number;

  previousLayerGame2Number?: number;

  isFirstPlaceGame?: boolean;

  isThridPlaceGame?: boolean;

  bye: boolean;
}

export const isByePlaceholderGame = (
  game?: {
    bracketProperties?: BracketProperties | null;
  } | null,
) => game?.bracketProperties?.bye === true;
