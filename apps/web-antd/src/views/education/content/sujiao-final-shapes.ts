import type { Lesson, Question, SolidRowVisual } from '../learning/types';

import { solidCounts } from '../learning/solid-row';
import { sujiaoBuildSteps, sujiaoBuildTasks } from './sujiao-solid-build';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-final-shapes';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const row: SolidRowVisual = {
    kind: 'solid-row',
    shapes: review
      ? [
          'sphere',
          'cuboid',
          'cube',
          'cylinder',
          'sphere',
          'cube',
          'cube',
          'cuboid',
        ]
      : [
          'cube',
          'sphere',
          'cuboid',
          'cylinder',
          'cube',
          'cylinder',
          'cuboid',
          'cube',
        ],
  };
  const names = {
    cube: '正方体',
    cuboid: '长方体',
    cylinder: '圆柱',
    sphere: '球',
  };
  const counts = solidCounts(row);
  return [
    ...sujiaoBuildTasks(review),
    ...(['cube', 'cuboid', 'cylinder', 'sphere'] as const).map(
      (shape): Question => ({
        id: `${prefix}-count-${shape}`,
        knowledge: `${id}-count-${shape}`,
        prompt: `从左到右看完整的模型，${names[shape]}有几个？只数物体，不数露出的面。`,
        visual: row,
        rule: { kind: 'number', value: counts[shape] },
        hint: `按${names[shape]}的整体形状分类，同一物体只算一次。`,
        explanation: `${names[shape]}共${counts[shape]}个；露出的面不是另外一个模型。`,
      }),
    ),
    {
      id: `${prefix}-total`,
      knowledge: `${id}-total`,
      prompt: '这排四类模型合起来有几个？',
      visual: row,
      rule: { kind: 'number', value: row.shapes.length },
      hint: '每个物体只数一次，把四类数量合起来。',
      explanation: '共8个模型；四类不表示只有4个物体。',
    },
    {
      id: `${prefix}-object`,
      knowledge: `${id}-object`,
      prompt: review
        ? '一个整体近似圆柱的直筒罐，应与哪类模型对应？'
        : '一个整体近似球形的玩具球，应与哪类模型对应？',
      choices: Object.entries(names).map(([id, label]) => ({ id, label })),
      rule: { kind: 'choice', value: review ? 'cylinder' : 'sphere' },
      hint: '看整个物体的形状，不只看底面或图上的外轮廓。',
      explanation: review
        ? '整体近似圆柱；圆形底面不等于整个物体是球。'
        : '整体近似球；这是立体模型，不是平面圆。',
    },
    {
      id: `${prefix}-six`,
      knowledge: `${id}-six`,
      prompt: '只有一块深，没有后排。这些小正方体一共有几块？',
      visual: { kind: 'cube-columns', heights: review ? [3, 3] : [2, 2, 2] },
      rule: { kind: 'number', value: 6 },
      hint: '从下到上逐列数，再合起来。',
      explanation: review ? '3+3=6块。' : '2+2+2=6块。',
    },
    {
      id: `${prefix}-height`,
      knowledge: `${id}-height`,
      prompt: '同样的图，最高列堆了几块？不问总块数。',
      visual: { kind: 'cube-columns', heights: review ? [3, 3] : [2, 2, 2] },
      rule: { kind: 'number', value: review ? 3 : 2 },
      hint: '只数一列的上下堆叠高度。',
      explanation: review ? '每列高3块，总共6块。' : '每列高2块，总共6块。',
    },
    {
      id: `${prefix}-whole`,
      knowledge: `${id}-whole`,
      prompt: '这些相同小正方体拼成的整体只有一块深，整体是什么形状？',
      visual: { kind: 'cube-columns', heights: review ? [3, 3] : [2, 2, 2] },
      choices: [
        { id: 'cuboid', label: '长方体' },
        { id: 'cube', label: '正方体' },
        { id: 'sphere', label: '球' },
      ],
      rule: { kind: 'choice', value: 'cuboid' },
      hint: '比较整体三个方向，不把每个小块的形状当成整体形状。',
      explanation: review
        ? '整体宽2块、高3块、深1块，是长方体。'
        : '整体宽3块、高2块、深1块，是长方体。',
    },
    {
      id: `${prefix}-front`,
      knowledge: `${id}-front`,
      prompt: review
        ? '小宁面向柜子，柜子在前，窗户在后。原地转半圈后，什么在前？'
        : '小宁面向门，门在前，书架在后。原地转半圈后，什么在前？',
      choices: review
        ? [
            { id: 'after', label: '窗户' },
            { id: 'before', label: '柜子' },
          ]
        : [
            { id: 'after', label: '书架' },
            { id: 'before', label: '门' },
          ],
      rule: { kind: 'choice', value: 'after' },
      hint: '参照小宁的身体朝向，物品没动，小宁转身了。',
      explanation: '转半圈后，原来身体后面的物品变成身体前面的物品。',
    },
    {
      id: `${prefix}-left`,
      knowledge: `${id}-left`,
      prompt: review
        ? '小宁原来身体左边是书架、右边是门。原地转半圈后，身体左边是什么？'
        : '小宁原来身体左边是窗户、右边是柜子。原地转半圈后，身体左边是什么？',
      choices: review
        ? [
            { id: 'after', label: '门' },
            { id: 'before', label: '书架' },
          ]
        : [
            { id: 'after', label: '柜子' },
            { id: 'before', label: '窗户' },
          ],
      rule: { kind: 'choice', value: 'after' },
      hint: '说的是小宁身体的左右，不是屏幕的左右；转半圈后再看。',
      explanation: '物品位置不变，朝向改变，原来右边的物品现在在身体左边。',
    },
    {
      id: `${prefix}-preserve`,
      knowledge: `${id}-preserve`,
      prompt: review
        ? '把6块积木换一种摆法，没有增加或拿走，还剩几块？'
        : '把6块积木从矮摆法重新搭高，没有增加或拿走，现在共有几块？',
      rule: { kind: 'number', value: 6 },
      hint: '改变摆法不改变物体数量。',
      explanation: '仍然6块；高低变化不等于总块数变化。',
    },
  ];
}
const sourceManual: [string, string][] = [
  [
    'object-links',
    '实际回同版教材第92页第12项，逐个观察全部生活物品的整体近似形状，对应四类模型并连完整，不只挑一个球或罐子。说明看的是整个物体而非底面，模糊处记录待核对，保留全部连线与解释；没原书或未连暂跳。',
  ],
  [
    'four-counts',
    '实际回同版教材第92页第13项原组合作品，按长方体、正方体、圆柱、球分别指完整部件，填写全部四个数量并用合计核对。露出的面和装饰不另增物，作品整体不另加1；原图与本站九件分解图分别记录，不直接抄本站数量，没读写暂跳。',
  ],
];
const manual: [string, string][] = [
  [
    'composite',
    '用安全立体模型实际拼一件作品，指每个完整部件说明类型，逐类数再合起来核对。不重复数面，不把作品整体另加1；自由作品由家长实际查看。',
  ],
  [
    'sort',
    '找安全的盒子、罐子和球形物品，按整体形状分类并对应四类模型。说出近似之处，不把现实物品当作完全精确的数学模型。',
  ],
  [
    'tall',
    '拿2块相同长方体积木，在平稳桌面尝试不同朝向与叠法，比一比搭得多高。不要强行规定只有一种摆法；避免高处或不稳堆叠。',
  ],
  [
    'six',
    '实际用6块同样大小正方体自由拼搭，说清每块与整体形状、总数与高度，画出或向家长展示自己的作品。',
  ],
  [
    'body',
    '在安全位置站好，指出身体前后左右的物品，原地转半圈再指出，家长实际检查朝向与描述。图示或选择题答对不替代身体活动。',
  ],
];
export const sujiaoFinalShapesLesson: Lesson = {
  id,
  textbookTitle: '期末复习：立体图形、拼搭与位置',
  title: '期末复习：立体分类、六块拼搭与转身方向',
  page: 92,
  status: 'available',
  version: 3,
  goal: '按整体立体形状分类计数，区分单块与整体、总数与高度，实际拼搭并以身体朝向描述位置。',
  prerequisite:
    '认识四类立体与前后左右，准备安全物品、2块相同长方体和6块相同正方体积木。',
  parentTip:
    '模型图一块深且无隐藏后排。现实物品只近似模型；自由拼搭与搭高允许多种合理作品。身体方向明确参照人物，不用屏幕左右替代。实际操作独立人工确认。',
  steps: [
    ...sujiaoBuildSteps,
    {
      title: '按整体形状找同类',
      text: '把物体对应到长方体、正方体、圆柱和球。罐子底面近似圆，整体却可能近似圆柱；盒子表面是长方形，整个盒子是立体。真实物品有细节，只说整体近似。',
      activity: '用安全生活物品对应四类模型，说清看的是整个物体。',
    },
    {
      title: '分类再数，不数露出的面',
      text: '一件物体只数一次。先按形状逐类数，再合起来核对全部数量；四类模型不等于四件物体，一个模型的几个面也不是几个模型。',
      visual: {
        kind: 'solid-row',
        shapes: [
          'cube',
          'sphere',
          'cuboid',
          'cylinder',
          'cube',
          'cylinder',
          'cuboid',
          'cube',
        ],
      },
      activity: '指着每个模型分类并数数，再实际摆物核对。',
    },
    {
      title: '六块拼搭：单块、整体、总数和高度',
      text: '三列各2块、只有一块深，合计6块且高2块，整体是长方体，每一小块仍是正方体。换成两列各3块，总数仍是6，高度变了。用2块相同长方体实际试搭高，朝向与摆法都可能影响结果。',
      visual: { kind: 'cube-columns', heights: [2, 2, 2] },
      activity:
        '实际重排6块积木，比较总数与高度；另用2块长方体试不同稳定叠法。',
    },
    {
      title: '身体转身，方向要重新看',
      text: '前后左右以孩子身体朝向为参照。面向门时门在前，背后书架在后；转半圈后书架在前、门在后，原来左右的物品也换到身体另一边。物品没有移动，参照朝向改变了。',
      activity: '安全站好并原地转半圈，实际指出前后左右，向家长说明参照谁。',
    },
    {
      title: '原书全部连线与四类完整填数',
      text: '第92页第12项需全部物品对应模型，第13项需四类部件所有空分别填写。原物品只说整体近似，原组合作品按完整部件逐个数；露出多个面不增加部件，作品整体也不另加1。本站原创排图和九件分解图另有自己的数量，不能用它们的答案代替原图。搭高、六块拼搭及身体方向继续按已有实际任务核对。',
      activity:
        '实际回原书逐项观察、读写、摆画并核对，保留作品和原话；没有原书或未做可暂跳，未来计划另记，不由网页答对自动确认。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际观察、拼搭或转身并说明后，由家长确认。',
      explanation: '允许有依据的不同作品；实际活动不由图示答案自动确认。',
    })),
    ...sourceManual.map(([key, prompt]): Question => ({
      id: `${id}-manual-source-${key}`,
      knowledge: `${id}-actual-source-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '先实际处理原图的完整任务，再独立确认；帮助、未知与未完成部分如实记录。',
      explanation:
        '原图实际活动独立人工记录，correct为null；本站示例或计划不能替代已经读写和摆画。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-04',
    reviewer: '同版正文核验与原创教学检查',
    notes: `依据实际查看ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷第89、92页（${source.preview}）分类、实物对应、立体计数、搭高、六块拼搭及身体位置。排列、计数、人物和情境原创，不复制教材图片；2026-10-04重看第92页，新增原页全部连线和四类完整填数两个实际任务；旧v2的24主任务、19复习和前6步骤保持，新版26主任务，旧快照不改；其余课目与全册逐项核对另验。`,
  },
};
