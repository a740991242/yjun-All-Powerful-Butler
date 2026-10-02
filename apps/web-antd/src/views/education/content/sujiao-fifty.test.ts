import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFiftyDraft as lesson } from './sujiao-fifty';
it('compares distance from fifty, retaining ties rather than choosing the larger result', () => {
  const main = (key: string) =>
    lesson.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
  expect(evaluate(main('closest').rule, 'b')).toBe(true);
  expect(
    evaluate(
      lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-closest'))!.rule,
      'a',
    ),
  ).toBe(true);
  expect(evaluate(main('tie').rule, ['a', 'b'])).toBe(true);
  expect(evaluate(main('tie').rule, ['b'])).toBe(false);
  expect(evaluate(main('short').rule, 4)).toBe(true);
  expect(evaluate(main('extra').rule, 3)).toBe(true);
  expect(evaluate(main('tens').rule, 5)).toBe(true);
  for (const key of ['hand', 'stack', 'water', 'space', 'unit'])
    expect(main(key).choices).toHaveLength(2);
  expect(lesson.questions).toHaveLength(22);
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    9,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(3);
  for (const q of lesson.reviewQuestions!)
    expect(q.prompt).not.toBe(
      lesson.questions.find((o) => o.knowledge === q.knowledge)!.prompt,
    );
});
it('keeps incorrect ties and three independent reflection records without fabricating actual experiments', () => {
  const library = initialLibrary('50实践');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-tie'));
  for (const draft of [['b'], ['a', 'b']]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  for (const [index, q] of s.questions.entries())
    if (q.rule.kind === 'reflection') {
      s.responses[index]!.draft =
        `${q.knowledge}：真实活动还待做，先记录观察问题。`;
      s.responses[index] = submitResponse(q, s.responses[index]!);
      expect(s.responses[index]!.submissions[0]!.correct).toBeNull();
    }
  expect(
    s.responses
      .filter((_, index) => s.questions[index]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(s);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
});

it('separates real teacher-organized spacing from paper plans and retains prior-version snapshots', () => {
  expect(lesson.version).toBe(2);
  const site = lesson.questions.find((q) => q.knowledge.endsWith('-manual-7'))!;
  expect(site.rule.kind).toBe('manual');
  expect(site.prompt).toContain('实际参与人数');
  expect(site.prompt).toContain('大约能站多少人');
  expect(site.prompt).toContain('无组织条件保留待做');
  const life = lesson.questions.find((q) => q.knowledge.endsWith('-manual-8'))!;
  expect(life.rule.kind).toBe('manual');
  expect(life.prompt).toContain('50页当50张纸');
  const library = initialLibrary('旧记录');
  const old = {
    ...lesson,
    version: 1,
    questions: lesson.questions.filter(
      (q) =>
        !['sj-lower-fifty-manual-7', 'sj-lower-fifty-manual-8'].includes(q.id),
    ),
  };
  const before = createSession(
    old,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const next = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(before, next);
  const restored = parseBackup(exportBackup(library)).data.sessions;
  expect(restored[0]).toEqual(before);
  expect(restored[0]!.questions).toHaveLength(20);
  expect(restored[1]).toEqual(next);
  expect(restored[1]!.questions).toHaveLength(22);
});
