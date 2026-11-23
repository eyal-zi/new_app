import { useNavigate } from '@tanstack/react-router';

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
import { clearDraft, useDraft } from '@/shared/hooks/use-draft';
import { useIsMountedRef } from '@/shared/hooks/use-is-mounted-ref';
import { useSessionOwner } from '@/shared/hooks/use-session-owner';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { SelectStatisticsStep } from '../components/select-statistics-step/select-statistics-step';
import {
  EMPTY_INFERENCE_DRAFT,
  INFERENCE_DRAFT_SCOPE,
  INFERENCE_STEPS,
  INFERENCE_STEPS_LABELS,
  MIN_STATISTICS,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
  VARIATIONA_FILE_PICKER,
  VARIATIONB_FILE_PICKER,
} from '../consts';

export const InferencePage = () => {
  // Held in a draft, not in the step, so it survives moving between steps and pages.
  const [{ step, variationaFile, variationbFile, statistics }, updateDraft] =
    useDraft(INFERENCE_DRAFT_SCOPE, EMPTY_INFERENCE_DRAFT);

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
    updateDraft((current) => ({
      statistics: current.statistics.filter((value) => value !== id),
    }));

  const finish = async () => {
    if (!owner || !variationaFile || !variationbFile || isPending) {
      return;
    }

    try {
      const { session_id } = await mutateAsync({
        data: {
          session_owner: owner,
          statistics,
          variationa_file: variationaFile,
          variationb_file: variationbFile,
        },
      });

      // The session exists now, so there is nothing left to come back to.
      clearDraft(INFERENCE_DRAFT_SCOPE);

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

  // Back to a blank session on the first step.
  const cancel = () => clearDraft(INFERENCE_DRAFT_SCOPE);

  const steps: StepItem[] = [
    {
      ...INFERENCE_STEPS.upload,
      content: (
        <ImagePickersStep
          title={UPLOAD_TITLE}
          subtitle={UPLOAD_SUBTITLE}
          pickers={[
            {
              ...VARIATIONA_FILE_PICKER,
              value: variationaFile,
              onChange: (file) => updateDraft({ variationaFile: file }),
            },
            {
              ...VARIATIONB_FILE_PICKER,
              value: variationbFile,
              onChange: (file) => updateDraft({ variationbFile: file }),
            },
          ]}
        />
      ),
      isComplete: !!variationaFile && !!variationbFile,
    },
    {
      ...INFERENCE_STEPS.selectStatistics,
      content: (
        <SelectStatisticsStep
          statistics={statistics}
          onStatisticsChange={(value) => updateDraft({ statistics: value })}
        />
      ),
      isComplete: statistics.length > 0,
    },
    {
      ...INFERENCE_STEPS.summary,
      content: (
        <CompareSummaryStep
          firstTitle={VARIATIONA_FILE_PICKER.label}
          secondTitle={VARIATIONB_FILE_PICKER.label}
          firstImage={variationaFile}
          secondImage={variationbFile}
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
        activeStep={step}
        onStepChange={(value) => updateDraft({ step: value })}
        onFinish={finish}
        onCancel={cancel}
        isFinishing={isPending}
        labels={INFERENCE_STEPS_LABELS}
      />
    </PageLayout>
  );
};
