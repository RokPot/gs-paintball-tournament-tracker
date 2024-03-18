import TournamentGroup from './TournamentGroup';
import { TournamentScheduleGame } from './TournamentScheduleGame';
import { TournamentScheduleDto } from './dto/TournamentScheduleDto';
import { TournamentStageDto } from './dto/TournamentStageDto';
import { DocType, IPouchDB } from './interfaces/IPouchDB';
import { ITournamentStage } from './interfaces/ITournamentStage';

export default class TournamentStage extends IPouchDB {
  id: string;

  stage: number;

  groups: TournamentGroup[];

  schedule: TournamentScheduleGame[];

  constructor(props: ITournamentStage) {
    super(props._id, props._rev, props.docType || DocType.TournamentStage);
    this.id = props.id;
    this.stage = props.stage;
    this.groups = props.groups;
    this.schedule = props.schedule;
  }

  public toDto = (): TournamentStageDto => {
    return {
      _id: this._id,
      _rev: this._rev,
      docType: this.docType,
      id: this.id,
      groupIds: this.groups?.map((group) => group._id),
      stage: this.stage,
      schedule:
        this.schedule?.map(
          (schedule) =>
            ({
              gameId: schedule.game.id,
              gameNumber: schedule.gameNumber,
              groupId: schedule.group.id,
              id: schedule.id,
            }) as TournamentScheduleDto,
        ) || [],
    };
  };
}
