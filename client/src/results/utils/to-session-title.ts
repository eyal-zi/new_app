/** File name of the image sent with the session: the last segment of its url. */
const getFileName = (url: string) => {
  const segment = url.split(/[?#]/)[0]?.split('/').pop() ?? '';

  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

/** Session title: `{sessionId} - {sent image file name}`. */
export const toSessionTitle = (sessionId: string, imageUrl: string) => {
  const fileName = getFileName(imageUrl);

  return fileName ? `${sessionId} - ${fileName}` : sessionId;
};
