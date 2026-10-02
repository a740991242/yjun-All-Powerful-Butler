<script setup lang="ts">
import type { OcclusionViewsVisual } from './occlusion-views';

import { computed } from 'vue';

import { $t } from '#/locales';

import { occlusionScene } from './occlusion-views';
import OcclusionPicture from './OcclusionPicture.vue';
const props = defineProps<{ visual: OcclusionViewsVisual }>();
const scene = computed(() => occlusionScene(props.visual.variant));
const cupY = computed(() => (scene.value.cupSide === 'top' ? 64 : 196));
const observers = [
  { letter: 'A', x: 130, y: 20, arrow: '↓' },
  { letter: 'B', x: 245, y: 120, arrow: '←' },
  { letter: 'C', x: 130, y: 245, arrow: '↑' },
  { letter: 'D', x: 15, y: 120, arrow: '→' },
];
</script>
<template>
  <div
    class="space-y-4"
    role="region"
    :aria-label="$t('educationLearning.occlusionTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.occlusionTitle') }}</p>
    <p class="text-sm">
      {{
        $t('educationLearning.occlusionConditions', {
          side: $t(`educationLearning.housePosition_${scene.cupSide}`),
        })
      }}
    </p>
    <svg
      viewBox="0 0 260 280"
      class="mx-auto block w-full max-w-xs"
      role="img"
      :aria-label="
        $t('educationLearning.occlusionPlan', {
          side: $t(`educationLearning.housePosition_${scene.cupSide}`),
        })
      "
    >
      <rect
        x="90"
        y="90"
        width="80"
        height="80"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="2"
      />
      <text
        x="130"
        y="138"
        text-anchor="middle"
        fill="currentColor"
        font-size="18"
      >
        {{ $t('educationLearning.occlusionBox') }}
      </text>
      <circle
        cx="130"
        :cy="cupY"
        r="12"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="2"
      />
      <text x="168" :y="cupY + 5" fill="currentColor" font-size="16">
        {{ $t('educationLearning.occlusionCup') }}
      </text>
      <g v-for="observer in observers" :key="observer.letter">
        <text
          :x="observer.x"
          :y="observer.y"
          text-anchor="middle"
          fill="currentColor"
          font-size="19"
        >
          {{ observer.letter }}
        </text>
        <text
          :x="observer.x"
          :y="observer.y + 18"
          text-anchor="middle"
          fill="currentColor"
          font-size="21"
        >
          {{ observer.arrow }}
        </text>
      </g>
    </svg>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="(view, i) in scene.candidates"
        :key="i"
        class="rounded-lg border border-border p-3"
        role="group"
        :aria-label="
          $t('educationLearning.houseViewCandidate', { number: i + 1 })
        "
      >
        <p class="mb-2 font-medium">
          {{ $t('educationLearning.houseViewCandidate', { number: i + 1 }) }}
        </p>
        <OcclusionPicture :view="view" />
      </div>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.occlusionNotice') }}
    </p>
  </div>
</template>
