import TournamentGroup from './TournamentGroup';
import TournamentScheduleGame from './TournamentScheduleGame';
import { TournamentType } from './TournamentType';
import { TournamentScheduleDto } from './dto/TournamentScheduleDto';
import { TournamentStageDto } from './dto/TournamentStageDto';
import { IRxDB } from './interfaces/IRxDB';
import { ITournamentStage } from './interfaces/ITournamentStage';

export default class TournamentStage extends IRxDB {
  id: string;

  stage: number;

  groups: TournamentGroup[];

  schedule: TournamentScheduleGame[];

  stageGamesType: TournamentType;

  constructor(props: ITournamentStage) {
    super(props._id);
    this.id = props.id;
    this.stage = props.stage;
    this.groups = props.groups;
    this.schedule = props.schedule;
    this.stageGamesType = props.stageGamesType;
  }

  public toDto = (): TournamentStageDto => {
    return {
      _id: this._id,
      id: this.id,
      groupIds: this.groups?.map((group) => group._id),
      stage: this.stage,
      stageGamesType: this.stageGamesType,
      schedule:
        this.schedule?.map(
          (sched) =>
            ({
              gameId: sched.game.id,
              gameNumber: sched.gameNumber,
              groupId: sched.group.id,
              id: sched.id,
              index: sched.index,
              pairedGameId: sched.pairedGameId,
            }) as TournamentScheduleDto,
        ) || [],
      // Embedded groups array (RxDB) - groups are now part of stage document
      groups: this.groups?.map((group) => group.toDto()) || [],
    };
  };
}
