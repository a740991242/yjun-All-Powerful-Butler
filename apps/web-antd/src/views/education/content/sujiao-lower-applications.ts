import type { Lesson, QuantityTableVisual, Question } from '../learning/types';

import { quantityTableMissing } from '../learning/quantity-table';
import { sujiaoLowerSource as source } from './sujiao-lower-source';

const calculationId = 'sj-lower-calculation-applications';
const conditionId = 'sj-lower-conditions-pairs';

function table(review: boolean): QuantityTableVisual {
  return {
    kind: 'quantity-table',
    columns: ['拼图组', '阅读组', '积木组'],
    parts: review ? ['圆形卡', '方形卡'] : ['红卡', '蓝卡'],
    values: review
      ? [
          [7, null, 6],
          [5, 8, null],
          [null, 15, 14],
        ]
      : [
          [6, 8, null],
          [7, null, 7],
          [null, 14, 15],
        ],
  };
}
function calculationTasks(review: boolean): Question[] {
  const id = calculationId;
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const chains: [number, '+' | '-', number, '+' | '-', number][] = review
    ? [
        [9, '+', 3, '-', 7],
        [15, '-', 7, '+', 6],
        [6, '+', 5, '+', 4],
      ]
    : [
        [8, '+', 4, '-', 7],
        [16, '-', 8, '+', 5],
        [7, '+', 4, '+', 6],
      ];
  const visual = table(review);
  const start = review ? 7 : 6;
  const end = review ? 15 : 13;
  const known = review ? 13 : 12;
  const current = review ? 8 : 9;
  return [
    ...chains.map(([a, op1, b, op2, c], i): Question => {
      const intermediate = op1 === '+' ? a + b : a - b;
      const final = op2 === '+' ? intermediate + c : intermediate - c;
      return {
        id: `${prefix}-chain-${i}`,
        knowledge: `${id}-chain-${i}`,
        prompt: `${a} ${op1} ${b} ${op2} ${c}，从左往右算，依次填第一次计算结果、最后结果。`,
        rule: { kind: 'steps', values: [intermediate, final] },
        hint: '第二步从第一步结果继续，不回到最初的数。',
        explanation: `先${a}${op1}${b}=${intermediate}，再${intermediate}${op2}${c}=${final}。中间数量与最后数量不同。`,
      };
    }),
    {
      id: `${prefix}-table`,
      knowledge: `${id}-table`,
      prompt:
        '每列是独立一组的卡片。按拼图组、阅读组、积木组顺序，填各列唯一待填的数量。',
      visual,
      rule: { kind: 'steps', values: quantityTableMissing(visual) },
      hint: '先定位列与行。缺合计用加法；缺一部分用合计减去另一部分。待填不等于0。',
      explanation: `各列待填依次为${quantityTableMissing(visual).join('、')}。逐列检查两部分合起来等于该列合计，不能跨列相加。`,
    },
    {
      id: `${prefix}-table-total`,
      knowledge: `${id}-table-total`,
      prompt: review
        ? '阅读组合计15表示哪些卡片？'
        : '阅读组合计14表示哪些卡片？',
      visual,
      choices: [
        { id: 'column', label: '只包含阅读组的两种卡片' },
        { id: 'all', label: '包含三组全部卡片' },
        { id: 'one', label: '只包含阅读组第一种卡片' },
      ],
      rule: { kind: 'choice', value: 'column' },
      hint: '一个列标题对应一组，合计只属于这一列。',
      explanation: '合计包括本列两部分，不包含其他列，也不只取一种卡片。',
    },
    {
      id: `${prefix}-between`,
      knowledge: `${id}-between`,
      prompt: `${start}号和${end}号座位之间有几个座位？连续编号，两个端点座位不计入。`,
      visual: {
        kind: 'number-line',
        minimum: start,
        maximum: end,
        value: start,
      },
      rule: { kind: 'number', value: end - start - 1 },
      hint: `从${start + 1}数到${end - 1}，端点不在“之间”的范围里。`,
      explanation: `只数${start + 1}～${end - 1}，共${end - start - 1}个。号码差${end - start}是间隔数，不是中间座位数。`,
    },
    {
      id: `${prefix}-include-ends`,
      knowledge: `${id}-include-ends`,
      prompt: `从${start}号到${end}号座位，一共有几个？这次两个端点都要计入。`,
      rule: { kind: 'number', value: end - start + 1 },
      hint: '这次从第一个编号开始数，一直到最后一个编号，不能沿用不含端点的答案。',
      explanation: `${end}−${start}+1=${end - start + 1}个。范围含两个端点，与“之间”不同。`,
    },
    {
      id: `${prefix}-least-more`,
      knowledge: `${id}-least-more`,
      prompt: `小禾做了${known}张卡，小宁做了${current}张。小宁至少再做几张，才能比小禾多？`,
      rule: { kind: 'number', value: known - current + 1 },
      hint: '先补到一样多，再多做1张；“比……多”不包括相等。',
      explanation: `再做${known - current}张只是相等；至少再做${known - current + 1}张，达到${known + 1}张才更多。`,
    },
    {
      id: `${prefix}-comparison`,
      knowledge: `${id}-comparison`,
      prompt: review
        ? '先算两边，13 − 6 与 8 + 4，哪边的结果大？'
        : '先算两边，14 − 8 与 7 + 5，哪边的结果大？',
      choices: [
        { id: 'left', label: '左边大' },
        { id: 'right', label: '右边大' },
        { id: 'equal', label: '两边相等' },
      ],
      rule: { kind: 'choice', value: 'right' },
      hint: '比较完整得数，不只比较最前面的数。',
      explanation: review
        ? '左边7、右边12，右边大，不能因为13大于8就选左边。'
        : '左边6、右边12，右边大，不能因为14大于7就选左边。',
    },
    {
      id: `${prefix}-missing`,
      knowledge: `${id}-missing`,
      prompt: review ? '7 + □ = 15，空格填几？' : '8 + □ = 14，空格填几？',
      rule: { kind: 'number', value: review ? 8 : 6 },
      hint: '总数减去已知部分，并代回加法检查。',
      explanation: review ? '15−7=8，7+8=15。' : '14−8=6，8+6=14。',
    },
    {
      id: `${prefix}-smallest`,
      knowledge: `${id}-smallest`,
      prompt: review ? '哪道算式的结果最小？' : '比较三道算式，哪道结果最小？',
      choices: review
        ? [
            { id: 'a', label: '13 − 5' },
            { id: 'b', label: '11 − 5' },
            { id: 'c', label: '12 − 5' },
          ]
        : [
            { id: 'a', label: '14 − 6' },
            { id: 'b', label: '12 − 6' },
            { id: 'c', label: '13 − 6' },
          ],
      rule: { kind: 'choice', value: 'b' },
      hint: '可以逐道算，或比较减数相同而总数不同时的差。',
      explanation: review
        ? '结果依次8、6、7，第二道最小。'
        : '结果依次8、6、7，第二道最小。',
    },
  ];
}
function conditionTasks(review: boolean): Question[] {
  const id = conditionId;
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const total = review ? 17 : 18;
  const completed = review ? 6 : 7;
  const boxes: [number, number, number] = review ? [3, 6, 9] : [4, 7, 8];
  const sums = [boxes[0] + boxes[1], boxes[0] + boxes[2], boxes[1] + boxes[2]];
  const known = review ? 5 : 6;
  const whole = review ? 14 : 13;
  return [
    {
      id: `${prefix}-needed`,
      knowledge: `${id}-needed`,
      prompt: `一本书共${total}页，要知道还剩多少页没读，需要再知道什么？`,
      choices: [
        { id: 'read', label: '已经读完多少页' },
        { id: 'color', label: '封面是什么颜色' },
        { id: 'name', label: '书名有几个字' },
      ],
      rule: { kind: 'choice', value: 'read' },
      hint: '剩下量需要总数和已完成的数量，其他信息不能代替。',
      explanation: '只知道总页数不能唯一确定未读页数，必须补充已读完页数。',
    },
    {
      id: `${prefix}-unknown`,
      knowledge: `${id}-unknown`,
      prompt: review
        ? '一层书架有5本书，另一层数量没有给出，能确定两层一共多少本吗？'
        : '盒子里有6张红卡，蓝卡数量没有给出，能确定两种卡一共多少张吗？',
      choices: [
        { id: 'yes', label: '能，直接用已知那一组的数' },
        { id: 'no', label: '不能，还缺另一组数量' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '没给出的数量不是0，也不能凭猜测补上。',
      explanation:
        '已知只是其中一部分。另一部分可以有不同数量，总数不能唯一确定。',
    },
    {
      id: `${prefix}-with-condition`,
      knowledge: `${id}-with-condition`,
      prompt: `书共${total}页，已经读完${completed}页，还有多少页没读？这里给的是已完成页数，不是当前页码。`,
      rule: { kind: 'number', value: total - completed },
      hint: '从总页数减去已读完页数。',
      explanation: `${total}−${completed}=${total - completed}页。补足数量条件后才可以确定结果。`,
    },
    {
      id: `${prefix}-question`,
      knowledge: `${id}-question`,
      prompt: `两层书架共${whole}本书，下层${known}本。根据这些数量，哪一个问题可以直接用减法解答？`,
      choices: [
        { id: 'upper', label: '上层有几本书？' },
        { id: 'new', label: '今天新买了几本书？' },
        { id: 'pages', label: '每本书有几页？' },
      ],
      rule: { kind: 'choice', value: 'upper' },
      hint: '总数和一个部分可以求另一个部分，但不能推出未提到的购买或页数信息。',
      explanation: `${whole}−${known}=${whole - known}，可以求上层。其他两个问题缺少所需信息。`,
    },
    {
      id: `${prefix}-pair-totals`,
      knowledge: `${id}-pair-totals`,
      prompt: `只有A、B、C三盒笔，分别${boxes.join('、')}支。每次选不同的两盒，按AB、AC、BC顺序填三种总数。`,
      rule: { kind: 'steps', values: sums },
      hint: '三种组合各数一次，不能把同一盒重复选两次，也不能三盒全选。',
      explanation: `AB=${sums[0]}，AC=${sums[1]}，BC=${sums[2]}。只有这三种不同的两盒组合。`,
    },
    {
      id: `${prefix}-extremes`,
      knowledge: `${id}-extremes`,
      prompt: `A、B、C三盒笔分别${boxes.join('、')}支，选不同的两盒。依次填最少几支、最多几支。`,
      rule: { kind: 'steps', values: [Math.min(...sums), Math.max(...sums)] },
      hint: '先找全三种组合的总数，再比较。最少选两盒少的，最多选两盒多的。',
      explanation: `三个总数${sums.join('、')}，最少${Math.min(...sums)}支、最多${Math.max(...sums)}支，不是三盒总和。`,
    },
    {
      id: `${prefix}-max-boxes`,
      knowledge: `${id}-max-boxes`,
      prompt: `三盒分别${boxes.join('、')}支，哪两盒合起来最多？`,
      choices: [
        { id: 'ab', label: 'A与B' },
        { id: 'ac', label: 'A与C' },
        { id: 'bc', label: 'B与C' },
      ],
      rule: { kind: 'choice', value: 'bc' },
      hint: '这里只有这三盒，且每次选两盒；要保留两个数量最多的盒子。',
      explanation: `B与C共${sums[2]}支，大于其他两个组合。`,
    },
    {
      id: `${prefix}-missing-box`,
      knowledge: `${id}-missing-box`,
      prompt: `A盒${boxes[0]}支、B盒${boxes[1]}支、C盒数量未给出，能确定任选两盒的最多总数吗？`,
      choices: [
        { id: 'yes', label: '能，只算A与B就够' },
        { id: 'no', label: '不能，还需要C盒的数量' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: 'C可能比另外两盒多，也可能少，遗漏它会改变最大组合。',
      explanation:
        '选两盒最多需要知道所有候选盒数量，C未给出时不能把A与B当唯一或最大组合。',
    },
    {
      id: `${prefix}-complete-story`,
      knowledge: `${id}-complete-story`,
      prompt: `小禾做了${known}张卡，小宁又给了几张但没说数量。要确定现在共有${whole}张，应补充小宁给了几张？`,
      rule: { kind: 'number', value: whole - known },
      hint: '这里已给目标总数，从目标总数减去原来数量，补上明确条件。',
      explanation: `应补${whole - known}张，${known}+${whole - known}=${whole}。如果没有目标总数，就不能唯一补出这个条件。`,
    },
  ];
}
export const sujiaoCalculationApplicationsDraft: Lesson = {
  id: calculationId,
  textbookTitle: '进位加法和退位减法',
  title: '综合应用：连续计算、数量表与编号之间',
  page: 6,
  version: 1,
  status: 'preparing',
  goal: '连续计算中保留中间结果，逐列识别两部分关系，区分含端点与不含端点的数量，并检查严格比较。',
  prerequisite:
    '会本单元进位加法、退位减法，能读11～19及连续编号。准备19件小物品、数字卡和纸笔。',
  parentTip:
    '所有表格列独立。编号之间与含两个端点是不同范围；至少比别人多要在相等后再多1。动作、画表与解释需人工查看。',
  steps: [
    {
      title: '连续变化保留中间数量',
      text: '8加4减7，先合成12，再从12拿走7，最后5。不能第二步回到原来的8。连续加法同样从前一步结果继续，中间与最后数量都要检查。',
      activity: '摆8件，添4件后暂停点数，再取走7件，记录两次数量。',
    },
    {
      title: '数量表逐列求缺数',
      text: '每列是独立一组，红卡与蓝卡两部分合起来是本列合计。缺合计用加法，缺一部分用合计减去另一部分。待填不是0，不跨列合并。',
      visual: table(false),
      activity: '纸上画两部分表，实际摆卡，分别留总数与部分空格并检查。',
    },
    {
      title: '编号之间不包括两个端点',
      text: '6号与13号之间只数7～12号，共6个；若从6号到13号、两个端点也数，共8个。先明确范围，再逐个列出编号检查，号码差7表示间隔数。',
      visual: { kind: 'number-line', minimum: 6, maximum: 13, value: 6 },
      activity: '在纸上写6～13，分别圈出不含端点和含端点的范围。',
    },
    {
      title: '比较得数与至少多一个',
      text: '比较14减8和7加5，要先看完整得数6和12，不能只看14与7。小禾12张、小宁9张，再做3张只是相等；要比小禾多，至少做4张。代回检查相等边界是否被排除。',
      activity: '摆两组卡，先补到一样多，再添1张，并口述“至少”的理由。',
    },
  ],
  questions: [
    ...calculationTasks(false),
    {
      id: `${calculationId}-manual-chain`,
      knowledge: `${calculationId}-physical-chain`,
      prompt:
        '实际演示先添后取与连续添加各一次，每次记录中间和最后数量，并用另一种方法检查。总数不超过19。',
      rule: { kind: 'manual' },
      hint: '下一步从前一步数量继续，不回到最初数量。',
      explanation: '实物变化与口述人工确认，填对数字不替代操作。',
    },
    {
      id: `${calculationId}-manual-table`,
      knowledge: `${calculationId}-physical-table`,
      prompt:
        '在纸上制作至少两列独立的两部分数量表，用实物核对总数，分别留部分和合计空格，再填写检查。',
      rule: { kind: 'manual' },
      hint: '每列只看自己的两部分，待填不表示0。',
      explanation: '画表、摆物和逐列核对分别人工查看。',
    },
    {
      id: `${calculationId}-manual-range`,
      knowledge: `${calculationId}-physical-range`,
      prompt:
        '写一段连续编号，分别圈出两编号之间、含两端编号的范围；再摆两组物品说明怎样至少比另一组多1。',
      rule: { kind: 'manual' },
      hint: '先说明范围或比较条件，再逐个列举检查。',
      explanation: '范围、严格比较与口述人工查看，不自动判断掌握。',
    },
  ],
  reviewQuestions: calculationTasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同一扫描综合练习范围核验与原创草稿检查',
    notes: `依据${source.preview}印刷第6～7、12～13、16页，ISBN ${source.isbn}。原创连续算式、两部分表、连续座位编号与数量比较，不复制原图题；仅覆盖本课列明范围，未覆盖全部排列、九宫格及单元复习。版权日期待核验，暂未注册正式课程。`,
  },
};
export const sujiaoConditionsPairsDraft: Lesson = {
  id: conditionId,
  textbookTitle: '进位加法和退位减法',
  title: '综合应用：补条件、提问题与两盒数量比较',
  page: 17,
  version: 1,
  status: 'preparing',
  goal: '识别不足的数量条件，提出可由已知数量解答的问题，列出三种两盒组合并求最少与最多。',
  prerequisite: '会19以内两部分加减及数量比较。准备三盒安全物品、卡片与纸笔。',
  parentTip:
    '缺少的条件不是0，不要求在信息不足时猜答案；两盒比较只在明确给定三盒且每次选不同两盒的范围内。自编条件可有多个合理例子，人工核对。',
  steps: [
    {
      title: '先问条件够不够',
      text: '一本书共18页，只凭总页数不能知道还剩多少页。需要知道已读完页数；书名和封面颜色不能代替数量。没有给出的数量不是0，先补条件再计算。',
      activity: '家长只给总数，孩子说还需要什么数量；再补一个合理已完成数量。',
    },
    {
      title: '按已知数量提出能解答的问题',
      text: '两层书架共13本，下层6本，可以问上层几本，13减6得7。不能推出今天新买几本或每本几页。若已给目标总数13，原有6，可以确定应再添7；若没有目标，补充条件可以有多种。',
      activity: '用同组物品提出求总数或部分的问题，说清哪些条件参与。',
    },
    {
      title: '三盒选两盒，组合不能遗漏',
      text: '只有A、B、C三盒，分别4、7、8支笔。选不同两盒只有AB、AC、BC三种，分别11、12、15。A不能重复选两次，三盒全选也不符合题目。',
      activity: '在纸上列三种组合，实物各选一次并逐一记录总数。',
    },
    {
      title: '比较最少与最多，检查未知条件',
      text: '三种两盒总数11、12、15，最少11、最多15。最少选数量少的两盒，最多选数量多的两盒。若C盒数量没给，就不能确定最大组合，不能忽略C或把未知当0。',
      activity: '改变一个盒子的数量，重新列全组合，解释最少与最多是否变化。',
    },
  ],
  questions: [
    ...conditionTasks(false),
    {
      id: `${conditionId}-manual-condition`,
      knowledge: `${conditionId}-own-condition`,
      prompt:
        '编一个缺少数量条件的问题，说清缺什么，再补一个合理条件，画图或摆物并解答。中间与总数均在19以内。',
      rule: { kind: 'manual' },
      hint: '补充条件必须有助于所求问题，不是任意颜色或名称。',
      explanation: '允许多种合理补充，由家长核对条件、问题与解答。',
    },
    {
      id: `${conditionId}-manual-question`,
      knowledge: `${conditionId}-own-question`,
      prompt:
        '用两部分物品给出总数和其中一部分，提出可解答的问题，再举一个目前不能解答的问题并说明缺少什么。',
      rule: { kind: 'manual' },
      hint: '可解答问题用已知量；不能解答问题明确所缺信息。',
      explanation: '提问与说明独立人工查看，不以点击确认评定表达能力。',
    },
    {
      id: `${conditionId}-manual-pairs`,
      knowledge: `${conditionId}-physical-pairs`,
      prompt:
        '准备三盒物品，每次选不同两盒，列出全部三种组合并求最少、最多。改变一盒数量后重做；各组合总数不超过19。',
      rule: { kind: 'manual' },
      hint: '每盒最多9件，三种组合各记一次，不重复取同一盒。',
      explanation: '实际选盒、记录、比较和解释人工查看，不自动判定动作。',
    },
  ],
  reviewQuestions: conditionTasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同一扫描综合应用范围核验与原创草稿检查',
    notes: `依据${source.preview}印刷第17、20页，ISBN ${source.isbn}。补条件、提问题与选两盒最值范围已实际读到，本站数量、故事、问答原创。未覆盖数塔、九宫格和加法表分布，版权日期待核验，保持未注册草稿。`,
  },
};
