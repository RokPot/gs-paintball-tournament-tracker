import { useMediaQuery } from '@mui/material';
import { theme } from 'theme/theme';

const mediaQueryConfig = {
  noSsr: true,
};

export const responsiveDesignQuery = {
  mobile: `(max-width: ${theme.breakpoints.values.lg}px)`,
  desktop: `(min-width: ${theme.breakpoints.values.lg}px)`,
  isLandscape: '(orientation: landscape)',
};

export const useIsResponsive = () => {
  const isMobile = useMediaQuery(
    responsiveDesignQuery.mobile,
    mediaQueryConfig
  );
  const isDesktop = useMediaQuery(
    responsiveDesignQuery.desktop,
    mediaQueryConfig
  );
  const isLandscape = useMediaQuery(
    responsiveDesignQuery.isLandscape,
    mediaQueryConfig
  );

  return {
    isMobile,
    isDesktop,
    isLandscape: isMobile && isLandscape,
  };
};
