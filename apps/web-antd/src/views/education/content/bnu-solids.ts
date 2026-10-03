import type { Lesson, Question, SolidRowVisual } from '../learning/types';

const id = 'bnu-upper-solid-recognition';
export const bnuSolidMain: SolidRowVisual = {
  kind: 'solid-row',
  shapes: [
    'cuboid',
    'cube',
    'sphere',
    'cuboid',
    'cylinder',
    'cuboid',
    'cylinder',
  ],
};
export const bnuSolidReview: SolidRowVisual = {
  kind: 'solid-row',
  shapes: [
    'cylinder',
    'sphere',
    'cube',
    'cylinder',
    'cuboid',
    'sphere',
    'cylinder',
    'cube',
  ],
};
function q(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: SolidRowVisual,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint: '看完整物体，按同一标准逐件核对；方向、颜色和画出的面不增加物体。',
    explanation,
    ...(visual ? { visual } : {}),
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
    ...q(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function selected(
  suffix: string,
  prompt: string,
  values: string[],
  labels: string[],
  explanation: string,
  visual?: SolidRowVisual,
): Question {
  return {
    ...q(suffix, prompt, { kind: 'set', values }, explanation, visual),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return q(
    `actual-${suffix}`,
    `${prompt}；真实做过再确认，没有材料或未看原书可待做。`,
    { kind: 'manual' },
    '屏幕答对不代替实际观察、摆放、搭建或原书活动；纸卡替代如实记录。',
  );
}
export const bnuSolidRecognitionLesson: Lesson = {
  id,
  textbookTitle: '认识图形',
  title: '认识四种立体、分类与七件计数',
  page: 72,
  version: 1,
  status: 'available',
  goal: '从完整物体认识长方体、正方体、圆柱、球，按形状分类逐件计数，区分圆柱摆放方向与滚动观察，并实际搭建。',
  prerequisite: '会逐件数到十，能按一个明确标准分类。',
  parentTip:
    '对应北师大上册72～73页。四类名称与观察、匹配、七件计数、实际搭建均分别覆盖。本站使用原创排列，不复制教材原画；圆柱图统一竖放，不能据此判断原书横放实物不属于圆柱。选择已有安全小物或纸卡，不要求购买、搬重物、食用包装内容或用真实球追逐；纸卡不能代替三维触摸与滚动实验。',
  review: {
    date: '2026-10-04',
    reviewer: '原书72～73页逐页阅读与原创条件核对',
    notes:
      '第三方0061公开预览实际查看：生活物品分类、四体认识、玩与说、找朋友、七件四类计数和搭建。封面2024审核不代替ISBN及版印次，未知保持未知。',
  },
  steps: [
    {
      title: '看完整物体，再按形状分',
      text: '观察完整的积木、盒子、罐子或球。长方体像规则砖形盒子；正方体六个面一样大且方方正正；圆柱像两端同样大小圆面、侧面弯曲的规则模型；球整体圆圆的。生活物品可以近似某种形状，不是看颜色或只看一个平面。本站按四类分别认识，不在本课扩展形体包含关系。',
      activity:
        '用已有安全小模型，转着看或摸完整物体；不规则物体可另放，不强塞入四类。',
      visual: {
        kind: 'solid-row',
        shapes: ['cuboid', 'cube', 'cylinder', 'sphere'],
      },
    },
    {
      title: '玩一玩，分别说观察',
      text: '在平桌上轻推观察，球可以向不同方向滚动。圆柱横放，弯曲侧面接触桌面时可前后滚动；竖放在圆形底面上通常是滑动，倾倒后条件已改变。方盒在平面上推可能滑，不把滑动叫滚动；只知道“能滚”不能唯一认定为球，因为横放圆柱也能滚。',
      activity:
        '实际对同一个圆柱横放、竖放各试一次，再分别观察球与方盒；用成人同意的小物，落地即停。',
    },
    {
      title: '找朋友，不只看一面',
      text: '第73页实物与形体配对，按物体整体形状找相应模型。本站自制规则砖形盒配长方体、六面一样大的方积木配正方体、两端同圆面的模型配圆柱、完整球形模型配球。盒子画面露出的正方形面不能证明整个盒子一定是正方体，未给完整形状就保留待观察。',
      activity: '实际完成原书全部配对，再找自己的生活实例，指出对应依据。',
    },
    {
      title: '七件学具逐件计数',
      text: '原书第73页七件中长方体3个、正方体1个、圆柱2个、球1个。本站重新排列同样四类数量，从左到右数位置，每件只归到本课一类；颜色、朝向、大小不同不增加件数，一件图示画出几个面仍是一件。圆柱在本站统一竖放，原书横放的圆柱也仍是圆柱。',
      activity:
        '沿本站七件逐件指认分类，再独立在原书四个空格填写并复核全部七件。',
      visual: bnuSolidMain,
    },
    {
      title: '用材料搭一搭',
      text: '分类后实际自由搭建，不只给作品起名字。使用已有小模型，试放、发现不稳再调整；网页形状图不是搭稳的证据。球可能滚开，需按实际支撑条件观察；没有真实三维材料时可画计划，但计划不当已经搭好。',
      activity:
        '完成原书第73页搭建活动或如实记录材料替代，数清用了哪些件，向同伴解释一次调整。',
    },
    {
      title: '回看不同证据',
      text: '分别回看72页物品分类与四形体认识、73页玩说、找朋友、分类计数、搭建。屏幕计数、原书观察、实际触摸滚动和搭建是不同经历。说一个真实发现和一个尚有疑问；下一次准备再试属于计划，不由客观分数自动评价观察能力。',
      activity: '向家长或同伴说自己的分类依据和真实观察，没有做过可明确待做。',
    },
  ],
  questions: [
    choice(
      'q1',
      '本站规则模型六个面一样大且方方正正，按本课四类叫什么？',
      '正方体',
      ['长方体', '正方体', '圆柱', '球'],
      '按完整模型特征认正方体，不只看一面。',
    ),
    choice(
      'cuboid',
      '本站规则砖形盒子，长、宽、高并不全相同，按本课四类叫什么？',
      '长方体',
      ['长方体', '正方体', '圆柱', '球'],
      '规则砖形模型是长方体。',
    ),
    choice(
      'cylinder',
      '本站模型两端是一样大的圆面，侧面弯曲，按本课四类叫什么？',
      '圆柱',
      ['长方体', '正方体', '圆柱', '球'],
      '两端和侧面一起观察，不把一个圆面当完整球。',
    ),
    choice(
      'sphere',
      '本站完整球形模型，没有平的底面，按本课四类叫什么？',
      '球',
      ['长方体', '正方体', '圆柱', '球'],
      '观察整个球，不把圆面当球。',
    ),
    q(
      'counts',
      '本站七件原创排列，依次填长方体、正方体、圆柱、球各有几件。',
      { kind: 'steps', values: [3, 1, 2, 1] },
      '逐件归类，各件只计一次；统一竖放圆柱仍同类。',
      bnuSolidMain,
    ),
    q(
      'total',
      '只数本站这一排完整模型，一共有几件？',
      { kind: 'number', value: 7 },
      '数完整物件，不数画出的面。',
      bnuSolidMain,
    ),
    selected(
      'cylinder-positions',
      '从左到右第一个位置为1，选出本站这排所有圆柱的位置。',
      ['5', '7'],
      ['1', '2', '3', '4', '5', '6', '7'],
      '第五与第七都是圆柱，各自一件。',
      bnuSolidMain,
    ),
    selected(
      'cuboid-positions',
      '从左到右第一个位置为1，选出本站这排所有长方体的位置。',
      ['1', '4', '6'],
      ['1', '2', '3', '4', '5', '6', '7'],
      '第一、第四、第六是长方体，不能漏掉重复形状。',
      bnuSolidMain,
    ),
    choice(
      'turn',
      '同一个圆柱模型从竖放改为横放，没有切开或添材料，形状类别改变了吗？',
      '没有改变',
      ['改变了', '没有改变'],
      '朝向改变，不改变物体类别或件数。',
    ),
    choice(
      'roll',
      '本站圆柱在平桌上轻推，哪一种接触方式可观察到前后滚动？',
      '横放，侧面接触桌面',
      ['横放，侧面接触桌面', '竖放，圆形底面接触桌面'],
      '横放与竖放条件不同，不把滑动当滚动。',
    ),
    choice(
      'upright',
      '圆柱先竖放，后被推倒在侧面滚动，可以说它一直是竖放滚动吗？',
      '不可以',
      ['可以', '不可以'],
      '推倒之后摆放条件已改变，要分别记录。',
    ),
    choice(
      'roll-only',
      '只听说一个物体能滚，没看完整物体，能唯一断定它一定是球吗？',
      '不能',
      ['能', '不能'],
      '横放圆柱也能滚，信息不够。',
    ),
    choice(
      'one-face',
      '只看见盒子的一个正方形面，其余形状未给，能断定整个盒子是正方体吗？',
      '不能',
      ['能', '不能'],
      '需要看完整形状，一个面不够。',
    ),
    choice(
      'colour',
      '同一件模型只换了颜色，没有变形或添物，分类计数应增加一件吗？',
      '不应增加',
      ['应增加', '不应增加'],
      '件数由完整模型决定，不由颜色改变。',
    ),
    choice(
      'unknown',
      '只知道“有一个盒子”，未见形状，能确定它属于四类中的哪一类吗？',
      '还需观察',
      ['一定是正方体', '一定是长方体', '还需观察'],
      '不能由盒子这个名称猜出未知完整形状。',
    ),
    q(
      'zero',
      '本站另一排只问圆柱数量：有几件圆柱？没有时填0。',
      { kind: 'number', value: 0 },
      '这排有长方体和球，确定没有圆柱，填0而不是留空。',
      { kind: 'solid-row', shapes: ['cuboid', 'sphere', 'cuboid'] },
    ),
    actual(
      'book-classify',
      '实际观察原书第72页生活物品，按四类分并说完整形状的依据',
    ),
    actual(
      'play',
      '实际对同一圆柱横放与竖放各轻推观察，并另试球和方盒，分别说滚动与滑动',
    ),
    actual('match', '实际完成第73页“找朋友”的全部实物与模型配对，核对依据'),
    actual('fill', '独立逐件指认原书七件，在四个空格写全各类件数，再复核全数'),
    actual('build', '实际用安全小模型搭建、检查支撑并调整一次，说出所用材料'),
    actual('local', '实际找自己的生活物品与四类模型比较，不规则或未知形状另记'),
    actual('explain', '实际向同伴说明一种分类依据及一种摆放方向带来的观察变化'),
    q(
      'reflection',
      '哪些完整形状或滚动条件已经真实观察，哪些还没做或仍有疑问？可如实说。',
      { kind: 'reflection' },
      '开放反思不判统一对错，也不自动评观察能力。',
    ),
    q(
      'plan',
      '下一次准备观察或搭建什么？这是计划，不写成已经完成的活动。',
      { kind: 'reflection' },
      '未来计划与已经完成的实际活动分开。',
    ),
  ],
  reviewQuestions: [
    q(
      'r-counts',
      '新的原创排列，依次填长方体、正方体、圆柱、球各有几件。',
      { kind: 'steps', values: [1, 2, 3, 2] },
      '重新逐件分类，不能套主课3、1、2、1。',
      bnuSolidReview,
    ),
    q(
      'r-total',
      '新的原创排列，一共几件完整模型？',
      { kind: 'number', value: 8 },
      '数八个模型，不数画出的面。',
      bnuSolidReview,
    ),
    selected(
      'r-cylinders',
      '新排列从左起为1，选出所有圆柱位置。',
      ['1', '4', '7'],
      ['1', '2', '3', '4', '5', '6', '7', '8'],
      '新圆柱位置一、四、七，不套旧五、七。',
      bnuSolidReview,
    ),
    selected(
      'r-cubes',
      '新排列从左起为1，选出所有正方体位置。',
      ['3', '8'],
      ['1', '2', '3', '4', '5', '6', '7', '8'],
      '新正方体为第三、第八，全部选出。',
      bnuSolidReview,
    ),
    q(
      'r-zero',
      '本站另一排有球与圆柱，只问正方体有几件，没有时填0。',
      { kind: 'number', value: 0 },
      '已明确图中没有正方体，零不当未知。',
      { kind: 'solid-row', shapes: ['sphere', 'cylinder', 'sphere'] },
    ),
  ],
};
