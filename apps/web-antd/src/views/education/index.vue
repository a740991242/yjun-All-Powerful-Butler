<script setup lang="ts">
import type { RegionalEditionAction } from './regional-application';

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Alert, Button, Card, Select, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { selection, stages } from './catalog';
import {
  mathEditionPersistenceFailed,
  mathEditionPreference,
} from './edition-preferences';
import { regionalActionPath } from './regional-application';
import RegionalEditionPanel from './RegionalEditionPanel.vue';
defineOptions({ name: 'Education' });
const route = useRoute();
const router = useRouter();
const current = computed(() => selection(route.query.stage, route.query.grade));
const editionOptions = computed(() => [
  { value: 'sujiao', label: $t('educationLearning.sujiaoEdition') },
  { value: 'pep-2024', label: $t('educationLearning.pepEdition') },
]);
function chooseEdition(value: unknown) {
  if (value === 'sujiao' || value === 'pep-2024')
    mathEditionPreference.value = value;
}
const regionalApplied = ref<RegionalEditionAction[]>([]);
function applyRegionalEdition(actions: RegionalEditionAction[]) {
  const math = actions.find((item) => item.subject === 'math');
  if (math) mathEditionPreference.value = math.edition;
  regionalApplied.value = structuredClone(actions);
}
function choose(stage?: string, grade?: string) {
  void router.push({ path: '/education', query: { stage, grade } });
}
</script>
<template>
  <Page
    :title="$t('education.title')"
    :description="$t('education.description')"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <Alert type="info" show-icon :message="$t('education.notice')" />
      <section :aria-label="$t('education.stage')">
        <h2 class="mb-4 text-lg font-semibold">
          1. {{ $t('education.stage') }}
        </h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Button
            v-for="stage in stages"
            :key="stage.id"
            :type="current.stage?.id === stage.id ? 'primary' : 'default'"
            :aria-pressed="current.stage?.id === stage.id"
            class="!h-auto !whitespace-normal !p-5 !text-left"
            @click="choose(stage.id)"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <IconifyIcon :icon="stage.icon" class="size-6 shrink-0" />
                <span class="text-base font-semibold">
                  {{ $t(`education.${stage.id}`) }}
                </span>
              </div>
              <div class="text-xs leading-6">
                {{ $t(`education.${stage.id}Hint`) }}
              </div>
            </div>
          </Button>
        </div>
      </section>
      <Card
        v-if="current.stage"
        :title="`2. ${$t('education.grade')} · ${$t(`education.${current.stage.id}`)}`"
      >
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Button
            v-for="grade in current.stage.grades"
            :key="grade"
            :type="current.grade === grade ? 'primary' : 'default'"
            :aria-pressed="current.grade === grade"
            class="!h-auto !whitespace-normal !py-4"
            @click="choose(current.stage.id, grade)"
          >
            {{ $t(`education.${grade}`) }}
          </Button>
        </div>
        <p
          v-if="current.stage.grades.includes('other')"
          class="mt-4 text-muted-foreground"
        >
          {{ $t('education.flexible') }}
        </p>
      </Card>
      <Card v-if="current.stage && current.grade">
        <Tag color="blue">{{ $t('education.selected') }}</Tag>
        <h2 class="my-4 text-xl font-semibold">
          {{ $t(`education.${current.stage.id}`) }} ·
          {{ $t(`education.${current.grade}`) }}
        </h2>
        <div
          v-if="current.stage.id === 'primary' && current.grade === 'p1'"
          class="flex flex-col gap-4"
        >
          <RegionalEditionPanel
            @apply="applyRegionalEdition"
            @clear="regionalApplied = []"
          />
          <div v-if="regionalApplied.length" class="flex flex-col gap-3">
            <Alert
              type="success"
              show-icon
              :message="
                $t('educationLearning.regionalApplied', {
                  count: regionalApplied.length,
                })
              "
            />
            <div class="flex flex-wrap gap-3">
              <Button
                v-for="action in regionalApplied"
                :key="action.subject"
                class="!min-h-11 !h-auto !whitespace-normal !py-2"
                @click="router.push(regionalActionPath(action))"
              >
                {{ $t(`educationLearning.regionalSubject_${action.subject}`) }}
                ·
                {{
                  $t(
                    action.edition === 'sujiao'
                      ? 'educationLearning.sujiaoEdition'
                      : 'educationLearning.pepEdition',
                  )
                }}
                · {{ $t(`educationLearning.${action.volume}`) }}
              </Button>
            </div>
          </div>
          <div class="flex flex-col gap-2 sm:max-w-sm">
            <label for="education-entry-math-edition">
              {{ $t('educationLearning.mathEditionLabel') }}
            </label>
            <Select
              id="education-entry-math-edition"
              size="large"
              :value="mathEditionPreference"
              :options="editionOptions"
              :aria-label="$t('educationLearning.mathEditionLabel')"
              @update:value="chooseEdition"
            />
          </div>
          <p class="leading-7 text-muted-foreground">
            {{ $t('educationLearning.editionPreferenceNotice') }}
          </p>
          <Alert
            v-if="mathEditionPersistenceFailed"
            type="warning"
            show-icon
            :message="$t('educationLearning.editionPreferenceFailed')"
          />
          <Button
            type="primary"
            class="!min-h-11 self-start"
            @click="
              router.push(
                `/education/primary/p1/math/${mathEditionPreference}/upper`,
              )
            "
          >
            {{ $t('educationLearning.enterGradeOne') }}
          </Button>
          <div class="flex flex-wrap gap-3">
            <Button
              v-for="volume in ['upper', 'lower']"
              :key="volume"
              class="!min-h-11"
              @click="
                router.push(`/education/primary/p1/ethics/pep-2024/${volume}`)
              "
            >
              {{ $t('educationLearning.ethics') }} ·
              {{ $t(`educationLearning.${volume}`) }}
            </Button>
          </div>
        </div>
        <p v-else class="font-medium">{{ $t('education.pending') }}</p>
        <p class="my-3 leading-7 text-muted-foreground">
          {{ $t('education.next') }}
        </p>
        <Button @click="choose()">{{ $t('education.reset') }}</Button>
      </Card>
    </div>
  </Page>
</template>

<style scoped>
:deep(.ant-select-selector) {
  align-items: center;
  min-height: 44px;
}
</style>
