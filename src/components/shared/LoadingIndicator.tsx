/* eslint-disable react/no-unused-prop-types */
import { CircularProgress, Theme } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';

const StyledLoadingIndicatorContainer = styled('div')`
  display: flex;
`;

export interface LoadingIndicatorProps {
  className?: string;
  size?: number;
  height?: number | string;
  width?: number | string;
  justifyContent?: 'center' | 'start' | 'end';
  alignItems?: 'center' | 'start' | 'end';
  padding?: string;
}

function LoadingIndicator(props: LoadingIndicatorProps) {
  const { className, size } = props;

  return (
    <StyledLoadingIndicatorContainer className={className}>
      <CircularProgress size={size} />
    </StyledLoadingIndicatorContainer>
  );
}

LoadingIndicator.defaultProps = {
  size: 40,
  height: 100,
  justifyContent: 'center',
  alignItems: 'center',
  width: 'auto',
  padding: '0px',
};

export default styled(LoadingIndicator)(
  (props: LoadingIndicatorProps & { theme?: Theme }) => `
  height: ${
    typeof props.height === 'number' ? `${props.height}px` : props.height
  };
  justify-content: ${props.justifyContent};
  align-items: ${props.alignItems};
  width: ${typeof props.width === 'number' ? `${props.width}px` : props.width};
  padding: ${props.padding};
`,
);
