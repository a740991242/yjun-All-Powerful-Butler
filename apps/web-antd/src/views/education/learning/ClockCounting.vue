<script setup lang="ts">
import { $t } from '#/locales';

import { clockPoint } from './clock';
import { clockCountingMarks } from './clock-counting';
const marks = clockCountingMarks().map((mark) => ({
  ...mark,
  inner: clockPoint(mark.angle, mark.major ? 92 : 99),
  outer: clockPoint(mark.angle, 108),
}));
const numbers = Array.from({ length: 12 }, (_, i) => ({
  label: i + 1,
  ...clockPoint((i + 1) * 30, 78),
}));
</script>
<template>
  <div class="flex flex-col gap-3">
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 240 240"
        class="mx-auto w-full max-w-xs text-primary h-auto min-w-[220px]"
        role="img"
        :aria-label="$t('educationLearning.clockCountingDescription')"
      >
        <circle
          cx="120"
          cy="120"
          r="112"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <line
          v-for="mark in marks"
          :key="mark.index"
          :x1="mark.inner.x"
          :y1="mark.inner.y"
          :x2="mark.outer.x"
          :y2="mark.outer.y"
          stroke="currentColor"
          :stroke-width="mark.major ? 3 : 1"
        />
        <text
          v-for="number in numbers"
          :key="number.label"
          :x="number.x"
          :y="number.y + 6"
          text-anchor="middle"
          font-size="22"
          fill="currentColor"
        >
          {{ number.label }}
        </text>
      </svg>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.clockCountingLegend') }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.clockCountingNotice') }}
    </p>
  </div>
</template>
