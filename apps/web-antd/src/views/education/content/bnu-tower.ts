import type { BnuBuildingVisual } from '../learning/bnu-building';
import type { Lesson, Question } from '../learning/types';

const id = 'bnu-upper-building-tower';
const flat: BnuBuildingVisual = {
  kind: 'bnu-building',
  scene: 'tower-flat',
  variant: 'main',
};
const upright: BnuBuildingVisual = {
  kind: 'bnu-building',
  scene: 'tower-upright',
  variant: 'main',
};
const review: BnuBuildingVisual = { ...flat, variant: 'review' };
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
    hint: '按当前图中完整物件与层次核对，完整八件、摆放方向与实际稳定分别核对。',
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
    '网页答案不代替实物搭建、稳定性观察或合作；纸面计划和材料替代如实记录。',
  );
}
export const bnuBuildingTowerLesson: Lesson = {
  id,
  textbookTitle: '怎样搭得高',
  title: '八件搭高、稳定与合作重试',
  page: 76,
  version: 1,
  status: 'available',
  goal: '全部八件材料都用上，合作实际搭高且不倒，发现困难、改变摆法并解释真实调整。',
  prerequisite: '认识四类立体，能按指令说上下并数到八。',
  parentTip:
    '对应北师大上册76～77页。原书明确八件全用、含两圆柱一球、高且不倒；本站选三长方体、两正方体、两圆柱、一球为原创模型材料，不冒原盒尺寸实测。分层卡只记录计划，不按厘米量，也不证明一定能搭成或已达最高。只用已有安全轻小物，成人同意的桌面搭建；不登高、不搬重物。无材料或同伴可待做，不要求购买。',
  review: {
    date: '2026-10-04',
    reviewer: '原书76～77页逐页阅读与原创计划核对',
    notes:
      '第三方0061预览：八物全用的合作任务、搭不成/不稳/放偏、再次试、平放与立放、下部大平面与上下对齐、向他组学习、最喜欢活动及疑问。未给实测高度，不补造厘米或最优证明；ISBN版印次未知。',
  },
  steps: [
    {
      title: '全用八件，还要不倒',
      text: '原书要求两人合作，八个物品都用上，想办法搭得高且不能倒。只放一部分或虽然高却倒了，都还未满足全部条件。本站原创材料：三长方体、两正方体、两圆柱、一球共八件；可用已有小物替代并如实记录。',
      activity: '先完整清点、分类，双方讨论先后和分工；没有同伴不冒已经合作。',
      visual: {
        kind: 'solid-row',
        shapes: [
          'cuboid',
          'cuboid',
          'cuboid',
          'cube',
          'cube',
          'cylinder',
          'cylinder',
          'sphere',
        ],
      },
    },
    {
      title: '第一种计划，实际试一试',
      text: '本站第一种分层计划把三个盒形模型平放在下部，继续放方块、圆柱和球。A到H追踪八件同一物品，不是八个画面各一套材料。图不表现真实接触尺寸和重心，球可能滚落；实际搭不成可调整，不必强行照图确认成功。',
      activity:
        '用全部八件做第一轮实际搭建，记录用了几件、哪里不稳或放偏；未成功也可以如实说。',
      visual: flat,
    },
    {
      title: '同八件改摆法',
      text: '本站第二种计划将下部三个盒形模型改为立放，仍是同八件，不因旋转增减材料。实物盒子的方向可能影响高度和接触面，但网页卡片等大、分层间距相同，不能据此量出实际厘米高度或断定一定更稳。',
      activity:
        '在安全桌面用同八件试另一摆法，对照两次真实高度和稳定性；不稳即停止并调整。',
      visual: upright,
    },
    {
      title: '找困难，改支撑与对齐',
      text: '原书把搭不成、不稳、放偏分别提出，再想办法重试。可尝试把大而平的接触面放下面，上下物件对好、不偏；这些是实际尝试方法，不是任意材料必稳的保证。高却倒与低但稳要分别记录，继续寻找既全用、又较高、又不倒的摆法。',
      activity:
        '回看一次真实困难，再改底部朝向或对齐位置，仍数清八件，解释改了什么。',
    },
    {
      title: '合作与学习',
      text: '先听同伴建议，商量后轮流搭、观察、提醒；看到他组摆法，可问方法再自己验证。问建议不等于已获得同意，学到办法不等于已经实际用过。无他组时与家长讨论自己的两轮记录，替代方式如实记。',
      activity:
        '完成原书76～77页的合作、再次搭建与收获交流，逐项说明自己的实际经历。',
    },
    {
      title: '收获、偏好与下一次',
      text: '分别说一次实际困难、一次调整与从同伴学到的办法。原书还问本单元最喜欢哪项活动、还有什么疑问；偏好没有统一对错，不自动评分合作或动手能力。下一次准备试什么另记为计划，不写成已经做过。',
      activity: '实际解释一个全用八件的摆法，开放说喜好与疑问，保留未做项目。',
    },
  ],
  questions: [
    q(
      'q1',
      '本站原创材料三长方体、两正方体、两圆柱、一球共几件？',
      { kind: 'number', value: 8 },
      '逐件计数共八件。',
    ),
    q(
      'counts',
      '本站材料依次填长方体、正方体、圆柱、球各几件。',
      { kind: 'steps', values: [3, 2, 2, 1] },
      '四类全部核对，共八件。',
      flat,
    ),
    selected(
      'cuboids',
      '第一种计划中全部长方体编号是什么？',
      ['A', 'B', 'C'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      '下部三个盒形模型A、B、C。',
      flat,
    ),
    q(
      'used',
      '八件材料已经放上三件，还有几件未用？依次填已用、未用。',
      { kind: 'steps', values: [3, 5] },
      '已用与未用合八件，不重复算。',
    ),
    q(
      'rotation-count',
      '同八件只改变盒子朝向，不添不取，第二种计划仍几件？',
      { kind: 'number', value: 8 },
      '方向改变不增加物件。',
      upright,
    ),
    choice(
      'measure',
      '可以按卡片间距量出实际塔的厘米高度吗？',
      '不可以',
      ['可以', '不可以'],
      '分层图只记顺序，实物高度未知。',
    ),
    choice(
      'goal',
      '哪项完整说出本次目标？',
      '八件都用、搭高且不倒',
      ['只用三件搭高', '八件都用、搭高且不倒', '只要倒前够高'],
      '全用、较高、不倒须同时考虑。',
    ),
    choice(
      'base',
      '作品放偏又不稳，下一次可尝试哪一种调整？',
      '试大而平的面朝下并上下对齐',
      [
        '试大而平的面朝下并上下对齐',
        '不看支撑随意加速堆',
        '只把球放最下面就保证不倒',
      ],
      '支撑和对齐可试，仍须实际检查。',
    ),
    choice(
      'turn',
      '同一个盒子从平放改立放，应另算一件新材料吗？',
      '不应另算',
      ['应另算', '不应另算'],
      '同一物件只改变朝向。',
    ),
    choice(
      'align',
      '上面物件放偏了，应该怎样处理？',
      '停下重新对齐再检查',
      ['停下重新对齐再检查', '说已搭稳不用看'],
      '对齐后也要实际观察。',
    ),
    choice(
      'cooperate',
      '同伴提出不同搭法，怎样继续合作？',
      '先听并商量，再轮流试',
      ['先听并商量，再轮流试', '不听意见直接抢着搭'],
      '交流、协商和轮流都要实际做。',
    ),
    choice(
      'unknown-height',
      '只见分层示意，未量实物，能填一个确定厘米高度吗？',
      '不能，实物高度未测',
      ['能，随意猜数', '不能，实物高度未测'],
      '未知不补造，也不填0冒已测。',
    ),
    choice(
      'fall',
      '用了全部八件，塔较高但已经倒了，满足本次所有条件了吗？',
      '没有',
      ['满足了', '没有'],
      '还未满足不倒条件。',
    ),
    actual('prepare', '实际准备完整八件小物，逐件清点分类，说明本站或替代材料'),
    actual(
      'first',
      '全部八件做第一轮实际搭建，真实记录高度或相对高低、稳定及困难',
    ),
    actual('second', '仍用同八件改变摆法做第二轮，不增减材料，真实检查支撑'),
    actual('compare', '实际对照两轮的高度与稳定，不凭网页卡片量或猜结果'),
    actual(
      'adjust',
      '针对一次真实不稳或放偏，改底部平面或上下对齐后再试，仍全用八件',
    ),
    actual(
      'explain',
      '实际与同伴商量轮流，或如实说明替代方式，并解释一次调整依据',
    ),
    actual(
      'book',
      '完整完成原书76～77页尝试、再搭、合作和收获交流，不把本站计划当已经做过',
    ),
    q(
      'reflection',
      '这次实际遇到什么困难、怎样调整？没做可以如实写待做。',
      { kind: 'reflection' },
      '真实困难不判统一对错。',
    ),
    q(
      'cooperation-reflection',
      '实际听到哪条同伴或他组建议？哪些仍未问或未试？',
      { kind: 'reflection' },
      '观察、讨论与实际使用建议分开。',
    ),
    q(
      'unit-reflection',
      '本单元最喜欢哪项活动，理由是什么，还有什么疑问？',
      { kind: 'reflection' },
      '个人偏好与疑问不评分。',
    ),
    q(
      'plan',
      '下次准备怎样试？这是未来计划，不冒已经搭过。',
      { kind: 'reflection' },
      '实际与未来打算分别记录。',
    ),
  ],
  reviewQuestions: [
    selected(
      'r-cuboids',
      '新编号计划，全部长方体编号是什么？',
      ['H', 'D', 'G'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      '重新看模型与编号H、D、G。',
      review,
    ),
    selected(
      'r-cubes',
      '新编号计划，全部正方体编号是什么？',
      ['B', 'F'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      '当前方块编号B、F，不套旧D、E。',
      review,
    ),
    q(
      'r-used',
      '另一轮八件材料已放上五件，依次填已用、未用。',
      { kind: 'steps', values: [5, 3] },
      '新条件已用五、未用三，不套旧三、五。',
    ),
    choice(
      'r-compare',
      '两次都用了八件，较高的一次倒了，较低的一次没倒。能只凭更高就认定已满足所有条件吗？',
      '不能，还要不倒',
      ['能，只看更高', '不能，还要不倒'],
      '高度与稳定分别看，还要继续试完整目标。',
    ),
  ],
};
