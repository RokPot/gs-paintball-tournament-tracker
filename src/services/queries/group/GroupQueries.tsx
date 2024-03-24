import { useMutation } from '@tanstack/react-query';
import useGroupService from 'services/GroupService';
import TournamentGroup from 'types/TournamentGroup';

export namespace GroupQueries {
  export const keys = {
    all: ['groups'],
  };

  export const useAddGroup = () => {
    const { addNewGroup } = useGroupService();

    return useMutation({
      mutationFn: (group: TournamentGroup) => {
        return addNewGroup(group.toDto());
      },
    });
  };

  export const useAddGroups = () => {
    const { addNewGroupBatch } = useGroupService();

    return useMutation({
      mutationFn: (groups: TournamentGroup[]) => {
        return addNewGroupBatch(groups.map((group) => group.toDto()));
      },
    });
  };

  export const useDeleteGroup = () => {
    const { deleteGroup } = useGroupService();

    return useMutation({
      mutationFn: (group: TournamentGroup) => {
        return deleteGroup(group.toDto());
      },
    });
  };

  export const useUpdateGroup = () => {
    const { updateGroup: updateExistingGroup } = useGroupService();

    return useMutation({
      mutationFn: (group: TournamentGroup) => {
        return updateExistingGroup(group.toDto());
      },
    });
  };
}
