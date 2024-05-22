import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import CustomModal from 'components/shared/CustomModal';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import TeamMultiSelect from 'components/shared/multiselect/TeamMultiSelect';
import AddOrEditTeam from 'components/teams/AddOrEditTeam';
import TeamsShortList from 'components/teams/TeamShortList';
import { useFormik } from 'formik';
import { useState } from 'react';
import { TeamQueries } from 'services/queries/team/TeamQueries';
import League from 'types/League';
import Team from 'types/Team';
import { LeagueDetailsSchema } from 'utils/schemes';
import { createNewLeaderboardTeam } from 'utils/teamUtils';
import { v4 } from 'uuid';

interface AddLeague {
  name: string;
  teams: Team[];
}

interface IProps {
  league: League | undefined | null;
  onConfirm: (league: League, isEdit: boolean) => Promise<void>;
  onClose: () => void;
}

const AddOrEditLeague = ({ league, onClose, onConfirm }: IProps) => {
  const { data: teamsList } = TeamQueries.useTeamsList();
  const { mutateAsync: addNewTeam } = TeamQueries.useAddTeam();
  const [isProcessing, setIsProcessing] = useState(false);

  const formik = useFormik<AddLeague>({
    initialValues: {
      name: league?.name || '',
      teams: [...(league?.teams || [])],
    },
    validationSchema: LeagueDetailsSchema,
    onSubmit: async (values: AddLeague) => {
      try {
        setIsProcessing(true);
        const teamId = league?._id || v4();
        const newTeams = values.teams.filter(
          (team) =>
            !league?.leaderboard.some(
              (leaderboardTeam) => leaderboardTeam.team.id === team.id,
            ),
        );
        await onConfirm(
          new League({
            ...(league || {}),
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
          }),
          !!league,
        );
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    },
  });
  const [isTeamAddModalOpen, setIsTeamAddModalOpen] = useState(false);
  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      gap={16}
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

      <TeamMultiSelect
        selectedTeams={formik?.values?.teams}
        onTeamsChanged={(teams) => formik.setFieldValue('teams', teams)}
        options={teamsList}
      />

      <TeamsShortList
        showRemoveButton
        onRemoveTeam={(_, index) => {
          const teams = [...(formik?.values?.teams || [])];
          teams?.splice(index, 1);
          formik.setFieldValue('teams', [...(teams || [])]);
          formik.setFieldValue('name', `${formik.values.name}`);
          formik.validateForm();
        }}
        teams={formik?.values?.teams}
      />
      <CustomModal
        isModalOpen={isTeamAddModalOpen}
        onClose={() => setIsTeamAddModalOpen(false)}
        width={600}
        title="Add Team"
      >
        <AddOrEditTeam
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
      <FlexContainer flexDirection="row" gap={16}>
        <LoadingButton
          variant="contained"
          onClick={formik.submitForm}
          loading={isProcessing}
          disabled={!formik.isValid || !formik.dirty}
        >
          <Typography variant="p1">Confirm</Typography>
        </LoadingButton>
        <Button variant="outlined" onClick={onClose}>
          <Typography variant="p1">Cancel</Typography>
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AddOrEditLeague;
