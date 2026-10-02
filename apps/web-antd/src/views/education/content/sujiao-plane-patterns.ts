import type {
  Lesson,
  PeriodicShapesVisual,
  PlaneShape,
  Question,
} from '../learning/types';

import { periodicShapeAt, shapeKey } from '../learning/periodic-shapes';
import { planeShapes } from '../learning/plane-cards';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-plane-patterns';
type Family = 'mixed' | 'shapes' | 'sizes';
const names: Record<PlaneShape, string> = {
  rectangle: '长方形',
  square: '正方形',
  triangle: '三角形',
  circle: '圆',
};
function item(
  shape: PlaneShape,
  size: 1 | 2,
): PeriodicShapesVisual['pattern'][number] {
  return { shape, size };
}
function model(family: Family, review: boolean): PeriodicShapesVisual {
  return {
    kind: 'periodic-shapes',
    pattern: (() => {
      if (family === 'sizes')
        return review
          ? [item('circle', 2), item('circle', 1), item('circle', 2)]
          : [item('circle', 1), item('circle', 2), item('circle', 2)];
      return (() => {
        if (family === 'shapes')
          return review
            ? [item('square', 2), item('triangle', 2), item('circle', 2)]
            : [item('triangle', 2), item('circle', 2), item('square', 2)];
        return review
          ? [item('square', 2), item('rectangle', 2), item('square', 2)]
          : [item('rectangle', 2), item('square', 2), item('square', 2)];
      })();
    })(),
    total: (() => {
      if (family === 'sizes') return review ? 10 : 11;
      return (() => {
        if (family === 'shapes') return review ? 11 : 10;
        return review ? 12 : 9;
      })();
    })(),
    shown: family === 'mixed' && review ? 9 : 6,
  };
}
const choices = planeShapes.flatMap((shape) =>
  ([1, 2] as const).map((size) => ({
    id: shapeKey({ shape, size }),
    label: `${size === 1 ? '小' : '大'}${names[shape]}`,
  })),
);
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  return [
    ...(['sizes', 'shapes', 'mixed'] as const).flatMap((family): Question[] => {
      const visual = model(family, review);
      return [
        ...[visual.shown, visual.shown + 1, visual.total - 1].map(
          (index, i): Question => {
            const expected = required(periodicShapeAt(visual, index));
            return {
              id: `${prefix}-${family}-${i}`,
              knowledge: `${id}-${family}-${i}`,
              prompt: `${review ? '复习图' : '本图'}明确按前三个位置为一组，从左起每组三个照原顺序重复。第${index + 1}个问号位置应放哪种大小和形状？`,
              visual,
              choices,
              rule: { kind: 'choice', value: shapeKey(expected) },
              hint: '先指出一组三个位置，形状和大小都看；每过完整三位置，再回到组内第一位置。问号也占位置。',
              explanation: `第${index + 1}个与组内第${(index % 3) + 1}个对应，应是${expected.size === 1 ? '小' : '大'}${names[expected.shape]}。同一形状可以大小不同；不能只记图形名称。`,
            };
          },
        ),
        {
          id: `${prefix}-${family}-total`,
          knowledge: `${id}-${family}-total`,
          prompt: `${review ? '复习图' : '本图'}这一排共有几个位置？已摆图形和问号位置都数，只数一遍。`,
          visual,
          rule: { kind: 'number', value: visual.total },
          hint: '从最左到最右按位置数，不把图形种类数当位置总数，也不跳过问号。',
          explanation: `本图共${visual.total}个位置，问号表示待填，不表示位置不存在；所填形状改变也不增加位置。`,
        },
      ];
    }),
    {
      id: `${prefix}-stated-rule`,
      knowledge: `${id}-stated-rule`,
      prompt: review
        ? '另一排只给少量图，没有说明重复规则，小明想到另一种能接下去的摆法，能只凭本课规则说他一定错吗？'
        : '只看另一排前几个图，没有明确重复规则，是否一定只能按本课“三个一组”的方法接下去？',
      choices: [
        { id: 'no', label: '不能强判，需要说明采用的规则或讨论其它合理规律' },
        { id: 'yes', label: '所有图形排列都必须三个一组' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '本课图已经明确规则，另一排没有明确条件；不要把本课约定变成所有排列的规定。',
      explanation:
        '有限的一小段可以有不同延续规则。本课选择题按题目明确给定的三位置重复规则作答；自由摆图可以讨论其它合法规则，不能强制唯一方法。',
    },
  ];
}
export const sujiaoPlanePatternsDraft: Lesson = {
  id,
  title: '图形规律：形状与大小一起看',
  textbookTitle: '图形的初步认识（二）·练习四接着摆',
  page: 31,
  version: 1,
  status: 'preparing',
  goal: '按明确三位置重复规则续摆，区分形状与大小、种类与位置，说明自己的规则并保留开放延续方法。',
  prerequisite: '认识四类平面图形，能比较同类大小，能从左向右找12以内位置。',
  parentTip:
    '颜色不参与本课规则；两种大小只是同一图形不同尺寸。先让孩子指前三个位置，不跳过重复的大圆或正方形；自由规律讨论不套唯一答案。',
  steps: [
    {
      title: '图形相同，还要看大小',
      text: '这一排只有圆，但大小不同。本活动明确以左起前三个位置为一组，形状和大小按原顺序重复；先指出完整一组，再看下一组对应位置。问号表示待填，仍占位置。',
      visual: model('sizes', false),
    },
    {
      title: '形状也可以按组重复',
      text: '这一排按三角形、圆、正方形的顺序摆，每三个位置重复一次。不能把“三种形状”当作“一共三个位置”；相同形状出现多次，位置仍分别数。图中给定条件足够，练习按明确规则选择。',
      visual: model('shapes', false),
    },
    {
      title: '一组里相同图形可以重复',
      text: '长方形后面接两个正方形，也是一组三个位置。不是看见形状变了就另起一组；组内重复的图形仍各占一个位置。最后不满一组时，继续沿组内顺序填，不另发明新的顺序。',
      visual: model('mixed', false),
    },
    {
      title: '明确规则题与自由摆图分开',
      text: '本课已经说明从左起每三个位置重复，可以据此检查。另一排如果只给少量图、没有说明规则，可能有不同合法延续。可以自己设计规则、摆图并解释，不把三位置重复强加给所有自由作品。',
      activity:
        '用安全纸片摆自己的规则，让家长先说明猜到的规则，再由孩子解释原规则；讨论是否有别的合理续法。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用同一形状的大、小纸片摆两组明确三位置规则，再接一组，逐位置说清大小顺序。',
      '用至少两种形状摆一组，其中允许重复一种形状；重复摆两组后续摆，说清组数与位置总数不同。',
      '设计自己的排列规则并解释，让家长提出另一种能接下去的规则；比较明确约定与自由猜规律的区别。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真正摆放、指位置并口述规则后，再由孩子或家长确认；没有纸片时可以跳过。',
      explanation: '实物续摆与开放解释独立记录，不从网页选择正确自动推断完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你刚才忽略过大小、重复的位置或最后一组吗？记下准备怎样检查，可以由家长按原话代写。',
      rule: { kind: 'reflection' },
      hint: '写自己的发现或检查办法，不需要固定句子。',
      explanation: '学习反思保存原话，不评对错，不替代纸面确认。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读形状大小重复范围与原创规则核验',
    notes: `依据下册印刷第31页接着摆活动，ISBN ${source.isbn}。本站改变顺序与待填位置，用明确三位置规则制作原创图，不复制原图文；大小、类别、位置与开放延续分别处理。版次与印次仍未核验，不能把本课视为全部练习四或单元完成。`,
  },
};
