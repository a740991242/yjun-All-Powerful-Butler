import type { Lesson, Question, Visual } from '../learning/types';

const id = 'bnu-upper-five-add';
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
    hint: '看清两部分、所数对象及是否已经到来，再核对全部数量。',
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
    '真实做过才确认；没有做或仅计划做可以跳过，网页答对不代替实际活动。',
  );
}
export const bnuFiveAddLesson: Lesson = {
  id,
  textbookTitle: '5以内数加与减',
  title: '五以内合并、增加与加法含义',
  page: 29,
  version: 1,
  status: 'available',
  goal: '明确两部分与全部，区分同时存在和后来增加，逐个数或接着数核对5以内的和，并读写加法。',
  prerequisite: '能逐个点数0～5并明确所数对象；先理解情境，不要求先背口诀。',
  parentTip:
    '对应北师大上册29～31页。本站纸卡、分组和停车例子原创，不复制文具、熊猫、花鸟与运动原画。描写符号、摆物与原书完整读图单列实际任务；静态两组不冒刚刚到来，未来计划不当已经增加。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷29～31页已实际查看：两手物品/两类熊猫的总数、逐个与接着数、加号读式、图形表示、静态合并与车辆/鸟到来、用同式说不同故事、按情境列式及每次多一的序列。ISBN和印次未知。',
  },
  steps: [
    {
      title: '两部分合起来看全部',
      text: '本站第一组1张纸卡、第二组3张，求全部卡片要把两组都逐个数，得到4张。第一组数量、第二组数量和全部数量是三个不同问题，不能只数一组。',
      visual: { kind: 'count-groups', groups: [1, 3] },
      activity: '实际摆两组已有纸卡，分别报每组数与总数。',
    },
    {
      title: '逐个数和接着数',
      text: '3张与2张合在一起，可以从1把全部数完；也可以先明确已有3张，再接着数4、5。接着报出的两个数对应另外2张，最后报5是全部数量，不能只把接着数的次数2当总数。',
      visual: { kind: 'count-groups', groups: [3, 2] },
      activity: '实际用同一两组，分别从头数和接着数核对。',
    },
    {
      title: '加号、等号与算式',
      text: '1张与3张合起来共有4张，可以写1+3=4，读作一加三等于四。+表示这里合并两部分，=表示两边数量相等；两个数指卡片部分，4指全部。对照合法原书实际练写符号，不由屏幕字体代替笔顺示范。',
      activity: '实际写读一个加法算式，指明两个部分与全部。',
    },
    {
      title: '静态合并与后来增加',
      text: '两组一直在桌面上，是同时存在的两部分。若原有2张，后来实际又放入1张，才是增加后的3张。计划稍后放入时，当前仍只有2张，不能把尚未发生的增加当完成。',
      visual: { kind: 'count-groups', groups: [2, 1] },
      activity: '实际分别摆静态两组和后来添入情境，说明时间条件。',
    },
    {
      title: '同式可以说明不同故事',
      text: '1+4=5可以说明一组1张卡和另一组4张卡合并，也可以说明已有1张再实际添4张。两种故事都要明确同一计数单位。将两个静态部分的叙述顺序互换，总数仍需逐个核对，不把换顺序说成新增物品。',
      activity: '实际自画两种条件清楚的故事，核对图与算式。',
    },
    {
      title: '原书任务与每次多一',
      text: '实际回看29～31页，完成两手/熊猫总数、花果与图形表示、车辆和鸟到来、运动情境、同式说图及苹果数列。本站纸卡与原图分开。本站另一数列1、2、3、4、5每次多1；比较相邻两次，不把总数5当每次增加量。',
      activity: '实际完成原图任务，并摆每次添一张的纸卡数列。',
    },
  ],
  questions: [
    task(
      'q1',
      '第一组1张、第二组3张。只问全部纸卡共有几张？',
      { kind: 'number', value: 4 },
      '两组一起逐个数为4张。',
      { kind: 'count-groups', groups: [1, 3] },
    ),
    task(
      'q2',
      '已明确有3张，另外2张对应接着报4、5。全部共有几张？',
      { kind: 'number', value: 5 },
      '最后报5表示全部，不是只问另外2张。',
    ),
    task(
      'q3',
      '同图只问第一组有几张纸卡？',
      { kind: 'number', value: 1 },
      '第一组一张，与全部四张是不同问题。',
      { kind: 'count-groups', groups: [1, 3] },
    ),
    task(
      'q4',
      '图中两组各有2张，只数全部纸卡共有几张？',
      { kind: 'number', value: 4 },
      '两个部分分别2张，全部4张。',
      { kind: 'count-groups', groups: [2, 2] },
    ),
    task(
      'q5',
      '新图依次填写第一组、第二组、全部的数量。',
      { kind: 'steps', values: [2, 1, 3] },
      '按所求顺序分别2、1、3，不把组数2当全部物品数。',
      { kind: 'count-groups', groups: [2, 1] },
    ),
    choice(
      'q6',
      '1张和3张合起来求全部，1与3之间应选哪个运算符号？',
      '+',
      ['+', '−'],
      '这里合并两部分，用加号。',
    ),
    task(
      'q7',
      '原停车区有2辆车，后来1辆车已经进入同一区内。现在共有几辆？',
      { kind: 'number', value: 3 },
      '到来已经发生，现在是2辆与新增1辆合起来。',
    ),
    task(
      'q8',
      '两组仍是1张与3张，只改先说3张再说1张，全部共有几张？',
      { kind: 'number', value: 4 },
      '叙述顺序变化未添物品，总量不变。',
    ),
    choice(
      'q9',
      '已有1张，计划稍后再添4张，尚未放入。能把当前数量说成5张吗？',
      '不能',
      ['能', '不能'],
      '未来计划不是已经增加，要看当前实际数量。',
    ),
    task(
      'q10',
      '本站纸卡数量依次1、2、3、4，继续按每次多一，下次共有几张？',
      { kind: 'number', value: 5 },
      '下一次总数5，不能与每次增加量混用。',
    ),
    task(
      'q11',
      '本站数量1、2、3、4、5，相邻每次多几张？',
      { kind: 'number', value: 1 },
      '每次只多1张，总数5不是本题所求。',
    ),
    manual(
      'actual-count',
      '实际摆3张与2张纸卡，分别从头数全部和从3接着数，核对同一总数；做过再确认。',
    ),
    manual(
      'actual-write',
      '对照合法原书实际写读加号、等号和一个5以内加法，指明部分与全部；做过再确认。',
    ),
    manual(
      'actual-story',
      '实际自画两个条件清楚、同一单位的合并或增加故事，并写算式核对；做过再确认。',
    ),
    manual(
      'actual-time',
      '实际分别摆同时存在的两组和后来添入的情境，说清时间条件；做过再确认。',
    ),
    manual(
      'actual-book',
      '实际回看合法原书29～31页，做总数、图形表示、车辆/鸟到来、运动情境、同式说图及苹果数列；做过再确认。',
    ),
    manual(
      'actual-sequence',
      '实际摆1～5张纸卡的变化，每次只添1张，分别说当前总数和增加量；做过再确认。',
    ),
    task(
      'reflection',
      '记录一次自己数全部或接着数的实际方法；没做可写待做或疑问。',
      { kind: 'reflection' },
      '开放记录不评分，不从文字自动评定已经掌握。',
    ),
  ],
  reviewQuestions: [
    task(
      'review-total',
      '复习新图第一组2张、第二组3张，全部纸卡共有几张？',
      { kind: 'number', value: 5 },
      '新两个部分合并为5张。',
      { kind: 'count-groups', groups: [2, 3] },
    ),
    task(
      'review-arrival',
      '新情境原停车区1辆，后来2辆已进入同一区。现在共几辆？',
      { kind: 'number', value: 3 },
      '改变原有与新增量，进入已经发生。',
    ),
    task(
      'review-continue',
      '新题已有2张，再添2张，接着报3、4。全部几张？',
      { kind: 'number', value: 4 },
      '已有与新添共同计入，最后报4。',
    ),
    task(
      'review-growth',
      '新数列从0开始：0、1、2，按每次多一，下次总数几？',
      { kind: 'number', value: 3 },
      '起点和所求已改，继续到3。',
    ),
  ],
};
