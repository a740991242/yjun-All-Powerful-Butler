<script setup lang="ts">
import type { BnuFillGridVisual } from './bnu-fill-grid';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { bnuFillGrid } from './bnu-fill-grid';

const props = defineProps<{ visual: BnuFillGridVisual }>();
const grid = computed(() => bnuFillGrid(props.visual));
const cellStyle = () => ({
  style: {
    fontSize: '20px',
    lineHeight: '28px',
    height: '56px',
    padding: '12px',
    whiteSpace: 'nowrap',
  },
});
const columns = computed(() =>
  Array.from({ length: grid.value.size }, (_, i) => ({
    key: String(i),
    dataIndex: String(i),
    title: $t('educationLearning.bnuFillColumn', { n: i + 1 }),
    width: 120,
    align: 'center' as const,
    customCell: cellStyle,
    customHeaderCell: cellStyle,
  })),
);
const rows = computed(() =>
  grid.value.givens.map((row, r) => ({
    id: String(r),
    ...Object.fromEntries(
      row.map((n, c) => [String(c), n ?? grid.value.labels[r]?.[c]]),
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
  const n = event.currentTarget;
  if (
    !(n instanceof HTMLElement) ||
    !['ArrowLeft', 'ArrowRight'].includes(event.key)
  )
    return;
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  if (
    n.scrollWidth <= n.clientWidth ||
    (direction > 0
      ? n.scrollLeft + n.clientWidth >= n.scrollWidth
      : n.scrollLeft <= 0)
  )
    return;
  event.preventDefault();
  event.stopPropagation();
  n.scrollBy({ left: direction * 120, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-fill-grid
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuFill_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.bnuFillLegend', { n: grid.size }) }}
    </p>
    <div
      data-bnu-fill-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuFillScroll')"
      @keydown="scrollWithKeyboard"
      class="overflow-x-auto scroll-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Table
        :style="{ width: `${grid.size * 120}px` }"
        :columns="columns"
        :data-source="rows"
        row-key="id"
        :pagination="false"
        bordered
        size="middle"
      >
        <template #bodyCell="{ record, column, text }">
          <span :data-bnu-fill-cell="`${record.id}-${column.key}`">
            {{ text }}
          </span>
        </template>
      </Table>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuFillScroll') }}
    </p>
    <p class="mb-0 mt-3 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuFillNotice') }}
    </p>
  </figure>
</template>
