<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Progress,
  Select,
  Space,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { copy } from '../engineering/shared';
import { workflows } from './model';
defineOptions({ name: 'AiWorkflow' });
const flow = ref<(typeof workflows)[number]>('assistant');
const checked = reactive<Record<string, boolean>>({});
const steps = computed(() =>
  [1, 2, 3, 4].map((number) => ({
    id: `${flow.value}${number}`,
    text: $t(`ai.${flow.value}${number}`),
  })),
);
const done = computed(
  () => steps.value.filter((step) => checked[step.id]).length,
);
function reset() {
  for (const step of steps.value) checked[step.id] = false;
}
function copySteps() {
  void copy(
    `# ${$t(`ai.${flow.value}`)}\n\n${steps.value.map((step) => `- [${checked[step.id] ? 'x' : ' '}] ${step.text}`).join('\n')}`,
  );
}
</script>
<template>
  <Page :title="$t('ai.workflow')" :description="$t('ai.workflowHint')">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <Alert type="info" show-icon :message="$t('ai.session')" />
      <Card>
        <Space wrap>
          <Select
            v-model:value="flow"
            :aria-label="$t('ai.flowType')"
            style="width: 240px"
            :options="
              workflows.map((value) => ({ value, label: $t(`ai.${value}`) }))
            "
          /><Button @click="copySteps">{{ $t('ai.copyChecklist') }}</Button><Button @click="reset">{{ $t('ai.clearChecks') }}</Button>
        </Space>
        <h2 class="mb-2 mt-6 text-lg font-semibold">{{ $t(`ai.${flow}`) }}</h2>
        <p>{{ $t('ai.progress', { done, total: steps.length }) }}</p>
        <Progress :percent="(done / steps.length) * 100" />
        <div class="mt-4 flex flex-col gap-5">
          <Checkbox
            v-for="(step, index) in steps"
            :key="step.id"
            v-model:checked="checked[step.id]"
          >
            <span class="leading-7">{{ index + 1 }}. {{ step.text }}</span>
          </Checkbox>
        </div>
      </Card>
    </div>
  </Page>
</template>
