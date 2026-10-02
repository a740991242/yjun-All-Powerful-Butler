import type { Lesson, Question, Visual } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-motion-order';
function tasks(review: boolean): Question[] {
  const variant = review ? 'review' : 'main';
  const orders = review ? ['BCA', 'ACB', 'CBA'] : ['BAC', 'BCA', 'BCA'];
  const first = 'B';
  const last = review ? 'A' : 'C';
  const visual = (scene: 'approach' | 'depart' | 'pass'): Visual => ({
    kind: 'motion-frames',
    variant,
    scene,
  });
  const base = (
    key: string,
    prompt: string,
    scene: 'approach' | 'depart' | 'pass',
  ) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt: `${review ? '复习换成向左行驶的新图。' : '主课车一直向右行驶。'}${prompt}`,
    visual: visual(scene),
    hint: '先读行驶方向，固定P不动；比较同一辆车的位置。向P接近是远到近，离开是近到远，经过要看是否已到P另一侧。编号不代表时间。',
  });
  const choices = ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'].map((value) => ({
    id: value,
    label: [...value].join(' → '),
  }));
  const choice = (
    key: string,
    prompt: string,
    scene: 'approach' | 'depart' | 'pass',
    value: string,
    explanation: string,
    options = choices,
  ): Question => ({
    ...base(key, prompt, scene),
    choices: options,
    rule: { kind: 'choice', value },
    explanation,
  });
  const letters = ['A', 'B', 'C'].map((letter) => ({
    id: letter,
    label: `图片${letter}`,
  }));
  return [
    choice(
      'approach-order',
      '三图都是车尚未到P、持续接近P的过程，按最早到最晚排列。',
      'approach',
      required(orders[0]),
      '先离P远，随后较近，最后最近；按当前行驶方向重新判断。',
    ),
    choice(
      'approach-first',
      '持续接近P的三图中，最早拍到哪幅？',
      'approach',
      first,
      '三图都在接近过程，最早车离P最远。',
      letters,
    ),
    choice(
      'approach-last',
      '持续接近P的三图中，最后拍到哪幅？',
      'approach',
      last,
      '最后车离P最近；不是默认最后摆出的C图。',
      letters,
    ),
    choice(
      'depart-order',
      '三图都是车已经过P、继续离开P的过程，按最早到最晚排列。',
      'depart',
      required(orders[1]),
      '离开固定P时先近再远，不把接近的远到近照搬。',
    ),
    choice(
      'pass-order',
      '三图从P一侧到P附近，再到另一侧，是同一辆车持续经过P的过程。按最早到最晚排列。',
      'pass',
      required(orders[2]),
      '按车的行驶方向逐步看位置，最远不一定最早；P两边都可能离P远。',
    ),
    choice(
      'pass-last',
      '一直沿箭头方向行驶，三幅经过P的图中，最后是哪幅？',
      'pass',
      'A',
      '驶过P并继续前行，最后在运动方向上更靠前的位置。',
      letters,
    ),
    choice(
      'distance-not-time',
      '经过P的两侧都可能离P远。能只凭“离P远”就断定那张一定最早吗？',
      'pass',
      'no',
      '距离远不能单独确定经过过程的早晚，需运动方向与所在一侧。',
      [
        { id: 'no', label: '不能，还要看行驶方向与P的哪一侧' },
        { id: 'yes', label: '能，离P远的一定最早' },
      ],
    ),
    choice(
      'same-size',
      '三图车画得一样大。因为大小没变，就能说车没有移动吗？',
      'approach',
      'no',
      '本课侧面位置示意用相同大小画同一车，位置改变仍说明运动。',
      [
        { id: 'no', label: '不能，本图根据车与固定P的位置判断' },
        { id: 'yes', label: '能，图中大小不变就是车没移动' },
      ],
    ),
    choice(
      'conditions',
      '如果另一次车会掉头、P也移动，而且只给三张未注明情况的照片，能直接照搬本课顺序吗？',
      'depart',
      'no',
      '顺序判断依赖同一物体、固定参照与持续同方向等已知条件，缺条件先核对。',
      [
        { id: 'no', label: '不能，要先核对实际过程和参照是否固定' },
        { id: 'yes', label: '能，所有三张照片都是同一种顺序' },
      ],
    ),
    {
      ...base(
        'one-car',
        '这些照片明确来自同一辆车的三个时刻。实际有几辆车？',
        'pass',
      ),
      rule: { kind: 'number', value: 1 },
      explanation: '一辆车在不同时刻被拍三次，照片数不等于车的数量。',
    },
  ];
}
export const sujiaoMotionOrderDraft: Lesson = {
  id,
  title: '运动先后：接近、离开与经过',
  textbookTitle: '观察物体·运动过程排序',
  page: 81,
  version: 1,
  status: 'preparing',
  goal: '在同一物体、固定参照与持续同方向条件下，按位置判断接近、离开与经过的先后，区分距离、编号与时间。',
  prerequisite: '能辨认左右和箭头；准备一辆安全玩具车、纸路标和三张纸。',
  parentTip: `ISBN ${source.isbn}实际读印刷81页火车接近/离开与82页汽车经过的时序活动；本站原创侧面玩具车与固定P路标，不复制原图。本课不推断速度，不用画面大小作为时间，P在路旁不是车道上的障碍。滑梯、相遇和转动物体见独立运动过程课，本课不重复其内容。`,
  steps: [
    {
      title: '编号不是时间，先读条件',
      text: 'A/B/C是三张照片的名字，排在网页上的顺序不代表发生顺序。同一辆车一直向箭头方向走，P路标不移动，观察方向也不改变；先确认这些条件。',
      visual: { kind: 'motion-frames', variant: 'main', scene: 'approach' },
      activity: '实际在桌旁放P纸标，画直路，车只能向右走，不掉头。',
    },
    {
      title: '接近固定P：先远后近',
      text: '车还未到P，一直向P接近。主图B最远，A较近，C最近，所以先B、再A、后C。这里看车的位置，不按图片编号，也不靠车画得大或小。',
      visual: { kind: 'motion-frames', variant: 'main', scene: 'approach' },
      activity: '实际让玩具车向P接近，停三次画位置，打乱纸卡后重排。',
    },
    {
      title: '离开固定P：先近后远',
      text: '车已经过P，一直远离P。先较近的B，再C，最后最远的A。接近与离开的条件不同，不能都按远到近排；车始终沿箭头方向移动。',
      visual: { kind: 'motion-frames', variant: 'main', scene: 'depart' },
      activity: '实际让车从P附近驶远，拍或画三次位置并口述顺序。',
    },
    {
      title: '经过P：要看哪一侧和方向',
      text: '主图B还在P左侧，C到P附近，A已到P右侧。持续向右，所以B、C、A。最早与最晚都可能离P较远，仅凭远近不足以判断经过过程。P在路旁，不是车撞上路标。',
      visual: { kind: 'motion-frames', variant: 'main', scene: 'pass' },
      activity: '实际把路标放在路旁，车沿直路从它一侧驶到另一侧，用三卡记录。',
    },
    {
      title: '方向改变，重新判断',
      text: '复习换成一直向左的车，并重排位置图。先看箭头再看位置，不背旧编号。图片坐标只是画图位置，不是时间、实际米数或速度；不知车是否掉头或参照移动时，应先问清楚。',
      visual: { kind: 'motion-frames', variant: 'review', scene: 'pass' },
      activity: '实际改成向左行驶，再取三张新卡重排，与家长说明所用条件。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用同一玩具车接近固定P，再离开固定P，各画或拍三张位置图并打乱重排；说清接近与离开的不同。',
      '实际让玩具车持续经过放在路旁的P，固定观察位置，分别记录未到、附近、已过三个时刻并解释方向。',
      '实际把车改成反方向，取三张新的位置图重排，口述为什么不能背旧编号；不靠网页答对代替实际操作。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际摆车、记录或口述后独立确认，可暂跳；不要在真实道路上做活动。',
      explanation: '实际过程与网页判断分别保存。',
    })),
    {
      id: `${id}-own-order`,
      knowledge: `${id}-own-order`,
      prompt: '记录你实际摆车的一组三卡顺序和行驶方向，说明固定参照在哪里。',
      rule: { kind: 'reflection' },
      hint: '保留真实记录，卡名可自行取。',
      explanation: '开放作品null，不套用网页编号强判。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '接近、离开与经过中，你最容易混淆什么？写下判断前要确认的一项条件。',
      rule: { kind: 'reflection' },
      hint: '按自己的话记录。',
      explanation: '过程反思null，实际任务独立确认。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读运动时序活动与原创位置条件核验',
    notes: `ISBN ${source.isbn}印刷81～82页相关范围，原创接近/离开/经过图；未知版权版次印次，不据单课宣布完整单元。`,
  },
};
