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
    expect(
      rows.flatMap((row) => (row.action ? [row.action.subject] : [])),
    ).toEqual(excluded ? [] : ['chinese', 'ethics']);
    expect(required(rows[1]).resolution.status).toBe('unknown');
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
