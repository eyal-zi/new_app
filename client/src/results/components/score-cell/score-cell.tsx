import { Typography } from '@mui/material';

import { PERCENT } from '@/shared/constants';

import {
  getScoreLabel,
  SCORE_DECIMALS,
  SCORE_RING_SIZE,
  SCORE_RING_THICKNESS,
} from '../../consts';
import { clampScore, getScoreColor } from '../../utils/get-score-color';
import {
  RingLabel,
  RingTrack,
  RingValue,
  RingWrapper,
  ScoreFrame,
} from './score-cell.styles';

type ScoreCellProps = { score: number };

/** Circular progress that fills up towards a score of 1 and shifts from green to red. */
export const ScoreCell = ({ score }: ScoreCellProps) => {
  const clamped = clampScore(score);
  const ringProps = {
    size: SCORE_RING_SIZE,
    thickness: SCORE_RING_THICKNESS,
    variant: 'determinate',
  } as const;

  return (
    <ScoreFrame>
      <RingWrapper>
        <RingTrack {...ringProps} value={PERCENT} aria-hidden />
        <RingValue
          {...ringProps}
          value={clamped * PERCENT}
          ringColor={getScoreColor(clamped)}
          aria-label={getScoreLabel(clamped.toFixed(SCORE_DECIMALS))}
        />
        <RingLabel>
          <Typography variant="subtitle1">
            {clamped.toFixed(SCORE_DECIMALS)}
          </Typography>
        </RingLabel>
      </RingWrapper>
    </ScoreFrame>
  );
};
