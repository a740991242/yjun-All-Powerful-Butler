import { describe, expect, it } from 'vitest';

import {
  authenticateLocally,
  isLocalAccessToken,
  LocalAuthError,
  localUserInfo,
} from './local-auth';

describe('browser-only login', () => {
  it('accepts the configured account and restores its local profile', () => {
    const { accessToken } = authenticateLocally('yj88888888', 'yyds123456');
    expect(isLocalAccessToken(accessToken)).toBe(true);
    expect(localUserInfo()).toMatchObject({
      homePath: '/life-tools/mortgage',
      roles: ['super'],
      token: accessToken,
      username: 'yj88888888',
    });
  });

  it.each([
    ['vben', '123456'],
    ['admin', '123456'],
    ['jack', '123456'],
    ['yj88888888', 'wrong'],
    ['', ''],
    [undefined, undefined],
  ])('rejects invalid credentials for %s', (username, password) => {
    expect(() => authenticateLocally(username, password)).toThrow(
      LocalAuthError,
    );
  });

  it.each([null, undefined, '', 'retired-server-token'])(
    'rejects stale session %s',
    (token) => {
      expect(isLocalAccessToken(token)).toBe(false);
    },
  );
});
