import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-card-review';
const mainAdd = [
  [3, 2],
  [1, 1],
  [4, 1],
  [2, 1],
  [1, 4],
  [2, 2],
  [1, 3],
  [3, 1],
  [2, 3],
  [1, 2],
];
const reviewAdd = [
  [1, 2],
  [2, 3],
  [3, 1],
  [1, 3],
  [2, 2],
  [1, 4],
  [2, 1],
  [4, 1],
  [1, 1],
  [3, 2],
];
const mainSubtract = [
  [5, 3],
  [2, 1],
  [4, 1],
  [3, 2],
  [5, 1],
  [4, 3],
  [3, 1],
  [5, 4],
  [4, 2],
  [5, 2],
];
const reviewSubtract = [
  [4, 2],
  [5, 4],
  [3, 1],
  [5, 1],
  [3, 2],
  [4, 1],
  [2, 1],
  [5, 2],
  [4, 3],
  [5, 3],
];

function tasks(review: boolean): Question[] {
  const add = review ? reviewAdd : mainAdd;
  const sub = review ? reviewSubtract : mainSubtract;
  const addResults = review ? [3, 5, 2, 4] : [5, 2, 4, 3];
  const subResults = review ? [2, 3, 1, 4] : [4, 1, 3, 2];
  const sum = review ? 4 : 5;
  const left = review ? 1 : 2;
  const right = 3;
  const pairs = Array.from({ length: sum + 1 }, (_, n) => ({
    id: `${n}+${sum - n}`,
    label: `${n}＋${sum - n}`,
  }));
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    {
      ...base(
        'all-add-cards',
        `这套卡片的两个加数都是正数，和不超过5。全部十张按顺序是${add.map(([a, b]) => `${a}＋${b}`).join('、')}。按这个顺序填十个得数，不漏一张，不擅自排序。`,
      ),
      rule: {
        kind: 'steps',
        values: add.map(([a, b]) => required(a) + required(b)),
      },
      hint: '每张单独算；4＋1与1＋4是两种有序写法，不少算其中一张。',
      explanation: `依次是${add.map(([a, b]) => required(a) + required(b)).join('、')}。固定第一个加数1有4张，2有3张，3有2张，4有1张，共10张。`,
    },
    {
      ...base(
        'all-subtract-cards',
        `这套卡的被减数在2～5，减数和差都是正数。全部十张按顺序是${sub.map(([a, b]) => `${a}－${b}`).join('、')}。按顺序填十个差，每项从自己的被减数开始。`,
      ),
      rule: {
        kind: 'steps',
        values: sub.map(([a, b]) => required(a) - required(b)),
      },
      hint: '被减数不大于5，减数至少1且小于被减数，不能把上一张结果继续减。',
      explanation: `差依次${sub.map(([a, b]) => required(a) - required(b)).join('、')}。被减数2有1张、3有2张、4有3张、5有4张，共10张。`,
    },
    {
      ...base(
        'add-result-groups',
        `将完整十张两正数相加且和不超过5的卡按得数分组，按得数${addResults.join('、')}这个顺序填各组张数。1＋4与4＋1是不同的卡。`,
      ),
      rule: { kind: 'steps', values: addResults.map((n) => n - 1) },
      hint: '某个和的正数有序搭配要找全，比如和为2只有1＋1。',
      explanation: `对应组数是${addResults.map((n) => n - 1).join('、')}，四组共10张。`,
    },
    {
      ...base(
        'subtract-result-groups',
        `将被减数2～5、减数和差均正的全部十张减法卡按差分组。按差${subResults.join('、')}这个顺序填各组张数。`,
      ),
      rule: { kind: 'steps', values: subResults.map((n) => 5 - n) },
      hint: '差为1可以从2－1、3－2、4－3、5－4逐一找；别把相同差当同一张卡。',
      explanation: `对应张数${subResults.map((n) => 5 - n).join('、')}，四组共10张。`,
    },
    {
      ...base(
        'all-positive-pairs',
        `选择全部“两正数相加得${sum}”的有序算式。0不是正数，算式正确不一定符合这次卡片范围。`,
      ),
      choices: [...pairs, { id: 'wrong', label: review ? '2＋3' : '2＋2' }],
      rule: {
        kind: 'set',
        values: pairs.filter((_, n) => n > 0 && n < sum).map((c) => c.id),
      },
      hint: '先查两个数都大于0，再查和，交换顺序也检查。',
      explanation: `全部合法写法是${pairs
        .filter((_, n) => n > 0 && n < sum)
        .map((c) => c.label)
        .join('、')}。`,
    },
    {
      ...base(
        'one-picture-four-equations',
        `同一张两群圆点图，第一群${left}个、第二群${right}个。依次填第一群＋第二群、第二群＋第一群、总数－第一群、总数－第二群的结果。每道看同一原图，不真正连续拿走。`,
      ),
      visual: { kind: 'count', count: left, other: right },
      rule: {
        kind: 'steps',
        values: [left + right, left + right, right, left],
      },
      hint: '加法求整个，减法求另一部分；两次减法各自恢复原总量。',
      explanation: `四个结果是${left + right}、${left + right}、${right}、${left}，第一部分和第二部分角色不可混。`,
    },
    {
      ...base(
        'duplicate-not-new',
        review
          ? '完整十张正数减法卡已经各有一张，又写了一张2－1，现在纸卡有几张、不同算式有几种？'
          : '完整十张两正数加法卡已经各有一张，又写了一张1＋1，现在纸卡有几张、不同算式有几种？',
      ),
      rule: { kind: 'steps', values: [11, 10] },
      hint: '张数和不同算式种数分别数，重复一张不增加种类。',
      explanation:
        '共有11张纸卡，仍只有10种不同算式；整理全表时每种保留一张，重复另放。',
    },
    {
      ...base(
        'zero-outside-card-scope',
        review
          ? '5－0＝5算得正确。它属于这次“减数和差都是正数”的十张减法卡吗？'
          : '0＋5＝5算得正确。它属于这次“两个加数都是正数”的十张加法卡吗？',
      ),
      choices: [
        { id: 'outside', label: '计算正确，但不属于这次正数卡范围' },
        { id: 'wrong', label: '凡带0的算式计算都错误' },
        { id: 'inside', label: '计算正确就一定在这套卡里' },
      ],
      rule: { kind: 'choice', value: 'outside' },
      hint: '0参与计算有意义；这次特定卡片范围另外要求某些数必须正。',
      explanation: '不能把卡片分类约束误当整个数学范围；0的运算仍然正确。',
    },
    {
      ...base(
        'podium-rank',
        review
          ? '这场模拟比赛约定第1名金牌、第2名银牌、第3名铜牌。某人站在标3的领奖位置，这里的3表示第几名，应领哪种牌？'
          : '这场模拟比赛约定第1名金牌、第2名银牌、第3名铜牌。某人站在标2的领奖位置，这里的2表示第几名，应领哪种牌？',
      ),
      choices: review
        ? [
            { id: 'rank', label: '第3名、铜牌' },
            { id: 'quantity', label: '有3人一起站，3块金牌' },
            { id: 'other', label: '第2名、银牌' },
          ]
        : [
            { id: 'rank', label: '第2名、银牌' },
            { id: 'quantity', label: '有2人一起站，2块金牌' },
            { id: 'other', label: '第3名、铜牌' },
          ],
      rule: { kind: 'choice', value: 'rank' },
      hint: '这里的数字表示名次，不表示人数或牌数；奖励依题目明确约定，不推断所有比赛都一样。',
      explanation: review
        ? '标3是第3名，按这场约定是铜牌；数字不代表3个人。'
        : '标2是第2名，按这场约定是银牌；数字不代表2个人。',
    },
  ];
}

export const sujiaoUpperCardReviewLesson: Lesson = {
  id,
  title: '第一单元完整整理：算式卡、同图多式与自评',
  textbookTitle: '练习二与单元评价',
  page: 31,
  version: 1,
  status: 'available',
  goal: '制作并整理完整十张加法卡和十张减法卡，写全和为5的正数有序搭配，同一自画图编四式；独立回顾识写比较、计算讲故事和表达提问。',
  prerequisite:
    '认识0～5及5以内加减；准备纸笔、20张安全纸卡与5件学具。可请家人帮读和原话代写，实际判断由孩子做。',
  parentTip: `ISBN ${source.isbn}印刷30～31页已读活动范围。原创卡次序、数量图和故事。完整表不只写几张，两个加数正且和≤5共10种；被减数2～5、减数正、差正共10种。排除0只是这次卡片分类约束，不说带0的运算错误。纸面操作独立确认，三方面反思不判对错、不自动评星，未来计划另记。`,
  steps: [
    {
      title: '十张加法卡，一种不漏',
      text: '第一个加数1配第二个1、2、3、4；第一个2配1、2、3；第一个3配1、2；第一个4配1。共10张，每个加数都正，和不超过5。先按和2、3、4、5分类，再排成按第一加数分行、第二加数分列的阶梯表，每种只放一次。',
      activity:
        '实际制作十张全部卡并填结果，分类后排列全表，指出横行与竖列哪个加数固定，任选两张用实物核对。',
    },
    {
      title: '十张减法卡，行列分别看',
      text: '被减数2配减数1；3配1、2；4配1、2、3；5配1、2、3、4，共10张，减数与差都正。先按差1、2、3、4分类，再被减数分行、减数分列排列。横行被减数固定，减数增加差减少；竖列减数固定，被减数增加差增加。',
      activity:
        '实际制作十张全部减法卡，整理分类与全表，沿同一行、同一列说变化，实际核对两张。',
    },
    {
      title: '同样的和，也有不同写法',
      text: '两正数相加得5，完整有序写法是1＋4、2＋3、3＋2、4＋1。交换顺序和不变，但这是两种写法，不能漏掉。0＋5与5＋0虽也得5，不在这次“两正数”要求里。',
      activity:
        '在纸上不看候选卡，自主写出全部四种正数搭配，逐项计算，摆物交换两群并解释总数不变。',
    },
    {
      title: '一张自画图，先提问题再写四式',
      text: '自己画两个不相等的正数量群，总数不超过5，如两个部分1与3或2与3，也可自己选。先编两个合并问题，再编两个求另一部分问题，写两加两减并说每式求什么。两次减法不是在上一道剩余基础继续减，每次回看同一原图。',
      activity:
        '实际自主画图、提四个相应问题、写四式和单位，向家人说明两个部分与总数；不能只抄网页例子。',
    },
    {
      title: '三方面分别回顾，未做如实说',
      text: '第一方面认识、读写0～5并比较；第二方面5以内加减并讲生活故事；第三方面愿意表达想法，遇到不明白的愿意提问。数字还可表示名次：某次比赛约定领奖位置1、2、3分别对应第1、2、3名与金、银、铜牌，不表示有几人或几块牌；具体比赛奖励按自己的规则。三项各说一个已经实际做过的例子，仍需帮助的单独说明；下次计划不是现在完成。',
      activity:
        '实际读写0～5，用学具配对写一次＝、＞、＜，实际口算四道5以内题、自编一个生活故事，说明一种方法并提出一个疑问；三项反思分别保存，不统一自动评星。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-add-table',
        '实际制作全部十张加法卡：1＋1至1＋4、2＋1至2＋3、3＋1至3＋2、4＋1，各算结果且每种只一张。先按得数2、3、4、5分类，再以第一加数分行、第二加数分列排完整阶梯表，逐行逐列解释哪个数固定、哪个变化；任选两张实际摆物核对。保留完整十卡与排列。',
      ],
      [
        'actual-subtract-table',
        '实际制作全部十张减法卡：2－1；3－1、3－2；4－1、4－2、4－3；5－1、5－2、5－3、5－4。填结果、按差分组，再以被减数分行、减数分列排全表，说横行与竖列的变化，各选一对实际核对，每次恢复原量。纸卡张数和不同算式数分清。',
      ],
      [
        'actual-positive-pairs',
        '在纸上自主写全两正数相加得5的四种有序写法，逐条核对正数条件和结果，实际摆两群交换顺序说明和不变。不能只勾候选题代替自主写。',
      ],
      [
        'actual-own-picture',
        '实际自画两个不相等的正数量群，和不超过5，不抄示例图。先自主提出两种合并问题与两种求另一部分问题，再写两加两减四条算式与单位，实际向家人解释每条所求；每次减法恢复同一原图，不连续扣除。',
      ],
      [
        'actual-evaluation-evidence',
        '实际读写0～5，用学具配对各写一次＝、＞、＜；自主口算四道5以内加减，自编一个生活问题解答并讲故事；向家人说明一种方法并提出一个仍想知道的问题。可原话代写，但不替孩子判断；未做或未交流如实暂跳，未来计划另记。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际动手、书写、表达人工查看；未做暂跳，网页成绩不是完成证明。',
      explanation: '记录实际操作，不自动将确认完成判为知识已掌握。',
    })),
    ...[
      [
        'evaluation-recognition',
        '认识、读写0～5与比较：你已经实际做过什么？举一个自己的例子，说仍需哪种帮助；想做但未做的另写下次计划。',
      ],
      [
        'evaluation-calculation-story',
        '5以内加减与讲故事：说一条自己实际算过的式子和它的生活意思，是否能说明方法，哪里仍需帮助？未来准备练的另记。',
      ],
      [
        'evaluation-expression-question',
        '表达想法与提问：说一次自己已经实际表达的方法或提出的问题，没有做过可如实说尚未做；下一次准备问的问题不是已问过。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'reflection' },
      hint: '按孩子原话分别记录，不要求全会，可请家人原话代写。',
      explanation:
        '这是独立自评，correct为null，不判对错、不由分数或计划自动评星。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整卡表与单元独立评价范围核验',
    notes: `ISBN ${source.isbn}30～31页，原创完整卡次序、分类顺序与两群数量；复习改变卡次序、和为4的搭配与图中数量。实际完整制作、自画问题和三项评价分别记录；最终教师审校未核验。`,
  },
};
