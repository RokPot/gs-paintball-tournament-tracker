export enum TournamentTypeEnum {
  roundRobin = 'roundRobin',
  singleElimination = 'singleElimination',
  training = 'training',
  renting = 'renting',
}

export enum TournamentTypeLabels {
  roundRobin = 'Round-Robin tournament',
  singleElimination = 'Single elimination tournament',
  training = 'Training',
  renting = 'Renting',
}

export interface TournamentTypeSettings {
  numberOfWinsRequired: number;
  firstPlaceNumberOfWinsRequired: number;
  thirdPlaceNumberOfWinsRequired: number;
}

export interface TournamentType {
  type: TournamentTypeEnum;
  settings: TournamentTypeSettings;
}
