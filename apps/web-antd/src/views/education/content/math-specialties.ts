import type { Lesson, Volume } from '../learning/types';

type Group = [id: string, title: string, goal: string, lessons: string[]];
const upperGroups: Group[] = [
  [
    'count',
    '数数与数序',
    '点数、接着数、前后顺序与第几。',
    [
      'mu-count',
      'mu-five',
      'mu-ten',
      'mu-five-sequence',
      'mu-ten-sequence',
      'mu-twenty-sequence',
      'mu-ordinal',
      'mu-twenty-bundles',
      'mu-twenty-positions',
      'mu-final-grids',
    ],
  ],
  [
    'compare',
    '比较与分合',
    '一一对应比多少，用不同分法理解整体与部分。',
    [
      'mu-compare',
      'mu-partition',
      'mu-five-compare',
      'mu-five-partition',
      'mu-ten-compare',
      'mu-ten-partition',
      'mu-twenty-compare',
    ],
  ],
  [
    'calculation',
    '20以内数与计算',
    '数位、0、基础加减、连加连减及凑十进位。',
    [
      'mu-zero',
      'mu-five-add',
      'mu-five-sub',
      'mu-ten-addsub',
      'mu-chain',
      'mu-twenty-place',
      'mu-twenty-addsub',
      'mu-twenty-bundles',
      'mu-twenty-links',
      'mu-carry-nine',
      'mu-carry-eight',
      'mu-carry-small',
      'mu-carry-process',
      'mu-carry-organize',
      'mu-final-grids',
      'mu-final-links',
    ],
  ],
  [
    'shapes',
    '立体图形辨认与操作',
    '从外形与特征辨认立体图形，记录实际操作和自己的观察。',
    ['mu-solid', 'mu-solid-observe', 'mu-solid-build', 'mu-final-links'],
  ],
  [
    'relations',
    '图示与数量关系',
    '联系整体和部分，理解图示与生活问题。',
    [
      'mu-story',
      'mu-review-story',
      'mu-twenty-positions',
      'mu-twenty-links',
      'mu-carry-relations',
      'mu-carry-organize',
      'mu-final-links',
    ],
  ],
];
const lowerGroups: Group[] = [
  [
    'numbers',
    '100以内数感',
    '十位个位、数序与比较，联系数的组成。',
    [
      'ml-hundred-place',
      'ml-hundred-compare',
      'ml-hundred-sequence',
      'ml-hundred-chart',
    ],
  ],
  [
    'borrowing',
    '20以内退位减法',
    '结合破十与想加算减，练习不同退位组合。',
    ['ml-borrow-nine', 'ml-borrow-eight', 'ml-borrow-small'],
  ],
  [
    'calculation',
    '100以内口算与笔算',
    '比较口算和竖式策略，注意进位、退位与数位对齐。',
    ['ml-oral-add', 'ml-oral-sub', 'ml-written-add', 'ml-written-sub'],
  ],
  [
    'shapes',
    '平面图形辨认与拼组',
    '辨认平面图形，观察拼组后的外轮廓。',
    ['ml-flat', 'ml-flat-join', 'ml-plane-observe', 'ml-plane-build'],
  ],
  [
    'money',
    '人民币与购物',
    '换算元角分，计算金额并解决原创购物问题。',
    ['ml-money', 'ml-shop', 'ml-shopping-practice'],
  ],
  [
    'relations',
    '数量关系与生活应用',
    '联系加减法，用图示理解整体、部分与差。',
    ['ml-relations', 'ml-review-story'],
  ],
];

export function mathSpecialties(volume: Volume, lessons: Lesson[]): Lesson[] {
  const available = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  return (volume === 'upper' ? upperGroups : lowerGroups).map(
    ([id, title, goal, ids]) => {
      const sources = ids.map((lessonId) => {
        const source = available.get(lessonId);
        if (!source || source.status !== 'available')
          throw new Error(`Missing specialty source: ${lessonId}`);
        return source;
      });
      let version = 1;
      if (
        id === 'shapes' ||
        (volume === 'lower' && id === 'money') ||
        (volume === 'upper' &&
          ['calculation', 'count', 'relations'].includes(id))
      )
        version = 2;
      if (volume === 'upper' && ['count', 'shapes'].includes(id)) version = 3;
      if (volume === 'upper' && ['calculation', 'relations'].includes(id))
        version = 4;
      return {
        id: `ms-${volume}-${id}`,
        textbookTitle: '平台专项练习',
        title,
        goal,
        page: Math.min(...sources.map((source) => source.page)),
        prerequisite: '可以按学校当前进度自由选择，不要求完成全部原课包。',
        parentTip:
          '本专项复用对应课包已编写的题目，不冒充从未见过的新题或完整教材测验。',
        version,
        status: 'available',
        steps: [{ title: '先选练习范围', text: goal }],
        questions: sources.flatMap((source) => source.questions),
        reviewQuestions: sources.flatMap(
          (source) => source.reviewQuestions ?? [],
        ),
        review: {
          date: '2026-09-30',
          reviewer: '课包范围组织与程序校验',
          notes: `复用原创课包：${sources.map((source) => `${source.title}（教材第${source.page}页起）`).join('；')}。保留每道题的原ID和知识点，专项不是教材正式单元。`,
        },
      };
    },
  );
}
