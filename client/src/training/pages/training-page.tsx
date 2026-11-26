import { useBlocker, useNavigate } from '@tanstack/react-router';

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
import { deleteDraft, useDraft } from '@/shared/hooks/use-draft';
import { useIsMountedRef } from '@/shared/hooks/use-is-mounted-ref';
import { useSessionOwner } from '@/shared/hooks/use-session-owner';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { DEFAULT_TYPE_OPTION } from '../components/select-type-step/consts';
import { SelectTypeStep } from '../components/select-type-step/select-type-step';
import {
  TRAINING_STEPS,
  TRAINING_STEPS_LABELS,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
  VARIATIONA_FILE_PICKER,
  VARIATIONB_FILE_PICKER,
} from '../consts';

export const TrainingPage = () => {
  // Held in a draft, not in the step, so it survives moving between steps and pages.
  const [draft, updateDraft, resetDraft] = useDraft<{
    step: number;
    variationaFile: File | null;
    variationbFile: File | null;
    requiredType: string | null;
  }>(SessionType.training, {
    step: 0,
    variationaFile: null,
    variationbFile: null,
    requiredType: null,
  });
  const { step, variationaFile, variationbFile, requiredType } = draft;

  const owner = useSessionOwner();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { mutateAsync, isPending } = useCreateTrainingSession({
    request: { timeout: UPLOAD_REQUEST_TIMEOUT_MS },
  });
  // No leaving while sending, so the draft can't change under the request. A
  // refresh stays allowed (drafts are meant to be lost then).
  useBlocker({ shouldBlockFn: () => isPending, enableBeforeUnload: false });

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
    if (!owner || !variationaFile || !variationbFile || isPending) {
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
          variationa_file: variationaFile,
          variationb_file: variationbFile,
        },
      });

      // The upload can outlive the page; don't pull the user back once they left.
      if (isMountedRef.current) {
        await navigate({
          to: RESULTS_ROUTE_PATH,
          params: { type: SessionType.training, sessionId: session_id },
          // The blocker may still see the request as pending.
          ignoreBlocker: true,
        });
      }

      // Cleared after leaving, so the form doesn't blank out under the user.
      // `navigate` is assumed to succeed.
      deleteDraft(SessionType.training);
    } catch {
      // Already reported by the query client; stay here so the user can retry.
    }
  };

  const hasDraft =
    step > 0 || !!variationaFile || !!variationbFile || requiredType !== null;

  const steps: StepItem[] = [
    {
      ...TRAINING_STEPS.upload,
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
      ...TRAINING_STEPS.selectType,
      content: (
        <SelectTypeStep
          requiredType={requiredType}
          onRequiredTypeChange={(value) => updateDraft({ requiredType: value })}
        />
      ),
      isComplete: requiredType !== null,
    },
    {
      ...TRAINING_STEPS.summary,
      content: (
        <CompareSummaryStep
          firstTitle={VARIATIONA_FILE_PICKER.label}
          secondTitle={VARIATIONB_FILE_PICKER.label}
          firstImage={variationaFile}
          secondImage={variationbFile}
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
        activeStep={step}
        onStepChange={(value) => updateDraft({ step: value })}
        onFinish={finish}
        onCancel={resetDraft}
        canCancel={hasDraft}
        isFinishing={isPending}
        labels={TRAINING_STEPS_LABELS}
      />
    </PageLayout>
  );
};
