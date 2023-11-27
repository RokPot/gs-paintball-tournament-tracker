import { useMutation } from '@tanstack/react-query';
import useTeamService from 'services/TeamService';
import Team from 'types/Team';

const useAddTeam = () => {
  const { addNewTeam } = useTeamService();

  const { mutateAsync: addTeam } = useMutation({
    mutationFn: (team: Team) => {
      return addNewTeam(team);
    },
  });

  return {
    addTeam,
  };
};

export default useAddTeam;
