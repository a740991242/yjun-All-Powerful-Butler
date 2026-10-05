<script setup lang="ts">
import type { Answer, Lesson, Session, VisualState } from './types';

import { computed, ref, watch } from 'vue';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapsePanel,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Radio,
  RadioGroup,
  Select,
  Steps,
  Tag,
  Textarea,
} from 'ant-design-vue';

import { $t } from '#/locales';

import { columnDigitBlankCount } from './column-digits';
import { MAX_REFLECTION_LENGTH, statistics, validAnswer } from './engine';
import { answerLabel } from './history';
import { studyLibrary } from './library';
import { magicBlankCount } from './magic-grid';
import { numberChainBlankCount } from './number-chain';
import { towerBlankCount } from './number-tower';
import Visual from './Visual.vue';

const props = defineProps<{ sessionId: string; lesson?: Lesson }>();
const emit = defineEmits<{ close: [] }>();
const busy = ref(false);
const session = computed(() =>
  studyLibrary.sessions.value.find((item) => item.id === props.sessionId),
);
const question = computed(
  () => session.value?.questions[session.value.questionIndex],
);
const response = computed(
  () => session.value?.responses[session.value.questionIndex],
);
const lastSubmission = computed(() => response.value?.submissions.at(-1));
const summary = computed(() =>
  session.value ? statistics(session.value) : null,
);
const step = computed(() => props.lesson?.steps[session.value?.step ?? 0]);
const learningCompatible = computed(
  () =>
    !!props.lesson &&
    props.lesson.version === session.value?.lessonVersion &&
    !!step.value,
);
const fieldCount = computed(() => {
  const rule = question.value?.rule;
  if (rule?.kind === 'card-equation') return 4;
  if (rule?.kind === 'equal-pairs') return 8;
  if (rule?.kind === 'column-digits') return columnDigitBlankCount(rule);
  if (rule?.kind === 'magic-grid') return magicBlankCount(rule.cells);
  if (rule?.kind === 'tower') return towerBlankCount(rule.rows);
  if (rule?.kind === 'cross-balance') return rule.values.length;
  if (rule?.kind === 'number-picks') return rule.fields.length;
  if (rule?.kind === 'arithmetic-pair') return 2;
  if (rule?.kind === 'reversed-addends') return rule.count * 2;
  if (rule?.kind === 'number-chain') return numberChainBlankCount(rule);
  return (() => {
    if (rule?.kind === 'partition') return rule.parts;
    return rule?.kind === 'steps' || rule?.kind === 'sequence'
      ? rule.values.length
      : 0;
  })();
});
const formId = computed(
  () => `answer-${session.value?.id}-${session.value?.questionIndex}`,
);
watch(
  () => studyLibrary.activeProfile.value?.id,
  () => emit('close'),
);

async function perform(action: () => Promise<unknown>) {
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
function mutate(change: (value: Session) => void) {
  return studyLibrary.updateSession(props.sessionId, change);
}
function setDraft(value: Answer | null) {
  // Writes update the in-memory snapshot synchronously; disk writes are queued.
  void mutate((currentSession) => {
    const current = currentSession.responses[currentSession.questionIndex];
    if (current) current.draft = structuredClone(value);
  }).catch(() => message.error($t('educationLearning.unsaved')));
}
function setToolState(key: string, state: VisualState) {
  void mutate((value) => {
    value.tools ??= {};
    value.tools[key] = structuredClone(state);
  }).catch(() => message.error($t('educationLearning.unsaved')));
}
function setLearningTool(state: VisualState) {
  if (session.value) setToolState(`step-${session.value.step}`, state);
}
function setQuestionTool(state: VisualState) {
  if (question.value) setToolState(`question-${question.value.id}`, state);
}
function numericPart(index: number) {
  const draft = response.value?.draft;
  const value = Array.isArray(draft) ? draft[index] : null;
  return typeof value === 'number' ? value : null;
}
function setNumericPart(index: number, value: null | number | string) {
  const draft: (null | number)[] = Array.from(
    { length: fieldCount.value },
    (_, position) => numericPart(position),
  );
  draft[index] = typeof value === 'number' ? value : null;
  setDraft(draft);
}
function sequencePart(index: number) {
  const draft = response.value?.draft;
  return Array.isArray(draft) && typeof draft[index] === 'string'
    ? draft[index]
    : undefined;
}
function setSequencePart(index: number, value: string) {
  const draft = Array.from(
    { length: fieldCount.value },
    (_, position) => sequencePart(position) ?? '',
  );
  draft[index] = value;
  setDraft(draft);
}
async function navigate(offset: number) {
  await perform(() =>
    mutate((value) => {
      value.questionIndex = Math.max(
        0,
        Math.min(value.questions.length - 1, value.questionIndex + offset),
      );
    }),
  );
}
async function hint() {
  await perform(() =>
    mutate((value) => {
      const current = value.responses[value.questionIndex];
      if (current) current.hintUsed = true;
    }),
  );
}
async function recordReadingHelp() {
  await perform(() =>
    mutate((value) => {
      const current = value.responses[value.questionIndex];
      if (current) current.readingHelp = true;
    }),
  );
}
async function skip() {
  await perform(async () => {
    await mutate((value) => {
      const current = value.responses[value.questionIndex];
      if (current && current.submissions.length === 0) current.skipped = true;
      value.questionIndex = Math.min(
        value.questions.length - 1,
        value.questionIndex + 1,
      );
    });
  });
}
async function nextLearning() {
  await perform(() =>
    mutate((value) => {
      if (value.step < (props.lesson?.steps.length ?? 0) - 1) value.step++;
      else value.phase = 'practice';
    }),
  );
}
async function confirmActivity() {
  await perform(() =>
    mutate((value) => {
      const id = `step-${value.step}`;
      if (!value.activities.includes(id)) value.activities.push(id);
    }),
  );
}
async function finish() {
  if (!session.value) return;
  const pending = session.value.responses.some(
    (item) => !item.skipped && item.submissions.length === 0,
  );
  if (pending) {
    void message.info($t('educationLearning.finishPending'));
    return;
  }
  await perform(() => studyLibrary.finish(props.sessionId));
}
</script>

<template>
  <Card v-if="session" :title="session.lessonTitle">
    <template #extra>
      <Button class="!min-h-11" @click="emit('close')">
        {{ $t('educationLearning.backCourses') }}
      </Button>
    </template>
    <div class="flex flex-col gap-6">
      <Steps
        :current="
          session.phase === 'learn' ? 0 : session.phase === 'practice' ? 1 : 2
        "
        :items="[
          { title: $t('educationLearning.learn') },
          { title: $t('educationLearning.practice') },
          { title: $t('educationLearning.summary') },
        ]"
        size="small"
      />
      <div
        v-if="session.phase === 'learn' && (!learningCompatible || !lesson)"
        class="flex flex-col gap-4"
      >
        <Alert
          type="warning"
          show-icon
          :message="$t('educationLearning.lessonVersionChanged')"
          :description="$t('educationLearning.snapshotNotice')"
        />
        <Button
          class="!min-h-11 self-start"
          :disabled="busy"
          @click="
            perform(() =>
              mutate((value) => {
                value.phase = 'practice';
              }),
            )
          "
        >
          {{ $t('educationLearning.resumeSnapshot') }}
        </Button>
      </div>
      <div
        v-else-if="session.phase === 'learn' && lesson"
        class="flex flex-col gap-4"
      >
        <p class="font-medium">{{ lesson.goal }}</p>
        <Collapse>
          <CollapsePanel
            key="parent"
            :header="$t('educationLearning.parentTip')"
          >
            <p class="leading-7">{{ lesson.parentTip }}</p>
            <p class="mt-2 leading-7">{{ lesson.prerequisite }}</p>
          </CollapsePanel>
        </Collapse>
        <h3 class="text-xl font-semibold">{{ step?.title }}</h3>
        <p class="whitespace-pre-line text-xl leading-8">{{ step?.text }}</p>
        <Visual
          v-if="step?.visual"
          :visual="step.visual"
          :state="session.tools?.[`step-${session.step}`]"
          interactive
          @update:state="setLearningTool"
        />
        <div v-if="step?.activity" class="rounded-lg border border-border p-4">
          <p class="mb-4 text-xl leading-8">{{ step.activity }}</p>
          <Button
            class="!h-auto !min-h-11 !max-w-full !whitespace-normal !py-2"
            :disabled="session.activities.includes(`step-${session.step}`)"
            @click="confirmActivity"
          >
            {{
              $t(
                session.activities.includes(`step-${session.step}`)
                  ? 'educationLearning.confirmed'
                  : 'educationLearning.confirmActivity',
              )
            }}
          </Button>
          <p class="mt-3 text-sm text-muted-foreground">
            {{ $t('educationLearning.manualNotice') }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <Button
            class="!min-h-11"
            :disabled="session.step === 0 || busy"
            @click="
              perform(() =>
                mutate((value) => {
                  value.step--;
                }),
              )
            "
          >
            {{ $t('educationLearning.previous') }}
          </Button>
          <Button
            class="!min-h-11"
            type="primary"
            :loading="busy"
            @click="nextLearning"
          >
            {{
              $t(
                session.step < lesson.steps.length - 1
                  ? 'educationLearning.next'
                  : 'educationLearning.startPractice',
              )
            }}
          </Button>
        </div>
      </div>
      <div
        v-else-if="session.phase === 'practice' && question && response"
        class="flex flex-col gap-4"
      >
        <div class="flex flex-wrap gap-3">
          <Tag>
            {{
              $t('educationLearning.questionNumber', {
                current: session.questionIndex + 1,
                total: session.questions.length,
              })
            }}
          </Tag>
          <Tag v-if="response.hintUsed">
            {{ $t('educationLearning.assisted') }}
          </Tag>
          <Tag v-if="response.readingHelp">
            {{ $t('educationLearning.readingHelpRecord') }}
          </Tag>
        </div>
        <h3 class="text-xl font-semibold leading-8">{{ question.prompt }}</h3>
        <p
          v-if="question.material"
          class="whitespace-pre-line text-xl leading-8"
        >
          {{ question.material }}
        </p>
        <Visual
          v-if="question.visual"
          :visual="question.visual"
          :state="
            question.rule.kind !== 'manual' &&
            ['number-line', 'place-value'].includes(question.visual.kind)
              ? undefined
              : session.tools?.[`question-${question.id}`]
          "
          @update:state="setQuestionTool"
          :interactive="
            question.visual.kind === 'shape-join' ||
            question.visual.kind === 'ten-cells' ||
            question.visual.kind === 'card-game' ||
            (question.rule.kind === 'manual' &&
              [
                'number-line',
                'place-value',
                'geoboard-shift',
                'square-mosaic',
                'triangle-mosaic',
                'survey-table',
                'estimate-dots',
              ].includes(question.visual.kind)) ||
            (response.hintUsed &&
              ![
                'number-line',
                'place-value',
                'geoboard-shift',
                'square-mosaic',
                'triangle-mosaic',
                'survey-table',
                'estimate-dots',
              ].includes(question.visual.kind))
          "
        />
        <Form
          :model="response"
          class="learning-answer-form"
          layout="vertical"
          @finish="perform(() => studyLibrary.submit(sessionId))"
        >
          <FormItem
            :label="
              $t(
                question.rule.kind === 'reflection'
                  ? 'educationLearning.reflectionAnswer'
                  : 'educationLearning.answer',
              )
            "
            :html-for="formId"
          >
            <InputNumber
              v-if="
                question.rule.kind === 'number' ||
                question.rule.kind === 'number-interval'
              "
              :id="formId"
              :value="
                typeof response.draft === 'number' ? response.draft : undefined
              "
              :precision="0"
              :controls="false"
              class="!min-h-11 !w-full sm:!w-56"
              @update:value="
                (value) => setDraft(typeof value === 'number' ? value : null)
              "
            />
            <RadioGroup
              v-else-if="question.rule.kind === 'choice'"
              :id="formId"
              :value="response.draft"
              class="flex flex-wrap gap-3"
              @update:value="setDraft"
            >
              <Radio
                v-for="option in question.choices"
                :key="option.id"
                :value="option.id"
                class="!m-0 !min-h-11 rounded border border-border !p-3 !text-xl !leading-8"
              >
                {{ option.label }}
              </Radio>
            </RadioGroup>
            <div
              v-else-if="question.rule.kind === 'reflection'"
              class="flex flex-col gap-3"
            >
              <Textarea
                :id="formId"
                :value="
                  typeof response.draft === 'string' ? response.draft : ''
                "
                :maxlength="MAX_REFLECTION_LENGTH"
                :auto-size="{ minRows: 4, maxRows: 10 }"
                class="!text-xl !leading-8"
                show-count
                :placeholder="$t('educationLearning.reflectionPlaceholder')"
                @update:value="setDraft"
              />
              <p class="text-sm text-muted-foreground">
                {{ $t('educationLearning.reflectionNotice') }}
              </p>
            </div>
            <Input
              v-else-if="question.rule.kind === 'text'"
              :id="formId"
              :value="typeof response.draft === 'string' ? response.draft : ''"
              class="!min-h-11 !text-xl !leading-8"
              autocomplete="off"
              @update:value="setDraft"
            />
            <div
              v-else-if="
                question.rule.kind === 'partition' ||
                question.rule.kind === 'card-equation' ||
                question.rule.kind === 'equal-pairs' ||
                question.rule.kind === 'column-digits' ||
                question.rule.kind === 'cross-balance' ||
                question.rule.kind === 'number-picks' ||
                question.rule.kind === 'arithmetic-pair' ||
                question.rule.kind === 'reversed-addends' ||
                question.rule.kind === 'number-chain' ||
                question.rule.kind === 'steps' ||
                question.rule.kind === 'tower' ||
                question.rule.kind === 'magic-grid'
              "
              class="flex flex-wrap gap-3"
            >
              <div
                v-for="field in fieldCount"
                :key="field"
                class="flex flex-col gap-2"
              >
                <label :for="`${formId}-${field}`">
                  {{
                    question.rule.kind === 'tower' ||
                    question.rule.kind === 'card-equation' ||
                    question.rule.kind === 'equal-pairs' ||
                    question.rule.kind === 'column-digits' ||
                    question.rule.kind === 'magic-grid' ||
                    question.visual?.kind === 'number-frame' ||
                    question.visual?.kind === 'hundred-fragments' ||
                    question.visual?.kind === 'stock-table' ||
                    question.rule.kind === 'cross-balance' ||
                    question.rule.kind === 'number-chain'
                      ? $t('educationLearning.towerBlank', {
                          letter: String.fromCharCode(64 + field),
                        })
                      : $t('educationLearning.partNumber', { number: field })
                  }}
                </label>
                <InputNumber
                  :id="`${formId}-${field}`"
                  :value="numericPart(field - 1) ?? undefined"
                  :precision="0"
                  :controls="false"
                  class="!min-h-11 !w-28"
                  @update:value="(value) => setNumericPart(field - 1, value)"
                />
              </div>
            </div>
            <CheckboxGroup
              v-else-if="question.rule.kind === 'set'"
              :id="formId"
              :value="
                Array.isArray(response.draft)
                  ? response.draft.filter((item) => typeof item === 'string')
                  : []
              "
              class="flex flex-wrap gap-3"
              @update:value="(value) => setDraft(value.map(String))"
            >
              <Checkbox
                v-for="option in question.choices"
                :key="option.id"
                :value="option.id"
                class="!m-0 !min-h-11 rounded border border-border !p-3 !text-xl !leading-8"
              >
                {{ option.label }}
              </Checkbox>
            </CheckboxGroup>
            <div
              v-else-if="question.rule.kind === 'sequence'"
              class="flex flex-wrap gap-3"
            >
              <div
                v-for="field in fieldCount"
                :key="field"
                class="flex min-w-32 flex-col gap-2"
              >
                <label :for="`${formId}-${field}`">
                  {{ $t('educationLearning.partNumber', { number: field }) }}
                </label>
                <Select
                  :key="`${formId}-${field}`"
                  :id="`${formId}-${field}`"
                  class="!h-11 !w-full min-w-32"
                  popup-class-name="[&_.ant-select-item-option]:!min-h-11 [&_.ant-select-item-option-content]:!text-xl [&_.ant-select-item-option-content]:!leading-8"
                  :list-item-height="44"
                  :value="sequencePart(field - 1)"
                  :options="
                    question.choices?.map((item) => ({
                      value: item.id,
                      label: item.label,
                    }))
                  "
                  @update:value="
                    (value) => setSequencePart(field - 1, String(value))
                  "
                />
              </div>
            </div>
            <Checkbox
              v-else
              :id="formId"
              :aria-label="$t('educationLearning.confirmManual')"
              :checked="response.draft === 'confirmed'"
              class="!min-h-11 !p-3"
              @update:checked="(value) => setDraft(value ? 'confirmed' : null)"
            >
              {{ $t('educationLearning.confirmManual') }}
            </Checkbox>
          </FormItem>
          <div class="flex flex-wrap gap-3">
            <Button
              class="!min-h-11"
              html-type="submit"
              type="primary"
              :loading="busy"
              :disabled="!validAnswer(question.rule, response.draft)"
            >
              {{
                $t(
                  question.rule.kind === 'reflection'
                    ? 'educationLearning.saveReflection'
                    : 'educationLearning.submit',
                )
              }}
            </Button>
            <Button
              class="!min-h-11"
              :disabled="response.hintUsed || busy"
              @click="hint"
            >
              {{ $t('educationLearning.showHint') }}
            </Button>
            <Button
              class="!min-h-11"
              :disabled="response.readingHelp || busy"
              @click="recordReadingHelp"
            >
              {{ $t('educationLearning.recordReadingHelp') }}
            </Button>
            <Button class="!min-h-11" :disabled="busy" @click="skip">
              {{ $t('educationLearning.skip') }}
            </Button>
          </div>
        </Form>
        <Alert
          v-if="response.hintUsed"
          type="info"
          show-icon
          :message="$t('educationLearning.hint')"
          :description="question.hint"
        />
        <Alert
          v-if="lastSubmission"
          :type="
            lastSubmission.correct === true
              ? 'success'
              : lastSubmission.correct === false
                ? 'warning'
                : 'info'
          "
          show-icon
          :message="
            $t(
              lastSubmission.correct === true
                ? 'educationLearning.correct'
                : lastSubmission.correct === false
                  ? 'educationLearning.tryAgain'
                  : question.rule.kind === 'reflection'
                    ? 'educationLearning.reflectionRecorded'
                    : 'educationLearning.manualRecorded',
            )
          "
          :description="question.explanation"
        />
        <div class="flex flex-wrap gap-3 border-t border-border pt-4">
          <Button
            class="!min-h-11"
            :disabled="session.questionIndex === 0 || busy"
            @click="navigate(-1)"
          >
            {{ $t('educationLearning.previousQuestion') }}
          </Button>
          <Button
            class="!min-h-11"
            :disabled="
              session.questionIndex === session.questions.length - 1 || busy
            "
            @click="navigate(1)"
          >
            {{ $t('educationLearning.nextQuestion') }}
          </Button>
          <Button class="!min-h-11" :disabled="busy" @click="finish">
            {{ $t('educationLearning.finish') }}
          </Button>
        </div>
      </div>
      <div v-else-if="summary" class="flex flex-col gap-4">
        <Alert
          type="success"
          show-icon
          :message="$t('educationLearning.completed')"
          :description="$t('educationLearning.evidenceNotice')"
        />
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-lg border border-border p-4">
            <p>{{ $t('educationLearning.independentCorrect') }}</p>
            <strong class="text-2xl">
              {{ summary.firstCorrect }} / {{ summary.independent }}
            </strong>
          </div>
          <div class="rounded-lg border border-border p-4">
            <p>{{ $t('educationLearning.assisted') }}</p>
            <strong class="text-2xl">{{ summary.assisted }}</strong>
          </div>
          <div class="rounded-lg border border-border p-4">
            <p>{{ $t('educationLearning.manualRecorded') }}</p>
            <strong class="text-2xl">{{ summary.manual }}</strong>
          </div>
          <div class="rounded-lg border border-border p-4">
            <p>{{ $t('educationLearning.reflectionRecorded') }}</p>
            <strong class="text-2xl">{{ summary.reflections }}</strong>
          </div>
          <div class="rounded-lg border border-border p-4">
            <p>{{ $t('educationLearning.readingHelpFirst') }}</p>
            <strong class="text-2xl">{{ summary.readingHelp }}</strong>
          </div>
          <div class="rounded-lg border border-border p-4">
            <p>{{ $t('educationLearning.skipped') }}</p>
            <strong class="text-2xl">{{ summary.skipped }}</strong>
          </div>
        </div>
        <p class="text-muted-foreground">
          {{ $t('educationLearning.readingHelpNotice') }}
        </p>
        <div
          v-for="(item, index) in session.questions"
          :key="item.id"
          class="rounded-lg border border-border p-4"
        >
          <p class="mb-2 font-medium">{{ index + 1 }}. {{ item.prompt }}</p>
          <p class="text-muted-foreground">
            {{
              $t('educationLearning.attemptCount', {
                number: session.responses[index]?.submissions.length ?? 0,
              })
            }}
          </p>
          <p v-if="item.material" class="mt-2 whitespace-pre-line leading-7">
            {{ item.material }}
          </p>
          <Tag v-if="session.responses[index]?.hintUsed" class="mt-2">
            {{ $t('educationLearning.hintUsedRecord') }}
          </Tag>
          <Tag v-if="session.responses[index]?.readingHelp" class="mt-2">
            {{ $t('educationLearning.readingHelpRecord') }}
          </Tag>
          <Tag
            v-if="
              session.responses[index]?.skipped &&
              !session.responses[index]?.submissions.length
            "
            class="mt-2"
          >
            {{ $t('educationLearning.skipped') }}
          </Tag>
          <div
            v-for="(submission, attempt) in session.responses[index]
              ?.submissions"
            :key="attempt"
            class="mt-3 rounded-lg border border-border p-3"
          >
            <div class="mb-2 flex flex-wrap gap-2">
              <Tag>
                {{
                  $t(
                    attempt === 0
                      ? 'educationLearning.firstSubmission'
                      : 'educationLearning.retrySubmission',
                    { number: attempt + 1 },
                  )
                }}
              </Tag>
              <Tag
                :color="
                  submission.correct === true
                    ? 'green'
                    : submission.correct === false
                      ? 'orange'
                      : undefined
                "
              >
                {{
                  $t(
                    submission.correct === true
                      ? 'educationLearning.correct'
                      : submission.correct === false
                        ? 'educationLearning.incorrectRecord'
                        : item.rule.kind === 'reflection'
                          ? 'educationLearning.reflectionRecorded'
                          : 'educationLearning.manualRecorded',
                  )
                }}
              </Tag>
              <Tag v-if="submission.assisted">
                {{ $t('educationLearning.assisted') }}
              </Tag>
              <Tag v-if="submission.readingHelp">
                {{ $t('educationLearning.readingHelpAttempt') }}
              </Tag>
            </div>
            <p class="whitespace-pre-wrap break-words leading-7">
              {{ $t('educationLearning.recordedAnswer') }}：{{
                item.rule.kind === 'manual'
                  ? $t('educationLearning.manualRecorded')
                  : answerLabel(item, submission.answer)
              }}
            </p>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ new Date(submission.at).toLocaleString() }}
            </p>
          </div>
          <p
            v-if="session.responses[index]?.submissions.length"
            class="mt-2 leading-7"
          >
            {{ item.explanation }}
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.learning-answer-form :deep(label) {
  font-size: 20px;
  line-height: 32px;
}

.learning-answer-form :deep(.ant-form-item-label > label) {
  height: auto;
}

.learning-answer-form :deep(.ant-input-number-input) {
  height: 44px;
  font-size: 20px;
  line-height: 32px;
}

.learning-answer-form :deep(.ant-input) {
  font-size: 20px;
  line-height: 32px;
}

.learning-answer-form :deep(.ant-select-selection-item),
.learning-answer-form :deep(.ant-select-selection-placeholder) {
  font-size: 20px;
}
</style>
