import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-cross-balance';
function tasks(review: boolean): Question[] {
  const values = review ? [3, 5, 7, 9, 11] : [2, 4, 6, 8, 10];
  const visual = { kind: 'cross-balance' as const, values };
  const example = review ? [5, 7, 3, 9, 11] : [4, 6, 2, 8, 10];
  const duplicate = review ? [3, 3, 7, 9, 9] : [2, 2, 6, 8, 8];
  const sum = review ? 19 : 16;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual,
    hint: '每个可用数恰好用一次，再分别计算竖线A＋C＋E与横线B＋C＋D。中心C只放一张卡，不把两条线要求误当都等于10。',
  });
  return [
    {
      ...base(
        'placement',
        `将${values.join('、')}每个恰用一次，按A、B、C、D、E填入，使两条线的和相等。可以用任何合法填法。`,
      ),
      rule: { kind: 'cross-balance', values },
      explanation:
        '先检查五个数没有重复或遗漏，再检查两条线的和；满足条件的不同填法都通过。',
    },
    {
      ...base(
        'centre-card',
        `本次使用${values.join('、')}。两条线共用中心C，中心实际应放几张数卡？`,
      ),
      rule: { kind: 'number', value: 1 },
      explanation:
        '中心是一个位置，实际放一张卡；分别算两条线时，各自算到同一个中心。',
    },
    {
      ...base(
        'positions',
        `仍使用${values.join('、')}，每条线3个位置，共用中心C，整个十字共有几个不同位置？`,
      ),
      rule: { kind: 'number', value: 5 },
      explanation: '上下左右和中心共5个，不能把共用中心重复计成6个。',
    },
    {
      ...base(
        'sums',
        `给定一种填法，A、B、C、D、E依次为${example.join('、')}。先填竖线的和，再填横线的和；这是例子，不是唯一标准填法。`,
      ),
      rule: { kind: 'steps', values: [sum, sum] },
      explanation: `竖线${example[0]}＋${example[2]}＋${example[4]}＝${sum}，横线${example[1]}＋${example[2]}＋${example[3]}＝${sum}。`,
    },
    {
      ...base(
        'duplicates',
        `有人按A、B、C、D、E写${duplicate.join('、')}，两线和相等。这符合“${values.join('、')}每个恰用一次”吗？`,
      ),
      choices: [
        { id: 'no', label: '不符合，有数重复，也有可用数没放入' },
        { id: 'yes', label: '符合，只要两线和相等就可以重复' },
      ],
      rule: { kind: 'choice', value: 'no' },
      explanation: '等和与每数恰用一次是两个条件，必须同时满足。',
    },
    {
      ...base(
        'different',
        `使用${values.join('、')}时，两种填法位置不同，但都每数一次且横竖和相等，应该怎样判断？`,
      ),
      choices: [
        { id: 'both', label: '两种都合法，不只认一种固定摆法' },
        { id: 'one', label: '只能与例子逐格相同才算正确' },
      ],
      rule: { kind: 'choice', value: 'both' },
      explanation:
        '可以交换同一线的两端或改变合法中心，检验条件即可，不以外观一样为标准。',
    },
  ];
}
export const sujiaoCrossBalanceDraft: Lesson = {
  id,
  title: '十字数阵：相等的和与不同填法',
  textbookTitle: '两位数加减·相等和探索',
  page: 63,
  version: 1,
  status: 'preparing',
  goal: '区分共用中心与五个位置，每数恰用一次，使横竖三数和相等并接受所有合法填法。',
  prerequisite: '会三个数连加；准备五张数卡和纸面十字。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷63页相等和十字探索。主课2/4/6/8/10、复习3/5/7/9/11，布局原创；不套用上册每线固定和10的sum-lines。每线和相等但和未指定，允许多解，网页图只给字母位置，不画标准答案。`,
  steps: [
    {
      title: '五个位置，共用一个中心',
      text: '上A、左B、中C、右D、下E。竖线A、C、E和横线B、C、D都经过C，但中心只放一张卡。每线三个位置，合起来不同位置只有五个。',
      visual: { kind: 'cross-balance', values: [2, 4, 6, 8, 10] },
      activity: '实际在纸面画十字，标五个字母并指出两条线共用中心。',
    },
    {
      title: '两个条件都要检查',
      text: '2、4、6、8、10每个恰用一次，不能重复或漏掉。再分别算两条线的和。要求和相等，不是指定和10，也不是只把五个数总和算一次。',
      visual: { kind: 'cross-balance', values: [2, 4, 6, 8, 10] },
      activity: '实际准备五张数卡，逐张核对用过的数，再分线相加。',
    },
    {
      title: '先试一种，再逐线核对',
      text: '例如A4、B6、C2、D8、E10，竖线4＋2＋10＝16，横线6＋2＋8＝16，五个数也恰各用一次，这是合法例子。图仍只给位置，纸面自行放卡。',
      visual: { kind: 'cross-balance', values: [2, 4, 6, 8, 10] },
      activity: '实际按例子摆卡，说清每条线三个数及共同的中心。',
    },
    {
      title: '不同填法也可以合法',
      text: '另一例子A2、B4、C6、D8、E10，两线都是18，也合法。16与18不用相同：每一种填法内部两线相等即可。交换同一线两端不会改变它的和，但每数一次仍须检查。',
      activity: '实际改变中心或交换端点，重新核对，记录一种不同的合法填法。',
    },
    {
      title: '换一组数，重新试与解释',
      text: '换3、5、7、9、11需要重新填，不能沿用旧数。可以先找到一种，再试其它；若数字重复，即使两线和相等也不符合。真实摆卡、纸面两线计算和表达另行确认。',
      visual: { kind: 'cross-balance', values: [3, 5, 7, 9, 11] },
      activity: '实际换五张新卡试填，保留过程与发现。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用2、4、6、8、10五张卡在纸面十字摆一种合法填法，每卡一次，分别口算两条线并核对。',
      '实际再找一种位置不同的合法填法，逐线检查相等，不以一定与第一种和相同为要求。',
      '实际换3、5、7、9、11重新摆，纸面记录横竖算式，并口述共用中心只放一张卡。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实摆卡、记录与口述后独立确认，可暂跳。',
      explanation: '网页合法答案不自动确认纸面活动。',
    })),
    {
      id: `${id}-own-method`,
      knowledge: `${id}-own-method`,
      prompt:
        '记录你找到的一种不同填法和两条线怎样检查，可以保留尝试或还没解决的问题。',
      rule: { kind: 'reflection' },
      hint: '保留真实推理，不强制唯一表述。',
      explanation: '开放记录null，不评分或冒充实物确认。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '你怎样避免重复用数或重复数中心？写下一个发现或待核对的地方。',
      rule: { kind: 'reflection' },
      hint: '按原话记录。',
      explanation: '反思null独立保存。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读数阵条件与多解核验',
    notes: `ISBN ${source.isbn}印刷63页相关范围，原创位置图与复习，版次印次未知，不证明整练习或单元完成。`,
  },
};
