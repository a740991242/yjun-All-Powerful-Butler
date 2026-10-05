<script setup lang="ts">
import type { BnuRecyclingVisual } from './bnu-recycling';

import { computed } from 'vue';

import { $t } from '#/locales';

import { bnuRecyclingConditions } from './bnu-recycling';

const props = defineProps<{ visual: BnuRecyclingVisual }>();
const given = computed(() => bnuRecyclingConditions(props.visual));
function scrollWithKeyboard(event: KeyboardEvent) {
  if (
    event.target !== event.currentTarget ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  const node = event.currentTarget;
  if (
    !(node instanceof HTMLElement) ||
    !['ArrowLeft', 'ArrowRight'].includes(event.key)
  )
    return;
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  if (
    node.scrollWidth <= node.clientWidth ||
    (direction > 0
      ? node.scrollLeft + node.clientWidth >= node.scrollWidth
      : node.scrollLeft <= 0)
  )
    return;
  event.preventDefault();
  event.stopPropagation();
  node.scrollBy({ left: direction * 120, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-recycling
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuRecycling_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t(`educationLearning.bnuRecycling_${visual.variant}`) }}
    </p>
    <div
      data-bnu-recycling-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuRecyclingScroll')"
      @keydown="scrollWithKeyboard"
      class="overflow-x-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg
        v-if="visual.scene === 'circles'"
        viewBox="0 0 720 200"
        class="block h-[200px] w-[720px] max-w-none"
        role="img"
        :aria-label="
          $t('educationLearning.bnuRecyclingCircleDescription', {
            matched: given.matched,
            extra: given.extra,
          })
        "
      >
        <text x="16" y="64" fill="currentColor" font-size="22">
          {{ $t('educationLearning.bnuRecyclingLin') }}
        </text>
        <text x="16" y="144" fill="currentColor" font-size="22">
          {{ $t('educationLearning.bnuRecyclingJia') }}
        </text>
        <g v-for="n in given.matched" :key="n">
          <path
            :d="`M ${110 + (n - 1) * 27} 78 V 119`"
            stroke="currentColor"
            stroke-width="1"
            stroke-dasharray="3 4"
            opacity="0.5"
          />
          <circle
            data-recycling-circle="lin"
            :cx="110 + (n - 1) * 27"
            cy="58"
            r="9"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <circle
            data-recycling-circle="matched"
            :cx="110 + (n - 1) * 27"
            cy="138"
            r="9"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </g>
        <g v-for="n in given.extra" :key="n">
          <circle
            data-recycling-circle="extra"
            :cx="110 + (given.matched + n - 1) * 27 + 28"
            cy="138"
            r="9"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </g>
      </svg>
      <svg
        v-else
        viewBox="0 0 720 220"
        class="block h-[220px] w-[720px] max-w-none"
        role="img"
        :aria-label="
          $t('educationLearning.bnuRecyclingRodDescription', {
            loose: given.loose,
            extra: given.extra,
          })
        "
      >
        <text x="16" y="30" fill="currentColor" font-size="20">
          {{ $t('educationLearning.bnuRecyclingBundle') }}
        </text>
        <g data-recycling-bundle>
          <rect
            v-for="n in 10"
            :key="n"
            :x="25 + (n - 1) * 8"
            y="65"
            width="5"
            height="95"
            rx="2"
            fill="none"
            stroke="currentColor"
          />
          <path
            d="M 22 93 H 105 M 22 126 H 105"
            stroke="currentColor"
            stroke-width="3"
          />
        </g>
        <g v-for="n in given.loose" :key="n">
          <rect
            data-recycling-rod="before"
            :x="150 + (n - 1) * 27"
            y="65"
            width="7"
            height="95"
            rx="2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </g>
        <rect
          :x="180 + given.loose * 27"
          y="50"
          :width="given.extra * 27 + 20"
          height="125"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-dasharray="5 5"
        />
        <rect
          v-for="n in given.extra"
          :key="n"
          data-recycling-rod="extra"
          :x="200 + given.loose * 27 + (n - 1) * 27"
          y="65"
          width="7"
          height="95"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <text x="16" y="206" fill="currentColor" font-size="20">
          {{ $t('educationLearning.bnuRecyclingRodKey') }}
        </text>
      </svg>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuRecyclingScroll') }}
    </p>
    <p class="mb-0 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuRecyclingNotice') }}
    </p>
  </figure>
</template>
