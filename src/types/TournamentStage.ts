import TournamentGroup from './TournamentGroup';
import TournamentScheduleGame from './TournamentScheduleGame';
import { TournamentType } from './TournamentType';
import { TournamentScheduleDto } from './dto/TournamentScheduleDto';
import { TournamentStageDto } from './dto/TournamentStageDto';
import { DocType, IPouchDB } from './interfaces/IPouchDB';
import { ITournamentStage } from './interfaces/ITournamentStage';

export default class TournamentStage extends IPouchDB {
  id: string;

  stage: number;

  groups: TournamentGroup[];

  schedule: TournamentScheduleGame[];

  stageGamesType: TournamentType;

  constructor(props: ITournamentStage) {
    super(props._id, props._rev, props.docType || DocType.TournamentStage);
    this.id = props.id;
    this.stage = props.stage;
    this.groups = props.groups;
    this.schedule = props.schedule;
    this.stageGamesType = props.stageGamesType;
  }

  public toDto = (): TournamentStageDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
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
