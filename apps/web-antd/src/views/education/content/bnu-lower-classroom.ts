import type {
  Lesson,
  PeriodicShapesVisual,
  PlaneCardsVisual,
  Question,
  Visual,
} from '../learning/types';

const id = 'bnu-lower-classroom-decoration';
const mainTwo: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'circle', size: 1, turn: 0 },
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'circle', size: 1, turn: 0 },
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'circle', size: 1, turn: 0 },
  ],
};
const reviewTwo: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'circle', size: 1, turn: 0 },
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'circle', size: 1, turn: 0 },
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'circle', size: 1, turn: 0 },
    { shape: 'circle', size: 2, turn: 0 },
  ],
};
const mainThree: PeriodicShapesVisual = {
  kind: 'periodic-shapes',
  pattern: [
    { shape: 'circle', size: 2 },
    { shape: 'circle', size: 2 },
    { shape: 'triangle', size: 2 },
  ],
  shown: 6,
  total: 9,
};
const reviewThree: PeriodicShapesVisual = {
  kind: 'periodic-shapes',
  pattern: [
    { shape: 'triangle', size: 2 },
    { shape: 'circle', size: 2 },
    { shape: 'circle', size: 2 },
  ],
  shown: 6,
  total: 9,
};
const shapeChoices = [
  { id: '2-circle', label: '大圆' },
  { id: '1-circle', label: '小圆' },
  { id: '2-triangle', label: '大三角形' },
];
function task(
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
    explanation,
    hint: '先指出一组包含的全部位置和顺序，再按题目明确的规则重复；自己的设计、实际合作和未来计划分开。',
    ...(visual ? { visual } : {}),
  };
}
function number(
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
  visual?: Visual,
) {
  return task(suffix, prompt, { kind: 'number', value }, explanation, visual);
}
function shape(
  suffix: string,
  prompt: string,
  value: string,
  explanation: string,
  visual: Visual,
): Question {
  return {
    ...task(suffix, prompt, { kind: 'choice', value }, explanation, visual),
    choices: shapeChoices,
  };
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
    '实际做过再确认；只看网页、想到方案或约定下次做，请如实跳过，不由客观答对自动确认。',
  );
}
function record(suffix: string, prompt: string) {
  return task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '按自己的话保存，未做写未做；不自动给星或判对错，也不把未来计划当已完成。',
  );
}
export const bnuLowerClassroomLesson: Lesson = {
  id,
  textbookTitle: '综合实践 · 设计教室装饰图',
  title: '找重复规律、合作设计与展示改进',
  page: 24,
  version: 1,
  status: 'available',
  goal: '观察并表示装饰中的重复规则，商量位置、材料和分工，实际画设计、分享改进，并分别反思设计、合作和倾听。',
  prerequisite: '能辨认平面轮廓和同形大小，愿意说明自己的排列规则。',
  parentTip:
    '对应实际阅读北师大下册印刷24～26页。两位置大/小圆与三位置圆/圆/三角是本站原创规则示例，不冒原彩旗、灯笼、气球、花盆完整数量或心形剪纸。有限一段未给规则不强判唯一；两颗同样的图形仍占两位置，颜色不参与本站示例。实际小组/家人合作与独自纸面设计分记，不能独自做后确认已小组合作；纸图即可，不要求新购材料或在真实窗门高处布置。三项自评分别记录，不由网页分数代评星。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描24～26页文字、图示及三项评价逐项阅读',
    notes:
      '24观察装饰规律、符号表示和任务说明；25选择地点物品、商量重复单元、分工绘图、一大一小与两个心一花示例；26展示规律与丰富度、倾听后改进、生活中的四季与生肖周期、设计/合作/倾听三项评价分别对应。原自由设计保留多种合理方案，原创图不是原插图，真实活动人工与开放记录分别保存。',
  },
  steps: [
    {
      title: '观察原装饰，先说明范围',
      text: '第24页为班会设计教室装饰，彩旗、灯笼、气球和花盆中可以寻找重复。选定一排或一段，说明从哪里、向什么方向观察，指出你认为重复的一组，再用这组检查后面的顺序。有遮挡或看不清的地方写待核对，不凭本站图卡填成原图全部数量。',
      activity:
        '实际回看原装饰图，分别观察四类装饰并向同伴说明范围、顺序和依据。',
    },
    {
      title: '用符号表示一大一小',
      text: '用画图、符号或自己的话表示规律。本站A～F六张圆卡明确按“大圆、小圆”两位置一组，从左向右重复；大小不同但都叫圆。完整一组有两个位置，不是两种形状；第7位回到大圆，第8位再接小圆。它只模拟一大一小的顺序，不是原灯笼写实图，也不是所有排列都必须两张一组。',
      visual: mainTwo,
      activity:
        '实际用自己的符号记录原图一种规则，并另摆本站两位置规则，逐组检查。',
    },
    {
      title: '先商量装饰哪里、用什么',
      text: '第25页先选择想装饰的地方和物品，再说这些物品怎样重复，最后分工合作画设计。可以在纸上标明黑板或窗门，选现有安全材料的画法；设计地点和真正已布置好不同。先说明共同任务，听完同伴想法，再约定谁画、谁检查、谁介绍；没有同伴时可以先独自画，合作仍记未做。',
      activity:
        '实际商量或独立记录地点、材料、规则及待协商分工，按真实情况说明。',
    },
    {
      title: '三个位置一组也可以设计',
      text: '原例还有两个心形再一朵花。本站改成“大圆、大圆、大三角形”三个位置一组；两张圆卡是两位置，不能合成一位置。图中第7～9位三个问号各占一位置，按已给规则依次补圆、圆、三角。自创规则不必照抄本站，必须能说明一组的完整顺序并检查重复处。先画设计，按约定分工做，再检查有无漏项。',
      visual: mainThree,
      activity:
        '实际完成小组设计图并写清重复单元；独自方案或纸面替代如实记录，不冒已合作。',
    },
    {
      title: '展示后再听取和改进',
      text: '第26页各组分享设计，说用了什么规律、装饰是否丰富。丰富不等于任意乱放，也不只以花费多少评价；可在不同位置采用不同但说得清的规则。认真听他人意见，再选择一项理由充分的改进，说明原来怎样、现在怎样。想到改法、真正改过、未来准备改三个状态分开，不强求接受每条意见。',
      activity: '实际介绍设计、听取一种看法，并实际修改一处或如实写待修改。',
    },
    {
      title: '生活中的重复与时间单位',
      text: '原页举每年春、夏、秋、冬和生肖每12年重复一次。四季名称按春夏秋冬循环，一年又一年；天气和景色不会每次完全一样。生肖例子的一轮是12年，不是12个月，也不是12天。再找一个自己观察到的重复现象，说清对象、顺序和单位；不把少量例子或自己的猜测当已确定规则。',
      activity:
        '实际说出四季与12年例子的单位，并举一个有观察依据的生活重复现象。',
    },
    {
      title: '设计、合作、倾听分别评价',
      text: '原表分别评价能用重复规则设计、能与同伴合作、能认真倾听。三方面不合成一项网页正确率。分别回想真实活动，写做过什么、遇到什么困难或获得什么帮助；尚未做的项如实写未做，不自动打星。可以记录自己的评价依据和下一次计划，计划不当已经改进。',
      activity:
        '实际逐项回顾三方面，分别记录依据、帮助和待做，再提出未来计划。',
    },
  ],
  questions: [
    number(
      'two-unit',
      '本站大圆、小圆两位置为一组，一组共有几个位置？',
      2,
      '一大一小共2位置，都叫圆。',
      mainTwo,
    ),
    shape(
      'two-next-7',
      '按本站已给大圆、小圆两位置重复规则，六张之后第7位应接什么？',
      '2-circle',
      '第7位回到组内第一位大圆。',
      mainTwo,
    ),
    shape(
      'two-next-8',
      '按同一规则，从左数第8位应接什么？',
      '1-circle',
      '第8位对应组内第二位小圆。',
      mainTwo,
    ),
    number(
      'two-shown',
      '本站A～F已经摆出的圆卡共几张？不问大小种类数。',
      6,
      '六个位置各一张，不把大小两类当总数2。',
      mainTwo,
    ),
    shape(
      'three-next-7',
      '本站明确圆、圆、三角三位置一组，第7个问号应填什么？',
      '2-circle',
      '回到这一组第一张大圆。',
      mainThree,
    ),
    shape(
      'three-next-8',
      '同一明确三位置规则，第8个问号应填什么？',
      '2-circle',
      '第二位置仍是大圆，与第一位置不是一张卡。',
      mainThree,
    ),
    shape(
      'three-next-9',
      '同一明确三位置规则，第9个问号应填什么？',
      '2-triangle',
      '第三位置是大三角形。',
      mainThree,
    ),
    number(
      'three-unit',
      '本站圆、圆、三角一组有几个位置？',
      3,
      '三位置，不是只按两种形状数成2。',
      mainThree,
    ),
    number(
      'three-circles',
      '本站这一组三位置中圆卡有几张？两张相同的卡都要数。',
      2,
      '两张圆各占一位置，不合并成一张。',
      mainThree,
    ),
    number(
      'three-types',
      '本站圆、圆、三角一组，按形状名称分为几类？不问位置数。',
      2,
      '圆与三角两类，但这一组有三位置。',
      mainThree,
    ),
    choice(
      'unknown-rule',
      '另一排只给几个图，没有说明规则，能认定只有本站这一种续法吗？',
      '不能，需说明规则并讨论依据',
      ['能，所有排列只能照本站', '不能，需说明规则并讨论依据'],
      '有限片段可有不同合理续法，本课选择题才明确规则。',
    ),
    choice(
      'roles',
      '想合作画设计，哪种做法说明已共同约定分工？',
      '听取意见后商量并明确分工',
      ['只自己决定还没问同伴', '听取意见后商量并明确分工'],
      '计划别人来做不等于已取得共同约定。',
    ),
    choice(
      'richness',
      '设计想更丰富，同时怎样保留重复规律？',
      '各部分规则说清并检查重复',
      ['随便乱摆就算丰富', '各部分规则说清并检查重复'],
      '允许不同部位采用不同规则，仍需解释和检查。',
    ),
    choice(
      'evaluation',
      '网页题答对，就能自动为真实合作和倾听打满星吗？',
      '不能，要看真实活动分别回顾',
      ['能，分数高就都满星', '不能，要看真实活动分别回顾'],
      '客观知识与真实活动不是同一个证据。',
    ),
    {
      ...task(
        'seasons',
        '从春开始，按教材四季名称的循环顺序排列。',
        { kind: 'sequence', values: ['spring', 'summer', 'autumn', 'winter'] },
        '春、夏、秋、冬，再回到春；顺序不同于图中照片阅读排版。',
      ),
      choices: [
        { id: 'winter', label: '冬' },
        { id: 'summer', label: '夏' },
        { id: 'spring', label: '春' },
        { id: 'autumn', label: '秋' },
      ],
    },
    number(
      'season-count',
      '教材四季例子，一轮共有几个季节名称？',
      4,
      '春夏秋冬四个，不问每天的天气变化次数。',
    ),
    number(
      'zodiac-years',
      '按教材举例，生肖重复一轮是多少年？本题单位是年。',
      12,
      '原例为12年，不是12个月或12天。',
    ),
    actual(
      'actual-observe',
      '实际回看24页彩旗、灯笼、气球、花盆四类，分别说明观察范围和重复依据；未看清如实记待核对。',
    ),
    actual(
      'actual-symbols',
      '实际将原图一种规则用自己的符号、画图或语言表示，并摆本站一大一小规则核对；做过再确认。',
    ),
    actual(
      'actual-task',
      '实际向同伴或家人说明本次共同任务与准备做什么；只有想过请跳过。',
    ),
    actual(
      'actual-location',
      '实际记录或商量想装饰的地点及物品，说明只是设计还是已布置；做过再确认。',
    ),
    actual(
      'actual-rule',
      '实际画或摆一个完整重复单元并续至少一组，说明每个位置；做过再确认。',
    ),
    actual(
      'actual-group',
      '实际与同伴约定分工并合作完成设计图，或与家人合作并注明；独自做不确认小组合作。',
    ),
    actual(
      'actual-display',
      '实际向同伴或家人介绍设计中各部分的规律与丰富度，并听取一种看法；做过再确认。',
    ),
    actual(
      'actual-revise',
      '实际选取一条有理由的意见修改设计，说明修改前后；只有打算修改请跳过。',
    ),
    actual(
      'actual-life',
      '实际说明四季与生肖例子的时间单位，再举一个自己观察的重复现象并说依据；做过再确认。',
    ),
    actual(
      'actual-evaluate-design',
      '实际回顾自己怎样用重复规则设计，逐项说出依据或未做；回顾过再确认。',
    ),
    actual(
      'actual-evaluate-cooperate',
      '实际回顾与谁怎样分工合作、哪些仍未做，不以独作冒合作；回顾过再确认。',
    ),
    actual(
      'actual-evaluate-listen',
      '实际回顾听过谁的什么看法、怎样回应，未听如实说明；回顾过再确认。',
    ),
    record(
      'observations',
      '记录原图观察范围、采用的规则与尚待核对处，不猜未知数量。',
    ),
    record(
      'design-record',
      '记录地点、物品、一组顺序和真实分工；独作或合作未发生如实写。',
    ),
    record(
      'improvement',
      '记录听到的新想法、已经改的部分与仍待改的部分，分别说明。',
    ),
    record(
      'evaluation-design',
      '单独记录设计方面的自评依据、困难或帮助，未做如实写。',
    ),
    record(
      'evaluation-cooperate',
      '单独记录合作方面的自评依据，独作不能自动写合作已完成。',
    ),
    record('evaluation-listen', '单独记录倾听方面的自评依据，未听如实写。'),
    record('plan', '记录下次准备怎样改进，未来计划与已经完成分开。'),
  ],
  reviewQuestions: [
    shape(
      'review-two-7',
      '换成小圆、大圆两位置一组，新六张之后第7位应接什么？',
      '1-circle',
      '新组首项是小圆，不能抄主图大圆。',
      reviewTwo,
    ),
    shape(
      'review-two-8',
      '按新小圆、大圆规则，第8位应接什么？',
      '2-circle',
      '对应新组第二位大圆。',
      reviewTwo,
    ),
    shape(
      'review-three-7',
      '换成三角、圆、圆三个位置一组，新图第7个问号应填什么？',
      '2-triangle',
      '新组第一项三角形，与主图不同。',
      reviewThree,
    ),
    shape(
      'review-three-9',
      '按新三角、圆、圆规则，第9个问号应填什么？',
      '2-circle',
      '新组第三项圆，不是主图三角。',
      reviewThree,
    ),
  ],
};
