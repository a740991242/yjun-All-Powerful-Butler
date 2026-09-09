import type { UserInfo } from '@vben/types';

import { publicAsset } from '../utils/public-asset';

// Browser-only demo login. This controls navigation, not access to private data.
const LOCAL_ACCESS_TOKEN = 'butler-browser-session-v1';
export const LOCAL_USERNAME = 'yj88888888';
const LOCAL_PASSWORD = 'yyds123456';

export class LocalAuthError extends Error {}

export function authenticateLocally(username?: string, password?: string) {
  if (username !== LOCAL_USERNAME || password !== LOCAL_PASSWORD) {
    throw new LocalAuthError('tools.auth.invalidCredentials');
  }
  return { accessToken: LOCAL_ACCESS_TOKEN };
}

export function isLocalAccessToken(token: null | string | undefined) {
  return token === LOCAL_ACCESS_TOKEN;
}

export function localUserInfo(): UserInfo {
  return {
    avatar: publicAsset('brand/avatar.svg'),
    desc: '',
    homePath: '/life-tools/mortgage',
    realName: LOCAL_USERNAME,
    roles: ['super'],
    token: LOCAL_ACCESS_TOKEN,
    userId: '0',
    username: LOCAL_USERNAME,
  };
}
