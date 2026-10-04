import type { RegionalEditionQuery } from './regional-editions';

export interface RegionalDefaultSource {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  publishedAt: string;
  checkedAt: string;
}
export interface RegionalMathDefault {
  edition: 'pep-2024' | 'sujiao';
  evidence: RegionalDefaultSource[];
  alternatives?: ('bnu-2024' | 'pep-2024' | 'sujiao')[];
  catalogYear?: string;
}

/** Product combinations are distinct from verified adoption at any school.
 * The Fujian 2024 catalog permits three ordinary Grade 1 math editions.
 * PEP is our initial combination because both course volumes are available;
 * the catalog does not establish a single provincial edition for 2026.
 */
export function regionalMathematicsDefault(
  query: Omit<RegionalEditionQuery, 'subject' | 'volume'> & {
    subject: unknown;
    volume: unknown;
  },
): RegionalMathDefault | undefined {
  if (
    query.city ||
    query.school ||
    query.subject !== 'math' ||
    query.stage !== 'primary' ||
    query.grade !== 'p1' ||
    !['2025-2026', '2026-2027'].includes(query.academicYear) ||
    (query.volume !== 'upper' && query.volume !== 'lower')
  )
    return;
  if (query.province === 'jiangsu') return { edition: 'sujiao', evidence: [] };
  if (query.province === 'fujian')
    return {
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
      catalogYear: '2024',
      evidence: [
        {
          id: 'fujian-grade-one-math-catalog-2024',
          sourceUrl:
            'https://jyt.fujian.gov.cn/xxgk/zywj/202408/t20240812_6500947.htm',
          sourceTitle:
            '福建省教育厅关于做好2024年义务教育起始年级教材教辅征订工作的通知（附件印刷第5页）',
          publishedAt: '2024-08-12',
          checkedAt: '2026-10-04',
        },
      ],
    };
}
