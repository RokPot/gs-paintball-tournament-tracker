import { useMutation } from '@tanstack/react-query';
import useGroupService from 'services/GroupService';
import TournamentGroup from 'types/TournamentGroup';

const useAddGroup = () => {
  const { addNewGroup, addNewGroupBatch } = useGroupService();

  const { mutateAsync: addGroup } = useMutation({
    mutationFn: (group: TournamentGroup) => {
      return addNewGroup(group.toDto());
    },
  });

  const { mutateAsync: addGroupsBulk } = useMutation({
    mutationFn: (groups: TournamentGroup[]) => {
      return addNewGroupBatch(groups.map((group) => group.toDto()));
    },
  });

  return {
    addGroup,
    addGroupsBulk,
  };
};

export default useAddGroup;
