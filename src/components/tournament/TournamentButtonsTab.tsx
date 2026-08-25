import { faA, faB, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, lighten, styled, Typography, useTheme } from '@mui/material';
import ButtonReceiverStatus from 'components/serial-button/ButtonReceiverStatus';
import FlexContainer from 'components/shared/FlexContainer';
import { PortInfo } from 'hooks/main/useIPCRendererMessages';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ButtonsContext } from 'store/ButtonsContext';
import useBus from 'use-bus';

const StyledRootFieldContainer = styled('div')`
  position: relative;
`;

const StyledBordersContainer = styled('div')`
  width: 470px;
  height: 270px;
  position: absolute;
  top: 0px;
  border: 3px solid white;
  margin: 15px;
  border-radius: 5px;
  z-index: 2;
`;

const StyledTeamBase = styled('div')`
  height: 100px;
  width: 70px;
  position: absolute;
  top: 100px;
  right: 0px;
  border: 3px solid white;
  border-radius: 0px 50% 50% 0px;
`;

const StyledFieldContainer = styled('div')`
  width: 500px;
  height: 300px;
  background: ${({ theme }) => theme.palette.primary.light};
  display: flex;
  border-radius: 5px;

  div:nth-child(n) {
    width: 10%;
    background-color: ${({ theme }) =>
      lighten(theme.palette.success.main, 0.6)};
    height: 100%;
  }
  div:nth-child(2n) {
    width: 10%;
    background-color: ${({ theme }) =>
      lighten(theme.palette.success.main, 0.8)};
    height: 100%;
  }
`;

const Button2SignalConfirmation: React.FC<{ confirmed?: boolean }> = ({
  confirmed,
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: 'absolute',
        top: '137px',
        right: '63px',
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <FontAwesomeIcon
          fontSize={25}
          icon={faSatelliteDish}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
            transform: 'rotate(270deg)',
          }}
        />
        <FontAwesomeIcon
          fontSize={18}
          icon={faB}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
            top: '20px',
            right: '-35px',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

const Button1SignalConfirmation: React.FC<{ confirmed?: boolean }> = ({
  confirmed,
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: 'absolute',
        top: '137px',
        left: '40px',
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <FontAwesomeIcon
          fontSize={25}
          icon={faSatelliteDish}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
          }}
        />
        <FontAwesomeIcon
          fontSize={18}
          icon={faA}
          color={
            confirmed ? theme.palette.success.main : theme.palette.error.main
          }
          style={{
            position: 'absolute',
            top: '20px',
            left: '-10px',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

interface IProps {}

const TournamentButtonsTab: React.FC<IProps> = () => {
  const [showManualPorts, setShowManualPorts] = useState(false);

  const {
    setSelectedPort,
    setButtonState,
    buttonState,
    selectedPort,
    availablePorts,
    refreshAvailablePorts,
    selectReceiverPort,
    reconnectReceiver,
    connectionStatus,
  } = useContext(ButtonsContext);

  useBus(
    'ButtonClicked',
    ({ type, payload }) => {
      if (type !== 'ButtonClicked') {
        return;
      }
      if (payload === 'Team1Button') {
        setButtonState?.((prev) => ({
          ...prev,
          button1HandshakeConfirmed: true,
        }));
      }
      if (payload === 'Team2Button') {
        setButtonState?.((prev) => ({
          ...prev,
          button2HandshakeConfirmed: true,
        }));
      }
    },
    [setButtonState],
  );

  const theme = useTheme();

  const onPortSelected = useCallback(
    (selectedUSBPort: PortInfo) => {
      selectReceiverPort?.(selectedUSBPort);
      setSelectedPort?.(selectedUSBPort);
    },
    [selectReceiverPort, setSelectedPort],
  );

  useEffect(() => {
    refreshAvailablePorts?.();
  }, [refreshAvailablePorts]);

  const buttonsReady =
    buttonState?.button1HandshakeConfirmed &&
    buttonState.button2HandshakeConfirmed &&
    connectionStatus?.state === 'connected';

  return (
    <FlexContainer
      flexDirection="column"
      gap={16}
      style={{ flexGrow: 1, padding: '16px 0' }}
      overflowY="auto"
    >
      <ButtonReceiverStatus
        connectionStatus={connectionStatus}
        onReconnect={reconnectReceiver}
      />
      {buttonsReady && (
        <Typography variant="p3Medium" color={theme.palette.success.main}>
          Buttons are confirmed and ready for action!
        </Typography>
      )}
      {connectionStatus?.state === 'connected' && selectedPort && (
        <Typography variant="p1Medium">
          Selected Receiver Port:{' '}
          {selectedPort.friendlyName || selectedPort.path}
        </Typography>
      )}
      <StyledRootFieldContainer>
        <StyledFieldContainer>
          <div />
          <div />
          <div />
          <div />
          <div />

          <div />

          <div />
          <div />
          <div />
          <div />
          <div />
        </StyledFieldContainer>
        <StyledBordersContainer />
        <StyledTeamBase
          style={{
            right: '15px',
            borderRadius: '50% 0px   0px 50%',
          }}
        />

        <StyledTeamBase
          style={{
            left: '15px',
          }}
        />
        <div
          style={{
            border: '1px solid white',
            height: '270px',
            position: 'absolute',
            top: '15px',
            right: '50%',
            width: '1px',
          }}
        />
        <Button1SignalConfirmation
          confirmed={buttonState?.button1HandshakeConfirmed}
        />

        <Button2SignalConfirmation
          confirmed={buttonState?.button2HandshakeConfirmed}
        />
      </StyledRootFieldContainer>
      <Button
        variant="text"
        onClick={() => {
          if (!showManualPorts) {
            refreshAvailablePorts?.();
          }
          setShowManualPorts((open) => !open);
        }}
      >
        {showManualPorts ? 'Hide other USB ports' : 'Show other USB ports'}
      </Button>
      {showManualPorts && (
        <FlexContainer flexDirection="column" gap={8}>
          {availablePorts?.length === 0 && (
            <Typography variant="p1Medium">No ports detected.</Typography>
          )}
          {availablePorts?.map((availablePort) => (
            <Button
              key={availablePort.path}
              onClick={() => onPortSelected(availablePort)}
              variant={
                selectedPort?.path === availablePort.path
                  ? 'contained'
                  : 'outlined'
              }
            >
              {availablePort.path} - {availablePort.friendlyName}
            </Button>
          ))}
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default TournamentButtonsTab;
