import type { Lesson, Question, Session } from './types';

import { mistakes } from './engine';

function taskSignature(question: Question) {
  return JSON.stringify([
    question.prompt,
    question.material ?? '',
    question.choices ?? [],
    question.visual ?? null,
    question.rule,
  ]);
}

export function newReviewQuestions(
  lesson: Lesson | undefined,
  original: Session,
  profileSessions: Session[],
): Question[] {
  if (!lesson || lesson.status !== 'available') return [];
  const knowledge = new Set(
    mistakes(original).map((question) => question.knowledge),
  );
  const previousQuestions = profileSessions
    .filter(
      (session) =>
        session.profileId === original.profileId &&
        session.bookId === original.bookId,
    )
    .flatMap((session) => session.questions);
  const seen = new Set(previousQuestions.map((question) => question.id));
  const seenTasks = new Set(
    previousQuestions.map((item) => taskSignature(item)),
  );
  return (lesson.reviewQuestions ?? []).filter(
    (question) =>
      knowledge.has(question.knowledge) &&
      !seen.has(question.id) &&
      !seenTasks.has(taskSignature(question)),
  );
}

/** A removed lesson must not make its saved original mistakes inaccessible. */
export function originalReviewLesson(session: Session): Lesson {
  return {
    id: session.lessonId,
    title: session.lessonTitle,
    textbookTitle: session.lessonTitle,
    page: 1,
    goal: '复习已保存的原题。',
    prerequisite: '',
    parentTip: '',
    version: session.lessonVersion,
    status: 'available',
    steps: [],
    questions: mistakes(session),
    review: {
      date: session.startedAt.slice(0, 10),
      reviewer: '历史题目快照',
      notes: '沿用原会话保存的题目、提示与解析，不声称重新审校。',
    },
  };
}
