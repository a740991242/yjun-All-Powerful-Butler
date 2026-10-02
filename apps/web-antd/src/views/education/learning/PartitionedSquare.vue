<script setup lang="ts">
import type { PartitionedSquareVisual } from './partitioned-square';

import { computed } from 'vue';

import { $t } from '#/locales';

import { fold } from './fold';
import { squarePieces } from './partitioned-square';

const props = defineProps<{ visual: PartitionedSquareVisual }>();
const pieces = computed(() =>
  squarePieces(props.visual).map((piece) => ({
    letter: piece.letter,
    points: piece.points
      .map(([x, y]) => `${40 + 80 * x},${40 + 80 * y}`)
      .join(' '),
    x:
      40 +
      (80 * fold(piece.points, 0, (sum, point) => sum + point[0])) /
        piece.points.length,
    y:
      40 +
      (80 * fold(piece.points, 0, (sum, point) => sum + point[1])) /
        piece.points.length,
  })),
);
</script>

<template>
  <figure
    class="mx-auto w-full max-w-sm rounded-xl border border-border bg-card p-3"
  >
    <svg
      viewBox="0 0 320 320"
      class="block w-full text-primary"
      role="img"
      :aria-label="$t('educationLearning.partitionedSquareLabel')"
    >
      <title>{{ $t('educationLearning.partitionedSquareLabel') }}</title>
      <g v-for="piece in pieces" :key="piece.letter">
        <polygon
          :points="piece.points"
          fill="currentColor"
          fill-opacity="0.08"
          stroke="currentColor"
          stroke-width="2"
        />
        <text
          :x="piece.x"
          :y="piece.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-current text-xl font-semibold"
        >
          {{ piece.letter }}
        </text>
      </g>
    </svg>
    <figcaption class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.partitionedSquareHint') }}
    </figcaption>
  </figure>
</template>
