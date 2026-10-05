<script setup lang="ts">
import type { BnuHundredTableVisual } from './bnu-hundred-table';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { bnuHundredTable } from './bnu-hundred-table';

const props = defineProps<{ visual: BnuHundredTableVisual }>();
const table = computed(() => bnuHundredTable(props.visual));
const count = computed(() =>
  ['complete', 'full'].includes(props.visual.scene) ? 10 : 3,
);
const cellStyle = () => ({
  style: {
    fontSize: '20px',
    lineHeight: '28px',
    height: '56px',
    padding: '12px',
    whiteSpace: 'nowrap',
  },
});
const columns = computed(() => [
  {
    key: 'row',
    dataIndex: 'rowLabel',
    title: $t('educationLearning.bnuTablePosition'),
    width: 104,
    customCell: cellStyle,
    customHeaderCell: cellStyle,
  },
  ...Array.from({ length: count.value }, (_, i) => ({
    key: String(i),
    dataIndex: String(i),
    title: String(i + 1),
    width: 76,
    align: 'center' as const,
    customCell: cellStyle,
    customHeaderCell: cellStyle,
  })),
]);
const rows = computed(() =>
  table.value.map((row) => ({
    id: row.row,
    rowLabel: $t('educationLearning.bnuTableRow', { row: row.row }),
    ...Object.fromEntries(
      row.cells.map((cell, i) => [
        String(i),
        cell.value ?? cell.label ?? $t('educationLearning.bnuTableBlank'),
      ]),
    ),
  })),
);
function scrollWithKeyboard(event: KeyboardEvent) {
  if (
    event.target !== event.currentTarget ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  const region = event.currentTarget;
  if (!(region instanceof HTMLElement)) return;
  const offsets: Record<string, [number, number]> = {
    ArrowLeft: [-76, 0],
    ArrowRight: [76, 0],
    ArrowUp: [0, -56],
    ArrowDown: [0, 56],
  };
  const offset = offsets[event.key];
  if (!offset) return;
  const [left, top] = offset;
  const canScroll =
    left === 0
      ? region.scrollHeight > region.clientHeight &&
        (top > 0
          ? region.scrollTop + region.clientHeight < region.scrollHeight
          : region.scrollTop > 0)
      : region.scrollWidth > region.clientWidth &&
        (left > 0
          ? region.scrollLeft + region.clientWidth < region.scrollWidth
          : region.scrollLeft > 0);
  if (!canScroll) return;
  event.preventDefault();
  event.stopPropagation();
  region.scrollBy({ left, top, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-hundred-table
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t('educationLearning.bnuTableTitle') }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.bnuTableLegend') }}
    </p>
    <p v-if="visual.row" class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.bnuTableTarget', { row: visual.row }) }}
    </p>
    <div
      data-bnu-table-scroll
      @keydown="scrollWithKeyboard"
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuTableScroll')"
      class="max-h-[480px] overflow-auto scroll-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Table
        :style="{ width: `${104 + count * 76}px` }"
        :columns="columns"
        :data-source="rows"
        row-key="id"
        :pagination="false"
        bordered
        size="middle"
        :aria-label="$t('educationLearning.bnuTableTitle')"
      >
        <template #bodyCell="{ column, record, text }">
          <span
            v-if="column.key !== 'row'"
            :data-bnu-table-cell="`${record.id}-${column.key}`"
          >
            {{ text }}
          </span>
          <span v-else>{{ text }}</span>
        </template>
      </Table>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuTableScroll') }}
    </p>
    <p class="mt-3 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuTableNotice') }}
    </p>
  </figure>
</template>
