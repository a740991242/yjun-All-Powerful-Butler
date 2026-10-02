<script setup lang="ts">
import type { ZeroNumberChartVisual } from './zero-number-chart';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { zeroNumberPosition, zeroNumberRows } from './zero-number-chart';
const props = defineProps<{ visual: ZeroNumberChartVisual }>();
const columns = Array.from({ length: 10 }, (_, column) => ({
  key: `c${column}`,
  dataIndex: `c${column}`,
  width: 56,
}));
const rows = zeroNumberRows();
function label(value: number) {
  const p = zeroNumberPosition(value);
  return $t('educationLearning.zeroChartCell', {
    value,
    row: p.row,
    column: p.column,
  });
}
</script>
<template>
  <div
    class="flex min-w-0 flex-col gap-3"
    role="region"
    :aria-label="$t('educationLearning.zeroChartLabel')"
  >
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.zeroChartNotice') }}
    </p>
    <p class="font-medium">
      {{
        $t('educationLearning.zeroChartFocus', { value: props.visual.value })
      }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :show-header="false"
      :scroll="{ x: 560 }"
      size="small"
      bordered
    >
      <template #bodyCell="{ text }">
        <span
          v-if="typeof text === 'number'"
          class="flex min-h-11 min-w-11 items-center justify-center rounded border border-transparent text-base"
          :class="
            text === props.visual.value
              ? 'border-primary bg-primary/10 font-semibold text-primary'
              : ''
          "
          :aria-label="label(text)"
          :aria-current="text === props.visual.value ? 'true' : undefined"
        >
          {{ text }}
        </span>
      </template>
    </Table>
  </div>
</template>
