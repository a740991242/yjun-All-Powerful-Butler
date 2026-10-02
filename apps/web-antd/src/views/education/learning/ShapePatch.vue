<script setup lang="ts">
import type { PlanePatch, ShapePatchVisual } from './types';

import { $t } from '#/locales';

import ShapePatchGlyph from './ShapePatchGlyph.vue';
defineProps<{ visual: ShapePatchVisual }>();
function description(patch: PlanePatch, name: string) {
  return $t('educationLearning.shapePatchLabel', {
    name,
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
      {{ $t('educationLearning.shapePatchInstruction') }}
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
        <ShapePatchGlyph :patch="visual.target" target />
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
          <ShapePatchGlyph :patch="patch" />
        </svg>
      </div>
    </div>
  </div>
</template>
