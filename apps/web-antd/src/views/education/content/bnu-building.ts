import type { BnuBuildingVisual } from '../learning/bnu-building';
import type { Lesson, Question } from '../learning/types';

const id = 'bnu-upper-building-instructions';
const beam: BnuBuildingVisual = {
  kind: 'bnu-building',
  scene: 'beam',
  variant: 'main',
};
const gate: BnuBuildingVisual = {
  kind: 'bnu-building',
  scene: 'gate',
  variant: 'main',
};
const beamReview: BnuBuildingVisual = { ...beam, variant: 'review' };
const gateReview: BnuBuildingVisual = { ...gate, variant: 'review' };
function q(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Question['visual'],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '按当前图中完整物件与层次核对，实际搭稳和球能否通过还要实物试验。',
    ...(visual ? { visual } : {}),
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
  visual?: Question['visual'],
): Question {
  return {
    ...q(suffix, prompt, { kind: 'choice', value }, explanation, visual),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function selected(
  suffix: string,
  prompt: string,
  values: string[],
  labels: string[],
  explanation: string,
  visual: BnuBuildingVisual,
): Question {
  return {
    ...q(suffix, prompt, { kind: 'set', values }, explanation, visual),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return q(
    `actual-${suffix}`,
    `${prompt}；真实做过再确认，没有材料、同伴或未看原书可待做。`,
    { kind: 'manual' },
    '网页答案不代替实物触摸、滚动、搭建或互说；纸面计划和材料替代如实记录。',
  );
}
export const bnuBuildingInstructionsLesson: Lesson = {
  id,
  textbookTitle: '我说你做',
  title: '按指令搭建、上下关系与通道观察',
  page: 74,
  version: 1,
  status: 'available',
  goal: '按次序听说两种搭建，区分底层与上方材料，实际摸摆、比较滚动条件并观察球能否通过。',
  prerequisite: '认识四类立体，会逐件计数并说上下。',
  parentTip:
    '对应北师大上册74～75页。两种原创分层图记录教材指令，卡片间距不是悬空，图中比例不能证明通道大小或稳定。只用已有安全轻小模型，在桌面缓慢操作；无实物时记录计划，不能确认已经搭好。球的通过需比较实物大小、净空并实际试。',
  review: {
    date: '2026-10-04',
    reviewer: '原书74～75页逐页阅读与原创图核对',
    notes:
      '第三方0061预览：双圆柱架梁加正方体、球下穿问题、摸柱立桌与摸方块放上、横竖圆柱滚动、方块底座城门四指令、四类生活物品。ISBN及版印次未知，不由2024审核封面推断。',
  },
  steps: [
    {
      title: '先听完整指令',
      text: '说形状、数量和位置，再摆完整物件。第74页先放两个圆柱；在它们上面放一个长方体；在长方体上面放一个正方体。同一物件的多个面仍只算一件，不能跳过前面的支撑就说已经搭好。',
      activity: '一人逐句说，另一人听清后摆；不清楚可再问，换角色再试。',
    },
    {
      title: '双圆柱托横梁',
      text: '本站分层图：桌面第一层A、B是圆柱，第二层C是横梁，第三层D是正方体。第二层只有一个完整长方体，它放在两根圆柱上方。分层卡之间空白只是记录布局，不是物件实际悬空。',
      activity:
        '按第74页三句指令实际摆，再试自己的球能否从横梁下面通过；通道和球大小未给，不能只凭图断定。',
      visual: beam,
    },
    {
      title: '摸出再摆，滚动另看条件',
      text: '第74页先摸出一个圆柱立在桌上，再摸出一个正方体放在它上面；用手观察完整形状。第75页横放圆柱与球可以滚，竖放圆柱当时滚不动；同一圆柱改朝向后要重新描述，滑动不叫滚动，推倒后条件改变。',
      activity:
        '分别真实摸圆柱、摸正方体并完成两句指令；另用同一圆柱横放与竖放各轻推观察。',
    },
    {
      title: '城门从两个方块开始',
      text: '第75页另一组：先放两个正方体；在每个正方体上各放一个圆柱；在两个圆柱上放一个长方体；在长方体上放两个球。它与第74页底层圆柱不同，不把两种指令混成同一种摆法。',
      activity: '先完整说四句指令，逐句复述所需形状、数量和上下关系。',
    },
    {
      title: '七件分层追踪',
      text: '本站城门记录：第一层A、B方块，第二层C、D圆柱，第三层E横梁，第四层F、G两球。左与右按当前看图方向，换观察位置需重新说明；编号追踪同一完整物件，不数卡片间隙或画出的面。实际球可能滚落，图不能证明搭稳。',
      activity:
        '实际完成原书四句城门指令，逐件数清，检查真实支撑与球的位置；不稳就停下调整。',
      visual: gate,
    },
    {
      title: '生活物品与互说',
      text: '完成第75页找四类形状相似物品，按完整形状说明。规则盒、方积木、规则罐模型、球各自比较，不凭物品名称或一面猜。交换说与做的角色，真实操作和下一次计划分开，不由屏幕对错自动评价合作。',
      activity:
        '实际找四类生活实例并说明，再换角色听说一轮完整搭建；说一个真实发现和一个疑问。',
    },
  ],
  questions: [
    q(
      'q1',
      '第74页第一句先放几个圆柱？',
      { kind: 'number', value: 2 },
      '先放两个圆柱。',
    ),
    q(
      'beam-total',
      '双柱架梁图一共几件完整模型？',
      { kind: 'number', value: 4 },
      '两个圆柱、一横梁、一方块共四件。',
      beam,
    ),
    q(
      'counts',
      '双柱架梁图依次填长方体、正方体、圆柱、球各几件。',
      { kind: 'steps', values: [1, 1, 2, 0] },
      '没有球是0，不是未知；通道实验的球未加入这个摆法记录。',
      beam,
    ),
    selected(
      'beam-base',
      '选出双柱架梁图桌面第一层全部物件编号。',
      ['A', 'B'],
      ['A', 'B', 'C', 'D'],
      '两根圆柱在第一层。',
      beam,
    ),
    choice(
      'beam-beam',
      '双柱架梁图的横梁是哪一个编号？',
      'C',
      ['A', 'B', 'C', 'D'],
      'C在两根柱子上。',
      beam,
    ),
    choice(
      'beam-top',
      '双柱架梁图最上层正方体是哪一个编号？',
      'D',
      ['A', 'B', 'C', 'D'],
      'D在横梁上。',
      beam,
    ),
    choice(
      'above',
      '双柱图C在A、B的哪一方？',
      '上面',
      ['上面', '下面'],
      'C横梁在圆柱上方。',
      beam,
    ),
    choice(
      'pass',
      '未给实物大小和间距，自己的球一定能从横梁下通过吗？',
      '要核对实物大小和间距再试',
      ['一定能', '一定不能', '要核对实物大小和间距再试'],
      '球与通道净空必须实物核对。',
    ),
    choice(
      'touch',
      '摸出的模型两端同样大小圆面，侧面弯曲，按本课四类是什么？',
      '圆柱',
      ['球', '圆柱', '正方体', '长方体'],
      '摸完整物体，不只摸一个圆面。',
    ),
    choice(
      'roll',
      '同一个圆柱在哪个条件下观察侧面前后滚动？',
      '横放，侧面接触平桌',
      ['横放，侧面接触平桌', '竖放，底面接触平桌'],
      '横放侧面与竖放底面条件不同。',
    ),
    selected(
      'gate-base',
      '城门图桌面第一层所有编号是什么？',
      ['A', 'B'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      '底层是两个正方体。',
      gate,
    ),
    selected(
      'gate-cylinders',
      '选出城门图所有圆柱编号。',
      ['C', 'D'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      'C、D在两个方块上。',
      gate,
    ),
    choice(
      'gate-beam',
      '城门图两个圆柱上面的横梁编号是什么？',
      'E',
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      'E放在两圆柱上。',
      gate,
    ),
    selected(
      'gate-balls',
      '选出城门图横梁上方所有球编号。',
      ['F', 'G'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      'F、G两颗球在最上层。',
      gate,
    ),
    q(
      'gate-total',
      '城门图完整模型一共几件？',
      { kind: 'number', value: 7 },
      '两方块、两圆柱、一横梁、两球共七件。',
      gate,
    ),
    choice(
      'different-base',
      '两种指令的底层形状有什么不同？',
      '双柱图圆柱；城门图正方体',
      [
        '双柱图圆柱；城门图正方体',
        '两个图都以球为底层',
        '两个图都以正方体为底层',
      ],
      '74页柱底与75页方块底分别记录。',
    ),
    actual(
      'beam',
      '按第74页三句完整指令搭双柱横梁加方块，再真实试自己的球能否从横梁下通过并说依据',
    ),
    actual('touch-cylinder', '实际摸出一个圆柱并立在桌面，核对完整物体'),
    actual('touch-cube', '实际摸出一个正方体，按第74页指令放在刚才圆柱上面'),
    actual(
      'roll',
      '同一圆柱横放与竖放各轻推，另观察球，分别说明滚动、滑动或条件改变',
    ),
    actual('gate', '实际完成第75页全部四句城门指令，数清七件并检查支撑'),
    actual(
      'local',
      '实际找长方体、正方体、圆柱、球四类生活实例，并与同伴说完整形状依据',
    ),
    actual('exchange', '与同伴交换说做角色，再听说一轮完整指令并核对所摆位置'),
    q(
      'reflection',
      '哪句指令、哪种滚动或通道情况已经真实观察，哪项仍待做或有疑问？',
      { kind: 'reflection' },
      '开放反思不统一评分，不冒实际合作已完成。',
    ),
    q(
      'plan',
      '下次想改哪一项指令或试哪一个实物通道？这是计划。',
      { kind: 'reflection' },
      '未来打算与已经实际做过分开。',
    ),
  ],
  reviewQuestions: [
    selected(
      'r-beam-base',
      '新编号双柱图，选出第一层全部编号。',
      ['D', 'C'],
      ['A', 'B', 'C', 'D'],
      '重新看当前编号，不套主图A、B。',
      beamReview,
    ),
    choice(
      'r-beam-top',
      '新编号双柱图最上层正方体是什么编号？',
      'B',
      ['A', 'B', 'C', 'D'],
      '当前上层是B，不套旧D。',
      beamReview,
    ),
    selected(
      'r-gate-balls',
      '新编号城门图，选出横梁上方全部球编号。',
      ['A', 'E'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      '当前两球编号A、E。',
      gateReview,
    ),
    selected(
      'r-gate-cylinders',
      '新编号城门图，选出全部圆柱编号。',
      ['D', 'F'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      '当前两圆柱D、F，重新看层次。',
      gateReview,
    ),
  ],
};
