import type { CubeColumnsVisual, Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-final-moves';
export function finalMoveStates(review: boolean) {
  return review
    ? { initial: [1, 2, 3, 2, 1], next: [2, 1, 3, 1, 2], minimum: 3 }
    : { initial: [2, 1, 3, 1, 2], next: [1, 2, 3, 2, 1], minimum: 2 };
}
/** Adult verification: whole aligned cubes, target on table; all 9-cube cuboid orientations. */
export function finalMoveMinimum(heights: readonly number[]) {
  const dimensions = [
    [9, 1, 1],
    [1, 9, 1],
    [1, 1, 9],
    [3, 3, 1],
    [3, 1, 3],
    [1, 3, 3],
  ] as const;
  let preserved = 0;
  for (const [width, depth, height] of dimensions) {
    // All anchors with nonzero overlap; disjoint targets preserve zero cubes.
    for (let left = 1 - width; left < heights.length; left++) {
      for (let back = 1 - depth; back <= 0; back++) {
        let overlap = 0;
        for (const [x, column] of heights.entries()) {
          if (x >= left && x < left + width && back <= 0 && back + depth > 0)
            overlap += Math.min(column, height);
        }
        preserved = Math.max(preserved, overlap);
      }
    }
  }
  return 9 - preserved;
}
const cubes = (heights: number[]): CubeColumnsVisual => ({
  kind: 'cube-columns',
  heights,
});
function tasks(review: boolean): Question[] {
  const state = finalMoveStates(review);
  const label = review ? '新练习' : '主练习';
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
    visual?: CubeColumnsVisual,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt: `${label}：${prompt}`,
    rule,
    explanation,
    visual,
    hint: '每次只移动原有整块，不增减、不切开。第二阶段从第一阶段完成后的新状态重新判断。',
  });
  return [
    q(
      'initial',
      '图是一块深，五列自左向右的块数依次填①至⑤。',
      { kind: 'steps', values: state.initial },
      `五列${state.initial.join('、')}，合计9块。`,
      cubes(state.initial),
    ),
    q(
      'next',
      `从${state.initial.join('、')}，只移两块后成为本图。新五列的块数依次填①至⑤。`,
      { kind: 'steps', values: state.next },
      `两块从${review ? '第二、四列第二层移到第一、五列第二层' : '第一、五列第二层移到第二、四列第二层'}，底层与中间三块不动。`,
      cubes(state.next),
    ),
    q(
      'preserve',
      '完成第一阶段后，①新状态总块数；②已移动块数，两个空分别填。',
      { kind: 'steps', values: [9, 2] },
      '9块仍是原来的9块；第一阶段移了2块，计数对象不同。',
      cubes(state.next),
    ),
    q(
      'minimum',
      `现在从新状态${state.next.join('、')}出发，目标位置、长宽高自由选；整块整面贴合，底面在桌面，不悬空、不重叠、不留洞，全部9块拼一个长方体。至少还需移动几块？`,
      { kind: 'number', value: state.minimum },
      review
        ? '可保留左边三列已有6块，把第四列1块及第五列2块填前三列缺口，移动3块。也可选右边三列。所有整齐目标最多保留6块，因此至少3块。'
        : '选择原来的中间三列，每列补成3块。两外列底层各1块移入第二、四列顶层，原位保留7块，另移2块；任何长方体目标都不能保留8块，所以至少2块。',
      cubes(state.next),
    ),
    q(
      'kept',
      '采用最少移动的目标，①保留原位置的块数；②第二阶段移动的块数。',
      { kind: 'steps', values: [9 - state.minimum, state.minimum] },
      `保留${9 - state.minimum}，移动${state.minimum}，合计9；保留不是丢掉。`,
      cubes(state.next),
    ),
    q(
      'total',
      '①第一阶段移动次数；②第二阶段最少移动次数；③两阶段合计移动次数。每块每移动一次计一次，同一块再移要再计。',
      { kind: 'steps', values: [2, state.minimum, 2 + state.minimum] },
      `2+${state.minimum}=${2 + state.minimum}；“至少还要”只问第二阶段，不是两阶段总数。`,
    ),
    {
      ...q(
        'target',
        '三列各3块，只有一块深，整体是什么？',
        { kind: 'choice', value: 'cuboid' },
        '宽3、高3、深1，整体是长方体；各小块是正方体。',
        cubes([3, 3, 3]),
      ),
      choices: [
        { id: 'cuboid', label: '长方体' },
        { id: 'cube', label: '正方体' },
      ],
    },
    {
      ...q(
        'proof',
        `有人能用${state.minimum}块完成，就已经证明这是最少吗？`,
        { kind: 'choice', value: 'both' },
        `还需排除少于${state.minimum}块的目标。试位置/方向并数可保留块；只展示一个拼法不足以证明最少。`,
      ),
      choices: [
        { id: 'both', label: '还要说明更少块数不能完成' },
        { id: 'one', label: '一个拼法足够，别的目标不用看' },
      ],
    },
    {
      ...q(
        'free',
        `题目没有限定前三列；${review ? '中间三列需4块，左三列需3块' : '前三列需3块，中间三列需2块'}。应按哪个条件判断？`,
        { kind: 'choice', value: 'free' },
        '自由目标需比较不同位置和方向；固定前三列是另一道不同条件的题，旧练习保留。',
      ),
      choices: [
        { id: 'free', label: '按自由目标寻找最少，不强制前三列' },
        { id: 'prefix', label: '无论题目怎么说，都固定前三列' },
      ],
    },
  ];
}
const manual = (key: string, prompt: string): Question => ({
  id: `${id}-${key}`,
  knowledge: `${id}-${key}`,
  prompt,
  rule: { kind: 'manual' },
  hint: '实际做完再确认，没材料或没做暂跳；帮助与未来计划分开。',
  explanation: '网页答对不代替真实搭摆、逐块移动、自由探索与说明。',
});
export const sujiaoUpperFinalMovesLesson: Lesson = {
  id,
  title: '期末探索：先移两块，再自由拼长方体',
  textbookTitle: '期末复习·两阶段移块',
  page: 94,
  version: 1,
  status: 'available',
  goal: '先完成两块移动，再从新状态自由找长方体目标，区分还需、总次数和保留块数，用实际操作与不能更少的说明核对。',
  prerequisite: '认识正方体和长方体，会10以内计数；备9个同样大小方块与纸笔。',
  parentTip: `同版ISBN ${source.isbn}94页已实际查看。原山形五列2、1、3、1、2，先移两块成1、2、3、2、1，再自由目标至少2块；原创反向新练习至少3块。只使用整块对齐、全块、无洞无重叠、底面在桌面；不教坐标或面积体积公式。全方向/位置的保留数已程序枚举，实际稳定仍需实物确认；教师最终审校未核验。`,
  steps: [
    {
      title: '原山形九块，一列一列数',
      text: '从左到右2、1、3、1、2，一块深，共9块。先保留底层五块和中间三块的位置；每块只数一次，露出几个面不表示几块。',
      visual: cubes([2, 1, 3, 1, 2]),
      activity:
        '实际用9个同大方块搭原山形，纸上画五列，给底线位置做标记；用纸片替代仅作平面推演，如实记录。',
    },
    {
      title: '第一阶段：两外列上层移向里面',
      text: '将第一列上层移到第二列上层，第五列上层移到第四列上层。只移动两块，成为1、2、3、2、1，仍9块；第一阶段不是已经拼成长方体。',
      visual: cubes([1, 2, 3, 2, 1]),
      activity:
        '实际逐块移两块，记录每块原位和新位；核对中间三块和底层不动，再数新五列。',
    },
    {
      title: '第二阶段：从新状态自由选目标',
      text: '保持中间三列的位置，移两外列底层块到第二、四列顶层，就成为三列各3块、一块深的长方体。外两列现在空，不是又多两列。这里至少还移2块；连第一阶段共4次，不用原山形直接算“还需”。',
      visual: cubes([3, 3, 3]),
      activity:
        '实际从新状态搭目标，中间列保留；逐块记录第二阶段两次和合计四次，确认底面贴桌、整面贴合、无洞及稳定。',
    },
    {
      title: '为什么不能只再移一块',
      text: '只移一块要保留其余8块在原位。保留8块就至少保留四个不同底层位置，还要保留上层。九块完整拼法只有九块直排或三排各三块及它们的转向；直排不能同时保留这些底层和上层，三排各三块的目标最多覆盖三个底层位置。选择三列各3块时最多保留中间7块；平铺9块最多保留底层5块；其它方向不能保留8块。因此两块能完成，也不能更少。',
      activity:
        '实际重新恢复新状态，自由试不同位置与方向，至少比较中间三列、前三列、九块一排；记录各自保留和移动数。再试只移一块，说明为何仍有缺口或多余，不能只凭试几次失败下结论。',
    },
    {
      title: '新练习换状态，原答案不能照抄',
      text: '反向新练习从1、2、3、2、1开始，两内列第二层移到两外列第二层，成2、1、3、1、2。再自由拼，前三列保留6块、补3块即可，右三列也可。中间三列只能保留5块，要移4块；新题最少还移3块，共5次。先移第五列上层，再移它底层，不把下块抽走留下悬空。',
      visual: cubes([2, 1, 3, 1, 2]),
      activity:
        '实际反向两阶段，第二阶段逐次取第5列上层补第1列顶层、第4列底层补第2列中层、再取第5列底层补第2列顶层；保留全过程，说明为何至少3块。允许其它同样有效目标。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'actual-first',
      '实际搭2、1、3、1、2，逐块移动两外列上层到两内列，成为1、2、3、2、1；保留前后五列及两次记录，核对仍9块。',
    ),
    manual(
      'actual-free',
      '实际从新状态自由比较中间三列、前三列、平铺及其它方向，记录保留/移动数；完成最少两块目标，解释保留7与不能保留8，不能仅抄网页示例或凭有限失败确认最少。',
    ),
    manual(
      'actual-review',
      '实际原创反向新练习先两块，再从2、1、3、1、2自由探索，完成三块目标且核对不能更少；拆上层再下层，不悬空，说明为何旧2块答案不适用。',
    ),
    manual(
      'actual-textbook',
      '实际查看同版94页原山形及题意，先两块再从新状态自由最少；原教材观察和本站图分别记录，无原书待做，不把固定前三列当原题条件。',
    ),
    manual(
      'actual-explain',
      '实际展示两阶段的原位/新位记录，说清还需与总次数、整块与露出面、能完成与不能更少；真实稳定/材料替代/帮助如实记，未来计划另列。',
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写实际移动的一例、目标条件、为何最少，以及帮助或改正；未做如实记，未来计划另列。',
      rule: { kind: 'reflection' },
      hint: '真实经历和未来计划分开。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '原两阶段与自由目标核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷同版94页先移两块再自由拼。旧固定前三列练习保留独立条件；新状态主最少2/反向3，程序枚举全方向及可能重合位置，真实操作分五项人工。教师最终审校未核验。',
  },
};
