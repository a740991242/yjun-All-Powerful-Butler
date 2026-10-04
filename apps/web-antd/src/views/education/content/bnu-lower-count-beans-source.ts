/** Inspected source facts; authored teaching is audited separately. */
export const bnuLowerCountBeansSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [48, 49],
  status: 'source-checked',
  estimate: {
    firstEstimate: 50,
    firstCount: 28,
    secondEstimate: 20,
    secondCount: 22,
    boundary:
      '先抓先估再完整数，原两人数量不当学习者结果，不能先数倒填估计；差不多是原说法，不设普遍固定误差阈值。',
  },
  firstCounters: [
    { tens: 2, ones: 8, whole: 28 },
    { tens: 2, ones: 2, whole: 22 },
  ],
  nextCounters: [
    { hundreds: 0, tens: 9, ones: 7, whole: 97 },
    { hundreds: 0, tens: 9, ones: 8, whole: 98 },
    { hundreds: 0, tens: 9, ones: 9, whole: 99 },
    { hundreds: 1, tens: 0, ones: 0, whole: 100 },
  ],
  beadBoundary:
    '百位一珠代表一百，不是全数只一件；数位上的珠数与表示值不同，100两个0为确定没有十和一，不改变原digit-counter每杆最多9珠契约。',
  thinkTry: {
    given: 42,
    tens: 4,
    ones: 2,
    rods: 4,
    cubes: 2,
    toMake: 34,
    boundary:
      '42材料与计数器是同一数的两种表示，不合成84；34原位置空白需要真实摆拨写，不冒已有三棒四块。',
  },
  practice26: {
    whole: 26,
    tens: 2,
    ones: 6,
    bundlesShown: 2,
    boundary:
      '原右计数器两十六一，左两小捆示意不代表已经显示全部六单根；需实际做与填。',
  },
  lifeRead: [
    {
      printedNumber: '二十七',
      value: 27,
      unit: '次',
      context: '原书神舟十五号飞船完成我国载人航天工程第二十七次飞行任务',
    },
    {
      printedNumber: '九十九',
      value: 99,
      unit: '道弯',
      context: '原书天门山盘山公路有九十九道弯',
    },
  ],
  lifeReadBoundary:
    '按教材给定历史描述读、画横线、分别画珠并写数，不冒当前最新航天次数；两个数不同对象，次数不是飞船数量。',
  lifeHundred: [
    {
      mark: '100',
      meaning: '书页页码',
      boundary: '页码标记不证明全书恰有100页或已读100页',
    },
    {
      mark: '100号',
      meaning: '地址门牌号码',
      boundary: '号码不代表该处有100人或100栋房',
    },
    {
      mark: '100片',
      meaning: '包装标示片数',
      boundary: '只识读原标签数量，不推当前瓶内剩余、不要求取药或服用',
    },
  ],
  activities: [
    {
      page: 48,
      key: 'estimate-grab',
      task: '先抓一把估数量，再完整数并比较估计与实际，保留自己真实结果',
    },
    {
      page: 48,
      key: 'counter-and-write',
      task: '两十与八一写28、两十与两一写22，解释同字2在两数位的不同表示',
    },
    {
      page: 48,
      key: 'recognize-hundred',
      task: '实际拨认97、98、99、100，辨百位一珠与十个位的0',
    },
    {
      page: 49,
      key: 'think-try',
      task: '42两种表示观察与解释，实际试摆拨写34，保持同数不同表示',
    },
    {
      page: 49,
      key: 'practice-twenty-six',
      task: '实际做26并完整填两个十与六个一',
    },
    {
      page: 49,
      key: 'read-mark-draw-write',
      task: '两个生活语句各实际读、画线标数、画计数珠、写27和99',
    },
    {
      page: 49,
      key: 'find-hundred',
      task: '分别辨书页码、门牌和100片标示，自己寻找并说明生活中100的含义',
    },
  ],
} as const;
