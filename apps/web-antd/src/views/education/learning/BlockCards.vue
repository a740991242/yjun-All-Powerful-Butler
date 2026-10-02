<script setup lang="ts">
import type { BlockCardsVisual } from './types';

import { $t } from '#/locales';

import SolidGlyph from './SolidGlyph.vue';
defineProps<{ visual: BlockCardsVisual }>();
// These literal teaching colours must not follow a user's configurable primary colour.
const palette = { red: '#dc2626', blue: '#2563eb', yellow: '#ca8a04' };
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.blockCardsNotice') }}
    </p>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div
        v-for="(card, index) in visual.cards"
        :key="index"
        class="min-w-0 rounded-lg border border-border p-2"
      >
        <p class="mb-2 text-center font-medium">
          {{ String.fromCharCode(65 + index) }} ·
          {{ $t(`educationLearning.blockColor_${card.color}`) }}
        </p>
        <svg
          viewBox="0 0 240 170"
          width="240"
          height="170"
          class="block h-auto w-full"
          :style="{ color: palette[card.color] }"
          role="img"
          :aria-label="
            $t('educationLearning.blockCard', {
              letter: String.fromCharCode(65 + index),
              color: $t(`educationLearning.blockColor_${card.color}`),
              shape: $t(`educationLearning.shape_${card.shape}`),
            })
          "
        >
          <SolidGlyph :shape="card.shape" :fill="`${palette[card.color]}22`" />
        </svg>
      </div>
    </div>
  </div>
</template>
