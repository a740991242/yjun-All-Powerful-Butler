<script setup lang="ts">
import type { SolidFaceTracesVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  faceTraces,
  solidFacePolygons,
  tracePolygon,
} from './solid-face-traces';
const props = defineProps<{ visual: SolidFaceTracesVisual }>();
const faces = computed(() => solidFacePolygons(props.visual));
const traces = computed(() => faceTraces(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.faceTraceNotice') }}
    </p>
    <svg
      viewBox="0 0 240 210"
      width="240"
      height="210"
      class="mx-auto block h-auto w-60 max-w-full text-foreground"
      role="img"
      :aria-label="$t(`educationLearning.faceSolid_${visual.solid}`)"
    >
      <g v-for="(face, index) in faces" :key="face.letter" aria-hidden="true">
        <polygon
          :points="face.points.map((p) => p.join(',')).join(' ')"
          fill="hsl(var(--primary))"
          :fill-opacity="0.12 + index * 0.08"
          stroke="currentColor"
          stroke-width="2"
        />
        <text
          :x="
            face.points.reduce((sum, p) => sum + p[0]!, 0) / face.points.length
          "
          :y="
            face.points.reduce((sum, p) => sum + p[1]!, 0) /
              face.points.length +
            5
          "
          text-anchor="middle"
          font-size="16"
          fill="hsl(var(--foreground))"
        >
          {{ face.letter }}
        </text>
      </g>
    </svg>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div
        v-for="trace in traces"
        :key="trace.letter"
        class="flex min-w-0 flex-col items-center gap-2 rounded border border-border p-3"
      >
        <p class="font-medium">
          {{ $t('educationLearning.faceTraceLabel', { letter: trace.letter }) }}
        </p>
        <svg
          viewBox="0 0 160 160"
          width="160"
          height="160"
          class="block h-auto w-40 max-w-full text-foreground"
          role="img"
          :aria-label="
            $t(`educationLearning.faceTrace_${visual.solid}_${trace.letter}`)
          "
        >
          <polygon
            :points="
              tracePolygon(trace)
                .map((p) => p.join(','))
                .join(' ')
            "
            stroke="currentColor"
            stroke-width="2"
            fill="hsl(var(--primary) / 0.12)"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
