import { useListTrainingTypes } from '@/api/generated/api';
import { ChoiceGroup } from '@/shared/components/choice-group/choice-group';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { ErrorState, LoadingState } from '@/shared/ui/states/states';

import { DEFAULT_TYPE_OPTION, SELECT_TYPE_TITLE } from './consts';
import {
  ChoicesContainer,
  SelectTypeStepRoot,
} from './select-type-step.styles';

type SelectTypeStepProps = {
  requiredType: string | null;
  onRequiredTypeChange: (requiredType: string) => void;
};

export const SelectTypeStep = ({
  requiredType,
  onRequiredTypeChange,
}: SelectTypeStepProps) => {
  const { data, isPending, isError, refetch } = useListTrainingTypes();

  return (
    <SelectTypeStepRoot>
      <StepHeader title={SELECT_TYPE_TITLE} />
      <ChoicesContainer>
        {isPending && <LoadingState />}
        {isError && <ErrorState retry={() => void refetch()} />}
        {data && (
          <ChoiceGroup
            multiple={false}
            options={[
              DEFAULT_TYPE_OPTION,
              ...data.map((type) => ({ value: type, label: type })),
            ]}
            value={requiredType}
            onChange={onRequiredTypeChange}
          />
        )}
      </ChoicesContainer>
    </SelectTypeStepRoot>
  );
};
