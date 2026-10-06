<script setup lang="ts">
import type { NumberLineGridVisual } from './final-counting';

import { computed } from 'vue';

import { $t } from '#/locales';

import { numberLinePointX, numberLineTicks } from './final-counting';
const props = defineProps<{ visual: NumberLineGridVisual }>();
const width = computed(
  () => (props.visual.maximum - props.visual.minimum) * 16 + 70,
);
const ticks = computed(() => numberLineTicks(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.lineGridInstruction') }}
    </p>
    <div
      class="overflow-x-auto rounded-lg border border-border p-2"
      tabindex="0"
      :aria-label="$t('educationLearning.lineGridScroll')"
    >
      <svg
        :viewBox="`0 0 ${width} 150`"
        :style="{ width: `${width}px`, height: '150px' }"
        class="text-primary"
        role="img"
        :aria-label="
          $t('educationLearning.lineGridLabel', {
            minimum: visual.minimum,
            maximum: visual.maximum,
          })
        "
      >
        <line
          x1="30"
          y1="90"
          :x2="width - 20"
          y2="90"
          stroke="currentColor"
          stroke-width="2"
        />
        <path
          :d="`M${width - 26} 85 L${width - 20} 90 L${width - 26} 95`"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <g v-for="tick in ticks" :key="tick.value">
          <line
            :x1="tick.x"
            :x2="tick.x"
            y1="90"
            :y2="tick.major ? 76 : 83"
            stroke="currentColor"
            :stroke-width="tick.major ? 2 : 1"
          />
          <text
            v-if="tick.major"
            :x="tick.x"
            y="120"
            text-anchor="middle"
            font-size="22"
            fill="currentColor"
          >
            {{ tick.value }}
          </text>
        </g>
        <g v-for="(point, index) in visual.points" :key="index">
          <circle
            :cx="numberLinePointX(visual, point)"
            cy="90"
            r="5"
            fill="currentColor"
          />
          <line
            :x1="numberLinePointX(visual, point)"
            :x2="numberLinePointX(visual, point)"
            :y1="index % 2 ? 36 : 62"
            y2="82"
            stroke="currentColor"
          />
          <text
            :x="numberLinePointX(visual, point)"
            :y="index % 2 ? 30 : 56"
            text-anchor="middle"
            font-size="22"
            fill="currentColor"
          >
            {{ String.fromCodePoint(65 + index) }}
          </text>
        </g>
      </svg>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.lineGridScroll') }}
    </p>
  </div>
</template>
