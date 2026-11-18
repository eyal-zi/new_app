import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useCreateEvaluationSession } from '@/api/generated/api';
import { SESSION_IDS_PARAM } from '@/results/consts';
import { EVALUATION_RESULTS_ROUTE_PATH } from '@/sessions/consts';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { useSessionOwner } from '@/shared/hooks/use-session-owner';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { EvaluationSummaryStep } from '../components/summary-step/summary-step';
import { UploadStep } from '../components/upload-step/upload-step';
import { EVALUATION_STEPS } from '../consts';

export const EvaluationPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [images, setImages] = useState<File[]>([]);
  const owner = useSessionOwner();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateEvaluationSession();

  // A session evaluates a single image, so each image gets its own session.
  // Failures are reported by the query client; the sessions that were created
  // still open in the compare view.
  const finish = async () => {
    if (!owner) {
      return;
    }

    const results = await Promise.allSettled(
      images.map((image) =>
        mutateAsync({ data: { session_owner: owner, variationa_file: image } }),
      ),
    );
    const ids = results.flatMap((result) =>
      result.status === 'fulfilled' ? [result.value.session_id] : [],
    );

    if (ids.length > 0) {
      await navigate({
        to: EVALUATION_RESULTS_ROUTE_PATH,
        search: { [SESSION_IDS_PARAM]: ids },
      });
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
      <Steps steps={steps} onFinish={finish} isFinishing={isPending} />
    </PageLayout>
  );
};
