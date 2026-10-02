<script setup lang="ts">
import type { ArithmeticGridVisual } from './types';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { arithmeticAxes, arithmeticCell } from './arithmetic-grid';
const props = defineProps<{ visual: ArithmeticGridVisual }>();
const axes = computed(() => arithmeticAxes(props.visual.mode));
const columns = computed(() => [
  {
    title: $t(`educationLearning.arithmeticAxis_${props.visual.mode}`),
    key: 'axis',
    dataIndex: 'axis',
    width: 72,
    fixed: 'left' as const,
  },
  ...axes.value.columns.map((n, i) => ({
    title: String(n),
    key: String(i),
    dataIndex: String(i),
    width: 72,
    align: 'center' as const,
  })),
]);
const rows = computed(() =>
  axes.value.rows.map((n, r) => ({
    id: r,
    axis: n,
    ...Object.fromEntries(
      axes.value.columns.map((_n, c) => {
        const cell = arithmeticCell(props.visual.mode, r, c);
        const blank = props.visual.hidden.findIndex(
          ([row, col]) => row === r && col === c,
        );
        return [
          String(c),
          {
            label: (() => {
              if (cell === null)
                return $t('educationLearning.arithmeticOutside');
              return (() => {
                if (blank === -1)
                  return props.visual.mode === 'sum-grid'
                    ? String(cell.value)
                    : cell.expression;
                return $t('educationLearning.towerBlank', {
                  letter: String.fromCodePoint(65 + blank),
                });
              })();
            })(),
            marked:
              blank === -1 &&
              cell !== null &&
              (props.visual.marked?.includes(cell.value) ?? false),
          },
        ];
      }),
    ),
  })),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" :data-arithmetic-grid="visual.mode">
    <p class="text-sm text-muted-foreground">
      {{ $t(`educationLearning.arithmeticInstruction_${visual.mode}`) }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.arithmeticScrollHint') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 72 + axes.columns.length * 72 }"
      bordered
      size="small"
      :aria-label="$t('educationLearning.arithmeticGridLabel')"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.key === 'axis'">{{ text }}</template>
        <span
          v-else
          :class="text.marked ? 'font-semibold text-primary' : undefined"
        >
          {{ text.label }}
          <template v-if="text.marked">
            <span aria-hidden="true">●</span>
            <span class="sr-only">
              {{ $t('educationLearning.arithmeticMarked') }}
            </span>
          </template>
        </span>
      </template>
    </Table>
    <p v-if="visual.marked?.length" class="text-sm text-muted-foreground">
      {{
        $t('educationLearning.arithmeticMarkNotice', {
          values: visual.marked.join('、'),
        })
      }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.arithmeticNotice') }}
    </p>
  </div>
</template>
