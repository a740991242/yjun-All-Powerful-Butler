import type {
  CountGroupsVisual,
  GridPathsVisual,
  Lesson,
  Question,
} from '../learning/types';

import { gridPathLength } from '../learning/grid-paths';
import { sujiaoReadingSteps, sujiaoReadingTasks } from './sujiao-reading-table';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-final-exploration';
export const sujiaoFinalPaths: GridPathsVisual = {
  kind: 'grid-paths',
  grid: '5x5',
  paths: [
    {
      id: 'A',
      points: [
        [0, 0],
        [5, 0],
        [5, 1],
      ],
    },
    {
      id: 'B',
      points: [
        [0, 2],
        [3, 2],
        [3, 3],
        [5, 3],
      ],
    },
    {
      id: 'C',
      points: [
        [0, 4],
        [0, 5],
        [4, 5],
      ],
    },
  ],
};
export const sujiaoFinalReviewPaths: GridPathsVisual = {
  kind: 'grid-paths',
  grid: '5x5',
  paths: [
    {
      id: 'A',
      points: [
        [0, 0],
        [3, 0],
        [3, 1],
        [5, 1],
      ],
    },
    {
      id: 'B',
      points: [
        [0, 2],
        [0, 3],
        [5, 3],
      ],
    },
    {
      id: 'C',
      points: [
        [0, 4],
        [5, 4],
      ],
    },
  ],
};
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const groups: CountGroupsVisual = {
    kind: 'count-groups',
    groups: review ? [2, 4, 3] : [1, 3, 5],
  };
  const equal: CountGroupsVisual = { kind: 'count-groups', groups: [3, 3, 3] };
  const paths = review ? sujiaoFinalReviewPaths : sujiaoFinalPaths;
  return [
    {
      id: `${prefix}-groups`,
      knowledge: `${id}-groups`,
      prompt: '图中有几个盘子？只数盘子，不数里面的物品。',
      visual: groups,
      rule: { kind: 'number', value: 3 },
      hint: '每个框代表一个盘子。',
      explanation: '3个盘子，盘子数不等于物品总数。',
    },
    {
      id: `${prefix}-total`,
      knowledge: `${id}-total`,
      prompt: '三个盘子中的物品合起来一共有几个？',
      visual: groups,
      rule: { kind: 'number', value: 9 },
      hint: '把各盘数量合起来，逐个核对。',
      explanation: review ? '2+4+3=9。' : '1+3+5=9。',
    },
    {
      id: `${prefix}-equal`,
      knowledge: `${id}-equal`,
      prompt: '9个物品放进3个盘子，每盘同样多，全部放完。每盘有几个？',
      visual: equal,
      rule: { kind: 'number', value: 3 },
      hint: '可以轮流每盘放1个，重复直到9个全部放完，再数每盘。',
      explanation: '每盘3个，3+3+3=9；不用提前学习除法符号。',
    },
    {
      id: `${prefix}-same-total`,
      knowledge: `${id}-same-total`,
      prompt: review
        ? '2、4、3个和3、3、3个两种放法，总数量相同吗？'
        : '1、3、5个和3、3、3个两种放法，总数量相同吗？',
      choices: [
        { id: 'same', label: '相同，都是9个' },
        { id: 'different', label: '不同，摆得一样多就会增加总数' },
      ],
      rule: { kind: 'choice', value: 'same' },
      hint: '分别合起来核对，重排不增加物品。',
      explanation: '两种总数都是9；每盘数量不同不代表总数不同。',
    },
    {
      id: `${prefix}-behind`,
      knowledge: `${id}-behind`,
      prompt: review
        ? '小安排在队首，后面有14人。包括小安，一共有几人？'
        : '小安排在队首，后面有15人。包括小安，一共有几人？',
      rule: { kind: 'number', value: review ? 15 : 16 },
      hint: '后面的人不包括小安，求全队要再加本人1人。',
      explanation: review ? '14+1=15人。' : '15+1=16人。',
    },
    {
      id: `${prefix}-front`,
      knowledge: `${id}-front`,
      prompt: review
        ? '全队共16人，小安是最后一人。小安前面有几人？'
        : '全队共15人，小安是最后一人。小安前面有几人？',
      rule: { kind: 'number', value: review ? 15 : 14 },
      hint: '全队含本人，前面的人不含本人。',
      explanation: review ? '16-1=15人。' : '15-1=14人。',
    },
    ...sujiaoReadingTasks(review),
    ...paths.paths.map((path): Question => ({
      id: `${prefix}-path-${path.id}`,
      knowledge: `${id}-path-${path.id}`,
      prompt: `每小格边长用1表示。沿路径${path.id}从头到尾走过几条格边？拐弯两段都要算。`,
      visual: paths,
      rule: { kind: 'number', value: gridPathLength(path.points) },
      hint: '从起点沿线一格一格数，不把起终点直线距离当路径长度。',
      explanation: `沿完整路径数，共${gridPathLength(path.points)}条格边；这里不是厘米。`,
    })),
    {
      id: `${prefix}-equal-paths`,
      knowledge: `${id}-equal-paths`,
      prompt: 'A和B拐弯位置不同，它们沿线的长度相等吗？',
      visual: paths,
      choices: [
        { id: 'same', label: '相等，都经过6条格边' },
        { id: 'different', label: '不相等，因为拐弯位置不同' },
      ],
      rule: { kind: 'choice', value: 'same' },
      hint: '分别数所有格边，形状不同不一定长度不同。',
      explanation: 'A与B都长6，不同形状的路线可以一样长。',
    },
  ];
}
const manual: [string, string][] = [
  [
    'reading',
    '在纸上为两个人记录三天实际阅读页数，注明单位并逐日比较。没有读的当天记0；不把累计页码当当天数量，不由页数推断理解能力。家长实际查看记录和口述。',
  ],
  [
    'partition',
    '实际把9个安全物品放进3个盘子，试出至少两种不同放法，全部放完；说明每盘数量与总数。',
  ],
  [
    'equal',
    '把9个物品轮流放进3个盘子，直到全部放完且每盘同样多。实际核对每盘3个，再说为什么没有漏放或重复数。',
  ],
  [
    'queue',
    '用名字卡摆队列，指出本人、前面和后面的人；另编一道已知后面人数求全队或已知全队求前面人数的题并解释。',
  ],
  [
    'draw',
    '纸上画5×5等大方格，沿格边画出至少两条长6的不同路径。逐段数满6条边，不用斜线、重走同一段或厘米长度代替。',
  ],
];
export const sujiaoFinalExplorationLesson: Lesson = {
  id,
  textbookTitle: '期末复习：探索与实践',
  title: '期末探索：分盘、队列与六格路径',
  page: 93,
  status: 'available',
  version: 2,
  goal: '探索九个物品的不同分法与同样多，区分本人和前后人数，逐日读表比较，再沿等大格边计数并画不同六格路径。',
  prerequisite:
    '会19以内计数与加减，准备9个安全物品、3个盘子、名字卡与方格纸。',
  parentTip:
    '不同分法与自画路径允许多种有依据的答案，不要求唯一作品；每盘同样多以轮流摆放和加法核对，不提前引入除法。队列说明队首或队尾，避免缺条件。图示不代替实物操作，帮读和提示分别记录。',
  steps: [
    {
      title: '三个盘子，九个物品',
      text: '1、3、5和2、4、3都是把9个物品全部分进三个盘子的办法。数盘子得3，数物品得9。移动物品改变每盘数量，不改变全部数量；自己想不同放法并核对。',
      visual: { kind: 'count-groups', groups: [1, 3, 5] },
      activity: '实际分出两种不同放法，每次合起来核对9个。',
    },
    {
      title: '每盘同样多，要全部放完',
      text: '轮流给每盘放1个，重复到9个放完，每盘3个。逐盘比较同样多，再用3+3+3=9核对；不是把盘子数3当成全部物品数。',
      visual: { kind: 'count-groups', groups: [3, 3, 3] },
      activity: '实际轮流分物并解释每盘同样多。',
    },
    {
      title: '人数是否包含本人',
      text: '排在队首，后面有15人，全队还有本人1人，所以共16人。全队15人，排最后的人前面只有14人。先指出本人、队首队尾，再看问题包含谁。',
      activity: '用名字卡实际摆队列，指出本人和前后人数，自己编题。',
    },
    ...sujiaoReadingSteps,
    {
      title: '格边为单位，拐弯也要数',
      text: '每个小格边长用1表示，路径A与B形状不同，但从头到尾都走6条格边，长度相等。路径C走5条格边。只比较图中沿线的格边数，不说厘米，也不测起终点直线距离。',
      visual: sujiaoFinalPaths,
      activity: '在5×5方格纸上画两条不同的长6路径，逐段标记并核对。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际摆放、绘图或口述并核对后，由家长确认。',
      explanation: '合理不同作品都可讨论，不自动用一道图示题确认实践。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版正文与原创探索检查',
    notes: `依据已实际查看ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷第93页（${source.preview}）分盘、队列和方格路径。情境、排列、路径均原创。逐日阅读表的单位、行列查找、单日与三天比较已补充；隐藏规律仍需另行补充，不宣称该页全部内容或整册完成。`,
  },
};
