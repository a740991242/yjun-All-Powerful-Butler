import { expect, it } from 'vitest';

import { characterScopes } from './characters';
import { chineseBooks } from './chinese';
import {
  chineseAuditSource,
  chinesePageAudits,
  chineseSourceAccessObservations,
} from './chinese-source-audit';
import { textbooks } from './textbooks';

it('records inspected garden pages without claiming complete garden coverage', () => {
  expect(
    chinesePageAudits.filter((audit) => audit.volume === 'upper'),
  ).toHaveLength(8);
  expect(
    chinesePageAudits.filter((audit) => audit.volume === 'lower'),
  ).toHaveLength(2);
  for (const audit of chinesePageAudits) {
    const book = textbooks.find(
      (book) => book.subject === 'chinese' && book.volume === audit.volume,
    )!;
    const item = book.units
      .flatMap((unit) => unit.items)
      .find((item) => item.id === audit.itemId);
    expect(item?.kind).toBe('garden');
    expect(item?.page).toBe(audit.page);
    expect(audit.coverage).toBe('partial');
    expect(characterScopes(audit.volume)[audit.itemId]?.write).toBe(
      audit.writing,
    );
    expect(chineseAuditSource(audit.volume)).toBe(book.source);
  }
  expect(characterScopes('lower')['u1-5']).toMatchObject({
    write: '文卡片合',
    writeVerified: true,
  });
  expect(characterScopes('lower')['u2-4']).toMatchObject({
    write: '写认',
    writeVerified: true,
  });
  expect(characterScopes('lower')['u1-1']).toMatchObject({
    write: '春冬吹花飞入',
    writeVerified: true,
  });
  expect(characterScopes('lower')['u2-1']).toMatchObject({
    write: '共产党太阳光',
    writeVerified: true,
  });
  expect(characterScopes('lower')['u2-3']).toMatchObject({
    write: '告会京的北广',
    writeVerified: true,
  });
});

it('keeps denied and old-edition candidates separate from observed textbook pages', () => {
  expect(chineseSourceAccessObservations).toHaveLength(4);
  expect(chineseSourceAccessObservations.map((x) => x.outcome)).toEqual([
    'login-required',
    'login-required',
    'wrong-edition',
    'fetch-denied',
  ]);
  for (const attempt of chineseSourceAccessObservations) {
    expect(attempt.teachingScopeVerified).toBe(false);
    expect(attempt.checkedAt).toBe('2026-10-01');
    expect(
      chinesePageAudits.some(
        (page) =>
          page.volume === attempt.volume && page.itemId === attempt.itemId,
      ),
    ).toBe(false);
    expect(['basic.jl.smartedu.cn', 'www.pep.com.cn']).toContain(
      new URL(attempt.url).hostname,
    );
  }
});
it('releases a formal course independently after actual body pages are inspected', () => {
  const lesson = chineseBooks
    .find((book) => book.volume === 'upper')!
    .units.flatMap((unit) => unit.lessons)
    .find((lesson) => lesson.id === 'cu-u1-2')!;
  expect(lesson.status).toBe('available');
  expect(lesson.review.notes).toContain('https://keben.app/book/0025');
  expect(lesson.review.notes).toContain('未知');
  expect(
    chineseSourceAccessObservations.every(
      (attempt) => !attempt.teachingScopeVerified,
    ),
  ).toBe(true);
});
