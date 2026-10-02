<script setup lang="ts">
import type { RotatingPatch, RotatingPatchVisual } from './types';

import { $t } from '#/locales';

import ShapePatchGlyph from './ShapePatchGlyph.vue';
defineProps<{ visual: RotatingPatchVisual }>();
function description(piece: RotatingPatch, name: string) {
  const patch = piece.patch;
  return $t('educationLearning.rotatingPatchLabel', {
    name,
    turn: piece.turn,
    geometry:
      $t(`educationLearning.planeGeometry_${patch.shape}`) +
      (patch.shape === 'triangle'
        ? `; ${$t('educationLearning.shapePatchTriangleGeometry')}`
        : ''),
    width: patch.width,
    height: patch.height,
  });
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.rotatingPatchInstruction') }}
    </p>
    <div
      class="flex w-fit max-w-full flex-col items-center rounded-lg border border-border bg-card p-2"
    >
      <span class="font-medium">
        {{ $t('educationLearning.shapePatchTarget') }}
      </span>
      <svg
        viewBox="0 0 144 144"
        width="144"
        height="144"
        class="block h-auto w-24 max-w-full text-foreground sm:w-36"
        role="img"
        :aria-label="
          description(visual.target, $t('educationLearning.shapePatchTarget'))
        "
      >
        <g :transform="`rotate(${visual.target.turn} 72 72)`">
          <ShapePatchGlyph :patch="visual.target.patch" target />
        </g>
      </svg>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.shapePatchCandidates') }}
    </p>
    <div class="flex flex-wrap gap-3">
      <div
        v-for="(patch, index) in visual.candidates"
        :key="index"
        class="flex max-w-full flex-col items-center rounded-lg border border-border bg-card p-2"
      >
        <span class="font-medium">{{ String.fromCharCode(65 + index) }}</span>
        <svg
          viewBox="0 0 144 144"
          width="144"
          height="144"
          class="block h-auto w-24 max-w-full text-foreground sm:w-36"
          role="img"
          :aria-label="description(patch, String.fromCharCode(65 + index))"
        >
          <g :transform="`rotate(${patch.turn} 72 72)`">
            <ShapePatchGlyph :patch="patch.patch" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
