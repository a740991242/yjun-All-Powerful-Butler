<script setup lang="ts">
import type { FoldCutJoinVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  paperCentroid,
  paperSvgPoints,
  shownPaperPieces,
} from './fold-cut-join';
const props = defineProps<{ visual: FoldCutJoinVisual }>();
const pieces = computed(() => shownPaperPieces(props.visual));
const labelPoints = computed(() =>
  pieces.value.map((item) => paperCentroid(item)),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.foldCutJoinNotice') }}
    </p>
    <svg
      :viewBox="`0 0 ${(visual.width * 2 + 2) * 40} 240`"
      class="block h-auto w-full max-w-xl text-foreground"
      role="img"
      :aria-label="
        $t('educationLearning.foldCutJoinLabel', {
          width: visual.width,
          cut: $t(`educationLearning.foldCutJoin_${visual.cut}`),
          stage: $t(`educationLearning.foldCutJoin_${visual.stage}`),
        })
      "
    >
      <g aria-hidden="true">
        <polygon
          v-for="(points, i) in pieces"
          :key="i"
          :points="paperSvgPoints(points)"
          :fill="
            i === 0
              ? 'hsl(var(--primary) / 0.12)'
              : 'hsl(var(--primary) / 0.28)'
          "
          stroke="currentColor"
          stroke-width="2"
        />
        <path
          v-if="visual.stage === 'creased' || visual.stage === 'folded'"
          :d="`M40 100 L${40 + (visual.cut === 'corner' ? 2 : visual.width) * 40} 180`"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-dasharray="7 4"
        />
        <template v-if="visual.stage === 'cut' || visual.stage === 'joined'">
          <text
            v-for="(point, i) in labelPoints"
            :key="i"
            :x="40 + point[0] * 40"
            :y="100 + point[1] * 40"
            fill="currentColor"
            font-size="28"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ i === 0 ? 'A' : 'B' }}
          </text>
        </template>
      </g>
    </svg>
    <p class="text-sm">
      {{ $t(`educationLearning.foldCutJoinStage_${visual.stage}`) }}
    </p>
  </div>
</template>
