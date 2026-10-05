/** Printed pages 66–67 inspected in full, with page67 arrow panels enlarged. Course implementation is maintained separately. */
export const bnuLowerFrogsSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10763.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  readPrintedPages: [66, 67],
  pageImages: [
    { printedPage: 66, suffix: '070.jpg' },
    { printedPage: 67, suffix: '071.jpg' },
  ],
  frogs: { large: 65, small: 32, unit: '只' },
  addition: {
    values: [65, 32, 97],
    sequential: [
      [65, 30, 95],
      [95, 2, 97],
    ],
    byPlace: [
      [60, 30, 90],
      [5, 2, 7],
      [90, 7, 97],
    ],
    counterBefore: [6, 5],
    counterAdded: [3, 2],
    counterAfter: [9, 7],
    boundary:
      '十位与个位分别表示十和一；相同数位计算。新增3十/2一与表示值32分清，不把计数器实体珠数当虫子只数。',
  },
  comparison: {
    values: [65, 32, 33],
    sequential: [
      [65, 30, 35],
      [35, 2, 33],
    ],
    byPlace: [
      [60, 30, 30],
      [5, 2, 3],
      [30, 3, 33],
    ],
    counterBefore: [6, 5],
    counterRemoved: [3, 2],
    counterAfter: [3, 3],
    boundary:
      '小青蛙比大青蛙少多少，差用大65减小32；不是小32减大65，也不是青蛙真的吐出/丢弃32。两条给定已吃量比较，不补未来继续吃的事件。',
  },
  fourDiscussionCalculations: [
    { operation: '+', values: [36, 3, 39] },
    { operation: '−', values: [57, 4, 53] },
    { operation: '−', values: [65, 31, 34] },
    { operation: '+', values: [41, 47, 88] },
  ],
  fourCounterCalculations: [
    { operation: '+', values: [46, 23, 69] },
    { operation: '−', values: [37, 25, 12] },
    { operation: '−', values: [45, 24, 21] },
    { operation: '+', values: [56, 42, 98] },
  ],
  numberLines: [
    {
      labels: [37, 47, 57, 67, 77, 87],
      start: 37,
      firstJump: 30,
      intermediate: 67,
      secondJump: 2,
      end: 69,
      combinedChange: 32,
      operation: '+',
    },
    {
      labels: [26, 36, 46, 56, 66, 76],
      start: 76,
      firstJump: 40,
      intermediate: 36,
      secondJump: 3,
      end: 33,
      combinedChange: 43,
      operation: '−',
    },
  ],
  numberLineBoundary:
    '两段箭头按真实起点和顺序读。37加30到67再加2到69，合加32；76减40到36再减3到33，合减43。69位于67与77之间、33位于26与36之间，原图没有额外打印69/33刻度，不把中间67/36当最终结果，也不把两图最左刻度都当起点。',
  piano: { black: 36, white: 52, total: 88, unit: '个' },
  bus: { before: 23, left: 12, remaining: 11, unit: '人' },
  applicationBoundary:
    '钢琴按原给定36黑键与52白键合88，不从简图逐键猜数，也不推任何键盘都有同样键数。车上原23人、12人到站下车，按同一给定口径减得11，不补未说明的新上车或司机人数。',
  activities: [
    { page: 66, key: 'addition-three-methods' },
    { page: 66, key: 'comparison-three-methods' },
    { page: 67, key: 'four-calculations-and-place-discussion' },
    { page: 67, key: 'four-counter-calculations' },
    { page: 67, key: 'both-two-jump-lines' },
    { page: 67, key: 'piano-key-parts-total' },
    { page: 67, key: 'bus-departure-remaining' },
  ],
} as const;
