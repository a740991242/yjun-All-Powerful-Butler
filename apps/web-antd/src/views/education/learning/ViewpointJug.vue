<script setup lang="ts">
import type { ViewpointJugVisual } from './viewpoint-jug';

import { computed } from 'vue';

import { $t } from '#/locales';

import JugPicture from './JugPicture.vue';
import { jugScene } from './viewpoint-jug';
const props = defineProps<{ visual: ViewpointJugVisual }>();
const scene = computed(() => jugScene(props.visual.variant));
const positions = [
  { letter: 'A', x: 150, y: 28, arrow: '↓' },
  { letter: 'B', x: 274, y: 151, arrow: '←' },
  { letter: 'C', x: 150, y: 274, arrow: '↑' },
  { letter: 'D', x: 26, y: 151, arrow: '→' },
];
</script>
<template>
  <div
    class="space-y-4"
    role="region"
    :aria-label="$t('educationLearning.jugViewTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.jugViewTitle') }}</p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.jugViewConditions') }}
    </p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 300 300"
        class="mx-auto block w-full max-w-xs h-auto min-w-[300px]"
        role="img"
        :aria-label="
          $t(
            scene.spout === 3
              ? 'educationLearning.jugPlanMain'
              : 'educationLearning.jugPlanReview',
          )
        "
      >
        <g :transform="scene.spout === 3 ? undefined : 'rotate(90 150 150)'">
          <path
            d="M185 133 C230 111 231 191 185 170"
            fill="none"
            stroke="currentColor"
            stroke-width="6"
          />
          <path
            d="M115 137 L83 127 L83 144 L115 156"
            fill="hsl(var(--card))"
            stroke="currentColor"
            stroke-width="3"
          />
          <circle
            cx="150"
            cy="150"
            r="40"
            fill="hsl(var(--card))"
            stroke="currentColor"
            stroke-width="3"
          />
          <circle
            cx="150"
            cy="150"
            r="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <circle cx="150" cy="150" r="5" fill="currentColor" />
        </g>
        <g v-for="position in positions" :key="position.letter">
          <text
            :x="position.x"
            :y="position.y"
            text-anchor="middle"
            fill="currentColor"
            font-size="22"
          >
            {{ position.letter }} {{ position.arrow }}
          </text>
        </g>
      </svg>
    </div>
    <p class="text-sm">
      {{
        $t(
          scene.spout === 3
            ? 'educationLearning.jugPlanMain'
            : 'educationLearning.jugPlanReview',
        )
      }}
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="(view, i) in scene.candidates"
        :key="view"
        class="rounded-lg border border-border p-3"
        role="group"
        :aria-label="$t('educationLearning.jugCandidate', { number: i + 1 })"
      >
        <p class="mb-2 font-medium">
          {{ $t('educationLearning.jugCandidate', { number: i + 1 }) }}
        </p>
        <JugPicture :view="view" />
      </div>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.jugViewLimit') }}
    </p>
  </div>
</template>
