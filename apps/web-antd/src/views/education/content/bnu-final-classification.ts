import type { BnuFinalClassificationVisual } from '../learning/bnu-final-classification';
import type { Lesson, Question } from '../learning/types';
const id = 'bnu-upper-final-classification';
const visual = (
  scene: BnuFinalClassificationVisual['scene'],
  variant: BnuFinalClassificationVisual['variant'] = 'main',
): BnuFinalClassificationVisual => ({
  kind: 'bnu-final-classification',
  scene,
  variant,
});
function q(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  diagram?: Question['visual'],
  material?: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先说明对象与标准，逐件核对；换标准恢复全部对象，未知条件不要猜。',
    ...(diagram ? { visual: diagram } : {}),
    ...(material ? { material } : {}),
  };
}
function pick(
  suffix: string,
  prompt: string,
  values: string[],
  labels: string[],
  explanation: string,
  diagram: Question['visual'],
  material?: string,
): Question {
  return {
    ...q(
      suffix,
      prompt,
      { kind: 'set', values },
      explanation,
      diagram,
      material,
    ),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
  diagram?: Question['visual'],
): Question {
  return {
    ...q(suffix, prompt, { kind: 'choice', value }, explanation, diagram),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return q(
    `actual-${suffix}`,
    `${prompt}；实际做过再确认，未做或没有原书/材料/同伴可待做。`,
    { kind: 'manual' },
    '网页客观练习不自动确认实际观察、分组、说明或交流；未来计划另记。',
  );
}
const four = ['A', 'B', 'C', 'D'];
const seven = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const six = ['A', 'B', 'C', 'D', 'E', 'F'];
const motionCondition =
  '本题采用教材提问的一种主要活动方式示例分组：A飞鸟/F燕子归飞行组，B熊猫/C绵羊/D兔归陆上走跑组，E金鱼/G虾归水中游组。不把照片姿态说成每只动物当时正在跑，不断言它们永远只能一种活动，也不从图标猜鸟的品种。';
export const bnuFinalClassificationLesson: Lesson = {
  id,
  textbookTitle: '总复习 · 统计与概率',
  title: '动物分类、活动分组与六物品换标准',
  page: 85,
  version: 1,
  status: 'available',
  goal: '覆盖两组动物的分类讨论、七动物飞跑游、六物品按不同标准完整重分，说明条件与依据。',
  prerequisite: '会按明确标准分类、点数并区分类别数与对象数。',
  parentTip:
    '对应原书85页全项。原照片是开放分类讨论，不以本站示例为唯一标准。编号卡是原创等价表示，动物图标仅帮助识别，不作脚数/物种/动作证据。第一只飞鸟品种待确认，不假称鹅；七动物采用主要活动方式示例分组，照片姿态不作为当时正在跑的证据；实际动物可多种活动。生活环境不把鹰飞翔时的空中误称其全部生活地点。六物品颜色/大小/形状都可讨论，彩色球不强归单色，大小只在同形对内按图比，实际尺寸未知。自行换标准需说明并完整检查全部对象。',
  review: {
    date: '2026-10-04',
    reviewer: '原书85页全项与分类条件核对',
    notes:
      '重新实际查看本地第三方0061阅读器89对应印刷85大图；原两组各4、应用动物7、物品6。ISBN和印次未知，未复制原画。',
  },
  steps: [
    {
      title: '同一组四动物，先说标准',
      text: '原第一组是鸡、鹅、鸭、猫。可按脚数分：鸡/鹅/鸭各两只，猫四只。按两只脚与四只脚是本轮标准，不把三只两脚动物叫“三只脚”。也可提出别的有依据标准；按是否能游、哪里生活等需说清条件，不能只凭一张姿态照猜。',
      activity: '实际完整分类原第一组，说明标准与每个对象的依据。',
      visual: visual('legs'),
    },
    {
      title: '另一组四动物，讨论主要生活环境',
      text: '原第二组鲨鱼、鹰、海龟、海星。示例按主要生活环境分，鲨鱼/海龟/海星主要在海中，鹰在陆地、山林等环境生活并在空中飞翔；飞翔位置不代表一直住在天空，海龟也会到岸上产卵。可另按有无翅膀等明确标准分，须逐一核对，不将同一动物只能一个环境当规则。',
      activity: '实际分类原第二组，说明自己的标准，听同伴不同分法。',
      visual: visual('habitat'),
    },
    {
      title: '七动物全部按主要活动方式示例分组',
      text: motionCondition,
      activity:
        '实际对原七照片讨论能飞/在陆上走跑/在水中游，完整分组并说明多种能力怎样处理。',
      visual: visual('motion'),
    },
    {
      title: '六物品按整体形状完整分',
      text: '原物品按顺序为红盒、篮球、棕色柱状物、黄盒、彩色球、蓝色柱状物。按整体形状，两盒是长方体，两球是球，两柱是圆柱；只看一个平面不能把球叫圆形，也不因方向或颜色把同形拆类。全部六件不漏不重复。',
      activity: '实际对原六物品按整体形状完整分类。',
      visual: visual('objects'),
    },
    {
      title: '恢复六物品，改按颜色或大小',
      text: '红盒和黄盒颜色不同、形体同类；彩色球有多种颜色，不强迫只归一种。讨论按颜色时须说明多色怎样处理。大小按同形对比较：本图红盒比黄盒大、篮球比彩色球大、棕柱比蓝柱大；这里只表示示意相对大小，不比较不同形体的实物长度、重量或容量。实际原图或自己的物品另观察。',
      activity: '分别实际讨论全部六件颜色和大小的可用标准，明确比较范围。',
      visual: visual('objects'),
    },
    {
      title: '换标准重新分，核对并交流',
      text: '每一轮先恢复同一批全部对象，再说新标准、逐件分、检查总数与理由。分类改变关系与摆放，不增加物品。另一种有依据分法可成立，不能因为不同于示例就自动判错；无法判断时保留待核对。原书分法、本站练习、实物整理与未来计划分别记录。',
      activity: '实际向同伴解释一轮标准，请其逐件检查，按真实回应记录。',
    },
  ],
  questions: [
    q(
      'q1',
      '本组按两只脚与四只脚分类，两只脚的动物有几只？',
      { kind: 'number', value: 3 },
      '鸡、鹅、鸭三只，类别名“两只脚”不是动物数量。',
      visual('legs'),
    ),
    pick(
      'legs-two',
      '完整选出两只脚的动物编号。',
      ['A', 'B', 'C'],
      four,
      '鸡/鹅/鸭各两只脚，猫四只。',
      visual('legs'),
    ),
    pick(
      'legs-four',
      '完整选出四只脚的动物编号。',
      ['D'],
      four,
      '猫归本轮四只脚组。',
      visual('legs'),
    ),
    q(
      'legs-counts',
      '按两只脚组、四只脚组顺序填动物数。',
      { kind: 'steps', values: [3, 1] },
      '三只与一只共四只，脚总数不是这两格的所求。',
      visual('legs'),
    ),
    pick(
      'sea',
      '本轮按主要生活环境，完整选出主要在海中生活的编号。',
      ['A', 'C', 'D'],
      four,
      '鲨鱼/海龟/海星；海龟上岸产卵不推翻主要生活环境这一标准。',
      visual('habitat'),
    ),
    choice(
      'eagle-home',
      '鹰在空中飞，能说它全部生活都只在天空吗？',
      '不能，要区分飞翔位置和生活环境',
      ['不能，要区分飞翔位置和生活环境', '能，飞过哪里就永远住哪里'],
      '鹰也在陆地/山林等环境生活。',
      visual('habitat'),
    ),
    choice(
      'unknown',
      '一张照片没有给足某个分类标准需要的条件，该怎么做？',
      '说明缺少的条件，再观察核对',
      ['说明缺少的条件，再观察核对', '随便猜一类并当作事实', '全部写0'],
      '未知条件不是已知没有。',
    ),
    pick(
      'flying',
      '按本题主要活动方式的示例分组，完整选出飞行组的编号。',
      ['A', 'F'],
      seven,
      'A飞鸟/F燕子；不推广所有鸟一定能飞。',
      visual('motion'),
      motionCondition,
    ),
    pick(
      'running',
      '按本题主要活动方式的示例分组，完整选出陆上跑或移动的编号。',
      ['B', 'C', 'D'],
      seven,
      '熊猫/绵羊/兔，不将所有生活能力都限制在这一情境。',
      visual('motion'),
      motionCondition,
    ),
    pick(
      'swimming',
      '按本题主要活动方式的示例分组，完整选出水中游的编号。',
      ['E', 'G'],
      seven,
      '金鱼/虾，检查两张而非只选一张。',
      visual('motion'),
      motionCondition,
    ),
    q(
      'motion-counts',
      '按本题飞、陆上跑或移动、水中游顺序填三组动物数。',
      { kind: 'steps', values: [2, 3, 2] },
      '2+3+2=7，本轮三类不等于只有三只动物。',
      visual('motion'),
      motionCondition,
    ),
    choice(
      'exclusive',
      '按某个主要活动方式分好后，能断定每种动物永远只能一种活动吗？',
      '不能，本轮条件不等于全部能力',
      ['不能，本轮条件不等于全部能力', '能，分类后动物能力就改变了'],
      '分类对象与观察条件须明确。',
    ),
    pick(
      'cuboids',
      '按整体形状，完整选出长方体编号。',
      ['A', 'D'],
      six,
      '两盒同形，不按颜色拆开。',
      visual('objects'),
    ),
    pick(
      'spheres',
      '恢复六件，按整体形状完整选出球的编号。',
      ['B', 'E'],
      six,
      '两球不同大小/颜色，仍同类。',
      visual('objects'),
    ),
    pick(
      'cylinders',
      '恢复六件，按整体形状完整选出圆柱编号。',
      ['C', 'F'],
      six,
      '两柱同形，端面不另算物品。',
      visual('objects'),
    ),
    q(
      'shape-counts',
      '按长方体、球、圆柱顺序填各类物品数。',
      { kind: 'steps', values: [2, 2, 2] },
      '每类两件，共六件；形状三类与物品六件分清。',
      visual('objects'),
    ),
    choice(
      'size',
      '只在本图同形的一对中，篮球和彩色球相比哪个较大？',
      '篮球',
      ['篮球', '彩色球', '两球是同一个物品'],
      '按明确同形对内示意比较，不能据此推其它实物尺寸。',
      visual('objects'),
    ),
    choice(
      'color',
      '恢复六件改按颜色，彩色球是否必须只归一种颜色？',
      '不必，先说明多色物品的处理标准',
      ['不必，先说明多色物品的处理标准', '必须，无论看到几色都当红色'],
      '多色处理要说明，不能隐瞒其它颜色。',
      visual('objects'),
    ),
    choice(
      'criterion',
      '改用新标准时，应该怎么处理上一轮六件？',
      '恢复全部六件，再逐件重分',
      [
        '恢复全部六件，再逐件重分',
        '只挪一件，其它永远沿用旧组',
        '直接把两件删掉',
      ],
      '同一批对象与标准分开，不漏不重复。',
    ),
    q(
      'total',
      '同一批六件分类前后没有增减，重新摆放后仍有几件？',
      { kind: 'number', value: 6 },
      '分类不增加或减少对象。',
      visual('objects'),
    ),
    actual('legs', '实际完整分类原第一组四动物并说明脚数或另一有依据标准'),
    actual('habitat', '实际完整分类原第二组四动物并讨论主要生活环境/其它标准'),
    actual(
      'motion',
      '实际完整分类原七动物的活动方式，并说明飞/跑/游与多种能力的条件',
    ),
    actual('shape', '实际完整将原六物品按整体形状分类'),
    actual('color', '恢复原六物品，实际按颜色讨论并说明多色怎样处理'),
    actual('size', '恢复原六物品，实际按大小讨论，说明比较对象与范围'),
    actual('exchange', '实际与同伴交流一种分法，请其逐件检查并听到回应'),
    q(
      'own',
      '记录自己对原两动物组或六物品采用的另一种标准和完整分法，说明每组依据；尚未做可如实记待做。',
      { kind: 'reflection' },
      '开放标准不固定答案，correct:null；实际做过另确认。',
    ),
    q(
      'reflection',
      '记录分类中容易混淆的对象或条件，以及实际发现；未知可待核对。',
      { kind: 'reflection' },
      '反思不自动评能力或确认实操。',
    ),
    q(
      'plan',
      '下一次准备观察哪批对象、采用什么标准？明确这是尚未完成的计划。',
      { kind: 'reflection' },
      '计划与已完成分开。',
    ),
  ],
  reviewQuestions: [
    pick(
      'review-legs',
      '新排列恢复四动物，完整选出四只脚的编号。',
      ['A'],
      four,
      '猫移到A；不能套主图D。',
      visual('legs', 'review'),
    ),
    pick(
      'review-habitat',
      '仍观察本图第二动物组，改按有无翅膀，完整选出有翅膀的编号。',
      ['C'],
      four,
      '新排列鹰是C，换标准不选主要海中组。',
      visual('habitat', 'review'),
    ),
    pick(
      'review-motion',
      '新排列：A金鱼/B兔/C熊猫/D飞鸟/E虾/F绵羊/G燕子；按本题主要活动方式的示例分组，完整选出编号。',
      ['B', 'C', 'F'],
      seven,
      '换排列后陆上活动是B/C/F，不套主图B/C/D。',
      visual('motion', 'review'),
      '本题示例分组：D/G飞行，B/C/F陆上走跑，A/E水中游；这不是对每只动物照片当时动作的判定，其它能力不由本轮分组排除。',
    ),
    pick(
      'review-objects',
      '新排列恢复六物品，改按整体形状，完整选出球的编号。',
      ['D', 'E'],
      six,
      '新图彩色球D/篮球E，主图B/E不能照抄。',
      visual('objects', 'review'),
    ),
  ],
};
