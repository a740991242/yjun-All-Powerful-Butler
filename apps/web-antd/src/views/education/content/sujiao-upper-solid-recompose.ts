import type { SolidRecomposeVisual } from '../learning/solid-recompose';
import type { Lesson, Question } from '../learning/types';

import { fold } from '../learning/fold';
import { required } from '../learning/required';
import {
  solidPieceLayers,
  solidPieceUnits,
  solidRecomposeData,
} from '../learning/solid-recompose';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-solid-recompose';
const model = (
  scene: SolidRecomposeVisual['scene'],
  review: boolean,
): SolidRecomposeVisual => ({
  kind: 'solid-recompose',
  scene,
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
  const task = (
    key: string,
    prompt: string,
    scene: SolidRecomposeVisual['scene'],
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual: model(scene, review),
    rule,
    hint: '先追踪所有完整部件，再检查同粗/贴合或每层方块位置，不能只凭露出的面或名称。',
    explanation,
  });
  const select = (q: Question): Question => ({
    ...q,
    choices: ['A', 'B', 'C'].map((k) => ({ id: k, label: `方案${k}` })),
  });
  const cubes = solidRecomposeData(model('cube-join', review));
  return [
    task(
      'cube-units',
      '原有组件P里一共包含多少个同样大的单位小方块？P编号是组件名，不是方块总数。',
      'cube-join',
      {
        kind: 'number',
        value: fold(
          cubes.input,
          0,
          (sum, piece) => sum + solidPieceUnits(piece),
        ),
      },
      review
        ? '两组件包含2和3小块，共5小块，完整移动。'
        : '三个组件包含1、1、2小块，共4小块，两个连成一组的小块不拆开。',
    ),
    select(
      task(
        'cube-join',
        '使用全部原有组件，每个一次，保持双块或三块组件内部形状，可整组转向。哪些方案能完整合拼？选出全部，不留块、不加块、不重叠。',
        'cube-join',
        { kind: 'set', values: ['A', 'B'] },
        review
          ? 'A横排五块、B竖排五块都可由双块与三块两组贴合；C只有四块不能用全。'
          : 'A两列各两块，可用双块组占一列，两个单块叠另一列；B竖排四块也可。C三块少一块。',
      ),
    ),
    select(
      task(
        'cylinder-join',
        'P1与P2是同粗、端面平整的完整圆柱。保持直立、同轴、端面贴合，不切割，全部上下接合。哪一方案与接好后的外形和总高度对应？',
        'cylinder-join',
        { kind: 'choice', value: review ? 'C' : 'B' },
        `短圆柱高度作为一份，另一圆柱${review ? 3 : 2}份，接合${review ? 4 : 3}份。只有${review ? 'C' : 'B'}同粗并且总高度正确；不说接成一个新实物，也不把高度份数当原圆柱个数。`,
      ),
    ),
    select(
      task(
        'cube-split',
        'M由同样大方块上下摆成。沿已有积木接缝分开，每块只用一次，不切割、不增加。哪些方案能得到？每个候选是一对部分，选全部。',
        'cube-split',
        { kind: 'set', values: review ? ['A', 'B'] : ['A'] },
        review
          ? '四块可分成2和2，也可分成3和1；2和1少一块。'
          : '三块可以分成2和1；2和2多一块，1和1少一块。',
      ),
    ),
    select(
      task(
        'cylinder-split',
        'M是同粗、同高度小圆柱叠成的塔，虚线表示已有接缝；不是一个要切开的完整圆柱。沿接缝分成两组，哪些方案保留所有小圆柱？选全部。',
        'cylinder-split',
        { kind: 'set', values: review ? ['A'] : ['A', 'B'] },
        review
          ? '原来五个，可分3和2；2和2、3和1都少一个。'
          : '原来四个，可分3和1或2和2；2和1少一个。',
      ),
    ),
    ...(['count-stair', 'count-corner', 'count-rows'] as const).map((scene) => {
      const piece = required(solidRecomposeData(model(scene, review)).input[0]);
      return task(
        scene,
        '这件作品一共有多少个同样大的小方块？从底层往上核对，前后两排都要看；每层记录与立体图是同一件作品，不另加。',
        scene,
        { kind: 'number', value: piece.cells.length },
        `按层核对${solidPieceLayers(piece)
          .map((l) => l.length)
          .join(
            '、',
          )}，合计${piece.cells.length}小块；方块的多个面不是多个方块。`,
      );
    }),
    task(
      'corner-layers',
      '按底层向上顺序，分别填转角作品每层有几块。记录中的每格一块，后排在上方、前排在观察者侧。',
      'count-corner',
      { kind: 'steps', values: review ? [3, 3, 1] : [3, 2] },
      review
        ? '底层三块、第二层三块、第三层一块，共七块。'
        : '底层三块、第二层两块，共五块。',
    ),
    task(
      'rows-front-back',
      '两排作品只有一层。按前排、后排顺序填写每排块数；后排不是上面第二层。',
      'count-rows',
      { kind: 'steps', values: review ? [4, 4] : [3, 3] },
      review
        ? '前后各四块，共八块；前后与上下不同。'
        : '前后各三块，共六块；一层中可以有两排。',
    ),
  ];
}
export const sujiaoUpperSolidRecomposeLesson: Lesson = {
  id,
  title: '完整部件合拼、沿缝拆分与多排计数',
  textbookTitle: '图形的初步认识（一）·拼分与数方块',
  page: 57,
  version: 1,
  status: 'available',
  goal: '保持完整部件合拼，沿真实接缝拆成指定两组；按层与前后排核对方块，不由可见面推总数。',
  prerequisite:
    '认识四种立体形状，能数到9；有同样大方块、同粗不同高度圆柱与同粗同高小圆柱安全模型。没有材料实际活动待做，不要求切割物品。',
  parentTip: `ISBN ${source.isbn}同版57/58页已实际查看，本站组件和候选原创。单位方块与组件数、圆柱高度份数与实物件数区分。圆柱完整合接保持同粗同轴端面贴合，拆分只沿已叠小圆柱接缝，不暗示切割完整模型。方块双块组/三块组完整移动合拼，拆分塔原为松散单位积木；每层俯看图与立体图追踪同一物，不加计。几何图不是实物稳定性的证明；先实际操作记录帮助/不足，计划另记，最终教师审校未核验。`,
  steps: [
    {
      title: '完整组件合拼，用全而不拆组',
      text: '主课P1和P2各一小方块，P3是两块预拼直组，完整移动可转向不拆组。共四个单位块但三个组件；A两列各两块，双块组放一列、两个单块叠另一列；B竖排四块也可，C三块少一块。新课两个组件分别双块与三块，共五块，横排/竖排五块都可。形状名一样不保证用全。',
      visual: model('cube-join', false),
      activity:
        '实际准备四同大方块，两个先成直组保持；拼A/B并记录原组件去向，C尝试后核对未用一块。再准备双块和三块组件拼横/竖五块。',
    },
    {
      title: '同粗圆柱贴合，高度与件数分清',
      text: 'P1短圆柱高度作为一份，P2同粗且高两份，是另一个完整圆柱。直立同轴上下端面贴合，合接外形高三份，实物仍两个。不切圆柱、不按颜色推高度；新课长圆柱改三份，接后四份。图没有证明实物一定稳，真实不稳须记录。',
      visual: model('cylinder-join', false),
      activity:
        '实际找同粗、端面平且短与两倍高圆柱安全模型，上下贴合比较高度和稳定；再短与三倍高另试。无材料待做，纸面只作记录不当实物已完成。',
    },
    {
      title: '沿已有缝拆分，不能增减材料',
      text: '主方块塔由三同大独立方块叠成，沿已有接缝分2和1；两块加两块多一块，两个单块少一块。四块新塔可分2和2或3和1。下面圆柱塔由四个同粗同高短圆柱叠成，虚线为现有缝，可分3和1、2和2；不是切割一个圆柱。五个新塔需分3和2，原4个的拆法不沿用。',
      visual: model('cylinder-split', false),
      activity:
        '实际分别完成三/四方块塔全部合法两组，再做四/五短圆柱塔的指定两组，每次先恢复原塔再拆，追踪全材料；不对整物切割。',
    },
    {
      title: '后排不漏，按层记录同一件作品',
      text: '转角作品底层前排两块、后排一块；第二层前排两块，总计五。立体画法可能遮住部分，按层记录给出每块实际位置。层记录是同一件作品，不能再加一遍。另两排作品只有一层、前后各三块，共六；后排在图上较高不表示堆成第二层。',
      visual: model('count-corner', false),
      activity:
        '实际分别拼阶梯、转角及前后三块两排；从侧/后与上面查看，画每层或每排记录再数。同一单位不重计，反向观看只改看法不改材料。',
    },
    {
      title: '同一层可以有前后两排',
      text: '这里前排三块、后排三块，没有堆上层。俯看记录后排在上方、前排在下方，旁边明确观察者侧，不能把纸上高低当实物层高。复习改成前后各四块。今天实际拼分/看图的帮助与困难如实写，尚未做可待做。',
      visual: model('count-rows', false),
      activity:
        '实际数两排并移到后面看，再恢复作品核对按层记录；向家人解释实物与多个视图同一件、不把多个面当多块，计划另记。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-cube-join',
        '实际用四同大方块保留双块预拼组，试A/B和不能用全的C；再用双块/三块组件拼五块横排与竖排，记录每组件去向及帮助。不拆原组、不增减。',
      ],
      [
        'actual-cylinder-join',
        '实际用同粗、同轴端面平整的完整圆柱，短配两倍高、短配三倍高分别合接，记录件数、高度比较与稳定。不切割、不用不同粗模型冒成功；没材料待做。',
      ],
      [
        'actual-splits',
        '实际三/四单位方块塔分别拆2+1、2+2和3+1；四/五同粗同高小圆柱塔分别拆3+1、2+2、3+2。每次恢复原塔再试、材料全保留、沿已有接缝，不切整物。记录实际及困难。',
      ],
      [
        'actual-layers',
        '实际拼阶梯、转角与前后两排三件作品，从前后上面核对并记录每层/每排和全数；再换新摆法。实物与多视图同一件、每块只计一次，向家人真实解释；未做不能由网页答对确认。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '完成对应全部实际操作才确认，无材料暂跳，未来计划分开。',
      explanation: '只记录实际活动，网页正确不代替实际拼分。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实拼分或按层数块的一例、材料怎样保留、遇到的帮助/困难。尚未做如实写，未来计划另记。',
      rule: { kind: 'reflection' },
      hint: '真实过程不要求都已经会。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整拼分与前后层记录核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷57/58页实际读到。组件与候选原创，复习改变材料数/高度/层与前后排，不能沿用原答案。真实操作独立记录、最终教师审校未核验。',
  },
};
