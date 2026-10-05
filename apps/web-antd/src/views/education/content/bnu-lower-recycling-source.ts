/** Printed pages72–73 read in full; page73 rods and all circles enlarged and counted. */
export const bnuLowerRecyclingSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10763.html',
  checkedAt: '2026-10-05',
  status: 'source-checked',
  readPrintedPages: [72, 73],
  pageImages: [
    { printedPage: 72, suffix: '076.jpg' },
    { printedPage: 73, suffix: '077.jpg' },
  ],
  title: '回收废品',
  conditions: {
    lin: 13,
    jiaMoreThanLin: 3,
    qiangFewerThanJia: 4,
    askedPerson: '小佳',
    unit: '个',
  },
  relevantForJia: ['lin', 'jiaMoreThanLin'],
  unusedForJia: ['qiangFewerThanJia'],
  equation: { operation: '+', values: [13, 3, 16], unit: '个' },
  check: { jia: 16, lin: 13, difference: 3 },
  rods: {
    bottlePerStick: 1,
    bundleMeaning: 10,
    beforeLoose: 3,
    extraLoose: 3,
    beforeSticks: 13,
    afterSticks: 16,
  },
  circles: { linRow: 13, jiaMatched: 13, jiaExtra: 3, jiaRow: 16 },
  boundary:
    '当前所求是小佳，不是小强或三人合计；用13与多3求16，少4关系在当前所求中不用，不能把13+3−4=12当小佳答案。换问小强时这条关系才有关，不能说4永远没用。小棒根与塑料瓶个按一根对应一个约定；一捆10是已学约定，不能按捆图可见线数猜内根数。13配对圆和额外3圆分别数，共16；检查16比13多3不同于再合并13和16。图示/纸面摆画与真实回收不混，不要求接触废品；环境背景不扩写为任何塑料绝对永不降解的结论。个人方法和收获开放，真实摆画/交流人工、计划另记。',
  activities: [
    { page: 72, key: 'read-all-conditions-and-asked-person' },
    { page: 72, key: 'choose-relevant-information-for-jia' },
    { page: 73, key: 'sticks-one-to-one-thirteen-plus-three' },
    { page: 73, key: 'all-thirteen-matched-and-three-extra-circles' },
    { page: 73, key: 'equation-and-complete-answer' },
    { page: 73, key: 'check-jia-lin-difference' },
    { page: 73, key: 'methods-and-information-reflection' },
  ],
} as const;
