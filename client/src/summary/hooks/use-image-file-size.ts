import { useQuery } from '@tanstack/react-query';

const fetchImageFileSize = async (src: string) => {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Unable to load image (${response.status})`);
  }

  return (await response.blob()).size;
};

export const useImageFileSize = (src: string) =>
  useQuery({
    queryKey: ['image-file-size', src],
    queryFn: () => fetchImageFileSize(src),
    staleTime: Infinity,
  });
