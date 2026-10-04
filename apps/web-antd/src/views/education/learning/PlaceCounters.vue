<script lang="ts" setup>
import type { PlaceCountersVisual } from './place-counters';

import { $t } from '#/locales';

import { counterPlaces } from './place-counters';
defineProps<{ visual: PlaceCountersVisual }>();
const rods = [
  { key: 'hundreds' as const, x: 65 },
  { key: 'tens' as const, x: 150 },
  { key: 'ones' as const, x: 235 },
];
</script>
<template>
  <figure class="space-y-3" data-place-counters>
    <figcaption class="text-xl font-medium">
      {{ $t('educationLearning.placeCountersTitle') }}
    </figcaption>
    <p class="text-xl leading-8">
      {{ $t('educationLearning.placeCountersLegend') }}
    </p>
    <div
      class="overflow-x-auto rounded-lg border border-border p-3"
      tabindex="0"
      data-counter-scroll
      :aria-label="$t('educationLearning.placeCountersScroll')"
    >
      <div class="flex w-max gap-4">
        <svg
          v-for="(value, index) in visual.values"
          :key="index"
          viewBox="0 0 300 256"
          class="h-64 w-[300px] shrink-0"
          role="group"
          :aria-label="
            $t('educationLearning.placeCountersPanel', { position: index + 1 })
          "
          :data-counter-panel="index + 1"
        >
          <path
            d="M30 210H270 M65 22V210 M150 22V210 M235 22V210"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <g
            v-for="rod in rods"
            :key="rod.key"
            :data-counter-rod="rod.key"
            role="group"
            :aria-label="$t(`educationLearning.placeCounters_${rod.key}`)"
          >
            <ellipse
              v-for="n in counterPlaces(value)[rod.key]"
              :key="n"
              :cx="rod.x"
              :cy="205 - n * 18"
              rx="24"
              ry="7"
              fill="currentColor"
              class="text-primary"
              :data-counter-bead="rod.key"
              role="img"
              :aria-label="$t(`educationLearning.placeCountersBead_${rod.key}`)"
            />
            <text
              :x="rod.x"
              y="240"
              text-anchor="middle"
              fill="currentColor"
              font-size="20"
            >
              {{ $t(`educationLearning.placeCounters_${rod.key}`) }}
            </text>
          </g>
        </svg>
      </div>
    </div>
    <p class="text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.placeCountersScroll') }}
    </p>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.placeCountersNotice') }}
    </p>
  </figure>
</template>
