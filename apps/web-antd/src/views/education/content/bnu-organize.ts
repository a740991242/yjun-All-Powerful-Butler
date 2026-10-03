import type { Lesson, Question, Visual } from '../learning/types';

function task(
  id: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint: '先确认对象、起点与方向，再逐一对应；信息未知不当零。',
    explanation,
    ...(visual ? { visual } : {}),
  };
}
function choice(
  id: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    ...task(id, suffix, prompt, { kind: 'choice', value }, explanation, visual),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function select(
  id: string,
  suffix: string,
  prompt: string,
  values: string[],
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(id, suffix, prompt, { kind: 'set', values }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function manual(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    '真实做过才确认；没有做或仅计划做可以跳过，不由网页答对代替。',
  );
}

const id = 'bnu-upper-life-organize';
export const bnuOrganizeLesson: Lesson = {
  id,
  textbookTitle: '生活中的数',
  title: '生活数量整理、序位与自主提问',
  page: 27,
  version: 1,
  status: 'available',
  goal: '分类点数、比较最多最少，区分总数与序位，补完整数序，明确同一物品单位并自主提出数量问题。',
  prerequisite: '认识0～10的数量、数序和比较符号；无需先学加减列式。',
  parentTip:
    '对应北师大上册27～28页。本站虚构记录与纸卡原创，不复制餐具、动物、食物及文化物品原画。原图观察、自主提问和真实物品点数独立人工记录；不从食物偏好推全班情况或健康评价。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷27～28页实际读取：餐具整理、问题银行、动物序位、毛虫缺数、食物喜好点图、文化物品对应、杯与吸管、按图形类别点数与方法说明。',
  },
  steps: [
    {
      title: '先分类再点数',
      text: '本站三组点图分别代表虚构记录A、B、C，第一组4、第二组3、第三组2。分别逐个数，不把每组数与组数混为一谈；同一类别的标记只数一次。',
      visual: { kind: 'count-groups', groups: [4, 3, 2] },
      activity: '实际分类已有少量物品，每类逐个数。',
    },
    {
      title: '比较与信息边界',
      text: '在本站记录里A最多、C最少，只能说明这份记录。没有问过全班，不能声称全班喜好相同；没有打开的盒子也不能当0件。教材中的人物和自己的真实环境分别说清。',
      activity: '实际读取一份明确记录并说清能确定与不能确定的事。',
    },
    {
      title: '总数、序位和缺数',
      text: '甲、乙、丙、丁、戊、己从左到右排，共6张；戊从左数第5张。把起点改到右边，序位会变而总数不变。补缺数时先辨认顺数或倒数，再逐个接着数，不根据空格大小猜。',
      activity: '实际摆名字卡，从两端指序位，并补画一条顺数和一条倒数路。',
    },
    {
      title: '同一物品与两类对象',
      text: '4个杯子每杯配一根吸管，6根吸管有多余；比较杯与吸管按各自数量。一个杯里有两根吸管时，杯子仍是一个，不能把吸管数当杯数。按圆、三角、方形分类时，先明确类别再数。',
      visual: { kind: 'comparison-rows', counts: [4, 6] },
      activity: '实际摆杯卡与纸条对应，再逐类数自己画的图形。',
    },
    {
      title: '自己的问题银行',
      text: '针对真实或明确虚构的小场景，提出一个数量问题，说清对象、条件和所求；同伴先听问题，再按给出的条件核对。自己还不确定的事保留疑问，不为了填题编造经历。',
      activity:
        '实际提出一个问题，与家长或同伴核对，并记录一个尚待研究的问题。',
    },
    {
      title: '原书整理与方法回顾',
      text: '实际回看27～28页，分别做餐具数量、序位、缺数、喜好图、文化物品对应、杯与吸管及多类图形点数。原书图与本站替代分开；解释逐一、分类或分组数的方法，不把屏幕答案当原图实做。',
      activity: '完成原图任务后说清一次自己的计数方法。',
    },
  ],
  questions: [
    task(
      id,
      'q1',
      '图中第一、二、三组分别记作A、B、C。只问A有几个标记？',
      { kind: 'number', value: 4 },
      '第一组A四个，另外两组不混入。',
      { kind: 'count-groups', groups: [4, 3, 2] },
    ),
    task(
      id,
      'q2',
      '同图只问第二组B有几个标记？',
      { kind: 'number', value: 3 },
      '第二组三个。',
      { kind: 'count-groups', groups: [4, 3, 2] },
    ),
    task(
      id,
      'q3',
      '同图只问第三组C有几个标记？',
      { kind: 'number', value: 2 },
      '第三组两个。',
      { kind: 'count-groups', groups: [4, 3, 2] },
    ),
    choice(
      id,
      'q4',
      '同图A、B、C各组中哪组最多？',
      'A',
      ['A', 'B', 'C'],
      '4最多，只对本图各组比较。',
      { kind: 'count-groups', groups: [4, 3, 2] },
    ),
    choice(
      id,
      'q5',
      '同图A、B、C各组中哪组最少？',
      'C',
      ['A', 'B', 'C'],
      '2最少。',
      { kind: 'count-groups', groups: [4, 3, 2] },
    ),
    task(
      id,
      'q6',
      '甲、乙、丙、丁、戊、己从左到右排，丙从左数第几张？',
      { kind: 'number', value: 3 },
      '从甲起数到丙是第3张。',
    ),
    task(
      id,
      'q7',
      '同一行甲、乙、丙、丁、戊、己，只问共有几张卡？',
      { kind: 'number', value: 6 },
      '总数6，戊第5是另一个问题。',
    ),
    task(
      id,
      'q8',
      '顺数1、2、空格、4、5，空格填几？',
      { kind: 'number', value: 3 },
      '每次接着数一个，2后是3。',
    ),
    task(
      id,
      'q9',
      '倒数9、8、空格、6，空格填几？',
      { kind: 'number', value: 7 },
      '每次倒数一个，8后是7。',
    ),
    choice(
      id,
      'q10',
      '4个杯子、6根吸管，按杯数和吸管数顺序写比较，用哪个符号？',
      '<',
      ['=', '<', '>'],
      '4少于6，单位分别是杯和根。',
      { kind: 'comparison-rows', counts: [4, 6] },
    ),
    choice(
      id,
      'q11',
      '另有4个杯子、4根吸管，每杯一根，比较两类数量用哪个符号？',
      '=',
      ['=', '<', '>'],
      '数量相等且逐一对应。',
      { kind: 'comparison-rows', counts: [4, 4] },
    ),
    task(
      id,
      'q12',
      '本站每个点代表一张原创文化物品纸卡，只数纸卡共有几张？',
      { kind: 'number', value: 5 },
      '五个标记对应五张卡，不把纸卡内容编号当数量。',
      { kind: 'count', count: 5 },
    ),
    choice(
      id,
      'q13',
      '只知道虚构记录A有4个标记，未调查全班，能确定全班都有同一种喜好吗？',
      '不能确定',
      ['能确定', '不能确定'],
      '这份记录的范围不能扩大为全班事实。',
    ),
    select(
      id,
      'q14',
      '哪些方法能用来核对一类物品数量？选全。',
      ['每个只数一次', '先明确类别', '把所数物品逐一对应'],
      [
        '每个只数一次',
        '先明确类别',
        '把所数物品逐一对应',
        '只看排得长就断定多',
      ],
      '明确对象并逐一核对，不用间距替代数量。',
    ),
    manual(
      id,
      'actual-classify',
      '实际分类少量已有物品，逐类点数并比较最多最少；做过再确认。',
    ),
    manual(
      id,
      'actual-order',
      '实际摆六张名字卡，从两端指序位并另报总数，补一条顺数和一条倒数路；做过再确认。',
    ),
    manual(
      id,
      'actual-record',
      '实际读一份明确记录，说清记录范围，不推断未调查的人；做过再确认。',
    ),
    manual(
      id,
      'actual-cups',
      '实际用杯卡与纸条摆正好和多余两种对应，明确杯数与吸管根数；做过再确认。',
    ),
    manual(
      id,
      'actual-shapes',
      '实际自画圆、三角、方形混合图，逐类点数并说自己的方法；做过再确认。',
    ),
    manual(
      id,
      'actual-question',
      '实际提出一个条件和对象清楚的数量问题，与家长或同伴核对；做过再确认。',
    ),
    manual(
      id,
      'actual-book',
      '实际回看合法原书27～28页，完成餐具、序位、缺数、喜好图、文化物品对应、杯吸管和多类图形任务；做过再确认。',
    ),
    task(
      id,
      'reflection-method',
      '记录自己实际用过的一种计数方法；没做可写待做。',
      { kind: 'reflection' },
      '方法原话开放，不自动评正确或掌握。',
    ),
    task(
      id,
      'reflection-question',
      '记录一个尚待研究的问题；没有疑问可如实说明。',
      { kind: 'reflection' },
      '问题银行不统一答案，不把提问冒已经解决。',
    ),
  ],
  reviewQuestions: [
    task(
      id,
      'review-count',
      '新图第一、二组分别是D、E，只数第二组E有几个？',
      { kind: 'number', value: 5 },
      '所求改为E五个。',
      { kind: 'count-groups', groups: [3, 5] },
    ),
    task(
      id,
      'review-order',
      '甲、乙、丙、丁、戊从左到右排，乙从右数第几张？',
      { kind: 'number', value: 4 },
      '从右戊1、丁2、丙3、乙4。',
    ),
    task(
      id,
      'review-sequence',
      '新题顺数0、1、空格、3，空格填几？',
      { kind: 'number', value: 2 },
      '起点改为0，空格是2而非旧题3。',
    ),
    choice(
      id,
      'review-unknown',
      '没有打开且没有数量记录的抽屉，能直接断定里面是0张卡吗？',
      '不能',
      ['能', '不能'],
      '未观察是未知，不等于已知没有。',
    ),
  ],
};
