import type { Lesson, Question, Visual } from '../learning/types';

function question(
  id: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint: '先看所数对象和给出的条件，每个标记只数一次；没有信息与已知没有分别看。',
    explanation,
    ...(visual ? { visual } : {}),
  };
}
function choice(
  id: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...question(id, suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function manual(id: string, suffix: string, prompt: string): Question {
  return question(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    '真实做过才确认；未做或只计划做请跳过，不由网页答案代替。',
  );
}
const countId = 'bnu-upper-life-count-order';
export const bnuCountOrderLesson: Lesson = {
  id: countId,
  textbookTitle: '生活中的数',
  title: '一到十点数、数序与一到五书写',
  page: 12,
  version: 1,
  status: 'available',
  goal: '逐一数1～10个对象，用数字表示数量，区分共有几个与第几个，实际练写1～5。',
  prerequisite: '能逐个指认物品，无需先会加减法。',
  parentTip:
    '对应北师大上册12～16页。本站标记与纸卡情境原创，不复制乡村、玩具、动物原画。原书观察与纸面书写单列实际任务；普通字体不作规范笔顺示范，输入数字不表示已经写过。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方原书0061印刷12～16页实际读取：1～10点数/对应、数量与序位、物品到小棒手势图形表示、1～5描写、按数涂色和车厢位置。未知ISBN/印次不补造。',
  },
  steps: [
    {
      title: '选定一类逐个数',
      text: '先明确对象，例如只数纸卡。一个标记对应一张卡，每张只数一次；换成数盒子时不能把盒子里所有卡都混入。最后报出的数表示本次所数对象共有几个。',
      visual: { kind: 'count', count: 3 },
      activity: '实际拿1～5件已有物品点数，说清对象。',
    },
    {
      title: '一到十都逐个对应',
      text: '把每个物品对应到一个标记，按1、2、3的顺序接着数到10。数量不靠颜色或间距决定；没有增加或拿走，改摆放位置仍应逐个核对。',
      visual: { kind: 'count', count: 10 },
      activity: '用1～10张纸卡逐个点数，换排法后再核对。',
    },
    {
      title: '同一个数量多种表示',
      text: '例如4张卡可用4根小棒、4个自己画的标记或数字4表示。数字符号只有一个字形，不是只表示一件物品；一盒卡和盒内卡片是不同计数对象。',
      visual: { kind: 'count', count: 4 },
      activity: '实际选2、3、4、5各一次，用已有物品和自画标记分别表示。',
    },
    {
      title: '共有几个与第几个',
      text: '本站纸卡从左到右按甲、乙、丙、丁、戊排成一行。共有5张，丙从左数是第3张；改从右数丁是第2张。先明确起点与方向，序位指一个位置，不是所有卡片的数量。',
      activity: '实际摆五张虚构名字卡，从两端分别指第几个和前几个。',
    },
    {
      title: '描写数字与按数画记',
      text: '对照合法教材中的1～5书写示范，在纸上实际描写，家长检查坐姿和所写数字。再选一个数，画同样多的标记核对；屏幕字体和填空结果不代替纸面书写。',
      activity: '实际练写1～5，再按每个数画记并点数；未做不确认。',
    },
    {
      title: '回看原书不同任务',
      text: '对照12～16页，分别做观察、对应、圈出指定数量、找序位、表示数量和书写。原图信息与本站纸卡例子分开，不能把自己画的标记冒原书动物图。',
      activity: '实际读图后说清至少一题的对象与起点，保留自己的疑问。',
    },
  ],
  questions: [
    ...Array.from({ length: 10 }, (_, index) =>
      question(
        countId,
        `q${index + 1}`,
        '只数这一图的纸卡标记，共有几张？',
        { kind: 'number', value: index + 1 },
        `图中每个标记对应一张卡，逐一数为${index + 1}张。`,
        { kind: 'count', count: index + 1 },
      ),
    ),
    question(
      countId,
      'q11',
      '甲、乙、丙、丁、戊从左到右排列。丙从左数是第几张？',
      { kind: 'number', value: 3 },
      '从左起甲1、乙2、丙3；共有5张是另一个问题。',
    ),
    question(
      countId,
      'q12',
      '同一行甲、乙、丙、丁、戊，丁从右数是第几张？',
      { kind: 'number', value: 2 },
      '从右起戊1、丁2，不沿用从左的方向。',
    ),
    choice(
      countId,
      'q13',
      '问“共有几张卡”时应回答什么？',
      '全部卡片的数量',
      ['全部卡片的数量', '其中一张所在的位置'],
      '总数与序位分别回答。',
    ),
    choice(
      countId,
      'q14',
      '已明确盒内有5张卡，只问盒子有几个，现在有一个盒子，应填什么？',
      '1个盒子',
      ['1个盒子', '5个盒子'],
      '所数对象是盒子，不能改成盒内纸卡。',
    ),
    manual(
      countId,
      'actual-count',
      '实际用1～10张纸卡点数并改排法核对；做过再确认。',
    ),
    manual(
      countId,
      'actual-represent',
      '实际分别表示2、3、4、5：用物品及自画标记各一次；做过再确认。',
    ),
    manual(
      countId,
      'actual-order',
      '实际摆五张名字卡，从两端指序位并区分前几个；做过再确认。',
    ),
    manual(
      countId,
      'actual-write',
      '对照合法教材示范，在纸上实际描写1～5并核对；做过再确认。',
    ),
    manual(
      countId,
      'actual-mark',
      '实际按1、2、3、4、5分别画对应数量标记并点数；做过再确认。',
    ),
    manual(
      countId,
      'actual-book',
      '实际对照原书12～16页做观察、数量对应与序位说明；看过再确认。',
    ),
    question(
      countId,
      'reflection',
      '记录一次数量与序位的不同，或自己的点数方法。',
      { kind: 'reflection' },
      '开放记录不计客观正确率。',
    ),
  ],
  reviewQuestions: [
    question(
      countId,
      'r1',
      '一盒已有8张卡，只问盒子数量，盒子有几个？',
      { kind: 'number', value: 1 },
      '新的卡数为8，所问仍是一个盒子。',
    ),
    question(
      countId,
      'r2',
      '甲、乙、丙、丁从左到右，乙从右数是第几张？',
      { kind: 'number', value: 3 },
      '新行只有4张，从右起丁1、丙2、乙3。',
    ),
    question(
      countId,
      'r3',
      '甲、乙、丙、丁从左到右，丁从左数是第几张？',
      { kind: 'number', value: 4 },
      '对象和方向均已明确，为第4张。',
    ),
    choice(
      countId,
      'r4',
      '七张卡未增减，只换排法，数量一定变了吗？',
      '没有，仍需逐个核对',
      ['一定变多', '没有，仍需逐个核对'],
      '改变位置不等于增减对象。',
    ),
  ],
};
const zeroId = 'bnu-upper-life-zero';
export const bnuZeroLesson: Lesson = {
  id: zeroId,
  textbookTitle: '生活中的数',
  title: '零表示已知没有，空白不等于零',
  page: 17,
  version: 1,
  status: 'available',
  goal: '用0表示已知没有，区分未知空白与0，观察数字用途并实际练写0。',
  prerequisite: '能逐一数1～5并说明计数对象。',
  parentTip:
    '对应北师大上册17～18页。本站空框与纸卡例子原创，不复制钓鱼图、电话号码、旋钮或尺图；不要求钓鱼、操作电器或拨打号码。字形书写与生活观察人工记录，页面留空不静默当0。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方原书0061印刷17～18页实际读取：已知没有/0、生活数字、0描写与混合读写、点数和按数画记、尺刻度起点。只按已读范围原创，不把教材截图打包。',
  },
  steps: [
    {
      title: '已知没有用零',
      text: '原创图的四个框分别有3、2、1、0张卡。第四框已明确没有卡，数量记作0；框本身仍存在，不能说没有框。',
      visual: { kind: 'count-groups', groups: [3, 2, 1, 0] },
      activity: '实际拿走一框全部纸卡，再核对框内数量。',
    },
    {
      title: '没给信息不能猜零',
      text: '盒内卡数未查看，表格只留空时数量未知，不能填0冒已知没有。输入框留空也表示还未作答，真正答案是0时要明确输入0。',
      activity: '比较空框与尚未查看的盒子，用自己的话解释两者不同。',
    },
    {
      title: '生活数字用途不同',
      text: '虚构编号105里出现数字0，不表示共有0件物品。刻度起点标0，是一个参考起点，也不表示没有这把尺。读数字先看它用于数量、编号还是刻度。',
      activity: '实际找一个安全可观察的0，说清用途，不操作电器或拨号。',
    },
    {
      title: '零与一到五一起读写',
      text: '对照合法教材的书写示范，在纸上练写0，再与1～5逐个读写。普通字体不是笔顺动画，网页答对不能自动确认字形写得规范。',
      activity: '实际练写0及0～5，家长核对数量表示与字形。',
    },
    {
      title: '按数量画记并回看',
      text: '已知数量为0时不画卡片标记，给出2时画2个，给出5时画5个；未知数量先保留问题。对照原书17～18页独立观察与核对，不把本站空框例子冒原书情节。',
      activity: '实际做0、2、5的画记，再对照原书读图说明。',
    },
  ],
  questions: [
    question(
      zeroId,
      'q1',
      '第四框已明确没有纸卡，框内纸卡数量填几？',
      { kind: 'number', value: 0 },
      '已知没有卡，记0，不把空框本身数成卡。',
      { kind: 'count-groups', groups: [3, 2, 1, 0] },
    ),
    choice(
      zeroId,
      'q2',
      '盒子内部尚未查看，只留空白，数量一定是0吗？',
      '不能确定',
      ['一定是0', '不能确定'],
      '未知缺信息与已知没有不是同一事实。',
    ),
    choice(
      zeroId,
      'q3',
      '一个空框里没有卡，只问框有几个，填什么？',
      '1个框',
      ['0个框', '1个框'],
      '框内0张卡，框本身仍有一个。',
    ),
    choice(
      zeroId,
      'q4',
      '编号105中的0一定表示物品数量为0吗？',
      '不一定，要看用途',
      ['一定表示0件物品', '不一定，要看用途'],
      '编号中的数字不能直接解释为物品数量。',
    ),
    choice(
      zeroId,
      'q5',
      '已知答案是0，输入框留空能替代明确写0吗？',
      '不能',
      ['能', '不能'],
      '留空是尚未作答，不静默解释为0。',
    ),
    question(
      zeroId,
      'q6',
      '第三框的卡片数量填几？',
      { kind: 'number', value: 1 },
      '第三框有1个标记，不能把第四框的0移过来。',
      { kind: 'count-groups', groups: [3, 2, 1, 0] },
    ),
    choice(
      zeroId,
      'q7',
      '刻度的起点标0，是否表示这把尺不存在？',
      '不是',
      ['是', '不是'],
      '起点的标数与物品是否存在不同。',
    ),
    question(
      zeroId,
      'q8',
      '已明确要画0个纸卡标记，应画几个？',
      { kind: 'number', value: 0 },
      '已知数量0，不画卡片标记，不把未知当0。',
    ),
    manual(
      zeroId,
      'actual-empty',
      '实际拿走一框全部卡并核对空框与框内数量；做过再确认。',
    ),
    manual(
      zeroId,
      'actual-observe',
      '实际找一个生活中的0并说明用途，不操作电器或拨号；看过再确认。',
    ),
    manual(
      zeroId,
      'actual-write',
      '对照合法教材示范，实际练写0及0～5；做过再确认。',
    ),
    manual(zeroId, 'actual-mark', '实际分别按0、2、5画记并核对；做过再确认。'),
    manual(
      zeroId,
      'actual-book',
      '实际对照原书17～18页，说明没有、未知与数字用途；看过再确认。',
    ),
    question(
      zeroId,
      'reflection',
      '写下生活中的0的用途或仍需核对的问题。',
      { kind: 'reflection' },
      '真实发现与疑问没有统一答案。',
    ),
  ],
  reviewQuestions: [
    question(
      zeroId,
      'r1',
      '换图：第一框已明确没有纸卡，卡数填几？',
      { kind: 'number', value: 0 },
      '换到第一框，已知没有仍记0。',
      { kind: 'count-groups', groups: [0, 4] },
    ),
    choice(
      zeroId,
      'r2',
      '抽屉还没查看，只知道有一个抽屉，能直接说里面0张卡吗？',
      '不能确定',
      ['能确定0张', '不能确定'],
      '一个抽屉的数量不提供内部卡数。',
    ),
    choice(
      zeroId,
      'r3',
      '虚构编号207里有0，能据此说没有这个编号的盒子吗？',
      '不能',
      ['能', '不能'],
      '编号字形不等于盒子是否存在。',
    ),
    question(
      zeroId,
      'r4',
      '换图只数第二框纸卡，共有几张？',
      { kind: 'number', value: 4 },
      '第二框有4个标记，不能把另一框的0当本框数量。',
      { kind: 'count-groups', groups: [0, 4] },
    ),
  ],
};
