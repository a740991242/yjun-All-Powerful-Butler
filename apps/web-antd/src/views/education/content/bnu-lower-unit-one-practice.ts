import type { Lesson, Question } from '../learning/types';

import { teenStairs } from '../learning/teen-stairs';

const id = 'bnu-lower-unit-one-practice';
export const bnuNeighborNumbers = [7, 8, 9, 4, 8, 6, 7, 5] as const;
export const bnuReviewAdditionPairs = [
  [6, 6],
  [6, 7],
  [6, 8],
  [7, 7],
  [8, 6],
  [9, 5],
  [9, 9],
  [9, 8],
  [9, 7],
] as const;
/** The two held cards precede ten desktop cards; the source includes subtraction. */
export const bnuReviewSourceCards = [
  { left: 7, operator: '+', right: 6 },
  { left: 8, operator: '+', right: 5 },
  { left: 9, operator: '-', right: 4 },
  { left: 8, operator: '+', right: 3 },
  { left: 7, operator: '+', right: 5 },
  { left: 6, operator: '+', right: 5 },
  { left: 3, operator: '+', right: 5 },
  { left: 7, operator: '-', right: 6 },
  { left: 7, operator: '+', right: 9 },
  { left: 6, operator: '+', right: 9 },
  { left: 5, operator: '+', right: 9 },
  { left: 8, operator: '+', right: 7 },
] as const;
function result(card: (typeof bnuReviewSourceCards)[number]) {
  return card.operator === '+'
    ? card.left + card.right
    : card.left - card.right;
}
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint: '先看参照、运算符、对象和单位；每一题回到自己的原条件。大于/小于不含等于，纸面与网页范围要分清。',
    explanation,
  };
}
function number(
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
) {
  return task(suffix, prompt, { kind: 'number', value }, explanation);
}
function actual(suffix: string, prompt: string) {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际纸面、摆画、制卡或说过再确认；只看网页请跳过，不把计划或正确数字当真实活动已完成。',
  );
}
function cards(suffix: string, total: number): Question {
  return {
    ...task(
      suffix,
      `本站将第17页两张手持与十张桌面算式重新编号为12卡，选出全部得数${total}的卡，不因得数相同漏掉不同卡。`,
      {
        kind: 'set',
        values: bnuReviewSourceCards.flatMap((card, i) =>
          result(card) === total ? [`${suffix}-${i + 1}`] : [],
        ),
      },
      '每张卡按实际运算符独立计算，同一个数卡可逐次与不同算式核对；没有规定同时一对一耗尽所有卡。',
    ),
    choices: bnuReviewSourceCards.map((card, i) => ({
      id: `${suffix}-${i + 1}`,
      label: `卡${i + 1} · ${card.left}${card.operator}${card.right}`,
    })),
  };
}
const mainStairs = teenStairs({ kind: 'teen-stairs', variant: 'main' });
const occupants = mainStairs.filter(({ label }) => label !== null);
const stairChoices = occupants.flatMap(({ label }) =>
  label === null ? [] : [{ id: label, label: `标记${label}` }],
);

export const bnuLowerUnitOnePracticeLesson: Lesson = {
  id,
  textbookTitle: '整理与复习 · 巩固与应用',
  title: '台阶序位、完整计算与多解填数',
  page: 16,
  version: 1,
  status: 'available',
  goal: '补全第16～17页八项活动的数学条件：判断台阶位置、分别计算相邻两数及九式、数线表示、合并与剩余、完整算式配卡，并接受严格不等式的多种合法填写。',
  prerequisite: '能按顺序数到20，认识十与一，说明20以内加减。',
  parentTip:
    '依据实际读取并放大的第16～17页。本站A～I替代九个台阶图形、位置与原十个给定级数一致，不复制原画或要求实际爬台阶。兔6与7、盒标9只及外6只分别核对；9是给定盒内数量，不是九只可见图。配卡原9−4与7−6为减法，另有两张手持及八张桌面加法。网页不等式明确填数和运算结果均为0～20，原题未限定最大数，不把网页范围外的正确纸面填法说成数学错误。',
  review: {
    date: '2026-10-04',
    reviewer: '公开扫描第16～17页整页及台阶、桌面放大逐项核对',
    notes:
      '原台阶查询6/9/19及反查10/19；八顶数形成七组相邻相加，首15给定，另六空。九式、两轴6+6/18−5、兔两群6/7、盒9外6、19本余7、两手持与十桌面卡及三多解不等式完整对应。纸面八项各活动manual，开放反思与计划null；不凭遮挡部分猜未露数卡。',
  },
  steps: [
    {
      title: '从第一级逐级数',
      text: '原第16页从左下第1级往右上数，每个水平踏面一级。本站A～I按从低到高替代九个图形，原数字1～5、8、11、12、15、17保留；字母所在级数没有直接写出。原三图形查询分别对应本站A、C、I，反查第10级与第19级对应本站D、I；先看位置而不是数图形有几个。',
      visual: { kind: 'teen-stairs', variant: 'main' },
      activity:
        '实际在原页完成三处级数与两处图形反查，指着踏面解释；只在纸上进行，不去楼梯试错。',
    },
    {
      title: '相邻两数每组独立相加',
      text: '原第2题上排依次7、8、9、4、8、6、7、5。每个下框由上排相邻两个数相加，首框7+8=15已给定。下一框8+9，不是拿前一个15再加9；共七组，两个不同位置的8不能合并成同一个位置。',
      visual: { kind: 'number-strip', values: [...bnuNeighborNumbers] },
      activity:
        '实际在纸上分别连接七对相邻上数，完整核对首给定与其余六个待填框。',
    },
    {
      title: '三列九个式子全部算',
      text: '第一列6+6、6+7、6+8，第二列7+7、8+6、9+5，第三列9+9、9+8、9+7。每式是独立计算，不沿用上式结果。第二列虽然三个结果相同，两个加数却在变化；第三列第二加数每次少1，得数也少1。',
      activity: '实际完整算原九式并说明一列的变化，不能用只算一式替代全列。',
    },
    {
      title: '两根数线方向与起点不同',
      text: '原第4题左轴标5～14，6+6从6向右走6个间隔，到12；右轴标11～20，18−5从18向左走5个间隔，到13。移动间隔数不包含起点那个刻度作为一次移动。数字已标好的网页轴只能观察，实际画箭头仍须纸面完成。',
      visual: { kind: 'number-line', minimum: 5, maximum: 14, value: 6 },
      activity:
        '实际分别画两根原范围数线、加法向右与减法向左箭头，再填两式；两图各自确认。',
    },
    {
      title: '完整可见图与盒内给定分开',
      text: '原第5题左图第一群兔6只、第二群7只，两群合13只；右图盒上标9只，盒外另有6只，共15只。盒内9只是题目给定，不能因为看不见就当0，也不能把盒上数字另加成一只。本站练习文字条件与原图实际点数分开，原图仍要逐只核对。',
      activity:
        '实际分别点原兔两群与盒外图，读盒标9，再各列算式和带只单位的答句。',
    },
    {
      title: '准备总数减剩余才是售出',
      text: '原第6题笑笑准备19本，活动结束还剩7本，在这个题目只区分售出与剩余两部分，用19−7求售出12本。7是未售出的部分，不是卖出7本；不能把活动中未知的其它事情自行补入这个题目。真实义卖不是必做活动。',
      activity:
        '实际用19张纸卡模拟总数与剩7的两部分，解释所求并写完整算式和答句。',
    },
    {
      title: '十二算式先看加减号再配卡',
      text: '原第7题手持7+6与8+5都得13。本站另外按桌面顺序列出9−4、8+3、7+5、6+5、3+5、7−6、7+9、6+9、5+9、8+7，共十二算式逐张核对。9−4得5，7−6得1；不要把减号误读成加号。部分原数卡被遮挡，不能猜成已看清的完整牌组；本站自行制作所需数卡，允许一张数卡逐次匹配多个同结果算式，不宣称原题要求全部一对一消耗。',
      activity:
        '实际制作或对照全部十二算式，逐张说结果、匹配或补做所需数卡，与同伴交流；真实制卡配卡另记。',
    },
    {
      title: '严格大小与多解条件',
      text: '原第8题8+□>12、15−□<8、□−5<9都可以有多个答案，等于界限不符合大于或小于。本站网页明确填入数与运算结果都在0～20且减法非负：第一空5～12、第二空8～15、第三空5～13全接受，不要求三空不同。原题未写这个上限，例如第一空13使结果21仍满足原不等式，纸面可说明；网页范围与原题条件分开。换新图、换数值复习重新判断，未来计划另记。',
      activity:
        '实际完成原三空，每空再找一个不同合理填法并代入解释；可记录超出网页范围但符合原题的讨论。',
    },
  ],
  questions: [
    ...occupants.flatMap(({ label, level }) =>
      label === null
        ? []
        : [
            {
              ...number(
                `stair-${label}`,
                `本站主台阶图从第1级向右上数，标记${label}在第几级？`,
                level,
                `逐个水平踏面计数，${label}在第${level}级；不是按标记顺序算第几人。`,
              ),
              visual: { kind: 'teen-stairs', variant: 'main' } as const,
            },
          ],
    ),
    ...[
      [10, 'D'],
      [19, 'I'],
    ].map(([level, label]) => ({
      ...task(
        `reverse-${level}`,
        `本站主图站在第${level}级的是哪个标记？`,
        { kind: 'choice', value: String(label) },
        `按踏面级数反查标记${label}。`,
      ),
      choices: stairChoices,
      visual: { kind: 'teen-stairs', variant: 'main' } as const,
    })),
    ...bnuNeighborNumbers.slice(0, -1).map((left, i) => {
      const right = bnuNeighborNumbers[i + 1];
      if (right === undefined)
        throw new Error('Missing adjacent source number');
      return {
        ...number(
          `neighbor-${i + 1}`,
          `原上排第${i + 1}与第${i + 2}个数相邻：${left}+${right}，这一组结果多少？每组独立，不用上一组结果。`,
          left + right,
          `${left}+${right}=${left + right}，原首框15给定，后面六框分别核对。`,
        ),
        visual: {
          kind: 'number-strip' as const,
          values: [...bnuNeighborNumbers],
        },
      };
    }),
    ...bnuReviewAdditionPairs.map(([left, right], i) =>
      number(
        `sum-${i + 1}`,
        `原三列九式第${i + 1}式：${left}+${right}，结果多少？`,
        left + right,
        `${left}+${right}=${left + right}，每个式子独立。`,
      ),
    ),
    {
      ...number(
        'line-add',
        '原左数线5～14，从6向右移动6个间隔，6+6的结果是多少？',
        12,
        '从6走到12，移动6个间隔；起点不计一次移动。',
      ),
      visual: { kind: 'number-line', minimum: 5, maximum: 14, value: 6 },
    },
    {
      ...number(
        'line-subtract',
        '原右数线11～20，从18向左移动5个间隔，18−5的结果是多少？',
        13,
        '18−5=13，减法向左。',
      ),
      visual: { kind: 'number-line', minimum: 11, maximum: 20, value: 18 },
    },
    task(
      'rabbits',
      '按已核对的原图条件，第一群兔6只、第二群7只，依次填两部分数量和合计只数。原图实际点数另做。',
      { kind: 'steps', values: [6, 7, 13] },
      '6+7=13只，两群不是2只。',
    ),
    task(
      'bees',
      '原图盒标9只，盒外6只，依次填盒内给定数量、盒外数量、总只数。',
      { kind: 'steps', values: [9, 6, 15] },
      '9+6=15只，盒内未知外观不表示数量0。',
    ),
    number(
      'sold',
      '准备19本，结束时还剩7本，按原题的售出与剩余两部分，售出多少本？',
      12,
      '19−7=12本，7本是剩余，不是售出。',
    ),
    ...bnuReviewSourceCards.map((card, i) =>
      number(
        `card-${i + 1}`,
        `本站原配卡第${i + 1}卡：${card.left}${card.operator}${card.right}，结果多少？先确认加减号。`,
        result(card),
        `${card.left}${card.operator}${card.right}=${result(card)}。`,
      ),
    ),
    cards('match-thirteen', 13),
    cards('match-fifteen', 15),
    task(
      'inequalities',
      '本站网页约定填数和结果都为0～20，减法非负；依次为8+□>12、15−□<8、□−5<9各填一个合法数，三空可相同。',
      {
        kind: 'number-picks',
        distinct: false,
        fields: [
          [5, 6, 7, 8, 9, 10, 11, 12],
          [8, 9, 10, 11, 12, 13, 14, 15],
          [5, 6, 7, 8, 9, 10, 11, 12, 13],
        ],
      },
      '三空各有多解，第一5～12、第二8～15、第三5～13；边界4、7、14分别使两边相等而不符合严格不等。原题未限定上限，网页条件不能冒原纸面唯一限制。',
    ),
    number(
      'zero-unchecked',
      '本站配卡核对情境：恰有10张桌面算式卡，全部10张已逐张核对，未核对的还剩多少张？',
      0,
      '10张全部核对，未核对0张；这个给定情境不自动确认你已实际做过。',
    ),
    actual(
      'actual-stairs',
      '实际完成原第1题三图形的级数与第10/19级反查，共五处，并逐级解释；做过再确认。',
    ),
    actual(
      'actual-neighbors',
      '实际核对原首给定15与后六个相邻加法框，分别连线、计算并说明不是连续累加；做过再确认。',
    ),
    actual(
      'actual-nine',
      '实际完整计算原第3题三列九式，逐式核对并说明一列规律；全部做过再确认。',
    ),
    actual(
      'actual-add-line',
      '实际画原5～14数线，从6向右画6个间隔并填6+6，说明起点；做过再确认。',
    ),
    actual(
      'actual-subtract-line',
      '实际画原11～20数线，从18向左画5个间隔并填18−5；做过再确认。',
    ),
    actual(
      'actual-rabbits',
      '实际逐只点原第5题两群兔，各列数量，再写加法与带只单位的答句；做过再确认。',
    ),
    actual(
      'actual-bees',
      '实际逐只点原盒外6只、读盒标9只，分别说明可见点数与给定，再列式答句；做过再确认。',
    ),
    actual(
      'actual-sale',
      '实际用19张纸卡模拟准备与剩7两部分，求售出并写算式、答句；纸面模拟不冒实际义卖，做过再确认。',
    ),
    actual(
      'actual-cards',
      '实际对照两手持与十桌面完整十二算式，核对加减号，逐张与所需数卡匹配并说方法；做过再确认。',
    ),
    actual(
      'actual-inequalities',
      '实际为原三道不等式各找至少两种合理填法并代入说明；区分原题与网页0～20条件，做过再确认。',
    ),
    task(
      'reflection',
      '记录实际解决题目时用了什么方法，还有哪一处不确定；未做可如实记录。',
      { kind: 'reflection' },
      '开放反思按原话保存，不自动判断掌握。',
    ),
    task(
      'question',
      '记录自己提出的一个有关位置、数量或填数的新问题，可以写待核对。',
      { kind: 'reflection' },
      '自己的提问不强制与标准例子相同。',
    ),
    task(
      'plan',
      '记录下一次准备怎样练习或核对，计划不当实际已做。',
      { kind: 'reflection' },
      '未来计划单独保存，不代替真实活动确认。',
    ),
  ],
  reviewQuestions: [
    {
      ...number(
        'review-stair',
        '换新的复习台阶图，标记A在第几级？重新数，不抄主图。',
        5,
        '新图A在第5级，主图第6级不是这张图的答案。',
      ),
      visual: { kind: 'teen-stairs', variant: 'review' },
    },
    task(
      'review-inequalities',
      '换新条件，填数和结果仍都在0～20且减法非负；依次为7+□>12、16−□<8、□−6<9各填一个合法数，三空可相同。',
      {
        kind: 'number-picks',
        distinct: false,
        fields: [
          [6, 7, 8, 9, 10, 11, 12, 13],
          [9, 10, 11, 12, 13, 14, 15, 16],
          [6, 7, 8, 9, 10, 11, 12, 13, 14],
        ],
      },
      '第一6～13，第二9～16，第三6～14全部接受，严格不含等于。',
    ),
    number(
      'review-sale-remaining',
      '换一组准备18本、售出9本，按同样两部分关系，还剩多少本？本题所求改为剩余。',
      9,
      '18−9=9本，所求由售出换成剩余。',
    ),
    task(
      'review-neighbors',
      '换新上排9、5、7，依次填相邻两数的两个结果，不连续累加。',
      { kind: 'steps', values: [14, 12] },
      '9+5=14，5+7=12；第二结果不是14+7。',
    ),
  ],
};
