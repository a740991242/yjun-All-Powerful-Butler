import type {
  Answer,
  AnswerRule,
  Lesson,
  Question,
  Response,
  Session,
} from './types';

import { matchesCardEquation } from './card-equation';
import { columnDigitBlankCount, matchesColumnDigits } from './column-digits';
import { matchesCrossBalance } from './cross-balance';
import { matchesEqualPairs } from './equal-pairs';
import { fold } from './fold';
import { magicBlankCount, matchesMagicGrid } from './magic-grid';
import { matchesNumberChain, numberChainBlankCount } from './number-chain';
import { matchesNumberPicks } from './number-picks';
import { matchesTower, towerBlankCount } from './number-tower';

export const GENERATOR_VERSION = 1;
export const MAX_REFLECTION_LENGTH = 1000;

/** Only normalizes glyph encodings; v/ü and numbered tones are not conflated. */
export function normalizeText(value: string, mode: 'nfc' | 'pinyin') {
  const normalized = value.normalize('NFC').trim();
  return mode === 'pinyin'
    ? normalized.toLowerCase().replaceAll(/\s+/g, ' ')
    : normalized;
}

export function validAnswer(rule: AnswerRule, answer: Answer | null): boolean {
  if (answer === null) return false;
  switch (rule.kind) {
    case 'manual': {
      return answer === 'confirmed';
    }
    case 'reflection': {
      return (
        typeof answer === 'string' &&
        answer.trim().length > 0 &&
        answer.length <= MAX_REFLECTION_LENGTH
      );
    }
    case 'choice':
    case 'text': {
      return typeof answer === 'string' && answer.trim().length > 0;
    }
    case 'number': {
      return (
        typeof answer === 'number' &&
        Number.isSafeInteger(answer) &&
        Math.abs(answer) <= 100_000
      );
    }
    case 'cross-balance':
    case 'card-equation':
    case 'equal-pairs':
    case 'column-digits':
    case 'number-picks':
    case 'number-chain':
    case 'magic-grid':
    case 'tower':
    case 'partition':
    case 'steps': {
      return (
        Array.isArray(answer) &&
        answer.length ===
          (() => {
            if (rule.kind === 'card-equation') return 4;
            if (rule.kind === 'equal-pairs') return 8;
            if (rule.kind === 'column-digits')
              return columnDigitBlankCount(rule);
            if (rule.kind === 'number-picks') return rule.fields.length;
            if (rule.kind === 'number-chain')
              return numberChainBlankCount(rule);
            return (() => {
              if (rule.kind === 'magic-grid')
                return magicBlankCount(rule.cells);
              return (() => {
                if (rule.kind === 'tower') return towerBlankCount(rule.rows);
                return rule.kind === 'partition'
                  ? rule.parts
                  : rule.values.length;
              })();
            })();
          })() &&
        [...answer].every(
          (item) =>
            typeof item === 'number' &&
            Number.isSafeInteger(item) &&
            Math.abs(item) <= 100_000,
        )
      );
    }
    case 'sequence':
    case 'set': {
      return (
        Array.isArray(answer) &&
        answer.length > 0 &&
        answer.every((item) => typeof item === 'string' && item.length > 0)
      );
    }
  }
}

export function evaluate(
  rule: AnswerRule,
  answer: Answer | null,
): boolean | null {
  if (!validAnswer(rule, answer))
    throw new Error('educationLearning.answerRequired');
  switch (rule.kind) {
    case 'manual':
    case 'reflection': {
      return null;
    }
    case 'number':
    case 'choice': {
      return answer === rule.value;
    }
    case 'text': {
      return (
        typeof answer === 'string' &&
        rule.accepted.some(
          (value) =>
            normalizeText(answer, rule.normalize) ===
            normalizeText(value, rule.normalize),
        )
      );
    }
    case 'set': {
      if (!Array.isArray(answer)) return false;
      const actual = [...new Set<null | number | string>(answer)].toSorted(
        (a, b) => String(a).localeCompare(String(b)),
      );
      const expected = [...new Set(rule.values)].toSorted((a, b) =>
        String(a).localeCompare(String(b)),
      );
      return (
        actual.length === answer.length &&
        actual.length === expected.length &&
        actual.every((value, index) => value === expected[index])
      );
    }
    case 'sequence':
    case 'steps': {
      return (
        Array.isArray(answer) &&
        answer.length === rule.values.length &&
        answer.every((value, index) => value === rule.values[index])
      );
    }
    case 'cross-balance': {
      return matchesCrossBalance(rule, answer);
    }
    case 'column-digits': {
      return matchesColumnDigits(rule, answer);
    }
    case 'equal-pairs': {
      return matchesEqualPairs(rule, answer);
    }
    case 'card-equation': {
      return matchesCardEquation(rule, answer);
    }
    case 'number-picks': {
      return matchesNumberPicks(rule, answer);
    }
    case 'number-chain': {
      return matchesNumberChain(rule, answer);
    }
    case 'magic-grid': {
      return matchesMagicGrid(rule.cells, answer);
    }
    case 'tower': {
      return matchesTower(rule.rows, answer);
    }
    case 'partition': {
      return (
        Array.isArray(answer) &&
        answer.every(
          (value) => typeof value === 'number' && value >= rule.minimum,
        ) &&
        fold<null | number | string, number>(
          answer,
          0,
          (total, value) => total + Number(value),
        ) === rule.total
      );
    }
  }
}

/** Reproducible shuffle: lesson questions themselves remain reviewed snapshots. */
export function shuffledQuestions(
  questions: Question[],
  seed: number,
): Question[] {
  let state = seed >>> 0;
  const result = structuredClone(questions);
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    const other = state % (i + 1);
    const item = result[i];
    const target = result[other];
    if (item && target) {
      result[i] = target;
      result[other] = item;
    }
  }
  return result;
}

export function createSession(
  lesson: Lesson,
  bookId: string,
  profileId: string,
  options: {
    id?: string;
    mode?: Session['mode'];
    now?: string;
    originalSessionId?: string;
    questions?: Question[];
    seed?: number;
  } = {},
): Session {
  const now = options.now ?? new Date().toISOString();
  const seed =
    options.seed ?? crypto.getRandomValues(new Uint32Array(1))[0] ?? 1;
  const questions = shuffledQuestions(
    options.questions ?? lesson.questions,
    seed,
  );
  if (questions.length === 0) throw new Error('educationLearning.noQuestions');
  return {
    id: options.id ?? crypto.randomUUID(),
    profileId,
    bookId,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonVersion: lesson.version,
    mode: options.mode ?? 'lesson',
    originalSessionId: options.originalSessionId,
    seed,
    generatorVersion: GENERATOR_VERSION,
    startedAt: now,
    updatedAt: now,
    phase: options.mode && options.mode !== 'lesson' ? 'practice' : 'learn',
    step: 0,
    questionIndex: 0,
    questions,
    responses: questions.map((question) => ({
      questionId: question.id,
      draft: null,
      hintUsed: false,
      readingHelp: false,
      skipped: false,
      submissions: [],
    })),
    activities: [],
    tools: {},
  };
}

export function submitResponse(
  question: Question,
  response: Response,
  now = new Date().toISOString(),
): Response {
  if (question.id !== response.questionId)
    throw new Error('educationLearning.invalidRecord');
  const correct = evaluate(question.rule, response.draft);
  if (response.draft === null)
    throw new Error('educationLearning.answerRequired');
  const previous = response.submissions.at(-1);
  // Double clicks and unchanged repeat submissions are idempotent.
  if (
    previous &&
    JSON.stringify(previous.answer) === JSON.stringify(response.draft)
  )
    return response;
  return {
    ...response,
    skipped: false,
    submissions: [
      ...response.submissions,
      {
        answer: structuredClone(response.draft),
        correct,
        assisted: response.hintUsed,
        readingHelp: response.readingHelp ?? false,
        at: now,
      },
    ],
  };
}

export function statistics(session: Session) {
  const first = session.responses.flatMap((response) => {
    const submission = response.submissions[0];
    return submission ? [submission] : [];
  });
  const independent = first.filter(
    (item) => item.correct !== null && !item.assisted && !item.readingHelp,
  );
  return {
    total: session.questions.length,
    submitted: first.length,
    skipped: session.responses.filter(
      (item) => item.skipped && item.submissions.length === 0,
    ).length,
    assisted: first.filter((item) => item.assisted && item.correct !== null)
      .length,
    readingHelp: first.filter(
      (item) => item.readingHelp && item.correct !== null,
    ).length,
    manual: session.questions.filter(
      (question, index) =>
        question.rule.kind === 'manual' &&
        session.responses[index]?.submissions.length,
    ).length,
    reflections: session.questions.filter(
      (question, index) =>
        question.rule.kind === 'reflection' &&
        session.responses[index]?.submissions.length,
    ).length,
    independent: independent.length,
    firstCorrect: independent.filter((item) => item.correct).length,
    accuracy:
      independent.length > 0
        ? independent.filter((item) => item.correct).length / independent.length
        : null,
    finalCorrect: session.responses.filter(
      (item) => item.submissions.at(-1)?.correct === true,
    ).length,
  };
}

export function mistakes(session: Session) {
  return session.questions.filter((_question, index) =>
    session.responses[index]?.submissions.some(
      (submission) => submission.correct === false,
    ),
  );
}
