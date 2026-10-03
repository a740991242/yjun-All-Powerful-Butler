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
    hint: '先看完整条件，明确求哪一步或哪一部分；按列出次序填写，空白不当0。',
    explanation,
  };
}
function choose(
  id: string,
  suffix: string,
  prompt: string,
  correct: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(
      id,
      suffix,
      prompt,
      { kind: 'choice', value: correct },
      explanation,
    ),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    `actual-${suffix}`,
    `${prompt}；做过再确认。`,
    { kind: 'manual' },
    '只记录真实纸面、摆卡或交流活动，不由网页填对代替。',
  );
}
function reflection(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '保存真实原话或家长代录；反思不评分，未来计划与实际完成分开。',
  );
}
const two = 'bnu-upper-two-step-changes';
export const bnuTwoStepLesson: Lesson = {
  id: two,
  textbookTitle: '10以内数加与减',
  title: '两步变化、乘车与分类范围',
  page: 57,
  version: 1,
  status: 'available',
  goal: '明确两次变化的次序，记录中间量和最终量，从同一批对象的不同分类中提出问题。',
  prerequisite: '理解十以内添入、取走与两部分合并。',
  parentTip:
    '对应57～59页。乘车只用原创纸卡模拟，不要求儿童到车辆或道路上试验。两步式每题先恢复初始量；原书图与本站条件分开，实做另记。',
  review: {
    date: '2026-10-03',
    reviewer: '已核读公开原书与原创条件核对',
    notes:
      '第三方0061印刷57～59页：乘车连续上/下、终点全下、合唱两种分类、自主问题、黄瓜/人数/鱼图、六两步式、10人隐藏；来源非出版社托管，ISBN与印次未知。',
  },
  steps: [
    {
      title: '先添再添',
      text: '本站纸上乘车故事从2人开始，第一站上3人，第二站又上3人。先有2+3=5，再用当时的5算5+3=8。接着数可辅助核对，中间5与最终8都要记录。',
      activity: '用纸卡演示两站，只模拟不去真实车辆试验。',
    },
    {
      title: '先取再取',
      text: '本站纸卡原有8人，先下5人，再下1人。先剩3，再从3取1剩2。终点故事改为原有4、先下2、再下剩余2，最终0。第二次不能再从初始量出发。',
      activity: '分别演示两个独立故事，每个故事开始时恢复原有量。',
    },
    {
      title: '完整两步式',
      text: '连加、连减、加减混合都按题目从左向右的次序操作。先算前两个数得到中间量，再作第二次变化。本站逐一检查六条算式的中间量和结果；不同算式各自重新开始。',
      activity: '实际用卡或画点核对全部六条，不只抄结果。',
    },
    {
      title: '分类范围不能重复相加',
      text: '本站合唱队4名男生、5名女生，共9人；同一队又排成2、3、4人三排，也共9人。两种分类数的是同一批人，不能把9和9再相加当有18人。每排、类别与全部人数是不同问题。',
      activity: '自画9张人物纸卡，用两种明确标准分类。',
      visual: { kind: 'count-groups', groups: [2, 3, 4] },
    },
    {
      title: '提出有条件的问题',
      text: '本站10张人物卡，3张放树后，其余全部放小屋内，没有遗漏或重复；求小屋内用10−3=7。若不知道总量，不能由树后3张猜小屋7张。自己提问时说清总量、变化或分类和单位。',
      activity: '创编一条有足够条件的数学问题并画卡核对。',
    },
    {
      title: '原书与真实解释',
      text: '回看57～59页乘车、合唱、黄瓜、人数、鱼和捉迷藏；原图分别点数，不把本站纸卡数套回原图。算式六项逐条完成；实际向同伴解释先算什么、再用什么数。',
      activity: '完成原书并记录实际方法，未做的另列计划。',
    },
  ],
  questions: [
    task(
      two,
      'q1',
      '本站原有4张人物卡，先取2张，再取当时剩余的全部2张，最终剩几张？',
      { kind: 'number', value: 0 },
      '从4到2再到0。',
    ),
    task(
      two,
      'bus-up',
      '本站纸上车原有2人，第一站上3人，第二站再上3人。依次填第一站后和第二站后人数。',
      { kind: 'steps', values: [5, 8] },
      '2+3=5，再5+3=8。',
    ),
    task(
      two,
      'bus-down',
      '本站纸上车原有8人，先下5人，再下1人。依次填两次下车后剩余。',
      { kind: 'steps', values: [3, 2] },
      '先8−5=3，再3−1=2。',
    ),
    task(
      two,
      'terminal',
      '新独立故事原有4人，前门先下2人，后门再下剩余2人。依次填两次后的剩余。',
      { kind: 'steps', values: [2, 0] },
      '第二步从2出发，最终没有人。',
    ),
    ...[
      ['a', '10−8+5', 2, 7],
      ['b', '10−7−3', 3, 0],
      ['c', '4+2+1', 6, 7],
      ['d', '2+7+1', 9, 10],
      ['e', '6−3+7', 3, 10],
      ['f', '3+5−6', 8, 2],
    ].map(([suffix, expression, middle, final]) =>
      task(
        two,
        `calc-${suffix}`,
        `这条算式独立开始：${expression}。先填第一步结果，再填最终结果。`,
        { kind: 'steps', values: [Number(middle), Number(final)] },
        '按从左到右次序，第二步从第一步结果出发。',
      ),
    ),
    task(
      two,
      'choir',
      '本站合唱队4名男生、5名女生，两类不重复，队员共几人？',
      { kind: 'number', value: 9 },
      '4+5=9。',
    ),
    task(
      two,
      'rows',
      '同一队员排三排，第一排2人、第二排3人、第三排4人，每人只在一排，共几人？',
      { kind: 'number', value: 9 },
      '2+3+4=9，仍同一队。',
    ),
    choose(
      two,
      'double-count',
      '上述男女分类得到9人，排次分类也得到9人。能把这两个9相加说同一队有18人吗？',
      '不能',
      ['能', '不能'],
      '同一批队员重新分类，人数不增加。',
    ),
    task(
      two,
      'hide',
      '本站10张人物卡，3张全放树后，其余全部放小屋内，无增减遗漏。小屋内几张？',
      { kind: 'number', value: 7 },
      '10−3=7。',
    ),
    choose(
      two,
      'current',
      '本站8张先取5再取1，第二次应该从哪个量取1？',
      '第一次剩下的3张',
      ['初始8张', '第一次剩下的3张'],
      '连续变化使用当时剩余。',
    ),
    choose(
      two,
      'unknown',
      '只知树后3张，未给总张数，能确定小屋里7张吗？',
      '不能',
      ['能', '不能'],
      '条件不足，未知不当确定数。',
    ),
    task(
      two,
      'three-groups',
      '本站三组互不重复纸卡分别4、2、3张。先合前两组，再合第三组，依次填这两个总量。',
      { kind: 'steps', values: [6, 9] },
      '4+2=6，6+3=9。',
    ),
    choose(
      two,
      'static',
      '只给同一时刻三组纸卡各4、2、3张，能说其中2张后来上车吗？',
      '不能',
      ['能', '不能'],
      '静态分类未给发生时间，不能冒变化事件。',
    ),
    actual(two, 'up', '实际用纸卡完整演示2+3+3，标初始、中间与最终人数'),
    actual(two, 'down', '实际另起8张演示8−5−1，第二次从当前剩余取'),
    actual(two, 'terminal', '实际另起4张演示两次各下2张，最终全下并解释0'),
    actual(
      two,
      'six',
      '实际分别恢复每题原有量，完整画摆六条两步式并记录每条中间与结果',
    ),
    actual(
      two,
      'choir',
      '实际用9张人物纸卡按类别与排次重新分类，提出一条有充分条件的问题并解答',
    ),
    actual(
      two,
      'book',
      '实际完成原书57～59页两次乘车和终点、合唱提问、黄瓜/人数/鱼图、完整六式与10人隐藏题，原图和本站分记',
    ),
    actual(
      two,
      'explain',
      '实际向同伴说明两步式的第一步、当前量和第二步，并根据反馈核对',
    ),
    reflection(two, 'reflection', '记录今天实际采用的两步计算方法或疑问。'),
    reflection(two, 'plan', '下一次准备怎样区分中间和最终量？记录未来计划。'),
  ],
  reviewQuestions: [
    task(
      two,
      'r-up',
      '新纸卡故事原有1人，两站先上4再上2。依次填两站后人数。',
      { kind: 'steps', values: [5, 7] },
      '1+4=5，再5+2=7。',
    ),
    task(
      two,
      'r-down',
      '新故事原有9人，先下4，再下剩余全部5。依次填两次剩余。',
      { kind: 'steps', values: [5, 0] },
      '先剩5，取完剩0。',
    ),
    task(
      two,
      'r-mixed',
      '新独立算式7−5+6，依次填中间与最终结果。',
      { kind: 'steps', values: [2, 8] },
      '先2再8，条件改变。',
    ),
    choose(
      two,
      'r-range',
      '新一组8张卡，按颜色数得8、按形状数也得8，能相加成16张吗？',
      '不能',
      ['能', '不能'],
      '同一批卡重分不增加数量。',
    ),
  ],
};

const difference = 'bnu-upper-difference-transfer';
export const bnuDifferenceLesson: Lesson = {
  id: difference,
  textbookTitle: '10以内数加与减',
  title: '求差、添入与移给的区别',
  page: 60,
  version: 1,
  status: 'available',
  goal: '通过逐一配对求多几或少几，区分少的一方新增与大的一方移给，并核对两边同时变化。',
  prerequisite: '会十以内比较、配对与加减。',
  parentTip:
    '对应60～61页；用安全纸卡和相同积木模拟，不操作农具。重量情境只有明确相同重量时才用件数判断，真实天平平衡另核验。',
  review: {
    date: '2026-10-03',
    reviewer: '已核读公开原书与原创条件核对',
    notes:
      '第三方0061印刷60～61页：5与3求差、少方再添2、从多方移1、飞机差、四缺数等式、天平；本站情境原创，来源非出版社托管，ISBN与印次未知。',
  },
  steps: [
    {
      title: '逐一配对求差',
      text: '本站甲有5张、乙有3张，每张逐一配对，甲剩2张未配，所以甲多2、乙少2；相等时没有未配，差0。差表示数量相差，不是两边合起来8张。',
      activity: '用两排纸卡配对，标配上与未配部分。',
      visual: { kind: 'count-groups', groups: [5, 3] },
    },
    {
      title: '给少的一方添新卡',
      text: '若甲仍5张不变，乙从别处新增2张，乙3+2=5，两边各5张。卡片全部数由8变成10。这是添入新卡，不是从甲拿走。',
      activity: '从另外材料堆给乙添2，分别核对两边与全部。',
    },
    {
      title: '从多的一方移给',
      text: '若只用原有甲5、乙3，甲移给乙1张，甲5−1=4，乙3+1=4，两边相等，全部仍8。移一张两边各变1，原差2不表示要移2；若移2会变成3和5。',
      activity: '恢复5与3，逐张移给并记录两边。',
    },
    {
      title: '读完整缺数等式',
      text: '等号两边应相等。□+4=7求第一个加数；5=□+3虽总数在左也一样读；5+3=□+6、6+1=9−□先求已知一边再找空格。空白不是0。',
      activity: '实际用卡核对全部四等式，不只背缺数。',
    },
    {
      title: '相同重量与不充分条件',
      text: '本站天平模型明确每块同样重，左6块右4块；移左1块到右，两边各5块。原书不同颜色模型若重量未知，不能仅凭块数断言实际平衡。只有在给定同样重且其它条件相同的模型里才可用数量比较。',
      activity: '用相同安全物品纸面模拟，真实稳定或平衡单独观察。',
    },
    {
      title: '原书与方法说明',
      text: '回看60～61页挖红薯、两种一样多办法、飞机、四等式与天平。本站纸卡数与原图分别核对。说明自己采取添新卡还是移给，两边怎样变，计划和实际操作分开。',
      activity: '完整原书任务与真实说明独立记录。',
    },
  ],
  questions: [
    task(
      difference,
      'q1',
      '本站甲4张、乙4张，甲比乙多几张？',
      { kind: 'number', value: 0 },
      '相同数量，差0。',
    ),
    task(
      difference,
      'gap',
      '本站甲5张乙3张，甲比乙多几张？',
      { kind: 'number', value: 2 },
      '5−3=2，差不是总数8。',
    ),
    task(
      difference,
      'add',
      '甲仍5张不变，乙原3张，从别处添几张能与甲一样多？',
      { kind: 'number', value: 2 },
      '乙再添2到5。',
    ),
    task(
      difference,
      'move',
      '恢复甲5、乙3；甲移给乙1张，依次填移后甲、乙各几张。',
      { kind: 'steps', values: [4, 4] },
      '甲减1乙加1，两边都要更新。',
    ),
    task(
      difference,
      'move-count',
      '只用原有甲5、乙3，甲要移给乙几张，使两边相等？',
      { kind: 'number', value: 1 },
      '移1使4和4；不能把差2当移给量。',
    ),
    task(
      difference,
      'overmove',
      '另恢复甲5、乙3，若甲移给乙2张，依次填甲、乙移后数量。',
      { kind: 'steps', values: [3, 5] },
      '移2会变3与5，并未相等。',
    ),
    task(
      difference,
      'added-total',
      '另恢复甲5、乙3，从别处只给乙添2张。依次填添后甲、乙数量。',
      { kind: 'steps', values: [5, 5] },
      '甲没有拿出，乙增加。',
    ),
    task(
      difference,
      'four',
      '逐项填空：□+4=7；5=□+3；5+3=□+6；6+1=9−□。',
      { kind: 'steps', values: [3, 2, 2, 2] },
      '读完整左右两边，空格所求不同。',
    ),
    task(
      difference,
      'planes',
      '本站纸飞机卡甲7张、乙3张，甲保持不变，乙另添几张与甲一样多？',
      { kind: 'number', value: 4 },
      '7−3=4；本站明确数与原图分别记。',
    ),
    task(
      difference,
      'blocks',
      '本站每块积木同样重；左6块右4块，从左移1块到右，依次填两边块数。',
      { kind: 'steps', values: [5, 5] },
      '同样重模型两边各5；实际平衡还需观察。',
    ),
    choose(
      difference,
      'weight',
      '两堆不同物品各有4件，重量未给，能仅凭件数确定两边同样重吗？',
      '不能',
      ['能', '不能'],
      '件数相等不保证不同物品总重量相等。',
    ),
    task(
      difference,
      'invariant',
      '恢复甲5乙3，只在两边之间移卡，不增不减，全部仍几张？',
      { kind: 'number', value: 8 },
      '移给只改变所在位置，总量不变。',
    ),
    task(
      difference,
      'new-total',
      '另恢复甲5乙3，乙从别处添2张，甲不变，两边全部几张？',
      { kind: 'number', value: 10 },
      '5+5=10，与原卡互移不同。',
    ),
    choose(
      difference,
      'odd',
      '本站甲5张乙2张，只能移动完整卡，不增不减；能移成两边一样多吗？',
      '不能',
      ['能', '不能'],
      '全部7张不能分成两组一样多的完整张数；可实际逐张尝试。',
    ),
    actual(
      difference,
      'pair',
      '实际摆5张与3张逐一配对，指出多出2与总量8的区别',
    ),
    actual(
      difference,
      'add',
      '实际恢复5与3，从另一堆给少方添2，记录两边与全部数',
    ),
    actual(
      difference,
      'move',
      '实际另恢复5与3，先移1核对相等，再另恢复试移2核对不相等',
    ),
    actual(
      difference,
      'equations',
      '实际完整写读四缺数等式，用纸卡核对每个空与两边相等',
    ),
    actual(
      difference,
      'book',
      '实际完成原书60～61页红薯比较与两种方法、飞机题、四等式和天平讨论；不把未知重量冒同重，原图和本站分记',
    ),
    actual(
      difference,
      'explain',
      '实际向同伴说明添新卡与移给各怎样改变两边和全部数',
    ),
    reflection(
      difference,
      'reflection',
      '记录今天实际使用的比较或移给方法以及疑问。',
    ),
    reflection(difference, 'plan', '下次准备怎样核对两边同时改变？记录计划。'),
  ],
  reviewQuestions: [
    task(
      difference,
      'r-gap',
      '新卡甲6乙2，甲比乙多几张？',
      { kind: 'number', value: 4 },
      '6−2=4，条件改变。',
    ),
    task(
      difference,
      'r-move',
      '新卡甲6乙2，甲移2给乙，依次填两边数量。',
      { kind: 'steps', values: [4, 4] },
      '两边各变2，总量8不变。',
    ),
    task(
      difference,
      'r-add',
      '新卡甲5乙1，甲不变，乙从别处添4，依次填甲、乙、全部数。',
      { kind: 'steps', values: [5, 5, 10] },
      '两边各5，全部10；与互移的总量不变区别。',
    ),
    task(
      difference,
      'r-four',
      '新等式逐项填空：□+2=6；7=□+4；4+4=□+5；5+2=8−□。',
      { kind: 'steps', values: [4, 3, 3, 1] },
      '各等式条件改变。',
    ),
  ],
};

const hidden = 'bnu-upper-hidden-quantities';
export const bnuHiddenLesson: Lesson = {
  id: hidden,
  textbookTitle: '10以内数加与减',
  title: '已知总量与连续遮挡',
  page: 62,
  version: 1,
  status: 'available',
  goal: '明确已知总量、可见与遮挡三部分关系，核对连续画面中本次新增遮挡和累计遮挡的区别。',
  prerequisite: '会十以内分合与两步变化。',
  parentTip:
    '对应62～63页。只用纸卡与纸片遮挡模拟，不复制原书企鹅图。首次完整核对8张并约定期间无增减；未知总量时不推确定隐藏量。',
  review: {
    date: '2026-10-03',
    reviewer: '已核读公开原书与原创条件核对',
    notes:
      '第三方0061印刷62～63页四幅企鹅画面、问号、8−2与2添6、8−5和5−2两段及画摆收获；本站纸卡原创，来源非出版社托管，ISBN与印次未知。',
  },
  steps: [
    {
      title: '先核对总量',
      text: '本站先打开全部纸卡，核对共有8张，并约定整个故事没有增加或取走。之后有2张可见，其余全部遮住；问遮住量可用总量8减可见2。只看到2而不知道总量时无法确定遮住量。',
      activity: '先实际点数全体，再用纸片遮挡。',
    },
    {
      title: '两种关系核对',
      text: '求遮住量可以想8−2，也可以想2添几变8；两种方法检查同一批纸卡。问号表示待求的问题，不是已经知道0；若全部8张都可见才可确认遮住0。',
      activity: '用添卡与取卡方法分别解释并揭开核对。',
      visual: { kind: 'count', count: 2 },
    },
    {
      title: '连续两次遮挡',
      text: '本站初始8张可见，第一步遮后可见5张，第二步继续遮后可见2张。第一次新遮3张，第二次新遮3张，最后累计遮6张。5−2只算第二次新增，不能把3当累计全部。',
      activity: '逐步遮挡并记录每次新遮与累计遮，不移动出总量。',
    },
    {
      title: '变化与画面条件',
      text: '以上推断依赖已知8且无增减、所有卡只在可见或遮住之一。若拿走或添了卡，必须重新核对总量；如果只提供最后露出的2张，不给总量，不能沿用前一题8。',
      activity: '另开未知总量故事，说清还需要什么信息。',
    },
    {
      title: '原书与方法收获',
      text: '回看62～63页完整四画面，说明问题是什么，完整核对总量、可见与遮挡。画摆、不同方法与实际解释分别记录；本站纸卡与原书图分开，不从网页填对冒原书实做。',
      activity: '完成原书并解释累计与本次的区别，计划另记。',
    },
  ],
  questions: [
    task(
      hidden,
      'q1',
      '本站核对一共8张纸卡，8张全可见，没有遮住的卡，遮住几张？',
      { kind: 'number', value: 0 },
      '已知全可见，遮挡0。',
    ),
    task(
      hidden,
      'whole',
      '本站总数8张，无增减，可见2张，其余全部遮住。遮住几张？',
      { kind: 'number', value: 6 },
      '8−2=6。',
    ),
    task(
      hidden,
      'stages',
      '本站8张先全可见，第一次后可见5，第二次后可见2，无增减。依次填第一次新遮、第二次新遮、最终累计遮住。',
      { kind: 'steps', values: [3, 3, 6] },
      '8−5=3、5−2=3，累计3+3=6。',
    ),
    choose(
      hidden,
      'partial',
      '上述连续画面5−2=3求的是什么？',
      '第二次新遮的3张',
      ['最终全部遮住的3张', '第二次新遮的3张'],
      '第二次变化量不是最终累计量。',
    ),
    task(
      hidden,
      'complement',
      '本站共8张，可见2张；2+□=8，填遮住的张数。',
      { kind: 'number', value: 6 },
      '从2补到8需要6，与减法同一关系。',
    ),
    choose(
      hidden,
      'unknown',
      '新故事只说可见2张，未给总量，能确定遮住6张吗？',
      '不能',
      ['能', '不能'],
      '不能沿用旧故事总量8。',
    ),
    choose(
      hidden,
      'zero',
      '一个遮挡问题还没有填答案，能把未知空白当0张吗？',
      '不能',
      ['能', '不能'],
      '0是明确已知没有，不是未填写。',
    ),
    {
      ...task(
        hidden,
        'picture',
        '本站纸图只显示2个可见标记；另已核对总量8且无增减，其余全部遮挡。求遮挡张数。',
        { kind: 'number', value: 6 },
        '图只显示可见部分，总量来自明确条件。',
      ),
      visual: { kind: 'count', count: 2 },
    },
    task(
      hidden,
      'first-visible',
      '本站总量8，其中先遮3张，其余可见。此时可见几张？',
      { kind: 'number', value: 5 },
      '8−3=5，所求改为可见。',
    ),
    task(
      hidden,
      'reverse',
      '本站核对总量8，其中遮6张，其余可见。可见几张？',
      { kind: 'number', value: 2 },
      '8−6=2，反向读取条件。',
    ),
    choose(
      hidden,
      'changed-total',
      '此前有8张，后来是否添取没有说明；现在露出2张，能仍确定遮住6张吗？',
      '不能',
      ['能', '不能'],
      '必须确认总量在过程中保持。',
    ),
    {
      ...task(
        hidden,
        'methods',
        '本站总8可见2，连续可见曾从8到5再到2，无增减。选出所有可求最终累计遮住量的方法。',
        { kind: 'set', values: ['减可见', '补总量', '合两次'] },
        '8−2、2补到8、两次3合成6都可；仅5−2是第二次新增。',
      ),
      choices: [
        { id: '减可见', label: '8减去最终可见2' },
        { id: '补总量', label: '从最终可见2补到总量8' },
        { id: '合两次', label: '合并第一次与第二次新遮的数量' },
        { id: '仅第二次', label: '只把5−2的3当最终累计量' },
      ],
    },
    actual(
      hidden,
      'total',
      '实际打开并完整点数8张，约定期间不增不减，再遮到可见2张',
    ),
    actual(
      hidden,
      'methods',
      '实际用总量减可见与可见补总量两种方法核对遮住量，再揭开检查',
    ),
    actual(
      hidden,
      'stages',
      '实际按8全可见、可见5、可见2三个阶段遮挡，分别记录两次新遮与最终累计',
    ),
    actual(
      hidden,
      'draw',
      '实际画一套原创遮挡纸图，标已知总量和可见数，提出问题并核对答句单位',
    ),
    actual(
      hidden,
      'book',
      '实际完成原书62～63页四画面读图、所求问号、两种关系及两段变化的核对、画摆与收获，原书和本站分记',
    ),
    actual(
      hidden,
      'explain',
      '实际向同伴说明本次新增遮挡与全部遮挡的区别，并演示验证',
    ),
    reflection(
      hidden,
      'reflection',
      '记录实际采用的遮挡求数方法或仍不明白的问题。',
    ),
    reflection(
      hidden,
      'plan',
      '下次准备怎样核对总量不变和累计量？记录未来计划。',
    ),
  ],
  reviewQuestions: [
    task(
      hidden,
      'r-hidden',
      '新纸卡已核对共9张，最终可见4张，期间无增减，其余全遮住；遮住几张？',
      { kind: 'number', value: 5 },
      '新总量与可见数改变。',
    ),
    task(
      hidden,
      'r-stages',
      '新纸卡总9，依次从全可见9到可见7再到可见4，无增减。依次填两次新遮与最终累计。',
      { kind: 'steps', values: [2, 3, 5] },
      '两次变化分别2和3，最终5。',
    ),
    task(
      hidden,
      'r-visible',
      '新卡总量9，遮住5，其余可见。可见几张？',
      { kind: 'number', value: 4 },
      '9−5=4，所求改变。',
    ),
    choose(
      hidden,
      'r-partial',
      '新画面可见从7变4，已知全体9且无增减，7−4求本次还是最终累计？',
      '本次新增',
      ['本次新增', '最终累计'],
      '本次3，累计5，不能混用。',
    ),
  ],
};
