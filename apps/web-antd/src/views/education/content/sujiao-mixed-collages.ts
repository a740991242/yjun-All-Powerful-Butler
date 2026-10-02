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
  version: 2,
  status: 'preparing',
  goal: '观察混合图形作品，按原始材料分类计数，先计划后创作，讲述故事、展示交流并记录反思。',
  prerequisite: '认识四类平面图形，会逐片点数到10，能说一个简单想法。',
  parentTip:
    '依据已读35页实践，本站作品全部原创，不复制教材五幅图。字母追踪材料，作品含义不设唯一答案。材料片统计不数几片合出的新大轮廓。家长协助安全准备材料；没有实物可跳过人工任务。实际照样制作、涂色、展示分别记录；教室展览需教师与作者同意，家中展示如实注明，不冒称全班展览，不上传身份或作品。计划、故事与反思按原话保存，不冒充客观正确或真实制作完成。',
  steps: [
    {
      title: '图案像什么，材料是什么',
      text: '先观察完整作品，说它让你想到什么，再逐片辨认长方形、正方形、三角形和圆。同一个图案可以引起不同想象，但原始材料的边界和类别可以核对。字母标的是一片材料，不是答案，不按作品名称分类。',
      visual: collageModel(0),
      activity:
        '指着作品说自己的想象，再逐片说材料类别；请家长协助准备对应纸片，照当前原创图实际摆一遍，比较类别、位置与整体，不强求同一个作品名称。',
    },
    {
      title: '按类别统计，不重复数大轮廓',
      text: '先选一种类别，把对应材料逐片点完，再换另一种；每片只记录一次。几片拼成的大轮廓不是新增材料。材料多少与类别多少分开：一类可以有好几片，没有某类就记0。所有作品保持共同显示比例，不用颜色或大小代替形状分类。',
      visual: collageModel(1),
      activity: '用真实混合纸片试拼，按四类逐片点数，核对各类数量与全部片数。',
    },
    {
      title: '先计划，再准备自己的作品',
      text: '先说想拼什么，画个小草图，列出准备哪些图形。再请家长协助剪或拿现成纸片，摆好后核对材料，必要时调整；用适龄绘画材料实际涂上自己的颜色，不把看见网页颜色当成自己涂过。没有材料的步骤如实待做。不会因为网页答对，就自动记成真实作品完成。',
      visual: collageModel(2),
      activity:
        '准备一个自己的作品计划，安全摆拼、实际涂色、检查、整理材料，作品允许多解。',
    },
    {
      title: '讲一个故事，展示并互评',
      text: '给自己的作品起一个名字，说发生了什么，可以指着图形说明故事角色。向家长或同伴展示，先听对方的想法，再说具体喜欢的地方或建议。征求作者同意后选愿意展示的作品，由教师安排教室展览；也可以在家中摆放并请家长观看，如实记为家庭展示。不要记录他人的姓名或上传作品；没有实际展示就保留待做。',
      visual: collageModel(3),
      activity:
        '展示自己的真实作品，讲一个简短故事，邀请同伴反馈并记下自己想改进的一点。',
    },
    {
      title: '分开回顾数字、图形联系和创作',
      text: '回顾正方形拼数字时，分清想表示的数字与实际用了几片。回顾不同图形之间的联系，可说自己的三角片怎样合成长方形或正方形，指出具体摆法与条件，不能把任何三角片都说成能拼满。再说混合图案让你想到什么、创作与交流有哪些发现。三个方面分别记真实想法，可以写还不清楚或尚未实践；未来想试的事写成计划，不自动评星。',
      visual: collageModel(0),
      activity:
        '分别记录数字拼图、具体图形联系和混合创作的发现，再和家长或同伴交流本次实际表现；允许不同表达。',
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
        key: 'manual-3',
        prompt:
          '按这幅原创作品准备相应类别的真实纸片，照样摆拼一次，逐片比较位置与完整作品。再给自己的作品实际涂色，检查后整理材料；没有纸片或绘画材料的部分如实待做，网页看图不代替。',
        visual: collageModel(0),
      },
      {
        key: 'manual-4',
        prompt:
          '征求作者同意后，从本次实际完成的作品中选愿意展示的作品，并由教师安排教室展览。也可在家中摆放自己的作品并请家长观看，如实说明是家庭展示；未展示可跳过，不上传姓名或作品，不冒称班级评选。',
      },
    ].map((item): Question => ({
      id: `${id}-${item.key}`,
      knowledge: `${id}-${item.key}`,
      prompt: item.prompt,
      ...('visual' in item ? { visual: item.visual } : {}),
      rule: { kind: 'manual' },
      hint: '只确认实际完成的任务，材料缺少或展示未安排时如实待做。',
      explanation: '照样制作、涂色与展览人工记录，计划和网页操作不算实际完成。',
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
      {
        key: 'reflection-digits',
        prompt:
          '回顾用正方形拼0～9：表示的数字与实际片数有什么不同？哪一种自己的摆法或数法让你有发现？还没有做可以如实写待尝试。',
      },
      {
        key: 'reflection-relations',
        prompt:
          '不同图形之间，你发现了怎样的联系？举自己实际摆过或清楚观察过的一个例子，说明用了哪些片、怎样接齐；还不清楚也可以记录，不推广到任意材料。',
      },
      {
        key: 'reflection-creation',
        prompt:
          '混合图形创作让你想到什么？本次实际准备、制作或交流表现怎样？和家长或同伴交流，再记真实收获或困难；下次想做的事单独写为计划。',
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
