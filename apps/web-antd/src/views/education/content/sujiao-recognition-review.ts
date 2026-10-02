import type {
  GridPathsVisual,
  Lesson,
  Question,
  QueueVisual,
} from '../learning/types';

import { queuePosition } from '../learning/queue';
import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-recognition-review';
function tasks(review: boolean): Question[] {
  const prefix = review ? 'r' : 'q';
  const queue: QueueVisual = {
    kind: 'queue',
    labels: review ? ['2', '5', '1', '4'] : ['4', '1', '5', '2', '3'],
    front: review ? 'right' : 'left',
  };
  const target = review ? '2' : '5';
  const rank = review ? 2 : 4;
  const selected = required(
    queue.labels.find((label) => queuePosition(queue, label) === rank),
  );
  const paths: GridPathsVisual = {
    kind: 'grid-paths',
    paths: review
      ? [
          {
            id: 'A',
            points: [
              [0, 0],
              [3, 0],
              [3, 2],
            ],
          },
          {
            id: 'B',
            points: [
              [0, 3],
              [4, 3],
            ],
          },
          {
            id: 'C',
            points: [
              [5, 0],
              [5, 3],
            ],
          },
        ]
      : [
          {
            id: 'A',
            points: [
              [0, 0],
              [2, 0],
              [2, 2],
            ],
          },
          {
            id: 'B',
            points: [
              [0, 3],
              [5, 3],
            ],
          },
          {
            id: 'C',
            points: [
              [4, 0],
              [4, 2],
            ],
          },
        ],
  };
  const pairs = review
    ? [
        [0, 3],
        [2, 2],
        [4, 1],
      ]
    : [
        [0, 4],
        [5, 5],
        [2, 3],
      ];
  return [
    {
      id: `${id}-${prefix}-total`,
      knowledge: `${id}-card-count`,
      prompt:
        '一共有几张数字卡？每个框是一张卡，框里的数是卡片内容，不表示卡片总数。',
      visual: queue,
      rule: { kind: 'number', value: queue.labels.length },
      hint: '每张卡只数一次，不把最大的卡面数字当作张数。',
      explanation: `共有${queue.labels.length}张卡。`,
    },
    {
      id: `${id}-${prefix}-rank`,
      knowledge: `${id}-card-position`,
      prompt: `从标明的队首数，写着${target}的卡排第几？`,
      visual: queue,
      rule: { kind: 'number', value: required(queuePosition(queue, target)) },
      hint: '先找队首；卡面数字与卡片位置不是一回事。',
      explanation: `写着${target}的卡排第${queuePosition(queue, target)}。`,
    },
    {
      id: `${id}-${prefix}-content`,
      knowledge: `${id}-card-content`,
      prompt: `从队首数，第${rank}张卡上写着哪个数？`,
      visual: queue,
      choices: queue.labels.map((label) => ({ id: label, label })),
      rule: { kind: 'choice', value: selected },
      hint: '数到指定位置，再读卡面数字。',
      explanation: `第${rank}张写着${selected}；第几是位置，写几是内容。`,
    },
    {
      id: `${id}-${prefix}-descending`,
      knowledge: `${id}-descending`,
      prompt: review
        ? '将0～4的数字卡按从大到小排列。'
        : '将1～5的数字卡按从大到小排列。',
      choices: (review ? [0, 1, 2, 3, 4] : [1, 2, 3, 4, 5]).map((value) => ({
        id: String(value),
        label: String(value),
      })),
      rule: {
        kind: 'sequence',
        values: review ? ['4', '3', '2', '1', '0'] : ['5', '4', '3', '2', '1'],
      },
      hint: '先放最大的数，逐个往小的数排。',
      explanation: review ? '4、3、2、1、0。' : '5、4、3、2、1。',
    },
    ...[false, true].map((maximum): Question => ({
      id: `${id}-${prefix}-${maximum ? 'maximum' : 'minimum'}`,
      knowledge: `${id}-${maximum ? 'maximum' : 'minimum'}`,
      prompt: `在${review ? '0～4' : '0～5'}这些数中，${maximum ? '最大' : '最小'}的数是几？`,
      rule: {
        kind: 'number',
        value: (() => {
          if (maximum) return review ? 4 : 5;
          return 0;
        })(),
      },
      hint: '按从小到大读一遍，看看两端分别是什么数。',
      explanation: maximum ? `最大的数是${review ? 4 : 5}。` : '最小的数是0。',
    })),
    ...pairs.map(([left, right], index): Question => ({
      id: `${id}-${prefix}-symbol-${index}`,
      knowledge: `${id}-comparison-${index}`,
      prompt: `第一组与第二组比较：${left} ○ ${right}，应填哪个符号？`,
      visual: { kind: 'count', count: required(left), other: required(right) },
      choices: ['=', '>', '<'].map((label) => ({ id: label, label })),
      rule: {
        kind: 'choice',
        value: (() => {
          if (left === right) return '=';
          return required(left) > required(right) ? '>' : '<';
        })(),
      },
      hint: '先数指定的两组，一个也没有用0表示，再比较。',
      explanation: `${left} ${(() => {
        if (left === right) return '=';
        return required(left) > required(right) ? '>' : '<';
      })()} ${right}。`,
    })),
    {
      id: `${id}-${prefix}-complete`,
      knowledge: `${id}-complete-five`,
      prompt: review
        ? '需要5张卡，已有4张，还要添几张？'
        : '需要5块积木，已有3块，还要添几块？',
      rule: { kind: 'number', value: review ? 1 : 2 },
      hint: '逐个添到5，数新添了多少。',
      explanation: review ? '从4添到5，只需1张。' : '从3添到4、5，需要2块。',
    },
    ...[false, true].map((shortest): Question => ({
      id: `${id}-${prefix}-${shortest ? 'shortest' : 'longest'}`,
      knowledge: `${id}-${shortest ? 'shortest' : 'longest'}`,
      prompt: `沿相同大小的格边比较三条完整的线，哪条${shortest ? '最短' : '最长'}？`,
      visual: paths,
      choices: ['A', 'B', 'C'].map((label) => ({
        id: label,
        label: `${label}线`,
      })),
      rule: {
        kind: 'choice',
        value: (() => {
          if (shortest) return 'C';
          return review ? 'A' : 'B';
        })(),
      },
      hint: '拐弯前后都要数，不用两端之间的距离代替整条线。',
      explanation: review
        ? 'A走5格边、B走4格边、C走3格边。'
        : 'A走4格边、B走5格边、C走2格边。',
    })),
  ];
}

export const sujiaoRecognitionReviewLesson: Lesson = {
  id,
  textbookTitle: '练习一',
  title: '认识与比较综合活动：数字卡、配对与先后',
  page: 22,
  status: 'available',
  version: 1,
  goal: '区分卡片数量、卡面数字与位置；顺倒排数，比较含0数量，补齐到5，比较完整格边路径并说明生活活动先后。',
  prerequisite:
    '认识0～5、几和第几及比较符号。准备数字卡、两种积木和方格纸；尚不要求会列加减算式。',
  parentTip:
    '本站按第22～24页组织原创综合活动，不复制原题原图。屏幕答对不替代实物、纸笔和表达；格边只作同单位比较，不教厘米测量。',
  steps: [
    {
      title: '卡面写几，卡排第几，共有几张',
      text: '卡面数字是卡片上的内容；排第几要从约定起点数；一共有几张要把所有卡数一次。三种问题不同，不能看到卡面最大的数字就说有那么多张。',
      activity:
        '把4、1、5、2、3五张卡从左到右摆好。分别问共有几张、写5的排第几、第4张写几，再换数的起点。',
      visual: {
        kind: 'queue',
        labels: ['4', '1', '5', '2', '3'],
        front: 'left',
      },
    },
    {
      title: '按大小排，按数量配',
      text: '从小到大与从大到小是相反的顺序。比较数量时一个对一个配好，空组的数量是0。大于、小于都不包含相等的情况。',
      activity: '把0～5卡片顺排、倒排；摆两组不同数量的积木，说出比较式。',
    },
    {
      title: '补齐与摆法变化',
      text: '盒子要求5件，先数已有几件，再逐件添到5。两组同样多时，只把一组拉开，没有添或拿走，数量仍相同。看一行长短不能代替点数。',
      activity: '摆3块，添到5；另摆两组各4块，把一组拉开后重新配对。',
    },
    {
      title: '比较整条线',
      text: '每个小方格相同，逐段比较整条线经过的格边。遇到转弯要接着比较，不能只看线的宽、高或端点距离。',
      activity:
        '在方格纸上画一条直线和一条折线，用相同格边或绳子比较完整线长。',
    },
    {
      title: '先后顺序与生活中的数',
      text: '说一句包含0～5的生活话，说明这个数表示什么。用第1步、第2步说自己的活动流程，不把每个步骤误当成物品数量。流程可以不同，要说明具体活动和理由。',
      activity:
        '用自己的物品举例，再说一次整理书包的准备、整理、检查、收好流程。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: `${id}-manual-life`,
      knowledge: `${id}-life-expression`,
      prompt:
        '用0～5说一句生活中的话，实际指出数的物品或位置，说明这个数表示什么。',
      rule: { kind: 'manual' },
      hint: '可以数物品，也可以说排第几；先说明具体情境。',
      explanation: '实际观察和表达人工确认，不自动评价表达水平。',
    },
    {
      id: `${id}-manual-pair`,
      knowledge: `${id}-physical-pair`,
      prompt:
        '实际摆两组各4块积木，把一组拉开，再一个对一个配对。说说是否同样多，在纸上写比较式，请家长查看。',
      rule: { kind: 'manual' },
      hint: '没有添也没有拿走，重新配对验证；纸笔不可用点选代替。',
      explanation: '实物操作、书写与解释人工确认，完成不等于已掌握。',
    },
    {
      id: `${id}-manual-path`,
      knowledge: `${id}-physical-path`,
      prompt:
        '在方格纸上画直线和折线，比较完整线的长短并说明拐弯后的部分是否也要比较。',
      rule: { kind: 'manual' },
      hint: '方格同样大，沿整条线比较；也可用绳子贴线再拉直。',
      explanation: '实际画线与比较单列人工确认。',
    },
    {
      id: `${id}-manual-order`,
      knowledge: `${id}-life-procedure`,
      prompt:
        '实际做一次整理书包或准备画画，用第1步、第2步说出自己活动的先后，说明先准备和最后收好的理由。',
      rule: { kind: 'manual' },
      hint: '说你实际采用的流程，不强求所有人完全相同。',
      explanation: '实际活动与说明人工确认，不自动按唯一流程评分。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版原书正文核验与原创教学检查',
    notes: `依据ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷，第22～24页（${source.preview}）。本站原创图示、场景与问答；复习改变队首、人数、卡面顺序、数值、路径与目标。不提前使用加减法术语，不作为完整第一单元验收。`,
  },
};
