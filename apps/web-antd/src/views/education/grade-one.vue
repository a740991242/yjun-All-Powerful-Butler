<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Alert, Button, Card, Empty, Select, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { bnuUpperBook } from './content/bnu';
import { chineseBooks } from './content/chinese';
import { editionTarget } from './content/edition-targets';
import { createEthicsBooks } from './content/ethics';
import { mathBooks } from './content/math';
import { sujiaoBooks } from './content/sujiao';
import { sujiaoLowerSource } from './content/sujiao-lower-source';
import { sujiaoUpperSource } from './content/sujiao-upper-source';
import { findTextbook } from './content/textbooks';
import {
  mathEditionPreference as mathEdition,
  mathEditionPersistenceFailed,
} from './edition-preferences';
import BookWorkspace from './learning/BookWorkspace.vue';

defineOptions({ name: 'EducationGradeOne' });
const route = useRoute();
const router = useRouter();
const target = computed(() =>
  editionTarget(
    route.params.subject,
    route.params.edition,
    route.params.volume,
  ),
);
watch(
  target,
  (value) => {
    if (value?.subject === 'math') mathEdition.value = value.edition;
  },
  { immediate: true },
);
const editionOptions = computed(() => [
  { value: 'pep-2024', label: $t('educationLearning.pepEdition') },
  { value: 'sujiao', label: $t('educationLearning.sujiaoEdition') },
  { value: 'bnu-2024', label: $t('educationLearning.bnuEdition') },
]);
function chooseMathEdition(value: unknown) {
  if (
    typeof value !== 'string' ||
    !target.value ||
    !editionTarget('math', value, target.value.volume)
  )
    return;
  void router.push(
    `/education/primary/p1/math/${value}/${target.value.volume}`,
  );
}
const textbook = computed(() =>
  findTextbook(route.params.subject, route.params.edition, route.params.volume),
);
const book = computed(() =>
  [
    ...mathBooks,
    bnuUpperBook,
    ...chineseBooks,
    ...sujiaoBooks,
    ...createEthicsBooks($t),
  ].find((item) => item.id === textbook.value?.id),
);
const sujiaoSource = computed(() => {
  if (target.value?.edition !== 'sujiao') return undefined;
  return target.value.volume === 'upper'
    ? sujiaoUpperSource
    : sujiaoLowerSource;
});
function availableLessonCount(unitId: string) {
  return (
    book.value?.units
      .find((unit) => unit.id === unitId)
      ?.lessons.filter((lesson) => lesson.status === 'available').length ?? 0
  );
}
function choose(subject: string, volume: string) {
  const edition = subject === 'math' ? mathEdition.value : 'pep-2024';
  void router.push(`/education/primary/p1/${subject}/${edition}/${volume}`);
}
</script>
<template>
  <Page
    :title="$t('educationLearning.gradeOneTitle')"
    :description="$t('educationLearning.gradeOneDescription')"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <div class="flex flex-wrap gap-3">
        <Button
          class="!min-h-11"
          @click="
            router.push({
              path: '/education',
              query: { stage: 'primary', grade: 'p1' },
            })
          "
        >
          {{ $t('educationLearning.backGrades') }}
        </Button>
        <template
          v-for="subject in ['chinese', 'math', 'ethics']"
          :key="subject"
        >
          <Button
            class="!min-h-11"
            v-for="volume in ['upper', 'lower']"
            :key="volume"
            :type="
              target?.subject === subject && target?.volume === volume
                ? 'primary'
                : 'default'
            "
            @click="choose(subject, volume)"
          >
            {{ $t(`educationLearning.${subject}`) }} ·
            {{ $t(`educationLearning.${volume}`) }}
          </Button>
        </template>
      </div>
      <Card v-if="target?.subject === 'math'">
        <div class="flex flex-wrap items-center gap-3">
          <label for="grade-one-math-edition">
            {{ $t('educationLearning.mathEditionLabel') }}
          </label>
          <Select
            id="grade-one-math-edition"
            size="large"
            class="w-full sm:w-80"
            :aria-label="$t('educationLearning.mathEditionLabel')"
            :value="target.edition"
            :options="editionOptions"
            @update:value="chooseMathEdition"
          />
        </div>
        <p class="mt-3 leading-7 text-muted-foreground">
          {{ $t('educationLearning.editionPreferenceNotice') }}
        </p>
        <Alert
          v-if="mathEditionPersistenceFailed"
          class="mt-3"
          type="warning"
          show-icon
          :message="$t('educationLearning.editionPreferenceFailed')"
        />
      </Card>
      <Alert
        v-if="target?.status === 'preparing'"
        type="info"
        show-icon
        :message="
          $t(
            target.edition === 'bnu-2024'
              ? 'educationLearning.bnuLowerPreparingTitle'
              : 'educationLearning.sujiaoPreparingTitle',
          )
        "
        :description="
          $t(
            target.edition === 'bnu-2024'
              ? 'educationLearning.bnuLowerPreparingNotice'
              : 'educationLearning.sujiaoPreparingNotice',
          )
        "
      />
      <Empty
        v-else-if="!textbook"
        :description="$t('educationLearning.invalidBook')"
      />
      <template v-else-if="book">
        <Alert
          v-if="book.subject === 'ethics'"
          type="info"
          show-icon
          :message="$t('educationEthics.sourceNotice')"
        />
        <BookWorkspace :key="book.id" :book="book" />
      </template>
      <template v-else>
        <Alert
          type="info"
          show-icon
          :message="$t('educationLearning.bookPreparing')"
          :description="$t('educationLearning.preparingNotice')"
        />
        <Card v-for="unit in textbook.units" :key="unit.id" :title="unit.title">
          <div class="flex flex-col gap-3">
            <div
              v-for="item in unit.items"
              :key="item.id"
              class="flex flex-wrap items-center gap-3"
            >
              <span>{{ item.title }}</span>
              <Tag>
                {{ $t('educationLearning.page', { number: item.page }) }}
              </Tag>
              <Tag v-if="availableLessonCount(item.id)">
                {{
                  $t('educationLearning.availableSourceLessons', {
                    count: availableLessonCount(item.id),
                  })
                }}
              </Tag>
              <Tag v-else>{{ $t('educationLearning.contentPreparing') }}</Tag>
            </div>
          </div>
        </Card>
        <a :href="textbook.source" target="_blank" rel="noopener noreferrer">
          {{ $t('educationLearning.openTextbook') }}
        </a>
      </template>
      <Card
        v-if="sujiaoSource"
        :title="
          $t(
            target?.volume === 'upper'
              ? 'educationLearning.sujiaoVerifiedContents'
              : 'educationLearning.sujiaoLowerVerifiedContents',
          )
        "
      >
        <div class="flex flex-col gap-4">
          <p class="text-muted-foreground">
            {{
              $t(
                target?.volume === 'upper'
                  ? 'educationLearning.sujiaoSourceBoundary'
                  : 'educationLearning.sujiaoLowerSourceBoundary',
              )
            }}
          </p>
          <div class="flex flex-wrap gap-2">
            <Tag>{{ sujiaoSource.publisher }}</Tag>
            <Tag>ISBN {{ sujiaoSource.isbn }}</Tag>
            <Tag>
              {{
                $t(
                  target?.volume === 'upper'
                    ? 'educationLearning.sujiaoUpperPrinting'
                    : 'educationLearning.sujiaoLowerPrintingPending',
                )
              }}
            </Tag>
          </div>
          <div
            v-for="item in sujiaoSource.contents"
            :key="item.id"
            class="flex flex-wrap items-center gap-3 border-b border-border pb-3 last:border-b-0"
          >
            <span>{{ item.title }}</span>
            <Tag>{{ $t('educationLearning.page', { number: item.page }) }}</Tag>
            <Tag v-if="availableLessonCount(item.id)">
              {{
                $t('educationLearning.availableSourceLessons', {
                  count: availableLessonCount(item.id),
                })
              }}
            </Tag>
            <Tag v-else>{{ $t('educationLearning.contentPreparing') }}</Tag>
          </div>
          <a
            :href="sujiaoSource.preview"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('educationLearning.sujiaoSourcePreview') }}
          </a>
        </div>
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
