<script setup lang="ts">
import type { PlaneCardsVisual } from './types';

import { $t } from '#/locales';

import PlaneGlyph from './PlaneGlyph.vue';
defineProps<{ visual: PlaneCardsVisual }>();
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-xl leading-relaxed text-muted-foreground">
      {{ $t('educationLearning.planeCardsNotice') }}
    </p>
    <div class="flex flex-wrap gap-3">
      <div
        v-for="(card, index) in visual.cards"
        :key="index"
        class="flex flex-col items-center rounded-lg border border-border bg-card p-2"
      >
        <span class="text-xl font-medium">
          {{ String.fromCharCode(65 + index) }}
        </span>
        <svg
          viewBox="0 0 144 144"
          width="144"
          height="144"
          class="block text-foreground"
          role="img"
          :aria-label="
            $t('educationLearning.planeCardLabel', {
              letter: String.fromCharCode(65 + index),
              geometry: $t(`educationLearning.planeGeometry_${card.shape}`),
              size: card.size,
              turn: card.turn,
            })
          "
        >
          <PlaneGlyph :card="card" />
        </svg>
      </div>
    </div>
  </div>
</template>
