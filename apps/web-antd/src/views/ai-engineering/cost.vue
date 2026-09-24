<script setup lang="ts">
import type { CostInput } from './model';

import { computed, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Card,
  Form,
  FormItem,
  InputNumber,
  Select,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { estimateCost } from './model';
defineOptions({ name: 'AiCost' });
const values = reactive<CostInput>({
  inputTokens: 1000,
  outputTokens: 500,
  inputRate: 1,
  outputRate: 2,
  requests: 100,
});
const fields = [
  'inputTokens',
  'outputTokens',
  'inputRate',
  'outputRate',
  'requests',
] as const;
const currency = ref('CNY');
const result = computed(() => {
  try {
    return estimateCost(values);
  } catch {
    return null;
  }
});
function display(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}
</script>
<template>
  <Page :title="$t('ai.cost')" :description="$t('ai.costHint')">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <Alert type="info" show-icon :message="$t('ai.costNotice')" />
      <Card>
        <Form
          layout="vertical"
          class="grid gap-x-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <FormItem
            v-for="field in fields"
            :key="field"
            :label="$t(`ai.${field}`)"
          >
            <InputNumber
              :value="values[field] ?? ''"
              @update:value="
                (value) =>
                  (values[field] = typeof value === 'number' ? value : null)
              "
              :aria-label="$t(`ai.${field}`)"
              :min="field === 'requests' ? 1 : 0"
              :precision="field.endsWith('Rate') ? 6 : 0"
              class="!w-full"
            />
          </FormItem>
          <FormItem :label="$t('ai.currency')">
            <Select
              v-model:value="currency"
              :aria-label="$t('ai.currency')"
              :options="['CNY', 'USD', 'EUR'].map((value) => ({ value }))"
            />
          </FormItem>
        </Form>
      </Card>
      <div
        v-if="result"
        class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-live="polite"
      >
        <Card
          v-for="field in [
            'inputCost',
            'outputCost',
            'perRequest',
            'total',
          ] as const"
          :key="field"
          :title="$t(`ai.${field}`)"
        >
          <p class="break-all text-2xl font-semibold text-primary">
            {{ display(result[field]) }}
            <span class="text-sm">{{ currency }}</span>
          </p>
        </Card>
      </div>
      <Alert v-else type="error" show-icon :message="$t('ai.invalid')" />
      <p class="leading-7 text-muted-foreground">{{ $t('ai.formula') }}</p>
    </div>
  </Page>
</template>
