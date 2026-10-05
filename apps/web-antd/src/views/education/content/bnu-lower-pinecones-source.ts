/** Printed pages 64–65 inspected in full. Course implementation is maintained separately. */
export const bnuLowerPineconesSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10763.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  readPrintedPages: [64, 65],
  pageImages: [
    { printedPage: 64, suffix: '068.jpg' },
    { printedPage: 65, suffix: '069.jpg' },
  ],
  picked: { mother: 45, child: 3, father: 30, unit: '个' },
  addition: {
    values: [45, 3, 48],
    countAfter45: [46, 47, 48],
    tens: 4,
    looseBefore: 5,
    looseAdded: 3,
    looseAfter: 8,
    associatedEquations: [
      [3, 5, 8],
      [40, 8, 48],
    ],
  },
  comparison: {
    values: [45, 30, 15],
    countBackwardByTen: [35, 25, 15],
    tensBefore: 4,
    tensRemoved: 3,
    tensAfter: 1,
    looseUnchanged: 5,
    associatedEquations: [
      [40, 30, 10],
      [10, 5, 15],
    ],
    boundary:
      '妈妈比爸爸多采15个，是比较差；不是妈妈拿走30个。45往前按十数三次，与个位减3的42不能混。',
  },
  interpretEquations: [
    { operation: '−', values: [45, 3, 42], meaning: '妈妈比小松鼠多采多少个' },
    { operation: '+', values: [45, 30, 75], meaning: '妈妈和爸爸一共采多少个' },
  ],
  stickCalculations: [
    { operation: '+', values: [32, 5, 37] },
    { operation: '−', values: [75, 40, 35] },
    { operation: '−', values: [78, 6, 72] },
    { operation: '+', values: [68, 30, 98] },
  ],
  numberLines: [
    {
      labels: [21, 22, 23, 24, 25, 26],
      start: 22,
      jump: 3,
      end: 25,
      operation: '+',
    },
    {
      labels: [49, 59, 69, 79, 89, 99],
      start: 89,
      jump: 30,
      end: 59,
      operation: '−',
    },
  ],
  eightCalculations: [
    { operation: '+', values: [4, 65, 69] },
    { operation: '−', values: [85, 30, 55] },
    { operation: '+', values: [40, 4, 44] },
    { operation: '+', values: [72, 5, 77] },
    { operation: '−', values: [67, 2, 65] },
    { operation: '+', values: [36, 50, 86] },
    { operation: '−', values: [44, 40, 4] },
    { operation: '−', values: [77, 5, 72] },
  ],
  swans: { before: 55, arrived: 20, after: 75, unit: '只' },
  dinosaurs: { large: 25, small: 2, difference: 23, unit: '米' },
  boundary:
    '不进位/不退位时相同数位计算，个位变化与整十变化分别说明；两数线以箭头起点而非左边刻度列式。天鹅给定55与又飞来20，不按示意图只数画出的鸟替代给定总量。恐龙比较同单位身长，不能按绘画比例量米或把长多少算成总长。',
  activities: [
    { page: 64, key: 'mother-child-addition-three-methods' },
    { page: 64, key: 'mother-father-comparison-three-methods' },
    { page: 65, key: 'interpret-two-equations' },
    { page: 65, key: 'four-stick-calculations' },
    { page: 65, key: 'both-arrow-lines' },
    { page: 65, key: 'all-eight-calculations' },
    { page: 65, key: 'swans-arrival-total' },
    { page: 65, key: 'dinosaurs-length-difference' },
  ],
} as const;
