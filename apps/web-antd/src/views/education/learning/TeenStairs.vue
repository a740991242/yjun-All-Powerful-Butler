<script setup lang="ts">
import type { TeenStairsVisual } from './teen-stairs';

import { computed } from 'vue';

import { $t } from '#/locales';

import { teenStairs } from './teen-stairs';

const props = defineProps<{ visual: TeenStairsVisual }>();
const levels = computed(() => teenStairs(props.visual));
const outline = computed(
  () =>
    `M20 560 ${levels.value.map(({ x, y }) => `V${y} H${x + 56}`).join(' ')} V560 Z`,
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-teen-stairs>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.teenStairsNotice') }}
    </p>
    <p
      v-if="visual.variant === 'review'"
      class="text-sm leading-6 text-muted-foreground"
    >
      {{ $t('educationLearning.teenStairsReview') }}
    </p>
    <div
      class="overflow-x-auto pb-2"
      tabindex="0"
      :aria-label="$t('educationLearning.teenStairsScroll')"
      data-teen-stairs-scroll
    >
      <svg
        viewBox="0 0 1120 590"
        class="block w-[1120px] max-w-none"
        role="img"
        :aria-label="$t('educationLearning.teenStairsTitle')"
      >
        <path
          :d="outline"
          fill="hsl(var(--primary) / 0.08)"
          stroke="currentColor"
          stroke-width="2"
        />
        <g v-for="step in levels" :key="step.level">
          <g v-if="step.label" :data-stair-marker="step.label">
            <circle
              :cx="step.x + 28"
              :cy="step.y - 30"
              r="17"
              fill="hsl(var(--primary) / 0.16)"
              stroke="currentColor"
            />
            <text
              :x="step.x + 28"
              :y="step.y - 23"
              text-anchor="middle"
              fill="currentColor"
              font-size="20"
              font-weight="600"
            >
              {{ step.label }}
            </text>
            <title>
              {{
                $t('educationLearning.teenStairsMarker', { label: step.label })
              }}
            </title>
          </g>
          <text
            v-else
            :x="step.x + 28"
            :y="step.y + 21"
            text-anchor="middle"
            fill="currentColor"
            font-size="20"
            data-stair-given
          >
            {{ step.level }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>
