import type { Lesson, Question } from '../learning/types';

const id = 'bnu-lower-buy-pencils';
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
    hint: '先分清原有、买走、剩余与单位，再按本题指定方法检查每一步；其它正确算法可以另说。',
  };
}
function number(
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
) {
  return task(suffix, prompt, { kind: 'number', value }, explanation);
}
function steps(
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
) {
  return task(suffix, prompt, { kind: 'steps', values }, explanation);
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
function actual(suffix: string, prompt: string) {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际做过再确认，网页作答不代替摆棒、画线、原图核对或说明；尚未做请跳过。',
  );
}
function record(suffix: string, prompt: string) {
  return task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '按自己的话保存，允许不同合理方法；不评分，未来计划不当已经完成。',
  );
}
export const bnuLowerPencilsLesson: Lesson = {
  id,
  textbookTitle: '买铅笔',
  title: '十几减几的四种方法与数量关系',
  page: 27,
  version: 1,
  status: 'available',
  goal: '读清买文具的数量信息，用逐根减、破十减、分步减和想加算减解释12−7，完成原练习并区分买走与剩余。',
  prerequisite: '能表示11～20，理解减法取走以及整体与部分，知道10的组成。',
  parentTip:
    '实际阅读北师大下册印刷27～28页。本站语言和过程题原创，教材原图通过外链陪读，不复制插画。指定方法的过程空格不否定其它正确算法。原有12支铅笔和15本练习本、买7支和9本分开，不能跨单位相减；买走与剩余也分清。用安全小棒或纸记号即可，不要求真实购买。真实摆画、口述和原图核对分别确认，自己的方法与未来计划不评分。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描27～28页逐项阅读与完整练习核对',
    notes:
      '27买文具四条数量信息、12−7及四种方法；28练习本15−9、摆棒11−5/16−8、数线12−4/15−7、9+5与两减法、松果17原有9剩余求吃掉8分别覆盖。减去的7拆2与5、原12拆10与2严格分开；自行附加过程题明示指定路径。',
  },
  steps: [
    {
      title: '先读四条数量信息',
      text: '第27页袋鼠妈妈原有12支铅笔、15本练习本，小兔买7支铅笔、另一位买9本练习本。问还剩铅笔时，只用12支与7支，12−7=5（支）；15本和9本用于练习本。图中物品画法不替代已明确给出的数量，不能把支与本直接合在一起减。',
      activity: '实际对照原图分别指出原有、买走和单位，说清所求。',
    },
    {
      title: '逐根减，记清减了几根',
      text: '摆12根，每次取1根，取走7根后还剩5根。从12往回数，取走后依次为11、10、9、8、7、6、5；起点12不是已经减掉1的结果。每根只取一次，最后取走7与剩余5合起来仍是原12。',
      activity: '实际摆12根，一根一根取走7根，核对取走与剩余。',
    },
    {
      title: '破十减：拆原有的12',
      text: '把原有12分成10和2。从这10根中取走7根，10−7=3；未动的2根与剩下3根合并，3+2=5。这里拆的是12，不是把7也拆成10和2；取走只一次7，不能把未动的2再减掉。',
      activity: '实际摆10根和2根，从10根中取7，再合并剩下的两部分并说明。',
    },
    {
      title: '分步减：拆要减去的7',
      text: '把要取走7分成2和5，先12−2=10，再10−5=5。两次取走合计2+5=7，没有多取。它与拆12的破十减不同，但结果同样5；本题指定先减到10，别的正确方法可以另行解释。',
      activity: '恢复原12根，先取2再取5，说清两次取走的总量。',
    },
    {
      title: '想加算减：从7补到12',
      text: '想7再添多少成为12：7+5=12，所以12−7=5。添的5表示两部分之间的缺少量；在买铅笔故事中，5仍是剩余，不是另买5支。可以检验买走7与剩余5合起来是否为原12。',
      activity: '实际用两组表示7与缺少量，合成12，再说明加法怎样检查减法。',
    },
    {
      title: '练习本与摆棒两式',
      text: '第28页练习本原15本、买9本，15−9=6（本）。先减到10可以把9拆5和4，15−5=10，10−4=6；破十减则10−9=1，1+5=6。原练一摆棒11−5=6、16−8=8，方法可选，但须说清原数、减数与每步。',
      activity: '实际完成练习本摆算和原练一两式，并核对方法。',
    },
    {
      title: '数线上向左画减法',
      text: '原两条数线分别画12−4与15−7。本站把每次减1说明成向左走一个相邻间隔：12向左4个间隔到8，15向左7个间隔也到8。起点只作参照，不当第一步；走的间隔数与含两端的数字个数不同。可以拆成先到10再继续，也要核对总共减去几。',
      visual: { kind: 'number-line', minimum: 4, maximum: 13, value: 12 },
      activity: '实际在原两条数线各画完整路径、填结果，并说明起点方向与间隔。',
    },
    {
      title: '由两部分写加法和两减法',
      text: '原星图用9和5合成14：9+5=14，14−9=5，14−5=9。两道减法分别去掉不同的一部分，不将9−5或5−9替代整体减部分。本站用文字明确两部分，不让图中色块大小代替数量；原星图实际逐项核对另记。',
      activity: '实际回看原星图、逐颗核对两部分，完整写三式并指出各量。',
    },
    {
      title: '松果先问所求，再检验',
      text: '原有17个松果，后来只剩9个，问吃掉多少：17−9=8（个）。减去的是已知剩余9，算出吃掉8；不能把已知9直接当吃掉数。8+9=17可检验。说出自己理解的算法，再记录待练习计划；想到或计划做不算已经摆画说明。',
      activity: '实际对照原图摆算松果故事，并口述原有、剩余、吃掉与检验。',
    },
  ],
  questions: [
    number('pencils-original', '原买文具故事有几支铅笔？', 12, '给定12支。'),
    number(
      'pencils-bought',
      '原故事买走几支铅笔？',
      7,
      '买走7支，不用练习本9本。',
    ),
    number('notebooks-original', '原故事有几本练习本？', 15, '给定15本。'),
    number('notebooks-bought', '原故事买走几本练习本？', 9, '买走9本。'),
    number(
      'pencils-left',
      '原有12支铅笔，买走7支，还剩几支？',
      5,
      '12−7=5（支）。',
    ),
    steps(
      'one-by-one',
      '本站逐根减：从12取走7根，每次取1根。依次填七次取走后剩余根数，起点12不填。',
      [11, 10, 9, 8, 7, 6, 5],
      '每次少1，七次后剩5根；不能把12当第一次结果。',
    ),
    steps(
      'break-ten',
      '本站指定破十减12−7：12拆10和A，10−7=B，B+A=C。依次填A/B/C。',
      [2, 3, 5],
      '拆原12为10与2，10减7剩3，再加未动2得5。',
    ),
    steps(
      'subtract-parts',
      '本站指定先减到10：7拆A与B，12−A=C，C−B=D。填A/B/C/D。',
      [2, 5, 10, 5],
      '先取2到10，再取5；共取7。',
    ),
    steps(
      'think-add',
      '本站想加算减：7+A=12，所以12−7=B。填A/B。',
      [5, 5],
      '两式指同一缺少量5。',
    ),
    choice(
      'split-object',
      '破十减12−7中的10与2，是把哪一个数分开的？',
      '原有12',
      ['原有12', '要减的7', '最后剩余5'],
      '12分10与2；分步减才把7拆2与5。',
    ),
    choice(
      'units',
      '求剩余铅笔，哪组数量能直接用于本题减法？',
      '12支与7支',
      ['12支与7支', '15本与7支', '12支与9本'],
      '相同对象和单位才对应本题。',
    ),
    number(
      'notebooks-left',
      '原有15本练习本，买9本，还剩几本？',
      6,
      '15−9=6（本）。',
    ),
    steps(
      'notebooks-parts',
      '本站指定15−9先减到10：9拆A和B，15−A=C，C−B=D。填A/B/C/D。',
      [5, 4, 10, 6],
      '先5再4，共取9。',
    ),
    steps(
      'notebooks-break',
      '本站指定15−9破十减：15拆10与A，10−9=B，B+A=C。填A/B/C。',
      [5, 1, 6],
      '10减9剩1，再合未动5。',
    ),
    number('sticks-11-5', '原练一：11−5等于多少？', 6, '10−5=5，5+1=6。'),
    number('sticks-16-8', '原练一：16−8等于多少？', 8, '10−8=2，2+6=8。'),
    number(
      'line-12-4',
      '原第一条数线从12向左走4个间隔，最后到哪个数？',
      8,
      '12−4=8。',
    ),
    number(
      'line-15-7',
      '原第二条数线从15向左走7个间隔，最后到哪个数？',
      8,
      '15−7=8。',
    ),
    number(
      'line-first',
      '本站从12向左减1，完成第一个相邻间隔后到几？',
      11,
      '起点12不是已经走完第一步。',
    ),
    steps(
      'line-parts',
      '本站指定15−7先到10：先减A到10，再减B到C。填A/B/C。',
      [5, 2, 8],
      '5与2合7，到10后再走2。',
    ),
    number('star-add', '原两部分星星9颗与5颗，9+5等于几？', 14, '两部分合14。'),
    number(
      'star-remove-nine',
      '原星图合14颗，去掉9颗后剩几颗？',
      5,
      '14−9=5。',
    ),
    number(
      'star-remove-five',
      '原星图合14颗，去掉5颗后剩几颗？',
      9,
      '14−5=9。',
    ),
    number(
      'pine-eaten',
      '原有17个松果，只剩9个，吃掉几个？',
      8,
      '17−9=8；已知9是剩余。',
    ),
    number(
      'pine-check',
      '吃掉8个、剩9个，合起来应与原有几个相同？',
      17,
      '8+9=17。',
    ),
    choice(
      'pine-meaning',
      '松果原题17−9中的9表示什么？',
      '剩余9个',
      ['吃掉9个', '剩余9个', '另买9本'],
      '减去已知剩余，求吃掉。',
    ),
    actual('actual-info', '已实际对照原买文具图，说清四条数量信息和两种单位。'),
    actual('actual-one-by-one', '已实际摆12根，一根根取走7根并核对剩余。'),
    actual(
      'actual-break-ten',
      '已实际恢复12根，按拆原有12的破十减取走7并合并剩余。',
    ),
    actual(
      'actual-subtract-parts',
      '已实际恢复12根，先取2再取5，说明两次合计7。',
    ),
    actual('actual-think-add', '已实际摆两部分合12，说明7添几与12减7的联系。'),
    actual('actual-notebooks', '已实际完成原练习本15−9的摆算并说明单位。'),
    actual('actual-sticks', '已实际摆算原11−5与16−8两式，不只填网页结果。'),
    actual('actual-lines', '已实际在原两条数线各画完整减法路径并填数。'),
    actual('actual-stars', '已实际核对原星图两部分并完整写一加两减三式。'),
    actual('actual-pine', '已实际对照原松果图摆算，说明吃掉与剩余及检验。'),
    actual(
      'actual-explain',
      '已实际向家人或同伴解释一种算法，说明每步减掉或保留的量。',
    ),
    record('my-method', '记录自己会解释的方法、每步表示什么和仍不清楚的地方。'),
    record('plan', '记录下一次练习计划，未做的摆画和说明如实写未做。'),
  ],
  reviewQuestions: [
    number(
      'review-left',
      '本站新故事原有13支铅笔，买8支，还剩几支？',
      5,
      '13−8=5。',
    ),
    steps(
      'review-break',
      '本站新13−8破十减：13拆10与A，10−8=B，B+A=C。填A/B/C。',
      [3, 2, 5],
      '未动3与十内剩2合5。',
    ),
    steps(
      'review-parts',
      '本站新13−8先到10：8拆A和B，13−A=C，C−B=D。填A/B/C/D。',
      [3, 5, 10, 5],
      '先3再5，共8。',
    ),
    steps(
      'review-add',
      '本站新故事想加算减：8+A=13，所以13−8=B。填A/B。',
      [5, 5],
      '改变原有和买走条件后仍需重新核对。',
    ),
    number(
      'review-pine',
      '本站新松果故事原有16个，剩7个，吃掉几个？',
      9,
      '16−7=9（个），不是剩余7。',
    ),
  ],
};
