import { TeamMember } from 'types/TeamMember';

export interface ITeam {
  id: string;
  teamName: String;
  teamTag: string;
  wins?: number;
  loses?: number;
  draw?: number;
  members: TeamMember[];
}
