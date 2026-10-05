/** Inspected pages 62–63, including enlarged stick panels; course implementation is maintained separately. */
export const bnuLowerRabbitGuestsSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10763.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  readPrintedPages: [62, 63],
  pageImages: [
    {
      printedPage: 62,
      suffix: '066.jpg',
    },
    {
      printedPage: 63,
      suffix: '067.jpg',
    },
  ],
  fruitAddition: {
    perPlate: 10,
    plateGroups: [2, 3],
    platesTotal: 5,
    values: [20, 30, 50],
    forwardAfter20: [30, 40, 50],
    tens: [2, 3, 5],
    boundary:
      '每盘十个，盘数5和果子50分开；数位珠与小棒每组代表十，不逐个猜照片红点数量，原20+30=50三种计数/合十/关联个位算式分别核对。',
  },
  fruitTaken: {
    before: 50,
    leftOnTable: 40,
    taken: 10,
    values: [50, 40, 10],
    backwardAfter50: [40, 30, 20, 10],
    tens: [5, 4, 1],
    boundary:
      '原所求是小刺猬背走多少；从总50减桌上已知40得背走10。操作模型扣四十表示从总体排除已知桌上40，不冒实际小刺猬背走40；背走量与留下量不能交换。',
  },
  operationNames: {
    addition: [
      {
        value: 20,
        name: '加数',
      },
      {
        value: 30,
        name: '加数',
      },
      {
        value: 50,
        name: '和',
      },
    ],
    subtraction: [
      {
        value: 50,
        name: '被减数',
      },
      {
        value: 40,
        name: '减数',
      },
      {
        value: 10,
        name: '差',
      },
    ],
    boundary:
      '按指定算式的数字位置命名，减数不是差；换所求或算式后须重新对应，不按物品名字固定术语。',
  },
  sticks: {
    perBundle: 10,
    observedTableBundles: [4, 4],
    observedHeldBundles: [2, 2],
    words: ['再加2捆', '拿走2捆'],
    siteExplicitBeforeTableReading: {
      add: [40, 20, 60],
      subtract: [40, 20, 20],
    },
    alternativeAlreadyTakenReading: {
      tableAfter: 40,
      taken: 20,
      before: 60,
    },
    boundary:
      '原两桌各四捆，女孩及男孩各手持两捆，局部放大逐件确认；文字分别再加2捆/拿走2捆。本站计算须明确桌上四捆作为动作前的条件，才有40+20=60与40−20=20；若另约定图中四捆为已经拿后，则原来60、拿走20、剩40，不能混用时刻或把两种解释冒成同一唯一图义。原纸面回读与时刻说明另确认。',
  },
  numberLines: [
    {
      operation: '+',
      labels: [20, 30, 40, 50, 60, 70, 80, 90],
      start: 30,
      jump: 50,
      end: 80,
      values: [30, 50, 80],
    },
    {
      operation: '−',
      labels: [50, 60, 70, 80, 90, 100],
      start: 90,
      jump: 30,
      end: 60,
      values: [90, 30, 60],
    },
  ],
  numberLineBoundary:
    '箭头起点、方向与终点完整对应；左由30到80加50，右由90向左到60减30，不把刻度20或50当起点，括号数列与箭头不混。',
  openPeaches: {
    people: [
      {
        name: '丁丁',
        picked: 40,
      },
      {
        name: '当当',
        picked: 30,
      },
      {
        name: '毛毛',
        picked: 50,
      },
    ],
    pairTotals: [70, 90, 80],
    pairDifferences: [10, 10, 20],
    allThreeTotal: 120,
    boundary:
      '原自提问题开放，可求任一两人合量/比较差等，须写完整参照、所求、算式、单位和答句，允许合理不同问题。树上未摘不加进已摘数；三人合摘120是另一合理自提问题但超过本课100以内，不能假称任何自提问题总量最多100或截为100，不将扩展120混进本节范围内必答。',
  },
  activities: [
    {
      page: 62,
      key: 'fruit-addition-three-methods',
      task: '每盘十个，两组2/3盘，接着数、十合并、关联2+3与20+30三种方法全部核对',
    },
    {
      page: 62,
      key: 'taken-not-left',
      task: '桌上40与背走10分清，50−40=10及倒数/十减/关联个位式完整核对',
    },
    {
      page: 63,
      key: 'name-each-operation-position',
      task: '两个加数与和、被减数/减数/差全部六位置对应',
    },
    {
      page: 63,
      key: 'two-stick-actions-and-units',
      task: '两桌四捆与手上两捆、各十根，先明确动作前或已拿后时刻，再两幅完整列式读单位',
    },
    {
      page: 63,
      key: 'both-arrow-lines',
      task: '两箭头各全部刻度及完整起点/方向/变化/终点列式',
    },
    {
      page: 63,
      key: 'own-peach-question-and-answer',
      task: '三条摘数40/30/50分别读取，自主提问完整条件算式单位答句、原纸面与说明真实确认',
    },
  ],
} as const;
