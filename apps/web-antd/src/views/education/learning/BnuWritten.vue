<script setup lang="ts">
import type { BnuWrittenVisual } from './bnu-written';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { bnuWrittenPanels } from './bnu-written';
const props = defineProps<{ visual: BnuWrittenVisual }>();
const panels = computed(() => {
  let blank = 0;
  return bnuWrittenPanels(props.visual).map((panel) => ({
    ...panel,
    displayRows: panel.rows.map((digits, row) => ({
      key: row,
      row,
      sign: row === 1 ? panel.operator : '',
      label: $t(`educationLearning.bnuWrittenRow${row}`),
      cells: digits.map((n) => {
        if (panel.kind === 'rods') {
          if (n === null || n < 1 || n > 4)
            throw new Error('educationLearning.invalidRecord');
          return { count: n, label: '', blank: false };
        }
        return {
          count: 0,
          label: n === null ? String.fromCodePoint(65 + blank++) : String(n),
          blank: n === null,
        };
      }),
    })),
  }));
});
const columns = computed(() => [
  {
    key: 'row',
    dataIndex: 'label',
    title: $t('educationLearning.bnuWrittenRow'),
    width: 112,
  },
  { key: 'tens', title: $t('educationLearning.columnDigitTens'), width: 104 },
  { key: 'ones', title: $t('educationLearning.columnDigitOnes'), width: 104 },
]);
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
  const d = event.key === 'ArrowRight' ? 1 : -1;
  if (
    n.scrollWidth <= n.clientWidth ||
    (d > 0 ? n.scrollLeft + n.clientWidth >= n.scrollWidth : n.scrollLeft <= 0)
  )
    return;
  event.preventDefault();
  event.stopPropagation();
  n.scrollBy({ left: d * 160, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-written
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuWritten_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.bnuWrittenLegend') }}
    </p>
    <div
      data-bnu-written-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuWrittenScroll')"
      @keydown="scrollWithKeyboard"
      class="overflow-x-auto scroll-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div
        :class="
          panels.length === 1
            ? 'min-w-[320px]'
            : 'grid min-w-[664px] grid-cols-2 gap-6'
        "
      >
        <section
          v-for="panel in panels"
          :key="panel.id"
          data-bnu-written-panel
          :data-panel="panel.id"
          :data-kind="panel.kind"
          class="w-[320px]"
        >
          <h3 class="m-0 p-3 text-xl font-semibold leading-8">
            {{ $t('educationLearning.bnuWrittenPanel', { id: panel.id }) }}
          </h3>
          <Table
            :columns="columns"
            :data-source="panel.displayRows"
            :pagination="false"
            bordered
            size="small"
            :row-class-name="
              (record) => (record.row === 2 ? 'bnu-written-result' : '')
            "
          >
            <template #headerCell="{ column }">
              <span class="block text-center text-xl leading-8">
                {{ column.title }}
              </span>
            </template>
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'row'" class="block text-xl leading-8">
                {{ record.sign }} {{ record.label }}
              </span>
              <template v-else>
                <svg
                  v-if="panel.kind === 'rods'"
                  data-bnu-written-rods
                  :data-place="column.key"
                  :data-count="
                    record.cells[column.key === 'tens' ? 0 : 1].count
                  "
                  viewBox="0 0 84 88"
                  class="mx-auto h-[88px] w-[84px]"
                  role="img"
                  :aria-label="
                    $t(`educationLearning.bnuWrittenRods_${column.key}`, {
                      count: record.cells[column.key === 'tens' ? 0 : 1].count,
                    })
                  "
                >
                  <line
                    v-for="n in record.cells[column.key === 'tens' ? 0 : 1]
                      .count"
                    :key="n"
                    data-bnu-written-rod
                    :x1="column.key === 'tens' ? 20 : 20 + (n - 1) * 12"
                    :x2="column.key === 'tens' ? 64 : 20 + (n - 1) * 12"
                    :y1="column.key === 'tens' ? 24 + (n - 1) * 12 : 20"
                    :y2="column.key === 'tens' ? 24 + (n - 1) * 12 : 68"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="round"
                  />
                </svg>
                <span
                  v-else
                  data-bnu-written-digit
                  :data-blank="
                    record.cells[column.key === 'tens' ? 0 : 1].blank
                  "
                  :aria-label="
                    record.cells[column.key === 'tens' ? 0 : 1].blank
                      ? $t('educationLearning.bnuWrittenBlank', {
                          letter:
                            record.cells[column.key === 'tens' ? 0 : 1].label,
                        })
                      : undefined
                  "
                  class="block text-center font-mono text-2xl leading-8"
                >
                  {{ record.cells[column.key === 'tens' ? 0 : 1].label }}
                </span>
              </template>
            </template>
          </Table>
        </section>
      </div>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuWrittenScroll') }}
    </p>
    <p class="mb-0 mt-3 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuWrittenNotice') }}
    </p>
  </figure>
</template>
<style scoped>
:deep(.bnu-written-result > td) {
  border-top: 2px solid currentcolor;
}
</style>
