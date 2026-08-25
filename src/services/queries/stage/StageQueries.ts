import { useMutation } from '@tanstack/react-query';
import useStageService from 'services/StageService';
import TournamentStage from 'types/TournamentStage';

export namespace StageQueries {
  export const useAddStage = () => {
    const { addNewStage } = useStageService();

    return useMutation({
      mutationFn: (stage: TournamentStage) => {
        return addNewStage(stage.toDto());
      },
    });
  };

  export const useUpdateStage = () => {
    const { updateStage } = useStageService();

    return useMutation({
      mutationFn: (stage: TournamentStage) => {
        return updateStage(stage.toDto());
      },
    });
  };
}
