import type { Lesson, Question } from '../learning/types';

import { beadNumbers } from '../learning/digit-counter';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-bead-budget';
function tasks(review: boolean): Question[] {
  const first = review ? 13 : 12;
  const total = review ? 4 : 3;
  const last = total * 10;
  const second = review ? 22 : 21;
  const visual = (value: number) => ({
    kind: 'digit-counter' as const,
    tens: Math.floor(value / 10),
    ones: value % 10,
  });
  const c = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    value: string,
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    choices,
    rule: { kind: 'choice', value },
    hint: '先确认十位和个位，再分别看珠数；两位数的十位不能是0。',
    explanation,
  });
  return [
    ...[first, second, last].map((value, index): Question => ({
      id: `${id}-${review ? 'r' : 'q'}-read-${index}`,
      knowledge: `${id}-read-${index}`,
      prompt: '看计数器，写出表示的数。',
      visual: visual(value),
      rule: { kind: 'number', value },
      hint: '十位珠表示几个十，个位珠表示几个一；个位无珠仍在原位。',
      explanation: `表示${Math.floor(value / 10)}个十和${value % 10}个一，是${value}。`,
    })),
    {
      id: `${id}-${review ? 'r' : 'q'}-beads`,
      knowledge: `${id}-beads`,
      prompt: '两根杆上合起来实际放了几颗珠？不是问表示的数。',
      visual: visual(first),
      rule: { kind: 'number', value: total },
      hint: '本题数材料颗数，每颗只计一次，不按表示价值计算。',
      explanation: `材料有${total}颗，表示的数为${first}，两个问题单位不同。`,
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-compose`,
      knowledge: `${id}-compose`,
      prompt: `用全部${total}颗珠表示${first}，十位、个位依次需要几颗？`,
      rule: { kind: 'steps', values: [1, total - 1] },
      hint: '按数位分别填写，合计材料颗数不能增加。',
      explanation: `十位1颗、个位${total - 1}颗，合计${total}颗。`,
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-all`,
      knowledge: `${id}-all`,
      prompt: `两根杆固定为十位和个位，恰好用全部${total}颗珠，不增加或拿走。选出所有能表示的两位数。`,
      choices: [...beadNumbers(total), total, total * 11].map((n) => ({
        id: String(n),
        label: String(n),
      })),
      rule: {
        kind: 'set',
        values: beadNumbers(total).map(String),
      },
      hint: '十位至少1颗，逐次把1颗由个位移到十位，列全；检查珠的总颗数。',
      explanation: `全部可能为${beadNumbers(total).join('、')}。${total}不是两位数，${total * 11}需要${total * 2}颗珠。`,
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-max`,
      knowledge: `${id}-max`,
      prompt: `仍用全部${total}颗珠表示两位数，最大的数是多少？`,
      rule: { kind: 'number', value: last },
      hint: '同一珠放十位代表10，放个位代表1。最大时十位尽量多。',
      explanation: `${total}颗全在十位，个位0，是${last}。`,
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-min`,
      knowledge: `${id}-min`,
      prompt: `仍用全部${total}颗珠表示两位数，最小的数是多少？`,
      rule: { kind: 'number', value: first },
      hint: '十位不能0；先留最少1颗在十位，剩下在个位。',
      explanation: `十位1颗、个位${total - 1}颗，是${first}，不是${total}。`,
    },
    c(
      'zero-tens',
      `十位无珠，个位${total}颗，写成“0${total}”就成为两位数了吗？`,
      [
        { id: 'no', label: '没有，仍只表示一个一位数' },
        { id: 'yes', label: '是的，只要写两个字符就是两位数' },
      ],
      'no',
      '数位价值由数量决定，前面写0不把一位数变成两位数。',
    ),
    {
      ...c(
        'zero-ones',
        `十位${total}颗，个位没有珠，表示的数怎样写？`,
        [
          { id: 'keep', label: `${last}，个位保留0` },
          { id: 'omit', label: `${total}，省略个位` },
        ],
        'keep',
        '个位没有单个一，用0占位，十位珠不会变成个位珠。',
      ),
      visual: visual(last),
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-move`,
      knowledge: `${id}-move`,
      prompt: `原来十位1颗、个位${total - 1}颗，把个位的一颗移到十位，其它不动，现在表示多少？`,
      rule: { kind: 'number', value: second },
      hint: '移动后十位多1颗，个位少1颗，材料总数不变，但价值变化。',
      explanation: `变为2个十和${total - 2}个一，是${second}。`,
    },
    c(
      'conserve',
      `同样${total}颗珠由${first}的摆法换为${second}的摆法，哪句话正确？`,
      [
        { id: 'value', label: '珠的总颗数不变，表示的数改变' },
        { id: 'same', label: '珠数一样，表示的数也一定一样' },
      ],
      'value',
      '珠的位置代表不同数位；保持材料数量不等于保持表示价值。',
    ),
  ];
}
export const sujiaoBeadBudgetDraft: Lesson = {
  id,
  title: '有限颗珠找两位数：列全与最大最小',
  textbookTitle: '认识20～99·计数器推理',
  page: 52,
  version: 1,
  status: 'preparing',
  goal: '在固定十位和个位使用全部有限颗珠，列全合法两位数，区分材料颗数与表示价值并推最大最小。',
  prerequisite: '认识十位个位与0占位；准备纸面两根数位杆和安全计数片。',
  parentTip:
    '依据已读第52页3颗珠的推理范围，原创计数器图与题目。主课3颗，复习换4颗；不增减、每颗属于一根杆，只表示十位和个位。网页版图只读，不自动确认实物拨珠。',
  steps: [
    {
      title: '数材料与读数是两个问题',
      text: '十位一颗表示一个十，个位一颗表示一个一。图中十位1颗、个位2颗，有3颗材料珠，但表示12，不能把材料3颗当成数3。',
      visual: { kind: 'digit-counter', tens: 1, ones: 2 },
      activity:
        '实际在纸上画十位和个位两根杆，摆1片和2片，分别说材料总数与表示价值。',
    },
    {
      title: '按顺序列出全部可能',
      text: '只用3颗，要表示两位数，十位至少1颗。先十位1颗、个位2颗，再十位2颗、个位1颗，最后十位3颗、个位0颗。这样得到12、21、30，三种都满足，总珠数始终3。',
      visual: { kind: 'digit-counter', tens: 2, ones: 1 },
      activity:
        '实际逐次把1片由个位移到十位，记录每一步，不增加材料，也不重复漏记。',
    },
    {
      title: '空个位与空十位不同',
      text: '十位3颗、个位0颗表示30，个位0不能省成3。若十位0颗、个位3颗，只表示3，不是两位数；写成03也不会变成两位数。最大30、最小12。',
      visual: { kind: 'digit-counter', tens: 3, ones: 0 },
      activity:
        '实际对比两根杆中哪根为空，说清0为什么在一个位置是合法占位，在另一个位置不形成两位数。',
    },
    {
      title: '换珠数后重新推理',
      text: '若换成4颗，要重新逐次分配，从十位1颗开始，把合法两位数列全再比较。不能照搬3颗的答案。材料守恒，但珠放的数位不同，表示价值可以改变；真实拨珠和口述另行确认。',
      visual: { kind: 'digit-counter', tens: 1, ones: 3 },
      activity: '实际用4片在两根杆列全，检查每种都恰用4片，并解释最大最小。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用3片在纸面十位、个位两根杆列全所有两位数，每次恰用全部3片；逐项记录，不漏记或增加材料。',
      '实际对比十位空与个位空的摆法，说清是否两位数及0怎样占位，再口述3片的最大与最小。',
      '实际换成4片重新列全，检查每种两位数都使用全部4片，并解释移动一片时材料数与表示价值的变化。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '纸面摆拨和表达确实完成后才确认，可留待做。',
      explanation: '只读图示不自动证明实际拨珠完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '怎样保证列全且每种都用全部珠？记录一个发现或待核对的问题。',
      rule: { kind: 'reflection' },
      hint: '保留真实推理，不要求唯一表述。',
      explanation: '反思null，不评分，不代替实际任务。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '有限珠数与数位范围核验',
    notes: `依据ISBN ${source.isbn}印刷52页相关推理范围，原创双杆示意。复习改4颗与真实答案，版次印次未知，不代表完整单元。`,
  },
};
