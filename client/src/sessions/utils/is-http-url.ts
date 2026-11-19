import { HTTP_PROTOCOLS } from './is-http-url.consts';

export const isHttpUrl = (url: string) => {
  try {
    return HTTP_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
};
