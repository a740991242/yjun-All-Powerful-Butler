<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Input, Select, Space, Textarea } from 'ant-design-vue';

import { $t } from '#/locales';

import { bounded, decode64, encode64, instant } from './model';
import Result from './result.vue';
import { useOutput } from './shared';
defineOptions({ name: 'EngineeringEncoding' });
const input = ref('');
const time = ref(new Date().toISOString());
const zone = ref('Asia/Shanghai');
const unit = ref<'iso' | 'milliseconds' | 'seconds'>('iso');
const textResult = useOutput();
const timeResult = useOutput();
watch(input, textResult.clear);
watch([time, unit, zone], timeResult.clear);
function uuid() {
  return crypto.randomUUID();
}
function convertTime() {
  return timeResult.run(() => instant(time.value, unit.value).toISOString());
}
const timeOutput = computed(() => {
  if (!timeResult.output.value) return '';
  const date = new Date(timeResult.output.value);
  return `ISO: ${date.toISOString()}\n${$t('engineering.seconds')}: ${Math.floor(date.getTime() / 1000)}\n${$t('engineering.milliseconds')}: ${date.getTime()}\n${zone.value}: ${new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'shortOffset', timeZone: zone.value }).format(date)}`;
});
async function hash(algorithm: string) {
  const bytes = await crypto.subtle.digest(
    algorithm,
    new TextEncoder().encode(bounded(input.value)),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
}
</script>
<template>
  <Page
    :title="$t('engineering.encoding')"
    :description="$t('engineering.local')"
  >
    <div class="flex flex-col gap-4">
      <Card :title="$t('engineering.timestamp')">
        <Space wrap class="mb-4">
          <Input
            v-model:value="time"
            :aria-label="$t('engineering.timestamp')"
            style="width: min(300px, 65vw)"
          /><Select
            v-model:value="unit"
            :options="
              ['iso', 'seconds', 'milliseconds'].map((value) => ({
                value,
                label: $t(`engineering.${value}`),
              }))
            "
            :aria-label="$t('engineering.unit')"
            style="width: min(140px, 65vw)"
          /><Select
            v-model:value="zone"
            :options="
              [
                'Asia/Shanghai',
                'UTC',
                'Asia/Tokyo',
                'Europe/London',
                'America/New_York',
              ].map((value) => ({ value, label: value }))
            "
            :aria-label="$t('engineering.timezone')"
            style="width: min(190px, 65vw)"
          /><Button type="primary" @click="convertTime">
            {{ $t('engineering.convert') }}
</Button><Button
            @click="
              time = new Date().toISOString();
              unit = 'iso';
            "
          >
            {{ $t('engineering.now') }}
          </Button>
        </Space>
        <p>{{ $t('engineering.isoHint') }}</p>
        <Result
          :output="timeOutput"
          :error="timeResult.error.value"
          :detail="timeResult.detail.value"
        />
      </Card>
      <Card :title="$t('engineering.encoding')">
        <Textarea
          v-model:value="input"
          :auto-size="{ minRows: 6, maxRows: 16 }"
          :aria-label="$t('engineering.input')"
          class="mb-4 font-mono"
        /><Space wrap>
          <Button
            @click="textResult.run(() => encodeURIComponent(bounded(input)))"
          >
            {{ $t('engineering.urlEncode') }}
</Button><Button
            @click="textResult.run(() => decodeURIComponent(bounded(input)))"
          >
            {{ $t('engineering.urlDecode') }}
</Button><Button @click="textResult.run(() => encode64(input))">
            {{ $t('engineering.base64Encode') }}
</Button><Button @click="textResult.run(() => decode64(input))">
            {{ $t('engineering.base64Decode') }}
</Button><Button @click="textResult.run(uuid)">UUID</Button><Button
            v-for="algorithm in ['SHA-256', 'SHA-384', 'SHA-512']"
            :key="algorithm"
            @click="textResult.run(() => hash(algorithm))"
          >
            {{ algorithm }}
          </Button>
        </Space>
      </Card>
      <Result
        :output="textResult.output.value"
        :error="textResult.error.value"
        :detail="textResult.detail.value"
      />
    </div>
  </Page>
</template>
