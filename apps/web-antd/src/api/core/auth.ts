import { message } from 'ant-design-vue';

import { $t } from '#/locales';

import { authenticateLocally, localUserInfo } from '../local-auth';

export namespace AuthApi {
  export interface LoginParams {
    password?: string;
    username?: string;
  }
  export interface LoginResult {
    accessToken: string;
  }
  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

export async function loginApi(data: AuthApi.LoginParams) {
  try {
    return authenticateLocally(data.username, data.password);
  } catch (error) {
    message.error($t('tools.auth.invalidCredentials'));
    throw error;
  }
}

export async function refreshTokenApi(): Promise<AuthApi.RefreshTokenResult> {
  return { data: localUserInfo().token, status: 200 };
}

// The auth store clears its persisted login state and returns to the login page.
export async function logoutApi() {
  return null;
}

export async function getAccessCodesApi() {
  return ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'];
}
