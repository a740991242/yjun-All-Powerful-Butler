<script setup lang="ts">
import type { RectangleCutVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { rectangleCutLabels, rectangleCutPieces } from './rectangle-cut';
const props = defineProps<{ visual: RectangleCutVisual }>();
const width = computed(() => props.visual.width * 40);
const pieces = computed(() => rectangleCutPieces(props.visual));
const labels = computed(() => rectangleCutLabels(props.visual));
const cutPath = computed(() =>
  (() => {
    if (props.visual.cut === 'vertical') return `M${width.value / 2} 0 V80`;
    return props.visual.cut === 'horizontal'
      ? `M0 40 H${width.value}`
      : `M0 0 L${width.value} 80`;
  })(),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.rectangleCutNotice') }}
    </p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        :viewBox="`0 0 ${width + 48} 126`"
        :width="width + 48"
        height="126"
        class="block h-auto max-w-none text-foreground"
        role="img"
        :aria-label="
          $t('educationLearning.rectangleCutLabel', {
            width: visual.width,
            cut: $t(`educationLearning.rectangleCut_${visual.cut}`),
          })
        "
      >
        <g transform="translate(24 20)" aria-hidden="true">
          <polygon
            v-for="(points, index) in pieces"
            :key="index"
            :points="points"
            fill="hsl(var(--primary) / 0.12)"
          />
          <rect
            x="0"
            y="0"
            :width="width"
            height="80"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            :d="cutPath"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-dasharray="7 4"
          />
          <text
            v-for="(point, index) in labels"
            :key="index"
            :x="point[0]"
            :y="point[1]"
            fill="currentColor"
            font-size="22"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ index === 0 ? 'A' : 'B' }}
          </text>
          <path :d="`M0 -8 H${width}`" stroke="currentColor" />
          <path
            v-for="index in visual.width + 1"
            :key="`top-${index}`"
            :d="`M${(index - 1) * 40} -12 V-4`"
            stroke="currentColor"
          />
          <path d="M-8 0 V80" stroke="currentColor" />
          <path
            v-for="index in 3"
            :key="`left-${index}`"
            :d="`M-12 ${(index - 1) * 40} H-4`"
            stroke="currentColor"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
