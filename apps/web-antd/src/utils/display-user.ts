import { $t } from '#/locales';
import { publicAsset } from '#/utils/public-asset';

// Only replace the bundled demo profile's presentation; keep login identifiers intact.
export function displayUserName(realName?: string) {
  return realName === 'Vben' ? $t('tools.profile.admin') : (realName ?? '');
}

export function displayUserAvatar(avatar?: string) {
  return !avatar || avatar.includes('@vbenjs/static-source')
    ? publicAsset('brand/avatar.svg')
    : avatar;
}
