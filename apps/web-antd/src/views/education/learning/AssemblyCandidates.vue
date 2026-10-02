<script setup lang="ts">
import type { Outline } from './assembly-candidates';
import type { AssemblyCandidatesVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { assemblyFigures } from './assembly-candidates';
const props = defineProps<{ visual: AssemblyCandidatesVisual }>();
const figures = computed(() => assemblyFigures(props.visual));
const groups = computed(
  () =>
    [
      { key: 'materials', outlines: figures.value.pieces },
      { key: 'targets', outlines: figures.value.targets },
    ] as const,
);
function coordinates(points: Outline) {
  const h = Math.max(...points.map((p) => p[1]));
  const w = Math.max(...points.map((p) => p[0]));
  return points
    .map(([x, y]) => `${80 + (x - w / 2) * 28},${80 + (y - h / 2) * 28}`)
    .join(' ');
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.assemblyCandidatesNotice') }}
    </p>
    <section
      v-for="group in groups"
      :key="group.key"
      class="flex min-w-0 flex-col gap-3"
    >
      <h4 class="font-medium">
        {{ $t(`educationLearning.assemblyCandidates_${group.key}`) }}
      </h4>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="(points, index) in group.outlines"
          :key="index"
          class="w-full max-w-40"
        >
          <svg
            viewBox="0 0 160 160"
            width="160"
            height="160"
            class="block h-auto w-full text-foreground"
            role="img"
            :aria-label="
              $t('educationLearning.assemblyCandidatesOutline', {
                label:
                  group.key === 'materials'
                    ? index + 1
                    : String.fromCharCode(65 + index),
                group: $t(`educationLearning.assemblyCandidates_${group.key}`),
                vertices: points.map((p) => `(${p.join(',')})`).join('; '),
              })
            "
          >
            <polygon
              :points="coordinates(points)"
              :fill="
                group.key === 'materials'
                  ? 'hsl(var(--primary) / 0.12)'
                  : 'none'
              "
              stroke="hsl(var(--primary))"
              stroke-width="2"
              :stroke-dasharray="group.key === 'targets' ? '5 3' : undefined"
            />
          </svg>
          <p class="text-center font-medium">
            {{
              group.key === 'materials'
                ? index + 1
                : String.fromCharCode(65 + index)
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
