import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  formalUnitThreeInitials,
  formalYwLesson,
  unitThreePageAudits,
} from './chinese-unit-three';
import { ywLesson } from './chinese-yw';

it('keeps inspected body scopes and formal y w separate from unchanged supplements', () => {
  const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
  expect(lessons).toContain(formalYwLesson);
  expect(lessons).toContain(ywLesson);
  expect(formalYwLesson.id).toBe('cu-u3-5');
  expect(ywLesson.id).toBe('cu-u3-5-yw-whole');
  expect(ywLesson.questions).toHaveLength(14);
  expect(ywLesson.review.notes).toContain('尚待2024正文逐页核验');
  for (const audit of unitThreePageAudits) {
    expect(audit.recognize).toBe(upperCharacters[audit.itemId]!.recognize);
    expect(audit.write).toBe(upperCharacters[audit.itemId]!.write);
    expect(audit.provider).toContain('第三方');
    expect(audit.isbn).toBeNull();
    expect(audit.editionDate).toBeNull();
    expect(audit.printingDate).toBeNull();
    if (audit.itemId !== 'u3-5')
      expect(
        lessons.find((lesson) => lesson.id === `cu-${audit.itemId}`)!.status,
      ).toBe('available');
  }
  expect(unitThreePageAudits.map((a) => a.pages)).toEqual([
    [32, 33],
    [34, 35],
    [36, 37],
    [38, 39],
    [40, 41],
  ]);
  expect(formalYwLesson.steps).toHaveLength(8);
  expect(
    formalYwLesson.questions.filter((q) => q.rule.kind === 'choice'),
  ).toHaveLength(18);
  expect(
    formalYwLesson.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(4);
  expect(
    formalYwLesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(1);
  expect(formalYwLesson.steps[6]!.text).toContain('不因为读词而把蚂、蚁加进');
});
it('checks answers and retains wrong-first history, external reading, reflection and backup snapshot', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(formalYwLesson, chineseBooks[0]!.id, 'child', {
    seed: 9,
    now,
  });
  s.phase = 'practice';
  for (const [index, q] of s.questions.entries()) {
    if (q.rule.kind === 'choice') {
      const value = q.rule.value;
      expect(q.choices!.filter((c) => c.id === value)).toHaveLength(1);
      for (const c of q.choices!)
        expect(evaluate(q.rule, c.id)).toBe(c.id === value);
      if (q.id.endsWith('-q-poem-best')) {
        expect(q.material).toContain('共读教材印刷第41页');
        s.responses[index] = submitResponse(
          q,
          {
            ...s.responses[index]!,
            draft: q.choices!.find((c) => c.id !== value)!.id,
          },
          now,
        );
      }
    }
    const draft = (() => {
      if (q.rule.kind === 'choice') return q.rule.value;
      return q.rule.kind === 'manual' ? 'confirmed' : '还想练yǔ。\n明天再读。';
    })();
    s.responses[index] = submitResponse(
      q,
      { ...s.responses[index]!, draft },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[index]!.submissions.at(-1)!.correct).toBeNull();
  }
  const r = newReviewQuestions(formalYwLesson, s, [s]);
  expect(r).toHaveLength(1);
  expect(r[0]!.rule).toEqual({ kind: 'choice', value: '小学堂' });
  expect(evaluate(r[0]!.rule, '白白的')).toBe(false);
  expect(
    s.responses.filter((response) => response.submissions.length === 2),
  ).toHaveLength(1);
  for (const q of formalYwLesson.reviewQuestions!) {
    if (q.rule.kind !== 'choice') throw new Error('objective expected');
    const value = q.rule.value;
    expect(q.choices!.some((c) => c.id === value)).toBe(true);
    expect(
      formalYwLesson.questions.some(
        (main) =>
          JSON.stringify([main.prompt, main.material, main.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
  }
  expect(
    parseBackup(
      exportBackup({
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
        sessions: [s],
      }),
    ).data.sessions[0],
  ).toEqual(s);
});

it('covers four actual initial bodies including three-part spellings, whole syllables, reading and independent physical tasks', () => {
  const counts = [15, 17, 18, 22];
  for (const [index, lesson] of Object.values(
    formalUnitThreeInitials,
  ).entries()) {
    const audit = unitThreePageAudits[index]!;
    expect(lesson.id).toBe(`cu-${audit.itemId}`);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'choice'),
    ).toHaveLength(counts[index]!);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(6);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(1);
    expect(lesson.reviewQuestions).toHaveLength(counts[index]!);
    expect(
      lesson.questions
        .filter((q) => q.id.includes('-q-character-'))
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : null))
        .join(''),
    ).toBe(audit.recognize);
    expect(
      lesson.questions.find((q) => q.id.endsWith('-manual-words'))!.material,
    ).toBe(`会认${audit.recognize}；无新增会写汉字。`);
    for (const q of lesson.questions.filter((q) =>
      q.id.includes('-q-reading-'),
    ))
      expect(q.material).toContain(`共读教材印刷第${audit.pages[1]}页`);
    const now = '2026-10-01T00:00:00.000Z';
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 13,
      now,
    });
    session.phase = 'practice';
    for (const [i, q] of session.questions.entries()) {
      if (q.rule.kind === 'choice') {
        const value = q.rule.value;
        expect(q.choices!.filter((c) => c.id === value)).toHaveLength(1);
        for (const c of q.choices!)
          expect(evaluate(q.rule, c.id)).toBe(c.id === value);
        if (q.id.endsWith('-q-triple-0'))
          session.responses[i] = submitResponse(
            q,
            {
              ...session.responses[i]!,
              draft: q.choices!.find((c) => c.id !== value)!.id,
            },
            now,
          );
      }
      session.responses[i] = submitResponse(
        q,
        {
          ...session.responses[i]!,
          draft: (() => {
            if (q.rule.kind === 'choice') return q.rule.value;
            return q.rule.kind === 'manual'
              ? 'confirmed'
              : '还想练三拼。\n明天跟读。';
          })(),
        },
        now,
      );
      if (q.rule.kind !== 'choice')
        expect(session.responses[i]!.submissions.at(-1)!.correct).toBeNull();
    }
    const review = newReviewQuestions(lesson, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.id).toBe(`${lesson.id}-r-triple-0`);
    expect(review[0]!.rule).toEqual({
      kind: 'choice',
      value: lesson.id === 'cu-u3-2' ? 'i' : 'u',
    });
    for (const q of lesson.reviewQuestions!) {
      if (q.rule.kind !== 'choice') throw new Error('objective expected');
      const value = q.rule.value;
      expect(q.choices!.filter((c) => c.id === value)).toHaveLength(1);
      expect(
        lesson.questions.some(
          (main) =>
            JSON.stringify([main.prompt, main.material, main.visual]) ===
            JSON.stringify([q.prompt, q.material, q.visual]),
        ),
      ).toBe(false);
    }
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
  expect(
    formalUnitThreeInitials['u3-1']!.questions.find((q) =>
      q.id.endsWith('-q-triple-0'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: 'guā' });
  expect(
    formalUnitThreeInitials['u3-2']!.questions.find((q) =>
      q.id.endsWith('-q-umlaut-1'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: 'jū' });
  expect(
    formalUnitThreeInitials['u3-3']!.questions.filter((q) =>
      q.id.includes('-q-whole-'),
    ).map((q) => (q.rule.kind === 'choice' ? q.rule.value : null)),
  ).toEqual(['zi', 'ci', 'si']);
  expect(
    formalUnitThreeInitials['u3-4']!.questions.filter((q) =>
      q.id.includes('-q-whole-'),
    ).map((q) => (q.rule.kind === 'choice' ? q.rule.value : null)),
  ).toEqual(['zhi', 'chi', 'shi', 'ri']);
});

const oldRecognitionReviews = [
  {
    id: 'cu-u3-1-r-character-0',
    prompt: '选择材料中指定的字。',
    material: '哥哥来了，找称呼中的第一个字。',
  },
  {
    id: 'cu-u3-1-r-character-1',
    prompt: '选择材料中指定的字。',
    material: '弟弟拿来一本书，找这个称呼里的字。',
  },
  {
    id: 'cu-u3-1-r-character-2',
    prompt: '选择材料中指定的字。',
    material: '画一朵花，找表示画的字。',
  },
  {
    id: 'cu-u3-1-r-character-3',
    prompt: '选择材料中指定的字。',
    material: '花开了，找表示花的字。',
  },
  {
    id: 'cu-u3-2-r-character-0',
    prompt: '选择材料中指定的字。',
    material: '打球中的第一个字。',
  },
  {
    id: 'cu-u3-2-r-character-1',
    prompt: '选择材料中指定的字。',
    material: '棋盘中的第一个字。',
  },
  {
    id: 'cu-u3-2-r-character-2',
    prompt: '选择材料中指定的字。',
    material: '积木叠起来，找物品名的第一个字。',
  },
  {
    id: 'cu-u3-2-r-character-3',
    prompt: '选择材料中指定的字。',
    material: '木头中的第一个字。',
  },
  {
    id: 'cu-u3-3-r-character-0',
    prompt: '选择材料中指定的字。',
    material: '写字中的第二个字。',
  },
  {
    id: 'cu-u3-3-r-character-1',
    prompt: '选择材料中指定的字。',
    material: '认一个词，找表示词的字。',
  },
  {
    id: 'cu-u3-3-r-character-2',
    prompt: '选择材料中指定的字。',
    material: '一句话中的第二个字。',
  },
  {
    id: 'cu-u3-3-r-character-3',
    prompt: '选择材料中指定的字。',
    material: '桌子中的第二个字。',
  },
  {
    id: 'cu-u3-4-r-character-0',
    prompt: '选择材料中指定的字。',
    material: '桌面中的第一个字。',
  },
  {
    id: 'cu-u3-4-r-character-1',
    prompt: '选择材料中指定的字。',
    material: '白纸中的第二个字。',
  },
  {
    id: 'cu-u3-4-r-character-2',
    prompt: '选择材料中指定的字。',
    material: '读一句话中的第一个字。',
  },
  {
    id: 'cu-u3-4-r-character-3',
    prompt: '选择材料中指定的字。',
    material: '书包中的第一个字。',
  },
  {
    id: 'cu-u3-5-r-character-0',
    prompt: '选择材料中指定的字。',
    material: '鱼的尾巴摆动。',
  },
  {
    id: 'cu-u3-5-r-character-1',
    prompt: '选择材料中指定的字。',
    material: '鸭子在岸边走。',
  },
  {
    id: 'cu-u3-5-r-character-2',
    prompt: '选择材料中指定的字。',
    material: '乌黑中的第一个字。',
  },
  {
    id: 'cu-u3-5-r-character-3',
    prompt: '选择材料中指定的字。',
    material: '乌鸦停在树枝上，找这个鸟名的第二个字。',
  },
];
it('locates all twenty recognition targets by word position without adding writing requirements', () => {
  const cases = [
    [
      formalUnitThreeInitials['u3-1']!,
      ['大哥', '小弟', '图画', '花朵'],
      [1, 1, 1, 0],
      ['哥', '弟', '画', '花'],
    ],
    [
      formalUnitThreeInitials['u3-2']!,
      ['拍打', '棋子', '积累', '木头'],
      [1, 0, 0, 0],
      ['打', '棋', '积', '木'],
    ],
    [
      formalUnitThreeInitials['u3-3']!,
      ['写字', '诗词', '语句', '孩子'],
      [1, 1, 1, 1],
      ['字', '词', '句', '子'],
    ],
    [
      formalUnitThreeInitials['u3-4']!,
      ['书桌', '纸张', '朗读', '书包'],
      [1, 0, 1, 0],
      ['桌', '纸', '读', '书'],
    ],
    [
      formalYwLesson,
      ['金鱼', '鸭子', '乌云', '寒鸦'],
      [1, 0, 0, 1],
      ['鱼', '鸭', '乌', '鸦'],
    ],
  ] as const;
  for (const [lesson, words, positions, targets] of cases) {
    expect(lesson.version).toBe(lesson.id === 'cu-u3-5' ? 3 : 2);
    expect(lesson.parentTip).toContain('无新增会写汉字');
    targets.forEach((target, i) => {
      const q = lesson.reviewQuestions!.find(
        (q) => q.id === `${lesson.id}-r-character-${i}`,
      )!;
      expect(q.material).toBe(words[i]);
      const main = lesson.questions.find(
        (q) => q.id === `${lesson.id}-q-character-${i}`,
      )!;
      expect(main.material).not.toContain(words[i]);
      expect([...q.material!][positions[i]!]).toBe(target);
      expect(q.prompt).toContain(`第${positions[i]! + 1}个字`);
      expect(q.prompt).toBe(`看词语，选出左起第${positions[i]! + 1}个字。`);
      for (const c of q.choices!)
        expect(evaluate(q.rule, c.id)).toBe(c.id === target);
    });
  }
  expect(ywLesson.version).toBe(2);
});
it('keeps the exact former recognition materials, versions and wrong-first history in backup snapshots', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const lessons = [...Object.values(formalUnitThreeInitials), formalYwLesson];
  const sessions = lessons.map((lesson) => {
    const old = structuredClone(lesson);
    old.version = lesson.id === 'cu-u3-5' ? 2 : 1;
    old.questions = old
      .reviewQuestions!.filter((q) => q.id.includes('-r-character-'))
      .map((q) => {
        const former = oldRecognitionReviews.find((x) => x.id === q.id)!;
        return { ...q, prompt: former.prompt, material: former.material };
      });
    const session = createSession(old, chineseBooks[0]!.id, 'child', {
      now,
      seed: 41,
    });
    for (const [i, q] of session.questions.entries()) {
      if (q.rule.kind !== 'choice') throw new Error('expected choice');
      const answer = q.rule.value;
      session.responses[i] = submitResponse(
        q,
        {
          ...session.responses[i]!,
          draft: q.choices!.find((c) => c.id !== answer)!.id,
        },
        now,
      );
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft: answer },
        now,
      );
    }
    expect(newReviewQuestions(lesson, session, [session])).toEqual([]);
    return session;
  });
  const restored = parseBackup(
    exportBackup({
      schemaVersion: 1,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '验收', createdAt: now }],
      sessions,
    }),
  ).data.sessions;
  expect(restored).toEqual(sessions);
  expect(restored.map((s) => s.lessonVersion)).toEqual([1, 1, 1, 1, 2]);
  for (const session of restored)
    for (const r of session.responses)
      expect(r.submissions.map((x) => x.correct)).toEqual([false, true]);
});
