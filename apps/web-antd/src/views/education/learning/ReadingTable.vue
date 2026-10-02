<script setup lang="ts">
import type { ReadingTableVisual } from './types';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';
const props = defineProps<{ visual: ReadingTableVisual }>();
const columns = computed(() => [
  {
    title: $t('educationLearning.readingTablePerson'),
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  ...props.visual.days.map((title, i) => ({
    title,
    dataIndex: String(i),
    key: String(i),
    width: 90,
    align: 'center' as const,
  })),
]);
const rows = computed(() =>
  props.visual.pages.map((values, i) => ({
    id: i,
    name: props.visual.names[i],
    ...Object.fromEntries(values.map((value, c) => [String(c), value])),
  })),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.readingTableInstruction') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 370 }"
      bordered
      size="middle"
      :aria-label="$t('educationLearning.readingTableLabel')"
    />
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.readingTableNotice') }}
    </p>
  </div>
</template>
