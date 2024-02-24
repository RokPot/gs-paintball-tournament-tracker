import { useMutation } from '@tanstack/react-query';
import useGroupService from 'services/GroupService';
import TournamentGroup from 'types/TournamentGroup';

const useUpdateGroup = () => {
  const { updateGroup: updateExistingGroup } = useGroupService();

  const { mutateAsync: updateGroup } = useMutation({
    mutationFn: (group: TournamentGroup) => {
      return updateExistingGroup(group.toDto());
    },
  });

  return {
    updateGroup,
  };
};

export default useUpdateGroup;
