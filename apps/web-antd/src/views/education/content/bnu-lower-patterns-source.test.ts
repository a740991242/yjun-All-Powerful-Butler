import { expect, it } from 'vitest';

import { bnuLowerBook } from './bnu-lower';
import { bnuLowerPatternsSource as source } from './bnu-lower-patterns-source';
import { bnuLowerUnitSixAudit as audit } from './bnu-lower-unit-six-audit';

it('preserves all four printed-page locations and the given windmill materials without guessing kaleidoscope counts', () => {
  expect(source.readPrintedPages).toEqual([83]);
  expect(source.pageImages).toEqual([{ printedPage: 83, suffix: '087.jpg' }]);
  expect(source.patterns.map((p) => [p.title, p.location])).toEqual([
    ['风车', '上排左'],
    ['小兔', '上排右'],
    ['鱼', '下排左'],
    ['万花筒', '下排右'],
  ]);
  expect(source.appreciate.windmillDialogue).toEqual({
    largeTriangles: 4,
    smallTriangles: 4,
  });
  expect(source.appreciate.kaleidoscopeDialogue).toEqual([
    'triangle',
    'square',
  ]);
  expect(source.appreciate.boundary).toContain('未给唯一总数');
  expect(source.appreciate.boundary).toContain('不从图框或背景额外增纸片');
});
it('keeps selecting a part distinct from redrawing every full artwork and the rabbit head distinct from all body parts', () => {
  expect(source.traceAndDraw.requested).toBe(
    '选择图案中的一部分，描一描、画一画',
  );
  expect(source.traceAndDraw.boundary).toContain('不强制把四幅整图全部描完');
  expect(source.traceAndDraw.boundary).toContain('不推整兔各部位都是圆');
  expect(source.activities.map((a) => a.key)).toEqual([
    'appreciate-all-four-patterns-and-identify-known-shapes',
    'choose-part-trace-and-draw-straight-and-curved-boundaries',
  ]);
});
it('registers only the read page while keeping later unread pages pending', () => {
  expect(source.status).toBe('source-checked-teaching-mapped');
  expect(audit.pendingPrintedPages).toEqual([84, 85, 86]);
  const all = bnuLowerBook.units.flatMap((u) => u.lessons);
  expect(all.filter((l) => l.status === 'available')).toHaveLength(45);
  expect(all.find((l) => l.id === 'bnu-lower-u6-pending')?.page).toBe(84);
  expect(all.some((l) => l.id === 'bnu-lower-patterns')).toBe(true);
});
