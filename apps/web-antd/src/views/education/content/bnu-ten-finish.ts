import type { Lesson, Question } from '../learning/types';

function task(
  id: string,
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
    hint: '明确每个空格或对象的所求，按给定顺序逐项核对；已知0和未填写分开。',
    explanation,
  };
}
function choose(
  id: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(id, suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    `actual-${suffix}`,
    `${prompt}；做过再确认。`,
    { kind: 'manual' },
    '只记录实际操作或完整原书任务，不由网页填答代替。',
  );
}
function reflect(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '开放原话不评分，未来计划与已实际完成分开。',
  );
}
const table = 'bnu-upper-ten-fact-tables';
const totals = Array.from({ length: 11 }, (_, n) => 10 - n);
export const bnuTenFactTablesLesson: Lesson = {
  id: table,
  textbookTitle: '10以内数加与减',
  title: '完整加减法表与分类规律',
  page: 64,
  version: 1,
  status: 'available',
  goal: '补齐全部十以内加法66条和非负减法66条，按得数或运算数分类，并核对表中不同方向的变化。',
  prerequisite: '会十以内分合、加减与缺数。',
  parentTip:
    '对应64～65页。每列依次补齐运算数，全部22列共132条，长组可分次完成。纸上制表、分类与实际合作另记；不只用少量例子代替完整表。',
  review: {
    date: '2026-10-04',
    reviewer: '已核读原书与原创全表条件核对',
    notes:
      '第三方0061印刷64～65页：按得数/包含数整理、完整加减表及竖横斜规律。本站题目原创，来源非出版社托管，ISBN印次未知。',
  },
  steps: [
    {
      title: '先确定完整范围',
      text: '加法两数从0到10，总和不超过10；减法第一数从0到10，第二数不超过第一数，结果不能为负。每个位置有一条有序算式，0+3与3+0位置不同，不能漏掉含0的两端。',
      activity: '实际按范围制卡并检查有没有越界或遗漏。',
    },
    {
      title: '完整加法表',
      text: '按得数10、9一直到0分11列。每列第一加数从得数逐个减到0，第二加数依次从0添到得数。得数10的列有11条，得数0的列只有0+0；共66条。每个空补的是运算数，不是再填已知列标题。',
      activity: '实际把全部11列补成完整加法表。',
    },
    {
      title: '完整减法表',
      text: '按得数0、1一直到10分11列。每列第一数从10逐个减到该列得数，第二数与第一数同步减1。得数0列含10−10到0−0，得数10列只有10−0；共66条。',
      activity: '实际补齐全部减法表，保留减0及全部取走。',
    },
    {
      title: '同批卡更换分类标准',
      text: 'A为5+0，B为5+1，C为2+3。按含加数5选A/B，按得数5选A/C；分类依据改变，不能沿用旧分组。整理减法也要说清按第一数还是按得数。',
      activity: '实际恢复同批卡，按两个标准分别完整分类。',
    },
    {
      title: '说清方向再找规律',
      text: '加法同列3+0到2+1，总和不变；横向3+0到2+0，第二数不变；右上斜2+1到2+0，第一数不变。减法同列10−10到9−9，结果不变；向右10−10到10−9，第一数不变；右上斜9−9到10−9，减去数不变。先指出具体两格，不把不同方向混成一个规律。',
      activity: '在真实完成的纸表分别标竖横斜相邻格并解释。',
    },
    {
      title: '完整核对与收获',
      text: '回看64～65页两张完整表、算式分类和合作要求，逐列检查含0与全部取走。和同伴实际整理可以另记；缺同伴可先独立纸面整理并如实记录。想法与下一次计划分开。',
      activity: '完成原书全表及实际解释，不仅确认示例。',
    },
  ],
  questions: [
    task(
      table,
      'q1',
      '本站加法范围包含0；0+0的结果是多少？',
      { kind: 'number', value: 0 },
      '两部分都已知没有，结果0。',
    ),
    ...totals.map((total) => {
      const first = Array.from({ length: total + 1 }, (_, i) => total - i);
      return task(
        table,
        `add-${total}`,
        `补齐加法表得数${total}的整列。按列出顺序填每条第二加数：${first.map((n) => `${n}+□=${total}`).join('；')}。`,
        { kind: 'steps', values: first.map((n) => total - n) },
        '完整有序列，包含0到总量的全部第二加数。',
      );
    }),
    ...Array.from({ length: 11 }, (_, result) => {
      const first = Array.from({ length: 11 - result }, (_, i) => 10 - i);
      return task(
        table,
        `sub-${result}`,
        `补齐减法表得数${result}的整列。按列出顺序填每条减去的数：${first.map((n) => `${n}−□=${result}`).join('；')}。`,
        { kind: 'steps', values: first.map((n) => n - result) },
        '每条独立；第一数与减去数都逐个少1，结果不变。',
      );
    }),
    {
      ...task(
        table,
        'operand-sort',
        '同批卡A=5+0、B=5+1、C=2+3；选出所有含加数5的卡。',
        { kind: 'set', values: ['A', 'B'] },
        '按运算数分类，不能只按得数5。',
      ),
      choices: [
        { id: 'A', label: 'A：5+0' },
        { id: 'B', label: 'B：5+1' },
        { id: 'C', label: 'C：2+3' },
      ],
    },
    {
      ...task(
        table,
        'result-sort',
        '恢复同批卡A=5+0、B=5+1、C=2+3；改选所有得数5的卡。',
        { kind: 'set', values: ['A', 'C'] },
        '标准改变，A/C结果5而B结果6。',
      ),
      choices: [
        { id: 'A', label: 'A：5+0' },
        { id: 'B', label: 'B：5+1' },
        { id: 'C', label: 'C：2+3' },
      ],
    },
    task(
      table,
      'add-directions',
      '独立核对三个格的得数，依次填：3+0；2+1；2+0。',
      { kind: 'steps', values: [3, 3, 2] },
      '同列前两项总和相同，横斜要分别看哪个数不变。',
    ),
    task(
      table,
      'sub-directions',
      '独立核对三个格的得数，依次填：10−10；9−9；10−9。',
      { kind: 'steps', values: [0, 0, 1] },
      '同列两项结果0，换方向不套同一结论。',
    ),
    actual(
      table,
      'add-table',
      '实际补齐全部加法66条，含得数0～10各列，逐列检查有序两端与每一项',
    ),
    actual(
      table,
      'sub-table',
      '实际补齐全部非负减法66条，含减0、全取与0−0，逐列检查每一项',
    ),
    actual(
      table,
      'sort',
      '实际将同批算式卡恢复后按得数与包含的运算数两种标准分别分类并说明依据',
    ),
    actual(
      table,
      'directions',
      '实际在完成的加减表标竖、横、右上斜相邻两格，各说明什么变化和什么不变',
    ),
    actual(
      table,
      'book',
      '实际完成原书64～65页全表、算式分类与规律；原书空格和本站补运算数分别记录',
    ),
    actual(
      table,
      'explain',
      '实际向同伴或家长说明一次完整整理的方法，根据反馈核对漏项；独立完成如实记录',
    ),
    reflect(table, 'reflection', '记录自己实际发现的一条表中规律或疑问。'),
    reflect(table, 'plan', '下次准备怎样检查完整表的漏项？记录未来计划。'),
  ],
  reviewQuestions: [
    task(
      table,
      'r-add',
      '新顺序补加数：□+2=7；4+□=7；7+□=7；□+7=7。',
      { kind: 'steps', values: [5, 3, 0, 0] },
      '交换空格与次序，保留0边界。',
    ),
    task(
      table,
      'r-sub',
      '新顺序补减去数：9−□=2；5−□=2；2−□=2；10−□=2。',
      { kind: 'steps', values: [7, 3, 0, 8] },
      '每项独立求缺数。',
    ),
    {
      ...task(
        table,
        'r-sort',
        '新卡A=4+0、B=3+1、C=4+2，选出所有得数4的卡。',
        { kind: 'set', values: ['A', 'B'] },
        '改条件和运算数，不沿用主卡分组。',
      ),
      choices: [
        { id: 'A', label: 'A：4+0' },
        { id: 'B', label: 'B：3+1' },
        { id: 'C', label: 'C：4+2' },
      ],
    },
    task(
      table,
      'r-direction',
      '新格逐项求结果：8−6；7−5；8−5。',
      { kind: 'steps', values: [2, 2, 3] },
      '先确认具体位置，结果分别2、2、3。',
    ),
  ],
};
const finish = 'bnu-upper-ten-organize-game';
const cardChoices = [
  ['AG', 'A(2)+G(6)'],
  ['BD', 'B(5)+D(3)'],
  ['CE', 'C(0)+E(8)'],
  ['FI', 'F(4)+I(4)'],
  ['HJ', 'H(7)+J(1)'],
  ['AB', 'A(2)+B(5)'],
  ['CD', 'C(0)+D(3)'],
  ['FG', 'F(4)+G(6)'],
  ['IJ', 'I(4)+J(1)'],
  ['FF', '同一张F(4)用两次'],
];
export const bnuTenOrganizeGameLesson: Lesson = {
  id: finish,
  textbookTitle: '10以内数加与减',
  title: '十以内整理应用与毛毛虫游戏',
  page: 66,
  version: 1,
  status: 'available',
  goal: '完整核对补图、配对、10减几、等结果连线、图故事与缺数，按条件演示添取到正好10的游戏。',
  prerequisite: '会十以内加减表、两步变化与已知总量求部分。',
  parentTip:
    '对应66～69页。本站纸卡情境原创，原图另行完整实做。游戏暂时超过10是原规则允许的回合状态，不将这当正式十以内算式范围。演示刷新重开，不计成绩，实际轮流摸卡另记。',
  review: {
    date: '2026-10-04',
    reviewer: '已核读原书与原创整理条件核对',
    notes:
      '第三方0061印刷66～69页整理、问题银行、三补图、含两张4的凑8、全11项10减几、两组连线、四图故事、六缺数/遮挡/吸管及毛毛虫每次一张/超10后取走/正好10结束；来源非出版社托管。',
  },
  steps: [
    {
      title: '整理自己的表示与问题',
      text: '本站甲10张、乙4张，甲不变，乙再添6张一样多。数可以表示数量或编号，数字7在“7本书”与“7号车”意义不同。自己用3+7或9−1编题时明确条件、所求、单位和答句，真实问题另记。',
      activity: '自制知识图并提出有足够条件的原创问题。',
    },
    {
      title: '完整凑数与10减几',
      text: '补4到9、补3到8、补5到7分别看各自总量。本站卡A2、B5、C0、D3、E8、F4、G6、H7、I4、J1，每张不同，F/I各有一张4，能配成4+4；只有一张F不能重复拿两次。10减几包括减去0至10的全部11种。',
      activity: '用完整纸卡逐一找朋友，核对每张只用一次。',
    },
    {
      title: '完整连线与图故事',
      text: '连线先分别求两列各项，再把得数相同的卡对应。本站蘑菇卡两组3与4，萝卜卡共7分3与4；船上人物卡总6可见1，其余全遮；三盘纸卡3、2、4分别合并。盘数不冒盘中物品数，本站和原图分别核对。',
      activity: '实际完成两组各八式连线与四种图故事。',
    },
    {
      title: '缺数、遮挡与配套',
      text: '等号左右需相等，六个缺数独立看所求。本站10张总卡可见6其余遮，遮4；另用8个杯图和5根吸管图，一杯配一根，还缺3。原书杯图另点数，不套本站数；未知不当0。',
      activity: '实际摆缺数、遮挡和一杯一根配套。',
    },
    {
      title: '毛毛虫回合演示',
      text: '身体有10个位置，每次只用一张数卡。当前不足10时按摸数添片；若已经超过10，下一人按摸数取走，仍超过时后续也照此规则；正好10就成功结束。4、5、3、5、3依次演示成4、9、12、7、10，12不能被强行改成10。',
      activity: '先用下面控件演示，再实际用安全纸圆片轮流游戏。',
      visual: { kind: 'bnu-caterpillar' },
    },
    {
      title: '完整原书与实际收获',
      text: '回看66～69页全部整理、提问、补图配对、10减几、两组连线、四图、缺数、遮挡、缺吸管及真实毛毛虫游戏。每位参与者轮流每次一张；本站演示回合和真实活动分记。计划不是已玩过，反思不自动评星。',
      activity: '完成原书范围并实际说一次方法。',
    },
  ],
  questions: [
    task(
      finish,
      'q1',
      '本站10张全部取走10张，剩余几张？',
      { kind: 'number', value: 0 },
      '已知全取，剩0。',
    ),
    task(
      finish,
      'gap',
      '本站甲10张乙4张，甲保持不变，乙再添几张能一样多？',
      { kind: 'number', value: 6 },
      '10−4=6。',
    ),
    choose(
      finish,
      'meaning',
      '“7本书”里的7表示什么？',
      '书的数量',
      ['书的数量', '车辆编号'],
      '结合对象，数量与编号分开。',
    ),
    task(
      finish,
      'complements',
      '完整三项补数：4+□=9；3+□=8；5+□=7。',
      { kind: 'steps', values: [5, 5, 2] },
      '各项总量不同。',
    ),
    {
      ...task(
        finish,
        'pairs',
        '本站十张不同卡A2、B5、C0、D3、E8、F4、G6、H7、I4、J1。选出下面所有能用两张不同卡凑成8的配对；完整合法五对恰好每卡一次。',
        { kind: 'set', values: ['AG', 'BD', 'CE', 'FI', 'HJ'] },
        '两张4分别F/I可配；同一F重复使用不合法。',
      ),
      choices: cardChoices.map(([id, label]) => ({
        id: String(id),
        label: String(label),
      })),
    },
    task(
      finish,
      'ten-minus',
      '依次计算完整十一项：10−1；10−3；10−5；10−7；10−9；10−0；10−2；10−4；10−6；10−8；10−10。',
      { kind: 'steps', values: [9, 7, 5, 3, 1, 10, 8, 6, 4, 2, 0] },
      '包含0到10的全部减去数，按原顺序而非排序填。',
    ),
    task(
      finish,
      'add-results',
      '完整两列八式，依次求结果：2+4；6+2；4+3；5+5；5+3；2+8；3+3；3+4。',
      { kind: 'steps', values: [6, 8, 7, 10, 8, 10, 6, 7] },
      '左右两列各四独立式。',
    ),
    task(
      finish,
      'add-match',
      '右列编号1=5+3、2=2+8、3=3+3、4=3+4。依次为左列2+4、6+2、4+3、5+5填得数相同的右列编号。',
      { kind: 'steps', values: [3, 1, 4, 2] },
      '依次同得数6、8、7、10，不按位置直连。',
    ),
    task(
      finish,
      'sub-results',
      '完整两列八式，依次求结果：7−5；9−3；8−4；6−6；7−7；6−4；9−5；8−2。',
      { kind: 'steps', values: [2, 6, 4, 0, 0, 2, 4, 6] },
      '完整非负减法，0不是空白。',
    ),
    task(
      finish,
      'sub-match',
      '右列编号1=7−7、2=6−4、3=9−5、4=8−2。依次为左列7−5、9−3、8−4、6−6填相同得数的右列编号。',
      { kind: 'steps', values: [2, 4, 3, 1] },
      '依次同得数2、6、4、0。',
    ),
    task(
      finish,
      'mushrooms',
      '本站蘑菇纸卡两组分别3个和4个，没有重复，共几个？',
      { kind: 'number', value: 7 },
      '3+4=7。',
    ),
    task(
      finish,
      'carrots',
      '本站萝卜卡总7，分成3与4。依次计算3+4；7−3；7−4。',
      { kind: 'steps', values: [7, 4, 3] },
      '合并与两种取走分别求。',
    ),
    task(
      finish,
      'boat',
      '本站船上人物纸卡总6，可见1，其余全部遮住，没有增减，遮住几张？',
      { kind: 'number', value: 5 },
      '6−1=5。',
    ),
    task(
      finish,
      'plates',
      '本站三盘纸卡分别3、2、4个，先合前两盘再合第三盘。依次填两个阶段的总个数。',
      { kind: 'steps', values: [5, 9] },
      '先5再9，盘数与物品数分开。',
    ),
    task(
      finish,
      'six-missing',
      '完整六个空：3+□=8；□+4=7；6=2+□；9=□+6；5+□=9；4+□=8。',
      { kind: 'steps', values: [5, 3, 4, 3, 4, 4] },
      '等号两边与空格位置分别核对。',
    ),
    task(
      finish,
      'worked-missing',
      '本站先用纸卡补数：2+□=9，空格几张？',
      { kind: 'number', value: 7 },
      '从2补到9要7。',
    ),
    task(
      finish,
      'cover',
      '本站总10张纸卡，露6张，其余全遮，无增减，遮几张？',
      { kind: 'number', value: 4 },
      '10−6=4。',
    ),
    task(
      finish,
      'straw',
      '本站纸图8个杯与5根吸管，一杯配一根，每根只用一次，还缺几根？',
      { kind: 'number', value: 3 },
      '本站明确条件8−5=3，原书另点数。',
    ),
    task(
      finish,
      'game',
      '本站演示从0开始，依次用单张数卡4、5、3、5、3，按照当前超过10就取走，否则添片，正好10即停。依次填五回合后的圆片数。',
      { kind: 'steps', values: [4, 9, 12, 7, 10] },
      '第3回合可超到12，第4回合从12取5到7，第5回合正好10停止。',
    ),
    choose(
      finish,
      'above',
      '本站当前铺12片，下一位用一张5，应该怎样操作？',
      '取走5片',
      ['添5片', '取走5片'],
      '回合开始已超过10，所以取走。',
    ),
    task(
      finish,
      'overshoot',
      '本站当前9片，下一张是3，按规则添后几片？',
      { kind: 'number', value: 12 },
      '允许临时超10到12，不能截断数量。',
    ),
    choose(
      finish,
      'stop',
      '本站已经正好10片，这一轮接下来应怎样？',
      '成功结束这一轮',
      ['成功结束这一轮', '再摸一张继续这一轮'],
      '正好10即达到原目标，停止。',
    ),
    choose(
      finish,
      'one-card',
      '同一位参与者一回合按规则最多摸几张？',
      '一张',
      ['一张', '两张'],
      '每回合仅一张，轮流进行。',
    ),
    task(
      finish,
      'take',
      '本站回合开始12片，摸到5取走，剩几片？',
      { kind: 'number', value: 7 },
      '12−5=7是游戏状态核对，正式十内式范围另分。',
    ),
    choose(
      finish,
      'unknown',
      '只知道游戏这回合摸到5，未给之前铺几片，能确定要添5吗？',
      '不能',
      ['能', '不能'],
      '先知道当前量才能判断添或取。',
    ),
    actual(
      finish,
      'knowledge',
      '实际自制数量与算式知识图，用3+7与9−1各编一条有条件、所求、单位和答句的问题',
    ),
    actual(
      finish,
      'pairs',
      '实际用完整十张不同数字卡找出全部五对凑8，含两张不同4，检查每张恰好用一次',
    ),
    actual(
      finish,
      'all-calculations',
      '实际完整核对三补数、十一项10减几、两组各八式连线与六缺数，不只抄网页答案',
    ),
    actual(
      finish,
      'stories',
      '实际摆画蘑菇、萝卜、人物遮挡、三盘四类故事，并核对总量、部分与单位',
    ),
    actual(
      finish,
      'game',
      '实际准备安全纸圆片和1～8数卡，约定轮流每次一张，按原规则添取至正好10；演示与真实摸卡分记',
    ),
    actual(
      finish,
      'book',
      '实际完成原书66～69页知识图与问题银行、三补图、凑8、全部10减几、两组连线、四图故事、缺数、遮挡、吸管和毛毛虫活动，原书与本站分记',
    ),
    actual(
      finish,
      'explain',
      '实际向同伴说明一种补数/连线方法与一次游戏添取判断，并用实物核对',
    ),
    reflect(
      finish,
      'reflection',
      '记录今天实际发现的整理方法或游戏收获，不自动评星。',
    ),
    reflect(finish, 'plan', '下次准备怎样核对未知条件或漏项？记录未来计划。'),
  ],
  reviewQuestions: [
    task(
      finish,
      'r-missing',
      '新条件完整补数：2+□=8；□+5=9；7=3+□；8=□+6。',
      { kind: 'steps', values: [6, 4, 4, 2] },
      '改变条件和空格位置。',
    ),
    task(
      finish,
      'r-match',
      '新右卡编号1=5−5、2=7−3、3=8−2；依次为6−2、9−3、4−4填同得数的编号。',
      { kind: 'steps', values: [2, 3, 1] },
      '新三组同得数4、6、0。',
    ),
    task(
      finish,
      'r-game',
      '新演示从0依次单卡6、3、2、4、3，按超过10后取走、正好10停。填五回合后圆片数。',
      { kind: 'steps', values: [6, 9, 11, 7, 10] },
      '新回合11取4到7，再添3成功。',
    ),
    task(
      finish,
      'r-straw',
      '新纸图9个杯配6根吸管，每杯一根且不重复，还缺几根？',
      { kind: 'number', value: 3 },
      '9−6=3，条件改变。',
    ),
  ],
};
