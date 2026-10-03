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

const id = 'bnu-upper-life-comparison';
export const bnuComparisonLesson: Lesson = {
  id,
  textbookTitle: '生活中的数',
  title: '逐一配对、比较符号与开放填数',
  page: 23,
  version: 1,
  status: 'available',
  goal: '逐一配对判断正好、缺少与多余，区分单件和一双，用=、<、>表示数量关系并找出所有符合条件的数。',
  prerequisite: '能逐个点数0～10并明确计数对象；无需先列加减算式。',
  parentTip:
    '对应北师大上册23～26页。本站点图和纸卡原创，不复制午餐与动物原画。原书画记、符号书写和完整开放填数单列实际任务；选项或屏幕字体不代替纸面描写。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷23～26页已实际读取：餐具与人物配对、正好/缺少/多余、最多最少、按条件画记、一人一双、对应后认识比较符号、反向比较、开放填数和严格大小筛选。',
  },
  steps: [
    {
      title: '每个对象对应一个',
      text: '把上排每个点与下排一个点配对，不能重复用同一个点。上排4个、下排3个，配完上排仍有一个没有对应，所以数量不同。间距和排得长不决定数量。',
      visual: { kind: 'comparison-rows', counts: [4, 3] },
      activity: '实际用纸卡与小棒逐一对应，分别做正好、少和多的情况。',
    },
    {
      title: '正好、缺少和多余',
      text: '每人领一张卡，5人只有3张时有2人未领到；4人有6张时每人一张后还剩2张。先核对一人一张的条件，不用“卡多”推断人数更多。',
      visual: { kind: 'comparison-rows', counts: [5, 3] },
      activity: '用虚构名字卡摆出这两种情况，逐一核对未配到的对象。',
    },
    {
      title: '同样多、比较三类与单位',
      text: '要画同样多，就给每个对象一个标记。要画得少，允许已知一个也没有，只要条件允许。比较三类先分别数再找最多最少；一人一双筷子是每人两根，一双的数量与单根的数量分别说清。',
      visual: { kind: 'count-groups', groups: [2, 3, 4] },
      activity: '实际画同样多和少一些的标记，并分别数三双纸条与单根纸条。',
    },
    {
      title: '等号与大小号',
      text: '数量一样多用=；左边少于右边用<；左边多于右边用>。例如4>3读四大于三，反过来3<4读三小于四；张口朝较多的一边。两个条件中的数字和符号要一起看。',
      visual: { kind: 'comparison-rows', counts: [5, 5] },
      activity: '对照合法原书描写三种符号，并实际读出双向比较。',
    },
    {
      title: '严格大小和多种答案',
      text: '只选大于4的数，4本身不能选；只选小于6的数，6本身不能选。指定整数0～10时，2>空格可以填0或1，不能填2；示例不是唯一答案。已知0是一个合法数，空白仍是没有回答。',
      activity: '实际用0～10数字卡找出所有符合条件的数，逐个核对等于边界。',
    },
    {
      title: '回看原图与自己的方法',
      text: '实际回看23～26页，完成配对、按条件画图、按数量选物、最多最少、写读符号、反向比较、方块和圆点比较及开放填数。教材图中物品与本站点图分别记录；原图完整任务未做保留待做。',
      activity: '说清一次配对方法与一个开放答案的理由。',
    },
  ],
  questions: [
    task(
      id,
      'q1',
      '只数本图上排标记，上排有几个？',
      { kind: 'number', value: 4 },
      '只数上排四个，不把下排三个合入。',
      { kind: 'comparison-rows', counts: [4, 3] },
    ),
    choice(
      id,
      'q2',
      '上排4个，下排3个，按上排数量与下排数量的顺序，应选哪个符号？',
      '>',
      ['=', '<', '>'],
      '4多于3，4>3。',
      { kind: 'comparison-rows', counts: [4, 3] },
    ),
    choice(
      id,
      'q3',
      '将同一比较顺序反过来，3和4中间用哪个符号？',
      '<',
      ['=', '<', '>'],
      '3少于4，反向后改用<。',
    ),
    choice(
      id,
      'q4',
      '上、下排各5个，比较数量中间用哪个符号？',
      '=',
      ['=', '<', '>'],
      '逐一对应都没有剩余，两排一样多。',
      { kind: 'comparison-rows', counts: [5, 5] },
    ),
    task(
      id,
      'q5',
      '5人每人一张，只有3张卡，逐一配完有几人没有卡？',
      { kind: 'number', value: 2 },
      '3人各领一张，另外2人没有卡，不数卡片余量。',
      { kind: 'comparison-rows', counts: [5, 3] },
    ),
    task(
      id,
      'q6',
      '4人每人一张，6张卡逐一配完，多余几张卡？',
      { kind: 'number', value: 2 },
      '4张分给4人，余下2张是卡，不是多余的人。',
      { kind: 'comparison-rows', counts: [4, 6] },
    ),
    choice(
      id,
      'q7',
      '图中第一、二、三组分别为A、B、C。哪组标记最多？',
      'C',
      ['A', 'B', 'C'],
      '逐组数为2、3、4，C最多。',
      { kind: 'count-groups', groups: [2, 3, 4] },
    ),
    choice(
      id,
      'q8',
      '同图第一、二、三组分别为A、B、C。哪组标记最少？',
      'A',
      ['A', 'B', 'C'],
      '比较对象仍为各组标记，A只有2个。',
      { kind: 'count-groups', groups: [2, 3, 4] },
    ),
    task(
      id,
      'q9',
      '三人各一双纸条，每双明确有两根，只数单根纸条共有几根？',
      { kind: 'number', value: 6 },
      '每人两根，逐一数六根；三双与六根单位不同。',
    ),
    task(
      id,
      'q10',
      '要比3个少，空格填任意一个0～10的整数：空格<3。',
      { kind: 'number-picks', fields: [[0, 1, 2]], distinct: false },
      '允许0、1、2；3与大于3的数不满足严格小于。',
    ),
    choice(
      id,
      'q11',
      '“2<5”应怎样读？',
      '二小于五',
      ['二小于五', '二大于五', '二等于五'],
      '按数字和符号顺序读，不反转所求。',
    ),
    select(
      id,
      'q12',
      '只在0、4、5、7、10中选出所有大于4的数。',
      ['5', '7', '10'],
      ['0', '4', '5', '7', '10'],
      '严格大于不包含4，三个符合数都要选。',
    ),
    select(
      id,
      'q13',
      '只在0、4、6、8、10中选出所有小于6的数。',
      ['0', '4'],
      ['0', '4', '6', '8', '10'],
      '0和4小于6，6本身不选。',
    ),
    task(
      id,
      'q14',
      '两空各填任意0～10整数，重复允许。依次填2>空格、空格<5。',
      {
        kind: 'number-picks',
        fields: [
          [0, 1],
          [0, 1, 2, 3, 4],
        ],
        distinct: false,
      },
      '第一空0或1，第二空0～4；相互独立且重复允许。',
    ),
    task(
      id,
      'q15',
      '7=空格，填几？',
      { kind: 'number', value: 7 },
      '等号两边的数一样。',
    ),
    manual(
      id,
      'actual-pairs',
      '实际摆一对一对应，分别做正好、缺少和多余，并说出未配到的对象；做过再确认。',
    ),
    manual(
      id,
      'actual-draw',
      '实际画与3个同样多的标记，再画比3个少的标记，允许合法的0；做过再确认。',
    ),
    manual(
      id,
      'actual-units',
      '实际摆三双纸条，分别数双数和单根数，核对每双两根；做过再确认。',
    ),
    manual(
      id,
      'actual-three',
      '实际为三类物品逐类点数，说清最多和最少的类别；做过再确认。',
    ),
    manual(
      id,
      'actual-symbols',
      '对照合法原书在纸上实际描写=、<、>并读出比较；做过再确认。',
    ),
    manual(
      id,
      'actual-reverse',
      '实际摆两组数量，分别从两个方向写读比较并核对；做过再确认。',
    ),
    manual(
      id,
      'actual-open',
      '实际用0～10数字卡列出2>空格和空格<5的所有合法答案，检查等于边界；做过再确认。',
    ),
    manual(
      id,
      'actual-book',
      '实际回看合法原书23～26页，完成原图配对、画记、最多最少、符号、方块圆点和开放填数；做过再确认。',
    ),
    task(
      id,
      'reflection',
      '记录一次实际配对或开放填数的方法；没做可写待做或疑问。',
      { kind: 'reflection' },
      '开放记录不评分，不由表达自动评定掌握。',
    ),
  ],
  reviewQuestions: [
    task(
      id,
      'review-count',
      '新图只数下排标记，有几个？',
      { kind: 'number', value: 4 },
      '所求改为下排四个。',
      { kind: 'comparison-rows', counts: [2, 4] },
    ),
    choice(
      id,
      'review-sign',
      '新图按上排与下排顺序写数量比较，中间用哪个符号？',
      '<',
      ['=', '<', '>'],
      '上排2比下排4少。',
      { kind: 'comparison-rows', counts: [2, 4] },
    ),
    task(
      id,
      'review-open',
      '新题填任意0～10整数，依次填4>空格、空格<2，重复允许。',
      {
        kind: 'number-picks',
        fields: [
          [0, 1, 2, 3],
          [0, 1],
        ],
        distinct: false,
      },
      '新范围第一空0～3，第二空0或1，严格大小仍不含等于。',
    ),
    select(
      id,
      'review-select',
      '从0、2、3、4、8中选出所有大于3的数。',
      ['4', '8'],
      ['0', '2', '3', '4', '8'],
      '边界与候选数已改变，3本身不选。',
    ),
  ],
};
