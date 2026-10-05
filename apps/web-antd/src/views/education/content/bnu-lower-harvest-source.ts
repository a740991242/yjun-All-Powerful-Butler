/** Inspected source facts only; this module does not register a teaching lesson. */
export const bnuLowerHarvestSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [57],
  status: 'source-checked',
  pageImages: [{ printedPage: 57, suffix: '061.jpg' }],
  heartbeat: {
    duration: { value: 1, unit: '分钟' },
    original: [
      { name: '冬冬', age: 6, times: 95 },
      { name: '希希', age: 9, times: 92 },
      { name: '果果', age: 12, times: 85 },
      { name: '田田', age: 18, times: 79 },
    ],
    counters: [
      { tens: 9, ones: 5 },
      { tens: 9, ones: 2 },
      { tens: 8, ones: 5 },
      { tens: 7, ones: 9 },
    ],
    descending: [95, 92, 85, 79],
    most: '冬冬',
    boundary:
      '四人年龄标签不是心跳次数；同为一分钟的四条给定记录才可比较。只按原情境读数和数位，不把四条记录推为年龄与心率普遍规律，不要求真实测量、采集个人身体数据或给健康结论。画四个计数器与网页填数分开。',
  },
  representations: {
    value: 85,
    counter: { tens: 8, ones: 5 },
    expression: { tensValue: 80, onesValue: 5 },
    drawnSymbols: { rectangles: 8, triangles: 5 },
    emptyBranches: 2,
    boundary:
      '数位珠8与5表示8个十和5个一，珠子件数13不是所表示的85。原图八个小长方形和五个三角形没有独立写出单位图例；若用本站图应明确每长方形代表十、每三角形代表一，不能只凭形状默认含义。两个空分支允许自己的不同合理表示，不限定成本站唯一例子；实际画写、解释和核对分别确认。',
  },
  questionBank: {
    topic: '生活中的数数不完，我们能学完吗？',
    boundary:
      '开放数学问题，保存孩子自己的问题、理由和想法，不设是或否唯一正确答案；本课1～100是当前学习范围，不声称全部数到100为止。真实讨论与未来讨论计划分别记录，反思correct:null。',
  },
  activities: [
    {
      page: 57,
      key: 'heartbeat-counters-comparison',
      task: '按四条一分钟记录分别画四个计数器、写95/92/85/79、完整比较并指出冬冬最多',
    },
    {
      page: 57,
      key: 'eighty-five-representations',
      task: '核对85的计数器、80+5与八长方形五三角形，明确数量约定并在两个空分支写自己的合理表示',
    },
    {
      page: 57,
      key: 'open-question-bank',
      task: '记录关于生活中数与当前学习范围的自主问题、解释和真实讨论，不以唯一是非自动评分',
    },
  ],
} as const;
