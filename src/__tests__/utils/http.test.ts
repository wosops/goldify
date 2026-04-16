import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  HttpError,
  isHttpError,
  httpGet,
  httpPost,
  httpPut,
  httpPutBinary,
  httpPostForm,
} from '../../js/utils/http';
import * as goldifySoloFixtures from '../../__fixtures__/GoldifySoloFixtures';

const token = goldifySoloFixtures.getTokensTestData();

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('http wrapper', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('httpGet', () => {
    test('returns parsed JSON and sends bearer auth', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'abc' }));

      const result = await httpGet<{ id: string }>('https://api.example/v1/thing', token);

      expect(result).toEqual({ id: 'abc' });
      expect(fetchMock).toHaveBeenCalledWith('https://api.example/v1/thing', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
    });

    test('throws HttpError with status and JSON body on non-ok response', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ error: { message: 'nope' } }, 401));

      await expect(httpGet('https://api.example/v1/thing', token)).rejects.toMatchObject({
        status: 401,
        body: { error: { message: 'nope' } },
      });
    });

    test('HttpError falls back to text body when response is not JSON', async () => {
      fetchMock.mockResolvedValueOnce(new Response('Gateway Timeout', { status: 504 }));

      try {
        await httpGet('https://api.example/v1/thing', token);
        throw new Error('expected httpGet to throw');
      } catch (err) {
        expect(isHttpError(err)).toBe(true);
        if (isHttpError(err)) {
          expect(err.status).toBe(504);
          expect(err.body).toBe('Gateway Timeout');
        }
      }
    });

    test('returns undefined for 204 No Content', async () => {
      fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

      const result = await httpGet('https://api.example/v1/thing', token);
      expect(result).toBeUndefined();
    });
  });

  describe('httpPost', () => {
    test('serializes body as JSON and sets Content-Type', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

      await httpPost('https://api.example/v1/thing', { name: 'x' }, token);

      expect(fetchMock).toHaveBeenCalledWith('https://api.example/v1/thing', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'x' }),
      });
    });
  });

  describe('httpPut', () => {
    test('serializes body as JSON and sets Content-Type', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ snapshot_id: 'snap' }));

      const result = await httpPut<{ snapshot_id: string }>(
        'https://api.example/v1/tracks',
        { uris: ['spotify:track:1'] },
        token
      );

      expect(result).toEqual({ snapshot_id: 'snap' });
      expect(fetchMock).toHaveBeenCalledWith('https://api.example/v1/tracks', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: ['spotify:track:1'] }),
      });
    });
  });

  describe('httpPutBinary', () => {
    test('returns the raw Response on success', async () => {
      const response = new Response(null, { status: 202 });
      fetchMock.mockResolvedValueOnce(response);

      const result = await httpPutBinary(
        'https://api.example/v1/images',
        'BASE64DATA',
        'image/jpeg',
        token
      );

      expect(result).toBe(response);
      expect(fetchMock).toHaveBeenCalledWith('https://api.example/v1/images', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'image/jpeg',
        },
        body: 'BASE64DATA',
      });
    });

    test('throws HttpError on non-ok response', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'bad image' }, 400));

      await expect(
        httpPutBinary('https://api.example/v1/images', 'BASE64DATA', 'image/jpeg', token)
      ).rejects.toBeInstanceOf(HttpError);
    });
  });

  describe('httpPostForm', () => {
    test('sends URL-encoded body with caller-supplied headers', async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse({ access_token: 'NEW_TOKEN' }));

      const result = await httpPostForm<{ access_token: string }>(
        'https://accounts.example/api/token',
        { code: 'AUTH', grant_type: 'authorization_code' },
        { Authorization: 'Basic Zm9vOmJhcg==' }
      );

      expect(result).toEqual({ access_token: 'NEW_TOKEN' });
      expect(fetchMock).toHaveBeenCalledWith('https://accounts.example/api/token', {
        method: 'POST',
        headers: {
          Authorization: 'Basic Zm9vOmJhcg==',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'code=AUTH&grant_type=authorization_code',
      });
    });
  });

  describe('isHttpError', () => {
    test('distinguishes HttpError from other errors', () => {
      expect(isHttpError(new HttpError(500, 'boom'))).toBe(true);
      expect(isHttpError(new Error('nope'))).toBe(false);
      expect(isHttpError('string')).toBe(false);
      expect(isHttpError(null)).toBe(false);
    });
  });
});
