<script setup lang="ts">
import type { JoinAction } from './shape-join';
import type { ThreePieceJoinState } from './three-piece-join';

import { computed } from 'vue';

import { Button } from 'ant-design-vue';

import { $t } from '#/locales';

import { fold } from './fold';
import { required } from './required';
import {
  initialThreePieceJoin,
  isThreePieceJoinState,
  moveThreePiece,
  threePiecePoints,
  threePieceShape,
} from './three-piece-join';

const props = defineProps<{
  interactive?: boolean;
  state?: ThreePieceJoinState;
}>();
const emit = defineEmits<{ change: [state: ThreePieceJoinState] }>();
const current = computed(() =>
  isThreePieceJoinState(props.state) ? props.state : initialThreePieceJoin(),
);
const shape = computed(() => threePieceShape(current.value));
const polygons = computed(() =>
  current.value.pieces.map((piece, index) => {
    const points = threePiecePoints(piece, index);
    return {
      points: points.map((point) => `${point.x},${point.y}`).join(' '),
      x: fold(points, 0, (sum, point) => sum + point.x) / points.length,
      y: fold(points, 0, (sum, point) => sum + point.y) / points.length,
    };
  }),
);
const actions: JoinAction[] = ['left', 'right', 'up', 'down', 'rotate'];
const labels: Record<JoinAction, string> = {
  left: 'moveLeft',
  right: 'moveRight',
  up: 'moveUp',
  down: 'moveDown',
  rotate: 'rotateJoinPiece',
};
function canMove(action: JoinAction) {
  const before = required(current.value.pieces[current.value.selected]);
  const after = required(
    moveThreePiece(current.value, action).pieces[current.value.selected],
  );
  return (
    before.x !== after.x || before.y !== after.y || before.turn !== after.turn
  );
}
function select(selected: number) {
  emit('change', { ...structuredClone(current.value), selected });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>{{ $t('educationLearning.threePieceInstruction') }}</p>
    <svg
      viewBox="-0.25 -0.25 6.5 4.5"
      class="mx-auto w-full max-w-xl rounded border border-border"
      role="img"
      :aria-label="
        $t('educationLearning.threePieceBoard', {
          pieces: current.pieces
            .map((piece, index) =>
              $t('educationLearning.joinPiecePosition', {
                letter: ['A', 'B', 'C'][index],
                x: piece.x,
                y: piece.y,
                turn: piece.turn * 90,
              }),
            )
            .join('; '),
        })
      "
    >
      <g stroke="hsl(var(--border))" stroke-width="0.02">
        <path v-for="x in 7" :key="`x-${x}`" :d="`M${x - 1} 0 V4`" />
        <path v-for="y in 5" :key="`y-${y}`" :d="`M0 ${y - 1} H6`" />
      </g>
      <g v-for="(polygon, index) in polygons" :key="index">
        <polygon
          :points="polygon.points"
          fill="hsl(var(--primary))"
          :fill-opacity="0.15 + index * 0.15"
          stroke="hsl(var(--primary))"
          :stroke-width="current.selected === index ? 0.08 : 0.035"
        />
        <text
          :x="polygon.x"
          :y="polygon.y + 0.1"
          text-anchor="middle"
          font-size="0.3"
          fill="hsl(var(--foreground))"
        >
          {{ ['A', 'B', 'C'][index] }}
        </text>
      </g>
    </svg>
    <p class="font-medium" aria-live="polite">
      {{
        shape
          ? $t('educationLearning.joinedShape', {
              shape: $t(`educationLearning.joinShape_${shape}`),
            })
          : $t('educationLearning.threePieceUnrecognized')
      }}
    </p>
    <div v-if="interactive" class="flex flex-wrap gap-3">
      <Button
        v-for="index in 3"
        :key="index"
        class="!min-h-11"
        :type="current.selected === index - 1 ? 'primary' : 'default'"
        :aria-pressed="current.selected === index - 1"
        @click="select(index - 1)"
      >
        {{
          $t('educationLearning.selectJoinPiece', {
            letter: ['A', 'B', 'C'][index - 1],
          })
        }}
      </Button>
    </div>
    <div v-if="interactive" class="flex flex-wrap gap-3">
      <Button
        v-for="action in actions"
        :key="action"
        class="!min-h-11"
        :disabled="!canMove(action)"
        @click="emit('change', moveThreePiece(current, action))"
      >
        {{ $t(`educationLearning.${labels[action]}`) }}
      </Button>
      <Button
        class="!min-h-11"
        @click="emit('change', initialThreePieceJoin())"
      >
        {{ $t('educationLearning.resetVisual') }}
      </Button>
    </div>
    <p class="text-muted-foreground">
      {{ $t('educationLearning.threePieceScope') }}
    </p>
  </div>
</template>
