import { Autocomplete, Avatar, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Team from 'types/Team';

interface IProps {
  selectedTeams: Team[];
  options?: Team[] | null;
  onTeamsChanged: (teams: Team[]) => void;
}

const TeamMultiSelect = ({
  selectedTeams,
  options,
  onTeamsChanged,
}: IProps) => {
  const [selectedTeamsInternal, setSelectedTeamsInternal] =
    useState(selectedTeams);

  const getTeamSelectedCopy = () => {
    if (!selectedTeamsInternal?.length) {
      return '';
    }

    if (selectedTeamsInternal?.length === 1) {
      return `1 team selected`;
    }
    return `${selectedTeamsInternal.length} teams selected`;
  };

  return (
    <Autocomplete
      multiple
      fullWidth
      value={
        selectedTeamsInternal?.map((team) => ({
          title: team.teamName,
          value: team,
        })) || []
      }
      options={
        options?.map((team) => ({
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
            <Typography variant="body2" style={{ textTransform: 'uppercase' }}>
              {option.value.teamTag}
            </Typography>
          </Avatar>
          {option.value.teamName}
        </Typography>
      )}
      disableCloseOnSelect
      filterSelectedOptions
      onChange={(_, value) => {
        setSelectedTeamsInternal(value.map((val) => val.value));
        onTeamsChanged(value.map((val) => val.value));
      }}
      isOptionEqualToValue={(option, value) => {
        return option.value.id === value.value.id;
      }}
      limitTags={-1}
      renderTags={() => (
        <Typography
          variant="body1"
          color={(theme) => theme.palette.text.secondary}
        >
          {getTeamSelectedCopy()}
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
  );
};

export default TeamMultiSelect;
