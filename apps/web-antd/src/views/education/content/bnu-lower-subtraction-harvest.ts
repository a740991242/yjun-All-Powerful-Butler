import type { Lesson, Question } from '../learning/types';

const id = 'bnu-lower-subtraction-harvest';
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
    explanation,
    hint: '先读清已知、所求与单位，再选择算法；拆原数与拆减数分开，不把未知当0。',
  };
}
const steps = (
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
) => task(suffix, prompt, { kind: 'steps', values }, explanation);
const number = (
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
) => task(suffix, prompt, { kind: 'number', value }, explanation);
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
const actual = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际做过再确认；纸笔、摆棒、计数器和交流分别核对，网页答对不自动确认。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '自己的原话不评分；实际尝试与未来计划分清，未做如实记录。',
  );

/** Page 41 implementation; registration and browser verification are separate. */
export const bnuLowerSubtractionHarvestLesson: Lesson = {
  id,
  textbookTitle: '整理与复习：我的收获',
  title: '我的收获：退位减法、生活问题与问题银行',
  page: 41,
  version: 1,
  status: 'available',
  goal: '比较认识植物的数量，分别说明两种退位方法与换十，提出完整减法问题并探索新原数。',
  prerequisite: '理解多与少、整体与部分，会计算20以内退位减法。',
  parentTip:
    '依据公开扫描第41页，原图外链不打包。13与6表示植物种数，不是盆数。帽与手套的自主问题开放；本站每帽配一副手套是额外明示条件，不冒原题唯一情境。计数器换十后0个十/13个一不是13十，表示数量仍13。25−9是原问题银行拓展，原数超20；不把拓展结果冒20以内任务。第42～43页不由本课代替。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描第41页方法、情境与问题银行核对',
    notes: '仅本页原创教学实现，原开放提问不限本站示例；未声称最终教师审校。',
  },
  steps: [
    {
      title: '比较植物种数',
      text: '小军认识13种植物，小宁认识6种。把两人的种数逐个配对，13−6=7，所以小军比小宁多认识7种；反过来说小宁比小军少认识7种。题目只给认识的种数，没有给双方具体种类名单，不能据此断言两人共同认识6种或共认识19种不同植物。',
      visual: { kind: 'comparison-rows', counts: [13, 6] },
      activity: '实际画两排符号配对，写式和答句，说明“种”与“盆”不同。',
    },
    {
      title: '拆减数，先到十',
      text: '原13−6把减数6分成3和3：13−3=10，再10−3=7。原数13不被分成3和3；数线两次向左各3，从13到10再到7。13是起点，不是第一次减后的结果。原小棒分两次拿3，也是这个路径。',
      activity:
        '实际摆13根小棒两次各取3，并在纸面数线上画13→10→7，说每一步剩余。',
    },
    {
      title: '拆原数，再换十观察',
      text: '另一条原方法把13分成10和3，10−6=4，4＋3=7。拆的是原数13，不是把6分成10和3。原计数器先1个十、3个一；把十换成10个一后是0个十、13个一，数量仍13。再从13个一拿6个一，剩7个一。材料珠子或标记个数与表示数量分别说，不能保留一个十又另添13个一。',
      visual: { kind: 'place-value', value: 13 },
      activity: '实际分别说明拆原数路径与计数器换十过程，逐步核对总量不变。',
    },
    {
      title: '同一减法，对应不同问题',
      text: '原帽手套图给13顶帽、6副手套，停车图给13个停车位、6辆车。自主提出能用13−6解决的完整问题，说明已知、所求和单位，不限本站例子。本站明示每顶帽配一副手套且6副已配好，可问还差几副手套，答案7副；停车图若6辆各占一个车位，可问还有7个空车位。原图未说明帽子售出或损坏，不能补造6顶被卖走。',
      activity:
        '实际分别用帽手套图、停车图提出问题并列式解答，注明你补充的条件及单位。',
    },
    {
      title: '问题银行与未来计划',
      text: '原问题银行问25−9是否也能用学过的方法。25已经超过20。本站演示先到20：把9分5和4，25−5=20，20−4=16；也可拆25为20和5，20−9=11，再11＋5=16。原开放问题允许别的合理算法，须实际说明和核对，不因原数较大就说不能算。你还可以提出自己的完整问题；没给小宁认识几种的题无法确定差，不填0。',
      activity:
        '实际选择一种合理方法解释25−9；提出自己的新问题，保存原话，并把下一次打算单独记录。',
    },
  ],
  questions: [
    steps(
      'plant-counts',
      '依次填写小军、小宁认识的植物种数与小军多认识的种数。',
      [13, 6, 7],
      '13−6=7种，不是把种数相加求差。',
    ),
    number(
      'reverse-difference',
      '小宁比小军少认识几种植物？',
      7,
      '同一差量7，方向换了不能变成负数。',
    ),
    choice(
      'unit',
      '原植物问题数量的单位是什么？',
      '种',
      ['种', '盆', '片'],
      '记录认识的种类数量，不是盆栽件数。',
    ),
    choice(
      'shared-species',
      '只给两人分别认识13种和6种，没有名单，能断言共同认识6种吗？',
      '不能，需要两人的具体名单',
      ['能，必定6种', '不能，需要两人的具体名单', '能，必定19种'],
      '同种数不等于相同种类，共同和不重复合计不能凭两个数确定。',
    ),
    steps(
      'split-part',
      '原拆减数路径：6分几和几，13先减前一部分到几，再减后一部分剩几？依次填四项。',
      [3, 3, 10, 7],
      '6=3＋3，13−3=10，10−3=7。',
    ),
    steps(
      'split-whole',
      '原拆原数路径：13分几和几，第一部分减6剩几，两部分合起来剩几？依次填四项。',
      [10, 3, 4, 7],
      '13=10＋3，10−6=4，4＋3=7。',
    ),
    steps(
      'counter-initial',
      '换十前，按个十、个一、表示的总数量填写。',
      [1, 3, 13],
      '一个十和三个一表示13，四个位置标记不是总数量4。',
    ),
    steps(
      'counter-exchange',
      '只把原一个十换成十个一，按个十、个一、表示总数量填写。',
      [0, 13, 13],
      '分组改变，总数量不变；13个一不等于规范个位数字13。',
    ),
    number(
      'counter-remaining',
      '换成13个一后拿走6个一，还剩几个一？',
      7,
      '13−6=7个一。',
    ),
    number(
      'glove-example',
      '本站补充条件：13顶帽每顶配一副手套，现有6副且都已配好，还差几副？',
      7,
      '13−6=7副，额外配对条件已经明示，不冒原题唯一问题。',
    ),
    steps(
      'parking',
      '13个车位，6辆车各占一位，依次填总车位、占用位、空位。',
      [13, 6, 7],
      '13−6=7个空位，不是7辆车。',
    ),
    number(
      'zero-empty',
      '本站新条件：13个车位，13辆车各占一位，还空几个车位？',
      0,
      '13−13=0，完整条件的0不同于缺信息。',
    ),
    choice(
      'unknown',
      '只知道小军认识13种，没给小宁种数，能确定多认识几种吗？',
      '不能，还需小宁认识的种数',
      ['能，缺失就当0', '不能，还需小宁认识的种数', '能，沿用6种'],
      '不能借上一题的数据或把未知改为0。',
    ),
    steps(
      'twenty-path',
      '本站先到20演示25−9：9分几和几，25先减前一部分到几，再减后一部分剩几？',
      [5, 4, 20, 16],
      '25−5=20，20−4=16；不是25−5−9。',
    ),
    steps(
      'twenty-split',
      '本站拆原数演示25−9：25分20和几，20−9得几，再合起来得几？',
      [5, 11, 16],
      '25=20＋5，20−9=11，11＋5=16。',
    ),
    actual(
      'actual-plants',
      '实际画植物种数比较符号，配对、列式、写答句并解释单位。',
    ),
    actual('actual-sticks', '实际摆13根小棒，分两次各取3，完整说每次剩余。'),
    actual('actual-line', '实际画13→10→7数线，两次各减3，核对起点与落点。'),
    actual(
      'actual-whole',
      '实际用自己的话说明拆原数为10和3的减法过程，与拆6分开。',
    ),
    actual(
      'actual-counter',
      '实际摆画计数器或数位模型，分别核对换前、换后、拿6后的分组和数量。',
    ),
    actual(
      'actual-hats',
      '实际用原帽手套信息提出一个完整13−6问题并解答，注明补充条件，允许不同合理问题。',
    ),
    actual(
      'actual-parking',
      '实际用原停车信息提出完整问题并列式、写单位和答句。',
    ),
    actual(
      'actual-twenty',
      '实际说明25−9的一种合理方法并核对，未做不自动确认。',
    ),
    actual(
      'actual-own-question',
      '实际提出并尝试解决自己的完整新问题，说明条件、所求、算式与单位；未完成如实记录。',
    ),
    record(
      'own-question',
      '记录你自己的完整数学问题、已知、所求与尝试，允许不同于本站例子。',
    ),
    record('discovery', '记录你真正解释过的一种退位方法及自己的发现。'),
    record(
      'difficulty',
      '记录目前尚不确定的地方及已经尝试的帮助；待做如实记。',
    ),
    record('plan', '记录下一次准备怎样画、摆或解释；计划不当已经完成。'),
  ],
  reviewQuestions: [
    number(
      'review-plants',
      '新条件：小明认识17种，小红认识8种，小红比小明少认识几种？',
      9,
      '17−8=9种。',
    ),
    steps(
      'review-part',
      '新指定路径16−7先到10：7分几和几，中间几，最后几？',
      [6, 1, 10, 9],
      '16−6=10，10−1=9。',
    ),
    number(
      'review-parking',
      '新条件：15个车位，9辆车各占一位，空几个？',
      6,
      '15−9=6个，不照搬原7。',
    ),
    steps(
      'review-counter',
      '新12个一，换成规范十与一分组：依次填个十、个一、总数量。',
      [1, 2, 12],
      '一十两一还是12，不能保留12个一又添十。',
    ),
    choice(
      'review-unknown',
      '新条件：只知道两人认识的种数相差7，没有各自种数，能断言一定13种和6种吗？',
      '不能，可能是不同的两组数量',
      ['能，只有13和6', '不能，可能是不同的两组数量', '能，缺失的一组填0'],
      '14与7、15与8等也差7，不能唯一反推。',
    ),
  ],
};
