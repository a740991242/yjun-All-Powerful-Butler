import type { NumberStripVisual } from '../learning/number-strip';
import type { Lesson, Question, QueueVisual } from '../learning/types';

const id = 'bnu-upper-final-number-practice';
const queue: QueueVisual = {
  kind: 'queue',
  labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  front: 'left',
};
const ascending: NumberStripVisual = {
  kind: 'number-strip',
  values: [5, null, 7, null, 9, null],
};
const descending: NumberStripVisual = {
  kind: 'number-strip',
  values: [10, 8, null, null, 2, null],
};
function q(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Question['visual'],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '看清起点、方向、每次变化与所问对象，先完整计算再配对。开放填空可有多个合法答案，0不是空白。',
    ...(visual ? { visual } : {}),
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...q(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return q(
    `actual-${suffix}`,
    `${prompt}；真实做过再确认，未做或缺教材、材料、同伴可待做。`,
    { kind: 'manual' },
    '网页答对不替代纸面填数、完整连线、观察与交流；计划另记。',
  );
}

export const bnuFinalNumberPracticeLesson: Lesson = {
  id,
  textbookTitle: '总复习 · 数与代数',
  title: '数列、九人排队与等值算式配对',
  page: 82,
  version: 1,
  status: 'available',
  goal: '完整补两列数、标九个序位，计算并配对全部算式，接受开放填空多解并分清隐藏量。',
  prerequisite: '会0～10加减、每次加1或减2的数数与从队首数位置。',
  parentTip:
    '对应北师大上册82页全部五项应用。本站数列卡、虚构A～I队列和圆点分组为原创等价图，不复制原画。两空减法共同判断，不能分别选一个允许数字就算正确；0～10范围内8−0、9−1、10−2都合法。纸面原题未限定数值上限，更大非负整数的正确填法仍可讨论，不能用网页范围否定原题。完整连线、原图写式与实做分别记录。',
  review: {
    date: '2026-10-04',
    reviewer: '原书82页五项完整阅读与多解规则核对',
    notes:
      '第三方0061阅读器86对应印刷82：5起每次加1、10起每次减2，左队首九人；12式六组等值配对；四组填数与猴子/白菜图。ISBN版印次未知。',
  },
  steps: [
    {
      title: '第一条数列，每次加1',
      text: '从左到右，已知5、7、9隔一格出现。按本题明确的每次加1规则，逐格走完整六位置；A、B、C是待填字母，不是0，也不将末端空格漏掉。数字卡为本站原创表示，纸面再对照原书毛毛虫。',
      activity: '实际在纸面把第一条全部空格填好，逐格读一遍。',
      visual: ascending,
    },
    {
      title: '第二条数列，每次减2',
      text: '从左到右，起初10，再8，中间两个空格，已知2之后还有一个空格。按每次减2，完整补三空；最后可以得到0，它是明确数过的数，不是没填写。不能照第一条每次加1的规则。',
      activity: '实际补第二条全部空格，用纸卡或逐个数数核对。',
      visual: descending,
    },
    {
      title: '九人从队首标序位',
      text: '原书饮水机在左，孩子从左队首依次标数。本站虚构九人A～I一排，左为队首；按A到I分别填写序位，不把字母当人数或按浏览器折行改变队列。改成右队首时必须重新数。',
      activity: '实际对照原书九个位置全部标1～9，再在原创队列逐一指认。',
      visual: queue,
    },
    {
      title: '全部算完，再连等值算式',
      text: '原书两组共12个算式。先每式计算，再找结果相同的另一式，共六组连线。位置相邻不一定等值，加减符号不同也可能结果相同；10+0与2+8同值，9−5与6−2同值。不要只连一组示例就当全部完成。',
      activity: '实际完整计算12式、完成六组配对，逐组解释依据。',
    },
    {
      title: '四种填空，分清唯一与多解',
      text: '1小于一个数、10大于一个数都可有多种填法；网页明确每空0～10。7=5加一个数的空格按等值计算。两个空相减等于8要共同判断：8−0、9−1、10−2均可，不能写8−2。纸面原题未限10，更大合法填法可另讨论，不用网页范围否定原题。',
      activity: '实际纸面填写四组，再为开放题找另一种合法答案并核对。',
    },
    {
      title: '两群合并与篮内隐藏量',
      text: '原书猴子两群6只与4只，问合起来的总数；交换两个加数仍对应这两群，不能因5+5也等于10就说原图两群是5与5。白菜原图总10棵、篮外1棵，篮内数量要从总数取去已见的1棵；篮子本身不当1棵白菜。未知篮内不能直接看问号当0。',
      activity:
        '分别实际看两幅原图、写算式并说明所求；与同伴核对，疑问和计划分开记录。',
      visual: { kind: 'count-groups', groups: [6, 4] },
    },
  ],
  questions: [
    q(
      'q1',
      '左为队首，图中C从队首数排第几？只填序位。',
      { kind: 'number', value: 3 },
      '从左队首依次A第一、B第二、C第三，不把总人数当序位。',
      queue,
    ),
    q(
      'ascending',
      '按每次加1，依次填第一条数列A、B、C。',
      { kind: 'steps', values: [6, 8, 10] },
      '逐格为5/6/7/8/9/10，全部三空。',
      ascending,
    ),
    q(
      'descending',
      '按每次减2，依次填第二条数列A、B、C。',
      { kind: 'steps', values: [6, 4, 0] },
      '逐格10/8/6/4/2/0，最后0明确填写。',
      descending,
    ),
    q(
      'queue',
      '左为队首：按A到I依次填全部九人的序位。',
      { kind: 'steps', values: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      '从左队首逐个数，人数与所处序位不同。',
      queue,
    ),
    q(
      'calculate-left',
      '依次计算左组全部六式：2+8、6+2、1+8、10+0、5+3、7+2。',
      { kind: 'steps', values: [10, 8, 9, 10, 8, 9] },
      '按所列顺序完整计算，不按结果自动改顺序。',
    ),
    q(
      'calculate-right',
      '依次计算右组全部六式：9−5、4+6、9−4、6−2、7+3、0+5。',
      { kind: 'steps', values: [4, 10, 5, 4, 10, 5] },
      '先看加减号，结果相同不表示运算符一定相同。',
    ),
    choice(
      'match-1',
      '左组：哪一式与2+8得数相同？',
      '10+0',
      ['10+0', '7+2', '5+3'],
      '两式都为10。',
    ),
    choice(
      'match-2',
      '左组：哪一式与6+2得数相同？',
      '5+3',
      ['5+3', '1+8', '10+0'],
      '两式都为8。',
    ),
    choice(
      'match-3',
      '左组：哪一式与1+8得数相同？',
      '7+2',
      ['7+2', '2+8', '5+3'],
      '两式都为9。',
    ),
    choice(
      'match-4',
      '右组：哪一式与9−5得数相同？',
      '6−2',
      ['6−2', '0+5', '4+6'],
      '两式都为4。',
    ),
    choice(
      'match-5',
      '右组：哪一式与9−4得数相同？',
      '0+5',
      ['0+5', '6−2', '4+6'],
      '两式都为5。',
    ),
    choice(
      'match-6',
      '右组：哪一式与7+3得数相同？',
      '4+6',
      ['4+6', '6−2', '0+5'],
      '两式都为10。',
    ),
    q(
      'greater',
      '网页范围0～10：1<□，任选一种合法数填A。',
      {
        kind: 'number-chain',
        minimum: 0,
        maximum: 10,
        direction: 'ascending',
        values: [1, null],
      },
      '2～10都合法，不能与1相等。',
    ),
    q(
      'less',
      '网页范围0～10：10>□，任选一种合法数填A。',
      {
        kind: 'number-chain',
        minimum: 0,
        maximum: 10,
        direction: 'descending',
        values: [10, null],
      },
      '0～9都合法，0需要明确输入。',
    ),
    q('equal', '7=5+□，填几？', { kind: 'number', value: 2 }, '5加2才等于7。'),
    q(
      'difference',
      '网页范围每空0～10：第一空−第二空=8，任选一种合法填法，按左右顺序填两数。',
      {
        kind: 'arithmetic-pair',
        minimum: 0,
        maximum: 10,
        operation: 'subtract',
        result: 8,
      },
      '两个数要一起满足差为8，8−0/9−1/10−2均合法，空白不是0。',
    ),
    q(
      'monkeys',
      '原创圆点分别代表原书两群6只和4只猴子，合起来共几只？',
      { kind: 'number', value: 10 },
      '数两群全部猴子，不数两个组框。',
      { kind: 'count-groups', groups: [6, 4] },
    ),
    {
      ...q(
        'monkey-equations',
        '选择所有能对应这两群合并的算式，不只检查结果是否10。',
        { kind: 'set', values: ['6+4', '4+6'] },
        '6+4和4+6都对应两群，5+5虽然同值却不符合每群数量。',
        { kind: 'count-groups', groups: [6, 4] },
      ),
      choices: [
        { id: '6+4', label: '6+4' },
        { id: '4+6', label: '4+6' },
        { id: '5+5', label: '5+5' },
      ],
    },
    q(
      'cabbage',
      '白菜共有10棵，篮外明确1棵，其余在篮内。篮内有几棵？',
      { kind: 'number', value: 9 },
      '10−1=9，篮子本身不是一棵白菜。',
    ),
    choice(
      'basket-unit',
      '一只篮子里装白菜，能把篮子本身再当一棵白菜加入总数吗？',
      '不能，容器与白菜不同',
      ['能，都是物件', '不能，容器与白菜不同'],
      '所数对象只白菜，不混容器。',
    ),
    actual('number-rows', '实际对照原书两条毛毛虫，完整填六个空格并逐格读数'),
    actual('queue', '实际为原书九个孩子全部按队首标数，再核对原创队列'),
    actual('matching', '实际完整计算原书12式并完成六组等值连线，逐组核对'),
    actual('open', '实际填原书四组空格，对多解题另找一种合法填法并说明范围'),
    actual('monkeys', '实际看原书两群猴子，写合并算式并说明加数与总数'),
    actual(
      'cabbage',
      '实际看原书白菜图，区分总数、篮外与篮内，写出求隐藏量的算式',
    ),
    actual(
      'exchange',
      '实际与同伴交流一种填数或配对方法，听取并核对另一种办法',
    ),
    q(
      'reflection',
      '保存自己实际核对数列、位置或配对时的方法和困难。',
      { kind: 'reflection' },
      '方法开放，不按固定措辞评分。',
    ),
    q(
      'question',
      '保存尚待核对的问题；未实际交流可如实说明。',
      { kind: 'reflection' },
      '记录疑问不自动确认实做。',
    ),
    q(
      'plan',
      '下一次准备核对哪项？这是未来计划。',
      { kind: 'reflection' },
      '计划与实际活动分开。',
    ),
  ],
  reviewQuestions: [
    q(
      'r-row',
      '新数列每次加1，依次填A、B、C。',
      { kind: 'steps', values: [3, 5, 7] },
      '新条件2/3/4/5/6/7，不套原三空。',
      { kind: 'number-strip', values: [2, null, 4, null, 6, null] },
    ),
    q(
      'r-queue',
      '新条件改为右队首，按图中左到右A～I填每人的序位。',
      { kind: 'steps', values: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
      '从右队首数，最右I第一，最左A第九。',
      { ...queue, front: 'right' },
    ),
    q(
      'r-difference',
      '新条件每空0～10：第一空−第二空=6，任选一种合法填法。',
      {
        kind: 'arithmetic-pair',
        minimum: 0,
        maximum: 10,
        operation: 'subtract',
        result: 6,
      },
      '新差6，不能照原题差8。',
    ),
    q(
      'r-hidden',
      '新故事总9个物品、盒外2个，其余在盒内。盒内有几个？',
      { kind: 'number', value: 7 },
      '9−2=7，重新按总数和已见数计算。',
    ),
  ],
};
