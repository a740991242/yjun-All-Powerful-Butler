<script setup lang="ts">
import type { CalendarEvent } from './model';

import { computed, onActivated, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Badge,
  Button,
  Calendar,
  Card,
  DatePicker,
  Form,
  FormItem,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Textarea,
  Upload,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { $t } from '#/locales';

import { download } from '../../engineering/shared';
import { snapshot } from '../data';
import { validateCalendar } from './model';
defineOptions({ name: 'FinanceCalendar' });
const publicEvents = ref<CalendarEvent[]>([]);
const personal = ref<CalendarEvent[]>([]);
const publicDate = ref('');
const failed = ref(false);
const storageError = ref(false);
const loading = ref(false);
const query = ref('');
const kind = ref('all');
const scope = ref('month');
const selected = ref(dayjs());
const today = ref('');
function updateToday() {
  today.value = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
  }).format(new Date());
}
updateToday();
onActivated(updateToday);
const key = 'all-in-one-butler:finance:calendar:v1';
async function load() {
  loading.value = true;
  failed.value = false;
  try {
    const data = await snapshot<{ updatedAt: string; events: unknown }>(
      'calendar',
    );
    publicEvents.value = validateCalendar(data.events);
    publicDate.value = data.updatedAt;
  } catch {
    failed.value = true;
    publicEvents.value = [];
  }
  loading.value = false;
}
function loadPersonal() {
  try {
    const raw = localStorage.getItem(key);
    personal.value = raw === null ? [] : validateCalendar(JSON.parse(raw));
    storageError.value = false;
  } catch {
    storageError.value = true;
  }
}
onMounted(() => {
  void load();
  loadPersonal();
});
const allRows = computed(() =>
  [
    ...publicEvents.value.map((event) => ({
      ...event,
      local: false,
      key: `public-${event.id}`,
    })),
    ...personal.value.map((event) => ({
      ...event,
      local: true,
      key: `local-${event.id}`,
    })),
  ]
    .filter(
      (event) =>
        (kind.value === 'all' || event.kind === kind.value) &&
        `${event.title}${event.code}${event.note}`.includes(query.value.trim()),
    )
    .toSorted((a, b) => a.date.localeCompare(b.date)),
);
const rows = computed(() =>
  allRows.value.filter(
    (event) =>
      scope.value === 'all' ||
      (scope.value === 'upcoming'
        ? event.date >= today.value
        : event.date.startsWith(selected.value.format('YYYY-MM'))),
  ),
);
const columns = computed(() =>
  ['date', 'title', 'kind', 'status', 'source', 'updatedAt', 'actions'].map(
    (key) => ({ key, dataIndex: key, title: $t(`investmentCalendar.${key}`) }),
  ),
);
function persist(next: CalendarEvent[]) {
  try {
    if (storageError.value) throw new Error('read');
    const valid = validateCalendar(next);
    localStorage.setItem(key, JSON.stringify(valid));
    personal.value = valid;
    return true;
  } catch {
    message.error($t('investmentCalendar.saveError'));
    return false;
  }
}
const editing = ref(false);
const form = reactive<CalendarEvent>({
  id: '',
  code: '',
  title: '',
  date: today.value,
  kind: 'personal',
  status: 'expected',
  source: '',
  updatedAt: today.value,
  note: '',
});
function edit(event?: CalendarEvent) {
  Object.assign(
    form,
    event ?? {
      id: crypto.randomUUID(),
      code: '',
      title: '',
      date: selected.value.format('YYYY-MM-DD'),
      kind: 'personal',
      status: 'expected',
      source: '',
      updatedAt: today.value,
      note: '',
    },
  );
  editing.value = true;
}
function save() {
  if (
    persist([
      ...personal.value.filter((event) => event.id !== form.id),
      { ...form, updatedAt: today.value },
    ])
  )
    editing.value = false;
}
async function importFile(file: File) {
  try {
    if (file.size > 3_000_000) throw new Error('large');
    const incoming = validateCalendar(JSON.parse(await file.text()));
    const map = new Map(personal.value.map((event) => [event.id, event]));
    for (const event of incoming)
      if (!map.has(event.id)) map.set(event.id, event);
    if (persist([...map.values()]))
      message.success($t('investmentCalendar.imported'));
  } catch {
    message.error($t('investmentCalendar.invalid'));
  }
  return false;
}
</script>
<template>
  <Page
    :title="$t('investmentCalendar.titlePage')"
    :description="$t('investmentCalendar.description')"
  >
    <div class="flex flex-col gap-4">
      <Alert
        type="info"
        show-icon
        :message="$t('investmentCalendar.coverage')"
        :description="`${$t('investmentCalendar.updatedAt')}: ${publicDate || '—'}`"
      />
      <Alert
        v-if="failed"
        type="error"
        :message="$t('investmentCalendar.loadError')"
      /><Alert
        v-if="storageError"
        type="error"
        :message="$t('investmentCalendar.readError')"
      />
      <Card>
        <Space wrap>
          <Input
            v-model:value="query"
            :aria-label="$t('investmentCalendar.search')"
            :placeholder="$t('investmentCalendar.search')"
          /><Select
            v-model:value="kind"
            :aria-label="$t('investmentCalendar.kind')"
            :options="
              ['all', 'exdiv', 'report', 'personal'].map((value) => ({
                value,
                label: $t(`investmentCalendar.${value}`),
              }))
            "
            style="width: 150px"
          /><Select
            v-model:value="scope"
            :aria-label="$t('investmentCalendar.scope')"
            :options="
              ['month', 'upcoming', 'all'].map((value) => ({
                value,
                label: $t(`investmentCalendar.${value}`),
              }))
            "
            style="width: 160px"
          /><Button
            :loading="loading"
            @click="
              load();
              loadPersonal();
            "
          >
            {{ $t('investmentCalendar.refresh') }}
</Button><Button type="primary" :disabled="storageError" @click="edit()">
            {{ $t('investmentCalendar.add') }}
</Button><Button
            :disabled="storageError"
            @click="
              download(
                'investment-events.json',
                JSON.stringify(personal, null, 2),
              )
            "
          >
            {{ $t('investmentCalendar.export') }}
</Button><Upload
            :before-upload="importFile"
            :show-upload-list="false"
            accept=".json"
            :disabled="storageError"
          >
            <Button :disabled="storageError">
              {{ $t('investmentCalendar.import') }}
            </Button>
          </Upload>
        </Space>
      </Card>
      <Card>
        <Calendar v-model:value="selected" :fullscreen="false">
          <template #dateCellRender="{ current }">
            <Badge
              v-if="
                allRows.some(
                  (event) => event.date === current.format('YYYY-MM-DD'),
                )
              "
              :count="
                allRows.filter(
                  (event) => event.date === current.format('YYYY-MM-DD'),
                ).length
              "
              :title="$t('investmentCalendar.events')"
            />
          </template>
        </Calendar>
      </Card>
      <Card>
        <Table
          :columns="columns"
          :data-source="rows"
          :pagination="{ pageSize: 15 }"
          :scroll="{ x: 1000 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <p>{{ record.title }} {{ record.code }}</p>
              <p class="text-muted-foreground">{{ record.note }}</p>
              <p v-if="record.local" class="text-xs">
                {{ $t('investmentCalendar.local') }}
              </p>
</template><template
              v-else-if="column.key === 'kind' || column.key === 'status'"
            >
              {{ $t(`investmentCalendar.${record[column.key]}`) }}
</template><template v-else-if="column.key === 'source'">
              <a
                v-if="record.source"
                :href="record.source"
                target="_blank"
                rel="noopener noreferrer"
                >{{ $t('investmentCalendar.source') }}</a><span v-else>{{
                $t('investmentCalendar.personal')
              }}</span>
</template><Space v-else-if="column.key === 'actions' && record.local">
              <Button
                :disabled="storageError"
                @click="edit(personal.find((event) => event.id === record.id))"
              >
                {{ $t('investmentCalendar.edit') }}
</Button><Popconfirm
                :title="$t('investmentCalendar.deleteConfirm')"
                @confirm="
                  persist(personal.filter((event) => event.id !== record.id))
                "
              >
                <Button :disabled="storageError" danger>
                  {{ $t('investmentCalendar.delete') }}
                </Button>
              </Popconfirm>
            </Space>
          </template>
        </Table>
      </Card>
      <Modal
        v-model:open="editing"
        :title="$t('investmentCalendar.edit')"
        :ok-text="$t('investmentCalendar.save')"
        :cancel-text="$t('investmentCalendar.cancel')"
        @ok="save"
      >
        <Form layout="vertical">
          <FormItem :label="$t('investmentCalendar.title')">
            <Input v-model:value="form.title" :maxlength="200" />
</FormItem><FormItem :label="$t('investmentCalendar.code')">
            <Input v-model:value="form.code" :maxlength="6" />
</FormItem><FormItem :label="$t('investmentCalendar.date')">
            <DatePicker
              v-model:value="form.date"
              value-format="YYYY-MM-DD"
              :allow-clear="false"
            />
</FormItem><FormItem :label="$t('investmentCalendar.kind')">
            <Select
              v-model:value="form.kind"
              :options="
                ['personal', 'exdiv', 'report'].map((value) => ({
                  value,
                  label: $t(`investmentCalendar.${value}`),
                }))
              "
            />
</FormItem><FormItem :label="$t('investmentCalendar.status')">
            <Select
              v-model:value="form.status"
              :options="
                ['expected', 'confirmed'].map((value) => ({
                  value,
                  label: $t(`investmentCalendar.${value}`),
                }))
              "
            />
</FormItem><FormItem :label="$t('investmentCalendar.sourceHint')">
            <Input v-model:value="form.source" />
</FormItem><FormItem :label="$t('investmentCalendar.note')">
            <Textarea v-model:value="form.note" :rows="3" :maxlength="2000" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
