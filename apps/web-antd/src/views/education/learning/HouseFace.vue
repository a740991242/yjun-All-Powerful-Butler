<script setup lang="ts">
import type { HouseFace } from './viewpoint-house';

import { $t } from '#/locales';
defineProps<{ face: HouseFace }>();
</script>
<template>
  <svg
    viewBox="0 0 140 140"
    class="mx-auto block w-full max-w-40"
    role="img"
    :aria-label="$t(`educationLearning.houseFace_${face}`)"
  >
    <rect
      x="20"
      y="20"
      width="100"
      height="100"
      fill="hsl(var(--card))"
      stroke="currentColor"
      stroke-width="2"
    />
    <template v-if="face === 'door'">
      <path
        d="M52 120 V72 Q70 49 88 72 V120"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle cx="79" cy="91" r="2" fill="currentColor" />
    </template>
    <template v-else-if="face === 'windows'">
      <rect
        v-for="x in [34, 80]"
        :key="x"
        :x="x"
        y="54"
        width="26"
        height="32"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        d="M47 54 V86 M34 70 H60 M93 54 V86 M80 70 H106"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
      />
    </template>
    <circle
      v-else-if="face === 'circle'"
      cx="70"
      cy="70"
      r="23"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
</template>
