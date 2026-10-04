/** Read source facts only; no course release or teacher-review claim. */
export const bnuLowerAroundNumbersSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [44, 45],
  status: 'source-checked',
  counting: {
    oneAtATime: [18, 19, 20],
    nextAfterTwenty: 21,
    otherSequence: [27, 28, 29],
    nextAfterTwentyNine: 30,
    checkingMethods: ['一个一个', '两个两个', '五个五个'],
    boundary:
      '第44页散放花生未从低分辨率插画猜总数；第45页表示图另核对。分组检查不能遗漏余下不足一组的个数，不以堆大小判多少。',
  },
  circles: {
    fullRows: 6,
    perRow: 10,
    remaining: 2,
    eachRepresents: 1,
    representedPeanuts: 62,
    countBasis: '原图六整行各十圆，末行两圆；每圆一花生。',
  },
  triangles: {
    large: 7,
    small: 5,
    drawnMarkers: 12,
    representedPeanuts: 75,
    groupingInterpretation: { eachLargeRepresents: 10, eachSmallRepresents: 1 },
    boundary:
      '原话明确七十五，图有七大五小；大图标十、小图标一为结合数量解释的分组约定，不从大小普遍推每个大三角都代表十。十二个图标不当十二个花生。',
  },
  lifeExamples: {
    chessPieces: { value: 32, unit: '个' },
    crayons: { value: 36, unit: '支' },
    originalClass: { value: 36, unit: '名' },
    skippingRounds: [92, 94],
    skippingUnit: '次',
    boundary:
      '原课本班级三十六名不冒学习者班级人数；两轮跳绳数分别保留，不保证以后每轮次数相同。原任务是找数说数，不强加两轮和或减法计算。',
  },
  ownQuestions: {
    sourceExamples: ['本年级有多少人', '每轮跳绳次数会一样吗'],
    boundary:
      '原自主问题开放，不能要求必须两例；调查和真实数数另记录，计划不自动当实际结果。班级年级个人资料不要求上传。',
  },
  activities: [
    {
      page: 44,
      key: 'compare-before-count',
      task: '先讨论堆大小能否直接判断花生多少',
    },
    { page: 44, key: 'one-by-one', task: '一个一个数并继续二十及二十九后的数' },
    {
      page: 44,
      key: 'check-count',
      task: '用逐一、两两、五五分组重新检查个数',
    },
    {
      page: 45,
      key: 'represent-circles',
      task: '每圆一个，六行各十加余二表示六十二',
    },
    {
      page: 45,
      key: 'represent-triangles',
      task: '解释七大五小与七十五的分组约定并画图',
    },
    { page: 45, key: 'numbers-around', task: '四幅生活例子分别读数找数说单位' },
    {
      page: 45,
      key: 'own-question',
      task: '提出自己的想研究问题并区分计划与真实调查',
    },
  ],
} as const;
