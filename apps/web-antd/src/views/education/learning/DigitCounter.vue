<script setup lang="ts">
import type { DigitCounterVisual } from './digit-counter';

import { computed } from 'vue';

import { $t } from '#/locales';
const props = defineProps<{ visual: DigitCounterVisual }>();
const rods = computed(() => [
  { key: 'tens', x: 70, count: props.visual.tens },
  { key: 'ones', x: 170, count: props.visual.ones },
]);
</script>
<template>
  <div class="space-y-3">
    <p class="text-muted-foreground">
      {{ $t('educationLearning.counterNotice') }}
    </p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 240 218"
        class="mx-auto block w-full max-w-xs h-auto min-w-[240px]"
        role="group"
        :aria-label="$t('educationLearning.counterPicture')"
      >
        <path
          d="M 30 180 H 210 M 70 22 V 180 M 170 22 V 180"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <g
          v-for="rod in rods"
          :key="rod.key"
          role="group"
          :aria-label="$t(`educationLearning.counter_${rod.key}`)"
        >
          <ellipse
            v-for="n in rod.count"
            :key="n"
            :cx="rod.x"
            :cy="176 - n * 16"
            rx="22"
            ry="6"
            fill="currentColor"
            class="text-primary"
            role="img"
            :aria-label="$t(`educationLearning.counterBead_${rod.key}`)"
          />
          <text
            :x="rod.x"
            y="204"
            text-anchor="middle"
            fill="currentColor"
            font-size="22"
          >
            {{ $t(`educationLearning.counter_${rod.key}`) }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>
