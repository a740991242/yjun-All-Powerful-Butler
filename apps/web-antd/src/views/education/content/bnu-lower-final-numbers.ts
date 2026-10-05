import type { ColumnDigitsRule } from '../learning/column-digits';
import type { Lesson, Question, Visual } from '../learning/types';

const data = (
  scene: 'farm' | 'rescue' | 'rings' | 'rope',
  variant: 'main' | 'review' = 'main',
): Visual => ({ kind: 'bnu-final-data', scene, variant });
const column = (
  a: number,
  operator: '+' | '-',
  b: number,
): ColumnDigitsRule => ({
  kind: 'column-digits',
  operator,
  left: [Math.floor(a / 10), a % 10],
  right: [Math.floor(b / 10), b % 10],
  result: [null, null],
});
function tasks(id: string) {
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
    visual?: Visual,
  ): Question => ({
    id: `${id}-${key}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先读对象、位置、单位与所问范围，再核对关系；空位不当0，实际交流、已做与未来计划分开。',
    ...(visual ? { visual } : {}),
  });
  return {
    q,
    choose: (
      key: string,
      prompt: string,
      labels: [string, string],
      explanation: string,
      visual?: Visual,
    ): Question => ({
      ...q(
        key,
        prompt,
        { kind: 'choice', value: 'clear' },
        explanation,
        visual,
      ),
      choices: labels.map((label, i) => ({
        id: i === 0 ? 'clear' : 'other',
        label,
      })),
    }),
    actual: (key: string, prompt: string) =>
      q(
        key,
        prompt,
        { kind: 'manual' },
        '实际完成此项才确认；网页答题不自动确认纸笔、小棒、拨珠或同伴交流。可以用安全纸卡、请家人协助，并如实说明；未做可跳过。',
      ),
    record: (key: string, prompt: string) =>
      q(
        key,
        prompt,
        { kind: 'reflection' },
        '保留真实原话，correct为null，不评唯一故事、画法或交流；没有做可写待做，未来计划另列。',
      ),
  };
}
const reviewId = 'bnu-lower-final-number-review';
const a = tasks(reviewId);
export const bnuLowerFinalNumberReviewLesson: Lesson = {
  id: reviewId,
  textbookTitle: '总复习：数与代数（回顾与交流）',
  title: '32的多种表示、竖式与生活问题',
  page: 90,
  version: 1,
  status: 'available',
  goal: '回顾认识的数与顺序数数，用多种方式表示32，四道竖式分别计算并借助实物解释，举18−9两件生活例子，按动物条件提问、交流并解决。',
  prerequisite:
    '认识百以内数与十/一，会同数位不进位加法、不退位减法以及20以内减法；纸笔与安全纸卡可替代实物。',
  parentTip:
    '原90页四项回顾完整对应；本站表格与字母重表条件，不复制原插画。自定长短符号须先说明约定，不冒古代筹制或实物厘米数。两件生活例子、提出问题、真实交流与解答分别确认，答题不替代；未知学校、版印或未指定审校人不作为通用教学前置。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描印刷90页',
    notes: '逐项保留四种回顾；教学映射与程序检查不代表93～95或全年完成。',
  },
  steps: [
    {
      title: '回顾数与顺序',
      text: '说说这学期认识了哪些数，从一个起点顺着或倒着数，并说明每次加1或减1。以32为例，前一个31、后一个33；数与用来记录它的符号分清。不要把会说一串数当成已理解每个数。',
      activity: '实际回顾并按自己选择的起点顺数、倒数。',
    },
    {
      title: '三捆与两根：用小棒表示32',
      text: '每捆固定10根，3捆是30根，加2根散棒是32。捆数3和根数32不同；本站工具可拆一捆为10根，总数不变。取纸卡或实际小棒时先说每张卡的约定，再摆。',
      visual: { kind: 'place-value', value: 32 },
      activity: '实际摆3个十与2个一，说明捆与根。',
    },
    {
      title: '计数器：位置决定珠子的数值',
      text: '十位3颗、个位2颗表示32。珠子实体共有5颗，按位置表示的数仍是32，不能把珠数当数量32。拨珠时十位一颗代表10、个位一颗代表1，和小棒的十与一对应。',
      visual: { kind: 'place-counters', values: [32] },
      activity: '实际拨珠或用纸画计数器，逐位解释。',
    },
    {
      title: '自定符号也要说清约定',
      text: '第三种表示可以自定：一条长线表示一个十、一条短线表示一个一，画3条长线和2条短线表示32。先说明约定，让别人读懂，不说这是古代算筹的新结论，也不假定原图有厘米尺寸。还可用自己的其他清楚表示法。',
      activity: '实际画另一种表示，说明它为何表示32。',
    },
    {
      title: '45＋23：相同数位对齐',
      text: '纸上竖着写，个位5＋3＝8，十位4＋2＝6，得68。图中A/B只标待填十位/个位，练习中不印结果。加号在第二行左边，不能把个位3挪到十位。用小棒或计数器解释为何同数位相加。',
      visual: column(45, '+', 23),
      activity: '实际写45＋23的竖式，并借助小棒或计数器解释。',
    },
    {
      title: '68－15：分别减十与一',
      text: '个位8－5＝3，十位6－1＝5，结果53。68是原有量，15是减去量，顺序不倒置；图中两个结果位置待填。用实物表示取走1个十和5个一，再核对剩余。',
      visual: column(68, '-', 15),
      activity: '实际写68－15并解释取走与剩余。',
    },
    {
      title: '73＋22：再独立写一次',
      text: '个位3＋2＝5，十位7＋2＝9，得95。不能因为上道结果53就沿用；每次看清符号、操作数和列位置，再借实物解释。',
      visual: column(73, '+', 22),
      activity: '实际写73＋22并用小棒或计数器核对。',
    },
    {
      title: '99－19：结果个位是有效0',
      text: '个位9－9＝0，十位9－1＝8，得80。0说明没有剩余的散一，不能不填，也不是未完成的空格。四道竖式要分别完成，不把只算第一道当全部会了。',
      visual: column(99, '-', 19),
      activity: '实际写99－19，说明个位0的意义。',
    },
    {
      title: '18－9可以讲两件生活问题',
      text: '分别编两个真实或明确标注想象的生活问题。比如原有18张纸卡，送出9张，求剩下；也可以比较18个和9个相差多少。说清对象、单位、条件、问题和为何用减法。两题可有不同题材，不照抄一个换名字就冒两次真实经历。',
      activity: '实际讲两件不同的18－9生活问题。',
    },
    {
      title: '先读动物条件，再决定用哪些',
      text: '原图羊35只、鹅11只、兔比羊多4只。本站表把条件重写出来；要算兔，基准是羊35、增加4，得39，鹅11暂不用。可以另问羊比鹅多多少，或三种一共多少，问法不同所用条件也不同。',
      visual: data('farm'),
      activity: '实际说明每条条件与比较基准。',
    },
    {
      title: '自己的问题：提出、交流、尝试解决',
      text: '按这三条条件提出自己的数学问题，与实际在场的人讨论，再解答并用原条件核对。本站示范兔39、羊比鹅多24、三种一共85是不同问法，不强制自己的问题照这三条。没有交流如实待做，不编造同伴反馈。',
      activity: '实际提出问题，与家人或同伴交流，再尝试解答。',
    },
    {
      title: '整理实际发现，未来计划另写',
      text: '比较数数、小棒、计数器、符号、竖式和生活问题之间的联系。说自己实际做过哪些、哪里困难；下一次想补做另列，不由客观题通过自动确认实作或故事完成。',
      activity: '回顾真实表现与待做事项。',
    },
  ],
  questions: [
    a.q(
      'composition',
      '32里有几个十、几个一？按十、一填两格。',
      { kind: 'steps', values: [3, 2] },
      '32＝30＋2，由3个十和2个一组成。',
      { kind: 'place-counters', values: [32] },
    ),
    a.q(
      'neighbors',
      '顺序数数，32前一个与后一个分别是多少？',
      { kind: 'steps', values: [31, 33] },
      '前一个减1，后一个加1。',
    ),
    a.q(
      'beads',
      '这张32的计数器图，实际画了几颗珠子？不是问它表示的数。',
      { kind: 'number', value: 5 },
      '3颗十位珠＋2颗个位珠＝5颗实体珠，按数位表示32。',
      { kind: 'place-counters', values: [32] },
    ),
    a.choose(
      'exchange',
      '32的小棒拆开一捆后成为2捆12根散棒，表示的总数怎样？',
      ['仍是32，拆一捆换10根没有增减', '只有2捆，表示的总数一定变成22'],
      '2个十＋12个一＝32，材料分组变了，总数不变。',
    ),
    ...[
      [45, '+', 23, 'add-one'],
      [68, '-', 15, 'subtract-one'],
      [73, '+', 22, 'add-two'],
      [99, '-', 19, 'subtract-two'],
    ].map(([left, op, right, key]) => {
      const model = column(Number(left), op === '+' ? '+' : '-', Number(right));
      return a.q(
        String(key),
        `${left}${op}${right}，按结果十位A、个位B填两格。`,
        model,
        '相同数位对齐，先个位后十位；结果为0的个位也要填。',
        model,
      );
    }),
    a.choose(
      'alignment',
      '45＋23写竖式时，23里的3应对齐哪一位？',
      ['对齐45的个位5', '对齐45的十位4'],
      '个位与个位、十位与十位对齐，3不能挪到十位。',
    ),
    a.choose(
      'subtract-order',
      '68－15中，哪一种操作对应题意？',
      ['从68中减去15', '从15中减去68'],
      '被减数与减数的位置不同，不能交换顺序。',
    ),
    a.q(
      'eighteen-nine',
      '18－9等于多少？',
      { kind: 'number', value: 9 },
      '18减9余9，可拆十或用18中的9个核对。',
      { kind: 'break-ten', left: 18, right: 9 },
    ),
    a.choose(
      'life-condition',
      '哪件事可用18－9求所问数量？',
      ['原有18张，送出9张，问还剩几张', '原有18张，又收到9张，问一共几张'],
      '取走使数量减少；收到增加，应使用加法，不能因为都出现18和9就套减法。',
    ),
    a.q(
      'rabbit',
      '按动物表，兔有多少只？',
      { kind: 'number', value: 39 },
      '兔比羊多4，以羊35为基准，35＋4＝39。',
      data('farm'),
    ),
    a.q(
      'sheep-geese',
      '羊比鹅多多少只？',
      { kind: 'number', value: 24 },
      '35－11＝24，问差不是问羊或鹅本身数量。',
      data('farm'),
    ),
    a.q(
      'farm-total',
      '三种动物一共有多少只？先求兔，再合计。',
      { kind: 'number', value: 85 },
      '兔39，再35＋11＋39＝85；不能只把35、11、4当三种数量相加。',
      data('farm'),
    ),
    {
      ...a.q(
        'rabbit-relevant',
        '要求兔有多少只，表中哪两行提供必要条件？全部选出。',
        { kind: 'set', values: ['A', 'C'] },
        'A给羊35，C给兔比羊多4；B鹅11不是这道兔数问题的必要条件。',
        data('farm'),
      ),
      choices: [
        { id: 'A', label: 'A 羊的数量' },
        { id: 'B', label: 'B 鹅的数量' },
        { id: 'C', label: 'C 兔比羊多的数量' },
      ],
    },
    a.q(
      'site-zero',
      '本站另一个假设：原有35只全部35只离开，剩多少只？不是原动物表的新事实。',
      { kind: 'number', value: 0 },
      '35－35＝0，0与没有填答案不同。',
    ),
    a.actual(
      'actual-count',
      '实际回顾认识的数，并从自己选择的起点顺数和倒数，说明每次怎样变化。',
    ),
    a.actual(
      'actual-sticks',
      '实际用小棒或纸卡表示32，先说明每捆10根，再摆3捆和2根。',
    ),
    a.actual(
      'actual-counter',
      '实际拨珠或画十位/个位计数器表示32，说明位置与每珠代表的数。',
    ),
    a.actual(
      'actual-symbols',
      '实际用另一种自定符号或图表示32，先说明约定，再请实际在场的人读一读；未交流如实说明。',
    ),
    ...['45＋23', '68－15', '73＋22', '99－19'].map((expression, i) =>
      a.actual(
        `actual-column-${i + 1}`,
        `实际纸笔写${expression}竖式，并借小棒、纸卡或计数器说明计算过程。`,
      ),
    ),
    a.actual(
      'actual-life-one',
      '实际讲第一个18－9生活问题，说明对象、单位、条件与所问；想象示例明确标注。',
    ),
    a.actual(
      'actual-life-two',
      '实际讲第二个18－9生活问题，与第一件题材或问法不同，不编造已发生经历。',
    ),
    a.actual('actual-farm-question', '实际按三条动物条件提出自己的数学问题。'),
    a.actual(
      'actual-farm-talk',
      '实际与家人或同伴交流自己提出的问题，说明用哪些条件；没有交流待做。',
    ),
    a.actual(
      'actual-farm-solve',
      '实际解答自己提出的动物问题，再用原条件和问法核对。',
    ),
    a.record(
      'represent-record',
      '记录自己实际用了哪些方式表示32，约定是什么，还有哪里不清楚。',
    ),
    a.record(
      'life-record',
      '记录自己的两件18－9生活问题及为什么可用减法；未讲或未想好如实记。',
    ),
    a.record(
      'farm-record',
      '记录自己的动物问题、实际交流与解答；未交流不编造建议。',
    ),
    a.record(
      'learning-record',
      '实际做过后有哪些发现或困难？与下一项未来计划分开。',
    ),
    a.record('future-plan', '另写下一次想继续练的事，不能当本次已完成。'),
  ],
  reviewQuestions: [
    a.q(
      'review-composition',
      '本站新数41，按十、一填两格。',
      { kind: 'steps', values: [4, 1] },
      '4个十与1个一表示41；不是原32的3十2一。',
      { kind: 'place-counters', values: [41] },
    ),
    a.q(
      'review-column-sub',
      '本站新52－21，按结果十位、个位填两格。',
      column(52, '-', 21),
      '个位2－1＝1，十位5－2＝3，结果31。',
      column(52, '-', 21),
    ),
    a.q(
      'review-column-add',
      '本站新24＋53，按结果十位、个位填两格。',
      column(24, '+', 53),
      '个位4＋3＝7，十位2＋5＝7，结果77。',
      column(24, '+', 53),
    ),
    a.q(
      'review-rabbit',
      '本站新动物表中兔有多少只？',
      { kind: 'number', value: 33 },
      '以新羊28为基准，28＋5＝33，不沿用原39。',
      data('farm', 'review'),
    ),
    a.q(
      'review-all',
      '本站新动物表三种合计多少只？',
      { kind: 'number', value: 75 },
      '先兔33，再28＋14＋33＝75。',
      data('farm', 'review'),
    ),
    a.q(
      'review-life',
      '本站新故事原有19支笔，用去8支，还剩多少支？',
      { kind: 'number', value: 11 },
      '19－8＝11，条件改变后不能直接填原18－9的9。',
    ),
    a.choose(
      'review-exchange',
      '把表示41的一捆小棒拆开后，怎样如实记录？',
      ['3捆11根散棒，仍表示41', '只看捆数3，认为只剩31'],
      '拆一捆换10根，原有1根散棒变11根，3十11一仍41。',
    ),
  ],
};
const appId = 'bnu-lower-final-number-applications';
const b = tasks(appId);
const forward: Visual = {
  kind: 'number-strip',
  values: [25, null, 27, null, 29, null, 31, null],
};
const backward: Visual = {
  kind: 'number-strip',
  values: [61, 60, null, null, 57, 56, null, null, 53, 52],
};
const pair = (
  key: string,
  prompt: string,
  values: string[],
  explanation: string,
  review = false,
): Question => ({
  ...b.q(
    key,
    prompt,
    { kind: 'set', values },
    explanation,
    data('rings', review ? 'review' : 'main'),
  ),
  choices: ['A', 'B', 'C', 'D'].map((label) => ({
    id: label,
    label: `${label}目标`,
  })),
});
export const bnuLowerFinalNumberApplicationsLesson: Lesson = {
  id: appId,
  textbookTitle: '总复习：数与代数（巩固与应用）',
  title: '数线、组成、比较与生活数据',
  page: 91,
  version: 1,
  status: 'available',
  goal: '完成两条数线空位、三种十与一、四个比较、救助下半年、加减数线、两群熊猫、同量白菜、套圈两问和跳绳三问，分清顺序、范围、对象与单位。',
  prerequisite:
    '百以内读数与比较，十与一，同数位不进位加法/不退位减法，20以内加减；可请成人帮读条件。',
  parentTip:
    '原91～92九项巩固逐项展开。棒图替代37小棒/24铅笔的十与一，原51用计数器；熊猫以一圆点一只重表，未复制动物插画。原套圈问两个目标，本站明确两个不同目标、各记一次，不推广到重复命中规则。跳绳按次数多名次前，原表顺序不代排名。开放提出问题与真实画线、操作、交流不由计算通过代替。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描印刷91～92页',
    notes: '全部九项应用与子问分别映射；93～95继续制作，最终全书审校另核。',
  },
  steps: [
    {
      title: '顺数：每格加1',
      text: '原第一条数线25、27、29、31之间和末尾有四个空位，分别26、28、30、32。本站用顺序格重表，A～D是待填位置，不是数值。相邻格加1，不能只看已印奇数就每格加2。',
      visual: forward,
    },
    {
      title: '倒数：每格减1',
      text: '第二条从61倒数到52，四个空位按左到右为59、58、55、54。61、60之后连续两个空格各占一个位置；空位不跳过、不当0。',
      visual: backward,
    },
    {
      title: '37：小棒的捆与根',
      text: '原图3捆10根与7根散棒表示37。十有3个、一有7个；合计不是3＋7根。本站小棒工具可帮助说明，实物十根一捆的约定先说清。',
      visual: { kind: 'place-value', value: 37 },
      activity: '实际观察原三种图，并逐项解释十与一。',
    },
    {
      title: '24：盒数不等于笔数',
      text: '原铅笔图两盒各10支，还有4支散笔，表示24。本站用2捆棒与4根重表同样的十与一，不冒仍是原铅笔插画。先把2盒对应20支，再加4支；一盒不是一支。',
      visual: { kind: 'place-value', value: 24 },
    },
    {
      title: '51：按数位读珠',
      text: '原计数器十位5颗、个位1颗，表示51。实体6颗珠与表示的数51分清，十位、个位位置不能互换。',
      visual: { kind: 'place-counters', values: [51] },
    },
    {
      title: '四个比较：先看关系或算后比',
      text: '35＋24与24＋35相等。54－32大于53－32；49－37小于49－36；50＋30小于50＋40。交换加数和交换减数不是同一件事；相同被减数减得更多，余得更少。四处符号分别判断。',
    },
    {
      title: '救助站：问下半年，不是全年',
      text: '上半年32只，下半年比上半年多13只，所以问下半年应32＋13＝45。13是多出的部分，不是下半年总数。若另问全年才32＋45＝77，这个范围与原问不同。',
      visual: data('rescue'),
    },
    {
      title: '7＋6：向右画六次',
      text: '以7为起点，在数线上每次向右走1，共6次，到13。起点7不是第1次跳；每一跳表示增加1，不是把7和6当两段位置相加。原数线7～16，本站工具保留这个范围。',
      visual: { kind: 'number-line', minimum: 7, maximum: 16, value: 7 },
      activity: '实际在纸上画7＋6的六个向右箭头。',
    },
    {
      title: '18－6：向左画六次',
      text: '以18为起点，每次向左走1，共6次，到12。减法方向不同；原线显示11～19，端点和实际起点分清。图中初始位置18，不直接给最终落点。',
      visual: { kind: 'number-line', minimum: 11, maximum: 19, value: 18 },
      activity: '实际在纸上画18－6的六个向左箭头。',
    },
    {
      title: '两群熊猫：一只只对应再合并',
      text: '原图左6只、右7只，总13只。本站两组圆点各一只熊猫，先分别数，再6＋7＝13。不能把眼睛、斑块或两个背景框当只数；两种加数顺序都可表达合计，本题填写顺序明确为左、右、总。',
      visual: { kind: 'count', count: 6, other: 7 },
      activity: '实际逐个指两组，不重复、不漏数。',
    },
    {
      title: '白菜：一样多仍是两个部分',
      text: '一只兔收24棵，另一只说同样多，也是24棵，合计48棵。24描述每一部分，不是已经两人合计；原情境数量按文字，插画中的菜不是全部实物数量。',
      activity: '实际用图、纸卡或文字表示24与另24，说明合计。',
    },
    {
      title: '套圈：两个不同目标各记一次',
      text: '原四目标分数24、12、30、32，本站加A～D标记。奇思42分来自B12＋C30，笑笑62分来自C30＋D32。妙想第三名要低于另两人，A24＋B12＝36可以；先核对得分和名次，不把目标字母当分数。这里明确两个不同目标、各记一次；若游戏允许重复命中，必须重新问规则。',
      visual: data('rings'),
      activity: '实际用四张分数卡试两张不同目标，核对三人条件。',
    },
    {
      title: '跳绳：先排完整四人，再求差',
      text: '强强92、乐乐95、小红94、欢欢99，次数多名次前。按表中人名顺序名次4、2、3、1；第二名95与第三名94相差1次。字母A～D是待填位置，不是已经排好的名次。',
      visual: data('rope'),
      activity: '实际写出四人的名次并核对次数。',
    },
    {
      title: '再提问题，实际交流与解答',
      text: '按跳绳数据再提自己的问题，说明对象和所用数量，再尝试解决。可以问第一名比第四名多几次，也可提出其他可由条件回答的问题；不是强制唯一问法。记录真实交流和收获，未来计划单列。',
      visual: data('rope'),
      activity: '实际提出并交流另一个跳绳问题，再解答和核对。',
    },
  ],
  questions: [
    b.q(
      'forward',
      '每格加1，按A～D位置填顺数四个空。',
      { kind: 'steps', values: [26, 28, 30, 32] },
      '相邻格差1；每个空格都有自己的位置。',
      forward,
    ),
    b.q(
      'backward',
      '每格减1，按A～D位置填倒数四个空。',
      { kind: 'steps', values: [59, 58, 55, 54] },
      '从61、60往后倒数，连续空格也各减1。',
      backward,
    ),
    ...[37, 24, 51].map((value) =>
      b.q(
        `composition-${value}`,
        `${value}里有几个十、几个一？按十、一填写。`,
        { kind: 'steps', values: [Math.floor(value / 10), value % 10] },
        '十位和个位分别表示十与一，捆/盒/珠的个数不能直接替代物品总数。',
        value === 51
          ? { kind: 'place-counters', values: [51] }
          : { kind: 'place-value', value },
      ),
    ),
    ...[
      ['35＋24', '24＋35', '='],
      ['54－32', '53－32', '>'],
      ['49－37', '49－36', '<'],
      ['50＋30', '50＋40', '<'],
    ].map(([left, right, sign], i): Question => ({
      ...b.q(
        `compare-${i + 1}`,
        `${left} ○ ${right}，选应填的符号。`,
        { kind: 'choice', value: String(sign) },
        '分别读两边算式，可计算两边或说明关系后再比较。',
      ),
      choices: ['>', '<', '='].map((label) => ({ id: label, label })),
    })),
    b.q(
      'rescue',
      '动物救助表：下半年救助了多少只？',
      { kind: 'number', value: 45 },
      '以32为基准多13，下半年32＋13＝45，不是13或全年77。',
      data('rescue'),
    ),
    b.q(
      'line-add',
      '从7开始，每次向右1，走6次后到哪个数？',
      { kind: 'number', value: 13 },
      '7＋6＝13，起点不算第1跳。',
      { kind: 'number-line', minimum: 7, maximum: 16, value: 7 },
    ),
    b.q(
      'line-subtract',
      '从18开始，每次向左1，走6次后到哪个数？',
      { kind: 'number', value: 12 },
      '18－6＝12，不是向右到24。',
      { kind: 'number-line', minimum: 11, maximum: 19, value: 18 },
    ),
    b.q(
      'pandas',
      '每个圆点表示一只熊猫，按左组＋右组＝总只数填三格。',
      { kind: 'steps', values: [6, 7, 13] },
      '左6＋右7＝13；圆点是一只，不是眼睛数或框数。',
      { kind: 'count', count: 6, other: 7 },
    ),
    b.q(
      'cabbages',
      '一只收24棵，另一只同样多。按第一只、第二只、合计填三格。',
      { kind: 'steps', values: [24, 24, 48] },
      '两个相同部分24＋24＝48；第二只不是0。',
    ),
    pair(
      'rings-first',
      '奇思42分，选出套中的两个不同目标。',
      ['B', 'C'],
      'B12＋C30＝42，选两个不同目标各一次。',
    ),
    pair(
      'rings-second',
      '笑笑62分，选出套中的两个不同目标。',
      ['C', 'D'],
      'C30＋D32＝62。',
    ),
    pair(
      'rings-third',
      '三人中妙想第三名，选出可能的两个不同目标；要同时满足低于42和62。',
      ['A', 'B'],
      'A24＋B12＝36低于42与62，其他不同两目标组合不低于42。',
    ),
    b.q(
      'ranks',
      '按强强、乐乐、小红、欢欢（A～D行）依次填名次，次数多名次前。',
      { kind: 'steps', values: [4, 2, 3, 1] },
      '按99、95、94、92排序，再对应各行，不把行顺序当名次。',
      data('rope'),
    ),
    b.q(
      'rank-difference',
      '跳绳第二名比第三名多几次？不是问第一名比最后一名。',
      { kind: 'number', value: 1 },
      '第二95、第三94，95－94＝1次。',
      data('rope'),
    ),
    b.q(
      'site-zero',
      '本站另一个假设：两人都跳94次，相差几次？不是把原表改成并列。',
      { kind: 'number', value: 0 },
      '94－94＝0；原表次数未改变。',
    ),
    b.actual(
      'actual-compositions',
      '实际观察原37小棒、24铅笔和51计数器三种图，逐项说明几个十、几个一，图示替代如实说明。',
    ),
    b.actual('actual-line-add', '实际纸上画7＋6数线，从7向右画6次，并标落点。'),
    b.actual(
      'actual-line-subtract',
      '实际纸上画18－6数线，从18向左画6次，并标落点。',
    ),
    b.actual(
      'actual-pandas',
      '实际逐个指原两群熊猫或本站一只一圆点替代图，分别数并写合计算式。',
    ),
    b.actual(
      'actual-cabbages',
      '实际用图、文字或纸卡表示两份各24棵白菜，并写合计；不数示意菜图当全部数量。',
    ),
    b.actual(
      'actual-rings',
      '实际用四张目标分数卡模拟两张不同卡，分别核对42、62和第三名条件。',
    ),
    b.actual(
      'actual-ranks',
      '实际在自己的表中给四人填名次，按次数核对，说明第二第三的差。',
    ),
    b.actual(
      'actual-own-question',
      '实际按跳绳表提出另一个问题，与实际在场的人交流；没有交流就待做。',
    ),
    b.actual(
      'actual-own-solve',
      '实际解决自己提出的跳绳问题，并回原表核对数量、对象与单位。',
    ),
    b.record(
      'composition-record',
      '记录三种十与一怎样对应，哪个容易混淆，自己如何分清。',
    ),
    b.record(
      'rings-record',
      '记录怎样核对第三名条件；如果规则改为允许同目标重复计分，会先问什么？假设与原规则分开。',
    ),
    b.record(
      'own-question-record',
      '记录自己的另一个跳绳问题、实际交流与解答，不虚构反馈。',
    ),
    b.record('learning-record', '实际做过后有哪些发现或困难？'),
    b.record('future-plan', '另列以后想补做或练习的事，不当已经完成。'),
  ],
  reviewQuestions: [
    b.q(
      'review-forward',
      '本站新顺数格，每格加1，按A/B填空。',
      { kind: 'steps', values: [44, 46] },
      '43、44、45、46、47，条件和空位已改变。',
      { kind: 'number-strip', values: [43, null, 45, null, 47] },
    ),
    b.q(
      'review-backward',
      '本站新倒数格，每格减1，按A/B/C填空。',
      { kind: 'steps', values: [72, 70, 69] },
      '73、72、71、70、69、68，不沿用原61起点。',
      { kind: 'number-strip', values: [73, null, 71, null, null, 68] },
    ),
    b.q(
      'review-annual',
      '本站新救助表，这次问全年共救助多少只？先求下半年。',
      { kind: 'number', value: 98 },
      '下半年43＋12＝55，全年43＋55＝98；问法与原下半年不同。',
      data('rescue', 'review'),
    ),
    pair(
      'review-rings-first',
      '本站新分数，选出得36分的两个不同目标。',
      ['B', 'C'],
      'B14＋C22＝36，新条件不是原12＋30。',
      true,
    ),
    pair(
      'review-rings-third',
      '本站新游戏两人得36与48分，第三名可选哪两个不同目标？',
      ['A', 'B'],
      'A18＋B14＝32低于36和48，其他两不同目标合计至少36。',
      true,
    ),
    b.q(
      'review-ranks',
      '本站新跳绳表，按A～D行填四人名次。',
      { kind: 'steps', values: [3, 1, 4, 2] },
      '87、86、83、82由多到少，分别对应B、D、A、C。',
      data('rope', 'review'),
    ),
    b.q(
      'review-first-last',
      '本站新跳绳表，第一名比第四名多几次？',
      { kind: 'number', value: 5 },
      '87－82＝5，问的范围已变，不是原第二第三的1。',
      data('rope', 'review'),
    ),
    b.q(
      'review-pandas',
      '本站新两组一圆点一只动物，按左、右、合计填三格。',
      { kind: 'steps', values: [8, 5, 13] },
      '新8＋5＝13，合计相同不表示两组仍是原6和7。',
      { kind: 'count', count: 8, other: 5 },
    ),
  ],
};
export const bnuLowerFinalNumberMapping = [
  {
    page: 90,
    sourceActivity: 'recall-count-and-represent-32',
    lesson: reviewId,
    steps: [1, 2, 3, 4],
    objective: ['composition', 'neighbors', 'beads', 'exchange'],
    manual: [
      'actual-count',
      'actual-sticks',
      'actual-counter',
      'actual-symbols',
    ],
    records: ['represent-record'],
  },
  {
    page: 90,
    sourceActivity: 'four-columns-and-manipulative-explanation',
    lesson: reviewId,
    steps: [5, 6, 7, 8],
    objective: [
      'add-one',
      'subtract-one',
      'add-two',
      'subtract-two',
      'alignment',
      'subtract-order',
    ],
    manual: [
      'actual-column-1',
      'actual-column-2',
      'actual-column-3',
      'actual-column-4',
    ],
    records: [],
  },
  {
    page: 90,
    sourceActivity: 'two-life-examples-for-eighteen-minus-nine',
    lesson: reviewId,
    steps: [9],
    objective: ['eighteen-nine', 'life-condition'],
    manual: ['actual-life-one', 'actual-life-two'],
    records: ['life-record'],
  },
  {
    page: 90,
    sourceActivity: 'farm-questions-discussion-and-solutions',
    lesson: reviewId,
    steps: [10, 11, 12],
    objective: [
      'rabbit',
      'sheep-geese',
      'farm-total',
      'rabbit-relevant',
      'site-zero',
    ],
    manual: ['actual-farm-question', 'actual-farm-talk', 'actual-farm-solve'],
    records: ['farm-record', 'learning-record', 'future-plan'],
  },
  {
    page: 91,
    sourceActivity: 'forward-and-backward-number-line-blanks',
    lesson: appId,
    steps: [1, 2],
    objective: ['forward', 'backward'],
    manual: [],
    records: [],
  },
  {
    page: 91,
    sourceActivity: 'three-tens-ones-compositions',
    lesson: appId,
    steps: [3, 4, 5],
    objective: ['composition-37', 'composition-24', 'composition-51'],
    manual: ['actual-compositions'],
    records: ['composition-record'],
  },
  {
    page: 91,
    sourceActivity: 'four-expression-comparisons',
    lesson: appId,
    steps: [6],
    objective: ['compare-1', 'compare-2', 'compare-3', 'compare-4'],
    manual: [],
    records: [],
  },
  {
    page: 91,
    sourceActivity: 'rescue-second-half-more',
    lesson: appId,
    steps: [7],
    objective: ['rescue'],
    manual: [],
    records: [],
  },
  {
    page: 91,
    sourceActivity: 'draw-add-and-subtract-number-lines',
    lesson: appId,
    steps: [8, 9],
    objective: ['line-add', 'line-subtract'],
    manual: ['actual-line-add', 'actual-line-subtract'],
    records: [],
  },
  {
    page: 92,
    sourceActivity: 'two-panda-groups-and-equation',
    lesson: appId,
    steps: [10],
    objective: ['pandas'],
    manual: ['actual-pandas'],
    records: [],
  },
  {
    page: 92,
    sourceActivity: 'same-cabbage-count-and-total',
    lesson: appId,
    steps: [11],
    objective: ['cabbages'],
    manual: ['actual-cabbages'],
    records: [],
  },
  {
    page: 92,
    sourceActivity: 'two-ring-target-questions',
    lesson: appId,
    steps: [12],
    objective: ['rings-first', 'rings-second', 'rings-third'],
    manual: ['actual-rings'],
    records: ['rings-record'],
  },
  {
    page: 92,
    sourceActivity: 'rope-ranks-difference-and-own-question',
    lesson: appId,
    steps: [13, 14],
    objective: ['ranks', 'rank-difference', 'site-zero'],
    manual: ['actual-ranks', 'actual-own-question', 'actual-own-solve'],
    records: ['own-question-record', 'learning-record', 'future-plan'],
  },
] as const;
