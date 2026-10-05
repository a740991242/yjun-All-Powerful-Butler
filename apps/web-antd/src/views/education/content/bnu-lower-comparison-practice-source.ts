/** Independently inspected page facts; source preparation does not open a lesson. */
export const bnuLowerComparisonPracticeSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [54],
  status: 'source-checked',
  pageImages: [{ printedPage: 54, suffix: '058.jpg' }],
  sports: {
    reference: { activity: '跑步', quantity: 86, unit: '人' },
    candidates: [88, 12, 76],
    longJump: { description: '比跑步少得多', selected: 12, symbol: '○' },
    skipping: { description: '比跑步少一些', selected: 76, symbol: '✓' },
    boundary:
      '仅在本题三个候选和跑步86人条件下比较，不补造普遍差数或比例阈值；88大于86不符合少。图是给定情境，不冒自家班真实人数。',
  },
  ages: {
    reference: 37,
    candidates: [39, 50, 28],
    description: '差不多',
    selected: 39,
    boundary:
      '本题参照爸爸37岁，在三个候选中选较接近的39；差不多不是相等，也不规定所有年龄差2都算差不多，不采集家庭真实年龄。',
  },
  scores: {
    original: [
      { group: '淘气组', score: 95 },
      { group: '笑笑组', score: 88 },
      { group: '妙想组', score: 91 },
      { group: '奇思组', score: 79 },
    ],
    descending: [95, 91, 88, 79],
    orderedGroups: ['淘气组', '妙想组', '笑笑组', '奇思组'],
    comparisonSigns: ['>', '>', '>'],
    boundary:
      '按原要求从高到低，全部四卡各一次，保留分数与组名对应，不沿用前页从小到大；实际摆卡与网页填数分开，不冒真实班级比赛或重复把组名计为新分数。',
  },
  activities: [
    {
      page: 54,
      key: 'sports-candidates',
      task: '依据跑步86人分别用圈与勾选择跳远12、跳绳76并解释多寡方向',
    },
    {
      page: 54,
      key: 'age-candidates',
      task: '依据爸爸37岁与差不多，在39、50、28中选择39并说明本情境',
    },
    {
      page: 54,
      key: 'sort-four-scores',
      task: '实际按得分高低摆齐四组卡并填写95>91>88>79，说明完整分数组名对应',
    },
  ],
} as const;
