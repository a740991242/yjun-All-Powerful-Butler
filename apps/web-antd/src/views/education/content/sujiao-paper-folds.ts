import type { Lesson, PaperFoldVisual, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-paper-folds';
const cases: [PaperFoldVisual['paper'], PaperFoldVisual['method']][] = [
  ['square', 'cross'],
  ['square', 'parallel'],
  ['square', 'diagonal'],
  ['rectangle', 'cross'],
  ['rectangle', 'parallel'],
  ['rectangle', 'diagonal'],
];
const shapes = [
  { id: 'square', label: '正方形' },
  { id: 'rectangle', label: '长方形' },
  { id: 'triangle', label: '三角形' },
  { id: 'circle', label: '圆' },
];
const outcomes = [
  'square',
  'rectangle',
  'triangle',
  'rectangle',
  'rectangle',
  'triangle',
];
function instructions(index: number) {
  const [paper, method] = required(cases[index]);
  const first =
    paper === 'square' && method === 'diagonal'
      ? '沿左上角到右下角，把右上角合到左下角'
      : '沿正中竖线，把右边合到左边';
  const second = (() => {
    if (paper === 'square' && method === 'diagonal')
      return '沿左下角到斜边中点，把右下角合到左上角';
    return (() => {
      if (method === 'diagonal')
        return '沿当前纸片左上角到右下角，把右上角合到左下角';
      return method === 'cross'
        ? '沿当前纸片正中横线，把下边合到上边'
        : '沿当前纸片正中竖线，把右边合到左边';
    })();
  })();
  return `原纸宽4段、高${paper === 'square' ? 4 : 2}段，各段同样长。第一次${first}；第二次${second}。每次对折后叠齐，不剪纸。`;
}
function model(index: number, stage: 0 | 1 | 2): PaperFoldVisual {
  const [paper, method] = required(cases[index]);
  return { kind: 'paper-fold', paper, method, stage };
}
function tasks(review: boolean): Question[] {
  const order = review ? [1, 2, 5, 4, 0, 3] : [0, 1, 2, 3, 4, 5];
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  return [
    ...order.map((index, i): Question => ({
      id: `${prefix}-result-${i}`,
      knowledge: `${id}-result-${i}`,
      prompt: review
        ? '换一组明确折法：按材料说明完成两次对折，叠好后的完整外轮廓是什么？'
        : '图中已经折好一次。按材料说明再对折一次，完整外轮廓会是什么？不要把虚线当剪线。',
      material: instructions(index),
      visual: model(index, review ? 0 : 1),
      choices: shapes,
      rule: { kind: 'choice', value: required(outcomes[index]) },
      hint: '先核对原纸长宽和每次折线，再观察完整叠好轮廓；不同折法不能套一个答案。',
      explanation: `按本题两次指定折法，最终外轮廓是${required(shapes.find((s) => s.id === outcomes[index])).label}。纸仍是一张，叠出的纸层不是新纸片。`,
    })),
    ...[review ? 3 : 0, review ? 1 : 2, review ? 5 : 3].map(
      (index, i): Question => ({
        id: `${prefix}-first-${i}`,
        knowledge: `${id}-first-${i}`,
        prompt: review
          ? '按新材料的第一次指定对折，只完成一次时，外轮廓是什么？'
          : '只做材料说明中的第一次对折，当前外轮廓是什么？不要提前做第二次。',
        material: instructions(index),
        visual: model(index, 0),
        choices: shapes,
        rule: {
          kind: 'choice',
          value: (() => {
            if (index === 2) return 'triangle';
            return index < 3 ? 'rectangle' : 'square';
          })(),
        },
        hint: '只看第一次折线和合拢方向。',
        explanation: (() => {
          if (index === 2) return '正方形沿指定对角线对折，外轮廓为三角形。';
          return index < 3
            ? '宽4段、高4段，竖着折一次变为宽2段、高4段的长方形。'
            : '这张长方形宽4段、高2段，竖着折一次为宽2段、高2段的正方形；不能扩成所有长方形。';
        })(),
      }),
    ),
    {
      id: `${prefix}-fold-count`,
      knowledge: `${id}-fold-count`,
      prompt: review
        ? '材料说明的第一次和第二次都做完，一共进行了几次对折？'
        : '按说明完成第一次和第二次，共对折了几次？纸层不是折的次数。',
      rule: { kind: 'number', value: 2 },
      hint: '分别数第一次、第二次。',
      explanation: '两次对折；纸层数、纸张数与折的次数不是一回事。',
    },
    {
      id: `${prefix}-unspecified`,
      knowledge: `${id}-unspecified`,
      prompt: review
        ? '只说“长方形纸对折两次”，没说长宽和折线，能替所有折法定一个唯一外形吗？'
        : '只说“正方形纸对折两次”，没有折线方向，能认定所有结果都一样吗？',
      rule: { kind: 'choice', value: 'no' },
      choices: [
        { id: 'yes', label: '能，折的次数一样结果就一样' },
        { id: 'no', label: '不能，还需要纸片条件和具体折法' },
      ],
      hint: '比较本课不同折线，不能只记折的次数。',
      explanation:
        '不同折法可以产生不同外轮廓。具体题按明确条件判断；自由折纸通过实物探索讨论，不能强判唯一外形。',
    },
  ];
}
export const sujiaoPaperFoldsDraft: Lesson = {
  id,
  title: '对折两次：先看纸片，再说明折线',
  textbookTitle: '图形的初步认识（二）·练习四折纸探索',
  page: 30,
  version: 1,
  status: 'preparing',
  goal: '按照明确纸片和折线观察两次对折，比较不同外轮廓，区分折叠、剪开和增加纸片。',
  prerequisite: '认识正方形、长方形与三角形，知道完整外轮廓和内部线的区别。',
  parentTip:
    '准备正方形纸和长宽为2比1的长方形纸。示例条件与所有任意纸片不同；慢慢叠齐，每次折法说清楚。不剪纸、不把纸层算成新纸片。',
  steps: [
    {
      title: '正方形：竖折再横折',
      text: '原创正方形宽4段、高4段。先沿竖着的正中对折，右边合到左边；再沿当前纸片横着的正中对折，下边合到上边。第一次为长方形，第二次为正方形。实线看外轮廓，虚线是下一步折线，不是剪线。',
      visual: model(0, 2),
      activity: '实际折一次就停下看轮廓，再折第二次，看变化。每次把边叠齐。',
    },
    {
      title: '同一正方形：连续竖折',
      text: '先沿竖着的正中对折，右边合到左边；再把现在的右边合到左边，两次折线都竖着。最终是一条窄长方形。虽然同样折两次，却与上一步横竖折的结果不同。',
      visual: model(1, 2),
      activity:
        '用另一张同样正方形，实际比较两种折法，不把纸张大小差异当成折法差异。',
    },
    {
      title: '沿对角线与指定中线',
      text: '正方形先沿左上到右下角的线对折，把右上角合到左下角。再沿左下角到斜边中点对折，把右下角合到左上角。两次结果的外轮廓都是三角形，大小不同。这里指定折线，不能扩成任意折法。',
      visual: model(2, 2),
      activity:
        '家长先示范端点，孩子每次叠齐后指完整外轮廓。折痕不是剪开的小片。',
    },
    {
      title: '长方形也要看长宽和折法',
      text: '这里长方形宽4段、高2段。竖着对折后是正方形，再沿左上角到右下角对折，最终为三角形。若第二次改为横着或竖着从正中折，最终为长方形。别把“长方形折两次”当成只有一个答案；任意长宽关系要重新观察。',
      visual: model(5, 2),
      activity:
        '准备长宽为2比1的长方形，尝试两种第二次折法；再拿不同长宽的纸观察，不强制唯一结果。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用两张同样正方形，分别竖折再横折、连续竖折，叠齐并比较外轮廓，指清每条折线。',
      '用正方形按图先沿对角线、再沿指定中线对折，每折一次停下指轮廓，说明没有剪纸或增加纸片。',
      '用长宽为2比1的长方形，第一次竖折，第二次分别尝试中线和对角线；再探索自己的折法，说明材料和折线。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际叠齐、检查并解释后人工确认，没有纸片可跳过。',
      explanation:
        '开放折法可以不同，网页图示不自动确认实物完成；按明确折线条件观察。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '你发现只说“对折两次”还缺哪些信息？记录自己的话或疑问。',
      rule: { kind: 'reflection' },
      hint: '可以谈纸的长宽、折线或每次叠齐的方法。',
      explanation: '反思独立记录，不要求固定句子，不评对错。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读练习四开放折纸与原创明确条件检查',
    notes: `依据印刷第30页对折两次开放活动，ISBN ${source.isbn}。本站指定尺寸、折线、合拢方向与图序为原创示例，不复制教材图文；题图仅到已做阶段，不提前显示下一次答案。纸层与张数区分，自由折法人工记录；本课不代替候选拼图判断或完整单元。版次印次仍未核验。`,
  },
};
