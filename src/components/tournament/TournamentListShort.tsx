import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import Tournament from 'types/Tournament';

interface IProps {
  tournaments: Tournament[];
}

const TournamentShortList: React.FC<IProps> = ({ tournaments }) => {
  return (
    <FlexContainer width="100%" flexDirection="column">
      {!tournaments.length && (
        <Typography
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
        >
          There are currently no tournaments.
        </Typography>
      )}
      {!!tournaments.length &&
        tournaments?.map((tournament, index) => (
          <FlexContainer
            flexDirection="row"
            margin={8}
            padding="8px"
            key={index}
            width="100%"
            highlightRowOnHover
          >
            <Typography variant="p1Medium">{index + 1}.</Typography>

            <Typography>{tournament?.name}</Typography>
            <Typography
              variant="p1"
              color={(theme) => theme.palette.text.secondary}
            >
              {tournament?.teams && !!tournament.teams.length && (
                <>{`${tournament.teams.length} teams`}</>
              )}
            </Typography>
            <Typography variant="p1">
              {tournament?.startDate && (
                <>
                  Started:{' '}
                  <Typography
                    variant="p2Medium"
                    color={(theme) => theme.palette.text.disabled}
                  >
                    {tournament.startDate.format('DD/MM/YYYY')}
                  </Typography>
                </>
              )}{' '}
              {tournament?.endDate && (
                <>
                  Finished:{' '}
                  <Typography
                    variant="p2"
                    color={(theme) => theme.palette.text.disabled}
                  >
                    {tournament.endDate.format('DD/MM/YYYY')}
                  </Typography>
                </>
              )}
            </Typography>
          </FlexContainer>
        ))}
    </FlexContainer>
  );
};

export default TournamentShortList;
