/** Actual inspection of printed pages 60–61; no course is registered by this evidence module. */
export const bnuLowerFillGameSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  readPrintedPages: [60, 61],
  pageImages: [
    { printedPage: 60, suffix: '064.jpg' },
    { printedPage: 61, suffix: '065.jpg' },
  ],
  rules: {
    fixedGivens: true,
    eachRowDistinct: true,
    eachColumnDistinct: true,
    extraBlockRule: false,
    extraDiagonalRule: false,
    boundary:
      '只保留原题行列不重复及数字范围；不是另加小宫格规则的数独，不增加对角线限制。给定数保留，空格不是0，数字范围随3格和5格分别变化。',
  },
  three: {
    size: 3,
    allowed: [1, 2, 3],
    given: [
      [1, null, null],
      [null, 1, null],
      [null, 2, 1],
    ],
    blankCoordinates: [
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 1],
    ],
    blankValuesRowMajor: [3, 2, 2, 3, 3],
    completed: [
      [1, 3, 2],
      [2, 1, 3],
      [3, 2, 1],
    ],
    start: {
      row: 3,
      column: 1,
      givenInRow: [2, 1],
      candidates: [3],
    },
    boundary:
      '第3行已有2与1，剩余第一格为3；这只是原题建议起点，不强制唯一解题次序。全部五空和全部三行三列分别检查，不能只判第三行。',
  },
  five: {
    size: 5,
    allowed: [1, 2, 3, 4, 5],
    given: [
      [5, 1, null, null, 3],
      [1, 3, null, null, 4],
      [4, 2, null, 1, 5],
      [2, null, 4, 3, 1],
      [3, 4, 1, null, 2],
    ],
    blankCoordinates: [
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 3],
      [4, 2],
      [5, 4],
    ],
    blankValuesRowMajor: [2, 4, 5, 2, 3, 5, 5],
    completed: [
      [5, 1, 2, 4, 3],
      [1, 3, 5, 2, 4],
      [4, 2, 3, 1, 5],
      [2, 5, 4, 3, 1],
      [3, 4, 1, 5, 2],
    ],
    fewBlanksStage: [
      [5, 1, null, null, 3],
      [1, 3, null, null, 4],
      [4, 2, 3, 1, 5],
      [2, 5, 4, 3, 1],
      [3, 4, 1, 5, 2],
    ],
    bothConstraints: {
      row: 1,
      column: 3,
      rowCandidates: [2, 4],
      columnAlready: [3, 4, 1],
      selected: 2,
    },
    nextStage: [
      [5, 1, 2, null, 3],
      [1, 3, null, null, 4],
      [4, 2, 3, 1, 5],
      [2, 5, 4, 3, 1],
      [3, 4, 1, 5, 2],
    ],
    boundary:
      '升级原图七空全部保留；先补三条仅一空的行后再观察行列交集，原两个中间图是解题阶段，不能冒成最初给定条件。第一行第三格只看行有2/4两候选，同时看列排除4，得到2。',
  },
  reflection: {
    fewBlanksFirst: true,
    trialThenAdjust: true,
    finalCheckRowsAndColumns: true,
    boundary:
      '少空处开始是可选策略；不确定可试填并调整，不把一次试错当不能学习。最后须同时检查行与列，网页正确不自动确认真实纸面填写、口述或与同伴交流；反思原话不统一判分，未来打算另记。',
  },
  activities: [
    {
      page: 60,
      key: 'understand-row-column-rule',
      task: '读懂允许1～3且每行每列不重复，空白与给定分别识别',
    },
    {
      page: 60,
      key: 'three-complete-grid',
      task: '原3×3全部五空，第三行起点、后续行列排除与完成后全图检查',
    },
    {
      page: 61,
      key: 'five-upgrade-grid',
      task: '原5×5全部七空，允许1～5，保持同一行列规则',
    },
    {
      page: 61,
      key: 'intermediate-and-both-constraints',
      task: '三条仅一空行及两个原中间阶段，第一行第三格同时看行和列后填2',
    },
    {
      page: 61,
      key: 'review-method-and-real-check',
      task: '少空优先、试填调整与最后逐行逐列检查，个人方法和真实活动分别记录',
    },
  ],
} as const;
