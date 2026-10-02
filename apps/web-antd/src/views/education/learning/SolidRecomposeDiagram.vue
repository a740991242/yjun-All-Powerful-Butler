<script setup lang="ts">
import type { SolidPiece } from './solid-recompose';

import { computed } from 'vue';

import { solidRecomposeCanvas } from './solid-recompose';
const props = defineProps<{ piece: SolidPiece; label: string }>();
const cubes = computed(() =>
  props.piece.kind === 'cubes' ? solidRecomposeCanvas(props.piece.cells) : [],
);
const bottom = 190;
const height = computed(() => props.piece.height * 30);
</script>
<template>
  <svg
    viewBox="0 0 240 220"
    class="mx-auto w-full max-w-60 text-primary"
    role="img"
    :aria-label="label"
    data-recompose-diagram
  >
    <template v-if="piece.kind === 'cubes'">
      <g
        v-for="(c, i) in cubes"
        :key="i"
        :transform="`translate(${c.x} ${c.y})`"
        fill="hsl(var(--primary) / 0.12)"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
        data-recompose-cube
      >
        <path
          d="M0 0 L18 -18 H50 V14 L32 32 H0 Z"
          fill="hsl(var(--card))"
          stroke="none"
        />
        <path d="M0 0 L18 -18 H50 L32 0 Z" />
        <path d="M32 0 L50 -18 V14 L32 32 Z" />
        <path d="M0 0 H32 V32 H0 Z" />
      </g>
    </template>
    <g
      v-else
      fill="hsl(var(--primary) / 0.12)"
      stroke="currentColor"
      stroke-width="2"
      data-recompose-cylinder
    >
      <path
        :d="`M60 ${bottom - height} A60 15 0 0 0 180 ${bottom - height} V${bottom} A60 15 0 0 1 60 ${bottom} Z`"
      />
      <ellipse cx="120" :cy="bottom - height" rx="60" ry="15" />
      <path
        v-for="n in piece.segmented ? piece.height - 1 : 0"
        :key="n"
        :d="`M60 ${bottom - n * 30} A60 15 0 0 0 180 ${bottom - n * 30}`"
        fill="none"
        stroke-dasharray="4 3"
      />
    </g>
  </svg>
</template>
