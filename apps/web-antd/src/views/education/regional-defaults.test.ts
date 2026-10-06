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

it('keeps the read Jiangxi autumn table and document date specific to the upper volume', () => {
  for (const academicYear of ['2025-2026', '2026-2027']) {
    const local = { ...query, province: 'jiangxi', academicYear };
    const result = regionalMathematicsDefault(local)!;
    expect(result).toMatchObject({
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'bnu-2024'],
      catalogYear: '2025',
    });
    expect(result.evidence[0]).toMatchObject({
      id: 'jiangxi-grade-one-math-upper-catalog-2025',
      issuedAt: '2025-09-28',
      publishedAt: '',
      checkedAt: '2026-10-06',
    });
    expect(result.evidence[0]!.sourceTitle).toContain('第139、271项');
    expect(result.evidence[0]!.sourceUrl).toContain(
      '75ccbb0d852d4057bbb7bc739e4d1d89.pdf',
    );
    result.alternatives!.pop();
    result.evidence[0]!.issuedAt = 'unknown';
    expect(regionalMathematicsDefault(local)!.alternatives).toHaveLength(2);
    expect(regionalMathematicsDefault(local)!.evidence[0]!.issuedAt).toBe(
      '2025-09-28',
    );
    for (const change of [
      { volume: 'lower' },
      { volume: 'all' },
      { city: 'nanchang' },
      { school: 'school' },
      { subject: 'english' },
      { grade: 'p2' },
      { academicYear: '2027-2028' },
    ])
      expect(
        regionalMathematicsDefault({ ...local, ...change }),
      ).toBeUndefined();
  }
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

it('keeps Hubei spring and autumn catalogs specific to their verified volumes', () => {
  const hubei = { ...query, province: 'hubei', volume: 'lower' };
  const result = regionalMathematicsDefault(hubei)!;
  expect(result.edition).toBe('pep-2024');
  expect(result.catalogYear).toBe('2026');
  expect(result.alternatives).toEqual(['pep-2024', 'bnu-2024']);
  expect(result.evidence[0]).toMatchObject({
    id: 'hubei-grade-one-math-lower-catalog-2026',
    sourceUrl:
      'https://jyt.hubei.gov.cn/zfxxgk/zc_GK2020/qtzdgkwj_GK2020/202602/t20260224_5879252.shtml',
    publishedAt: '2026-02-12',
    checkedAt: '2026-10-04',
  });
  expect(result.evidence[0]!.sourceTitle).toContain('第13、339项');
  for (const change of [
    { city: 'wuhan' },
    { school: 'any-school' },
    { subject: 'english' },
    { grade: 'p2' },
    { academicYear: '2027-2028' },
  ])
    expect(regionalMathematicsDefault({ ...hubei, ...change })).toBeUndefined();
  result.alternatives!.pop();
  result.evidence[0]!.publishedAt = 'unknown';
  expect(regionalMathematicsDefault(hubei)!.alternatives).toHaveLength(2);
  expect(regionalMathematicsDefault(hubei)!.evidence[0]!.publishedAt).toBe(
    '2026-02-12',
  );
});

it('adds Hubei upper references without turning an attachment path date into a publication date or school-wide adoption', () => {
  for (const academicYear of ['2025-2026', '2026-2027']) {
    const result = regionalMathematicsDefault({
      ...query,
      province: 'hubei',
      academicYear,
    })!;
    expect(result.edition).toBe('pep-2024');
    expect(result.catalogYear).toBe('2025');
    expect(result.alternatives).toEqual(['pep-2024', 'bnu-2024']);
    expect(result.evidence).toEqual([
      {
        id: 'hubei-grade-one-math-upper-catalog-2025',
        sourceUrl:
          'https://fgw.hubei.gov.cn/fbjd/zc/zcwj/gg/202508/P020250829700876060881.pdf',
        sourceTitle:
          '湖北省2025年秋季中小学教科书零售价格表（附件1印刷第2、22页，第14、372项，一年级数学上册）',
        publishedAt: '',
        checkedAt: '2026-10-06',
      },
    ]);
    result.alternatives!.pop();
    result.evidence[0]!.sourceUrl = 'https://example.invalid';
    const fresh = regionalMathematicsDefault({
      ...query,
      province: 'hubei',
      academicYear,
    })!;
    expect(fresh.alternatives).toHaveLength(2);
    expect(fresh.evidence[0]!.sourceUrl).toContain('fgw.hubei.gov.cn');
  }
});

it('keeps Henan upper/lower digital catalog identities, dates and fresh references separate', () => {
  for (const volume of ['upper', 'lower'] as const) {
    for (const academicYear of ['2025-2026', '2026-2027']) {
      const local = { ...query, province: 'henan', volume, academicYear };
      const result = regionalMathematicsDefault(local)!;
      expect(result).toMatchObject({
        edition: 'pep-2024',
        catalogYear: '2025',
        catalogKind: 'digital',
        alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
      });
      expect(result.evidence[0]).toMatchObject({
        id: `henan-grade-one-math-${volume}-digital-catalog-2025`,
        publishedAt: '',
        issuedAt: volume === 'upper' ? '2025-04-25' : '2024-11-05',
        checkedAt: '2026-10-06',
      });
      expect(result.evidence[0]!.sourceTitle).toContain('数字教材学生用');
      expect(result.evidence[0]!.sourceTitle).toContain(
        volume === 'upper' ? '一年级上册' : '一年级下册',
      );
      expect(result.evidence[0]!.sourceUrl).toContain(
        volume === 'upper'
          ? '8993a114d7d74ce2bc515b627698f204.pdf'
          : '46ca9c21f429404a90a55568df927080.pdf',
      );
      result.alternatives!.pop();
      result.evidence[0]!.sourceUrl = 'https://example.invalid';
      expect(regionalMathematicsDefault(local)!.alternatives).toHaveLength(3);
      expect(
        regionalMathematicsDefault(local)!.evidence[0]!.sourceUrl,
      ).toContain('.zfcg.henan.gov.cn/');
      for (const change of [
        { volume: 'all' },
        { city: 'zhengzhou' },
        { school: 'school' },
        { grade: 'p2' },
        { subject: 'english' },
        { academicYear: '2027-2028' },
      ])
        expect(
          regionalMathematicsDefault({ ...local, ...change }),
        ).toBeUndefined();
    }
  }
});

it('keeps Anhui autumn references separate from the spring table', () => {
  for (const academicYear of ['2025-2026', '2026-2027']) {
    const local = { ...query, province: 'anhui', academicYear };
    const result = regionalMathematicsDefault(local)!;
    expect(result).toMatchObject({
      edition: 'pep-2024',
      catalogYear: '2025',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
    });
    expect(result.catalogKind).toBeUndefined();
    expect(result.evidence[0]).toMatchObject({
      id: 'anhui-grade-one-math-upper-catalog-2025',
      issuedAt: '2025-08-15',
      publishedAt: '2025-08-20',
      checkedAt: '2026-10-06',
    });
    expect(result.evidence[0]!.sourceTitle).toContain('第68、74、80项');
    result.alternatives!.pop();
    result.evidence[0]!.publishedAt = 'unknown';
    expect(regionalMathematicsDefault(local)!.alternatives).toHaveLength(3);
    expect(regionalMathematicsDefault(local)!.evidence[0]!.publishedAt).toBe(
      '2025-08-20',
    );
    for (const change of [
      { city: 'hefei' },
      { school: 'school' },
      { subject: 'english' },
      { grade: 'p2' },
      { academicYear: '2027-2028' },
    ])
      expect(
        regionalMathematicsDefault({ ...local, ...change }),
      ).toBeUndefined();
  }
});

it('uses the independently read Anhui spring table without guessing its publication date', () => {
  for (const academicYear of ['2025-2026', '2026-2027']) {
    const local = {
      ...query,
      province: 'anhui',
      volume: 'lower',
      academicYear,
    };
    const result = regionalMathematicsDefault(local)!;
    expect(result).toMatchObject({
      edition: 'pep-2024',
      catalogYear: '2025',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
    });
    expect(result.evidence[0]).toMatchObject({
      id: 'anhui-grade-one-math-lower-catalog-2025',
      sourceUrl:
        'https://fzggw.ah.gov.cn/group6/M00/0C/9B/wKg8BmeQX3yADVmNAAr0AJTqIDc908.doc',
      publishedAt: '',
      checkedAt: '2026-10-06',
    });
    expect(result.evidence[0]!.issuedAt).toBeUndefined();
    expect(result.evidence[0]!.sourceTitle).toContain('第9、128、157项');
    result.alternatives!.pop();
    result.evidence[0]!.sourceUrl = 'https://example.invalid';
    expect(regionalMathematicsDefault(local)!.alternatives).toHaveLength(3);
    expect(regionalMathematicsDefault(local)!.evidence[0]!.sourceUrl).toContain(
      'fzggw.ah.gov.cn',
    );
    for (const change of [
      { city: 'hefei' },
      { school: 'school' },
      { subject: 'english' },
      { grade: 'p2' },
      { academicYear: '2027-2028' },
      { volume: 'all' },
    ])
      expect(
        regionalMathematicsDefault({ ...local, ...change }),
      ).toBeUndefined();
  }
});

it('separates Liaoning volume sources, years and document/publication dates', () => {
  for (const volume of ['upper', 'lower'] as const) {
    for (const academicYear of ['2025-2026', '2026-2027']) {
      const local = { ...query, province: 'liaoning', volume, academicYear };
      const result = regionalMathematicsDefault(local)!;
      const upper = volume === 'upper';
      expect(result).toMatchObject({
        edition: 'pep-2024',
        catalogYear: upper ? '2025' : '2026',
        alternatives: ['pep-2024', 'bnu-2024'],
      });
      expect(result.evidence[0]).toMatchObject({
        id: `liaoning-grade-one-math-${volume}-catalog-${upper ? '2025' : '2026'}`,
        issuedAt: upper ? '2025-07-21' : '2026-01-05',
        publishedAt: upper ? '2025-07-23' : '2026-01-08',
        checkedAt: '2026-10-06',
      });
      expect(result.evidence[0]!.sourceTitle).toContain(
        upper ? '一年级数学上册' : '一年级数学下册',
      );
      expect(result.evidence[0]!.sourceUrl).toContain(
        upper ? '2025072310032719554' : '2026010816275051643',
      );
      result.alternatives!.pop();
      result.evidence[0]!.sourceUrl = 'https://example.invalid';
      expect(regionalMathematicsDefault(local)!.alternatives).toHaveLength(2);
      expect(
        regionalMathematicsDefault(local)!.evidence[0]!.sourceUrl,
      ).toContain('fgw.ln.gov.cn');
      for (const change of [
        { city: 'shenyang' },
        { school: 'school' },
        { grade: 'p2' },
        { subject: 'english' },
        { academicYear: '2027-2028' },
        { volume: 'all' },
      ])
        expect(
          regionalMathematicsDefault({ ...local, ...change }),
        ).toBeUndefined();
    }
  }
});

it('keeps Zhejiang upper/lower attachment references separate without inventing dates', () => {
  for (const volume of ['upper', 'lower'] as const) {
    for (const academicYear of ['2025-2026', '2026-2027']) {
      const local = { ...query, province: 'zhejiang', volume, academicYear };
      const result = regionalMathematicsDefault(local)!;
      expect(result).toMatchObject({
        edition: 'pep-2024',
        catalogYear: '2025',
        alternatives: ['pep-2024', 'bnu-2024'],
      });
      expect(result.evidence[0]).toMatchObject({
        id: `zhejiang-grade-one-math-${volume}-catalog-2025`,
        publishedAt: '',
        checkedAt: '2026-10-06',
      });
      expect(result.evidence[0]!.issuedAt).toBeUndefined();
      expect(result.evidence[0]!.sourceTitle).toContain(
        volume === 'upper' ? '0339、0340' : '0024、0108',
      );
      expect(result.evidence[0]!.sourceUrl).toContain(
        volume === 'upper'
          ? '1414745c337344dd9269d68078249459.pdf'
          : 'b92c77b7999b4d30ba3d7f95b6c7eb89.pdf',
      );
      result.alternatives!.pop();
      result.evidence[0]!.sourceUrl = 'https://example.invalid';
      expect(regionalMathematicsDefault(local)!.alternatives).toHaveLength(2);
      expect(
        regionalMathematicsDefault(local)!.evidence[0]!.sourceUrl,
      ).toContain('cloud.zj.gov.cn');
      for (const change of [
        { city: 'hangzhou' },
        { school: 'school' },
        { grade: 'p2' },
        { subject: 'english' },
        { academicYear: '2027-2028' },
        { volume: 'all' },
      ])
        expect(
          regionalMathematicsDefault({ ...local, ...change }),
        ).toBeUndefined();
    }
  }
});

it('keeps Guizhou first-batch upper and lower references separate and excludes unlisted Grade 1 math editions', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = { ...query, province: 'guizhou', volume };
    for (const academicYear of ['2025-2026', '2026-2027']) {
      const result = regionalMathematicsDefault({ ...local, academicYear })!;
      expect(result.edition).toBe('pep-2024');
      expect(result.alternatives).toEqual(['pep-2024', 'sujiao']);
      expect(result.catalogYear).toBe(volume === 'upper' ? '2025' : '2026');
      expect(result.evidence[0]).toMatchObject({
        publishedAt: '',
        checkedAt: '2026-10-06',
        id: `guizhou-grade-one-math-${volume}-catalog-${volume === 'upper' ? '2025' : '2026'}`,
      });
      expect(result.evidence[0]!.sourceTitle).toContain(
        volume === 'upper' ? '第7、10页' : '第3、4页',
      );
      expect(result.evidence[0]!.sourceUrl).toContain(
        volume === 'upper'
          ? 'P020260205655763222699.pdf'
          : 'P020251121626568924282.pdf',
      );
      result.alternatives!.pop();
      result.evidence[0]!.sourceUrl = 'https://example.invalid';
      expect(regionalMathematicsDefault(local)!.alternatives).toHaveLength(2);
      expect(
        regionalMathematicsDefault(local)!.evidence[0]!.sourceUrl,
      ).toContain('fgw.guizhou.gov.cn');
    }
    for (const change of [
      { city: 'guiyang' },
      { school: 'school' },
      { subject: 'english' },
      { grade: 'p2' },
      { academicYear: '2027-2028' },
      { volume: 'all' },
    ])
      expect(
        regionalMathematicsDefault({ ...local, ...change }),
      ).toBeUndefined();
  }
});

it('uses the explicit Chongqing 2025 upper PEP label without guessing from the distributor in other volumes', () => {
  const local = { ...query, province: 'chongqing' };
  for (const academicYear of ['2025-2026', '2026-2027']) {
    const result = regionalMathematicsDefault({ ...local, academicYear })!;
    expect(result.edition).toBe('pep-2024');
    expect(result.alternatives).toEqual(['pep-2024']);
    expect(result.catalogYear).toBe('2025');
    expect(result.evidence[0]).toMatchObject({
      issuedAt: '2025-07-09',
      publishedAt: '2025-07-10',
      checkedAt: '2026-10-06',
    });
    expect(result.evidence[0]!.sourceTitle).toContain('明确标注人教版');
    result.evidence[0]!.publishedAt = 'unknown';
    expect(regionalMathematicsDefault(local)!.evidence[0]!.publishedAt).toBe(
      '2025-07-10',
    );
  }
  for (const change of [
    { volume: 'lower' },
    { city: 'chongqing' },
    { school: 'school' },
    { subject: 'english' },
    { academicYear: '2027-2028' },
  ])
    expect(regionalMathematicsDefault({ ...local, ...change })).toBeUndefined();
});
