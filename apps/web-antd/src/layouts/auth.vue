<script lang="ts" setup>
import { computed } from 'vue';

import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';

import { $t } from '#/locales';
import { publicAsset } from '#/utils/public-asset';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
const logoDark = computed(() => preferences.logo.sourceDark);
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logo"
    :logo-dark="logoDark"
    :slogan-image="publicAsset('brand/logo.svg')"
    :page-description="$t('tools.brand.description')"
    :page-title="$t('tools.brand.slogan')"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
