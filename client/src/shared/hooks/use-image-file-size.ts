import { useQuery } from '@tanstack/react-query';

import { IMAGE_FILE_SIZE_QUERY_KEY } from '../constants';

// A HEAD request reads the size from Content-Length without downloading the
// image body a second time.
const fetchImageFileSize = async (src: string) => {
  const response = await fetch(src, { method: 'HEAD' });

  if (!response.ok) {
    throw new Error(`Unable to load image (${response.status})`);
  }

  const length = Number(response.headers.get('Content-Length'));

  if (!length) {
    throw new Error('Image size is unavailable');
  }

  return length;
};

export const useImageFileSize = (src?: string) =>
  useQuery({
    queryKey: [IMAGE_FILE_SIZE_QUERY_KEY, src],
    queryFn: () => fetchImageFileSize(src as string),
    enabled: !!src,
    staleTime: Infinity,
    retry: false,
  });
