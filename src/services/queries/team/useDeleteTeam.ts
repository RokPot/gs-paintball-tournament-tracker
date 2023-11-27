import { useMutation } from '@tanstack/react-query';
import useTeamService from 'services/TeamService';
import Team from 'types/Team';

const useDeleteTeam = () => {
  const { deleteTeam: deleteTeamService } = useTeamService();

  const { mutateAsync: deleteTeam } = useMutation({
    mutationFn: (team: Team) => {
      return deleteTeamService(team);
    },
  });

  return {
    deleteTeam,
  };
};

export default useDeleteTeam;
