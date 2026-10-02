<script setup lang="ts">
import type { CubeCell } from './cube-pair';

import { computed } from 'vue';

import { cubePairCanvas } from './cube-pair';
const props = defineProps<{ groups: CubeCell[][]; label: string }>();
const cubes = computed(() => cubePairCanvas(props.groups));
</script>
<template>
  <svg
    viewBox="0 0 240 200"
    class="mx-auto w-full max-w-60 text-primary"
    role="img"
    :aria-label="label"
    data-cube-pair-diagram
  >
    <g
      v-for="(cube, index) in cubes"
      :key="index"
      :transform="`translate(${cube.x} ${cube.y})`"
      :fill="`hsl(var(--primary) / ${cube.group ? 0.35 : 0.1})`"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
      :data-cube-group="cube.group"
    >
      <path d="M0 0 L9 -9 H49 L40 0 Z" />
      <path d="M40 0 L49 -9 V31 L40 40 Z" />
      <path d="M0 0 H40 V40 H0 Z" />
    </g>
  </svg>
</template>
