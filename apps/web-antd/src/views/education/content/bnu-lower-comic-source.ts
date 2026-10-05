/** Printed pages87–89 were actually viewed; source activities are mapped independently from final full-year acceptance. */
export const bnuLowerComicSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10764.html',
  checkedAt: '2026-10-06',
  status: 'source-checked-teaching-mapped',
  readPrintedPages: [87, 88, 89],
  pageImages: [
    { printedPage: 87, suffix: '091.jpg' },
    { printedPage: 88, suffix: '092.jpg' },
    { printedPage: 89, suffix: '093.jpg' },
  ],
  milkStory: {
    page: 87,
    panels: 4,
    order: ['上左', '上右', '下左', '下右'],
    cartons: 1,
    price: 13,
    tendered: 20,
    change: 7,
    stages: ['提出生活需要', '买一盒与付款', '找零', '回到生活情境'],
    boundary:
      '一盒13元、付20找7为给定故事事实，不是现行商品价格。生活情境与数学信息分别读，不要求孩子实际购买或制作食品；本站可重述数量关系，不打包原插画或整段对话。',
  },
  ownComic: {
    page: 88,
    order: [
      '选生活中的数学故事并说明信息',
      '想分几部分并确定自己的格数',
      '先分格再按顺序画',
      '说明困难并真实交流',
    ],
    boundary:
      '自己的格数按故事部分决定，不强制所有作品都4格。数与图形都可成为数学信息；个人真实经历、改编和想象如实标明，不捏造同伴或购买经历。原空白框用于创作，不是已完成作品；数字题答对不代画图。',
  },
  duckStory: {
    page: 89,
    panels: 4,
    start: 6,
    arrive: 8,
    total: 14,
    leave: 5,
    remaining: 9,
    order: ['先有', '又来', '离开', '提问与算式'],
    boundary:
      '按整段事件顺序先6+8=14，再14−5=9；5是从14中离开，不额外再加或只从新来8扣。问号用于提出问题，不是鸭子材料，也不强制孩子自己的故事沿用这两式。原答案与自己的问题分清，不复制完整原画。',
  },
  selfAssessment: {
    page: 89,
    criteria: [
      '能讲身边数学故事并画成连环画',
      '能用自己的话表达连环画中的数学信息',
      '能理解别人连环画中的数学信息和问题',
    ],
    starsPerCriterion: 3,
    boundary:
      '三个能力分别按真实表现自评，星数不能由客观题自动填满；没有作品、同伴材料或尚未交流如实待评价。阅读欣赏、修改、收获与未来计划分别记录。',
  },
  activities: [
    { page: 87, key: 'read-milk-story-and-identify-math-information' },
    { page: 87, key: 'tell-life-experience-and-discuss-comic-plan' },
    { page: 88, key: 'identify-own-math-information-and-plan-panel-count' },
    { page: 88, key: 'divide-and-draw-in-story-order' },
    { page: 88, key: 'discuss-actual-drawing-difficulties' },
    { page: 89, key: 'read-peer-comics-and-present-own' },
    { page: 89, key: 'check-math-information-and-appreciate' },
    { page: 89, key: 'revise-after-reading-peers' },
    { page: 89, key: 'read-duck-events-question-and-two-equations' },
    { page: 89, key: 'share-learning-from-drawing' },
    { page: 89, key: 'self-assess-three-separate-capabilities' },
  ],
  boundary:
    '来源87～89已读，十一活动已映射到连环画课程；90页起总复习另核。三页活动逐项展开，不以阅读来源、模型或一项答对认整课/全年完成，不以学校或指定审校人为前置。',
} as const;
