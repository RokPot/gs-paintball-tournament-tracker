import SwitzerVariableTtf from '../../assets/fonts/switzer/Switzer-Variable.ttf';
import { ThemeOptions, createTheme } from '@mui/material';
import { TypographyStyleOptions } from '@mui/material/styles/createTypography';

const h1: TypographyStyleOptions = {
  fontSize: '26px',
  lineHeight: '36px',
  fontFamily: 'Switzer',

  marginBottom: '40px',
};

const h2: TypographyStyleOptions = {
  fontSize: '24px',
  lineHeight: '34px',
  fontFamily: 'Switzer',

  textTransform: 'none',
  marginBottom: '20px',
};

const h3: TypographyStyleOptions = {
  fontSize: '21px',
  lineHeight: '31px',
  fontFamily: 'Switzer',

  textTransform: 'none',
  marginBottom: '20px',
};

const h4: TypographyStyleOptions = {
  fontSize: '19px',
  lineHeight: '29px',
  fontFamily: 'Switzer',
  marginBottom: '15px',
};

const h5: TypographyStyleOptions = {
  fontSize: '17px',
  lineHeight: '27px',
  fontFamily: 'Switzer',
  marginBottom: '15px',
};

const h6: TypographyStyleOptions = {
  fontSize: '16px',
  lineHeight: '26px',
  fontFamily: 'Switzer',
  marginBottom: '15px',
};
const p1: TypographyStyleOptions = {
  fontFamily: 'Switzer',
  fontSize: '14px',
  lineHeight: '25px',
};
const p2: TypographyStyleOptions = {
  fontFamily: 'Switzer',
  fontSize: '12px',
  lineHeight: '22px',
};
const p3: TypographyStyleOptions = {
  fontFamily: 'Switzer',
  fontSize: '10px',
  lineHeight: '18px',
};
export const regular = 400,
  medium = 600,
  bold = 700;
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#8448a9',
    },
    secondary: {
      main: '#3EC300',
    },
  },
  typography: {
    // fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',

    fontFamily: 'Switzer',
    fontSize: 16,
    h1: { ...h1, fontWeight: regular },
    h1Bold: { ...h1, fontWeight: bold },
    h1Medium: { ...h1, fontWeight: medium },
    h2: { ...h2, fontWeight: regular },
    h2Bold: { ...h2, fontWeight: bold },
    h2Medium: { ...h2, fontWeight: medium },
    h3: { ...h3, fontWeight: regular },
    h3Bold: { ...h3, fontWeight: bold },
    h3Medium: { ...h3, fontWeight: medium },
    h4: { ...h4, fontWeight: regular },
    h4Bold: { ...h4, fontWeight: bold },
    h4Medium: { ...h4, fontWeight: medium },
    h5: { ...h5, fontWeight: regular },
    h5Bold: { ...h5, fontWeight: bold },
    h5Medium: { ...h5, fontWeight: medium },
    h6: { ...h6, fontWeight: regular },
    h6Bold: { ...h6, fontWeight: bold },
    h6Medium: { ...h6, fontWeight: medium },

    p1: { ...p1, fontWeight: regular },
    p1Bold: { ...p1, fontWeight: bold },
    p1Medium: { ...p1, fontWeight: medium },
    p2: { ...p2, fontWeight: regular },
    p2Bold: { ...p2, fontWeight: bold },
    p2Medium: { ...p2, fontWeight: medium },
    p3: { ...p3, fontWeight: regular },
    p3Bold: { ...p3, fontWeight: bold },
    p3Medium: { ...p3, fontWeight: medium },

    caption: {
      ...p2,
      fontFamily: 'Switzer',
    },
    body1: {
      ...p1,
      fontFamily: 'Switzer',
    },
    body2: {
      ...p2,
      fontFamily: 'Switzer',
    },
    body3: {
      ...p3,
      fontFamily: 'Switzer',
    },
    subtitle1: {
      ...p1,
      fontFamily: 'Switzer',
    },
    subtitle2: {
      ...p2,
      fontFamily: 'Switzer',
    },
    subtitle3: {
      ...p3,
      fontFamily: 'Switzer',
    },
    fontWeightBold: bold,
    fontWeightMedium: medium,
    fontWeightRegular: regular,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: '0px',
        },
      },
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h1Bold: 'h1',
          h1Medium: 'h1',
          h2: 'h2',
          h2Bold: 'h2',
          h2Medium: 'h2',
          h3: 'h3',
          h3Bold: 'h3',
          h3Medium: 'h3',
          h4: 'h4',
          h4Bold: 'h4',
          h4Medium: 'h4',
          h5: 'h5',
          h5Bold: 'h5',
          h5Medium: 'h5',
          h6: 'h6',
          h6Bold: 'h6',
          h6Medium: 'h6',

          p1: 'span',
          p1Bold: 'span',
          p1Medium: 'span',
          p2: 'span',
          p2Bold: 'span',
          p2Medium: 'span',
          p3: 'span',
          p3Bold: 'span',
          p3Medium: 'span',

          subtitle1: 'span',
          subtitle2: 'span',
          body1: 'span',
          body2: 'span',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        html, body, #root {
          height: 100%;
          min-height: 100%;
        }
        * {
          overscroll-behavior: contain;
        }
        @font-face {
          font-family: Switzer;
          font-style: normal;
          font-weight: 100 1000;
          src: url(${SwitzerVariableTtf}) format('truetype');
        }
       
        `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
