<script setup lang="ts">
import type {
  RegionalApplicationQuery,
  RegionalEditionAction,
  SchoolSystem,
} from './regional-application';

import { computed, ref, watch } from 'vue';

import { Alert, Button, Select, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { regionalApplicationPlan } from './regional-application';
import {
  regionalCities,
  regionalProvinces,
  regionalSchools,
} from './regional-locations';

const emit = defineEmits<{
  apply: [actions: RegionalEditionAction[]];
  clear: [];
}>();
const province = ref('jiangsu');
const city = ref('suzhou');
const school = ref('none');
const academicYear = ref('2026-2027');
const schoolSystem = ref<SchoolSystem>('unknown');
const volume = ref<'lower' | 'upper'>('upper');
const provinces = computed(() =>
  regionalProvinces.map((value) => ({
    value,
    label: $t(`educationLearning.regionalProvince_${value}`),
  })),
);
const cities = computed(() => [
  { value: 'none', label: $t('educationLearning.regionalNoCity') },
  ...regionalCities(province.value).map((value) => ({
    value,
    label: $t(`educationLearning.regionalCity_${value}`),
  })),
]);
const schools = computed(() => [
  { value: 'none', label: $t('educationLearning.regionalNoSchool') },
  ...regionalSchools(province.value, city.value).map((value) => ({
    value,
    label: $t(`educationLearning.regionalSchool_${value}`),
  })),
]);
// An old school must never survive a location change, even when returning to Jiangsu.
watch(
  province,
  () => {
    city.value = 'none';
    school.value = 'none';
  },
  { flush: 'sync' },
);
watch(
  city,
  () => {
    school.value = 'none';
  },
  { flush: 'sync' },
);
const volumes = computed(() => [
  { value: 'upper', label: $t('educationLearning.upper') },
  { value: 'lower', label: $t('educationLearning.lower') },
]);
const query = computed<RegionalApplicationQuery>(() => ({
  province: province.value,
  city: city.value === 'none' ? '' : city.value,
  school: school.value === 'none' ? '' : school.value,
  academicYear: academicYear.value,
  stage: 'primary',
  grade: 'p1',
  subject: 'math',
  schoolSystem: schoolSystem.value,
  volume: volume.value,
}));
const results = computed(() => regionalApplicationPlan(query.value));
const actions = computed(() =>
  results.value.flatMap((item) => (item.action ? [item.action] : [])),
);
watch(query, () => emit('clear'), { flush: 'sync' });
function apply() {
  const available = regionalApplicationPlan(query.value).flatMap((item) =>
    item.action ? [item.action] : [],
  );
  if (available.length > 0) emit('apply', available);
}
</script>
<template>
  <section
    class="flex flex-col gap-4 rounded-xl border border-border p-4"
    :aria-label="$t('educationLearning.regionalTitle')"
  >
    <h3 class="text-base font-semibold">
      {{ $t('educationLearning.regionalTitle') }}
    </h3>
    <p class="leading-7 text-muted-foreground">
      {{ $t('educationLearning.regionalScope') }}
    </p>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="flex min-w-0 flex-col gap-2">
        <label for="education-region-province">
          {{ $t('educationLearning.regionalProvince') }}
        </label>
        <Select
          id="education-region-province"
          v-model:value="province"
          size="large"
          :options="provinces"
          show-search
          :filter-option="
            (input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
          "
          :aria-label="$t('educationLearning.regionalProvince')"
        />
      </div>
      <div class="flex min-w-0 flex-col gap-2">
        <label for="education-region-city">
          {{ $t('educationLearning.regionalCity') }}
        </label>
        <Select
          id="education-region-city"
          v-model:value="city"
          size="large"
          :options="cities"
          :aria-label="$t('educationLearning.regionalCity')"
        />
      </div>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="flex min-w-0 flex-col gap-2">
        <label for="education-region-school">
          {{ $t('educationLearning.regionalSchool') }}
        </label>
        <Select
          id="education-region-school"
          v-model:value="school"
          size="large"
          :options="schools"
          :aria-label="$t('educationLearning.regionalSchool')"
        />
      </div>
      <div class="flex min-w-0 flex-col gap-2">
        <label for="education-region-year">
          {{ $t('educationLearning.regionalYear') }}
        </label>
        <Select
          id="education-region-year"
          v-model:value="academicYear"
          size="large"
          :options="[
            { value: '2026-2027', label: '2026—2027' },
            { value: '2025-2026', label: '2025—2026' },
          ]"
          :aria-label="$t('educationLearning.regionalYear')"
        />
      </div>
      <div class="flex min-w-0 flex-col gap-2">
        <label for="education-region-volume">
          {{ $t('educationLearning.regionalVolume') }}
        </label>
        <Select
          id="education-region-volume"
          v-model:value="volume"
          size="large"
          :options="volumes"
          :aria-label="$t('educationLearning.regionalVolume')"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2 md:max-w-sm">
      <label for="education-region-system">
        {{ $t('educationLearning.regionalSystem') }}
      </label>
      <Select
        id="education-region-system"
        v-model:value="schoolSystem"
        size="large"
        :aria-label="$t('educationLearning.regionalSystem')"
        :options="[
          {
            value: 'unknown',
            label: $t('educationLearning.regionalSystem_unknown'),
          },
          {
            value: 'six-three',
            label: $t('educationLearning.regionalSystem_six-three'),
          },
          {
            value: 'five-four',
            label: $t('educationLearning.regionalSystem_five-four'),
          },
        ]"
      />
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="item in results"
        :key="item.subject"
        class="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-border p-3"
      >
        <span>
          {{ $t(`educationLearning.regionalSubject_${item.subject}`) }}
        </span>
        <Tag
          :color="
            item.resolution.status === 'verified'
              ? 'green'
              : item.resolution.status === 'conflict'
                ? 'red'
                : 'default'
          "
        >
          {{ $t(`educationLearning.regionalStatus_${item.resolution.status}`) }}
        </Tag>
        <span
          v-if="
            item.resolution.status === 'verified' ||
            item.resolution.status === 'guidance'
          "
        >
          {{
            $t(
              item.resolution.edition === 'sujiao'
                ? 'educationLearning.sujiaoEdition'
                : 'educationLearning.pepEdition',
            )
          }}
        </span>
        <p class="w-full text-sm leading-6 text-muted-foreground">
          {{ $t(`educationLearning.regionalReason_${item.reason}`) }}
        </p>
      </div>
    </div>
    <Alert
      v-if="actions.length === 0"
      type="info"
      show-icon
      :message="$t('educationLearning.regionalUnknown')"
    />
    <p class="leading-7 text-muted-foreground">
      {{ $t('educationLearning.regionalPolicyScope') }}
    </p>
    <div
      v-for="item in results"
      :key="`source-${item.subject}`"
      class="space-y-2 break-words text-sm leading-6"
    >
      <div v-for="evidence in item.resolution.evidence" :key="evidence.id">
        <a
          :href="evidence.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary underline"
        >
          {{ $t(`educationLearning.regionalSubject_${item.subject}`) }} ·
          {{ $t('educationLearning.regionalSource') }} ·
          {{ evidence.sourceTitle }}
        </a>
        <p>
          {{
            $t('educationLearning.regionalSourceDates', {
              published: evidence.publishedAt,
              checked: evidence.checkedAt,
            })
          }}
        </p>
      </div>
    </div>
    <Button
      type="primary"
      class="!min-h-11 !h-auto !whitespace-normal !py-2"
      :disabled="actions.length === 0"
      @click="apply"
    >
      {{ $t('educationLearning.regionalApply') }}
    </Button>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.regionalRecords') }}
    </p>
  </section>
</template>
<style scoped>
:deep(.ant-select-selector) {
  align-items: center;
  min-height: 44px;
}
</style>
