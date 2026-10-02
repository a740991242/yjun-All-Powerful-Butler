import type { Lesson, Question, QueueVisual } from '../learning/types';

import { fold } from '../learning/fold';
import { queueNeighbours, queuePosition } from '../learning/queue';
import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-nine-consolidation';

function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const queue: QueueVisual = {
    kind: 'queue',
    labels: review
      ? ['小安', '小禾', '小林', '小乐', '小文', '小青', '小宁', '小雨', '小星']
      : ['小禾', '小林', '小乐', '小文', '小青', '小宁', '小雨', '小星'],
    front: review ? 'right' : 'left',
  };
  const target = review ? '小安' : '小星';
  const removed = review ? '小宁' : '小乐';
  const neighbours = required(queueNeighbours(queue, target));
  const shortened: QueueVisual = {
    ...queue,
    labels: queue.labels.filter((name) => name !== removed),
  };
  const grid = review
    ? [
        [3, 2, 1],
        [1, 1, 2],
        [2, 3, 1],
      ]
    : [
        [1, 2, 3],
        [2, 3, 1],
        [1, 1, 2],
      ];
  const gridText = grid
    .map((row, i) => `第${i + 1}行：${row.join('、')}`)
    .join('；');
  const rows = grid.map((row) => fold(row, 0, (sum, n) => sum + n));
  const columns = [0, 1, 2].map((column) =>
    fold(grid, 0, (sum, row) => sum + required(row[column])),
  );
  const first = review ? 3 : 2;
  const total = review ? 8 : 9;
  return [
    {
      id: `${prefix}-total`,
      knowledge: `${id}-quantity`,
      prompt: '图中只排列小朋友，没有把带队家长画入。小朋友一共有几人？',
      visual: queue,
      rule: { kind: 'number', value: queue.labels.length },
      hint: '逐一数图中的小朋友，不把题目提到但未画入的家长加进来。',
      explanation: `图中共有${queue.labels.length}名小朋友。`,
    },
    {
      id: `${prefix}-rank`,
      knowledge: `${id}-rank`,
      prompt: `从标出的队首数，${target}排第几？`,
      visual: queue,
      rule: { kind: 'number', value: required(queuePosition(queue, target)) },
      hint: '先看队首标记，队首是第1个，不能固定从画面左边数。',
      explanation: `从${review ? '右' : '左'}边的队首数，${target}排第${queuePosition(queue, target)}。`,
    },
    {
      id: `${prefix}-neighbours`,
      knowledge: `${id}-before-after`,
      prompt: `依次填${target}前面、后面的人数，不包括${target}自己。`,
      visual: queue,
      rule: { kind: 'steps', values: [neighbours.before, neighbours.after] },
      hint: '先按队首确定前后，分别数两侧；本人不算在任何一侧。',
      explanation: `前面${neighbours.before}人，后面${neighbours.after}人，加上本人共有${queue.labels.length}人。`,
    },
    {
      id: `${prefix}-removed`,
      knowledge: `${id}-queue-change`,
      prompt: `${removed}离开后，其余人保持原来顺序。图已显示离开后的队列，${target}现在排第几？`,
      visual: shortened,
      rule: {
        kind: 'number',
        value: required(queuePosition(shortened, target)),
      },
      hint: '用新的队列重新从队首数；不要仍报离开前的位置。',
      explanation: `${removed}原来在${target}前面，离开后${target}的位置向队首靠近一位，变成第${queuePosition(shortened, target)}。`,
    },
    {
      id: `${prefix}-rows`,
      knowledge: `${id}-row-sums`,
      prompt: `纸上有三行三列数字。${gridText}。每行从左到右相加，依次填第1、2、3行的和。`,
      rule: { kind: 'steps', values: rows },
      hint: '每次只取同一行的三个数，先算两个数，再加第三个。可以先按题目抄出三行。',
      explanation: grid
        .map((row, i) => `第${i + 1}行：${row.join(' + ')} = ${rows[i]}`)
        .join('；'),
    },
    {
      id: `${prefix}-columns`,
      knowledge: `${id}-column-sums`,
      prompt: `同一张三行三列表，${gridText}。每列从上到下相加，依次填第1、2、3列的和。`,
      rule: { kind: 'steps', values: columns },
      hint: '第1列取每行第1个数，第2列取每行第2个数；不能用横行的和代替竖列的和。',
      explanation: [0, 1, 2]
        .map(
          (c) =>
            `第${c + 1}列：${grid.map((row) => row[c]).join(' + ')} = ${columns[c]}`,
        )
        .join('；'),
    },
    {
      id: `${prefix}-addition-pattern`,
      knowledge: `${id}-addition-pattern`,
      prompt: `${first} + 1、${first} + 2、${first} + 3、${first} + 4。依次填四个和。`,
      rule: { kind: 'steps', values: [1, 2, 3, 4].map((n) => first + n) },
      hint: '第一个加数不变，第二个加数每次多1，和也每次多1。',
      explanation: `和依次是${[1, 2, 3, 4].map((n) => first + n).join('、')}。`,
    },
    {
      id: `${prefix}-classify`,
      knowledge: `${id}-same-addend`,
      prompt: `挑出第一个加数是${first}的所有算式，不按得数是否相同来挑。`,
      choices: [
        { id: 'a', label: `${first} + 1` },
        { id: 'b', label: `${first} + 3` },
        { id: 'c', label: `1 + ${first}` },
        { id: 'd', label: `${first + 1} + 1` },
      ],
      rule: { kind: 'set', values: ['a', 'b'] },
      hint: '看加号前面的数；交换加数后和虽相同，第一个加数却可能不同。',
      explanation: `只有前两道算式的第一个加数是${first}。分类依据必须一致。`,
    },
    {
      id: `${prefix}-subtraction-pattern`,
      knowledge: `${id}-subtraction-pattern`,
      prompt: `${total} - 1、${total} - 2、${total} - 3、${total} - 4。依次填四个差。`,
      rule: { kind: 'steps', values: [1, 2, 3, 4].map((n) => total - n) },
      hint: '原来的数量不变，每次多拿走1，剩下的就少1。',
      explanation: `差依次是${[1, 2, 3, 4].map((n) => total - n).join('、')}。`,
    },
    {
      id: `${prefix}-sum`,
      knowledge: `${id}-same-sum`,
      prompt: `写出一种两个加数都大于0、和是${total}的加法。两个空依次填两个加数。`,
      rule: { kind: 'partition', total, parts: 2, minimum: 1 },
      hint: '用总数分成两个非空部分，再合起来检查。不同分法都可能正确。',
      explanation: `如1和${total - 1}、2和${total - 2}，只要两数都为正整数、和为${total}即可。`,
    },
    {
      id: `${prefix}-distance`,
      knowledge: `${id}-number-distance`,
      prompt: review
        ? '数线上的4，离2近一些还是离9近一些？'
        : '数线上的5，离8近一些还是离1近一些？',
      visual: {
        kind: 'number-line',
        minimum: 0,
        maximum: 9,
        value: review ? 4 : 5,
      },
      choices: review
        ? [
            { id: 'near', label: '离2近一些' },
            { id: 'far', label: '离9近一些' },
          ]
        : [
            { id: 'near', label: '离8近一些' },
            { id: 'far', label: '离1近一些' },
          ],
      rule: { kind: 'choice', value: 'near' },
      hint: '比较两边经过的相邻间隔数，不把起点算一步。',
      explanation: review
        ? '4到2经过2个间隔，到9经过5个间隔，所以离2近。'
        : '5到8经过3个间隔，到1经过4个间隔，所以离8近。',
    },
  ];
}

export const sujiaoNineConsolidationLesson: Lesson = {
  id,
  textbookTitle: '练习五、回顾与整理、练习与应用',
  title: '9以内整理：横竖求和、算式规律与队列变化',
  page: 48,
  status: 'available',
  version: 1,
  goal: '按横行和竖列分别求和，按一致依据整理加减算式，理解长队列的总人数、位置和离队后的变化。',
  prerequisite:
    '认识0～9，会9以内加减法与连加连减；准备数字卡、积木、纸笔和短纸条。',
  parentTip:
    '名字只用来识别人，不是位置答案；先找队首再数，队列人数不包括未画入的带队家长。横竖求和可以帮读或抄表，但实际计算仍由孩子做。',
  steps: [
    {
      title: '每一步都接着当前数量算',
      text: '连加、连减和加减混合都从左到右，先算前两个数，再从中间结果继续。把三行数字抄成方格表，横着每次取同一行，竖着每次取同一列；不把两种方向的结果混在一起。',
      activity:
        '在纸上画三行三列小表，填1～3的数字，分别圈出一行和一列，再算两种方向的和，保证都不超过9。',
    },
    {
      title: '算式可以按不同依据整理',
      text: '第一个加数相同的算式可以排在一组，第二个加数逐个增加，和也增加。减法的原来数量固定，减数增加，差就减少。也可以按和相同整理，不同依据得到不同分组；没有要求唯一一种排列。',
      activity:
        '制作两个正数相加、和不超过9的加法卡片，先按第一个加数分组，再换成按和分组，说明分组依据。',
    },
    {
      title: '长队列仍要找队首',
      text: '从队首开始第1、第2地数，数到最后是总人数。某人前面、后面都不包含自己。有人从前面离队，后面的序号会变；如果只从身后离队，本人的位置不变。总人数和某人的位置是两个问题。',
      visual: {
        kind: 'queue',
        labels: [
          '小禾',
          '小林',
          '小乐',
          '小文',
          '小青',
          '小宁',
          '小雨',
          '小星',
        ],
        front: 'left',
      },
      activity:
        '用8张名字卡排队，标出队首，再取走中间一张卡，保持其他顺序，重新报最后一人的位置；也试从队尾取走一张，观察队首的位置。',
    },
    {
      title: '用同一个单位接着量',
      text: '把同样长的短纸条首尾相接，不留空、不重叠，比较三段一共相当于多少个这样的单位。这是在数同样大小的单位，不是直接说多少厘米。每段长度或单位不同，就不能直接把单位个数相加。',
      activity:
        '画出长度分别相当于2、3、1个相同小格的三条彩带，用同样小格量，再首尾连接，用连加检查总长。由家长协助剪纸。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: `${id}-manual-table`,
      knowledge: `${id}-paper-table`,
      prompt:
        '按讲解在纸上做三行三列表，圈出一横行和一竖列，分别算和并解释取了哪些数，请家长查看。',
      rule: { kind: 'manual' },
      hint: '方向变了，取数的位置也随之改变。',
      explanation: '抄表、取数、计算与说明单独人工查看，不由数字答对自动确认。',
    },
    {
      id: `${id}-manual-cards`,
      knowledge: `${id}-equation-sorting`,
      prompt:
        '实际制作和不超过9的加法卡片，按第一个加数分组，再按和分组；另做同一总数的减法卡片，说明每组的规律。',
      rule: { kind: 'manual' },
      hint: '一次用同一种分组依据，换依据时重新分组。',
      explanation:
        '卡片整理和规律表达人工确认，不能用一次分类选择替代完整整理。',
    },
    {
      id: `${id}-manual-queue`,
      knowledge: `${id}-physical-queue`,
      prompt:
        '实际用8或9张名字卡排队，标出队首，分别取走某人前面和后面的卡，说明总人数与该人位置怎样变化，请家长查看。',
      rule: { kind: 'manual' },
      hint: '保持其他卡片顺序，每次从队首重新数，不包括本人。',
      explanation: '实际操作与口述分别查看；图示回答不代替操作。',
    },
    {
      id: `${id}-manual-length`,
      knowledge: `${id}-same-unit-length`,
      prompt:
        '用相同小格画三条不一样长的彩带，总长不超过9格。实际首尾相接检查总长，用连加记录，解释为何要用相同单位。',
      rule: { kind: 'manual' },
      hint: '小格相同，连接时没有重叠和空隙；不要把格数称为厘米。',
      explanation: '实际测量、拼接和说明人工确认，由家长协助剪纸。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版原书正文核验与原创教学检查',
    notes: `已实际核对ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第38、48～50页（${source.preview}）。原创表格、算式卡、8～9人队列和同单位彩带活动；不复制原图与题文。仅开放本课范围，不声明整册完成，保留人教版独立记录。`,
  },
};
