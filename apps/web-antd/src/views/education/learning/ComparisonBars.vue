<script setup lang="ts">
import type { ComparisonBarsVisual } from './comparison-bars';

import { computed } from 'vue';

import { $t } from '#/locales';
const props = defineProps<{ visual: ComparisonBarsVisual }>();
// Schematic lengths convey the relation only; they are not a hidden numeric scale.
const targetEnd = computed(() =>
  (() => {
    if (props.visual.difference === 0) return 220;
    return (() => {
      if (props.visual.direction === 'more') return 264;
      return props.visual.difference === props.visual.reference ? 44 : 176;
    })();
  })(),
);
const differenceStart = computed(() =>
  props.visual.direction === 'more' ? 220 : targetEnd.value,
);
const differenceEnd = computed(() =>
  props.visual.direction === 'more' ? targetEnd.value : 220,
);
</script>
<template>
  <div
    class="space-y-3"
    role="region"
    :aria-label="$t('educationLearning.comparisonBarsTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.comparisonBarsTitle') }}</p>
    <p>
      {{
        $t('educationLearning.comparisonBarsReference', {
          count: visual.reference,
        })
      }}
    </p>
    <p>
      {{
        $t(`educationLearning.comparisonBars_${visual.direction}`, {
          count: visual.difference,
        })
      }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.comparisonBarsNotice') }}
    </p>
    <div
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 310 205"
        class="mx-auto block w-full max-w-lg h-auto min-w-[310px]"
        role="img"
        :aria-label="$t('educationLearning.comparisonBarsPicture')"
      >
        <text x="14" y="70" fill="currentColor" font-size="22">A</text>
        <path
          d="M44 59 V71 M44 65 H220 M220 59 V71"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <text
          x="132"
          y="47"
          text-anchor="middle"
          fill="currentColor"
          font-size="22"
        >
          {{ visual.reference }}
        </text>
        <path
          d="M44 77 V155 M220 77 V137"
          fill="none"
          stroke="currentColor"
          stroke-dasharray="3 5"
          opacity="0.45"
        />
        <text x="14" y="143" fill="currentColor" font-size="22">B</text>
        <path
          :d="`M44 132 V144 M44 138 H${visual.direction === 'more' && visual.difference > 0 ? 220 : targetEnd} M${targetEnd} 132 V144`"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <path
          v-if="visual.difference > 0"
          :d="`M${differenceStart} 130 V142 M${differenceStart} 136 H${differenceEnd} M${differenceEnd} 130 V142`"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-dasharray="4 3"
        />
        <text
          :x="(differenceStart + differenceEnd) / 2"
          y="117"
          text-anchor="middle"
          fill="currentColor"
          font-size="22"
        >
          {{ visual.difference }}
        </text>
        <path
          :d="`M44 168 V176 H${targetEnd} V168`"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <text
          :x="(44 + targetEnd) / 2"
          y="200"
          text-anchor="middle"
          fill="currentColor"
          font-size="22"
        >
          ?
        </text>
      </svg>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.comparisonBarsUnknown') }}
    </p>
  </div>
</template>
