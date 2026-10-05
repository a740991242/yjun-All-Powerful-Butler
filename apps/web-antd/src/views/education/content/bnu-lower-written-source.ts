/** Printed pages68–69 inspected in full; page69 rod matching and counter panels enlarged. Teaching is mapped separately to the six source activities. */
export const bnuLowerWrittenSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10763.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  readPrintedPages: [68, 69],
  pageImages: [
    { printedPage: 68, suffix: '072.jpg' },
    { printedPage: 69, suffix: '073.jpg' },
  ],
  rodConvention: {
    ones: '纵式',
    tens: '横式',
    boundary:
      '本两位位置约定：十位横筹每根表示一个十、个位纵筹每根表示一个一，按位置和式样一起读；不泛化任何横棒永远表示十，也不把算筹纵式与现代竖式名称混为一谈。',
  },
  addition: {
    values: [12, 31, 43],
    rodRows: [
      [1, 2],
      [3, 1],
      [4, 3],
    ],
    onesCalculation: [2, 1, 3],
    tensCalculation: [1, 3, 4],
    writtenIntermediateResult: [null, 3],
    writtenFinalResult: [4, 3],
  },
  subtraction: {
    values: [34, 22, 12],
    rodRows: [
      [3, 4],
      [2, 2],
      [1, 2],
    ],
    counterBefore: [3, 4],
    counterRemoved: [2, 2],
    counterAfter: [1, 2],
    onesCalculation: [4, 2, 2],
    tensCalculation: [3, 2, 1],
  },
  writtenBoundary:
    '个位和个位、十位和十位对齐，运算符在第二个数左边、结果在横线下。68页先写个位3、十位尚未填，下一幅才补十位4；空不写0，不把中间图当已完成。69减法个位4减2得2，十位3减2得1，不调换减数与被减数。',
  matching: {
    rodTop: {
      operation: '+',
      values: [23, 21, 44],
      rows: [
        [2, 3],
        [2, 1],
        [4, 4],
      ],
    },
    rodBottom: {
      operation: '−',
      values: [33, 21, 12],
      rows: [
        [3, 3],
        [2, 1],
        [1, 2],
      ],
    },
    writtenTop: { operation: '−', values: [33, 21, 12] },
    writtenBottom: { operation: '+', values: [23, 21, 44] },
    boundary:
      '左上算筹对应右下23+21=44，左下算筹对应右上33−21=12；按每行数位、数量和运算过程匹配，不按同一高低位置直接连。',
  },
  fourWrittenCalculations: [
    { operation: '+', values: [44, 32, 76] },
    { operation: '−', values: [54, 23, 31] },
    { operation: '+', values: [76, 23, 99] },
    { operation: '−', values: [68, 11, 57] },
  ],
  water: {
    bottlesBefore: 48,
    people: 36,
    bottlesPerPerson: 1,
    bottlesGiven: 36,
    bottlesRemaining: 12,
    unit: '瓶',
  },
  waterBoundary:
    '每人一瓶，36人需36瓶，48−36=12瓶。示意画出的几个人或瓶子不替给定总量；人和瓶单位不同，不作48人或36瓶余人，不要求真实购买分水。',
  activities: [
    { page: 68, key: 'rods-read-addition-and-places' },
    { page: 68, key: 'written-addition-stages-and-alignment' },
    { page: 69, key: 'subtraction-rods-counter-written' },
    { page: 69, key: 'both-cross-matches' },
    { page: 69, key: 'all-four-written-calculations' },
    { page: 69, key: 'one-bottle-per-person-remaining' },
  ],
} as const;
