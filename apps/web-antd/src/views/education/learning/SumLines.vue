<script setup lang="ts">
import type { SumLinesVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

const props = defineProps<{ visual: SumLinesVisual }>();
const nodes = computed(() =>
  props.visual.layout === 'triangle'
    ? [
        { x: 160, y: 36, label: String(props.visual.given[0]) },
        { x: 40, y: 244, label: String(props.visual.given[1]) },
        { x: 280, y: 244, label: String(props.visual.given[2]) },
        { x: 100, y: 140, label: 'A' },
        { x: 160, y: 244, label: 'B' },
        { x: 220, y: 140, label: 'C' },
      ]
    : [
        { x: 160, y: 36, label: String(props.visual.given[0]) },
        { x: 40, y: 140, label: String(props.visual.given[1]) },
        { x: 160, y: 140, label: String(props.visual.given[2]) },
        { x: 160, y: 244, label: 'A' },
        { x: 280, y: 140, label: 'B' },
      ],
);
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.sumLinesInstruction') }}
    </p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 320 280"
        class="mx-auto w-full max-w-xs text-primary h-auto min-w-[320px]"
        role="img"
        :aria-label="
          visual.layout === 'triangle'
            ? $t('educationLearning.sumLinesTriangle', {
                top: visual.given[0],
                left: visual.given[1],
                right: visual.given[2],
              })
            : $t('educationLearning.sumLinesCross', {
                top: visual.given[0],
                left: visual.given[1],
                center: visual.given[2],
              })
        "
      >
        <g fill="none" stroke="currentColor" stroke-width="2">
          <path
            v-if="visual.layout === 'triangle'"
            d="M160 36 L40 244 H280 Z"
          />
          <path v-else d="M160 36 V244 M40 140 H280" />
        </g>
        <g v-for="(node, index) in nodes" :key="index">
          <circle
            :cx="node.x"
            :cy="node.y"
            r="23"
            fill="hsl(var(--background))"
            stroke="currentColor"
            stroke-width="2"
            :stroke-dasharray="index >= 3 ? '4 3' : undefined"
          />
          <text
            :x="node.x"
            :y="node.y + 7"
            text-anchor="middle"
            font-size="22"
            fill="currentColor"
          >
            {{ node.label }}
          </text>
        </g>
      </svg>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.sumLinesNotice') }}
    </p>
  </div>
</template>
