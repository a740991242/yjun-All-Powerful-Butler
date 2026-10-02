import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-number-unit-arithmetic';
function tasks(review: boolean): Question[] {
  const [t, o, t2, o2, total] = review
    ? [40, 6, 60, 3, 87]
    : [30, 4, 50, 8, 75];
  const q = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const number = (
    key: string,
    a: number,
    op: '+' | '−',
    b: number,
  ): Question => ({
    ...q(key),
    prompt: `${a} ${op} ${b} = 多少？填写整个数，不是十的个数。`,
    rule: { kind: 'number', value: op === '+' ? a + b : a - b },
    hint: '先说几个十、几个一；把十和一的单位分清，再合并或去掉。',
    explanation: `${a} ${op} ${b} = ${op === '+' ? a + b : a - b}。用数的组成核对，个位与十位不能互换。`,
  });
  const choice = (
    key: string,
    prompt: string,
    good: string,
    bad: string,
  ): Question => ({
    ...q(key),
    prompt,
    choices: [
      { id: 'good', label: good },
      { id: 'bad', label: bad },
    ],
    rule: { kind: 'choice', value: 'good' },
    hint: '看清十的个数与全部数量的单位。',
    explanation: good,
  });
  const whole = review ? [90, 20, 70] : [80, 30, 50];
  return [
    number('compose', required(t), '+', required(o)),
    number('reverse', required(o), '+', required(t)),
    number('compose-two', required(t2), '+', required(o2)),
    number('reverse-two', required(o2), '+', required(t2)),
    number(
      'remove-tens',
      required(total),
      '−',
      Math.floor(required(total) / 10) * 10,
    ),
    number('remove-ones', required(total), '−', required(total) % 10),
    {
      ...q('units'),
      prompt: `${required(t) + required(o)}里面有几个十、几个一？按“十的个数、一的个数”依次填两个空。`,
      rule: { kind: 'steps', values: [required(t) / 10, required(o)] },
      hint: '这里问个数，不填整十数。',
      explanation: `${required(t) / 10}个十和${o}个一；${t}是整十数，不是十的个数。`,
    },
    number('whole-add', review ? 20 : 40, '+', review ? 50 : 20),
    number('whole-add-two', review ? 40 : 30, '+', review ? 50 : 60),
    {
      ...q('whole-subtract'),
      prompt: `${whole[0]} − ${whole[1]}、${whole[0]} − ${whole[2]}，依次填两个结果。`,
      rule: {
        kind: 'steps',
        values: [
          required(whole[0]) - required(whole[1]),
          required(whole[0]) - required(whole[2]),
        ],
      },
      hint: '同样去掉几个十，剩下几个十再写成整个数，个位仍为0。',
      explanation: `依次${whole[2]}、${whole[1]}；剩下的是整十数，不只写十的个数。`,
    },
    choice(
      'exchange',
      `为什么${t} + ${o}与${o} + ${t}结果相同？`,
      '合起来的十和一没有改变，只是加数顺序换了。',
      '交换后十位与个位也必须互换。',
    ),
    choice(
      'whole-unit',
      `${whole[0]} − ${whole[1]}算出剩${required(whole[2]) / 10}个十，应填哪个整个数？`,
      `${whole[2]}，十的个数要换成整个数。`,
      `${required(whole[2]) / 10}，只把十的个数当全部数量。`,
    ),
  ];
}
export const sujiaoNumberUnitArithmeticDraft: Lesson = {
  id,
  title: '用数的组成算加减：十和一的单位',
  textbookTitle: '练习六·数的组成与整十加减',
  page: 50,
  version: 1,
  status: 'preparing',
  goal: '由几个十、几个一理解整十数加一位数和相应减法，按十为单位计算整十加减，区分单位个数与整个数。',
  prerequisite: '会说两位数的组成及10以内加减；准备纸笔与安全纸片，十片一组。',
  parentTip: `依据ISBN ${source.isbn}印刷50～51页练习六第5～6题范围。以下数字与情境为原创，不复制原图；这里不涉及进位、退位或任意两位数运算，后续计算专题另教。实际摆物、口述和纸面计算独立确认。`,
  steps: [
    {
      title: '合起来仍是同样的十和一',
      text: '30是3个十，4是4个一，合起来34。4 + 30同样合成3个十和4个一，仍为34，不是43。换50和8，合起来58；交换加数不交换数位。',
      activity:
        '实际用3组各10片与4片散片摆34，再交换两堆位置并重新说数的组成；不把整组拆开后再凑不同数。',
    },
    {
      title: '去掉十与去掉一，剩的不同',
      text: '75由7个十和5个一组成。75 − 70去掉7个十，剩5个一，结果5；75 − 5去掉5个一，剩7个十，结果70。7是十的个数，不是剩下的全部数量。',
      activity:
        '另摆7组各10片与5片散片，分别从同样的75中去掉70或5。第二次先恢复75，不能接着从上次剩下的5继续算。',
    },
    {
      title: '整十加减按组算，再写整个数',
      text: '40 + 20是4个十加2个十，合成6个十，写60。30 + 60是9个十，写90。80 − 30剩5个十，写50；80 − 50剩3个十，写30。问十的个数与问整个数要分别回答，整十数个位为0。',
      activity:
        '实际每10片为一组摆40与20，合并数组再数片；重新摆80，分别去掉30、50，每次恢复起始数量。',
    },
    {
      title: '改变数字，仍按组成核对',
      text: '复习换40与6合成46，60与3合成63；87去掉80剩7，去掉7剩80。20 + 50写70，90去掉20写70、去掉70写20。每次看当前条件，不沿用上一题的34或75；本节没有进位或退位。',
      activity:
        '实际另写一组整十加一位数、交换加数和对应两条减法，再写一组整十加减，口头说明每个结果的单位。不会可保留待做。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际摆3组各10片和4片散片，交换两堆并说两条加法；再另摆5组与8片散片，重新说组成。',
      '实际摆75，去掉70并记录；恢复75后去掉5并记录，分别说明剩几个一或几个十以及整个数。',
      '实际用十片一组完成40 + 20与80的两条减法，纸面另写换数字的一组算式并逐一说明单位；每次恢复起始数量。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际摆、写、说后确认，网页正确不替代操作。',
      explanation: '没做保留待做，下一步计划不算已经完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '我怎样区分几个十和整个数？记录一次实际核对或还需要练习的地方，没做如实写。',
      rule: { kind: 'reflection' },
      hint: '实际经历和下一步计划分开。',
      explanation: '开放反思correct=null，不自动确认实际操作或计算能力。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '数的组成及整十运算边界核对',
    notes: `依据ISBN ${source.isbn}已读50～51页，原创数例，复习改变组成与整十数，范围不扩至进位退位。未知版次印次不补造，不宣称全单元最终审校完成。`,
  },
};
