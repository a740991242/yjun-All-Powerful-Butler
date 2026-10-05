<script setup lang="ts">
import type { MarkedNumberLineVisual } from './marked-number-line';

import { $t } from '#/locales';

import { numberLineX } from './marked-number-line';

defineProps<{ visual: MarkedNumberLineVisual }>();
const ticks = Array.from({ length: 11 }, (_, index) => index * 10);
</script>

<template>
  <figure
    data-marked-number-line
    class="rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t('educationLearning.markedLineTitle') }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.markedLineLegend') }}
    </p>
    <div
      data-marked-line-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.markedLineScroll')"
      class="overflow-x-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg
        viewBox="0 0 1000 280"
        class="h-[280px] w-[1000px] max-w-none text-foreground"
        role="img"
        :aria-label="
          $t('educationLearning.markedLineDescription', {
            values: visual.values.join(', '),
          })
        "
      >
        <line
          x1="44"
          y1="220"
          x2="956"
          y2="220"
          stroke="currentColor"
          stroke-width="2"
        />
        <g v-for="tick in ticks" :key="tick" :data-line-tick="tick">
          <line
            :x1="numberLineX(tick)"
            y1="212"
            :x2="numberLineX(tick)"
            y2="228"
            stroke="currentColor"
            stroke-width="2"
          />
          <text
            :x="numberLineX(tick)"
            y="260"
            text-anchor="middle"
            fill="currentColor"
            font-size="20"
          >
            {{ tick }}
          </text>
        </g>
        <g
          v-for="(value, index) in visual.values"
          :key="value"
          :data-line-mark="value"
        >
          <line
            :x1="numberLineX(value)"
            :y1="52 + index * 32"
            :x2="numberLineX(value)"
            y2="215"
            class="text-primary"
            stroke="currentColor"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <circle
            :cx="numberLineX(value)"
            cy="220"
            r="3"
            class="text-primary"
            fill="currentColor"
          />
        </g>
        <g
          v-for="(value, index) in visual.values"
          :key="`label-${value}`"
          :data-line-label="value"
        >
          <rect
            :x="numberLineX(value) - 26"
            :y="22 + index * 32"
            width="52"
            height="28"
            fill="hsl(var(--card))"
          />
          <text
            :x="numberLineX(value)"
            :y="44 + index * 32"
            text-anchor="middle"
            fill="currentColor"
            font-size="20"
          >
            {{ value }}
          </text>
        </g>
      </svg>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.markedLineScroll') }}
    </p>
    <p class="mt-3 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.markedLineNotice') }}
    </p>
  </figure>
</template>
