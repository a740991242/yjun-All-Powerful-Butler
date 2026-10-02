import type { SeatDirection } from '../learning/seat-grid';
import type { Lesson, Question, SeatGridVisual } from '../learning/types';

import { required } from '../learning/required';
import { seatNeighbour, seatPosition } from '../learning/seat-grid';

export const sujiaoPositionSources = {
  checkedAt: '2026-10-01',
  links: [
    'http://app.xxsx.cn/resources-detail/38145/63',
    'http://app.xxsx.cn/resources-detail/38146/63',
    'http://app.xxsx.cn/resources-detail/38147/63',
  ],
} as const;

export const sujiaoMainSeats: SeatGridVisual = {
  kind: 'seat-grid',
  rows: [
    ['小禾', '小林', '小月'],
    ['小安', '小乐', '小宁'],
    ['小夏', '小冬', '小雨'],
  ],
};
export const sujiaoReviewSeats: SeatGridVisual = {
  kind: 'seat-grid',
  rows: [
    ['小夏', '小宁', '小林'],
    ['小冬', '小安', '小禾'],
    ['小月', '小乐', '小雨'],
  ],
};

const directions: { value: SeatDirection; label: string }[] = [
  { value: 'front', label: '前面' },
  { value: 'rear', label: '后面' },
  { value: 'left', label: '左边' },
  { value: 'right', label: '右边' },
];

function tasks(review: boolean): Question[] {
  const id = 'sj-upper-life-positions';
  const prefix = review ? 'r' : 'q';
  const visual = review ? sujiaoReviewSeats : sujiaoMainSeats;
  const reference = review ? '小安' : '小乐';
  const candidateNames = [
    reference,
    ...directions.map((direction) =>
      required(seatNeighbour(visual, reference, direction.value)),
    ),
  ];
  const target = required(seatPosition(visual, '小月'));
  return [
    ...directions.map((direction): Question => ({
      id: `${id}-${prefix}-${direction.value}`,
      knowledge: `${id}-${direction.value}`,
      prompt: `所有座位朝图上方，${reference}${direction.label}紧邻的同学是谁？`,
      visual,
      choices: candidateNames.map((label) => ({ id: label, label })),
      rule: {
        kind: 'choice',
        value: required(seatNeighbour(visual, reference, direction.value)),
      },
      hint: '先找题目指定的人，再根据图中统一的座位朝向找紧邻的位置。不要从自己的屏幕下方另外设队首。',
      explanation: `${reference}${direction.label}紧邻的是${seatNeighbour(visual, reference, direction.value)}；位置关系是相对于${reference}说的。`,
    })),
    {
      id: `${id}-${prefix}-row`,
      knowledge: `${id}-row-number`,
      prompt: '从教室前方往后数，小月在第几排？',
      visual,
      rule: { kind: 'number', value: target.row },
      hint: '图上方是前方，从最上面一排开始数。',
      explanation: `从前往后，小月在第${target.row}排；这是排的位置，不是总人数。`,
    },
    {
      id: `${id}-${prefix}-column`,
      knowledge: `${id}-column-number`,
      prompt: '在小月所在的这一排，从图左往右数，小月是第几个？',
      visual,
      rule: { kind: 'number', value: target.column },
      hint: '先找到小月所在的排，再从该排的左边开始数。',
      explanation: `小月在所在排从左往右的第${target.column}个。换起点就要重新判断。`,
    },
    {
      id: `${id}-${prefix}-reverse`,
      knowledge: `${id}-reverse-reference`,
      prompt: review
        ? '小禾在小安的右边。反过来说，小安在小禾的哪一边？'
        : '小安在小乐的左边。反过来说，小乐在小安的哪一边？',
      visual,
      choices: [
        { id: 'left', label: '左边' },
        { id: 'right', label: '右边' },
      ],
      rule: { kind: 'choice', value: review ? 'left' : 'right' },
      hint: '换了作为参照的人，关系要反过来说；所有人仍朝同一个方向。',
      explanation: review ? '小安在小禾的左边。' : '小乐在小安的右边。',
    },
    {
      id: `${id}-${prefix}-vertical`,
      knowledge: `${id}-above-below`,
      prompt: review
        ? '照片贴在星星卡的下面。星星卡在照片的哪边？'
        : '星星卡贴在照片的上面。照片在星星卡的哪边？',
      choices: [
        { id: 'above', label: '上面' },
        { id: 'below', label: '下面' },
      ],
      rule: { kind: 'choice', value: review ? 'above' : 'below' },
      hint: '先明确说谁相对于谁的位置，交换参照物后再说一次。',
      explanation: review ? '星星卡在照片上面。' : '照片在星星卡下面。',
    },
  ];
}

export const sujiaoPositionDraft: Lesson = {
  id: 'sj-upper-life-positions',
  textbookTitle: '生活中的位置',
  title: '生活中的位置：朝向、参照与描述',
  page: 32,
  status: 'preparing',
  version: 1,
  goal: '根据明确朝向描述前后左右和上下位置，说明参照对象，按约定起点数座位；实际观察生活中的位置。',
  prerequisite: '会数1～5和第几；准备几张不同卡片、纸笔，在安全地方实际摆放。',
  parentTip:
    '俯视图所有座位朝上，实际自己的左右依身体朝向判断。面对面时不能直接模仿对方举起的同一侧；先站成同向再检查。不要求公开同学姓名、家庭位置或照片。',
  steps: [
    {
      title: '先明确朝向',
      text: '图中所有座位朝箭头指向的教室前方。前面在图上方，后面在图下方，左右按同一朝向判断。实际认识自己的左右时，家长先与孩子朝同一方向站好。',
      visual: sujiaoMainSeats,
      activity:
        '在安全地方同向站好，分别指自己的前后、左右；家长现场查看，不用屏幕点选替代。',
    },
    {
      title: '说清相对于谁',
      text: '先找到小乐，再找小乐前面、后面、左边、右边紧邻的人。位置关系必须说清参照对象，不能只说“小林在前面”而不说在谁前面。',
      visual: sujiaoMainSeats,
      activity: '用卡片摆成座位，指一个参照对象，描述它四边的卡片。',
    },
    {
      title: '换参照，关系反过来',
      text: '小安在小乐左边，反过来说小乐在小安右边。前后、上下也要说明谁相对于谁。按排数位置时先约定从前往后，在同一排数人时先约定从左往右。',
      activity: '同一对卡片，用两种参照说位置；换数的起点，重新判断第几。',
    },
    {
      title: '把教室和生活观察说出来',
      text: '观察墙上或桌上物品，说明上、下、左、右的位置，实际安排一张卡片的位置并介绍理由。可以描述自己的学习角，不上传照片或个人地点；有疑问就提出来。',
      activity:
        '实际摆放卡片，观察上下关系；再用前后左右描述安全空间中的物品摆放。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-upper-life-positions-manual-body',
      knowledge: 'sj-upper-life-positions-body',
      prompt:
        '与家长站成同一朝向，指出自己的前后、左右，再安全转身，说说自己的前方现在朝哪里。',
      rule: { kind: 'manual' },
      hint: '身体朝向改变，自己的前后左右相对于空间也会改变。请家长现场查看。',
      explanation: '实际方向识别由人工确认，不把俯视图答对当作身体左右已掌握。',
    },
    {
      id: 'sj-upper-life-positions-manual-wall',
      knowledge: 'sj-upper-life-positions-arrange',
      prompt:
        '实际摆几张卡片，说明上下左右关系；换一个参照对象再说一次，并提出一个自己的布置想法。',
      rule: { kind: 'manual' },
      hint: '说清谁在谁的哪边，不需要上传照片或姓名。',
      explanation: '实际布置、观察与表达人工确认，不自动给创意评分。',
    },
    {
      id: 'sj-upper-life-positions-manual-life',
      knowledge: 'sj-upper-life-positions-life',
      prompt:
        '用前后、上下或左右，向家长介绍身边两件物品的位置，再说一个想问的问题或还想练的地方。',
      rule: { kind: 'manual' },
      hint: '选择安全空间中的物品，不做上下楼或道路中的操作练习。',
      explanation: '生活观察、表达和反思人工确认，完成不等于掌握所有位置关系。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoPositionSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第32～34页：${sujiaoPositionSources.links.join('；')}。本站座位、名字、卡片场景及问答原创，复习改变人物排列和参照，不复制教室插画。不等于已实现完整实践活动；准确教材身份待确认，暂未注册正式课包。`,
  },
};
