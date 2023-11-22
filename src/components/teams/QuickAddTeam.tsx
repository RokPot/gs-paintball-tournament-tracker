import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, IconButton, Typography, useTheme } from '@mui/material';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import { useFormik } from 'formik';
import Team from 'types/Team';
import { TeamMember } from 'types/TeamMember';
import { TeamRole } from 'types/TeamRole';
import { QuickAddTeamSchema } from 'utils/schemes';
import { v4 } from 'uuid';

function randomColor() {
  const hex = Math.floor(Math.random() * 0xffffff);
  const color = `#${hex.toString(16)}`;

  return color;
}

interface IProps {
  team?: Team;
  onAccept: (team: Team, update?: boolean) => void;
  onCancel: () => void;
}

interface AddTeam {
  teamName: string;
  teamTag: string;
  members: TeamMember[];
}

function QuickAddTeam({ onAccept, onCancel, team }: IProps) {
  const theme = useTheme();
  const formik = useFormik<AddTeam>({
    initialValues: {
      members: team?.members || [],
      teamName: team?.teamName || '',
      teamTag: team?.teamTag || '',
    },
    validationSchema: QuickAddTeamSchema,
    onSubmit: (values: AddTeam) => {
      const newId = v4();
      onAccept(
        new Team({
          _id: newId,
          id: newId,
          color: randomColor(),
          ...team,
          ...values,
        }),
        !!team,
      );
    },
  });

  const addNewTeamMember = () => {
    formik.setFieldValue('members', [
      ...formik.values.members,
      {
        name: '',
        lastName: '',
        dob: new Date(),
        id: v4(),
        role: TeamRole.player,
        shirtNumber: 0,
        tag: '',
      } as TeamMember,
    ]);
  };

  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      margin={16}
      width="100%"
    >
      <Typography variant="h1">Add team</Typography>
      <Typography variant="h3">Details</Typography>
      <FlexContainer width="100%" margin={16} style={{ marginBottom: '0px' }}>
        <CustomTextField
          label="Team name *"
          id="teamName"
          value={formik.values.teamName}
          onChange={formik.handleChange}
          placeholder="Team name"
          variant="outlined"
          style={{ width: '100%' }}
          helperText={String(formik?.errors?.teamName || ' ')}
          debounceTime={200}
        />
        <CustomTextField
          label="Team tag *"
          id="teamTag"
          value={formik.values.teamTag}
          onChange={formik.handleChange}
          placeholder="Team tag"
          variant="outlined"
          style={{ width: '100%' }}
          helperText={String(formik?.errors?.teamTag || ' ')}
          debounceTime={200}
        />
      </FlexContainer>
      <FlexContainer width="100%" justifyContent="space-between">
        <Typography variant="h3">Team members</Typography>
        <IconButton style={{ width: '45px' }} onClick={addNewTeamMember}>
          <FontAwesomeIcon
            icon={faAdd}
            color={theme.palette.primary.main}
            width={15}
          />
        </IconButton>
      </FlexContainer>
      <FlexContainer
        flexDirection="column"
        alignItems="flex-start"
        width="100%"
      >
        {formik.values?.members?.map((teamMember, index) => (
          <FlexContainer
            highlightRowOnHover
            flexDirection="row"
            margin={8}
            width="100%"
            key={index}
            padding="8px"
          >
            <Badge>
              <Typography>Member {index + 1}</Typography>
            </Badge>
            <CustomTextField
              label="First name*"
              id="name"
              value={teamMember.name}
              onChange={(e) => {
                const updatedTeamMember = {
                  ...teamMember,
                  name: e.target.value,
                };
                const teamMembers = formik.values.members;
                teamMembers[index] = updatedTeamMember;
                formik.setFieldValue('members', teamMembers);
              }}
              placeholder="First name"
              variant="outlined"
              style={{ width: '100%' }}
              error={(formik?.errors?.members?.[index] as any)?.name}
              disableError
              size="small"
              debounceTime={200}
            />
            <CustomTextField
              label="Last name*"
              id="lastName"
              value={teamMember.lastName}
              onChange={(e) => {
                const updatedTeamMember = {
                  ...teamMember,
                  lastName: e.target.value,
                };
                const teamMembers = formik.values.members;
                teamMembers[index] = updatedTeamMember;
                formik.setFieldValue('members', teamMembers);
              }}
              placeholder="First name"
              variant="outlined"
              style={{ width: '100%' }}
              size="small"
              error={(formik?.errors?.members?.[index] as any)?.lastName}
              disableError
              debounceTime={200}
            />
          </FlexContainer>
        ))}
        <Button variant="text" onClick={addNewTeamMember}>
          <Typography variant="p1">Add new team member</Typography>
        </Button>
      </FlexContainer>

      <FlexContainer flexDirection="row" margin={16}>
        <Button
          variant="contained"
          onClick={formik.submitForm}
          disabled={!formik.isValid}
        >
          <Typography variant="p1">Confirm</Typography>
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
}

export default QuickAddTeam;
