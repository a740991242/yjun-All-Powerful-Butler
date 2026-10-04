import type { ArithmeticGridVisual, Lesson, Question } from '../learning/types';

import { bnuLowerSubtractionSource as source } from './bnu-lower-subtraction-source';

const id = 'bnu-lower-subtraction-table';
const table: ArithmeticGridVisual = {
  kind: 'arithmetic-grid',
  mode: 'bnu-subtract',
  hidden: source.blankPositions.map(([r, c]) => [r, c]),
};
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
    hint: '先明确找卡的条件或表中的行列，再逐项核对；得数、原数和减数不是同一个量。',
  };
}
const steps = (
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
) => task(suffix, prompt, { kind: 'steps', values }, explanation);
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
    '实际完成再确认；未做如实跳过，网页答对不自动确认纸卡、写表或交流。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '保留自己的原话，不评分；发现、困难与未来计划分别记录。',
  );
const cardText = source.cards
  .map(([whole, part], i) => `${i + 1}号 ${whole}−${part}`)
  .join('；');
const cards = source.cards.map(([whole, part], i) => ({
  id: String(i + 1),
  label: `${i + 1}号 ${whole}−${part}`,
}));
function findCards(
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
): Question {
  return {
    ...task(
      suffix,
      `${prompt}多选，找全，不合条件的不选。编号：${cardText}。`,
      { kind: 'set', values: values.map(String) },
      explanation,
    ),
    choices: cards,
  };
}
export const bnuLowerSubtractionTableLesson: Lesson = {
  id,
  textbookTitle: '做个减法表',
  title: '做个减法表：找全卡片、补表与观察规律',
  page: 40,
  version: 1,
  status: 'available',
  goal: '区分按得数、被减数、减数分类，完整补齐减法表，计算45式并明确横竖斜观察的条件。',
  prerequisite: '会计算20以内退位减法，能读懂整体、减去和剩余。',
  parentTip:
    '依据公开扫描第40页，原图外链不打包。17张卡含重复算式，本站编号保留每张身份；左侧外卡为13−6。原表没有文字列头，本站添加原数/得数辅助坐标，按原版排列，不能把得数列当减数列。补式子与算得数分开，表外不是0。原自由排序和发现开放，本站明确方向示例不冒唯一发现。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描第40页全页与纸卡放大核对',
    notes:
      '三类找卡、原19空格和45式、横竖明确斜向观察分别覆盖；最终教师审校未核验。',
  },
  steps: [
    {
      title: '给每张卡一个身份',
      text: `原图桌面和手中一共17张纸卡。本站编号只是帮助定位：${cardText}。同样的16−9有2号和15号，两张卡都保留。先各算得数，不把一张卡的两个数相加，也不把重复卡合成一张。`,
      activity: '实际阅读原图，按本站编号抄出17张纸卡，各算得数并逐张核对。',
    },
    {
      title: '同样的得数，不同的减法',
      text: '找得数7：1、2、5、8、14、15号，共六张。11−4、16−9、12−5、14−7、13−6都等于7，但两个16−9仍是不同卡。找全后可按被减数从小到大排，也可以说明别的合理排法；原题不指定唯一顺序。',
      activity: '实际找全六张得数7的卡，再选择一种标准排列并说明。',
    },
    {
      title: '换条件，要恢复所有卡',
      text: '重新放回全部17张。12减几找5、11、16、17号；减9找2、3、4、6、9、13、15号。前一个条件固定被减数12，后一个条件固定减数9；不是找得数12或9。每次换条件都从完整卡组重找，不只在前一组里继续挑。',
      activity:
        '实际分别恢复全部卡，按被减数12和减数9找全并排列，解释两种标准。',
    },
    {
      title: '完整补齐十九处式子',
      text: '按原第40页从左到右、从上到下，保留26条给定式，19处待填式用A～S表示。每行原数固定10～18；本站列头是得数9～1。例如A位在原数10、得数6的交点，所以填10−4，而不是只填6。越过阶梯外的横杠不属于原表，也不是答案0。',
      visual: table,
      activity:
        '实际在纸面补完整19条减法算式，保留给定式和原阶梯结构，按行列逐格核对。',
    },
    {
      title: '算式写全，再完整计算',
      text: '补表不是计算得数的全部任务。九行依次有9、8、7、6、5、4、3、2、1条算式，共45条。逐行从左到右计算，同一行的被减数不变、减数增加1，得数减少1。每列固定的是得数，不是减数；空白格不跳过，表外位置不补0。',
      visual: table,
      activity:
        '实际在完整纸表旁逐式写45个得数，检查每行的算式数及减去的数量。',
    },
    {
      title: '横看和竖看分开说',
      text: '横看10这一行，10−1、10−2、10−3的原数不变，减数1、2、3每次增加1，得数9、8、7每次减少1。竖看最左列10−1、11−2、12−3，原数和减数各增加1，得数始终9。两种观察不能只说数字都变大；必须说哪个数、怎样变、哪个结果不变。',
      visual: table,
      activity:
        '实际指一条完整横行和一条竖列，逐式算、说固定量与变化量，并用另一行或列核对。',
    },
    {
      title: '斜看先说明方向',
      text: '本站示例向左下：10−3→11−3→12−3，减数一直3，原数每次增加1，得数7→8→9。另一种向右下：10−1→11−3→12−5，原数每次增加1，减数每次增加2，得数9→8→7。斜向不是只有一种规律，必须指明起点、方向和连续式。你也可找其它合理发现，再用实际式子核对。',
      visual: table,
      activity:
        '实际分别指明两种斜向并核对；再用自己的原话交流一种发现，不把本站例子当唯一答案。',
    },
    {
      title: '表外和未知不能都填零',
      text: '原表只列10～18减1～9且得数1～9的退位减法。本站迁移11−11=0：条件完整，确实没有剩余；这是原表外的新算式。只知道原数12却没有减数或得数，不能确定唯一算式，不填0。横杠表示不在表的范围，不表示已算出0。',
      activity:
        '实际说明一条原表内算式、一个有完整条件的0结果和一个信息不足的问题，分别核对。',
    },
  ],
  questions: [
    steps(
      'card-results-1',
      `按编号1～9依次算每张纸卡的得数：${source.cards
        .slice(0, 9)
        .map(([a, b], i) => `${i + 1}号${a}−${b}`)
        .join('；')}。`,
      [7, 7, 8, 9, 7, 8, 8, 7, 9],
      '分别计算，9个得数按原编号保存，重复卡仍独立。',
    ),
    steps(
      'card-results-2',
      `按编号10～17依次算每张纸卡的得数：${source.cards
        .slice(9)
        .map(([a, b], i) => `${i + 10}号${a}−${b}`)
        .join('；')}。`,
      [5, 6, 3, 6, 7, 7, 9, 8],
      '14号13−6得7；11号12−6得6，两卡条件不同。',
    ),
    findCards(
      'find-result-seven',
      '从完整17张卡中找得数7的全部卡。',
      [1, 2, 5, 8, 14, 15],
      '六张；两个16−9都要选，不能合并卡的身份。',
    ),
    findCards(
      'find-whole-twelve',
      '恢复全部17张卡，找12减几的全部卡。',
      [5, 11, 16, 17],
      '固定原数12，分别12−5、12−6、12−3、12−4；不是按得数12找。',
    ),
    findCards(
      'find-subtract-nine',
      '恢复全部17张卡，找减9的全部卡。',
      [2, 3, 4, 6, 9, 13, 15],
      '七张，固定减数9；重复17−9、18−9、16−9都保留。',
    ),
    ...source.blankPositions.map(([r, c], i): Question => ({
      ...steps(
        `blank-${String.fromCodePoint(65 + i).toLowerCase()}`,
        `补表空格${String.fromCodePoint(65 + i)}：按原数、减数顺序填两个数，组成减法算式；不要填得数。`,
        [10 + r, 1 + r + c],
        `原数${10 + r}，列上得数${9 - c}，所以${10 + r}−${1 + r + c}=${9 - c}。`,
      ),
      visual: table,
    })),
    ...Array.from({ length: 9 }, (_n, r): Question => ({
      ...steps(
        `row-${10 + r}`,
        `完整计算原数${10 + r}这一行，按从左到右${Array.from({ length: 9 - r }, (_v, c) => `${10 + r}−${1 + r + c}`).join('、')}依次填得数。`,
        Array.from({ length: 9 - r }, (_v, c) => 9 - c),
        '按每条完整算式计算，不把原数或减数当得数。',
      ),
      visual: table,
    })),
    steps(
      'horizontal',
      '横看10−1→10−2→10−3，依次填写三个得数。',
      [9, 8, 7],
      '原数不变，减数每次增加1，得数每次减少1。',
    ),
    steps(
      'vertical',
      '竖看10−1→11−2→12−3，依次填写三个得数。',
      [9, 9, 9],
      '原数和减数同时增加1，差保持9。',
    ),
    steps(
      'diagonal-left',
      '明确向左下10−3→11−3→12−3，依次填写三个得数。',
      [7, 8, 9],
      '减数不变，原数每次增加1，差每次增加1。',
    ),
    steps(
      'diagonal-right',
      '明确向右下10−1→11−3→12−5，依次填写三个得数。',
      [9, 8, 7],
      '原数每次增加1，减数每次增加2，差每次减少1；不能照搬左下规律。',
    ),
    choice(
      'outside',
      '阶梯表外的横杠表示什么？',
      '不在这张表的范围',
      ['得数一定0', '不在这张表的范围', '忘记填，所以填9'],
      '原表只收录限定的45式；横杠不是计算结果。',
    ),
    task(
      'zero-complete',
      '本站表外迁移：11个圆片，明确拿走全部11个，还剩几个？',
      { kind: 'number', value: 0 },
      '11−11=0，完整条件下0是有效结果，不是未填写。',
    ),
    choice(
      'unknown',
      '只知道原数是12，没给减数或得数，能确定唯一减法算式吗？',
      '不能，还需要减数或得数',
      ['能，一律12−0', '不能，还需要减数或得数', '能，沿用上一题'],
      '缺少条件不能借上一题或把缺失量改为0。',
    ),
    actual(
      'actual-cards',
      '实际抄出或制作完整17张纸卡，逐张算得数并核对重复卡身份。',
    ),
    actual(
      'actual-result-seven',
      '实际从全卡找得数7的全部卡，选择合理标准排列并说明。',
    ),
    actual(
      'actual-whole-twelve',
      '实际恢复全卡后找12减几的全部卡并排列，说明固定量。',
    ),
    actual(
      'actual-subtract-nine',
      '实际恢复全卡后找减9的全部卡并排列，说明固定量。',
    ),
    actual('actual-fill', '实际按原阶梯表补全19空格，保留26给定式，逐格核对。'),
    actual(
      'actual-calculate',
      '实际完整计算纸表45式，不以只算本站几道题替代。',
    ),
    actual(
      'actual-horizontal',
      '实际指完整横行，逐式核对固定原数与变化的减数、得数。',
    ),
    actual(
      'actual-vertical',
      '实际指完整竖列，逐式核对原数、减数同增和差不变。',
    ),
    actual(
      'actual-diagonal',
      '实际分别指明起点和两种斜向，核对至少三个连续式并说明。',
    ),
    actual(
      'actual-exchange',
      '实际交流自己的合理发现，并说明原表范围、完整0条件和未知条件的不同。',
    ),
    record(
      'discovery',
      '记录你自己的表中发现和核对过的实际式子，不限本站示例。',
    ),
    record(
      'difficulty',
      '记录补表、计算或解释时的困难与已经尝试的方法；没有也可如实说。',
    ),
    record(
      'plan',
      '记录下一次想如何检查或交流；这是未来计划，不是已经完成的活动。',
    ),
  ],
  reviewQuestions: [
    {
      ...task(
        'review-find',
        '新卡组：A 13−8，B 12−7，C 14−9，D 15−8。找全得数5的卡。',
        { kind: 'set', values: ['A', 'B', 'C'] },
        '前三张得5，D得7；新编号不能照搬原卡号。',
      ),
      choices: ['A', 'B', 'C', 'D'].map((label) => ({ id: label, label })),
    },
    {
      ...steps(
        'review-blank',
        '新空格位于原数12、得数5的交点；依次填原数和减数，组成完整减法式。',
        [12, 7],
        '12−7=5；5是列头得数，不能当减数。',
      ),
      visual: {
        kind: 'arithmetic-grid',
        mode: 'bnu-subtract',
        hidden: [[2, 4]],
      },
    },
    task(
      'review-new-whole',
      '本站原表外新迁移：19个圆片拿走9个，还剩几个？',
      { kind: 'number', value: 10 },
      '19−9=10；原表没有原数19这一行，不能因为表外而填0。',
    ),
    steps(
      'review-zero',
      '新条件：12个全部拿走剩几个；另一次12个一个也没拿走剩几个？依次填写。',
      [0, 12],
      '12−12=0与12−0=12不同，0表示不同位置上的数量。',
    ),
    choice(
      'review-unknown',
      '只有得数6，却没给原数或减数，能确定唯一减法式吗？',
      '不能，可能有多条式子',
      ['能，必定10−4', '不能，可能有多条式子', '能，原数就填0'],
      '10−4、11−5等都得6，只有结果不能唯一反推两个数。',
    ),
  ],
};
