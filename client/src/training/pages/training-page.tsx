import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useCreateTrainingSession } from '@/api/generated/api';
import { SessionType } from '@/api/generated/model';
import { RESULTS_ROUTE_PATH } from '@/sessions/consts';
import { CompareSummaryStep } from '@/shared/components/compare-summary-step/compare-summary-step';
import { ImagePickersStep } from '@/shared/components/image-pickers-step/image-pickers-step';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import type { Selection } from '@/shared/components/selection-list/types';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { UPLOAD_REQUEST_TIMEOUT_MS } from '@/shared/constants';
import { useIsMountedRef } from '@/shared/hooks/use-is-mounted-ref';
import { useSessionOwner } from '@/shared/hooks/use-session-owner';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { DEFAULT_TYPE_OPTION } from '../components/select-type-step/consts';
import { SelectTypeStep } from '../components/select-type-step/select-type-step';
import {
  VARIATIONA_IMAGE_PICKER,
  VARIATIONB_IMAGE_PICKER,
  TRAINING_STEPS,
  TRAINING_STEPS_LABELS,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from '../consts';

export const TrainingPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [variationaImage, setVariationaImage] = useState<File | null>(null);
  const [variationbImage, setVariationbImage] = useState<File | null>(null);
  const [requiredType, setRequiredType] = useState<string | null>(null);

  const owner = useSessionOwner();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { mutateAsync, isPending } = useCreateTrainingSession({
    request: { timeout: UPLOAD_REQUEST_TIMEOUT_MS },
  });

  const selections: Selection[] = requiredType
    ? [
        {
          id: requiredType,
          label:
            requiredType === DEFAULT_TYPE_OPTION.value
              ? DEFAULT_TYPE_OPTION.label
              : requiredType,
        },
      ]
    : [];

  const finish = async () => {
    if (!owner || !variationaImage || !variationbImage || isPending) {
      return;
    }

    try {
      const { session_id } = await mutateAsync({
        data: {
          session_owner: owner,
          // The default type is the API's fallback, so it's omitted entirely.
          training_type:
            requiredType === DEFAULT_TYPE_OPTION.value
              ? undefined
              : requiredType,
          variationa_file: variationaImage,
          variationb_file: variationbImage,
        },
      });

      // The upload can outlive the page; don't pull the user back once they left.
      if (isMountedRef.current) {
        await navigate({
          to: RESULTS_ROUTE_PATH,
          params: { type: SessionType.training, sessionId: session_id },
        });
      }
    } catch {
      // Already reported by the query client; stay here so the user can retry.
    }
  };

  const steps: StepItem[] = [
    {
      ...TRAINING_STEPS.upload,
      content: (
        <ImagePickersStep
          title={UPLOAD_TITLE}
          subtitle={UPLOAD_SUBTITLE}
          pickers={[
            {
              ...VARIATIONA_IMAGE_PICKER,
              value: variationaImage,
              onChange: setVariationaImage,
            },
            {
              ...VARIATIONB_IMAGE_PICKER,
              value: variationbImage,
              onChange: setVariationbImage,
            },
          ]}
        />
      ),
      isComplete: !!variationaImage && !!variationbImage,
    },
    {
      ...TRAINING_STEPS.selectType,
      content: (
        <SelectTypeStep
          requiredType={requiredType}
          onRequiredTypeChange={setRequiredType}
        />
      ),
      isComplete: requiredType !== null,
    },
    {
      ...TRAINING_STEPS.summary,
      content: (
        <CompareSummaryStep
          variationaTitle={VARIATIONA_IMAGE_PICKER.label}
          variationbTitle={VARIATIONB_IMAGE_PICKER.label}
          variationaImage={variationaImage}
          variationbImage={variationbImage}
          selections={selections}
        />
      ),
      isComplete: !!owner,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.training}>
      <Steps
        steps={steps}
        onFinish={finish}
        isFinishing={isPending}
        labels={TRAINING_STEPS_LABELS}
      />
    </PageLayout>
  );
};
