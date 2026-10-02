<script setup lang="ts">
import type { SolidShape } from './types';
defineProps<{ shape: SolidShape; fill?: string }>();
</script>
<template>
  <g
    :fill="fill ?? 'hsl(var(--primary) / 0.12)'"
    stroke="currentColor"
    stroke-width="3"
    stroke-linejoin="round"
  >
    <path
      v-if="shape === 'cube'"
      d="M50 50 H150 V145 H50 Z M50 50 L90 15 H190 L150 50 M150 145 L190 110 V15"
    />
    <path
      v-else-if="shape === 'cuboid'"
      d="M20 55 H170 V140 H20 Z M20 55 L65 20 H215 L170 55 M170 140 L215 105 V20"
    />
    <g v-else-if="shape === 'cylinder'">
      <path d="M55 40 V130 C55 160 185 160 185 130 V40" />
      <ellipse cx="120" cy="40" rx="65" ry="22" />
    </g>
    <g v-else>
      <circle cx="120" cy="85" r="65" />
      <ellipse cx="120" cy="85" rx="65" ry="18" stroke-dasharray="5 4" />
      <path d="M120 20 C75 45 75 125 120 150" fill="none" />
    </g>
  </g>
</template>
