<script setup lang="ts">
import type { OcclusionView } from './occlusion-views';

import { computed } from 'vue';

import { $t } from '#/locales';
const props = defineProps<{ view: OcclusionView }>();
const cupX = computed(() =>
  (() => {
    if (props.view === 'left') return 22;
    return props.view === 'right' ? 138 : 80;
  })(),
);
</script>
<template>
  <svg
    viewBox="0 0 160 160"
    class="mx-auto block w-full max-w-48"
    role="img"
    :aria-label="$t(`educationLearning.occlusionPicture_${view}`)"
  >
    <rect
      x="55"
      y="40"
      width="50"
      height="100"
      fill="hsl(var(--card))"
      stroke="currentColor"
      stroke-width="2"
    />
    <g v-if="view !== 'hidden'" :transform="`translate(${cupX},0)`" data-cup>
      <path
        d="M-12 114 V137 Q0 143 12 137 V114"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="2"
      />
      <ellipse
        cx="0"
        cy="114"
        rx="12"
        ry="4"
        fill="hsl(var(--card))"
        stroke="currentColor"
        stroke-width="2"
      />
    </g>
  </svg>
</template>
