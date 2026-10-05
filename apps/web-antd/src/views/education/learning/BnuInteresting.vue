<script setup lang="ts">
import type { BnuInterestingVisual } from './bnu-interesting';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { bnuInterestingRows } from './bnu-interesting';

const props = defineProps<{ visual: BnuInterestingVisual }>();
const rows = computed(() => {
  let blank = 0;
  return bnuInterestingRows(props.visual).map((values, i) => ({
    key: i,
    row: i + 1,
    cells: values.map((value) => ({
      blank: value === null,
      label:
        value === null ? String.fromCodePoint(65 + blank++) : String(value),
    })),
  }));
});
const columns = computed(() => [
  {
    key: 'row',
    dataIndex: 'row',
    title: $t('educationLearning.bnuInterestingRow'),
    width: 64,
  },
  {
    key: 'first',
    title: $t('educationLearning.bnuInterestingFirst'),
    width: 104,
  },
  {
    key: 'second',
    title: $t('educationLearning.bnuInterestingSecond'),
    width: 104,
  },
  {
    key: 'result',
    title: $t('educationLearning.bnuInterestingResult'),
    width: 104,
  },
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
  n.scrollBy({ left: d * 120, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-interesting
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuInteresting_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t(`educationLearning.bnuInteresting_${visual.variant}`) }}
    </p>
    <div
      data-bnu-interesting-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuInterestingScroll')"
      @keydown="scrollWithKeyboard"
      class="overflow-x-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Table
        class="min-w-[376px]"
        :columns="columns"
        :data-source="rows"
        :pagination="false"
        bordered
        size="small"
      >
        <template #headerCell="{ column }">
          <span class="block text-center text-xl leading-8">
            {{ column.title }}
          </span>
        </template>
        <template #bodyCell="{ column, record }">
          <span
            v-if="column.key === 'row'"
            class="block text-center text-xl leading-8"
          >
            {{ record.row }}
          </span>
          <span
            v-else
            data-bnu-interesting-cell
            :data-blank="
              record.cells[
                column.key === 'first' ? 0 : column.key === 'second' ? 1 : 2
              ].blank
            "
            class="block text-center font-mono text-2xl leading-8"
            :aria-label="
              record.cells[
                column.key === 'first' ? 0 : column.key === 'second' ? 1 : 2
              ].blank
                ? $t('educationLearning.bnuWrittenBlank', {
                    letter:
                      record.cells[
                        column.key === 'first'
                          ? 0
                          : column.key === 'second'
                            ? 1
                            : 2
                      ].label,
                  })
                : undefined
            "
          >
            <span data-bnu-interesting-operator aria-hidden="true">
              {{
                column.key === 'second'
                  ? visual.scene === 'subtraction'
                    ? '−'
                    : '+'
                  : column.key === 'result'
                    ? '='
                    : ''
              }}
            </span>
            <span
              v-if="
                record.cells[
                  column.key === 'first' ? 0 : column.key === 'second' ? 1 : 2
                ].blank
              "
              data-bnu-interesting-empty
              aria-hidden="true"
            >
              □
            </span>
            {{
              record.cells[
                column.key === 'first' ? 0 : column.key === 'second' ? 1 : 2
              ].label
            }}
          </span>
        </template>
      </Table>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuInterestingScroll') }}
    </p>
    <p class="mb-0 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuInterestingNotice') }}
    </p>
  </figure>
</template>
