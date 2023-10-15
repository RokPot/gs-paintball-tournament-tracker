import { Avatar, Button, Typography, useTheme } from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import QuickAddTeam from 'components/teams/QuickAddTeam';
import { useFormik } from 'formik';
import { useState } from 'react';
import { League } from 'types/League';
import { Team } from 'types/Team';

interface AddLeague {
  name?: string;
  teams?: Team[];
}

interface IProps {
  league?: League;
}

const LeagueDetails: React.FC<IProps> = ({ league }) => {
  const theme = useTheme();
  const formik = useFormik<AddLeague>({
    initialValues: { name: league?.name, teams: league?.teams },
    onSubmit: (values: AddLeague) => {},
    enableReinitialize: true,
  });
  const [isTeamAddModalOpen, setIsTeamAddModalOpen] = useState(false);
  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      margin={16}
    >
      <Typography variant="h1">
        {`${league ? 'Edit' : 'Add'} league`}
      </Typography>
      <CustomTextField
        label="League name *"
        id="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        placeholder="League name"
        variant="outlined"
        disableError
        debounceTime={500}
        style={{ width: '100%' }}
      />
      <FlexContainer justifyContent="space-between" width="100%">
        <Typography variant="h2" style={{ marginBottom: '0px' }}>
          Teams
        </Typography>
        <Button size="small" onClick={() => setIsTeamAddModalOpen(true)}>
          <Typography style={{ textTransform: 'none' }}>
            Add new team
          </Typography>
        </Button>
      </FlexContainer>

      <Typography
        variant="subtitle2"
        color={(theme) => theme.palette.text.disabled}
      >
        Add teams for the tournament (you can also add them later)
      </Typography>
      <FlexContainer highlightRowOnHover width="100%">
        {formik?.values?.teams?.map((team, index) => (
          <FlexContainer flexDirection="row" margin={8} padding="8px">
            <Typography variant="h6Medium">{index}.</Typography>
            <Avatar>{team?.teamTag}</Avatar>
            <Typography>{team?.teamName}</Typography>
            <Typography
              variant="subtitle1"
              color={(theme) => theme.palette.text.secondary}
            >
              {team?.members
                ? `(${team?.members.length} ${
                    team?.members.length === 1 ? 'member' : 'members'
                  })`
                : ''}
            </Typography>
          </FlexContainer>
        ))}
      </FlexContainer>
      <CustomModal
        isModalOpen={isTeamAddModalOpen}
        onClose={() => setIsTeamAddModalOpen(false)}
        width={600}
      >
        <QuickAddTeam
          onAccept={(team) => {
            formik.setFieldValue('teams', [
              ...(formik?.values?.teams || []),
              team,
            ]);
            setIsTeamAddModalOpen(false);
          }}
          onCancel={() => setIsTeamAddModalOpen(false)}
        />
      </CustomModal>
      <FlexContainer flexDirection="row" margin={16}>
        <Button variant="contained" onClick={() => {}}>
          <Typography variant="p1">Confirm</Typography>
        </Button>
        <Button variant="outlined" onClick={() => {}}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

export default LeagueDetails;
