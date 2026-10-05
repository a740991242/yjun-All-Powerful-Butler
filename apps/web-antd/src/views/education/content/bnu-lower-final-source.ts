/** Actual view of six complete printed pages, the following blank, and appendix97.
 * The first three pages are mapped to two courses; later pages and full-book approval remain pending.
 */
export const bnuLowerFinalSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  checkedAt: '2026-10-06',
  status: 'source-checked-teaching-partial',
  readPrintedPages: [90, 91, 92, 93, 94, 95],
  pageImages: [
    { printedPage: 90, suffix: '094.jpg' },
    { printedPage: 91, suffix: '095.jpg' },
    { printedPage: 92, suffix: '096.jpg' },
    { printedPage: 93, suffix: '097.jpg' },
    { printedPage: 94, suffix: '098.jpg' },
    { printedPage: 95, suffix: '099.jpg' },
  ],
  imageBase:
    'https://images.szxuexiao.com/uploadimages/keben2026/bsd1njsuxue_x_2024/bsd1njsuxue_x_2024-',
  followingImages: [
    {
      suffix: '100.jpg',
      observed: '空白，无印刷页码，不据文件序号称已读96页活动',
    },
    { suffix: '101.jpg', observed: '印刷97页附页，图3长方形纸供94页折分使用' },
  ],
  numberReview: {
    page: 90,
    represent: 32,
    expressions: [
      [45, '+', 23],
      [68, '-', 15],
      [73, '+', 22],
      [99, '-', 19],
    ],
    explainWith: ['竖式', '小棒', '计数器'],
    lifeExpression: [18, '-', 9],
    lifeExamplesRequested: 2,
    farm: { sheep: 35, geese: 11, rabbitMoreThanSheep: 4 },
    boundary:
      '回顾已认识的数、顺序数数与32的多种表征，四式分别算并解释；18−9两件原创生活问题及动物提问/解答是开放交流，不只答一个兔数就替代全部。',
  },
  numberApplications: {
    pages: [91, 92],
    forwardLine: { given: [25, 27, 29, 31], blanks: [26, 28, 30, 32] },
    backwardLine: { given: [61, 60, 57, 56, 53, 52], blanks: [59, 58, 55, 54] },
    compositions: [37, 24, 51],
    comparisons: [
      [
        [35, '+', 24],
        [24, '+', 35],
      ],
      [
        [54, '-', 32],
        [53, '-', 32],
      ],
      [
        [49, '-', 37],
        [49, '-', 36],
      ],
      [
        [50, '+', 30],
        [50, '+', 40],
      ],
    ],
    rescue: {
      firstHalf: 32,
      secondHalfMore: 13,
      asked: '下半年救助数，不是全年合计',
    },
    drawLines: [
      { expression: [7, '+', 6], line: [7, 16] },
      { expression: [18, '-', 6], line: [11, 19] },
    ],
    pandaGroups: [6, 7],
    cabbages: { first: 24, secondSameAsFirst: true },
    rings: {
      scores: [24, 12, 30, 32],
      firstChild: 42,
      secondChild: 62,
      thirdChildRank: 3,
    },
    ropeJump: {
      names: ['强强', '乐乐', '小红', '欢欢'],
      counts: [92, 95, 94, 99],
      questions: [
        '四人排名填表',
        '第二名比第三名多跳几次',
        '再提一个问题并解答',
      ],
    },
    boundary:
      '两条数线顺向/逆向分别读，每个空位保留位置；三种组成、四个比较、下半年范围、两种数线画法、两群熊猫、相等白菜、套圈两个问法与跳绳三个问法逐项保留。套圈本站题需明确两个不同目标，不把条件推广到同目标可重复计分的新游戏；排名不按人名或表中位置猜。',
  },
  geometry: {
    pages: [93, 94],
    sourcePatterns: ['溜冰', '踢球', '跳舞'],
    collageTargets: ['机器人', '火车'],
    collageCounts: null,
    planeShapes: ['rectangle', 'circle', 'square', 'triangle'],
    solidSources: ['cube', 'triangular-prism', 'cuboid', 'cylinder'],
    folding: ['两个三角形', '两个长方形', '一个正方形和一个长方形'],
    appendixFigure: 3,
    drawingOnDots: ['长方形', '正方形', '三角形'],
    drawingParts:
      '图中几何材料与整体外轮廓分清，不自动把所有组合轮廓当材料片；机器人/火车原图唯一总数未定，不凭颜色、缩略图或假定边界补答案。',
    boundary:
      '回忆/描述/画学过的图形，三个人物拼图材料与原创设计、两幅找图形、四形从四体取面连线、附页3三种折分、点子图三形与仿图创作全部保留。长方体可能有正方形面，但不能一概而论；三角形来自三棱柱端面，圆是圆柱平面端面，不拿曲面或投影混代。附页实物尺寸未标，本站模型尺寸须另注明，不冒原厘米数。',
  },
  practice: {
    page: 95,
    nextDrawings: {
      faces: ['happy', 'happy', 'sad'],
      cupHandles: ['right', 'left', 'right'],
      rectangleDivisions: ['horizontal', 'vertical', 'horizontal'],
    },
    lifePatterns: ['城墙', '彩色台阶', '花纹织物'],
    boundary:
      '先回顾连环画、重复规则与用规律设计图案；三个续画分别看完整重复组和方向，生活图可用自己的文字/图形/符号表达，不将开放表达定唯一字符串。真实与同伴/家人合作讲并画数学故事另确认，没有合作条件可待做，不能套一题算对就认综合实践完成；不复制整幅教材照片或现代插画。',
  },
  activities: [
    { page: 90, key: 'recall-count-and-represent-32' },
    { page: 90, key: 'four-columns-and-manipulative-explanation' },
    { page: 90, key: 'two-life-examples-for-eighteen-minus-nine' },
    { page: 90, key: 'farm-questions-discussion-and-solutions' },
    { page: 91, key: 'forward-and-backward-number-line-blanks' },
    { page: 91, key: 'three-tens-ones-compositions' },
    { page: 91, key: 'four-expression-comparisons' },
    { page: 91, key: 'rescue-second-half-more' },
    { page: 91, key: 'draw-add-and-subtract-number-lines' },
    { page: 92, key: 'two-panda-groups-and-equation' },
    { page: 92, key: 'same-cabbage-count-and-total' },
    { page: 92, key: 'two-ring-target-questions' },
    { page: 92, key: 'rope-ranks-difference-and-own-question' },
    { page: 93, key: 'recall-describe-and-draw-plane-shapes' },
    { page: 93, key: 'three-tangram-patterns-and-own-design' },
    { page: 93, key: 'robot-and-train-find-four-shape-types' },
    { page: 94, key: 'four-plane-to-solid-face-connections' },
    { page: 94, key: 'appendix-three-rectangle-fold-three-ways' },
    { page: 94, key: 'draw-three-shapes-on-dots' },
    { page: 94, key: 'create-own-plane-shape-collage' },
    { page: 95, key: 'recall-comic-patterns-and-design' },
    { page: 95, key: 'continue-three-drawing-patterns' },
    { page: 95, key: 'express-three-life-patterns-in-own-way' },
    { page: 95, key: 'actual-cooperative-math-story-and-comic' },
  ],
  boundary:
    '仅总复习90～95来源准备及附页97图3实际查看，90～92已制作两课并接目录，93～95图形与综合实践仍待制作；课程映射不代程序或全年验收，旧学习记录保持。未确定的原拼图数、附页尺寸和之后未查看页保留状态，不将来源清单当教学完成或全年验收；不以学校或指定审校人为前置。',
} as const;
