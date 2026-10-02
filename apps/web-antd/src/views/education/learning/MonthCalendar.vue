<script setup lang="ts">
import type { MonthCalendarVisual } from './month-calendar';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { monthCalendarCells } from './month-calendar';
const props = defineProps<{ visual: MonthCalendarVisual }>();
const columns = computed(() =>
  Array.from({ length: 7 }, (_, day) => ({
    key: `d${day}`,
    dataIndex: `d${day}`,
    title: $t(`educationLearning.monthShort_${day}`),
    width: 52,
  })),
);
const rows = computed(() => {
  const cells = monthCalendarCells(props.visual);
  return Array.from({ length: cells.length / 7 }, (_, row) => ({
    id: row,
    ...Object.fromEntries(
      Array.from({ length: 7 }, (_, day) => [`d${day}`, cells[row * 7 + day]]),
    ),
  }));
});
function label(day: number) {
  return $t('educationLearning.monthDate', {
    year: props.visual.year,
    month: props.visual.month,
    day,
    weekday: $t(
      `educationLearning.monthWeek_${new Date(Date.UTC(props.visual.year, props.visual.month - 1, day)).getUTCDay()}`,
    ),
  });
}
</script>
<template>
  <div
    class="min-w-0 space-y-3"
    role="region"
    :aria-label="
      $t('educationLearning.monthTitle', {
        year: visual.year,
        month: visual.month,
      })
    "
  >
    <p class="font-medium">
      {{
        $t('educationLearning.monthTitle', {
          year: visual.year,
          month: visual.month,
        })
      }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.monthNotice') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 364 }"
      size="small"
      bordered
    >
      <template #bodyCell="{ text }">
        <span
          v-if="typeof text === 'number'"
          class="flex min-h-11 items-center justify-center text-base"
          :aria-label="label(text)"
        >
          {{ text }}
        </span>
        <span
          v-else
          class="flex min-h-11 items-center justify-center"
          :aria-label="$t('educationLearning.monthBlank')"
        >
          —
        </span>
      </template>
    </Table>
  </div>
</template>
