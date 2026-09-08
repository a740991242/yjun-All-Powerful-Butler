<script setup lang="ts">
import { computed } from 'vue';

import { ProfileNotificationSetting } from '@vben/common-ui';

import { $t } from '#/locales';

const formSchema = computed(() => {
  return [
    {
      value: true,
      fieldName: 'accountPassword',
      label: $t('tools.profile.accountPassword'),
      description: $t('tools.profile.userNotice'),
    },
    {
      value: true,
      fieldName: 'systemMessage',
      label: $t('tools.profile.system'),
      description: $t('tools.profile.systemNotice'),
    },
    {
      value: true,
      fieldName: 'todoTask',
      label: $t('tools.profile.tasks'),
      description: $t('tools.profile.taskNotice'),
    },
  ];
});
</script>
<template>
  <ProfileNotificationSetting :form-schema="formSchema" />
</template>
