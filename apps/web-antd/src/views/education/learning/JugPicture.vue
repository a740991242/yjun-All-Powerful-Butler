<script setup lang="ts">
import type { JugView } from './viewpoint-jug';

import { $t } from '#/locales';
defineProps<{ view: JugView }>();
</script>
<template>
  <svg
    viewBox="0 0 150 130"
    class="mx-auto block w-full max-w-40"
    role="img"
    :aria-label="$t(`educationLearning.jugPicture_${view}`)"
  >
    <g
      :transform="
        view === 'spout-right' ? 'translate(150 0) scale(-1 1)' : undefined
      "
    >
      <template v-if="view === 'spout-left' || view === 'spout-right'">
        <path
          d="M104 49 C144 34 144 103 105 92"
          fill="none"
          stroke="currentColor"
          stroke-width="6"
        />
        <path
          d="M47 58 Q28 50 18 32 L9 34 Q15 79 43 89"
          fill="hsl(var(--card))"
          stroke="currentColor"
          stroke-width="3"
        />
      </template>
      <ellipse
        cx="75"
        cy="79"
        rx="37"
        ry="36"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="3"
      />
      <path
        d="M45 48 Q75 36 105 48"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="3"
      />
      <ellipse
        cx="75"
        cy="39"
        rx="7"
        ry="4"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="2"
      />
      <template v-if="view === 'spout-only'">
        <path
          d="M64 78 L66 57 L84 57 L86 78"
          fill="hsl(var(--card))"
          stroke="currentColor"
          stroke-width="3"
        />
        <ellipse cx="75" cy="57" rx="9" ry="4" fill="hsl(var(--foreground))" />
      </template>
      <rect
        v-else-if="view === 'handle-only'"
        x="69"
        y="53"
        width="12"
        height="44"
        rx="6"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
      />
    </g>
  </svg>
</template>
