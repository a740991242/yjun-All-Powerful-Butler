import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { compoundVowelPacks } from './chinese-compound-vowels';
import { formalUnitFourNasal } from './chinese-unit-four-nasal';

it('publishes both inspected nasal bodies without changing supplements, source attribution or exact word scopes', () => {
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  for (const [index, itemId] of ['u4-4', 'u4-5'].entries()) {
    const lesson = formalUnitFourNasal[itemId]!;
    expect(lessons).toContain(lesson);
    expect(lessons).toContain(compoundVowelPacks[itemId]);
    expect(lesson.id).toBe(`cu-${itemId}`);
    expect(lesson.status).toBe('available');
    expect(compoundVowelPacks[itemId]!.id).toBe(`cu-${itemId}-vowel-tone`);
    expect(compoundVowelPacks[itemId]!.questions).toHaveLength(
      index === 0 ? 18 : 15,
    );
    expect(lesson.steps).toHaveLength(11);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'choice'),
    ).toHaveLength(index === 0 ? 28 : 24);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(6);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(1);
    expect(
      lesson.questions
        .filter((q) => q.id.includes('-q-char-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
        .join(''),
    ).toBe(upperCharacters[itemId]!.recognize);
    expect(upperCharacters[itemId]!.write).toBe('');
    for (const q of [...lesson.questions, ...lesson.reviewQuestions!]) {
      expect(q.knowledge).toMatch(/^[\w-]{1,120}$/);
      if (q.rule.kind !== 'choice') continue;
      const value = q.rule.value;
      expect(new Set(q.choices!.map((c) => c.id)).size).toBe(q.choices!.length);
      expect(q.choices!.some((c) => c.id === value)).toBe(true);
      for (const c of q.choices!)
        expect(evaluate(q.rule, c.id)).toBe(c.id === value);
      if (q.id.includes('-reading-'))
        expect(q.material).toContain(
          `共读教材印刷第${index === 0 ? 53 : 55}页`,
        );
    }
    for (const q of lesson.reviewQuestions!)
      expect(
        lesson.questions.some(
          (main) =>
            JSON.stringify([main.prompt, main.material, main.visual]) ===
            JSON.stringify([q.prompt, q.material, q.visual]),
        ),
      ).toBe(false);
    const words = lesson.steps.find((s) => s.title === '把目标字放回词语')!;
    const writing = lesson.questions.find((q) =>
      q.id.endsWith('-syllable-write'),
    )!;
    expect(words.text).toContain(`第${index === 0 ? 52 : 55}页`);
    expect(writing.prompt).toContain(`第${index === 0 ? 52 : 54}页`);
    const reading = lesson.steps.find((s) => s.title.startsWith('共读'))!;
    expect(reading.text).toContain('原页未见作者署名');
    expect(reading.text).toContain(
      index === 0 ? '北京师范大学出版社' : '中华书局',
    );
  }
});

it('distinguishes complete whole syllables, three-part medial values, n/ng spellings and real listening', () => {
  const front = formalUnitFourNasal['u4-4']!;
  for (const [key, correct, wrong] of [
    ['whole-yuan', 'üan', 'ün'],
    ['whole-final', 'ün', 'un'],
    ['triple-u', 'guān', 'gān'],
    ['triple-ue', 'juān', 'jüān'],
  ]) {
    const q = front.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
    expect(evaluate(q.rule, correct!)).toBe(true);
    expect(evaluate(q.rule, wrong!)).toBe(false);
  }
  const triple = front.reviewQuestions!.find((q) =>
    q.id.endsWith('-r-triple-ue'),
  )!;
  expect(triple.material).toBe('q + □ + ān → quān');
  expect(evaluate(triple.rule, 'ü')).toBe(true);
  expect(evaluate(triple.rule, 'u')).toBe(false);
  const back = formalUnitFourNasal['u4-5']!;
  const whole = back.questions.find((q) => q.id.endsWith('-q-whole-ying'))!;
  expect(evaluate(whole.rule, 'ying')).toBe(true);
  expect(evaluate(whole.rule, 'ing')).toBe(false);
  const pair = back.questions.find((q) => q.id.endsWith('-q-front-back'))!;
  expect(evaluate(pair.rule, 'ing')).toBe(true);
  expect(evaluate(pair.rule, 'in')).toBe(false);
  expect(back.steps.map((s) => s.text).join('\n')).toContain(
    '不能仅凭写对字母认定鼻音发准',
  );
  expect(
    back.questions.find((q) => q.id.endsWith('-focus-read'))!.rule,
  ).toEqual({ kind: 'manual' });
});

it('preserves wrong-first history and manual/reflection snapshots and offers changed source-based review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  for (const [itemId, key, answer] of [
    ['u4-4', 'reading-home', '小鸟'],
    ['u4-5', 'reading-bridge', '西边'],
  ]) {
    const lesson = formalUnitFourNasal[itemId!]!;
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 19,
      now,
    });
    session.phase = 'practice';
    for (const [index, q] of session.questions.entries()) {
      if (q.rule.kind === 'choice' && q.id.endsWith(`-q-${key}`)) {
        const value = q.rule.value;
        session.responses[index] = submitResponse(
          q,
          {
            ...session.responses[index]!,
            draft: q.choices!.find((c) => c.id !== value)!.id,
          },
          now,
        );
      }
      const draft = (() => {
        if (q.rule.kind === 'choice') return q.rule.value;
        return q.rule.kind === 'manual'
          ? 'confirmed'
          : '还想再听鼻音。\n这是计划。';
      })();
      session.responses[index] = submitResponse(
        q,
        { ...session.responses[index]!, draft },
        now,
      );
      if (q.rule.kind !== 'choice')
        expect(
          session.responses[index]!.submissions.at(-1)!.correct,
        ).toBeNull();
    }
    const review = newReviewQuestions(lesson, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.rule).toEqual({ kind: 'choice', value: answer });
    const main = session.questions.find(
      (q) => q.knowledge === review[0]!.knowledge,
    )!;
    if (main.rule.kind !== 'choice') throw new Error('expected objective');
    expect(evaluate(review[0]!.rule, main.rule.value)).toBe(false);
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  }
});
