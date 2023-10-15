import '@mui/material/Typography';
import '@mui/material/styles';
import { CSSProperties } from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: CSSProperties;
    subtitle3: CSSProperties;

    h1Bold: CSSProperties;
    h1Medium: CSSProperties;
    h2Bold: CSSProperties;
    h2Medium: CSSProperties;
    h3Bold: CSSProperties;
    h3Medium: CSSProperties;
    h4Bold: CSSProperties;
    h4Medium: CSSProperties;
    h5Bold: CSSProperties;
    h5Medium: CSSProperties;
    h6Bold: CSSProperties;
    h6Medium: CSSProperties;

    p1: CSSProperties;
    p1Bold: CSSProperties;
    p1Medium: CSSProperties;
    p2: CSSProperties;
    p2Bold: CSSProperties;
    p2Medium: CSSProperties;
    p3: CSSProperties;
    p3Bold: CSSProperties;
    p3Medium: CSSProperties;
  }

  // allow configuration using `createMuiTheme`
  interface TypographyVariantsOptions {
    body3?: CSSProperties;
    subtitle3?: CSSProperties;

    h1Bold: CSSProperties;
    h1Medium: CSSProperties;
    h2Bold: CSSProperties;
    h2Medium: CSSProperties;
    h3Bold: CSSProperties;
    h3Medium: CSSProperties;
    h4Bold: CSSProperties;
    h4Medium: CSSProperties;
    h5Bold: CSSProperties;
    h5Medium: CSSProperties;
    h6Bold: CSSProperties;
    h6Medium: CSSProperties;

    p1: CSSProperties;
    p1Bold: CSSProperties;
    p1Medium: CSSProperties;
    p2: CSSProperties;
    p2Bold: CSSProperties;
    p2Medium: CSSProperties;
    p3: CSSProperties;
    p3Bold: CSSProperties;
    p3Medium: CSSProperties;
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

// declare module "@mui/material" {
//   export interface Color {
//     0: string;
//   }
//   export interface CommonColors {
//     themeContrastLow: string;
//     themeContrastHigh: string;
//   }

//   export interface SurfaceColors {
//     surface0?: string;
//     surface100?: string;
//     surface200?: string;
//     color100?: string;
//     color200?: string;
//     color400?: string;
//     error100?: string;
//     warning100?: string;
//     success100?: string;
//     success200?: string;
//   }

//   export interface PaletteOptions {
//     surface: Partial<SurfaceColors>;
//   }
//   export interface Palette {
//     surface: Partial<SurfaceColors>;
//   }
// }

// declare module "@mui/material/styles/createPalette" {
//   export interface CommonColors {
//     themeContrastLow: string;
//     themeContrastHigh: string;
//   }
//   export interface TypeBackground {
//     secondary: string;
//     overlay: string;
//   }
// }
