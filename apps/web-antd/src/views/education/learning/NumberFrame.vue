<script setup lang="ts">
import type { NumberFrameVisual } from './number-frame';

import { computed } from 'vue';

import { $t } from '#/locales';

import { numberFrameCells } from './number-frame';
import { required } from './required';
const props = defineProps<{ visual: NumberFrameVisual }>();
// Hidden values never enter text, attributes or accessible descriptions.
const cells = computed(() =>
  numberFrameCells(props.visual).map((c) => ({
    x: c.x,
    y: c.y,
    position: c.position,
    known: c.known,
    text: c.known ? String(c.value) : required(c.letter),
  })),
);
const size = computed(() => (props.visual.layout === 'square' ? 160 : 240));
function label(c: (typeof cells.value)[number]) {
  return $t(
    c.known ? 'educationLearning.frameGiven' : 'educationLearning.frameBlank',
    {
      position: $t(`educationLearning.framePosition_${c.position}`),
      value: c.text,
    },
  );
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.frameNotice') }}
    </p>
    <svg
      class="mx-auto w-full max-w-64 text-foreground"
      :viewBox="`-2 -2 ${size + 4} ${size + 4}`"
      role="group"
      :aria-label="$t(`educationLearning.frameLayout_${props.visual.layout}`)"
    >
      <g
        v-for="cell in cells"
        :key="cell.position"
        role="img"
        :aria-label="label(cell)"
      >
        <rect
          :x="cell.x * 80"
          :y="cell.y * 80"
          width="80"
          height="80"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <text
          :x="cell.x * 80 + 40"
          :y="cell.y * 80 + 48"
          text-anchor="middle"
          fill="currentColor"
          font-size="24"
          aria-hidden="true"
        >
          {{ cell.text }}
        </text>
      </g>
    </svg>
  </div>
</template>
