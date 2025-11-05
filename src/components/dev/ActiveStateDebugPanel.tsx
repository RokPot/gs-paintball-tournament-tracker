import { Card, CardContent, Divider, Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import dayjs from 'dayjs';
import useActiveStateObservable from 'hooks/observables/useActiveStateObservable';
import { usePopulatedActiveState } from 'hooks/observables/usePopulatedActiveState';
import React, { useEffect, useMemo, useState } from 'react';

const ActiveStateDebugPanel: React.FC = () => {
  const activeState = useActiveStateObservable();
  const { league, tournament, game, isLoading } = usePopulatedActiveState();

  const [lastUpdated, setLastUpdated] = useState<string>(
    dayjs().format('HH:mm:ss'),
  );

  useEffect(() => {
    setLastUpdated(dayjs().format('HH:mm:ss'));
  }, [
    activeState?.leagueId,
    activeState?.tournamentId,
    activeState?.gameId,
    league?._id,
    tournament?._id,
    game?._id,
  ]);

  const ids = useMemo(
    () => ({
      leagueId: activeState?.leagueId || 'null',
      tournamentId: activeState?.tournamentId || 'null',
      gameId: activeState?.gameId || 'null',
    }),
    [activeState?.leagueId, activeState?.tournamentId, activeState?.gameId],
  );

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Active State (Debug)</Typography>
        <Typography variant="caption" color="text.secondary">
          Last updated: {lastUpdated}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <FlexContainer flexDirection="column" gap={4}>
          <Typography variant="body2">
            IDs: L={ids.leagueId}, T={ids.tournamentId}, G={ids.gameId}
          </Typography>
          <Typography variant="body2">League: {league?.name || '—'}</Typography>
          <Typography variant="body2">
            Tournament: {tournament?.name || '—'}
          </Typography>
          <Typography variant="body2">
            Game:{' '}
            {game?.id
              ? `${game?.id} (${game?.team1?.teamName || 'TBD'} vs ${
                  game?.team2?.teamName || 'TBD'
                })`
              : '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Loading: {isLoading ? 'true' : 'false'}
          </Typography>
        </FlexContainer>
      </CardContent>
    </Card>
  );
};

export default ActiveStateDebugPanel;
