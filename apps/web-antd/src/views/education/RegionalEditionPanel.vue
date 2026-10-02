<script setup lang="ts">
import type { RegionalEditionQuery } from './regional-editions';

import { computed, ref, watch } from 'vue';

import { Alert, Button, Select, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { resolveRegionalEdition } from './regional-editions';
import {
  regionalCities,
  regionalProvinces,
  regionalSchools,
} from './regional-locations';

const emit = defineEmits<{
  apply: [edition: 'pep-2024' | 'sujiao', volume: 'lower' | 'upper'];
}>();
const province = ref('jiangsu');
const city = ref('suzhou');
const school = ref('none');
const academicYear = ref('2026-2027');
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
const query = computed<RegionalEditionQuery>(() => ({
  province: province.value,
  city: city.value === 'none' ? '' : city.value,
  school: school.value === 'none' ? '' : school.value,
  academicYear: academicYear.value,
  stage: 'primary',
  grade: 'p1',
  subject: 'math',
  volume: volume.value,
}));
const subjects = ['chinese', 'math', 'ethics', 'english'] as const;
const results = computed(() =>
  subjects.map((subject) => ({
    subject,
    resolution: resolveRegionalEdition({ ...query.value, subject }),
  })),
);
const math = computed(() => resolveRegionalEdition(query.value));
function apply() {
  const result = resolveRegionalEdition(query.value);
  if (result.status === 'verified') emit('apply', result.edition, volume.value);
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
        <span v-if="item.resolution.status === 'verified'">
          {{
            $t(
              item.resolution.edition === 'sujiao'
                ? 'educationLearning.sujiaoEdition'
                : 'educationLearning.pepEdition',
            )
          }}
        </span>
      </div>
    </div>
    <Alert
      v-if="math.status !== 'verified'"
      type="info"
      show-icon
      :message="$t('educationLearning.regionalUnknown')"
    />
    <template v-else>
      <p class="leading-7 text-muted-foreground">
        {{ $t('educationLearning.regionalHistorical') }}
      </p>
      <div
        v-for="evidence in math.evidence"
        :key="evidence.id"
        class="space-y-2 break-words text-sm leading-6"
      >
        <a
          :href="evidence.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary underline"
        >
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
    </template>
    <Button
      type="primary"
      class="!min-h-11 !h-auto !whitespace-normal !py-2"
      :disabled="math.status !== 'verified'"
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
