<script setup lang="ts">
import type { CompositeShapesVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { compositeSegments } from './composite-shapes';
const props = defineProps<{ visual: CompositeShapesVisual }>();
const segments = computed(() => compositeSegments(props.visual));
const width = computed(() =>
  props.visual.layout === 'square-grid' ? 180 : 240,
);
const height = computed(() =>
  (() => {
    if (props.visual.layout === 'square-grid') return 180;
    return props.visual.layout === 'rectangle-strip' ? 40 : 140;
  })(),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.compositeNotice') }}
    </p>
    <svg
      :viewBox="`0 0 ${width + 24} ${height + 24}`"
      :width="width + 24"
      :height="height + 24"
      class="block h-auto max-w-full text-foreground"
      role="img"
      :aria-label="
        $t(`educationLearning.composite_${visual.layout}`, {
          divisions: visual.divisions,
        })
      "
    >
      <g
        transform="translate(12 12)"
        stroke="currentColor"
        stroke-width="2"
        fill="hsl(var(--primary) / 0.12)"
        aria-hidden="true"
      >
        <path
          v-if="visual.layout === 'triangle-fan'"
          d="M120 0 L240 140 H0 Z"
        />
        <rect v-else x="0" y="0" :width="width" :height="height" />
        <line
          v-for="(segment, index) in segments"
          :key="index"
          :x1="segment[0]"
          :y1="segment[1]"
          :x2="segment[2]"
          :y2="segment[3]"
        />
      </g>
    </svg>
  </div>
</template>
