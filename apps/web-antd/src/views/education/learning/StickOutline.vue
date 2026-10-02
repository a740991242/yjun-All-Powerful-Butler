<script setup lang="ts">
import type { StickOutlineVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { displayStickSegments } from './stick-outline';
const props = defineProps<{ visual: StickOutlineVisual }>();
const segments = computed(() => displayStickSegments(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.stickOutlineNotice') }}
    </p>
    <svg
      viewBox="0 0 320 320"
      width="320"
      height="320"
      class="mx-auto block h-auto w-72 max-w-full text-foreground"
      role="img"
      :aria-label="
        $t(`educationLearning.stickOutline_${visual.layout}`, {
          turn: visual.turn,
        })
      "
    >
      <g aria-hidden="true">
        <g v-for="(segment, index) in segments" :key="index">
          <line
            :x1="segment[0].x"
            :y1="segment[0].y"
            :x2="segment[1].x"
            :y2="segment[1].y"
            stroke="hsl(var(--primary))"
            stroke-width="7"
          />
          <circle
            v-for="(point, i) in segment"
            :key="i"
            :cx="point.x"
            :cy="point.y"
            r="3.5"
            fill="hsl(var(--background))"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </g>
      </g>
    </svg>
  </div>
</template>
