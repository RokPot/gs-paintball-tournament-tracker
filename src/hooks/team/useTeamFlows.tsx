import { useCallback } from 'react';
import { TeamQueries } from 'services/queries/team/TeamQueries';

import Team from 'types/Team';

const useTeamFlows = () => {
  const { mutateAsync: updateTeam } = TeamQueries.useUpdateTeam();
  const { mutateAsync: addTeam } = TeamQueries.useAddTeam();
  const { invalidateTeamsList } = TeamQueries.useTeamInvalidations();

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

export default useTeamFlows;
