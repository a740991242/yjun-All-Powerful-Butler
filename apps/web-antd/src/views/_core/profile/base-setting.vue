<script setup lang="ts">
import type { BasicOption } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, ref } from 'vue';

import { ProfileBaseSetting } from '@vben/common-ui';

import { getUserInfoApi } from '#/api';
import { $t } from '#/locales';
import { displayUserName } from '#/utils/display-user';

const profileBaseSettingRef = ref();

const roleOptions = computed<BasicOption[]>(() => [
  {
    label: $t('tools.profile.admin'),
    value: 'super',
  },
  {
    label: $t('tools.profile.user'),
    value: 'user',
  },
  {
    label: $t('tools.profile.test'),
    value: 'test',
  },
]);

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'realName',
      component: 'Input',
      label: $t('tools.profile.name'),
    },
    {
      fieldName: 'username',
      component: 'Input',
      label: $t('tools.profile.username'),
    },
    {
      fieldName: 'roles',
      component: 'Select',
      componentProps: {
        mode: 'tags',
        options: roleOptions.value,
      },
      label: $t('tools.profile.role'),
    },
    {
      fieldName: 'introduction',
      component: 'Textarea',
      label: $t('tools.profile.bio'),
    },
  ];
});

onMounted(async () => {
  const data = await getUserInfoApi();
  profileBaseSettingRef.value
    .getFormApi()
    .setValues({ ...data, realName: displayUserName(data.realName) });
});
</script>
<template>
  <ProfileBaseSetting ref="profileBaseSettingRef" :form-schema="formSchema" />
</template>
