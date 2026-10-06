<script setup lang="ts">
import type { JoinAction } from './shape-join';
import type { TriangleMosaicState, TriangleMosaicVisual } from './types';

import { computed } from 'vue';

import { Button } from 'ant-design-vue';

import { $t } from '#/locales';

import {
  matchingTriangleState,
  moveTriangleMosaic,
  triangleMosaicEdges,
  triangleMosaicPoints,
  triangleMosaicShape,
} from './triangle-mosaic';

const props = defineProps<{
  visual: TriangleMosaicVisual;
  state?: TriangleMosaicState;
  interactive?: boolean;
}>();
const emit = defineEmits<{ change: [state: TriangleMosaicState] }>();
const current = computed(() =>
  props.interactive && matchingTriangleState(props.state, props.visual)
    ? props.state
    : { selected: 0, pieces: props.visual.pieces },
);
const polygons = computed(() =>
  current.value.pieces.map((item) => triangleMosaicPoints(item)),
);
const edges = computed(() => triangleMosaicEdges(current.value.pieces));
const actions = ['left', 'right', 'up', 'down', 'rotate'] as const;
const labels = {
  left: 'moveLeft',
  right: 'moveRight',
  up: 'moveUp',
  down: 'moveDown',
  rotate: 'rotateTriangle',
};
const letter = (index: number) => String.fromCodePoint(65 + index);
const diagramLabel = computed(() =>
  $t('educationLearning.triangleMosaicDiagram', {
    description: props.visual.seams
      ? polygons.value
          .map(
            (points, i) =>
              `${letter(i)}: ${points.map((p) => `(${p.x},${p.y})`).join('–')}`,
          )
          .join('; ')
      : edges.value
          .map((e) => `(${e[0]},${e[1]})–(${e[2]},${e[3]})`)
          .join('; '),
  }),
);
function select(selected: number) {
  emit('change', {
    selected,
    pieces: current.value.pieces.map((p) => ({ ...p })),
  });
}
function canMove(action: JoinAction) {
  return (
    JSON.stringify(moveTriangleMosaic(current.value, action).pieces) !==
    JSON.stringify(current.value.pieces)
  );
}
function reset() {
  emit('change', {
    selected: 0,
    pieces: props.visual.pieces.map((p) => ({ ...p })),
  });
}
</script>

<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.triangleMosaicNotice') }}
    </p>
    <p class="text-xl">{{ $t('educationLearning.squareMosaicUnit') }}</p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 256 224"
        width="256"
        height="224"
        class="mx-auto block h-auto w-full max-w-sm text-foreground min-w-[336px]"
        role="img"
        :aria-label="diagramLabel"
      >
        <path
          d="M32 20 H64 L32 52 Z"
          fill="hsl(var(--primary) / 0.16)"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <g
          v-if="interactive"
          stroke="hsl(var(--border))"
          stroke-width="1"
          aria-hidden="true"
        >
          <path
            v-for="x in 7"
            :key="`x-${x}`"
            :d="`M${32 + (x - 1) * 32} 72 V200`"
          />
          <path
            v-for="y in 5"
            :key="`y-${y}`"
            :d="`M32 ${72 + (y - 1) * 32} H224`"
          />
        </g>
        <g v-for="(points, index) in polygons" :key="index" aria-hidden="true">
          <polygon
            :points="
              points.map((p) => `${32 + p.x * 32},${72 + p.y * 32}`).join(' ')
            "
            fill="hsl(var(--primary) / 0.16)"
            :stroke="visual.seams ? 'hsl(var(--primary))' : 'none'"
            :stroke-width="interactive && current.selected === index ? 3 : 1.5"
          />
          <text
            v-if="visual.seams"
            :x="32 + (points.reduce((sum, p) => sum + p.x, 0) / 3) * 32"
            :y="76 + (points.reduce((sum, p) => sum + p.y, 0) / 3) * 32"
            font-size="16"
            text-anchor="middle"
            fill="currentColor"
          >
            {{ letter(index) }}
          </text>
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
    </div>
    <template v-if="interactive">
      <p class="font-medium" aria-live="polite">
        {{
          $t('educationLearning.triangleMosaicResult', {
            shape: $t(
              `educationLearning.squareMosaicShape_${triangleMosaicShape(current) ?? 'other'}`,
            ),
          })
        }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ $t('educationLearning.triangleMosaicControls') }}
      </p>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="(_, index) in current.pieces"
          :key="index"
          class="!min-h-11 !min-w-11"
          :type="current.selected === index ? 'primary' : 'default'"
          :aria-pressed="current.selected === index"
          :aria-label="
            $t('educationLearning.triangleMosaicSelect', {
              letter: letter(index),
            })
          "
          @click="select(index)"
        >
          {{ letter(index) }}
        </Button>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="action in actions"
          :key="action"
          class="!min-h-11"
          :disabled="!canMove(action)"
          @click="emit('change', moveTriangleMosaic(current, action))"
        >
          {{ $t(`educationLearning.${labels[action]}`) }}
        </Button>
        <Button class="!min-h-11" @click="reset">
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </template>
  </div>
</template>
