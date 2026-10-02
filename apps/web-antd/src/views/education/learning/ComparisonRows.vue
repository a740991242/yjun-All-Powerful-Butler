<script setup lang="ts">
import type { ComparisonRowsVisual } from './comparison-rows';

import { $t } from '#/locales';
defineProps<{ visual: ComparisonRowsVisual }>();
const rows = ['A', 'B'];
</script>
<template>
  <div
    class="space-y-3"
    role="region"
    :aria-label="$t('educationLearning.comparisonRowsTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.comparisonRowsTitle') }}</p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.comparisonRowsNotice') }}
    </p>
    <p v-for="(count, row) in visual.counts" :key="row">
      {{
        $t('educationLearning.comparisonRowsCount', { row: rows[row], count })
      }}
    </p>
    <svg
      viewBox="0 0 340 150"
      class="mx-auto block w-full max-w-lg"
      role="group"
      :aria-label="$t('educationLearning.comparisonRowsPicture')"
    >
      <line
        v-for="i in Math.min(...visual.counts)"
        :key="`pair-${i}`"
        :x1="45 + (i - 1) * 14"
        :x2="45 + (i - 1) * 14"
        y1="56"
        y2="103"
        stroke="currentColor"
        stroke-dasharray="2 4"
        opacity="0.45"
        aria-hidden="true"
      />
      <g
        v-for="(count, row) in visual.counts"
        :key="row"
        role="group"
        :aria-label="
          $t('educationLearning.comparisonRowsCount', { row: rows[row], count })
        "
      >
        <text
          x="14"
          :y="row === 0 ? 56 : 121"
          fill="currentColor"
          font-size="18"
        >
          {{ rows[row] }}
        </text>
        <g
          v-for="i in count"
          :key="i"
          role="img"
          :aria-label="
            $t('educationLearning.comparisonRowsMark', {
              row: rows[row],
              position: i,
            })
          "
        >
          <circle
            v-if="row === 0"
            :cx="45 + (i - 1) * 14"
            cy="50"
            r="5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <rect
            v-else
            :x="40 + (i - 1) * 14"
            y="110"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </g>
        <text
          v-if="count === 0"
          x="45"
          :y="row === 0 ? 56 : 121"
          fill="currentColor"
          font-size="16"
        >
          {{ $t('educationLearning.comparisonRowsEmpty') }}
        </text>
      </g>
    </svg>
  </div>
</template>
