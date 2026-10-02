<script setup lang="ts">
import type { TwoPieceJoinVisual } from './two-piece-join';

import { computed } from 'vue';

import { $t } from '#/locales';

import { pairJoinCanvasPolygons, pairJoinPolygons } from './two-piece-join';
const props = defineProps<{ visual: TwoPieceJoinVisual }>();
const polygons = computed(() => pairJoinPolygons(props.visual.arrangement));
const paths = computed(() =>
  pairJoinCanvasPolygons(props.visual.arrangement).map((p) =>
    p.map(([x, y]) => `${x},${y}`).join(' '),
  ),
);
const separated = computed(() =>
  polygons.value.map((p, index) => {
    const xs = p.map((point) => point[0]);
    const ys = p.map((point) => point[1]);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    return p
      .map(
        ([x, y]) =>
          `${25 + index * 150 + (x - minX) * 55},${35 + (y - minY) * 55}`,
      )
      .join(' ');
  }),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.pairJoinInstruction') }}
    </p>
    <div class="grid gap-4 sm:grid-cols-2">
      <section class="rounded-lg border border-border p-3">
        <p class="mb-2 font-semibold">
          {{ $t('educationLearning.pairJoinPieces') }}
        </p>
        <svg
          viewBox="0 0 310 170"
          class="mx-auto w-full max-w-sm text-primary"
          role="img"
          :aria-label="$t('educationLearning.pairJoinPiecesLabel')"
        >
          <polygon
            v-for="(points, index) in separated"
            :key="index"
            :points="points"
            fill="currentColor"
            :fill-opacity="index ? 0.22 : 0.1"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </section>
      <section class="rounded-lg border border-border p-3">
        <p class="mb-2 font-semibold">
          {{ $t('educationLearning.pairJoinWhole') }}
        </p>
        <svg
          viewBox="0 0 310 210"
          class="mx-auto w-full max-w-sm text-primary"
          role="img"
          :aria-label="$t('educationLearning.pairJoinWholeLabel')"
        >
          <g
            :transform="
              visual.reflected ? 'translate(310 0) scale(-1 1)' : undefined
            "
          >
            <polygon
              v-for="(points, index) in paths"
              :key="index"
              :points="points"
              fill="currentColor"
              :fill-opacity="index ? 0.22 : 0.1"
              stroke="currentColor"
              stroke-width="2"
            />
          </g>
        </svg>
      </section>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.pairJoinNotice') }}
    </p>
  </div>
</template>
