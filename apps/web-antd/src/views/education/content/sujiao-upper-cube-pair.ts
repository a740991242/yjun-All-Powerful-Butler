import type { CubePairVisual } from '../learning/cube-pair';
import type { Lesson, Question } from '../learning/types';

import { cubePairData, cubePairOptions } from '../learning/cube-pair';
import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-cube-pair';
const visual = (
  review: boolean,
  display: CubePairVisual['display'] = 'candidates',
): CubePairVisual => ({
  kind: 'cube-pair',
  variant: review ? 'review' : 'main',
  display,
});
function tasks(review: boolean): Question[] {
  const variant = review ? 'review' : 'main';
  const data = cubePairData(variant);
  const options = cubePairOptions(variant);
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    {
      ...base(
        'all-candidates',
        '按A、B、C、D、E、F顺序，填六堆各有几块。数整个方块，不把露出的面另算。',
      ),
      visual: visual(review),
      rule: { kind: 'steps', values: data.groups.map((g) => g.cells.length) },
      hint: '每个正面小格一块，整堆完整计数；只一层深，无后排。',
      explanation: `六堆分别${data.groups.map((g) => g.cells.length).join('、')}块。`,
    },
    {
      ...base(
        'target-count',
        `看${review ? '新' : '主课'}目标，全部一层深，共几块？`,
      ),
      visual: visual(review),
      rule: { kind: 'number', value: data.target.length },
      hint: '每个正面格一块，别把目标整体再算一块。',
      explanation: '目标6块，不表示任意合6块的两堆都能拼成。',
    },
    {
      ...base(
        'all-valid-pairs',
        `看${review ? '新的阶梯' : '主课长方体'}目标，从十五组两堆配对中选全可以拼成的配对。必须全用两堆，保持每堆内部相对位置，可整堆转向/移动；没有重叠也没有空缺。`,
      ),
      visual: visual(review),
      choices: options.map((o) => ({
        id: o.id,
        label: `${o.first}堆＋${o.second}堆`,
      })),
      rule: {
        kind: 'set',
        values: options.filter((o) => o.valid).map((o) => o.id),
      },
      hint: '先数能否合6，再实际对照轮廓；块数合适只是必要条件，形状也须合适。',
      explanation: `本目标合法配对是${options
        .filter((o) => o.valid)
        .map((o) => `${o.first}＋${o.second}`)
        .join('、')}。其他配对可能块数不符，或不能保持原堆形状拼满。`,
    },
    {
      ...base(
        'cd-shape',
        `C堆4块、D堆2块，合起来是6块。保持两堆原形状，能拼成${review ? '本次阶梯目标' : '本次长方体目标'}吗？先检查实际轮廓。`,
      ),
      visual: visual(review),
      choices: [
        { id: 'yes', label: '能，整堆转向/移动后无重叠填满目标' },
        { id: 'no', label: '不能，虽然块数相同，形状仍拼不成' },
      ],
      rule: { kind: 'choice', value: review ? 'no' : 'yes' },
      hint: '主课的方形四块可与两块一排接上；新阶梯目标须重新核对，不能套原答。',
      explanation: review
        ? 'C为2×2四块，阶梯仅能容纳的一处2×2留下两个不相邻位置，D两块连在一起无法填它们；不是因为6块算错。'
        : '主课把C的2×2放目标一侧，再用D两块转成一列补另一侧，正好六块。',
    },
    {
      ...base(
        'count-not-enough',
        '只证明两堆的块数合起来等于目标，就已经证明保持两堆形状能拼好了吗？',
      ),
      choices: [
        { id: 'no', label: '没有，还要检查形状、转向、接合、重叠和空缺' },
        { id: 'yes', label: '已经证明，只看块数即可' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '同样块数可有不同整体形状。',
      explanation: '数量符合还要有合法位置；不能拆开重做后称原堆可拼。',
    },
    {
      ...base(
        'whole-group',
        '题目要求两堆内部形状保持。为了凑目标，能拆掉一堆的一块改到别处，再说这两堆原样就能拼吗？',
      ),
      choices: [
        { id: 'no', label: '不能，这改变了题目条件；另试活动应单独记录' },
        { id: 'yes', label: '能，反正总块数一样' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '整堆转向不同于拆堆重新造形。',
      explanation:
        '本题使用完整两堆，允许整体转向和移动，不能更改每堆内部相对位置。',
    },
    {
      ...base(
        'ae-count',
        'A和E都是3块。合成完整目标后，原来的两堆和目标整体都再加进去，总数要写9吗？',
      ),
      choices: [
        { id: 'six', label: '不，仍只有6个方块' },
        { id: 'nine', label: '是，加两堆再加整体变9块' },
      ],
      rule: { kind: 'choice', value: 'six' },
      hint: '计数单位是每个方块，不是堆数或作品件数。',
      explanation: '重排和接合没有产生新方块，3＋3＝6。',
    },
  ];
}

export const sujiaoUpperCubePairLesson: Lesson = {
  id,
  title: '六堆方块：两堆完整拼成目标',
  textbookTitle: '图形的初步认识（一）·两堆拼组',
  page: 61,
  version: 1,
  status: 'available',
  goal: '从六候选堆判断全部可拼配对，保持整堆内部形状、允许整体转向，检查全用、无重叠和空缺；数量相等不代替几何可拼。',
  prerequisite:
    '认识正方体、长方体和0～9，准备同样大安全正方体及纸笔。六候选可先后摆并拆后复用，记录不假装六堆同时保留。',
  parentTip: `ISBN ${source.isbn}同版印刷61页，两堆几何拼组范围。本站六堆与目标原创，不复制原图。仅一层深，转向限在同一层中四分之一圈的整体转向；不用体积/面积公式，不给孩子坐标或角度计算。主目标六块长方体，复习六块阶梯，C＋D数量符合但新目标不可拼。实际保留两堆形状、各块身份核对，材料不足可以先后复用并真实记录，不能说同时摆好。`,
  steps: [
    {
      title: '六堆候选，先把每块认清',
      text: '每块同样大，每个正面小方格是一块。A/E各三块，B五块、C四块、D两块、F一块；仅一层深，没有后排。露出的上面与侧面不是新增方块。先后摆六候选时，拆后复用可以，但要留下每次原形记录，别说六堆同时保留。',
      visual: visual(false),
      activity:
        '实际逐一摆A～F并画/记每堆原形与块数，依次做也可；编号只标堆身份，不教学英文字母。',
    },
    {
      title: '两堆接合，不能拆散凑答案',
      text: '主目标两排各三块、一层深，整体是薄长方体。A和E两个三块拐角可以整堆转向互相补齐。保持每堆内部相对位置，只移动或整体转向，全部六块各用一次，没有叠在同位置，也没有空缺；图中两色是堆身份，大小相同。',
      visual: visual(false, 'join-ae'),
      activity:
        '实际摆A/E原堆，保持形状试转向接成主目标，分别指每堆三块与接缝，检查六块无重叠/空缺；不靠拆堆改形。',
    },
    {
      title: '找全另两种配对，再自主解释',
      text: 'B五块只缺一个角，F一块可补齐；C四块方形与D两块一排，D整堆转向成一列可接成同一目标。六候选共十五种两堆配对，要分别先数再查形。本目标可用A/E、B/F、C/D，不能因找到一种就不再检查其他合理组合。',
      visual: visual(false, 'join-bf'),
      activity:
        '实际B/F与C/D各独立拼好，复原原堆后再换配对；三配对分别核对并记录位置，说明为何其他配对块数不符。',
    },
    {
      title: '换六块阶梯，数量相同仍重新查形',
      text: '新目标底层三块、中层右边两块、顶层最右一块，仍六块。新A是一排三块，E三块拐角；它们可拼。新B五块与F一块也可拼。C四块方形若放在阶梯能容纳的位置，剩两处不相邻，而D两块相连，不能填这两处；不能拆D两块改称保持原堆。',
      visual: visual(true),
      activity:
        '实际按新目标与新A/B摆，分别试A/E、B/F，再试C/D并指明留下的空缺；如实记录不能拼，不把上次三种可拼结论沿用。',
    },
    {
      title: '实际任务与反思分别记录',
      text: '三种主配对、两种新配对和新C/D失败证据分别核对。整体转向不是把一块拆下来换地方；重排不新增方块。今天真实做了什么、得到什么帮助、未做什么如实记，下一次计划另写；网页选全答案不是实际已经搭过。',
      activity:
        '向家人指自己的拼组讲全用、形状保持、无重叠空缺的检查依据，记录帮助/尚未做；开放反思不自动打星。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-six-groups',
        '实际逐一摆六候选A～F，核对内部形状和每块数量，记录每堆原形。材料不足先后复用如实记，不声称六堆同时摆好；没有模型暂跳。',
      ],
      [
        'actual-three-main-pairs',
        '实际复原原堆，A/E、B/F、C/D三配对各独立按整堆转向/移动拼成主目标，全部块各一次无重叠空缺。每次指两堆边界和六块，再复原后试下一配对，不拆堆改形。',
      ],
      [
        'actual-new-target',
        '实际换本课六块阶梯和新A/B候选，A/E与B/F分别拼成；完整试C/D并指明四块方形放入后两处空缺不相邻而D相连。记录真实不能拼理由，不沿用主课答案。',
      ],
      [
        'actual-explanation',
        '实际向家人指自己的原堆/完整拼组讲形状保持、转向、全用、无重叠空缺；比较数量符合与形状可拼，保留困难/帮助。未来想试另写，没交流不冒已发生。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际完成并核对后确认，没条件暂跳；屏幕答案不代替拼搭。',
      explanation: '记录真实模型操作，数量相等不是自动可拼证明。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天实际验证的一组配对、如何保持原堆和检查空缺/重叠、帮助与困难。尚未做如实写，下一次计划另记。',
      rule: { kind: 'reflection' },
      hint: '用真实记录反思，不必说所有都成功。',
      explanation: '正确性null，不自动给星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '两堆全块几何拼组核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷同版61页实际已读。原创目标及候选，主三合法配对换复习两合法配对，C/D同数量新轮廓不可拼；实际独立、教师最终审校未核验。',
  },
};
