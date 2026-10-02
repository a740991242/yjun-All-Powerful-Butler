import type { Lesson, Question, Visual } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-observation-review';
function tasks(review: boolean): Question[] {
  const variant = review ? 'review' : 'main';
  const choice = (
    key: string,
    prompt: string,
    visual: undefined | Visual,
    choices: { id: string; label: string }[],
    value: string,
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    ...(visual ? { visual } : {}),
    choices,
    rule: { kind: 'choice', value },
    hint: '先确认观察位置、朝向、物体是否移动、运动方向与起止条件。已知条件与未观察的部分分开，图片字母不是时间编号。',
    explanation,
  });
  return [
    choice(
      'jug-side',
      `当前${review ? '旋转后的' : '主课'}茶壶位置图中，${review ? 'D' : 'A'}看到壶嘴在画面的哪一边？`,
      { kind: 'viewpoint-jug', variant },
      [
        { id: 'left', label: '画面左边' },
        { id: 'right', label: '画面右边' },
      ],
      review ? 'left' : 'right',
      '左右按观察者面对的方向判断；两侧都见嘴把，也不表示排列相同。',
    ),
    choice(
      'house-door',
      '当前小屋盒中，正对一扇门的是哪个位置？',
      { kind: 'viewpoint-house', variant },
      ['A', 'B', 'C', 'D'].map((letter) => ({
        id: letter,
        label: `${letter}位置`,
      })),
      review ? 'D' : 'C',
      '先确认本次盒面朝向，再匹配特征；转盒后旧位置不一定还对着门。',
    ),
    choice(
      'cup-hidden',
      '当前摆放中，哪个位置的小杯被大盒完整挡住？只按给定平视条件。',
      { kind: 'occlusion-views', variant },
      ['A', 'B', 'C', 'D'].map((letter) => ({
        id: letter,
        label: `${letter}位置`,
      })),
      review ? 'C' : 'A',
      '被挡住的杯仍存在；实际眼高、距离与物体形状变了要重新观察。',
    ),
    choice(
      'approach-order',
      '同一车持续接近固定P，没有折返，三图从早到晚是什么顺序？',
      { kind: 'motion-frames', variant, scene: 'approach' },
      ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'].map((order) => ({
        id: order,
        label: [...order].join(' → '),
      })),
      review ? 'BCA' : 'BAC',
      '接近固定参照时由远到近，先看本次方向与帧位置，不能按网页字母顺序。',
    ),
    choice(
      'turn-order',
      '观察位置固定，模型按给定方向只转半圈，三幅图从早到晚怎样排？',
      { kind: 'motion-sequences', variant, scene: 'turn' },
      ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'].map((order) => ({
        id: order,
        label: [...order].join(' → '),
      })),
      review ? 'BCA' : 'BAC',
      '方向与起始朝向是条件；物体转动与观察者绕行不是同一种操作。',
    ),
    choice(
      'one-photo',
      `另一个未给清单的${review ? '书包旁' : '桌面'}场景，只给一张照片。能确定背后什么都没有吗？`,
      undefined,
      [
        { id: 'no', label: '不能，只看见的部分不足以确定被挡住的部分' },
        { id: 'yes', label: '能，照片没显示就是没有' },
      ],
      'no',
      '不把已知两物体场景套到未知清单，也不无依据断言一定藏着某件东西。',
    ),
    choice(
      'future-drawing',
      `原创纸路上，车从P${review ? '右侧持续向左' : '左侧持续向右'}经过P。后两张纸图没有给距离与速度，要求画可能的后续位置。怎样记录？`,
      undefined,
      [
        {
          id: 'possible',
          label: '结合方向与更晚时刻画合理位置，可有不同画法并说明条件',
        },
        { id: 'fixed', label: '每次必须前进相同格数，只有一种标准位置' },
      ],
      'possible',
      '未给固定速度、时刻间隔与距离，不能补造每次相同格数；也要先核对是否持续同向。',
    ),
    choice(
      'actual-observation',
      `你打算${review ? '明天' : '下次'}从不同位置看书包，现在还没做。能勾选实际观察已完成吗？`,
      undefined,
      [
        { id: 'no', label: '不能，计划单独记录，实际做后再确认' },
        { id: 'yes', label: '能，写好计划就算已经观察' },
      ],
      'no',
      '真实摆放、观察、记录与屏幕匹配不同，未做可暂跳，不虚构完成。',
    ),
  ];
}
const manuals = [
  {
    key: 'room',
    prompt:
      '实际在同一个房间的前后两个安全位置观察，分别说看到的物品、朝向与被挡住的部分；不记录地址或他人身份。没有合适场地可暂跳。',
  },
  {
    key: 'toy',
    prompt:
      '实际把同一安全玩具、纸制模型或有不同面标记的盒子固定，从前后或四侧观察并画自己的视图卡。标观察位置，再将卡打乱按位置配对；不同位置可能相同，按实际发现记录。',
  },
  {
    key: 'bag',
    prompt:
      '实际把同一书包或安全替代物放在桌上，物体不动，从不同位置观察并分别画或说看到的样子；不把小屋盒的单面条件照搬给真实书包。',
  },
  {
    key: 'camera',
    prompt:
      '实际用有不同面标记的盒或纸塔，给四个桌面观察位置编号，画一幅位置图与相应简图并配对。只在桌面模拟，不需要相机或无人机；斜看可能看到多个面，保留真实发现。',
  },
  {
    key: 'future',
    prompt:
      '实际在纸上画同一车持续沿一个方向的路旁参照图，再画两个更晚时刻可能的位置并口述条件。没有速度和间隔，允许不同合理距离；若可能停车、掉头或返回，应先说明条件，不去真实道路操作。',
  },
  {
    key: 'combined',
    prompt:
      '实际将安全空杯放在不透明较大物品的一侧，保持物体不动，换位置观察并记录完全挡住、部分露出或可见；再改摆放重新看。可用安全空塑料壶与杯，不用热水或玻璃器物；结果以实物为准。',
  },
];
export const sujiaoObservationReviewDraft: Lesson = {
  id,
  title: '观察单元整理：换位置、排先后与细看',
  textbookTitle: '观察物体·练习与评价整理',
  page: 84,
  version: 1,
  status: 'preparing',
  goal: '综合按位置辨认视图、按过程排先后；实际换位观察与开放画图独立记录，三项自评分别保留。',
  prerequisite:
    '已做茶壶、小屋盒、运动过程和遮挡课；安全房间或桌面、纸笔与可选安全模型。',
  parentTip: `依据ISBN ${source.isbn}印刷78～84页整单元实际核对。对应80页教室前后与不同物体视图、83页书包实际观察与位置编号、84页后续可能位置及三项评价；其余专题见已有独立课。本课自制玩具/标记盒/纸塔与纸路，不复制飞机、动物、房屋、无人机或人物原图。单面盒与真实物品条件分开，未来位置未给距离速度不补唯一答案。实际任务人工确认，自评不作能力分数；不要求拍摄或上传真实环境。`,
  steps: [
    {
      title: '不同物体，先核对特征与位置',
      text: '茶壶的嘴把、车头车尾、玩具前后、书包不同侧面，都能帮助比较视图。换位置可能看到不同，也可能看起来相同；要依据物体特征与实际可见范围，不说任何位置都必须不同。飞机的不同方向图是同一模型，不是几架飞机。',
      visual: { kind: 'viewpoint-jug', variant: 'main' },
      activity: '实际选择一件安全物品，从两侧观察并说相同或不同的部分。',
    },
    {
      title: '教室与书包要实际换位看',
      text: '同一房间从前后看，看到的方向、物品排列与遮挡可能不同；书包固定，观察者绕到不同位置，样子也可能改变。纸面记录观察位置与自己的简图，允许真实物品与网页模型不同。没有场地或未做如实记，不用计划代替已完成。',
      activity: '实际完成房间前后和书包换位两项观察，分别记录。',
    },
    {
      title: '位置编号不是照片答案',
      text: '小屋盒四面特征按当前朝向配对；编号只帮助说明观察位置。纸塔或真实玩具斜看可能同时见多个面，本课小屋盒才限定直对一个面。用安全桌面模拟位置编号，不需要使用相机、无人机或原书人物名字。',
      visual: { kind: 'viewpoint-house', variant: 'main' },
      activity: '实际画四个观察位置与自己看到的视图卡，重新配对。',
    },
    {
      title: '排先后时先读过程条件',
      text: '接近、离开、经过、下滑、两车相遇和模型转动已经分课学习。这里先确认方向、固定参照、同一物体与是否折返。图片字母不是时间。转模型时观察位置不动；换观察位置时物体可保持不动，两种变化要分清。',
      visual: { kind: 'motion-sequences', scene: 'turn', variant: 'main' },
      activity: '实际选择一种桌面过程，画三卡打乱再排并说明条件。',
    },
    {
      title: '后续可能位置与遮挡要开放记录',
      text: '只知道车持续同向而未给速度或时间间隔，后续位置可有不同合理画法，不能要求每次固定格数。再看大物品与小杯：单张轮廓不证明整个场景的物体数量，真实遮挡要改变观察位置核对，不能用擦掉屏幕大盒代替实物核验。',
      visual: { kind: 'occlusion-views', variant: 'main' },
      activity: '实际纸面画后续可能位置；桌面换位置看杯，两个活动独立确认。',
    },
    {
      title: '三项评价分别说明依据',
      text: '分别记录：辨认不同位置的样子、按事情发生顺序排图、仔细观察认真思考。每项写一个例子、还需帮助处或未做事实，可以不确定。评价不自动变成掌握分数，也不因为客观题答对就替你确认实物活动。',
      activity: '实际口述自己的过程，再记录三项开放自评；未来计划另列。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manuals.map(({ key, prompt }): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-manual-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际做完独立确认，可暂跳，保留真实条件和不同发现。',
      explanation: '网页答题不代替实物观察、纸面画图或真实表达。',
    })),
    ...[
      {
        key: 'viewpoints',
        prompt:
          '评价一：你怎样辨认不同位置看到的物体样子？记录实际例子、还需帮助或未观察的事实。',
      },
      {
        key: 'sequence',
        prompt:
          '评价二：你怎样按事情发生顺序排列图片？说一项已用条件或还不确定的过程。',
      },
      {
        key: 'careful',
        prompt:
          '评价三：你怎样做到仔细观察、认真思考？记录一次核对、修正或待尝试的计划，计划不算已完成。',
      },
    ].map(({ key, prompt }): Question => ({
      id: `${id}-evaluation-${key}`,
      knowledge: `${id}-evaluation-${key}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '按自己的话记录，可以还未做或不确定，不需要选能力星级。',
      explanation:
        '独立开放评价correct为null，不计入客观正确率，不自动确认任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '观察单元逐页范围与原创整理核验',
    notes: `ISBN ${source.isbn}78～84页来源范围；实际任务与三项评价分别记录，原创条件复习，未知版印次保留，不以自评宣称全年或教师审校完成。`,
  },
};
