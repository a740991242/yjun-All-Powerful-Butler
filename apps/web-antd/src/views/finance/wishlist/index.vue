<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

import type { Point, Stock } from '../model';
import type { Quote, Target } from './model';

import { computed, onActivated, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useWindowSize } from '@vueuse/core';
import {
  Alert,
  Button,
  Empty,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Upload,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { number, snapshot } from '../data';
import {
  catalog,
  defaults,
  evaluate,
  statusOrder,
  upgradeLegacyTargets,
  upgradeV2Targets,
  validateTargets,
} from './model';
defineOptions({ name: 'FinanceWishlist' });
const router = useRouter();
const { width } = useWindowSize();
const key = 'all-in-one-butler:finance:wishlist:v3';
const previousKey = 'all-in-one-butler:finance:wishlist:v2';
const legacyKey = 'all-in-one-butler:finance:wishlist:v1';
const targets = ref<Target[]>(defaults());
const quotes = ref<Record<string, Quote>>({});
const query = ref('');
const kind = ref('all');
const state = ref('all');
const loading = ref(false);
const failed = ref(false);
const readFailed = ref(false);
const today = ref('');
const editing = ref(false);
const adding = ref(false);
const error = ref(false);
const form = reactive<Target>({
  code: '',
  price: 1,
  rule: 'around',
  near: 3,
  note: '',
});
function updateToday() {
  today.value = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
  }).format(new Date());
}
const allRows = computed(() =>
  targets.value
    .map((target) => {
      const security = catalog.find((s) => s.code === target.code);
      if (!security) throw new Error('Unknown target code');
      return {
        ...target,
        name: security.name,
        kind: security.kind,
        quote: quotes.value[target.code],
        ...evaluate(target, quotes.value[target.code], today.value),
      };
    })
    .toSorted(
      (a, b) =>
        statusOrder[a.status] - statusOrder[b.status] ||
        (a.gap ?? Infinity) - (b.gap ?? Infinity),
    ),
);
const rows = computed(() =>
  allRows.value.filter(
    (row) =>
      (kind.value === 'all' || row.kind === kind.value) &&
      (state.value === 'all' || row.status === state.value) &&
      (row.name + row.code).includes(query.value.trim()),
  ),
);
const available = computed(() =>
  catalog.filter((s) => !targets.value.some((t) => t.code === s.code)),
);
const columns = computed<TableColumnsType<(typeof allRows.value)[number]>>(
  () => [
    { title: $t('wishlist.security'), key: 'name', width: 230, fixed: 'left' },
    { title: $t('wishlist.close'), key: 'close', width: 175, align: 'right' },
    { title: $t('wishlist.target'), key: 'target', width: 175, align: 'right' },
    { title: $t('wishlist.gap'), key: 'gap', width: 155, align: 'right' },
    { title: $t('wishlist.status'), key: 'status', width: 140 },
    { title: $t('wishlist.date'), key: 'date', width: 125 },
    { title: $t('wishlist.note'), dataIndex: 'note', width: 280 },
    {
      title: $t('wishlist.actions'),
      key: 'actions',
      width: 110,
      fixed: 'right',
    },
  ],
);
async function load() {
  loading.value = true;
  failed.value = false;
  updateToday();
  const next: Record<string, Quote> = {};
  const results = await Promise.allSettled([
    snapshot<{ stocks: Stock[] }>('stocks').then((data) => {
      for (const stock of data.stocks)
        if (catalog.some((s) => s.code === stock.code && s.kind === 'stock'))
          next[stock.code] = { price: stock.price, date: stock.priceDate };
    }),
    ...catalog
      .filter((s) => s.kind === 'etf')
      .map(async (fund) => {
        const history = await snapshot<Point[]>(fund.code);
        const latest = history
          .toSorted((a, b) => a.date.localeCompare(b.date))
          .at(-1);
        next[fund.code] = {
          price: latest?.close ?? null,
          date: latest?.date ?? null,
        };
      }),
  ]);
  failed.value = results.some((result) => result.status === 'rejected');
  quotes.value = next;
  loading.value = false;
}
function persist(next: Target[]) {
  try {
    localStorage.setItem(key, JSON.stringify(validateTargets(next)));
    targets.value = next;
    readFailed.value = false;
    return true;
  } catch {
    message.error($t('wishlist.storageError'));
    return false;
  }
}
function edit(target?: Target) {
  adding.value = !target;
  Object.assign(
    form,
    target ?? defaults().find((t) => t.code === available.value[0]?.code),
  );
  error.value = false;
  editing.value = true;
}
function changeCode(code: unknown) {
  Object.assign(
    form,
    defaults().find((t) => t.code === String(code)),
  );
}
function save() {
  try {
    const [target] = validateTargets([{ ...form }]);
    if (
      target &&
      persist([...targets.value.filter((t) => t.code !== target.code), target])
    ) {
      editing.value = false;
      message.success($t('wishlist.saved'));
    }
  } catch {
    error.value = true;
  }
}
async function importFile(file: File) {
  try {
    if (file.size > 2_000_000) throw new Error('size');
    const imported = validateTargets(JSON.parse(await file.text()));
    const codes = new Set(imported.map((t) => t.code));
    if (
      persist([...targets.value.filter((t) => !codes.has(t.code)), ...imported])
    )
      message.success($t('wishlist.imported'));
  } catch {
    message.error($t('wishlist.invalid'));
  }
  return false;
}
function exportFile() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(targets.value, null, 2)], {
      type: 'application/json',
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'wishlist.json';
  link.click();
  URL.revokeObjectURL(url);
}
onMounted(() => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      const previous = localStorage.getItem(previousKey);
      const legacy = previous === null ? localStorage.getItem(legacyKey) : null;
      if (previous !== null) {
        const upgraded = upgradeV2Targets(JSON.parse(previous));
        if (!persist(upgraded)) targets.value = upgraded;
      } else if (legacy === null) {
        persist(defaults());
      } else {
        const upgraded = upgradeV2Targets(
          upgradeLegacyTargets(JSON.parse(legacy)),
        );
        if (!persist(upgraded)) targets.value = upgraded;
      }
    } else {
      targets.value = validateTargets(JSON.parse(saved));
    }
  } catch {
    readFailed.value = true;
  }
  void load();
});
onActivated(updateToday);
</script>

<template>
  <Page :title="$t('wishlist.title')">
    <div class="flex min-w-0 flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <Tag color="blue">{{ $t('wishlist.localTag') }}</Tag>
          <span>{{
            $t('wishlist.scope', {
              total: allRows.length,
              reached: allRows.filter((r) => r.status === 'reached').length,
              near: allRows.filter((r) => r.status === 'near').length,
            })
          }}</span>
        </div>
        <Space wrap>
          <Tooltip :title="$t('wishlist.retry')">
            <Button
              :aria-label="$t('wishlist.retry')"
              :loading="loading"
              @click="load"
            >
              <IconifyIcon icon="lucide:refresh-cw" />
            </Button>
          </Tooltip>
          <Upload
            accept=".json"
            :show-upload-list="false"
            :before-upload="importFile"
          >
            <Tooltip :title="$t('wishlist.import')">
              <Button :aria-label="$t('wishlist.import')">
                <IconifyIcon icon="lucide:upload" />
              </Button>
            </Tooltip>
          </Upload>
          <Tooltip :title="$t('wishlist.export')">
            <Button :aria-label="$t('wishlist.export')" @click="exportFile">
              <IconifyIcon icon="lucide:download" />
            </Button>
          </Tooltip>
          <Button type="primary" :disabled="!available.length" @click="edit()">
            {{ $t('wishlist.add') }}
          </Button>
        </Space>
      </div>
      <Alert
        v-if="readFailed"
        type="warning"
        show-icon
        :message="$t('wishlist.readError')"
      />
      <Alert
        v-if="failed"
        type="warning"
        show-icon
        :message="$t('wishlist.loadError')"
      />
      <div class="wishlist-filters">
        <Input
          v-model:value="query"
          allow-clear
          :placeholder="$t('wishlist.search')"
          :aria-label="$t('wishlist.search')"
        />
        <Segmented
          v-model:value="kind"
          :options="
            ['all', 'stock', 'etf'].map((value) => ({
              value,
              label: $t(`wishlist.${value}`),
            }))
          "
        />
        <Select
          v-model:value="state"
          :aria-label="$t('wishlist.status')"
          :options="
            ['all', 'reached', 'near', 'waiting', 'stale', 'missing'].map(
              (value) => ({ value, label: $t(`wishlist.${value}`) }),
            )
          "
        />
      </div>
      <Spin :spinning="loading">
        <Table
          v-if="width >= 768"
          :columns="columns"
          :data-source="rows"
          row-key="code"
          :pagination="false"
          :scroll="{ x: 1490 }"
        >
          <template #emptyText>
            <Empty :description="$t('wishlist.empty')" />
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <div class="font-medium">{{ record.name }}</div>
              <div class="text-xs text-muted-foreground">
                {{ record.code }} · {{ $t(`wishlist.${record.kind}`) }}
              </div>
            </template>
            <template v-else-if="column.key === 'close'">
              ¥
              {{ number(record.quote?.price, record.kind === 'etf' ? 3 : 2) }}
            </template>
            <template v-else-if="column.key === 'target'">
              {{
                record.rule === 'around'
                  ? '≈'
                  : record.rule === 'below'
                    ? '&lt;'
                    : '≤'
              }}
              ¥
              {{ number(record.price, record.kind === 'etf' ? 3 : 2) }}
            </template>
            <template v-else-if="column.key === 'gap'">
              <span v-if="record.below > 0">{{
                $t('wishlist.below', { value: number(record.below) })
              }}</span>
              <span v-else>{{
                record.gap === null ? '—' : `${number(record.gap)}%`
              }}</span>
            </template>
            <template v-else-if="column.key === 'status'">
              <Tag
                :color="
                  record.status === 'reached'
                    ? 'green'
                    : record.status === 'near'
                      ? 'gold'
                      : undefined
                "
              >
                {{ $t(`wishlist.${record.status}`) }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'date'">
              {{ record.quote?.date ?? '—' }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <Space :size="0">
                <Tooltip :title="$t('wishlist.edit')">
                  <Button
                    type="text"
                    :aria-label="`${$t('wishlist.edit')} ${record.name}`"
                    @click="
                      edit(
                        targets.find((target) => target.code === record.code),
                      )
                    "
                  >
                    <IconifyIcon icon="lucide:pencil" />
                  </Button>
                </Tooltip>
                <Tooltip :title="$t('wishlist.detail')">
                  <Button
                    type="text"
                    :aria-label="`${$t('wishlist.detail')} ${record.name}`"
                    @click="
                      router.push({
                        path:
                          record.kind === 'etf'
                            ? '/finance/etf-comparison'
                            : '/finance/portfolio',
                        query: { code: record.code },
                      })
                    "
                  >
                    <IconifyIcon icon="lucide:arrow-up-right" />
                  </Button>
                </Tooltip>
              </Space>
            </template>
          </template>
        </Table>
        <div v-else class="min-w-0">
          <Empty v-if="!rows.length" :description="$t('wishlist.empty')" />
          <article
            v-for="record in rows"
            :key="record.code"
            class="border-border border-b py-4"
          >
            <div class="flex flex-col items-start gap-2">
              <div class="min-w-0">
                <div class="break-words font-medium">{{ record.name }}</div>
                <div class="mt-1 text-xs text-muted-foreground">
                  {{ record.code }} · {{ $t(`wishlist.${record.kind}`) }}
                </div>
              </div>
              <Tag
                class="!m-0 shrink-0"
                :color="
                  record.status === 'reached'
                    ? 'green'
                    : record.status === 'near'
                      ? 'gold'
                      : undefined
                "
              >
                {{ $t(`wishlist.${record.status}`) }}
              </Tag>
            </div>
            <dl class="my-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt class="text-muted-foreground">
                  {{ $t('wishlist.close') }}
                </dt>
                <dd class="mt-1 font-medium">
                  ¥
                  {{
                    number(record.quote?.price, record.kind === 'etf' ? 3 : 2)
                  }}
                </dd>
              </div>
              <div>
                <dt class="text-muted-foreground">
                  {{ $t('wishlist.target') }}
                </dt>
                <dd class="mt-1 font-medium">
                  {{
                    record.rule === 'around'
                      ? '≈'
                      : record.rule === 'below'
                        ? '&lt;'
                        : '≤'
                  }}
                  ¥ {{ number(record.price, record.kind === 'etf' ? 3 : 2) }}
                </dd>
              </div>
              <div>
                <dt class="text-muted-foreground">{{ $t('wishlist.gap') }}</dt>
                <dd class="mt-1">
                  {{
                    record.below !== null && record.below > 0
                      ? $t('wishlist.below', { value: number(record.below) })
                      : record.gap === null
                        ? '—'
                        : `${number(record.gap)}%`
                  }}
                </dd>
              </div>
              <div>
                <dt class="text-muted-foreground">{{ $t('wishlist.date') }}</dt>
                <dd class="mt-1">{{ record.quote?.date ?? '—' }}</dd>
              </div>
            </dl>
            <p
              v-if="record.note"
              class="mb-2 break-words text-sm text-muted-foreground"
            >
              {{ record.note }}
            </p>
            <div class="flex justify-end gap-2">
              <Tooltip :title="$t('wishlist.edit')">
                <Button
                  :aria-label="`${$t('wishlist.edit')} ${record.name}`"
                  @click="edit(record)"
                >
                  <IconifyIcon icon="lucide:pencil" />
                </Button>
              </Tooltip>
              <Tooltip :title="$t('wishlist.detail')">
                <Button
                  :aria-label="`${$t('wishlist.detail')} ${record.name}`"
                  @click="
                    router.push({
                      path:
                        record.kind === 'etf'
                          ? '/finance/etf-comparison'
                          : '/finance/portfolio',
                      query: { code: record.code },
                    })
                  "
                >
                  <IconifyIcon icon="lucide:arrow-up-right" />
                </Button>
              </Tooltip>
            </div>
          </article>
        </div>
      </Spin>
      <div class="text-sm leading-6 text-muted-foreground">
        <p>{{ $t('wishlist.source') }}</p>
        <p>{{ $t('wishlist.precision') }} {{ $t('wishlist.local') }}</p>
      </div>
    </div>
    <Modal
      v-model:open="editing"
      :title="$t(adding ? 'wishlist.add' : 'wishlist.edit')"
      :ok-text="$t('wishlist.save')"
      :cancel-text="$t('wishlist.cancel')"
      @ok="save"
    >
      <Form layout="vertical">
        <FormItem :label="$t('wishlist.current')">
          <Select
            :value="form.code"
            :disabled="!adding"
            :options="
              (adding ? available : catalog).map((s) => ({
                value: s.code,
                label: `${s.name} · ${s.code}`,
              }))
            "
            @change="changeCode"
          />
        </FormItem>
        <FormItem :label="$t('wishlist.target')">
          <InputNumber
            v-model:value="form.price"
            class="!w-full"
            :min="0.001"
            :max="1000000"
            :precision="3"
            :aria-label="$t('wishlist.target')"
          />
        </FormItem>
        <FormItem :label="$t('wishlist.rule')">
          <Select
            v-model:value="form.rule"
            :options="[
              { value: 'around', label: $t('wishlist.around') },
              { value: 'atMost', label: $t('wishlist.atMost') },
              { value: 'below', label: $t('wishlist.belowRule') },
            ]"
          />
        </FormItem>
        <FormItem :label="$t('wishlist.nearLabel')">
          <InputNumber
            v-model:value="form.near"
            class="!w-full"
            :min="0"
            :max="100"
            :precision="2"
            :aria-label="$t('wishlist.nearLabel')"
          />
        </FormItem>
        <FormItem :label="$t('wishlist.note')">
          <Input.TextArea
            v-model:value="form.note"
            :maxlength="500"
            :rows="3"
            :aria-label="$t('wishlist.note')"
          />
        </FormItem>
      </Form>
      <p class="mb-3 text-sm text-muted-foreground">
        {{ $t('wishlist.ruleHint') }}
      </p>
      <Alert v-if="error" type="error" :message="$t('wishlist.invalid')" />
      <Popconfirm
        v-if="!adding"
        :title="$t('wishlist.confirm')"
        @confirm="
          () => {
            if (persist(targets.filter((t) => t.code !== form.code)))
              editing = false;
          }
        "
      >
        <Button danger>{{ $t('wishlist.remove') }}</Button>
      </Popconfirm>
    </Modal>
  </Page>
</template>
<style scoped>
.wishlist-filters {
  display: grid;
  grid-template-columns: minmax(160px, 320px) max-content 180px;
  gap: 12px;
  align-items: center;
}

@media (max-width: 640px) {
  .wishlist-filters {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
