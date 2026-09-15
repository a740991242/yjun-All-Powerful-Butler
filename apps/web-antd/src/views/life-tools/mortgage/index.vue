<script lang="ts" setup>
import type {
  FormInstance,
  FormProps,
  TableColumnsType,
  TablePaginationConfig,
} from 'ant-design-vue';

import type {
  MortgageInput,
  MortgageResult,
  RepaymentDetail,
} from '../calculations';

import { computed, nextTick, reactive, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { i18n } from '@vben/locales';

import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  FormItem,
  InputNumber,
  RadioButton,
  RadioGroup,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  TypographyText,
} from 'ant-design-vue';

import { $t } from '#/locales';

import {
  calculateMortgage,
  CalculationError,
  DEFAULT_MORTGAGE,
  DEFAULT_RATES,
  formatMoney,
} from '../calculations';

defineOptions({ name: 'MortgageCalculator' });

type MortgageForm = Omit<
  MortgageInput,
  'annualRate' | 'downPaymentRate' | 'principalAmount' | 'totalPrice'
> & {
  amountMode: 'price' | 'principal';
  principalAmount: null | number;
  annualRate: null | number;
  downPaymentRate: null | number;
  totalPrice: null | number;
};

const form = reactive<MortgageForm>({
  ...DEFAULT_MORTGAGE,
  amountMode: 'price',
  principalAmount: 140,
});
const formRef = ref<FormInstance>();
const result = ref<MortgageResult>();
const errorKey = ref('');
const paymentDescription = computed(() => {
  if (!result.value) return '';
  const { repayType, firstMonthlyPayment, lastMonthlyPayment } = result.value;
  return repayType === 'equalPrincipal'
    ? $t('tools.mortgage.range', {
        first: formatMoney(firstMonthlyPayment),
        last: formatMoney(lastMonthlyPayment),
      })
    : $t('tools.mortgage.fixed', { amount: formatMoney(firstMonthlyPayment) });
});
const years = computed(() =>
  Array.from({ length: 40 }, (_, index) => ({
    label: $t('tools.common.year', { count: index + 1 }),
    value: index + 1,
  })),
);
const primaryValueStyle = { color: 'hsl(var(--primary))' };
const rules = computed<FormProps['rules']>(() => ({
  principalAmount: [
    {
      required: true,
      validator: async (_rule, value) => {
        if (!Number.isFinite(value) || value <= 0)
          throw new Error($t('tools.errors.principal'));
      },
    },
  ],
  totalPrice: [
    {
      required: true,
      validator: async (_rule, value) => {
        if (!Number.isFinite(value) || value <= 0)
          throw new Error($t('tools.errors.price'));
      },
    },
  ],
  downPaymentRate: [
    {
      required: true,
      validator: async (_rule, value) => {
        if (!Number.isFinite(value) || value < 0 || value >= 100)
          throw new Error($t('tools.errors.downRate'));
      },
    },
  ],
  annualRate: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: $t('tools.errors.rate'),
    },
  ],
}));
const columns = computed<TableColumnsType<RepaymentDetail>>(() => [
  {
    title: $t('tools.mortgage.period'),
    dataIndex: 'period',
    width: 80,
    align: 'center',
  },
  {
    title: $t('tools.mortgage.paymentColumn'),
    dataIndex: 'payment',
    width: 160,
    align: 'right',
  },
  {
    title: $t('tools.mortgage.principalColumn'),
    dataIndex: 'principal',
    width: 160,
    align: 'right',
  },
  {
    title: $t('tools.mortgage.interestColumn'),
    dataIndex: 'interest',
    width: 160,
    align: 'right',
  },
  {
    title: $t('tools.mortgage.remainingColumn'),
    dataIndex: 'remainingPrincipal',
    width: 180,
    align: 'right',
  },
]);
const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 12,
  pageSizeOptions: ['12', '24', '60', '120'],
  showSizeChanger: true,
  showTotal: (total) => $t('tools.common.periods', { count: total }),
});

function changePage(value: TablePaginationConfig) {
  pagination.current = value.current;
  pagination.pageSize = value.pageSize;
}

function calculate() {
  pagination.current = 1;
  try {
    result.value = calculateMortgage({
      ...form,
      principalAmount: form.principalAmount ?? Number.NaN,
      totalPrice: form.totalPrice ?? Number.NaN,
      downPaymentRate: form.downPaymentRate ?? Number.NaN,
      annualRate: form.annualRate ?? Number.NaN,
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
  Object.assign(form, DEFAULT_MORTGAGE, {
    amountMode: 'price',
    principalAmount: 140,
  });
  await nextTick();
  formRef.value?.clearValidate();
  calculate();
}

watch(
  () => form.loanType,
  (type) => {
    form.annualRate = DEFAULT_RATES[type];
  },
);
watch(form, calculate, { immediate: true });
watch(
  () => form.amountMode,
  async () => {
    await nextTick();
    formRef.value?.clearValidate();
  },
);
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
    :title="$t('tools.menu.mortgage')"
    :description="$t('tools.mortgage.description')"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <Card :title="$t('tools.mortgage.info')">
        <Form
          ref="formRef"
          :model="form"
          :rules="rules"
          layout="vertical"
          @finish="calculate"
        >
          <FormItem :label="$t('tools.mortgage.amountMode')" name="amountMode">
            <RadioGroup v-model:value="form.amountMode" name="amountMode">
              <RadioButton value="price">
{{
                $t('tools.mortgage.fromPrice')
              }}
</RadioButton>
              <RadioButton value="principal">
{{
                $t('tools.mortgage.directAmount')
              }}
</RadioButton>
            </RadioGroup>
          </FormItem>
          <Row :gutter="24">
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.mortgage.type')" name="loanType">
                <RadioGroup v-model:value="form.loanType" name="loanType">
                  <RadioButton value="commercial">
                    {{ $t('tools.mortgage.commercial') }}
                  </RadioButton>
                  <RadioButton value="fund">
                    {{ $t('tools.mortgage.fund') }}
                  </RadioButton>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :xl="8">
              <FormItem
                :label="$t('tools.mortgage.repayment')"
                name="repayType"
              >
                <RadioGroup v-model:value="form.repayType" name="repayType">
                  <RadioButton value="equalInterest">
                    {{ $t('tools.mortgage.equalInterest') }}
                  </RadioButton>
                  <RadioButton value="equalPrincipal">
                    {{ $t('tools.mortgage.equalPrincipal') }}
                  </RadioButton>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col v-if="form.amountMode === 'price'" :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.mortgage.price')" name="totalPrice">
                <InputNumber
                  :value="form.totalPrice ?? undefined"
                  @update:value="
                    (value) =>
                      (form.totalPrice =
                        typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :step="1"
                  :addon-after="$t('tools.common.tenThousand')"
                />
              </FormItem>
            </Col>
            <Col v-else :xs="24" :md="12" :xl="8">
              <FormItem
                :label="$t('tools.mortgage.directPrincipal')"
                name="principalAmount"
                :extra="$t('tools.mortgage.principalNote')"
              >
                <InputNumber
                  :value="form.principalAmount ?? undefined"
                  @update:value="
                    (value) =>
                      (form.principalAmount =
                        typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :step="1"
                  :addon-after="$t('tools.common.tenThousand')"
                />
              </FormItem>
            </Col>
            <Col v-if="form.amountMode === 'price'" :xs="24" :md="12" :xl="8">
              <FormItem
                :label="$t('tools.mortgage.downRate')"
                name="downPaymentRate"
              >
                <InputNumber
                  :value="form.downPaymentRate ?? undefined"
                  @update:value="
                    (value) =>
                      (form.downPaymentRate =
                        typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :max="99.99"
                  :step="0.01"
                  addon-after="%"
                />
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.mortgage.years')" name="loanYears">
                <Select v-model:value="form.loanYears" :options="years" />
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :xl="8">
              <FormItem :label="$t('tools.mortgage.rate')" name="annualRate">
                <InputNumber
                  :value="form.annualRate ?? undefined"
                  @update:value="
                    (value) =>
                      (form.annualRate =
                        typeof value === 'number' ? value : null)
                  "
                  class="w-full"
                  :min="0"
                  :step="0.01"
                  addon-after="%"
                />
              </FormItem>
            </Col>
          </Row>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <TypographyText type="secondary">
              {{ $t('tools.mortgage.rateNote') }}
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

      <template v-if="result">
        <Card
          :title="$t('tools.common.results')"
          role="region"
          :aria-label="$t('tools.mortgage.resultLabel')"
          aria-live="polite"
        >
          <template #extra>
            <Tag color="processing">
              {{
                result.repayType === 'equalInterest'
                  ? $t('tools.mortgage.equalInterest')
                  : $t('tools.mortgage.equalPrincipal')
              }}
            </Tag>
          </template>
          <div
            class="grid gap-6 sm:grid-cols-2"
            :class="
              result.downPayment === null ? 'xl:grid-cols-4' : 'xl:grid-cols-5'
            "
          >
            <Statistic
              :title="$t('tools.mortgage.loanAmount')"
              :value="(result.loanAmount / 10_000).toFixed(2)"
              :precision="2"
            >
              <template #suffix>
                <span class="text-sm">{{
                  $t('tools.common.tenThousand')
                }}</span>
              </template>
            </Statistic>
            <Statistic
              :title="
                result.repayType === 'equalInterest'
                  ? $t('tools.mortgage.monthlyPayment')
                  : $t('tools.mortgage.firstPayment')
              "
              :value="result.firstMonthlyPayment.toFixed(2)"
              :precision="2"
              :value-style="primaryValueStyle"
            >
              <template #suffix>
                <span class="text-sm">{{ $t('tools.common.cny') }}</span>
              </template>
            </Statistic>
            <Statistic
              :title="$t('tools.mortgage.interest')"
              :value="(result.totalInterest / 10_000).toFixed(2)"
              :precision="2"
            >
              <template #suffix>
                <span class="text-sm">{{
                  $t('tools.common.tenThousand')
                }}</span>
              </template>
            </Statistic>
            <Statistic
              :title="$t('tools.mortgage.total')"
              :value="(result.totalPayment / 10_000).toFixed(2)"
              :precision="2"
            >
              <template #suffix>
                <span class="text-sm">{{
                  $t('tools.common.tenThousand')
                }}</span>
              </template>
            </Statistic>
            <Statistic
              v-if="result.downPayment !== null"
              :title="$t('tools.mortgage.downPayment')"
              :value="(result.downPayment / 10_000).toFixed(2)"
              :precision="2"
            >
              <template #suffix>
                <span class="text-sm">{{
                  $t('tools.common.tenThousand')
                }}</span>
              </template>
            </Statistic>
          </div>
          <Alert
            class="mt-6"
            type="info"
            show-icon
            :message="$t('tools.mortgage.notice')"
          />
        </Card>

        <Card :title="$t('tools.mortgage.schedule')">
          <TypographyText type="secondary">
            {{ paymentDescription }}
          </TypographyText>
          <Table
            class="mt-4"
            :columns="columns"
            :data-source="result.details"
            :pagination="pagination"
            :scroll="{ x: 740 }"
            row-key="period"
            size="middle"
            bordered
            @change="changePage"
          >
            <template #bodyCell="{ column, text }">
              <TypographyText
                v-if="column.dataIndex === 'payment'"
                class="text-primary"
              >
                {{ formatMoney(Number(text)) }}
              </TypographyText>
              <template v-else-if="column.dataIndex !== 'period'">
                {{ formatMoney(Number(text)) }}
              </template>
              <template v-else>{{ text }}</template>
            </template>
          </Table>
        </Card>
      </template>
    </div>
  </Page>
</template>
