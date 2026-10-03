import type { Lesson, Question, Visual } from '../learning/types';

const id = 'bnu-upper-life-six-ten';
function task(
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
    hint: '明确所数对象，逐个对应；位置要看起点和方向。',
    explanation,
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
    ...task(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function manual(suffix: string, prompt: string): Question {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '真实做过才确认；没有做或仅计划做可以跳过，网页答案不代替实做。',
  );
}
export const bnuSixTenLesson: Lesson = {
  id,
  textbookTitle: '生活中的数',
  title: '六到十的表示、书写与顺倒数',
  page: 19,
  version: 1,
  status: 'available',
  goal: '逐个表示6～10，联系物品、标记和数字，实际描写6～10，顺数与倒数并明确数路起点。',
  prerequisite: '已逐个数1～5并认识0；无需先会列加减算式或学习数位。',
  parentTip:
    '对应北师大上册19～22页。本站纸卡、点图和数路例子原创，不复制文具与鸡蛋原画。书写对照合法原书示范，由家长核对实际纸面练习；屏幕字体不是笔顺动画，输入10不表示已经写过。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方原书0061印刷19～22页已实际读取：6～9文具及多种表示、按数补画与描写、两端数路、9添1认识10、十根小棒与手脚表示、10书写及从10倒数到1。ISBN和印次未知。',
  },
  steps: [
    {
      title: '六到九逐个点数',
      text: '选一类已有纸卡，每张只数一次，从1接着数到最后。6、7、8、9分别表示不同数量，不由卡片颜色或摆放间距猜数。',
      visual: { kind: 'count', count: 6 },
      activity: '实际分别摆6、7、8、9张纸卡并逐个核对。',
    },
    {
      title: '物品、标记和数字对应',
      text: '例如7张卡可用7根已有小棒或7个自己画的标记表示。已有4个标记，想表示6个时继续补画到6个，再数全部；不要把“再画几个”和“共有几个”混用。',
      visual: { kind: 'count', count: 7 },
      activity: '实际为6～9各画对应数量的标记，并对照原书描写6～9。',
    },
    {
      title: '九后再添一个认识十',
      text: '已有9张纸卡，再添一张，逐个从头数共有10张。可以用10根小棒或双手的10个手指对应核对；本课先认识数量，不把一捆自动教成十位规则。',
      visual: { kind: 'count', count: 10 },
      activity: '实际摆9张再添一张，核对10个物品和10个标记。',
    },
    {
      title: '写十与数字个数',
      text: '表示数量十写作10，由1和0两个数字组成，但表示10个物品。对照原书实际描写10，注意两个数字顺序；这与只有1个物品或一个也没有不同。',
      activity: '实际描写10并和对应物品核对，再练写0～9。',
    },
    {
      title: '顺数、倒数与数路',
      text: '从1顺数到10，再从10倒数到1；本次明确到1就停，不自行把任务改到0。本站数路从左到右按1～9排，每相邻两个位置一步，目标是6。从1起走5步，从9起走3步，后者较近；只比较位置间的步数，不猜谁走得快。',
      activity: '实际顺倒数，并在自画数路上从两端走到6，每次只走相邻一格。',
    },
    {
      title: '回看原书并说方法',
      text: '实际回看19～22页，将文具表示、按数补画、描写6～9、数路、鸡蛋与小棒表示10、写10以及顺倒数分别做。原书图与本站标记分开；古诗中的数字还需看语句用途，不自动当实际点数。',
      activity: '实际核对原书任务，说清一次点数或补画的方法；未做保留待做。',
    },
  ],
  questions: [
    ...[6, 7, 8, 9, 10].map((count, index) =>
      task(
        `q${index + 1}`,
        '只数本图的纸卡标记，共有几张？',
        { kind: 'number', value: count },
        `每个标记对应一张纸卡，逐个核对为${count}张。`,
        { kind: 'count', count },
      ),
    ),
    task(
      'q6',
      '表示数量十的“10”，写了几个数字？',
      { kind: 'number', value: 2 },
      '写了1与0两个数字；表示物品数量10是另一个问题。',
    ),
    task(
      'q7',
      '9张卡旁边实际再放1张，逐个数全部，共有几张？',
      { kind: 'number', value: 10 },
      '从头逐个核对得到10张，本题不要求列加法。',
    ),
    task(
      'q8',
      '甲、乙、丙、丁、戊、己从左到右排一行，丁从右数第几张？',
      { kind: 'number', value: 3 },
      '从右起己1、戊2、丁3，不能沿用从左数的位置。',
    ),
    choice(
      'q9',
      '数字“10”表示10根小棒，字形的个数与小棒数量是什么关系？',
      '分别是两个数字和十根小棒',
      ['分别是两个数字和十根小棒', '都只有一根', '小棒一个也没有'],
      '区分数字写法与实际物品数量。',
    ),
    task(
      'q10',
      '1、2、3、4、5、6、7、8、9接着顺数，下一个数是几？',
      { kind: 'number', value: 10 },
      '从9接着顺数是10。',
    ),
    choice(
      'q11',
      '本站1～9数路，每次走相邻一格到6。从1起需5步，从9起需3步，哪一端较近？',
      '从9起',
      ['从1起', '从9起', '一样近'],
      '3步少于5步，比较的是位置间步数，未给速度不能推时间。',
    ),
    manual(
      'actual-represent',
      '实际为6、7、8、9分别摆物品并画同样多标记，每组逐个核对；做过再确认。',
    ),
    manual(
      'actual-write-six-nine',
      '对照合法原书示范，在纸上实际描写6～9，并按指定总数补画标记；做过再确认。',
    ),
    manual(
      'actual-ten',
      '实际摆9张再添1张，用10根小棒或10个手指对应核对；做过再确认。',
    ),
    manual(
      'actual-write-ten',
      '对照原书在纸上实际描写10和0～9，核对数字顺序；做过再确认。',
    ),
    manual(
      'actual-countdown',
      '实际从1数到10，再从10倒数到1，明确到1就停；做过再确认。',
    ),
    manual(
      'actual-path',
      '实际自画1～9数路，从1和9分别走相邻格到6，并比较所走步数；做过再确认。',
    ),
    manual(
      'actual-book',
      '实际回看合法原书19～22页，分别做文具/小棒表示、补画、描写和数路任务；做过再确认。',
    ),
    task(
      'reflection',
      '记录一次自己点数、补画或顺倒数的实际方法；没做可写待做或疑问。',
      { kind: 'reflection' },
      '开放记录不评分，不从文字推断已经掌握。',
    ),
  ],
  reviewQuestions: [
    task(
      'review-count',
      '复习只数本图的圆点，有几个？',
      { kind: 'number', value: 8 },
      '逐一对应有8个圆点。',
      { kind: 'count', count: 8 },
    ),
    task(
      'review-next',
      '从6开始顺数：6、7、8，下一个数是几？',
      { kind: 'number', value: 9 },
      '本题起点改变，从8接着是9。',
    ),
    choice(
      'review-writing',
      '画了10个圆点，另写数字10。问圆点数量应回答什么？',
      '10个圆点',
      ['10个圆点', '2个圆点', '0个圆点'],
      '所问是圆点数量，不是1和0两个数字。',
    ),
    task(
      'review-order',
      '甲、乙、丙、丁、戊、己从左到右排，戊从左数第几张？',
      { kind: 'number', value: 5 },
      '起点改为左端，对象改为戊，逐个数到第5。',
    ),
  ],
};
