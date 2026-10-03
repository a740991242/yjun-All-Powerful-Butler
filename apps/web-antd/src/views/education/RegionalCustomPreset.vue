<script setup lang="ts">
import type {
  RegionalApplicationQuery,
  RegionalEditionAction,
} from './regional-application';
import type {
  RegionalPresetData,
  RegionalPresetEditions,
} from './regional-presets';

import { computed, ref, shallowRef, watch } from 'vue';

import { Alert, Button, Popconfirm, Select, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { editionTarget } from './content/edition-targets';
import {
  emptyRegionalEditions,
  findRegionalPreset,
  readRegionalPresets,
  regionalPresetActions,
  regionalPresetScope,
  removeRegionalPreset,
  saveRegionalPreset,
  writeRegionalPresets,
} from './regional-presets';

const props = defineProps<{ query: RegionalApplicationQuery }>();
const emit = defineEmits<{
  apply: [actions: RegionalEditionAction[]];
  clear: [];
}>();
const data = shallowRef<RegionalPresetData>({ schemaVersion: 1, entries: [] });
const loaded = ref(false);
const error = ref('');
const notice = ref('');
const draft = ref<RegionalPresetEditions>(emptyRegionalEditions());
const subjects = ['chinese', 'math', 'ethics'] as const;
const saved = computed(() =>
  loaded.value ? findRegionalPreset(data.value, props.query) : undefined,
);
const scopeAvailable = computed(() => !!regionalPresetScope(props.query));
const dirty = computed(
  () =>
    JSON.stringify(draft.value) !==
    JSON.stringify(saved.value?.editions ?? emptyRegionalEditions()),
);
const draftActions = computed(() =>
  regionalPresetActions(props.query, draft.value),
);
const canSave = computed(
  () =>
    loaded.value &&
    dirty.value &&
    draftActions.value.length > 0 &&
    draftActions.value.length ===
      subjects.filter((subject) => draft.value[subject] !== 'keep').length,
);
const savedActions = computed(() =>
  saved.value ? regionalPresetActions(props.query, saved.value.editions) : [],
);
function options(subject: (typeof subjects)[number]) {
  const choices =
    subject === 'math'
      ? ['keep', 'pep-2024', 'sujiao', 'bnu-2024']
      : ['keep', 'pep-2024'];
  return choices.map((value) => {
    const target = editionTarget(subject, value, props.query.volume);
    const pending = value !== 'keep' && target?.status !== 'available';
    let key = 'pepEdition';
    if (value === 'keep') key = 'regionalPresetKeep';
    else if (value === 'sujiao') key = 'sujiaoEdition';
    else if (value === 'bnu-2024') key = 'bnuEdition';
    return {
      value,
      label: `${$t(`educationLearning.${key}`)}${pending ? ` · ${$t('educationLearning.regionalPresetPending')}` : ''}`,
      disabled: pending,
    };
  });
}
function choose(subject: (typeof subjects)[number], value: unknown) {
  if (value === 'keep' || value === 'pep-2024') draft.value[subject] = value;
  else if (subject === 'math' && (value === 'sujiao' || value === 'bnu-2024'))
    draft.value.math = value;
}
function load() {
  try {
    const next = readRegionalPresets(window.localStorage);
    data.value = next;
    loaded.value = true;
    error.value = '';
  } catch {
    loaded.value = false;
    error.value = 'regionalPresetReadFailed';
  }
}
watch(
  [() => props.query, saved],
  () => {
    draft.value = saved.value
      ? structuredClone(saved.value.editions)
      : emptyRegionalEditions();
    notice.value = '';
    emit('clear');
  },
  { immediate: true, flush: 'sync' },
);
watch(
  draft,
  () => {
    notice.value = '';
    emit('clear');
  },
  { deep: true, flush: 'sync' },
);
function persist(next: RegionalPresetData, message: string) {
  try {
    writeRegionalPresets(window.localStorage, next);
    data.value = next;
    error.value = '';
    notice.value = message;
  } catch {
    error.value = 'regionalPresetWriteFailed';
    notice.value = '';
  }
}
function save() {
  if (!canSave.value) return;
  let latest: RegionalPresetData;
  try {
    latest = readRegionalPresets(window.localStorage);
  } catch {
    loaded.value = false;
    error.value = 'regionalPresetReadFailed';
    return;
  }
  persist(
    saveRegionalPreset(latest, props.query, draft.value),
    'regionalPresetSaved',
  );
}
function remove() {
  if (!loaded.value || !saved.value) return;
  let latest: RegionalPresetData;
  try {
    latest = readRegionalPresets(window.localStorage);
  } catch {
    loaded.value = false;
    error.value = 'regionalPresetReadFailed';
    return;
  }
  persist(removeRegionalPreset(latest, props.query), 'regionalPresetRemoved');
}
function apply() {
  if (!loaded.value || dirty.value || !saved.value) return;
  const actions = regionalPresetActions(props.query, saved.value.editions);
  if (actions.length > 0) emit('apply', actions);
}
load();
</script>
<template>
  <section
    class="flex min-w-0 flex-col gap-4 rounded-lg border border-border p-4"
    :aria-label="$t('educationLearning.regionalPresetTitle')"
  >
    <div class="flex flex-wrap items-center gap-2">
      <h4 class="text-base font-semibold">
        {{ $t('educationLearning.regionalPresetTitle') }}
      </h4>
      <Tag class="max-w-full !whitespace-normal !break-words">
        {{ $t('educationLearning.regionalPresetPersonal') }}
      </Tag>
    </div>
    <p class="leading-7 text-muted-foreground">
      {{ $t('educationLearning.regionalPresetScope') }}
    </p>
    <Alert
      v-if="!scopeAvailable"
      type="info"
      show-icon
      :message="$t('educationLearning.regionalPresetSystem')"
    />
    <Alert
      v-if="error"
      type="warning"
      show-icon
      :message="$t(`educationLearning.${error}`)"
    />
    <Button
      v-if="!loaded"
      class="!min-h-11 !h-auto !whitespace-normal !py-2"
      @click="load"
    >
      {{ $t('educationLearning.regionalPresetRetry') }}
    </Button>
    <div class="grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="subject in subjects"
        :key="subject"
        class="flex min-w-0 flex-col gap-2"
      >
        <label :for="`education-custom-${subject}`">
          {{ $t(`educationLearning.regionalSubject_${subject}`) }}
        </label>
        <Select
          :id="`education-custom-${subject}`"
          :value="draft[subject]"
          @update:value="choose(subject, $event)"
          size="large"
          :virtual="false"
          popup-class-name="education-regional-preset-options"
          :options="options(subject)"
          :aria-label="
            $t('educationLearning.regionalPresetSubjectLabel', {
              subject: $t(`educationLearning.regionalSubject_${subject}`),
            })
          "
        />
      </div>
    </div>
    <p class="leading-7 text-muted-foreground">
      {{ $t('educationLearning.regionalPresetEnglish') }}
    </p>
    <Alert
      v-if="notice"
      type="success"
      show-icon
      :message="$t(`educationLearning.${notice}`)"
    />
    <p v-if="saved" class="leading-7">
      {{
        $t(
          dirty
            ? 'educationLearning.regionalPresetUnsaved'
            : 'educationLearning.regionalPresetReady',
        )
      }}
    </p>
    <div class="flex flex-wrap gap-3">
      <Button
        class="!min-h-11 !h-auto !whitespace-normal !py-2"
        :disabled="!canSave"
        @click="save"
      >
        {{ $t('educationLearning.regionalPresetSave') }}
      </Button>
      <Button
        type="primary"
        class="!min-h-11 !h-auto !whitespace-normal !py-2"
        :disabled="!saved || dirty || savedActions.length === 0"
        @click="apply"
      >
        {{ $t('educationLearning.regionalPresetApply') }}
      </Button>
      <Popconfirm
        v-if="saved"
        :title="$t('educationLearning.regionalPresetRemoveConfirm')"
        @confirm="remove"
      >
        <Button danger class="!min-h-11 !h-auto !whitespace-normal !py-2">
          {{ $t('educationLearning.regionalPresetRemove') }}
        </Button>
      </Popconfirm>
    </div>
  </section>
</template>
<style scoped>
:deep(.ant-select-selector) {
  align-items: center;
  min-height: 44px;
}

:global(.education-regional-preset-options .ant-select-item-option) {
  display: flex;
  align-items: center;
  min-height: 44px;
}

:global(.education-regional-preset-options .ant-select-item-option-content) {
  overflow-wrap: anywhere;
  white-space: normal;
}
</style>
