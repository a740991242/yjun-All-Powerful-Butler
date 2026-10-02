import type { Lesson, Question, StickOutlineVisual } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-twelve-sticks';
const layouts: StickOutlineVisual['layout'][] = [
  'twelve-square',
  'twelve-rectangle',
  'twelve-triangle',
  'twelve-slanted',
];
function model(index: number, review: boolean): StickOutlineVisual {
  return {
    kind: 'stick-outline',
    layout: required(layouts[index]),
    turn: review ? 90 : 0,
  };
}
function tasks(review: boolean): Question[] {
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const choice = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    value: string,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    choices,
    rule: { kind: 'choice', value },
    hint: '同时核对材料和完整轮廓条件，不把示例当唯一合法摆法。',
    explanation,
  });
  return [
    ...layouts.flatMap((_, i): Question[] => [
      {
        ...common(`sticks-${i}`),
        prompt: `${review ? '转向后的复习图' : '这幅闭合摆图'}用了几根完整等长小棒？接头的空心点不是小棒。`,
        visual: model(i, review),
        rule: { kind: 'number', value: 12 },
        hint: '沿粗线一根根数；同一直线上的相邻两根分别数，不重复起点。',
        explanation: '用了全部12根，转向不改变材料数量。',
      },
      {
        ...common(`sides-${i}`),
        prompt: `${review ? '转向后的复习图' : '这幅摆图'}完整外轮廓有几条直边？同一直线上的接头不算拐角。`,
        visual: model(i, review),
        rule: { kind: 'number', value: i === 2 ? 3 : 4 },
        hint: '从一处拐角走到下一处拐角算一条直边，不把每根小棒都当成一条外边。',
        explanation: `外轮廓${i === 2 ? 3 : 4}条直边，但材料都是12根；根数与边数不同。`,
      },
    ]),
    {
      ...common('horizontal-vertical'),
      prompt:
        '只看这幅长方形摆图，依次填一条水平边用了几根、一条竖直边用了几根。每个空只问一条边，不是两条合计。',
      visual: model(1, review),
      rule: { kind: 'steps', values: review ? [2, 4] : [4, 2] },
      hint: '按当前图的水平和竖直方向分别数，转向后方向改变，不照搬旧图。',
      explanation: review
        ? '转向后水平短边2根、竖直长边4根；仍总共12根，不把方向当固定长短。'
        : '水平长边4根、竖直短边2根；两条长边8根、两条短边4根，共12根。',
    },
    choice(
      'circle',
      review
        ? '把12根直棒转动，全部首尾连接，不弯曲、不剪断，能围出轮廓处处弯曲的真正圆吗？'
        : '12根直棒全部首尾连接，不弯曲、不剪断，能围出真正的圆吗？',
      [
        { id: 'no', label: '不能，直线段围出的轮廓仍有直边' },
        { id: 'yes', label: '能，只要看起来很圆就是真正圆' },
      ],
      'no',
      '多边轮廓可以近似圆，但有限根直棒不能围出没有直边的真正圆；不把近似外观当相同图形。',
    ),
    choice(
      'open',
      review
        ? '转向后仍有两端没接上、留下开口，只因用了12根就算围好完整图形吗？'
        : '用了12根，但最后两端还没接上，已经围好完整图形了吗？',
      [
        { id: 'no', label: '没有，还要检查首尾闭合' },
        { id: 'yes', label: '有，只需根数是12' },
      ],
      'no',
      '根数正确只是一个条件，还须首尾闭合、不重叠、不交叉。',
    ),
    choice(
      'methods',
      review
        ? '两人都用全部12根，不剪断、不重叠、不交叉且闭合，摆法不同，都可以保留吗？'
        : '用全部12根等长棒，闭合、不剪断、不重叠、不交叉，只允许跟网页示例一模一样吗？',
      [
        {
          id: 'many',
          label: review
            ? '可以，符合条件的不同作品都保留'
            : '不只一种，符合条件的不同作品都保留',
        },
        { id: 'one', label: '只能保留网页相同摆法' },
      ],
      'many',
      '示例不是唯一答案。先核对材料条件，再看轮廓；不能把转向后的同一摆法误当材料增减。',
    ),
  ];
}
export const sujiaoTwelveSticksDraft: Lesson = {
  id,
  title: '期末围图：12根小棒与完整轮廓',
  textbookTitle: '期末复习：等长小棒围图',
  page: 92,
  status: 'preparing',
  version: 1,
  goal: '用全部12根等长棒探索闭合轮廓，分别数材料根数和完整直边，理解转向、接头及近似圆，保留不同合法摆法。',
  prerequisite:
    '已认识基本平面图形，做过4根、6根小棒活动；准备12根同样长的安全棒和纸笔。',
  parentTip:
    '依据已读92页12根等长小棒开放活动，本站四种摆图原创，不复制扫描。网页只读图不代替实物，不强制作品与示例相同；没有材料可暂跳人工任务。图形按容器缩放，不能用屏幕尺子或跨图比较像素长度判断真实棒长。',
  steps: [
    {
      title: '先核对材料与闭合条件',
      text: '准备12根同样长的棒，全部用上，不掰断、不叠放、不交叉，首尾围成一个闭合轮廓。空心点标棒端，每段粗线是一根；不能把端点数当棒数，也不能只看用了12根就忽略开口。',
      visual: model(0, false),
      activity: '实际逐根点数材料，再沿接头检查首尾是否接上。',
    },
    {
      title: '正方形：每边可以接多根',
      text: '这幅例子每条边接3根，四边都相同，总共12根。每条边中间有接头，但接头处仍沿同一直线，不增加拐角；外轮廓只有4条直边。转一下作品，材料根数与边数都不变。',
      visual: model(0, false),
      activity: '实际摆正方形，分别指一根棒、一条完整边和拐角。',
    },
    {
      title: '长方形与平行四边形',
      text: '长方形例子的两条长边各4根，两条短边各2根，总共12根。斜的平行四边形例子也用4根与2根接边，相邻角不再是直角，但两组对边分别平行。改变角度或转向不增减材料。',
      visual: model(1, false),
      activity: '用同一批棒实际尝试两种四边轮廓，检查没有开口或交叉。',
    },
    {
      title: '三角形：根数不等于边数',
      text: '每条边由4根棒接成，三边共12根。数棒沿每个接头分段，数边只看拐角到拐角。三角形与四边轮廓可以用相同材料，不用除法公式，沿边逐根数和相加即可。',
      visual: model(2, false),
      activity: '实际摆三角形，边指边数，分别说明12根与3条边。',
    },
    {
      title: '示例之外继续探索',
      text: '平行四边形也可用全部12根；其它符合条件的闭合作品都保留。有限根不弯曲的直棒能围出有直边的轮廓，不能围成处处弯曲的真正圆。屏幕图会缩放，判断等长看材料条件，不用屏幕像素比较不同图。',
      visual: model(3, false),
      activity:
        '实际尝试自己的另一种摆法，说出怎样检查；记录发现或需要帮助的地方。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际准备12根等长棒，摆一个闭合正方形，全部用上、不剪断、不重叠、不交叉，指材料根数、接头和完整外边。',
      '用同样12根实际尝试长方形与三角形，每次逐根核对，再分别指完整外边，不强求与网页尺寸相同。',
      '实际尝试平行四边形或自己的另一种合法闭合轮廓，检查所有材料和连接条件；保留不同合法作品。',
      '实际转向一个作品，画或口述水平、竖直方向怎样变化，以及材料根数、外边数为什么没变。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成并由家长查看再确认，没有材料可暂时跳过。',
      explanation: '人工任务独立，不根据网页正确答案自动确认真实摆棒。',
    })),
    ...[
      '你怎样区分一根棒、一条完整边和接头？写自己的例子或困难。',
      '你尝试了哪种不同摆法，如何检查符合条件？记录真实经历，尚未摆可说明还待尝试。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflection-${i}`,
      knowledge: `${id}-reflection-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '写自己的真实想法，没有唯一答案。',
      explanation: '反思按原话保存，correct为null，不替代实际操作。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读92页开放围图与原创等长轮廓核验',
    notes: `依据实际读取ISBN ${source.isbn}印刷92页12根等长小棒活动；四种坐标摆图原创，转向复习改变方向，水平竖直用棒数也随之改变。仅本活动，不复制扫描、不证明剩余期末或整册覆盖完成。`,
  },
};
