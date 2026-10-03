<script lang="ts" setup>
import type { NumberStripVisual } from './number-strip';

import { computed } from 'vue';

import { $t } from '#/locales';

const props = defineProps<{ visual: NumberStripVisual }>();
const slots = computed(() => {
  let blank = 0;
  return props.visual.values.map((value, index) => ({
    value,
    position: index + 1,
    letter: value === null ? String.fromCodePoint(65 + blank++) : null,
  }));
});
</script>

<template>
  <figure class="space-y-3" data-number-strip>
    <figcaption class="text-xl font-medium">
      {{ $t('educationLearning.numberStripTitle') }}
    </figcaption>
    <div
      class="overflow-x-auto rounded-lg border border-border p-3"
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.numberStripTitle')"
    >
      <ol class="flex w-max gap-2">
        <li
          v-for="slot in slots"
          :key="slot.position"
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border text-2xl font-semibold"
          :data-number-position="slot.position"
          :aria-label="
            slot.value === null
              ? $t('educationLearning.numberStripBlank', {
                  position: slot.position,
                  letter: slot.letter,
                })
              : $t('educationLearning.numberStripKnown', {
                  position: slot.position,
                  value: slot.value,
                })
          "
        >
          {{ slot.value === null ? slot.letter : slot.value }}
        </li>
      </ol>
    </div>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.numberStripNotice') }}
    </p>
  </figure>
</template>
