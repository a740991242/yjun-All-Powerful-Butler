<script setup lang="ts">
import type { FamilyEvent, HolidayData } from './model';

import { computed, onActivated, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Empty,
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

import { $t } from '#/locales';

import { download } from '../../engineering/shared';
import holidays from './holidays.json';
import {
  dateDifference,
  occurrence,
  validateEvents,
  validateHolidays,
  workdays,
} from './model';
defineOptions({ name: 'LifeDates' });
const today = ref('');
function refreshDate() {
  today.value = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
  }).format(new Date());
}
refreshDate();
onActivated(refreshDate);
const start = ref(today.value);
const end = ref(today.value);
const includeStart = ref(false);
const includeEnd = ref(true);
const mode = ref<'holidays' | 'weekdays'>('holidays');
const calendar = ref<HolidayData>(validateHolidays(holidays));
const yearDraft = ref(calendar.value.years.join(', '));
const sourceDraft = ref(calendar.value.source);
const daysDraft = ref({ ...calendar.value.days });
const overrideDate = ref(today.value);
const overrideKind = ref<'off' | 'work'>('off');
function syncCalendarDraft() {
  yearDraft.value = calendar.value.years.join(', ');
  sourceDraft.value = calendar.value.source;
  daysDraft.value = { ...calendar.value.days };
}
const overrides = computed(() =>
  Object.entries(daysDraft.value)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([date, kind]) => ({ key: date, date, kind })),
);
const overrideColumns = computed(() =>
  ['date', 'dayType', 'actions'].map((key) => ({
    key,
    title: $t(`dates.${key}`),
  })),
);
function addOverride() {
  try {
    validateHolidays({
      ...calendar.value,
      years: [Number(overrideDate.value.slice(0, 4))],
      days: { [overrideDate.value]: overrideKind.value },
    });
    daysDraft.value = {
      ...daysDraft.value,
      [overrideDate.value]: overrideKind.value,
    };
  } catch {
    message.error($t('dates.invalidDate'));
  }
}
function removeOverride(date: string) {
  daysDraft.value = Object.fromEntries(
    Object.entries(daysDraft.value).filter(([key]) => key !== date),
  );
}
const events = ref<FamilyEvent[]>([]);
const failed = ref(false);
const key = 'all-in-one-butler:life:dates:v1';
function load() {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const data = JSON.parse(raw);
      events.value = validateEvents(data.events);
      calendar.value = validateHolidays(data.calendar);
    }
    syncCalendarDraft();
    failed.value = false;
  } catch {
    failed.value = true;
  }
}
onMounted(load);
function persist(nextEvents = events.value, nextCalendar = calendar.value) {
  try {
    if (failed.value) throw new Error('read');
    const calendarChanged = nextCalendar !== calendar.value;
    const validCalendar = validateHolidays(nextCalendar);
    const validEvents = validateEvents(nextEvents);
    localStorage.setItem(
      key,
      JSON.stringify({ events: validEvents, calendar: validCalendar }),
    );
    events.value = validEvents;
    calendar.value = validCalendar;
    if (calendarChanged) syncCalendarDraft();
    return true;
  } catch {
    message.error($t('dates.saveError'));
    return false;
  }
}
const results = computed(() => {
  try {
    return {
      difference: dateDifference(start.value, end.value),
      work: workdays(
        start.value,
        end.value,
        includeStart.value,
        includeEnd.value,
        mode.value,
        calendar.value,
      ),
      error: '',
    };
  } catch (error) {
    let difference: null | number = null;
    try {
      difference = dateDifference(start.value, end.value);
    } catch {}
    return {
      difference,
      work: null,
      error: error instanceof Error ? error.message : 'dates.invalidDate',
    };
  }
});
const rows = computed(() =>
  events.value
    .map((event) => ({ ...event, ...{ next: occurrence(event, today.value) } }))
    .toSorted((a, b) => a.next.days - b.next.days),
);
const editing = ref(false);
const form = reactive<FamilyEvent>({
  id: '',
  title: '',
  date: today.value,
  kind: 'birthday',
  annual: true,
  leap: 'feb28',
  note: '',
});
function edit(event?: FamilyEvent) {
  Object.assign(
    form,
    event ?? {
      id: crypto.randomUUID(),
      title: '',
      date: today.value,
      kind: 'birthday',
      annual: true,
      leap: 'feb28',
      note: '',
    },
  );
  editing.value = true;
}
function save() {
  if (
    persist([
      ...events.value.filter((event) => event.id !== form.id),
      { ...form },
    ])
  )
    editing.value = false;
}
function saveCalendar() {
  try {
    const next = validateHolidays({
      years: yearDraft.value
        .split(/[,，]/)
        .map((value) => Number(value.trim())),
      source: sourceDraft.value,
      days: daysDraft.value,
      updatedAt: today.value,
    });
    if (persist(events.value, next)) message.success($t('dates.saved'));
  } catch {
    message.error($t('dates.invalidImport'));
  }
}
async function importFile(file: File) {
  try {
    if (file.size > 2_000_000) throw new Error('large');
    const data = JSON.parse(await file.text());
    const next = validateEvents(data.events);
    const merged = new Map(events.value.map((event) => [event.id, event]));
    for (const item of next)
      if (!merged.has(item.id)) merged.set(item.id, item);
    if (persist([...merged.values()], validateHolidays(data.calendar)))
      message.success($t('dates.imported'));
  } catch {
    message.error($t('dates.invalidImport'));
  }
  return false;
}
</script>
<template>
  <Page :title="$t('dates.title')" :description="$t('dates.description')">
    <div class="flex flex-col gap-4">
      <Alert v-if="failed" type="error" :message="$t('dates.readError')">
        <template #action>
          <Button @click="load">{{ $t('dates.retry') }}</Button>
        </template>
      </Alert>
      <Card :title="$t('dates.calculator')">
        <Space wrap>
          <span>{{ $t('dates.start') }}</span><DatePicker
            v-model:value="start"
            value-format="YYYY-MM-DD"
            :allow-clear="false"
            :aria-label="$t('dates.start')"
          /><span>{{ $t('dates.end') }}</span><DatePicker
            v-model:value="end"
            value-format="YYYY-MM-DD"
            :allow-clear="false"
            :aria-label="$t('dates.end')"
          /><Select
            v-model:value="mode"
            :options="
              ['holidays', 'weekdays'].map((value) => ({
                value,
                label: $t(`dates.${value}`),
              }))
            "
            :aria-label="$t('dates.mode')"
            style="min-width: 220px"
          /><Checkbox v-model:checked="includeStart">
            {{ $t('dates.includeStart') }}
</Checkbox><Checkbox v-model:checked="includeEnd">
            {{ $t('dates.includeEnd') }}
          </Checkbox>
        </Space>
        <p class="mt-4">
          {{ $t('dates.difference') }} {{ results.difference ?? '—' }}
          {{ $t('dates.days') }}
        </p>
        <p>
          {{ $t('dates.workdays') }} {{ results.work ?? '—' }}
          {{ $t('dates.days') }}
        </p>
        <Alert
          v-if="results.error"
          type="warning"
          :message="$t(results.error)"
        />
        <p class="mt-3 text-muted-foreground">
          {{ $t('dates.countHint') }}
        </p>
      </Card>
      <Card :title="$t('dates.family')">
        <template #extra>
          <Button type="primary" :disabled="failed" @click="edit()">
            {{ $t('dates.add') }}
          </Button>
        </template>
        <p class="mb-4 text-muted-foreground">{{ $t('dates.local') }}</p>
        <Space wrap class="mb-4">
          <Button
            :disabled="failed"
            @click="
              download(
                'family-dates.json',
                JSON.stringify({ events, calendar }, null, 2),
              )
            "
          >
            {{ $t('dates.export') }}
</Button><Upload
            accept=".json"
            :before-upload="importFile"
            :show-upload-list="false"
            :disabled="failed"
          >
            <Button :disabled="failed">
              {{ $t('dates.import') }}
            </Button>
          </Upload>
</Space><Empty v-if="!rows.length" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card
            v-for="event in rows"
            :key="event.id"
            :title="event.title"
            size="small"
          >
            <p>
              {{ $t(`dates.${event.kind}`) }} · {{ event.date }} ·
              {{ $t(event.annual ? 'dates.annual' : 'dates.once') }}
            </p>
            <p class="my-3 text-lg font-medium">
              {{
                event.next.days < 0
                  ? $t('dates.past', { days: -event.next.days })
                  : event.next.days === 0
                    ? $t('dates.today')
                    : $t('dates.remaining', { days: event.next.days })
              }}
            </p>
            <p>{{ $t('dates.next') }} {{ event.next.date }}</p>
            <p class="my-3 whitespace-pre-wrap break-words">{{ event.note }}</p>
            <Space>
              <Button :disabled="failed" @click="edit(event)">
                {{ $t('dates.edit') }}
</Button><Popconfirm
                :title="$t('dates.deleteConfirm')"
                @confirm="
                  persist(events.filter((item) => item.id !== event.id))
                "
              >
                <Button :disabled="failed" danger>
                  {{ $t('dates.delete') }}
                </Button>
              </Popconfirm>
            </Space>
          </Card>
        </div>
      </Card>
      <Card :title="$t('dates.maintenance')">
        <p>
          {{ $t('dates.coverage') }} {{ calendar.years.join(', ') }} ·
          {{ calendar.updatedAt }} ·
          <a
            :href="calendar.source"
            target="_blank"
            rel="noopener noreferrer"
            >{{ $t('dates.source') }}</a>
        </p>
        <p class="my-3 text-muted-foreground">
          {{ $t('dates.maintenanceHint') }}
        </p>
        <Form layout="vertical">
          <FormItem :label="$t('dates.coverage')">
            <Input
              v-model:value="yearDraft"
              :aria-label="$t('dates.coverage')"
            />
</FormItem><FormItem :label="$t('dates.source')">
            <Input
              v-model:value="sourceDraft"
              :aria-label="$t('dates.source')"
            />
          </FormItem>
        </Form>
        <Space wrap class="mb-4">
          <DatePicker
            v-model:value="overrideDate"
            value-format="YYYY-MM-DD"
            :allow-clear="false"
            :placeholder="$t('dates.date')"
          /><Select
            v-model:value="overrideKind"
            :options="
              ['off', 'work'].map((value) => ({
                value,
                label: $t(`dates.${value}`),
              }))
            "
            :aria-label="$t('dates.dayType')"
            style="width: 150px"
          /><Button @click="addOverride">
            {{ $t('dates.addOverride') }}
          </Button>
        </Space>
        <Table
          :columns="overrideColumns"
          :data-source="overrides"
          :pagination="{ pageSize: 8 }"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'date'">{{ record.date }}</template><template v-else-if="column.key === 'dayType'">
              {{ $t(`dates.${record.kind}`) }}
</template><Button v-else @click="removeOverride(record.date)">
              {{ $t('dates.removeOverride') }}
            </Button>
          </template>
        </Table>
        <Button class="mt-3" :disabled="failed" @click="saveCalendar">
          {{ $t('dates.saveCalendar') }}
        </Button>
      </Card>
      <Modal
        v-model:open="editing"
        :title="$t('dates.edit')"
        :ok-text="$t('dates.save')"
        :cancel-text="$t('dates.cancel')"
        @ok="save"
      >
        <Form layout="vertical">
          <FormItem :label="$t('dates.name')">
            <Input v-model:value="form.title" :maxlength="200" />
</FormItem><FormItem :label="$t('dates.kind')">
            <Select
              v-model:value="form.kind"
              :options="
                ['birthday', 'anniversary', 'other'].map((value) => ({
                  value,
                  label: $t(`dates.${value}`),
                }))
              "
            />
</FormItem><FormItem :label="$t('dates.date')">
            <DatePicker
              v-model:value="form.date"
              value-format="YYYY-MM-DD"
              :allow-clear="false"
            />
</FormItem><FormItem>
            <Checkbox v-model:checked="form.annual">
              {{ $t('dates.annual') }}
            </Checkbox>
</FormItem><FormItem v-if="form.annual" :label="$t('dates.leap')">
            <Select
              v-model:value="form.leap"
              :options="
                ['feb28', 'mar1'].map((value) => ({
                  value,
                  label: $t(`dates.${value}`),
                }))
              "
            />
</FormItem><FormItem :label="$t('dates.note')">
            <Textarea v-model:value="form.note" :maxlength="1000" :rows="3" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
