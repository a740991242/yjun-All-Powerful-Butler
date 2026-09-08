// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

import worker from './index.mjs';

const env = {
  ADMIN_USERNAME: 'test-owner',
  ADMIN_PASSWORD: 'test-password',
  SESSION_SECRET: 'test-only-signing-secret',
  ASSETS: { fetch: () => new Response('asset') },
};

function call(
  path,
  { body, headers = {}, method = 'GET' } = {},
  bindings = env,
) {
  return worker.fetch(
    new Request(`https://butler.example${path}`, {
      method,
      headers,
      ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
    }),
    bindings,
  );
}

async function login() {
  const response = await call('/api/auth/login', {
    method: 'POST',
    body: { username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD },
  });
  const data = await response.json();
  return {
    response,
    token: data.data.accessToken,
    headers: {
      Authorization: `Bearer ${data.data.accessToken}`,
      Cookie: response.headers.get('Set-Cookie').split(';')[0],
    },
  };
}

afterEach(() => vi.restoreAllMocks());

describe('production authentication', () => {
  it('accepts configured credentials and returns the owner without credentials', async () => {
    const { response, headers, token } = await login();
    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toContain(
      'HttpOnly; Secure; SameSite=Strict',
    );
    expect(token).not.toContain(env.ADMIN_PASSWORD);
    const info = await call('/api/user/info', { headers });
    expect(info.status).toBe(200);
    const profile = await info.json();
    expect(profile.data).toMatchObject({
      username: env.ADMIN_USERNAME,
      roles: ['super'],
    });
  });

  it.each(['vben', 'admin', 'jack'])(
    'rejects legacy account %s',
    async (username) => {
      const response = await call('/api/auth/login', {
        method: 'POST',
        body: { username, password: '123456' },
      });
      expect(response.status).toBe(403);
    },
  );

  it('rejects an incorrect password and malformed login payloads', async () => {
    const wrong = await call('/api/auth/login', {
      method: 'POST',
      body: { username: env.ADMIN_USERNAME, password: 'incorrect' },
    });
    const malformed = await call('/api/auth/login', {
      method: 'POST',
      body: null,
    });
    expect(wrong.status).toBe(403);
    expect(malformed.status).toBe(400);
  });

  it('rejects cross-origin login requests', async () => {
    const response = await call('/api/auth/login', {
      method: 'POST',
      headers: { Origin: 'https://other.example' },
      body: { username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD },
    });
    expect(response.status).toBe(403);
  });

  it('requires both a signed session and an untampered access token', async () => {
    const { headers } = await login();
    const unauthenticated = await call('/api/user/info');
    const noCookie = await call('/api/user/info', {
      headers: { Authorization: headers.Authorization },
    });
    const tampered = await call('/api/user/info', {
      headers: { ...headers, Authorization: `${headers.Authorization}x` },
    });
    expect(unauthenticated.status).toBe(401);
    expect(noCookie.status).toBe(401);
    expect(tampered.status).toBe(401);
  });

  it('refreshes expired access tokens while rejecting expired sessions', async () => {
    const { headers } = await login();
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now + 16 * 60 * 1000);
    const expired = await call('/api/user/info', { headers });
    const refreshed = await call('/api/auth/refresh', {
      method: 'POST',
      headers,
    });
    expect(expired.status).toBe(401);
    expect(refreshed.status).toBe(200);
    const newToken = await refreshed.json();
    const info = await call('/api/user/info', {
      headers: { ...headers, Authorization: `Bearer ${newToken}` },
    });
    expect(info.status).toBe(200);
    vi.spyOn(Date, 'now').mockReturnValue(now + 8 * 24 * 60 * 60 * 1000);
    const expiredSession = await call('/api/auth/refresh', {
      method: 'POST',
      headers,
    });
    expect(expiredSession.status).toBe(401);
  });

  it('clears the browser session on logout', async () => {
    const { headers } = await login();
    const response = await call('/api/auth/logout', {
      method: 'POST',
      headers,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
  });

  it('fails closed without server credentials and still serves static assets', async () => {
    const response = await call('/api/user/info', {}, {});
    const asset = await call('/');
    expect(response.status).toBe(503);
    expect(await asset.text()).toBe('asset');
  });
});
