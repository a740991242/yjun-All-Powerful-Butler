import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-number-conditions';
const range = (low: number, high: number) =>
  Array.from({ length: high - low + 1 }, (_, i) => low + i);
function tasks(review: boolean): Question[] {
  const ones = review ? 3 : 6;
  const tens = review ? 7 : 6;
  const bound = review ? 60 : 50;
  const upper = review ? 80 : 70;
  const middle = review ? 50 : 40;
  const narrow = review ? 70 : 80;
  const specs = [
    {
      key: 'same',
      prompt: review
        ? '写出一个大于50，且十位数字和个位数字相同的两位数。'
        : '写出一个十位数字和个位数字相同的两位数。',
      fields: [range(review ? 5 : 1, 9).map((n) => n * 11)],
      distinct: false,
      explanation: review
        ? '55、66、77、88、99都符合；还要核对大于50这个条件。'
        : '11、22、33、44、55、66、77、88、99都符合；0不是两位数。',
    },
    {
      key: 'ones',
      prompt: `写出三个不同的两位数，每个数的个位数字都是${ones}。`,
      fields: Array.from({ length: 3 }, () =>
        range(1, 9).map((n) => n * 10 + ones),
      ),
      distinct: true,
      explanation: `十位可选1～9，个位固定${ones}；三个数必须互不相同，先后顺序不限。`,
    },
    {
      key: 'tens',
      prompt: `写出三个不同的两位数，每个数的十位数字都是${tens}。`,
      fields: Array.from({ length: 3 }, () => range(tens * 10, tens * 10 + 9)),
      distinct: true,
      explanation: `可在${tens * 10}～${tens * 10 + 9}中任取三个不同的数，个位0也可以。`,
    },
    {
      key: 'less-left',
      prompt: `从0～99中选一个数填空：${bound}＞□。`,
      fields: [range(0, bound - 1)],
      distinct: false,
      explanation: `0～${bound - 1}都可以；${bound}与自身相等，不符合严格大于。`,
    },
    {
      key: 'less-right',
      prompt: `从0～99中选一个数填空：□＜${upper}。`,
      fields: [range(0, upper - 1)],
      distinct: false,
      explanation: `0～${upper - 1}都符合；负数和100不在本题范围。`,
    },
    {
      key: 'between',
      prompt: `从0～99中选一个数填空：${narrow + 10}＞□＞${narrow}。`,
      fields: [range(narrow + 1, narrow + 9)],
      distinct: false,
      explanation: `只能选${narrow + 1}～${narrow + 9}，两端数不符合严格不等式。`,
    },
    {
      key: 'two-sides',
      prompt: `从0～99中选数，依次填写两个空格：□＜${middle}＜□。`,
      fields: [range(0, middle - 1), range(middle + 1, 99)],
      distinct: false,
      explanation: `第1项须小于${middle}，第2项须大于${middle}；两项不能交换，也不能等于${middle}。`,
    },
  ];
  return specs.map((s): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${s.key}`,
    knowledge: `${id}-${s.key}`,
    prompt: s.prompt,
    rule: { kind: 'number-picks', fields: s.fields, distinct: s.distinct },
    hint: '先检查范围和数位，再逐项检查条件；要求不同的数时，还要检查有没有重复。符合条件的填法可能不止一种。',
    explanation: s.explanation,
  }));
}
export const sujiaoNumberConditionsDraft: Lesson = {
  id,
  title: '按条件找数：多种填法与三个不同的数',
  textbookTitle: '认识20～99·条件与多解',
  page: 47,
  version: 1,
  status: 'preparing',
  goal: '按数位和严格大小关系找数，接受全部符合条件的填法，区分一个示例与所有可能。',
  prerequisite: '认识两位数、十位和个位，能读懂大于、小于符号；准备纸笔。',
  parentTip:
    '依据已读第47、49、52页相关找数范围，数字与题目原创。数位题限定两位数，不等式限定0～99；不是抄录整页练习，不包含第52页三颗计数珠的全部情境。',
  steps: [
    {
      title: '两位数先看两个数位',
      text: '十位不能是0。十位和个位相同，可以是11，也可以是22或其它符合条件的两位数；找一个例子不等于只有这个答案。',
      activity: '实际在纸上写两个不同的例子，分别指着十位和个位说明。',
    },
    {
      title: '三个不同的数逐项检查',
      text: '个位固定时改变十位；十位固定时改变个位。每个数都要满足同一条件，而且三个数不能重复。顺序不限，不必只照一个示例抄写。',
      activity:
        '实际写三个个位都是4的不同两位数，圈出个位，再核对三个数不重复。',
    },
    {
      title: '严格大小关系不包括相等',
      text: '例如60＞□＞50，要同时小于60、大于50；50和60都不符合。若题目范围为0～99，0可以是有效答案，空白不能当作0。',
      activity: '在纸上写两个符合条件的数，再写一个不符合的数并说明理由。',
    },
    {
      title: '两个空格分别检查',
      text: '□＜30＜□中，第一个空格小于30，第二个空格大于30。先后位置不能交换；可以有很多种组合。填完从左向右读完整句子，逐条核对。',
      activity: '实际写两组不同的合法填法，并逐条口述核对。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在纸上写三个不同的两位数，自己指定相同的个位或十位；逐项圈数位并核对不重复。',
      '实际在纸上选一个0～99内的中间数，写两组满足左小右大的填法，并逐条读出完整不等式。',
      '实际与家人交流两种不同的正确填法，说明为什么都符合条件，并指出一个不符合条件的例子。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '纸面书写与实际口述完成后再确认，没有条件可以待做。',
      explanation: '网页作答不自动证明真实活动完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '你怎样判断一种新填法也正确？记录一个发现或还需要核对的地方。',
      rule: { kind: 'reflection' },
      hint: '记录真实想法，不要求唯一表述。',
      explanation: '开放反思不评分，不替代真实活动。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '数位条件与多解范围核验',
    notes: `依据ISBN ${source.isbn}已读第47、49、52页部分范围。复习改变真实数位和界限，合法填法全部接受；版次印次仍未知，不代表完整单元。`,
  },
};
