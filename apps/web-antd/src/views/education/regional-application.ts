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
        status: 'catalogued';
        edition: 'hujiao-english-five-four';
        catalogYear: string;
        approvalNumber: string;
        evidence: PolicySource[];
      }
    | {
        status: 'guidance' | 'recommended';
        edition: 'bnu-2024' | 'pep-2024' | 'sujiao';
        evidence: PolicySource[];
        alternatives?: ('bnu-2024' | 'pep-2024' | 'sujiao')[];
        catalogYear?: string;
        catalogKind?: 'digital' | 'price' | 'publisher';
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
    if (
      resolution.status === 'unknown' &&
      subject === 'english' &&
      query.province === 'shanghai' &&
      query.stage === 'primary' &&
      query.grade === 'p1' &&
      ((query.volume === 'upper' && query.academicYear === '2026-2027') ||
        (query.volume === 'lower' && query.academicYear === '2025-2026'))
    ) {
      const upper = query.volume === 'upper';
      resolution = {
        status: 'catalogued',
        edition: 'hujiao-english-five-four',
        catalogYear: '2026',
        approvalNumber: upper ? 'SD－XS－2024001' : 'SD－XS－2024002',
        evidence: [
          {
            id: `shanghai-english-p1-${query.volume}-2026-catalog`,
            sourceUrl: upper
              ? 'https://edu.sh.gov.cn/xxgk2_zdgz_jcjy_04/20260810/339e915d906842caaf98736d562df96a.html'
              : 'https://edu.sh.gov.cn/xxgk2_zdgz_jcjy_04/20260104/665a9f94e26543cf8a2be770a2d4af61.html',
            sourceTitle: upper
              ? '上海市教育委员会关于印发2026年秋季中小学教学用书目录的通知'
              : '上海市教育委员会关于印发2026年春季中小学教学用书目录的通知',
            publishedAt: upper ? '2026-08-10' : '2026-01-05',
            issuedAt: upper ? '2026-06-18' : '2025-12-10',
            checkedAt: '2026-10-06',
          },
          {
            id: `shanghai-english-p1-${query.volume}-2026-attachment`,
            sourceUrl: upper
              ? 'https://edu.sh.gov.cn/cmsres/7a/7aed3909441a4c849d5d78b8d914f4fb/00e155989221056fb74efd6f967939f0.pdf'
              : 'https://edu.sh.gov.cn/cmsres/3a/3a555417ed2b47a38f730ca8c9f10881/9ba8430bf7e54d3e19fce9c17b45f5fb.pdf',
            sourceTitle: upper
              ? '2026年秋季上海市编写教学用书目录（PDF第1页一年级英语）'
              : '2026年春季上海市编写教学用书目录（PDF第1页一年级英语）',
            publishedAt: '',
            checkedAt: '2026-10-06',
          },
        ],
      };
      // A catalog entry is useful even before the student text and course are
      // ready. It must never become an action for an existing preparation pack.
      return { subject, resolution, reason: 'unavailable' };
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
