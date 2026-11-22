import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useCreateInferenceSession } from '@/api/generated/api';
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

import { SelectStatisticsStep } from '../components/select-statistics-step/select-statistics-step';
import {
  FIRST_IMAGE_PICKER,
  INFERENCE_STEPS,
  INFERENCE_STEPS_LABELS,
  MIN_STATISTICS,
  SECOND_IMAGE_PICKER,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from '../consts';

export const InferencePage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);
  const [statistics, setStatistics] = useState<string[]>([]);

  const owner = useSessionOwner();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { mutateAsync, isPending } = useCreateInferenceSession({
    request: { timeout: UPLOAD_REQUEST_TIMEOUT_MS },
  });

  const selections: Selection[] = statistics.map((statistic) => ({
    id: statistic,
    label: statistic,
  }));

  const removeStatistic = (id: string) =>
    setStatistics((current) => current.filter((value) => value !== id));

  const finish = async () => {
    if (!owner || !firstImage || !secondImage || isPending) {
      return;
    }

    try {
      const { session_id } = await mutateAsync({
        data: {
          session_owner: owner,
          statistics,
          variationa_file: firstImage,
          variationb_file: secondImage,
        },
      });

      // The upload can outlive the page; don't pull the user back once they left.
      if (isMountedRef.current) {
        await navigate({
          to: RESULTS_ROUTE_PATH,
          params: { type: SessionType.inference, sessionId: session_id },
        });
      }
    } catch {
      // Already reported by the query client; stay here so the user can retry.
    }
  };

  const steps: StepItem[] = [
    {
      ...INFERENCE_STEPS.upload,
      content: (
        <ImagePickersStep
          title={UPLOAD_TITLE}
          subtitle={UPLOAD_SUBTITLE}
          pickers={[
            {
              ...FIRST_IMAGE_PICKER,
              value: firstImage,
              onChange: setFirstImage,
            },
            {
              ...SECOND_IMAGE_PICKER,
              value: secondImage,
              onChange: setSecondImage,
            },
          ]}
        />
      ),
      isComplete: !!firstImage && !!secondImage,
    },
    {
      ...INFERENCE_STEPS.selectStatistics,
      content: (
        <SelectStatisticsStep
          statistics={statistics}
          onStatisticsChange={setStatistics}
        />
      ),
      isComplete: statistics.length > 0,
    },
    {
      ...INFERENCE_STEPS.summary,
      content: (
        <CompareSummaryStep
          firstTitle={FIRST_IMAGE_PICKER.label}
          secondTitle={SECOND_IMAGE_PICKER.label}
          firstImage={firstImage}
          secondImage={secondImage}
          selections={selections}
          onRemoveSelection={
            statistics.length > MIN_STATISTICS ? removeStatistic : undefined
          }
        />
      ),
      isComplete: !!owner,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.inference}>
      <Steps
        steps={steps}
        onFinish={finish}
        isFinishing={isPending}
        labels={INFERENCE_STEPS_LABELS}
      />
    </PageLayout>
  );
};
