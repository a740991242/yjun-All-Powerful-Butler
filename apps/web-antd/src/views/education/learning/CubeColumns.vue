<script setup lang="ts">
import type { CubeColumnsVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

const props = defineProps<{ visual: CubeColumnsVisual }>();
const height = computed(() => Math.max(...props.visual.heights) * 60 + 50);
const cubes = computed(() =>
  props.visual.heights.flatMap((count, column) =>
    Array.from({ length: count }, (_, level) => ({
      id: `${column}-${level}`,
      x: 16 + column * 60,
      y: height.value - 20 - (level + 1) * 60,
    })),
  ),
);
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-base text-muted-foreground">
      {{ $t('educationLearning.cubeColumnsInstruction') }}
    </p>
    <svg
      :viewBox="`0 0 ${visual.heights.length * 60 + 52} ${height}`"
      class="mx-auto w-full max-w-md text-primary"
      role="img"
      :aria-label="$t('educationLearning.cubeColumnsLabel')"
    >
      <g
        v-for="cube in cubes"
        :key="cube.id"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      >
        <polygon
          :points="`${cube.x},${cube.y} ${cube.x + 20},${cube.y - 15} ${cube.x + 80},${cube.y - 15} ${cube.x + 60},${cube.y}`"
          fill="hsl(var(--primary) / 0.14)"
        />
        <polygon
          :points="`${cube.x + 60},${cube.y} ${cube.x + 80},${cube.y - 15} ${cube.x + 80},${cube.y + 45} ${cube.x + 60},${cube.y + 60}`"
          fill="hsl(var(--primary) / 0.3)"
        />
        <rect
          :x="cube.x"
          :y="cube.y"
          width="60"
          height="60"
          fill="hsl(var(--card))"
        />
      </g>
    </svg>
  </div>
</template>
