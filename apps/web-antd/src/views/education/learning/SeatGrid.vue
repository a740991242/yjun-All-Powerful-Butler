<script lang="ts" setup>
import type { SeatGridVisual } from './types';

defineProps<{ visual: SeatGridVisual }>();
</script>

<template>
  <div class="mx-auto flex w-full max-w-md flex-col gap-3">
    <p class="text-center text-base font-semibold text-primary">
      ↑ {{ $t('educationLearning.seatFront') }}
    </p>
    <div
      class="grid grid-cols-3 gap-3"
      role="img"
      :aria-label="
        $t('educationLearning.seatDescription', {
          names: visual.rows.map((row) => row.join('、')).join('；'),
        })
      "
    >
      <div
        v-for="label in visual.rows.flat()"
        :key="label"
        class="flex min-h-20 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card p-2"
      >
        <span aria-hidden="true" class="text-xl text-primary">↑</span>
        <span class="break-all text-center text-lg font-medium">
          {{ label }}
        </span>
      </div>
    </div>
    <p class="text-center text-base font-semibold text-primary">
      {{ $t('educationLearning.seatRear') }}
    </p>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.seatNotice') }}
    </p>
  </div>
</template>
