<script setup lang="ts">
import { computed, ref } from 'vue';

import { Profile } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { $t } from '#/locales';
import { displayUserAvatar, displayUserName } from '#/utils/display-user';

import ProfileBase from './base-setting.vue';
import ProfileNotificationSetting from './notification-setting.vue';
import ProfilePasswordSetting from './password-setting.vue';
import ProfileSecuritySetting from './security-setting.vue';

const userStore = useUserStore();

const displayInfo = computed(() =>
  userStore.userInfo
    ? {
        ...userStore.userInfo,
        realName: displayUserName(userStore.userInfo.realName),
        avatar: displayUserAvatar(userStore.userInfo.avatar),
      }
    : userStore.userInfo,
);

const tabsValue = ref<string>('basic');

const tabs = computed(() => [
  {
    label: $t('tools.profile.basic'),
    value: 'basic',
  },
  {
    label: $t('tools.profile.security'),
    value: 'security',
  },
  {
    label: $t('tools.profile.password'),
    value: 'password',
  },
  {
    label: $t('tools.profile.notice'),
    value: 'notice',
  },
]);
</script>
<template>
  <Profile
    v-model:model-value="tabsValue"
    :title="$t('tools.profile.title')"
    :user-info="displayInfo"
    :tabs="tabs"
  >
    <template #content>
      <ProfileBase v-if="tabsValue === 'basic'" />
      <ProfileSecuritySetting v-if="tabsValue === 'security'" />
      <ProfilePasswordSetting v-if="tabsValue === 'password'" />
      <ProfileNotificationSetting v-if="tabsValue === 'notice'" />
    </template>
  </Profile>
</template>
