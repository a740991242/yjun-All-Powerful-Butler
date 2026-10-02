import type { Lesson, Question, Visual } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-occlusion';
function tasks(review: boolean): Question[] {
  const visual: Visual = {
    kind: 'occlusion-views',
    variant: review ? 'review' : 'main',
  };
  const mapping = review ? ['4', '3', '1', '2'] : ['2', '4', '3', '1'];
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt: `${review ? '复习杯已移到大盒正上方，候选重排。' : '主课杯在大盒正下方。'}${prompt}`,
    visual,
    hint: '先找观察者所在方向，沿箭头看。杯在眼前还是在大盒后？面对方向不同，画面左右可能交换。已知物体数与看到的轮廓数分别判断。',
  });
  const choice = (
    key: string,
    prompt: string,
    choices: { id: string; label: string }[],
    value: string,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    choices,
    rule: { kind: 'choice', value },
    explanation,
  });
  const observers = ['A', 'B', 'C', 'D'].map((letter) => ({
    id: letter,
    label: `${letter}位置`,
  }));
  const noYes = [
    { id: 'no', label: '不能，需要核对给定条件或换位置观察' },
    { id: 'yes', label: '能，只看这张图就足够判断' },
  ];
  return [
    ...['A', 'B', 'C', 'D'].map((letter, i): Question =>
      choice(
        `observer-${letter}`,
        `${letter}正对观察时，看到哪幅候选图？杯与盒不移动，不斜看或俯看。`,
        [1, 2, 3, 4].map((n) => ({ id: String(n), label: `候选图${n}` })),
        required(mapping[i]),
        `按本次摆放与观察者朝向，${letter}对应候选${mapping[i]}，不能记旧编号。`,
      ),
    ),
    choice(
      'hidden-observer',
      '按本次固定摆放，哪位眼前小杯被大盒完整挡住？',
      observers,
      review ? 'C' : 'A',
      '沿同一直线，大盒在近处，小杯较远且窄、矮，视图中被完整遮住。',
    ),
    {
      ...base(
        'known-total',
        '题目明确摆放一个大盒和一个小杯。整个场景实际有几个物体？',
      ),
      rule: { kind: 'number', value: 2 },
      explanation:
        '已知摆放是一个盒和一个杯，共2个；轮廓被挡住不减少实际物体。',
    },
    {
      ...base(
        'visible-outlines',
        `${review ? 'C' : 'A'}按本课正对、完全遮挡条件看，眼前可分辨几件物体的轮廓？只数可见，不问已知实际总数。`,
      ),
      rule: { kind: 'number', value: 1 },
      explanation: '这里只见大盒轮廓，小杯完全被挡；可见1不等于实际只有1。',
    },
    choice(
      'not-disappear',
      `${review ? 'C' : 'A'}没有看到杯轮廓，就能说已知摆在这里的杯子消失了吗？`,
      noYes,
      'no',
      '杯仍在原位，只是被挡住。可以换位置核对，不能把没看见说成消失。',
    ),
    choice(
      'picture-left',
      '本次哪位会看到杯在自己的画面左边、盒在右边？“画面左”按本人面对方向判断。',
      observers,
      review ? 'D' : 'B',
      '站在另一侧面对时，画面左右交换；不能把位置图上方或下方直接叫画面左。',
    ),
    choice(
      'front-not-hide-all',
      `${review ? 'A' : 'C'}看见杯轮廓在盒前方重合，就能说小杯把整个大盒完整挡住了吗？`,
      noYes,
      'no',
      '小杯窄且矮，画面仍能见大盒上部，局部重合不等于完全遮挡。',
    ),
    choice(
      'verify',
      '不移动杯和盒，想核对被挡住的小杯仍在，应怎样做？',
      [
        {
          id: 'move-observer',
          label: '保持物体不动，换到旁边或另一侧实际观察',
        },
        { id: 'erase', label: '只把候选图中的大盒擦掉，算完成真实核对' },
        { id: 'remove-cup', label: '把杯拿走，再说原场景没有杯' },
      ],
      'move-observer',
      '改变观察位置能检查原场景；改画面或移除杯改变条件，不能当原场景核验。',
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-unknown-total`,
      knowledge: `${id}-unknown-total`,
      prompt: `${review ? '复习另一个未给物体清单的场景。' : '另一个未给物体清单的新场景。'}只给一张“大盒轮廓”的照片，没有本课位置图和已知摆放说明。能肯定整个场景恰好只有一个物体吗？`,
      choices: noYes,
      rule: { kind: 'choice', value: 'no' },
      hint: '这不是上面的已知两件摆放。照片只告诉可见部分，不能凭空确定隐藏部分。',
      explanation:
        '未给清单时，只见一个轮廓不能证明实际总数为1，也不能无依据断言一定还有一个杯。',
    },
  ];
}
export const sujiaoOcclusionDraft: Lesson = {
  id,
  title: '观察与遮挡：换位置找小杯',
  textbookTitle: '观察物体·遮挡与可见范围',
  page: 84,
  version: 1,
  status: 'preparing',
  goal: '按固定摆放与观察者朝向判断小杯可见、遮挡和画面左右，区分已知实际物体数与单张图可见轮廓数。',
  prerequisite:
    '已学观察位置与单面视图；准备不透明大盒和比盒窄、矮的空小杯，安全桌面。',
  parentTip: `ISBN ${source.isbn}实际查看印刷84页茶壶与小杯从不同位置观察的匹配活动，本站原创无标记方盒与小杯模型，不复制茶壶插图。大盒四侧相同；沿中心正对、小杯矮窄、在同一桌面且在视线中完全被挡等条件明确。实际透视、眼高和距离会改变遮挡，应以真实观察核对。本课不替代茶壶壶嘴把手多角度活动或整单元。`,
  steps: [
    {
      title: '先看摆放，位置图不是眼前照片',
      text: '已知一个不透明大盒和一个小杯。主课杯在位置图正下方，与盒中心对齐，四人正对观察。位置图告诉摆放，不表示大家眼前都能同时看到盒与杯。盒不透明，不能透视。',
      visual: { kind: 'occlusion-views', variant: 'main' },
      activity:
        '实际摆不透明大盒和更窄更矮的小杯，先画位置示意，杯不要装热水。',
    },
    {
      title: '近处大盒挡住远处杯',
      text: 'A从图上方朝下看，大盒近、小杯远；按本课条件完全挡住杯。C从下方朝上看，杯在前方，仍能见盒上部。已知物体始终2件，A可见轮廓只有1件；杯没消失。',
      visual: { kind: 'occlusion-views', variant: 'main' },
      activity:
        '实际降低视线并正对检查杯被遮挡的条件；再到对面看杯，记录是否完全或部分遮挡。',
    },
    {
      title: '画面左右按观察者判断',
      text: 'B从图右侧向左看，杯在自己的画面左边；D从图左侧向右看，杯在自己的画面右边。两人面对方向相反，看到的左右关系不同，物体并没有换位置。',
      visual: { kind: 'occlusion-views', variant: 'main' },
      activity: '实际站到盒两侧，分别口述自己眼前左右。不要只照搬位置图。',
    },
    {
      title: '杯移到另一侧，重新判断',
      text: '复习杯移到图上方、盒与人位置不变。现在A看杯在前，C看杯被盒挡住，B看杯在右，D看杯在左。候选照片重排，原编号不能照搬。移杯改变摆放；换人位置改变观察，二者分开。',
      visual: { kind: 'occlusion-views', variant: 'review' },
      activity: '实际移杯到另一侧再观察，并说明改变的是哪个条件。',
    },
    {
      title: '已知总数与未知场景分开',
      text: '已知摆放说明能确定盒和杯共2件，即使某张图只见盒。另一个未给清单的场景，仅见盒轮廓不能确定总共1件，也不能断言一定藏杯。真实眼高、角度或距离改变，可见范围会改变，要观察后记录。',
      activity:
        '实际换一个安全物品，先记录已知摆放，再记录看到什么和仍不确定什么。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用不透明大盒与较小空杯摆放，正对降低视线观察，记录杯完全挡住、部分露出或未挡住；以实际发现为准。',
      '物体不动，实际换到两侧和对面，口述自己眼前左右与杯是否可见，分别记录观察位置。',
      '实际移杯到盒另一侧后再次观察，画位置图与一幅眼前简图，说清移动物体和移动观察者的区别。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '完成实际摆放、观察或画图/口述后独立确认，可暂跳；不要求真实结果必须与简化图一致。',
      explanation: '实物条件与屏幕示意分别记录，网页匹配不自动确认真实观察。',
    })),
    {
      id: `${id}-own-observation`,
      knowledge: `${id}-own-observation`,
      prompt:
        '记录你实际盒与杯的摆放、观察位置和杯被完全挡住/部分露出/可见的情况。写一个可能影响结果的条件。',
      rule: { kind: 'reflection' },
      hint: '按实际发现写，不必与示意图相同。',
      explanation: '开放观察null，不用固定可见结果评分。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '“没看见”和“没有”有什么不同？写下你想通过换位置核对的一件事。',
      rule: { kind: 'reflection' },
      hint: '保留原话和待核验之处。',
      explanation: '过程反思null，与实物任务独立。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读遮挡活动与原创明确条件核验',
    notes: `ISBN ${source.isbn}印刷84页相关范围，原创不透明盒杯模型与变位复习；版权版次印次未知，非整单元完成。`,
  },
};
