import { expect, it } from 'vitest';

import { required } from './learning/required';
import {
  regionalActionPath,
  regionalApplicationPlan,
} from './regional-application';
import { regionalEditionEvidence } from './regional-editions';
import { regionalProvinces } from './regional-locations';

const query = {
  province: 'jiangsu',
  city: 'suzhou',
  school: 'wujiang-choudu-primary',
  academicYear: '2025-2026',
  stage: 'primary',
  grade: 'p1',
  subject: 'math',
  volume: 'upper',
  schoolSystem: 'six-three',
} as const;

it('plans all four subjects without upgrading national guidance into school adoption', () => {
  const rows = regionalApplicationPlan(query);
  expect(rows.map((row) => row.subject)).toEqual([
    'chinese',
    'math',
    'ethics',
    'english',
  ]);
  expect(rows.map((row) => row.resolution.status)).toEqual([
    'guidance',
    'verified',
    'guidance',
    'unknown',
  ]);
  expect(
    rows.flatMap((row) => (row.action ? [regionalActionPath(row.action)] : [])),
  ).toEqual([
    '/education/primary/p1/chinese/pep-2024/upper',
    '/education/primary/p1/math/sujiao/upper',
    '/education/primary/p1/ethics/pep-2024/upper',
  ]);
  expect(required(rows[3]).action).toBeUndefined();
});

it('keeps the national policy scope explicit across all 34 navigation areas', () => {
  for (const province of regionalProvinces) {
    const rows = regionalApplicationPlan({
      ...query,
      province,
      city: '',
      school: '',
      volume: 'lower',
    });
    const excluded = ['hong-kong', 'macau', 'taiwan'].includes(province);
    expect(
      rows.filter((row) => row.resolution.status === 'guidance'),
    ).toHaveLength(excluded ? 0 : 2);
    let expectedSubjects: string[] = ['chinese', 'ethics'];
    if (
      [
        'fujian',
        'guizhou',
        'henan',
        'hubei',
        'jiangsu',
        'liaoning',
        'shanxi',
        'zhejiang',
      ].includes(province)
    )
      expectedSubjects = ['chinese', 'math', 'ethics'];
    if (excluded) expectedSubjects = [];
    expect(
      rows.flatMap((row) => (row.action ? [row.action.subject] : [])),
    ).toEqual(expectedSubjects);
    expect(required(rows[1]).resolution.status).toBe(
      [
        'fujian',
        'guizhou',
        'henan',
        'hubei',
        'jiangsu',
        'liaoning',
        'shanxi',
        'zhejiang',
      ].includes(province)
        ? 'recommended'
        : 'unknown',
    );
    expect(required(rows[3]).resolution.status).toBe('unknown');
  }
});

it('does not invent six-three applicability, future years, English or a five-four course', () => {
  for (const schoolSystem of ['unknown', 'five-four'] as const) {
    const rows = regionalApplicationPlan({ ...query, schoolSystem });
    expect(rows.flatMap((row) => (row.action ? [row.action] : []))).toEqual([]);
    expect(rows.filter((row) => row.reason === 'system')).toHaveLength(3);
  }
  for (const change of [
    { academicYear: '2027-2028' },
    { grade: 'p2' },
    { stage: 'middle' },
    { province: 'not-an-area' },
  ]) {
    expect(
      regionalApplicationPlan({ ...query, ...change }).every(
        (row) => row.action === undefined,
      ),
    ).toBe(true);
  }
});

it('does not apply a conflicting school edition or mutate shared evidence', () => {
  const source = required(regionalEditionEvidence()[0]);
  const rows = regionalApplicationPlan(query, [
    source,
    { ...source, id: 'conflict', edition: 'pep-2024' },
  ]);
  expect(required(rows[1]).reason).toBe('conflict');
  expect(required(rows[1]).action).toBeUndefined();
  expect(rows.filter((row) => row.action)).toHaveLength(2);
  const policy = required(required(rows[0]).resolution.evidence[0]);
  policy.sourceUrl = 'https://example.invalid';
  expect(
    required(required(regionalApplicationPlan(query)[0]).resolution.evidence[0])
      .sourceUrl,
  ).toContain('dxs.moe.gov.cn');
});

it('retains a sourced unbuilt Qingdao edition instead of silently applying a PEP or Sujiao course', () => {
  const local = {
    ...query,
    province: 'shandong',
    city: 'yantai',
    school: 'longkou-mingde-school',
  };
  const plan = regionalApplicationPlan(local);
  expect(plan[1]!.resolution.status).toBe('verified');
  if (plan[1]!.resolution.status !== 'verified')
    throw new Error('source not matched');
  expect(plan[1]!.resolution.edition).toBe('qingdao');
  expect(plan[1]!.reason).toBe('unavailable');
  expect(plan[1]!.action).toBeUndefined();
  expect(
    plan.flatMap((row) => (row.action ? [row.action.subject] : [])),
  ).toEqual(['chinese', 'ethics']);
  for (const change of [
    { academicYear: '2026-2027' },
    { volume: 'lower' as const },
    { city: 'suzhou' },
    { school: 'other-school' },
  ]) {
    const result = regionalApplicationPlan({ ...local, ...change })[1]!;
    expect(result.reason).toBe('unknown');
    expect(result.action).toBeUndefined();
  }
  for (const schoolSystem of ['unknown', 'five-four'] as const) {
    const guarded = regionalApplicationPlan({ ...local, schoolSystem });
    expect(guarded.every((row) => row.action === undefined)).toBe(true);
  }
});

it('applies the Jiangsu default without requiring a city or school, for both volumes', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = {
      ...query,
      city: '',
      school: '',
      volume,
      academicYear: '2026-2027',
    };
    const plan = regionalApplicationPlan(local);
    expect(plan[1]!.resolution).toEqual({
      status: 'recommended',
      edition: 'sujiao',
      evidence: [],
    });
    expect(
      plan.flatMap((row) =>
        row.action ? [regionalActionPath(row.action)] : [],
      ),
    ).toEqual([
      `/education/primary/p1/chinese/pep-2024/${volume}`,
      `/education/primary/p1/math/sujiao/${volume}`,
      `/education/primary/p1/ethics/pep-2024/${volume}`,
    ]);
    expect(plan[3]!.action).toBeUndefined();
    for (const schoolSystem of ['unknown', 'five-four'] as const)
      expect(
        regionalApplicationPlan({ ...local, schoolSystem }).every(
          (row) => !row.action,
        ),
      ).toBe(true);
    expect(
      regionalApplicationPlan({ ...local, academicYear: '2027-2028' })[1]!
        .action,
    ).toBeUndefined();
  }
});

it('applies Fujian default volumes without asserting a sole provincial edition or changing unbuilt English', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = {
      ...query,
      province: 'fujian',
      city: '',
      school: '',
      volume,
      academicYear: '2026-2027',
    };
    const plan = regionalApplicationPlan(local);
    expect(plan[1]!.resolution.status).toBe('recommended');
    if (plan[1]!.resolution.status !== 'recommended')
      throw new Error('missing default');
    expect(plan[1]!.resolution.edition).toBe('pep-2024');
    expect(plan[1]!.resolution.catalogYear).toBe('2024');
    expect(plan[1]!.resolution.alternatives).toEqual([
      'pep-2024',
      'sujiao',
      'bnu-2024',
    ]);
    expect(plan[1]!.resolution.evidence[0]!.sourceUrl).toBe(
      'https://jyt.fujian.gov.cn/xxgk/zywj/202408/t20240812_6500947.htm',
    );
    expect(
      plan.flatMap((row) =>
        row.action ? [regionalActionPath(row.action)] : [],
      ),
    ).toEqual([
      `/education/primary/p1/chinese/pep-2024/${volume}`,
      `/education/primary/p1/math/pep-2024/${volume}`,
      `/education/primary/p1/ethics/pep-2024/${volume}`,
    ]);
    expect(plan[3]!.action).toBeUndefined();
    for (const schoolSystem of ['unknown', 'five-four'] as const)
      expect(
        regionalApplicationPlan({ ...local, schoolSystem }).every(
          (row) => !row.action,
        ),
      ).toBe(true);
  }
});

it('applies Hunan upper-volume combination and preserves an unknown lower-volume math choice', () => {
  const local = {
    ...query,
    province: 'hunan',
    city: '',
    school: '',
    academicYear: '2026-2027',
  };
  const upper = regionalApplicationPlan(local);
  expect(
    upper.flatMap((row) =>
      row.action ? [regionalActionPath(row.action)] : [],
    ),
  ).toEqual([
    '/education/primary/p1/chinese/pep-2024/upper',
    '/education/primary/p1/math/pep-2024/upper',
    '/education/primary/p1/ethics/pep-2024/upper',
  ]);
  expect(upper[1]!.resolution).toMatchObject({
    status: 'recommended',
    edition: 'pep-2024',
    catalogYear: '2025',
    alternatives: ['pep-2024', 'sujiao'],
  });
  expect(upper[3]!.action).toBeUndefined();
  const lower = regionalApplicationPlan({ ...local, volume: 'lower' });
  expect(lower[1]!.resolution.status).toBe('unknown');
  expect(lower[1]!.action).toBeUndefined();
  expect(
    lower.flatMap((row) => (row.action ? [row.action.subject] : [])),
  ).toEqual(['chinese', 'ethics']);
  for (const schoolSystem of ['unknown', 'five-four'] as const)
    expect(
      regionalApplicationPlan({ ...local, schoolSystem }).every(
        (row) => !row.action,
      ),
    ).toBe(true);
});

it('applies Shanxi reference combinations for both volumes while retaining system guards', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = {
      ...query,
      province: 'shanxi',
      city: '',
      school: '',
      volume,
    };
    const plan = regionalApplicationPlan(local);
    expect(
      plan.flatMap((row) =>
        row.action ? [regionalActionPath(row.action)] : [],
      ),
    ).toEqual([
      `/education/primary/p1/chinese/pep-2024/${volume}`,
      `/education/primary/p1/math/pep-2024/${volume}`,
      `/education/primary/p1/ethics/pep-2024/${volume}`,
    ]);
    expect(plan[1]!.resolution).toMatchObject({
      status: 'recommended',
      catalogYear: '2024',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
    });
    expect(plan[3]!.action).toBeUndefined();
    for (const schoolSystem of ['unknown', 'five-four'] as const)
      expect(
        regionalApplicationPlan({ ...local, schoolSystem }).every(
          (row) => !row.action,
        ),
      ).toBe(true);
  }
});

it('applies Hubei volume-specific catalog combinations without inventing English', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = {
      ...query,
      province: 'hubei',
      city: '',
      school: '',
      volume,
    };
    const rows = regionalApplicationPlan(local);
    expect(
      rows.flatMap((row) =>
        row.action ? [regionalActionPath(row.action)] : [],
      ),
    ).toEqual([
      `/education/primary/p1/chinese/pep-2024/${volume}`,
      `/education/primary/p1/math/pep-2024/${volume}`,
      `/education/primary/p1/ethics/pep-2024/${volume}`,
    ]);
    expect(required(rows[1]).resolution).toMatchObject({
      status: 'recommended',
      edition: 'pep-2024',
      catalogYear: volume === 'upper' ? '2025' : '2026',
      alternatives: ['pep-2024', 'bnu-2024'],
    });
    expect(required(rows[3]).action).toBeUndefined();
    for (const schoolSystem of ['unknown', 'five-four'] as const)
      expect(
        regionalApplicationPlan({ ...local, schoolSystem }).every(
          (row) => !row.action,
        ),
      ).toBe(true);
  }
});

it('applies Henan digital catalog references for both volumes without claiming printed adoption', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = { ...query, province: 'henan', city: '', school: '', volume };
    const rows = regionalApplicationPlan(local);
    expect(rows[1]!.resolution).toMatchObject({
      status: 'recommended',
      edition: 'pep-2024',
      catalogYear: '2025',
      catalogKind: 'digital',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
    });
    expect(
      rows.flatMap((row) =>
        row.action ? [regionalActionPath(row.action)] : [],
      ),
    ).toEqual([
      `/education/primary/p1/chinese/pep-2024/${volume}`,
      `/education/primary/p1/math/pep-2024/${volume}`,
      `/education/primary/p1/ethics/pep-2024/${volume}`,
    ]);
    expect(rows[3]!.action).toBeUndefined();
    for (const schoolSystem of ['unknown', 'five-four'] as const)
      expect(
        regionalApplicationPlan({ ...local, schoolSystem }).every(
          (row) => !row.action,
        ),
      ).toBe(true);
  }
});

it('applies Anhui upper combinations without inheriting the price catalog into lower or English', () => {
  const local = {
    ...query,
    province: 'anhui',
    city: '',
    school: '',
    volume: 'upper' as const,
  };
  const upper = regionalApplicationPlan(local);
  expect(upper[1]!.resolution).toMatchObject({
    status: 'recommended',
    edition: 'pep-2024',
    catalogYear: '2025',
    alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
  });
  expect(
    upper.flatMap((row) =>
      row.action ? [regionalActionPath(row.action)] : [],
    ),
  ).toEqual([
    '/education/primary/p1/chinese/pep-2024/upper',
    '/education/primary/p1/math/pep-2024/upper',
    '/education/primary/p1/ethics/pep-2024/upper',
  ]);
  expect(upper[3]!.action).toBeUndefined();
  const lower = regionalApplicationPlan({ ...local, volume: 'lower' });
  expect(lower[1]!.action).toBeUndefined();
  expect(lower[3]!.action).toBeUndefined();
  expect(lower.filter((row) => row.action)).toHaveLength(2);
});

it('applies Liaoning both-volume combinations using the matching reference year and preserving unknown English', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = {
      ...query,
      province: 'liaoning',
      city: '',
      school: '',
      volume,
    };
    const rows = regionalApplicationPlan(local);
    expect(rows[1]!.resolution).toMatchObject({
      status: 'recommended',
      edition: 'pep-2024',
      catalogYear: volume === 'upper' ? '2025' : '2026',
      alternatives: ['pep-2024', 'bnu-2024'],
    });
    expect(
      rows.flatMap((row) =>
        row.action ? [regionalActionPath(row.action)] : [],
      ),
    ).toEqual([
      `/education/primary/p1/chinese/pep-2024/${volume}`,
      `/education/primary/p1/math/pep-2024/${volume}`,
      `/education/primary/p1/ethics/pep-2024/${volume}`,
    ]);
    expect(rows[3]!.action).toBeUndefined();
    for (const schoolSystem of ['unknown', 'five-four'] as const)
      expect(
        regionalApplicationPlan({ ...local, schoolSystem }).every(
          (row) => !row.action,
        ),
      ).toBe(true);
  }
});

it('applies Zhejiang both-volume combinations without inferring an English course from math sources', () => {
  for (const volume of ['upper', 'lower'] as const) {
    const local = {
      ...query,
      province: 'zhejiang',
      city: '',
      school: '',
      volume,
    };
    const rows = regionalApplicationPlan(local);
    expect(rows[1]!.resolution).toMatchObject({
      status: 'recommended',
      edition: 'pep-2024',
      catalogYear: '2025',
      alternatives: ['pep-2024', 'bnu-2024'],
    });
    expect(
      rows.flatMap((row) =>
        row.action ? [regionalActionPath(row.action)] : [],
      ),
    ).toEqual([
      `/education/primary/p1/chinese/pep-2024/${volume}`,
      `/education/primary/p1/math/pep-2024/${volume}`,
      `/education/primary/p1/ethics/pep-2024/${volume}`,
    ]);
    expect(rows[3]!.action).toBeUndefined();
    for (const schoolSystem of ['unknown', 'five-four'] as const)
      expect(
        regionalApplicationPlan({ ...local, schoolSystem }).every(
          (row) => !row.action,
        ),
      ).toBe(true);
  }
});

it('applies Guizhou both volumes and Chongqing upper only without changing unsupported subject actions', () => {
  for (const province of ['guizhou', 'chongqing']) {
    for (const volume of ['upper', 'lower'] as const) {
      const rows = regionalApplicationPlan({
        ...query,
        province,
        city: '',
        school: '',
        volume,
      });
      const supported = province === 'guizhou' || volume === 'upper';
      expect(rows[1]!.resolution.status).toBe(
        supported ? 'recommended' : 'unknown',
      );
      expect(
        rows.flatMap((row) =>
          row.action ? [regionalActionPath(row.action)] : [],
        ),
      ).toEqual([
        `/education/primary/p1/chinese/pep-2024/${volume}`,
        ...(supported ? [`/education/primary/p1/math/pep-2024/${volume}`] : []),
        `/education/primary/p1/ethics/pep-2024/${volume}`,
      ]);
      expect(rows[3]!.action).toBeUndefined();
    }
  }
});
