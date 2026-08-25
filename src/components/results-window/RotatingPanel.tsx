import { Fade, Typography, alpha, styled, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import useRotatingPanel, { RotatingPanelItem } from 'hooks/ui/useRotatingPanel';
import AutoScrollArea from './AutoScrollArea';

const TITLE_FONT_SIZE = 'clamp(0.7rem, 2.1vh, 1.75rem)';
const DEFAULT_SCROLL_DELAY_IN_MS = 2000;
const MIN_SCROLL_DURATION_IN_MS = 5000;

const StyledDot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(
  ({ theme, isActive }) => `
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: background-color 300ms ease;
  background-color: ${
    isActive
      ? theme.palette.primary.main
      : alpha(theme.palette.primary.main, 0.25)
  };
`,
);

interface IProps {
  panels: RotatingPanelItem[];
}

const RotatingPanel: React.FC<IProps> = ({ panels }) => {
  const theme = useTheme();
  const { enabledPanels, activePanel, activeIndex } = useRotatingPanel(panels);

  if (!activePanel) {
    return null;
  }

  const scrollDelayInMs =
    activePanel.scrollDelayInMs ?? DEFAULT_SCROLL_DELAY_IN_MS;

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      height="100%"
      alignItems="flex-start"
      style={{ minHeight: 0, boxSizing: 'border-box' }}
    >
      <FlexContainer
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        padding="0.6vh 16px"
        style={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxSizing: 'border-box',
          flex: '0 0 auto',
        }}
      >
        <Typography
          variant="p1Bold"
          fontSize={TITLE_FONT_SIZE}
          lineHeight="1em"
          color={theme.palette.text.secondary}
          style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {activePanel.title}
        </Typography>
        {enabledPanels.length > 1 && (
          <FlexContainer gap={8} alignItems="center">
            {enabledPanels.map((panel, index) => (
              <StyledDot key={panel.key} isActive={index === activeIndex} />
            ))}
          </FlexContainer>
        )}
      </FlexContainer>

      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <Fade key={activePanel.key} in appear timeout={400}>
          <div style={{ height: '100%', width: '100%' }}>
            <AutoScrollArea
              key={activePanel.key}
              scrollDurationInMs={Math.max(
                activePanel.durationInMs - scrollDelayInMs * 2,
                MIN_SCROLL_DURATION_IN_MS,
              )}
              delayBeforeScrollInMs={scrollDelayInMs}
            >
              {activePanel.node}
            </AutoScrollArea>
          </div>
        </Fade>
      </div>
    </FlexContainer>
  );
};

export default RotatingPanel;
