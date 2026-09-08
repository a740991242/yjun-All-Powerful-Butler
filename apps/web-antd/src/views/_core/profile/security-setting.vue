<script setup lang="ts">
import { computed } from 'vue';

import { ProfileSecuritySetting } from '@vben/common-ui';

import { $t } from '#/locales';

const formSchema = computed(() => {
  return [
    {
      value: true,
      fieldName: 'accountPassword',
      label: $t('tools.profile.accountPassword'),
      description: $t('tools.profile.strength'),
    },
    {
      value: true,
      fieldName: 'securityPhone',
      label: $t('tools.profile.phone'),
      description: $t('tools.profile.phoneStatus'),
    },
    {
      value: true,
      fieldName: 'securityQuestion',
      label: $t('tools.profile.question'),
      description: $t('tools.profile.questionStatus'),
    },
    {
      value: true,
      fieldName: 'securityEmail',
      label: $t('tools.profile.email'),
      description: $t('tools.profile.emailStatus'),
    },
    {
      value: false,
      fieldName: 'securityMfa',
      label: $t('tools.profile.mfa'),
      description: $t('tools.profile.mfaStatus'),
    },
  ];
});
</script>
<template>
  <ProfileSecuritySetting :form-schema="formSchema" />
</template>
