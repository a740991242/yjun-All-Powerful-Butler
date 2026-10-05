<script lang="ts" setup>
import type { BnuFinalGeometryVisual } from './bnu-final-geometry';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  bnuFinalGeometryDots,
  bnuFinalGeometryFrame,
  bnuFinalGeometryParts,
  finalGeometryLabel,
} from './bnu-final-geometry';
const props = defineProps<{ visual: BnuFinalGeometryVisual }>();
const parts = computed(() => bnuFinalGeometryParts(props.visual));
const dots = computed(() => bnuFinalGeometryDots(props.visual));
const fold = computed(() =>
  ['diagonal', 'parallel', 'square-part'].includes(props.visual.scene),
);
const frame = computed(() => bnuFinalGeometryFrame(props.visual));
const pointList = (points: [number, number][]) =>
  points.map((p) => p.join(',')).join(' ');
</script>
<template>
  <figure
    data-bnu-final-geometry
    :data-scene="visual.scene"
    :data-variant="visual.variant"
    class="m-0 min-w-0 space-y-3"
  >
    <figcaption class="text-xl font-semibold leading-8">
      {{ $t(`educationLearning.finalGeometryTitle_${visual.scene}`) }}
    </figcaption>
    <p class="text-xl leading-8">
      {{
        $t(
          visual.scene === 'dots'
            ? visual.variant === 'main'
              ? 'educationLearning.finalGeometryDotsMain'
              : 'educationLearning.finalGeometryDotsReview'
            : 'educationLearning.finalGeometrySite',
        )
      }}
    </p>
    <div
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.finalGeometryScroll')"
      class="overflow-x-auto rounded-lg border border-border p-2"
    >
      <svg
        :width="frame.width"
        :height="frame.height"
        :viewBox="`${frame.x} ${frame.y} ${frame.width} ${frame.height}`"
        class="block h-auto max-w-full text-primary"
        role="img"
        :aria-label="$t('educationLearning.finalGeometryDiagram')"
      >
        <g
          v-for="part in parts"
          :key="part.id"
          :data-final-geometry-part="part.id"
          :data-part-shape="part.shape"
          role="img"
          :aria-label="
            part.circle
              ? $t('educationLearning.finalGeometryCircle', {
                  letter: part.id,
                  x: part.circle.x,
                  y: part.circle.y,
                  r: part.circle.r,
                })
              : $t('educationLearning.finalGeometryPolygon', {
                  letter: part.id,
                  points: pointList(part.points),
                })
          "
        >
          <circle
            v-if="part.circle"
            :cx="part.circle.x"
            :cy="part.circle.y"
            :r="part.circle.r"
            fill="currentColor"
            fill-opacity="0.16"
            stroke="currentColor"
            stroke-width="2"
          />
          <polygon
            v-else
            :points="pointList(part.points)"
            fill="currentColor"
            fill-opacity="0.16"
            stroke="currentColor"
            stroke-width="2"
          />
          <text
            v-if="fold"
            :x="finalGeometryLabel(part)[0]"
            :y="finalGeometryLabel(part)[1]"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="currentColor"
            font-size="28"
          >
            {{ part.id }}
          </text>
        </g>
        <circle
          v-for="(dot, i) in dots"
          :key="i"
          data-final-geometry-dot
          :cx="dot[0]"
          :cy="dot[1]"
          r="3"
          fill="currentColor"
        />
      </svg>
    </div>
    <p class="text-xl leading-8 text-muted-foreground">
      {{
        $t(
          fold
            ? 'educationLearning.finalGeometryFoldNotice'
            : visual.scene === 'dots'
              ? 'educationLearning.finalGeometryDotNotice'
              : 'educationLearning.finalGeometryCollageNotice',
        )
      }}
    </p>
  </figure>
</template>
