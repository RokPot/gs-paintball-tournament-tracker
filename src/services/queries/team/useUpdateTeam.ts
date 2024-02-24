import { useMutation } from '@tanstack/react-query';
import useTeamService from 'services/TeamService';
import Team from 'types/Team';

const useUpdateTeam = () => {
  const { updateTeam: updateTeamService } = useTeamService();

  const { mutateAsync: updateTeam } = useMutation({
    mutationFn: (team: Team) => {
      return updateTeamService(team);
    },
  });

  return {
    updateTeam,
  };
};

export default useUpdateTeam;
