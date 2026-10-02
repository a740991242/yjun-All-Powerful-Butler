<script setup lang="ts">
import type { ViewpointHouseVisual } from './viewpoint-house';

import { computed } from 'vue';

import { $t } from '#/locales';

import HouseFace from './HouseFace.vue';
import { houseScene } from './viewpoint-house';
const props = defineProps<{ visual: ViewpointHouseVisual }>();
const scene = computed(() => houseScene(props.visual.variant));
const positions = [
  { letter: 'A', key: 'top', x: 150, y: 25, arrow: '↓' },
  { letter: 'B', key: 'right', x: 275, y: 150, arrow: '←' },
  { letter: 'C', key: 'bottom', x: 150, y: 275, arrow: '↑' },
  { letter: 'D', key: 'left', x: 25, y: 150, arrow: '→' },
];
</script>
<template>
  <div
    class="space-y-4"
    role="region"
    :aria-label="$t('educationLearning.houseViewTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.houseViewTitle') }}</p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.houseViewNotice') }}
    </p>
    <svg
      viewBox="0 0 300 300"
      class="mx-auto block w-full max-w-xs"
      role="img"
      :aria-label="$t('educationLearning.houseViewPlan')"
    >
      <rect
        x="102"
        y="102"
        width="96"
        height="96"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="2"
      />
      <text
        x="150"
        y="157"
        text-anchor="middle"
        fill="currentColor"
        font-size="18"
      >
        {{ $t('educationLearning.houseViewRoof') }}
      </text>
      <g v-for="position in positions" :key="position.letter">
        <text
          :x="position.x"
          :y="position.y"
          text-anchor="middle"
          fill="currentColor"
          font-size="19"
        >
          {{ position.letter }}
        </text>
        <text
          :x="position.x"
          :y="position.y + 20"
          text-anchor="middle"
          fill="currentColor"
          font-size="22"
        >
          {{ position.arrow }}
        </text>
      </g>
    </svg>
    <p v-for="(face, i) in scene.faces" :key="i" class="text-sm">
      {{
        $t('educationLearning.houseViewKnownSide', {
          position: $t(`educationLearning.housePosition_${positions[i]?.key}`),
          feature: $t(`educationLearning.houseFace_${face}`),
        })
      }}
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="(face, i) in scene.candidates"
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
        <HouseFace :face="face" />
      </div>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.houseViewLimit') }}
    </p>
  </div>
</template>
