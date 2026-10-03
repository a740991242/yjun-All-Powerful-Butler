<script setup lang="ts">
import type { BnuDayClockVisual } from './clock';
import type { ClockVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { bnuDayClockHands, clockHands, clockPoint } from './clock';

const props = defineProps<{ visual: BnuDayClockVisual | ClockVisual }>();
const hands = computed(() =>
  props.visual.kind === 'bnu-day-clock'
    ? bnuDayClockHands()
    : clockHands(props.visual),
);
const short = computed(() => clockPoint(hands.value.hour, 52));
const long = computed(() => clockPoint(hands.value.minute, 82));
const description = computed(() => {
  const visual = props.visual;
  if (visual.kind === 'bnu-day-clock')
    return $t('educationLearning.bnuDayClockDescription');
  if (visual.minute === 0)
    return $t('educationLearning.clockWholeDescription', { hour: visual.hour });
  return $t('educationLearning.clockHalfDescription', {
    hour: visual.hour,
    next: visual.hour === 12 ? 1 : visual.hour + 1,
  });
});
const numbers = Array.from({ length: 12 }, (_, i) => ({
  label: i + 1,
  ...clockPoint((i + 1) * 30, 99),
}));
</script>
<template>
  <div class="flex flex-col gap-3">
    <svg
      viewBox="0 0 240 240"
      class="mx-auto w-full max-w-xs text-primary"
      role="img"
      :aria-label="description"
      :data-clock-kind="visual.kind"
    >
      <circle
        cx="120"
        cy="120"
        r="117"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <text
        v-for="number in numbers"
        :key="number.label"
        :x="number.x"
        :y="number.y + 6"
        text-anchor="middle"
        font-size="17"
        fill="currentColor"
      >
        {{ number.label }}
      </text>
      <line
        x1="120"
        y1="120"
        :x2="long.x"
        :y2="long.y"
        stroke="currentColor"
        stroke-width="3"
        stroke-dasharray="5 3"
      />
      <line
        x1="120"
        y1="120"
        :x2="short.x"
        :y2="short.y"
        stroke="currentColor"
        stroke-width="6"
        stroke-linecap="round"
      />
      <circle cx="120" cy="120" r="5" fill="currentColor" />
    </svg>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.clockLegend') }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{
        $t(
          visual.kind === 'bnu-day-clock'
            ? 'educationLearning.bnuDayClockNotice'
            : 'educationLearning.clockNotice',
        )
      }}
    </p>
  </div>
</template>
