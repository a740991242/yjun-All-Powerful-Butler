<script lang="ts" setup>
import type { TriangleRowsVisual } from './triangle-rows';

import { $t } from '#/locales';

import { triangleRowDots } from './triangle-rows';
defineProps<{ visual: TriangleRowsVisual }>();
</script>

<template>
  <figure class="space-y-3" data-triangle-rows>
    <figcaption class="text-xl font-medium">
      {{ $t('educationLearning.triangleRowsTitle') }}
    </figcaption>
    <ol class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="(rows, index) in visual.rows"
        :key="index"
        class="rounded-lg border border-border p-3"
        :data-triangle-position="index + 1"
      >
        <p class="mb-3 text-xl font-medium">
          {{
            $t('educationLearning.triangleRowsGroup', { position: index + 1 })
          }}
        </p>
        <svg
          viewBox="0 0 180 160"
          class="mx-auto w-full max-w-60 text-primary"
          role="img"
          :aria-label="
            $t('educationLearning.triangleRowsDiagram', { position: index + 1 })
          "
        >
          <circle
            v-for="dot in triangleRowDots(rows)"
            :key="`${dot.row}-${dot.column}`"
            :cx="dot.x"
            :cy="dot.y"
            r="9"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            role="img"
            :aria-label="
              $t('educationLearning.triangleRowsDot', {
                row: dot.row,
                column: dot.column,
              })
            "
          />
        </svg>
      </li>
    </ol>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.triangleRowsNotice') }}
    </p>
  </figure>
</template>
