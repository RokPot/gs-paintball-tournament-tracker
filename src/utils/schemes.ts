import * as Yup from 'yup';

export const LeagueDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'League name is too short')
    .required('required')
    .nonNullable(),
});

export const QuickAddTeamSchema = Yup.object().shape({
  teamName: Yup.string().min(3, 'Team name is too short').required('required'),
  teamTag: Yup.string().min(1, 'Team tag is too short').required('required'),
  members: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('required'),
      lastName: Yup.string().required('required'),
    })
  ),
});
