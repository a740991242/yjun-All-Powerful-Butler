<script lang="ts" setup>
import type { NatureCardsVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { leafCards, plantCards } from './nature-cards';
const props = defineProps<{ visual: NatureCardsVisual }>();
const leaves = computed(() => leafCards(props.visual.variant === 'review'));
const plants = computed(() => plantCards(props.visual.variant === 'review'));
// Fixed observed leaf colours do not follow the app primary theme.
const colors = { red: '#dc2626', green: '#16a34a', yellow: '#ca8a04' };
const paths = {
  long: 'M60 16 Q104 54 60 101 Q16 54 60 16Z',
  fan: 'M60 100 L18 43 Q34 6 60 18 Q86 6 102 43Z',
  lobed:
    'M60 102 L54 75 L26 85 L35 62 L14 47 L41 45 L40 24 L55 36 L60 10 L67 36 L81 24 L80 45 L106 47 L85 62 L94 85 L66 75Z',
};
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.natureCardsNotice') }}
    </p>
    <div
      v-if="visual.deck === 'leaves'"
      class="grid grid-cols-2 gap-3 md:grid-cols-4"
    >
      <div
        v-for="card in leaves"
        :key="card.id"
        class="min-w-0 rounded-lg border border-border p-2"
      >
        <p class="mb-2 text-center font-medium">
          {{ card.id }} · {{ $t(`educationLearning.leafColor_${card.color}`) }}
        </p>
        <svg
          viewBox="0 0 120 120"
          width="120"
          height="120"
          class="block h-auto w-full"
          :style="{ color: colors[card.color] }"
          role="img"
          :aria-label="
            $t('educationLearning.leafCard', {
              letter: card.id,
              color: $t(`educationLearning.leafColor_${card.color}`),
              shape: $t(`educationLearning.leafShape_${card.shape}`),
            })
          "
        >
          <path
            :d="paths[card.shape]"
            :fill="`${colors[card.color]}22`"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M60 102V52M60 102V110"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
    <div v-else class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div
        v-for="card in plants"
        :key="card.id"
        class="min-w-0 rounded-lg border border-border p-2"
      >
        <p class="mb-2 text-center font-medium">
          {{ card.id }} ·
          {{ $t(`educationLearning.natureObject_${card.object}`) }}
        </p>
        <svg
          viewBox="0 0 120 120"
          width="120"
          height="120"
          class="block h-auto w-full text-primary"
          role="img"
          :aria-label="
            $t('educationLearning.natureCard', {
              letter: card.id,
              object: $t(`educationLearning.natureObject_${card.object}`),
            })
          "
        >
          <g
            fill="hsl(var(--primary) / 0.12)"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linejoin="round"
          >
            <g v-if="card.object === 'tree'">
              <path d="M53 68H67V105H53Z" />
              <path d="M60 12L29 44H40L18 75H102L80 44H91Z" />
            </g>
            <g v-else-if="card.object === 'flower'">
              <path
                d="M60 65V110M60 93Q27 59 27 89Q39 104 60 98M60 102Q94 74 93 93Q80 109 60 109"
              />
              <circle cx="60" cy="22" r="15" />
              <circle cx="35" cy="40" r="15" />
              <circle cx="44" cy="65" r="15" />
              <circle cx="77" cy="65" r="15" />
              <circle cx="85" cy="40" r="15" />
              <circle cx="60" cy="44" r="15" />
            </g>
            <g v-else-if="card.object === 'cat'">
              <path
                d="M32 56L27 21L48 36Q60 29 72 36L93 21L88 56Q95 82 60 84Q25 82 32 56Z"
              />
              <path
                d="M43 81Q30 111 60 112Q90 111 77 81M83 104Q110 92 104 76"
              />
              <circle cx="45" cy="57" r="2" />
              <circle cx="75" cy="57" r="2" />
              <path d="M54 67H66L60 73Z" />
            </g>
            <g v-else>
              <ellipse cx="56" cy="72" rx="31" ry="23" />
              <circle cx="80" cy="39" r="19" />
              <path
                d="M98 35L112 44L98 48M29 65L9 57L24 81M43 94V109M65 94V109M39 73Q58 49 73 73Q56 93 39 73Z"
              />
              <circle cx="83" cy="36" r="2" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
