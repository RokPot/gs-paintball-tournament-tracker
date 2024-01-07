import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useState } from 'react';
import TournamentGroup from 'types/TournamentGroup';
import {
  RoundRobinBlankCell,
  RoundRobinGameCell,
  RoundRobinTeamCell,
} from './RoundRobinCell';

interface IProps {
  group: TournamentGroup;
  hideTeamLeaderboard?: boolean;
  hideTitle?: boolean;
}

const RoundRobinContainer: React.FC<IProps> = ({
  group,
  hideTeamLeaderboard,
  hideTitle,
}) => {
  const { teams, groupIndex } = group;
  const [hoveredColumn, setHoveredColumn] = useState<number>();
  const [hoveredRow, setHoveredRow] = useState<number>();

  const onMouseEnterCell = (row: number, column: number) => {
    setHoveredColumn(column);
    setHoveredRow(row);
  };

  const onMouseLeaveCell = () => {
    setHoveredColumn(undefined);
    setHoveredRow(undefined);
  };

  return (
    <FlexContainer flexDirection="column">
      {!hideTitle && (
        <Typography variant="h3" padding="0px 0px 20px 0px">
          Group {groupIndex}
        </Typography>
      )}
      <FlexContainer flexDirection="row">
        <FlexContainer flexDirection="row" alignItems="flex-start">
          {[...Array(teams.length + 1)].map((row, columnIndex) => {
            return (
              <FlexContainer flexDirection="column" key={columnIndex}>
                {[...Array(teams.length + 1)].map((row2, rowIndex) => {
                  if (
                    (columnIndex === 0 && rowIndex > 0) ||
                    (rowIndex === 0 && columnIndex > 0)
                  ) {
                    return (
                      <RoundRobinTeamCell
                        key={rowIndex}
                        columnIndex={columnIndex}
                        rowIndex={rowIndex}
                        onMouseEnterCell={onMouseEnterCell}
                        onMouseLeaveCell={onMouseLeaveCell}
                        team={
                          teams[
                            (columnIndex === 0 && rowIndex > 0
                              ? rowIndex
                              : columnIndex) - 1
                          ]
                        }
                      />
                    );
                  }

                  if (columnIndex === rowIndex) {
                    return (
                      <RoundRobinBlankCell
                        key={rowIndex}
                        columnIndex={columnIndex}
                        rowIndex={rowIndex}
                      />
                    );
                  }

                  return (
                    <RoundRobinGameCell
                      key={rowIndex}
                      columnIndex={columnIndex}
                      rowIndex={rowIndex}
                      onMouseEnterCell={onMouseEnterCell}
                      onMouseLeaveCell={onMouseLeaveCell}
                      group={group}
                      hoveredColumnIndex={hoveredColumn}
                      hoveredRowIndex={hoveredRow}
                    />
                  );
                })}
              </FlexContainer>
            );
          })}
        </FlexContainer>

        {!hideTeamLeaderboard && (
          <FlexContainer flexDirection="column">
            <LeaderboardList showHeader teams={[]} />
          </FlexContainer>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default RoundRobinContainer;
