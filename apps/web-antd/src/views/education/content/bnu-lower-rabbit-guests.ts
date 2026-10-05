import type { Lesson } from '../learning/types';

export const bnuLowerRabbitGuestsLesson: Lesson = {
  id: 'bnu-lower-rabbit-guests',
  textbookTitle: '小兔请客',
  title: '整十数加减：三种方法、完整数线与自主提问',
  page: 62,
  version: 1,
  status: 'available',
  goal: '完成原整十加减的三种方法、全部术语位置、明确时刻的两小棒图、两条完整数线，并真实提出完整数学问题和解答。',
  prerequisite:
    '认识100以内的整十数，理解一个十为10，能分清整体/部分和动作前后。',
  parentTip:
    '依据62～63两整页与两桌局部放大。原所求背走10、桌上40分清；两桌各四捆手上两捆，本站题明确四捆为动作前，另约定已拿后须另算原60，不补唯一时间图义。六术语位置全部对应、两数线完整起终点和方向；开放自提问题允许不同合理条件，三人120是拓展不截100。原创数位/数线无教材插画，十三真实人工、三记录null与计划分开，旧ID/版本/schema1保持，未知版印与最终教师审校如实，不以学校或指定审校人作开发前置。',
  review: {
    date: '2026-10-05',
    reviewer: '62～63整页、小棒局部放大、全部数量/方法/名称/箭头及开放条件核对',
    notes:
      '六来源活动完整对应，本站明示时刻与换条件题不冒原唯一图义，教师最终试用未核验。',
  },
  steps: [
    {
      title: '盘数与果子数先分开',
      text: '原每盘十个，两组2盘和3盘，共5盘、50个。接着数、按十合并、关联个位计算三种方法分别做，不逐像素猜原照片果子。本站数位图每十位珠代表十，五颗表示50。',
      activity: '实际按原条件指盘说单位。',
      visual: {
        kind: 'place-counters',
        values: [20, 30, 50],
      },
    },
    {
      title: '从20接着数三个十',
      text: '接着数30、40、50，每次增加10，共三次。用十表示为2个十加3个十得5个十；写2+3=5与20+30=50，五与五十的单位层级分清。',
      activity: '三种方法各实际写画并说明。',
      visual: {
        kind: 'place-counters',
        values: [20, 30, 50],
      },
    },
    {
      title: '原所求是背走多少',
      text: '原总50，桌上还有40，背走是另一部分10，列50−40=10。计算模型减去已知桌上四十是在找另一部分，不冒动物实际背走40，也不把留下与背走对调。',
      activity: '回原图明确总量/已知部分/未知部分。',
      visual: {
        kind: 'place-counters',
        values: [50, 40, 10],
      },
    },
    {
      title: '往前数、减十与关联式都核对',
      text: '从50向前四次每次十，40/30/20/10；5个十减4个十是1个十。5−4=1与50−40=10关联，结果是原背走10个。',
      activity: '三种减法方法各实际完成。',
      visual: {
        kind: 'place-counters',
        values: [50, 40, 10],
      },
    },
    {
      title: '两个算式全部数字名称',
      text: '20+30=50中的20/30均加数、50和；50−40=10中的50被减数、40减数、10差。名称依本算式位置，不以物品或某个固定数字永久命名。',
      activity: '实际指六位置并读说名称。',
    },
    {
      title: '两小棒图先明确时刻与单位',
      text: '原两桌各四捆、各手上两捆，每捆十根。本站把桌上四捆明确为操作前，则添加40+20=60、拿走40−20=20根。若另约定右桌四捆为已经拿后的剩余，原来60、拿走20、剩40；两种时刻不能混，不擅补唯一图义。原纸面按自己说明的时刻完整列式答句。',
      activity: '原左右图各真实列式说明时刻。',
      visual: {
        kind: 'place-counters',
        values: [40, 20, 60],
      },
    },
    {
      title: '左数线看箭头尾与尖',
      text: '原刻度20到90每十一个，箭头尾30、向右加50、尖80，填30+50=80。最左20只是刻度，不是箭头起点。本站重画完整刻度和原给定箭头。',
      activity: '真实填写三空并指箭头。',
      visual: {
        kind: 'bnu-whole-ten-line',
        scene: 'add',
        variant: 'main',
      },
    },
    {
      title: '右数线换方向和起点',
      text: '原刻度50到100每十一个，箭头尾90、向左减30、尖60，填90−30=60。不能从最左50开始，也不沿用上一题加的方向。',
      activity: '真实填写并读起点/方向/变化/终点。',
      visual: {
        kind: 'bnu-whole-ten-line',
        scene: 'subtract',
        variant: 'main',
      },
    },
    {
      title: '原摘数与自己提出的问题',
      text: '原丁丁40、当当30、毛毛50，树上未摘不计进已摘。任两人合量或比较差都可提合理问题，要完整条件所求/算式/单位/答句。三人合摘120是合理拓展但超本课100内，不能截为100；网站两人例题不代自己的开放提问。',
      activity: '真实自提问题、完整解答并交流。',
    },
    {
      title: '本站零与真实记录分开',
      text: '另换条件：2捆共20根全部拿走，剩0根。0是已知没有，不是未知或未填。自己的问题和方法原话保存，十三真实活动人工确认，未来计划另列，不因网页对就冒真实纸笔和交流已做。',
      activity: '记录实际已做、未做和将来计划。',
      visual: {
        kind: 'place-counters',
        values: [20, 0],
      },
    },
  ],
  questions: [
    {
      id: 'bnu-lower-rabbit-guests-plate-groups',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '原每盘10个果子，先有两盘、另一组三盘。依次填第一组盘数、第二组盘数、总盘数。',
      rule: {
        kind: 'steps',
        values: [2, 3, 5],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '2盘和3盘合5盘；每盘10，总果子50，但本题所求单位是盘。',
    },
    {
      id: 'bnu-lower-rabbit-guests-add-values',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '原每盘10个，两盘与三盘合起来，完整列20+30=50。依次填两个加数和总个数。',
      rule: {
        kind: 'steps',
        values: [20, 30, 50],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '2个十加3个十得5个十，果子50个，不是5个。',
      visual: {
        kind: 'place-counters',
        values: [20, 30, 50],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-add-forward',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '算20+30，按整十从20往后接着数三个十。依次写接着数的三个数（不重复写起点20）。',
      rule: {
        kind: 'steps',
        values: [30, 40, 50],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '接着数30、40、50，三次每次加10。',
    },
    {
      id: 'bnu-lower-rabbit-guests-add-tens',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '20+30=50，依次填第一数几个十、第二数几个十、和几个十。',
      rule: {
        kind: 'steps',
        values: [2, 3, 5],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '十的个数为2、3、5；数位珠实体5颗代表50。',
      visual: {
        kind: 'place-counters',
        values: [20, 30, 50],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-add-related',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '依次填2+3的结果和20+30的结果。',
      rule: {
        kind: 'steps',
        values: [5, 50],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '2+3=5是单位个数联系，20+30=50为五个十；两者不能写成同一个量。',
    },
    {
      id: 'bnu-lower-rabbit-guests-add-beads',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '十位每珠表示10。表示50的计数器十位5颗、个位0颗，实际材料珠合几颗？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '五颗十位珠表示50，材料5颗不同于表示数50。',
      visual: {
        kind: 'place-counters',
        values: [50],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-sub-values',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '原总50个果子，桌上留下40个，问小刺猬背走多少。依次填总数、桌上已知数、背走数。',
      rule: {
        kind: 'steps',
        values: [50, 40, 10],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '50−40=10所求是背走量；40是已知桌上量，不冒背走40。',
      visual: {
        kind: 'place-counters',
        values: [50, 40, 10],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-sub-backward',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '算50−40，每次往前数一个十，共四次。依次写从50接下来数的四个数，不重复起点50。',
      rule: {
        kind: 'steps',
        values: [40, 30, 20, 10],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '四次减10为40、30、20、10；得到一个十。',
    },
    {
      id: 'bnu-lower-rabbit-guests-sub-tens',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '50−40=10，依次填总数几个十、要在计算中扣除几个十、结果几个十。',
      rule: {
        kind: 'steps',
        values: [5, 4, 1],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '5个十减4个十是1个十；扣已知桌上40是数学拆分，不冒动物实际背走40。',
      visual: {
        kind: 'place-counters',
        values: [50, 40, 10],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-sub-related',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '依次填5−4的结果和50−40的结果。',
      rule: {
        kind: 'steps',
        values: [1, 10],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '单位联系1与一十10分清。',
    },
    {
      id: 'bnu-lower-rabbit-guests-sub-target',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '原有50，桌上留下40。50−40=10中的10表示什么？',
      rule: {
        kind: 'choice',
        value: '背走的果子个数',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '原所求背走多少，桌上40是已知另一部分。',
      choices: [
        {
          id: '背走的果子个数',
          label: '背走的果子个数',
        },
        {
          id: '桌上留下40的个数',
          label: '桌上留下40的个数',
        },
        {
          id: '总盘数',
          label: '总盘数',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-add-name-20',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '在指定算式20+30=50中，数字20的名称是什么？',
      rule: {
        kind: 'choice',
        value: '加数',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '按本算式位置，20叫加数；换算式须重新对应，不按物品固定名称。',
      choices: [
        {
          id: '加数',
          label: '加数',
        },
        {
          id: '和',
          label: '和',
        },
        {
          id: '减数',
          label: '减数',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-add-name-30',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '在指定算式20+30=50中，数字30的名称是什么？',
      rule: {
        kind: 'choice',
        value: '加数',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '按本算式位置，30叫加数；换算式须重新对应，不按物品固定名称。',
      choices: [
        {
          id: '加数',
          label: '加数',
        },
        {
          id: '差',
          label: '差',
        },
        {
          id: '和',
          label: '和',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-sum-name',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '在指定算式20+30=50中，数字50的名称是什么？',
      rule: {
        kind: 'choice',
        value: '和',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '按本算式位置，50叫和；换算式须重新对应，不按物品固定名称。',
      choices: [
        {
          id: '和',
          label: '和',
        },
        {
          id: '加数',
          label: '加数',
        },
        {
          id: '被减数',
          label: '被减数',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-minuend-name',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '在指定算式50−40=10中，数字50的名称是什么？',
      rule: {
        kind: 'choice',
        value: '被减数',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '按本算式位置，50叫被减数；换算式须重新对应，不按物品固定名称。',
      choices: [
        {
          id: '被减数',
          label: '被减数',
        },
        {
          id: '减数',
          label: '减数',
        },
        {
          id: '差',
          label: '差',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-subtrahend-name',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '在指定算式50−40=10中，数字40的名称是什么？',
      rule: {
        kind: 'choice',
        value: '减数',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '按本算式位置，40叫减数；换算式须重新对应，不按物品固定名称。',
      choices: [
        {
          id: '减数',
          label: '减数',
        },
        {
          id: '差',
          label: '差',
        },
        {
          id: '被减数',
          label: '被减数',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-difference-name',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '在指定算式50−40=10中，数字10的名称是什么？',
      rule: {
        kind: 'choice',
        value: '差',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '按本算式位置，10叫差；换算式须重新对应，不按物品固定名称。',
      choices: [
        {
          id: '差',
          label: '差',
        },
        {
          id: '减数',
          label: '减数',
        },
        {
          id: '和',
          label: '和',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-stick-add-bundles',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '明确把图中桌上四捆作为添加前的数量，接下来再加2捆，每捆10根。依次填原捆数、增加捆数、后来捆数。',
      rule: {
        kind: 'steps',
        values: [4, 2, 6],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '操作前4捆，增加2捆，操作后6捆；每捆内十根单位另算。',
    },
    {
      id: 'bnu-lower-rabbit-guests-stick-add',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '明确添加前桌上4捆，每捆10根，接下来再加2捆。依次填原根数、增加根数、后来根数。',
      rule: {
        kind: 'steps',
        values: [40, 20, 60],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '40+20=60根，不把2捆当2根。',
      visual: {
        kind: 'place-counters',
        values: [40, 20, 60],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-stick-sub-bundles',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '明确把桌上四捆作为拿走前的数量，接下来拿走2捆。依次填原捆数、拿走捆数、后来捆数。',
      rule: {
        kind: 'steps',
        values: [4, 2, 2],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '4−2=2捆，明确的动作前条件不可换成已经拿后。',
    },
    {
      id: 'bnu-lower-rabbit-guests-stick-sub',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '明确拿走前桌上4捆，每捆10根，接下来拿走2捆。依次填原根数、拿走根数、后来根数。',
      rule: {
        kind: 'steps',
        values: [40, 20, 20],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '40−20=20根；图中手上捆不擅自改变题目已明示的操作前数量。',
      visual: {
        kind: 'place-counters',
        values: [40, 20, 20],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-stick-after',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '另换时刻的本站题：已经拿走2捆，桌上现在还剩4捆，每捆10根。依次填原根数、已拿走根数、剩余根数。',
      rule: {
        kind: 'steps',
        values: [60, 20, 40],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '这次四捆明确为拿后，原来六捆60；与操作前四捆题分开，不混时刻。',
      visual: {
        kind: 'place-counters',
        values: [60, 20, 40],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-stick-unit',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '完整列式40+20=60，若题目问小棒根数，答句用哪个单位？',
      rule: {
        kind: 'choice',
        value: '根',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '每捆10根，6捆对应60根；单位要与所求一致。',
      choices: [
        {
          id: '根',
          label: '根',
        },
        {
          id: '捆',
          label: '捆',
        },
        {
          id: '珠',
          label: '珠',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-line-add',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '按原给定数线箭头读，依次填起点、增加量、终点，写完整加法的三个数。',
      rule: {
        kind: 'steps',
        values: [30, 50, 80],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '箭头尾30，向右加50到80，不把最左刻度20当起点。',
      visual: {
        kind: 'bnu-whole-ten-line',
        scene: 'add',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-line-sub',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '按原给定数线箭头读，依次填起点、减少量、终点，写完整减法的三个数。',
      rule: {
        kind: 'steps',
        values: [90, 30, 60],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '箭头尾90，向左减30到60，最左刻度50不是起点。',
      visual: {
        kind: 'bnu-whole-ten-line',
        scene: 'subtract',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-line-directions',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '这两条原数线加50与减30的箭头方向怎样？',
      rule: {
        kind: 'choice',
        value: '加50向右，减30向左',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '在从左到右递增数线，加向右、减向左；起终点也须一起核对。',
      choices: [
        {
          id: '加50向右，减30向左',
          label: '加50向右，减30向左',
        },
        {
          id: '两条都向右',
          label: '两条都向右',
        },
        {
          id: '两条都向左',
          label: '两条都向左',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-peach-values',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '原丁丁已摘40、当当已摘30、毛毛已摘50个。按丁丁、当当、毛毛顺序读写三个已摘数。',
      rule: {
        kind: 'steps',
        values: [40, 30, 50],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '只读每人给定已摘量，不加树上未摘。',
    },
    {
      id: 'bnu-lower-rabbit-guests-peach-pair-totals',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '原丁丁40、当当30、毛毛50个，问两人合摘。依次填丁丁与当当、丁丁与毛毛、当当与毛毛的总个数。',
      rule: {
        kind: 'steps',
        values: [70, 90, 80],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '40+30=70；40+50=90；30+50=80，各问题的两人不同。',
    },
    {
      id: 'bnu-lower-rabbit-guests-peach-pair-differences',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '原丁丁40、当当30、毛毛50个。依次填丁丁比当当多、毛毛比丁丁多、毛毛比当当多的个数。',
      rule: {
        kind: 'steps',
        values: [10, 10, 20],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '40−30=10；50−40=10；50−30=20。比较方向和参照都完整。',
    },
    {
      id: 'bnu-lower-rabbit-guests-peach-most',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '原丁丁40、当当30、毛毛50个，谁已摘最多？',
      rule: {
        kind: 'choice',
        value: '毛毛',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '50>40>30，不按图上树大小或未摘数量猜。',
      choices: [
        {
          id: '毛毛',
          label: '毛毛',
        },
        {
          id: '丁丁',
          label: '丁丁',
        },
        {
          id: '当当',
          label: '当当',
        },
      ],
    },
    {
      id: 'bnu-lower-rabbit-guests-site-zero',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '明确本站换条件：原有2捆，每捆10根，把全部20根拿走后，还剩几根？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '20−20=0是已知没有剩下；0不是未填写，也不是未知原图数量。',
      visual: {
        kind: 'place-counters',
        values: [20, 0],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-add-count',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '实际按每盘十个的原条件，从20接着数三个十，写30/40/50并解释每次10。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-add-tens',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '实际画或用安全材料表示2个十和3个十，合5个十，核对总50；图或材料不必购买计数器。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-add-related',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '实际完整写2+3=5和20+30=50，说清两式单位关系，不仅按网页确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-sub-count',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '实际从50往前数四个十，写40/30/20/10，完整核对。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-sub-tens',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '实际表示总5个十与桌上已知4个十，找另一部分1个十；说明该部分为背走，不把四十叫实际背走。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-sub-related',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '实际写5−4=1与50−40=10，完整说背走10和桌上40。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-names',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '实际指着两原算式说出全部两个加数/和、被减数/减数/差六位置。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-stick-add',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '回原两桌小棒图明确所用时刻，实际把左桌四捆作为添加前条件，按每捆10根完整列添加式和答句。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-stick-sub',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '回右图明确桌上四捆为拿前还是已拿后，在所约定时刻下完整列式和单位答句；与另换时刻题分开。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-line-add',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '实际在原左数线指30起点、加50向右及80终点，填完整三空并口述。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-line-sub',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '实际在原右数线指90起点、减30向左及60终点，填完整三空并口述。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-own-question',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '根据原三人已摘数实际提出自己的合理问题，写完整条件所求、算式、单位和答句；可不同于网站两人示例，不加未摘。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-actual-explain-question',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '实际向陪伴者解释自己的问题和解法，核对所求与答句；只在网页填示例不冒已经交流。',
      rule: {
        kind: 'manual',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation:
        '实际做过才确认；未做或只有未来计划请跳过。网页判分不替纸笔、拨画、口述或交流。',
    },
    {
      id: 'bnu-lower-rabbit-guests-own-question-record',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '记录自己实际提出的问题、完整条件、算式、单位和答句；合理不同问题不统一评分。若问三人合摘120，注明超本节100内的拓展，不截为100。',
      rule: {
        kind: 'reflection',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '保存孩子原话，correct:null；真实活动与未来计划分开。',
    },
    {
      id: 'bnu-lower-rabbit-guests-method-record',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '记录自己实际用了哪种整十加减方法，以及怎样分清所求与单位；原话保存不按喜好评分。',
      rule: {
        kind: 'reflection',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '保存孩子原话，correct:null；真实活动与未来计划分开。',
    },
    {
      id: 'bnu-lower-rabbit-guests-plan',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '另记下一次准备怎样核对或练习。计划不当已经完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '保存孩子原话，correct:null；真实活动与未来计划分开。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-rabbit-guests-review-add',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '本站新题：每盘10个，3盘与4盘合起来。依次填两组果子量和总量。',
      rule: {
        kind: 'steps',
        values: [30, 40, 70],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '3十+4十=7十70，原20+30不能照搬。',
      visual: {
        kind: 'place-counters',
        values: [30, 40, 70],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-review-forward',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '本站新题30+40，从30每次加10共四次。写四个接着数的数，不重复起点。',
      rule: {
        kind: 'steps',
        values: [40, 50, 60, 70],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '四次接着数40/50/60/70。',
    },
    {
      id: 'bnu-lower-rabbit-guests-review-taken',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '本站新题总80个、桌上留下50个，问背走多少。依次填总量、留下量、背走量。',
      rule: {
        kind: 'steps',
        values: [80, 50, 30],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '80−50=30背走，50是留下。',
      visual: {
        kind: 'place-counters',
        values: [80, 50, 30],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-review-stick-add',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '本站新题操作前桌上3捆，每捆10根，再添4捆。依次写原根数、增加根数、后来根数。',
      rule: {
        kind: 'steps',
        values: [30, 40, 70],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '30+40=70，先明确前时刻。',
      visual: {
        kind: 'place-counters',
        values: [30, 40, 70],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-review-stick-after',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '本站新题已经拿走3捆，现在桌上剩5捆，每捆10根。依次写原根数、拿走根数、剩根数。',
      rule: {
        kind: 'steps',
        values: [80, 30, 50],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '明确拿后五捆，原八捆80，与原时刻条件不同。',
      visual: {
        kind: 'place-counters',
        values: [80, 30, 50],
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-review-line-add',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '本站新复习数线，按箭头填起点、增加量、终点。',
      rule: {
        kind: 'steps',
        values: [20, 50, 70],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '新起点20加50到70；原30到80不照搬。',
      visual: {
        kind: 'bnu-whole-ten-line',
        scene: 'add',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-review-line-sub',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '本站新复习数线，按箭头填起点、减少量、终点。',
      rule: {
        kind: 'steps',
        values: [100, 40, 60],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '新起点100减40到60，减少量已变，不照原90−30。',
      visual: {
        kind: 'bnu-whole-ten-line',
        scene: 'subtract',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-rabbit-guests-review-peach-pair',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt:
        '本站新摘数丁丁20、当当40、毛毛30个。依次填丁丁与当当、丁丁与毛毛、当当与毛毛合摘个数。',
      rule: {
        kind: 'steps',
        values: [60, 50, 70],
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '新两人和分别60/50/70，不照原70/90/80。',
    },
    {
      id: 'bnu-lower-rabbit-guests-review-name',
      knowledge: 'bnu-lower-rabbit-guests',
      prompt: '本站新指定算式80−50=30，数字30叫什么？',
      rule: {
        kind: 'choice',
        value: '差',
      },
      hint: '先完整读出条件和所求，分清盘/捆/根/珠与代表的十，操作前后和背走/剩下分别看。数线按箭头起点方向终点读，开放自提问题要保留完整条件、单位和答句。',
      explanation: '在新算式位置，结果30是差；不将原加法中30加数名称固定沿用。',
      choices: [
        {
          id: '差',
          label: '差',
        },
        {
          id: '减数',
          label: '减数',
        },
        {
          id: '被减数',
          label: '被减数',
        },
      ],
    },
  ],
};
