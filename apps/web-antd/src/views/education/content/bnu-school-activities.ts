import type { Lesson, Question, Visual } from '../learning/types';

function choice(
  lesson: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    id: `${lesson}-${suffix}`,
    knowledge: lesson,
    prompt,
    rule: { kind: 'choice', value },
    choices: labels.map((label) => ({ id: label, label })),
    hint: '先说清比较对象、条件和所问内容，不从一个特点推另一个特点。',
    explanation,
    ...(visual ? { visual } : {}),
  };
}
function number(
  lesson: string,
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
  visual: Visual,
): Question {
  return {
    id: `${lesson}-${suffix}`,
    knowledge: lesson,
    prompt,
    rule: { kind: 'number', value },
    hint: '每个标记只数一次，组数与每组的个数分别看。',
    explanation,
    visual,
  };
}
function record(
  lesson: string,
  suffix: string,
  prompt: string,
  reflection = false,
): Question {
  return {
    id: `${lesson}-${suffix}`,
    knowledge: lesson,
    prompt,
    rule: { kind: reflection ? 'reflection' : 'manual' },
    hint: reflection
      ? '可记录发现、不同方法或疑问，家长可代录。'
      : '真实做过才确认；没有做、缺材料或仅计划做，请跳过。',
    explanation: reflection
      ? '开放想法没有统一答案，不计客观正确率。'
      : '实际活动独立记录，网页答案不能替代真实操作或交流。',
  };
}
const gamesId = 'bnu-upper-school-games';
export const bnuSchoolGamesLesson: Lesson = {
  id: gamesId,
  textbookTitle: '我上学啦',
  title: '操场观察、分组与按条件选物',
  page: 6,
  version: 1,
  status: 'available',
  goal: '观察并表达数量关系，按口令分组，依给定特点选物，区分规则与自己的游戏选择。',
  prerequisite: '能逐个点数少量物品，愿意说清所数对象。',
  parentTip:
    '对应北师大上册6～9页：操场观察、分组活动与按物品特点行动。本站点图、纸卡和例子原创，不复制原画。可用纸卡代替人员分组和拿物，不需要拔河、攀爬、奔跑或进入校园；实际同伴游戏须征得同意，纸卡模拟与真人活动分别说明。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方原书预览0061印刷6～9页实际读取；数量比较、共同起点比高、分组口令和按物品外形选取分别对应。未知ISBN与印次保持未知。',
  },
  steps: [
    {
      title: '观察要说清对象',
      text: '可以看操场图，也可以看家中的纸卡。说两队人数时逐个配对：本原创图的两行各有3个标记，一个对一个后没有剩余，数量相同。人数相同不表示力量相同，也不能据此判断谁赢。',
      visual: { kind: 'comparison-rows', counts: [3, 3] },
      activity: '实际摆两排纸卡，逐一配对，说清比较的是张数。',
    },
    {
      title: '比较高矮有条件',
      text: '用同一个平面作为底部起点，让两个纸条竖直，再观察顶部。底部不齐、纸条倾斜时，不能只看顶部高低就判长短；图中的人和树可观察，不把画面或外表推成实际年龄和能力。',
      activity: '把两张已有纸条底部对齐比较，再移高一张解释为什么需重新对齐。',
    },
    {
      title: '分组先听清每组几个',
      text: '原创纸卡游戏约定每组4张。先逐张放进一组，满4张才是完整组；只有3张的一组仍少1张。图中的两个框表示两组，不表示只有两张卡。不要先要求孩子写乘除算式。',
      visual: { kind: 'count-groups', groups: [4, 3] },
      activity: '用少量纸卡试着按每组4张分，记录完整组和不足的一组。',
    },
    {
      title: '改变口令重新检查',
      text: '下一轮若约定每组3张，就按新条件重新摆。每组有几张、完整组有几组、总共有几张是三个不同问题。自己喜欢哪种游戏也与分组是否合规则不同。',
      visual: { kind: 'count-groups', groups: [3, 3] },
      activity: '用同一批卡改变每组张数，再点数核对；游戏偏好由孩子自己表达。',
    },
    {
      title: '按明确特点选物',
      text: '原创桌面有平面圆片、方片和长条片，口令明确为选平面圆片，就依据外形选圆片；即使方片也涂成蓝色，颜色仍不是这一轮条件。换成按颜色选时要重新看条件。原书的生活物品观察与本站平面纸片例子分开，不把圆片当作球体。',
      activity: '实际准备纸片，先按形状选一次，再按颜色选一次，说明条件变化。',
    },
    {
      title: '回看教材并交流',
      text: '对照原书6～9页观察与比较，再说清分组要求和按特点拿物的要求。可以选一个适合自己的游戏，与家长商量规则；没有实际游戏时只记录讨论，不能把计划写成完成。',
      activity: '实际读图、讨论并做安全替代活动，分别核对自己的真实发现。',
    },
  ],
  questions: [
    number(
      gamesId,
      'q1',
      '只数上面一行的标记，有几个？',
      3,
      '上行有3个标记，不把下行加入所问范围。',
      { kind: 'comparison-rows', counts: [3, 3] },
    ),
    choice(
      gamesId,
      'q2',
      '两行逐一配对后都无剩余，标记数量怎样？',
      '一样多',
      ['上行更多', '下行更多', '一样多'],
      '逐一配对都无剩余，说明数量相同。',
      { kind: 'comparison-rows', counts: [3, 3] },
    ),
    choice(
      gamesId,
      'q3',
      '只知道两队人数相同，能确定两队力量也相同吗？',
      '不能确定',
      ['能确定', '不能确定'],
      '人数信息不能推出力量或比赛结果。',
    ),
    choice(
      gamesId,
      'q4',
      '比较两张竖直纸条长短，先怎样摆？',
      '底部在同一个起点',
      ['底部在同一个起点', '把一张整体举高'],
      '同一底部起点让比较有共同参照。',
    ),
    number(
      gamesId,
      'q5',
      '每组要4张，图中下组只有几张？',
      3,
      '下组为3张，与规定的4张不同。',
      { kind: 'count-groups', groups: [4, 3] },
    ),
    number(
      gamesId,
      'q6',
      '每组要4张，下组现在3张，还缺几张？',
      1,
      '补1张后才达到每组4张。',
      { kind: 'count-groups', groups: [4, 3] },
    ),
    number(
      gamesId,
      'q7',
      '图中每组3张，共有几组？只填组数。',
      2,
      '两个框是两组，不把每组的3张当作组数。',
      { kind: 'count-groups', groups: [3, 3] },
    ),
    number(
      gamesId,
      'q8',
      '同一图逐张数，共有几张卡？',
      6,
      '两组所有标记逐个数为6张，不只数两个框。',
      { kind: 'count-groups', groups: [3, 3] },
    ),
    choice(
      gamesId,
      'q9',
      '口令明确选平面圆片，圆片、方片和长条片中选哪种？',
      '圆片',
      ['圆片', '方片', '长条片'],
      '本轮按平面外形选，不按数量或颜色。',
    ),
    choice(
      gamesId,
      'q10',
      '喜欢的游戏一定只能和同伴选得一样吗？',
      '不一定，可以商量',
      ['一定必须一样', '不一定，可以商量'],
      '偏好可以不同，参加共同活动前商量规则。',
    ),
    record(
      gamesId,
      'actual-pair',
      '实际摆两排纸卡并逐一配对，说出数量关系；做过再确认。',
    ),
    record(
      gamesId,
      'actual-height',
      '实际把两张纸条底部对齐比较，再说明整体移高的影响；做过再确认。',
    ),
    record(
      gamesId,
      'actual-group',
      '实际按每组4张分纸卡，核对完整组与不足组；做过再确认。',
    ),
    record(
      gamesId,
      'actual-rule',
      '实际改变每组张数后重新摆卡、核对；做过再确认。',
    ),
    record(
      gamesId,
      'actual-select',
      '实际按形状、再按颜色选纸片，说清两轮条件；做过再确认。',
    ),
    record(
      gamesId,
      'actual-discuss',
      '实际与家长讨论喜欢的游戏和共同规则；交流过再确认，不把计划游戏当已玩。',
    ),
    record(
      gamesId,
      'actual-book',
      '实际对照原书6～9页，说一个比较和一个游戏条件；看过再确认。',
    ),
    record(
      gamesId,
      'reflection',
      '写下分组或选物时容易混淆的一点，或自己的发现。',
      true,
    ),
  ],
  reviewQuestions: [
    choice(
      gamesId,
      'r1',
      '换成两行各4个标记，配对无剩余，数量怎样？',
      '一样多',
      ['上行更多', '下行更多', '一样多'],
      '条件变为每行4个，数量仍逐一比较，不沿用3个。',
      { kind: 'comparison-rows', counts: [4, 4] },
    ),
    number(
      gamesId,
      'r2',
      '本轮每组要3张，下组2张，还缺几张？',
      1,
      '新要求为3张，2张还缺1张。',
      { kind: 'count-groups', groups: [3, 2] },
    ),
    number(
      gamesId,
      'r3',
      '换图每组2张，只问总卡数，填几？',
      6,
      '3个框是3组，所有标记逐张数为6张。',
      { kind: 'count-groups', groups: [2, 2, 2] },
    ),
    choice(
      gamesId,
      'r4',
      '新口令按颜色选蓝色，蓝色方片和黄色圆片中选哪个？',
      '蓝色方片',
      ['蓝色方片', '黄色圆片'],
      '条件改为蓝色，不能沿用上一轮圆片条件。',
    ),
  ],
};

const harvestId = 'bnu-upper-school-harvest';
export const bnuSchoolHarvestLesson: Lesson = {
  id: harvestId,
  textbookTitle: '我上学啦',
  title: '生活物品的大小、长短与轻重观察',
  page: 10,
  version: 1,
  status: 'available',
  goal: '明确比较对象与特点，观察大小长短，区分外形判断与实际轻重，表达自己的发现。',
  prerequisite: '愿意观察并指明两个比较对象；不要求先会测量或质量单位。',
  parentTip:
    '对应北师大上册10～11页生活物品比较。本站例子原创，不复制原画或人物话语；无需进菜园或采摘。只使用家长确认可安全拿取的轻小物品或纸片，无法实际比较轻重时跳过，纸片大小不能冒实际物品重量。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方原书0061印刷10～11页实际读取；大小参照、与已有物比较轻重、手与物长短、外形观察分别对应，不编造原图隐藏数量或重量。',
  },
  steps: [
    {
      title: '比较要有两个对象',
      text: '说一个物品大或小，要说明和什么比较。同一个纸片和较小片比可能较大，和较大片比又可能较小，不能只听“大”就知道具体大小。',
      activity: '实际选两个纸片，指出所比较对象和特点。',
    },
    {
      title: '长短先对齐',
      text: '把两个直纸条放直，一端对齐再看另一端。只有长一些的信息，不代表个数更多、重量更大或数值年龄更大。',
      activity: '实际对齐纸条比较，再说一条只与长短有关的发现。',
    },
    {
      title: '外形与轻重分别看',
      text: '一个大纸盒可能很轻，一个小物件可能更重。未知材料或没有实际比较时不能仅凭大小确定轻重。只用成人确认可安全拿的轻小物品体验，不举重物、不用锋利物。',
      activity: '在家长帮助下实际比较轻小物品；条件不足时跳过。',
    },
    {
      title: '观察与猜想不同',
      text: '已经明确给出“甲比乙长”，可以据此回答谁长；只给出“甲较大”却问谁重，信息不足。真实观察、别人给出的条件和自己的猜想分别说。',
      activity: '说一个已观察的事实，再说一个还需核对的问题。',
    },
    {
      title: '回看原书与生活',
      text: '对照原书10～11页，找大小、长短和轻重比较各指什么对象。本站纸片活动是替代练习，不能改写成已经完成采摘或教材人物的经历。',
      activity: '实际读图后选一种安全比较，用自己的话说明参照。',
    },
  ],
  questions: [
    choice(
      harvestId,
      'q1',
      '只说“这个纸片大”，比较对象未给，能确定是比哪个物品大吗？',
      '不能确定',
      ['能确定', '不能确定'],
      '比较对象缺失，不能自己补造。',
    ),
    choice(
      harvestId,
      'q2',
      '已明确甲纸条比乙长，哪个较长？',
      '甲纸条',
      ['甲纸条', '乙纸条'],
      '根据题目明确的长短条件判断。',
    ),
    choice(
      harvestId,
      'q3',
      '比较两个放直纸条，先对齐哪里？',
      '一端',
      ['一端', '把长条整体向前移'],
      '一端对齐才能用另一端作共同参照。',
    ),
    choice(
      harvestId,
      'q4',
      '只知道甲盒外形比乙盒大，能确定甲更重吗？',
      '不能确定',
      ['能确定', '不能确定'],
      '材料和内容物未知，大小不直接推出重量。',
    ),
    choice(
      harvestId,
      'q5',
      '家长实际比较后明确乙比甲重，哪个较轻？',
      '甲',
      ['甲', '乙'],
      '乙较重，对应甲较轻，不能颠倒。',
    ),
    choice(
      harvestId,
      'q6',
      '纸条甲较长，能据此确定甲的张数更多吗？',
      '不能确定',
      ['能确定', '不能确定'],
      '一个纸条的长短和纸条张数不是同一属性。',
    ),
    choice(
      harvestId,
      'q7',
      '小禾只计划明天观察，今天应记录什么？',
      '还未实际观察',
      ['已经完成观察', '还未实际观察'],
      '计划与已做事实分别记录。',
    ),
    choice(
      harvestId,
      'q8',
      '没有安全轻小物品可拿取，这项真实轻重活动怎样记录？',
      '跳过，保留问题',
      ['直接确认做过', '跳过，保留问题'],
      '条件不足不能用网页答案冒实际体验。',
    ),
    record(
      harvestId,
      'actual-size',
      '实际用两个纸片观察大小，明确两个对象；做过再确认。',
    ),
    record(
      harvestId,
      'actual-length',
      '实际把纸条一端对齐比较长短，并说明条件；做过再确认。',
    ),
    record(
      harvestId,
      'actual-weight',
      '在家长帮助下实际比较两件安全轻小物品的轻重；做过再确认，未做请跳过。',
    ),
    record(
      harvestId,
      'actual-book',
      '实际对照原书10～11页，说明大小、长短与轻重各比较什么；看过再确认。',
    ),
    record(
      harvestId,
      'reflection',
      '记录一个自己的比较发现或仍需核对的问题。',
      true,
    ),
  ],
  reviewQuestions: [
    choice(
      harvestId,
      'r1',
      '换条件：乙纸条比甲长，这次谁较短？',
      '甲纸条',
      ['甲纸条', '乙纸条'],
      '所问改为较短，要按新条件取甲。',
    ),
    choice(
      harvestId,
      'r2',
      '小盒装物的材料未知，仅看到盒子较小，能确定它更轻吗？',
      '不能确定',
      ['能确定', '不能确定'],
      '外形小不能替代实际轻重条件。',
    ),
    choice(
      harvestId,
      'r3',
      '已明确甲物品比乙轻，这次问谁较重？',
      '乙',
      ['甲', '乙'],
      '甲较轻，对应乙较重。',
    ),
    choice(
      harvestId,
      'r4',
      '一条纸条整体向前挪后看起来末端更远，可以立即确定它更长吗？',
      '不可以，先重新对齐一端',
      ['可以直接判长', '不可以，先重新对齐一端'],
      '共同起点改变，要重新对齐后比较。',
    ),
  ],
};
