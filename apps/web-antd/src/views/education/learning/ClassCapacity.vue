<script setup lang="ts">
import type { ClassCapacityVisual } from './class-capacity';

import { computed } from 'vue';

import { Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { classCapacityFacts } from './class-capacity';
const props = defineProps<{ visual: ClassCapacityVisual }>();
const facts = computed(() => classCapacityFacts(props.visual.variant));
const columns = computed(() => [
  {
    title: $t('educationLearning.capacityClass'),
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: $t('educationLearning.capacityFirst'),
    dataIndex: 'first',
    key: 'first',
    width: 140,
  },
  {
    title: $t('educationLearning.capacitySecond'),
    dataIndex: 'second',
    key: 'second',
    width: 140,
  },
]);
</script>
<template>
  <div
    class="space-y-3"
    role="region"
    :aria-label="$t('educationLearning.capacityTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.capacityTitle') }}</p>
    <p class="text-sm leading-6">
      {{ $t('educationLearning.capacityConditions') }}
    </p>
    <Table
      :columns="columns"
      :data-source="facts.classes"
      :pagination="false"
      row-key="id"
      size="small"
      bordered
      :scroll="{ x: 400 }"
    >
      <template #bodyCell="{ column, record, text }">
        <span v-if="column.key === 'id'">
          {{ $t('educationLearning.capacityClassName', { name: record.id }) }}
        </span>
        <span v-else>
          {{ $t('educationLearning.capacityPeople', { count: text }) }}
        </span>
      </template>
    </Table>
    <div class="flex flex-wrap gap-3">
      <p
        v-for="room in facts.rooms"
        :key="room.id"
        class="rounded-lg border border-border px-3 py-2"
      >
        {{
          $t('educationLearning.capacityRoom', {
            name: room.id,
            count: room.capacity,
          })
        }}
      </p>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.capacityNotice') }}
    </p>
  </div>
</template>
