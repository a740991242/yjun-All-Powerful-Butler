import { required } from './learning/required';
/** Regional assignment evidence is separate from a learner's navigation preference. */
export interface RegionalEditionQuery {
  province: string;
  city: string;
  school: string;
  academicYear: string;
  stage: string;
  grade: string;
  subject: 'chinese' | 'english' | 'ethics' | 'math';
  volume: 'lower' | 'upper';
}
export interface RegionalEditionEvidence extends RegionalEditionQuery {
  id: string;
  edition: 'pep-2024' | 'qingdao' | 'sujiao';
  sourceUrl: string;
  sourceTitle: string;
  publishedAt: string;
  checkedAt: string;
}
export type RegionalEditionResolution =
  | { status: 'conflict'; evidence: RegionalEditionEvidence[] }
  | { status: 'unknown'; evidence: RegionalEditionEvidence[] }
  | {
      status: 'verified';
      edition: RegionalEditionEvidence['edition'];
      evidence: RegionalEditionEvidence[];
    };

// These sources name the school, year, grade, subject and first semester.
// They do not establish city/province-wide assignments or the next year's edition.
// Qingdao identifies the named publisher only: its school system, exact book
// identity and course content remain unverified and cannot become a PEP target.
const schoolEvidence: RegionalEditionEvidence[] = [
  {
    id: 'wujiang-choudu-p1-math-2025-2026-upper',
    province: 'jiangsu',
    city: 'suzhou',
    school: 'wujiang-choudu-primary',
    academicYear: '2025-2026',
    stage: 'primary',
    grade: 'p1',
    subject: 'math',
    volume: 'upper',
    edition: 'sujiao',
    sourceUrl: 'https://cdxx.wujiang.edu.cn/2025_10/09_11/content-160393.html',
    sourceTitle: '绸都小学2025~2026学年第一学期数学一年级工作计划',
    publishedAt: '2025-10-09',
    checkedAt: '2026-10-01',
  },
  {
    id: 'longkou-mingde-p1-math-2025-2026-upper',
    province: 'shandong',
    city: 'yantai',
    school: 'longkou-mingde-school',
    academicYear: '2025-2026',
    stage: 'primary',
    grade: 'p1',
    subject: 'math',
    volume: 'upper',
    edition: 'qingdao',
    sourceUrl: 'https://www.yantai.gov.cn/art/2025/7/14/art_97280_3275743.html',
    sourceTitle: '龙口市明德学校2025-2026学年教材选用目录',
    publishedAt: '2025-07-14',
    checkedAt: '2026-10-04',
  },
];
export function regionalEditionEvidence(): RegionalEditionEvidence[] {
  return structuredClone(schoolEvidence);
}
const fields = [
  'province',
  'city',
  'school',
  'academicYear',
  'stage',
  'grade',
  'subject',
  'volume',
] as const;
/** All applicability fields must match; no fallback from school to city/province. */
export function resolveRegionalEdition(
  query: RegionalEditionQuery,
  evidence: readonly RegionalEditionEvidence[] = schoolEvidence,
): RegionalEditionResolution {
  if (
    !fields.every(
      (field) =>
        typeof query[field] === 'string' && query[field].trim().length > 0,
    )
  )
    return { status: 'unknown', evidence: [] };
  const matches = evidence.filter((entry) =>
    fields.every((field) => entry[field] === query[field]),
  );
  if (matches.length === 0) return { status: 'unknown', evidence: [] };
  const editions = new Set(matches.map((entry) => entry.edition));
  const copies = structuredClone(matches);
  if (editions.size !== 1) return { status: 'conflict', evidence: copies };
  return {
    status: 'verified',
    edition: required(matches[0]).edition,
    evidence: copies,
  };
}
