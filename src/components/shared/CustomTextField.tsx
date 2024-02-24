/* eslint-disable no-lonely-if */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/function-component-definition */
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField, TextFieldProps, Theme } from '@mui/material';
import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import { DebouncedFunc, debounce, isEqual } from 'lodash';
import {
  CSSProperties,
  ChangeEvent,
  FunctionComponent,
  MutableRefObject,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import LoadingIndicator from './LoadingIndicator';

interface CustomTextFieldProps {
  variant?:
    | 'standard'
    | 'filled'
    | 'outlined'
    | 'large'
    | 'underlined'
    | 'textOnly'
    | any;
  startIcon?: any;
  endIcon?: any;
  enableRemoveButton?: boolean;
  onRemove?: any;
  underlinedOptions?: {};
  fontSize?: number;
  lineHeight?: number;
  inputRef?: MutableRefObject<HTMLDivElement> | Ref<any>;
  disableError?: boolean;
  debounceTime?: number;
  maxLength?: number;
  value?: string | number | any;
  autoComplete?: string;
  formatting?: 'text';
  disableNativeSuggestions?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  obscurable?: boolean;
  helperTextClassName?: string;
  helperTextStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  inputClassName?: string;
}

const CustomTextField: FunctionComponent<
  Pick<TextFieldProps, Exclude<keyof TextFieldProps, 'variant'>> &
    CustomTextFieldProps
> = (props) => {
  const {
    startIcon,
    variant,
    style,
    enableRemoveButton,
    underlinedOptions,
    onRemove,
    endIcon,
    inputRef,
    helperText,
    loading,
    disableError,
    className,
    value: externalValue,
    debounceTime,
    autoComplete,
    formatting,
    type,
    disableNativeSuggestions,
    obscurable,
    helperTextClassName,
    helperTextStyle,
    inputClassName,
    inputStyle,
    readOnly,
    maxLength,
    ...textFieldProps
  } = props;
  const theme = useTheme();
  const { InputProps, error, label } = textFieldProps;
  const [value, setValue] = useState<string | number | any>(externalValue);
  const onChangeDispatcher = useRef<DebouncedFunc<
    () => Promise<boolean>
  > | null>(null);

  const getVariant = (): string => {
    switch (variant) {
      case 'filled':
        return 'filled';
      case 'outlined':
        return 'outlined';
      default:
        return 'standard';
    }
  };

  const handleDeleteText = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (props.onChange) {
      props.onChange({ target: { value: '' } } as ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >);
    }
  };

  const internalOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(e.target.value);
    const cpy = { ...e };
    if (debounceTime) {
      onChangeDispatcher.current?.cancel();
      onChangeDispatcher.current = debounce(() => {
        if (props.onChange) {
          props.onChange(cpy);
        }
      }, debounceTime);
      onChangeDispatcher.current();
    } else {
      // If not debounce propagate immediately
      if (props.onChange) {
        props.onChange(e);
      }
    }
  };

  // if changes come from outside the component
  useEffect(() => {
    if (!isEqual(value, externalValue)) {
      setValue(externalValue);
    }
  }, [externalValue]);

  return (
    <TextField
      {...textFieldProps}
      type={disableNativeSuggestions ? 'search' : type}
      value={value}
      onChange={internalOnChange}
      helperText={disableError ? undefined : helperText}
      FormHelperTextProps={{
        style: helperTextStyle,
        className: helperTextClassName,
      }}
      variant={getVariant() as any}
      className={clsx(variant, className)}
      inputRef={inputRef}
      autoComplete={autoComplete}
      inputProps={{ maxLength }}
      InputProps={{
        ...{ style: inputStyle, className: inputClassName },
        startAdornment: startIcon,
        endAdornment: loading ? (
          <LoadingIndicator size={18} height={18} />
        ) : (
          endIcon
        ),
        ...(enableRemoveButton
          ? {
              endAdornment: (
                <FontAwesomeIcon
                  icon={faClose}
                  color={
                    error
                      ? theme.palette.error.main
                      : theme.palette.text.disabled
                  }
                  style={{
                    fontSize: 16,
                    cursor: 'pointer',
                  }}
                  onClick={handleDeleteText}
                />
              ),
            }
          : {}),
        ...InputProps,
        className: clsx(InputProps?.className, !!readOnly && 'readonly'),
      }}
      style={style}
    />
  );
};
CustomTextField.defaultProps = {
  variant: 'standard',
  enableRemoveButton: false,
  helperText: ' ',
  formatting: 'text',
  helperTextClassName: '',
  helperTextStyle: {},
  readOnly: false,
  inputClassName: '',
  inputStyle: {},
};

export default styled(CustomTextField)(
  (props: CustomTextFieldProps & { theme?: Theme }) => `

`,
);
