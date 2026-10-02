import type { SolidInstructionsVisual } from '../learning/solid-instructions';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { solidInstructionItems } from '../learning/solid-instructions';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-solid-instructions';
function model(
  arrangement: SolidInstructionsVisual['arrangement'],
  review: boolean,
): SolidInstructionsVisual {
  return {
    kind: 'solid-instructions',
    arrangement,
    variant: review ? 'review' : 'main',
  };
}
function tasks(review: boolean): Question[] {
  const bridge = model('bridge', review);
  const cross = model('cross', review);
  const bridgeItems = solidInstructionItems(bridge);
  const crossItems = solidInstructionItems(cross);
  const label = (role: string, items = crossItems) =>
    required(items.find((p) => p.role === role)).label;
  const choices = crossItems.map((p) => ({
    id: p.label,
    label: `编号${p.label}`,
  }));
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    ...(
      [
        ['left', '左边'],
        ['right', '右边'],
        ['front', '前边'],
        ['back', '后边'],
      ] as const
    ).map(([role, name]): Question => ({
      ...base(
        `cross-${role}`,
        `看${review ? '新编号' : '主课'}位置记录，站在图下方向中心，中心${label('center')}的${name}地面块编号是什么？`,
      ),
      visual: cross,
      choices,
      rule: { kind: 'choice', value: label(role) },
      hint: '以图下方观察者为固定参照，前后是远近，左右不是上下层。',
      explanation: `${name}是${label(role)}，别把上面的积木当后边。`,
    })),
    {
      ...base(
        'upper-two',
        `中心${label('center')}上面是哪两个编号？选全两块，不把地面前/后块算上面。`,
      ),
      visual: cross,
      choices,
      rule: { kind: 'set', values: [label('lowerTop'), label('upperTop')] },
      hint: '看中心上下层次图，底块是中心本身，不在所求上面两块里。',
      explanation: `上面两块是${label('lowerTop')}和${label('upperTop')}；下面的中心仍只有一块。`,
    },
    {
      ...base(
        'ground-five',
        '这件七块作品实际直接放在地面的块数是多少？上面两块不算地面块。',
      ),
      visual: cross,
      rule: { kind: 'number', value: 5 },
      hint: '只数中心、左、右、前、后地面五位置。',
      explanation: '地面5块；上面两块由中心位置的块支撑，不是直接放地面。',
    },
    {
      ...base(
        'all-seven',
        '两张记录显示同一作品，实际一共几块？按不同编号数，不把两图共同的中心再算一次。',
      ),
      visual: cross,
      rule: { kind: 'number', value: 7 },
      hint: '编号相同表示同一块，五个地面块与两个上面块合并。',
      explanation: '共7块，不是画了8次就算8块。',
    },
    {
      ...base(
        'same-center',
        `中心${label('center')}在地面图和上下图各画一次，实际是两块吗？`,
      ),
      visual: cross,
      choices: [
        { id: 'one', label: '不是，同一编号仍只是一块' },
        { id: 'two', label: '是，画两次就变成两块' },
      ],
      rule: { kind: 'choice', value: 'one' },
      hint: '两张记录是同一作品，编号用于追踪同一物体。',
      explanation: '图里重复记录不增加实物数量。',
    },
    {
      ...base(
        'bridge-counts',
        `看${review ? '新编号' : '主课'}架梁关系图，按正方体、长方体、圆柱、球依次填部件数。`,
      ),
      visual: bridge,
      rule: { kind: 'steps', values: [2, 1, 2, 2] },
      hint: '从底部两柱往上找同类，不把横梁画宽就算成好几块。',
      explanation: '两方块、一根长方体梁、两柱、两球，四类2/1/2/2共7块。',
    },
    ...(
      [
        ['leftBall', 'leftCube', '左'],
        ['rightBall', 'rightCube', '右'],
      ] as const
    ).map(([ball, cube, name]): Question => ({
      ...base(
        `bridge-${name === '左' ? 'left' : 'right'}-support`,
        `${name}球${label(ball, bridgeItems)}直接放在哪个方块上？不是直接放在最底下柱上。`,
      ),
      visual: bridge,
      choices,
      rule: { kind: 'choice', value: label(cube, bridgeItems) },
      hint: '找球下面紧接的一层，直接上面与更高处不同。',
      explanation: `直接支撑${name}球的是方块${label(cube, bridgeItems)}。`,
    })),
    {
      ...base('two-pillars', '这根横梁由哪两个竖放圆柱共同支撑？选全两柱。'),
      visual: bridge,
      choices,
      rule: {
        kind: 'set',
        values: [
          label('leftPillar', bridgeItems),
          label('rightPillar', bridgeItems),
        ],
      },
      hint: '同一根梁跨在两柱上，不能只找一边。',
      explanation: `两柱${label('leftPillar', bridgeItems)}、${label('rightPillar', bridgeItems)}支撑同一梁；实际间距与梁长要核对。`,
    },
    {
      ...base(
        'after-pillars',
        '按本课四步指令，先竖放两柱，第二步应放哪个编号？不是把球先放到空中。',
      ),
      visual: bridge,
      choices,
      rule: { kind: 'choice', value: label('beam', bridgeItems) },
      hint: '从下往上，两柱上横放同一根长方体，再放两方块，最后各放球。',
      explanation: `第二步横梁${label('beam', bridgeItems)}，然后两方块，再两球。图示只给关系，不能证明材料一定搭稳。`,
    },
  ];
}

export const sujiaoUpperSolidInstructionsLesson: Lesson = {
  id,
  title: '中心七块与架梁：多方向联合指令',
  textbookTitle: '图形的初步认识（一）·位置指令与互说搭建',
  page: 58,
  version: 1,
  status: 'available',
  goal: '固定观察参照同时检查左右、前后、上下；区分同一作品两张记录，按双柱、横梁、两方块、两球四步实际互说搭建。',
  prerequisite:
    '认识四种立体形状和前后左右上下，准备七块同样大小安全正方体及两柱/一梁/两方块/两球；无材料暂留实际待做。',
  parentTip: `ISBN ${source.isbn}同版印刷58/60页。本站编号是积木身份不是英语教学，关系图原创、不复制颜色图。七块活动先按中心/左右/前后/上面用六块，剩一块另试摆；本站记录例把第七块继续放上面，不冒教材指定第七块位置。两张中心图重复同一编号仍一块；双柱架梁实际核对长度、间距与稳定，图示不冒已搭稳。未来计划和人工实际分开。`,
  steps: [
    {
      title: '固定观察者，五方向一起说',
      text: '你坐在图下方朝中心。中心A，B在左、C在右、D在前、E在后；F在A上面。前后是地面远近，上下是层次，不把F叫后边。用六块完成这段，剩G可另试摆。本课记录例把G再放在F上，一共七块；你自主另摆须写自己的真实位置。',
      visual: model('cross', false),
      activity:
        '实际给七个方块标A～G，先按六块指令摆，再将第七块另试；固定座位指物说左右前后上下，记录实际七块各位置。',
    },
    {
      title: '同一块在两张图，数量不翻倍',
      text: '地面记录先暂拿起F/G，显示五个直接接触桌面的块；上下记录看G、F、A三层，底下A仍是前图中心A。两图不是两件作品，A不会变两块。把F/G恢复后仍七块。实物从不同方向看可能挡住别的块，要查真实摆法，不凭看见的面推全部。',
      visual: model('cross', false),
      activity:
        '实际暂拿起上面两块观察地面，再恢复；逐个指出七个不同编号、说明A在两张记录出现仍一块，不把前后缩成单排。',
    },
    {
      title: '四步架梁，从下往上完整执行',
      text: '另一套材料：A/B两竖柱，C一根长方体横梁，D/E两方块，F/G两球。先竖放两柱；第二步把同一根梁横放跨在两柱上；第三步梁上左右各放一方块；第四步各方块上放一球。直接下面的支撑与更低的一层不同。分层卡留缝为读关系，不表示可以悬空。',
      visual: model('bridge', false),
      activity:
        '实际顺序做全四步并记录各编号支撑关系；核对梁长、两柱间距和稳定。球不能稳如实记该步尚未完成，不用手扶着说已经稳住，也不把失败当全部搭好。',
    },
    {
      title: '你说我搭，交换两次角色',
      text: '一人说参照物、方向与顺序，另一人边摆边复述，完成后一起检查。第一轮中心七块，第二轮双柱四步，再交换说与搭的角色各做一轮。没有同伴如实待做；只读文字或在网页选择不当互说已发生。换坐位要先重新约定观察方向。',
      activity:
        '实际同伴两人共四轮，保留原话指令、实际结果与误解/帮助；每轮恢复材料，检查全部条件，不只最后一块位置。',
    },
    {
      title: '换编号或新摆法，重新核对',
      text: '复习图换编号，左右前后和支撑关系按新图找，不能固记B永远在左。自主另摆七块可有不同合理作品，记录参照和全部位置，指实物验证；换作品或只换位置不凭空增减总块。今天未做和以后想试分别记。',
      activity:
        '实际自主另创七块摆法，告诉家人新的位置指令并共同核对；记独立做、接受帮助及尚未完成的真实部分。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-central-seven',
        '实际用七块标A～G，固定朝向，先中心A/左B右C/前D后E/上F六块，再把剩G另试摆（本站记录例在F上）。记自己的真实七块全部位置；暂拿起上层观察五个地面块再恢复，不把前后当单排或两图当两作品。',
      ],
      [
        'actual-four-step-bridge',
        '实际用双柱A/B、一梁C、两方块D/E、两球F/G，依次竖柱→横梁跨两柱→梁上双块→各块上球四步完整搭。记录编号支撑与梁长/间距/稳定，每步未做或球不稳如实待做，不凭网页选择确认。',
      ],
      [
        'actual-mutual-instructions',
        '实际同伴两人先中心摆法和架梁各一轮，再交换说/搭角色各一轮，共四轮。说参照、方向、顺序并实际复述检查，保留原话/帮助/误解；无同伴不编造，未来计划另记。',
      ],
      [
        'actual-new-arrangement',
        '实际自主另摆七块作品，固定或重新明确观察位置，记录七个不同编号的关系，向家人发新指令并实际核对。不同合理摆法保留，不用照读本站答案代替自主创造。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际完成并核对再确认，没条件暂跳；网页正确不替互说互搭。',
      explanation: '人工记录真实活动，不自动判断熟练或全部稳定。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天实际理解的一个方向/支撑关系、发生的误解或帮助、仍待完成部分。未做如实写尚未做；未来想试的另写，不冒同伴交流已经发生。',
      rule: { kind: 'reflection' },
      hint: '记录真实例子，不要求全部成功。',
      explanation: '反思正确性null，不自动给星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '多方向联合与四步支撑指令核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷同版58/60页实际已读。原创语义位置记录，复习换全部编号，固定观察参照不变；实物稳定、原话交流、未来计划分别记录，最终教师审校未核验。',
  },
};
