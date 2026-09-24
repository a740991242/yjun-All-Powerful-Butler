<script setup lang="ts">
import type { Entry } from './entries';

import {
  computed,
  onActivated,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  FormItem,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
  Textarea,
  Upload,
} from 'ant-design-vue';

import { $t } from '#/locales';

import {
  ENTRY_CHANGED,
  mergeEntries,
  readEntries,
  saveEntries,
  validateEntries,
} from './entries';
import { copy, download } from './shared';
defineOptions({ name: 'EngineeringKnowledge' });
const entries = ref<Entry[]>([]);
const failed = ref(false);
const query = ref('');
const kind = ref('all');
const editing = ref(false);
const form = reactive<Entry>({
  id: '',
  title: '',
  kind: 'snippet',
  tags: [],
  content: '',
  updatedAt: '',
});
const tags = ref('');
const kinds = ['command', 'snippet', 'troubleshooting', 'regex'];
function load() {
  try {
    entries.value = readEntries();
    failed.value = false;
  } catch {
    failed.value = true;
  }
}
onMounted(() => {
  load();
  window.addEventListener(ENTRY_CHANGED, load);
  window.addEventListener('storage', load);
});
onActivated(load);
onBeforeUnmount(() => {
  window.removeEventListener(ENTRY_CHANGED, load);
  window.removeEventListener('storage', load);
});
const rows = computed(() =>
  entries.value
    .filter(
      (item) =>
        (kind.value === 'all' || item.kind === kind.value) &&
        `${item.title} ${item.tags.join(' ')} ${item.content}`
          .toLowerCase()
          .includes(query.value.trim().toLowerCase()),
    )
    .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
);
function persist(next: Entry[]) {
  try {
    saveEntries(next);
    entries.value = next;
    return true;
  } catch {
    message.error($t('engineering.saveError'));
    return false;
  }
}
function edit(item?: Entry) {
  Object.assign(
    form,
    item ?? {
      id: crypto.randomUUID(),
      title: '',
      kind: 'snippet',
      tags: [],
      content: '',
      updatedAt: '',
    },
  );
  tags.value = form.tags.join(', ');
  editing.value = true;
}
function save() {
  if (!form.title.trim() || !form.content.trim()) {
    message.error($t('engineering.required'));
    return;
  }
  const item = {
    ...form,
    title: form.title.trim(),
    tags: [
      ...new Set(
        tags.value
          .split(/[,，]/)
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ],
    updatedAt: new Date().toISOString(),
  };
  if (persist([...entries.value.filter((e) => e.id !== item.id), item]))
    editing.value = false;
}
async function importFile(file: File) {
  try {
    if (failed.value || file.size > 5_000_000) throw new Error('invalid');
    const next = validateEntries(JSON.parse(await file.text()));
    if (persist(mergeEntries(readEntries(), next)))
      message.success($t('engineering.imported'));
  } catch {
    message.error($t('engineering.invalidImport'));
  }
  return false;
}
</script>
<template>
  <Page
    :title="$t('engineering.knowledge')"
    :description="$t('engineering.storageHint')"
  >
    <div class="flex flex-col gap-4">
      <Alert v-if="failed" type="error" :message="$t('engineering.readError')">
        <template #action>
          <Button @click="load">
            {{ $t('engineering.retry') }}
          </Button>
        </template>
      </Alert>
      <Card>
        <Space wrap>
          <Input
            v-model:value="query"
            :placeholder="$t('engineering.search')"
            :aria-label="$t('engineering.search')"
          /><Select
            v-model:value="kind"
            :options="
              ['all', ...kinds].map((value) => ({
                value,
                label: $t(`engineering.${value}`),
              }))
            "
            style="width: min(160px, 65vw)"
            :aria-label="$t('engineering.kind')"
          /><Button type="primary" :disabled="failed" @click="edit()">
            {{ $t('engineering.add') }}
</Button><Upload
            :before-upload="importFile"
            :show-upload-list="false"
            accept=".json"
            :disabled="failed"
          >
            <Button :disabled="failed">
              {{ $t('engineering.import') }}
            </Button>
</Upload><Button
            :disabled="failed"
            @click="
              download(
                'developer-knowledge.json',
                JSON.stringify(entries, null, 2),
              )
            "
          >
            {{ $t('engineering.export') }}
          </Button>
        </Space>
        <p class="mt-3 text-muted-foreground">
          {{ $t('engineering.mergeHint') }}
        </p>
      </Card>
      <Empty
        v-if="!rows.length && !failed"
        :description="$t('engineering.empty')"
      />
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card v-for="item in rows" :key="item.id" :title="item.title">
          <Space wrap>
            <Tag>{{ $t(`engineering.${item.kind}`) }}</Tag><Tag v-for="tag in item.tags" :key="tag">{{ tag }}</Tag>
          </Space>
          <pre
            class="my-4 max-h-72 overflow-auto whitespace-pre-wrap break-all"
            >{{ item.content }}</pre>
          <p class="text-xs text-muted-foreground">
            {{ $t('engineering.updated') }} {{ item.updatedAt }}
          </p>
          <Space wrap>
            <Button @click="copy(item.content)">
              {{ $t('engineering.copy') }}
</Button><Button :disabled="failed" @click="edit(item)">
              {{ $t('engineering.edit') }}
</Button><Popconfirm
              :title="$t('engineering.deleteConfirm')"
              @confirm="persist(entries.filter((e) => e.id !== item.id))"
            >
              <Button danger :disabled="failed">
                {{ $t('engineering.delete') }}
              </Button>
            </Popconfirm>
          </Space>
        </Card>
      </div>
      <Modal
        v-model:open="editing"
        :title="$t('engineering.edit')"
        :ok-text="$t('engineering.save')"
        :cancel-text="$t('engineering.cancel')"
        @ok="save"
      >
        <Form layout="vertical">
          <FormItem :label="$t('engineering.title')">
            <Input v-model:value="form.title" :maxlength="200" />
</FormItem><FormItem :label="$t('engineering.kind')">
            <Select
              v-model:value="form.kind"
              :options="
                kinds.map((value) => ({
                  value,
                  label: $t(`engineering.${value}`),
                }))
              "
            />
</FormItem><FormItem :label="$t('engineering.tags')">
            <Input v-model:value="tags" />
</FormItem><FormItem :label="$t('engineering.content')">
            <Textarea v-model:value="form.content" :rows="10" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
