<script setup lang="ts">
import type { PlanePatch } from './types';

import { patchTrianglePoints } from './shape-patch';
defineProps<{ patch: PlanePatch; target?: boolean }>();
</script>
<template>
  <g
    stroke="currentColor"
    stroke-width="2.5"
    :stroke-dasharray="target ? '5 3' : undefined"
    :fill="target ? 'none' : 'hsl(var(--primary) / 0.12)'"
    aria-hidden="true"
  >
    <circle
      v-if="patch.shape === 'circle'"
      cx="72"
      cy="72"
      :r="patch.width * 12"
    />
    <polygon
      v-else-if="patch.shape === 'triangle'"
      :points="patchTrianglePoints(patch)"
    />
    <rect
      v-else
      :x="72 - patch.width * 12"
      :y="72 - patch.height * 12"
      :width="patch.width * 24"
      :height="patch.height * 24"
    />
  </g>
</template>
