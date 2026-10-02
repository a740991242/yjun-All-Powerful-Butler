<script setup lang="ts">
import type { MonthWeatherVisual } from './month-weather';

import { computed } from 'vue';

import { $t } from '#/locales';

import { monthWeatherRecords } from './month-weather';
const props = defineProps<{ visual: MonthWeatherVisual }>();
const groups = computed(() => {
  const records = monthWeatherRecords(props.visual.variant);
  return [records.slice(0, 10), records.slice(10, 20), records.slice(20, 30)];
});
const symbol = (code: number) => {
  if (code === 1) return '☀';
  return code === 2 ? '☁' : '☂';
};
</script>
<template>
  <div
    class="flex min-w-0 flex-col gap-3"
    :aria-label="$t('educationLearning.monthWeatherTitle')"
    role="group"
  >
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.monthWeatherNotice') }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.monthWeatherLegend') }}
    </p>
    <div
      v-for="(group, index) in groups"
      :key="index"
      class="flex min-w-0 flex-col gap-2"
      role="group"
      :aria-label="
        $t('educationLearning.monthWeatherGroup', { group: index + 1 })
      "
    >
      <p class="text-sm">
        {{ $t('educationLearning.monthWeatherGroup', { group: index + 1 }) }}
      </p>
      <div class="grid grid-cols-5 gap-2 lg:grid-cols-10">
        <div
          v-for="record in group"
          :key="record.day"
          class="flex min-w-0 flex-col items-center gap-1 rounded-lg border border-border p-1 text-primary"
          role="img"
          :aria-label="
            $t('educationLearning.monthWeatherDay', {
              day: record.day,
              weather: $t(`educationLearning.monthWeather_${record.kind}`),
            })
          "
        >
          <span class="text-xs text-muted-foreground">
            {{ $t('educationLearning.monthWeatherDate', { day: record.day }) }}
          </span>
          <span class="text-2xl" aria-hidden="true">
            {{ symbol(record.code) }}
          </span>
          <span class="text-xs">
            {{ $t(`educationLearning.monthWeather_${record.kind}`) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
