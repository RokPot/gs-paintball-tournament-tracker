import { omit } from 'lodash';
import { useCallback } from 'react';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import TournamentStage from 'types/TournamentStage';
import { TournamentStageDto } from 'types/dto/TournamentStageDto';
import { DocType } from 'types/interfaces/IPouchDB';
import { getStagesDtoList } from 'utils/PouchDBUtils';
import useGroupService from './GroupService';
import usePouchDB, { pouchDbName } from './pouchDB';

const useStageService = () => {
  const db = usePouchDB(pouchDbName);
  const { getGroups } = useGroupService();

  const addNewStage = useCallback(
    async (stage: TournamentStageDto) => {
      await db.post(stage);

      return true;
    },
    [db],
  );

  const addNewStageBatch = useCallback(
    async (stage: TournamentStageDto[]) => {
      await db.bulkDocs(stage);
      return true;
    },
    [db],
  );

  const updateStage = useCallback(
    async (stage: TournamentStageDto) => {
      const res = await db.get(stage._id);

      const toUpdate = {
        ...res,
        ...omit(stage, ['_rev', '_id']),
      };
      await db.put(toUpdate);

      return true;
    },
    [db],
  );

  const deleteStage = useCallback(
    async (stage: TournamentStageDto) => {
      const fetchedStage = await db.get<TournamentStageDto>(stage._id);
      await db.remove(fetchedStage._id, fetchedStage._rev);

      return true;
    },
    [db],
  );

  const getStage = useCallback(
    async (stageId: string) => {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.TournamentStage) {
          if (stageId === doc._id) {
            emit(doc, DocType.TournamentStage);
            if (doc.groupIds) {
              doc.teamIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.Group });
              });
            }
            if (doc.scheduleIds) {
              doc.teamIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.Game });
              });
            }
          }
        }
      };

      const result = await db.query<TournamentStageDto[]>(myMapFunction, {
        include_docs: true,
      });
      const stagesDtoList = getStagesDtoList(result);
      const stagesList: TournamentStage[] = [];
      for (let i = 0; i < stagesDtoList?.length; i += 1) {
        const currentDtoStage = stagesDtoList[i];
        if (currentDtoStage?.groupIds) {
          // eslint-disable-next-line no-await-in-loop
          const groups = await getGroups(stagesDtoList[i].groupIds);

          const schedule: TournamentScheduleGame[] = [];

          currentDtoStage.schedule?.forEach((scheduledGame) => {
            const scheduledGameDto = scheduledGame as any;
            const scheduledGameGroup = groups?.find(
              (group) => group.id === scheduledGameDto.groupId,
            );
            const scheduledActiveGame = scheduledGameGroup?.games.find(
              (game) => game.id === scheduledGameDto.gameId,
            );
            schedule.push({
              ...scheduledGame,
              group: scheduledGameGroup!,
              game: scheduledActiveGame!,
            });
          });
          stagesList.push(
            new TournamentStage({
              ...omit(currentDtoStage, ['groupIds', 'schedule']),
              schedule,
              groups,
            }),
          );
        }
      }

      const group = stagesDtoList?.length > 0 ? stagesDtoList[0] : null;
      return group;
    },
    [db],
  );

  const getStages = useCallback(
    async (stageIds?: string[]) => {
      const myMapFunction = (doc: any, emit: any) => {
        if (
          doc.docType === DocType.TournamentStage &&
          ((stageIds && stageIds.includes(doc._id)) || !stageIds)
        ) {
          emit(doc, DocType.TournamentStage);
          if (doc.groupIds) {
            doc.teamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Group });
            });
          }
          if (doc.scheduleIds) {
            doc.teamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Game });
            });
          }
        }
      };

      const result = await db.query<TournamentStageDto[]>(myMapFunction, {
        include_docs: true,
      });
      const stagesDtoList = getStagesDtoList(result);
      const stagesList: TournamentStage[] = [];
      for (let i = 0; i < stagesDtoList?.length; i += 1) {
        const currentDtoStage = stagesDtoList[i];
        if (currentDtoStage?.groupIds) {
          // eslint-disable-next-line no-await-in-loop
          const groups = await getGroups(stagesDtoList[i].groupIds);

          const schedule: TournamentScheduleGame[] = [];

          currentDtoStage.schedule?.forEach((scheduledGame) => {
            const scheduledGameDto = scheduledGame as any;
            const scheduledGameGroup = groups?.find(
              (group) => group.id === scheduledGameDto.groupId,
            );
            const scheduledActiveGame = scheduledGameGroup?.games.find(
              (game) => game.id === scheduledGameDto.gameId,
            );
            schedule.push({
              ...scheduledGame,
              group: scheduledGameGroup!,
              game: scheduledActiveGame!,
            });
          });
          stagesList.push(
            new TournamentStage({
              ...omit(currentDtoStage, ['groupIds', 'schedule']),
              schedule,
              groups,
            }),
          );
        }
      }
      return stagesList.sort((a, b) => a.stage - b.stage);
    },
    [db],
  );

  return {
    addNewStage,
    addNewStageBatch,
    updateStage,
    deleteStage,
    getStage,
    getStages,
  };
};

export default useStageService;
