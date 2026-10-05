<script setup lang="ts">
import type { BnuCalculationReviewVisual } from './bnu-calculation-review';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { ballPrices, basketExpressions } from './bnu-calculation-review';
import { outfitConditions } from './outfit';

const props = defineProps<{ visual: BnuCalculationReviewVisual }>();
const rows = computed(() => {
  if (props.visual.scene === 'baskets')
    return basketExpressions(props.visual.variant).map((expression, i) => ({
      key: i + 1,
      name: expression,
      value: '',
    }));
  const prices =
    props.visual.scene === 'balls'
      ? ballPrices(props.visual.variant)
      : outfitConditions(props.visual.variant).prices;
  return prices.map((price, i) => {
    let key = i < 3 ? 'upper' : 'trousers';
    if (props.visual.scene === 'balls')
      key =
        ['basketball', 'football', 'volleyball', 'beachBall'][i] ?? 'beachBall';
    return {
      key: i + 1,
      name: $t(`educationLearning.bnuCalculation_${key}`),
      value: price,
    };
  });
});
const columns = computed(() => [
  {
    key: 'key',
    dataIndex: 'key',
    title: $t('educationLearning.bnuCalculationNumber'),
    width: 72,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: $t(
      `educationLearning.bnuCalculation_${props.visual.scene === 'baskets' ? 'expression' : 'item'}`,
    ),
    width: 200,
  },
  ...(props.visual.scene === 'baskets'
    ? []
    : [
        {
          key: 'value',
          dataIndex: 'value',
          title: $t('educationLearning.bnuCalculationPrice'),
          width: 104,
        },
      ]),
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
    data-bnu-calculation-review
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuCalculation_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t(`educationLearning.bnuCalculation_${visual.variant}`) }}
    </p>
    <p v-if="visual.scene === 'baskets'" class="mb-3 text-xl leading-8">
      {{
        $t('educationLearning.bnuCalculationTarget', {
          target: visual.variant === 'main' ? 68 : 66,
        })
      }}
    </p>
    <p v-if="visual.scene === 'clothes'" class="mb-3 text-xl leading-8">
      {{
        $t('educationLearning.bnuCalculationBudget', {
          budget: outfitConditions(visual.variant).budget,
        })
      }}
    </p>
    <div
      data-bnu-calculation-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuCalculationScroll')"
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
            data-calculation-cell
            class="block text-center text-xl leading-8"
          >
            {{
              column.key === 'key'
                ? record.key
                : column.key === 'name'
                  ? record.name
                  : record.value
            }}
          </span>
        </template>
      </Table>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuCalculationScroll') }}
    </p>
    <p class="mb-0 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuCalculationNotice') }}
    </p>
  </figure>
</template>
