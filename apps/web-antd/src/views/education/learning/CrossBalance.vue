<script setup lang="ts">
import type { CrossBalanceModel } from './cross-balance';

import { $t } from '#/locales';
defineProps<{ visual: CrossBalanceModel }>();
const positions = [
  { letter: 'A', key: 'top', x: 150, y: 38 },
  { letter: 'B', key: 'left', x: 38, y: 150 },
  { letter: 'C', key: 'centre', x: 150, y: 150 },
  { letter: 'D', key: 'right', x: 262, y: 150 },
  { letter: 'E', key: 'bottom', x: 150, y: 262 },
];
</script>
<template>
  <div
    class="space-y-3"
    role="region"
    :aria-label="$t('educationLearning.crossTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.crossTitle') }}</p>
    <p>
      {{
        $t('educationLearning.crossPool', { values: visual.values.join('、') })
      }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.crossNotice') }}
    </p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 300 300"
        class="mx-auto block w-full max-w-xs h-auto min-w-[300px]"
        role="group"
        :aria-label="$t('educationLearning.crossPicture')"
      >
        <path
          d="M150 38 V262 M38 150 H262"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <g
          v-for="position in positions"
          :key="position.letter"
          role="img"
          :aria-label="
            $t('educationLearning.crossPosition', {
              letter: position.letter,
              position: $t(`educationLearning.cross_${position.key}`),
            })
          "
        >
          <circle
            :cx="position.x"
            :cy="position.y"
            r="27"
            fill="hsl(var(--card))"
            stroke="currentColor"
            stroke-width="2"
          />
          <text
            :x="position.x"
            :y="position.y + 7"
            text-anchor="middle"
            fill="currentColor"
            font-size="22"
          >
            {{ position.letter }}
          </text>
        </g>
      </svg>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.crossLines') }}
    </p>
  </div>
</template>
