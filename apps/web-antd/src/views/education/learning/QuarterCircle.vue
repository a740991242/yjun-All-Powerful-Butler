<script setup lang="ts">
import type { QuarterCircleVisual } from './quarter-circle';

import { computed } from 'vue';

import { $t } from '#/locales';

import { quarterCircleSectors } from './quarter-circle';
const props = defineProps<{ visual: QuarterCircleVisual }>();
const sectors = computed(() => quarterCircleSectors(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.quarterCircleInstruction') }}
    </p>
    <svg
      viewBox="0 0 300 300"
      class="mx-auto w-full max-w-sm text-primary"
      role="img"
      :aria-label="$t(`educationLearning.quarterCircle_${visual.layout}`)"
    >
      <path
        v-for="(sector, index) in sectors"
        :key="index"
        :d="sector.path"
        fill="currentColor"
        :fill-opacity="index % 2 ? 0.22 : 0.1"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.quarterCircleNotice') }}
    </p>
  </div>
</template>
