import { expect, it } from 'vitest';

import en from '#/locales/langs/en-US/educationEthics.json';
import zh from '#/locales/langs/zh-CN/educationEthics.json';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { editionTarget } from './edition-targets';
import { createEthicsBooks } from './ethics';
import { findTextbook, textbooks } from './textbooks';

function translation(messages: unknown) {
  return (key: string): string => {
    let value: unknown = messages;
    for (const part of key.split('.').slice(1)) {
      if (typeof value !== 'object' || value === null)
        throw new Error(`Missing translation: ${key}`);
      value = Reflect.get(value, part);
    }
    if (typeof value !== 'string')
      throw new Error(`Missing translation: ${key}`);
    return value;
  };
}

it('resolves independent ethics routes and keeps 4 unread lessons unavailable', () => {
  const books = createEthicsBooks(translation(zh));
  expect(textbooks).toHaveLength(4);
  for (const book of books) {
    expect(editionTarget('ethics', 'pep-2024', book.volume)?.status).toBe(
      'available',
    );
    expect(findTextbook('ethics', 'pep-2024', book.volume)?.id).toBe(book.id);
    const lessons = book.units.flatMap((unit) => unit.lessons);
    expect(lessons).toHaveLength(16);
    expect(
      lessons.filter((lesson) => lesson.status === 'available'),
    ).toHaveLength(14);
    for (const lesson of lessons.filter(
      (item) => item.status === 'preparing',
    )) {
      expect(lesson.steps).toEqual([]);
      expect(lesson.questions).toEqual([]);
      expect(() => createSession(lesson, book.id, 'child')).toThrow(
        'educationLearning.noQuestions',
      );
    }
  }
  expect(editionTarget('ethics', 'sujiao', 'upper')).toBeUndefined();
  expect(findTextbook('ethics', 'sujiao', 'upper')).toBeUndefined();
});

it('authors both first lessons with five steps, distinct actual activities and ungraded reflection in both languages', () => {
  const chinese = createEthicsBooks(translation(zh));
  const english = createEthicsBooks(translation(en));
  for (const [index, book] of chinese.entries()) {
    const lesson = required(required(book.units[0]).lessons[0]);
    const englishLesson = required(
      required(required(english[index]).units[0]).lessons[0],
    );
    expect(englishLesson.id).toBe(lesson.id);
    expect(englishLesson.title).not.toBe(lesson.title);
    expect(lesson.steps).toHaveLength(5);
    expect(lesson.questions).toHaveLength(9);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(4);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    for (const localized of [lesson, englishLesson]) {
      for (const q of localized.questions) {
        expect(q.prompt).not.toContain('educationEthics.');
        if (q.rule.kind === 'choice') {
          expect(q.choices?.map((choice) => choice.id)).toContain(q.rule.value);
          expect(evaluate(q.rule, 'first')).toBe(true);
          expect(evaluate(q.rule, 'second')).toBe(false);
        } else {
          const answer =
            q.rule.kind === 'manual'
              ? 'confirmed'
              : 'A future plan, not a completed action.';
          expect(evaluate(q.rule, answer)).toBeNull();
        }
      }
      const now = '2026-10-02T00:00:00.000Z';
      const session = createSession(localized, book.id, 'child', {
        seed: 9,
        now,
      });
      session.phase = 'practice';
      for (const [questionIndex, q] of session.questions.entries()) {
        if (q.rule.kind !== 'choice') continue;
        session.responses[questionIndex] = submitResponse(
          q,
          {
            ...required(session.responses[questionIndex]),
            draft: 'second',
          },
          now,
        );
      }
      expect(newReviewQuestions(localized, session, [session])).toHaveLength(3);
      const restored = parseBackup(
        exportBackup(
          {
            schemaVersion: 1,
            activeProfileId: 'child',
            profiles: [{ id: 'child', nickname: 'Test', createdAt: now }],
            sessions: [session],
          },
          now,
        ),
      );
      expect(restored.data.sessions[0]).toEqual(session);
      for (const review of localized.reviewQuestions ?? []) {
        expect(evaluate(review.rule, 'first')).toBe(false);
        expect(evaluate(review.rule, 'second')).toBe(true);
      }
    }
  }
});

it.each([
  ['upper', 2, 4],
  ['lower', 2, 4],
  ['upper', 3, 4],
  ['lower', 3, 4],
  ['upper', 4, 4],
  ['lower', 4, 4],
  ['upper', 5, 4],
  ['lower', 5, 4],
  ['upper', 6, 6],
  ['lower', 6, 5],
  ['upper', 7, 8],
  ['lower', 7, 6],
  ['upper', 8, 6],
  ['lower', 8, 7],
  ['upper', 9, 6],
  ['lower', 9, 7],
  ['upper', 10, 7],
  ['lower', 10, 7],
  ['upper', 11, 6],
  ['lower', 11, 8],
  ['upper', 12, 7],
  ['lower', 12, 9],
  ['upper', 13, 8],
  ['lower', 13, 9],
  ['upper', 14, 8],
  ['lower', 14, 9],
] as const)(
  'preserves first-lesson snapshots alongside %s lesson %i and supplies changed review for every mistaken skill',
  (volume, number, manualCount) => {
    for (const messages of [zh, en]) {
      const book = required(
        createEthicsBooks(translation(messages)).find(
          (item) => item.volume === volume,
        ),
      );
      const unit = required(book.units[0]);
      const first = required(unit.lessons[0]);
      const second = required(book.units.flatMap((u) => u.lessons)[number - 1]);
      expect(first.id).toBe(`ethics-${volume}-lesson-1`);
      expect(first.version).toBe(1);
      expect(first.questions).toHaveLength(9);
      expect(second.id).toBe(`ethics-${volume}-lesson-${number}`);
      expect(second.version).toBe(1);
      expect(second.page).toBe(
        required(
          required(findTextbook('ethics', 'pep-2024', volume)).units.flatMap(
            (u) => u.items,
          )[number - 1],
        ).page,
      );
      expect(second.steps).toHaveLength(5);
      expect(second.questions).toHaveLength(6 + manualCount);
      expect(
        second.questions.filter((q) => q.rule.kind === 'choice'),
      ).toHaveLength(4);
      expect(
        second.questions.filter((q) => q.rule.kind === 'manual'),
      ).toHaveLength(manualCount);
      expect(
        second.questions.filter((q) => q.rule.kind === 'reflection'),
      ).toHaveLength(2);
      const now = '2026-10-02T00:00:00.000Z';
      const older = createSession(first, book.id, 'child', { now, seed: 9 });
      const session = createSession(second, book.id, 'child', {
        now,
        seed: 19,
      });
      session.phase = 'practice';
      for (const [i, q] of session.questions.entries()) {
        expect(q.prompt).not.toContain('educationEthics.');
        const response = required(session.responses[i]);
        if (q.rule.kind === 'manual') {
          response.skipped = true;
          continue;
        }
        if (q.rule.kind === 'choice') {
          expect(q.choices?.map((choice) => choice.id)).toEqual([
            'first',
            'second',
          ]);
          session.responses[i] = submitResponse(
            q,
            { ...response, draft: 'second' },
            now,
          );
          expect(
            required(session.responses[i]).submissions.at(-1)?.correct,
          ).toBe(false);
        }
        const draft =
          q.rule.kind === 'choice'
            ? 'first'
            : 'Test fixture: an actual attempt is not a future plan.';
        session.responses[i] = submitResponse(
          q,
          { ...required(session.responses[i]), draft },
          now,
        );
        expect(required(session.responses[i]).submissions.at(-1)?.correct).toBe(
          q.rule.kind === 'choice' ? true : null,
        );
      }
      const review = newReviewQuestions(second, session, [older, session]);
      expect(review).toHaveLength(4);
      expect(review.map((q) => q.knowledge).toSorted()).toEqual(
        second.questions
          .filter((q) => q.rule.kind === 'choice')
          .map((q) => q.knowledge)
          .toSorted(),
      );
      for (const q of review) {
        expect(evaluate(q.rule, 'first')).toBe(false);
        expect(evaluate(q.rule, 'second')).toBe(true);
      }
      const restored = parseBackup(
        exportBackup(
          {
            schemaVersion: 1,
            activeProfileId: 'child',
            profiles: [{ id: 'child', nickname: 'Test', createdAt: now }],
            sessions: [older, session],
          },
          now,
        ),
      );
      expect(restored.data.sessions).toEqual([older, session]);
      expect(
        restored.data.sessions[1]?.responses.filter((r) => r.skipped),
      ).toHaveLength(manualCount);
    }
  },
);

it('keeps textbook roles and anthem credits distinct and derives all original diagram differences by position', () => {
  const upper = required(
    required(createEthicsBooks(translation(zh))[0]).units[0],
  ).lessons[1];
  const flag = required(upper);
  expect(flag.steps[1]?.text).toContain('不要求一年级孩子都已入队');
  expect(flag.steps[3]?.text).toContain('不强迫激动或流泪');
  expect(flag.parentTip).toContain('真实仪式参与与在家模拟分别记');
  expect(zh.upper.lesson2.pairs[1]?.first).toBe('五颗');
  expect(zh.upper.lesson2.pairs[1]?.second).toBe('四颗');
  expect(zh.upper.lesson2.pairs[2]?.material).toContain('小安不是少先队员');
  expect(zh.upper.lesson2.pairs[3]?.first).toBe('田汉');
  expect(zh.upper.lesson2.pairs[3]?.second).toBe('聂耳');
  const material = required(zh.lower.lesson2.pairs[2]).material;
  const match = required(
    /A上行([○△□]{3})、下行([○△□]{3})；B上行([○△□]{3})、下行([○△□]{3})/.exec(
      material,
    ),
  );
  const a = [...required(match[1]), ...required(match[2])];
  const b = [...required(match[3]), ...required(match[4])];
  const differences = a.flatMap((value, i) => (value === b[i] ? [] : [i + 1]));
  expect(differences).toEqual([2, 4, 6]);
  expect(zh.lower.lesson2.pairs[2]?.first).toBe(a[1]);
  expect(zh.lower.lesson2.pairs[2]?.second).toBe(b[1]);
  expect(zh.lower.lesson2.steps[3]?.text).toContain(
    '这个位置答案只用于本站图，不用于原书图',
  );
  expect(zh.lower.lesson2.manual[3]).toContain('不冒原书已做');
});

it('separates campus information sources and permissions, apology from repair, and attempts from future plans', () => {
  const books = createEthicsBooks(translation(zh));
  const campus = required(required(required(books[0]).units[0]).lessons[2]);
  const correction = required(required(required(books[1]).units[0]).lessons[2]);
  expect(campus.page).toBe(10);
  expect(campus.steps[0]?.text).toContain('不表示每所学校都有同样设施');
  expect(campus.steps[2]?.text).toContain('不要求与别人一样');
  expect(zh.upper.lesson3.manual[1]).toContain('不能确认本校实地活动已完成');
  expect(zh.upper.lesson3.manual[3]).toContain('不冒学校工作人员真实回答');
  expect(zh.upper.lesson3.pairs[2]?.material).toContain('小宁只看了原书校园图');
  expect(zh.upper.lesson3.pairs[2]?.first).toBe('小竹');
  expect(zh.upper.lesson3.pairs[2]?.second).toBe('小宁');
  expect(correction.steps[1]?.text).toContain('不能要求对方马上原谅');
  expect(correction.steps[3]?.text).toContain('不是每个不会的地方都是故意犯错');
  expect(correction.parentTip).toContain('不用羞辱');
  expect(zh.lower.lesson3.pairs[0]?.material).toContain('还没开始补救');
  expect(zh.lower.lesson3.pairs[0]?.material).toContain('尚未说明自己做过什么');
  expect(zh.lower.lesson3.pairs[0]?.first).toBe('小禾');
  expect(zh.lower.lesson3.pairs[0]?.second).toBe('小林');
  expect(zh.lower.lesson3.pairs[1]?.explanation).toContain('一次尝试');
  expect(zh.lower.lesson3.manual[3]).toContain('不把一次成功');
  for (const book of books) {
    const third = required(required(book.units[0]).lessons[2]);
    for (const question of third.questions) {
      if (question.rule.kind === 'manual') {
        expect(evaluate(question.rule, 'confirmed')).toBeNull();
      } else if (question.rule.kind === 'reflection') {
        expect(evaluate(question.rule, 'A future plan only')).toBeNull();
      }
    }
    expect(required(required(book.units[3]).lessons[2]).status).toBe(
      'preparing',
    );
  }
});

it('keeps pedestrian and railway scenarios explicit and supports ungraded accessible participation', () => {
  const travel = zh.upper.lesson4;
  const energy = zh.lower.lesson4;
  expect(travel.steps[1]?.text).toContain('有人行道时在人行道内走');
  expect(travel.steps[2]?.text).toContain('不能只凭看到绿色就走');
  expect(travel.steps[3]?.text).toContain('不能钻、跨或绕栏杆');
  expect(travel.parentTip).toContain('不让孩子凭网页判断复杂现场');
  expect(travel.manual[2]).toContain('不前往真实铁路道口');
  expect(travel.pairs[1]?.material).toContain('尚未开始通过');
  expect(travel.pairs[1]?.first).toBe('小禾');
  expect(travel.pairs[1]?.second).toBe('小竹');
  expect(energy.parentTip).toContain(
    '不以外貌、体型、音量、残障、困倦或情绪判断品德',
  );
  expect(energy.steps[3]?.text).toContain('图卡或辅助工具');
  expect(energy.steps[4]?.text).toContain('不能完成一个就确认三个');
  expect(energy.manual.slice(1)).toHaveLength(3);
  expect(energy.pairs[0]?.first).toBe('小竹');
  expect(energy.pairs[0]?.second).toBe('小宁');
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[0]).lessons[3]);
      expect(lesson.page).toBe(14);
      expect(lesson.version).toBe(1);
      for (const q of lesson.questions) {
        if (q.rule.kind === 'manual' || q.rule.kind === 'reflection') {
          const answer = q.rule.kind === 'manual' ? 'confirmed' : 'Need help';
          expect(evaluate(q.rule, answer)).toBeNull();
        }
      }
    }
  }
});

it('covers explicit staff roles and all joining and friendly-method rehearsals without inventing consent or resolving real problems', () => {
  const teacher = zh.upper.lesson5;
  const together = zh.lower.lesson5;
  expect(teacher.pairs[0]?.first).toBe('周老师');
  expect(teacher.pairs[0]?.second).toBe('林老师');
  expect(teacher.steps[2]?.text).toContain('不拆修');
  expect(teacher.steps[2]?.text).toContain('不擅自离校');
  expect(teacher.manual[1]).toContain('三类求助');
  expect(teacher.manual[3]).toContain('三项');
  expect(teacher.parentTip).toContain('先问是否需要');
  expect(together.steps[1]?.text).toContain('也不是说礼貌话就已经参加');
  expect(together.steps[2]?.text).toContain('两人先同意规则再实际开始');
  expect(together.manual[1]).toContain('四种加入办法');
  expect(together.manual[2]).toContain('各轮流两回合、每回合一片');
  expect(together.manual[3]).toContain('三项');
  expect(together.pairs[0]?.first).toBe('小竹');
  expect(together.pairs[0]?.second).toBe('小宁');
  expect(together.parentTip).toContain('拒绝不等于孩子不好');
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[1]).lessons[0]);
      expect(lesson.id).toBe(`ethics-${book.volume}-lesson-5`);
      expect(lesson.page).toBe(
        required(
          required(findTextbook('ethics', 'pep-2024', book.volume)).units[1],
        ).items[0]?.page,
      );
      expect(lesson.version).toBe(1);
      expect(lesson.reviewQuestions).toHaveLength(4);
      for (const q of lesson.questions) {
        if (q.rule.kind === 'manual' || q.rule.kind === 'reflection') {
          expect(
            evaluate(
              q.rule,
              q.rule.kind === 'manual'
                ? 'confirmed'
                : 'Still waiting for a reply',
            ),
          ).toBeNull();
        }
      }
    }
  }
});

it('keeps the sixth lessons complete without turning consent, help or feelings into automatic grades', () => {
  for (const messages of [zh, en]) {
    const books = createEthicsBooks(translation(messages));
    for (const book of books) {
      const lesson = required(required(book.units[1]).lessons[1]);
      const localized = messages[book.volume].lesson6;
      expect(lesson.page).toBe(22);
      expect(lesson.steps.map((step) => step.text)).toEqual(
        localized.steps.map((step) => step.text),
      );
      const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
      expect(manual.map((q) => q.prompt)).toEqual(localized.manual);
      for (const task of manual) {
        expect(evaluate(task.rule, 'confirmed')).toBeNull();
      }
      for (const question of lesson.questions.filter(
        (q) => q.rule.kind === 'choice',
      )) {
        const changed = required(
          lesson.reviewQuestions?.find(
            (q) => q.knowledge === question.knowledge,
          ),
        );
        expect(changed.material).toBe(question.material);
        expect(changed.prompt).not.toBe(question.prompt);
        expect(evaluate(changed.rule, 'first')).toBe(false);
        expect(evaluate(changed.rule, 'second')).toBe(true);
      }
    }
  }
  const upper = zh.upper.lesson6;
  const lower = zh.lower.lesson6;
  expect(upper.manual).toHaveLength(6);
  expect(lower.manual).toHaveLength(5);
  expect(upper.steps[3]?.text).toContain('八幅');
  expect(upper.manual[5]).toContain('伤心');
  for (const scenario of [
    '丢物',
    '不会跳绳',
    '迷路',
    '物品上树',
    '浓烟',
    '远处巨响',
  ]) {
    expect(lower.steps[1]?.text).toContain(scenario);
  }
  expect(lower.parentTip).toContain('危险');
});

it('keeps seventh-lesson pages and actual activity forms distinct, with voluntary sharing boundaries', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[1]).lessons[2]);
      const copy = messages[book.volume].lesson7;
      expect(lesson.page).toBe(book.volume === 'upper' ? 25 : 26);
      expect(lesson.steps).toHaveLength(5);
      expect(lesson.steps.map((s) => s.activity)).toEqual(
        copy.steps.map((s) => s.activity),
      );
      expect(
        lesson.questions
          .filter((q) => q.rule.kind === 'manual')
          .map((q) => q.prompt),
      ).toEqual(copy.manual);
      expect(lesson.reviewQuestions).toHaveLength(4);
      for (const q of lesson.questions) {
        if (q.rule.kind === 'manual' || q.rule.kind === 'reflection')
          expect(evaluate(q.rule, 'confirmed')).toBeNull();
      }
    }
  }
  expect(zh.upper.lesson7.manual).toHaveLength(8);
  expect(zh.lower.lesson7.manual).toHaveLength(6);
  for (const form of ['读', '写', '手工', '音乐', '体育']) {
    expect(zh.upper.lesson7.manual.join(' ')).toContain(form);
  }
  for (const stage of ['共读', '讲述', '扮演']) {
    expect(zh.lower.lesson7.manual[0]).toContain(stage);
  }
  for (const boundary of ['纪念物', '条件', '补救']) {
    expect(zh.lower.lesson7.manual[4]).toContain(boundary);
  }
  expect(zh.lower.lesson7.parentTip).toContain('不强迫');
  expect(zh.lower.lesson7.parentTip).toContain('秘密');
});

it('distinguishes break stopping, service and interests from cooperative roles without automatic achievement', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[1]).lessons[3]);
      const copy = messages[book.volume].lesson8;
      expect(lesson.page).toBe(book.volume === 'upper' ? 29 : 30);
      expect(lesson.steps).toHaveLength(5);
      expect(lesson.steps.map((s) => s.text)).toEqual(
        copy.steps.map((s) => s.text),
      );
      expect(
        lesson.questions
          .filter((q) => q.rule.kind === 'manual')
          .map((q) => q.prompt),
      ).toEqual(copy.manual);
      expect(lesson.reviewQuestions).toHaveLength(4);
      for (const q of lesson.questions) {
        if (q.rule.kind !== 'choice')
          expect(evaluate(q.rule, 'confirmed')).toBeNull();
      }
    }
  }
  expect(zh.upper.lesson8.manual).toHaveLength(6);
  expect(zh.lower.lesson8.manual).toHaveLength(7);
  for (const phrase of ['暂停', '收卡', '下一项'])
    expect(zh.upper.lesson8.manual[3]).toContain(phrase);
  for (const phrase of ['服务', '兴趣'])
    expect(zh.upper.lesson8.manual[4]).toContain(phrase);
  expect(zh.lower.lesson8.manual[4]).toContain('完整四幅');
  expect(zh.lower.lesson8.manual[6]).toContain('全部六幅');
  for (const phrase of ['过河', '爬树', '背人', '试吃'])
    expect(zh.lower.lesson8.manual[6]).toContain(phrase);
  expect(zh.lower.lesson8.parentTip).toContain('不保证');
  expect(zh.lower.lesson8.parentTip).toContain('蒙眼');
});

it('keeps sleep observations honest and family stories voluntary with complete source sequences', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[2]).lessons[0]);
      const copy = messages[book.volume].lesson9;
      expect(lesson.page).toBe(34);
      expect(lesson.steps).toHaveLength(5);
      expect(lesson.steps.map((s) => s.activity)).toEqual(
        copy.steps.map((s) => s.activity),
      );
      expect(
        lesson.questions
          .filter((q) => q.rule.kind === 'manual')
          .map((q) => q.prompt),
      ).toEqual(copy.manual);
      expect(lesson.reviewQuestions).toHaveLength(4);
      for (const q of lesson.questions) {
        if (q.rule.kind !== 'choice')
          expect(evaluate(q.rule, 'confirmed')).toBeNull();
      }
    }
  }
  expect(zh.upper.lesson9.manual).toHaveLength(6);
  expect(zh.lower.lesson9.manual).toHaveLength(7);
  expect(zh.upper.lesson9.manual[1]).toContain('全部三个');
  expect(zh.upper.lesson9.manual[2]).toContain('全部六幅');
  expect(zh.upper.lesson9.manual[5]).toContain('真实次日');
  expect(zh.upper.lesson9.parentTip).toContain('不强迫独睡');
  expect(zh.lower.lesson9.manual[4]).toContain('全部八幅');
  expect(zh.lower.lesson9.manual[1]).toContain('十一张');
  for (const phrase of ['外貌', '地址', '照片', '秘密'])
    expect(zh.lower.lesson9.parentTip).toContain(phrase);
  expect(zh.lower.lesson9.steps[3]?.text).toContain('本站虚构小事');
});

it('keeps meal and family lesson-ten actions distinct, accessible, private and manually confirmed', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[2]).lessons[1]);
      const copy = messages[book.volume].lesson10;
      expect(lesson.title).toBe(copy.title);
      expect(lesson.steps.map((step) => step.text)).toEqual(
        copy.steps.map((step) => step.text),
      );
      const actual = lesson.questions.filter((q) => q.rule.kind === 'manual');
      expect(actual.map((q) => q.prompt)).toEqual(copy.manual);
      for (const q of actual) expect(evaluate(q.rule, 'confirmed')).toBeNull();
    }
  }
  expect(zh.upper.lesson10.manual[0]).toContain('全部七幅');
  expect(zh.upper.lesson10.manual[3]).toContain('全部四幅');
  expect(zh.upper.lesson10.manual[5]).toContain('全部四幅');
  expect(zh.upper.lesson10.parentTip).toContain('不强迫尝新或清空饭碗');
  expect(zh.upper.lesson10.parentTip).toContain('普遍禁水规则');
  expect(zh.lower.lesson10.manual[1]).toContain('两幅工作图和三幅关怀图');
  expect(zh.lower.lesson10.manual[2]).toContain('全部四幅');
  expect(zh.lower.lesson10.manual[4]).toContain('丙未知、丁不愿分享');
  expect(zh.lower.lesson10.parentTip).toContain('可拒绝不舒服的接触');
  expect(zh.lower.lesson10.parentTip).toContain('不收姓名住址照片秘密');
});

it('supports respectful expression and actual tidying without ranking abilities or inventing permission', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[2]).lessons[2]);
      const copy = messages[book.volume].lesson11;
      expect(lesson.title).toBe(copy.title);
      expect(lesson.steps.map((step) => step.activity)).toEqual(
        copy.steps.map((step) => step.activity),
      );
      expect(
        lesson.questions
          .filter((q) => q.rule.kind === 'manual')
          .map((q) => q.prompt),
      ).toEqual(copy.manual);
    }
  }
  expect(zh.upper.lesson11.manual[0]).toContain('全部四幅');
  expect(zh.upper.lesson11.manual[1]).toContain('全部四幅');
  expect(zh.upper.lesson11.manual[2]).toContain('请求不等于许可');
  expect(zh.upper.lesson11.manual[4]).toContain('三个已写花瓣');
  expect(zh.upper.lesson11.parentTip).toContain('不强迫微笑、鞠躬、眼神接触');
  expect(zh.lower.lesson11.manual[0]).toContain('全部两个谜语');
  expect(zh.lower.lesson11.manual[1]).toContain('全部两幅');
  expect(zh.lower.lesson11.manual[2]).toContain('六张用途卡');
  expect(zh.lower.lesson11.manual[3]).toContain('标签、放置、找回分别核对');
  expect(zh.lower.lesson11.manual[7]).toContain('时间未到待做');
  expect(zh.lower.lesson11.parentTip).toContain('不等于必须独立完成');
});

it('separates safe-play invention, actual clothing practice and future reminder dates', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[2]).lessons[3]);
      const copy = messages[book.volume].lesson12;
      expect(lesson.title).toBe(copy.title);
      expect(lesson.steps.map((step) => step.text)).toEqual(
        copy.steps.map((step) => step.text),
      );
      expect(
        lesson.questions
          .filter((q) => q.rule.kind === 'manual')
          .map((q) => q.prompt),
      ).toEqual(copy.manual);
    }
  }
  expect(zh.upper.lesson12.manual[2]).toContain('全部四幅');
  expect(zh.upper.lesson12.manual[2]).toContain('120、110、119');
  expect(zh.upper.lesson12.manual[5]).toContain('原创规则变化');
  expect(zh.upper.lesson12.parentTip).toContain('不冷敷或按摩试验');
  expect(zh.lower.lesson12.manual[0]).toContain('全部五个');
  expect(zh.lower.lesson12.manual[1]).toContain('全部三种');
  expect(zh.lower.lesson12.manual[2]).toContain('共六图');
  expect(zh.lower.lesson12.manual[3]).toContain('实际叠一件');
  expect(zh.lower.lesson12.manual[4]).toContain('实际叠一条');
  expect(zh.lower.lesson12.manual[7]).toContain('七格');
  expect(zh.lower.lesson12.manual[8]).toContain('不补造七天');
});

it('keeps situation-based sound and voluntary festival participation distinct from automatic completion', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[3]).lessons[0]);
      const copy = messages[book.volume].lesson13;
      expect(lesson.title).toBe(copy.title);
      expect(lesson.page).toBe(book.volume === 'upper' ? 48 : 50);
      expect(lesson.steps.map((step) => step.activity)).toEqual(
        copy.steps.map((step) => step.activity),
      );
      const actual = lesson.questions.filter((q) => q.rule.kind === 'manual');
      expect(actual.map((q) => q.prompt)).toEqual(copy.manual);
      const session = createSession(lesson, book.id, 'child');
      for (const [i, q] of session.questions.entries()) {
        if (q.rule.kind !== 'choice') continue;
        session.responses[i] = submitResponse(
          q,
          { ...required(session.responses[i]), draft: 'first' },
          session.startedAt,
        );
      }
      for (const [i, q] of session.questions.entries()) {
        if (q.rule.kind !== 'manual') continue;
        expect(required(session.responses[i]).submissions).toEqual([]);
        expect(evaluate(q.rule, 'confirmed')).toBeNull();
      }
    }
  }
  expect(zh.upper.lesson13.manual[0]).toContain('全部四幅');
  expect(zh.upper.lesson13.manual[6]).toContain('全部四幅');
  expect(zh.upper.lesson13.manual[5]).toContain('同意后才');
  expect(zh.upper.lesson13.parentTip).toContain('不强迫耳语');
  expect(zh.upper.lesson13.parentTip).toContain('紧急求助');
  expect(zh.lower.lesson13.manual[0]).toContain('六类');
  expect(zh.lower.lesson13.manual[1]).toContain('材料缺少留待做');
  expect(zh.lower.lesson13.manual[5]).toContain('四例');
  expect(zh.lower.lesson13.manual[7]).toContain('三幅');
  expect(zh.lower.lesson13.manual[6]).toContain('不记成真实捐赠');
  expect(zh.lower.lesson13.manual[8]).toContain('不以表演、成绩、捐赠换权利');
});

it('preserves unknown observations and formal-status boundaries in lesson fourteen', () => {
  for (const messages of [zh, en]) {
    for (const book of createEthicsBooks(translation(messages))) {
      const lesson = required(required(book.units[3]).lessons[1]);
      const copy = messages[book.volume].lesson14;
      expect(lesson.title).toBe(copy.title);
      expect(lesson.page).toBe(book.volume === 'upper' ? 52 : 54);
      expect(lesson.steps.map((step) => step.text)).toEqual(
        copy.steps.map((step) => step.text),
      );
      expect(
        lesson.questions
          .filter((q) => q.rule.kind === 'manual')
          .map((q) => q.prompt),
      ).toEqual(copy.manual);
      expect(lesson.reviewQuestions).toHaveLength(4);
    }
  }
  expect(zh.upper.lesson14.manual[0]).toContain('全部四幅');
  expect(zh.upper.lesson14.manual[1]).toContain('第三空白行');
  expect(zh.upper.lesson14.manual[2]).toContain('原因已知/未知');
  expect(zh.upper.lesson14.manual[3]).toContain('两张课桌');
  expect(zh.upper.lesson14.manual[4]).toContain('四方法');
  expect(zh.upper.lesson14.parentTip).toContain('不追查同学责任');
  expect(zh.lower.lesson14.manual[0]).toContain('全部三例');
  expect(zh.lower.lesson14.manual[1]).toContain('全部三资料');
  for (const i of [4, 5]) expect(zh.lower.lesson14.manual[i]).toContain('待做');
  expect(zh.lower.lesson14.manual[3]).toContain('2025队章');
  expect(zh.lower.lesson14.manual[8]).toContain('不替学校批准');
  expect(zh.lower.lesson14.parentTip).toContain('不从服饰、年龄或网页完成推断');
});
