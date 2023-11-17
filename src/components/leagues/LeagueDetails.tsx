import {
  Autocomplete,
  Avatar,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import QuickAddTeam from 'components/teams/QuickAddTeam';
import TeamsShortList from 'components/teams/TeamShortList';
import { useFormik } from 'formik';
import { useState } from 'react';
import useTeamService from 'services/TeamService';
import useTeamQueries from 'services/queries/TeamQueries';
import { createNewLeaderboardTeam } from 'store/LeagueStore';
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
  onConfirm: (league: League, isEdit: boolean) => void;
  onClose: () => void;
}

const LeagueDetails: React.FC<IProps> = ({ league, onClose, onConfirm }) => {
  const { addNewTeam, getTeams } = useTeamService();
  const { teamsList } = useTeamQueries();

  const formik = useFormik<AddLeague>({
    initialValues: { name: league?.name || '', teams: league?.teams || [] },
    validationSchema: LeagueDetailsSchema,
    onSubmit: (values: AddLeague) => {
      const teamId = league?._id || v4();
      const newTeams = values.teams.filter(
        (team) =>
          !league?.leaderboard.some(
            (leaderboardTeam) => leaderboardTeam.team.id === team.id
          )
      );
      onConfirm(
        new League({
          id: teamId,
          _id: teamId,
          leaderboard: [
            ...(league?.leaderboard || []),
            ...newTeams.map((team) => {
              return createNewLeaderboardTeam(team);
            }),
          ],
          name: values.name,
          teams: values.teams,
          tournaments: [],
        }),
        !!league
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
        debounceTime={200}
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
      <Autocomplete
        multiple
        fullWidth
        value={
          formik?.values?.teams?.map((team) => ({
            title: team.teamName,
            value: team,
          })) || []
        }
        options={
          teamsList?.map((team) => ({
            title: team.teamName,
            value: team,
          })) || []
        }
        getOptionLabel={(option) => option.title.toString()}
        renderOption={(props, option) => (
          <Typography {...props}>
            <Avatar
              variant="rounded"
              style={{
                backgroundColor: option.value.color,
                height: '25px',
                width: '25px',
                marginRight: '8px',
              }}
            >
              <Typography
                variant="body2"
                style={{ textTransform: 'uppercase' }}
              >
                {option.value.teamTag}
              </Typography>
            </Avatar>
            {option.value.teamName}
          </Typography>
        )}
        disableCloseOnSelect
        filterSelectedOptions
        onChange={(_, value) =>
          formik.setFieldValue(
            'teams',
            value.map((val) => val.value)
          )
        }
        isOptionEqualToValue={(option, value) => {
          return option.value.id === value.value.id;
        }}
        limitTags={-1}
        renderTags={() => (
          <Typography
            variant="body1"
            color={(theme) => theme.palette.text.secondary}
          >
            {formik.values?.teams?.length >= 1 && formik.values?.teams.length}{' '}
            {formik.values?.teams?.length > 0
              ? formik.values?.teams.length === 1
                ? 'team'
                : 'teams'
              : ''}{' '}
            {formik.values?.teams?.length >= 1 && 'selected'}
          </Typography>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Participating teams"
            placeholder="Select teams"
          />
        )}
      />

      <TeamsShortList
        showRemoveButton
        onRemoveTeam={(_, index) => {
          const teams = formik?.values?.teams;
          teams?.splice(index, 1);
          formik.setFieldValue('teams', [...(teams || [])]);
        }}
        teams={formik?.values?.teams}
      />
      <CustomModal
        isModalOpen={isTeamAddModalOpen}
        onClose={() => setIsTeamAddModalOpen(false)}
        width={600}
      >
        <QuickAddTeam
          onAccept={(team) => {
            addNewTeam(team);
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
          disabled={!formik.isValid || !formik.dirty}
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
