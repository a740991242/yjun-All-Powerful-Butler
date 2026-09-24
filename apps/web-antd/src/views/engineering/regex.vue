<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Input,
  message,
  Space,
  Textarea,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { readEntries, saveEntries } from './entries';
import Result from './result.vue';
defineOptions({ name: 'EngineeringRegex' });
const pattern = ref('(?<word>[A-Za-z]+)');
const flags = ref('g');
const text = ref('Hello Butler 2026');
const replacement = ref('[$&]');
const title = ref('');
const output = ref('');
const error = ref('');
const detail = ref('');
const busy = ref(false);
let worker: undefined | Worker;
let delay: ReturnType<typeof setTimeout> | undefined;
let timeout: ReturnType<typeof setTimeout> | undefined;
function stop() {
  worker?.terminate();
  worker = undefined;
  clearTimeout(timeout);
  clearTimeout(delay);
  busy.value = false;
}
function evaluate() {
  stop();
  output.value = '';
  error.value = '';
  detail.value = '';
  if (
    text.value.length > 100_000 ||
    pattern.value.length > 2000 ||
    (text.value.length + 1) * (replacement.value.length + 1) > 5_000_000 ||
    ((replacement.value.includes('$`') || replacement.value.includes("$'")) &&
      text.value.length > 1000)
  ) {
    error.value = 'engineering.tooLarge';
    return;
  }
  if (!pattern.value) {
    return;
  }
  busy.value = true;
  try {
    worker = new Worker(new URL('regex.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.addEventListener('message', (event) => {
      stop();
      if (event.data.error) {
        error.value = 'engineering.invalid';
        detail.value = event.data.error;
      } else {
        output.value = JSON.stringify(event.data, null, 2);
      }
    });
    worker.addEventListener('error', () => {
      stop();
      error.value = 'engineering.invalid';
    });
    timeout = setTimeout(() => {
      stop();
      error.value = 'engineering.regexTimeout';
    }, 1000);
    worker.postMessage({
      pattern: pattern.value,
      flags: flags.value,
      text: text.value,
      replacement: replacement.value,
    });
  } catch {
    stop();
    error.value = 'engineering.invalid';
  }
}
watch(
  [pattern, flags, text, replacement],
  () => {
    stop();
    output.value = '';
    error.value = '';
    delay = setTimeout(evaluate, 250);
  },
  { immediate: true },
);
onBeforeUnmount(stop);
function favorite() {
  try {
    if (!title.value.trim()) throw new Error('required');
    const compiled = new RegExp(pattern.value, flags.value);
    saveEntries([
      ...readEntries(),
      {
        id: crypto.randomUUID(),
        title: title.value.trim(),
        kind: 'regex',
        tags: ['regex'],
        content: JSON.stringify(
          {
            pattern: compiled.source,
            flags: compiled.flags,
            replacement: replacement.value,
          },
          null,
          2,
        ),
        updatedAt: new Date().toISOString(),
      },
    ]);
    message.success($t('engineering.saved'));
  } catch {
    message.error($t('engineering.saveError'));
  }
}
</script>
<template>
  <Page
    :title="$t('engineering.regex')"
    :description="$t('engineering.regexHint')"
  >
    <div class="flex flex-col gap-4">
      <Card>
        <Space wrap class="mb-4">
          <Input
            v-model:value="pattern"
            :aria-label="$t('engineering.pattern')"
            :placeholder="$t('engineering.pattern')"
            style="width: min(320px, 65vw)"
          /><Input
            v-model:value="flags"
            :aria-label="$t('engineering.flags')"
            style="width: min(100px, 65vw)"
          /><Button
            @click="
              pattern = '^.+$';
              flags = 'gm';
            "
          >
            {{ $t('engineering.nonemptyLines') }}
</Button><Button
            @click="
              pattern = '-?\\d+(?:\\.\\d+)?';
              flags = 'g';
            "
          >
            {{ $t('engineering.numbers') }}
          </Button>
</Space><Textarea
          v-model:value="text"
          :auto-size="{ minRows: 8, maxRows: 20 }"
          :aria-label="$t('engineering.sample')"
          class="mb-4 font-mono"
        /><Input
          v-model:value="replacement"
          :aria-label="$t('engineering.replacement')"
          :addon-before="$t('engineering.replacement')"
        /><Space wrap class="mt-4">
          <Input
            v-model:value="title"
            :placeholder="$t('engineering.favoriteName')"
            :aria-label="$t('engineering.favoriteName')"
          /><Button @click="favorite">
            {{ $t('engineering.favorite') }}
          </Button>
        </Space>
</Card><Alert
        v-if="busy"
        type="info"
        :message="$t('engineering.processing')"
      /><Result :output="output" :error="error" :detail="detail" />
    </div>
  </Page>
</template>
