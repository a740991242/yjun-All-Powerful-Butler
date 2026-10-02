<script setup lang="ts">
import type { ClassificationRecordVisual } from './types';

import { $t } from '#/locales';
defineProps<{ visual: ClassificationRecordVisual }>();
const symbols = { circle: '○', triangle: '△', square: '□', tick: '✓' };
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.classificationRecordNotice') }}
    </p>
    <section
      v-for="(row, index) in visual.rows"
      :key="index"
      class="min-w-0 rounded-lg border border-border p-3"
      :aria-label="row.label"
    >
      <h3 class="mb-3 break-words font-medium">{{ row.label }}</h3>
      <div
        class="flex flex-wrap gap-2"
        :aria-label="$t('educationLearning.classificationMarks')"
      >
        <span
          v-for="n in row.count"
          :key="n"
          class="flex h-8 w-8 items-center justify-center text-2xl text-primary"
          :aria-label="
            $t('educationLearning.classificationMark', {
              mark: symbols[row.mark],
            })
          "
        >
          {{ symbols[row.mark] }}
        </span>
      </div>
    </section>
  </div>
</template>
