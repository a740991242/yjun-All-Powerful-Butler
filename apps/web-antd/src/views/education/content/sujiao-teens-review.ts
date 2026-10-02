import type { Lesson, Question } from '../learning/types';

export const sujiaoTeensReviewSources = {
  checkedAt: '2026-10-01',
  links: [38_206, 38_207, 38_208, 38_209].map(
    (id) => `http://app.xxsx.cn/resources-detail/${id}/63`,
  ),
};

type Expression = [number, '+' | '-', number];
type Chain = [number, '+' | '-', number, '+' | '-', number];
const calculate = ([a, op, b]: Expression) => (op === '+' ? a + b : a - b);

function tasks(review: boolean): Question[] {
  const id = `sj-upper-teens-review-${review ? 'r' : 'q'}`;
  const comparisons: [Expression, number][] = review
    ? [
        [[10, '+', 6], 17],
        [[19, '-', 4], 12],
        [[7, '+', 10], 17],
      ]
    : [
        [[10, '+', 3], 11],
        [[18, '-', 5], 15],
        [[16, '-', 10], 6],
      ];
  const chains: Chain[] = review
    ? [
        [7, '+', 3, '+', 6],
        [15, '-', 5, '-', 4],
        [13, '-', 3, '+', 5],
        [5, '+', 10, '-', 2],
      ]
    : [
        [6, '+', 4, '+', 3],
        [18, '-', 8, '-', 3],
        [14, '-', 4, '+', 2],
        [3, '+', 10, '-', 1],
      ];
  const sunny = review ? 7 : 8;
  const cloudy = review ? 5 : 6;
  const rainy = 18 - sunny - cloudy;
  const weather = review
    ? [
        '雨',
        '晴',
        '阴',
        '雨',
        '晴',
        '雨',
        '阴',
        '晴',
        '雨',
        '晴',
        '阴',
        '晴',
        '雨',
        '阴',
        '晴',
        '雨',
        '晴',
        '阴',
      ]
    : [
        '晴',
        '阴',
        '雨',
        '晴',
        '阴',
        '晴',
        '雨',
        '阴',
        '晴',
        '晴',
        '阴',
        '雨',
        '晴',
        '阴',
        '晴',
        '雨',
        '阴',
        '晴',
      ];
  return [
    ...comparisons.map(([expression, right], index): Question => {
      const left = calculate(expression);
      const sign = (() => {
        if (left > right) return 'greater';
        return left < right ? 'less' : 'equal';
      })();
      return {
        id: `${id}-compare-${index}`,
        knowledge: `sj-teens-review-compare-${index}`,
        prompt: `${expression[0]} ${expression[1]} ${expression[2]} ○ ${right}，先计算，再选择○里的符号。`,
        choices: [
          { id: 'greater', label: '>' },
          { id: 'less', label: '<' },
          { id: 'equal', label: '=' },
        ],
        rule: { kind: 'choice', value: sign },
        hint: '比较左边计算结果与右边数，不只比较左边算式第一个数。',
        explanation: `左边结果是${left}，与${right}相比，应填${(() => {
          if (sign === 'greater') return '>';
          return sign === 'less' ? '<' : '=';
        })()}。`,
      };
    }),
    {
      id: `${id}-clues`,
      knowledge: 'sj-teens-review-clues',
      prompt: review
        ? '一个整数比12大、比14小，是几？'
        : '一个整数比15大、比17小，是几？',
      rule: { kind: 'number', value: review ? 13 : 16 },
      hint: '同时满足两条线索，端点不能选。',
      explanation: review ? '只有13同时满足。' : '只有16同时满足。',
    },
    {
      id: `${id}-queue-before`,
      knowledge: 'sj-teens-review-queue-before',
      prompt: review
        ? '排队按每人一个号码从1开始，小雨排第15位。小雨前面有几人？'
        : '排队按每人一个号码从1开始，小安排第13位。小安前面有几人？',
      rule: { kind: 'number', value: review ? 14 : 12 },
      hint: '前面人数不包括自己，位次是前面人数再加1。',
      explanation: review ? '第15位前面有14人。' : '第13位前面有12人。',
    },
    {
      id: `${id}-queue-total`,
      knowledge: 'sj-teens-review-queue-total',
      prompt: review
        ? '小雨排第15位，后面还有3人，一共有几人？'
        : '小安排第13位，后面还有4人，一共有几人？',
      rule: { kind: 'number', value: review ? 18 : 17 },
      hint: '位次已经包含前面的人和自己，再加后面人数。',
      explanation: review
        ? '15 + 3 = 18，不重复加自己。'
        : '13 + 4 = 17，不重复加自己。',
    },
    {
      id: `${id}-weather-counts`,
      knowledge: 'sj-teens-review-weather-counts',
      prompt: `18天的原创天气记录：${weather.join('、')}。每项代表一天，依次填写晴、阴、雨各有几天。`,
      rule: { kind: 'steps', values: [sunny, cloudy, rainy] },
      hint: '按类别逐项标记，每项只计一次；晴、阴、雨三类合起来应为18。',
      explanation: `晴${sunny}天、阴${cloudy}天、雨${rainy}天，共18天；数量相同也要分清类别。`,
    },
    {
      id: `${id}-weather-combine`,
      knowledge: 'sj-teens-review-weather-combine',
      prompt: `18天的原创记录中，晴${sunny}天、阴${cloudy}天、雨${rainy}天。晴与阴合起来有几天？`,
      rule: { kind: 'number', value: sunny + cloudy },
      hint: '只合并题目指定的两类，雨天不重复加进去。',
      explanation: `${sunny} + ${cloudy} = ${sunny + cloudy}天。`,
    },
    ...chains.map(([start, first, a, second, b], index): Question => {
      const middle = calculate([start, first, a]);
      const end = calculate([middle, second, b]);
      return {
        id: `${id}-chain-${index}`,
        knowledge: `sj-teens-review-chain-${index}`,
        prompt: `${start} ${first} ${a} ${second} ${b}，从左到右，依次填写第一次和第二次计算后的数量。${review ? '用反向变化检查。' : '先实际摆物说明。'}`,
        visual: { kind: 'number-line', minimum: 0, maximum: 19, value: start },
        rule: { kind: 'steps', values: [middle, end] },
        hint: '第二次从中间结果开始，不回到原数。',
        explanation: `先得到${middle}，再得到${end}。`,
      };
    }),
    {
      id: `${id}-single-units`,
      knowledge: 'sj-teens-review-ten-unit-count',
      prompt: review
        ? '约定一个大标记代表10个，一个小标记代表1个。1个大标记和8个小标记代表多少个？'
        : '约定一个大标记代表10个，一个小标记代表1个。1个大标记和6个小标记代表多少个？',
      rule: { kind: 'number', value: review ? 18 : 16 },
      hint: '先看每种标记约定的单位，不能只数标记个数。',
      explanation: review
        ? '10 + 8 = 18，9个标记表示18个物品。'
        : '10 + 6 = 16，7个标记表示16个物品。',
    },
    {
      id: `${id}-meaning`,
      knowledge: 'sj-teens-review-context',
      prompt: review
        ? '编号为18的公交线路，“18”一定表示车上有18人吗？'
        : '编号为13的公交线路，“13”一定表示车上有13人吗？',
      choices: [
        { id: 'code', label: '不一定，这是线路编号，人数需要实际查看' },
        { id: 'count', label: '一定，编号就是车上人数' },
      ],
      rule: { kind: 'choice', value: 'code' },
      hint: '生活中的数字可能表示编号、数量或时间，要先看用途。',
      explanation: '线路编号不是乘客数量，不能只凭一个数字推出人数。',
    },
  ];
}

export const sujiaoTeensReviewDraft: Lesson = {
  id: 'sj-upper-teens-review',
  textbookTitle: '练习八与评价反思',
  title: '十几个物品：比较、记录与两次变化',
  page: 84,
  status: 'preparing',
  version: 1,
  goal: '在十几的综合情境中比较算式、根据两条线索猜数，理解位次与人数，分类计数，说明连续变化和不同计数单位。',
  prerequisite:
    '认识11～19，掌握本范围不进位不退位加减法和连算；准备19个物品、纸笔、编号卡与真实钟表供家长带领观察。',
  parentTip:
    '天气记录每项只代表一天，三类计数再合并指定两类。长队列用明确位次文字与实际卡片，不伪造现有五人模型。钟表观察人工带领，本课不冒充完整认识钟表。',
  steps: [
    {
      title: '先计算、再比较，线索都要满足',
      text: '10 + 3与11相比，应先算出13再比较。猜数必须同时符合两条条件，比15大比17小的整数只有16。',
      activity: '纸上写两道算式比较，再说一个范围内有唯一答案的猜数问题。',
    },
    {
      title: '排第几与前面有几人',
      text: '从1编号，每人一个号码，第13位前面有12人。若后面还有4人，总人数是13 + 4；位次已包含自己，不能再加一次。编号房间或公交线路时，也要说明数字是位置、编号还是数量。',
      activity:
        '实际摆十几张人名卡，指定一张，说前面人数、位次和后面人数，再数总数核对。',
    },
    {
      title: '记录按类别数清，再合并',
      text: '天气每条记录代表一天，逐项分为晴、阴、雨，各数一次。求晴与阴合起来时，只合并这两类。写一份原创记录表，核对分类总数与记录条数一致。',
      activity:
        '实际在纸上记录、分类并计数；也可由家长带领看日常钟表，观察活动与时刻，不把观察完成当作已掌握钟表。',
    },
    {
      title: '中间数量与自己的检查',
      text: '14 - 4 + 2先得到10，再得到12，第二次从10继续。大标记约定代表10个时，要按单位解释，而不是只数标记个数。用实物检查并说出还需要练的地方。',
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: 14 },
      activity:
        '实际演示两次变化，纸上写中间与最后数量；用1大标记代表10个演示十几，说明约定并自评。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-teens-review-manual-queue',
      knowledge: 'sj-teens-review-physical-queue',
      prompt:
        '实际摆十几张卡，每张代表一人，从1编号，任选一张，说位次、前面人数和后面人数，再数全队核对。',
      rule: { kind: 'manual' },
      hint: '先约定队头和编号方向，位次包括自己。',
      explanation: '实物方向、计数与说明人工确认，文字答对不替代操作。',
    },
    {
      id: 'sj-teens-review-manual-record',
      knowledge: 'sj-teens-review-paper-record',
      prompt:
        '在纸上制作原创18天的晴阴雨记录，分类计数、合并指定两类，检查三类合计为18。',
      rule: { kind: 'manual' },
      hint: '记录要说明是否模拟，不能把模拟天数说成真实观测。',
      explanation: '纸笔分类人工确认，不自动评价真实天气观测能力。',
    },
    {
      id: 'sj-teens-review-manual-clock',
      knowledge: 'sj-teens-review-real-clock',
      prompt:
        '由家长带领观察真实钟表，说明一天中某些活动的大致时刻；请家长解释指针。这里只记录观察，不评价完整认钟表能力。',
      rule: { kind: 'manual' },
      hint: '不把公交编号等数字直接当成时刻。',
      explanation: '真实钟表观察单独人工确认；完整钟表教学尚需另行设计。',
    },
    {
      id: 'sj-teens-review-manual-reflect',
      knowledge: 'sj-teens-review-physical-reflect',
      prompt:
        '实际摆物演示两次变化，写中间结果；约定1个大标记代表10个，表示一个十几的数，说明理由和自己还需练习的内容。',
      rule: { kind: 'manual' },
      hint: '约定单位后再计数；第二次变化从第一次结果开始。',
      explanation: '实物、纸笔、表达与反思人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoTeensReviewSources.checkedAt,
    reviewer: '公开预览范围核验与原创课程草稿',
    notes: `实际查看mainPic预览印刷第84～87页：${sujiaoTeensReviewSources.links.join('；')}。原创数字、天气记录、标记与故事；连算结合已读第83页。长队列采用明确文字与实物，未冒充队列图；钟表只做人工带领观察，尚未完整教学；不声明全第五单元、准确版权版次或正式登记完成。`,
  },
};
