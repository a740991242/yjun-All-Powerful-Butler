<script setup lang="ts">
import type { HistoryMode, HistoryStatus } from './history';
import type { Book, CharacterReferenceKind, Lesson, Session } from './types';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  FormItem,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Spin,
  Tag,
  Upload,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { MAX_BACKUP_BYTES } from './backup';
import CharacterReference from './CharacterReference.vue';
import { statistics } from './engine';
import { filterHistory } from './history';
import { studyLibrary } from './library';
import { required } from './required';
import { newReviewQuestions, originalReviewLesson } from './review';
import SessionPlayer from './SessionPlayer.vue';
import { specialtyQuestions } from './specialties';

const props = defineProps<{ book: Book }>();
const textbookLinkKey = computed(() => {
  if (props.book.edition === 'bnu-2024')
    return 'educationLearning.bnuSourceLink';
  if (props.book.subject === 'ethics') return 'educationEthics.sourceLink';
  if (props.book.edition === 'sujiao')
    return 'educationLearning.sujiaoSourcePreview';
  return 'educationLearning.openTextbook';
});
const textbookNoticeKey = computed(() => {
  if (props.book.edition === 'bnu-2024')
    return props.book.volume === 'lower'
      ? 'educationLearning.bnuLowerSourceNotice'
      : 'educationLearning.bnuSourceNotice';
  if (props.book.subject === 'ethics') return 'educationEthics.sourceNotice';
  if (props.book.edition !== 'sujiao') return 'educationLearning.editionNotice';
  return props.book.volume === 'lower'
    ? 'educationLearning.sujiaoLowerEditionNotice'
    : 'educationLearning.sujiaoEditionNotice';
});
const route = useRoute();
const router = useRouter();
const busy = ref(false);
const nickname = ref('');
const referenceOpen = ref(false);
const referenceKind = ref<CharacterReferenceKind>('recognize');
const profileModal = ref(false);
const rename = ref(false);
const importSource = ref('');
const specialtyCount = ref(6);
const backupFiles = ref<string[]>([]);
const importPreview = ref<null | ReturnType<typeof studyLibrary.previewImport>>(
  null,
);
const allLessons = computed(() => [
  ...props.book.units.flatMap((unit) => unit.lessons),
  ...(props.book.transitions ?? []),
  ...(props.book.specialties ?? []),
]);
const bookSessions = computed(() =>
  studyLibrary.sessions.value.filter(
    (session) => session.bookId === props.book.id,
  ),
);
const historyQuery = ref('');
const historyStatus = ref<HistoryStatus>('all');
const historyMode = ref<HistoryMode>('all');
const historyPage = ref(1);
const historyPageSize = ref(10);
const history = computed(() =>
  filterHistory(
    bookSessions.value,
    historyQuery.value,
    historyStatus.value,
    historyMode.value,
  ),
);
const recent = computed(() =>
  history.value.slice(
    (historyPage.value - 1) * historyPageSize.value,
    historyPage.value * historyPageSize.value,
  ),
);
watch(
  [
    historyQuery,
    historyStatus,
    historyMode,
    historyPageSize,
    () => studyLibrary.activeProfile.value?.id,
  ],
  () => {
    historyPage.value = 1;
  },
);
watch(
  () => history.value.length,
  (length) => {
    historyPage.value = Math.min(
      historyPage.value,
      Math.max(1, Math.ceil(length / historyPageSize.value)),
    );
  },
);
const activeSession = computed(() =>
  typeof route.query.session === 'string'
    ? bookSessions.value.find((session) => session.id === route.query.session)
    : undefined,
);
const activeLesson = computed(() =>
  allLessons.value.find(
    (lesson) => lesson.id === activeSession.value?.lessonId,
  ),
);
const wrong = computed(() => studyLibrary.wrongAnswers(props.book.id));
const { loaded, error, saving, activeProfile, state } = studyLibrary;

onMounted(() => {
  void studyLibrary.initialize($t('educationLearning.defaultProfile'));
});
async function act(action: () => Promise<unknown>) {
  if (busy.value) return;
  busy.value = true;
  try {
    await action();
  } catch (error) {
    void message.error(
      $t(
        error instanceof Error && error.message.startsWith('educationLearning.')
          ? error.message
          : 'educationLearning.invalidRecord',
      ),
    );
  } finally {
    busy.value = false;
  }
}
async function openSession(id?: string) {
  await router.replace({ query: { ...route.query, session: id } });
}
function start(lesson: Lesson, mode: Session['mode'] = 'lesson') {
  void act(async () => {
    const session = await studyLibrary.start(lesson, props.book.id, { mode });
    await openSession(session.id);
  });
}
function startSpecialty(lesson: Lesson) {
  void act(async () => {
    const seed = crypto.getRandomValues(new Uint32Array(1))[0] ?? 1;
    const session = await studyLibrary.start(lesson, props.book.id, {
      mode: 'practice',
      seed,
      questions: specialtyQuestions(
        lesson.questions,
        specialtyCount.value,
        seed,
      ),
    });
    await openSession(session.id);
  });
}
function isFinished(id: string) {
  return bookSessions.value.some(
    (session) =>
      session.lessonId === id &&
      session.mode === 'lesson' &&
      session.completedAt,
  );
}
function openReference(kind: CharacterReferenceKind) {
  referenceKind.value = kind;
  referenceOpen.value = true;
}
function newProfile(edit = false) {
  rename.value = edit;
  nickname.value = edit ? (activeProfile.value?.nickname ?? '') : '';
  profileModal.value = true;
}
function saveProfile() {
  void act(async () => {
    await (rename.value
      ? studyLibrary.renameProfile(nickname.value)
      : studyLibrary.addProfile(nickname.value));
    profileModal.value = false;
    await openSession();
  });
}
function selectProfile(id: string) {
  void act(async () => {
    await studyLibrary.selectProfile(id);
    await openSession();
  });
}
function downloadBackup(source: string, index = 0, total = 1) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(
    new Blob([source], { type: 'application/json' }),
  );
  link.href = url;
  link.download = `butler-grade-one-${new Date().toISOString().slice(0, 10)}${total > 1 ? `-part-${index + 1}-of-${total}` : ''}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportData() {
  try {
    const files = studyLibrary.backupFiles();
    if (files.length === 1) downloadBackup(required(files[0]));
    else backupFiles.value = files;
  } catch (error) {
    void message.error(
      $t(
        error instanceof Error
          ? error.message
          : 'educationLearning.invalidRecord',
      ),
    );
  }
}
async function previewFile(file: File) {
  importPreview.value = null;
  importSource.value = '';
  await act(async () => {
    if (file.size > MAX_BACKUP_BYTES)
      throw new Error('educationLearning.backupTooLarge');
    const source = await file.text();
    importPreview.value = studyLibrary.previewImport(source);
    importSource.value = source;
  });
  return false;
}
function importData() {
  void act(async () => {
    await studyLibrary.importBackup(importSource.value);
    importPreview.value = null;
    importSource.value = '';
    void message.success($t('educationLearning.imported'));
  });
}
function newQuestions(session: Session) {
  return newReviewQuestions(
    allLessons.value.find((item) => item.id === session.lessonId),
    session,
    studyLibrary.sessions.value,
  );
}
function review(session: Session, original: boolean) {
  const lesson = original
    ? originalReviewLesson(session)
    : allLessons.value.find((item) => item.id === session.lessonId);
  if (!lesson) return;
  const questions = original ? lesson.questions : newQuestions(session);
  if (questions.length === 0) {
    void message.info($t('educationLearning.noNewQuestions'));
    return;
  }
  void act(async () => {
    const attempt = await studyLibrary.start(lesson, props.book.id, {
      mode: 'review',
      originalSessionId: session.id,
      questions,
    });
    await openSession(attempt.id);
  });
}
const wrongSessions = computed(() => [
  ...new Map(
    wrong.value.map((item) => [item.session.id, item.session]),
  ).values(),
]);
</script>

<template>
  <div class="learning-workspace flex flex-col gap-4">
    <Alert
      type="info"
      show-icon
      :message="$t('educationLearning.localOnly')"
      :description="$t('educationLearning.localNotice')"
    />
    <Spin v-if="!loaded" :tip="$t('educationLearning.loading')" />
    <Alert v-if="error" type="warning" show-icon :message="$t(error)">
      <template #action>
        <Button
          class="!min-h-11"
          @click="
            act(() =>
              state
                ? studyLibrary.persist()
                : studyLibrary.initialize(
                    $t('educationLearning.defaultProfile'),
                  ),
            )
          "
        >
          {{ $t('educationLearning.retryStorage') }}
        </Button>
      </template>
    </Alert>
    <template v-if="state">
      <Card>
        <div class="flex flex-wrap items-end gap-3">
          <Form layout="vertical" class="!mb-0 min-w-48">
            <FormItem
              :label="$t('educationLearning.profile')"
              html-for="learning-profile"
              class="!mb-0"
            >
              <Select
                id="learning-profile"
                :value="activeProfile?.id"
                :options="
                  state.profiles.map((profile) => ({
                    value: profile.id,
                    label: profile.nickname,
                  }))
                "
                :disabled="busy"
                @update:value="(value) => selectProfile(String(value))"
              />
            </FormItem>
          </Form>
          <Button class="!min-h-11" :disabled="busy" @click="newProfile()">
            {{ $t('educationLearning.addProfile') }}
          </Button>
          <Button class="!min-h-11" :disabled="busy" @click="newProfile(true)">
            {{ $t('educationLearning.renameProfile') }}
          </Button>
          <Button class="!min-h-11" @click="exportData">
            {{ $t('educationLearning.exportBackup') }}
          </Button>
          <Upload
            accept=".json,application/json"
            :show-upload-list="false"
            :before-upload="previewFile"
            :disabled="busy"
          >
            <Button class="!min-h-11" :disabled="busy">
              {{ $t('educationLearning.importBackup') }}
            </Button>
          </Upload>
          <Tag>
            {{
              $t(
                saving
                  ? 'educationLearning.saving'
                  : error
                    ? 'educationLearning.unsavedTag'
                    : 'educationLearning.saved',
              )
            }}
          </Tag>
        </div>
      </Card>
      <SessionPlayer
        v-if="activeSession"
        :session-id="activeSession.id"
        :lesson="activeLesson"
        @close="openSession()"
      />
      <template v-else>
        <Alert
          v-if="route.query.session"
          type="warning"
          show-icon
          :message="$t('educationLearning.sessionNotFound')"
        />
        <Card
          v-if="
            (book.subject === 'math' && book.edition !== 'bnu-2024') ||
            book.edition === 'pep-2024' ||
            book.transitions?.length
          "
          :title="$t('educationLearning.transitionTitle')"
        >
          <p class="mb-4 leading-7 text-muted-foreground">
            {{ $t('educationLearning.transitionNotice') }}
          </p>
          <div
            v-if="book.transitions?.length"
            class="grid gap-3 md:grid-cols-3"
          >
            <div
              v-for="lesson in book.transitions"
              :key="lesson.id"
              class="flex flex-col gap-3 rounded-lg border border-border p-4"
            >
              <h3 class="text-lg font-semibold">{{ lesson.title }}</h3>
              <p class="flex-1 leading-7">{{ lesson.goal }}</p>
              <Button
                class="!min-h-11 self-start"
                :disabled="busy"
                @click="start(lesson, 'transition')"
              >
                {{ $t('educationLearning.startTransition') }}
              </Button>
            </div>
          </div>
          <Button
            v-else-if="book.subject === 'math'"
            class="!min-h-11"
            @click="
              router.push(`/education/primary/p1/math/${book.edition}/lower`)
            "
          >
            {{ $t('educationLearning.openLowerTransition') }}
          </Button>
          <Empty
            v-else
            :description="$t('educationLearning.contentPreparing')"
          />
        </Card>
        <Card
          v-if="book.specialties?.length"
          :title="$t('educationLearning.specialtyTitle')"
        >
          <p class="mb-4 leading-7 text-muted-foreground">
            {{ $t('educationLearning.specialtyNotice') }}
          </p>
          <Form layout="vertical" class="mb-4 max-w-xs">
            <FormItem
              :label="$t('educationLearning.specialtyCount')"
              html-for="specialty-count"
            >
              <Select
                id="specialty-count"
                v-model:value="specialtyCount"
                :options="
                  [6, 12, 20].map((value) => ({
                    value,
                    label: $t('educationLearning.questionCount', {
                      count: value,
                    }),
                  }))
                "
              />
            </FormItem>
          </Form>
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="lesson in book.specialties"
              :key="lesson.id"
              class="flex flex-col gap-3 rounded-lg border border-border p-4"
            >
              <h3 class="text-lg font-semibold">{{ lesson.title }}</h3>
              <p class="flex-1 leading-7 text-muted-foreground">
                {{ lesson.goal }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{
                  $t('educationLearning.specialtyActualCount', {
                    count: Math.min(specialtyCount, lesson.questions.length),
                    total: lesson.questions.length,
                  })
                }}
              </p>
              <Button
                class="!min-h-11 self-start"
                :disabled="busy"
                @click="startSpecialty(lesson)"
              >
                {{ $t('educationLearning.startSpecialty') }}
              </Button>
            </div>
          </div>
        </Card>
        <Card :title="book.title">
          <template #extra>
            <a :href="book.source" target="_blank" rel="noopener noreferrer">
              {{ $t(textbookLinkKey) }}
            </a>
          </template>
          <p class="mb-4 text-muted-foreground">
            {{ $t(textbookNoticeKey) }}
          </p>
          <Alert
            v-if="book.edition === 'sujiao'"
            class="mb-4"
            type="info"
            show-icon
            :message="
              $t(
                book.volume === 'lower'
                  ? 'educationLearning.sujiaoLowerPartialNotice'
                  : 'educationLearning.sujiaoPartialNotice',
              )
            "
          />
          <Alert
            v-if="book.subject === 'chinese'"
            class="mb-4"
            type="info"
            show-icon
            :message="$t('educationLearning.chinesePartialNotice')"
          />
          <div class="flex flex-col gap-6">
            <section v-for="unit in book.units" :key="unit.id">
              <h3 class="mb-3 text-lg font-semibold">{{ unit.title }}</h3>
              <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div
                  v-for="lesson in unit.lessons"
                  :key="lesson.id"
                  class="flex flex-col gap-3 rounded-xl border border-border p-4"
                >
                  <div class="flex flex-wrap gap-2">
                    <Tag>
                      {{
                        $t('educationLearning.page', { number: lesson.page })
                      }}
                    </Tag>
                    <Tag v-if="isFinished(lesson.id)" color="green">
                      {{ $t('educationLearning.completedLesson') }}
                    </Tag>
                    <Tag v-if="lesson.reference">
                      {{ $t('educationLearning.referenceQueryReady') }}
                    </Tag>
                    <Tag v-else-if="lesson.status === 'preparing'">
                      {{ $t('educationLearning.contentPreparing') }}
                    </Tag>
                  </div>
                  <h4 class="text-base font-semibold">{{ lesson.title }}</h4>
                  <p class="flex-1 leading-7 text-muted-foreground">
                    {{ lesson.goal }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <Button
                      v-if="lesson.reference"
                      class="!min-h-11"
                      @click="openReference(lesson.reference)"
                    >
                      {{ $t('educationLearning.openReference') }}
                    </Button>
                    <Button
                      v-else
                      class="!min-h-11"
                      type="primary"
                      :disabled="busy || lesson.status !== 'available'"
                      @click="start(lesson)"
                    >
                      {{
                        $t(
                          lesson.status === 'available'
                            ? 'educationLearning.enterLesson'
                            : 'educationLearning.notAvailable',
                        )
                      }}
                    </Button>
                    <Button
                      class="!min-h-11"
                      v-if="!lesson.reference && lesson.status === 'available'"
                      :disabled="busy"
                      @click="start(lesson, 'practice')"
                    >
                      {{ $t('educationLearning.practiceOnly') }}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Card>
        <Card :title="$t('educationLearning.recentSessions')">
          <Form layout="vertical" class="mb-4 grid gap-3 sm:grid-cols-3">
            <FormItem
              :label="$t('educationLearning.historySearch')"
              html-for="history-search"
              class="!mb-0"
            >
              <Input
                class="!min-h-11"
                id="history-search"
                v-model:value="historyQuery"
                allow-clear
                :maxlength="120"
              />
            </FormItem>
            <FormItem
              :label="$t('educationLearning.historyStatus')"
              html-for="history-status"
              class="!mb-0"
            >
              <Select
                id="history-status"
                v-model:value="historyStatus"
                :options="
                  ['all', 'unfinished', 'completed'].map((value) => ({
                    value,
                    label: $t(`educationLearning.status_${value}`),
                  }))
                "
              />
            </FormItem>
            <FormItem
              :label="$t('educationLearning.historyMode')"
              html-for="history-mode"
              class="!mb-0"
            >
              <Select
                id="history-mode"
                v-model:value="historyMode"
                :options="
                  ['all', 'lesson', 'practice', 'review', 'transition'].map(
                    (value) => ({
                      value,
                      label: $t(`educationLearning.mode_${value}`),
                    }),
                  )
                "
              />
            </FormItem>
          </Form>
          <Empty
            v-if="!recent.length"
            :description="
              $t(
                bookSessions.length
                  ? 'educationLearning.noMatchingSessions'
                  : 'educationLearning.noSessions',
              )
            "
          />
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="session in recent"
              :key="session.id"
              class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
            >
              <div>
                <p class="font-medium">
                  {{ session.lessonTitle }} ·
                  {{ $t(`educationLearning.mode_${session.mode}`) }}
                </p>
                <p class="mt-2 text-sm text-muted-foreground">
                  {{ new Date(session.updatedAt).toLocaleString() }} ·
                  {{
                    $t('educationLearning.submittedCount', {
                      number: statistics(session).submitted,
                      total: session.questions.length,
                    })
                  }}
                </p>
              </div>
              <Button class="!min-h-11" @click="openSession(session.id)">
                {{
                  $t(
                    session.completedAt
                      ? 'educationLearning.viewRecord'
                      : 'educationLearning.resume',
                  )
                }}
              </Button>
            </div>
          </div>
          <Pagination
            v-if="history.length"
            v-model:current="historyPage"
            v-model:page-size="historyPageSize"
            class="mt-4"
            :total="history.length"
            :page-size-options="['10', '20', '50']"
            show-size-changer
            :show-total="
              (total) => $t('educationLearning.historyTotal', { total })
            "
            responsive
          />
        </Card>
        <Card :title="$t('educationLearning.wrongAnswers')">
          <Empty
            v-if="!wrongSessions.length"
            :description="$t('educationLearning.noWrongAnswers')"
          />
          <p v-else class="mb-4 text-muted-foreground">
            {{ $t('educationLearning.reviewNotice') }}
          </p>
          <div
            v-for="session in wrongSessions"
            :key="session.id"
            class="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
          >
            <span>{{ session.lessonTitle }}</span>
            <div class="flex flex-wrap gap-2">
              <Button
                class="!min-h-11"
                :disabled="busy"
                @click="review(session, true)"
              >
                {{ $t('educationLearning.reviewOriginal') }}
              </Button>
              <Button
                class="!min-h-11"
                :disabled="busy || !newQuestions(session).length"
                @click="review(session, false)"
              >
                {{ $t('educationLearning.reviewNew') }}
              </Button>
            </div>
          </div>
        </Card>
      </template>
    </template>
    <Modal
      :open="backupFiles.length > 0"
      :title="$t('educationLearning.backupPartsTitle')"
      :footer="null"
      @cancel="backupFiles = []"
    >
      <Alert
        type="info"
        show-icon
        :message="
          $t('educationLearning.backupPartsNotice', {
            count: backupFiles.length,
          })
        "
      />
      <div class="mt-4 flex flex-col gap-3">
        <Button
          v-for="(source, index) in backupFiles"
          :key="index"
          class="!min-h-11"
          @click="downloadBackup(source, index, backupFiles.length)"
        >
          {{
            $t('educationLearning.downloadBackupPart', {
              part: index + 1,
              total: backupFiles.length,
            })
          }}
        </Button>
      </div>
    </Modal>
    <Modal
      v-if="book.subject === 'chinese'"
      :open="referenceOpen"
      :title="$t('educationLearning.characterReferenceTitle')"
      :footer="null"
      :width="960"
      @cancel="referenceOpen = false"
    >
      <CharacterReference :volume="book.volume" v-model:kind="referenceKind" />
    </Modal>
    <Modal
      :open="profileModal"
      :title="
        $t(
          rename
            ? 'educationLearning.renameProfile'
            : 'educationLearning.addProfile',
        )
      "
      :confirm-loading="busy"
      @ok="saveProfile"
      @cancel="profileModal = false"
    >
      <Form layout="vertical">
        <FormItem
          :label="$t('educationLearning.nickname')"
          html-for="learning-nickname"
        >
          <Input
            class="!min-h-11"
            id="learning-nickname"
            v-model:value="nickname"
            :maxlength="40"
            @press-enter="saveProfile"
          />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      :open="!!importPreview"
      :title="$t('educationLearning.importPreview')"
      :confirm-loading="busy"
      @ok="importData"
      @cancel="
        importPreview = null;
        importSource = '';
      "
    >
      <p class="leading-7">
        {{
          $t('educationLearning.importCounts', {
            profiles: importPreview?.profiles ?? 0,
            sessions: importPreview?.sessions ?? 0,
            duplicates: importPreview?.duplicates ?? 0,
          })
        }}
      </p>
      <Alert
        class="mt-4"
        type="info"
        show-icon
        :message="$t('educationLearning.mergeNotice')"
      />
    </Modal>
  </div>
</template>

<style scoped>
.learning-workspace :deep(.ant-select-selector) {
  align-items: center;
  min-height: 44px;
}

.learning-workspace
  :deep(.ant-select-single .ant-select-selection-search-input) {
  height: 42px;
}

.learning-workspace :deep(.ant-pagination-item),
.learning-workspace :deep(.ant-pagination-prev),
.learning-workspace :deep(.ant-pagination-next) {
  min-width: 44px;
  min-height: 44px;
  line-height: 42px;
}

.learning-workspace :deep(.ant-pagination-item-link) {
  min-height: 44px;
}
</style>
