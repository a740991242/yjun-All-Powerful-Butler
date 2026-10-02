<script setup lang="ts">
import type { HundredFragmentsVisual } from './hundred-fragments';

import { computed } from 'vue';

import { $t } from '#/locales';

import { hundredFragments } from './hundred-fragments';
const props = defineProps<{ visual: HundredFragmentsVisual }>();
const fragments = computed(() => hundredFragments(props.visual.variant));
</script>
<template>
  <div
    class="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3"
    data-hundred-fragments
  >
    <figure
      v-for="fragment in fragments"
      :key="fragment.index"
      class="m-0 min-w-0 rounded-lg border p-3"
    >
      <figcaption class="mb-2 font-medium">
        {{
          $t('educationLearning.hundredFragmentTitle', {
            number: fragment.index + 1,
          })
        }}
      </figcaption>
      <svg
        viewBox="0 0 190 190"
        class="mx-auto block w-full max-w-64"
        role="img"
        :aria-label="`${$t(
          'educationLearning.hundredFragmentDescription',
        )} ${fragment.cells
          .map((cell) =>
            $t('educationLearning.hundredFragmentCell', {
              row: cell.y + 1,
              column: cell.x + 1,
              label: cell.label,
            }),
          )
          .join('; ')}`"
      >
        <g
          v-for="cell in fragment.cells"
          :key="`${cell.x}-${cell.y}`"
          :transform="`translate(${cell.x * 60 + 5}, ${cell.y * 60 + 5})`"
        >
          <rect width="60" height="60" fill="none" stroke="currentColor" />
          <text
            x="30"
            y="38"
            text-anchor="middle"
            fill="currentColor"
            font-size="24"
          >
            {{ cell.label }}
          </text>
        </g>
      </svg>
    </figure>
  </div>
</template>
