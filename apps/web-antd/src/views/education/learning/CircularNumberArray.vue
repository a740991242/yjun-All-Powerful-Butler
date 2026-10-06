<script setup lang="ts">
import type { CircularNumberArrayVisual } from './circular-number-array';

import { computed } from 'vue';

import { $t } from '#/locales';

import { circularNumberCells } from './circular-number-array';
import { required } from './required';
const props = defineProps<{ visual: CircularNumberArrayVisual }>();
// Do not expose hidden numeric answers in text, attributes or accessible names.
const cells = computed(() =>
  circularNumberCells(props.visual).map(
    ({ ring, sector, known, value, letter }) => ({
      ring,
      sector,
      known,
      text: known ? String(value) : required(letter),
    }),
  ),
);
function point(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: 320 + radius * Math.cos(radians),
    y: 320 + radius * Math.sin(radians),
  };
}
function path(ring: number, sector: number) {
  const start = -108 + sector * 36;
  const end = start + 36;
  const inner = 90 + ring * 45;
  const outer = inner + 45;
  const a = point(inner, start);
  const b = point(outer, start);
  const c = point(outer, end);
  const d = point(inner, end);
  return `M ${a.x} ${a.y} L ${b.x} ${b.y} A ${outer} ${outer} 0 0 1 ${c.x} ${c.y} L ${d.x} ${d.y} A ${inner} ${inner} 0 0 0 ${a.x} ${a.y} Z`;
}
function label(cell: (typeof cells.value)[number]) {
  return $t(
    cell.known
      ? 'educationLearning.circularGiven'
      : 'educationLearning.circularBlank',
    {
      ring: cell.ring + 1,
      sector: String.fromCodePoint(65 + cell.sector),
      value: cell.text,
    },
  );
}
</script>
<template>
  <div
    class="min-w-0 space-y-3"
    role="region"
    :aria-label="$t('educationLearning.circularTitle')"
  >
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.circularNotice') }}
    </p>
    <div
      class="max-w-full overflow-x-auto rounded-lg border border-border"
      tabindex="0"
      :aria-label="$t('educationLearning.circularScroll')"
    >
      <svg
        viewBox="0 0 640 640"
        class="mx-auto block w-full min-w-[600px] max-w-2xl text-foreground"
        role="group"
        :aria-label="$t('educationLearning.circularTitle')"
      >
        <g
          v-for="cell in cells"
          :key="`${cell.ring}-${cell.sector}`"
          role="img"
          :aria-label="label(cell)"
        >
          <path
            :d="path(cell.ring, cell.sector)"
            :fill="cell.known ? 'hsl(var(--card))' : 'hsl(var(--muted))'"
            stroke="currentColor"
            stroke-width="1"
          />
          <text
            :x="point(112.5 + cell.ring * 45, -90 + cell.sector * 36).x"
            :y="point(112.5 + cell.ring * 45, -90 + cell.sector * 36).y + 7"
            fill="currentColor"
            text-anchor="middle"
            font-size="22"
            aria-hidden="true"
          >
            {{ cell.text }}
          </text>
        </g>
        <text
          v-for="sector in 10"
          :key="sector"
          :x="point(300, -90 + (sector - 1) * 36).x"
          :y="point(300, -90 + (sector - 1) * 36).y + 7"
          fill="currentColor"
          text-anchor="middle"
          font-size="22"
        >
          {{ String.fromCharCode(64 + sector) }}
        </text>
        <text
          x="320"
          y="315"
          fill="currentColor"
          text-anchor="middle"
          font-size="22"
        >
          {{ $t('educationLearning.circularRings') }}
        </text>
        <text
          x="320"
          y="342"
          fill="currentColor"
          text-anchor="middle"
          font-size="22"
        >
          1 → 2 → 3 → 4
        </text>
      </svg>
    </div>
    <p class="text-sm">{{ $t('educationLearning.circularDirection') }}</p>
  </div>
</template>
