<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Space } from 'ant-design-vue';

import { $t } from '#/locales';

const router = useRouter();
</script>

<template>
  <Page
    :title="$t('tools.brand.name')"
    :description="$t('tools.brand.description')"
  >
    <Card :title="$t('tools.menu.life')">
      <Space wrap>
        <Button type="primary" @click="router.push('/life-tools/mortgage')">
          {{ $t('tools.menu.mortgage') }}
        </Button>
        <Button @click="router.push('/life-tools/income-tax')">
          {{ $t('tools.menu.tax') }}
        </Button>
        <Button @click="router.push('/entertainment/magic-bottles')">
          {{ $t('tools.menu.game') }}
        </Button>
      </Space>
    </Card>
  </Page>
</template>
