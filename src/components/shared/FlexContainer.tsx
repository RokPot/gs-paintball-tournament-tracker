import LoadingIndicator, { LoadingIndicatorProps } from './LoadingIndicator';
import { experimentalStyled as styled, Theme } from '@mui/material/styles';
import { forwardRef, FunctionComponent, memo, MouseEvent } from 'react';

interface FlexContainerProps {
  children?: any;
  margin?: number;
  marginBottom?: number;
  style?: any;
  className?: any;
  display?: 'flex' | 'inline-flex' | 'block';
  flexDirection?: 'row' | 'column' | 'row-reverse';
  width?: string;
  height?: string;
  padding?: string;
  flex?: number | 'auto';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch'
    | 'end';
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  overflow?: 'scroll' | 'hidden' | 'auto' | 'visible';
  overflowX?: 'scroll' | 'hidden' | 'auto' | 'visible';
  overflowY?: 'scroll' | 'hidden' | 'auto' | 'visible';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit';
  position?: 'relative' | 'absolute' | 'fixed';
  order?: number;
  minWidth?: string;
  maxHeight?: string;
  maxWidth?: string;
  boxSizing?: 'content-box' | 'border-box' | 'initial' | 'inherit';
  bottom?: string;
  top?: string;
  zIndex?: number;
  minHeight?: string;
  alignSelf?:
    | 'auto'
    | 'initial'
    | 'inherit'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch';
  loading?: boolean;
  loadingProps?: LoadingIndicatorProps;
  ref?: any;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  title?: string;
  highlightRowOnHover?: boolean;
}

const FlexContainer: FunctionComponent<FlexContainerProps> = memo(
  forwardRef((props, ref) => {
    const {
      flexDirection,
      alignItems,
      justifyContent,
      alignSelf,
      bottom,
      boxSizing,
      display,
      flex,
      flexWrap,
      height,
      maxHeight,
      minHeight,
      minWidth,
      order,
      maxWidth,
      overflow,
      overflowX,
      overflowY,
      padding,
      position,
      textAlign,
      top,
      width,
      zIndex,
      className,
      style,
      children,
      loading,
      loadingProps,
      onClick,
      title,
    } = props;

    if (loading) {
      return <LoadingIndicator {...loadingProps} />;
    }

    return (
      <div
        onClick={onClick}
        className={className}
        style={{
          display,
          flexDirection,
          alignItems,
          justifyContent,
          alignSelf,
          bottom,
          boxSizing,
          flex,
          flexWrap,
          height,
          maxHeight,
          minHeight,
          minWidth,
          order,
          maxWidth,
          overflow,
          overflowX,
          overflowY,
          padding,
          position,
          textAlign,
          top,
          width,
          zIndex,
          ...style,
        }}
        ref={ref as any}
        {...(!!title ? { title } : {})}
      >
        {children}
      </div>
    );
  })
);

FlexContainer.defaultProps = {
  flexDirection: 'row',
  alignItems: 'center',
  display: 'flex',
};

export default styled(FlexContainer)(
  (props: FlexContainerProps & { theme?: Theme }) => `
  margin-bottom: ${props.marginBottom ? `${props.marginBottom}px` : undefined};
  >:not(:last-child) {
    margin-right: ${
      props.margin && props.flexDirection === 'row' ? props.margin : 0
    }px;
    margin-bottom: ${
      props.margin && props.flexDirection === 'column' ? props.margin : 0
    }px;
  }
  &:hover {
    ${
      props.highlightRowOnHover
        ? `background: ${props.theme?.palette.grey[100]};`
        : ''
    }

  }
`
);
