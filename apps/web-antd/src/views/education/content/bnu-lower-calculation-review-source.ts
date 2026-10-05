export const bnuLowerCalculationReviewSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10763.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  readPrintedPages: [74, 75],
  pageImages: [
    {
      printedPage: 74,
      suffix: '078.jpg',
    },
    {
      printedPage: 75,
      suffix: '079.jpg',
    },
  ],
  title: '整理与复习',
  harvest: [
    {
      left: 15,
      operation: '+',
      right: 4,
      result: 19,
    },
    {
      left: 35,
      operation: '+',
      right: 24,
      result: 59,
    },
    {
      left: 15,
      operation: '−',
      right: 4,
      result: 11,
    },
    {
      left: 35,
      operation: '−',
      right: 24,
      result: 11,
    },
  ],
  problemBank: {
    question: '个位上的数不够减，怎么办？30−4=?',
    status: 'original-open-question',
    siteExplorationResult: 26,
  },
  counterPractice: [
    {
      left: 7,
      operation: '+',
      right: 60,
      result: 67,
    },
    {
      left: 76,
      operation: '−',
      right: 14,
      result: 62,
    },
    {
      left: 20,
      operation: '+',
      right: 43,
      result: 63,
    },
    {
      left: 57,
      operation: '−',
      right: 3,
      result: 54,
    },
  ],
  verticalPractice: [
    {
      left: 78,
      operation: '−',
      right: 32,
      result: 46,
    },
    {
      left: 65,
      operation: '+',
      right: 34,
      result: 99,
    },
    {
      left: 56,
      operation: '+',
      right: 23,
      result: 79,
    },
    {
      left: 99,
      operation: '−',
      right: 35,
      result: 64,
    },
  ],
  baskets: {
    target: 68,
    expressions: [
      {
        left: 78,
        operation: '−',
        right: 10,
        result: 68,
      },
      {
        left: 52,
        operation: '+',
        right: 12,
        result: 64,
      },
      {
        left: 44,
        operation: '+',
        right: 24,
        result: 68,
      },
      {
        left: 32,
        operation: '+',
        right: 36,
        result: 68,
      },
      {
        left: 57,
        operation: '+',
        right: 21,
        result: 78,
      },
      {
        left: 89,
        operation: '−',
        right: 21,
        result: 68,
      },
      {
        left: 99,
        operation: '−',
        right: 31,
        result: 68,
      },
      {
        left: 98,
        operation: '−',
        right: 30,
        result: 68,
      },
    ],
    matchedPositions: [1, 3, 4, 6, 7, 8],
  },
  comparisons: [
    {
      left: [87, '+', 10],
      right: [78, '+', 10],
      sign: '>',
    },
    {
      left: [46, '−', 5],
      right: [46, '−', 4],
      sign: '<',
    },
    {
      left: [72, '+', 6],
      right: [71, '+', 6],
      sign: '>',
    },
    {
      left: [34, '+', 23],
      right: [41, '+', 16],
      sign: '=',
    },
    {
      left: [86, '−', 40],
      right: [86, '−', 4],
      sign: '<',
    },
    {
      left: [96, '−', 50],
      right: [6, '+', 50],
      sign: '<',
    },
  ],
  shopping: {
    prices: [42, 30, 23, 6],
    buyPositions: [1, 4],
    buyTotal: 48,
    availableMoney: 20,
    wantedPosition: 3,
    shortfall: 3,
  },
  clothes: {
    budget: 100,
    prices: [46, 52, 34, 53, 41],
    originalTask: '想出一种买法',
    siteOutfitConvention: '一件上衣（①②③）与一条裤子（④⑤）；不强制买光100元',
    legalPositionPairs: [
      [1, 4],
      [1, 5],
      [2, 5],
      [3, 4],
      [3, 5],
    ],
    totals: [99, 87, 93, 87, 75],
    changes: [1, 13, 7, 13, 25],
  },
  boundary:
    '四原收获算式与四计数器题及四竖式分别完整计算，不用同值结果合并任务。30−4是原开放问题银行，不冒原书已给完整退位算法；本站探索解答26须单列。篮八式中六式等68，其它64和78不连；比较原两列按本站先上到下每行左再右顺序，共六项，原可不同阅读序。购物按四商品原价与所求，20买23问还差3，不问找回负3；自主提出另一个完整数学问题实际人工。原预算100想一种买法，本站上衣加裤子约定明示，接受所有五合法组合，不强制花完或只认示例99，105超预算。原纸面/拨珠/口述/实际连线/新问题与模拟购物各真实确认，开放问题/收获/计划分别null，不要求真实购买或零花钱披露。版印未知与教材来源第三方保持。',
  activities: [
    {
      page: 74,
      key: 'harvest-four-equations-and-own-method-map',
    },
    {
      page: 74,
      key: 'open-problem-bank-thirty-minus-four',
    },
    {
      page: 74,
      key: 'four-counter-practice-equations',
    },
    {
      page: 74,
      key: 'all-four-written-equations',
    },
    {
      page: 75,
      key: 'all-eight-baskets-and-six-matches',
    },
    {
      page: 75,
      key: 'all-six-comparisons',
    },
    {
      page: 75,
      key: 'four-prices-buy-two-and-shortfall-and-own-question',
    },
    {
      page: 75,
      key: 'one-outfit-within-hundred-budget',
    },
  ],
} as const;
