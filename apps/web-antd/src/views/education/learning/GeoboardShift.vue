<script setup lang="ts">
import type { GeoboardShiftState, GeoboardShiftVisual } from './types';

import { computed } from 'vue';

import { Button } from 'ant-design-vue';

import { $t } from '#/locales';

import {
  boardCorners,
  boardShape,
  isGeoboardShiftState,
  moveUpperEdge,
} from './geoboard-shift';
const props = defineProps<{
  visual: GeoboardShiftVisual;
  state?: GeoboardShiftState;
  interactive?: boolean;
}>();
const emit = defineEmits<{ change: [state: GeoboardShiftState] }>();
const initial = computed(() => ({
  width: props.visual.width,
  shift: props.visual.shift,
}));
const current = computed(() =>
  props.interactive &&
  isGeoboardShiftState(props.state) &&
  props.state.width === props.visual.width
    ? props.state
    : initial.value,
);
const corners = computed(() => boardCorners(current.value));
const directions = ['left', 'right'] as const;
function canMove(direction: 'left' | 'right') {
  return moveUpperEdge(current.value, direction).shift !== current.value.shift;
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.geoboardShiftNotice') }}
    </p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 280 200"
        width="280"
        height="200"
        class="mx-auto block h-auto w-full max-w-lg text-foreground min-w-[280px]"
        role="img"
        :aria-label="
          $t('educationLearning.geoboardShiftBoard', {
            points: corners
              .map(([x, y], i) => `${['A', 'B', 'C', 'D'][i]} (${x},${y})`)
              .join('; '),
          })
        "
      >
        <g fill="currentColor" aria-hidden="true">
          <g v-for="row in 5" :key="row">
            <circle
              v-for="column in 7"
              :key="column"
              :cx="20 + (column - 1) * 40"
              :cy="20 + (row - 1) * 40"
              r="2"
            />
          </g>
        </g>
        <polygon
          :points="
            corners.map(([x, y]) => `${20 + x * 40},${20 + y * 40}`).join(' ')
          "
          fill="hsl(var(--primary) / 0.12)"
          stroke="hsl(var(--primary))"
          stroke-width="3"
        />
        <g v-for="(point, index) in corners" :key="index" aria-hidden="true">
          <circle
            :cx="20 + point[0] * 40"
            :cy="20 + point[1] * 40"
            r="4"
            fill="hsl(var(--background))"
            stroke="currentColor"
            stroke-width="2"
          />
          <text
            :x="20 + point[0] * 40"
            :y="20 + point[1] * 40 + (index < 2 ? -10 : 20)"
            text-anchor="middle"
            font-size="22"
            fill="hsl(var(--foreground))"
          >
            {{ ['A', 'B', 'C', 'D'][index] }}
          </text>
        </g>
      </svg>
    </div>
    <template v-if="interactive">
      <p class="font-medium" aria-live="polite">
        {{
          $t('educationLearning.geoboardShiftResult', {
            shape: $t(`educationLearning.joinShape_${boardShape(current)}`),
          })
        }}
      </p>
      <div class="flex flex-wrap gap-3">
        <Button
          v-for="direction in directions"
          :key="direction"
          class="!min-h-11"
          :disabled="!canMove(direction)"
          @click="emit('change', moveUpperEdge(current, direction))"
        >
          {{ $t(`educationLearning.geoboardShift_${direction}`) }}
        </Button>
        <Button class="!min-h-11" @click="emit('change', { ...initial })">
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </template>
  </div>
</template>
