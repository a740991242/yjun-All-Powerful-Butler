import type { CircularNumberArrayVisual } from '../learning/circular-number-array';
import type { Lesson, Question } from '../learning/types';

import { circularNumberCells } from '../learning/circular-number-array';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-circular-numbers';
function tasks(review: boolean): Question[] {
  const start = review ? 40 : 20;
  const visual: CircularNumberArrayVisual = {
    kind: 'circular-number-array',
    start,
    hidden: [
      [0, 2],
      [1, 5],
      [2, 8],
      [3, 0],
    ],
  };
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual,
    hint: '先找从内向外第几环与顺时针A～J哪个扇区。同一环A到J逐次大1，同一扇区向外一环大10。J回A仍在原环，不把回到起点当顺数下一数。',
  });
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    rule: { kind: 'number', value },
    explanation,
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
    ...circularNumberCells(visual)
      .filter((cell) => !cell.known)
      .map((cell) =>
        number(
          `blank-${cell.letter}`,
          `在本次圆形数阵中，空格${cell.letter}（第${cell.ring + 1}环、${String.fromCodePoint(65 + cell.sector)}扇区）应填多少？`,
          cell.value,
          '从同环已知格或同扇区内侧格判断，再用另一个方向核对。',
        ),
      ),
    number(
      'outward',
      `从第1环G扇区的${start + 6}沿同一扇区向外一环，到第2环G，应是多少？`,
      start + 16,
      `同扇区向外一环加10，${start + 6}＋10＝${start + 16}。`,
    ),
    number(
      'clockwise',
      `从第2环I扇区的${start + 18}顺时针到同环J，应是多少？`,
      start + 19,
      '仍在同环且未越过J到A边界，下一扇区大1。',
    ),
    number(
      'wrap',
      `第2环J是${start + 19}。沿同环顺时针回到A，A是多少？`,
      start + 10,
      `回到这环的起点${start + 10}，不是进入第3环；同环J到A回退9。`,
    ),
    number(
      'outer-max',
      `本次数阵第4环最大的数是多少？注意只数图上四环。`,
      start + 39,
      '最外第4环A到J逐次增加，J最大；图外不补一个环。',
    ),
    number(
      'inner-max',
      '本次数阵最内第1环最大的数是多少？',
      start + 9,
      '最内环的J最大，不把中心说明当数字格。',
    ),
    number(
      'radial-difference',
      `本次第1环B是${start + 1}，第2环B是${start + 11}。外环这个数比内环大多少？`,
      10,
      `${start + 11}－${start + 1}＝10。差10与具体数值分开。`,
    ),
    choice(
      'ring-order',
      '怎样数第1环到第4环？',
      [
        { id: 'out', label: '从最内向最外' },
        { id: 'in', label: '从最外向最内' },
      ],
      'out',
      '本图明确定义从内向外编号，不凭另一张图的习惯。',
    ),
    choice(
      'wrap-rule',
      `有人说“从第2环J的${start + 19}回到同环A，就写${start + 20}”。为什么不对？`,
      [
        { id: 'same', label: '回A还在第2环；顺数下一数要换到第3环A' },
        { id: 'all', label: '任何相邻格都只能加1' },
      ],
      'same',
      '顺序的下一数与几何同环邻格不是同一件事；环边界必须检查。',
    ),
    choice(
      'blank-value',
      '空格K现在没显示数字，能直接把它当0吗？',
      [
        { id: 'no', label: '不能，空格待填，未显示不等于数值0' },
        { id: 'yes', label: '能，所有空格都表示0' },
      ],
      'no',
      '字母标空格，不给出隐藏答案，也不是0的标记。',
    ),
    choice(
      'centre',
      '中间“环：内→外”的说明是一个装数字的格子吗？',
      [
        { id: 'no', label: '不是，中心只是说明，数格从第一环开始' },
        { id: 'yes', label: '是，中心自动算一格' },
      ],
      'no',
      '本图只有四环各十格；不把中心标题作为数字或第五环。',
    ),
    choice(
      'not-rectangle',
      `本图${review ? '40～79' : '20～59'}按环和扇区排列，能用矩形数表的“上下一格”替代所有移动吗？`,
      [
        { id: 'no', label: '不能，先看圆形图的同环或向外方向' },
        { id: 'yes', label: '能，不论布局都按矩形上下左右' },
      ],
      'no',
      '数值规律可能有关联，实际布局和移动方向不同。',
    ),
    choice(
      'changed-array',
      `复习把首环A起点由20改40，环与扇区不变。怎样填本次${review ? '复习' : '学习'}空格？`,
      [
        { id: 'recheck', label: '按当前已知数重新推算，位置相同也不沿用旧值' },
        { id: 'old', label: '位置相同就复制旧空格答案' },
      ],
      'recheck',
      '同样的结构可以使用另一组数；复习换起点，不能只记字母对应答案。',
    ),
  ];
}
export const sujiaoCircularNumbersDraft: Lesson = {
  id,
  title: '圆形数阵：沿环与向外找数',
  textbookTitle: '认识20～99·圆形数阵',
  page: 47,
  version: 1,
  status: 'preparing',
  goal: '按环和扇区推算空格，区分同环顺时针、径向向外与跨环顺数，能解释边界。',
  prerequisite: '会20～99的顺数与相差10；准备纸和笔。',
  parentTip: `依据ISBN ${source.isbn}印刷47页圆形数阵按序填数与发现规律范围。本站原创四环十扇区，主课20～59、复习40～79，布局/数值/空格与原图不同，不复制原图。第1环最内，扇区A顶部顺时针到J；中心仅说明，不是数格。J回A仍在同环，与顺数到下一环分开；复习换起点，不固定记答案。纸面操作独立人工确认，不以本课代替47页或整个单元。`,
  steps: [
    {
      title: '先找环与扇区',
      text: '原创图有四个环，从内向外1～4。十个扇区从顶端A开始顺时针到J。中心只是方向说明，不装数。先说第几环哪个扇区，才确定一格；窄屏在图内横向滚动，边缘格也要看。',
      visual: { kind: 'circular-number-array', start: 20, hidden: [] },
      activity: '实际画四环十扇区，标环序与A～J。',
    },
    {
      title: '同环顺数，向外加十',
      text: '第1环从A20到J29，同环A到J逐次加1。第2环从30到39；同扇区从内向外，如B21、31、41、51，逐次加10。两个方向不要混用。',
      visual: { kind: 'circular-number-array', start: 20, hidden: [] },
      activity: '在纸面沿一个环读数，再沿一个扇区读数，比较变化。',
    },
    {
      title: '回到起点，不是进入下一环',
      text: '第1环J29回到同环A仍是20；顺数29的下一数30在第2环A。沿圆环走回去与沿数的顺序继续，是不同任务，不能只看相邻就加1。',
      visual: { kind: 'circular-number-array', start: 20, hidden: [] },
      activity: '在纸面分别指一指J回同环A与J到下一环A。',
    },
    {
      title: '填空并用另一方向核对',
      text: 'K～N分别是四个待填格。先定位，借同环已知数推算，再看相同扇区的内外数核对。字母不是数值0，图示和提示不预先写答案。',
      visual: {
        kind: 'circular-number-array',
        start: 20,
        hidden: [
          [0, 2],
          [1, 5],
          [2, 8],
          [3, 0],
        ],
      },
      activity: '实际把四个空格填在纸面，并口述至少两种核对方向。',
    },
    {
      title: '换起点再发现规律',
      text: '复习首环A从40开始，四环变为40～79。编号与方向保持，具体值改变。实际记录自己的发现；计划下次再画不算已经画好，未操作可暂跳。',
      visual: {
        kind: 'circular-number-array',
        start: 40,
        hidden: [
          [0, 2],
          [1, 5],
          [2, 8],
          [3, 0],
        ],
      },
      activity: '实际换起点画或读一组新数，不照搬旧答案。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在纸面画四个环和十个扇区，从内向外编号1～4、顺时针标A～J，指出中心不是数格。',
      '实际在纸面填本课四个空格，用同环顺数与同扇区相差10两种方向核对，口述过程。',
      '实际把首环A改为40，重新填数，分别指出J回同环A与顺数到下一环A的区别。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际画填指说之后独立确认，可以暂跳。',
      explanation: '网页答题不代替纸面操作。',
    })),
    {
      id: `${id}-own-rule`,
      knowledge: `${id}-own-rule`,
      prompt: '记录一个实际发现与所用环、扇区，可保留仍不确定的问题。',
      rule: { kind: 'reflection' },
      hint: '写自己的说明，不要求同一句话。',
      explanation: '开放发现不评分，不自动确认实际任务。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你怎样避免把同环回起点和继续到下一环混淆？可记录下次计划，计划不算已经完成。',
      rule: { kind: 'reflection' },
      hint: '保留原话。',
      explanation: '反思正确性为null。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读圆形数阵范围与原创几何边界核验',
    notes: `ISBN ${source.isbn}47页圆形数阵范围，原创四环十扇区与变起点复习；版次印次未知，不代表全单元完成。`,
  },
};
