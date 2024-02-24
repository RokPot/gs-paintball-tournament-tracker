import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import * as React from 'react';

interface StyledTabProps {
  label: string;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 70,
    width: '100%',
    backgroundColor: theme.palette.primary.light,
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  fontFamily: theme.typography.p1.fontFamily,
  marginRight: theme.spacing(1),
  color: theme.palette.text.primary,
  paddingLeft: '0px',
  paddingRight: '0px',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

interface IProps {
  items: { label: string; value: string }[];
  onTabChanged: (activeTab: string) => void;
}

const CustomTabs = ({ items, onTabChanged }: IProps) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onTabChanged(items[newValue].value);
  };

  return (
    <StyledTabs
      value={value}
      onChange={handleChange}
      aria-label="styled tabs example"
    >
      {items.map((item, index) => (
        <StyledTab label={item.label} key={index} />
      ))}
    </StyledTabs>
  );
};
export default CustomTabs;
