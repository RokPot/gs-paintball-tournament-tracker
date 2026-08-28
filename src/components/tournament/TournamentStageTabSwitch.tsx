import CustomTabs from 'components/shared/CustomTabs';
import { useState } from 'react';
import Tournament from 'types/Tournament';
import TournamentStage from 'types/TournamentStage';

interface IProps {
  selectedTournament: Tournament;
  onStageSelected: (selectedStage: TournamentStage) => void;
}

const TournamentStageTabSwitch: React.FC<IProps> = ({
  selectedTournament,
  onStageSelected,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>();
  const selectedStage =
    selectedTournament?.stages?.find((stage) => stage.id === selectedStageId) ||
    selectedTournament?.currentStage;

  const onStageChanged = (activeTab: string) => {
    const newSelectedStage = selectedTournament?.stages?.find(
      (stage) => stage.id === activeTab,
    );
    if (!newSelectedStage) {
      return;
    }
    setSelectedStageId(newSelectedStage.id);
    onStageSelected(newSelectedStage);
  };

  if (!selectedTournament?.stages || selectedTournament?.stages?.length < 2) {
    return null;
  }

  return (
    <CustomTabs
      activeTab={selectedStage?.id}
      items={
        selectedTournament?.stages?.map((stage, index) => ({
          label: `Stage ${index + 1}`,
          value: stage.id,
        })) || []
      }
      onTabChanged={onStageChanged}
    />
  );
};

export default TournamentStageTabSwitch;
