<script setup lang="ts">
import type { PeriodicShapesVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import PlaneGlyph from './PlaneGlyph.vue';
import { required } from './required';
const props = defineProps<{ visual: PeriodicShapesVisual }>();
const entries = computed(() =>
  Array.from({ length: props.visual.total }, (_, i) =>
    i < props.visual.shown ? required(props.visual.pattern[i % 3]) : null,
  ),
);
const description = computed(() =>
  entries.value
    .map((item, i) =>
      $t('educationLearning.periodicShapePosition', {
        position: i + 1,
        shape: item
          ? $t('educationLearning.periodicShapeKnown', {
              geometry: $t(`educationLearning.planeGeometry_${item.shape}`),
              size: item.size,
            })
          : $t('educationLearning.periodicShapeUnknown'),
      }),
    )
    .join('; '),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-periodic-shapes>
    <p class="text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.periodicShapeInstruction') }}
    </p>
    <div
      class="overflow-x-auto pb-2"
      tabindex="0"
      :aria-label="$t('educationLearning.periodicShapeScroll')"
    >
      <svg
        :viewBox="`0 0 ${visual.total * 72} 104`"
        :width="visual.total * 72"
        height="104"
        class="block max-w-none text-foreground"
        role="img"
        :aria-label="description"
      >
        <g v-for="(entry, index) in entries" :key="index" aria-hidden="true">
          <g v-if="entry" :transform="`translate(${index * 72} 8) scale(0.5)`">
            <PlaneGlyph :card="{ ...entry, turn: 0 }" />
          </g>
          <g v-else>
            <rect
              :x="index * 72 + 6"
              y="14"
              width="60"
              height="60"
              rx="6"
              fill="none"
              stroke="currentColor"
              stroke-dasharray="5 3"
            />
            <text
              :x="index * 72 + 36"
              y="52"
              text-anchor="middle"
              font-size="22"
              fill="currentColor"
            >
              ?
            </text>
          </g>
          <text
            :x="index * 72 + 36"
            y="96"
            text-anchor="middle"
            font-size="20"
            fill="currentColor"
          >
            {{ index + 1 }}
          </text>
        </g>
      </svg>
    </div>
    <p class="text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.periodicShapeScroll') }}
    </p>
  </div>
</template>
