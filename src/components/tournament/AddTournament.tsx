import {
  Autocomplete,
  Avatar,
  Button,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomCheckbox from 'components/shared/CustomCheckbox';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';
import TeamsShortList from 'components/teams/TeamShortList';
import dayjs from 'dayjs';
import 'dayjs/locale/sl';
import { useFormik } from 'formik';
import { DefaultGameSettings } from 'types/GameSettings';
import { League } from 'types/League';
import { Tournament } from 'types/Tournament';
import {
  DefaultTournamentSettings,
  TournamentSettings,
} from 'types/TournamentSettings';
import { TournamentStage } from 'types/TournamentStage';
import { TournamentState } from 'types/TournamentState';
import { v4 } from 'uuid';

function randomColor() {
  let hex = Math.floor(Math.random() * 0xffffff);
  let color = '#' + hex.toString(16);

  return color;
}
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title:
      'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];
interface IProps {
  onAccept: (team: Tournament) => void;
  onCancel: () => void;
  league?: League;
}

const AddTournament: React.FC<IProps> = ({ onAccept, onCancel, league }) => {
  const theme = useTheme();
  const formik = useFormik<Tournament>({
    initialValues: {
      groups: [],
      id: v4(),
      name: '',
      state: new TournamentState({
        id: v4(),
        isGameInProgress: false,
        isTournamentFinished: false,
        stage: TournamentStage.startStage,
      }),
      teams: [],
      startDate: dayjs(),
      endDate: dayjs().add(1, 'day'),
      gameSettings: DefaultGameSettings,
      settings: DefaultTournamentSettings,
    },
    onSubmit: (values: Tournament) => {
      console.log(values);
    },
  });

  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      margin={16}
      width="100%"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sl">
        <Typography variant="h1">Create tournament</Typography>
        <Typography variant="h3">Details</Typography>
        <FlexContainer width="100%" margin={16} style={{ marginBottom: '0px' }}>
          <CustomTextField
            label="Tournament name *"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Tournament name"
            variant="outlined"
            style={{ width: '100%' }}
            helperText={String(formik?.errors?.name || ' ')}
            debounceTime={200}
          />
        </FlexContainer>
        <FlexContainer width="100%" justifyContent="space-between" margin={8}>
          <DesktopDatePicker
            onChange={(date) => formik.setFieldValue('startDate', date)}
            defaultValue={formik.values.startDate}
            label="Tournament start date"
            sx={{ width: '100%' }}
          />
          <DesktopDatePicker
            onChange={(date) => formik.setFieldValue('endDate', date)}
            defaultValue={formik.values.endDate}
            sx={{ width: '100%' }}
            label="Tournament end date"
          />
        </FlexContainer>
        <Typography variant="h3" marginBottom="0px !important">
          Teams
        </Typography>
        <Typography
          variant="subtitle2"
          color={(theme) => theme.palette.text.disabled}
        >
          Add teams from league that will participate in this tournament
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
            league?.teams
              .filter((team) => !formik?.values?.teams.includes(team))
              .map((team) => ({
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
                  variant="body1"
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
          teams={formik?.values?.teams}
          showRemoveButton
          onRemoveTeam={(team, index) => {
            const selectedTeams = formik.values.teams;
            selectedTeams.splice(
              selectedTeams.findIndex(
                (selectedTeam) => selectedTeam.id === team.id
              ),
              1
            );
            formik.setFieldValue('teams', selectedTeams);
          }}
        />

        <Typography variant="h3">Tournament settings</Typography>
        <CustomTextField
          inputProps={{ pattern: '[0-9]*' }}
          type="number"
          label="Number of wins required *"
          id="name"
          value={formik.values.settings.numberOfWinsRequired}
          onChange={formik.handleChange}
          placeholder="2"
          variant="outlined"
          style={{ width: '100%' }}
          helperText={String(formik?.errors?.name || ' ')}
          debounceTime={200}
          disableError
        />
        <CustomCheckbox
          onChange={(_, checked) =>
            formik.setFieldValue('settings', {
              ...formik.values.settings,
              twoWinsDifference: checked,
            } as TournamentSettings)
          }
          checked={formik.values.settings.twoWinsDifference}
          label="Win Condition: 2 point difference"
          tooltip="If this is checked, then a pair of games will play at the same time and matches will be switched every round."
        />
        <CustomCheckbox
          onChange={(_, checked) =>
            formik.setFieldValue('settings', {
              ...formik.values.settings,
              switchGames: checked,
            } as TournamentSettings)
          }
          checked={formik.values.settings.switchGames}
          label="Switch paired games"
          tooltip="If this is checked, then a pair of games will play at the same time and matches will be switched every round."
        />
        <CustomCheckbox
          onChange={(_, checked) =>
            formik.setFieldValue('settings', {
              ...formik.values.settings,
              switchGroups: checked,
            } as TournamentSettings)
          }
          checked={formik.values.settings.switchGroups}
          label="Switch groups"
          tooltip="If this is checked, then group will rotate after every finished game."
        />
        <Typography variant="h3">Game settings</Typography>

        <TimePicker
          sx={{ width: '100%' }}
          label="Game time"
          views={['minutes', 'seconds']}
          format="mm:ss"
          // value={}
          //todo rokpot
        />
        <FlexContainer width="100%" margin={8}>
          <TimePicker
            sx={{ width: '100%' }}
            label="Short break time"
            views={['minutes', 'seconds']}
            format="mm:ss"
          />
          <TimePicker
            sx={{ width: '100%' }}
            label="Long break time"
            views={['minutes', 'seconds']}
            format="mm:ss"
          />
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
      </LocalizationProvider>
    </FlexContainer>
  );
};

export default AddTournament;
