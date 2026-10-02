<script setup lang="ts">
import type { SolidRowVisual } from './types';

import { $t } from '#/locales';

import SolidGlyph from './SolidGlyph.vue';

defineProps<{ visual: SolidRowVisual }>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.solidRowInstruction') }}
    </p>
    <div class="overflow-x-auto">
      <div class="flex" :style="{ minWidth: `${visual.shapes.length * 80}px` }">
        <svg
          v-for="(shape, index) in visual.shapes"
          :key="index"
          viewBox="0 0 240 170"
          class="h-20 min-w-20 flex-1 text-primary"
          role="img"
          :aria-label="
            $t('educationLearning.solidRowItem', {
              position: index + 1,
              shape: $t(`educationLearning.shape_${shape}`),
            })
          "
        >
          <SolidGlyph :shape="shape" />
        </svg>
      </div>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.solidRowNotice') }}
    </p>
  </div>
</template>
