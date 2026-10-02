import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-symbol-digits';
function tasks(review: boolean): Question[] {
  const target = review ? 55 : 64;
  const circle = review ? 6 : 7;
  const candidate = review ? 52 : 61;
  const repeatedTarget = review ? 80 : 70;
  const repeated = review ? 8 : 7;
  const zeroCircle = review ? 6 : 8;
  const ambiguous = review ? 63 : 72;
  const a = review ? 7 : 8;
  const b = review ? 6 : 7;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    hint: '○表示圆圈数字，△表示三角数字；○△是十位○、个位△的两位数，不是相加。每个式子中的相同符号取相同数字，代回原式核对。',
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
    {
      ...base(
        'pair',
        `○△－○＝${target}，○△表示两位数。先填○（圆圈）的数字，再填△（三角）的数字。每个符号代表0～9中的一个数字，○不能为0。`,
      ),
      rule: { kind: 'steps', values: [circle, 1] },
      explanation: `○为${circle}，△为1，两位数${circle}1减${circle}得${target}。先确定数位，再代回核对。`,
    },
    number(
      'place-value',
      `○＝${circle}、△＝1时，两位数○△是多少？`,
      circle * 10 + 1,
      `○在十位，△在个位，写成${circle}1；不是${circle}＋1。`,
    ),
    number(
      'check',
      `核对填法：○＝${circle}、△＝1时，○△－○的结果是多少？`,
      target,
      `${circle}1－${circle}＝${target}，符合本题条件。`,
    ),
    choice(
      'positions',
      `在○△－○＝${target}中，两位数○△里的○表示什么位置的数字？`,
      [
        { id: 'tens', label: '十位数字，表示几个十' },
        { id: 'ones', label: '个位数字，表示几个一' },
        { id: 'sum', label: '把○与△相加' },
      ],
      'tens',
      '写在左边的○是十位数字，减去的○是同一个数字表示的单个一；位置不同，单位不同。',
    ),
    choice(
      'same-symbol',
      `检查○△－○＝${target}时，能把左边○取${circle}、右边○取${circle - 1}吗？`,
      [
        { id: 'no', label: '不能，同一式子相同符号必须取相同数字' },
        { id: 'yes', label: '可以，每出现一次随便换一个数字' },
      ],
      'no',
      '同一符号代表同一数字，不能为凑结果随意改值。不同题目则可以重新确定。',
    ),
    choice(
      'leading-zero',
      `○△必须是两位数，○取0、△取${circle}，写成0${circle}符合吗？`,
      [
        { id: 'no', label: '不符合，十位不能是0' },
        { id: 'yes', label: '符合，写了两个字符就是两位数' },
      ],
      'no',
      `0${circle}只表示${circle}，不是两位数。`,
    ),
    number(
      'zero-ones',
      `○＝${zeroCircle}、△＝0，○△表示的两位数是多少？个位0不能省略。`,
      zeroCircle * 10,
      `个位0占位，${zeroCircle}0表示${zeroCircle}个十，不是${zeroCircle}。`,
    ),
    number(
      'same-digit',
      `○○－○＝${repeatedTarget}，○○是两位数，相同○取相同数字，○是几？`,
      repeated,
      `${repeated}${repeated}－${repeated}＝${repeatedTarget}；重复符号在十位与个位表示的单位不同。`,
    ),
    choice(
      'different-symbols',
      `○△－○＝${repeatedTarget}，若○与△都取${repeated}，${repeated}${repeated}－${repeated}＝${repeatedTarget}。题目没有要求两符号的数字不同，这种填法符合吗？`,
      [
        { id: 'yes', label: '符合，不同符号不自动要求不同数字' },
        { id: 'no', label: '不符合，不同符号一定取不同数字' },
      ],
      'yes',
      '只检查明确条件；相同符号同值，不同符号是否必须不同须看题目有没有要求。',
    ),
    choice(
      'multiple',
      `新题○△－○＝${ambiguous}。填法A：○${a}、△0；填法B：○${b}、△9。两位数与同符号条件都满足，应接受哪种？`,
      [
        { id: 'both', label: 'A与B都接受，都代回得到题目结果' },
        { id: 'a', label: '只接受A，因为例子个位是0' },
        { id: 'b', label: '只接受B，因为个位不能是0' },
      ],
      'both',
      `${a}0－${a}＝${ambiguous}，${b}9－${b}＝${ambiguous}；两种都合法，不强判只有一种。`,
    ),
    choice(
      'wrong-candidate',
      `要解○△－○＝${target}，有人写○${circle - 1}、△7，代入${circle - 1}7－${circle - 1}＝${candidate}。这能作为本题答案吗？`,
      [
        { id: 'no', label: '不能，代回的结果与题目不同' },
        { id: 'yes', label: '能，只要是两位数减一位数即可' },
      ],
      'no',
      `算式本身可正确，但结果${candidate}不是所需${target}，不符合本题。`,
    ),
    choice(
      'digit-range',
      `本次○△－○＝${target}里，每个符号代表一个数字，△可以填10吗？`,
      [
        { id: 'no', label: '不能，每个符号只能代表0～9中的一个数字' },
        { id: 'yes', label: '可以，把10当一个个位数字' },
      ],
      'no',
      '一位数字是0～9。10是两位数，不能作为一个个位数字填入。',
    ),
  ];
}
export const sujiaoSymbolDigitsDraft: Lesson = {
  id,
  title: '图形代表数字：数位与代回核对',
  textbookTitle: '两位数加减·数字探索',
  page: 70,
  version: 1,
  status: 'preparing',
  goal: '读懂图形数字的数位与相同符号条件，尝试并代回检验，不把未要求的互异或唯一解当规则。',
  prerequisite: '会读写两位数与两位数减一位数；准备纸笔或数字卡。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷70页图形数字探索，本站改用原创64、55等条件。○与△只是数字占位符，不是数图形个数或几何识别。用试数和代回核对，不要求一年级掌握字母代数；不能以一道探索替代整个单元。`,
  steps: [
    {
      title: '先读位置，不把两个符号相加',
      text: '○叫圆圈，△叫三角。本课○△表示一个两位数：左边○在十位，右边△在个位。例如○7、△1时是71，不是7＋1，也不是图形个数。',
      activity: '实际画十位、个位两栏，把数字卡按位置放入并读数。',
    },
    {
      title: '同一符号同值，数位单位有区别',
      text: '○△－○中，两处○必须取相同数字。左边○在十位，表示几个十；右边减去的是这个数字表示的几个一，不是减几个十。○△必须是两位数，所以○不能取0，△可以是0。',
      activity: '实际指认两处○，说清数字相同但所在位置和单位不同。',
    },
    {
      title: '试数，再放回原式检查',
      text: '原创题○△－○＝64，试○7、△1，71－7＝64，满足条件。不能只说“看起来差不多”。若试○6、△7，则67－6＝61，结果不符，需要继续调整；尝试错误可以保留。',
      activity: '纸面分别记录一种符合与一种不符的尝试，写出核对结果。',
    },
    {
      title: '条件没有要求的事，不额外规定',
      text: '不同符号不一定必须是不同数字。例如○△－○＝70，○和△都为7，77－7＝70，题目没要求不同就可接受。○○－○中的三处○也要同值，不能每处另换数。',
      activity:
        '实际核对77－7，解释“相同符号同值”与“不同符号必须不同”不是一回事。',
    },
    {
      title: '可能有多解，换题重新核对',
      text: '新题○△－○＝72，80－8与79－7都得72，两种都合法。只要满足全部条件就接受，不因跟例子不一样而排除。换成55须重新试与检查，不能直接搬用旧答案。纸面过程和自己的发现另行记录。',
      activity:
        '实际用数字卡验证两种合法填法，保留条件不足以确定唯一答案的发现。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际画数位栏，选两张数字卡组成两位数，再把十位那张表示的几个一从这个数中减去，纸面核对。',
      '实际给○△－○＝64记录一种合法与一种不合法的尝试，写出代回结果；不同尝试不自动判为完成。',
      '实际验证80－8与79－7都得72，口述同符号同值、个位0占位以及为什么两种都可接受。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际摆卡、纸面与口述后分别确认，可暂跳。',
      explanation: '网页作答不自动确认真实活动。',
    })),
    {
      id: `${id}-attempts`,
      knowledge: `${id}-attempts`,
      prompt:
        '记下你真实试过的填法和怎样代回核对，可保留错误尝试或没想通的地方。',
      rule: { kind: 'reflection' },
      hint: '按真实过程记录，不强制唯一表述。',
      explanation: '开放过程null保存，不评分。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你怎样区分十位与个位，以及题目有没有要求数字不同或只有一种答案？记一个发现。',
      rule: { kind: 'reflection' },
      hint: '保留原话。',
      explanation: '反思null，与人工活动独立。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读探索范围与数位条件核验',
    notes: `ISBN ${source.isbn}印刷70页相关范围，原创符号数值与复习；版次印次未知，不代表整单元完成。`,
  },
};
