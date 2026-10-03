import type { BnuFinalSolidsVisual } from '../learning/bnu-final-solids';
import type { Lesson, Question } from '../learning/types';

const id = 'bnu-upper-final-solids';
const visual = (
  scene: BnuFinalSolidsVisual['scene'],
  variant: BnuFinalSolidsVisual['variant'] = 'main',
): BnuFinalSolidsVisual => ({ kind: 'bnu-final-solids', scene, variant });
const labels = ['长方体', '圆柱', '正方体', '球'];
function q(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  diagram?: Question['visual'],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '观察整体特征与独立部件；一个物体的面、端面和表面画记不另增加件数。材料数量、位置和实际稳定分别核对。',
    ...(diagram ? { visual: diagram } : {}),
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  choices: string[],
  explanation: string,
  diagram?: Question['visual'],
): Question {
  return {
    ...q(suffix, prompt, { kind: 'choice', value }, explanation, diagram),
    choices: choices.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return q(
    `actual-${suffix}`,
    `${prompt}；真实做过再确认，未做或没有原书、合适材料、同伴可待做。`,
    { kind: 'manual' },
    '网页练习不自动确认实物观察、搭建或原书任务；纸面计划与实际做过分开。',
  );
}
const life: [string, string][] = [
  ['罐状物', '圆柱'],
  ['篮球', '球'],
  ['魔方', '正方体'],
  ['书本', '长方体'],
  ['微波炉', '长方体'],
  ['柱状物', '圆柱'],
  ['方块', '正方体'],
];

export const bnuFinalSolidsLesson: Lesson = {
  id,
  textbookTitle: '总复习 · 图形与几何',
  title: '立体分类、材料配对与机器人计数',
  page: 84,
  version: 1,
  status: 'available',
  goal: '完整分类七物品、比较三搭法、配对两件作品和全部材料，逐件区分机器人四类部件与表面画记。',
  prerequisite: '认识四种基本立体、会按整体特征分类与逐件计数。',
  parentTip:
    '对应北师大上册84页四项。本站生活形体、承托示意、材料卡和机器人是原创等价表示，不复制原扫描画；原书造型和真实物品另观察。材料组A对应原左侧、B对应原右侧，作品1需B、作品2需A；木色短柱也按圆柱，不凭颜色判。原书机器人已由原PDF放大核对：底座与身体为长方体，两脚为正方体，两天线/两段左臂/两段右臂/两腿为圆柱；头、头顶连接球、两侧小球各独立，两个眼睛和嘴是画记。网页图不能证明实际稳定；三种搭法按原书示意比较，不推广任意尺寸都会稳。屋顶等其它形体不强归入这四种。',
  review: {
    date: '2026-10-04',
    reviewer: '原书84页全项及原PDF部件放大核对',
    notes:
      '第三方0061阅读器88对应印刷84；实际重新阅读并以原PDF300dpi查看机器人，四类2/8/2/4。ISBN印次未知，PDF文件生成时间不冒出版印次。',
  },
  steps: [
    {
      title: '七件物品逐一找整体形状',
      text: '原书七件按顺序为罐状物、篮球、魔方、书本、微波炉、柱状物、方块。看整体面与曲面，分别连四类基本立体；魔方表面小格不意味着很多个魔方，书的封面矩形不把整本书变成平面。本站只表示整体形体，实物细节和用途不用于自动判类。',
      activity: '实际完成原书全部七件配对，逐件说一个整体特征。',
      visual: visual('objects'),
    },
    {
      title: '三种搭法，检查球放在承托处',
      text: '原书第一组两个直立柱体以端面承托上层，相比另两组球在承托部位的示意更稳。球可能滚动，不能只因作品很高或好看判稳定。本站A/B/C为原创承托示意，造型与原书不完全相同；图没有实际尺寸、摩擦和材质，真实轻推观察另做。球放旁边、不承托，与球承托上层是不同条件。',
      activity:
        '实际按原书三种搭法观察或尝试，描述稳不稳及原因；没有材料则保留待做。',
      visual: visual('stability'),
    },
    {
      title: '两件作品分别需要哪些材料',
      text: '原第一件作品有两件屋顶部件、四个方块和两根横梁；第二件有一件屋顶部件、两个方块、两根横梁、三根圆柱：两蓝色腿和中间木色短柱。木色短柱没有因颜色变成长方体；屋顶有三角形端面，另列，不强行叫正方体、长方体、圆柱或球。',
      activity:
        '实际观察原两件作品，按每个独立部件核对材料，不按画出几个面多计。',
    },
    {
      title: '两组材料全部逐件配对',
      text: '本站材料组A对应原左侧，B对应原右侧；改变朝向不改变形体或件数。A有屋顶部件一件、方块两件、横梁两件、圆柱三件；B有屋顶部件两件、方块四件、横梁两件。两组均没有球。全部材料与原作品逐件配对：第一件用B，第二件用A，不只连一个示例。',
      activity: '实际完整连两件作品和原两组材料，逐件检查是否遗漏或多用。',
      visual: visual('materials'),
    },
    {
      title: '机器人部件，和面、画记分开数',
      text: '原机器人底座与身体各一长方体，两个脚各一正方体。圆柱包括左右两天线、左臂两段、右臂两段、两腿，转弯关节看到的圆形端面不另增球。独立球为头、头顶连接球和两侧小球；眼睛、嘴是表面画记。本站等价机器人保留这些区别，不把右边四个示范形体也计入机器人。',
      activity:
        '实际对原书机器人逐件指认，再完成四类全部填数并解释画记为何不计。',
      visual: visual('robot'),
    },
    {
      title: '真实分类、搭建与交流另记',
      text: '用家中已有合适物品观察四类特征，再用安全的大件材料尝试一种搭法；没有材料不强买，纸面计划可以单独记录但不冒实物已经稳。向同伴解释一处易混淆，听到回应再记录交流。复习机器人会更换部件，不能照抄本图数量。',
      activity: '实际观察、尝试、核对并交流；反思、疑问与未来计划分开。',
    },
  ],
  questions: [
    q(
      'q1',
      '图中机器人的脚部方块属于正方体，正方体有几个？逐件数，不按面数。',
      { kind: 'number', value: 2 },
      '两个脚各一件，画出的面不增加件数。',
      visual('robot'),
    ),
    ...life.map(([name, shape], index) =>
      choice(
        `life-${index + 1}`,
        `原第${index + 1}件${name}按本图整体特征对应哪一类？`,
        shape,
        labels,
        '按整体形体判，不凭颜色用途；一个物体的面和表面格子不另计。',
        visual('objects'),
      ),
    ),
    q(
      'life-counts',
      '按长方体、圆柱、正方体、球的顺序填七件物品各类数量。',
      { kind: 'steps', values: [2, 2, 2, 1] },
      '书本/微波炉；罐/柱；魔方/方块；篮球分别归类。',
      visual('objects'),
    ),
    choice(
      'stability',
      '按原书三组示意，哪组相比两种用球承托的更稳？',
      '第一组',
      ['第一组', '第二组', '第三组'],
      '原第一组柱体端面承托；实际稳定还受尺寸材质摆法影响，不把示意当普遍保证。',
    ),
    choice(
      'stability-reason',
      '另两组球在承托部位，为什么要留意？',
      '球会滚动，承托可能不稳',
      ['球会滚动，承托可能不稳', '有红色屋顶就一定稳', '画得高就一定稳'],
      '承托与可滚动的面有关，颜色高度不能单独证明稳。',
      visual('stability'),
    ),
    choice(
      'roof',
      '屋顶部件有三角形端面，是否必须归入这四种基本立体之一？',
      '不必，另列观察',
      ['不必，另列观察', '只要有三角形就叫球', '一律叫正方体'],
      '本任务不把所有立体硬分到四类中。',
    ),
    choice(
      'match-1',
      '原第一件作品需两屋顶部件、四方块、两横梁，匹配哪组材料？',
      'B',
      ['A', 'B'],
      'B完整满足各部件数量，不能只凭颜色。',
      visual('materials'),
    ),
    choice(
      'match-2',
      '原第二件作品需一屋顶部件、两方块、两横梁、三圆柱，匹配哪组材料？',
      'A',
      ['A', 'B'],
      'A的三圆柱含木色短柱，不把短柱或其端面误分。',
      visual('materials'),
    ),
    q(
      'material-A',
      '材料组A按长方体、圆柱、正方体、球顺序填四类数量，屋顶部件另列。',
      { kind: 'steps', values: [2, 3, 2, 0] },
      '两横梁/三圆柱/两方块/没有球，0须明确填写。',
      visual('materials'),
    ),
    q(
      'roof-A',
      '材料组A另列的屋顶部件有几件？',
      { kind: 'number', value: 1 },
      '一件，三角形端面不变成独立平面材料。',
      visual('materials'),
    ),
    q(
      'material-B',
      '材料组B按长方体、圆柱、正方体、球顺序填四类数量，屋顶部件另列。',
      { kind: 'steps', values: [2, 0, 4, 0] },
      '两横梁/没有圆柱/四方块/没有球，屋顶两件另列。',
      visual('materials'),
    ),
    q(
      'roof-B',
      '材料组B另列的屋顶部件有几件？',
      { kind: 'number', value: 2 },
      '两件屋顶部件各完整保留。',
      visual('materials'),
    ),
    q(
      'robot-counts',
      '按长方体、圆柱、正方体、球顺序填机器人全部独立部件的数量。',
      { kind: 'steps', values: [2, 8, 2, 4] },
      '底座/身体2；两天线、左臂两段、右臂两段、两腿8；两脚2；头/顶球/两侧球4。眼睛嘴是画记，示范形体不计。',
      visual('robot'),
    ),
    choice(
      'robot-paint',
      '机器人的两个眼睛和嘴是表面画记，要另计球吗？',
      '不计，画记不是独立积木',
      ['不计，画记不是独立积木', '两个眼睛各增加一球', '嘴增加一个长方体'],
      '按独立部件计数，画记不增物。',
      visual('robot'),
    ),
    choice(
      'robot-end',
      '圆柱转弯处画出的圆形端面要另外增加一个球吗？',
      '不增加，它是同一圆柱的端面',
      [
        '不增加，它是同一圆柱的端面',
        '每个端面都增加一个球',
        '端面都增加一个正方体',
      ],
      '物体的面与独立物体不同。',
    ),
    actual('life', '实际完成原书七件物品全配对并逐件说特征'),
    actual('home', '实际观察家中已有物品，核对四类整体特征'),
    actual('stability', '实际观察或尝试原三组搭法，说明承托与滚动的区别'),
    actual('materials', '实际完整配对原两作品与两组材料，逐件检查'),
    actual('robot', '实际对原书机器人指认全部独立部件，填四类数量并区分画记'),
    actual(
      'build',
      '实际用合适大件材料尝试一种搭法并观察，不把纸面计划当实物搭稳',
    ),
    actual('exchange', '实际与同伴交流一处分类或计数依据并听取回应'),
    q(
      'reflection',
      '如实记录观察或搭建的发现、困难；未做可写未做。',
      { kind: 'reflection' },
      '开放记录correct:null，不自动确认实际活动。',
    ),
    q(
      'question',
      '记一个尚需核对的物品、部件或稳定条件，没有也可如实写。',
      { kind: 'reflection' },
      '未知不当0，疑问不评对错。',
    ),
    q(
      'plan',
      '写一个之后准备做的观察或尝试，明确尚未完成。',
      { kind: 'reflection' },
      '未来计划独立于实际完成。',
    ),
  ],
  reviewQuestions: [
    choice(
      'review-life',
      '新排列第1件方块按整体特征对应哪一类？',
      '正方体',
      labels,
      '排列改变，不能把原第1件罐状物的类别照抄。',
      visual('objects', 'review'),
    ),
    choice(
      'review-stability',
      '新条件：球放在旁边，不承托作品。能只因旁边有球就断定作品一定更不稳吗？',
      '不能，须看实际承托和摆法',
      ['不能，须看实际承托和摆法', '能，有球就一定倒', '能，只看颜色'],
      '与原来球在承托处的条件不同。',
    ),
    choice(
      'review-material',
      '新方案需三方块、一圆柱、两横梁、一屋顶部件；全部各用一次，应选新组A还是B？',
      'A',
      ['A', 'B'],
      '新A完整满足，新B少一横梁，不能沿用原第一件匹配B。',
      visual('materials', 'review'),
    ),
    q(
      'review-robot',
      '新机器人图移除底座、两天线和两侧小球，保留其余部件。按长方体、圆柱、正方体、球顺序重新填数。',
      { kind: 'steps', values: [1, 6, 2, 2] },
      '只剩身体1；两臂四段与两腿6；两脚2；头和顶球2。表面眼睛嘴仍不是另添积木。',
      visual('robot', 'review'),
    ),
  ],
};
