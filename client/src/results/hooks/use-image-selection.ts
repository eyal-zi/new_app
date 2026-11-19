import { useMemo, useState } from 'react';

import type { SelectedImage } from '../types';

/** Selection of images across the whole page, kept in selection order. */
export const useImageSelection = () => {
  const [selected, setSelected] = useState<ReadonlyMap<string, SelectedImage>>(
    () => new Map(),
  );

  const toggle = (image: SelectedImage) =>
    setSelected((previous) => {
      const next = new Map(previous);

      if (!next.delete(image.id)) {
        next.set(image.id, image);
      }

      return next;
    });

  const clear = () => setSelected(new Map());

  const images = useMemo(() => [...selected.values()], [selected]);
  const ids = useMemo(() => new Set(selected.keys()), [selected]);

  return { images, ids, toggle, clear };
};
