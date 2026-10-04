import type { Lesson, Question, TileGridVisual } from '../learning/types';

import { required } from '../learning/required';
import { tileCounts } from '../learning/tile-grid';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-tiling';
const main: TileGridVisual = {
  kind: 'tile-grid',
  cells: [
    [true, true, false, false],
    [true, true, true, false],
    [true, true, true, true],
  ],
};
const later: TileGridVisual = {
  kind: 'tile-grid',
  cells: [
    [true, false, false],
    [true, true, false],
    [true, true, false],
    [true, true, true],
  ],
};

function tasks(review: boolean): Question[] {
  const visual = review ? later : main;
  const { filled, empty } = tileCounts(visual);
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const newly = review ? 2 : 1;
  const updated = structuredClone(visual);
  let remaining = newly;
  for (const row of updated.cells)
    for (let c = 0; c < row.length; c++) {
      if (!row[c] && remaining > 0) {
        row[c] = true;
        remaining--;
      }
    }
  return [
    {
      id: `${prefix}-covered`,
      knowledge: `${id}-covered`,
      prompt: review
        ? '这张新的四行铺图，带实心圆的格子已经铺好。一共铺了几块？'
        : '这张三行铺图，带实心圆的格子已经铺好。一共铺了几块？',
      visual,
      rule: { kind: 'number', value: filled },
      hint: '一格是一块，只数有实心圆的格子，可以逐行数。',
      explanation: `各行已经铺的块数是${visual.cells.map((row) => row.filter(Boolean).length).join('、')}，合起来${filled}块。`,
    },
    {
      id: `${prefix}-empty`,
      knowledge: `${id}-empty`,
      prompt: review
        ? '同一张四行铺图，每个虚线空格还需要1块。一共还要铺几块？'
        : '同一张三行铺图，每个虚线空格还需要1块。一共还要铺几块？',
      visual,
      rule: { kind: 'number', value: empty },
      hint: '只数没有实心圆的空格，不再数已经铺好的格子。',
      explanation: `空格${empty}个，每格一块，还需要${empty}块。`,
    },
    {
      id: `${prefix}-rows`,
      knowledge: `${id}-row-counts`,
      prompt: review
        ? '从上到下，依次填四行中已经铺好的块数。'
        : '从上到下，依次填三行中已经铺好的块数。',
      visual,
      rule: {
        kind: 'steps',
        values: visual.cells.map((row) => row.filter(Boolean).length),
      },
      hint: '每次只数当前一行，不把前一行已数过的再算进来。',
      explanation: `依次是${visual.cells.map((row) => row.filter(Boolean).length).join('、')}。`,
    },
    {
      id: `${prefix}-row-number`,
      knowledge: `${id}-rows-versus-tiles`,
      prompt: review
        ? '新的铺图一共有几行？这次问行数，不问块数。'
        : '原来的铺图一共有几行？这次问行数，不问块数。',
      visual,
      rule: { kind: 'number', value: visual.cells.length },
      hint: '从上往下数横行，一横行只算1行，即使里面有多块。',
      explanation: `共${visual.cells.length}行；行数不等于${filled}块已铺物品。`,
    },
    {
      id: `${prefix}-add-one`,
      knowledge: `${id}-add-one`,
      prompt: review
        ? '从刚才已铺的8块开始，再在一个空格铺1块，现在已经铺几块？'
        : '从刚才已铺的9块开始，再在一个空格铺1块，现在已经铺几块？',
      rule: { kind: 'number', value: filled + 1 },
      hint: '只增加1块，其余不动；这题问已经铺的数量，不问还缺的。',
      explanation: `${filled} + 1 = ${filled + 1}块。`,
    },
    {
      id: `${prefix}-changed`,
      knowledge: `${id}-remaining-change`,
      prompt: `重新从本课${review ? '四行' : '三行'}原图开始，在空格中新铺${newly}块。图已更新，还缺几块？`,
      visual: updated,
      rule: { kind: 'number', value: empty - newly },
      hint: '可以数新图的虚线空格，也可用原来空格数减去新铺块数；已铺块数增加，空格数减少。',
      explanation: `原来缺${empty}块，新铺${newly}块，${empty} - ${newly} = ${empty - newly}块。`,
    },
    {
      id: `${prefix}-method`,
      knowledge: `${id}-method`,
      prompt: review
        ? '四行图里，怎样找还缺的数量？'
        : '三行图里，怎样找还缺的数量？',
      choices: [
        { id: 'empty', label: '逐个数空格，每空格需要一块' },
        { id: 'lines', label: '数所有边线，每条边线当一块' },
        { id: 'rows', label: '只数行数，不看空格' },
      ],
      rule: { kind: 'choice', value: 'empty' },
      hint: '物品要填进空格，边线用来分隔，不能当作物品。',
      explanation: '逐格计数，对应空格与物品，不需要面积公式。',
    },
  ];
}

export const sujiaoTilingLesson: Lesson = {
  id,
  textbookTitle: '练习七：铺图',
  title: '铺图观察：已铺几块，还缺几块',
  page: 74,
  status: 'available',
  version: 2,
  goal: '逐格数出已铺和未铺数量，按行有序点数，理解新铺一块时已铺增加、空格减少。',
  prerequisite:
    '认识0～10，会10以内加减法；准备同样大小的纸片或安全积木和方格纸。',
  parentTip:
    '图中的实心圆表示已铺，不是另一个物品；未铺空格用虚线和文字区别，避免只凭颜色。不要求乘除法、面积公式或整图总数超出10的计算。',
  steps: [
    {
      title: '一格放一块，不重叠不留缝',
      text: '方格一样大，每格只放一块同样大的纸片。已经放好和还没放好是两种状态。图里有实心圆表示放好，空格表示还缺，不把边线和实心圆额外算成物品。',
      visual: main,
      activity:
        '画三行四列方格，剪同样大小的纸片，由家长协助剪纸。先摆出图中的状态，一格对应一块。',
    },
    {
      title: '逐行数，避免漏数和重复',
      text: '从最上面一行开始，依次点数已经铺好的块；一行数完再移到下一行。另用同样办法数空格，不能把两次回答混在一起。行数是横行的数量，不是纸片块数。',
      visual: main,
      activity:
        '一边指一边报每行的已铺数，再另数每行的空格数。家长只帮读问题，不替孩子数。',
    },
    {
      title: '再铺以后，要看更新的图',
      text: '每填一个空格，已经铺好的数量增加1，空格减少1；从原图取走一块已铺纸片时，已经铺好的数量减少1，空格增加1。问现在还缺多少，可以重新数空格，也可以从原来缺的数量减去新铺数量。每次任务都按题目指定的起始图重新开始。',
      activity:
        '先重新摆出原图，再铺1块，数剩下空格；取回新铺纸片，再取走原来的一块，比较两种变化。',
    },
    {
      title: '说出所数的对象',
      text: '解释答案时说清是已铺块数、空格数还是行数。可以先画图再摆物，用不同办法检查。只是在数同样的格子，不把块数称为平方厘米，也不用行数乘列数替代观察。',
      activity:
        '自己设计一个已铺和空格都不超过10的小方格图，请家长问三个不同问题，分别说明数的对象。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'place',
        '实际用同样大小纸片摆出讲解图，一格一块，分别数已铺和空格，请家长查看。',
        '摆放、指认与计数人工确认，页面答对不代替实际铺图。',
      ],
      [
        'change',
        '从原图开始实际铺1块，说明已铺增加1、空格减少1；再重新摆回原图取走1块已铺纸片，说明已铺减少1、空格增加1。两次分别从原图开始。',
        '每次重置起始图，实际操作和口述由家长查看。',
      ],
      [
        'design',
        '自己画一张已铺与空格都不超过10的图，提出已铺、空格和行数三个问题并检查答案。',
        '图示、三个问题和计数依据人工确认，不把自己画图算作自动掌握。',
      ],
    ].map(([key, prompt, explanation]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '按讲解实际完成，请家长查看过程。',
      explanation: required(explanation),
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版原书正文核验与原创教学检查',
    notes: `已核对ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第74页（${source.preview}）的铺图活动。方格排布、题目和操作均原创，不复制原图。只开放本课范围，三数连线由独立课包承接，本课完成不代表全册掌握，保留人教版独立记录。`,
  },
};
