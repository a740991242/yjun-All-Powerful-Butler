import type { RegionalEditionQuery } from './regional-editions';

export interface RegionalDefaultSource {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  publishedAt: string;
  issuedAt?: string;
  checkedAt: string;
}
export interface RegionalMathDefault {
  edition: 'pep-2024' | 'sujiao';
  evidence: RegionalDefaultSource[];
  alternatives?: ('bnu-2024' | 'pep-2024' | 'sujiao')[];
  catalogYear?: string;
  catalogKind?: 'digital';
}

/** Product combinations are distinct from verified adoption at any school.
 * The Fujian 2024 catalog permits three ordinary Grade 1 math editions.
 * PEP is our initial combination because both course volumes are available;
 * the catalog does not establish a single provincial edition for 2026.
 * Hunan's 2025 autumn price catalog covers the upper volume only; its
 * alternatives must not be inherited by an unverified lower volume.
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
  if (query.province === 'anhui' && query.volume === 'upper')
    return {
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
      catalogYear: '2025',
      evidence: [
        {
          id: 'anhui-grade-one-math-upper-catalog-2025',
          sourceUrl:
            'https://www.jiuhuashan.gov.cn/OpennessContent/show/1675041.html',
          sourceTitle:
            '安徽省2025年秋季中小学教材零售价格通知（皖发改价费〔2025〕433号，附件第68、74、80项，一年级数学上册）',
          issuedAt: '2025-08-15',
          publishedAt: '2025-08-20',
          checkedAt: '2026-10-06',
        },
      ],
    };
  if (query.province === 'henan') {
    const upper = query.volume === 'upper';
    return {
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
      catalogYear: '2025',
      catalogKind: 'digital',
      evidence: [
        {
          id: `henan-grade-one-math-${query.volume}-digital-catalog-2025`,
          sourceUrl: upper
            ? 'https://pdsyx.zfcg.henan.gov.cn/cmsweb81e27e/nas/webfile2024/henan/rootfiles/2025/05/09/8993a114d7d74ce2bc515b627698f204.pdf'
            : 'https://sanmenxia.zfcg.henan.gov.cn/cmsweb81e27e/henan/rootfiles/2024/11/18/46ca9c21f429404a90a55568df927080.pdf',
          sourceTitle: upper
            ? '河南省中小学2025年秋季电教教材推荐目录（教资保〔2025〕100号，印刷第4页数字教材学生用，一年级上册17100003～17100005）'
            : '河南省中小学2025年春季电教教材推荐目录（教资保〔2024〕347号，印刷第4页数字教材学生用，一年级下册17100003～17100005）',
          publishedAt: '',
          issuedAt: upper ? '2025-04-25' : '2024-11-05',
          checkedAt: '2026-10-06',
        },
      ],
    };
  }
  if (query.province === 'hubei' && query.volume === 'upper')
    return {
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'bnu-2024'],
      catalogYear: '2025',
      evidence: [
        {
          id: 'hubei-grade-one-math-upper-catalog-2025',
          sourceUrl:
            'https://fgw.hubei.gov.cn/fbjd/zc/zcwj/gg/202508/P020250829700876060881.pdf',
          sourceTitle:
            '湖北省2025年秋季中小学教科书零售价格表（附件1印刷第2、22页，第14、372项，一年级数学上册）',
          // The attachment establishes the catalog year, not its publication date.
          publishedAt: '',
          checkedAt: '2026-10-06',
        },
      ],
    };
  if (query.province === 'hubei' && query.volume === 'lower')
    return {
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'bnu-2024'],
      catalogYear: '2026',
      evidence: [
        {
          id: 'hubei-grade-one-math-lower-catalog-2026',
          sourceUrl:
            'https://jyt.hubei.gov.cn/zfxxgk/zc_GK2020/qtzdgkwj_GK2020/202602/t20260224_5879252.shtml',
          sourceTitle:
            '湖北省2026年春季中小学教科书及教辅材料零售价格公告（附件1第13、339项，一年级数学下册）',
          publishedAt: '2026-02-12',
          checkedAt: '2026-10-04',
        },
      ],
    };
  if (query.province === 'shanxi')
    return {
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'sujiao', 'bnu-2024'],
      catalogYear: '2024',
      evidence: [
        {
          id: 'shanxi-grade-one-math-catalog-2024',
          sourceUrl:
            'https://xxgk.yczf.gov.cn/xzf/ycjyj/fdzdgknr/gzdt/202409/P020240909607430404832.pdf',
          sourceTitle:
            '山西省2024学年教学用书目录（晋教基〔2024〕9号，阳城县转载PDF第15页，数学一年级上下册按选用市分列）',
          publishedAt: '2024-09-09',
          checkedAt: '2026-10-04',
        },
      ],
    };
  if (query.province === 'hunan' && query.volume === 'upper')
    return {
      edition: 'pep-2024',
      alternatives: ['pep-2024', 'sujiao'],
      catalogYear: '2025',
      evidence: [
        {
          id: 'hunan-grade-one-math-upper-catalog-2025',
          sourceUrl:
            'https://fgw.yzcity.gov.cn/fgw/031005/202509/820220824b5e42d2bd0511558b8de68b.shtml',
          sourceTitle:
            '湖南省关于核定2025年秋季中小学教科书价格的通知（湘发改价费〔2025〕558号，永州市发改委转载，附件1一年级第3、4项）',
          publishedAt: '2025-09-09',
          checkedAt: '2026-10-04',
        },
      ],
    };
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
