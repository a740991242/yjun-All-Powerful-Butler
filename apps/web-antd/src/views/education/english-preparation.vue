<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Alert, Button, Empty } from 'ant-design-vue';

import { $t } from '#/locales';

import { englishPreparationBook } from './content/english-preparation';
import BookWorkspace from './learning/BookWorkspace.vue';

defineOptions({ name: 'EducationEnglishPreparation' });
const route = useRoute();
const router = useRouter();
const book = computed(() =>
  englishPreparationBook(
    route.params.volume,
    `${$t('educationLearning.englishPreparationTitle')} · ${$t(
      route.params.volume === 'lower'
        ? 'educationLearning.lower'
        : 'educationLearning.upper',
    )}`,
  ),
);
</script>

<template>
  <Page
    :title="$t('educationLearning.englishPreparationTitle')"
    :description="$t('educationLearning.englishPreparationDescription')"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4 max-sm:pr-8">
      <div class="flex flex-wrap gap-3">
        <Button
          class="!min-h-11"
          @click="router.push('/education?stage=primary&grade=p1')"
        >
          {{ $t('educationLearning.backGrades') }}
        </Button>
        <Button
          v-for="volume in ['upper', 'lower']"
          :key="volume"
          class="!min-h-11"
          :type="book?.volume === volume ? 'primary' : 'default'"
          :aria-pressed="book?.volume === volume"
          @click="
            router.push(`/education/primary/p1/english-preparation/${volume}`)
          "
        >
          {{ $t(`educationLearning.${volume}`) }}
        </Button>
      </div>
      <Alert
        type="info"
        show-icon
        :message="$t('educationLearning.englishPreparationDescription')"
        :description="$t('educationLearning.englishPreparationNotice')"
      />
      <BookWorkspace v-if="book" :key="book.id" :book="book" />
      <Empty
        v-else
        :description="$t('educationLearning.englishPreparationInvalid')"
      />
    </div>
  </Page>
</template>
