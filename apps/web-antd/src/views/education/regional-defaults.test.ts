import { expect, it } from 'vitest';

import { regionalMathematicsDefault } from './regional-defaults';

const query = {
  province: 'fujian',
  city: '',
  school: '',
  academicYear: '2026-2027',
  stage: 'primary',
  grade: 'p1',
  subject: 'math',
  volume: 'upper',
} as const;

it('keeps catalog alternatives and reference year separate from the product default', () => {
  const result = regionalMathematicsDefault(query)!;
  expect(result.catalogYear).toBe('2024');
  expect(result.edition).toBe('pep-2024');
  expect(result.alternatives).toEqual(['pep-2024', 'sujiao', 'bnu-2024']);
  expect(result.evidence[0]).toMatchObject({
    publishedAt: '2024-08-12',
    checkedAt: '2026-10-04',
  });
  result.alternatives!.pop();
  result.evidence[0]!.sourceUrl = 'https://example.invalid';
  expect(regionalMathematicsDefault(query)!.alternatives).toHaveLength(3);
  expect(regionalMathematicsDefault(query)!.evidence[0]!.sourceUrl).toContain(
    'jyt.fujian.gov.cn',
  );
});

it('rejects unsupported subjects, grades, years and specific reference scopes', () => {
  for (const change of [
    { city: 'fuzhou' },
    { school: 'school' },
    { stage: 'middle' },
    { grade: 'p2' },
    { subject: 'english' },
    { subject: 'chinese' },
    { academicYear: '2027-2028' },
    { academicYear: '2024-2025' },
    { province: 'guangdong' },
    { province: 'not-an-area' },
    { volume: 'all' },
  ])
    expect(regionalMathematicsDefault({ ...query, ...change })).toBeUndefined();
  expect(
    regionalMathematicsDefault({ ...query, volume: 'lower' })!.edition,
  ).toBe('pep-2024');
  expect(regionalMathematicsDefault({ ...query, province: 'jiangsu' })).toEqual(
    { edition: 'sujiao', evidence: [] },
  );
});
