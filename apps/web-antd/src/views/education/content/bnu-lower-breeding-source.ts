/** Source facts from inspected printed pages; teaching remains a separate deliverable. */
export const bnuLowerBreedingSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [52, 53],
  status: 'source-checked',
  pageImages: [
    { printedPage: 52, suffix: '056.jpg' },
    { printedPage: 53, suffix: '057.jpg' },
  ],
  givenAnimals: [
    { name: '鸡', quantity: 100, unit: '只' },
    { name: '鹅', quantity: 22, unit: '只' },
    { name: '鸭', quantity: 92, unit: '只' },
  ],
  animalBoundary:
    '按原标签数量，不从缩略动物画的只数代替给定100、22、92；第52页兔尚无数量标签，第53页才由四候选及完整回应确定97，不把前页未知当0。',
  firstLine: {
    ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    markedValues: [22, 92, 100],
  },
  language: [
    { comparison: '鸡鸭鹅三种中谁最多', value: '鸡' },
    { comparison: '鸡鸭鹅三种中谁最少', value: '鹅' },
    { comparison: '鸡比鹅', value: '多得多' },
    { comparison: '鸡比鸭', value: '多一些' },
    { comparison: '鸭比鸡', value: '少一些' },
    { comparison: '鹅比鸡', value: '少得多' },
    { comparison: '鸡和鸭的数量', value: '差不多' },
  ],
  languageBoundary:
    '定性词限定给定情境，不从此补造普遍的固定差数或比例阈值；比较对象反向时多和少也反向，未获数量前不把兔放进三种最多最少。',
  sheep: {
    reference: '鹅',
    referenceQuantity: 22,
    description: '差不多',
    candidates: [70, 26, 3],
    selected: 26,
    boundary:
      '候选选择只基于本题与22比较，不冒已经数过真实羊，也不把26当原图羊群点数。',
  },
  rabbit: {
    candidates: [18, 26, 90, 97],
    firstGuess: 18,
    firstReply: '比18多得多',
    remainingAfterClue: [90, 97],
    nextGuess: 90,
    nextReply: '不是',
    finalGuess: 97,
    finalReply: '你猜对了',
    boundary:
      '完整回应与已给四候选共同确定97；只听多得多不能在90和97中唯一确定，也不从未标兔插图直接点数为97。',
  },
  sort: {
    originalOrder: [50, 98, 38, 10, 51],
    ascending: [10, 38, 50, 51, 98],
    methods: ['每次从剩下的数中找最小', '先比较前两个再逐个插入已有顺序'],
    secondLineTicks: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    markedValues: [10, 38, 50, 51, 98],
    boundary:
      '五卡全部排一次；50与51两点相邻但不是同一个数，98在90与100之间，越右越大。原示例方法未写完的过程需要实际完成，不把示范省略当漏掉另两卡。',
  },
  activities: [
    {
      page: 52,
      key: 'observe-three',
      task: '观察并按给定标签比较鸡100、鹅22、鸭92，说明这三种中最多与最少',
    },
    {
      page: 52,
      key: 'line-and-language',
      task: '指22、92、100在数线位置，分别说多得多、多一些、少一些、少得多和差不多',
    },
    {
      page: 52,
      key: 'sheep-candidates',
      task: '在70、26、3中依据与鹅22差不多选择26，并解释本情境',
    },
    {
      page: 53,
      key: 'rabbit-clues',
      task: '完整依18提问、相对提示、90否定和97确认逐步排除，分清暂余两数与最终确定',
    },
    {
      page: 53,
      key: 'sort-five',
      task: '实际将50、98、38、10、51全部按从小到大排列',
    },
    {
      page: 53,
      key: 'two-methods',
      task: '实际解释每次找剩下最小与逐个插入两种方法，各完成五卡排序',
    },
    {
      page: 53,
      key: 'mark-line',
      task: '在数线上标10、38、50、51、98全部五数，辨50与51不同点并说越右越大',
    },
  ],
} as const;
