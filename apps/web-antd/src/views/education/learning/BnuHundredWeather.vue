<script lang="ts" setup>
import type { BnuHundredWeatherVisual } from './bnu-hundred-weather';

import { $t } from '#/locales';

import { hundredWeatherRows } from './bnu-hundred-weather';
defineProps<{ visual: BnuHundredWeatherVisual }>();
</script>
<template>
  <figure class="space-y-3" data-hundred-weather :data-variant="visual.variant">
    <figcaption class="text-xl font-medium">
      {{ $t('educationLearning.hundredWeatherTitle') }}
    </figcaption>
    <p class="text-xl leading-8">
      {{ $t('educationLearning.hundredWeatherLegend') }}
    </p>
    <div
      class="overflow-x-auto rounded-lg border border-border p-3"
      tabindex="0"
      data-weather-scroll
      :aria-label="$t('educationLearning.hundredWeatherScroll')"
    >
      <svg
        :viewBox="`0 0 ${visual.variant === 'main' ? 600 : 300} ${visual.variant === 'main' ? 420 : 240}`"
        class="w-full max-w-[600px] text-primary"
        :class="visual.variant === 'main' ? 'min-w-[600px]' : 'min-w-[360px]'"
        role="img"
        :aria-label="$t('educationLearning.hundredWeatherTitle')"
      >
        <g v-for="(row, r) in hundredWeatherRows(visual.variant)" :key="r">
          <g
            v-for="(type, c) in row"
            :key="c"
            :transform="`translate(${c * 60},${r * 60})`"
            :data-weather-cell="type"
            role="img"
            :aria-label="
              $t(
                type === 'S'
                  ? 'educationLearning.hundredWeatherSunny'
                  : 'educationLearning.hundredWeatherCloudy',
                { row: r + 1, column: c + 1 },
              )
            "
          >
            <rect
              x="1"
              y="1"
              width="58"
              height="58"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            />
            <circle
              cx="30"
              cy="26"
              r="10"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M30 10v4 M30 38v4 M14 26h4 M42 26h4 M19 15l3 3 M38 34l3 3 M19 37l3-3 M38 18l3-3"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              v-if="type === 'C'"
              d="M14 43 C8 43 8 33 15 33 C15 23 28 23 31 32 C39 27 46 33 43 38 C51 40 47 48 40 48 H17 C12 48 10 45 14 43Z"
              fill="hsl(var(--card))"
              stroke="currentColor"
              stroke-width="2"
            />
          </g>
        </g>
      </svg>
    </div>
    <p class="text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.hundredWeatherScroll') }}
    </p>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t(`educationLearning.hundredWeatherNotice_${visual.variant}`) }}
    </p>
  </figure>
</template>
