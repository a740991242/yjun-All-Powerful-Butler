import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const subtractId = 'sj-lower-eight-seven-subtract';
const smallId = 'sj-lower-small-add-inverse';

function subtractTasks(review: boolean): Question[] {
  const id = subtractId;
  const prefix = review ? 'r' : 'q';
  const total = review ? 15 : 14;
  const removed = review ? 7 : 8;
  const ones = total - 10;
  const pairs: [number, number][] = review
    ? [
        [11, 7],
        [13, 8],
        [15, 7],
      ]
    : [
        [12, 8],
        [14, 7],
        [16, 8],
      ];
  return [
    {
      id: `${id}-${prefix}-to-ten`,
      knowledge: `${id}-to-ten`,
      prompt: `算${total}−${removed}，先从${total}减到10。依次填第一次减几、还要减几、最后剩几。`,
      rule: { kind: 'steps', values: [ones, removed - ones, total - removed] },
      hint: '两次拿走的数量合起来正好是要减的数，不是两次都减它。',
      explanation: `${total}−${ones}=10，再减${removed - ones}剩${total - removed}；${ones}+${removed - ones}=${removed}。`,
    },
    {
      id: `${id}-${prefix}-break-ten`,
      knowledge: `${id}-break-ten`,
      prompt: `${total}分成10和${ones}。只从10里面减${removed}，依次填10里面剩几、没动的散件有几、合起来剩几。`,
      rule: { kind: 'steps', values: [10 - removed, ones, total - removed] },
      hint: '旁边没动的散件也属于剩余量，不能漏掉。',
      explanation: `10−${removed}=${10 - removed}，再合上${ones}，剩${total - removed}。拆捆没有改变原总数。`,
    },
    {
      id: `${id}-${prefix}-inverse`,
      knowledge: `${id}-inverse`,
      prompt: `${removed}加几等于${total}？用这个结果检查${total}减${removed}。`,
      rule: { kind: 'number', value: total - removed },
      hint: '拿走的与剩下的合起来，应回到原有的总数。',
      explanation: `${removed}+${total - removed}=${total}，所以${total}−${removed}=${total - removed}。`,
    },
    ...pairs.map(([a, b]) => ({
      id: `${id}-${prefix}-difference-${a}-${b}`,
      knowledge: `${id}-difference`,
      prompt: `${a} − ${b} = ？自己选择一种方法。`,
      rule: { kind: 'number' as const, value: a - b },
      hint: `可先从10里减${b}，再合上原来的${a - 10}个一。`,
      explanation: `${a}−${b}=${10 - b}+${a - 10}=${a - b}。可以用${b}+${a - b}=${a}检查。`,
    })),
    {
      id: `${id}-${prefix}-count-back`,
      knowledge: `${id}-count-back`,
      prompt: `从${total}往回走${removed}步，最后到几？起点不算走过的一步。`,
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: total },
      rule: { kind: 'number', value: total - removed },
      hint: `第一步到${total - 1}，每次往回减1，共走${removed}步。`,
      explanation: `${total}往回走${removed}步到${total - removed}。不能把起点算成第一步。`,
    },
    {
      id: `${id}-${prefix}-story`,
      knowledge: `${id}-remaining-story`,
      prompt: review
        ? '盒子原有15张卡片，取出7张，还剩几张？'
        : '书架原有14本书，借出8本，还剩几本？',
      rule: { kind: 'number', value: total - removed },
      hint: '求剩余量，用原有总数减去实际取出的数量。',
      explanation: `${total}−${removed}=${total - removed}，剩${total - removed}${review ? '张' : '本'}。`,
    },
    {
      id: `${id}-${prefix}-methods`,
      knowledge: `${id}-methods`,
      prompt: `计算${total}−${removed}，哪种办法正确？甲：${total}−${ones}−${removed - ones}。乙：10−${removed}+${ones}。`,
      choices: [
        { id: 'a', label: '只有甲' },
        { id: 'b', label: '只有乙' },
        { id: 'both', label: '甲乙都可以' },
      ],
      rule: { kind: 'choice', value: 'both' },
      hint: '甲的两次减数合起来是多少？乙是否合回未动的散件？',
      explanation: `甲共减${removed}；乙从10中减${removed}后加回${ones}。两种办法都剩${total - removed}。`,
    },
  ];
}

function smallTasks(review: boolean): Question[] {
  const id = smallId;
  const prefix = review ? 'r' : 'q';
  const a = review ? 4 : 6;
  const b = review ? 9 : 7;
  const total = a + b;
  const pairs: [number, number][] = review
    ? [
        [6, 6],
        [5, 8],
        [4, 8],
        [3, 9],
        [9, 2],
      ]
    : [
        [6, 8],
        [5, 7],
        [4, 9],
        [3, 8],
        [2, 9],
      ];
  return [
    {
      id: `${id}-${prefix}-complement`,
      knowledge: `${id}-complement`,
      prompt: `${a}再添几就成为10？`,
      rule: { kind: 'number', value: 10 - a },
      hint: '从原数接着数到10，接着走了几步？',
      explanation: `${a}+${10 - a}=10，还差${10 - a}。`,
    },
    {
      id: `${id}-${prefix}-first-ten`,
      knowledge: `${id}-first-ten`,
      prompt: `算${a}+${b}，让${a}先到10。把${b}拆开，依次填给第一组的数、余下的数。`,
      visual: { kind: 'ten-frame', left: a, right: b },
      rule: { kind: 'steps', values: [10 - a, total - 10] },
      hint: '拿出的与余下的合起来仍须是原来的第二组。',
      explanation: `${b}分成${10 - a}和${total - 10}，先凑成10，再加${total - 10}，得${total}。`,
    },
    {
      id: `${id}-${prefix}-second-ten`,
      knowledge: `${id}-second-ten`,
      prompt: `仍是${a}+${b}，改让${b}先到10。把${a}拆开，依次填给第二组的数、余下的数。`,
      visual: { kind: 'ten-frame', left: a, right: b },
      rule: { kind: 'steps', values: [10 - b, total - 10] },
      hint: '这一次拆的是第一组，补数看第二组离10差多少。',
      explanation: `${a}分成${10 - b}和${total - 10}，${b}+${10 - b}=10，再加余下部分仍是${total}。`,
    },
    ...pairs.map(([left, right]) => ({
      id: `${id}-${prefix}-sum-${left}-${right}`,
      knowledge: `${id}-carry-sum`,
      prompt: `${left} + ${right} = ？可以选一组凑十，也可以交换两组再想。`,
      visual: { kind: 'ten-frame' as const, left, right },
      rule: { kind: 'number' as const, value: left + right },
      hint: `让${right}先到10，从${left}中拿${10 - right}，再合上剩余部分。`,
      explanation: `${left}+${right}=10+${left + right - 10}=${left + right}；交换位置也不改变数量。`,
    })),
    {
      id: `${id}-${prefix}-relations`,
      knowledge: `${id}-whole-parts`,
      prompt: `两组物品分别有${a}件和${b}件，共${total}件。依次填：总数减第二组，第一组剩几；总数减第一组，第二组剩几。`,
      rule: { kind: 'steps', values: [a, b] },
      hint: '先确认减去的是哪一部分，求的是另一部分。',
      explanation: `${total}−${b}=${a}；${total}−${a}=${b}。两次独立求不同部分，不能把两部分连续都拿走。`,
    },
    {
      id: `${id}-${prefix}-missing`,
      knowledge: `${id}-missing-part`,
      prompt: `已知${a}+□=${total}，空格填几？`,
      rule: { kind: 'number', value: b },
      hint: '用总数减去已知部分，再把两部分合起来检查。',
      explanation: `${total}−${a}=${b}，所以空格是${b}，检查${a}+${b}=${total}。`,
    },
    {
      id: `${id}-${prefix}-story`,
      knowledge: `${id}-story`,
      prompt: review
        ? '盒子里共13张卡片，其中4张是圆形的，其他都是方形的。方形有几张？'
        : '两层书架共13本书，上层有6本，其余都在下层。下层有几本？',
      rule: { kind: 'number', value: b },
      hint: '已知总数和一部分，求另一部分，用减法。',
      explanation: `${total}−${a}=${b}，另一部分有${b}${review ? '张' : '本'}。物品没有离开，只是在两部分中分类。`,
    },
    {
      id: `${id}-${prefix}-preserve`,
      knowledge: `${id}-preserve`,
      prompt: `为算${a}+${b}，把${a}分成${10 - b}和${total - 10 + 1}，这样对吗？`,
      choices: [
        { id: 'yes', label: '对，只要能凑十就行' },
        { id: 'no', label: '不对，拆分后多了一个' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '把拆出的两部分重新合起来，与被拆的原数比较。',
      explanation: `${10 - b}+${total - 10 + 1}=${a + 1}，比${a}多1，不能凭空多出物品。`,
    },
  ];
}

export const sujiaoEightSevenSubtractDraft: Lesson = {
  id: subtractId,
  textbookTitle: '进位加法和退位减法',
  title: '十几减8、7：分步拿走与想加算减',
  page: 10,
  version: 1,
  status: 'preparing',
  goal: '选择减到十、破十或想加算减求剩余量，检查拿走数与未动散件，联系实际问题。',
  prerequisite: '会8、7加几及11～19的组成，准备19根小棒、橡皮筋和纸笔。',
  parentTip:
    '减数是8或7时，不能照搬减9后只剩1的结论。请孩子解释取走范围与剩余两部分，帮助照实记录。',
  steps: [
    {
      title: '先减到10',
      text: '14减8，先拿走4剩10。共要拿走8，已经拿走4，还要拿走4；10减4剩6。两次合起来拿走8，不是每次拿走8。',
      activity: '摆14根，分两次拿走8根，把每次拿走的分别放在两处检查。',
    },
    {
      title: '从一捆中拿走',
      text: '14是一捆10根与4根散棒。拆捆总数不变。从10根里拿走8根剩2根，合上旁边未动4根，共剩6根。减7时，10中剩3根，不能仍写1或2。',
      visual: { kind: 'place-value', value: 14 },
      activity: '实际拆捆并取走8根，再恢复后试着取走7根，比较剩余。',
    },
    {
      title: '想加法，检查减法',
      text: '8加6等于14，说明14减8剩6；7加7等于14，说明14减7剩7。拿走的和剩下的合起来，应该回到原来的总数。',
      activity: '用取走组和剩下组实际合并，验证原总数。',
    },
    {
      title: '说清问题再选择办法',
      text: '原有14本书、借出8本，求还剩几本，用14减8。总数14与已知一部分8也能求另一部分6，物品不一定实际离开。先说求什么，再选算法，并说带单位的答句。',
      activity: '编一个减7或减8的问题，用另一种算法检查。',
    },
  ],
  questions: [
    ...subtractTasks(false),
    {
      id: `${subtractId}-manual-methods`,
      knowledge: `${subtractId}-physical-methods`,
      prompt: '摆14根，用两种方法拿走8根，说明两种办法为什么都剩相同数量。',
      rule: { kind: 'manual' },
      hint: '检查一共拿走8根，不漏未动散棒。',
      explanation: '实际操作与解释人工查看，填对数字不能替代操作。',
    },
    {
      id: `${subtractId}-manual-inverse`,
      knowledge: `${subtractId}-physical-inverse`,
      prompt:
        '摆14件物品分成7件和另一部分，把两部分合回去，用一句加法和两句减法说明关系。',
      rule: { kind: 'manual' },
      hint: '每句减法都从完整总数出发，求的是另一部分。',
      explanation: '分类、重新合并和口述分别由人工查看。',
    },
    {
      id: `${subtractId}-manual-story`,
      knowledge: `${subtractId}-own-story`,
      prompt:
        '编一个总数11～18、减去7或8的实际问题，画图或摆物，解释计算并说带单位的答句。',
      rule: { kind: 'manual' },
      hint: '先说清总数、已知部分和所求部分。',
      explanation: '允许不同情境，家长核对实际问题、方法和单位。',
    },
  ],
  reviewQuestions: subtractTasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同一扫描正文范围核验与原创草稿检查',
    notes: `依据${source.preview}印刷第10～11页，ISBN ${source.isbn}。用14减8、15减7等原创情境，不复制教材插图。版权版次与印次待核验，暂不注册正式课程；第12～13页综合练习另行制作。`,
  },
};

export const sujiaoSmallAddInverseDraft: Lesson = {
  id: smallId,
  textbookTitle: '进位加法和退位减法',
  title: '2～6加几：凑十与想加算减',
  page: 14,
  version: 1,
  status: 'preparing',
  goal: '运用凑十计算6、5、4、3、2加几，交换两组思考，并从已知总数和一部分求另一部分。',
  prerequisite: '会9、8、7加几及10的组成，准备19件小物品与两张纸面十格图。',
  parentTip:
    '实际比较两种算法；求部分时先确认哪部分已知，各个问题独立考虑，帮助单独记录。',
  steps: [
    {
      title: '让6先到10',
      text: '6块与7块合起来，把7分成4和3，用4与6凑成10，再加3，共13块。被拆的两部分仍合成7，没有增减。',
      visual: { kind: 'ten-frame', left: 6, right: 7 },
      activity: '用实物摆6与7，再移动4块并检查总数。',
    },
    {
      title: '也可以让7先到10',
      text: '同样6加7，把6分成3和3，用一个3与7合成10，再合上剩余3，仍是13。选择哪一组先凑十，都要说明从哪组取、取几、剩几。',
      visual: { kind: 'ten-frame', left: 6, right: 7 },
      activity: '恢复两组，再让7先到10，用自己的话比较两种办法。',
    },
    {
      title: '交换两组，联系2～5加几',
      text: '2加9可以交换两组，想9加2；3加8、4加9、5加7也可以选一组凑十。交换位置与重新分组都不改变物品总数，不能把交换后的数再加一遍。',
      activity: '选择2～6中的一个数，与另一组组成总数11～19，用实物说明算法。',
    },
    {
      title: '总数与两部分的关系',
      text: '两部分是6和7，总数13。求总数用6加7；已知总数13与一部分6，求另一部分用13减6；若已知另一部分7，就用13减7求6。每次问题独立从完整总数出发，不是连续拿走两部分。',
      activity: '用同一组实物编一个加法问题、两个减法问题，分别说清所求数量。',
    },
  ],
  questions: [
    ...smallTasks(false),
    {
      id: `${smallId}-manual-strategies`,
      knowledge: `${smallId}-physical-strategies`,
      prompt:
        '摆6块与7块，分别让6、7先凑十；指出拆哪组、拿几、剩几，并检查总数不变。',
      rule: { kind: 'manual' },
      hint: '每次先恢复原来的两组后再操作。',
      explanation: '移动、算法解释和守恒检查分别人工确认。',
    },
    {
      id: `${smallId}-manual-small`,
      knowledge: `${smallId}-physical-small`,
      prompt:
        '选2、3、4、5中的一个数，与另一组组成11～19件，实际凑十或交换两组说明结果。',
      rule: { kind: 'manual' },
      hint: '交换位置不是再添一组，实际点数检查。',
      explanation: '不同合法数量都可，家长核对操作和口述。',
    },
    {
      id: `${smallId}-manual-relations`,
      knowledge: `${smallId}-own-relations`,
      prompt:
        '把13件物品分成6件和7件，用同一组实物编一个求总数和两个求部分的问题，分别解答并说单位。',
      rule: { kind: 'manual' },
      hint: '两个减法问题分别恢复完整总数，注意所求部分不同。',
      explanation: '问题、算式与实际分组人工查看，不自动评定表达。',
    },
  ],
  reviewQuestions: smallTasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同一扫描正文范围核验与原创草稿检查',
    notes: `依据${source.preview}印刷第14～15页及第16页相关算式，ISBN ${source.isbn}。用6加7、4加9等原创情境，保留两种凑十、交换及想加算减的两部分关系，未复制原图文。版权版次与印次待核验，保持草稿；不代表第16～17页全套综合活动完成。`,
  },
};
