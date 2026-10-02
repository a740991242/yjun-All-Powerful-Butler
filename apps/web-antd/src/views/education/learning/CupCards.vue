<script lang="ts" setup>
import type { CupCardsVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { cupCards } from './cup-cards';
const props = defineProps<{ visual: CupCardsVisual }>();
const cards = computed(() => cupCards(props.visual.variant === 'review'));
// Fixed teaching colours have written labels and do not follow the primary theme.
const colors = { red: '#dc2626', blue: '#2563eb', yellow: '#ca8a04' };
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.cupCardsNotice') }}
    </p>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div
        v-for="card in cards"
        :key="card.id"
        class="min-w-0 rounded-lg border border-border p-2"
      >
        <p class="mb-2 text-center font-medium">
          {{ card.id }} · {{ $t(`educationLearning.blockColor_${card.color}`) }}
        </p>
        <svg
          viewBox="0 0 120 120"
          width="120"
          height="120"
          class="block h-auto w-full"
          :style="{ color: colors[card.color] }"
          role="img"
          :aria-label="
            $t('educationLearning.cupCard', {
              letter: card.id,
              body: $t(`educationLearning.cupBody_${card.body}`),
              handle: $t(
                `educationLearning.cupHandle_${card.handle ? 'with' : 'without'}`,
              ),
              color: $t(`educationLearning.blockColor_${card.color}`),
            })
          "
        >
          <path
            v-if="card.handle"
            :d="
              card.body === 'straight'
                ? 'M91 42Q113 32 112 56Q110 74 91 79'
                : 'M89 40Q111 32 109 56Q107 75 81 79'
            "
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          />
          <path
            :d="
              card.body === 'straight'
                ? 'M21 30V94Q21 105 56 105Q91 105 91 94V30Z'
                : 'M21 30L36 94Q36 104 56 104Q76 104 76 94L91 30Z'
            "
            :fill="`${colors[card.color]}22`"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <ellipse
            cx="56"
            cy="30"
            rx="35"
            ry="10"
            :fill="`${colors[card.color]}22`"
            stroke="currentColor"
            stroke-width="2.5"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
