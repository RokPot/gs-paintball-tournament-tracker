import { omit } from 'lodash';
import { useCallback } from 'react';
import { TournamentDto } from 'types/dto/TournamentDto';
import { TournamentGroupDto } from 'types/dto/TournamentGroupDto';
import { DocType } from 'types/interfaces/IPouchDB';
import { getGroupsList } from 'utils/PouchDBUtils';
import usePouchDB, { pouchDbName } from './pouchDB';

const useGroupService = () => {
  const db = usePouchDB(pouchDbName);

  const addNewGroup = useCallback(
    async (group: TournamentGroupDto) => {
      await db.post(group);

      return true;
    },
    [db],
  );

  const addNewGroupBatch = useCallback(
    async (groups: TournamentGroupDto[]) => {
      await db.bulkDocs(groups);
      return true;
    },
    [db],
  );

  const updateGroup = useCallback(
    async (group: TournamentGroupDto) => {
      const res = await db.get(group._id);

      const toUpdate = {
        ...res,
        ...omit(group, ['_rev', '_id']),
      };
      await db.put(toUpdate);

      return true;
    },
    [db],
  );

  const deleteGroup = useCallback(
    async (group: TournamentGroupDto) => {
      const fetchedGroup = await db.get<TournamentGroupDto>(group._id);
      await db.remove(fetchedGroup._id, fetchedGroup._rev);

      return true;
    },
    [db],
  );

  const getGroup = useCallback(
    async (groupId: string) => {
      const myMapFunction = (doc: any, emit: any) => {
        if (doc.docType === DocType.Group) {
          if (groupId === doc._id) {
            emit(doc, DocType.Group);
            if (doc.teamIds) {
              doc.teamIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.Team });
              });
            }
            if (doc.gameIds) {
              doc.gameIds.forEach((item: any) => {
                emit(doc._id, { _id: item, type: DocType.Game });
              });
            }
          }
        }
      };
      const result = await db.query<TournamentDto[]>(myMapFunction, {
        include_docs: true,
      });
      const groupsList = getGroupsList(result);
      const group = groupsList?.length > 0 ? groupsList[0] : null;
      return group;
    },
    [db],
  );

  const getGroups = useCallback(
    async (groupIds?: string[]) => {
      const myMapFunction = (doc: any, emit: any) => {
        if (
          doc.docType === DocType.Group &&
          ((groupIds && groupIds.includes(doc._id)) || !groupIds)
        ) {
          emit(doc, DocType.Group);
          if (doc.teamIds) {
            doc.teamIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Team });
            });
          }
          if (doc.gameIds) {
            doc.gameIds.forEach((item: any) => {
              emit(doc._id, { _id: item, type: DocType.Game });
            });
          }
        }
      };
      const result = await db.query<TournamentGroupDto[]>(myMapFunction, {
        include_docs: true,
      });
      const groups = getGroupsList(result);
      return groups.sort((a, b) => a.groupIndex - b.groupIndex);
    },
    [db],
  );

  return {
    addNewGroup,
    addNewGroupBatch,
    updateGroup,
    deleteGroup,
    getGroup,
    getGroups,
  };
};

export default useGroupService;
