<script lang="ts" setup>
import type { BnuFinalPracticeVisual } from './bnu-final-practice';

import { computed } from 'vue';

import { $t } from '#/locales';

import { bnuFinalPracticeCells } from './bnu-final-practice';
const props = defineProps<{ visual: BnuFinalPracticeVisual }>();
const cells = computed(() => bnuFinalPracticeCells(props.visual));
const blankLetter = (index: number) =>
  String.fromCodePoint(65 + index - (cells.value.length - 3));
</script>
<template>
  <figure
    data-bnu-final-practice
    :data-scene="visual.scene"
    :data-variant="visual.variant"
    class="m-0 min-w-0 space-y-3"
  >
    <figcaption class="text-xl font-semibold leading-8">
      {{ $t(`educationLearning.finalPracticeTitle_${visual.scene}`) }}
    </figcaption>
    <p class="text-xl leading-8">
      {{
        $t(
          visual.variant === 'main'
            ? 'educationLearning.finalPracticeMain'
            : 'educationLearning.finalPracticeReview',
        )
      }}
    </p>
    <div
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.finalPracticeScroll')"
      class="overflow-x-auto rounded-lg border border-border p-3"
    >
      <div class="flex w-max gap-3">
        <div
          v-for="(mark, index) in cells"
          :key="index"
          data-final-practice-cell
          :data-mark="mark ?? 'blank'"
          class="flex w-20 flex-none flex-col items-center gap-2"
        >
          <svg
            v-if="mark"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            class="block text-primary"
            role="img"
            :aria-label="
              $t(`educationLearning.finalPracticeMark_${mark}`, {
                position: index + 1,
              })
            "
          >
            <g fill="none" stroke="currentColor" stroke-width="2.5">
              <template v-if="mark === 'happy' || mark === 'sad'">
                <circle cx="40" cy="40" r="27" />
                <circle cx="31" cy="33" r="2" fill="currentColor" />
                <circle cx="49" cy="33" r="2" fill="currentColor" />
                <path
                  :d="
                    mark === 'happy'
                      ? 'M28 47 Q40 62 52 47'
                      : 'M28 55 Q40 40 52 55'
                  "
                />
              </template>
              <template v-else-if="mark === 'right' || mark === 'left'">
                <rect x="24" y="19" width="32" height="43" />
                <path
                  :d="
                    mark === 'right'
                      ? 'M56 27 Q78 38 56 50'
                      : 'M24 27 Q2 38 24 50'
                  "
                />
              </template>
              <template v-else>
                <rect x="18" y="18" width="44" height="44" />
                <line
                  :x1="mark === 'horizontal' ? 18 : 40"
                  :y1="mark === 'horizontal' ? 40 : 18"
                  :x2="mark === 'horizontal' ? 62 : 40"
                  :y2="mark === 'horizontal' ? 40 : 62"
                  stroke-dasharray="4 3"
                />
              </template>
            </g>
          </svg>
          <div
            v-else
            role="img"
            :aria-label="
              $t('educationLearning.finalPracticeBlank', {
                letter: blankLetter(index),
              })
            "
            class="flex h-20 w-20 items-end border-b-2 border-current pb-2 text-xl text-primary"
          >
            {{ blankLetter(index) }}
          </div>
          <span class="text-xl leading-8">{{ index + 1 }}</span>
        </div>
      </div>
    </div>
    <p class="text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.finalPracticeNotice') }}
    </p>
  </figure>
</template>
