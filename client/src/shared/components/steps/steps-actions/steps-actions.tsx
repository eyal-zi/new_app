import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Button } from '@mui/material';
import { useState } from 'react';

import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';

import { type CancelConfirmation, type StepsLabels } from '../types';
import {
  ActionsBar,
  PrimaryActionButton,
  SecondaryActions,
} from './steps-actions.styles';

export type StepsActionsProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  isFinishing: boolean;
  labels: Pick<StepsLabels, 'back' | 'cancel' | 'next' | 'finish'>;
  onBack: () => void;
  /** Omit to hide the cancel button. */
  onCancel?: () => void;
  canCancel: boolean;
  cancelConfirmation?: CancelConfirmation;
  onNext: () => void;
  onFinish: () => void;
};

export const StepsActions = ({
  isFirstStep,
  isLastStep,
  canProceed,
  isFinishing,
  labels,
  onBack,
  onCancel,
  canCancel,
  cancelConfirmation,
  onNext,
  onFinish,
}: StepsActionsProps) => {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const closeConfirmation = () => setConfirmingCancel(false);

  const requestCancel = () => {
    if (cancelConfirmation) {
      setConfirmingCancel(true);
    } else {
      onCancel?.();
    }
  };

  const confirmCancel = () => {
    closeConfirmation();
    onCancel?.();
  };

  return (
    <ActionsBar>
      <SecondaryActions>
        <Button
          onClick={onBack}
          disabled={isFirstStep || isFinishing}
          startIcon={<ArrowBackRoundedIcon />}
        >
          {labels.back}
        </Button>
        {onCancel && (
          <Button
            color="inherit"
            onClick={requestCancel}
            disabled={!canCancel || isFinishing}
          >
            {labels.cancel}
          </Button>
        )}
      </SecondaryActions>
      <PrimaryActionButton
        variant="contained"
        onClick={isLastStep ? onFinish : onNext}
        disabled={!canProceed}
        loading={isLastStep && isFinishing}
        endIcon={
          isLastStep ? <CheckRoundedIcon /> : <ArrowForwardRoundedIcon />
        }
      >
        {isLastStep ? labels.finish : labels.next}
      </PrimaryActionButton>
      {cancelConfirmation && (
        <ConfirmationDialog
          open={confirmingCancel}
          title={cancelConfirmation.title}
          description={cancelConfirmation.description}
          onCancel={closeConfirmation}
          onConfirm={confirmCancel}
        />
      )}
    </ActionsBar>
  );
};
