import { TeamRole } from './TeamRole';

export interface TeamMember {
  id: string;
  name: String;
  lastName: string;
  dob: Date;
  tag: string;

  shirtNumber: number;

  role: TeamRole;
}
