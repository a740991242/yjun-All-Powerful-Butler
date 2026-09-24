<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Input,
  InputNumber,
  Select,
  Space,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { cronTimes } from './model';
import Result from './result.vue';
import { useOutput } from './shared';
defineOptions({ name: 'EngineeringCron' });
const preset = ref('daily');
const minute = ref(0);
const hour = ref(9);
const weekday = ref(1);
const every = ref(5);
const expression = ref('0 9 * * *');
const zone = ref('Asia/Shanghai');
const from = ref(new Date().toISOString());
const generated = computed(() =>
  preset.value === 'interval'
    ? `*/${every.value} * * * *`
    : `${minute.value} ${hour.value} * * ${preset.value === 'weekly' ? weekday.value : '*'}`,
);
const { output, error, detail, clear, run } = useOutput();
watch([expression, zone, from], clear);
function calculate() {
  return run(() =>
    cronTimes(expression.value, from.value, zone.value)
      .map(
        (date, i) =>
          `${i + 1}. ${new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'shortOffset', timeZone: zone.value }).format(new Date(date))}  |  ${date}`,
      )
      .join('\n'),
  );
}
</script>
<template>
  <Page
    :title="$t('engineering.cron')"
    :description="$t('engineering.cronHint')"
  >
    <div class="flex flex-col gap-4">
      <Card :title="$t('engineering.visualBuilder')">
        <Space wrap>
          <Select
            v-model:value="preset"
            :aria-label="$t('engineering.mode')"
            :options="
              ['daily', 'weekly', 'interval'].map((value) => ({
                value,
                label: $t(`engineering.${value}`),
              }))
            "
            style="width: min(170px, 65vw)"
          /><template v-if="preset === 'interval'">
            <span>{{ $t('engineering.everyMinutes') }}</span><InputNumber
              v-model:value="every"
              :min="1"
              :max="59"
              :precision="0"
              :aria-label="$t('engineering.everyMinutes')"
            />
</template><template v-else>
            <span>{{ $t('engineering.hour') }}</span><InputNumber
              v-model:value="hour"
              :min="0"
              :max="23"
              :precision="0"
              :aria-label="$t('engineering.hour')"
            /><span>{{ $t('engineering.minute') }}</span><InputNumber
              v-model:value="minute"
              :min="0"
              :max="59"
              :precision="0"
              :aria-label="$t('engineering.minute')"
            /><Select
              v-if="preset === 'weekly'"
              v-model:value="weekday"
              :options="
                Array.from({ length: 7 }, (_, value) => ({
                  value,
                  label: $t(`engineering.day${value}`),
                }))
              "
              :aria-label="$t('engineering.weekday')"
              style="width: min(140px, 65vw)"
            />
</template><Button @click="expression = generated">
            {{ $t('engineering.apply') }}
</Button><code>{{ generated }}</code>
        </Space>
      </Card>
      <Card :title="$t('engineering.nextRuns')">
        <Space wrap>
          <Input
            v-model:value="expression"
            :aria-label="$t('engineering.expression')"
            style="width: min(250px, 65vw)"
          /><Input
            v-model:value="from"
            :aria-label="$t('engineering.startInstant')"
            style="width: min(280px, 65vw)"
          /><Select
            v-model:value="zone"
            :options="
              [
                'Asia/Shanghai',
                'UTC',
                'America/New_York',
                'Europe/London',
                'Asia/Tokyo',
              ].map((value) => ({ value, label: value }))
            "
            :aria-label="$t('engineering.timezone')"
            style="width: min(190px, 65vw)"
          /><Button type="primary" @click="calculate">
            {{ $t('engineering.calculate') }}
          </Button>
        </Space>
        <p class="mt-3">{{ $t('engineering.cronFieldsHint') }}</p>
      </Card>
      <Result :output="output" :error="error" :detail="detail" />
    </div>
  </Page>
</template>
