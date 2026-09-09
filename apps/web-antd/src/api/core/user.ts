import { localUserInfo } from '../local-auth';

export async function getUserInfoApi() {
  return localUserInfo();
}
