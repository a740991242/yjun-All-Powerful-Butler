<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed } from 'vue';

import { ProfilePasswordSetting, z } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { $t } from '#/locales';

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'oldPassword',
      label: $t('tools.profile.oldPassword'),
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('tools.profile.oldPasswordHint'),
      },
    },
    {
      fieldName: 'newPassword',
      label: $t('tools.profile.newPassword'),
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('tools.profile.newPasswordHint'),
      },
    },
    {
      fieldName: 'confirmPassword',
      label: $t('tools.profile.confirmPassword'),
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('tools.profile.confirmHint'),
      },
      dependencies: {
        rules(values) {
          const { newPassword } = values;
          return z
            .string({ error: $t('tools.profile.confirmHint') })
            .min(1, { message: $t('tools.profile.confirmHint') })
            .refine((value) => value === newPassword, {
              message: $t('tools.profile.mismatch'),
            });
        },
        triggerFields: ['newPassword'],
      },
    },
  ];
});

function handleSubmit() {
  message.success($t('tools.profile.passwordSuccess'));
}
</script>
<template>
  <ProfilePasswordSetting
    class="w-1/3"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
