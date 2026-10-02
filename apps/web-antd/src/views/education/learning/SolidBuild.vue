<script setup lang="ts">
import type { SolidBuildVisual } from './types';

import { solidBuildSlots } from './solid-build';
import SolidGlyph from './SolidGlyph.vue';
defineProps<{ visual: SolidBuildVisual }>();
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.solidBuildInstruction') }}
    </p>
    <svg
      viewBox="0 0 480 460"
      class="mx-auto w-full max-w-md text-primary"
      role="img"
      :aria-label="
        $t('educationLearning.solidBuildDescription', {
          parts: visual.shapes
            .map((shape, i) =>
              $t('educationLearning.solidBuildPart', {
                position: i + 1,
                shape: $t(`educationLearning.shape_${shape}`),
              }),
            )
            .join(' '),
        })
      "
    >
      <g
        v-for="(shape, index) in visual.shapes"
        :key="index"
        :transform="`translate(${solidBuildSlots[index]![0]}, ${solidBuildSlots[index]![1]}) scale(${solidBuildSlots[index]![2] / 240})`"
        data-solid-part
      >
        <SolidGlyph :shape="shape" />
      </g>
    </svg>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.solidBuildNotice') }}
    </p>
  </div>
</template>
