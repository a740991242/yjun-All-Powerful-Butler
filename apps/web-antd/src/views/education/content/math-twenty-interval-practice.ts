import type { Question } from '../learning/types';

import { required } from '../learning/required';

const position = 'mu-twenty-positions';
export function twentyIntervalQuestions(review: boolean): Question[] {
  const question = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${position}-${review ? 'r' : 'q'}-interval-${key}`,
    knowledge: `${position}-interval-${key}`,
    prompt,
    rule,
    hint: '按题目起点与方向逐个数；省略的位置仍占编号，原当天不算已过去的一天。',
    explanation,
  });
  const ascending = review ? 1 : 0;
  const descending = review ? 19 : 20;
  const hiddenStart = review ? 6 : 5;
  const target = review ? 14 : 11;
  const blanks = new Set([1, 3, 4, 6, 8]);
  const strip = (key: string, first: number, step: number): Question => ({
    ...question(
      key,
      `自制数卡从左到右连续排列，每个数都比前一个${step === 1 ? '大1' : '小1'}。按字母次序填全部五个空格。`,
      { kind: 'steps', values: Array.from(blanks, (i) => first + step * i) },
      `完整数列依次为${Array.from({ length: 9 }, (_, i) => first + step * i).join('、')}。A～E依次填${Array.from(blanks, (i) => first + step * i).join('、')}；按同一方向逐格代回，不能只检查第一个空。`,
    ),
    visual: {
      kind: 'number-strip',
      values: Array.from({ length: 9 }, (_, i) =>
        blanks.has(i) ? null : first + step * i,
      ),
    },
  });
  const days = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ];
  const weekday = review ? 5 : 4;
  return [
    strip('ascending', ascending, 1),
    strip('descending', descending, -1),
    {
      ...question(
        'hidden-start',
        `全排从左第1张开始连续编号。只展示第${hiddenStart}～20张，前${hiddenStart - 1}张省略。全排第${target}张，是可见部分从左第几张？`,
        { kind: 'number', value: target - hiddenStart + 1 },
        `可见第1张的全排编号是${hiddenStart}，从它数到编号${target}，依次为${Array.from({ length: target - hiddenStart + 1 }, (_, i) => hiddenStart + i).join('、')}，共${target - hiddenStart + 1}张。问可见部分第几张，不是全排编号${target}；被省略的前${hiddenStart - 1}张不加入可见部分计数。`,
      ),
    },
    {
      ...question(
        'weekday',
        `原创活动原定${days[weekday]}，推迟3天。逐日数过3天后是星期几？原当天不算已经过去的一天。`,
        { kind: 'choice', value: required(days[(weekday + 3) % 7]) },
        `从${required(days[weekday])}起，过1天是${required(days[(weekday + 1) % 7])}，过2天是${required(days[(weekday + 2) % 7])}，过3天是${required(days[(weekday + 3) % 7])}。星期日之后是星期一，原当天不算已过去的一天。`,
      ),
      choices: days.map((label) => ({ id: label, label })),
    },
  ];
}
export const twentyIntervalSourceTasks = [
  [
    'find-pages',
    '实际回第78页做一做第1项，原要求四个印刷页7、12、18、20全部在自己的数学书找到并逐一核对页码；电子阅读器页序不是印刷页码，本站旧四个原创找页数不能代替原四页。',
  ],
  [
    'connect-all',
    '实际回第78页做一做第2项，按原图1～20依次连接全部点，核对已有示例线与每段顺序，不跳过、重复或把图旁文字算点。原图与本站自画20点分别记录；缺原书可待做。',
  ],
  [
    'both-strips',
    '实际回第78页做一做第3项，把原正序和倒序两行所有空格分别填完，再逐格检查方向、起点与相邻数；不能只做一行或用本站原创九格题代替原两行。',
  ],
  [
    'queue-example',
    '实际回第82页原排队例题，先记录两个编号及所问的“之间”，再画完整位置排并划去两本人，列出中间位置、解答并回看。被植物遮住的人不当没人，图中人数与编号条件分清。',
  ],
  [
    'queue-play',
    '实际回第83页做一做原滑梯排队题，按原人物编号、排队方向与转弯处读条件，独立画图并检查两人之间不含本人；不要凭图左右或只数露出的人猜，也不把转弯当更换编号起点。',
  ],
  [
    'floors',
    '实际回第84页练一练第4项，两家同一楼的原楼层之间有几层，完整列出中间楼层并说明两家所在层不算；原题和本站原创4/10楼示例分别记录，不实际去楼梯开展活动。',
  ],
  [
    'delay-days',
    '实际回第84页练一练第5项，按原星期一及推迟3天条件逐日记录，原当天不作已过去一天，核对新星期；本站其它星期的变式不代替原题。',
  ],
  [
    'reading-pages',
    '实际回第84页练一练第8项，根据原今天第10页到第14页及明天从15开始的条件，逐页核对今天包含首尾的页数；明天起点不加进今天，保存算式或编号说明。',
  ],
  [
    'bus-stops',
    '实际回第86页练一练第3项，在原公交图标清上车和下车两个位置，完整圈出仅中间停靠的站并核对数量；线路首站不是必然的上车站，原条件与本站6/12站示例分开。',
  ],
] as const;
export const twentyBundleRemainingTasks = [
  [
    'three-compositions',
    '实际回第76页做一做，原三幅小棒图全部分别填十和一或几个十，核对每捆10根、散根与0；两捆总根数不等于捆数。纸面三个组成记录与本站原创材料分别保留。',
  ],
  [
    'estimate-original',
    '实际回第86页练一练第1项，原茄子和松果两图各先保留自己的估计，再逐个数清并各写完整十和一组成；数清后不改原估计，也不按估计差距评分。两图与本站两把真实材料分别记录。',
  ],
] as const;
export const twentyLinksRemainingTasks = [
  [
    'three-equations',
    '实际回第81页做一做第1项，按同一原小棒图的十和一两部分填完整一个加法、两个减法共三式，逐式说明所求并代回检查；不从本站14根示例抄到原图。',
  ],
  [
    'candy-story',
    '实际回第81页做一做第2项左侧原糖果图，明确已知堆内数量与堆外数量、问的是全部，填完整算式和颗单位，画或数图回看；本站原创合计故事不自动确认原题。',
  ],
  [
    'pencil-story',
    '实际回第81页做一做第2项右侧原蜡笔图，先辨总量括号包括盒内和盒外，再以已知总量、盒外部分求盒内数量，填完整算式与支单位；不能把总量当盒内再加外面，原题独立保存。',
  ],
  [
    'one-to-one',
    '实际回第83页练一练第2项，在原松果和松鼠两排逐个一一连线后，核对未配对的松果及问的多几个；同图间距与物体面积不作数量证据，未配对与总数量分清。',
  ],
] as const;

export function twentyNeighborQuestions(review: boolean): Question[] {
  const build = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${position}-${review ? 'r' : 'q'}-neighbor-${key}`,
    knowledge: `${position}-neighbor-${key}`,
    prompt,
    rule,
    hint: '相邻数沿指定方向走一格；比较接近谁要分别数两边的间隔，起点不算一个间隔。',
    explanation,
  });
  const larger = review ? 16 : 14;
  const smaller = review ? 13 : 18;
  const nearTen = review ? 13 : 12;
  const nearTwenty = review ? 17 : 18;
  const nearest = (key: string, value: number, result: string): Question => ({
    ...build(
      key,
      `在每格表示1的数轴上，${value}更接近10还是20？`,
      { kind: 'choice', value: result },
      `${value}到10有${value - 10}个间隔，到20有${20 - value}个间隔。比较两边的间隔数，少的一边更近；${value}更接近${result}。`,
    ),
    choices: ['10', '20', '同样近'].map((label) => ({ id: label, label })),
    visual: { kind: 'number-line', minimum: 0, maximum: 20, value },
  });
  return [
    build(
      'adjacent',
      `比${larger}大1的数、比${smaller}小1的数各是多少？依次填两个空。`,
      { kind: 'steps', values: [larger + 1, smaller - 1] },
      `从${larger}向大的方向走1格是${larger + 1}，从${smaller}向小的方向走1格是${smaller - 1}。两空的起点与方向不同，要分别核对。`,
    ),
    nearest('near-ten', nearTen, '10'),
    nearest('near-twenty', nearTwenty, '20'),
    review
      ? {
          ...build(
            'equal',
            '15到10、15到20各有几个单位间隔？依次填，并比较两边。',
            { kind: 'steps', values: [5, 5] },
            '从15到10走5个单位间隔，从15到20也走5个单位间隔；两边相等，15离10和20同样近。数的是间隔，不是连起点的数字个数。',
          ),
          visual: { kind: 'number-line', minimum: 0, maximum: 20, value: 15 },
        }
      : {
          ...build(
            'equal',
            '在每格表示1的数轴上，15更接近10还是20？',
            { kind: 'choice', value: '同样近' },
            '15到10和到20都要走5个单位间隔；两边一样多，所以同样近，不能强选其中一端。',
          ),
          choices: ['10', '20', '同样近'].map((label) => ({
            id: label,
            label,
          })),
          visual: { kind: 'number-line', minimum: 0, maximum: 20, value: 15 },
        },
  ];
}
export const twentyNeighborSourceTasks = [
  [
    'two-adjacent-blanks',
    '实际回教材第78页数轴下第（1）项，两空分别按原给定数与“大1/小1”方向填完，再沿原等距数轴逐格核对；只回答一个相邻数或本站原创两空，不代替原两个空。',
  ],
  [
    'near-ten-twenty',
    '实际回教材第78页第（2）项，按原给定数分别数到10和20的单位间隔，写下两边间隔数、比较并说明更接近谁。原题活动与本站近两端/同样近的变式分别记录；数间隔不把起点多算1，未读或未做可待做。',
  ],
] as const;
