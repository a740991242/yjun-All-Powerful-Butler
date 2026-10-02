import type { Lesson, Question, ShapeCollageVisual } from '../learning/types';

import { planeShapes } from '../learning/plane-cards';
import { required } from '../learning/required';
import { collageCounts, collageLayouts } from '../learning/shape-collage';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-mixed-collages';
const names = {
  rectangle: '长方形',
  square: '正方形',
  triangle: '三角形',
  circle: '圆',
};
export const collageModel = (
  index: number,
  review = false,
): ShapeCollageVisual => ({
  kind: 'shape-collage',
  layout: required(collageLayouts[index]),
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const result: Question[] = [];
  for (let i = 0; i < 4; i++) {
    const visual = collageModel(i, review);
    const counts = collageCounts(visual);
    for (const shape of planeShapes)
      result.push({
        id: `${prefix}-${i}-${shape}`,
        knowledge: `${id}-${i}-${shape}`,
        prompt: `这幅作品中用了几片${names[shape]}材料？只数有字母的原始纸片，不把几片合出的更大轮廓当新材料。没有这一类填0。`,
        visual,
        rule: { kind: 'number', value: counts[shape] },
        hint: '沿每片清楚边界认类别，按同类逐片点数。斜放和大小不改变类别，圆没有直边。',
        explanation: `本图${names[shape]}材料实际有${counts[shape]}片。图案像什么不决定材料类别，同类片大小可以不同。`,
      });
    result.push({
      id: `${prefix}-${i}-types`,
      knowledge: `${id}-${i}-types`,
      prompt:
        '作品实际用了哪些类别的材料？选择全部有出现的类别，不选择没有出现的。',
      visual,
      choices: planeShapes.map((shape) => ({ id: shape, label: names[shape] })),
      rule: {
        kind: 'set',
        values: planeShapes.filter((shape) => counts[shape] > 0),
      },
      hint: '每类至少找到一片才选择；多片同类仍是一类。',
      explanation:
        '类别数与片数不同。只按原始材料轮廓分类，不因作品名称或颜色新增类别。',
    });
  }
  const scope = [
    {
      key: 'plan',
      prompt: review
        ? '新作品准备开始，哪一种顺序便于安排材料？'
        : '自己创作前，先怎样准备？',
      good: '先说想拼什么、需要哪些图形，再准备和摆拼',
      bad: '先随便剪，最后不用核对材料',
      hint: '先计划再动手，剪裁请家长协助。',
      explanation:
        '可以先说或画想法，再准备材料、摆拼检查和整理，不要求唯一作品。',
    },
    {
      key: 'story',
      prompt: review
        ? '同一作品，一个人看成飞船，另一个人看成小鸟，必须只保留示例名称吗？'
        : '自己给作品讲故事，只能照课本说同一个名称和故事吗？',
      good: '不用，说明自己的观察和故事即可',
      bad: '必须，只有示例故事正确',
      hint: '想象作品含义是开放任务，材料计数按实际图。',
      explanation: '开放故事保留多种合理表达，不由客观题评分替代孩子讲述。',
    },
    {
      key: 'count',
      prompt: review
        ? '三个三角片拼成大三角形，统计材料时要再加一片大三角形吗？'
        : '两片纸拼成新轮廓，数原始材料时要把新大轮廓再算一片吗？',
      good: '不用，只数实际准备的原始片',
      bad: '需要，所有大小轮廓都加进材料数',
      hint: '材料统计与综合数图的任务范围不同。',
      explanation:
        '统计创作所用材料每片只数一次；综合数图另有明确范围，不能混用。',
    },
    {
      key: 'feedback',
      prompt: review
        ? '同伴作品摆法不同，怎样交流更合适？'
        : '展示作品时，怎样给同伴建议？',
      good: '先听想法，核对材料，说具体喜欢处和可改进处',
      bad: '和示例不同就判错，不听解释',
      hint: '描述真实看到的部分，不把创作判成唯一图案。',
      explanation:
        '交流和反思记录原话，区别客观计数是否准确与作品创意是否清楚。',
    },
  ];
  for (const item of scope)
    result.push({
      id: `${prefix}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: item.hint,
      explanation: item.explanation,
    });
  return result;
}
export const sujiaoMixedCollagesDraft: Lesson = {
  id,
  title: '混合图形创作：材料统计与作品故事',
  textbookTitle: '图形的拼组·用不同图形拼与反思评价',
  page: 35,
  version: 1,
  status: 'preparing',
  goal: '观察混合图形作品，按原始材料分类计数，先计划后创作，讲述故事、展示交流并记录反思。',
  prerequisite: '认识四类平面图形，会逐片点数到10，能说一个简单想法。',
  parentTip:
    '依据已读35页实践，本站作品全部原创，不复制教材五幅图。图示只供观察，字母追踪材料，作品含义不设唯一答案。材料片统计不数几片合出的新大轮廓。家长协助安全准备材料；没有实物可跳过人工任务。计划、故事与反思按原话保存，不冒充客观正确或真实制作完成。',
  steps: [
    {
      title: '图案像什么，材料是什么',
      text: '先观察完整作品，说它让你想到什么，再逐片辨认长方形、正方形、三角形和圆。同一个图案可以引起不同想象，但原始材料的边界和类别可以核对。字母标的是一片材料，不是答案，不按作品名称分类。',
      visual: collageModel(0),
      activity:
        '指着作品说自己的想象，再逐片说材料类别，不强求与示例名称相同。',
    },
    {
      title: '按类别统计，不重复数大轮廓',
      text: '先选一种类别，把对应材料逐片点完，再换另一种；每片只记录一次。几片拼成的大轮廓不是新增材料。材料多少与类别多少分开：一类可以有好几片，没有某类就记0。所有作品保持共同显示比例，不用颜色或大小代替形状分类。',
      visual: collageModel(1),
      activity: '用真实混合纸片试拼，按四类逐片点数，核对各类数量与全部片数。',
    },
    {
      title: '先计划，再准备自己的作品',
      text: '先说想拼什么，画个小草图，列出准备哪些图形。再请家长协助剪或拿现成纸片，摆好后核对材料，必要时调整；涂色与展示可以按自己的想法。不会因为网页答对，就自动记成真实作品完成。',
      visual: collageModel(2),
      activity:
        '准备一个自己的作品计划，安全摆拼、检查、整理材料，作品允许多解。',
    },
    {
      title: '讲一个故事，展示并互评',
      text: '给自己的作品起一个名字，说发生了什么，可以指着图形说明故事角色。向家长或同伴展示，先听对方的想法，再说具体喜欢的地方或建议。最后记下自己的收获、困难或下次计划；故事和反思没有唯一句子，不计客观题对错。',
      visual: collageModel(3),
      activity:
        '展示自己的真实作品，讲一个简短故事，邀请同伴反馈并记下自己想改进的一点。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '先说明或画出想拼的作品计划，列出所需图形，请家长协助准备材料；按计划实际摆拼并检查整理。',
      '统计自己的真实作品：逐片分类，记录四类各有几片和总片数；没有某类记0，不把新大轮廓重复计为材料。',
      '展示自己的作品，讲一个简短故事；听家长或同伴反馈，交流一个具体喜欢处和一个可改进处。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '只有真实做完才确认，图示观察与文字记录不替代实物；没有材料可以跳过。',
      explanation: '实际创作、统计和交流人工记录，开放作品不判唯一摆法。',
    })),
    ...[
      {
        key: 'art-story',
        prompt: '记下自己作品的名字、想法或小故事，可以由家长按孩子原话代写。',
      },
      {
        key: 'reflection',
        prompt:
          '你从拼图中发现了什么？同伴说了什么建议？下次想怎样改进？记自己的话。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      rule: { kind: 'reflection' },
      hint: '记录自己的表达，没有固定句子；最多1000字符。',
      explanation: '原话独立保存，不评唯一答案，不代替实物完成确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读混合图形实践与原创材料统计核验',
    notes: `依据ISBN ${source.isbn}印刷35页，混合图形、分类计数、先计划后制作、故事展示与互评反思。四组作品原创，共同比例且材料边界可辨；复习改变位置、材料类别与数量，作品名称和故事不评唯一答案。版次印次仍未核验，完整单元与全册审核尚未完成。`,
  },
};
