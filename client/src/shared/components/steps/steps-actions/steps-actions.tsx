import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Button } from '@mui/material';
import { useState } from 'react';

import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';

import { CANCEL_CONFIRMATION } from '../consts';
import { type StepsLabels } from '../types';
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
  onCancel: () => void;
  canCancel: boolean;
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
  onNext,
  onFinish,
}: StepsActionsProps) => {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const closeConfirmation = () => setConfirmingCancel(false);

  const openConfirmation = () => setConfirmingCancel(true);

  const confirmCancel = () => {
    closeConfirmation();
    onCancel();
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
        <Button
          color="inherit"
          onClick={openConfirmation}
          disabled={!canCancel || isFinishing}
        >
          {labels.cancel}
        </Button>
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
      <ConfirmationDialog
        open={confirmingCancel}
        {...CANCEL_CONFIRMATION}
        onCancel={closeConfirmation}
        onConfirm={confirmCancel}
      />
    </ActionsBar>
  );
};
