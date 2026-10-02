<script setup lang="ts">
import type { BookGroupsVisual } from './final-counting';

import { $t } from '#/locales';
defineProps<{ visual: BookGroupsVisual }>();
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.bookGroupsInstruction', { size: visual.size }) }}
    </p>
    <div class="grid gap-3 sm:grid-cols-2">
      <section
        v-for="group in visual.groups"
        :key="group"
        class="rounded-lg border border-border p-3"
        :aria-label="$t('educationLearning.group', { number: group })"
      >
        <div class="flex flex-wrap gap-2">
          <span
            v-for="book in visual.size"
            :key="book"
            class="h-9 w-5 rounded-sm border-2 border-primary bg-primary/10"
            role="img"
            :aria-label="$t('educationLearning.bookToken')"
          ></span>
        </div>
      </section>
    </div>
  </div>
</template>
