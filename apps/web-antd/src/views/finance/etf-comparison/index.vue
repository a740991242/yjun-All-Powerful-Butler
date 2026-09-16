<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

import type { Fund, Point } from '../model';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Empty,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'ant-design-vue';

import { $t } from '#/locales';

import FinanceChart from '../chart.vue';
import { number, signed, snapshot } from '../data';
import { compare, periodStart } from '../model';
defineOptions({ name: 'FinanceEtfComparison' });
const funds = ref<Fund[]>([]);
const route = useRoute();
const selected = ref<string[]>(['510300', '513100', '518880']);
const months = ref(12);
const histories = ref<Record<string, Point[]>>({});
const loading = ref(false);
const failed = ref(false);
let requestId = 0;
const latest = computed(
  () =>
    funds.value
      .filter((f) => selected.value.includes(f.code))
      .map((f) => f.end)
      .toSorted()
      .at(-1) ?? '2026-09-08',
);
const result = computed(() =>
  compare(
    selected.value.map((code) => ({
      code,
      points: histories.value[code] ?? [],
    })),
    periodStart(latest.value, months.value),
  ),
);
const rows = computed(() =>
  result.value.rows.map((row) => ({
    ...row,
    name: funds.value.find((fund) => fund.code === row.code)?.name ?? row.code,
  })),
);
type CompareRow = (typeof rows.value)[number];
const columns = computed<TableColumnsType<CompareRow>>(() => [
  { title: $t('finance.security'), dataIndex: 'name', width: 240 },
  ...(['close', 'change', 'maxDrawdown'] as const).map((key) => ({
    title: $t(`finance.${key}`),
    dataIndex: key,
    align: 'right' as const,
    sorter: (a: CompareRow, b: CompareRow) => a[key] - b[key],
  })),
]);
function chart(drawdown = false) {
  return {
    color: ['#5470c6', '#e8a838', '#26a69a', '#e66b80', '#9b72cf'],
    tooltip: { trigger: 'axis' as const, renderMode: 'richText' as const },
    legend: { bottom: 0, type: 'scroll' as const },
    grid: { left: 65, right: 24, top: 24, bottom: 75 },
    xAxis: {
      type: 'category' as const,
      data: result.value.dates,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      scale: true,
      axisLabel: { formatter: drawdown ? '{value}%' : '{value}' },
    },
    series: rows.value.map((row) => ({
      name: row.name,
      type: 'line' as const,
      showSymbol: false,
      data: (drawdown ? row.drawdown : row.normalized).map((n) =>
        Number(n.toFixed(3)),
      ),
    })),
  };
}
const normalizedChart = computed(() => chart());
const drawdownChart = computed(() => chart(true));
async function load() {
  const id = ++requestId;
  loading.value = true;
  failed.value = false;
  try {
    if (funds.value.length === 0) {
      const data = await snapshot<{ funds: Fund[] }>('etfs');
      funds.value = data.funds;
      if (
        typeof route.query.code === 'string' &&
        funds.value.some((fund) => fund.code === route.query.code)
      )
        selected.value = [route.query.code];
    }
    const values = await Promise.all(
      selected.value.map(async (code) => ({
        code,
        points: histories.value[code] ?? (await snapshot<Point[]>(code)),
      })),
    );
    if (id !== requestId) return;
    for (const value of values) histories.value[value.code] = value.points;
  } catch {
    if (id === requestId) failed.value = true;
  } finally {
    if (id === requestId) loading.value = false;
  }
}
watch(selected, load);
watch(
  () => route.query.code,
  (code) => {
    if (
      route.path === '/finance/etf-comparison' &&
      typeof code === 'string' &&
      funds.value.some((fund) => fund.code === code)
    )
      selected.value = [code];
  },
);
onMounted(load);
</script>
<template>
  <Page
    :title="$t('finance.menu.etf')"
    :description="$t('finance.etfDescription')"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <Card>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="md:col-span-2">
            <p class="mb-2">{{ $t('finance.chooseEtfs') }}</p>
            <Select
              v-model:value="selected"
              mode="multiple"
              class="w-full"
              :aria-label="$t('finance.chooseEtfs')"
              :placeholder="$t('finance.chooseEtfs')"
              :max-tag-count="3"
              option-filter-prop="label"
              :options="
                funds.map((f) => ({
                  value: f.code,
                  label: `${f.code} ${f.name}`,
                  disabled: selected.length >= 5 && !selected.includes(f.code),
                }))
              "
            />
          </div>
          <div>
            <p class="mb-2">{{ $t('finance.period') }}</p>
            <Select
              v-model:value="months"
              class="w-full"
              :aria-label="$t('finance.period')"
              :options="
                [1, 3, 12, 36, 0].map((value) => ({
                  value,
                  label: $t(`finance.periods.m${value}`),
                }))
              "
            />
          </div>
        </div>
      </Card>
      <Alert
        v-if="failed"
        type="error"
        show-icon
        :message="$t('finance.loadError')"
      >
        <template #action>
          <Button @click="load">{{ $t('finance.retry') }}</Button>
        </template>
      </Alert>
      <Spin :spinning="loading">
        <div v-if="!failed && rows.length" class="flex flex-col gap-4">
          <Space wrap>
            <Tag color="blue">
              {{ $t('finance.commonDates') }} {{ result.dates[0] }} —
              {{ result.dates.at(-1) }}
</Tag><Tag>
              {{ $t('finance.sessions', { count: result.dates.length }) }}
            </Tag>
</Space><Card :title="$t('finance.normalized')">
            <FinanceChart :options="normalizedChart" />
</Card><Card :title="$t('finance.drawdown')">
            <FinanceChart :options="drawdownChart" />
</Card><Card :title="$t('finance.summary')">
            <Table
              row-key="code"
              :data-source="rows"
              :columns="columns"
              :pagination="false"
              :scroll="{ x: 700 }"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                  {{ text }}
                  <span class="text-muted-foreground">{{
                    record.code
                  }}</span>
</template><template v-else>
                  {{
                    column.dataIndex === 'close'
                      ? number(text, 3)
                      : `${signed(text)}%`
                  }}
                </template>
              </template>
            </Table>
          </Card>
        </div>
        <Card v-else-if="!loading && !failed">
          <Empty
            :description="
              $t(selected.length ? 'finance.noOverlap' : 'finance.chooseEtfs')
            "
          />
        </Card>
      </Spin>
      <Alert
        type="info"
        show-icon
        :message="$t('finance.sourceTitle')"
        :description="$t('finance.etfSource')"
      />
    </div>
  </Page>
</template>
