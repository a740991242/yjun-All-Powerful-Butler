import type { Question } from './types';

import { shuffledQuestions } from './engine';

/** Seeded round-robin across source skills avoids sampling only one course. */
export function specialtyQuestions(
  pool: Question[],
  count: number,
  seed: number,
) {
  if (![6, 12, 20].includes(count) || !Number.isSafeInteger(seed))
    throw new Error('educationLearning.invalidRecord');
  const unique = shuffledQuestions(
    [...new Map(pool.map((question) => [question.id, question])).values()],
    seed,
  );
  const skills = [...new Set(unique.map((question) => question.knowledge))];
  const buckets = skills.map((skill, index) =>
    shuffledQuestions(
      unique.filter((question) => question.knowledge === skill),
      seed + index,
    ),
  );
  const result: Question[] = [];
  for (let round = 0; result.length < Math.min(count, unique.length); round++) {
    for (const bucket of buckets) {
      const question = bucket[round];
      if (question) result.push(question);
      if (result.length === count) break;
    }
  }
  return result;
}
