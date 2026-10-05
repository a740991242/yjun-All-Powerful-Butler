import type { Lesson } from '../learning/types';

export const bnuLowerPineconesLesson: Lesson = {
  id: 'bnu-lower-pinecones',
  textbookTitle: '采松果',
  title: '两位数加减一位数与整十数：完整方法和全部练习',
  page: 64,
  version: 1,
  status: 'available',
  goal: '完整完成45+3与45−30三种方法、两算式解释、四实物计算、两条数线、全部八式及两生活问题，并如实记录自主问题和实际活动。',
  prerequisite: '认识100以内数位，能把十与一分开，理解合量与比较差。',
  parentTip:
    '依据印刷64～65两整页。按个位或整十变化分别计算，比较模型不冒真实拿走事件，两箭头起点22与89不按最左刻度猜；原全部四式/八式和两应用完整覆盖。原创图示不复制教材插画，十八真实活动人工、三个开放记录null与计划分开，旧ID版本/schema1不变，未知版印和最终教师审校保留，不以学校作开发前置。',
  review: {
    date: '2026-10-05',
    reviewer: '64～65两整页、三条条件、全部方法和练习及两箭头核对',
    notes:
      '八项原活动对应；最终教师试用未核验，不由网站正确率推实物和纸面已完成。',
  },
  steps: [
    {
      title: '先读三条采摘量',
      text: '妈妈45、孩子3、爸爸30，都是已采松果个数，示意图画的松果不能代替给定数量。妈妈与孩子合多少、妈妈比爸爸多多少是两种所求。',
      activity: '回原图完整读三条条件。',
      visual: {
        kind: 'place-counters',
        values: [45, 3, 30],
      },
    },
    {
      title: '45加3：从45接着数三个一',
      text: '依次46、47、48，起点45不重复计为增加的一次。四捆十和五单根再添三根为四捆八根，不满十无需捆新十。3+5=8再40+8=48。',
      activity: '三种加法方法各真实完成。',
      visual: {
        kind: 'place-counters',
        values: [45, 3, 48],
      },
    },
    {
      title: '45减30：比较差与按十倒数',
      text: '妈妈比爸爸多45−30=15。往前每次十，35、25、15；四个十减三个十剩一个十，五个一保持。排除爸爸对应量是在比较，不是妈妈实际拿走。',
      activity: '三种减法方法各真实完成。',
      visual: {
        kind: 'place-counters',
        values: [45, 30, 15],
      },
    },
    {
      title: '先说算式解决什么问题',
      text: '45−3可问妈妈比孩子多多少，42个；45+30可问父母共采多少，75个。数的来源、所求和单位先说明，不能只看到减号就编一个未给出的取走事件。',
      activity: '原两式各自己完整解释再算。',
    },
    {
      title: '原练1全部四式都摆',
      text: '32+5=37、75−40=35、78−6=72、68+30=98。先辨加减的是个位还是整十，再相同数位计算；每式分别摆取小棒，不能以一式示范代四次活动。',
      activity: '实际完成四式小棒摆取。',
    },
    {
      title: '左数线：一格一个一',
      text: '完整刻度21/22/23/24/25/26，尾在22向右三格到25，为22+3=25。最左21只是刻度，不是起点。',
      activity: '实际指箭头并完整填算式。',
      visual: {
        kind: 'bnu-pinecone-line',
        scene: 'add',
        variant: 'main',
      },
    },
    {
      title: '右数线：一格一个十',
      text: '刻度49/59/69/79/89/99，尾89向左三格到59，为89−30=59。三格表示30，不是3；最左49不是起点。',
      activity: '实际指方向、每格变化和终点。',
      visual: {
        kind: 'bnu-pinecone-line',
        scene: 'subtract',
        variant: 'main',
      },
    },
    {
      title: '原练3全部八式',
      text: '第一行4+65=69、85−30=55、40+4=44、72+5=77；第二行67−2=65、36+50=86、44−40=4、77−5=72。结果4可为一位数，不能补成40。',
      activity: '真实算完全部八式逐式复核。',
    },
    {
      title: '天鹅新增与恐龙比较',
      text: '55只天鹅又来20只，共75只；身长25米与2米，大的长23米。前者新增求合，后者比较求差，单位只和米分清。图片是示意，不从画的鸟只数改总数，也不量图比例当实际身长。',
      activity: '两问题各实际列式写单位答句。',
    },
    {
      title: '零、个人问题与计划分别记',
      text: '本站另换30根全拿走30根，剩0根；0是确定没有，不是未填。实际自编一个不进位或不退位的问题并解释，自己的方法和问题开放保存，未来计划独立，不自动确认十八实做。',
      activity: '分别记录实际活动和下一步计划。',
      visual: {
        kind: 'place-counters',
        values: [30, 0],
      },
    },
  ],
  questions: [
    {
      id: 'bnu-lower-pinecones-picked',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原妈妈采45个、孩子采3个、爸爸采30个。依次填三人采的松果个数。',
      rule: {
        kind: 'steps',
        values: [45, 3, 30],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '三个给定采摘量分别读取，图画不是逐个数量清单。',
    },
    {
      id: 'bnu-lower-pinecones-add-values',
      knowledge: 'bnu-lower-pinecones',
      prompt: '妈妈45个与孩子3个合起来，依次填两个加数和总个数。',
      rule: {
        kind: 'steps',
        values: [45, 3, 48],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '45+3=48个，个位5加3得8，十位4不变。',
      visual: {
        kind: 'place-counters',
        values: [45, 3, 48],
      },
    },
    {
      id: 'bnu-lower-pinecones-add-count',
      knowledge: 'bnu-lower-pinecones',
      prompt: '计算45+3，从45接着数三个一。按顺序填三个数，不重复写起点45。',
      rule: {
        kind: 'steps',
        values: [46, 47, 48],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '依次46、47、48，每次加1。',
    },
    {
      id: 'bnu-lower-pinecones-add-ones',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '45+3的小棒方法：四捆十保持，依次填原来单根数、添加单根数、合后单根数。',
      rule: {
        kind: 'steps',
        values: [5, 3, 8],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '5根加3根得8根，未满十不捆新十。',
    },
    {
      id: 'bnu-lower-pinecones-add-tens',
      knowledge: 'bnu-lower-pinecones',
      prompt: '45+3，依次填相加前45有几个十、相加后48有几个十。',
      rule: {
        kind: 'steps',
        values: [4, 4],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '加3个一没有改变四个十。',
    },
    {
      id: 'bnu-lower-pinecones-add-related',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原关联算式3+5与40+8，依次填两个结果。',
      rule: {
        kind: 'steps',
        values: [8, 48],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '3+5=8；40+8=48。',
    },
    {
      id: 'bnu-lower-pinecones-sub-values',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '妈妈45个，爸爸30个，妈妈比爸爸多多少个？依次填比较的两个数和差。',
      rule: {
        kind: 'steps',
        values: [45, 30, 15],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '45−30=15个，是比较差，不是妈妈实际拿走30。',
      visual: {
        kind: 'place-counters',
        values: [45, 30, 15],
      },
    },
    {
      id: 'bnu-lower-pinecones-sub-count',
      knowledge: 'bnu-lower-pinecones',
      prompt: '算45−30，从45按一个十往前数三次，依次填三个数，不重复起点45。',
      rule: {
        kind: 'steps',
        values: [35, 25, 15],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '依次35、25、15；不是每次减1。',
    },
    {
      id: 'bnu-lower-pinecones-sub-tens',
      knowledge: 'bnu-lower-pinecones',
      prompt: '45−30，依次填原十的个数、减去十的个数、剩十的个数。',
      rule: {
        kind: 'steps',
        values: [4, 3, 1],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '4个十减3个十剩1个十。',
    },
    {
      id: 'bnu-lower-pinecones-sub-ones',
      knowledge: 'bnu-lower-pinecones',
      prompt: '45−30不减个位，结果个位是几？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '5个一保持，剩1个十和5个一为15。',
    },
    {
      id: 'bnu-lower-pinecones-sub-related',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原40−30与10+5两个关联算式，依次填结果。',
      rule: {
        kind: 'steps',
        values: [10, 15],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '40−30=10，再10+5=15。',
    },
    {
      id: 'bnu-lower-pinecones-compare-meaning',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原45−30=15解决哪个问题？',
      rule: {
        kind: 'choice',
        value: '妈妈比爸爸多采多少个',
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '同单位45和30的差15，没给真实取走事件。',
      choices: [
        {
          id: '妈妈比爸爸多采多少个',
          label: '妈妈比爸爸多采多少个',
        },
        {
          id: '妈妈和爸爸一共采多少个',
          label: '妈妈和爸爸一共采多少个',
        },
        {
          id: '妈妈又采30个后有多少个',
          label: '妈妈又采30个后有多少个',
        },
      ],
    },
    {
      id: 'bnu-lower-pinecones-interpret-sub',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原45−3表示妈妈比孩子多采多少。依次填妈妈数、孩子数、差。',
      rule: {
        kind: 'steps',
        values: [45, 3, 42],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '45−3=42个，与妈妈比爸爸的45−30=15所求不同。',
    },
    {
      id: 'bnu-lower-pinecones-interpret-add',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原45+30表示妈妈和爸爸合采。依次填两人数和合量。',
      rule: {
        kind: 'steps',
        values: [45, 30, 75],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '45+30=75个，与妈妈和孩子合48分清。',
    },
    {
      id: 'bnu-lower-pinecones-stick-32',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练1：32+5，依次填两个加数与和。',
      rule: {
        kind: 'steps',
        values: [32, 5, 37],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '按相同数位计算，本题不进位或不退位；实际小棒摆取另记录。',
    },
    {
      id: 'bnu-lower-pinecones-stick-75',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练1：75−40，依次填被减数、减数和差。',
      rule: {
        kind: 'steps',
        values: [75, 40, 35],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '按相同数位计算，本题不进位或不退位；实际小棒摆取另记录。',
    },
    {
      id: 'bnu-lower-pinecones-stick-78',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练1：78−6，依次填被减数、减数和差。',
      rule: {
        kind: 'steps',
        values: [78, 6, 72],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '按相同数位计算，本题不进位或不退位；实际小棒摆取另记录。',
    },
    {
      id: 'bnu-lower-pinecones-stick-68',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练1：68+30，依次填两个加数与和。',
      rule: {
        kind: 'steps',
        values: [68, 30, 98],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '按相同数位计算，本题不进位或不退位；实际小棒摆取另记录。',
    },
    {
      id: 'bnu-lower-pinecones-line-add',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练2左数线，从箭头尾读起，依次填起点、增加的数、终点。',
      rule: {
        kind: 'steps',
        values: [22, 3, 25],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '箭头22向右加3到25，最左21不是起点。',
      visual: {
        kind: 'bnu-pinecone-line',
        scene: 'add',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-pinecones-line-sub',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练2右数线，从箭头尾读起，依次填起点、减少的数、终点。',
      rule: {
        kind: 'steps',
        values: [89, 30, 59],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '箭头89向左减30到59，最左49不是起点。',
      visual: {
        kind: 'bnu-pinecone-line',
        scene: 'subtract',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-pinecones-line-directions',
      knowledge: 'bnu-lower-pinecones',
      prompt: '左线每格1、右线每格10，怎样按箭头读？',
      rule: {
        kind: 'choice',
        value: '左向右三格加3，右向左三格减30',
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '同样三格，不同刻度间距表示不同变化量。',
      choices: [
        {
          id: '左向右三格加3，右向左三格减30',
          label: '左向右三格加3，右向左三格减30',
        },
        {
          id: '两图都加3',
          label: '两图都加3',
        },
        {
          id: '两图都减30',
          label: '两图都减30',
        },
      ],
    },
    {
      id: 'bnu-lower-pinecones-eight-top',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练3第一行：4+65、85−30、40+4、72+5，依次填四个结果。',
      rule: {
        kind: 'steps',
        values: [69, 55, 44, 77],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '个位和十位对齐分别算；原第一行四式全部完成。',
    },
    {
      id: 'bnu-lower-pinecones-eight-bottom',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原练3第二行：67−2、36+50、44−40、77−5，依次填四个结果。',
      rule: {
        kind: 'steps',
        values: [65, 86, 4, 72],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '44−40结果4是一位数，不补写成40；四式都完成。',
    },
    {
      id: 'bnu-lower-pinecones-swans',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '原练4有55只天鹅，又飞来20只，问现在共有多少只。依次填原数、新来数、现总数。',
      rule: {
        kind: 'steps',
        values: [55, 20, 75],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '55+20=75只，新来20与原55共同构成现在总量。',
    },
    {
      id: 'bnu-lower-pinecones-swans-meaning',
      knowledge: 'bnu-lower-pinecones',
      prompt: '有55只，又飞来20只，求现在总数应怎样算？',
      rule: {
        kind: 'choice',
        value: '把原数和新来数相加',
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '又飞来是新增，不是飞走；示意画出的鸟不代替给定55。',
      choices: [
        {
          id: '把原数和新来数相加',
          label: '把原数和新来数相加',
        },
        {
          id: '从55减20',
          label: '从55减20',
        },
        {
          id: '只数画面里的鸟',
          label: '只数画面里的鸟',
        },
      ],
    },
    {
      id: 'bnu-lower-pinecones-dinosaurs',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '原练5大恐龙身长25米，小恐龙2米，大的比小的长多少米？依次填两身长和差。',
      rule: {
        kind: 'steps',
        values: [25, 2, 23],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '25−2=23米，求差不是总长度27米。',
    },
    {
      id: 'bnu-lower-pinecones-dinosaurs-unit',
      knowledge: 'bnu-lower-pinecones',
      prompt: '两恐龙身长25米和2米，差23应写什么单位？',
      rule: {
        kind: 'choice',
        value: '米',
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '同单位长度比较，差仍以米计，不能用只。',
      choices: [
        {
          id: '米',
          label: '米',
        },
        {
          id: '只',
          label: '只',
        },
        {
          id: '个',
          label: '个',
        },
      ],
    },
    {
      id: 'bnu-lower-pinecones-site-zero',
      knowledge: 'bnu-lower-pinecones',
      prompt: '本站换条件：30根小棒全部拿走30根，还剩多少根？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '30−30=0根，确知没有不同于没填或未知。',
      visual: {
        kind: 'place-counters',
        values: [30, 0],
      },
    },
    {
      id: 'bnu-lower-pinecones-actual-add-count',
      knowledge: 'bnu-lower-pinecones',
      prompt: '实际从45接着数46/47/48，并说明每次增加一个一。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-add-sticks',
      knowledge: 'bnu-lower-pinecones',
      prompt: '实际摆四捆和五根，再添三根，核对四捆八根48。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-add-related',
      knowledge: 'bnu-lower-pinecones',
      prompt: '实际写3+5=8与40+8=48，说明同数位与总量联系。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-sub-count',
      knowledge: 'bnu-lower-pinecones',
      prompt: '实际从45按十往前数35/25/15，说明三次各减十。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-sub-sticks',
      knowledge: 'bnu-lower-pinecones',
      prompt: '实际从四捆五根排除三捆，余一捆五根15；解释是比较模型。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-sub-related',
      knowledge: 'bnu-lower-pinecones',
      prompt: '实际写40−30=10、10+5=15并解释个位5保持。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-interpret-sub',
      knowledge: 'bnu-lower-pinecones',
      prompt: '回原图真实说45与3是谁采的，提出45−3解决的问题并答完整句。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-interpret-add',
      knowledge: 'bnu-lower-pinecones',
      prompt: '回原图真实说45与30是谁采的，提出45+30解决的问题并答完整句。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-stick-32',
      knowledge: 'bnu-lower-pinecones',
      prompt: '用真实小棒完整摆取32+5并计算37。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-stick-75',
      knowledge: 'bnu-lower-pinecones',
      prompt: '用真实小棒完整摆取75−40并计算35。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-stick-78',
      knowledge: 'bnu-lower-pinecones',
      prompt: '用真实小棒完整摆取78−6并计算72。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-stick-68',
      knowledge: 'bnu-lower-pinecones',
      prompt: '用真实小棒完整摆取68+30并计算98。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-line-add',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原纸面左线完整填写22+3=25并指起点、箭头方向、终点。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-line-sub',
      knowledge: 'bnu-lower-pinecones',
      prompt: '原纸面右线完整填写89−30=59并指起点、箭头方向、终点。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-eight',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '实际完成练3全部八式，并逐式检查个位与十位；不是只做网站其中一行。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-swans',
      knowledge: 'bnu-lower-pinecones',
      prompt: '实际解释55只又飞来20只、列55+20=75并写现在75只的答句。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-dinosaurs',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '实际解释25米与2米的比较，列25−2=23并写长23米答句；不测绘图比例。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-actual-own',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '真实自己编一道同数位加减问题，写条件、所求、算式、单位和答句，并说明没有进退位。',
      rule: {
        kind: 'manual',
      },
      hint: '实际完成才确认；未做或只有计划请跳过。',
      explanation:
        '网页算对不代表纸笔、实物和口述已做，这些活动由实际完成者如实确认。',
    },
    {
      id: 'bnu-lower-pinecones-method-record',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '记录自己怎样分清个位增减与整十增减，哪一步还需要帮助；不设唯一原话。',
      rule: {
        kind: 'reflection',
      },
      hint: '按自己的实际情况记录，也可暂时跳过。',
      explanation: '个人记录correct:null，不自动确认真实操作或评定完成。',
    },
    {
      id: 'bnu-lower-pinecones-own-record',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '保存自己实际编的完整问题和答句，保留真实条件和单位；开放问题不按统一文本判对错。',
      rule: {
        kind: 'reflection',
      },
      hint: '按自己的实际情况记录，也可暂时跳过。',
      explanation: '个人记录correct:null，不自动确认真实操作或评定完成。',
    },
    {
      id: 'bnu-lower-pinecones-plan',
      knowledge: 'bnu-lower-pinecones',
      prompt: '单独记录未来准备做的练习或活动，不把计划写成已经完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '按自己的实际情况记录，也可暂时跳过。',
      explanation: '个人记录correct:null，不自动确认真实操作或评定完成。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-pinecones-review-add',
      knowledge: 'bnu-lower-pinecones',
      prompt: '本站新题：52+4，依次填两个加数与和。',
      rule: {
        kind: 'steps',
        values: [52, 4, 56],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '个位2加4得6，五个十保持。',
      visual: {
        kind: 'place-counters',
        values: [52, 4, 56],
      },
    },
    {
      id: 'bnu-lower-pinecones-review-count',
      knowledge: 'bnu-lower-pinecones',
      prompt: '算52+4，从52接着数四个一，依次填四个数，不重复起点。',
      rule: {
        kind: 'steps',
        values: [53, 54, 55, 56],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '53/54/55/56与原46/47/48不同。',
    },
    {
      id: 'bnu-lower-pinecones-review-sub',
      knowledge: 'bnu-lower-pinecones',
      prompt:
        '本站新题：姐姐67个、弟弟40个，姐姐比弟弟多多少？依次填两个数和差。',
      rule: {
        kind: 'steps',
        values: [67, 40, 27],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '67−40=27，个位7保持。',
      visual: {
        kind: 'place-counters',
        values: [67, 40, 27],
      },
    },
    {
      id: 'bnu-lower-pinecones-review-interpret',
      knowledge: 'bnu-lower-pinecones',
      prompt: '另换姐姐67个、孩子4个，姐姐比孩子多多少？依次填两个数和差。',
      rule: {
        kind: 'steps',
        values: [67, 4, 63],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '67−4=63，比较对象和原题不同。',
    },
    {
      id: 'bnu-lower-pinecones-review-sticks',
      knowledge: 'bnu-lower-pinecones',
      prompt: '本站四新式41+7、82−40、59−6、67+30，依次填四结果。',
      rule: {
        kind: 'steps',
        values: [48, 42, 53, 97],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '全部重新按相同数位计算，不复制原四式结果。',
    },
    {
      id: 'bnu-lower-pinecones-review-line-add',
      knowledge: 'bnu-lower-pinecones',
      prompt: '本站改箭头：依次填起点、增加量、终点。',
      rule: {
        kind: 'steps',
        values: [23, 2, 25],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '新箭头23向右加2到25，末点相同也不代表起点与变化量相同。',
      visual: {
        kind: 'bnu-pinecone-line',
        scene: 'add',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-pinecones-review-line-sub',
      knowledge: 'bnu-lower-pinecones',
      prompt: '本站改箭头：依次填起点、减少量、终点。',
      rule: {
        kind: 'steps',
        values: [99, 20, 79],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '新箭头99向左减20到79。',
      visual: {
        kind: 'bnu-pinecone-line',
        scene: 'subtract',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-pinecones-review-swans',
      knowledge: 'bnu-lower-pinecones',
      prompt: '本站新题：原43只，又飞来20只。依次填原数、新来数、现总数。',
      rule: {
        kind: 'steps',
        values: [43, 20, 63],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '43+20=63只，原题75不再适用。',
    },
    {
      id: 'bnu-lower-pinecones-review-dinosaurs',
      knowledge: 'bnu-lower-pinecones',
      prompt: '本站新题：大恐龙32米、小恐龙5米。依次填两身长和相差米数。',
      rule: {
        kind: 'steps',
        values: [32, 5, 27],
      },
      hint: '先读完整条件与所求，个位与十位分别看；数线从箭头尾读起。比较差、两部分合量和动作后剩余不能混，单位和答句都写清。',
      explanation: '32−5=27米，求差，不求总长37米。',
    },
  ],
};
