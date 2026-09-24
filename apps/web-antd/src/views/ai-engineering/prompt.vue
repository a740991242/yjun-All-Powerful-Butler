<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Form,
  FormItem,
  Popconfirm,
  Select,
  Space,
  Textarea,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { copy } from '../engineering/shared';
import { composePrompt, promptFields } from './model';
defineOptions({ name: 'AiPrompt' });
const template = ref('review');
const values = reactive({
  role: '',
  task: '',
  context: '',
  constraints: '',
  format: '',
});
const labels = computed(() => ({
  role: $t('ai.role'),
  task: $t('ai.task'),
  context: $t('ai.context'),
  constraints: $t('ai.constraints'),
  format: $t('ai.format'),
}));
const output = computed(() => composePrompt(values, labels.value));
function reset() {
  for (const field of promptFields) values[field] = '';
}
function apply() {
  if (template.value === 'blank') {
    reset();
    return;
  }
  for (const field of promptFields)
    values[field] = $t(
      `ai.${template.value}${field[0]?.toUpperCase()}${field.slice(1)}`,
    );
}
</script>
<template>
  <Page :title="$t('ai.prompt')" :description="$t('ai.promptHint')">
    <div class="flex flex-col gap-4">
      <Alert type="info" show-icon :message="$t('ai.local')" />
      <div class="grid gap-4 xl:grid-cols-2">
        <Card :title="$t('ai.template')">
          <Space wrap class="mb-5">
            <Select
              v-model:value="template"
              :aria-label="$t('ai.template')"
              style="width: 200px"
              :options="
                ['review', 'requirements', 'writing', 'blank'].map((value) => ({
                  value,
                  label: $t(`ai.${value}`),
                }))
              "
            />
            <Popconfirm :title="$t('ai.replace')" @confirm="apply">
              <Button>{{ $t('ai.apply') }}</Button>
            </Popconfirm>
          </Space>
          <Form layout="vertical">
            <FormItem
              v-for="field in promptFields"
              :key="field"
              :label="labels[field]"
            >
              <Textarea
                v-model:value="values[field]"
                :aria-label="labels[field]"
                :rows="field === 'context' ? 5 : 3"
                :maxlength="20000"
                show-count
              />
            </FormItem>
          </Form>
        </Card>
        <Card :title="$t('ai.preview')">
          <Space wrap class="mb-4">
            <Button type="primary" :disabled="!output" @click="copy(output)">
              {{ $t('ai.copy') }}
            </Button>
            <Popconfirm :title="$t('ai.resetConfirm')" @confirm="reset">
              <Button>{{ $t('ai.reset') }}</Button>
            </Popconfirm>
          </Space>
          <Textarea
            :value="output"
            readonly
            :rows="24"
            :aria-label="$t('ai.preview')"
            :placeholder="$t('ai.empty')"
          />
        </Card>
      </div>
    </div>
  </Page>
</template>
