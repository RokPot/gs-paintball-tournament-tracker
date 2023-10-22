import { uniqBy } from 'lodash';
import { useCallback } from 'react';
import useGlobalStore from 'store/GlobalStore';
import { Team } from 'types/Team';

const TeamService = () => {
  const { selectedLeague, setSelectedLeague, allTeams, addTeam } =
    useGlobalStore();

  const addNewTeam = useCallback((team: Team, addToCurrentLeague: boolean) => {
    addTeam(team);
    if (!addToCurrentLeague) {
      return;
    }

    setSelectedLeague(
      selectedLeague
        ? {
            ...selectedLeague,
            teams: uniqBy([...selectedLeague.teams, team], (c) => c.id),
          }
        : undefined
    );
  }, []);
  const updateTeam = useCallback((team: Team) => {}, []);
  const deleteTeam = useCallback((team: Team) => {}, []);
  const getTeam = useCallback((team: Team) => {}, []);
  const getTeams = useCallback((team: Team) => {}, []);

  return { addNewTeam, updateTeam, deleteTeam, getTeam, getTeams };
};

export default TeamService;
