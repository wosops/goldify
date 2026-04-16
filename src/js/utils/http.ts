import { TokenData } from './UserInfoUtils';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
  }
}

export const isHttpError = (err: unknown): err is HttpError => err instanceof HttpError;

const bearer = (token: TokenData): Record<string, string> => ({
  Authorization: `Bearer ${token.access_token}`,
});

const readErrorBody = async (res: Response): Promise<unknown> => {
  const text = await res.text().catch(() => '');
  if (!text) return '';
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const request = async <T>(url: string, init: RequestInit): Promise<T> => {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new HttpError(res.status, await readErrorBody(res));
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
};

export const httpGet = <T>(url: string, token: TokenData): Promise<T> =>
  request<T>(url, { headers: bearer(token) });

export const httpPost = <T>(url: string, body: unknown, token: TokenData): Promise<T> =>
  request<T>(url, {
    method: 'POST',
    headers: { ...bearer(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const httpPut = <T>(url: string, body: unknown, token: TokenData): Promise<T> =>
  request<T>(url, {
    method: 'PUT',
    headers: { ...bearer(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const httpPutBinary = async (
  url: string,
  body: BodyInit,
  contentType: string,
  token: TokenData
): Promise<Response> => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...bearer(token), 'Content-Type': contentType },
    body,
  });
  if (!res.ok) {
    throw new HttpError(res.status, await readErrorBody(res));
  }
  return res;
};

export const httpPostForm = <T>(
  url: string,
  form: Record<string, string>,
  headers: Record<string, string>
): Promise<T> =>
  request<T>(url, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(form).toString(),
  });
