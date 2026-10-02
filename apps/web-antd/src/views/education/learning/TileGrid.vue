<script setup lang="ts">
import type { TileGridVisual } from './types';

import { $t } from '#/locales';

defineProps<{ visual: TileGridVisual }>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.tileGridInstruction') }}
    </p>
    <svg
      :viewBox="`0 0 ${visual.cells[0]!.length * 64 + 8} ${visual.cells.length * 64 + 8}`"
      class="mx-auto w-full max-w-xs text-primary"
      role="img"
      :aria-label="
        $t('educationLearning.tileGridDescription', {
          rows: visual.cells.length,
          columns: visual.cells[0]!.length,
        })
      "
    >
      <g v-for="(row, r) in visual.cells" :key="r">
        <g
          v-for="(filled, c) in row"
          :key="c"
          :transform="`translate(${c * 64 + 4} ${r * 64 + 4})`"
        >
          <title>
            {{
              $t('educationLearning.tileGridCell', {
                row: r + 1,
                column: c + 1,
                state: $t(
                  filled
                    ? 'educationLearning.tileGridFilled'
                    : 'educationLearning.tileGridEmpty',
                ),
              })
            }}
          </title>
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            :fill="filled ? 'hsl(var(--primary) / 0.12)' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            :stroke-dasharray="filled ? undefined : '4 4'"
          />
          <circle v-if="filled" cx="32" cy="32" r="6" fill="currentColor" />
        </g>
      </g>
    </svg>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.tileGridNotice') }}
    </p>
  </div>
</template>
