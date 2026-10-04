import type { RegionalEditionQuery } from './regional-editions';

import { expect, it } from 'vitest';

import {
  regionalEditionEvidence,
  resolveRegionalEdition,
} from './regional-editions';

const query: RegionalEditionQuery = {
  province: 'jiangsu',
  city: 'suzhou',
  school: 'wujiang-choudu-primary',
  academicYear: '2025-2026',
  stage: 'primary',
  grade: 'p1',
  subject: 'math',
  volume: 'upper',
};
it('resolves the exact inspected school/year/grade/subject/semester and retains its inspectable evidence', () => {
  const result = resolveRegionalEdition(query);
  expect(result.status).toBe('verified');
  if (result.status !== 'verified') throw new Error('exact source not matched');
  expect(result.edition).toBe('sujiao');
  expect(result.evidence[0]!.sourceUrl).toBe(
    'https://cdxx.wujiang.edu.cn/2025_10/09_11/content-160393.html',
  );
  expect(result.evidence[0]!.publishedAt).toBe('2025-10-09');
  expect(result.evidence[0]!.checkedAt).toBe('2026-10-01');
});
it('does not extrapolate to other schools, cities, years, grades, subjects or the lower semester', () => {
  const changes: Partial<RegionalEditionQuery>[] = [
    { province: 'zhejiang' },
    { city: 'nanjing' },
    { school: '' },
    { school: 'other-school' },
    { academicYear: '2026-2027' },
    { academicYear: '' },
    { stage: 'middle' },
    { grade: 'p2' },
    { subject: 'chinese' },
    { subject: 'ethics' },
    { subject: 'english' },
    { volume: 'lower' },
  ];
  for (const change of changes)
    expect(resolveRegionalEdition({ ...query, ...change })).toEqual({
      status: 'unknown',
      evidence: [],
    });
});
it('reports conflicting edition evidence instead of applying array order as a preference', () => {
  const original = regionalEditionEvidence()[0]!;
  const conflicting = {
    ...original,
    id: 'test-conflict',
    edition: 'pep-2024' as const,
  };
  for (const rows of [
    [original, conflicting],
    [conflicting, original],
  ]) {
    const result = resolveRegionalEdition(query, rows);
    expect(result.status).toBe('conflict');
    expect(result.evidence).toHaveLength(2);
    expect('edition' in result).toBe(false);
  }
  const result = resolveRegionalEdition(query, [
    original,
    { ...original, id: 'test-corroboration' },
  ]);
  expect(result.status).toBe('verified');
  expect(result.evidence).toHaveLength(2);
});
it('returns independent source records so consumer edits cannot silently change future assignments', () => {
  const evidence = regionalEditionEvidence();
  evidence[0]!.edition = 'pep-2024';
  evidence[0]!.school = 'other-school';
  const result = resolveRegionalEdition(query);
  expect(result.status).toBe('verified');
  result.evidence[0]!.sourceUrl = 'https://example.invalid';
  expect(resolveRegionalEdition(query).evidence[0]!.sourceUrl).toContain(
    'cdxx.wujiang.edu.cn',
  );
  expect(regionalEditionEvidence()[0]!.edition).toBe('sujiao');
});

it('matches the actual Mingde upper-semester mathematics notice without inventing a school system or other subjects', () => {
  const local: RegionalEditionQuery = {
    ...query,
    province: 'shandong',
    city: 'yantai',
    school: 'longkou-mingde-school',
  };
  const result = resolveRegionalEdition(local);
  expect(result.status).toBe('verified');
  if (result.status !== 'verified') throw new Error('exact source not matched');
  expect(result.edition).toBe('qingdao');
  expect(result.evidence).toHaveLength(1);
  expect(result.evidence[0]!.sourceUrl).toBe(
    'https://www.yantai.gov.cn/art/2025/7/14/art_97280_3275743.html',
  );
  expect(result.evidence[0]!.publishedAt).toBe('2025-07-14');
  expect(result.evidence[0]!.checkedAt).toBe('2026-10-04');
  expect('schoolSystem' in result.evidence[0]!).toBe(false);
  for (const change of [
    { volume: 'lower' as const },
    { academicYear: '2026-2027' },
    { subject: 'english' as const },
    { subject: 'chinese' as const },
    { subject: 'ethics' as const },
    { grade: 'p2' },
    { stage: 'middle' },
    { school: '' },
    { city: '' },
    { province: 'jiangsu' },
  ])
    expect(resolveRegionalEdition({ ...local, ...change }).status).toBe(
      'unknown',
    );
});
