import type {
  Lesson,
  PlaneCardsVisual,
  PlaneShape,
  Question,
} from '../learning/types';

import { planeShapes } from '../learning/plane-cards';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-plane-recognition';
const names: Record<PlaneShape, string> = {
  rectangle: '长方形',
  square: '正方形',
  triangle: '三角形',
  circle: '圆',
};
function cards(review: boolean): PlaneCardsVisual {
  const shapes = review ? [...planeShapes].toReversed() : planeShapes;
  return {
    kind: 'plane-cards',
    cards: shapes.map((shape, i) => ({
      shape,
      size: review ? 1 : 2,
      turn: required(([45, 90, 180, 0] as const)[i]),
    })),
  };
}
function pair(review: boolean): PlaneCardsVisual {
  return {
    kind: 'plane-cards',
    cards: [
      { shape: review ? 'triangle' : 'square', size: 2, turn: 0 },
      {
        shape: review ? 'triangle' : 'square',
        size: 2,
        turn: review ? 180 : 45,
      },
      { shape: review ? 'triangle' : 'square', size: 1, turn: 90 },
    ],
  };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const visual = cards(review);
  const compare = pair(review);
  const choice = (
    suffix: string,
    prompt: string,
    choices: { id: string; label: string }[],
    value: string,
    hint: string,
    explanation: string,
    visual?: PlaneCardsVisual,
  ): Question => ({
    id: `${prefix}-${suffix}`,
    knowledge: `${id}-${suffix}`,
    prompt,
    choices,
    rule: { kind: 'choice', value },
    hint,
    explanation,
    ...(visual ? { visual } : {}),
  });
  return [
    ...visual.cards.map((card, i): Question =>
      choice(
        `recognize-${i}`,
        `${review ? '复习图' : '图卡'}${String.fromCodePoint(65 + i)}属于哪一类平面图形？`,
        planeShapes.map((shape) => ({ id: shape, label: names[shape] })),
        card.shape,
        '先看是否有直边，再看直边和角的特点。不要只看朝向、大小或颜色。',
        `${names[card.shape]}转向或改变大小后，仍属于原来这一类。`,
        visual,
      ),
    ),
    ...visual.cards.map((card, i): Question => ({
      id: `${prefix}-edges-${i}`,
      knowledge: `${id}-edges-${i}`,
      prompt: `${review ? '复习图' : '图卡'}${String.fromCodePoint(65 + i)}有几条直边？弯曲的轮廓不算直边。`,
      visual,
      rule: {
        kind: 'number',
        value: (() => {
          if (card.shape === 'circle') return 0;
          return card.shape === 'triangle' ? 3 : 4;
        })(),
      },
      hint: '沿轮廓逐条指直边，指完回到起点，不重复计数。',
      explanation:
        card.shape === 'circle'
          ? '圆的轮廓弯曲，没有直边，填0。'
          : `${names[card.shape]}有${card.shape === 'triangle' ? 3 : 4}条直边；摆放方向不改变边数。`,
    })),
    choice(
      'category',
      `${review ? '复习比较图' : '比较图'}中的A、B、C属于同一类图形吗？`,
      [
        { id: 'yes', label: '属于同一类' },
        { id: 'no', label: '只要大小或方向不同，就不是同一类' },
      ],
      'yes',
      '分类看形状特点，大小和方向可以不同。',
      `三张都是${review ? '三角形' : '正方形'}，C较小，但类别相同。`,
      compare,
    ),
    choice(
      'exact',
      `${review ? '复习比较图' : '比较图'}中，哪张图卡只需转向、不改变大小，就能与A完全重合？`,
      [
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'both', label: 'B和C都可以' },
      ],
      'B',
      '完全一样要同时比较形状与大小。只转向不能把小图放大。',
      'B与A形状大小相同，转向后可以重合。C属于同类但较小，不能只转向就重合。',
      compare,
    ),
    choice(
      'turn',
      `把一张${review ? '三角形' : '正方形'}纸片转半圈，没有剪裁或拉伸，形状类别会变吗？`,
      [
        { id: 'no', label: '不会，只改变朝向' },
        { id: 'yes', label: '会，换个方向就成为另一类' },
      ],
      'no',
      '把纸片放回原方向，看看边和角有没有变。',
      '转向没有增加边、减少边或改变形状。分类不能只记某一个摆放方向。',
    ),
    choice(
      'face',
      review
        ? '把圆柱的一个平整底面沿边描在纸上，得到的轮廓是哪一类？不是描弯曲的侧面。'
        : '把正方体的一个平整面沿边描在纸上，得到的轮廓是哪一类？',
      planeShapes.map((shape) => ({ id: shape, label: names[shape] })),
      review ? 'circle' : 'square',
      '区分立体物品和它在纸上留下的平面轮廓；本题指定了哪一个面。',
      review
        ? '圆柱平整底面的轮廓是圆。圆柱是立体，纸上的轮廓是平面图形。'
        : '正方体一个面的轮廓是正方形；不是把正方体整体改叫正方形。',
    ),
  ];
}
export const sujiaoPlaneRecognitionDraft: Lesson = {
  id,
  title: '平面图形：认轮廓、分类型与转向比较',
  textbookTitle: '图形的初步认识（二）·活动1及完全一样的图形',
  page: 23,
  version: 1,
  status: 'preparing',
  goal: '区分物体与平面轮廓，认识四类平面图形，比较不同朝向、大小，区分同类与完全一样。',
  prerequisite: '认识正方体和圆柱，能逐个数物品，知道大小和方向可以不同。',
  parentTip:
    '用安全物品描平整的面，不要求识别所有立体。比较时不只凭看起来斜不斜；实际重合、描画和围图独立确认。',
  steps: [
    {
      title: '物品的面与纸上的轮廓',
      text: '把盒子的一个平整面放在纸上，沿边描一圈。物品是立体的，纸上的轮廓是平面的。正方体的面能描出正方形；圆柱的平整底面能描出圆，不能用弯曲侧面代替底面。',
      activity:
        '选安全盒子或圆柱物品，家长固定物品，孩子描一个平整面的边缘并说说区别。',
    },
    {
      title: '观察四类图形的特点',
      text: '长方形有四个直角，图中相邻两边长度不同；正方形四边一样长，也有四个直角。三角形有三条直边；圆的轮廓弯曲，没有直边。先看轮廓，不按颜色分类。',
      visual: cards(false),
    },
    {
      title: '转向与大小不改变类别',
      text: '图卡可以转向，也可以画大或画小，但仍属于同一类。斜放的正方形还是正方形；倒着的三角形还是三角形。数边时绕一圈，不重复数起点。',
      visual: cards(true),
    },
    {
      title: '同一类不一定完全一样',
      text: '同类图形可以大小不同。“完全一样”还要求形状和大小相同，转向后能重合。A和B可以只转向后重合；C较小，不能只转向就重合。真实描图与叠放需要动手检查，网页选对不自动完成纸面活动。',
      visual: pair(false),
      activity:
        '描两张同样大小纸片和一张较小纸片，安全剪裁由家长处理；转向、叠放比较。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '描一个平整面并指出物体与纸面轮廓；再找生活中另一种平面轮廓，说明观察的是哪一个面。',
      '用同样大小纸片转向、叠放，比较一大一小同类纸片；说清“同一类”与“完全一样”的区别。',
      '在钉点板或纸面用直线段围三角形、长方形或正方形，再讨论直线段能否围出真正的圆；注意真实圆没有直边。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际描画、叠放、围图与口述后再人工确认；剪刀由家长安全操作。',
      explanation: '图示识别与真实操作分别记录，不自动推断孩子完成了纸面任务。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '哪种转向后的图形最容易认错？你会怎样检查？可以由家长按孩子原话代写。',
      rule: { kind: 'reflection' },
      hint: '说自己的观察或困难，不需要固定句子。',
      explanation: '记录学习想法，不评对错，不替代纸面操作确认。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '平面图形原书范围与原创图卡核验',
    notes: `已读下册印刷第23～27页，ISBN ${source.isbn}；原创图卡、转向与大小比较，不复制原图文。仅本课范围，尚未覆盖整单元拼组、平行四边形和综合计数；版次与印次仍未核验。`,
  },
};
