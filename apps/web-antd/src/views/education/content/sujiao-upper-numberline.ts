import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-numberline';

function tasks(review: boolean): Question[] {
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  const missing = review ? [1, 2, 5, 7, 8] : [3, 4, 6, 8, 9];
  const forwardStart = review ? 1 : 2;
  const forwardSteps = review ? 7 : 6;
  const backwardStart = review ? 9 : 8;
  const backwardSteps = review ? 5 : 4;
  const twoChanges = review
    ? [
        [
          'two-additions',
          '从4开始，先向右跳2格，再向右跳3格。依次填第一次落点、第二次落点。',
          [6, 9],
        ],
        [
          'two-subtractions',
          '从9开始，先向左跳3格，再向左跳4格。依次填两次落点。',
          [6, 2],
        ],
        [
          'add-then-subtract',
          '从2开始，先向右跳6格，再向左跳3格。依次填两次落点。',
          [8, 5],
        ],
        [
          'subtract-then-add',
          '从8开始，先向左跳5格，再向右跳3格。依次填两次落点。',
          [3, 6],
        ],
      ]
    : [
        [
          'two-additions',
          '从5开始，先向右跳1格，再向右跳2格。依次填第一次落点、第二次落点。',
          [6, 8],
        ],
        [
          'two-subtractions',
          '从6开始，先向左跳2格，再向左跳4格。依次填两次落点。',
          [4, 0],
        ],
        [
          'add-then-subtract',
          '从3开始，先向右跳5格，再向左跳2格。依次填两次落点。',
          [8, 6],
        ],
        [
          'subtract-then-add',
          '从9开始，先向左跳6格，再向右跳4格。依次填两次落点。',
          [3, 7],
        ],
      ];
  return [
    {
      ...base(
        'missing-numbers',
        `一条0～9数线，从左到右每相邻刻度差1。第一个刻度是0。依次填第${missing.map((n) => n + 1).join('、')}个刻度缺失的数（刻度从1数起，数值从0开始）。`,
      ),
      rule: { kind: 'steps', values: missing },
      hint: '数值和刻度的第几不同：第1个刻度表示0，第2个表示1。',
      explanation: `这些刻度依次表示${missing.join('、')}；0也占一个刻度，但不是从0到1的一次跳跃。`,
    },
    {
      ...base(
        'complete-read-order',
        review
          ? '从0到9逐一读数。按读数顺序填全十个数，包括两端。'
          : '从9到0逐一倒着读数。按读数顺序填全十个数，包括两端。',
      ),
      rule: {
        kind: 'steps',
        values: Array.from({ length: 10 }, (_, i) => (review ? i : 9 - i)),
      },
      hint: '每次只变1；包括0，不能把空白当0。',
      explanation: '0～9共有十个刻度数值，相邻间隔共有九个，两种数量不一样。',
    },
    {
      ...base(
        'forward-landings',
        `从${forwardStart}开始，每次向右跳1格，连续跳${forwardSteps}次。依次填每次跳完的落点，不把起点填作第1次落点。`,
      ),
      rule: {
        kind: 'steps',
        values: Array.from(
          { length: forwardSteps },
          (_, i) => forwardStart + i + 1,
        ),
      },
      hint: '先站好起点，走过一个间隔之后才完成第一次跳。',
      explanation: `落点依次${Array.from({ length: forwardSteps }, (_, i) => forwardStart + i + 1).join('、')}。`,
    },
    {
      ...base(
        'backward-landings',
        `从${backwardStart}开始，每次向左跳1格，连续跳${backwardSteps}次。依次填每次落点，不重复记起点。`,
      ),
      rule: {
        kind: 'steps',
        values: Array.from(
          { length: backwardSteps },
          (_, i) => backwardStart - i - 1,
        ),
      },
      hint: '每向左过一格，落点的数少1，起点不算已经跳了一格。',
      explanation: `落点依次${Array.from({ length: backwardSteps }, (_, i) => backwardStart - i - 1).join('、')}。`,
    },
    ...twoChanges.map(([key, prompt, values]): Question => {
      if (
        typeof key !== 'string' ||
        typeof prompt !== 'string' ||
        !Array.isArray(values)
      )
        throw new Error('Invalid jump task');
      return {
        ...base(key, `${prompt}第二次必须接着第一次落点跳，不能回到原起点。`),
        rule: { kind: 'steps', values },
        hint: '先看方向再数间隔，记录中间落点，第二次从这个数继续。',
        explanation: `两次落点依次${values.join('、')}，不是把两次变化各从原起点单独算。`,
      };
    }),
    {
      ...base(
        'interval-not-start',
        review
          ? '从4向右跳2格，依次落在5、6。实际跳了几格？'
          : '从5向右跳3格，依次落在6、7、8。实际跳了几格？',
      ),
      rule: { kind: 'number', value: review ? 2 : 3 },
      hint: '数走过的间隔，不把原起点当第一格。',
      explanation: '起点是还没跳时的位置，经过一个间隔才算一格。',
    },
    {
      ...base(
        'equal-spacing-distance',
        review
          ? '在等距0～9数线上，从4到2与从4到9，依次经过几格？'
          : '在等距0～9数线上，从5到8与从5到1，依次经过几格？',
      ),
      rule: { kind: 'steps', values: review ? [2, 5] : [3, 4] },
      hint: '沿数线一个间隔一个间隔地数，方向不同也按走过的格数比较。',
      explanation: review
        ? '分别2格和5格，4离2更近。'
        : '分别3格和4格，5离8更近。',
    },
  ];
}

export const sujiaoUpperNumberlineLesson: Lesson = {
  id,
  title: '0～9数线：完整标数与加减跳跃',
  textbookTitle: '6～9的加减法·画一画',
  page: 41,
  version: 1,
  status: 'available',
  goal: '实际画完整等距0～9数线，逐次记录加减与两次变化的落点，分清起点、落点和走过的间隔。',
  prerequisite: '认识0～9及加减法；准备纸笔，可用方格纸帮助画等距刻度。',
  parentTip: `对应ISBN ${source.isbn}印刷37、39、41、43、47、49～50页已读数线活动。本站例子原创，网页数线供走格观察，不能代替纸面实际画线画跳跃。方向按这条从左到右增大的线；格只表示相邻数差1，不称厘米。每道重新从该题起点开始，同一道第二次接着中间落点。`,
  steps: [
    {
      title: '十个刻度，九个间隔',
      text: '用方格纸画一条直线，选相同距离画十个刻度，从左到右逐一写0、1、2、3、4、5、6、7、8、9。相邻数差1。十个刻度之间只有九个间隔；数刻度的第几从1开始，刻度上的数从0开始。',
      activity:
        '纸面实际画完整数线，从0顺读到9，再从9倒读到0；遮住3、4、6、8、9后逐个补回，不漏0。',
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: 0 },
    },
    {
      title: '加法向右，每次记录落点',
      text: '5+1：先在5处标起点，向右画一个有箭头的弧，落在6。2+6：从2开始，每次跳1格，落点3、4、5、6、7、8，共六跳，最后是8。起点2不当第一个跳完的落点。也可画一个跨六格的弧，但要说清跨了六个间隔。',
      activity:
        '实际另画数线完成5+1、2+6、6+3，保留起点、方向、每次落点，分别写结果；网页每点前进一次只作辅助观察。',
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: 5 },
    },
    {
      title: '减法向左，各题恢复起点',
      text: '8−2从8向左两格，经过7，落在6；8−4从8重新开始，依次7、6、5、4，最后4。不能把上一题已到的6当作新题起点。9−6从9向左六格，落在3。',
      activity:
        '实际分别画8−2、8−4、9−6的跳跃箭头，写落点与差，边指线边说明向左少了几格。',
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: 8 },
    },
    {
      title: '同一道题第二次接着跳',
      text: '5+1+2从5先到6，再从6到8；6−2−4从6到4，再从4到0。3+5−2先向右到8，再向左到6；9−6+4先向左到3，再向右到7。每题先记中间数，再记最后数，第二次不回原起点。',
      activity:
        '实际在四条独立数线上画完四种两次变化，第二次弧线从第一次落点出发，分别标中间数和最终数，向家人解释。',
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: 5 },
    },
    {
      title: '按间隔比较距离，保留自己的作品',
      text: '在相同等距数线上，5到8走3格，5到1走4格，所以5更靠近8。这里比较的是数线间隔，不是数字字形宽度，也不直接当厘米。纸面自己画线、补数、画弧、说过程，与网页填答案分别记录。',
      activity:
        '实际在自己的完整数线上标5、8、1，分别数间隔；换成4、2、9再比较。最后检查所有跳跃有没有漏0、把起点当一跳或第二次回到原起点。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-complete-line',
        '实际在纸上画十个等距刻度，逐一标全0～9，顺读再倒读；先遮住3、4、6、8、9，再补回核对。指着纸线说十个刻度与九个间隔的区别，请家人看完整作品。网页填数不替代实际画线。',
      ],
      [
        'actual-addition-lines',
        '实际另画三条完整0～9数线，分别画5+1、2+6、6+3。标起点、向右箭头和各落点，写和，实际说明跳数不包含原起点。每题独立从题目起点开始，不只写结果。',
      ],
      [
        'actual-subtraction-lines',
        '实际另画三条完整0～9数线，分别画8−2、8−4、9−6。向左逐格画箭头，每题恢复指定起点，写差并实际指线说明；没有画或交流如实暂跳。',
      ],
      [
        'actual-two-change-lines',
        '实际在四条独立完整0～9数线上画5+1+2、6−2−4、3+5−2、9−6+4，四种全部画完。每条第二次从中间落点继续，标两个落点并写算式结果。请家人查看箭头连接与真实解释。',
      ],
      [
        'actual-distance',
        '实际在自己的等距0～9数线上标5、8、1，分别数5到8、5到1的间隔并比较；再标4、2、9独立比较。指着真实线说明“格”是相邻数差1，不直接当厘米。未来准备画不算实际已做。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实纸面画线、记录和表达后再确认，未做暂跳，计划另记。',
      explanation: '人工只记录真实操作，不由网页正确自动确认已画或已掌握。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '已读数线活动与原创逐次落点核对',
    notes:
      '复习改变缺位、顺倒读、起点跳数、全部两次变化与距离参照。真实画线五项独立人工记录，旧课包与会话保持，最终教师审校未核验，不声明第二单元全部完成。',
  },
};
