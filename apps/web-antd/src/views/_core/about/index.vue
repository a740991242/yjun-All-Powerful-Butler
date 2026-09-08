<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Card, TypographyParagraph } from 'ant-design-vue';

import { $t } from '#/locales';

defineOptions({ name: 'About' });
</script>

<template>
  <Page :title="$t('tools.brand.name')">
    <Card>
      <img
        src="/brand/logo.svg"
        :alt="$t('tools.brand.name')"
        class="mb-4 size-16"
      />
      <TypographyParagraph>{{ $t('tools.brand.slogan') }}</TypographyParagraph>
      <TypographyParagraph>
        {{ $t('tools.brand.description') }}
      </TypographyParagraph>
    </Card>
  </Page>
</template>
