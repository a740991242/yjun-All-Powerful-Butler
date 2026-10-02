<script setup lang="ts">
import type { ShapeCollageVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { collagePieces } from './shape-collage';
import ShapePatchGlyph from './ShapePatchGlyph.vue';
const props = defineProps<{ visual: ShapeCollageVisual }>();
const pieces = computed(() => collagePieces(props.visual));
const label = computed(() =>
  $t('educationLearning.collageDiagram', {
    description: pieces.value
      .map(
        (p, i) =>
          `${String.fromCodePoint(65 + i)}: ${$t(`educationLearning.shape_${p.patch.shape}`)} (${p.x},${p.y}), ${p.patch.width}×${p.patch.height}`,
      )
      .join('; '),
  }),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.collageNotice') }}
    </p>
    <svg
      viewBox="0 0 256 176"
      width="256"
      height="176"
      class="mx-auto block h-auto w-full max-w-sm text-primary"
      role="img"
      :aria-label="label"
    >
      <g
        v-for="(piece, index) in pieces"
        :key="index"
        :transform="`translate(${16 + piece.x * 16 - 48} ${8 + piece.y * 16 - 48}) scale(0.6666666667)`"
      >
        <ShapePatchGlyph :patch="piece.patch" />
        <text
          x="72"
          y="77"
          font-size="15"
          text-anchor="middle"
          fill="hsl(var(--foreground))"
          aria-hidden="true"
        >
          {{ String.fromCharCode(65 + index) }}
        </text>
      </g>
    </svg>
  </div>
</template>
