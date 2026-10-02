<script setup lang="ts">
import type { SurveyTableState, SurveyTableVisual } from './types';

import { computed } from 'vue';

import { Button, InputNumber, Table } from 'ant-design-vue';

import { $t } from '#/locales';

import { fold } from './fold';
import {
  blankSurvey,
  matchingSurveyState,
  setSurveyCount,
} from './survey-table';
const props = defineProps<{
  visual: SurveyTableVisual;
  state?: SurveyTableState;
  interactive?: boolean;
}>();
const emit = defineEmits<{ change: [state: SurveyTableState] }>();
const editable = computed(() => props.interactive && blankSurvey(props.visual));
const current = computed(() =>
  editable.value && matchingSurveyState(props.state, props.visual)
    ? props.state
    : { counts: props.visual.rows.map((r) => r.count) },
);
const columns = computed(() =>
  [
    {
      title: $t('educationLearning.surveyCategory'),
      dataIndex: 'label',
      key: 'label',
      width: 120,
    },
    {
      title: $t('educationLearning.surveyMarks'),
      dataIndex: 'marks',
      key: 'marks',
      width: 200,
    },
    {
      title: $t('educationLearning.surveyCount'),
      dataIndex: 'count',
      key: 'count',
      width: 120,
    },
  ].filter((column) => !blankSurvey(props.visual) || column.key !== 'marks'),
);
const rows = computed(() =>
  props.visual.rows.map((r, index) => ({
    ...r,
    id: index,
    count: current.value.counts[index],
  })),
);
const total = computed(() =>
  current.value.counts.every((c) => c !== null)
    ? fold(current.value.counts, 0, (sum: number, c) => sum + (c ?? 0))
    : null,
);
function maxCount(index: number) {
  return Math.min(
    60,
    100 -
      fold(
        current.value.counts,
        0,
        (sum: number, c, i) => sum + (i === index ? 0 : (c ?? 0)),
      ),
  );
}
function input(index: number, value: null | number | string) {
  if (typeof value === 'number' || value === null)
    emit('change', setSurveyCount(props.visual, current.value, index, value));
}
function reset() {
  emit('change', { counts: props.visual.rows.map(() => null) });
}
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.surveyNotice') }}
    </p>
    <Table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :pagination="false"
      :scroll="{ x: blankSurvey(visual) ? 240 : 440 }"
      size="middle"
      bordered
      :aria-label="$t('educationLearning.surveyTableLabel')"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'marks'">
          <div
            v-if="record.marks"
            class="flex flex-wrap gap-1"
            :aria-label="$t('educationLearning.classificationMarks')"
          >
            <span
              v-for="n in record.marks.count"
              :key="n"
              class="flex h-7 w-7 items-center justify-center text-xl text-primary"
              :aria-label="
                $t('educationLearning.classificationMark', {
                  mark: record.marks.symbol === 'circle' ? '○' : '✓',
                })
              "
            >
              {{ record.marks.symbol === 'circle' ? '○' : '✓' }}
            </span>
          </div>
          <span v-else class="text-muted-foreground">
            {{ $t('educationLearning.surveyNoMarks') }}
          </span>
        </template>
        <template v-else-if="column.key === 'count'">
          <InputNumber
            v-if="editable"
            class="!min-h-11 !w-full"
            :aria-label="
              $t('educationLearning.surveyInput', { category: record.label })
            "
            :value="record.count"
            :min="0"
            :max="maxCount(record.id)"
            :precision="0"
            @update:value="(value) => input(record.id, value)"
          />
          <span v-else>
            {{
              record.count === null
                ? $t('educationLearning.surveyUnknown')
                : record.count
            }}
          </span>
        </template>
      </template>
    </Table>
    <template v-if="editable">
      <p class="font-medium" aria-live="polite">
        {{
          total === null
            ? $t('educationLearning.surveyIncomplete')
            : $t('educationLearning.surveyTotal', { total })
        }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ $t('educationLearning.surveyLocal') }}
      </p>
      <Button class="!min-h-11 self-start" @click="reset">
        {{ $t('educationLearning.resetVisual') }}
      </Button>
    </template>
  </div>
</template>
