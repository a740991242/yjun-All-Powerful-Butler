<script lang="ts" setup>
import type { TableColumnsType, TableProps } from 'ant-design-vue';

import type { Holding, Stock } from '../model';

import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Collapse,
  CollapsePanel,
  Dropdown,
  Empty,
  Form,
  FormItem,
  Input,
  InputNumber,
  Menu,
  MenuItem,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  theme,
  Tooltip,
  Upload,
} from 'ant-design-vue';

import { $t } from '#/locales';

import FinanceChart from '../chart.vue';
import { number, signed, snapshot } from '../data';
import { parseHoldings, portfolio, validateHoldings } from '../model';
import { moveOrder, reconcileOrder } from '../watchlist-order';
defineOptions({ name: 'FinancePortfolio' });
const { token } = theme.useToken();
const storageKey = 'all-in-one-butler:finance:holdings:v1';
const stocks = ref<Stock[]>([]);
const orderKey = 'all-in-one-butler:finance:watchlist-order:v1';
const order = ref<string[]>([]);
const sortState = ref<{ field: string; order: 'ascend' | 'descend' | null }>({
  field: '',
  order: null,
});
const currentPage = ref(1);
const pageSize = ref(10);
const updatedAt = ref('');
const rangeStart = ref('');
const rangeEnd = ref('');
const holdings = ref<Holding[]>([]);
const loading = ref(false);
const failed = ref(false);
const storageError = ref(false);
const route = useRoute();
const query = ref(typeof route.query.code === 'string' ? route.query.code : '');
watch(
  () => route.query.code,
  (code) => {
    if (route.path === '/finance/portfolio')
      query.value = typeof code === 'string' ? code : '';
  },
);
const filter = ref('all');
const market = ref<'a' | 'all' | 'hk'>('all');
const editing = ref(false);
const form = reactive<{
  code: string;
  quantity: number | undefined;
  cost: number | undefined;
}>({ code: '', quantity: undefined, cost: undefined });
const error = ref(false);
const result = computed(() => portfolio(stocks.value, holdings.value));
type PortfolioRow = ReturnType<typeof portfolio>['rows'][number];
const rows = computed(() =>
  [...result.value.rows]
    .toSorted(
      (a, b) => order.value.indexOf(a.code) - order.value.indexOf(b.code),
    )
    .filter(
      (row) =>
        (!query.value ||
          `${row.name}${row.code}`.includes(query.value.trim())) &&
        (filter.value !== 'held' || row.quantity !== null) &&
        (market.value === 'all' ||
          (market.value === 'hk'
            ? row.code.startsWith('HK')
            : /^\d{6}$/.test(row.code))),
    ),
);
const columns = computed<TableColumnsType<PortfolioRow>>(() => [
  {
    title: $t('finance.rowNumber'),
    key: 'rowNumber',
    width: 70,
    align: 'center',
    fixed: 'left',
  },
  {
    title: $t('finance.security'),
    dataIndex: 'name',
    fixed: 'left',
    width: 150,
  },
  ...(
    [
      'price',
      'dividendYield',
      'pe',
      'high52Week',
      'low52Week',
      'quantity',
      'cost',
      'value',
      'pnl',
      'percent',
    ] as const
  ).map((key) => ({
    title: $t(`finance.${key}`),
    dataIndex: key,
    align: 'right' as const,
    width: 135,
    sortOrder: sortState.value.field === key ? sortState.value.order : null,
    sorter: (a: PortfolioRow, b: PortfolioRow) =>
      (a[key] ?? -Infinity) - (b[key] ?? -Infinity),
  })),
  { title: $t('finance.actions'), key: 'actions', width: 200, fixed: 'right' },
]);
const chart = computed(() => ({
  tooltip: { trigger: 'item' as const, renderMode: 'richText' as const },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie' as const,
      radius: ['42%', '65%'],
      center: ['50%', '42%'],
      label: { show: false },
      data: result.value.rows
        .filter((row) => row.value !== null)
        .map((row) => ({ name: row.name, value: row.value ?? 0 })),
    },
  ],
}));
async function load() {
  loading.value = true;
  failed.value = false;
  try {
    const data = await snapshot<{
      stocks: Stock[];
      updatedAt: string;
      rangeStart: string;
      rangeEnd: string;
    }>('stocks');
    stocks.value = data.stocks;
    updatedAt.value = data.updatedAt;
    rangeStart.value = data.rangeStart;
    rangeEnd.value = data.rangeEnd;
    const codes = stocks.value.map((stock) => stock.code);
    order.value = codes;
    try {
      const savedOrder = localStorage.getItem(orderKey);
      order.value = reconcileOrder(
        savedOrder ? JSON.parse(savedOrder) : [],
        codes,
      );
    } catch {
      message.warning($t('finance.orderReadError'));
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved)
        holdings.value = validateHoldings(
          JSON.parse(saved),
          stocks.value.map((s) => s.code),
        );
    } catch {
      storageError.value = true;
    }
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}
function reorder(code: string, direction: 'down' | 'top' | 'up') {
  const next = moveOrder(
    order.value,
    rows.value.map((row) => row.code),
    code,
    direction,
  );
  try {
    localStorage.setItem(orderKey, JSON.stringify(next));
    order.value = next;
    sortState.value = { field: '', order: null };
    currentPage.value =
      Math.floor(
        rows.value.findIndex((row) => row.code === code) / pageSize.value,
      ) + 1;
  } catch {
    message.error($t('finance.orderSaveError'));
  }
}
const changeTable: NonNullable<TableProps<PortfolioRow>['onChange']> = (
  pagination,
  _filters,
  sorter,
) => {
  const nextPageSize = pagination.pageSize ?? pageSize.value;
  currentPage.value =
    nextPageSize === pageSize.value ? (pagination.current ?? 1) : 1;
  pageSize.value = nextPageSize;
  const active = Array.isArray(sorter) ? sorter[0] : sorter;
  sortState.value = {
    field: String(active?.field ?? ''),
    order: active?.order ?? null,
  };
};
function persist(next: Holding[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    holdings.value = next;
    storageError.value = false;
    return true;
  } catch {
    storageError.value = true;
    return false;
  }
}
function edit(code = stocks.value[0]?.code ?? '') {
  const current = holdings.value.find((item) => item.code === code);
  Object.assign(form, {
    code,
    quantity: current?.quantity ?? undefined,
    cost: current?.cost ?? undefined,
  });
  error.value = false;
  editing.value = true;
}
function save() {
  try {
    const next = validateHoldings(
      [form],
      stocks.value.map((s) => s.code),
    );
    if (
      persist([
        ...holdings.value.filter((item) => item.code !== form.code),
        ...next,
      ])
    )
      editing.value = false;
  } catch {
    error.value = true;
  }
}
async function importFile(file: File) {
  try {
    if (file.size > 2_000_000) throw new Error('size');
    const imported = parseHoldings(
      await file.text(),
      stocks.value.map((s) => s.code),
    );
    const codes = new Set(imported.map((row) => row.code));
    if (
      persist([
        ...holdings.value.filter((row) => !codes.has(row.code)),
        ...imported,
      ])
    )
      message.success($t('finance.imported'));
  } catch {
    message.error($t('finance.invalid'));
  }
  return false;
}
function exportFile() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(holdings.value, null, 2)], {
      type: 'application/json',
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'holdings.json';
  link.click();
  URL.revokeObjectURL(url);
}
watch([query, filter, market], () => {
  currentPage.value = 1;
});
onMounted(load);
</script>
<template>
  <Page
    :title="$t('finance.menu.portfolio')"
    :description="$t('finance.portfolioDescription')"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <Alert
        v-if="failed"
        type="error"
        :message="$t('finance.loadError')"
        show-icon
      >
        <template #action>
          <Button @click="load">{{ $t('finance.retry') }}</Button>
        </template>
      </Alert>
      <Spin :spinning="loading">
        <div v-if="stocks.length" class="flex flex-col gap-4">
          <Collapse :default-active-key="[]" :destroy-inactive-panel="true">
            <CollapsePanel key="holdings" :header="$t('finance.holdingsPanel')">
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <Space wrap>
                    <Tag color="blue">
                      {{ $t('finance.snapshot') }}
                      {{ stocks[0]?.priceDate }}
</Tag><Tag>{{ $t('finance.localOnly') }}</Tag>
</Space><Space wrap>
                    <Upload
                      accept=".md,.json"
                      :show-upload-list="false"
                      :before-upload="importFile"
                    >
                      <Button>{{ $t('finance.import') }}</Button>
</Upload><Button :disabled="!holdings.length" @click="exportFile">
                      {{ $t('finance.export') }}
</Button><Button type="primary" @click="edit()">
                      {{ $t('finance.addHolding') }}
                    </Button>
                  </Space>
                </div>
                <Alert
                  v-if="storageError"
                  type="error"
                  :message="$t('finance.storageError')"
                  show-icon
                />
                <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Card
                    v-for="key in [
                      'value',
                      'invested',
                      'pnl',
                      'percent',
                    ] as const"
                    :key="key"
                  >
                    <Statistic
                      :title="$t(`finance.${key}`)"
                      :value="holdings.length ? number(result[key]) : '—'"
                      :suffix="key === 'percent' ? '%' : $t('finance.cny')"
                    />
                  </Card>
                </div>
                <div v-if="holdings.length" class="grid gap-4 lg:grid-cols-3">
                  <Card :title="$t('finance.allocation')" class="lg:col-span-2">
                    <FinanceChart :options="chart" />
</Card><Card :title="$t('finance.calculation')">
                    <div class="flex flex-col gap-4 text-muted-foreground">
                      <p>{{ $t('finance.pnlNote') }}</p>
                      <p>{{ $t('finance.importNote') }}</p>
                      <Popconfirm
                        :title="$t('finance.clearConfirm')"
                        @confirm="persist([])"
                      >
                        <Button danger>{{ $t('finance.clear') }}</Button>
                      </Popconfirm>
                    </div>
                  </Card>
                </div>
                <Card v-else>
                  <Empty :description="$t('finance.emptyHoldings')">
                    <Button type="primary" @click="edit()">
                      {{ $t('finance.addHolding') }}
                    </Button>
                    <p class="mt-4 text-muted-foreground">
                      {{ $t('finance.importNote') }}
                    </p>
                  </Empty>
                </Card>
              </div>
            </CollapsePanel>
          </Collapse>
          <Card :title="$t('finance.watchlist')">
            <div class="finance-detail-layout">
              <div class="finance-filter-row">
                <Input
                  v-model:value="query"
                  allow-clear
                  :placeholder="$t('finance.search')"
                  :aria-label="$t('finance.search')"
                />
                <Select
                  v-model:value="market"
                  class="w-full"
                  :aria-label="$t('finance.marketFilter')"
                  :options="[
                    { value: 'all', label: $t('finance.allMarkets') },
                    { value: 'a', label: $t('finance.aShares') },
                    { value: 'hk', label: $t('finance.hkShares') },
                  ]"
                />
                <Select
                  v-model:value="filter"
                  class="w-full"
                  :aria-label="$t('finance.filter')"
                  :options="[
                    { value: 'all', label: $t('finance.all') },
                    { value: 'held', label: $t('finance.held') },
                  ]"
                />
              </div>
              <p class="finance-order-note text-sm text-muted-foreground">
                {{ $t('finance.orderNote') }}
              </p>
              <Table
                :columns="columns"
                :data-source="rows"
                row-key="code"
                :scroll="{ x: 1770 }"
                :pagination="{
                  current: currentPage,
                  pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '30', '50'],
                  showTotal: (total: number) =>
                    $t('finance.totalRows', { total }),
                }"
                @change="changeTable"
              >
                <template #bodyCell="{ column, record, text, index }">
                  <template v-if="column.key === 'rowNumber'">
                    {{ (currentPage - 1) * pageSize + index + 1 }}
                  </template>
                  <template v-else-if="column.dataIndex === 'name'">
                    <div>{{ record.name }}</div>
                    <span class="text-xs text-muted-foreground">{{
                      record.code
                    }}</span>
                    <div
                      v-if="record.currency === 'HKD' && record.priceDate"
                      class="text-xs text-muted-foreground"
                    >
                      {{ $t('finance.snapshot') }} {{ record.priceDate }}
                    </div>
                    <div
                      v-if="record.price === null"
                      class="text-xs text-muted-foreground"
                    >
                      {{ $t('finance.noQuote') }}
                    </div>
</template><Space v-else-if="column.key === 'actions'" :size="0">
                    <Button
                      type="link"
                      size="small"
                      :disabled="order[0] === record.code"
                      @click="reorder(record.code, 'top')"
                    >
                      {{ $t('finance.moveTop') }}
                    </Button>
                    <Dropdown :trigger="['click']">
                      <Button type="link" size="small">
                        {{ $t('finance.reorder') }}
                      </Button>
                      <template #overlay>
                        <Menu>
                          <MenuItem
                            :disabled="rows[0]?.code === record.code"
                            @click="reorder(record.code, 'up')"
                          >
                            {{ $t('finance.moveUp') }}
                          </MenuItem>
                          <MenuItem
                            :disabled="rows.at(-1)?.code === record.code"
                            @click="reorder(record.code, 'down')"
                          >
                            {{ $t('finance.moveDown') }}
                          </MenuItem>
                        </Menu>
                      </template>
                    </Dropdown>
                    <Button
                      type="link"
                      size="small"
                      :disabled="record.price === null"
                      @click="edit(record.code)"
                    >
                      {{ $t('finance.edit') }}
                    </Button>
</Space><Tooltip
                    v-else-if="
                      column.dataIndex === 'dividendYield' ||
                      column.dataIndex === 'pe'
                    "
                    :title="
                      column.dataIndex === 'dividendYield' &&
                      record.dividendYear
                        ? $t('finance.annualDividendDetails', {
                            year: record.dividendYear,
                            total: number(record.dividendPerShare, 4),
                            special: number(record.specialDividendPerShare, 4),
                            regular: number(record.dividendYieldExSpecial),
                            price: number(record.price),
                          })
                        : $t('finance.metricTime', { time: record.metricsAsOf })
                    "
                  >
                    <span
                      :style="{
                        color:
                          typeof text === 'number' &&
                          Number.isFinite(text) &&
                          text > 0 &&
                          (column.dataIndex === 'dividendYield'
                            ? text > 4.5
                            : text < 5.2)
                            ? token.colorError
                            : undefined,
                      }"
                      >{{ number(text)
                      }}{{
                        column.dataIndex === 'dividendYield' && text !== null
                          ? '%'
                          : ''
                      }}<span
                        v-if="
                          column.dataIndex === 'dividendYield' &&
                          record.specialDividendPerShare
                        "
                        class="block text-xs text-muted-foreground"
                        >{{ $t('finance.includesSpecialDividend') }}</span></span>
                  </Tooltip>
                  <Tooltip
                    v-else-if="
                      column.dataIndex === 'high52Week' ||
                      column.dataIndex === 'low52Week'
                    "
                    :title="
                      $t('finance.rangeDetails', {
                        start: record.rangeFirstDate,
                        end: record.rangeLastDate,
                        days: record.rangeTradingDays,
                      })
                    "
                  >
                    <span>{{ number(text)
                      }}<span
                        v-if="record.currency === 'HKD'"
                        class="ml-1 text-xs text-muted-foreground"
                        >{{ $t('finance.hkd') }}</span></span>
                  </Tooltip>
                  <template v-else-if="column.dataIndex === 'percent'">
                    {{ text === null ? '—' : `${signed(text)}%` }}
</template><span v-else>{{
                      column.dataIndex === 'pnl'
                        ? signed(text)
                        : number(text, column.dataIndex === 'quantity' ? 0 : 2)
                    }}<span
                      v-if="
                        column.dataIndex === 'price' &&
                        record.currency === 'HKD'
                      "
                      class="ml-1 text-xs text-muted-foreground"
                      >{{ $t('finance.hkd') }}</span></span>
                </template>
              </Table>
            </div>
          </Card>
          <Alert
            type="info"
            show-icon
            :message="$t('finance.sourceTitle')"
            :description="
              $t('finance.stockSource', { updatedAt, rangeStart, rangeEnd })
            "
          />
        </div>
      </Spin>
    </div>
    <Modal
      v-model:open="editing"
      :title="$t('finance.editHolding')"
      :ok-text="$t('finance.save')"
      :cancel-text="$t('finance.cancel')"
      @ok="save"
    >
      <Form layout="vertical" name="holding" :model="form">
        <FormItem name="code" :label="$t('finance.security')">
          <Select
            :value="form.code"
            show-search
            option-filter-prop="label"
            :options="
              stocks.map((s) => ({
                label: `${s.code} ${s.name}`,
                value: s.code,
                disabled: s.price === null,
              }))
            "
            @change="(value) => edit(String(value))"
          />
</FormItem><FormItem name="quantity" :label="$t('finance.quantity')">
          <InputNumber
            v-model:value="form.quantity"
            class="!w-full"
            :min="1"
            :max="1e10"
            :precision="0"
          />
</FormItem><FormItem name="cost" :label="$t('finance.cost')">
          <InputNumber
            v-model:value="form.cost"
            class="!w-full"
            :min="0"
            :max="1e10"
            :precision="4"
          />
        </FormItem>
      </Form>
      <Alert v-if="error" type="error" :message="$t('finance.invalid')" />
      <Popconfirm
        v-if="holdings.some((h) => h.code === form.code)"
        :title="$t('finance.removeConfirm')"
        @confirm="
          () => {
            if (persist(holdings.filter((h) => h.code !== form.code)))
              editing = false;
          }
        "
      >
        <Button danger>{{ $t('finance.remove') }}</Button>
      </Popconfirm>
    </Modal>
  </Page>
</template>

<style scoped>
.finance-detail-layout {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.finance-detail-layout > * {
  min-width: 0;
}

.finance-filter-row {
  display: grid;
  grid-template-columns: minmax(0, 320px) repeat(2, minmax(120px, 180px));
  gap: 12px;
  align-items: center;
}

.finance-order-note {
  margin: 0;
  line-height: 1.75;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .finance-filter-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
