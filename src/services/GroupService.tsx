import { omit } from 'lodash';
import { useCallback, useContext } from 'react';
import { PouchDBContext } from 'store/PouchDBContext';
import { TournamentDto } from 'types/dto/TournamentDto';
import { TournamentGroupDto } from 'types/dto/TournamentGroupDto';
import { DocType } from 'types/interfaces/IPouchDB';
import { getGroupsList } from 'utils/PouchDBUtils';

const useGroupService = () => {
  const { database } = useContext(PouchDBContext);

  const addNewGroup = useCallback(
    async (group: TournamentGroupDto) => {
      await database.post(group);

      return true;
    },
    [database],
  );

  const addNewGroupBatch = useCallback(
    async (groups: TournamentGroupDto[]) => {
      await database.bulkDocs(groups);
      return true;
    },
    [database],
  );

  const updateGroup = useCallback(
    async (group: TournamentGroupDto) => {
      const res = await database.get(group._id);

      const toUpdate = {
        ...res,
        ...omit(group, ['_rev', '_id']),
      };
      await database.put(toUpdate);

      return true;
    },
    [database],
  );

  const deleteGroup = useCallback(
    async (group: TournamentGroupDto) => {
      const fetchedGroup = await database.get<TournamentGroupDto>(group._id);
      await database.remove(fetchedGroup._id, fetchedGroup._rev);

      return true;
    },
    [database],
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
      const result = await database.query<TournamentDto[]>(myMapFunction, {
        include_docs: true,
      });
      const groupsList = getGroupsList(result);
      const group = groupsList?.length > 0 ? groupsList[0] : null;
      return group;
    },
    [database],
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
      const result = await database.query<TournamentGroupDto[]>(myMapFunction, {
        include_docs: true,
      });
      const groups = getGroupsList(result);
      return groups.sort((a, b) => a.groupIndex - b.groupIndex);
    },
    [database],
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
