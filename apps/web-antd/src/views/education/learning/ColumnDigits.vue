<script setup lang="ts">
import type { ColumnDigitsRule } from './column-digits';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

const props = defineProps<{ visual: ColumnDigitsRule }>();
const rows = computed(() => {
  let index = 0;
  return [props.visual.left, props.visual.right, props.visual.result].map(
    (digits, row) => ({
      key: row,
      label: $t(`educationLearning.columnDigitRow${row + 1}`),
      sign: row === 1 ? props.visual.operator : '',
      cells: digits.map((n) =>
        n === null ? String.fromCodePoint(65 + index++) : String(n),
      ),
    }),
  );
});
const columns = computed(() => [
  {
    key: 'row',
    dataIndex: 'label',
    title: $t('educationLearning.columnDigitRow'),
    width: 90,
  },
  { key: 'tens', title: $t('educationLearning.columnDigitTens'), width: 70 },
  { key: 'ones', title: $t('educationLearning.columnDigitOnes'), width: 70 },
]);
</script>

<template>
  <div class="space-y-3">
    <p class="block break-words text-xl leading-8">
      {{ $t('educationLearning.columnDigitNotice') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      :pagination="false"
      :scroll="{ x: 230 }"
      bordered
      size="small"
    >
      <template #headerCell="{ column }">
        <span class="block break-words text-center text-xl leading-8">
          {{ column.title }}
        </span>
      </template>
      <template #bodyCell="{ column, record }">
        <span
          v-if="column.key === 'row'"
          class="block break-words text-xl leading-8"
        >
          {{ record.sign }} {{ record.label }}
        </span>
        <span v-else class="block text-center font-mono text-2xl leading-8">
          {{ record.cells[column.key === 'tens' ? 0 : 1] }}
        </span>
      </template>
    </Table>
  </div>
</template>
