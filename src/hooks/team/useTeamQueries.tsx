import { useCallback } from 'react';
import useAddTeam from 'services/queries/team/useAddTeam';
import useTeamInvalidations from 'services/queries/team/useTeamInvalidations';
import useUpdateTeam from 'services/queries/team/useUpdateTeam';
import Team from 'types/Team';

const useTeamQueries = () => {
  const { updateTeam } = useUpdateTeam();
  const { addTeam } = useAddTeam();
  const { invalidateTeamsList } = useTeamInvalidations();

  const addOrEditTeam = useCallback(
    async (team: Team, shouldUpdate?: boolean) => {
      if (shouldUpdate) {
        await updateTeam(team);
      } else {
        await addTeam(team);
      }
      await invalidateTeamsList();
    },
    [addTeam, invalidateTeamsList, updateTeam],
  );
  return { addOrEditTeam };
};

export default useTeamQueries;
