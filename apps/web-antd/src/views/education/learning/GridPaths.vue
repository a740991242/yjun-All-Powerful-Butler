<script lang="ts" setup>
import type { GridPathsVisual } from './types';

import { computed } from 'vue';

const props = defineProps<{ visual: GridPathsVisual }>();
const rows = computed(() => (props.visual.grid === '5x5' ? 5 : 3));
const dashes = ['', '8 6', '1 6'];
const styles = ['gridSolid', 'gridDashed', 'gridDotted'];
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-x-6 gap-y-3">
      <span
        v-for="(path, index) in visual.paths"
        :key="path.id"
        class="flex items-center gap-2 text-base"
      >
        <svg
          width="40"
          height="12"
          aria-hidden="true"
          class="shrink-0 text-primary"
        >
          <line
            x1="2"
            y1="6"
            x2="38"
            y2="6"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            :stroke-dasharray="dashes[index]"
          />
        </svg>
        {{ $t('educationLearning.gridPath', { label: path.id }) }}
        <span class="text-sm text-muted-foreground">
          {{ $t(`educationLearning.${styles[index]}`) }}
        </span>
      </span>
    </div>
    <svg
      :viewBox="`0 0 300 ${rows * 50 + 50}`"
      class="mx-auto w-full max-w-md"
      role="img"
      :aria-label="
        $t('educationLearning.gridDiagramDescription', {
          rows,
          paths: visual.paths
            .map((path) =>
              $t('educationLearning.gridPathCoordinates', {
                label: path.id,
                points: path.points
                  .map((point) => `(${point.join(', ')})`)
                  .join(' → '),
              }),
            )
            .join(' '),
        })
      "
    >
      <g stroke="hsl(var(--border))" stroke-width="1">
        <line
          v-for="x in 6"
          :key="`x${x}`"
          :x1="24 + (x - 1) * 50"
          y1="24"
          :x2="24 + (x - 1) * 50"
          :y2="24 + rows * 50"
        />
        <line
          v-for="y in rows + 1"
          :key="`y${y}`"
          x1="24"
          :y1="24 + (y - 1) * 50"
          x2="274"
          :y2="24 + (y - 1) * 50"
        />
      </g>
      <polyline
        v-for="(path, index) in visual.paths"
        :key="path.id"
        :points="
          path.points.map(([x, y]) => `${24 + x * 50},${24 + y * 50}`).join(' ')
        "
        fill="none"
        stroke="hsl(var(--primary))"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-dasharray="dashes[index]"
        :aria-label="$t('educationLearning.gridPath', { label: path.id })"
      />
    </svg>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.gridNotice') }}
    </p>
  </div>
</template>
