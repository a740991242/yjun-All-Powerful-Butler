/** Independently inspected pages 58–59; this preparation does not register a lesson. */
export const bnuLowerNumberPracticeSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [58, 59],
  status: 'source-checked',
  pageImages: [
    {
      printedPage: 58,
      suffix: '062.jpg',
    },
    {
      printedPage: 59,
      suffix: '063.jpg',
    },
  ],
  materials: {
    orangeObjects: {
      shownRows: [10, 10, 10, 10, 3],
      derived: {
        tens: 4,
        ones: 3,
        value: 43,
      },
      boundary:
        '按原逐物行列点数，原页没有写明物品名称，不把未核验品种当数学条件。',
    },
    sticks: {
      shown: {
        tenBundles: 3,
        loose: 8,
      },
      derived: {
        tens: 3,
        ones: 8,
        value: 38,
      },
    },
    counter: {
      shown: {
        tensBeads: 2,
        onesBeads: 5,
      },
      derived: {
        tens: 2,
        ones: 5,
        value: 25,
      },
    },
    cubes: {
      shown: {
        tenRods: 2,
        singleCubes: 15,
      },
      raw: {
        tens: 2,
        ones: 15,
        value: 35,
      },
      regrouped: {
        tens: 3,
        ones: 5,
        value: 35,
      },
      boundary:
        '原散块十五不是个位数字15；原材料2个十和15个一可完整填，若换十再整理为3个十和5个一，总数不变，不画少十块冒原图。',
    },
  },
  writeGame: {
    original: {
      value: 34,
      tens: 3,
      ones: 4,
    },
    boundary:
      '两人我拨你写，例子34是已给示范；真实各自拨写及交换角色独立确认，网页答34不冒完成游戏，不要求新买计数器。',
  },
  peaches: {
    reference: 38,
    description: '多一些',
    candidates: [96, 42, 35],
    selected: 42,
    boundary:
      '在完整三个候选与参照38条件下选42；96更多但不是本题较接近候选，35小于38。定性词不设所有情境通用差数或比例阈值，树上未摘桃不加进已摘38。',
  },
  books: {
    pictureBooks: 36,
    description: '多得多',
    secondClue: {
      reference: 90,
      description: '少一些',
    },
    candidates: [85, 99, 40],
    onlyGreaterThan36: [85, 99, 40],
    onlyLessThan90: [85, 40],
    selected: 85,
    boundary:
      '必须结合故事书比36多得多与比90少一些两条完整线索；只大于36三项都满足，只小于90仍两项，不从一个不完整条件唯一断定85。不限为固定差数，不当真实书架调查。',
  },
  trains: [
    {
      key: 'five-up',
      given: [15, 20, 25, null, 35, null, 45, null, null],
      step: 5,
      complete: [15, 20, 25, 30, 35, 40, 45, 50, 55],
      blanks: [30, 40, 50, 55],
    },
    {
      key: 'two-up',
      given: [22, null, 26, 28, null, 32, null, null],
      step: 2,
      complete: [22, 24, 26, 28, 30, 32, 34, 36],
      blanks: [24, 30, 34, 36],
    },
    {
      key: 'ten-up',
      given: [10, 20, 30, null, null, null, null],
      step: 10,
      complete: [10, 20, 30, 40, 50, 60, 70],
      blanks: [40, 50, 60, 70],
    },
    {
      key: 'five-down',
      given: [100, 95, 90, 85, null, null, null, null],
      step: -5,
      complete: [100, 95, 90, 85, 80, 75, 70, 65],
      blanks: [80, 75, 70, 65],
    },
  ],
  trainBoundary:
    '逐条保留原全部位置、已知数字与方向；本站若客观判填空，明确每次加5/加2/加10/减5，不把有限前缀当所有续法唯一，也不将人物或车轮计成数列项。',
  fourBeads: {
    rods: ['tens', 'ones'],
    totalBeads: 4,
    given: {
      tens: 1,
      ones: 3,
      value: 13,
    },
    remainingAscending: [4, 22, 31, 40],
    allAscending: [4, 13, 22, 31, 40],
    pairs: [
      [0, 4],
      [1, 3],
      [2, 2],
      [3, 1],
      [4, 0],
    ],
    boundary:
      '仅十位与个位两杆合四颗，不加百位杆；允许全在个位表示一位数4，40个位0也真实有效。四个原空允许不同填写次序，若本站要求升序须明示；实际画全部五图独立确认，未知不0。',
  },
  numberCards: {
    cards: [2, 5, 8],
    digitsUsed: 2,
    ascending: [25, 28, 52, 58, 82, 85],
    count: 6,
    boundary:
      '从三张不同卡选两张，每张在同一数中最多用一次；三选择各两种个位，六个全部列出并从小到大，不能22/55/88复制卡或只列三个。实际排卡与完整排序人工确认。',
  },
  activities: [
    {
      page: 58,
      key: 'four-material-compositions',
      task: '四材料全部填原十/一/值，积木十五散一与换十后个位5分清并完整核对',
    },
    {
      page: 58,
      key: 'counter-write-game',
      task: '按原34我拨你写，两角色各实际拨写并核对，再交换角色',
    },
    {
      page: 58,
      key: 'peach-candidates',
      task: '参照已摘38，在96/42/35中选42并实际画圈和说明比较方向',
    },
    {
      page: 59,
      key: 'book-two-clues',
      task: '完整读故事书比36多得多又比90少一些，结合85/99/40选85并实际画圈说明',
    },
    {
      page: 59,
      key: 'four-complete-trains',
      task: '全部四条数列各四空，保留9/8/7/8位置与加5/加2/加10/减5方向',
    },
    {
      page: 59,
      key: 'four-beads-all-five',
      task: '十/个位合四珠，已示13加四空完整五种4/13/22/31/40，分别实际画写',
    },
    {
      page: 59,
      key: 'three-cards-all-six',
      task: '用2/5/8各选两张不同卡组成六种两位数，全列并实际从小到大排序',
    },
  ],
} as const;
