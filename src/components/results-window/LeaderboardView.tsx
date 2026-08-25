import { Typography, alpha, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';
import ResultsPageLeaderboardList from './ResultsPageLeaderboardList';

interface GroupLeaderboard {
  groupIndex: number;
  teams: LeaderboardTeam[];
}

interface IProps {
  activeLeague: League | undefined | null;
}

const LeaderboardView: React.FC<IProps> = ({ activeLeague }) => {
  const theme = useTheme();
  const [groupLeaderboards, setGroupLeaderboards] = useState<
    GroupLeaderboard[]
  >([]);
  const activeTournament = activeLeague?.activeTournament;

  useEffect(() => {
    if (!activeTournament || !activeTournament.stages?.length) {
      return;
    }

    if (!activeTournament.currentStageGroups) {
      return;
    }
    setGroupLeaderboards(
      activeTournament.currentStageGroups.map((group) => ({
        groupIndex: group.groupIndex,
        teams: calculateTournamentGroupLeaderboard(
          group,
          activeTournament.settings,
        ),
      })),
    );
  }, [activeTournament]);

  const isTwoUp = groupLeaderboards.length > 1;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isTwoUp ? 'repeat(2, minmax(0, 1fr))' : '1fr',
        gridAutoRows: 'minmax(0, 1fr)',
        gap: '8px 16px',
        width: '100%',
        height: '100%',
        padding: '8px 16px',
        boxSizing: 'border-box',
      }}
    >
      {groupLeaderboards.map((groupLeaderboard, index) => {
        // Alternate the wash by column so two adjacent groups read as separate
        // tables rather than one wide one.
        const isSecondColumn = index % 2 === 1;
        const tint = alpha(
          theme.palette.primary.main,
          isSecondColumn ? 0.13 : 0.04,
        );

        return (
          <div
            key={groupLeaderboard.groupIndex}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            {isTwoUp && (
              <Typography
                variant="p1Bold"
                fontSize="clamp(1rem, 3vh, 2.2rem)"
                lineHeight="1em"
                paddingBottom="0.6vh"
                color={({ palette }) => palette.text.secondary}
                style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                Group {groupLeaderboard.groupIndex}
              </Typography>
            )}
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResultsPageLeaderboardList
                showHeader
                hideFooter
                compact={isTwoUp}
                tint={isTwoUp ? tint : undefined}
                teams={groupLeaderboard.teams}
                showAllTeamsAtOnce
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardView;
