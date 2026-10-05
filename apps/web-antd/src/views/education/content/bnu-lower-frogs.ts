import type { Lesson } from '../learning/types';

export const bnuLowerFrogsLesson: Lesson = {
  id: 'bnu-lower-frogs',
  textbookTitle: '青蛙吃虫子',
  title: '两位数加减两位数：三种方法与两段数线',
  page: 66,
  version: 1,
  status: 'available',
  goal: '完整完成65与32的三种加减方法、全部八练习式、两段数线与两应用，实际拨珠说明并自己编问题。',
  prerequisite:
    '认识百以内十与个位，理解不进位不退位的同数位计算、合量与比较差。',
  parentTip:
    '依据66～67整页和67数线放大。两方法组及所有练习完整对应；两段先十后个，中间点与最后点分别看，原终点未标数不在原创图泄额外答案。比较差不冒实际取走、简图键数与未说明司机不补造。十七实做人工、三个开放记录null与计划分别保存；旧ID/版本/schema1保持、未知版印与最终教师试用如实，不以学校作开发前置。',
  review: {
    date: '2026-10-05',
    reviewer: '66～67两整页和数线放大、全部方法/练习/条件核对',
    notes: '七原活动完整对应，原创图与真实操作分清；最终教师试用未核验。',
  },
  steps: [
    {
      title: '两条已吃量与两种所求',
      text: '原大青蛙已吃65只、小青蛙32只。合吃多少求总量，小比大少多少求比较差；不补青蛙未来继续吃或真实取走的事件。',
      activity: '真实读出两条件、分别说所求。',
      visual: {
        kind: 'place-counters',
        values: [65, 32],
      },
    },
    {
      title: '加法先整十再个位',
      text: '65+32拆为65+30=95，再95+2=97。95是中间结果，不能停在第一步当最终答案。',
      activity: '实际写两步计算并解释。',
      visual: {
        kind: 'place-counters',
        values: [65, 95, 97],
      },
    },
    {
      title: '拨珠与同数位相加',
      text: '6十5一同位添3十2一，得9十7一97；材料9+7=16珠不同于97。另一方法60+30=90、5+2=7、90+7=97，三个方法分别完成。',
      activity: '实际拨珠和分数位计算。',
      visual: {
        kind: 'place-counters',
        values: [65, 32, 97],
      },
    },
    {
      title: '比较差先减整十再个位',
      text: '小比大少的差用65−32。先65−30=35再35−2=33；不是32−65，也不是青蛙真的吐出32。',
      activity: '实际写两步并说明比较。',
      visual: {
        kind: 'place-counters',
        values: [65, 35, 33],
      },
    },
    {
      title: '拨珠与同数位相减',
      text: '6十5一排除3十2一，剩3十3一表示33，材料六珠不当数量6。60−30=30、5−2=3、30+3=33；不退位时同位分别减。',
      activity: '实际完整拨珠并写关联三式。',
      visual: {
        kind: 'place-counters',
        values: [65, 32, 33],
      },
    },
    {
      title: '上方四式与练1四式都完成',
      text: '原上方36+3=39、57−4=53、65−31=34、41+47=88并说注意相同数位；练1另46+23=69、37−25=12、45−24=21、56+42=98各真实拨，不以一组代另一组。',
      activity: '完成全部八式及同数位解释。',
    },
    {
      title: '左两段：中间67不是终点',
      text: '原全刻度37/47/57/67/77/87。从37加30到67，再加2到69；两段合加32，所以37+32=69。最后点在67与77间，原图未额外标69，不把中间67当最终结果。',
      activity: '原纸面完整填写并指两段顺序。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'add',
        variant: 'main',
      },
    },
    {
      title: '右两段：中间36不是终点',
      text: '原全刻度26/36/46/56/66/76。从76减40到36，再减3到33；合减43，76−43=33。最后点在26与36间，最左26不当起点，中间36不当终点。',
      activity: '原纸面完整填写并指方向。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'subtract',
        variant: 'main',
      },
    },
    {
      title: '钢琴合量与车上下车分清',
      text: '原36个黑键和52个白键合88个，按给定不从简图猜也不泛化任何键盘；原车23人、12到站下车，现11人，未说明新上车或司机额外人数不能补。',
      activity: '两应用各列式、单位与完整答句。',
    },
    {
      title: '零、自己的问题与计划分记',
      text: '本站计数器30排除30为0，已知没有不同于未填。自己的问题和方法开放记录；十七真实纸笔/拨珠/口述活动人工确认，未来计划独立，不自动评完成。',
      activity: '如实记录实际已做与准备做。',
      visual: {
        kind: 'place-counters',
        values: [30, 0],
      },
    },
  ],
  questions: [
    {
      id: 'bnu-lower-frogs-frog-values',
      knowledge: 'bnu-lower-frogs',
      prompt: '原大青蛙已吃65只虫子、小青蛙已吃32只。依次填两条给定量。',
      rule: {
        kind: 'steps',
        values: [65, 32],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '同一次给定情境的两份已吃量，示意图不逐虫计数。',
    },
    {
      id: 'bnu-lower-frogs-add-values',
      knowledge: 'bnu-lower-frogs',
      prompt: '两只青蛙合吃，依次填两份已吃量与合量。',
      rule: {
        kind: 'steps',
        values: [65, 32, 97],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '65+32=97只，不进位时相同数位分别加。',
      visual: {
        kind: 'place-counters',
        values: [65, 32, 97],
      },
    },
    {
      id: 'bnu-lower-frogs-add-sequential',
      knowledge: 'bnu-lower-frogs',
      prompt: '原先65+30再加2，依次填第一步结果与最终结果。',
      rule: {
        kind: 'steps',
        values: [95, 97],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '65+30=95，95+2=97；95只是中间量。',
    },
    {
      id: 'bnu-lower-frogs-add-tens',
      knowledge: 'bnu-lower-frogs',
      prompt: '原十位方法60+30，依次填两个整十量与结果。',
      rule: {
        kind: 'steps',
        values: [60, 30, 90],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '六十加三十得九十，单位十与个分清。',
    },
    {
      id: 'bnu-lower-frogs-add-ones',
      knowledge: 'bnu-lower-frogs',
      prompt: '原个位方法5+2，依次填两个个位量与结果。',
      rule: {
        kind: 'steps',
        values: [5, 2, 7],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '五个一加两个一得七个一，无进位。',
    },
    {
      id: 'bnu-lower-frogs-add-combine',
      knowledge: 'bnu-lower-frogs',
      prompt: '把十位90与个位7合并，依次填两部分与总量。',
      rule: {
        kind: 'steps',
        values: [90, 7, 97],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '90+7=97。',
    },
    {
      id: 'bnu-lower-frogs-add-counter-digits',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '计数器65添加32后为97。依次填前十位/前个位、添加十位/添加个位、后十位/后个位六项珠数。',
      rule: {
        kind: 'steps',
        values: [6, 5, 3, 2, 9, 7],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '十位6加3为9珠，个位5加2为7珠；每十位珠表示十。',
      visual: {
        kind: 'place-counters',
        values: [65, 32, 97],
      },
    },
    {
      id: 'bnu-lower-frogs-add-beads',
      knowledge: 'bnu-lower-frogs',
      prompt: '计数器97十位9颗、个位7颗，实际材料珠共几颗？',
      rule: {
        kind: 'number',
        value: 16,
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '9+7=16颗材料珠，表示数97不同于实体珠数16。',
      visual: {
        kind: 'place-counters',
        values: [97],
      },
    },
    {
      id: 'bnu-lower-frogs-sub-values',
      knowledge: 'bnu-lower-frogs',
      prompt: '原小青蛙比大青蛙少吃多少？依次填用于比较的大数、小数与差。',
      rule: {
        kind: 'steps',
        values: [65, 32, 33],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '65−32=33只，小比大少的差用大减小，不写32−65。',
      visual: {
        kind: 'place-counters',
        values: [65, 32, 33],
      },
    },
    {
      id: 'bnu-lower-frogs-sub-sequential',
      knowledge: 'bnu-lower-frogs',
      prompt: '原从65先减30再减2，依次填第一步结果与最终差。',
      rule: {
        kind: 'steps',
        values: [35, 33],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '65−30=35，35−2=33。',
    },
    {
      id: 'bnu-lower-frogs-sub-tens',
      knowledge: 'bnu-lower-frogs',
      prompt: '原十位60−30，依次填被减数、减数与差。',
      rule: {
        kind: 'steps',
        values: [60, 30, 30],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '六十减三十得三十。',
    },
    {
      id: 'bnu-lower-frogs-sub-ones',
      knowledge: 'bnu-lower-frogs',
      prompt: '原个位5−2，依次填被减数、减数与差。',
      rule: {
        kind: 'steps',
        values: [5, 2, 3],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '五个一减两个一得三个一，不退位。',
    },
    {
      id: 'bnu-lower-frogs-sub-combine',
      knowledge: 'bnu-lower-frogs',
      prompt: '原把30与3合并，依次填两个部分与最终差。',
      rule: {
        kind: 'steps',
        values: [30, 3, 33],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '30+3=33只，是两条已吃量的比较差。',
    },
    {
      id: 'bnu-lower-frogs-sub-counter-digits',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '65减32的计数器，依次填前十位/前个位、排除十位/排除个位、后十位/后个位六项珠数。',
      rule: {
        kind: 'steps',
        values: [6, 5, 3, 2, 3, 3],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '十位6减3得3、个位5减2得3，剩六颗材料珠代表33。',
      visual: {
        kind: 'place-counters',
        values: [65, 32, 33],
      },
    },
    {
      id: 'bnu-lower-frogs-sub-beads',
      knowledge: 'bnu-lower-frogs',
      prompt: '表示33的计数器十位3颗、个位3颗，实际材料珠共几颗？',
      rule: {
        kind: 'number',
        value: 6,
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '六颗材料珠表示33，不是表示值6。',
      visual: {
        kind: 'place-counters',
        values: [33],
      },
    },
    {
      id: 'bnu-lower-frogs-comparison-meaning',
      knowledge: 'bnu-lower-frogs',
      prompt: '小青蛙比大青蛙少吃多少，65−32解决的是什么？',
      rule: {
        kind: 'choice',
        value: '两条已吃量的比较差',
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '已吃65和32的差33；没有给出真实取走虫子的事件。',
      choices: [
        {
          id: '两条已吃量的比较差',
          label: '两条已吃量的比较差',
        },
        {
          id: '两只合吃的总量',
          label: '两只合吃的总量',
        },
        {
          id: '小青蛙又吃32后的数量',
          label: '小青蛙又吃32后的数量',
        },
      ],
    },
    {
      id: 'bnu-lower-frogs-discussion-four',
      knowledge: 'bnu-lower-frogs',
      prompt: '原67页上方36+3、57−4、65−31、41+47，依次填四结果。',
      rule: {
        kind: 'steps',
        values: [39, 53, 34, 88],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '全部四式分别按相同数位加减，不只完成一式。',
    },
    {
      id: 'bnu-lower-frogs-same-place',
      knowledge: 'bnu-lower-frogs',
      prompt: '不进位或不退位的两位数加减，应怎样对齐数位？',
      rule: {
        kind: 'choice',
        value: '十位和十位、个位和个位分别计算',
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '对应数位表示相同单位，不能十位与个位交叉算。',
      choices: [
        {
          id: '十位和十位、个位和个位分别计算',
          label: '十位和十位、个位和个位分别计算',
        },
        {
          id: '把个位和十位互换',
          label: '把个位和十位互换',
        },
        {
          id: '忽略个位只算整十',
          label: '忽略个位只算整十',
        },
      ],
    },
    {
      id: 'bnu-lower-frogs-counter-46',
      knowledge: 'bnu-lower-frogs',
      prompt: '原练1：46+23，依次填两个加数与和。',
      rule: {
        kind: 'steps',
        values: [46, 23, 69],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '十位/个位分别计算，全部原四式拨珠操作另各如实记录。',
    },
    {
      id: 'bnu-lower-frogs-counter-37',
      knowledge: 'bnu-lower-frogs',
      prompt: '原练1：37−25，依次填被减数、减数与差。',
      rule: {
        kind: 'steps',
        values: [37, 25, 12],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '十位/个位分别计算，全部原四式拨珠操作另各如实记录。',
    },
    {
      id: 'bnu-lower-frogs-counter-45',
      knowledge: 'bnu-lower-frogs',
      prompt: '原练1：45−24，依次填被减数、减数与差。',
      rule: {
        kind: 'steps',
        values: [45, 24, 21],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '十位/个位分别计算，全部原四式拨珠操作另各如实记录。',
    },
    {
      id: 'bnu-lower-frogs-counter-56',
      knowledge: 'bnu-lower-frogs',
      prompt: '原练1：56+42，依次填两个加数与和。',
      rule: {
        kind: 'steps',
        values: [56, 42, 98],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '十位/个位分别计算，全部原四式拨珠操作另各如实记录。',
    },
    {
      id: 'bnu-lower-frogs-line-add-points',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '原练2左图，依次填起点、第一段增加量、中间点、第二段增加量、终点五项。',
      rule: {
        kind: 'steps',
        values: [37, 30, 67, 2, 69],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '从37加30到67，再加2到69；67不是终点。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'add',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-frogs-line-add-combined',
      knowledge: 'bnu-lower-frogs',
      prompt: '按原左图写合起来的算式，依次填起点、两段合增加量、最终结果。',
      rule: {
        kind: 'steps',
        values: [37, 32, 69],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '两段30和2合32，37+32=69。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'add',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-frogs-line-sub-points',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '原练2右图，依次填起点、第一段减少量、中间点、第二段减少量、终点五项。',
      rule: {
        kind: 'steps',
        values: [76, 40, 36, 3, 33],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '从76减40到36，再减3到33；36只是中间点。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'subtract',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-frogs-line-sub-combined',
      knowledge: 'bnu-lower-frogs',
      prompt: '按原右图写合起来的算式，依次填起点、两段合减少量、最终结果。',
      rule: {
        kind: 'steps',
        values: [76, 43, 33],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '两段40和3合43，76−43=33。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'subtract',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-frogs-line-final',
      knowledge: 'bnu-lower-frogs',
      prompt: '原两条线，最终答案应该读哪一点？',
      rule: {
        kind: 'choice',
        value: '第二段箭头的终点',
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '两段按顺序发生，第一段落点仅为中间点。',
      choices: [
        {
          id: '第二段箭头的终点',
          label: '第二段箭头的终点',
        },
        {
          id: '第一段箭头的终点',
          label: '第一段箭头的终点',
        },
        {
          id: '两图都从最左刻度猜',
          label: '两图都从最左刻度猜',
        },
      ],
    },
    {
      id: 'bnu-lower-frogs-piano-values',
      knowledge: 'bnu-lower-frogs',
      prompt: '原练3钢琴36个黑键、52个白键。依次填两个部分数量与总键数。',
      rule: {
        kind: 'steps',
        values: [36, 52, 88],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '36+52=88个，按题目给定，不从简图逐键猜数。',
    },
    {
      id: 'bnu-lower-frogs-piano-unit',
      knowledge: 'bnu-lower-frogs',
      prompt: '36个黑键和52个白键合88，原题的数量单位是什么？',
      rule: {
        kind: 'choice',
        value: '个',
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '原给定键的数量以个计，不能写88人。',
      choices: [
        {
          id: '个',
          label: '个',
        },
        {
          id: '人',
          label: '人',
        },
        {
          id: '米',
          label: '米',
        },
      ],
    },
    {
      id: 'bnu-lower-frogs-bus-values',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '原练4车上原有23人、12人到站下车。依次填原数、下车人数、现在人数。',
      rule: {
        kind: 'steps',
        values: [23, 12, 11],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '23−12=11人，没有给新上车人数，按同一统计口径计算。',
    },
    {
      id: 'bnu-lower-frogs-bus-meaning',
      knowledge: 'bnu-lower-frogs',
      prompt: '原23人有12人到站下车，求现在人数应怎样做？',
      rule: {
        kind: 'choice',
        value: '原人数减下车人数',
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '下车减少在车人数，不加12也不补未给司机人数。',
      choices: [
        {
          id: '原人数减下车人数',
          label: '原人数减下车人数',
        },
        {
          id: '原人数加下车人数',
          label: '原人数加下车人数',
        },
        {
          id: '另加一位未说明的司机',
          label: '另加一位未说明的司机',
        },
      ],
    },
    {
      id: 'bnu-lower-frogs-site-zero',
      knowledge: 'bnu-lower-frogs',
      prompt: '本站另换计数器表示30，排除30后表示多少？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '30−30=0，确定没有与未填/未知分清。',
      visual: {
        kind: 'place-counters',
        values: [30, 0],
      },
    },
    {
      id: 'bnu-lower-frogs-actual-add-sequential',
      knowledge: 'bnu-lower-frogs',
      prompt: '真实写65+30=95、95+2=97并解释为什么先整十再个位。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-add-counter',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '真实拨表示65的6十5一，再同位添3十2一得9十7一；读97并说明材料珠16与表示值区别。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-add-place',
      knowledge: 'bnu-lower-frogs',
      prompt: '真实写60+30=90、5+2=7、90+7=97，完整解释十与一方法。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-sub-sequential',
      knowledge: 'bnu-lower-frogs',
      prompt: '真实写65−30=35、35−2=33并解释中间与最终量。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-sub-counter',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '真实从6十5一同位排除3十2一，剩3十3一，说明是比较模型不是动物取走事件。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-sub-place',
      knowledge: 'bnu-lower-frogs',
      prompt: '真实写60−30=30、5−2=3、30+3=33并说明相同数位。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-discussion-four',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际完成原67上方全部四算式，并逐项复核数位。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-place-explain',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '实际说怎样按相同数位加减，结合一加一减例子完整解释，不只复述口号。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-counter-46',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际用计数器拨46+23并核对69。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-counter-37',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际用计数器拨37−25并核对12。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-counter-45',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际用计数器拨45−24并核对21。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-counter-56',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际用计数器拨56+42并核对98。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-line-add',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际回原纸面按两段箭头读，完整填写37+32=69并说明中间67。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-line-sub',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际回原纸面按两段箭头读，完整填写76−43=33并说明中间36。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-piano',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际按原黑白键条件列式36+52=88个并写完整答句，不从简图猜总数。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-bus',
      knowledge: 'bnu-lower-frogs',
      prompt: '实际解释原车23/下车12，列23−12=11并写答句，不补未给事件。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-actual-own',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '真实自己编一道不进位或不退位的两位数加减问题，写完整条件、所求、算式、单位、答句并交流。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认；尚未做或只有计划请跳过。',
      explanation:
        '网页正确不代表纸笔、实物拨珠或口述已完成，真实活动人工确认。',
    },
    {
      id: 'bnu-lower-frogs-method-record',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '记录实际怎样按同数位计算、怎样分中间点与终点，保留自己的原话和仍需帮助的地方。',
      rule: {
        kind: 'reflection',
      },
      hint: '按实际情况记录，也可跳过。',
      explanation: '开放原话correct:null，与实际人工确认和未来计划分别保存。',
    },
    {
      id: 'bnu-lower-frogs-own-record',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '记录实际自己编的完整问题及解答，允许不同合理条件，不统一判个人原话对错。',
      rule: {
        kind: 'reflection',
      },
      hint: '按实际情况记录，也可跳过。',
      explanation: '开放原话correct:null，与实际人工确认和未来计划分别保存。',
    },
    {
      id: 'bnu-lower-frogs-plan',
      knowledge: 'bnu-lower-frogs',
      prompt: '单独记录将来准备做的活动和练习；未来计划不当已完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '按实际情况记录，也可跳过。',
      explanation: '开放原话correct:null，与实际人工确认和未来计划分别保存。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-frogs-review-add',
      knowledge: 'bnu-lower-frogs',
      prompt: '本站新题42+25，依次填两个数与和。',
      rule: {
        kind: 'steps',
        values: [42, 25, 67],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '42+25=67，同数位分别算。',
      visual: {
        kind: 'place-counters',
        values: [42, 25, 67],
      },
    },
    {
      id: 'bnu-lower-frogs-review-add-sequential',
      knowledge: 'bnu-lower-frogs',
      prompt: '算42+25先加20再加5，依次填中间结果与最终结果。',
      rule: {
        kind: 'steps',
        values: [62, 67],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '42+20=62，再加5=67，不复制原95/97。',
    },
    {
      id: 'bnu-lower-frogs-review-sub',
      knowledge: 'bnu-lower-frogs',
      prompt: '本站新题大数87、小数34，依次填两数与比较差。',
      rule: {
        kind: 'steps',
        values: [87, 34, 53],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '87−34=53，不是原差33。',
      visual: {
        kind: 'place-counters',
        values: [87, 34, 53],
      },
    },
    {
      id: 'bnu-lower-frogs-review-sub-sequential',
      knowledge: 'bnu-lower-frogs',
      prompt: '算87−34先减30再减4，依次填中间与最终结果。',
      rule: {
        kind: 'steps',
        values: [57, 53],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '87−30=57，再减4=53。',
    },
    {
      id: 'bnu-lower-frogs-review-counters',
      knowledge: 'bnu-lower-frogs',
      prompt: '本站四新式56+22、48−26、67−34、57+42，依次填四结果。',
      rule: {
        kind: 'steps',
        values: [78, 22, 33, 99],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '每式重新同数位计算，不复制原四计数器答案。',
    },
    {
      id: 'bnu-lower-frogs-review-line-add',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '本站改两段箭头，依次填起点、第一段增加、中间点、第二段增加、终点五项。',
      rule: {
        kind: 'steps',
        values: [47, 20, 67, 4, 71],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '新条件47加20到67，再加4到71。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'add',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-frogs-review-line-sub',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '本站改两段箭头，依次填起点、第一段减少、中间点、第二段减少、终点五项。',
      rule: {
        kind: 'steps',
        values: [76, 30, 46, 2, 44],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '新条件76减30到46，再减2到44。',
      visual: {
        kind: 'bnu-two-jump-line',
        scene: 'subtract',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-frogs-review-piano',
      knowledge: 'bnu-lower-frogs',
      prompt: '本站另一个键盘24个黑键、53个白键，依次填两部分与总键数。',
      rule: {
        kind: 'steps',
        values: [24, 53, 77],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '24+53=77个，不推所有键盘都88键。',
    },
    {
      id: 'bnu-lower-frogs-review-bus',
      knowledge: 'bnu-lower-frogs',
      prompt:
        '本站另换原车34人、下车12人且无人上车，依次填原数、下车数、现人数。',
      rule: {
        kind: 'steps',
        values: [34, 12, 22],
      },
      hint: '读完整条件和所求，十与一分别计算。两段数线按箭头顺序读，中间点不是终点；合量、比较差和下车剩余要分清，单位及答句写完整。',
      explanation: '34−12=22人，不能复制原11。',
    },
  ],
};
