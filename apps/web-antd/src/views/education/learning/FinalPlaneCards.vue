<script setup lang="ts">
import type { FinalPlaneCardsVisual } from './final-plane-cards';

import { computed } from 'vue';

import { $t } from '#/locales';

import { finalPlaneCards } from './final-plane-cards';
const props = defineProps<{ visual: FinalPlaneCardsVisual }>();
const cards = computed(() => finalPlaneCards(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-final-plane-cards>
    <p class="text-base text-muted-foreground">
      {{ $t('educationLearning.finalPlaneNotice') }}
    </p>
    <div
      class="grid grid-cols-3 gap-3"
      role="group"
      :aria-label="$t('educationLearning.finalPlaneDiagram')"
    >
      <div
        v-for="card in cards"
        :key="card.label"
        class="flex min-w-0 flex-col items-center gap-2"
        :data-piece-label="card.label"
        :data-piece-shape="card.shape"
      >
        <svg
          viewBox="0 0 64 64"
          width="64"
          height="64"
          class="block h-auto w-full max-w-16 text-primary"
          role="img"
          :aria-label="`${card.label}: ${$t(`educationLearning.shape_${card.shape}`)}`"
        >
          <g
            fill="hsl(var(--primary) / 0.16)"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle v-if="card.shape === 'circle'" cx="32" cy="32" r="22" />
            <rect
              v-else-if="card.shape === 'square'"
              x="12"
              y="12"
              width="40"
              height="40"
            />
            <rect
              v-else-if="card.shape === 'rectangle'"
              x="8"
              y="19"
              width="48"
              height="26"
            />
            <polygon
              v-else-if="card.shape === 'triangle'"
              points="8,55 56,55 32,9"
            />
            <polygon v-else points="17,12 57,12 47,52 7,52" />
          </g>
        </svg>
        <span class="text-xl">{{ card.label }}</span>
      </div>
    </div>
  </div>
</template>
