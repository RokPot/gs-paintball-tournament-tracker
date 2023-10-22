import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import QuickAddTeam from 'components/teams/QuickAddTeam';
import { useFormik } from 'formik';
import { useState } from 'react';
import { League } from 'types/League';
import { Team } from 'types/Team';
import { LeagueDetailsSchema } from 'utils/schemes';
import { v4 } from 'uuid';

interface AddLeague {
  name: string;
  teams: Team[];
}

interface IProps {
  league?: League;
  onConfirm: (league: League) => void;
  onClose: () => void;
}

const LeagueDetails: React.FC<IProps> = ({ league, onClose, onConfirm }) => {
  const theme = useTheme();

  const formik = useFormik<AddLeague>({
    initialValues: { name: league?.name || '', teams: league?.teams || [] },
    validationSchema: LeagueDetailsSchema,
    onSubmit: (values: AddLeague) => {
      onConfirm(
        new League({
          id: v4(),
          leaderboard: [],
          name: values.name,
          teams: values.teams,
          tournaments: [],
        })
      );
    },
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
        helperText={formik?.errors?.name}
        placeholder="League name"
        variant="outlined"
        debounceTime={500}
        style={{ width: '100%', marginBottom: '0px' }}
      />
      <FlexContainer
        justifyContent="space-between"
        width="100%"
        style={{ marginBottom: '0px' }}
      >
        <Typography variant="h2">Teams</Typography>
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
        Add teams which will participate in the league (you can also add them
        later)
      </Typography>
      <FlexContainer width="100%" flexDirection="column">
        {formik?.values?.teams?.map((team: Team, index: number) => (
          <FlexContainer
            flexDirection="row"
            margin={8}
            padding="8px"
            key={index}
            width="100%"
            highlightRowOnHover
          >
            <Typography variant="p1Medium">{index}.</Typography>
            <Avatar variant="rounded">
              <Typography
                variant="p1Medium"
                style={{ textTransform: 'uppercase' }}
              >
                {team?.teamTag}
              </Typography>
            </Avatar>
            <Typography>{team?.teamName}</Typography>
            <Typography
              variant="subtitle1"
              color={(theme) => theme.palette.text.secondary}
            >
              {team?.members?.length
                ? `(${team?.members.length} ${
                    team?.members.length === 1 ? 'member' : 'members'
                  })`
                : ''}
            </Typography>
            <IconButton
              style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
              onClick={() => {
                const teams = formik?.values?.teams;
                teams?.splice(index, 1);
                formik.setFieldValue('teams', [...(teams || [])]);
              }}
            >
              <FontAwesomeIcon icon={faRemove} width={10} />
            </IconButton>
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
        <Button
          variant="contained"
          onClick={formik.submitForm}
          disabled={!formik.isValid}
        >
          <Typography variant="p1">Confirm</Typography>
        </Button>
        <Button variant="outlined" onClick={onClose}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

export default LeagueDetails;
