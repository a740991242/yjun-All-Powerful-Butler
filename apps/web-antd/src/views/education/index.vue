<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Alert, Button, Card, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { selection, stages } from './catalog';
defineOptions({ name: 'Education' });
const route = useRoute();
const router = useRouter();
const current = computed(() => selection(route.query.stage, route.query.grade));
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
                <IconifyIcon :icon="stage.icon" class="size-6 shrink-0" /><span
                  class="text-base font-semibold"
                  >{{ $t(`education.${stage.id}`) }}</span>
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
        <p class="font-medium">{{ $t('education.pending') }}</p>
        <p class="my-3 leading-7 text-muted-foreground">
          {{ $t('education.next') }}
        </p>
        <Button @click="choose()">{{ $t('education.reset') }}</Button>
      </Card>
    </div>
  </Page>
</template>
