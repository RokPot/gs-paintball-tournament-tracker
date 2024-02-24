import { useMutation } from '@tanstack/react-query';
import useGroupService from 'services/GroupService';
import TournamentGroup from 'types/TournamentGroup';

const useDeleteGroup = () => {
  const { deleteGroup } = useGroupService();

  const { mutateAsync: deleteGroupMutate } = useMutation({
    mutationFn: (group: TournamentGroup) => {
      return deleteGroup(group.toDto());
    },
  });

  return {
    deleteGroupMutate,
  };
};

export default useDeleteGroup;
