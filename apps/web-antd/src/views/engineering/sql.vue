<script setup lang="ts">
import type { Dialect } from './model';

import { ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Checkbox,
  Input,
  Select,
  Space,
  Textarea,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { dialects, inList, inserts, listValues, sqlFormat } from './model';
import Result from './result.vue';
import { useOutput } from './shared';
defineOptions({ name: 'EngineeringSql' });
const input = ref('select id, name from users where active = 1;');
const table = ref('users');
const dialect = ref<Dialect>('transactsql');
const numeric = ref(false);
const { output, error, detail, clear, run } = useOutput();
watch([input, table, dialect, numeric], clear);
const templates = {
  select: 'SELECT id, name FROM users WHERE active = 1 ORDER BY id;',
  join: 'SELECT u.id, u.name, COUNT(o.id) AS order_count FROM users AS u LEFT JOIN orders AS o ON o.user_id = u.id GROUP BY u.id, u.name;',
  cte: 'WITH totals AS (SELECT user_id, SUM(amount) AS total FROM orders GROUP BY user_id) SELECT user_id, total FROM totals WHERE total > 100;',
};
</script>
<template>
  <Page :title="$t('engineering.sql')" :description="$t('engineering.sqlHint')">
    <div class="flex flex-col gap-4">
      <Card>
        <Space wrap class="mb-4">
          <Select
            v-model:value="dialect"
            :options="dialects.map((value) => ({ value, label: value }))"
            :aria-label="$t('engineering.dialect')"
            style="width: min(170px, 65vw)"
          /><Button
            v-for="(text, key) in templates"
            :key="key"
            @click="input = text"
          >
            {{ $t(`engineering.template_${key}`) }}
          </Button>
        </Space>
        <Textarea
          v-model:value="input"
          :auto-size="{ minRows: 12, maxRows: 24 }"
          :aria-label="$t('engineering.input')"
          class="mb-4 font-mono"
        />
        <Space wrap>
          <Button type="primary" @click="run(() => sqlFormat(input, dialect))">
            {{ $t('engineering.format') }}
</Button><Checkbox v-model:checked="numeric">
            {{ $t('engineering.numeric') }}
</Checkbox><Button @click="run(() => inList(input, numeric))">
            {{ $t('engineering.inList') }}
</Button><Button @click="run(() => listValues(input).join(',\n'))">
            {{ $t('engineering.fields') }}
</Button><Input
            v-model:value="table"
            :aria-label="$t('engineering.table')"
            :placeholder="$t('engineering.table')"
            style="width: min(180px, 65vw)"
          /><Button @click="run(() => inserts(input, table, dialect))">
            {{ $t('engineering.insert') }}
          </Button>
        </Space>
        <p class="mt-3 text-muted-foreground">
          {{ $t('engineering.sqlInputHint') }}
        </p>
      </Card>
      <Result :output="output" :error="error" :detail="detail" />
    </div>
  </Page>
</template>
