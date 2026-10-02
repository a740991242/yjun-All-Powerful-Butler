import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-comparison-applications';
function tasks(review: boolean): Question[] {
  const pairs = review
    ? [
        [36, 39],
        [72, 27],
        [8, 16],
        [65, 65],
      ]
    : [
        [23, 26],
        [42, 24],
        [9, 18],
        [54, 54],
      ];
  const base = review ? 60 : 40;
  const people = review ? 47 : 36;
  const seats = review ? [40, 50, 60] : [30, 40, 50];
  const sequence = review ? [73, 38, 83, 37, 68] : [62, 27, 72, 26, 57];
  const q = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    value: string,
    hint: string,
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    choices,
    rule: { kind: 'choice', value },
    hint,
    explanation,
  });
  return [
    ...pairs.map(([a, b], i) =>
      q(
        `compare-${i}`,
        `${a} ○ ${b}，选择正确的比较符号。`,
        [
          { id: 'greater', label: '＞' },
          { id: 'less', label: '＜' },
          { id: 'equal', label: '＝' },
        ],
        (() => {
          if (required(a) > required(b)) return 'greater';
          return required(a) < required(b) ? 'less' : 'equal';
        })(),
        '先比位数；都是两位数先比十位，十位相同再比个位。',
        `${a}${(() => {
          if (required(a) > required(b)) return '＞';
          return required(a) < required(b) ? '＜' : '＝';
        })()}${b}。十位不同不能只比个位；相同数量用等号。`,
      ),
    ),
    q(
      'some-less',
      `小禾有${base}张卡。小宁比小禾少一些。只比较本题三个候选数，哪个最符合“少一些”？`,
      [
        { id: 'near', label: `${base - 3}张` },
        { id: 'far', label: `${base - 28}张` },
        { id: 'more', label: `${base + 3}张` },
      ],
      'near',
      '先找少的，再在少的候选数中比较哪个更接近。',
      `${base - 3}比${base}少且接近；${base - 28}少得多，${base + 3}反而更多。本题候选数的比较不形成通用差值界限。`,
    ),
    q(
      'much-more',
      `甲有${base}个球，乙比甲多得多。只比较本题三个候选数，哪个最符合？`,
      [
        { id: 'less', label: `${base - 2}个` },
        { id: 'near', label: `${base + 3}个` },
        { id: 'far', label: `${base + 28}个` },
      ],
      'far',
      '先找更多的，再比较两个更多候选数离原数的远近。',
      `${base + 28}明显多于${base}；${base + 3}在本题更适合说多一些。数量词依具体情境理解，不规定统一差几。`,
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-enough`,
      knowledge: `${id}-enough`,
      prompt: `示例共有${people}人（已包括所有乘客）。每人一座，只用一辆车。选择所有座位足够的车。`,
      choices: seats.map((n) => ({ id: String(n), label: `${n}座车` })),
      rule: {
        kind: 'set',
        values: seats.filter((n) => n >= people).map(String),
      },
      hint: '够坐要求座位数不少于人数。可能有不止一辆满足。',
      explanation: `${seats.filter((n) => n >= people).join('、')}座都够；够坐不等于空座最少。`,
    },
    q(
      'suitable',
      `仍是${people}人，每人一座，只用一辆车。在够坐的车里选空座最少的一辆。`,
      seats.map((n) => ({ id: String(n), label: `${n}座车` })),
      String(seats.find((n) => n >= people)),
      '先排除不够的，再比较剩余车辆，座位较少但足够的一辆空座更少。',
      `${seats.find((n) => n >= people)}座最符合这道题的条件；不只看最大车辆。本题仅比较座位，不推断真实价格或路线。`,
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-sort`,
      knowledge: `${id}-sort`,
      prompt: `把${sequence.join('、')}按从小到大依次填写。`,
      rule: { kind: 'steps', values: [...sequence].toSorted((a, b) => a - b) },
      hint: '先比较十位，相同十位再比较个位；每个原数恰用一次。',
      explanation: `从小到大为${[...sequence].toSorted((a, b) => a - b).join('、')}。排序方向不能反过来。`,
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-choose`,
      knowledge: `${id}-choose`,
      prompt: `从0～99中任写一个比${review ? 58 : 45}大的数。`,
      rule: {
        kind: 'number-picks',
        fields: [
          Array.from(
            { length: 99 - (review ? 58 : 45) },
            (_, i) => (review ? 58 : 45) + 1 + i,
          ),
        ],
        distinct: false,
      },
      hint: '大于不含相等；本题范围止于99，多种答案都可以。',
      explanation: `${review ? 59 : 46}～99都符合，不只认一个例子。`,
    },
    q(
      'direction',
      review
        ? '从右向左读“39＜72”，正确说法是哪一个？'
        : '从右向左读“26＜57”，正确说法是哪一个？',
      [
        { id: 'greater', label: review ? '72大于39' : '57大于26' },
        { id: 'less', label: review ? '72小于39' : '57小于26' },
      ],
      'greater',
      '交换说话对象时，同时改用相反的大小说法。',
      '同一个关系可以说左边小于右边，也可以说右边大于左边。',
    ),
  ];
}
export const sujiaoComparisonApplicationsDraft: Lesson = {
  id,
  title: '数的比较与应用：够坐和比较合适',
  textbookTitle: '认识20～99·比较与应用',
  page: 48,
  version: 1,
  status: 'preparing',
  goal: '按数位比较和排序，在具体候选情境理解相差程度，区分所有够坐方案与空座最少方案。',
  prerequisite: '认识一位数和两位数、十位与个位、大小符号；准备纸笔或数量卡。',
  parentTip:
    '依据已核对第48、49页相关范围，数字、人物与情境原创。多一些/多得多不设置统一差值阈值；车辆题显式给出乘客总数与选择标准，不冒充真实出行建议。本课不代表全部练习六或完整单元。',
  steps: [
    {
      title: '先比位数，再比十位与个位',
      text: '两位数比一位数大。比较42和24，先看十位4与2，42更大，不能只看个位。比较23和26，十位相同才比个位；54与54相等。',
      activity: '实际用数量卡写两组比较，圈出先比较的数位。',
    },
    {
      title: '位置和相差程度',
      text: '把两个数在同一条数线上定位，靠右的更大。在40附近比较37和12，37更接近40；说少一些、少得多要联系本题数量与候选数，没有“差某个数就永远叫多得多”的通用规则。',
      visual: { kind: 'number-line', minimum: 30, maximum: 45, value: 37 },
      activity: '在纸上画数线，标出自己选择的三个数，解释大小及谁更接近。',
    },
    {
      title: '够坐的车可能不止一辆',
      text: '36人每人一座，只用一辆车。30座不够，40座和50座都够。若进一步要求够坐且空座最少，40座更合适。真实车辆还受其它条件影响，本题只比较座位。',
      activity: '用纸卡表示人数与三种座位数，先圈所有够坐的，再圈空座最少的。',
    },
    {
      title: '排序与反向表达',
      text: '排序先读清从小到大还是从大到小，原数每个恰用一次。26小于57，也可以说57大于26；说话对象交换，关系仍应一致。自己选数比较时可以有多种正确答案。',
      activity: '实际写五张不重复数量卡，排序后反过来读，并口述一组大小关系。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用五张数量卡从小到大排列，再从大到小读，逐张检查没有遗漏或重复。',
      '实际画人数和座位卡，先指出所有够坐的方案，再按空座最少条件选一个并说明理由。',
      '实际选三个数，在同一数线上定位并口述谁大、谁小及谁更接近；不把情境词当固定阈值。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '纸面和口述确实完成后才确认，可留待做。',
      explanation: '网页答案不自动证明实际任务完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '够坐与空座最少有什么不同？记录一个发现或待核对的问题。',
      rule: { kind: 'reflection' },
      hint: '保留真实想法，没有唯一表述。',
      explanation: '反思null，不评分也不替代实物任务。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '比较情境与明确选择条件核验',
    notes: `依据ISBN ${source.isbn}已读第48、49页部分范围。候选数和人数座位原创，复习改变数据；版次印次未知，不代表完整单元。`,
  },
};
