<script setup lang="ts">
import type { QuantityTableVisual } from './types';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

const props = defineProps<{ visual: QuantityTableVisual }>();
const columns = computed(() => [
  {
    title: $t('educationLearning.quantityTableItem'),
    dataIndex: 'label',
    key: 'label',
    width: 100,
  },
  ...props.visual.columns.map((title, i) => ({
    title,
    dataIndex: String(i),
    key: String(i),
    width: 90,
    align: 'center' as const,
  })),
]);
const rows = computed(() =>
  props.visual.values.map((values, i) => ({
    id: i,
    label:
      i < 2
        ? props.visual.parts[i]
        : $t('educationLearning.quantityTableTotal'),
    ...Object.fromEntries(
      values.map((value, c) => [
        String(c),
        value === null ? $t('educationLearning.quantityTableBlank') : value,
      ]),
    ),
  })),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.quantityTableInstruction') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 100 + visual.columns.length * 90 }"
      bordered
      size="middle"
      :aria-label="$t('educationLearning.quantityTableLabel')"
    />
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.quantityTableNotice') }}
    </p>
  </div>
</template>
