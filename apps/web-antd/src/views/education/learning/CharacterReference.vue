<script setup lang="ts">
import type { CharacterReferenceKind, Volume } from './types';

import { computed, ref, watch } from 'vue';

import {
  Alert,
  Form,
  FormItem,
  Input,
  Select,
  Table,
  TabPane,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { $t } from '#/locales';

import {
  characterRows,
  filterCharacters,
  referencePages,
} from '../content/character-reference';
import {
  characterSources,
  lowerRadicals,
  strokeNames,
  upperRadicals,
} from '../content/characters';

const props = defineProps<{ volume: Volume; kind: CharacterReferenceKind }>();
const emit = defineEmits<{ 'update:kind': [kind: CharacterReferenceKind] }>();
const query = ref('');
const course = ref('all');
const page = ref(1);
const pageSize = ref(10);
const kinds = computed<CharacterReferenceKind[]>(() =>
  props.volume === 'upper'
    ? ['recognize', 'write', 'strokes', 'radicals']
    : ['recognize', 'write', 'radicals'],
);
function selectKind(value: unknown) {
  const kind = kinds.value.find((item) => item === value);
  if (kind) emit('update:kind', kind);
}
const rows = computed(() => characterRows(props.volume));
const filtered = computed(() =>
  filterCharacters(rows.value, props.kind, query.value, course.value),
);
const source = computed(() => characterSources[props.volume]);
const sourceDate = computed(() =>
  props.volume === 'lower' &&
  (props.kind === 'recognize' || props.kind === 'write')
    ? characterSources.lower.tableSource.checkedAt
    : source.value.reviewedAt,
);
const sourceLink = computed(
  () => `https://book.pep.com.cn/${source.value.resourceId}/mobile/index.html`,
);
const names = computed(() =>
  (() => {
    if (props.kind === 'strokes') return strokeNames;
    return props.volume === 'upper' ? upperRadicals : lowerRadicals;
  })().filter((name) => name.includes(query.value.trim())),
);
const columns = computed(() => [
  { key: 'course', title: $t('educationLearning.referenceCourse'), width: 190 },
  { key: 'characters', title: $t(`educationLearning.reference_${props.kind}`) },
  ...(props.kind === 'recognize'
    ? [
        {
          key: 'additional',
          title: $t('educationLearning.contextualCharacters'),
          width: 130,
        },
      ]
    : []),
]);
const pagination = computed(() => ({
  current: page.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
  showTotal: (total: number) => $t('educationLearning.historyTotal', { total }),
  onChange: (current: number, size: number) => {
    page.value = current;
    pageSize.value = size;
  },
}));
watch([query, course, () => props.kind, () => props.volume], () => {
  page.value = 1;
});
watch(
  () => props.volume,
  () => {
    query.value = '';
    course.value = 'all';
  },
);
</script>

<template>
  <div class="character-reference flex flex-col gap-4">
    <Alert
      type="info"
      show-icon
      :message="$t('educationLearning.referenceNotice')"
    />
    <Alert
      v-if="
        volume === 'lower' && characterSources.lower.pendingWritePages.length
      "
      type="warning"
      show-icon
      :message="$t('educationLearning.lowerWritingPending')"
    />
    <Tabs :active-key="kind" @update:active-key="selectKind">
      <TabPane
        v-for="value in kinds"
        :key="value"
        :tab="$t(`educationLearning.reference_${value}`)"
      />
    </Tabs>
    <Form layout="vertical" class="grid gap-3 sm:grid-cols-2">
      <FormItem
        :label="$t('educationLearning.referenceSearch')"
        html-for="character-search"
        class="!mb-0"
      >
        <Input
          id="character-search"
          v-model:value="query"
          allow-clear
          :maxlength="80"
          class="!min-h-11"
        />
      </FormItem>
      <FormItem
        v-if="kind === 'recognize' || kind === 'write'"
        :label="$t('educationLearning.referenceCourse')"
        html-for="character-course"
        class="!mb-0"
      >
        <Select
          id="character-course"
          v-model:value="course"
          :options="[
            { value: 'all', label: $t('educationLearning.allCourses') },
            ...rows.map((row) => ({
              value: row.id,
              label: `${row.unit} · ${row.title}`,
            })),
          ]"
        />
      </FormItem>
    </Form>
    <Table
      v-if="kind === 'recognize' || kind === 'write'"
      :columns="columns"
      :data-source="filtered"
      row-key="id"
      :pagination="pagination"
      :scroll="{ x: 620 }"
    >
      <template #bodyCell="{ column, record }">
        <div v-if="column.key === 'course'" class="flex flex-col gap-2">
          <span>{{ record.title }}</span>
          <span class="text-xs text-muted-foreground">{{ record.unit }}</span>
          <span class="text-xs">
            {{ $t('educationLearning.page', { number: record.page }) }}
          </span>
        </div>
        <div
          v-else-if="column.key === 'characters'"
          class="flex flex-col gap-2"
        >
          <div class="flex flex-wrap gap-2 text-2xl leading-relaxed">
            <span
              v-for="(character, index) in kind === 'write'
                ? record.write
                : record.recognize"
              :key="index"
              :class="
                query.trim() === character ? 'font-bold text-primary' : ''
              "
            >
              {{ character }}
            </span>
          </div>
          <Tag v-if="kind === 'write' && !record.writeVerified">
            {{ $t('educationLearning.writingUnverified') }}
          </Tag>
          <span
            v-else-if="kind === 'write' && !record.write"
            class="text-muted-foreground"
          >
            {{ $t('educationLearning.noNewWriting') }}
          </span>
        </div>
        <div
          v-else-if="column.key === 'additional'"
          class="flex flex-wrap gap-2 text-xl"
        >
          <span>{{ record.additionalReadings || '—' }}</span>
        </div>
      </template>
    </Table>
    <template v-else>
      <p class="text-sm text-muted-foreground">
        {{ $t('educationLearning.referenceNamesNotice') }}
      </p>
      <div class="grid gap-3 sm:grid-cols-3">
        <div
          v-for="name in names"
          :key="name"
          class="rounded border border-border p-3 text-xl"
        >
          {{ name }}
        </div>
      </div>
      <p v-if="!names.length">{{ $t('educationLearning.referenceEmpty') }}</p>
    </template>
    <p v-if="kind === 'recognize'" class="text-sm text-muted-foreground">
      {{ $t('educationLearning.contextualNotice') }}
    </p>
    <a :href="sourceLink" target="_blank" rel="noopener noreferrer">
      {{ $t('educationLearning.openTextbook') }}
    </a>
    <p class="text-sm text-muted-foreground">
      {{
        $t('educationLearning.referenceSourcePages', {
          pages: referencePages(volume, kind).join(', '),
        })
      }}
    </p>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.referenceVerifiedAt', { date: sourceDate }) }}
    </p>
    <template
      v-if="volume === 'lower' && (kind === 'recognize' || kind === 'write')"
    >
      <p class="text-sm text-muted-foreground">
        {{
          $t('educationLearning.characterTableSource', {
            pages: characterSources.lower.tableSource.pages.join(', '),
            date: characterSources.lower.tableSource.checkedAt,
          })
        }}
      </p>
      <a
        :href="characterSources.lower.tableSource.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex min-h-11 items-center"
      >
        {{ $t('educationLearning.openCharacterTableSource') }}
      </a>
    </template>
    <template v-if="volume === 'lower' && kind === 'write'">
      <p class="text-sm text-muted-foreground">
        {{
          $t('educationLearning.writingBodySource', {
            pages: Object.values(
              characterSources.lower.verifiedWritingLessonPages,
            ).join(', '),
            date: characterSources.lower.writingLessonSource.checkedAt,
          })
        }}
      </p>
      <a
        :href="characterSources.lower.writingLessonSource.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex min-h-11 items-center"
      >
        {{ $t('educationLearning.openWritingBodySource') }}
      </a>
    </template>
  </div>
</template>

<style scoped>
.character-reference :deep(.ant-select-selector) {
  align-items: center;
  min-height: 44px;
}

.character-reference :deep(.ant-pagination-item),
.character-reference :deep(.ant-pagination-prev),
.character-reference :deep(.ant-pagination-next) {
  min-width: 44px;
  min-height: 44px;
  line-height: 42px;
}
</style>
