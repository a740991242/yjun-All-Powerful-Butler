<script setup lang="ts">
import type { Fund, Point, Stock } from './model';

import { computed, onActivated, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { snapshot } from './data';
import { dateOnly, freshness } from './freshness';
defineOptions({ name: 'FinanceDataStatus' });
type Row = {
  key: string;
  code: string;
  name: string;
  kind: 'etf' | 'metrics' | 'stock';
  date: null | string;
  valid: boolean;
  missing: string[];
};
const rows = ref<Row[]>([]);
const loading = ref(false);
const failed = ref(false);
const maxDays = ref(4);
const today = ref('');
const kind = ref('all');
const state = ref('all');
const query = ref('');
const snapshotTime = ref('');
function refreshDate() {
  today.value = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
  }).format(new Date());
}
const statuses = computed(() =>
  rows.value.map((row) => ({
    ...row,
    status: freshness(row.date, row.valid, today.value, maxDays.value ?? 4),
  })),
);
const filtered = computed(() =>
  statuses.value.filter(
    (row) =>
      (kind.value === 'all' || row.kind === kind.value) &&
      (state.value === 'all' || row.status === state.value) &&
      `${row.name}${row.code}`.includes(query.value.trim()),
  ),
);
const summaries = computed(() =>
  ['stock', 'etf', 'metrics'].map((group) => {
    const list = statuses.value.filter((row) => row.kind === group);
    const dates = list
      .map((row) => row.date)
      .filter((date): date is string => date !== null)
      .toSorted();
    return {
      group,
      total: list.length,
      earliest: dates[0] ?? '—',
      latest: dates.at(-1) ?? '—',
      missing: list.filter((r) => r.status === 'missing').length,
      stale: list.filter((r) => r.status === 'stale' || r.status === 'future')
        .length,
    };
  }),
);
const columns = computed(() =>
  ['name', 'kind', 'date', 'status', 'missing'].map((key) => ({
    key,
    dataIndex: key,
    title: $t(`dataStatus.${key}`),
  })),
);
const validPrice = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;
const validMetric = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value);
async function load() {
  loading.value = true;
  failed.value = false;
  refreshDate();
  const next: Row[] = [];
  const results = await Promise.allSettled([
    snapshot<{ stocks: Stock[]; updatedAt: string }>('stocks').then((data) => {
      snapshotTime.value = data.updatedAt;
      for (const stock of data.stocks) {
        next.push({
          key: `stock-${stock.code}`,
          code: stock.code,
          name: stock.name,
          kind: 'stock',
          date: dateOnly(stock.priceDate),
          valid: validPrice(stock.price),
          missing: validPrice(stock.price) ? [] : ['price'],
        });
        const missing = [];
        if (!validMetric(stock.pe)) missing.push('pe');
        if (!validMetric(stock.dividendYield)) missing.push('dividendYield');
        next.push({
          key: `metrics-${stock.code}`,
          code: stock.code,
          name: stock.name,
          kind: 'metrics',
          date: dateOnly(stock.metricsAsOf),
          valid: missing.length === 0,
          missing,
        });
      }
    }),
    snapshot<{ funds: Fund[] }>('etfs').then(async (data) => {
      const results = await Promise.allSettled(
        data.funds.map(async (fund) => {
          let points: Point[];
          try {
            points = await snapshot<Point[]>(fund.code);
          } catch {
            next.push({
              key: `etf-${fund.code}`,
              code: fund.code,
              name: fund.name,
              kind: 'etf',
              date: null,
              valid: false,
              missing: ['history'],
            });
            throw new Error('history');
          }
          const latest = points
            .toSorted((a, b) => a.date.localeCompare(b.date))
            .at(-1);
          next.push({
            key: `etf-${fund.code}`,
            code: fund.code,
            name: fund.name,
            kind: 'etf',
            date: dateOnly(latest?.date),
            valid: validPrice(latest?.close),
            missing: validPrice(latest?.close) ? [] : ['price'],
          });
        }),
      );
      if (results.some((r) => r.status === 'rejected'))
        throw new Error('partial');
    }),
  ]);
  failed.value = results.some((result) => result.status === 'rejected');
  rows.value = next;
  loading.value = false;
}
onMounted(load);
onActivated(refreshDate);
</script>
<template>
  <Page
    :title="$t('dataStatus.title')"
    :description="$t('dataStatus.description')"
  >
    <div class="flex flex-col gap-4">
      <Alert v-if="failed" type="error" :message="$t('dataStatus.failed')" />
      <Space wrap>
        <Button :loading="loading" @click="load">
          {{ $t('dataStatus.refresh') }}
</Button><span>{{ $t('dataStatus.maxDays') }}</span><InputNumber
          v-model:value="maxDays"
          :min="0"
          :max="365"
          :precision="0"
          :aria-label="$t('dataStatus.maxDays')"
        /><span>{{ $t('dataStatus.reference') }} {{ today }}</span>
      </Space>
      <p class="text-muted-foreground">
        {{ $t('dataStatus.rule') }} {{ $t('dataStatus.snapshot') }}
        {{ snapshotTime || '—' }}
      </p>
      <Spin :spinning="loading">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            v-for="summary in summaries"
            :key="summary.group"
            :title="$t(`dataStatus.${summary.group}`)"
          >
            <p>{{ $t('dataStatus.total') }} {{ summary.total }}</p>
            <p>{{ summary.earliest }} → {{ summary.latest }}</p>
            <Space wrap>
              <Tag color="orange">
                {{ $t('dataStatus.stale') }} / {{ $t('dataStatus.future') }}:
                {{ summary.stale }}
</Tag><Tag color="red">
                {{ $t('dataStatus.missing') }}: {{ summary.missing }}
              </Tag>
            </Space>
          </Card>
        </div>
      </Spin>
      <Card>
        <Space wrap class="mb-4">
          <Input
            v-model:value="query"
            :aria-label="$t('dataStatus.search')"
            :placeholder="$t('dataStatus.search')"
          /><Select
            v-model:value="kind"
            :aria-label="$t('dataStatus.kind')"
            :options="
              ['all', 'stock', 'etf', 'metrics'].map((value) => ({
                value,
                label: $t(`dataStatus.${value}`),
              }))
            "
            style="width: 150px"
          /><Select
            v-model:value="state"
            :aria-label="$t('dataStatus.status')"
            :options="
              ['all', 'fresh', 'stale', 'missing', 'future'].map((value) => ({
                value,
                label: $t(`dataStatus.${value}`),
              }))
            "
            style="width: 150px"
          />
        </Space>
        <Table
          :columns="columns"
          :data-source="filtered"
          :pagination="{ pageSize: 20 }"
          :scroll="{ x: 700 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              {{ record.name }}
              <span class="text-muted-foreground">{{
                record.code
              }}</span>
</template><template
              v-else-if="column.key === 'kind' || column.key === 'status'"
            >
              {{ $t(`dataStatus.${record[column.key]}`) }}
</template><template v-else-if="column.key === 'missing'">
              {{
                [...record.missing, ...(!record.date ? ['date'] : [])]
                  .map((field) => $t(`dataStatus.${field}`))
                  .join(' / ') || '—'
              }}
</template><template v-else>{{ record.date || '—' }}</template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
