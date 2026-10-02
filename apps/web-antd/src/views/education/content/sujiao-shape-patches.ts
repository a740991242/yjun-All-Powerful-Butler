import type {
  Lesson,
  PlanePatch,
  PlaneShape,
  Question,
  ShapePatchVisual,
} from '../learning/types';

import { matchingPatch } from '../learning/shape-patch';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-shape-patches';
const names: Record<PlaneShape, string> = {
  rectangle: '长方形',
  square: '正方形',
  triangle: '三角形',
  circle: '圆',
};
const families: PlaneShape[] = ['rectangle', 'triangle', 'square', 'circle'];
function patch(shape: PlaneShape, width: number, height: number): PlanePatch {
  return { shape, width, height };
}
function model(shape: PlaneShape, review: boolean): ShapePatchVisual {
  if (shape === 'rectangle') {
    const target = patch(shape, review ? 4 : 1, review ? 1 : 4);
    return {
      kind: 'shape-patch',
      target,
      candidates: review
        ? [
            target,
            patch('triangle', 4, 1),
            patch(shape, 2, 1),
            patch('square', 4, 4),
          ]
        : [
            patch(shape, 2, 4),
            target,
            patch(shape, 1, 2),
            patch('square', 2, 2),
          ],
    };
  }
  if (shape === 'triangle') {
    const target = patch(shape, review ? 3 : 4, review ? 3 : 2);
    return {
      kind: 'shape-patch',
      target,
      candidates: review
        ? [
            patch(shape, 3, 1),
            patch('circle', 3, 3),
            patch(shape, 2, 2),
            target,
          ]
        : [
            patch(shape, 2, 4),
            patch('rectangle', 4, 2),
            patch(shape, 3, 2),
            target,
          ],
    };
  }
  if (shape === 'square') {
    const target = patch(shape, review ? 2 : 3, review ? 2 : 3);
    return {
      kind: 'shape-patch',
      target,
      candidates: review
        ? [
            patch(shape, 4, 4),
            target,
            patch('rectangle', 2, 4),
            patch('triangle', 2, 2),
          ]
        : [
            patch(shape, 2, 2),
            patch('triangle', 3, 3),
            target,
            patch('rectangle', 3, 2),
          ],
    };
  }
  const target = patch(shape, review ? 3 : 2, review ? 3 : 2);
  return {
    kind: 'shape-patch',
    target,
    candidates: review
      ? [patch('square', 3, 3), patch(shape, 2, 2), target, patch(shape, 4, 4)]
      : [target, patch(shape, 3, 3), patch('square', 2, 2), patch(shape, 1, 1)],
  };
}

function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  return [
    ...families.flatMap((shape): Question[] => {
      const visual = model(shape, review);
      const letter = String.fromCodePoint(65 + matchingPatch(visual));
      return [
        {
          id: `${prefix}-${shape}-fit`,
          knowledge: `${id}-${shape}-fit`,
          prompt: `${review ? '复习目标' : '目标'}空缺是${names[shape]}。只能平移、不旋转、不拉伸也不剪裁，哪张候选纸片能完全贴合虚线轮廓？`,
          visual,
          choices: visual.candidates.map((_p, i) => ({
            id: String.fromCodePoint(65 + i),
            label: String.fromCodePoint(65 + i),
          })),
          rule: { kind: 'choice', value: letter },
          hint: '先看同类，再比较大小和长宽；所有图用同一比例，不要按外面的卡片框大小判断。',
          explanation: `${letter}与目标形状、大小和长宽一致，只平移就能贴合。其它候选可能是同类，但大小或比例不同；不能靠拉伸、旋转或剪掉一部分满足本题条件。`,
        },
        {
          id: `${prefix}-${shape}-category`,
          knowledge: `${id}-${shape}-category`,
          prompt: `${review ? '复习候选片' : '候选片'}A～D中，只按${names[shape]}这一类数，有几张？这里不要求大小和目标相同。`,
          visual,
          rule: {
            kind: 'number',
            value: visual.candidates.filter((p) => p.shape === shape).length,
          },
          hint: '本题只数同一类别，不能只数刚才能贴合的那一张；不同大小同类仍分别计数。',
          explanation: `同类有${visual.candidates.filter((p) => p.shape === shape).length}张，但本题指定的平移贴合只有一张。同类数量和适合目标的数量不同。`,
        },
      ];
    }),
    {
      id: `${prefix}-category-not-fit`,
      knowledge: `${id}-category-not-fit`,
      prompt: review
        ? '两张纸片都叫三角形，就一定能只平移后完全重合吗？'
        : '两张纸片都叫长方形，就一定能只平移后完全重合吗？',
      choices: [
        { id: 'no', label: '不一定，还要看大小、比例和本题允许的动作' },
        { id: 'yes', label: '一定，同一类就必定贴合' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '回看同类但不能贴合的候选片，不只比较名称。',
      explanation:
        '同类不代表完全一样。大小、长宽关系、朝向与可用动作都可能影响是否贴合；本课只允许平移。',
    },
    {
      id: `${prefix}-alter`,
      knowledge: `${id}-alter`,
      prompt: review
        ? '把候选纸片剪小后贴上了，能说原来的纸片无需改变、只平移就能贴合吗？'
        : '把候选纸片拉长后贴上了，能说原来的纸片只平移就能贴合吗？',
      choices: [
        { id: 'no', label: '不能，已经改变纸片，不符合只平移的条件' },
        { id: 'yes', label: '能，只要最终盖住目标就算原片贴合' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '区分改变纸片和移动纸片，本题检查原纸片。',
      explanation:
        '拉伸或剪裁改变大小或形状，本题不允许。创造活动可以另作作品，但不能改写这道题的条件。',
    },
  ];
}
export const sujiaoShapePatchesDraft: Lesson = {
  id,
  title: '补图选择：形状、大小和比例都合适',
  textbookTitle: '图形的初步认识（二）·活动2补图选择',
  page: 26,
  version: 1,
  status: 'preparing',
  goal: '在同一比例下比较目标和候选片，区分同类与完全贴合，按明确平移条件检查长宽和大小。',
  prerequisite: '认识四类平面图形，知道同一类可以大小不同、转向比较另有条件。',
  parentTip:
    '候选卡片框一样大，但里面纸片按同一比例绘制；不要把框当纸片。网页只观察和选片，真实描画、叠放、贴图另行确认。',
  steps: [
    {
      title: '看目标空缺，不看卡片框',
      text: '虚线是目标轮廓，字母框里是候选纸片。所有纸片使用同一比例；外面的展示卡片不是纸片边缘。先比较形状，再比较大小和长宽。本活动只允许平移，不能旋转、拉伸或剪裁。',
      visual: model('square', false),
    },
    {
      title: '长方形的长宽要对得上',
      text: '同是长方形，可能更宽、更短或整体更小。只看名称不能保证贴合。拿原纸片平移到目标位置，轮廓要完全对齐；拉伸会改变纸片，不能算原片符合本题。',
      visual: model('rectangle', false),
    },
    {
      title: '三角形的尖宽也要比较',
      text: '这里的三角片都按上方顶点、水平底边画，底边宽和高度不同，轮廓就可能不一样。较尖、较宽或整体较小不一定贴合；本题不允许靠转向、拉伸或剪裁解决。',
      visual: model('triangle', false),
    },
    {
      title: '同类数量与合适片数不同',
      text: '圆有大有小，正方形也有大有小。数同一类时，大小不同仍分别数；选择贴合纸片时，还要检查完整轮廓。本课数字只判断所问范围，真实纸片描画和叠放仍由人工确认。',
      visual: model('circle', false),
      activity:
        '用同类不同大小纸片，先数同类，再在纸上描一个目标，尝试只平移贴合。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '描一个正方形或圆的目标轮廓，准备同类不同大小纸片，只平移比较贴合；由家长安全制作纸片。',
      '准备两张长宽关系不同的长方形或三角形纸片，描一张作目标，说明为什么另一张同类片不能直接贴合。',
      '做自己的原创拼贴，在纸上留下目标轮廓；先约定允许哪些动作，再让家长选片，记录条件与结果。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实描画、平移比较和口述后再人工确认；没有纸片可以跳过，剪刀由家长处理。',
      explanation: '纸面操作独立记录，不从网页选中正确字母自动推断完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '哪张同类纸片最容易选错？你准备先比较什么？可以由家长按孩子原话代写。',
      rule: { kind: 'reflection' },
      hint: '记录自己的检查方法或困难，不要求固定答案。',
      explanation: '反思保存原话，不评对错，不代替实物活动。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读形状大小比例补图范围与原创目标检查',
    notes: `依据下册印刷第26～27页已读范围，ISBN ${source.isbn}；本站使用原创目标轮廓与字母候选，明确只平移的题目条件，不复制原插图或题文。形状、尺寸和长宽均检查，任意旋转或自由拼贴不按本课唯一答案判定。版次与印次仍未核验；不代替完整单元。`,
  },
};
