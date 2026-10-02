<script setup lang="ts">
import type { MagicGridVisual } from './types';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';
const props = defineProps<{ visual: MagicGridVisual }>();
const columns = computed(() =>
  [1, 2, 3].map((column) => ({
    title: $t('educationLearning.magicColumn', { number: column }),
    key: String(column),
    dataIndex: String(column),
    width: 72,
    align: 'center' as const,
  })),
);
const rows = computed(() => {
  let blank = 0;
  return props.visual.cells.map((cells, row) => ({
    id: row,
    label: $t('educationLearning.magicRow', { number: row + 1 }),
    ...Object.fromEntries(
      cells.map((value, column) => [
        String(column + 1),
        value === null
          ? $t('educationLearning.towerBlank', {
              letter: String.fromCodePoint(65 + blank++),
            })
          : value,
      ]),
    ),
  }));
});
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.magicInstruction') }}
    </p>
    <div class="mx-auto w-full max-w-xs">
      <Table
        :columns="columns"
        :data-source="rows"
        row-key="id"
        :pagination="false"
        :scroll="{ x: 216 }"
        bordered
        size="small"
        :aria-label="$t('educationLearning.magicLabel')"
      >
        <template #bodyCell="{ column, record, text }">
          <span class="sr-only">
            {{ record.label }},
            {{ $t('educationLearning.magicColumn', { number: column.key }) }}:
          </span>
          {{ text }}
        </template>
      </Table>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.magicNotice') }}
    </p>
  </div>
</template>
