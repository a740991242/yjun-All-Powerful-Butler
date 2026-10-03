<script setup lang="ts">
import type { CardEquationRule } from './card-equation';

import { Table, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

defineProps<{ visual: CardEquationRule }>();
const columns = ['A', 'B', 'C', 'D'].map((letter) => ({
  key: letter,
  dataIndex: letter,
  title: letter,
  width: 56,
}));
const rows = [{ key: 'blanks', A: 'A', B: 'B', C: 'C', D: 'D' }];
</script>

<template>
  <div class="space-y-4">
    <p class="text-xl leading-8">
      {{ $t('educationLearning.cardEquationNotice') }}
    </p>
    <div
      class="flex flex-wrap gap-3"
      :aria-label="$t('educationLearning.cardEquationCards')"
    >
      <Tag
        v-for="value in visual.values"
        :key="value"
        class="!m-0 !px-3 !py-2 !text-xl"
      >
        {{ value }}
      </Tag>
    </div>
    <p class="font-mono text-2xl leading-8">A + B − C = D</p>
    <Table
      :columns="columns"
      :data-source="rows"
      :pagination="false"
      :scroll="{ x: 224 }"
      bordered
      size="small"
    >
      <template #bodyCell="{ text }">
        <span class="block text-center font-mono text-2xl leading-8">
          {{ text }}
        </span>
      </template>
    </Table>
  </div>
</template>
