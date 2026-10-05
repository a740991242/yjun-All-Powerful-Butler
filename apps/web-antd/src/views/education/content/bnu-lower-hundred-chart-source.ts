/** Inspected printed-page facts, separate from lesson registration and source answer claims. */
export const bnuLowerHundredChartSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [55, 56],
  status: 'source-checked',
  pageImages: [
    {
      printedPage: 55,
      suffix: '059.jpg',
    },
    {
      printedPage: 56,
      suffix: '060.jpg',
    },
  ],
  chart: {
    rows: 10,
    columns: 10,
    minimum: 1,
    maximum: 100,
    given: [
      1, 10, 12, 19, 23, 28, 34, 37, 45, 46, 55, 56, 64, 67, 73, 78, 82, 89, 91,
      100,
    ],
    blankCount: 80,
    boundary:
      '原表从1开始，不补0格；完整十行全部80空，不以示例或只补一行当完成。横向相邻加1，下一行同列加10，10与11是换行不是同一行右邻，100百位与十个位两个0分清。',
  },
  discovery: {
    directions: ['竖着看第三列个位', '横着看', '斜着看'],
    boundary:
      '第三列3/13/23/33/43/53/63/73/83/93个位都3。横竖斜规律需指完整同方向位置，斜线按具体方向可加11或加9，不把所有斜向固定加11；自己的发现开放说明。',
  },
  firstFragment: {
    given: [
      [58, null, 60],
      [null, null, null],
      [78, null, 80],
    ],
    completed: [
      [58, 59, 60],
      [68, 69, 70],
      [78, 79, 80],
    ],
    boundary:
      '五个空全部填写；行参照58/59/60与列58/68/78共同确定，不只填中央或把横竖规律混用。',
  },
  secondFragment: {
    given: [
      [null, null, null],
      [null, 67, null],
      [null, null, null],
    ],
    completed: [
      [56, 57, 58],
      [66, 67, 68],
      [76, 77, 78],
    ],
    boundary:
      '原中心67，全部八空；右邻68与下邻77独立，左右±1、上下±10，补完整三行，不只答两个示例。',
  },
  colourRules: [
    {
      key: 'ones-zero',
      description: '个位是0',
      colour: '绿色',
    },
    {
      key: 'ones-seven',
      description: '个位是7',
      colour: '蓝色',
    },
    {
      key: 'ones-tens-equal',
      description: '个位和十位相同',
      colour: '黄色',
    },
    {
      key: 'ones-one-less',
      description: '个位比十位少1',
      colour: '红色',
    },
  ],
  colourBoundary:
    '四轮原规则各完整寻找并说明；可每轮重新复原表，条件集合可能重叠，不强造每数只能一种类别。原句未限定两位数，若网页问全表1～100同十个位，100十位0/个位0也满足；若另明确只看两位数则只11～99九数，网页限定与原开放观察分清，不冒原书给了唯一涂色答案。',
  numberLines: [
    {
      given: [30, 32, 34],
      step: 2,
      missing: [36, 38, 40],
    },
    {
      given: [70, 80],
      step: 10,
      missing: [50, 60, 90, 100],
    },
  ],
  lineBoundary:
    '两条完整等距刻度，第一逐二、第二逐十；第二70/80左有两个空、右有两个空，分别50/60与90/100，不误当都在右或漏100。',
  practiceFragments: [
    {
      given: [
        [27, 28, null],
        [null, 38, null],
        [null, null, 49],
      ],
      completed: [
        [27, 28, 29],
        [37, 38, 39],
        [47, 48, 49],
      ],
    },
    {
      given: [
        [null, 31, null],
        [40, null, 42],
        [null, 51, null],
      ],
      completed: [
        [30, 31, 32],
        [40, 41, 42],
        [50, 51, 52],
      ],
    },
    {
      given: [
        [null, null, null],
        [null, 85, null],
        [null, null, null],
      ],
      completed: [
        [74, 75, 76],
        [84, 85, 86],
        [94, 95, 96],
      ],
    },
  ],
  fragmentBoundary:
    '三图各完整九格，已给数不可改，分别5/5/8空；按具体行列确定，不能把中心位置当任意起点或只做一图。',
  activities: [
    {
      page: 55,
      key: 'fill-full-chart',
      task: '完整填写原1～100十行表，保留20已给数并补全部80空',
    },
    {
      page: 55,
      key: 'chart-discoveries',
      task: '实际指第三列个位及完整横竖具体斜线，说自己的发现',
    },
    {
      page: 55,
      key: 'fragment-fifty-eight',
      task: '根据58/60/78/80两行列关系填写完整五空并解释',
    },
    {
      page: 56,
      key: 'fragment-sixty-seven',
      task: '按中心67右邻/下邻及其余相邻关系填写完整八空，逐行说明',
    },
    {
      page: 56,
      key: 'four-colour-rules',
      task: '四轮分别按个位0、个位7、十个位相同、个位少1完整涂标并真实交流',
    },
    {
      page: 56,
      key: 'two-number-lines',
      task: '逐二填36/38/40，逐十填50/60/90/100两条全空并解释刻度间隔',
    },
    {
      page: 56,
      key: 'three-chart-fragments',
      task: '三张局部表按全部已给数填写所有5/5/8空，分别说横竖方法',
    },
  ],
} as const;
