import { useNavigate } from '@tanstack/react-router';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';

import { useCreateEvaluationSession } from '@/api/generated/api';
import { SESSION_IDS_PARAM } from '@/results/consts';
import { EVALUATION_RESULTS_ROUTE_PATH } from '@/sessions/consts';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import {
  MAX_CONCURRENT_UPLOADS,
  UPLOAD_REQUEST_TIMEOUT_MS,
} from '@/shared/constants';
import { useSessionOwner } from '@/shared/hooks/use-session-owner';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';
import { mapWithConcurrency } from '@/shared/utils/map-with-concurrency';

import { EvaluationSummaryStep } from '../components/summary-step/summary-step';
import { UploadStep } from '../components/upload-step/upload-step';
import { EVALUATION_STEPS, getPartialFailureMessage } from '../consts';

export const EvaluationPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [images, setImages] = useState<File[]>([]);
  const owner = useSessionOwner();
  const navigate = useNavigate();
  // One flag for the whole batch: `isPending` only follows the last request.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync } = useCreateEvaluationSession({
    request: { timeout: UPLOAD_REQUEST_TIMEOUT_MS },
  });
  // The batch can outlive the page; don't pull the user back once they left.
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // A session evaluates a single image, so each image gets its own session.
  // Each failure is reported by the query client; the sessions that were
  // created still open in the compare view, with a summary of what failed.
  const finish = async () => {
    // Also blocks a second click while the first batch is out.
    if (!owner || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const results = await mapWithConcurrency(
        images,
        MAX_CONCURRENT_UPLOADS,
        (image) =>
          mutateAsync({
            data: { session_owner: owner, variationa_file: image },
          }),
      );
      const ids = results.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value.session_id] : [],
      );
      const failed = results.length - ids.length;

      if (failed > 0) {
        enqueueSnackbar(getPartialFailureMessage(failed, results.length), {
          variant: 'warning',
        });
      }

      if (ids.length > 0 && isMountedRef.current) {
        await navigate({
          to: EVALUATION_RESULTS_ROUTE_PATH,
          search: { [SESSION_IDS_PARAM]: ids },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: StepItem[] = [
    {
      ...EVALUATION_STEPS.upload,
      content: <UploadStep images={images} onImagesChange={setImages} />,
      isComplete: images.length > 0,
    },
    {
      ...EVALUATION_STEPS.summary,
      content: <EvaluationSummaryStep images={images} />,
      isComplete: !!owner,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.evaluation}>
      <Steps steps={steps} onFinish={finish} isFinishing={isSubmitting} />
    </PageLayout>
  );
};
