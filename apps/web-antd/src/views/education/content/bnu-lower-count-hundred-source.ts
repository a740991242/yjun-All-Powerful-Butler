/** Inspected source facts; authored teaching is audited separately. */
export const bnuLowerCountHundredSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  readPrintedPages: [46, 47],
  status: 'source-checked',
  eggs: {
    eachFullTray: 10,
    firstFullTrays: 9,
    firstTableEggs: 9,
    firstHandEggs: 1,
    packedFullTrays: 10,
    packedTotal: 100,
    boundary:
      '以右图十个完整盒核对100；左图九完整盒、九桌上蛋与一手持蛋分别核对，不把空盒计10个蛋或两幅先后图相加。',
  },
  sticks: {
    bundleSize: 10,
    looseToBundle: 10,
    sourceBundles: 9,
    sourceLoose: 10,
    representedTotal: 100,
    normalizedTens: 10,
    hundredBundles: 1,
    boundary:
      '原中段实际九捆加十根，不误写九捆九根或99；九十九添一为邻近数关系的另一说明。10根→1捆十、10捆十→1大捆百，总量不变，根/捆/个十分开。',
  },
  nextAfterNinetyNine: 100,
  fromSeventyFour: {
    bundles: 7,
    ones: 4,
    whole: 74,
    sourceOneByOne: [75, 76, 77],
    sourceTens: [74, 84, 94],
    boundary:
      '原任务数到100，十十续到94后要处理剩余单根，不能直接跳104；本站指定先十后逐一可用，其它合理完整数法开放。',
  },
  spokenSequences: {
    downGiven: [90, 80, 70, 60],
    upGiven: [22, 32, 42, 52],
    boundary:
      '原继续说数题未印所有末尾；本站0～100终点约定与原合理续说分开，不说原题只允许某条填空答案。',
  },
  practiceMaterials: {
    sticks: { bundles: 6, ones: 7, whole: 67 },
    blocks: { tensRods: 8, unitCubes: 8, whole: 88 },
    boundary:
      '右图八根十单位长条和八小块，长条内部十格不是另增长条数；原两组都须数到100并交流，不把两组混合或只读起数当已完成。',
  },
  weather: {
    rows: [
      'SSSSSSSSSS',
      'CCCCCCCCCC',
      'SSSCCCCCCC',
      'CCCSSSSSSS',
      'CCCCCCSSSS',
      'SSSSSSCCCC',
      'CCCCCSSSSS',
    ],
    sunny: 35,
    partlyCloudy: 35,
    totalDays: 70,
    boundary:
      'S为整幅纯太阳图标，C为整幅太阳带云图标；按完整格的类别分，不把带云图中的太阳重复归纯太阳，不叫下雨，不冒七十格是一自然月。',
  },
  activities: [
    {
      page: 46,
      key: 'count-eggs',
      task: '数全部鸡蛋并用小棒逐物代表，核对完整装盒数量',
    },
    {
      page: 46,
      key: 'make-ten',
      task: '十根捆一小捆，按十和单根数完，辨九十九到一百',
    },
    {
      page: 46,
      key: 'make-hundred',
      task: '十小捆再捆一大捆，认识十个十是一百',
    },
    {
      page: 47,
      key: 'from-seventy-four',
      task: '七十四分别逐一和先十十再续单根数到100并说明',
    },
    {
      page: 47,
      key: 'continue-speaking',
      task: '完整续说向下十十与二十二起向上十十的两条开放数列',
    },
    {
      page: 47,
      key: 'practice-count-hundred',
      task: '小棒67与积木88两组分别数到一百并与同伴说明',
    },
    {
      page: 47,
      key: 'weather-days',
      task: '逐格分类计数纯太阳和太阳带云各有多少天并解释数法',
    },
  ],
} as const;
