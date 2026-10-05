import type { Subject, Volume } from './learning/types';
import type {
  RegionalEditionEvidence,
  RegionalEditionQuery,
  RegionalEditionResolution,
} from './regional-editions';

import { editionTarget } from './content/edition-targets';
import { regionalMathematicsDefault } from './regional-defaults';
import { resolveRegionalEdition } from './regional-editions';

export type SchoolSystem = 'five-four' | 'six-three' | 'unknown';
export interface RegionalApplicationQuery extends RegionalEditionQuery {
  schoolSystem: SchoolSystem;
}
export interface RegionalEditionAction {
  subject: Subject;
  edition: 'bnu-2024' | 'pep-2024' | 'sujiao';
  volume: Volume;
}
interface PolicySource {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  publishedAt: string;
  issuedAt?: string;
  checkedAt: string;
}
export interface RegionalSubjectPlan {
  subject: RegionalEditionQuery['subject'];
  resolution:
    | RegionalEditionResolution
    | {
        status: 'guidance' | 'recommended';
        edition: 'pep-2024' | 'sujiao';
        evidence: PolicySource[];
        alternatives?: ('bnu-2024' | 'pep-2024' | 'sujiao')[];
        catalogYear?: string;
        catalogKind?: 'digital';
      };
  reason: 'available' | 'conflict' | 'system' | 'unavailable' | 'unknown';
  action?: RegionalEditionAction;
}

// Explicit scope of this policy, not a map of school adoption. Hong Kong, Macao
// and Taiwan are not inferred from this mainland national-curriculum notice.
const mainlandAreas = new Set([
  'anhui',
  'beijing',
  'chongqing',
  'fujian',
  'gansu',
  'guangdong',
  'guangxi',
  'guizhou',
  'hainan',
  'hebei',
  'heilongjiang',
  'henan',
  'hubei',
  'hunan',
  'inner-mongolia',
  'jiangsu',
  'jiangxi',
  'jilin',
  'liaoning',
  'ningxia',
  'qinghai',
  'shaanxi',
  'shandong',
  'shanghai',
  'shanxi',
  'sichuan',
  'tianjin',
  'tibet',
  'xinjiang',
  'yunnan',
  'zhejiang',
]);
const policy: PolicySource = {
  id: 'mainland-unified-textbooks-starting-grades-2024',
  sourceUrl: 'https://dxs.moe.gov.cn/zx/a/jj/240828/1965383.shtml',
  sourceTitle: '新修订的义务教育统编教材今年秋季开学启用',
  publishedAt: '2024-08-28',
  checkedAt: '2026-10-03',
};

/** Build all four subject decisions together. Unknowns never acquire a fallback edition. */
export function regionalApplicationPlan(
  query: RegionalApplicationQuery,
  evidence?: readonly RegionalEditionEvidence[],
): RegionalSubjectPlan[] {
  return (['chinese', 'math', 'ethics', 'english'] as const).map((subject) => {
    let resolution: RegionalSubjectPlan['resolution'] = resolveRegionalEdition(
      { ...query, subject },
      evidence,
    );
    if (
      resolution.status === 'unknown' &&
      (subject === 'chinese' || subject === 'ethics') &&
      mainlandAreas.has(query.province) &&
      query.stage === 'primary' &&
      query.grade === 'p1' &&
      ['2025-2026', '2026-2027'].includes(query.academicYear) &&
      (query.volume === 'upper' || query.volume === 'lower')
    ) {
      resolution = {
        status: 'guidance',
        edition: 'pep-2024',
        evidence: [structuredClone(policy)],
      };
    }
    if (resolution.status === 'unknown') {
      const defaults = regionalMathematicsDefault({ ...query, subject });
      if (defaults) resolution = { status: 'recommended', ...defaults };
    }
    if (resolution.status === 'conflict')
      return { subject, resolution, reason: 'conflict' };
    if (resolution.status === 'unknown')
      return { subject, resolution, reason: 'unknown' };
    // Available teaching here is six-three. Neither a province nor a national
    // policy establishes a particular learner's school system.
    if (query.schoolSystem !== 'six-three')
      return { subject, resolution, reason: 'system' };
    const target = editionTarget(subject, resolution.edition, query.volume);
    if (!target || target.status !== 'available')
      return { subject, resolution, reason: 'unavailable' };
    return {
      subject,
      resolution,
      reason: 'available',
      action: {
        subject: target.subject,
        edition: target.edition,
        volume: target.volume,
      },
    };
  });
}

export function regionalActionPath(action: RegionalEditionAction): string {
  return `/education/primary/p1/${action.subject}/${action.edition}/${action.volume}`;
}
