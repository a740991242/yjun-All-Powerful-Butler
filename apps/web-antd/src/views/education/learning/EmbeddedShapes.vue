<script setup lang="ts">
import type { EmbeddedShapesVisual } from './embedded-shapes';

import { computed } from 'vue';

import { $t } from '#/locales';

import { embeddedGeometry, embeddedPieces } from './embedded-shapes';
import { required } from './required';
import { triangleMosaicEdges } from './triangle-mosaic';
const props = defineProps<{ visual: EmbeddedShapesVisual }>();
const model = computed(() => embeddedGeometry(props.visual));
const edges = computed(() =>
  triangleMosaicEdges(required(embeddedPieces[props.visual.pattern])),
);
const pos = (n: number) => 35 + n * 70;
const regionPoints = computed(() =>
  model.value.region?.points.map(([x, y]) => `${pos(x)},${pos(y)}`).join(' '),
);
</script>
<template>
  <div
    class="space-y-3"
    role="region"
    :aria-label="$t('educationLearning.embeddedTitle')"
  >
    <p class="text-sm">{{ $t('educationLearning.embeddedInstruction') }}</p>
    <svg
      viewBox="0 0 280 280"
      class="mx-auto block w-full max-w-[420px]"
      role="img"
      :aria-label="
        $t('educationLearning.embeddedDiagram', { number: visual.pattern + 1 })
      "
    >
      <path
        v-for="i in 4"
        :key="`h${i}`"
        :d="`M35 ${pos(i - 1)} H245 M${pos(i - 1)} 35 V245`"
        stroke="currentColor"
        stroke-opacity="0.25"
        stroke-dasharray="2 4"
        fill="none"
      />
      <polygon
        v-for="(piece, i) in model.pieces"
        :key="i"
        :points="piece.map((p) => `${pos(p.x)},${pos(p.y)}`).join(' ')"
        fill="hsl(var(--primary) / 20%)"
      />
      <path
        v-for="(edge, i) in edges"
        :key="`edge${i}`"
        :d="`M${pos(edge[0])} ${pos(edge[1])} L${pos(edge[2])} ${pos(edge[3])}`"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <polygon
        v-if="regionPoints"
        data-embedded-region
        :points="regionPoints"
        fill="hsl(var(--primary) / 15%)"
        stroke="currentColor"
        stroke-width="4"
        stroke-dasharray="8 5"
      />
      <path
        d="M175 8 L245 8 L175 78 Z"
        stroke="currentColor"
        stroke-width="1.5"
        fill="hsl(var(--primary) / 20%)"
      />
    </svg>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.embeddedNotice') }}
    </p>
  </div>
</template>
