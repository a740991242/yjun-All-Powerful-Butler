<script setup lang="ts">
import type { SolidPatternVisual } from './solid-pattern';

import { computed } from 'vue';

import { $t } from '#/locales';

import { solidPatternAt } from './solid-pattern';
import SolidGlyph from './SolidGlyph.vue';
const props = defineProps<{ visual: SolidPatternVisual }>();
const entries = computed(() =>
  Array.from({ length: 9 }, (_, index) =>
    index < 6 ? solidPatternAt(props.visual, index + 1) : null,
  ),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-solid-pattern>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.solidPatternInstruction') }}
    </p>
    <div
      class="overflow-x-auto pb-2"
      tabindex="0"
      :aria-label="$t('educationLearning.solidPatternScroll')"
      data-pattern-scroll
    >
      <div class="flex w-max gap-2">
        <svg
          v-for="(item, index) in entries"
          :key="index"
          viewBox="0 0 240 220"
          class="h-48 w-48 shrink-0 text-primary"
          role="img"
          :data-pattern-position="index + 1"
          :aria-label="
            item
              ? $t('educationLearning.solidPatternItem', {
                  position: index + 1,
                  shape: $t(`educationLearning.shape_${item.shape}`),
                  size: $t(`educationLearning.solidPatternSize_${item.size}`),
                })
              : $t('educationLearning.solidPatternBlank', {
                  position: index + 1,
                })
          "
        >
          <g
            v-if="item"
            :transform="
              item.size === 'small'
                ? 'translate(60 42.5) scale(0.5)'
                : undefined
            "
            :data-pattern-size="item.size"
          >
            <SolidGlyph :shape="item.shape" />
          </g>
          <g v-else>
            <rect
              x="40"
              y="25"
              width="160"
              height="130"
              rx="8"
              fill="none"
              stroke="currentColor"
              stroke-dasharray="8 5"
            />
            <text
              x="120"
              y="110"
              text-anchor="middle"
              font-size="48"
              fill="currentColor"
            >
              ?
            </text>
          </g>
          <text
            x="120"
            y="205"
            text-anchor="middle"
            font-size="28"
            fill="currentColor"
          >
            {{ index + 1 }}
          </text>
        </svg>
      </div>
    </div>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.solidPatternScroll') }}
    </p>
  </div>
</template>
