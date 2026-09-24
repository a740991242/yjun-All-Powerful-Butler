<script setup lang="ts">
import type { Quote, Target } from './model';

import { computed } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Tooltip } from 'ant-design-vue';

import { $t } from '#/locales';

import { evaluate } from './model';
import { heartTier } from './storage';

const props = defineProps<{ target: Target; quote: Quote; today: string }>();
const state = computed(() => evaluate(props.target, props.quote, props.today));
const tier = computed(() => heartTier(state.value.gap));
// Fixed semantic colors encode distance, independently of the selected app theme.
const colors = [
  '#f5222d',
  '#ed5465',
  '#d47887',
  '#b78c9d',
  '#9a8ca5',
  '#888ba3',
  '#7e8b9a',
];
const label = computed(() => {
  const gap = state.value.gap;
  return gap === null
    ? $t(`finance.heart${state.value.status === 'stale' ? 'Stale' : 'Missing'}`)
    : $t('finance.heartGap', { percent: gap.toFixed(2) });
});
</script>

<template>
  <Tooltip :title="label" :trigger="['hover', 'focus', 'click']">
    <span
      tabindex="0"
      role="img"
      :aria-label="label"
      class="inline-flex shrink-0 cursor-help rounded text-lg text-muted-foreground outline-offset-2"
      :style="tier === null ? undefined : { color: colors[tier] }"
    >
      <IconifyIcon
        :icon="
          tier === null
            ? 'ant-design:heart-outlined'
            : 'ant-design:heart-filled'
        "
      />
    </span>
  </Tooltip>
</template>
