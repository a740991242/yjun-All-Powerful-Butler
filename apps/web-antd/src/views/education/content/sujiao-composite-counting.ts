import type {
  CompositeShapesVisual,
  Lesson,
  Question,
} from '../learning/types';

import { compositeGroups, compositeTotal } from '../learning/composite-shapes';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-composite-counting';
const layouts: CompositeShapesVisual['layout'][] = [
  'rectangle-strip',
  'square-grid',
  'triangle-fan',
];
const names = {
  'rectangle-strip': '长方形',
  'square-grid': '正方形',
  'triangle-fan': '三角形',
};
function model(
  layout: CompositeShapesVisual['layout'],
  review: boolean,
): CompositeShapesVisual {
  return {
    kind: 'composite-shapes',
    layout,
    divisions: (() => {
      if (layout === 'rectangle-strip') return review ? 2 : 3;
      return (() => {
        if (layout === 'square-grid') return review ? 3 : 2;
        return review ? 3 : 4;
      })();
    })(),
  };
}
function groupScope(visual: CompositeShapesVisual) {
  return (() => {
    if (visual.layout === 'square-grid')
      return `按正方形的每条边跨1～${visual.divisions}个最小格，依次填每种大小的个数`;
    return visual.layout === 'triangle-fan'
      ? `按三角形底边跨1～${visual.divisions}个最小段，依次填每种跨度的个数`
      : `按长方形横向连续包含1～${visual.divisions}块最小长方形，依次填每种跨度的个数`;
  })();
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  return [
    ...layouts.flatMap((layout): Question[] => {
      const visual = model(layout, review);
      const groups = compositeGroups(visual);
      const name = names[layout];
      return [
        {
          id: `${prefix}-${layout}-small`,
          knowledge: `${id}-${layout}-small`,
          prompt: `${review ? '复习图' : '本图'}只数最小的一块${name}，有几个？这道题暂不算合起来的大图形。`,
          visual,
          rule: { kind: 'number', value: required(groups[0]) },
          hint: '先明确只数最小一块，逐个指，不把较大轮廓混入本题。',
          explanation: `最小${name}有${groups[0]}个。它们不是包括组合图形的总数。`,
        },
        {
          id: `${prefix}-${layout}-total`,
          knowledge: `${id}-${layout}-total`,
          prompt: `${review ? '复习图' : '本图'}一共有几个${name}？最小的和几块合起来的完整${name}都要数，每个不同轮廓只算一次。`,
          visual,
          rule: { kind: 'number', value: compositeTotal(visual) },
          hint: '先数最小的，再按跨度找较大的，最后检查整个外轮廓。不要因沿同一轮廓指了两遍就多算。',
          explanation: `按从小到大分组为${groups.join('、')}个，合计${compositeTotal(visual)}个。组合图形可以包含内部线段，但必须有完整外轮廓。`,
        },
        {
          id: `${prefix}-${layout}-groups`,
          knowledge: `${id}-${layout}-groups`,
          prompt: `${review ? '复习分组' : '逐组检查'}：${groupScope(visual)}。最后一项包含整个外轮廓。`,
          visual,
          rule: { kind: 'steps', values: groups },
          hint: '固定一种跨度，按位置逐个找完，再换下一种。正方形要横竖边长相同；不是所有框都是正方形。',
          explanation: `依次为${groups.join('、')}个。每种轮廓按位置计一次；不能将相同大小的不同位置去重成一个。`,
        },
      ];
    }),
    {
      id: `${prefix}-repeat-boundary`,
      knowledge: `${id}-repeat-boundary`,
      prompt: review
        ? '复习数图时，小明顺着同一个三角形轮廓指了两次，能把它记为两个不同三角形吗？'
        : '数图时，小明把同一个长方形轮廓从不同起点指了两次，能把它记成两个不同长方形吗？',
      choices: [
        { id: 'no', label: '不能，是同一个轮廓，要去掉重复' },
        { id: 'yes', label: '能，指两遍就有两个' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '比较实际边界和位置，不以指的次数当图形数量。',
      explanation:
        '同一个位置、同一个轮廓只数一次。不同位置但一样大小的图形仍分别数；不把重叠包含关系当成同一个轮廓。',
    },
  ];
}
export const sujiaoCompositeCountingDraft: Lesson = {
  id,
  title: '综合数图：小图、大图与不重不漏',
  textbookTitle: '图形的初步认识（二）·练习四数图探索',
  page: 31,
  version: 1,
  status: 'preparing',
  goal: '区分最小图形与所有完整图形，按大小和位置有序数图，包含组合轮廓并去掉重复。',
  prerequisite:
    '认识长方形、正方形和三角形，能够数19以内物品，能找图形完整轮廓。',
  parentTip:
    '本课只数图中线段已经组成的完整轮廓，不自行补线或旋转纸片产生新图。正方形按边长相同辨认，不把所有长方形都数进正方形。分组是数图策略，不教面积或组合公式。',
  steps: [
    {
      title: '先说清楚要数哪些图',
      text: '“只数最小块”和“所有完整图形”是不同问题。图中相邻几块可以组成更大的完整轮廓，内部有线不影响它是一个大图形。先指外边，再判断是不是所问形状，不自行补新线。',
      visual: model('rectangle-strip', false),
    },
    {
      title: '长方形按跨度和位置找',
      text: '先数只包含一块的轮廓，再找包含相邻两块的，最后检查整个外轮廓。相同大小但在不同位置，分别算；从不同起点指同一个轮廓，只算一次。',
      visual: model('rectangle-strip', true),
    },
    {
      title: '正方形同时看横边与竖边',
      text: '方格图先数最小正方形，再找横竖都跨相同格数的大正方形。横跨两格、竖跨一格的框是长方形，不能混进本题正方形的数量。大图与小图可以互相包含，轮廓不同仍要分别数。',
      visual: model('square-grid', true),
    },
    {
      title: '三角形沿底边有序找',
      text: '本图所有三角形共享顶点。先选跨度一个最小底边段的，再选连续两个段的，依次检查直到整个外轮廓。每次由顶点沿两条已有线到不同底边端点，确认三边闭合；不把一条线或两个分离小块当一个三角形。',
      visual: model('triangle-fan', false),
      activity:
        '在纸上画简化数图，指一遍每个轮廓，并用记号记录已经数过的位置。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '在纸上画一排相邻长方形，先只数最小块，再按跨度指完整轮廓，用自己的标记避免重复。',
      '画两行两列或三行三列的正方形格，按正方形边长分组，指出一个不能混算的非正方形长方形框。',
      '画共享一个顶点的三角形分割图，按连续底边段找大、小三角形；向家长说明哪些轮廓曾漏数。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际描画、指轮廓与解释后再人工确认；网页输入正确不等于已经画图。',
      explanation: '纸面操作和口述独立记录，不能自动由客观答题推断完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你最容易漏掉哪种大图形？准备用什么办法不重不漏？可以由家长按原话代写。',
      rule: { kind: 'reflection' },
      hint: '写自己的发现、困难或方法，不要求统一答案。',
      explanation: '反思保存原话，不评对错，不代替纸面活动确认。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读综合数图范围与原创分割图核验',
    notes: `依据下册印刷第31页数图范围，ISBN ${source.isbn}。本站以改变分割数的原创图说明最小块与完整复合轮廓，有序计数而非面积教学，不复制原图文。仅这项活动范围；规律、拼组余项和完整单元审核仍在制作，版次与印次仍未核验。`,
  },
};
