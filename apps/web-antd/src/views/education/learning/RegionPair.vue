<script lang="ts" setup>
import type { RegionPairVisual } from './types';

defineProps<{ visual: RegionPairVisual }>();
const labels = ['A', 'B'];
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-4">
      <span>{{ $t('educationLearning.regionALegend') }}</span>
      <span>{{ $t('educationLearning.regionBLegend') }}</span>
    </div>
    <svg
      viewBox="0 0 216 168"
      class="mx-auto w-full max-w-sm"
      role="img"
      :aria-label="$t('educationLearning.regionDescription')"
    >
      <g fill="hsl(var(--muted-foreground))">
        <template v-for="y in 4" :key="y">
          <circle
            v-for="x in 5"
            :key="x"
            :cx="24 + (x - 1) * 40"
            :cy="24 + (y - 1) * 40"
            r="2"
          />
        </template>
      </g>
      <g v-for="([width, height], index) in visual.sizes" :key="index">
        <rect
          x="24"
          :y="144 - height * 40"
          :width="width * 40"
          :height="height * 40"
          fill="none"
          stroke="hsl(var(--primary))"
          :stroke-width="index === 0 ? 3 : 4"
          :stroke-dasharray="index === 0 ? undefined : '8 5'"
        />
        <text
          :x="24 + width * 20"
          :y="138 - height * 40"
          text-anchor="middle"
          fill="currentColor"
          font-size="14"
        >
          {{ labels[index] }}
        </text>
      </g>
    </svg>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.regionNotice') }}
    </p>
  </div>
</template>
