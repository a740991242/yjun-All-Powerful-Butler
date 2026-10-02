<script setup lang="ts">
import type { PlaneCardsVisual } from './types';
defineProps<{ card: PlaneCardsVisual['cards'][number] }>();
</script>
<template>
  <g
    :transform="`translate(72 72) rotate(${card.turn}) scale(${card.size === 1 ? 0.6 : 1})`"
    fill="hsl(var(--primary) / 0.12)"
    stroke="currentColor"
    stroke-width="2.5"
    aria-hidden="true"
  >
    <rect
      v-if="card.shape === 'rectangle'"
      x="-48"
      y="-24"
      width="96"
      height="48"
    />
    <rect
      v-else-if="card.shape === 'square'"
      x="-36"
      y="-36"
      width="72"
      height="72"
    />
    <path v-else-if="card.shape === 'triangle'" d="M0 -42 L42 30 L-42 30 Z" />
    <circle v-else cx="0" cy="0" r="36" />
  </g>
</template>
