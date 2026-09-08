<script lang="ts" setup>
import type { FormInstance, FormProps } from 'ant-design-vue';

import type { IncomeTaxInput } from '../calculations';

import { computed, nextTick, reactive, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { i18n } from '@vben/locales';

import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsItem,
  Form,
  FormItem,
  InputNumber,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  TypographyText,
} from 'ant-design-vue';

import { $t } from '#/locales';

import {
  calculateIncomeTax,
  CalculationError,
  DEFAULT_INCOME_TAX,
  formatMoney,
} from '../calculations';

defineOptions({ name: 'IncomeTaxCalculator' });

type IncomeTaxForm = {
  [Key in Exclude<keyof IncomeTaxInput, 'month'>]: null | number;
} & { month: number };
const form = reactive<IncomeTaxForm>({ ...DEFAULT_INCOME_TAX });
const formRef = ref<FormInstance>();
const result = ref<ReturnType<typeof calculateIncomeTax>>();
const errorKey = ref('');
const months = computed(() =>
  Array.from({ length: 12 }, (_, index) => ({
    label: $t('tools.common.month', { count: index + 1 }),
    value: index + 1,
  })),
);
const primaryValueStyle = { color: 'hsl(var(--primary))' };
const rules = computed<FormProps['rules']>(() => ({
  salary: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: $t('tools.errors.salary'),
    },
  ],
  special: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: $t('tools.errors.special'),
    },
  ],
  insurance: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: $t('tools.errors.insurance'),
    },
  ],
  threshold: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: $t('tools.errors.threshold'),
    },
  ],
}));

function calculate() {
  try {
    result.value = calculateIncomeTax({
      salary: form.salary ?? Number.NaN,
      special: form.special ?? Number.NaN,
      insurance: form.insurance ?? Number.NaN,
      threshold: form.threshold ?? Number.NaN,
      month: form.month ?? Number.NaN,
    });
    errorKey.value = '';
  } catch (error) {
    result.value = undefined;
    errorKey.value =
      error instanceof CalculationError
        ? error.message
        : 'tools.common.unknownError';
  }
}

async function reset() {
  formRef.value?.resetFields();
  Object.assign(form, DEFAULT_INCOME_TAX);
  await nextTick();
  formRef.value?.clearValidate();
  calculate();
}

watch(form, calculate, { immediate: true });
watch(
  () => i18n.global.locale.value,
  async () => {
    await nextTick();
    if (errorKey.value) await formRef.value?.validate().catch(() => {});
  },
);
</script>

<template>
  <Page
    :title="$t('tools.menu.tax')"
    :description="$t('tools.tax.description')"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <Card :title="$t('tools.tax.info')">
        <Form
          ref="formRef"
          :model="form"
          :rules="rules"
          layout="vertical"
          @finish="calculate"
        >
          <Row :gutter="24">
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.tax.salary')" name="salary">
                <InputNumber
                  :value="form.salary ?? undefined"
                  @update:value="
                    (value) =>
                      (form.salary = typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :step="0.01"
                  :addon-after="$t('tools.common.monthlyCny')"
                />
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.tax.special')" name="special">
                <InputNumber
                  :value="form.special ?? undefined"
                  @update:value="
                    (value) =>
                      (form.special = typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :step="0.01"
                  :addon-after="$t('tools.common.monthlyCny')"
                />
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.tax.insurance')" name="insurance">
                <InputNumber
                  :value="form.insurance ?? undefined"
                  @update:value="
                    (value) =>
                      (form.insurance =
                        typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :step="0.01"
                  :addon-after="$t('tools.common.monthlyCny')"
                />
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.tax.threshold')" name="threshold">
                <InputNumber
                  :value="form.threshold ?? undefined"
                  @update:value="
                    (value) =>
                      (form.threshold =
                        typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :step="0.01"
                  :addon-after="$t('tools.common.monthlyCny')"
                />
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.tax.month')" name="month">
                <Select v-model:value="form.month" :options="months" />
              </FormItem>
            </Col>
          </Row>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <TypographyText type="secondary">
              {{ $t('tools.tax.assumption') }}
            </TypographyText>
            <Space>
              <Button @click="reset">{{ $t('tools.common.reset') }}</Button>
              <Button type="primary" html-type="submit">
                {{ $t('tools.common.calculate') }}
              </Button>
            </Space>
          </div>
        </Form>
        <Alert
          v-if="errorKey"
          class="mt-4"
          :message="$t(errorKey)"
          type="error"
          show-icon
        />
      </Card>

      <Card
        v-if="result"
        :title="$t('tools.common.results')"
        role="region"
        :aria-label="$t('tools.tax.resultLabel')"
        aria-live="polite"
      >
        <template #extra>
          <Tag color="processing">
            {{ $t('tools.tax.badge', { month: result.month }) }}
          </Tag>
        </template>
        <Row :gutter="[24, 24]">
          <Col :xs="24" :md="12">
            <Statistic
              :title="$t('tools.tax.net')"
              :value="result.afterTaxSalary.toFixed(2)"
              :precision="2"
              :value-style="primaryValueStyle"
            >
              <template #suffix>
                <span class="text-sm">{{ $t('tools.common.cny') }}</span>
              </template>
            </Statistic>
            <TypographyText type="secondary">
              {{ $t('tools.tax.netFormula') }}
            </TypographyText>
          </Col>
          <Col :xs="24" :md="12">
            <Statistic
              :title="$t('tools.tax.current')"
              :value="result.currentTax.toFixed(2)"
              :precision="2"
            >
              <template #suffix>
                <span class="text-sm">{{ $t('tools.common.cny') }}</span>
              </template>
            </Statistic>
            <TypographyText type="secondary">
              {{ $t('tools.tax.taxFormula') }}
            </TypographyText>
          </Col>
        </Row>
        <Descriptions
          class="mt-6"
          :title="$t('tools.tax.details')"
          :column="{ xs: 1, sm: 2, lg: 3 }"
          bordered
        >
          <DescriptionsItem :label="$t('tools.tax.income')">
            {{ formatMoney(result.totalIncome) }} {{ $t('tools.common.cny') }}
          </DescriptionsItem>
          <DescriptionsItem :label="$t('tools.tax.totalInsurance')">
            {{ formatMoney(result.totalInsurance) }}
            {{ $t('tools.common.cny') }}
          </DescriptionsItem>
          <DescriptionsItem :label="$t('tools.tax.taxable')">
            {{ formatMoney(result.taxable) }} {{ $t('tools.common.cny') }}
          </DescriptionsItem>
          <DescriptionsItem :label="$t('tools.tax.rate')">
            {{ (result.rate * 100).toFixed(0) }}%
          </DescriptionsItem>
          <DescriptionsItem :label="$t('tools.tax.totalTax')">
            {{ formatMoney(result.totalTax) }} {{ $t('tools.common.cny') }}
          </DescriptionsItem>
          <DescriptionsItem :label="$t('tools.tax.paidTax')">
            {{ formatMoney(result.paidTax) }} {{ $t('tools.common.cny') }}
          </DescriptionsItem>
        </Descriptions>
        <Alert
          class="mt-6"
          type="info"
          show-icon
          :message="$t('tools.tax.notice')"
        />
      </Card>
    </div>
  </Page>
</template>
