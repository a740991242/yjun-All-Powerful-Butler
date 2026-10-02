import type { Lesson, Question, StickOutlineVisual } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-equal-sticks';
const layouts: StickOutlineVisual['layout'][] = [
  'square',
  'slanted-four',
  'rectangle',
  'slanted-six',
  'triangle',
  'six-sided',
];
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const models: StickOutlineVisual[] = layouts.map((layout) => ({
    kind: 'stick-outline',
    layout,
    turn: review ? 90 : 0,
  }));
  const counts = [4, 4, 6, 6, 6, 6];
  const sides = [4, 4, 4, 4, 3, 6];
  return [
    ...models.flatMap((visual, index): Question[] => [
      {
        id: `${prefix}-${index}-sticks`,
        knowledge: `${id}-${index}-sticks`,
        prompt: review
          ? '复习图转了方向，仍用了几根完整小棒？同一直线上的两根也要分别数。'
          : '这幅闭合摆图用了几根完整小棒？空心点只标端点，不是小棒。',
        visual,
        rule: { kind: 'number', value: required(counts[index]) },
        hint: '沿外轮廓一根一根数，每两个相邻端点间的一段粗线是一根。',
        explanation: `这幅图用了${counts[index]}根等长棒。长边上的接头把两根标出来；转向不改变小棒数量。`,
      },
      {
        id: `${prefix}-${index}-sides`,
        knowledge: `${id}-${index}-sides`,
        prompt: review
          ? '复习图转了方向，完整外轮廓有几条直边？同一直线上的接头不算拐角。'
          : '这个完整外轮廓有几条直边？同一直线上的两根小棒可以合成一条边。',
        visual,
        rule: { kind: 'number', value: required(sides[index]) },
        hint: '从一处拐角走到下一处拐角是一条直边；中途在同一直线上接棒，不增加一条外边。',
        explanation: `完整外轮廓有${sides[index]}条直边，用了${counts[index]}根棒。棒数和边数分别数，不能把每个接头都当作拐角。`,
      },
    ]),
    {
      id: `${prefix}-open`,
      knowledge: `${id}-open`,
      prompt: review
        ? '小棒末端没接上、还有一个开口，能说已经围成完整图形吗？'
        : '摆了四根棒，但最后两端没接上，算首尾闭合的完整图形吗？',
      rule: { kind: 'choice', value: 'no' },
      choices: [
        { id: 'yes', label: '算，只看用了几根棒' },
        { id: 'no', label: '不算，首尾还没有接上' },
      ],
      hint: '检查有没有开口、有没有真正围住里面。',
      explanation:
        '完整围图要首尾闭合。只数小棒不够，还要看是否有开口；实物摆法应逐个端点检查。',
    },
    {
      id: `${prefix}-methods`,
      knowledge: `${id}-methods`,
      prompt: review
        ? '两个人都用六根等长棒，一人围三角形、一人围长方形，不剪不断不重叠，都闭合，可以保留两种作品吗？'
        : '用六根等长棒，全用上、首尾闭合、不剪断不重叠，能有不同合法外形吗？',
      rule: { kind: 'choice', value: 'yes' },
      choices: [
        { id: 'yes', label: '能，材料一样也可以有不同合法摆法' },
        { id: 'no', label: '不能，必须跟示例完全相同' },
      ],
      hint: '本课摆法是例子，不是唯一作品。',
      explanation:
        '相同材料可以有不同合法作品。先核对材料条件和闭合情况，再观察轮廓；转向后的同一摆法与结构不同的摆法可以分别讨论。',
    },
  ];
}
export const sujiaoEqualSticksDraft: Lesson = {
  id,
  title: '等长小棒围图：棒数和边数分开看',
  textbookTitle: '图形的初步认识（二）·4根与6根等长小棒探索',
  page: 29,
  version: 1,
  status: 'preparing',
  goal: '按全部等长小棒、首尾闭合的条件摆图，区别棒数和外边数，比较并保留不同合法作品。',
  prerequisite: '认识长方形、正方形、三角形与平行四边形，知道观察完整外轮廓。',
  parentTip:
    '准备4根和6根长度相同的安全小棒。不掰断、不叠放，所有棒首尾接成一个不交叉的轮廓。本课给原创例子，不能强制所有作品相同；六条边只数轮廓，不要求背新名称。',
  steps: [
    {
      title: '四根可以怎样围',
      text: '四根同样长的棒，全用上，首尾相接，可以围成正方形。把连接处改变角度，也能围成另一种四边形。没有接上的开口不算闭合，不用叠棒或剪短来凑图。空心点只标端点。',
      visual: { kind: 'stick-outline', layout: 'square', turn: 0 },
      activity:
        '用四根等长棒先摆正方形，再尝试一种斜的闭合四边形，保留自己的方法。',
    },
    {
      title: '六根围长方形：一条边可能用两根',
      text: '长边用两根首尾接成，短边用一根，总共六根。长边中间的接头没有转弯，仍是一条直边，所以外轮廓有四条边。六根小棒不等于六条边。',
      visual: { kind: 'stick-outline', layout: 'rectangle', turn: 0 },
      activity:
        '沿实物一根根数，再沿完整轮廓一条条数；说说哪里是接头、哪里是拐角。',
    },
    {
      title: '同样六根，也可以围三角形',
      text: '每条边由两根接成，同一直线上的接头不算新拐角。三条边围成三角形，仍用了六根等长小棒，没有把棒变长或掰短。材料相同，外形可以不同。',
      visual: { kind: 'stick-outline', layout: 'triangle', turn: 0 },
      activity:
        '用相同六根尝试三角形，与长方形比较棒数和边数，不要求尺寸与网页一样。',
    },
    {
      title: '继续探索，不限定唯一作品',
      text: '这幅原创例子让每根棒在端点转向，首尾接成六条直边的轮廓。还可以探索平行四边形等不同合法摆法。全用上、不剪断不叠放、不交叉、没有开口，观察完整外轮廓；我们先数边，不要求背这个六边轮廓的新名称。',
      visual: { kind: 'stick-outline', layout: 'six-sided', turn: 0 },
      activity:
        '把自己用四根、六根摆的作品分类：先按棒数，再按轮廓。转一下作品，说哪些变了、哪些没变。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用四根等长小棒，全用上，首尾闭合，摆出两种不同轮廓；观察接头和拐角，保留自己的合法作品。',
      '用同样六根等长小棒，分别尝试三角形和长方形，逐根数棒，再指完整外边，说明棒数和边数为什么要分开数。',
      '用四根或六根，演示一次有开口或叠放的摆法，再改成一个闭合、不重叠、不交叉的轮廓；讲清改动了哪里。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际摆棒、检查和解释后人工确认。没有材料可跳过，网页例子不代替实物。',
      explanation: '开放探索可以有多种合法作品，不以和示例相同作为完成条件。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '摆小棒时，你怎样区分接头和拐角？记一句发现或疑问。',
      rule: { kind: 'reflection' },
      hint: '用自己的话；家长可以按原话代写。',
      explanation: '记录反思，不评唯一答案，也不替代实物活动。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读等长小棒开放探索与原创图示检查',
    notes: `依据印刷第29页等长小棒活动，ISBN ${source.isbn}。本站六种等长线段轮廓为原创例子，4/6根全用上，不复制原文；棒数和外边数分开，接头不当拐角。自由摆法人工确认，不要求唯一作品。版权版次印次仍未核验，本课不代替其它折拼或完整单元。`,
  },
};
