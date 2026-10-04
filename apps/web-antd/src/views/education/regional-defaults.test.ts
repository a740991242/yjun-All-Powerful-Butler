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

it('uses Hunan upper-volume alternatives without extrapolating a lower-volume catalog', () => {
  const hunan = { ...query, province: 'hunan' };
  for (const academicYear of ['2025-2026', '2026-2027']) {
    const result = regionalMathematicsDefault({ ...hunan, academicYear })!;
    expect(result.edition).toBe('pep-2024');
    expect(result.catalogYear).toBe('2025');
    expect(result.alternatives).toEqual(['pep-2024', 'sujiao']);
    expect(result.evidence).toEqual([
      {
        id: 'hunan-grade-one-math-upper-catalog-2025',
        sourceUrl:
          'https://fgw.yzcity.gov.cn/fgw/031005/202509/820220824b5e42d2bd0511558b8de68b.shtml',
        sourceTitle:
          '湖南省关于核定2025年秋季中小学教科书价格的通知（湘发改价费〔2025〕558号，永州市发改委转载，附件1一年级第3、4项）',
        publishedAt: '2025-09-09',
        checkedAt: '2026-10-04',
      },
    ]);
  }
  for (const change of [
    { volume: 'lower' },
    { city: 'changsha' },
    { school: 'any-school' },
    { subject: 'english' },
    { academicYear: '2027-2028' },
  ])
    expect(regionalMathematicsDefault({ ...hunan, ...change })).toBeUndefined();
  const result = regionalMathematicsDefault(hunan)!;
  result.alternatives!.pop();
  result.evidence[0]!.publishedAt = 'unknown';
  expect(regionalMathematicsDefault(hunan)!.alternatives).toHaveLength(2);
  expect(regionalMathematicsDefault(hunan)!.evidence[0]!.publishedAt).toBe(
    '2025-09-09',
  );
});

it('keeps Shanxi city-scoped catalog alternatives distinct from a province-wide adoption claim', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = { ...query, province: 'shanxi', volume };
    const result = regionalMathematicsDefault(local)!;
    expect(result.edition).toBe('pep-2024');
    expect(result.catalogYear).toBe('2024');
    expect(result.alternatives).toEqual(['pep-2024', 'sujiao', 'bnu-2024']);
    expect(result.evidence[0]).toMatchObject({
      id: 'shanxi-grade-one-math-catalog-2024',
      publishedAt: '2024-09-09',
      checkedAt: '2026-10-04',
      sourceUrl:
        'https://xxgk.yczf.gov.cn/xzf/ycjyj/fdzdgknr/gzdt/202409/P020240909607430404832.pdf',
    });
    expect(result.evidence[0]!.sourceTitle).toContain('按选用市分列');
    for (const change of [
      { city: 'taiyuan' },
      { school: 'school' },
      { subject: 'english' },
      { grade: 'p2' },
    ])
      expect(
        regionalMathematicsDefault({ ...local, ...change }),
      ).toBeUndefined();
  }
});
