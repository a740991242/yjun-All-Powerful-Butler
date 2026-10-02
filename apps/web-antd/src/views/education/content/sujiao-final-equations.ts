import type { SmallArithmeticVisual } from '../learning/small-arithmetic';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { smallArithmeticCell } from '../learning/small-arithmetic';
import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-final-equations';
export function finalSmallTable(
  operation: SmallArithmeticVisual['operation'],
  review = false,
  example = false,
): SmallArithmeticVisual {
  const axes = {
    add: review
      ? { rows: [4, 8, 6], columns: [5, 9, 7] }
      : { rows: [9, 7, 5], columns: [6, 8, 10] },
    subtract: review
      ? { rows: [8, 6, 7], columns: [17, 19, 18] }
      : { rows: [7, 8, 9], columns: [16, 17, 18] },
  };
  const { rows, columns } = axes[operation];
  const hidden: [number, number][] = rows
    .flatMap((_, row) =>
      columns.map((_, column): [number, number] => [row, column]),
    )
    .filter((_, i) => !example || (i !== 0 && i !== 4));
  return { kind: 'small-arithmetic', operation, rows, columns, hidden };
}
function tableExpressions(visual: SmallArithmeticVisual) {
  return visual.rows.flatMap((row, r) =>
    visual.columns.map((column, c) => ({
      id: `${r}-${c}`,
      label:
        visual.operation === 'add' ? `${row}＋${column}` : `${column}－${row}`,
      value: required(smallArithmeticCell(visual, r, c)),
    })),
  );
}
function tasks(review: boolean): Question[] {
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const questions: Question[] = [];
  for (const operation of ['add', 'subtract'] as const) {
    const visual = finalSmallTable(operation, review);
    questions.push({
      ...common(`table-${operation}`),
      prompt: `按A～I顺序填完原创${operation === 'add' ? '加法' : '减法'}小表。按行从左到右，再到下一行；${operation === 'add' ? '行头加列头' : '列头减行头'}，每格独立计算。`,
      visual,
      rule: {
        kind: 'steps',
        values: visual.hidden.map(([r, c]) =>
          required(smallArithmeticCell(visual, r, c)),
        ),
      },
      hint: '每空先找自己的行头和列头，不能把上一格得数当下一格起点。减法不要倒过来。',
      explanation:
        '逐格用原行列条件计算，字母只指定填空位置；减法列头是被减数，行头是减数。',
    });
  }
  for (const operation of ['add', 'subtract'] as const) {
    const visual = finalSmallTable(operation, review);
    const targets = { add: review ? 13 : 15, subtract: review ? 11 : 9 };
    const target = targets[operation];
    const expressions = tableExpressions(visual);
    questions.push({
      ...common(`equal-${operation}`),
      prompt: `从这张小表对应的算式中，选出全部得数为${target}的算式。每条都计算核对，不只选一条。`,
      visual,
      choices: expressions.map(({ id, label }) => ({ id, label })),
      rule: {
        kind: 'set',
        values: expressions.filter((e) => e.value === target).map((e) => e.id),
      },
      hint: '行列换了位置或数字后要重新算，算式的外观不决定得数。',
      explanation: `所有入选算式都得${target}，可以写等号连接并分别代回核对；只有本表给定条件可用。`,
    });
  }
  const first = review ? 30 : 20;
  const rightFirst = review ? 23 : 22;
  const triangle = rightFirst + 40 - first;
  const start = review ? 54 : 46;
  const take = review ? 7 : 8;
  const circle = start - take + 10;
  const whole = review ? 16 : 15;
  const total = review ? 10 : 8;
  const zeroBase = review ? 8 : 9;
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    rule: { kind: 'number', value },
    hint: '先算完整已知的一边，再试未知数，代回原式核对两边得数相等。符号在本课代表整个数。',
    explanation,
  });
  questions.push(
    number(
      'left-unknown',
      `${first}＋△＝${rightFirst}＋40，△代表一个完整的数。△是多少？`,
      triangle,
      `已知右边得${rightFirst + 40}，左边要同样得${rightFirst + 40}。填${triangle}后，${first}＋${triangle}＝${rightFirst}＋40；不能只把40抄进空里。`,
    ),
    number(
      'right-unknown',
      `${start}－${take}＝○－10，○代表一个完整的数。○是多少？`,
      circle,
      `左边得${start - take}，右边原数减10后也要得${start - take}，所以○是${circle}。不是把左边得数直接填为○。`,
    ),
    number(
      'missing-subtrahend',
      `${whole}－○＝${review ? '4＋6' : '3＋5'}，○是多少？`,
      whole - total,
      `已知右边得${total}，${whole}减${whole - total}正好得${total}；未知数在减数位置，不能与原数相加。`,
    ),
    number(
      'zero-unknown',
      `${zeroBase}＋○＝${review ? '3＋5' : '3＋6'}，○是多少？`,
      0,
      `两边原本都得${zeroBase}，加0没有增加。0是有依据的合法答案，不把输入空白当0。`,
    ),
  );
  for (const item of [
    {
      key: 'whole-number',
      prompt: `本课${first}＋△＝${rightFirst}＋40中，△可以填${triangle}这个两位数吗？`,
      good: '可以，题目明确代表完整的数，不限制为一位数字',
      bad: '不能，任何图形都只能代表0～9',
    },
    {
      key: 'equal-meaning',
      prompt: review
        ? '两边加数排列不同，只要分别算出的结果相同，可以用等号连接吗？'
        : '等号要求左右两边什么相同？',
      good: '两边计算得到的数量相同，不要求写法一模一样',
      bad: '数字排列必须完全一样才算相等',
    },
    {
      key: 'check-candidate',
      prompt: review
        ? '试△＝40，则30＋40＝70，23＋40＝63。这种填法符合原式吗？'
        : '试△＝40，则20＋40＝60，22＋40＝62。这种填法符合原式吗？',
      good: '不符合，两边得数不相等，需重新试并核对',
      bad: '符合，只要两边都写了加法就行',
    },
    {
      key: 'keep-operation',
      prompt: review
        ? '求○－10时，可以把原式改成○＋10再说核对成功吗？'
        : '代回○－10核对时，可以擅自把减号改成加号吗？',
      good: '不能，保留原数、运算和两边条件再核对',
      bad: '可以，为得到想要的数随便换运算',
    },
  ])
    questions.push({
      ...common(item.key),
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '只使用当前题目明确条件，不能借另一课的数字限制或改动原式。',
      explanation:
        '本课图形代表完整数；等号检查原式两边值，不要求相同写法，不允许改题凑结果。',
    });
  return questions;
}
export const sujiaoFinalEquationsDraft: Lesson = {
  id,
  title: '期末运算探索：小表与等式两边',
  textbookTitle: '期末复习：小算式表与图形未知数',
  page: 91,
  version: 1,
  status: 'preparing',
  goal: '读三行三列加减小表，逐格计算并找多条相同得数算式；试完整未知数并代回两边核对，区分一位数字与整个数。',
  prerequisite: '会20以内加减及两位数加减整十数或一位数，准备纸笔或数字卡。',
  parentTip:
    '来源为已读91页小表与94页两边等值求图形数。本站轴值、题目原创；此减表明确列头减行头，不照搬别的大表规则。符号在本课代表完整数，不能套70页○△一位数字限制；无需字母代数或移项口诀，可试数代回。九空按A～I依行排列，隐藏格不在图或读屏显示答案。纸面完成、自己写几组同值算式与解释各自人工确认，反思null、计划不当已做，旧课包快照不改。',
  steps: [
    {
      title: '加表先找行头和列头',
      text: '这张原创小表行头9、7、5，列头6、8、10。每格算所在行头加列头，例如第一行第一格9＋6＝15；中间格7＋8也得15。其它待填格按字母定位，从左到右再换行，每格都用自己的原条件，不接着上一格连加。',
      visual: finalSmallTable('add', false, true),
      activity: '实际画完整三行三列小表，逐格填写并说每格的两个加数。',
    },
    {
      title: '减表方向不同，先说清',
      text: '列头16、17、18是被减数，行头7、8、9是减数。第一格16－7＝9，中间格17－8也得9；不是7－16。沿同一行只保持减数，沿同一列只保持被减数。三行九格全部填写，不由网页正确自动认定纸面完成。',
      visual: finalSmallTable('subtract', false, true),
      activity:
        '实际画并填减法小表，每格都指列头减行头，保留错误后的修正过程。',
    },
    {
      title: '找同值算式，再自己写几组',
      text: '9＋6、7＋8、5＋10都得15，可以用等号连接；16－7、17－8、18－9都得9。写法不同不妨碍得数相同。先分别算再连，不只看两个算式的数相近。自己还可以写其它几组，逐边核对，不要求唯一算式清单。',
      activity:
        '在实际填好的两张小表找同得数组，再独立写至少两组同值算式，每组至少两条，逐条计算并交流。',
    },
    {
      title: '未知在左边，先算已知右边',
      text: '原创20＋△＝22＋40，先算右边是62；左边20加42也得62，所以△可以是42。△在这里代表整个数，不是个位卡，不限制为一位数字。试40会得到左60、右62，原式不符；保存尝试再调整。',
      activity:
        '实际用数字卡或纸笔试一个不符与一个符合的数，分别代回完整原式。',
    },
    {
      title: '未知原数、未知减数和0分开',
      text: '46－8＝○－10，左边38，○要填48而不是38。15－○＝3＋5，右边8，所以○为7。9＋○＝3＋6，○为0。每道式子独立，○不跨不同题固定同值；缺少输入不是0，题中算得0才填0。保留运算符号，代回两边各算一次。',
      activity: '实际写三种位置的核对过程，说清为什么不能全用同一种填法。',
    },
    {
      title: '核对原式，再记录自己的办法',
      text: '复习会改变表的轴值、排列和等式数字，旧答案不能套用。先看当前行列与题目，再试数、代回和比较两边。自己写同值算式、填纸面小表、真实解释分别确认；想下次做的单列计划，不用一组对题自动评价整个期末运算。',
      activity:
        '与家长交流一次真实错误如何修改，以及一组自己提出并核对的等式。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在纸面画并填完本课加法小表九格，逐格指出两个加数，核对全部格；网页填写不自动确认纸面活动。',
      '实际在纸面画并填完减法小表九格，逐格按列头减行头，指认被减数与减数，不倒换方向。',
      '先在实际完成的两张表找相同得数，再自己写至少两组同值算式，每组至少两条，逐条核对并向家长解释；允许不同合法清单。',
      '实际对20＋△＝22＋40和46－8＝○－10记录试数并代回两边，再验证未知减数与0的例子，指出本课图形代表完整数；未做的部分待做。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实纸面、摆卡与解释完成后确认，没有材料可跳过。',
      explanation: '实际任务独立，网页答对和未来计划不代表已经操作。',
    })),
    ...[
      '你怎样找小表的一格，怎样检查减法方向？记真实办法或困难。',
      '你试过哪个未知数，怎样代回比较两边？可保留不符的尝试和修改过程。',
      '自己写出的同值算式有什么发现？还没实际写可如实说明待尝试，计划单列。',
    ].map((prompt, index): Question => ({
      id: `${id}-reflection-${index}`,
      knowledge: `${id}-reflection-${index}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '保存真实过程或想法，没有固定句子。',
      explanation: '原话correct=null，不代替实际完成确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读期末小表与等式、原创数据核对',
    notes: `依据ISBN ${source.isbn}印刷91、94页对应活动。三行三列小表与等式数值均原创；复习换轴值和排列、相同得数及图形数条件，不照搬大表或一位符号限制。不复制教材原画，未知版次印次不补造；其余期末缺口仍保留。`,
  },
};
