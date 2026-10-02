<script setup lang="ts">
import type { StockTableVisual } from './stock-table';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { stockRows } from './stock-table';
const props = defineProps<{ visual: StockTableVisual }>();
const columns = computed(() => [
  { key: 'item', title: $t('educationLearning.stockItem'), width: 144 },
  {
    key: 'initial',
    dataIndex: 'initial',
    title: $t('educationLearning.stockInitial'),
    width: 80,
  },
  {
    key: 'sold',
    dataIndex: 'sold',
    title: $t('educationLearning.stockSold'),
    width: 80,
  },
  {
    key: 'remaining',
    title: $t('educationLearning.stockRemaining'),
    width: 100,
  },
]);
const rows = computed(() => stockRows(props.visual));
</script>
<template>
  <div
    class="min-w-0 space-y-3"
    role="region"
    :aria-label="$t('educationLearning.stockTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.stockTitle') }}</p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.stockNotice') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 404 }"
      size="small"
      bordered
    >
      <template #bodyCell="{ column, record, text }">
        <span v-if="column.key === 'item'" class="flex min-h-11 items-center">
          {{ record.id }} ·
          {{ $t(`educationLearning.stock_${record.item}`) }}（{{
            $t(`educationLearning.stock_${record.unit}`)
          }}）
        </span>
        <span
          v-else-if="column.key === 'remaining'"
          class="flex min-h-11 items-center justify-center"
          :aria-label="
            $t('educationLearning.stockBlankNotice', { letter: record.id })
          "
        >
          {{ $t('educationLearning.towerBlank', { letter: record.id }) }}
        </span>
        <span
          v-else
          class="flex min-h-11 items-center justify-center text-base"
          :aria-label="
            $t('educationLearning.stockCell', {
              letter: record.id,
              column: column.title,
              value: text,
              unit: $t(`educationLearning.stock_${record.unit}`),
            })
          "
        >
          {{ text }}
        </span>
      </template>
    </Table>
  </div>
</template>
