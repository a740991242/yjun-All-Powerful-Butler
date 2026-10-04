import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { pinyinTone } from '../learning/pinyin-tone';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import { formalYwLesson } from './chinese-unit-three';
import { ywLesson } from './chinese-yw';

describe('separate y w and whole-syllable activities', () => {
  it('retains the actual revised item and distinguishes letters, whole syllables and underlying ü', () => {
    const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
    expect(lessons).toContain(ywLesson);
    expect(lessons.find((lesson) => lesson.id === 'cu-u3-5')?.status).toBe(
      'available',
    );
    expect(ywLesson.page).toBe(40);
    expect(ywLesson.steps).toHaveLength(5);
    const answers = ywLesson.questions
      .filter((question) => question.rule.kind === 'choice')
      .map((question) =>
        question.rule.kind === 'choice' ? question.rule.value : '',
      );
    expect(answers).toEqual([
      'y',
      'w',
      'yi',
      'wu',
      'yu',
      'yí',
      'wǔ',
      'yù',
      'yu',
      'ü',
      'yā',
      'wō',
    ]);
    expect(ywLesson.steps[1]!.text).toContain('不套用声母与韵母分别读再相拼');
    expect(ywLesson.steps[2]!.text).toContain('这里对应的是ü，不是u');
    for (const question of [
      ...ywLesson.questions,
      ...ywLesson.reviewQuestions!,
    ]) {
      if (question.rule.kind !== 'choice') continue;
      const expected = question.rule.value;
      expect(
        question.choices!.filter((choice) => choice.id === expected),
      ).toHaveLength(1);
      for (const choice of question.choices!)
        expect(evaluate(question.rule, choice.id)).toBe(choice.id === expected);
    }
  });
  it('renders all twelve whole-syllable tones consistently while retaining canonical marks', () => {
    for (const row of [
      ['yī', 'yí', 'yǐ', 'yì'],
      ['wū', 'wú', 'wǔ', 'wù'],
      ['yū', 'yú', 'yǔ', 'yù'],
    ])
      row.forEach((syllable, index) => {
        expect(pinyinTone(syllable)?.number).toBe(index + 1);
        expect(pinyinTone(syllable.normalize('NFD'))).toEqual(
          pinyinTone(syllable),
        );
      });
    expect(pinyinTone('yu')).toBeNull();
  });
  it('keeps first evidence and two manual activities separate through backup and same-skill new review', () => {
    const now = '2026-09-30T00:00:00.000Z';
    const session = createSession(ywLesson, chineseBooks[0]!.id, 'child', {
      seed: 42,
      now,
    });
    for (const [index, question] of session.questions.entries()) {
      if (question.rule.kind === 'choice') {
        const expected = question.rule.value;
        session.responses[index] = submitResponse(
          question,
          {
            ...session.responses[index]!,
            draft: question.choices!.find((choice) => choice.id !== expected)!
              .id,
          },
          now,
        );
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: expected },
          now,
        );
      } else
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: 'confirmed' },
          now,
        );
    }
    expect(statistics(session).manual).toBe(2);
    expect(statistics(session).firstCorrect).toBe(0);
    expect(newReviewQuestions(ywLesson, session, [session])).toHaveLength(12);
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '整体音节', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  });
});

describe('y w review applies recognition to changed syllable cards', () => {
  it('uses toned materials in both formal and supplemental lessons, without splitting whole syllables', () => {
    for (const lesson of [ywLesson, formalYwLesson]) {
      expect(lesson.version).toBe(lesson.id === ywLesson.id ? 2 : 3);
      const cards = [
        ['r1', 'yà', 'y'],
        ['r2', 'wǒ', 'w'],
        ['r3', 'yǐ', 'yi'],
        ['r4', 'wù', 'wu'],
        ['r5', 'yú', 'yu'],
      ];
      for (const [suffix, material, expected] of cards) {
        const question = lesson.reviewQuestions!.find(
          (q) => q.id === `${lesson.id}-${suffix}`,
        )!;
        expect(question.material).toBe(material);
        expect(question.rule).toEqual({ kind: 'choice', value: expected });
        expect(question.explanation).toContain(material);
        expect(pinyinTone(question.material!)?.number).toBeTruthy();
        for (const choice of question.choices!)
          expect(evaluate(question.rule, choice.id)).toBe(
            choice.id === expected,
          );
        if (suffix === 'r3' || suffix === 'r4' || suffix === 'r5') {
          expect(
            question
              .material!.normalize('NFD')
              .replaceAll(/[\u0300\u0301\u0304\u030C]/g, ''),
          ).toBe(expected);
          expect(question.explanation).toContain('不拆成两个部分拼读');
        }
      }
      expect(
        lesson.questions.find((q) => q.id === `${lesson.id}-q3`)!.rule,
      ).toEqual({ kind: 'choice', value: 'yi' });
    }
  });
  it('preserves saved version-one review cards and does not offer consumed IDs again', () => {
    const now = '2026-10-04T00:00:00.000Z';
    for (const lesson of [ywLesson, formalYwLesson]) {
      const old = structuredClone(lesson);
      old.version = 1;
      old.questions = [
        structuredClone(
          lesson.reviewQuestions!.find((q) => q.id === `${lesson.id}-r3`)!,
        ),
      ];
      old.questions[0]!.prompt = '找出与所示音节相同的整体写法。';
      old.questions[0]!.material = 'yi';
      old.questions[0]!.explanation =
        '这里选择yi。实际认读参考标准示范，字形选择不代替发音评价。';
      const saved = createSession(old, chineseBooks[0]!.id, 'child', {
        seed: 3,
        now,
      });
      const q = saved.questions[0]!;
      saved.responses[0] = submitResponse(
        q,
        { ...saved.responses[0]!, draft: 'wu' },
        now,
      );
      saved.responses[0] = submitResponse(
        q,
        { ...saved.responses[0]!, draft: 'yi' },
        now,
      );
      const restored = parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '验收', createdAt: now }],
          sessions: [saved],
        }),
      ).data.sessions[0]!;
      expect(restored).toEqual(saved);
      expect(restored.lessonVersion).toBe(1);
      expect(restored.questions[0]!.material).toBe('yi');
      expect(restored.responses[0]!.submissions.map((s) => s.correct)).toEqual([
        false,
        true,
      ]);
      expect(
        lesson.reviewQuestions!.find((q) => q.id === saved.questions[0]!.id)!
          .material,
      ).toBe('yǐ');
      expect(newReviewQuestions(lesson, restored, [restored])).toEqual([]);
    }
  });
});
