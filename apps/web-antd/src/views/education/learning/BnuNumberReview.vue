<script setup lang="ts">
import type { BnuNumberReviewVisual } from './bnu-number-review';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { bnuNumberReview } from './bnu-number-review';

const props = defineProps<{ visual: BnuNumberReviewVisual }>();
const content = computed(() => bnuNumberReview(props.visual));
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
  content.value.type === 'train'
    ? content.value.values.map((_, i) => ({
        key: String(i),
        dataIndex: String(i),
        title: $t('educationLearning.bnuReviewPosition', { position: i + 1 }),
        width: 144,
        align: 'center' as const,
        customCell: cellStyle,
        customHeaderCell: cellStyle,
      }))
    : [],
);
const rows = computed(() =>
  content.value.type === 'train'
    ? [
        {
          id: 'train',
          ...Object.fromEntries(
            content.value.values.map((n, i) => [
              String(i),
              n ??
                (content.value.type === 'train' ? content.value.labels[i] : ''),
            ]),
          ),
        },
      ]
    : [],
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
  if (
    !(region instanceof HTMLElement) ||
    !['ArrowLeft', 'ArrowRight'].includes(event.key)
  )
    return;
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  if (
    region.scrollWidth <= region.clientWidth ||
    (direction > 0
      ? region.scrollLeft + region.clientWidth >= region.scrollWidth
      : region.scrollLeft <= 0)
  )
    return;
  event.preventDefault();
  event.stopPropagation();
  region.scrollBy({ left: direction * 144, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-number-review
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuReview_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{
        $t(
          content.type === 'train'
            ? 'educationLearning.bnuReviewTrainLegend'
            : `educationLearning.bnuReviewLegend_${content.material}`,
        )
      }}
    </p>
    <div
      data-bnu-review-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuReviewScroll')"
      @keydown="scrollWithKeyboard"
      class="overflow-x-auto scroll-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Table
        v-if="content.type === 'train'"
        :style="{ width: `${columns.length * 144}px` }"
        :columns="columns"
        :data-source="rows"
        row-key="id"
        :pagination="false"
        bordered
        size="middle"
      >
        <template #bodyCell="{ column, text }">
          <span :data-bnu-train-cell="column.key">{{ text }}</span>
        </template>
      </Table>
      <svg
        v-else
        viewBox="0 0 720 320"
        class="h-80 w-[720px] shrink-0"
        role="group"
        :aria-label="$t(`educationLearning.bnuReview_${content.material}`)"
      >
        <template v-if="content.material === 'objects'">
          <g v-for="(count, row) in content.rows" :key="row">
            <circle
              v-for="n in count"
              :key="n"
              data-bnu-review-object
              role="img"
              :aria-label="$t('educationLearning.bnuReviewOneObject')"
              :cx="35 + (n - 1) * 54"
              :cy="35 + row * 46"
              r="16"
              fill="currentColor"
              class="text-primary"
            />
          </g>
        </template>
        <template v-else-if="content.material === 'sticks'">
          <g
            v-for="bundle in content.tens"
            :key="bundle"
            data-bnu-review-bundle
            role="group"
            :aria-label="$t('educationLearning.bnuReviewBundle')"
          >
            <rect
              v-for="n in 10"
              :key="n"
              data-bnu-review-stick
              role="img"
              :aria-label="$t('educationLearning.bnuReviewOneStick')"
              :x="28 + (bundle - 1) * 110 + (n - 1) * 7"
              y="48"
              width="5"
              height="176"
              rx="2"
              fill="currentColor"
              class="text-primary"
            />
            <path
              :d="`M${24 + (bundle - 1) * 110} 125H${98 + (bundle - 1) * 110} M${24 + (bundle - 1) * 110} 135H${98 + (bundle - 1) * 110}`"
              stroke="currentColor"
              stroke-width="3"
            />
          </g>
          <rect
            v-for="n in content.singles"
            :key="n"
            data-bnu-review-single
            role="img"
            :aria-label="$t('educationLearning.bnuReviewOneStick')"
            :x="490 + (n - 1) * 20"
            y="48"
            width="7"
            height="176"
            rx="2"
            fill="currentColor"
            class="text-primary"
          />
        </template>
        <template v-else-if="content.material === 'cubes'">
          <g
            v-for="rod in content.tens"
            :key="rod"
            data-bnu-review-rod
            role="group"
            :aria-label="$t('educationLearning.bnuReviewTenRod')"
          >
            <rect
              v-for="n in 10"
              :key="n"
              data-bnu-review-unit
              role="img"
              :aria-label="$t('educationLearning.bnuReviewOneUnit')"
              :x="30 + (rod - 1) * 66"
              :y="30 + (n - 1) * 24"
              width="22"
              height="22"
              fill="currentColor"
              class="text-primary"
              stroke="currentColor"
              stroke-width="1"
            />
          </g>
          <rect
            v-for="n in content.singles"
            :key="n"
            data-bnu-review-single
            role="img"
            :aria-label="$t('educationLearning.bnuReviewOneUnit')"
            :x="290 + ((n - 1) % 5) * 55"
            :y="50 + Math.floor((n - 1) / 5) * 60"
            width="24"
            height="24"
            fill="currentColor"
            class="text-primary"
          />
        </template>
        <template v-else>
          <path
            d="M100 35V245 M330 35V245 M55 245H380"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <ellipse
            v-for="n in content.tens"
            :key="`t${n}`"
            data-bnu-review-tens-bead
            role="img"
            :aria-label="$t('educationLearning.placeCountersBead_tens')"
            cx="100"
            :cy="240 - n * 20"
            rx="25"
            ry="8"
            fill="currentColor"
            class="text-primary"
          />
          <ellipse
            v-for="n in content.singles"
            :key="`o${n}`"
            data-bnu-review-ones-bead
            role="img"
            :aria-label="$t('educationLearning.placeCountersBead_ones')"
            cx="330"
            :cy="240 - n * 20"
            rx="25"
            ry="8"
            fill="currentColor"
            class="text-primary"
          />
          <text
            x="100"
            y="280"
            text-anchor="middle"
            fill="currentColor"
            font-size="20"
          >
            {{ $t('educationLearning.placeCounters_tens') }}
          </text>
          <text
            x="330"
            y="280"
            text-anchor="middle"
            fill="currentColor"
            font-size="20"
          >
            {{ $t('educationLearning.placeCounters_ones') }}
          </text>
        </template>
      </svg>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuReviewScroll') }}
    </p>
    <p class="mt-3 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuReviewNotice') }}
    </p>
  </figure>
</template>
