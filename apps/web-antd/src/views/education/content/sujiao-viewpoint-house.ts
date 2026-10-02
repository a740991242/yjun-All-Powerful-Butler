import type { Lesson, Question, Visual } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-viewpoint-house';
function tasks(review: boolean): Question[] {
  const visual: Visual = {
    kind: 'viewpoint-house',
    variant: review ? 'review' : 'main',
  };
  const mapping = review ? ['1', '4', '2', '3'] : ['4', '1', '2', '3'];
  const features = review
    ? ['空白墙面', '两扇窗', '一个圆标记', '一扇门']
    : ['两扇窗', '一个圆标记', '一扇门', '空白墙面'];
  const doorObserver = review ? 'D' : 'C';
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual,
    hint: '先找观察者位置与朝向，再找对应面的已知特征，最后匹配候选图。位置图是俯视示意，不是照片；不透明物体不能透视到背面，不因照片编号固定记答案。',
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
  return [
    ...['A', 'B', 'C', 'D'].map((letter, i): Question =>
      choice(
        `observer-${letter}`,
        `${review ? '复习已旋转小屋盒并重排候选。' : '物体与观察者位置按图固定。'}${letter}直对面中央看，只拍眼前一个竖直面，看到哪幅候选图？`,
        [1, 2, 3, 4].map((n) => ({ id: String(n), label: `候选图${n}` })),
        required(mapping[i]),
        `${letter}对应面特征是${features[i]}，匹配本次候选${mapping[i]}；不按旧编号。`,
      ),
    ),
    choice(
      'door-observer',
      `本次${review ? '旋转后的' : '原来固定的'}小屋盒，要拍到一扇门，应站哪个观察者位置？只按当前特征判断。`,
      ['A', 'B', 'C', 'D'].map((letter) => ({
        id: letter,
        label: `${letter}位置`,
      })),
      doorObserver,
      `门面在${review ? '图左方，对应D' : '图下方，对应C'}，不因“门”就默认画面上方。`,
    ),
    {
      ...base(
        'one-object',
        `本次${review ? '旋转后' : '原图'}有四幅单面候选照片，它们都描述同一个小屋盒。实际观察了几个物体？`,
      ),
      rule: { kind: 'number', value: 1 },
      explanation: '四幅照片是一个物体的不同面，照片数不等于物体数。',
    },
    choice(
      'hidden-face',
      `站${review ? 'A' : 'D'}看到本次空白墙面，就能说这个盒子所有面都没有门窗和圆标记吗？`,
      [
        { id: 'no', label: '不能，别的面被挡住，需要换位置或核对已知条件' },
        { id: 'yes', label: '能，看到一个空白面就是整个盒子都空白' },
      ],
      'no',
      '一面的样子不能代替整个物体，遮挡不是不存在。',
    ),
    choice(
      'not-always-different',
      `换一个四周全无标记的方盒，不是当前${review ? '已旋转' : '有门窗'}小屋盒。从不同侧面直看，照片一定都不同吗？`,
      [
        {
          id: 'not-always',
          label: '不一定，不同位置可能看到相同样子，要看物体特征',
        },
        { id: 'always', label: '一定，只要位置不同就必须不一样' },
      ],
      'not-always',
      '当前盒四面特征不同，但不能推广成所有物体一定如此；对称或相同面的物体可看起来一样。',
    ),
    choice(
      'plan-not-photo',
      `本次${review ? '复习' : '主课'}位置图在盒顶外用文字说明四个面的特征，这表示从上方已经透过盒顶看到所有竖直面了吗？`,
      [
        { id: 'no', label: '不是，那是给定特征标注；位置示意不等于实拍照片' },
        { id: 'yes', label: '是，俯视可以透过不透明盒顶看到四面' },
      ],
      'no',
      '位置图帮助找位置，特征是已知信息，不是假设不透明物体透明。',
    ),
    choice(
      'straight-on-limit',
      `${review ? '旋转后的' : '原来的'}盒子不透明，本课站在一个面的正对面、高度在面中央，不绕到角上。此时能在一张直视示意中看到四个竖直面的全部特征吗？`,
      [
        { id: 'no', label: '不能，本课只取眼前这个面的直视样子' },
        { id: 'yes', label: '能，一张直视图自动展示所有面' },
      ],
      'no',
      '这里明确限定直对单面；斜着看或从上方看是不同条件，要另行观察。',
    ),
  ];
}
export const sujiaoViewpointHouseDraft: Lesson = {
  id,
  title: '观察位置与照片：小屋盒的四个面',
  textbookTitle: '观察物体·位置与视图匹配',
  page: 80,
  version: 1,
  status: 'preparing',
  goal: '根据位置、朝向与明确特征匹配单面视图，区分位置示意、候选照片和整个物体，不透视或固定记编号。',
  prerequisite: '能辨认图上的上下左右；准备一个不透明盒子与可移除纸标记。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷80页相机与小屋照片匹配、83页观察活动，本站自制小屋盒单面模型，不复制教材房屋照片。四个竖直面分别门/两窗/圆/空白，仅直对面中央观察。复习把同一盒顺时针转四分之一圈并重排候选。示意已知四面标注不是俯视透视；此课不代替茶壶遮挡、运动排序或整单元。`,
  steps: [
    {
      title: '位置图与照片不是同一张图',
      text: '图上A在上方、B右方、C下方、D左方，箭头都向中心。中间画盒顶，外面文字告诉各面的已知特征，不表示从上方看见或透视竖直面。候选图才是直对一个面看到的样子。',
      visual: { kind: 'viewpoint-house', variant: 'main' },
      activity:
        '实际给盒子四个竖直面分别加门、两窗、圆与空白标记，画观察者位置。',
    },
    {
      title: '先找位置，再找面对的特征',
      text: '本课盒子固定、视线垂直面对墙中央。A面向图上侧两窗面，所以对应两窗候选；C面向下侧门面。先判断面对哪一面，再找图，不能先猜照片编号。',
      visual: { kind: 'viewpoint-house', variant: 'main' },
      activity: '实际从两个相对位置平视盒面，用自己的话说所见特征。',
    },
    {
      title: '空白的一面不代表整个盒子',
      text: 'B看圆面，D看空白面。D看不到门窗，不等于其它面没有。四幅候选是同一个盒子的四个单面示意，不是四个盒子。斜看角或俯视会改变可见范围，不混用本课条件。',
      visual: { kind: 'viewpoint-house', variant: 'main' },
      activity: '实际从空白面换到门面，解释没看见与不存在的区别。',
    },
    {
      title: '物体转了，位置不动也要重新看',
      text: '复习将同一盒顺时针转四分之一圈，观察者仍在原位；上侧变空白、右侧两窗、下侧圆、左侧门，候选也重排。盒子总数不变，面上的标记没变，只是朝向与编号变了。',
      visual: { kind: 'viewpoint-house', variant: 'review' },
      activity:
        '实际转盒但不移动观察位置，逐面重新确认；不要把屏幕图点击当成真实转盒。',
    },
    {
      title: '真实观察，保留不同发现',
      text: '有特征不同的物体，从不同位置可能看见不同样子；另一个四侧都空白的盒子却可能看起来相同。不能说位置不同就一定不同，也不能只一面判断整个物体。真实观察、纸面画图与口述独立确认。',
      activity: '实际另选安全物品换位置观察，可画简图记录不同或相同之处。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际给不透明盒四面加不同纸标记，固定盒子从四个正对面中央的位置观察并记录特征，不用透明盒代替。',
      '实际画观察位置与单面简图，说明位置图的特征标注不是透视；四幅图仍来自一个盒子。',
      '实际只转盒不移动观察位置，重新核对各面；再观察一个安全物品，口述没看到与不存在的区别。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '完成实际摆放/观察/画图/口述后独立确认，可暂跳。',
      explanation: '网页匹配答案不自动确认真实观察或转盒。',
    })),
    {
      id: `${id}-own-observation`,
      knowledge: `${id}-own-observation`,
      prompt:
        '记下你实际观察的安全物品与两个位置看到的样子，可以相同或不同，不强制与小屋盒一样。',
      rule: { kind: 'reflection' },
      hint: '保留真实发现，不猜看不到的部分。',
      explanation: '开放观察null，不按固定作品评分。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '你怎样先找位置再找特征？记录一个发现或待核对之处。',
      rule: { kind: 'reflection' },
      hint: '按原话记录。',
      explanation: '反思null，与实际任务独立。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读观察位置匹配与原创单面条件核验',
    notes: `ISBN ${source.isbn}印刷80、83页范围，原创模型与转向复习；未知版权版次印次，不据单课宣布完整单元。`,
  },
};
