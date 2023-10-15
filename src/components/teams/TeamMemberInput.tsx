import { Typography } from '@mui/material';
import CustomTextField from 'components/shared/CustomTextField';
import FlexContainer from 'components/shared/FlexContainer';

const TeamMemberInput: React.FC = () => {
  return (
    <FlexContainer flexDirection="row" margin={8} width="100%">
      <Typography>{index}. </Typography>
      <CustomTextField
        label="First name*"
        id="name"
        value={teamsFormik.values[index].name}
        onChange={formik.handleChange}
        placeholder="First name"
        variant="outlined"
        style={{ width: '100%' }}
        disableError
        size="small"
        debounceTime={500}
      />
      <CustomTextField
        label="Last name*"
        id="lastName"
        value={formik.values.members}
        onChange={formik.handleChange}
        placeholder="First name"
        variant="outlined"
        style={{ width: '100%' }}
        size="small"
        disableError
        debounceTime={500}
      />
      <CustomTextField
        label="Last name*"
        id="lastName"
        value={formik.values.members}
        onChange={formik.handleChange}
        placeholder="First name"
        variant="outlined"
        style={{ width: '100%' }}
        size="small"
        disableError
        debounceTime={500}
      />
    </FlexContainer>
  );
};

export default TeamMemberInput;
