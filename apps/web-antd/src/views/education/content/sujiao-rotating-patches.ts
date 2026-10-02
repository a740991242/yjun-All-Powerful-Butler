import type {
  Lesson,
  PlanePatch,
  Question,
  RotatingPatch,
  RotatingPatchVisual,
} from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-rotating-patches';
function piece(
  shape: PlanePatch['shape'],
  width: number,
  height: number,
  turn: RotatingPatch['turn'] = 0,
): RotatingPatch {
  return { patch: { shape, width, height }, turn };
}
function model(
  target: RotatingPatch,
  candidates: RotatingPatch[],
): RotatingPatchVisual {
  return { kind: 'rotating-patch', target, candidates };
}
export const rotationExamples = (review: boolean): RotatingPatchVisual[] =>
  review
    ? [
        model(piece('rectangle', 2, 3, 90), [
          piece('rectangle', 1, 4),
          piece('rectangle', 2, 4, 45),
          piece('rectangle', 3, 2),
          piece('triangle', 2, 3),
        ]),
        model(piece('triangle', 3, 1, 45), [
          piece('triangle', 3, 1, 225),
          piece('triangle', 1, 3),
          piece('circle', 2, 2),
          piece('rectangle', 3, 1),
        ]),
        model(piece('square', 2, 2, 90), [
          piece('rectangle', 1, 4),
          piece('square', 3, 3),
          piece('square', 2, 2, 45),
          piece('triangle', 2, 2),
        ]),
        model(piece('circle', 3, 3, 90), [
          piece('circle', 2, 2),
          piece('circle', 3, 3),
          piece('triangle', 3, 3),
          piece('square', 3, 3),
        ]),
      ]
    : [
        model(piece('rectangle', 1, 4), [
          piece('square', 2, 2),
          piece('rectangle', 4, 1),
          piece('rectangle', 2, 4),
          piece('rectangle', 1, 3),
        ]),
        model(piece('triangle', 4, 2), [
          piece('triangle', 2, 4),
          piece('triangle', 3, 2),
          piece('square', 4, 4),
          piece('triangle', 4, 2, 180),
        ]),
        model(piece('square', 3, 3, 45), [
          piece('square', 3, 3),
          piece('square', 2, 2),
          piece('square', 4, 4),
          piece('circle', 3, 3),
        ]),
        model(piece('circle', 2, 2), [
          piece('circle', 1, 1),
          piece('rectangle', 2, 3),
          piece('circle', 3, 3),
          piece('circle', 2, 2),
        ]),
      ];
function tasks(review: boolean): Question[] {
  const answers = review ? ['C', 'A', 'C', 'B'] : ['B', 'D', 'A', 'D'];
  const counts = review ? [3, 2, 2, 2] : [3, 3, 3, 3];
  const models = rotationExamples(review);
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  return [
    ...models.flatMap((visual, index): Question[] => [
      {
        id: `${prefix}-${index}-fit`,
        knowledge: `${id}-${index}-fit`,
        prompt: review
          ? '换了材料和朝向：允许移动、转向，不改变大小，哪片能和目标完全重合？'
          : '允许移动、转向，哪一片能贴合目标？不能拉伸、剪裁或翻面。图卡外框不是纸片边界。',
        visual,
        choices: ['A', 'B', 'C', 'D'].map((letter) => ({
          id: letter,
          label: letter,
        })),
        rule: { kind: 'choice', value: required(answers[index]) },
        hint: '先找同类，再比较大小和比例。可以转一转，不能只凭朝向或面积相同选片。',
        explanation: `本题${answers[index]}片形状大小与目标完全一样，允许转向后贴合。其它片即使同类，也可能大小或比例不对；目标虚线不是要拉伸候选去填满。`,
      },
      {
        id: `${prefix}-${index}-category`,
        knowledge: `${id}-${index}-category`,
        prompt: review
          ? '新候选中，与目标同一类的共有几片？朝向不同仍按原类别数。'
          : '候选里与目标同一类的有几片？这是数类别，不是数能完全贴合的片。',
        visual,
        rule: { kind: 'number', value: required(counts[index]) },
        hint: '正方形、长方形、三角形和圆按本课分组；转向不改变类别，大小不同仍可能同类。',
        explanation: `候选有${counts[index]}片与目标同类，但只有一片形状大小完全一样。数类别与选贴合不是同一问题。`,
      },
    ]),
    {
      id: `${prefix}-turn`,
      knowledge: `${id}-turn`,
      prompt: review
        ? '同一张正方形纸转成斜着放，类别和大小仍不变吗？'
        : '三角形纸尖角转到下面，类别和大小仍不变吗？',
      rule: { kind: 'choice', value: 'yes' },
      choices: [
        { id: 'yes', label: '不变，只改变朝向' },
        { id: 'no', label: '改变，朝向不同就换了一种大小' },
      ],
      hint: '转向不剪纸，也不拉伸纸片。',
      explanation:
        '转向只改变摆放方向，不改变形状大小。斜放正方形仍是正方形，倒放三角形仍是三角形。',
    },
    {
      id: `${prefix}-category-only`,
      knowledge: `${id}-category-only`,
      prompt: review
        ? '只看两片都叫三角形，不比较边长和比例，就能保证转向后叠齐吗？'
        : '只看两片都叫长方形，不检查大小和比例，就能保证贴合吗？',
      rule: { kind: 'choice', value: 'no' },
      choices: [
        { id: 'no', label: '不能，同类还要比形状大小是否完全一样' },
        { id: 'yes', label: '能，名字一样就一定能贴合' },
      ],
      hint: '转动不能把短边拉长；要检查真实轮廓。',
      explanation:
        '同类不一定完全重合。转向允许换朝向，不允许改变比例、拉伸或剪短。',
    },
  ];
}
export const sujiaoRotatingPatchesDraft: Lesson = {
  id,
  title: '转一转再补图：同类不等于完全一样',
  textbookTitle: '图形的初步认识（二）·转向与重合比较',
  page: 27,
  version: 1,
  status: 'preparing',
  goal: '区别只平移和允许转向的规则，比较形状大小与比例，用转向叠放判断能否完全重合。',
  prerequisite:
    '认识四类平面图形，知道同类不一定一样大，能理解题目是否允许转向。',
  parentTip:
    '网页用45度小步转向作明确模型范围，不要求孩子计算角度或面积。先检查本题规则，不把前一课只平移与本课可转向混用。实际纸片由家长准备或安全剪裁，开放图样人工确认。',
  steps: [
    {
      title: '规则变了，先说清楚',
      text: '前一补图课只能移动，本课允许移动、转向，但不翻面、不拉伸、不剪裁。目标竖着、候选横着，不一定不能贴合；可转一转，把长边、短边分别叠齐。图卡外框不当纸片边界。',
      visual: required(rotationExamples(false)[0]),
      activity:
        '家长准备同样大小横放、竖放的长方形，允许转向后叠放；再说说只平移时条件哪里不同。',
    },
    {
      title: '转向不能改比例',
      text: '两片都叫三角形、看起来一个宽一个高，不能只凭名字相同就说一样。先观察完整轮廓，转一转比较每条边和角能否叠齐，不把“占的地方一样多”当成形状完全一样。真正同样的三角形即使倒放，也能转回来重合。',
      visual: required(rotationExamples(false)[1]),
      activity:
        '把两块同样三角形转不同朝向叠放，再比较另一块比例不同的三角形。',
    },
    {
      title: '斜放正方形仍是正方形',
      text: '同一正方形斜放后仍是原来的形状和大小。比较图中目标与候选，允许转向，才能把一样的边和角对齐。不同大小的正方形不能靠转动变成同样大小。孩子不需要背角度数，只要转一转再检查。',
      visual: required(rotationExamples(false)[2]),
      activity:
        '同一正方形换两个朝向，叠放后比较；不要拿大小不同的正方形冒充只是转向。',
    },
    {
      title: '数同类与选贴合分开',
      text: '圆有大有小，候选中几个都可能是圆，却只有同样大的能贴合。长方形、正方形和三角形也一样。转向不改变类别与大小；先按题目规则观察，再选完全重合的片，实际补图仍独立完成。',
      visual: required(rotationExamples(false)[3]),
      activity:
        '先数与目标同类的纸片，再从中找能完全贴合的片，说清两个问题的区别。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '用同样大小的长方形与正方形换朝向、叠放比较，分别说只能平移和允许转向时该怎样检查。',
      '用同样三角形倒放再叠齐，另找比例不同的三角形比较，说明同类不能保证完全一样。',
      '自己描一个原创目标轮廓，准备至少三块不同纸片，允许转向选贴合片；保留合法方法，不能拉伸或剪裁凑合。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实移动、转向和叠放后人工确认；没有材料可跳过。',
      explanation: '网页示例不代替实物补图；自己设计的条件和合法方法可以不同。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '如果题目改成只允许移动、不许转向，你会先检查什么？记自己的话。',
      rule: { kind: 'reflection' },
      hint: '可以谈长短边、朝向、大小或题目规则。',
      explanation: '反思原话单独记录，不评唯一答案。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读转向重合范围与原创比例候选检查',
    notes: `依据印刷第27页同样大小、斜放正方形与倒放三角形比较，ISBN ${source.isbn}。本站目标与比例候选为原创，图示转向限定45度小步及平移，不翻面拉伸剪裁；不复制附页原图。完整轮廓在允许转向下恰有一片贴合，数同类另问，实物独立确认。版次印次仍未核验，不代替指定候选拼组与完整单元审核。`,
  },
};
