<script setup lang="ts">
import type { BeadChainVisual } from './types';

import { computed } from 'vue';

import { beadGroupB } from './bead-chain';
const props = defineProps<{ visual: BeadChainVisual }>();
const segments = computed(() =>
  Array.from({ length: props.visual.groups }, (_, i) => i + 1)
    .filter((i) => i <= props.visual.hidden[0] || i > props.visual.hidden[1])
    .map((i) =>
      i === props.visual.hidden[0]
        ? { index: i, beads: null }
        : {
            index: i,
            beads: [
              'A',
              ...Array.from({ length: beadGroupB(props.visual, i) }, () => 'B'),
            ],
          },
    ),
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.beadRule', { first: visual.firstB }) }}
    </p>
    <div
      class="overflow-x-auto pb-2"
      tabindex="0"
      :aria-label="$t('educationLearning.beadScroll')"
    >
      <div class="flex w-max items-center gap-3">
        <div
          v-for="segment in segments"
          :key="segment.index"
          class="flex shrink-0 flex-col items-center gap-2"
        >
          <template v-if="segment.beads">
            <span class="text-sm">
              {{ $t('educationLearning.beadGroup', { index: segment.index }) }}
            </span>
            <div
              class="flex items-center gap-1"
              role="img"
              :aria-label="
                $t('educationLearning.beadVisible', {
                  index: segment.index,
                  beads: segment.beads.join(', '),
                })
              "
            >
              <span
                v-for="(bead, index) in segment.beads"
                :key="index"
                aria-hidden="true"
                class="flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold"
                :class="
                  bead === 'A'
                    ? 'border-primary text-primary'
                    : 'border-amber-600 text-amber-600'
                "
              >
                {{ bead }}
              </span>
            </div>
          </template>
          <div
            v-else
            class="flex min-h-20 w-28 items-center justify-center rounded border-2 border-dashed p-3 text-center text-sm"
            role="img"
            :aria-label="
              $t('educationLearning.beadCovered', {
                start: visual.hidden[0],
                end: visual.hidden[1],
              })
            "
          >
            {{
              $t('educationLearning.beadCovered', {
                start: visual.hidden[0],
                end: visual.hidden[1],
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.beadNotice') }}
    </p>
  </div>
</template>
