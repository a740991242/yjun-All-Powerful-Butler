/** Printed pages were inspected; source inspection alone does not release a course. */
export const bnuLowerRedFruitSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [50, 51],
  status: 'source-checked',
  pageImages: [
    { printedPage: 50, suffix: '054.jpg' },
    { printedPage: 51, suffix: '055.jpg' },
  ],
  imageBoundary:
    '章节入口漏列第51页；按相邻公开图片路径找到055并实际查看印刷页码51，不由路径序号推断内容已读。第三方扫描不冒出版社官方，版权版次印次未知项保留。',
  story: {
    fruitCounts: [21, 18],
    countUp: [18, 19, 20, 21],
    benchmark: 20,
    larger: 21,
    boundary:
      '给定数量21和18，不数树上装饰红果或角色身上的线条；从18接数到21和借20作参照是两种比较方法。',
  },
  doAndFill: {
    materialCounts: [21, 18],
    counterCounts: [21, 18],
    relation: '>',
    boundary:
      '小棒方块与计数器分别表示同一个21、同一个18，不能合成42与36；实际做、填写与解释独立记录。',
  },
  writeCompare: [
    { values: [32, 34], relation: '<' },
    { values: [100, 99], relation: '>' },
  ],
  counterBoundary:
    '比较数位表示的数，不比较珠子颗数；百位一珠表示100，大于两杆各九珠表示的99。已知空杆是0，未知杆不猜0。',
  ruler: {
    values: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    prompts: ['45 < □', '90 > □'],
    boundary:
      '数线从左到右递增，图示刻度相隔5；开放填数不限定只能填图上5的倍数，也不把一个例子当唯一答案。',
  },
  practiceCompare: [
    { values: [45, 54], relation: '<' },
    { values: [79, 80], relation: '<' },
    { values: [100, 89], relation: '>' },
  ],
  practiceOpen: ['15 < □', '□ > 89', '□ < 30', '80 > □'],
  openBoundary:
    '原题未另设统一填数上限；本站若限定0～100须明说网页范围，所有符合严格大小条件的整数均可，等于不合，0符合条件时可用。不把网页范围扩大为原题限定。',
  connect: {
    cards: [8, 29, 73, 62, 59, 100, 55, 17, 86],
    pivot: 60,
    less: [8, 29, 59, 55, 17],
    greater: [73, 62, 100, 86],
    boundary:
      '九卡全部按同一60标准连线；严格小于与大于均不含60，不把同数卡分到两边，也不由未连线推为0。',
  },
  activities: [
    {
      page: 50,
      key: 'compare-story',
      task: '用接数与20参照两种方法比较给定红果21和18，说明谁多',
    },
    {
      page: 50,
      key: 'do-and-fill',
      task: '实际做21与18，填写完整比较式并说明材料与计数器是同数不同表示',
    },
    {
      page: 50,
      key: 'write-and-compare',
      task: '两组计数器各完整写数并比较32与34、100与99，按数位而非珠数',
    },
    {
      page: 51,
      key: 'number-ruler',
      task: '观察35至100每5递增数线，分别填45<空、90>空，解释大小位置',
    },
    {
      page: 51,
      key: 'practice-compare',
      task: '三组全部比较45与54、79与80、100与89，写数及符号',
    },
    {
      page: 51,
      key: 'practice-open',
      task: '四处开放填数分别满足15<空、空>89、空<30、80>空，并解释多种合法填法',
    },
    {
      page: 51,
      key: 'connect-all',
      task: '全部九卡与60比较，完整连向小于或大于的家，解释两类和等于边界',
    },
  ],
} as const;
