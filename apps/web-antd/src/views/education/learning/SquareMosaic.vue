<script setup lang="ts">
import type { SquareMosaicState, SquareMosaicVisual } from './types';

import { computed } from 'vue';

import { Button } from 'ant-design-vue';

import { $t } from '#/locales';

import { required } from './required';
import {
  matchingMosaicState,
  mosaicCount,
  mosaicEdges,
  mosaicShape,
  toggleMosaic,
} from './square-mosaic';
const props = defineProps<{
  visual: SquareMosaicVisual;
  state?: SquareMosaicState;
  interactive?: boolean;
}>();
const emit = defineEmits<{ change: [state: SquareMosaicState] }>();
const current = computed(() =>
  props.interactive && matchingMosaicState(props.state, props.visual)
    ? props.state
    : { cells: props.visual.cells },
);
const count = computed(() => mosaicCount(current.value.cells));
const budget = computed(() => mosaicCount(props.visual.cells));
const cells = computed(() =>
  current.value.cells.flatMap((row, y) =>
    row.map((active, x) => ({ x, y, active })),
  ),
);
const edges = computed(() => mosaicEdges(current.value.cells));
const columns = computed(() => required(current.value.cells[0]).length);
const diagramLabel = computed(() =>
  $t('educationLearning.squareMosaicDiagram', {
    columns: columns.value,
    rows: current.value.cells.length,
    description: props.visual.seams
      ? cells.value
          .filter((c) => c.active)
          .map((c) => `${String.fromCodePoint(65 + c.x)}${c.y + 1}`)
          .join('; ')
      : edges.value
          .map((e) => `(${e[0]},${e[1]})–(${e[2]},${e[3]})`)
          .join('; '),
  }),
);
function reset() {
  emit('change', { cells: props.visual.cells.map((row) => [...row]) });
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.squareMosaicNotice') }}
    </p>
    <svg
      viewBox="0 0 256 256"
      width="256"
      height="256"
      class="mx-auto block h-auto w-full max-w-sm text-foreground"
      role="img"
      :aria-label="diagramLabel"
    >
      <rect
        x="32"
        y="20"
        width="32"
        height="32"
        fill="hsl(var(--primary) / 0.12)"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <text x="76" y="42" font-size="13" fill="currentColor">
        {{ $t('educationLearning.squareMosaicUnit') }}
      </text>
      <g
        v-if="interactive"
        fill="currentColor"
        font-size="12"
        aria-hidden="true"
      >
        <text
          v-for="column in columns"
          :key="`col-${column}`"
          :x="48 + (column - 1) * 32"
          y="65"
          text-anchor="middle"
        >
          {{ String.fromCharCode(64 + column) }}
        </text>
        <text
          v-for="row in current.cells.length"
          :key="`row-${row}`"
          x="20"
          :y="92 + (row - 1) * 32"
          text-anchor="middle"
        >
          {{ row }}
        </text>
      </g>
      <g
        v-if="interactive"
        stroke="hsl(var(--border))"
        stroke-width="1"
        aria-hidden="true"
      >
        <rect
          v-for="cell in cells"
          :key="`${cell.x}-${cell.y}`"
          :x="32 + cell.x * 32"
          :y="72 + cell.y * 32"
          width="32"
          height="32"
          fill="none"
        />
      </g>
      <g
        fill="hsl(var(--primary) / 0.16)"
        shape-rendering="crispEdges"
        aria-hidden="true"
      >
        <rect
          v-for="cell in cells.filter((c) => c.active)"
          :key="`${cell.x}-${cell.y}`"
          :x="32 + cell.x * 32"
          :y="72 + cell.y * 32"
          width="32"
          height="32"
          :stroke="visual.seams ? 'hsl(var(--primary))' : 'none'"
          stroke-width="1.5"
        />
      </g>
      <g
        stroke="hsl(var(--primary))"
        stroke-width="2"
        fill="none"
        aria-hidden="true"
      >
        <line
          v-for="(edge, index) in edges"
          :key="index"
          :x1="32 + edge[0] * 32"
          :y1="72 + edge[1] * 32"
          :x2="32 + edge[2] * 32"
          :y2="72 + edge[3] * 32"
        />
      </g>
    </svg>
    <template v-if="interactive">
      <p class="font-medium" aria-live="polite">
        {{
          $t('educationLearning.squareMosaicResult', {
            count,
            remaining: budget - count,
            shape: $t(
              `educationLearning.squareMosaicShape_${mosaicShape(current.cells)}`,
            ),
          })
        }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ $t('educationLearning.squareMosaicControls') }}
      </p>
      <div class="overflow-x-auto">
        <div
          class="inline-grid gap-2"
          :style="{
            gridTemplateColumns: `repeat(${columns},minmax(44px,1fr))`,
            minWidth: `${columns * 44 + (columns - 1) * 8}px`,
          }"
        >
          <Button
            v-for="cell in cells"
            :key="`${cell.x}-${cell.y}`"
            class="!min-h-11"
            :type="cell.active ? 'primary' : 'default'"
            :aria-pressed="cell.active"
            :aria-label="
              $t('educationLearning.squareMosaicCell', {
                position: `${String.fromCharCode(65 + cell.x)}${cell.y + 1}`,
                state: $t(
                  `educationLearning.squareMosaic_${cell.active ? 'filled' : 'empty'}`,
                ),
              })
            "
            :disabled="!cell.active && count === budget"
            @click="
              emit('change', toggleMosaic(visual, current, cell.y, cell.x))
            "
          >
            {{ String.fromCharCode(65 + cell.x) }}{{ cell.y + 1 }}
          </Button>
        </div>
      </div>
      <Button class="!min-h-11 self-start" @click="reset">
        {{ $t('educationLearning.resetVisual') }}
      </Button>
    </template>
  </div>
</template>
