/** Pages 84–86 were viewed; this source record does not register teaching. */
export const bnuLowerDesignChallengeSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10764.html',
  checkedAt: '2026-10-06',
  status: 'source-checked-partial-teaching',
  readPrintedPages: [84, 85, 86],
  pageImages: [
    { printedPage: 84, suffix: '088.jpg' },
    { printedPage: 85, suffix: '089.jpg' },
    { printedPage: 86, suffix: '090.jpg' },
  ],
  design: {
    page: 84,
    cooperativeExamples: ['圆与三角形组成开放图案', '四个一样的三角形拼风车'],
    matchingTargets: ['triangle', 'hexagon', 'trapezoid', 'parallelogram'],
    matchingOrder: ['上左', '上右', '下左', '下右'],
    boundary:
      '四区分别按左上角样形找轮廓再涂，组合边界也要观察，不把内部每小三角一律当答案。六边形、梯形和平行四边形可按轮廓匹配，不强制学生预先记新名称；样图已有涂色仍属该活动，不跳过。数量待逐个几何核对，不凭缩略图猜唯一总数。合作设计、说明图形与点子图创作均实际记录，开放名称不唯一；材料不足可跳过，不自动认同伴参与。',
  },
  squareChallenge: {
    pages: [85, 86],
    pieceCountsDiscussed: [2, 3, 4, 7],
    shownExamples: [
      { count: 2, pieces: ['large-triangle', 'large-triangle'] },
      { count: 2, pieces: ['small-triangle', 'small-triangle'] },
      {
        count: 3,
        pieces: ['medium-triangle', 'small-triangle', 'small-triangle'],
      },
      {
        count: 4,
        pieces: [
          'large-triangle',
          'square',
          'small-triangle',
          'small-triangle',
        ],
      },
      {
        count: 4,
        pieces: [
          'large-triangle',
          'medium-triangle',
          'small-triangle',
          'small-triangle',
        ],
      },
    ],
    boundary:
      '原图按先两片、再三片、四片先选大三角找另一半、重合比、换一片再试逐步探究；两种两片正方形大小不同，不要求同面积。四片两种做法分别实际尝试，不能把可以拼误读任意选四片都能拼；5/6片未由本页结论证明。本站编号与配色不是原页标号，模型需保形、无重叠空缺并核实正方形边界。实际叠比、试拼和交流人工，开放发现与未来问题分列，不自动宣布完全掌握。',
  },
  activities: [
    { page: 84, key: 'cooperate-design-and-describe-shapes' },
    { page: 84, key: 'match-and-color-four-target-outlines' },
    { page: 84, key: 'create-and-describe-dot-grid-pattern' },
    { page: 85, key: 'observe-seven-piece-square-and-ask-alternatives' },
    { page: 85, key: 'try-two-piece-square-in-two-sizes' },
    { page: 85, key: 'try-three-piece-square' },
    { page: 86, key: 'choose-large-triangle-and-match-other-half' },
    { page: 86, key: 'overlay-and-compare-selected-half' },
    { page: 86, key: 'replace-piece-and-try-second-four-piece-square' },
    { page: 86, key: 'describe-method-and-reflect-on-unit' },
  ],
  boundary:
    '本记录证明84～86来源已读，84教学已映射，85～86仍待制作，程序验收另核。原扫描不打包，重画几何不能冒原比例或姿势；后续连环画/总复习另核，全国组合与全年交付仍未完成，不以学校或指定审校人作前置。',
} as const;
