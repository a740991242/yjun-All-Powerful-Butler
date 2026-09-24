<script setup lang="ts">
import { Alert, Button, Card, Textarea } from 'ant-design-vue';

import { $t } from '#/locales';

import { copy } from './shared';
defineProps<{ output: string; error: string; detail?: string }>();
</script>
<template>
  <Alert
    v-if="error"
    type="error"
    show-icon
    :message="$t(error)"
    :description="detail"
  />
  <Card v-if="output" :title="$t('engineering.output')">
    <template #extra>
      <Button @click="copy(output)">
        {{ $t('engineering.copy') }}
      </Button>
    </template>
    <Textarea
      :value="output"
      readonly
      :auto-size="{ minRows: 8, maxRows: 24 }"
      :aria-label="$t('engineering.output')"
      class="font-mono"
    />
  </Card>
</template>
