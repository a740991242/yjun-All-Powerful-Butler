import type { Lesson, Question } from '../learning/types';
const id = 'bnu-lower-parachute';
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先分别数两组，配对后看未配到部分；比较的单位和方向要一致，两个数的变化条件分开。',
  };
}
function number(
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
) {
  return task(suffix, prompt, { kind: 'number', value }, explanation);
}
function steps(
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
) {
  return task(suffix, prompt, { kind: 'steps', values }, explanation);
}
function pair(suffix: string, prompt: string, difference: number) {
  return task(
    suffix,
    prompt,
    {
      kind: 'arithmetic-pair',
      minimum: 0,
      maximum: 20,
      operation: 'subtract',
      result: difference,
    },
    `本站两个填数为0～20整数，依次原数与减数，差${difference}；全部合法有序组合接受，0是本站明示补充，不冒原题范围。`,
  );
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string) {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际做过再确认；原书核对、纸面游戏、书写和说明不由网页答对自动确认，未做如实跳过。',
  );
}
function record(suffix: string, prompt: string) {
  return task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '自己的发现、困惑与未来计划原话保存，不评分，不冒已实际完成。',
  );
}

export const bnuParachuteMail = [
  [11, 3, 8],
  [11, 2, 9],
  [11, 4, 7],
  [15, 6, 9],
  [12, 6, 6],
  [15, 8, 7],
  [15, 7, 8],
  [13, 4, 9],
  [13, 5, 8],
  [12, 3, 9],
  [16, 9, 7],
  [12, 4, 8],
] as const;
function mailGroup(
  suffix: string,
  prompt: string,
  result: number,
  cards: readonly (readonly [number, number, number])[],
) {
  return {
    ...task(
      suffix,
      prompt,
      {
        kind: 'set',
        values: cards.flatMap(([a, b], i) =>
          a - b === result ? [`卡${i + 1}`] : [],
        ),
      },
      `每张卡独立算，得数${result}的全部选齐；重复结果不合并成一张。`,
    ),
    choices: cards.map(([a, b], i) => ({
      id: `卡${i + 1}`,
      label: `卡${i + 1}：${a}−${b}`,
    })),
  };
}
export const bnuLowerParachuteLesson: Lesson = {
  id,
  textbookTitle: '跳伞表演',
  title: '跳伞表演：比较多少与差的变化',
  page: 35,
  version: 1,
  status: 'available',
  goal: '逐组计数并配对解释多几和少几，用同单位减法比较，完整分类十二送信式，并在明示条件下解释两数同增与差不变。',
  prerequisite: '能数20以内数量，理解一一对应、整体与部分，能计算十几减几。',
  parentTip:
    '实际阅读北师大公开扫描35～37页，放大核对圆图、书/苹果、形状及手持信件。原图不打包，本站数卡和说明原创。红14黄6蓝7；书11/8、苹果13/6；形状三角5圆14方15；原十二式包含手持12−6、15−8、15−7、13−4，不遗漏或合并同得数卡。37页角色性别分组未用文字标明，本站不把发型服装当现实性别证据，也不将本站明示女生9男生8冒原图已核准分组；原图分组与少量由共读者核对，未确定原话记待核对。自由差9填数0～20是本站范围，原新算式可另合理书写。实际点数、配图、完整算式和自主发现人工，未来计划不冒实做。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描35～37页逐项阅读，圆图/形状/信件放大核对',
    notes:
      '35红黄多8与蓝红少7、36书与苹果比较/昨天11今天5/三同差9与自主新组、37桃16对7/形状5-14-15/十二信卡与四箱/男女比较活动覆盖；男女原插画角色分组未文字注明，保留实际核对与开放记录，不由外貌补造自动判分。',
  },
  steps: [
    {
      title: '先数两组，再说多和少',
      text: '第35页原伞图按颜色逐个点数，红14个、黄6个、蓝7个。一个伞对应一个符号，不因伞大小或位置改变数量。求多几、少几要先明确比较哪两组；14不是红比黄多的数量，6也不是差量。',
      activity: '实际点数原三色伞，用不同符号分别记录并复数检查。',
    },
    {
      title: '配对后，剩下的是差量',
      text: '红14与黄6逐个配6对，红还有8个，红比黄多14−6=8个。蓝7与红14配7对，红还有7个，蓝比红少14−7=7个，也就是红比蓝多7个。同一差量换说法不换为7−14；两组相等时多和少的差都是0，是本站迁移。',
      activity: '实际画原两组对应圆图，圈出配对与未配到部分，写两条比较式。',
    },
    {
      title: '书和苹果按各自单位比较',
      text: '第36页上方两排书11本与8本，多3本；两排苹果13个与6个，多7个。分别较大数减较小数，11−8=3本、13−6=7个。不同对象的本和个不能直接比较谁多几本；不把两排相加当差量。',
      activity: '实际核对原两组书及苹果，各配对、完整列式并写单位。',
    },
    {
      title: '今天比昨天少，不是剩了几只鸡',
      text: '原昨天生蛋11个、今天生蛋5个，今天比昨天少11−5=6个。比较的是两天分别下蛋数量，不是昨天11拿走5后剩6，也不是鸡棚里的鸡有6只。原鸡图辅助情境，已知蛋数来自文字，不靠数鸡替代数蛋。可画两排符号配对解释。',
      activity: '实际按原文字条件画两天蛋数、配对并列比较式，说出今天少6个。',
    },
    {
      title: '两个数同时加一，差保持九',
      text: '原11−2、12−3、13−4结果都9。每次原数与减数各加1，多出的1也减掉，所以差不变；只改变一个数时不能套用。原开放空式可自主写新组，本站另指定从14起续14−5、15−6、16−7与自由0～20整数差9的两数，指定路径不冒唯一填法。差9允许9−0，0是本站明确扩展。',
      activity:
        '实际完成原三式，独立再写一组三式并验证两数变化，自己的新组原话另记。',
    },
    {
      title: '桃子与三种形状分别数全',
      text: '第37页原两人摘7个与16个桃子，摘16个的人更多，多16−7=9个；不把树上还没摘的桃加进个人已摘量。形状按类别逐个标记：三角形5个、圆14个、方形15个，三角比圆少14−5=9个，方形比三角多15−5=10个。转动方形不变成另一类，大小颜色与位置不增加件数。',
      activity: '实际核对原桃子文字及全部形状，填完整数量表，再写两条差量式。',
    },
    {
      title: '十二封信全部送，同得数都保留',
      text: '原送信有四个箱6、7、8、9。八张旁列式与四张手持式都要处理；手持12−6=6、15−8=7、15−7=8、13−4=9。所有十二卡按本站卡1～12重新编号，箱6一张、箱7三张、箱8四张、箱9四张。相同得数的不同卡仍各一封，不能只投每箱一张或遗漏手持卡；编号不冒原书已有卡号。',
      activity: '实际算原十二式并逐张连到正确箱，复核全部卡各投一次。',
    },
    {
      title: '先确认分组，才能比较人数',
      text: '原练四问男生比女生少几人，但图中角色分组没有文字人数标签。先与共读者核对原插画两组及每组人数，未确定可记录待核对，不能从现实人物发型服装判性别。本站明确给定女生9人、男生8人的新情境：男生少9−8=1人，也就是女生多1人；共17人。只知道共17人无法唯一求两组差。本站给定不冒原图已核准分组。',
      activity:
        '实际与共读者核对原插画分组和各组人数，再配对、列式与答句；不确定原话另记。',
    },
    {
      title: '说清比较对象、方向和单位',
      text: '差量与较小组本身数量分开，多几和少几可以是同一数量关系的两种说法。两数同增必须同样增加，不能只看结果偶然相同。自己的新组、原图未确定的分组、发现、困难和未来计划独立保存，网页正确不自动确认原图点数、纸面配对或真实交流。',
      activity: '实际用一例说明多与少的反向说法和变化条件。',
    },
  ],
  questions: [
    number('red', '原红伞共有几个？实际点数另做。', 14, '原红14。'),
    number('yellow', '原黄伞共有几个？', 6, '原黄6。'),
    number('blue', '原蓝伞共有几个？', 7, '原蓝7。'),
    steps(
      'red-yellow',
      '原红14黄6，依次填较大数、较小数、多的数。',
      [14, 6, 8],
      '14−6=8个。',
    ),
    steps(
      'red-blue',
      '原蓝7比红14少，依次填比较减法的原数、减数、差。',
      [14, 7, 7],
      '少几用较大14减较小7，差7不等于总量14。',
    ),
    choice(
      'inverse',
      '蓝比红少7个，也可以怎样说？',
      '红比蓝多7个',
      ['红比蓝多7个', '红比蓝少7个', '蓝共有14个'],
      '换方向与多/少同时交换，差不变。',
    ),
    number(
      'zero-difference',
      '本站新两组各10个伞，一组比另一组多几个？',
      0,
      '相等，差0。',
    ),
    steps(
      'books',
      '原两排书11本与8本，依次填较大数、较小数、多几本。',
      [11, 8, 3],
      '差3本，合19本不是多几本。',
    ),
    steps(
      'apples',
      '原两排苹果13个与6个，依次填较大数、较小数、多几个。',
      [13, 6, 7],
      '差7个。',
    ),
    choice(
      'book-unit',
      '原书比较的完整答句是哪项？',
      '第一排比第二排多3本',
      ['第一排比第二排多3本', '第一排比第二排多3个苹果', '两排共有3本'],
      '对象、方向与本一致。',
    ),
    steps(
      'eggs',
      '原昨天11蛋今天5蛋，依次填昨天数、今天数、今天少几个。',
      [11, 5, 6],
      '11−5=6个是两天比较。',
    ),
    choice(
      'egg-meaning',
      '这里11−5比较什么？',
      '昨天与今天各自下蛋数',
      ['昨天与今天各自下蛋数', '鸡棚里鸡的只数', '昨天蛋拿走5后剩余'],
      '不是拿走情境。',
    ),
    steps(
      'pattern-original',
      '原11−2、12−3、13−4，依次填三式全部结果。',
      [9, 9, 9],
      '两数每次同增1，差都9。',
    ),
    choice(
      'pattern-condition',
      '原三式差不变，哪个变化条件完整？',
      '原数和减数都加1',
      ['原数和减数都加1', '只有原数加1', '任何两数变化都一样'],
      '两数增加一样多才保持差。',
    ),
    steps(
      'pattern-continue',
      '本站指定续写14−A=9、15−B=9、16−C=9，填A/B/C。原开放新组另写。',
      [5, 6, 7],
      '新三式仍两数同增1。',
    ),
    pair(
      'free-difference',
      '本站差9自由填数：依次填原数、减数，两数为0～20整数，允许0，原数−减数=9。',
      9,
    ),
    choice(
      'peach-person',
      '原两人分别摘7个和16个桃子，谁摘得多？',
      '摘16个的人',
      ['摘16个的人', '摘7个的人', '两人一样'],
      '比较已摘文字数，不加树上未摘。',
    ),
    number(
      'peach-difference',
      '原16个与7个已摘桃子，多几个？',
      9,
      '16−7=9个。',
    ),
    steps(
      'shapes',
      '原形状表按三角形、圆、方形顺序填全部数量。',
      [5, 14, 15],
      '各类别逐个标记，不遗漏重数。',
    ),
    number(
      'triangle-less',
      '原三角5个圆14个，三角比圆少几个？',
      9,
      '14−5=9个。',
    ),
    number(
      'square-more',
      '原方形15个三角5个，方形比三角多几个？',
      10,
      '15−5=10个。',
    ),
    ...bnuParachuteMail.map(([a, b, result], i) =>
      number(
        `mail-${i}`,
        `原送信本站编号卡${i + 1}：${a}−${b}，应送到几号箱？`,
        result,
        `${a}−${b}=${result}，每卡单独投。`,
      ),
    ),
    ...[6, 7, 8, 9].map((result) =>
      mailGroup(
        `group-${result}`,
        `从全部十二卡中选齐应投${result}号箱的卡。本站编号各卡独立，不能遗漏同结果卡。`,
        result,
        bnuParachuteMail,
      ),
    ),
    number(
      'labeled-difference',
      '本站明确女生9人男生8人的新情境，男生比女生少几人？不冒原图已核准分组。',
      1,
      '9−8=1人。',
    ),
    choice(
      'labeled-inverse',
      '同一本站女生9男生8，还可怎样说？',
      '女生比男生多1人',
      ['女生比男生多1人', '女生比男生少1人', '男生共有1人'],
      '方向换，少换多。',
    ),
    number(
      'labeled-total',
      '同一明确给定女生9人男生8人，这两组无重叠共有几人？',
      17,
      '9+8=17是总量，不是差1。',
    ),
    choice(
      'unknown',
      '只知道两组共17人、不知各组人数，能唯一确定两组差吗？',
      '不能，还需每组数量',
      ['不能，还需每组数量', '能，必定1人', '能，未知就填0'],
      '不擅自沿用本站9和8。',
    ),
    choice(
      'difference-meaning',
      '比较多几少几，差量与较小组数量是什么关系？',
      '含义不同，不能直接当同一个量',
      ['含义不同，不能直接当同一个量', '永远相同', '只要颜色一样就相同'],
      '数值偶然相同也不等于意义相同。',
    ),
    actual('actual-colors', '实际完整点数原三色伞、用符号记录并复数检查。'),
    actual('actual-pair', '实际画原红黄、红蓝对应图，分别写多几和少几的算式。'),
    actual(
      'actual-comparisons',
      '实际核对原两排书与苹果，逐组配对、列式并说单位。',
    ),
    actual('actual-eggs', '实际按原两天生蛋文字画图，列比较式与完整答句。'),
    actual(
      'actual-pattern',
      '实际算原三式并自主写一组三个新算式，核对两数变化和结果。',
    ),
    actual(
      'actual-peaches',
      '实际按原两人的已摘桃数比较、列式与答句，不加入树上未摘桃。',
    ),
    actual(
      'actual-shapes',
      '实际逐个标记原全部形状，完整填写三格数量与两条比较式。',
    ),
    actual(
      'actual-mail',
      '实际完整算原十二卡、逐卡送四箱，各投一次且同结果卡不遗漏。',
    ),
    actual(
      'actual-children',
      '实际与共读者核对原角色分组、各组人数和少量，再配对列式。未确认如实跳过，不凭现实发型服装分组。',
    ),
    actual('actual-explain', '实际说明一个比较的反向说法和两数同增的条件。'),
    record('own-formulas', '记录自己写的新一组三式与发现，不限本站续写示例。'),
    record(
      'original-children',
      '记录原插画分组核对依据、两组人数和差量；未核准可如实写待核对，不评分。',
    ),
    record('discovery', '记录对多几少几、配对或差不变的发现。'),
    record('difficulty', '记录还不清楚的数量、分组或比较条件。'),
    record('plan', '记录下次准备核对、画图或说明的计划，不当已实际完成。'),
  ],
  reviewQuestions: [
    number(
      'review-parachutes',
      '换新明确红13黄9，红比黄多几个？',
      4,
      '13−9=4。',
    ),
    steps(
      'review-eggs',
      '换新昨天14蛋今天8蛋，依次填两天数量与今天少的量。',
      [14, 8, 6],
      '14−8=6，新数不沿用11/5。',
    ),
    pair(
      'review-difference',
      '换新差7自由填数，依次原数、减数，两数0～20整数且原数−减数=7。',
      7,
    ),
    mailGroup(
      'review-mail',
      '换新四封信，选齐投7号箱的卡，新编号与原十二卡无关。',
      7,
      [
        [14, 8, 6],
        [13, 4, 9],
        [15, 7, 8],
        [16, 9, 7],
      ],
    ),
    number(
      'review-children',
      '换新明确女生10人男生6人，男生比女生少几人？',
      4,
      '10−6=4人，不抄9/8差1。',
    ),
  ],
};
