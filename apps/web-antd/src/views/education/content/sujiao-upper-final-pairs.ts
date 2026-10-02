import type { Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-final-pairs';
function tasks(review: boolean): Question[] {
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    hint: '先说这次分类规则；整块材料件数与拼后外形分清，两块接面要完整贴合，不增加、不切碎。',
    explanation,
  });
  const shapes = [
    { id: 'cube', label: '正方体' },
    { id: 'cuboid', label: '长方体' },
    { id: 'cylinder', label: '圆柱' },
    { id: 'sphere', label: '球' },
  ];
  const choice = (
    key: string,
    prompt: string,
    right: string,
    explanation: string,
    choices: { id: string; label: string }[],
  ): Question => ({
    ...q(key, prompt, { kind: 'choice', value: right }, explanation),
    choices,
  });
  return [
    {
      ...q(
        'curved-rule',
        review
          ? '四种理想模型按有曲面/没有曲面分，选没有曲面的全部形体。'
          : '四种理想模型按有曲面/没有曲面分，选有曲面的全部形体。',
        {
          kind: 'set',
          values: review ? ['cube', 'cuboid'] : ['cylinder', 'sphere'],
        },
        '正方体和长方体外表都是平面，圆柱与球有曲面；每个形体只放这轮相应一组。',
      ),
      choices: shapes,
      visual: {
        kind: 'solid-row',
        shapes: ['cuboid', 'cube', 'cylinder', 'sphere'],
      },
    },
    {
      ...q(
        'flat-rule',
        review
          ? '恢复四模型，改按有平面/没有平面分，选没有平面的形体。'
          : '恢复四模型，改按有平面/没有平面分，选有平面的全部形体。',
        {
          kind: 'set',
          values: review ? ['sphere'] : ['cube', 'cuboid', 'cylinder'],
        },
        '圆柱有上下平面也有曲面，在前轮曲面组、本轮有平面组；换规则不改模型数量，不能沿旧组直接抄。',
      ),
      choices: shapes,
    },
    choice(
      'cylinder-both',
      review
        ? '换分类规则后圆柱换了组，就变成别种形体了吗？'
        : '圆柱前轮有曲面、本轮又有平面，这两种说法冲突吗？',
      'rules',
      '圆柱同时有平面和曲面；每轮按本轮规则独立完整分类，不要求两个规则得相同组。',
      [
        {
          id: 'rules',
          label: review
            ? '没有，规则不同，圆柱本身没变'
            : '不冲突，圆柱有平面也有曲面',
        },
        {
          id: 'wrong',
          label: review
            ? '变了，换组改变了形体'
            : '冲突，一个形体不能有两类表面',
        },
      ],
    ),
    {
      ...q(
        'cube-pair',
        review
          ? '新候选：两个相同正方体不能增加或丢弃，整面贴合，选所有可由这两块拼出的完整候选（A/B/C）。'
          : '两个相同正方体，不能增加或丢弃，整面贴合，选所有可由这两块拼出的完整候选（A/B/C）。',
        { kind: 'set', values: review ? ['B', 'C'] : ['A', 'B'] },
        '两块并排或上下整面贴合都可成长方体，材料仍2块；多一块/少一块候选不行。图面与内部接缝不另算一块。',
      ),
      choices: ['A', 'B', 'C'].map((id) => ({ id, label: id })),
      visual: {
        kind: 'solid-recompose',
        scene: 'pair-cubes',
        variant: review ? 'review' : 'main',
      },
    },
    {
      ...q(
        'cylinder-pair',
        review
          ? '两相同新圆柱各更高，保持同粗同轴、上下圆端面完整贴合，哪个候选是拼后一个更高圆柱？'
          : '两相同圆柱保持同粗同轴、上下圆端面完整贴合，哪个候选是拼后一个更高圆柱？',
        { kind: 'choice', value: review ? 'C' : 'A' },
        '只有两个圆柱端面对齐上下相接，才是这里指定的更高圆柱。旁边并列还是两根分开，少一段或多一段都不是本条件。',
      ),
      choices: ['A', 'B', 'C'].map((id) => ({ id, label: id })),
      visual: {
        kind: 'solid-recompose',
        scene: 'pair-cylinders',
        variant: review ? 'review' : 'main',
      },
    },
    q(
      'cube-materials',
      review
        ? '两正方体上下拼一个长方体后，原材料仍是几块？不是问拼后几个完整作品。'
        : '两正方体并排拼一个长方体后，原材料仍是几块？不是问拼后几个完整作品。',
      { kind: 'number', value: 2 },
      '两个原块始终2块，接缝是两块贴合位置，不会消失成一个原块。',
    ),
    q(
      'cylinder-materials',
      review
        ? '两根更高圆柱端面相接成一个作品，实际原材料有几根？高度份数不是根数。'
        : '两根圆柱端面相接成一个作品，实际原材料有几根？高度份数不是根数。',
      { kind: 'number', value: 2 },
      '高度可以变，原材料始终两根；不能按图上高度份数或一个作品就报一根。',
    ),
    choice(
      'whole-cube',
      '两个相同正方体整面贴合后，整体是否仍是一个正方体？',
      'cuboid',
      '两个立方块合起来有一方向变长而另外两方向保持，整体为长方体；不要求一年级学面积体积公式。',
      [
        { id: 'cuboid', label: '整体是长方体，单块仍正方体' },
        { id: 'cube', label: '两块都是正方体，所以整体一定正方体' },
      ],
    ),
    choice(
      'cuboid-condition',
      review
        ? '不同长宽高比例的两相同长方体都保证可以拼正方体吗？'
        : '两个相同长方体无论比例和接法，都一定拼成正方体吗？',
      'condition',
      '需要看实际长宽高比例和接法；有些整面贴合仍长方体，有些特定薄块能拼正方体，不能从两块同名就断定。',
      [
        { id: 'condition', label: '不保证，先观察比例与接法，实际拼后判断' },
        { id: 'always', label: '保证，同名两块合起来就一定正方体' },
      ],
    ),
    choice(
      'join-condition',
      '两个圆柱随意斜放、侧面相碰，整体就一定是一个更高圆柱吗？',
      'aligned',
      '本课更高圆柱要求同粗同轴、圆端面完整贴合；随意侧碰不满足条件，不能只见两根就说合成标准圆柱。',
      [
        { id: 'aligned', label: '不一定，要核对同粗同轴及端面贴合' },
        { id: 'any', label: '一定，两根接触就够' },
      ],
    ),
    choice(
      'size',
      '一轮分类可以按有曲面，另一轮按有平面；能只按画图大小认球或圆柱吗？',
      'shape',
      '大小不是本课形体判据，四种理想模型依据表面和整体特点；纸上图仅示意，不冒真实物件稳定性。',
      [
        { id: 'shape', label: '不能，要看形体特点与本轮规则' },
        { id: 'size', label: '能，画大的一定球' },
      ],
    ),
    choice(
      'actual',
      '网页选出正确拼法，是否就代表三种实际两块拼搭都做完？',
      'separate',
      '三个实际同形拼搭各自看真实作品或待做，网页图不证明已动手、能搭稳或说明清楚。',
      [
        { id: 'separate', label: '不是，正方体/长方体/圆柱三项分别实际记录' },
        { id: 'auto', label: '是，网页正确代替全部实际拼搭' },
      ],
    ),
  ];
}
const manual = (key: string, prompt: string): Question => ({
  id: `${id}-${key}`,
  knowledge: `${id}-${key}`,
  prompt,
  rule: { kind: 'manual' },
  hint: '本项实际完成后确认，替代模型与帮助如实记，没做暂跳，未来计划另列。',
  explanation: '实际拼搭和解释人工，不自动确认或评星。',
});
export const sujiaoUpperFinalPairsLesson: Lesson = {
  id,
  title: '期末形体：两种分类与同形双块拼搭',
  textbookTitle: '期末复习·图形的认识',
  page: 89,
  version: 1,
  status: 'available',
  goal: '四种形体按两种明确规则完整分类；两相同正方体、长方体、圆柱各真实拼搭，原块数/作品/整体形状分清。',
  prerequisite:
    '认识四种形体；备四模型及各两相同正方体、长方体、圆柱，桌面安全摆放，可用真实可拼的纸模型并注明替代。',
  parentTip: `ISBN ${source.isbn}同版89页已实际查看。原创有曲面/无曲面及有平面/无平面两规则独立完整整理，圆柱双属性不冲突。同形双块实际正方体/长方体/圆柱分别做，原块数与整体分清；圆柱同粗同轴端面完整贴合，长方体比例/接法不预断成正方体。12客观/5实际/1反思，固定两正方体及等高圆柱新候选复习，几何稳定须实际验证，不自动评星、计划另列、旧ID快照保持，教师最终审校未核验。`,
  steps: [
    {
      title: '四体两规则，每轮完整整理',
      text: '先说四模型名称：长方体、正方体、圆柱、球。按有曲面/没有曲面分两类：圆柱球一组，长方体正方体另一组。全部恢复后按有平面/没有平面重分：长方体正方体圆柱一组，球另组。每轮每模型恰好一次，不因为圆柱换组就说它变形。这里是理想形体，不拿生活物细小凹凸否定分类。',
      visual: {
        kind: 'solid-row',
        shapes: ['cuboid', 'cube', 'cylinder', 'sphere'],
      },
      activity:
        '实际四模型各说名称，按两规则分别完整分两组，恢复再重分；纸记规则/每组/圆柱为何换组。',
    },
    {
      title: '两个相同正方体，接面与原块',
      text: '两相同正方体整面贴合，可以并排，也可以上下。每种整体是一个长方体，但材料仍两个正方体。不要只用一块或多加一块，不把画面三个可见面算三块。图示固定两单位块，真实桌面是否放稳另验证，不要求面积体积公式。',
      visual: { kind: 'solid-recompose', scene: 'pair-cubes', variant: 'main' },
      activity:
        '实际两相同正方体分别并排及上下整面贴合，拆开重摆核对，每种说单块名称/原2块/整体长方体；记录真实稳定与帮助。',
    },
    {
      title: '两个相同长方体，先看比例与接法',
      text: '两相同长方体可选不同整面贴合接法，观察变长、变宽或变高。原块仍两块，是否拼成正方体要看实际比例及接法，不能保证任何两块都行。允许拼后仍长方体或其它合理作品，说清实际观察，不把图示名称当实物验证。',
      visual: { kind: 'solid-row', shapes: ['cuboid', 'cuboid'] },
      activity:
        '实际两相同长方体试至少两种整面贴合，拆开复原，观察单块/整体及各方向；保留两真实作品/说明，不必强求一定拼正方体。',
    },
    {
      title: '两个相同圆柱，对齐端面拼高',
      text: '同粗等高圆柱的圆端面上下完整贴合、方向对齐，整体是更高圆柱，材料仍两根。并列两根与上下接成一个作品不同；斜放或侧碰不能保证标准圆柱。复习两根各变高，重新找等两段总高度，不沿旧候选字母抄；高度份数不当原根数。',
      visual: {
        kind: 'solid-recompose',
        scene: 'pair-cylinders',
        variant: 'main',
      },
      activity:
        '实际两相同圆柱先并列、再同粗同轴端面上下贴合，观察原两根/整体，拆开重摆；安全桌面/帮扶如实记，不能拿图示证明搭稳。',
    },
    {
      title: '三种作品分别说明',
      text: '展示两种分类及三种同形双块拼搭，每项单独保存记录。单块名称、原材料件数、整体形体、怎么接面分别说。用了纸模型如实注明，不是静态图片；未做写待做，未来准备另列。网页选择题不代替真实操作，反思不自动评星。',
      activity:
        '实际展示分类/正方体/长方体/圆柱作品，分别用自己的话解释接法与数量，记录帮助/失败/改正。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'actual-two-sorts',
      '实际四形体说名后，按有曲面/无曲面完整分类，再恢复按有平面/无平面完整分类，各轮每模型一次；纸写两规则及各组，说明圆柱两轮不同位置而形体不变。',
    ),
    manual(
      'actual-cubes',
      '实际两相同正方体并排及上下整面贴合各一次，拆开核对原2块、单块正方体与整体长方体，保留两作品与真实稳定/帮助。静态图不当实做。',
    ),
    manual(
      'actual-cuboids',
      '实际两相同长方体试至少两种不同整面贴合，每次拆开复原，看比例与整体形状，保留实际作品/原2块/接面说明。不能强求任何两块必成正方体，替代模型如实记。',
    ),
    manual(
      'actual-cylinders',
      '实际两同粗等高圆柱先并列再同轴圆端面上下完整贴合，拆开再拼，观察单根/原2根/更高整体，记录真实稳定、帮扶和材料替代。侧碰不假称标准圆柱。',
    ),
    manual(
      'actual-explain',
      '实际展示两规则及三种独立双块作品，各说单块/原材料/整体/接法，解释为何改分类规则不变形、长方体不保证拼正方体、圆柱接法须对齐；保留原话与帮助，未来计划另列。',
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实分类或双块拼搭的一例、接法/数量核对与帮助困难，未做如实说，未来计划另列。',
      rule: { kind: 'reflection' },
      hint: '真实与未来计划分开。',
      explanation: '反思correct null不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '双规则分类与三种同形双块真实操作核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷89页已实际查看。原创两规则分类及固定双块候选，实际三形分别人工，不教面积体积或从静态图证明稳定；教师最终审校未核验。',
  },
};
