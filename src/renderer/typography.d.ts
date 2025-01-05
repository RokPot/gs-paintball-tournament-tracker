import '@mui/material/Typography';
import '@mui/material/styles';
import { TypographyStyleOptions } from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: TypographyStyleOptions;
    subtitle3: TypographyStyleOptions;

    h1Bold: TypographyStyleOptions;
    h1Medium: TypographyStyleOptions;
    h2Bold: TypographyStyleOptions;
    h2Medium: TypographyStyleOptions;
    h3Bold: TypographyStyleOptions;
    h3Medium: TypographyStyleOptions;
    h4Bold: TypographyStyleOptions;
    h4Medium: TypographyStyleOptions;
    h5Bold: TypographyStyleOptions;
    h5Medium: TypographyStyleOptions;
    h6Bold: TypographyStyleOptions;
    h6Medium: TypographyStyleOptions;

    p1: TypographyStyleOptions;
    p1Bold: TypographyStyleOptions;
    p1Medium: TypographyStyleOptions;
    p2: TypographyStyleOptions;
    p2Bold: TypographyStyleOptions;
    p2Medium: TypographyStyleOptions;
    p3: TypographyStyleOptions;
    p3Bold: TypographyStyleOptions;
    p3Medium: TypographyStyleOptions;
  }

  // allow configuration using `createMuiTheme`
  interface TypographyVariantsOptions {
    body3?: TypographyStyleOptions;
    subtitle3?: TypographyStyleOptions;

    h1Bold: TypographyStyleOptions;
    h1Medium: TypographyStyleOptions;
    h2Bold: TypographyStyleOptions;
    h2Medium: TypographyStyleOptions;
    h3Bold: TypographyStyleOptions;
    h3Medium: TypographyStyleOptions;
    h4Bold: TypographyStyleOptions;
    h4Medium: TypographyStyleOptions;
    h5Bold: TypographyStyleOptions;
    h5Medium: TypographyStyleOptions;
    h6Bold: TypographyStyleOptions;
    h6Medium: TypographyStyleOptions;

    p1: TypographyStyleOptions;
    p1Bold: TypographyStyleOptions;
    p1Medium: TypographyStyleOptions;
    p2: TypographyStyleOptions;
    p2Bold: TypographyStyleOptions;
    p2Medium: TypographyStyleOptions;
    p3: TypographyStyleOptions;
    p3Bold: TypographyStyleOptions;
    p3Medium: TypographyStyleOptions;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
    subtitle3: true;

    h1Bold: true;
    h1Medium: true;
    h2Bold: true;
    h2Medium: true;
    h3Bold: true;
    h3Medium: true;
    h4Bold: true;
    h4Medium: true;
    h5Bold: true;
    h5Medium: true;
    h6Bold: true;
    h6Medium: true;

    p1: true;
    p1Bold: true;
    p1Medium: true;
    p2: true;
    p2Bold: true;
    p2Medium: true;
    p3: true;
    p3Bold: true;
    p3Medium: true;
  }
}
