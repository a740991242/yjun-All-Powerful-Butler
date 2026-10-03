<script setup lang="ts">
import type { RegionalEditionAction } from './regional-application';

import { ref } from 'vue';

import { Button, Select } from 'ant-design-vue';

import { $t } from '#/locales';

import { suzhouGenericCourses } from './generic-courses';

const emit = defineEmits<{
  apply: [actions: RegionalEditionAction[]];
  clear: [];
}>();
const volume = ref<'lower' | 'upper'>('upper');
function changeVolume(value: unknown) {
  if (value !== 'upper' && value !== 'lower') return;
  volume.value = value;
  emit('clear');
}
</script>
<template>
  <section
    class="flex flex-col gap-4 rounded-xl border border-border p-4"
    :aria-label="$t('educationLearning.suzhouGenericTitle')"
  >
    <h3 class="text-base font-semibold">
      {{ $t('educationLearning.suzhouGenericTitle') }}
    </h3>
    <p class="leading-7 text-muted-foreground">
      {{ $t('educationLearning.suzhouGenericScope') }}
    </p>
    <p class="leading-7">
      {{ $t('educationLearning.suzhouGenericSubjects') }}
    </p>
    <div class="flex flex-col gap-2 sm:max-w-sm">
      <label for="education-generic-volume">
        {{ $t('educationLearning.regionalVolume') }}
      </label>
      <Select
        id="education-generic-volume"
        size="large"
        :value="volume"
        :aria-label="$t('educationLearning.suzhouGenericVolume')"
        :options="[
          { value: 'upper', label: $t('educationLearning.upper') },
          { value: 'lower', label: $t('educationLearning.lower') },
        ]"
        @update:value="changeVolume"
      />
    </div>
    <Button
      type="primary"
      class="!min-h-11 !h-auto !whitespace-normal !py-2"
      @click="emit('apply', suzhouGenericCourses(volume))"
    >
      {{ $t('educationLearning.suzhouGenericApply') }}
    </Button>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.suzhouGenericRecords') }}
    </p>
  </section>
</template>
