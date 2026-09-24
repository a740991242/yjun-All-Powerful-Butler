<script setup lang="ts">
import type { DiffRow } from './model';

import { computed, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Select,
  Space,
  Table,
  Textarea,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { compare, jsonFormat, sqlFormat } from './model';
defineOptions({ name: 'EngineeringCompare' });
const props = withDefaults(
  defineProps<{ embedded?: boolean; initialMode?: string }>(),
  { initialMode: 'text' },
);
const left = ref('');
const right = ref('');
const mode = ref(props.initialMode);
const ignore = ref(false);
const result = ref<DiffRow[] | null>(null);
const error = ref('');
watch([left, right, mode, ignore], () => {
  result.value = null;
  error.value = '';
});
const columns = computed(() => [
  {
    title: $t('engineering.before'),
    dataIndex: 'left',
    key: 'left',
    width: '50%',
  },
  {
    title: $t('engineering.after'),
    dataIndex: 'right',
    key: 'right',
    width: '50%',
  },
]);
function run() {
  result.value = null;
  error.value = '';
  try {
    const prepare = (text: string) => {
      if (mode.value === 'json') return jsonFormat(text);
      if (mode.value === 'sql') return sqlFormat(text);
      return text;
    };
    result.value = compare(
      prepare(left.value),
      prepare(right.value),
      ignore.value,
    );
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error &&
      caughtError.message.startsWith('engineering.')
        ? caughtError.message
        : 'engineering.invalid';
  }
}
</script>
<template>
  <component
    :is="embedded ? 'section' : Page"
    :title="embedded ? undefined : $t('engineering.diff')"
    :description="embedded ? undefined : $t('engineering.local')"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card :title="$t('engineering.before')">
          <Textarea
            v-model:value="left"
            :auto-size="{ minRows: 10, maxRows: 20 }"
            :aria-label="$t('engineering.before')"
            class="font-mono"
          />
        </Card>
        <Card :title="$t('engineering.after')">
          <Textarea
            v-model:value="right"
            :auto-size="{ minRows: 10, maxRows: 20 }"
            :aria-label="$t('engineering.after')"
            class="font-mono"
          />
        </Card>
      </div>
      <Space wrap>
        <Select
          v-model:value="mode"
          :aria-label="$t('engineering.mode')"
          :options="
            ['text', 'json', 'sql'].map((value) => ({
              value,
              label: $t(`engineering.${value}Mode`),
            }))
          "
          style="min-width: 180px"
        /><Checkbox v-model:checked="ignore">
          {{ $t('engineering.ignoreSpace') }}
</Checkbox><Button type="primary" @click="run">
          {{ $t('engineering.compare') }}
        </Button>
      </Space>
      <Alert v-if="error" type="error" :message="$t(error)" />
      <Alert
        v-if="result"
        type="info"
        :message="
          $t(
            result.some((row) => row.kind === 'change')
              ? 'engineering.hasChanges'
              : 'engineering.identical',
          )
        "
      />
      <Table
        v-if="result"
        :columns="columns"
        :data-source="result.map((row, index) => ({ ...row, key: index }))"
        :pagination="{ pageSize: 50 }"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <div
            :class="record.kind === 'change' ? 'bg-primary/10' : ''"
            class="flex gap-2 p-2"
          >
            <span class="text-muted-foreground">{{
                column.key === 'left' ? record.leftNumber : record.rightNumber
              }}
              {{
                record.kind === 'change'
                  ? column.key === 'left'
                    ? '−'
                    : '+'
                  : ''
              }}</span>
            <pre class="m-0 min-w-0 whitespace-pre-wrap break-all">{{
              column.key === 'left' ? record.left : record.right
            }}</pre>
          </div>
        </template>
      </Table>
    </div>
  </component>
</template>
