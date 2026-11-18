import { ChoiceGroup } from '@/shared/components/choice-group/choice-group';
import { StepHeader } from '@/shared/components/step-header/step-header';

import {
  SELECT_STATISTICS_TITLE,
  type Statistic,
  STATISTIC_OPTIONS,
} from './consts';
import {
  ChoicesContainer,
  SelectStatisticsStepRoot,
} from './select-statistics-step.styles';

type SelectStatisticsStepProps = {
  statistics: readonly Statistic[];
  onStatisticsChange: (statistics: Statistic[]) => void;
};

export const SelectStatisticsStep = ({
  statistics,
  onStatisticsChange,
}: SelectStatisticsStepProps) => (
  <SelectStatisticsStepRoot>
    <StepHeader title={SELECT_STATISTICS_TITLE} />
    <ChoicesContainer>
      <ChoiceGroup
        options={STATISTIC_OPTIONS}
        value={statistics}
        onChange={onStatisticsChange}
      />
    </ChoicesContainer>
  </SelectStatisticsStepRoot>
);
