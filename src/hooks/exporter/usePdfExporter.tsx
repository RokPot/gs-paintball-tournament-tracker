import { ScheduleRow } from 'hooks/ui/useGetScheduleRows';
import jsPDF from 'jspdf';
import { isArray } from 'lodash';
import { useCallback } from 'react';
import Tournament from 'types/Tournament';
import { TournamentTypeEnum, TournamentTypeLabels } from 'types/TournamentType';

const usePdfExporter = () => {
  const exportScheduleToPdf = useCallback((scheduleRows: ScheduleRow[]) => {
    // window.electron.ipcRenderer.sendMessage('print-to-pdf');
    // eslint-disable-next-line new-cap
    const doc = new jsPDF({ format: 'a4' });
    const yOffset = 10;
    const rowHeight = 30;
    const groupRowHeight = 10;
    let offset = yOffset;
    for (let i = 0; i < scheduleRows.length; i += 1) {
      if (offset >= 290) {
        doc.addPage();
        offset = 10;
      }
      if (scheduleRows[i].showGroup) {
        if (offset + groupRowHeight >= 290) {
          doc.addPage();
          offset = 10;
        }
        doc.text(`Group ${scheduleRows[i].groupIndex}`, 10, offset);
      } else if (scheduleRows[i].scheduledGame) {
        const team1Name =
          scheduleRows[i].scheduledGame?.game.team1.teamName || '';
        const team2Name =
          scheduleRows[i].scheduledGame?.game.team2.teamName || '';

        const maxTeamNameLength = 70;

        const team1Width = doc.getTextWidth(team1Name);

        const spaceBetweenInPixels = 3;

        const gameTextWidth = 14;

        doc.text(`G${scheduleRows[i].scheduledGame?.gameNumber}:`, 5, offset);

        const startOffset = 5 + gameTextWidth;

        const afterGameNumberTextOffset = startOffset;

        doc.text(
          team1Name,
          afterGameNumberTextOffset +
            maxTeamNameLength -
            team1Width -
            spaceBetweenInPixels,
          offset,
        );

        const afterTeam1TextOffset =
          afterGameNumberTextOffset + maxTeamNameLength;

        const lineWidth = 20;
        doc.line(
          afterTeam1TextOffset,
          offset,
          afterTeam1TextOffset + lineWidth,
          offset,
        );
        const afterLine1Offset = afterTeam1TextOffset + lineWidth;

        const VSLineWidth = doc.getTextWidth('vs');
        doc.text('vs', afterLine1Offset + VSLineWidth / 2, offset);
        const afterVsTextOffset = afterLine1Offset + VSLineWidth * 2;

        doc.line(
          afterVsTextOffset,
          offset,
          afterVsTextOffset + lineWidth,
          offset,
        );
        const afterLine2Offset = afterVsTextOffset + lineWidth;

        const splitTeam2Name = doc.splitTextToSize(team2Name, 65);
        const isSplitTeam2 =
          isArray(splitTeam2Name) && splitTeam2Name.length > 1;

        doc.text(
          splitTeam2Name,
          afterLine2Offset + spaceBetweenInPixels,
          offset - (isSplitTeam2 ? (splitTeam2Name.length - 1) * 2 : 0),
        );
      }
      offset += scheduleRows[i].showGroup ? groupRowHeight : rowHeight;
    }

    doc.save('schedule.pdf');
  }, []);

  const exportTournamentRules = useCallback(async (tournament: Tournament) => {
    try {
      try {
        // Create basic PDF with tournament rules
        // eslint-disable-next-line new-cap
        const doc = new jsPDF({ format: 'a4' });
        let yOffset = 20;
        const lineHeight = 8;
        const pageHeight = 290;

        // Title
        doc.setFontSize(18);
        doc.text('Tournament Rules', 10, yOffset);
        yOffset += lineHeight * 1;

        doc.setFontSize(14);
        doc.text('Match', 10, yOffset);
        yOffset += lineHeight;

        doc.setFontSize(10);
        if (tournament.gameSettings.gameTimeInSeconds) {
          doc.text(
            `Match Duration: ${Math.floor(
              tournament.gameSettings.gameTimeInSeconds / 60,
            )} minutes`,
            15,
            yOffset,
          );
          yOffset += lineHeight;
        }

        // Match Settings
        doc.text(
          `Number of Wins Required: ${
            tournament.settings.firstStageType.settings?.numberOfWinsRequired ||
            2
          }`,
          15,
          yOffset,
        );
        yOffset += lineHeight;

        const winsRequiredText = doc.splitTextToSize(
          `To win a match, a team needs to win ${
            tournament.settings.firstStageType.settings?.numberOfWinsRequired ||
            2
          } games.`,
          175,
        );
        doc.text(winsRequiredText, 15, yOffset);
        yOffset +=
          lineHeight *
          (Array.isArray(winsRequiredText) ? winsRequiredText.length : 1);

        if (tournament.settings.twoWinsDifference) {
          const twoWinsRule = doc.splitTextToSize(
            `A team must win by at least 2 more games than their opponent to win the match.`,
            175,
          );
          doc.text(twoWinsRule, 15, yOffset);
          yOffset +=
            lineHeight * (Array.isArray(twoWinsRule) ? twoWinsRule.length : 1);

          const twoWinsExample = doc.splitTextToSize(
            `Example: If the number of wins required is 2 then a team must have +2 wins advantage to finish the match.`,
            175,
          );
          doc.text(twoWinsExample, 15, yOffset);
          yOffset +=
            lineHeight *
            (Array.isArray(twoWinsExample) ? twoWinsExample.length : 1);
        }

        if (tournament.settings.shouldInsertMatchMargins) {
          const marginsText = doc.splitTextToSize(
            `Game margins will be applied after each game. For example, a 3-player game may have +3/-3 margins (winning team +3, losing team -3).`,
            175,
          );
          doc.text(marginsText, 15, yOffset);
          yOffset +=
            lineHeight * (Array.isArray(marginsText) ? marginsText.length : 1);
        }

        doc.setFontSize(14);
        doc.text('Tournament Settings', 10, yOffset);
        yOffset += lineHeight;

        doc.setFontSize(10);

        // Tournament Stages
        const hasSecondStage =
          tournament.settings.secondStageType !== undefined;
        const stagesText = doc.splitTextToSize(
          `This tournament has ${hasSecondStage ? '2' : '1'} stage${
            hasSecondStage ? 's' : ''
          }.`,
          175,
        );
        doc.text(stagesText, 15, yOffset);
        yOffset +=
          lineHeight * (Array.isArray(stagesText) ? stagesText.length : 1);

        // Stage 1 Type
        const stage1Text = doc.splitTextToSize(
          `Stage 1: ${
            TournamentTypeLabels[tournament.settings.firstStageType.type]
          }`,
          175,
        );
        doc.text(stage1Text, 15, yOffset);
        yOffset +=
          lineHeight * (Array.isArray(stage1Text) ? stage1Text.length : 1);

        // Stage 2 Type (if exists)
        if (tournament.settings.secondStageType) {
          const stage2Text = doc.splitTextToSize(
            `Stage 2: ${
              TournamentTypeLabels[tournament.settings.secondStageType.type]
            } tournament`,
            175,
          );
          doc.text(stage2Text, 15, yOffset);
          yOffset +=
            lineHeight * (Array.isArray(stage2Text) ? stage2Text.length : 1);
        }

        // Scoring
        doc.setFontSize(12);
        doc.text('Scoring:', 15, yOffset);
        yOffset += lineHeight;
        doc.setFontSize(10);
        doc.text(
          `• Game Win: ${tournament.settings.rules.gameWinPoints} points`,
          20,
          yOffset,
        );
        yOffset += lineHeight;
        doc.text(
          `• Game Draw: ${tournament.settings.rules.gameDrawPoints} points`,
          20,
          yOffset,
        );
        yOffset += lineHeight;
        doc.text(
          `• Game Loss: ${tournament.settings.rules.gameLossPoints} points`,
          20,
          yOffset,
        );

        yOffset += lineHeight;

        // Tiebreaks
        doc.setFontSize(12);
        doc.text('Tiebreaks', 15, yOffset);
        yOffset += lineHeight;
        doc.setFontSize(10);

        const tiebreakExplanation = doc.splitTextToSize(
          `If 2 or more teams have the same points after round robin, the ties will be resolved by the following checks in this order:`,
          175,
        );
        doc.text(tiebreakExplanation, 15, yOffset);
        yOffset +=
          lineHeight *
          (Array.isArray(tiebreakExplanation) ? tiebreakExplanation.length : 1);

        const tieBreakTitles = {
          headToHead: 'Head-to-head',
          numberOfPoints: 'Total points',
          numberOfCleanGames: 'Clean matches',
          numberOfMatchesWonInTiedGames: 'Games won vs tied',
          matchMargin: 'Point margin',
          greatestTimeRemainingAmongAllWonGames:
            'Greatest time remaining among all won games from all won games',
          greatestTimeRemainingAmongTiedWonGames:
            'Greatest time remaining among won games vs tied teams',
          leastTimeRemainingAmongAllLostGames:
            'Least time remaining among all lost games',
          leastTimeRemainingAmongTiedLostGames:
            'Least time remaining among lost games vs tied teams',
        };

        const tiebreakDescriptions = {
          headToHead: 'record between tied teams',
          numberOfPoints: 'scored from all games',
          numberOfCleanGames: 'matches that a team has not lost a single game',
          numberOfMatchesWonInTiedGames: 'teams in matches between tied teams',
          matchMargin: 'points scored minus points conceded',
          greatestTimeRemainingAmongAllWonGames: '',
          greatestTimeRemainingAmongTiedWonGames: '',
          leastTimeRemainingAmongAllLostGames: '',
          leastTimeRemainingAmongTiedLostGames: '',
        };

        tournament.settings.rules.tiebreakChecksSequence.forEach(
          (tiebreak, index) => {
            const title = tieBreakTitles[tiebreak] || tiebreak;
            const description = tiebreakDescriptions[tiebreak] || '';

            // Bold number and title
            doc.setFont('helvetica', 'bold');
            const numberAndTitle = `${index + 1}. ${title}`;
            doc.text(numberAndTitle, 20, yOffset);
            const titleWidth = doc.getTextWidth(numberAndTitle) + 1;

            // Regular font for dash and description
            doc.setFont('helvetica', 'normal');
            if (description && description.trim() !== '') {
              const remainingText = doc.splitTextToSize(
                ` - ${description}`,
                165 - titleWidth,
              );
              doc.text(remainingText, 20 + titleWidth, yOffset);
              yOffset +=
                lineHeight *
                (Array.isArray(remainingText) ? remainingText.length : 1);
            } else {
              yOffset += lineHeight;
            }
          },
        );

        // Reset font to normal
        doc.setFont('helvetica', 'normal');
        yOffset += lineHeight;

        // Round Robin advancement rule
        if (
          tournament.settings.firstStageType.type ===
            TournamentTypeEnum.roundRobin &&
          hasSecondStage
        ) {
          const advancementText = doc.splitTextToSize(
            `The top 2 teams from each group advance to the second stage.`,
            175,
          );
          doc.text(advancementText, 15, yOffset);
          yOffset +=
            lineHeight *
            (Array.isArray(advancementText) ? advancementText.length : 1);
        }

        // Switch Groups setting
        if (tournament.settings.switchGroups) {
          if (yOffset > pageHeight - 20) {
            doc.addPage();
            yOffset = 20;
          }
          const switchGroupsText = doc.splitTextToSize(
            `Groups will switch after each finished match (or a pair of matches).`,
            175,
          );
          doc.text(switchGroupsText, 15, yOffset);
          yOffset +=
            lineHeight *
            (Array.isArray(switchGroupsText) ? switchGroupsText.length : 1);
        }

        // Switch Games setting
        if (tournament.settings.switchGames) {
          if (yOffset > pageHeight - 20) {
            doc.addPage();
            yOffset = 20;
          }
          const switchGamesText = doc.splitTextToSize(
            `2 matches will be played simultaneously, with one match waiting outside until both matches are completed.`,
            175,
          );
          doc.text(switchGamesText, 15, yOffset);
          yOffset +=
            lineHeight *
            (Array.isArray(switchGamesText) ? switchGamesText.length : 1);
        }

        // Add more space and basic rules
        yOffset += lineHeight;

        doc.save('tournament-rules.pdf');
      } catch (error) {
        // Handle PDF creation error silently or show user notification
      }
    } catch (error) {
      // Handle export error silently or show user notification
    }
  }, []);

  return { exportScheduleToPdf, exportTournamentRules };
};

export default usePdfExporter;
