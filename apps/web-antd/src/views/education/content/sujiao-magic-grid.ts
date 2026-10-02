import type {
  Lesson,
  MagicCells,
  MagicGridVisual,
  Question,
} from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-magic-grid';
function diagram(cells: MagicCells): MagicGridVisual {
  return { kind: 'magic-grid', cells };
}
const complete: MagicCells = [
  [8, 1, 6],
  [3, 5, 7],
  [4, 9, 2],
];
const rotated: MagicCells = [
  [4, 3, 8],
  [9, 5, 1],
  [2, 7, 6],
];
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const grids: MagicCells[] = review
    ? [
        [
          [4, null, 8],
          [null, 5, null],
          [2, null, 6],
        ],
        [
          [null, 3, null],
          [9, null, 1],
          [null, 7, null],
        ],
        [
          [4, null, null],
          [null, 5, null],
          [null, null, null],
        ],
      ]
    : [
        [
          [8, null, 6],
          [null, 5, null],
          [4, null, 2],
        ],
        [
          [null, 1, null],
          [3, null, 7],
          [null, 9, null],
        ],
        [
          [null, null, null],
          [null, 5, null],
          [null, null, null],
        ],
      ];
  const full = review ? rotated : complete;
  const invalidRows = review
    ? [
        [2, 7, 6],
        [4, 3, 8],
        [9, 5, 1],
      ]
    : [
        [1, 5, 9],
        [8, 3, 4],
        [6, 7, 2],
      ];
  return [
    ...grids.map((cells, index): Question => ({
      id: `${prefix}-fill-${index}`,
      knowledge: `${id}-fill-${index}`,
      prompt: `第${index + 1}张九宫格${review ? '复习' : '练习'}：1～9每数用一次，每行、每列和两条对角线的和都是15。按A开始的字母顺序填完${index === 2 ? '，多种合法填法都可以' : ''}。`,
      visual: diagram(cells),
      rule: { kind: 'magic-grid', cells: structuredClone(cells) },
      hint: '先找已知两个数的行、列或对角线，用15减去它们的和；每填一个数就检查有没有重复。',
      explanation:
        '保留全部已知数；1～9各一次，三行、三列及两条对角线都必须满足。少条件可能有多解，不能只认一种。',
    })),
    {
      id: `${prefix}-top-middle`,
      knowledge: `${id}-top-middle`,
      prompt: review
        ? '这张图第一行是4、待填、8，第一行中间填几？只填写这一格。'
        : '这张图第一行是8、待填、6，第一行中间填几？只填写这一格。',
      visual: diagram(required(grids[0])),
      rule: { kind: 'number', value: review ? 3 : 1 },
      hint: '先算已知两格的和，再从15中减去。',
      explanation: review ? '4+8=12，15−12=3。' : '8+6=14，15−14=1。',
    },
    {
      id: `${prefix}-line-count`,
      knowledge: `${id}-line-count`,
      prompt: review
        ? '检查复习九宫格时，3条横行、3条竖列和2条对角线，总共要检查几条？'
        : '检查这张九宫格时，3条横行、3条竖列和2条对角线，总共要检查几条？',
      rule: { kind: 'number', value: 8 },
      hint: '三类分别计数，再合起来；只包含两条角到角的对角线。',
      explanation: '3+3+2=8条。中间格会出现在不同线里，但在同一条线只数一次。',
    },
    {
      id: `${prefix}-diagonal`,
      knowledge: `${id}-diagonal`,
      prompt: review
        ? '这张完整图中，右上到左下的对角线是哪三个数？'
        : '这张完整图中，左上到右下的对角线是哪三个数？',
      visual: diagram(full),
      choices: [
        { id: 'diagonal', label: review ? '8、5、2' : '8、5、2' },
        { id: 'row', label: review ? '4、3、8' : '8、1、6' },
        { id: 'column', label: review ? '4、9、2' : '8、3、4' },
      ],
      rule: { kind: 'choice', value: 'diagonal' },
      hint: '从题目指定的角开始，经过中心，走到对角，不沿横行或竖列。',
      explanation:
        '两条对角线分别连接相对的两个角，都经过中心。方向按指定起点区分。',
    },
    {
      id: `${prefix}-rows-columns`,
      knowledge: `${id}-rows-columns`,
      prompt: `另一张候选图第一行${required(invalidRows[0]).join('、')}，第二行${required(invalidRows[1]).join('、')}，第三行${required(invalidRows[2]).join('、')}。1～9各出现一次，行与列的和都等于15，就一定符合全部要求吗？`,
      choices: [
        { id: 'yes', label: '一定符合，检查行和列就够了' },
        { id: 'no', label: '还不够，两条对角线也要检查' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '分别查看左上到右下、右上到左下三个位置，不能把对角线略去。',
      explanation: review
        ? '左上到右下是2+3+1=6，另一条是6+3+9=18，都不是15。行列正确还不够。'
        : '左上到右下是1+3+2=6，另一条是9+3+6=18，都不是15。行列正确还不够。',
    },
    {
      id: `${prefix}-repeated`,
      knowledge: `${id}-repeated`,
      prompt: review
        ? '复习时，有人把每一格都填5，所有线的和都为15。这能作为1～9每数用一次的答案吗？'
        : '有人把九个格都填5，每行每列每条对角线都得到15。这符合1～9每数用一次吗？',
      choices: [
        { id: 'yes', label: '符合，和是15就行' },
        { id: 'no', label: '不符合，5重复且其他数没有用' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '相加条件和每数只用一次是两个都要满足的要求。',
      explanation: '即使每条线的和正确，重复数字也不合要求，不能只检查和。',
    },
    {
      id: `${prefix}-zero`,
      knowledge: `${id}-zero`,
      prompt: review
        ? '复习中还没有填完的空格，能直接当作0加入这张1～9九宫格吗？'
        : '空格里还没有数，能把它当作0，作为1～9九宫格的完成答案吗？',
      choices: [
        { id: 'yes', label: '能，空格就是0' },
        { id: 'no', label: '不能，空格是待填，0不在给定数卡里' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '这里用的是1～9九张卡，和允许填0的数塔条件不同。',
      explanation: '待填用字母标出，不代表0；本活动不允许0。',
    },
  ];
}
export const sujiaoMagicGridDraft: Lesson = {
  id,
  title: '探索活动：九宫格与八条线检查',
  textbookTitle: '练习三·九宫格探索',
  page: 17,
  version: 1,
  status: 'preparing',
  goal: '沿行、列和对角线找关系，用1～9各一次完成九宫格并核对所有条件。',
  prerequisite: '会进行20以内加减，能找行、列与相对角的位置。',
  parentTip:
    '让孩子用手指沿线检查，每次只数三个格。不能只核行列，也不要把少条件的多解题判成唯一答案。',
  steps: [
    {
      title: '看清本活动的条件',
      text: '这是本站原创的1～9数卡九宫格：每张卡用一次，不能重复，也不能用0。格子从上到下三行、从左到右三列；字母表示待填位置。',
      visual: diagram([
        [8, null, 6],
        [null, 5, null],
        [4, null, 2],
      ]),
    },
    {
      title: '沿一条线补缺数',
      text: '第一行8和6合成14，要使这一行达到15，还需要1。其他线同样找两个已知数，先合再求缺数；填好一格后核对有没有重复。',
      visual: diagram([
        [8, 1, 6],
        [null, 5, null],
        [4, null, 2],
      ]),
    },
    {
      title: '不漏掉对角线',
      text: '横向三行、竖向三列以及左上到右下、右上到左下两条对角线都要查。中心在不同的线分别参与相加，但每条线里只用一次。',
      visual: diagram(complete),
    },
    {
      title: '少条件可以有多种填法',
      text: '只给中心5时可以有不同合法完成图；转一转或翻一翻仍要保留已知位置，并重新检查全部条件。实际摆卡、描线与口述单独确认。',
      visual: diagram([
        [null, null, null],
        [null, 5, null],
        [null, null, null],
      ]),
      activity:
        '画3×3格，制作1～9九张卡，摆一种完整图，逐条指出三行、三列、两条对角线。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际画格、制作1～9卡片并摆一种合法完成图，指着三行、三列、两条对角线逐条说明。',
      '只保留中心5，实际摆两种不同的完整图，逐一检查没有重复数字且八条线都合要求。',
      '把一个合法图的两张卡交换位置，找出不再满足要求的线，再恢复原摆法，向家长解释为什么需要复查。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '需要真实摆卡、描线与说明，完成后由孩子或家长确认。',
      explanation: '图示判题与实际操作分开记录，不自动完成实物任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读九宫格范围与原创规则核对',
    notes: `依据下册印刷第17页行、列、斜行和为15的九宫格探索及1～9示例范围；ISBN ${source.isbn}。本站明确1～9各一次，采用原创给定格、候选和讲解，不复制原题或插图。版权日期待核验，保留未注册课包。`,
  },
};
