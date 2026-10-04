/** Source observations only; this does not release a lesson or certify its teaching. */
export const bnuLowerCountrysideSource = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10761.html',
  checkedAt: '2026-10-05',
  printedPages: [38, 39],
  status: 'source-checked',
  finalTeacherReview: 'not-verified',
  images: [
    {
      printedPage: 38,
      url: 'https://images.szxuexiao.com/uploadimages/keben2026/bsd1njsuxue_x_2024/bsd1njsuxue_x_2024-042.jpg',
    },
    {
      printedPage: 39,
      url: 'https://images.szxuexiao.com/uploadimages/keben2026/bsd1njsuxue_x_2024/bsd1njsuxue_x_2024-043.jpg',
    },
  ],
  countryside: {
    counts: {
      airBirds: 11,
      treeBirds: 5,
      shoreWaterbirds: 6,
      riverWaterbirds: 8,
      whiteSheep: 7,
      darkSheep: 5,
    },
    countBasis:
      '实际放大逐对象核对：树上上枝2、下枝3，展开翅膀不增为两只；空中11；岸上水禽6；河中水禽8；白色羊7、深色有角羊5。白/深色仅图示分组，不据插画断言现实品种。',
    comparison: { reference: 'airBirds', smaller: 'treeBirds' },
    addition: {
      operands: [8, 6],
      groups: ['riverWaterbirds', 'shoreWaterbirds'],
    },
    boundary:
      '8＋6对应河中水禽与岸上水禽，不是全部小鸟；空中与树上的鸟不是先后飞入飞出事件。原书自编问题开放，不能固定为本站一个问题。',
  },
  practice: {
    counts: { squirrels: 9, deer: 14, ducks: 17 },
    countBasis:
      '原图最近邻局部放大：左树孤立1、中部相邻4、右下1、最右1共7，右树2，共9。卷尾不是另一个身体；数量先逐对象核对，不由算式9反推。未知条件不当0。',
    comparison: { larger: 'deer', smaller: 'squirrels' },
    subtraction: {
      operands: [17, 9],
      interpretation: 'ducks-more-than-squirrels',
    },
    boundary:
      '小鹿点数左7右7；小鸭河面左8右9。原图未明示飞走、游走或拿走事件，不能给17−9补造9只游走的情节。',
  },
  hidden: [
    { object: 'pencil', total: 12, visible: 3, unit: '支' },
    { object: 'shuttlecock', total: 11, visible: 4, unit: '个' },
  ],
  activities: [
    { page: 38, key: 'six-groups', task: '六组动物分别点数填信息' },
    { page: 38, key: 'bird-comparison', task: '树上与空中小鸟求差' },
    { page: 38, key: 'addition-meaning', task: '说明8＋6所解决的问题' },
    { page: 39, key: 'own-countryside', task: '自主提出田园问题并解答' },
    { page: 39, key: 'practice-counts', task: '松鼠、小鹿、小鸭分别点数' },
    { page: 39, key: 'deer-comparison', task: '小鹿与松鼠求差' },
    { page: 39, key: 'subtraction-meaning', task: '解释17−9所解决的问题' },
    { page: 39, key: 'own-practice', task: '再次自主提问并解答' },
    { page: 39, key: 'hidden-pencils', task: '铅笔总量减外面数量求里面数量' },
    {
      page: 39,
      key: 'hidden-shuttlecocks',
      task: '羽毛球总量减外面数量求里面数量',
    },
  ],
} as const;
