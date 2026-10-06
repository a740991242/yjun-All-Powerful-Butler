<script setup lang="ts">
import type { FlagCode, PeriodicFlagsVisual } from './types';

import { computed } from 'vue';

import { Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { required } from './required';
const props = defineProps<{ visual: PeriodicFlagsVisual }>();
const entries = computed(() =>
  Array.from({ length: props.visual.total }, (_n, i) =>
    i < props.visual.shown ? required(props.visual.pattern[i % 3]) : null,
  ),
);
const names = { A: 'flagRed', B: 'flagBlue', C: 'flagYellow' };
const colours = { A: '#fecaca', B: '#bfdbfe', C: '#fef08a' };
function name(code: FlagCode | null) {
  return $t(`educationLearning.${code ? names[code] : 'flagUntinted'}`);
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.flagInstruction') }}
    </p>
    <div class="flex flex-wrap gap-2">
      <Tag color="red">{{ name('A') }}</Tag>
      <Tag color="blue">{{ name('B') }}</Tag>
      <Tag color="gold">{{ name('C') }}</Tag>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.flagScroll') }}
    </p>
    <div
      class="overflow-x-auto pb-2"
      tabindex="0"
      :aria-label="$t('educationLearning.flagScroll')"
    >
      <svg
        :viewBox="`0 0 ${visual.total * 38 + 8} 72`"
        :width="visual.total * 38 + 8"
        height="72"
        class="block max-w-none text-foreground"
        role="img"
        :aria-label="
          $t('educationLearning.flagLabel', {
            sequence: entries.map(name).join(', '),
          })
        "
      >
        <path
          :d="`M4 12 H${visual.total * 38 + 4}`"
          stroke="currentColor"
          stroke-width="2"
        />
        <g v-for="(entry, index) in entries" :key="index" aria-hidden="true">
          <path
            :d="`M${index * 38 + 6} 12 H${index * 38 + 38} L${index * 38 + 22} 64 Z`"
            :fill="entry ? colours[entry] : 'hsl(var(--background))'"
            stroke="currentColor"
            stroke-width="1.5"
            :stroke-dasharray="entry ? undefined : '4 3'"
          />
          <text
            :x="index * 38 + 22"
            y="35"
            text-anchor="middle"
            font-size="22"
            :fill="entry ? '#111827' : 'currentColor'"
          >
            {{ entry ?? '?' }}
          </text>
        </g>
      </svg>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.flagNotice') }}
    </p>
  </div>
</template>
