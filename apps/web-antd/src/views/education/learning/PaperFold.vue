<script setup lang="ts">
import type { PaperFoldVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { foldOutline, nextFoldLine } from './paper-fold';
const props = defineProps<{ visual: PaperFoldVisual }>();
const stages: PaperFoldVisual['stage'][] = [0, 1, 2];
const frames = computed(() =>
  stages
    .filter((stage) => stage <= props.visual.stage)
    .map((stage) => ({
      stage,
      points: foldOutline(props.visual, stage)
        .map(([x, y]) => `${48 + x * 40},${48 + y * 40}`)
        .join(' '),
      crease: nextFoldLine(props.visual, stage),
    })),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.foldNotice') }}
    </p>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        v-for="frame in frames"
        :key="frame.stage"
        class="flex min-w-0 flex-col gap-2"
      >
        <p class="font-medium">
          {{ $t('educationLearning.foldStage', { stage: frame.stage }) }}
        </p>
        <svg
          viewBox="0 0 256 256"
          width="256"
          height="256"
          class="block h-auto w-full max-w-64 text-foreground"
          role="img"
          :aria-label="
            $t(
              `educationLearning.fold_${visual.paper}_${visual.method}_${frame.stage}`,
            )
          "
        >
          <polygon
            :points="frame.points"
            fill="hsl(var(--primary) / 0.12)"
            stroke="currentColor"
            stroke-width="2.5"
          />
          <line
            v-if="frame.crease"
            :x1="48 + frame.crease[0][0] * 40"
            :y1="48 + frame.crease[0][1] * 40"
            :x2="48 + frame.crease[1][0] * 40"
            :y2="48 + frame.crease[1][1] * 40"
            stroke="hsl(var(--primary))"
            stroke-width="3"
            stroke-dasharray="6 4"
          />
        </svg>
        <p class="text-sm text-muted-foreground">
          {{
            $t(
              `educationLearning.fold_${visual.paper}_${visual.method}_${frame.stage}`,
            )
          }}
        </p>
      </div>
    </div>
  </div>
</template>
