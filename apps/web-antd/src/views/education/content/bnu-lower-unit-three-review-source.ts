/** Observed public scans, distinct from course release and final teacher review. */
export const bnuLowerUnitThreeReviewSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10761.html',
  printedPages: [41, 42, 43],
  checkedAt: '2026-10-05',
  status: 'source-checked',
  teachingBoundary:
    '来源已读不自动开放课程；第41页与42～43页的教学状态分别以课程目录和逐课映射为准。',
  finalTeacherReview: 'not-verified',
  images: [
    {
      printedPage: 41,
      url: 'https://images.szxuexiao.com/uploadimages/keben2026/bsd1njsuxue_x_2024/bsd1njsuxue_x_2024-045.jpg',
    },
    {
      printedPage: 42,
      url: 'https://images.szxuexiao.com/uploadimages/keben2026/bsd1njsuxue_x_2024/bsd1njsuxue_x_2024-046.jpg',
    },
    {
      printedPage: 43,
      url: 'https://images.szxuexiao.com/uploadimages/keben2026/bsd1njsuxue_x_2024/bsd1njsuxue_x_2024-047.jpg',
    },
  ],
  plants: { jun: 13, ning: 6, difference: 7, unit: '种' },
  methods: {
    splitPart: {
      whole: 13,
      part: 6,
      pieces: [3, 3],
      intermediate: 10,
      remaining: 7,
    },
    splitWhole: { whole: 13, pieces: [10, 3], tenRemaining: 4, remaining: 7 },
    counter: {
      initialTens: 1,
      initialOnes: 3,
      exchangedTens: 0,
      exchangedOnes: 13,
      remove: 6,
      remaining: 7,
    },
  },
  stories: { hats: 13, glovePairs: 6, parkingPlaces: 13, cars: 6 },
  openQuestion: {
    whole: 25,
    part: 9,
    result: 16,
    boundary: '原问题银行的拓展问题，不误称20以内原数；新问题需实际说明方法。',
  },
  circledPictures: [
    { group: '蘑菇', whole: 13, remove: 8, remaining: 5 },
    { group: '辣椒', whole: 15, remove: 9, remaining: 6 },
  ],
  numberLine: { whole: 18, part: 9, remaining: 9, marks: [5, 19] },
  calculations: [
    [15, 7],
    [16, 7],
    [12, 6],
    [17, 4],
    [15, 8],
    [16, 8],
    [16, 4],
    [14, 7],
    [15, 9],
    [16, 9],
    [16, 6],
    [14, 6],
  ],
  furniture: {
    chairs: 14,
    tables: 9,
    missingTables: 5,
    countBasis: '椅子后六、中六、下二；桌子上三、中三、下三，各件只数一次。',
  },
  shuttleKicks: { lan: 5, gang: 7, fang: 13, requiredOwnQuestions: 2 },
  factFamilies: [
    [5, 9, 14],
    [4, 8, 12],
    [6, 7, 13],
  ],
  animals: {
    groups: ['虾形图标', '褐色小壳图标', '大蟹图标'],
    counts: [10, 6, 2],
    comparison: [10, 6, 4],
    addition: [10, 2, 12],
    countBasis:
      '上方十个独立虾形身体，底部褐色小壳左二、中一、右三共六，两只大蟹各一身体；钳子不另算。',
    boundary:
      '按原三种图标分组，不由模糊壳图断言现实动物种类；不是三只大蟹，也不是乌龟图。',
  },
  freeEquations: {
    results: [12, 14],
    shownSlotsEach: 3,
    boundary:
      '三个展示槽不是可说算式总数上限；原开放问题无运算数上限，网页有限练习范围须明示，不替代纸面更多合理式。',
  },
  activities: [
    {
      page: 41,
      key: 'plants-methods',
      task: '13与6植物比较及两种退位方法/计数器',
    },
    { page: 41, key: 'stories', task: '用13−6提出帽手套、停车或其它完整问题' },
    { page: 41, key: 'own-question', task: '问题银行25−9方法拓展与自己的问题' },
    { page: 42, key: 'circle', task: '两图圈算13−8与15−9' },
    { page: 42, key: 'number-line', task: '18−9完整画数线' },
    { page: 42, key: 'calculations', task: '十二式全部计算' },
    { page: 42, key: 'furniture', task: '14椅8桌每椅配一桌求缺' },
    {
      page: 42,
      key: 'own-kicks',
      task: '5/7/13踢毽信息，自主提出两个数学问题并计算',
    },
    { page: 43, key: 'families', task: '三组数各完整两加两减' },
    { page: 43, key: 'animals', task: '三图标数量、求差、合计和再提一个问题' },
    {
      page: 43,
      key: 'free-equations',
      task: '得12与得14的三槽各填并说更多合理算式',
    },
  ],
} as const;
