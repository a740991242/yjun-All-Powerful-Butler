<script setup lang="ts">
import type { NumberTowerVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';
const props = defineProps<{ visual: NumberTowerVisual }>();
const nodes = computed(() => {
  let blank = 0;
  return props.visual.rows.flatMap((row, rowIndex) =>
    row.map((value, column) => ({
      x: 160 + (column - rowIndex / 2) * 90,
      y: 38 + rowIndex * 78,
      row: rowIndex + 1,
      column: column + 1,
      label:
        value === null ? String.fromCodePoint(65 + blank++) : String(value),
      blank: value === null,
    })),
  );
});
const description = computed(() =>
  nodes.value
    .map((node) =>
      $t(
        node.blank
          ? 'educationLearning.towerCellBlank'
          : 'educationLearning.towerCellGiven',
        { row: node.row, column: node.column, value: node.label },
      ),
    )
    .join('; '),
);
</script>
<template>
  <div class="flex flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.towerInstruction') }}
    </p>
    <svg
      viewBox="0 0 320 235"
      class="mx-auto w-full max-w-xs text-primary"
      role="img"
      :aria-label="description"
    >
      <g v-for="(node, index) in nodes" :key="index">
        <rect
          :x="node.x - 39"
          :y="node.y - 28"
          width="78"
          height="56"
          rx="8"
          fill="hsl(var(--background))"
          stroke="currentColor"
          stroke-width="2"
          :stroke-dasharray="node.blank ? '4 3' : undefined"
        />
        <text
          :x="node.x"
          :y="node.y + 8"
          text-anchor="middle"
          font-size="24"
          fill="currentColor"
        >
          {{ node.label }}
        </text>
      </g>
    </svg>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.towerNotice') }}
    </p>
  </div>
</template>
