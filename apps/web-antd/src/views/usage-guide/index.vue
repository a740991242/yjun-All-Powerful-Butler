<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Collapse,
  CollapsePanel,
  Empty,
  Input,
  Select,
  Space,
  Tag,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { articleFields, groups, guides } from './catalog';
defineOptions({ name: 'UsageGuide' });
const router = useRouter();
const query = ref('');
const group = ref('all');
const active = ref<string[]>([]);
const filtered = computed(() =>
  guides.filter(
    (item) =>
      (group.value === 'all' || item.group === group.value) &&
      [
        $t(item.title),
        $t(`guide.${item.group}`),
        ...articleFields.map((field) => $t(`guide.${item.id}_${field}`)),
      ]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query.value.trim().toLocaleLowerCase()),
  ),
);
watch(filtered, (items) => {
  active.value = query.value.trim() ? items.map((item) => item.id) : [];
});
</script>
<template>
  <Page :title="$t('guide.title')" :description="$t('guide.description')">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <Card :title="$t('guide.gettingStarted')">
        <p class="mb-3 leading-7">{{ $t('guide.intro') }}</p>
        <Alert type="info" show-icon :message="$t('guide.storage')" />
      </Card>
      <Card>
        <div class="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input
            v-model:value="query"
            allow-clear
            :placeholder="$t('guide.search')"
            :aria-label="$t('guide.search')"
          />
          <Select
            v-model:value="group"
            :aria-label="$t('guide.category')"
            :options="
              ['all', ...groups].map((value) => ({
                value,
                label: $t(`guide.${value}`),
              }))
            "
          />
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p role="status">
            {{ $t('guide.count', { count: filtered.length }) }}
          </p>
          <Space wrap>
            <Button @click="active = filtered.map((item) => item.id)">
              {{ $t('guide.expand') }}
</Button><Button @click="active = []">
              {{ $t('guide.collapse') }}
            </Button>
          </Space>
        </div>
      </Card>
      <Collapse v-if="filtered.length" v-model:active-key="active">
        <CollapsePanel
          v-for="item in filtered"
          :key="item.id"
          :header="$t(item.title)"
        >
          <Tag>{{ $t(`guide.${item.group}`) }}</Tag>
          <p class="my-4 leading-7">{{ $t(`guide.${item.id}_summary`) }}</p>
          <h3 class="mb-2 font-semibold">{{ $t('guide.steps') }}</h3>
          <ol class="list-decimal space-y-2 pl-6 leading-7">
            <li v-for="step in [1, 2, 3, 4]" :key="step">
              {{ $t(`guide.${item.id}_step${step}`) }}
            </li>
          </ol>
          <div class="my-4 rounded-lg border border-border p-4">
            <h3 class="mb-2 font-semibold">{{ $t('guide.example') }}</h3>
            <p class="whitespace-pre-wrap break-words leading-7">
              {{ $t(`guide.${item.id}_example`) }}
            </p>
          </div>
          <h3 class="mb-2 font-semibold">{{ $t('guide.note') }}</h3>
          <p class="mb-4 leading-7 text-muted-foreground">
            {{ $t(`guide.${item.id}_note`) }}
          </p>
          <Button
            v-if="item.route !== '/usage-guide'"
            type="primary"
            @click="router.push(item.route)"
          >
            {{ $t('guide.open') }}
          </Button>
        </CollapsePanel>
      </Collapse>
      <Card v-else><Empty :description="$t('guide.empty')" /></Card>
    </div>
  </Page>
</template>
