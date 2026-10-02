<script setup lang="ts">
import type { SmallArithmeticVisual } from './small-arithmetic';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { smallArithmeticCell } from './small-arithmetic';

const props = defineProps<{ visual: SmallArithmeticVisual }>();
const columns = computed(() => [
  {
    title: props.visual.operation === 'add' ? '+' : '−',
    key: 'axis',
    dataIndex: 'axis',
    width: 72,
    fixed: 'left' as const,
  },
  ...props.visual.columns.map((n, i) => ({
    title: String(n),
    key: String(i),
    dataIndex: String(i),
    width: 72,
    align: 'center' as const,
  })),
]);
const rows = computed(() =>
  props.visual.rows.map((n, row) => ({
    id: row,
    axis: n,
    ...Object.fromEntries(
      props.visual.columns.map((_, column) => {
        const blank = props.visual.hidden.findIndex(
          (p) => p[0] === row && p[1] === column,
        );
        return [
          String(column),
          blank === -1
            ? String(smallArithmeticCell(props.visual, row, column))
            : $t('educationLearning.towerBlank', {
                letter: String.fromCodePoint(65 + blank),
              }),
        ];
      }),
    ),
  })),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{
        $t(`educationLearning.smallArithmeticInstruction_${visual.operation}`)
      }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 288 }"
      bordered
      size="small"
      :aria-label="$t('educationLearning.smallArithmeticLabel')"
    />
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.arithmeticScrollHint') }}
    </p>
  </div>
</template>
