<script setup lang="ts">
import type { SemesterGridVisual } from './semester-grid';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { required } from './required';
import { semesterAxes, semesterCell } from './semester-grid';

const props = defineProps<{ visual: SemesterGridVisual }>();
const axes = computed(() => semesterAxes(props.visual.mode));
const columns = computed(() => [
  {
    title: $t('educationLearning.semesterGridAxis'),
    key: 'axis',
    dataIndex: 'axis',
    width: 72,
    fixed: 'left' as const,
  },
  ...axes.value.map((value) => ({
    title: String(value),
    key: String(value),
    dataIndex: String(value),
    width: 88,
    align: 'center' as const,
  })),
]);
const rows = computed(() =>
  axes.value.map((row) => ({
    id: row,
    axis: row,
    ...Object.fromEntries(
      axes.value.map((column) => {
        const cell = required(semesterCell(props.visual.mode, row, column));
        const blank = props.visual.hidden.findIndex(
          ([r, c]) => r === row && c === column,
        );
        const label = (() => {
          if (blank !== -1)
            return $t('educationLearning.towerBlank', {
              letter: String.fromCodePoint(65 + blank),
            });
          if (props.visual.mode === 'numbers') return String(cell.value);
          return cell.expression;
        })();
        return [
          String(column),
          { label, marked: blank === -1 && cell.value === props.visual.marked },
        ];
      }),
    ),
  })),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-semester-grid>
    <p class="text-sm text-muted-foreground">
      {{ $t(`educationLearning.semesterGrid_${visual.mode}`) }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.arithmeticScrollHint') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 72 + axes.length * 88 }"
      bordered
      size="small"
      :aria-label="$t('educationLearning.semesterGridLabel')"
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
    <p v-if="visual.marked !== undefined" class="text-sm text-muted-foreground">
      {{ $t('educationLearning.semesterGridMark', { value: visual.marked }) }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.semesterGridNotice') }}
    </p>
  </div>
</template>
