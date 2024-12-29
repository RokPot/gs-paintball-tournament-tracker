import { ScheduleRow } from 'hooks/ui/useGetScheduleRows';
import jsPDF from 'jspdf';
import { useCallback } from 'react';

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

        doc.text(team2Name, afterLine2Offset + spaceBetweenInPixels, offset);
      }
      offset += scheduleRows[i].showGroup ? groupRowHeight : rowHeight;
    }

    doc.save('schedule.pdf');
  }, []);

  return { exportScheduleToPdf };
};

export default usePdfExporter;
