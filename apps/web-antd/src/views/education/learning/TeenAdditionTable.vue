<script setup lang="ts">
import type { TableColumnsType } from 'ant-design-vue';

import type {
  TeenAdditionRow,
  TeenAdditionTableVisual,
} from './teen-addition-table';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { teenAdditionRows } from './teen-addition-table';
const props = defineProps<{ visual: TeenAdditionTableVisual }>();
const rows = computed(() => teenAdditionRows(props.visual));
const columns = computed<TableColumnsType<TeenAdditionRow>>(() => [
  { title: $t('educationLearning.teenAdditionTotal'), key: 'total', width: 88 },
  ...Array.from({ length: 8 }, (_, i) => ({
    title: $t('educationLearning.teenAdditionPosition', { position: i + 1 }),
    key: `c${i + 1}`,
    width: 104,
  })),
]);
function cell(value: unknown, key: unknown) {
  const row =
    value && typeof value === 'object' && 'total' in value
      ? rows.value.find((item) => item.total === value.total)
      : undefined;
  const index = Number(String(key).slice(1)) - 1;
  return Number.isInteger(index) && index >= 0 && index < 8
    ? row?.cells[index]
    : undefined;
}
function text(row: unknown, key: unknown) {
  const item = cell(row, key);
  return item ? item.label || `${item.left}+${item.right}` : '—';
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-teen-addition-table>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.teenAdditionNotice') }}
    </p>
    <p
      v-if="visual.variant === 'review'"
      class="text-sm leading-6 text-muted-foreground"
    >
      {{ $t('educationLearning.teenAdditionReview') }}
    </p>
    <div
      class="overflow-x-auto pb-2"
      tabindex="0"
      :aria-label="$t('educationLearning.teenAdditionScroll')"
      data-teen-addition-scroll
    >
      <Table
        :columns="columns"
        :data-source="rows"
        row-key="total"
        :pagination="false"
        bordered
        size="small"
        class="teen-addition-table min-w-[920px]"
      >
        <template #bodyCell="{ column, record }">
          <span
            v-if="column.key === 'total'"
            class="font-semibold"
            :data-teen-addition-row="record.total"
          >
            {{ record.total }}
          </span>
          <span
            v-else
            :data-teen-addition-blank="
              cell(record, column.key)?.label || undefined
            "
            :data-teen-addition-given="
              cell(record, column.key)?.label === null ? '' : undefined
            "
          >
            {{ text(record, column.key) }}
          </span>
        </template>
      </Table>
    </div>
  </div>
</template>
<style scoped>
.teen-addition-table :deep(.ant-table-cell) {
  padding: 12px;
  font-size: 20px;
  line-height: 1.4;
  white-space: nowrap;
}
</style>
