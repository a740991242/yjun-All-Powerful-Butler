<script setup lang="ts">
import type { BnuFinalDataVisual } from './bnu-final-data';

import { computed, ref } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { bnuFinalDataRows } from './bnu-final-data';
const props = defineProps<{ visual: BnuFinalDataVisual }>();
const holder = ref<HTMLElement>();
const rows = computed(() => bnuFinalDataRows(props.visual));
const columns = computed(() => [
  { key: 'name', title: $t('educationLearning.finalDataObject'), width: 128 },
  {
    key: 'condition',
    title: $t('educationLearning.finalDataCondition'),
    width: 192,
  },
  ...(props.visual.scene === 'rope'
    ? [{ key: 'rank', title: $t('educationLearning.finalDataRank'), width: 96 }]
    : []),
]);
function scrollTable(event: KeyboardEvent) {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  const table = holder.value?.querySelector<HTMLElement>('.ant-table-content');
  if (!table) return;
  event.preventDefault();
  table.scrollBy({ left: event.key === 'ArrowRight' ? 120 : -120 });
}
</script>
<template>
  <figure
    data-bnu-final-data
    :data-scene="visual.scene"
    :data-variant="visual.variant"
    class="m-0 min-w-0 space-y-3"
  >
    <figcaption class="text-xl font-semibold leading-8">
      {{ $t(`educationLearning.finalDataTitle_${visual.scene}`) }}
    </figcaption>
    <p class="text-xl leading-8">
      {{
        $t(
          visual.variant === 'main'
            ? 'educationLearning.finalDataMain'
            : 'educationLearning.finalDataReview',
        )
      }}
    </p>
    <div
      ref="holder"
      data-final-data-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.finalDataScroll')"
      @keydown="scrollTable"
    >
      <Table
        :columns="columns"
        :data-source="rows"
        row-key="id"
        :pagination="false"
        :scroll="{ x: visual.scene === 'rope' ? 416 : 320 }"
        size="small"
        bordered
      >
        <template #headerCell="{ column }">
          <span class="block text-xl leading-8">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, record }">
          <span
            v-if="column.key === 'name'"
            class="flex min-h-11 items-center text-xl leading-8"
          >
            {{ record.id }} ·
            {{ $t(`educationLearning.finalDataName_${record.name}`) }}
          </span>
          <span
            v-else-if="column.key === 'rank'"
            class="flex min-h-11 items-center text-xl leading-8"
            :aria-label="
              $t('educationLearning.finalDataRankBlank', {
                letter: record.rankBlank,
              })
            "
          >
            {{ record.rankBlank }}
          </span>
          <span
            v-else
            class="flex min-h-11 items-center text-xl leading-8"
            :data-final-data-condition="record.id"
          >
            {{
              record.more === undefined
                ? $t(`educationLearning.finalDataQuantity_${visual.scene}`, {
                    quantity: record.quantity,
                  })
                : $t(`educationLearning.finalDataMore_${visual.scene}`, {
                    more: record.more,
                  })
            }}
          </span>
        </template>
      </Table>
    </div>
    <p class="text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.finalDataNotice') }}
    </p>
  </figure>
</template>
