import type { Lesson } from '../learning/types';

export const bnuLowerWrittenLesson: Lesson = {
  id: 'bnu-lower-written',
  textbookTitle: '算一算',
  title: '算筹、同数位竖式与完整练习',
  page: 68,
  version: 1,
  status: 'available',
  goal: '完整对应68～69算筹、两阶段加法、减法计数器与竖式、两组连线、四道计算和每人一瓶水应用。',
  prerequisite: '认识百以内十与个位，会同数位不进位加法和不退位减法。',
  parentTip:
    '原68～69整页与69放大核对；筹形限定1～4，不把纵式与现代竖式混称。空与0分清；真实十二项人工、三个开放记录null、计划独立。未知ISBN版印与最终教师试用如实，学校不是开发前置。',
  review: {
    date: '2026-10-05',
    reviewer: '两整页及连线/计数器放大核对',
    notes: '全部六原活动对应，最终教师试用未核验。',
  },
  steps: [
    {
      title: '按位置读算筹',
      text: '本两位数图十位横筹每根表示一个十，个位纵筹每根表示一个一。三行依次是12、31、43。古代算筹的纵式名称与现代竖式不同；本图只画1～4的筹形，不把五以上的筹形简化为重复棒。',
      activity: '实际指三行，逐位读并解释。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-add',
        variant: 'main',
      },
    },
    {
      title: '个位先算，十位仍待填',
      text: '12+31的个位2+1=3，先在结果个位写3。十位此时尚未填，图中A表示待填，不当作0，也不当成已经算完的03。',
      activity: '在纸上写第一阶段并指出尚未完成处。',
      visual: {
        kind: 'bnu-written',
        scene: 'add-stage',
        variant: 'main',
      },
    },
    {
      title: '完成加法竖式',
      text: '十位1+3=4，补在结果十位，得到43。两个加数相同数位上下对齐，+写第二行左边，横线下写结果；算筹、计数器和竖式共同表示十与一。',
      activity: '实际完整写12+31=43并解释各列。',
      visual: {
        kind: 'bnu-written',
        scene: 'add-final',
        variant: 'main',
      },
    },
    {
      title: '减法算筹与计数器',
      text: '34的3十4一减去22的2十2一，余1十2一12。计数器十位3颗取2颗，个位4颗取2颗；剩三颗实体珠表示12，珠数和数值不同。',
      activity: '分别实际摆筹、拨珠，说清移除与剩余。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-sub',
        variant: 'main',
      },
    },
    {
      title: '自己填减法竖式',
      text: '34−22先个位4−2=2、再十位3−2=1。结果十位A、个位B留给自己填；−在第二行左，不能倒写成22−34。',
      activity: '纸笔完整写减法并逐位核对。',
      visual: {
        kind: 'bnu-written',
        scene: 'sub-blank',
        variant: 'main',
      },
    },
    {
      title: '回看完成的减法',
      text: '结果12对应1十2一，和算筹最后行、计数器剩余一致。先自己填再回看，图示不会自动确认真实操作。',
      activity: '把自己写的竖式与完成示意比较。',
      visual: {
        kind: 'bnu-written',
        scene: 'sub-final',
        variant: 'main',
      },
    },
    {
      title: '连线按数和运算判断',
      text: '左A与左B是两组算筹，右C与右D是两组完成竖式。逐行读出数，判断相加还是相减，再选择对应的右图；不要按同一高低位置连。',
      activity: '回合法原书完成两条连线并说明理由。',
      visual: {
        kind: 'bnu-written',
        scene: 'matching',
        variant: 'main',
      },
    },
    {
      title: '四道竖式都完成',
      text: '依次是44+32、54−23、76+23、68−11。四图按从左到右、从上到下阅读，各结果先十位再个位给A～H，所有空格由自己填写。每式同数位计算并逐一检查。',
      activity: '实际在纸上写全部四竖式、横式与结果。',
      visual: {
        kind: 'bnu-written',
        scene: 'practice',
        variant: 'main',
      },
    },
    {
      title: '每人一瓶水',
      text: '原有48瓶，36人，每人1瓶，所以需给36瓶，剩48−36=12瓶。人数单位人，水单位瓶；几个人或瓶的示意画不替代给定总数，不要求真实购买或分水。',
      activity: '读条件，纸面列竖式、单位与完整答句。',
    },
    {
      title: '真实完成、原话和计划分别记',
      text: '本站新条件20−20=0表示已知用完，不是未填写。真实操作、口述和纸笔分别人工确认；自己的方法和困难开放记录，未来计划不当已完成。',
      activity: '如实保存已做与待做。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-written-rod-add-values',
      knowledge: 'bnu-lower-written',
      prompt: '读图三行，依次填第一数、第二数与结果。',
      rule: {
        kind: 'steps',
        values: [12, 31, 43],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '十位横筹与个位纵筹分别读。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-add',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-rod-add-digits',
      knowledge: 'bnu-lower-written',
      prompt: '依次填三行十位/个位的筹根数，共六项。',
      rule: {
        kind: 'steps',
        values: [1, 2, 3, 1, 4, 3],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '每横筹一个十、纵筹一个一。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-add',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-rod-orientation',
      knowledge: 'bnu-lower-written',
      prompt: '本两位数算筹图，怎样解释位置和方向？',
      rule: {
        kind: 'choice',
        value: '十位横筹表示十，个位纵筹表示一',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '方向与位置一起读，不泛化任何棒的意义。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-add',
        variant: 'main',
      },
      choices: [
        {
          id: '十位横筹表示十，个位纵筹表示一',
          label: '十位横筹表示十，个位纵筹表示一',
        },
        {
          id: '任何横棒都一定表示十',
          label: '任何横棒都一定表示十',
        },
        {
          id: '纵式就是现代竖式',
          label: '纵式就是现代竖式',
        },
      ],
    },
    {
      id: 'bnu-lower-written-add-ones',
      knowledge: 'bnu-lower-written',
      prompt: '12+31先算个位，依次填两个个位数与个位结果。',
      rule: {
        kind: 'steps',
        values: [2, 1, 3],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '2+1=3。',
    },
    {
      id: 'bnu-lower-written-add-missing-tens',
      knowledge: 'bnu-lower-written',
      prompt: '图中先写个位3，十位A待填。A应填几？',
      rule: {
        kind: 'number',
        value: 4,
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '十位1+3=4，不把未填当0。',
      visual: {
        kind: 'bnu-written',
        scene: 'add-stage',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-add-stage-meaning',
      knowledge: 'bnu-lower-written',
      prompt: '结果十位A尚未填、个位已写3，此图是什么阶段？',
      rule: {
        kind: 'choice',
        value: '个位已算、十位未填',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '下一幅才补十位4；空不是0。',
      visual: {
        kind: 'bnu-written',
        scene: 'add-stage',
        variant: 'main',
      },
      choices: [
        {
          id: '个位已算、十位未填',
          label: '个位已算、十位未填',
        },
        {
          id: '完整答案是03',
          label: '完整答案是03',
        },
        {
          id: '十位已确定为0',
          label: '十位已确定为0',
        },
      ],
    },
    {
      id: 'bnu-lower-written-add-tens',
      knowledge: 'bnu-lower-written',
      prompt: '12+31再算十位，依次填两个十位数与十位结果。',
      rule: {
        kind: 'steps',
        values: [1, 3, 4],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '1个十加3个十为4个十。',
    },
    {
      id: 'bnu-lower-written-add-complete',
      knowledge: 'bnu-lower-written',
      prompt: '完整竖式依次填两个加数与和。',
      rule: {
        kind: 'steps',
        values: [12, 31, 43],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '12+31=43。',
      visual: {
        kind: 'bnu-written',
        scene: 'add-final',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-alignment',
      knowledge: 'bnu-lower-written',
      prompt: '写两位数加减竖式，数位怎样摆？',
      rule: {
        kind: 'choice',
        value: '个位对个位、十位对十位',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '相同单位上下对齐，运算符第二行左边。',
      choices: [
        {
          id: '个位对个位、十位对十位',
          label: '个位对个位、十位对十位',
        },
        {
          id: '把个位对十位',
          label: '把个位对十位',
        },
        {
          id: '只按数字大小排',
          label: '只按数字大小排',
        },
      ],
    },
    {
      id: 'bnu-lower-written-rod-sub-values',
      knowledge: 'bnu-lower-written',
      prompt: '读减法算筹三行，依次填原数、减去数与剩余。',
      rule: {
        kind: 'steps',
        values: [34, 22, 12],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '34−22=12。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-sub',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-sub-counter-digits',
      knowledge: 'bnu-lower-written',
      prompt: '34减22，依次填原十位/个位、取走十位/个位、余十位/个位六项珠数。',
      rule: {
        kind: 'steps',
        values: [3, 4, 2, 2, 1, 2],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '十位3−2=1，个位4−2=2。',
    },
    {
      id: 'bnu-lower-written-sub-beads',
      knowledge: 'bnu-lower-written',
      prompt: '表示12的计数器十位1颗、个位2颗，实体珠共有几颗？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '1+2=3颗，表示12不同于珠数3。',
    },
    {
      id: 'bnu-lower-written-sub-ones',
      knowledge: 'bnu-lower-written',
      prompt: '34−22先算个位，依次填被减数个位、减数个位与结果个位。',
      rule: {
        kind: 'steps',
        values: [4, 2, 2],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '4−2=2，不调换顺序。',
    },
    {
      id: 'bnu-lower-written-sub-tens',
      knowledge: 'bnu-lower-written',
      prompt: '34−22再算十位，依次填被减数十位、减数十位与结果十位。',
      rule: {
        kind: 'steps',
        values: [3, 2, 1],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '3−2=1。',
    },
    {
      id: 'bnu-lower-written-sub-blanks',
      knowledge: 'bnu-lower-written',
      prompt: '图中34−22，依次填结果十位A与个位B。',
      rule: {
        kind: 'steps',
        values: [1, 2],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '得12，A=1、B=2。',
      visual: {
        kind: 'bnu-written',
        scene: 'sub-blank',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-matching-a',
      knowledge: 'bnu-lower-written',
      prompt: '左图A应对应右图哪一幅？',
      rule: {
        kind: 'choice',
        value: 'D',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: 'A三行为23、21、44，为23+21=44；对应右下D。',
      visual: {
        kind: 'bnu-written',
        scene: 'matching',
        variant: 'main',
      },
      choices: [
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'C',
          label: 'C',
        },
      ],
    },
    {
      id: 'bnu-lower-written-matching-b',
      knowledge: 'bnu-lower-written',
      prompt: '左图B应对应右图哪一幅？',
      rule: {
        kind: 'choice',
        value: 'C',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: 'B三行为33、21、12，为33−21=12；对应右上C。',
      visual: {
        kind: 'bnu-written',
        scene: 'matching',
        variant: 'main',
      },
      choices: [
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
      ],
    },
    {
      id: 'bnu-lower-written-matching-values',
      knowledge: 'bnu-lower-written',
      prompt: '左A与左B各三行，依次填写A三数，再B三数。',
      rule: {
        kind: 'steps',
        values: [23, 21, 44, 33, 21, 12],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '两组运算不同，按全部行判断。',
      visual: {
        kind: 'bnu-written',
        scene: 'matching',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-practice-digits',
      knowledge: 'bnu-lower-written',
      prompt: '四竖式结果A～H，依次填每式十位、个位。',
      rule: {
        kind: 'steps',
        values: [7, 6, 3, 1, 9, 9, 5, 7],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '44+32=76；54−23=31；76+23=99；68−11=57。',
      visual: {
        kind: 'bnu-written',
        scene: 'practice',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-written-practice-results',
      knowledge: 'bnu-lower-written',
      prompt: '原四式44+32、54−23、76+23、68−11，依次填完整结果。',
      rule: {
        kind: 'steps',
        values: [76, 31, 99, 57],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '逐式同位算，全部四道完成。',
    },
    {
      id: 'bnu-lower-written-water-conditions',
      knowledge: 'bnu-lower-written',
      prompt: '原水题依次填原瓶数、人数、每人瓶数、需给瓶数。',
      rule: {
        kind: 'steps',
        values: [48, 36, 1, 36],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '每人一瓶，36人需36瓶。',
    },
    {
      id: 'bnu-lower-written-water-result',
      knowledge: 'bnu-lower-written',
      prompt: '原有48瓶，36人每人1瓶，依次填原数、给出数与剩余瓶数。',
      rule: {
        kind: 'steps',
        values: [48, 36, 12],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '48−36=12瓶。',
    },
    {
      id: 'bnu-lower-written-water-unit',
      knowledge: 'bnu-lower-written',
      prompt: '问还剩多少水，结果单位是什么？',
      rule: {
        kind: 'choice',
        value: '瓶',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '人数与瓶数不同，答案12瓶。',
      choices: [
        {
          id: '瓶',
          label: '瓶',
        },
        {
          id: '人',
          label: '人',
        },
        {
          id: '颗',
          label: '颗',
        },
      ],
    },
    {
      id: 'bnu-lower-written-site-zero',
      knowledge: 'bnu-lower-written',
      prompt: '本站改条件：20瓶给20人，每人1瓶，已全部给出，还剩几瓶？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '20−20=0瓶，真实0与空不同。',
    },
    {
      id: 'bnu-lower-written-actual-rods-add',
      knowledge: 'bnu-lower-written',
      prompt:
        '实际逐行摆或指12、31、43的十位横筹/个位纵筹，说明1～4筹形与对应数。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-add-stage',
      knowledge: 'bnu-lower-written',
      prompt: '实际写12+31个位结果3，指出十位仍未填，说明不能当0。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-add-final',
      knowledge: 'bnu-lower-written',
      prompt: '实际补十位4完成43，逐列说明并检查加号和横线。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-rods-sub',
      knowledge: 'bnu-lower-written',
      prompt: '实际用1～4筹形摆34、22、12并说明相同数位减法。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-counter-sub',
      knowledge: 'bnu-lower-written',
      prompt: '实际计数器拨3十4一，分别取2十2一，读1十2一并区分珠数3与数值12。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-sub-written',
      knowledge: 'bnu-lower-written',
      prompt: '实际纸笔写34−22竖式，说明4−2和3−2，核对12。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-matches',
      knowledge: 'bnu-lower-written',
      prompt: '回合法教材完成全部两条交叉连线，逐行读并说明运算理由。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-practice-1',
      knowledge: 'bnu-lower-written',
      prompt: '纸笔完成44+32竖式与横式，核对76。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-practice-2',
      knowledge: 'bnu-lower-written',
      prompt: '纸笔完成54−23竖式与横式，核对31。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-practice-3',
      knowledge: 'bnu-lower-written',
      prompt: '纸笔完成76+23竖式与横式，核对99。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-practice-4',
      knowledge: 'bnu-lower-written',
      prompt: '纸笔完成68−11竖式与横式，核对57。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-actual-water',
      knowledge: 'bnu-lower-written',
      prompt:
        '实际纸面读出48瓶/36人/每人1瓶，写完整48−36=12瓶与答句，不要求购买分水。',
      rule: {
        kind: 'manual',
      },
      hint: '实际已完成才确认，未做或只有计划可跳过。',
      explanation: '实际做过才确认，网页作答不能代替纸笔、实物和解释。',
    },
    {
      id: 'bnu-lower-written-method-record',
      knowledge: 'bnu-lower-written',
      prompt: '记录实际如何对齐数位、解释算筹与竖式，还需什么帮助。',
      rule: {
        kind: 'reflection',
      },
      hint: '按实际情况记录，也可跳过。',
      explanation: '个人原话correct:null，与人工确认和未来计划分别保存。',
    },
    {
      id: 'bnu-lower-written-own-record',
      knowledge: 'bnu-lower-written',
      prompt: '记录自己的真实纸笔核对过程、发现的错误及改法，不编造已做。',
      rule: {
        kind: 'reflection',
      },
      hint: '按实际情况记录，也可跳过。',
      explanation: '个人原话correct:null，与人工确认和未来计划分别保存。',
    },
    {
      id: 'bnu-lower-written-plan',
      knowledge: 'bnu-lower-written',
      prompt: '单独记录下一次准备做的练习，未来计划不当已完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '按实际情况记录，也可跳过。',
      explanation: '个人原话correct:null，与人工确认和未来计划分别保存。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-written-review-add-rods',
      knowledge: 'bnu-lower-written',
      prompt: '本站换图，依次读三行两位数。',
      rule: {
        kind: 'steps',
        values: [21, 13, 34],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '21+13=34，不能复制12/31/43。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-add',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-written-review-add-stage',
      knowledge: 'bnu-lower-written',
      prompt: '本站21+13个位已写4，十位A填几？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '2+1=3个十。',
      visual: {
        kind: 'bnu-written',
        scene: 'add-stage',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-written-review-sub',
      knowledge: 'bnu-lower-written',
      prompt: '本站34−13，填结果十位A、个位B。',
      rule: {
        kind: 'steps',
        values: [2, 1],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '34−13=21，不能复制12。',
      visual: {
        kind: 'bnu-written',
        scene: 'sub-blank',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-written-review-sub-rods',
      knowledge: 'bnu-lower-written',
      prompt: '本站换减法算筹，依次读三行两位数。',
      rule: {
        kind: 'steps',
        values: [34, 13, 21],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '34−13=21。',
      visual: {
        kind: 'bnu-written',
        scene: 'rods-sub',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-written-review-matching-a',
      knowledge: 'bnu-lower-written',
      prompt: '本站换两组图，左A对应哪幅右图？',
      rule: {
        kind: 'choice',
        value: 'C',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: 'A是12+21=33，右上C；原A→D不能沿用。',
      visual: {
        kind: 'bnu-written',
        scene: 'matching',
        variant: 'review',
      },
      choices: [
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
      ],
    },
    {
      id: 'bnu-lower-written-review-matching-b',
      knowledge: 'bnu-lower-written',
      prompt: '本站换两组图，左B对应哪幅右图？',
      rule: {
        kind: 'choice',
        value: 'D',
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: 'B是34−13=21，右下D；原B→C不能沿用。',
      visual: {
        kind: 'bnu-written',
        scene: 'matching',
        variant: 'review',
      },
      choices: [
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'C',
          label: 'C',
        },
      ],
    },
    {
      id: 'bnu-lower-written-review-practice',
      knowledge: 'bnu-lower-written',
      prompt: '本站四新竖式结果A～H，依次填各式十位/个位。',
      rule: {
        kind: 'steps',
        values: [6, 5, 4, 3, 8, 8, 5, 4],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '23+42=65、67−24=43、52+36=88、89−35=54。',
      visual: {
        kind: 'bnu-written',
        scene: 'practice',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-written-review-water',
      knowledge: 'bnu-lower-written',
      prompt: '本站53瓶水，31人每人1瓶，依次填原数、给出数与剩余瓶数。',
      rule: {
        kind: 'steps',
        values: [53, 31, 22],
      },
      hint: '相同数位对齐，先看个位，再看十位。空格不是0；算筹按位置与数量读，连线不能只看高低位置。',
      explanation: '53−31=22瓶，不复制原12。',
    },
  ],
};
