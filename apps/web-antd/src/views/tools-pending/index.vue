<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Empty } from 'ant-design-vue';

import { $t } from '#/locales';

const route = useRoute();
const router = useRouter();
const descriptions: Record<string, string> = {
  Education: 'tools.pending.education',
  Engineering: 'tools.pending.engineering',
  Entertainment: 'tools.pending.entertainment',
  Finance: 'tools.pending.finance',
};
const title = computed(() =>
  $t(String(route.meta.title ?? 'tools.pending.title')),
);
const description = computed(() =>
  $t(descriptions[String(route.name)] ?? 'tools.pending.description'),
);
</script>

<template>
  <Page :title="title">
    <Card>
      <Empty class="my-12" :description="description">
        <Button type="primary" @click="router.push('/life-tools/mortgage')">
          {{ $t('tools.pending.go') }}
        </Button>
      </Empty>
    </Card>
  </Page>
</template>
