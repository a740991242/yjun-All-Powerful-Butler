<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Space, Textarea, Tree } from 'ant-design-vue';

import { $t } from '#/locales';

import Compare from './compare.vue';
import {
  csvToJson,
  inferType,
  jsonFormat,
  jsonToCsv,
  parseJson,
} from './model';
import Result from './result.vue';
import { useOutput } from './shared';
defineOptions({ name: 'EngineeringJson' });
const input = ref('{"name":"Butler","items":[1,2,3]}');
const { output, error, detail, clear, run } = useOutput();
const treeValue = ref<unknown>();
const treeVisible = ref(false);
watch(input, () => {
  clear();
  treeVisible.value = false;
});
type Node = { title: string; key: string; children?: Node[] };
const tree = computed(() => {
  let count = 0;
  function node(
    value: unknown,
    name: string,
    key: string,
    depth: number,
  ): Node {
    if (++count > 5000 || depth > 30) throw new Error('engineering.tooDeep');
    if (value !== null && typeof value === 'object')
      return {
        key,
        title: `${name} ${Array.isArray(value) ? '[]' : '{}'}`,
        children: Object.entries(value).map(([k, v], i) =>
          node(v, k, `${key}-${i}`, depth + 1),
        ),
      };
    return { key, title: `${name}: ${JSON.stringify(value)}` };
  }
  try {
    return treeVisible.value ? [node(treeValue.value, 'JSON', 'root', 0)] : [];
  } catch {
    return [];
  }
});
async function fold() {
  treeVisible.value = false;
  await run(() => {
    const value = parseJson(input.value);
    inferType(value);
    treeValue.value = value;
    treeVisible.value = true;
    return jsonFormat(input.value);
  });
}
</script>
<template>
  <Page :title="$t('engineering.json')" :description="$t('engineering.local')">
    <div class="flex flex-col gap-4">
      <Card :title="$t('engineering.input')">
        <Textarea
          v-model:value="input"
          :auto-size="{ minRows: 10, maxRows: 24 }"
          :aria-label="$t('engineering.input')"
          class="mb-4 font-mono"
        />
        <Space wrap>
          <Button type="primary" @click="run(() => jsonFormat(input))">
            {{ $t('engineering.formatValidate') }}
          </Button>
          <Button @click="fold">{{ $t('engineering.fold') }}</Button>
          <Button @click="run(() => jsonToCsv(input))">JSON → CSV</Button>
          <Button @click="run(() => csvToJson(input))">CSV → JSON</Button>
          <Button
            @click="
              run(() => `export type Root = ${inferType(parseJson(input))};`)
            "
          >
            TypeScript
          </Button>
        </Space>
        <p class="mt-3 text-muted-foreground">
          {{ $t('engineering.csvHint') }}
        </p>
      </Card>
      <Result :output="output" :error="error" :detail="detail" />
      <Card v-if="treeVisible" :title="$t('engineering.fold')">
        <Tree v-if="tree.length" :tree-data="tree" />
        <p v-else>{{ $t('engineering.tooDeep') }}</p>
      </Card>
      <Card :title="$t('engineering.jsonDiff')">
        <Compare embedded initial-mode="json" />
      </Card>
    </div>
  </Page>
</template>
