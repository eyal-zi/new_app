import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useCreateTrainingSession } from '@/api/generated/api';
import { SessionType } from '@/api/generated/model';
import { RESULTS_ROUTE_PATH } from '@/sessions/consts';
import { CompareSummaryStep } from '@/shared/components/compare-summary-step/compare-summary-step';
import { ImagePickersStep } from '@/shared/components/image-pickers-step/image-pickers-step';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import type { Selection } from '@/shared/components/selection-list/types';
import { DISCARD_SESSION_CONFIRMATION } from '@/shared/components/steps/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { UPLOAD_REQUEST_TIMEOUT_MS } from '@/shared/constants';
import { clearDraft, clearDraftIf, useDraft } from '@/shared/hooks/use-draft';
import { useIsMountedRef } from '@/shared/hooks/use-is-mounted-ref';
import { useSessionOwner } from '@/shared/hooks/use-session-owner';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { DEFAULT_TYPE_OPTION } from '../components/select-type-step/consts';
import { SelectTypeStep } from '../components/select-type-step/select-type-step';
import {
  TRAINING_DRAFT_SCOPE,
  TRAINING_STEPS,
  TRAINING_STEPS_LABELS,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
  VARIATIONA_FILE_PICKER,
  VARIATIONB_FILE_PICKER,
} from '../consts';

export const TrainingPage = () => {
  // Held in a draft, not in the step, so it survives moving between steps and pages.
  const [{ step, variationaFile, variationbFile, requiredType }, updateDraft] =
    useDraft(TRAINING_DRAFT_SCOPE);

  const owner = useSessionOwner();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  // Spans the upload and the navigation, so Finish stays locked until the page
  // is left: `isPending` alone drops as soon as the upload is done.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useCreateTrainingSession({
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
    if (!owner || !variationaFile || !variationbFile || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

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

      try {
        // The upload can outlive the page; don't pull the user back once they left.
        if (isMountedRef.current) {
          await navigate({
            to: RESULTS_ROUTE_PATH,
            params: { type: SessionType.training, sessionId: session_id },
          });
        }
      } finally {
        // The session exists, so there is nothing left to come back to. Cleared
        // only after leaving, so the form doesn't blank out under the user, and
        // only if it is still the submitted draft, not a newer one.
        clearDraftIf(
          TRAINING_DRAFT_SCOPE,
          (current) =>
            current.variationaFile === variationaFile &&
            current.variationbFile === variationbFile,
        );
      }
    } catch {
      // Already reported by the query client; stay here so the user can retry.
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasDraft =
    step > 0 || !!variationaFile || !!variationbFile || requiredType !== null;

  // Back to a blank session on the first step.
  const cancel = () => clearDraft(TRAINING_DRAFT_SCOPE);

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
        onCancel={cancel}
        canCancel={hasDraft}
        cancelConfirmation={DISCARD_SESSION_CONFIRMATION}
        isFinishing={isSubmitting}
        labels={TRAINING_STEPS_LABELS}
      />
    </PageLayout>
  );
};
