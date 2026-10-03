import type { Lesson } from '../learning/types';

export const bnuFiveSubtractLesson: Lesson = {
  id: 'bnu-upper-five-subtract',
  textbookTitle: '5以内数加与减',
  title: '五以内取走、剩余与零的加减',
  page: 32,
  version: 1,
  status: 'available',
  goal: '区分原有、取走与剩余，数剩余或逐张倒数，解释零的加减并核对连续变化。',
  prerequisite: '会点数0～5并理解合并与增加。',
  parentTip:
    '对应32～36页；本站纸卡与纸面人物原创，不复制原画。原书实做、纸笔写读和完整五种分法独立确认，屏幕答案不代替实做。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷32～36页已实际查看；原有/取走/剩余、减号、画去、不同图说同式、逐次变化、小猫到0、五珠对应与0的加减、八式及缺杯缺勺。',
  },
  steps: [
    {
      title: '原有、取走和剩余',
      text: '本站原有5张纸卡，实际取走2张，剩余3张。图中第一组表示剩余，第二组表示取走；求剩余只数第一组，不能把取走的卡又合回去。',
      activity: '实际摆5张，取走部分后分别报原有、取走和剩余。',
      visual: {
        kind: 'count-groups',
        groups: [3, 2],
      },
    },
    {
      title: '减号与方法',
      text: '可以从剩下的物品逐个数，也可实际从原有数量倒数，每拿走一张报下一个数。5−2=3读作五减二等于三，5是原有、2是取走、3是剩余。',
      activity: '实际用同一情境数剩余与逐张倒数，并写读减法。',
    },
    {
      title: '没有剩余和没有取走',
      text: '3张全部取走3张，剩余0；3张一张也不取走，仍3张。减0与减去全部是不同条件；没有打开的盒子是未知，不等于已知空。',
      activity: '实际分别做全部取走、一张不取与空盒观察。',
      visual: {
        kind: 'count-groups',
        groups: [0, 3],
      },
    },
    {
      title: '五珠分开与两种关系',
      text: '用5张卡代替珠子，分出1、2、3、4、5张，分别核对剩余4、3、2、1、0。分出与剩余合起来仍是原来的5张；每次实验先恢复5张，不把五次分出连续叠加。',
      activity: '实际恢复后分别做五种分法，写减法及相应加法。',
    },
    {
      title: '连续变化与缺少',
      text: '本站5张先取1剩4，再从4取2剩2，最后从2取2剩0。每次从当时剩余出发，不能每次都从5减。纸面5人配3杯或2勺时分别缺2杯、3勺，不能混问两种物品。',
      activity: '实际用纸卡演示连续变化，再逐一配对杯卡和勺卡。',
    },
    {
      title: '回看原书与零的解释',
      text: '实际回看32～36页，做取走图、画去、减号读写、气球飞走、蜡笔变化、小猫吃鱼、五珠对应、泡泡连续变化、纽扣、八式与缺杯缺勺。只在纸上或安全纸卡演练，不要求真实喂动物或到道路观察。',
      activity: '完成原图任务并说清减0、加0或全部取走的一种方法。',
    },
  ],
  questions: [
    {
      id: 'bnu-upper-five-subtract-q1',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '本站3张纸卡全部取走3张，剩余几张？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '全部取走后已知剩余0，不是未观察。',
    },
    {
      id: 'bnu-upper-five-subtract-q2',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '图中第一组是剩余，第二组是取走。只问剩余有几张？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '只数第一组三张。',
      visual: {
        kind: 'count-groups',
        groups: [3, 2],
      },
    },
    {
      id: 'bnu-upper-five-subtract-q3',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '同图只问取走几张？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '取走是第二组两张，不是总数五。',
      visual: {
        kind: 'count-groups',
        groups: [3, 2],
      },
    },
    {
      id: 'bnu-upper-five-subtract-q4',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '原有4张，取走1张，还剩几张？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '剩余三张。',
    },
    {
      id: 'bnu-upper-five-subtract-q5',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '原有5张取走2张，求剩余，用哪个运算符号？',
      rule: {
        kind: 'choice',
        value: '−',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '取走求剩余使用减号。',
      choices: [
        {
          id: '+',
          label: '+',
        },
        {
          id: '−',
          label: '−',
        },
      ],
    },
    {
      id: 'bnu-upper-five-subtract-q6',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '4−0的结果是几？',
      rule: {
        kind: 'number',
        value: 4,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '一张也不取，数量不变。',
    },
    {
      id: 'bnu-upper-five-subtract-q7',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '0+3的结果是几？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '原有0，再添3，合起来3。',
    },
    {
      id: 'bnu-upper-five-subtract-q8',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '3−0的结果是几？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '没有取走，仍是3。',
    },
    {
      id: 'bnu-upper-five-subtract-q9',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '5张卡先取1，再取2，最后取2。依次填每次剩余。',
      rule: {
        kind: 'steps',
        values: [4, 2, 0],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '依次从5、4、2出发，最后确实0。',
    },
    {
      id: 'bnu-upper-five-subtract-q10',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '每次先恢复5张，再分别取走1、2、3、4、5张。依次填五次剩余。',
      rule: {
        kind: 'steps',
        values: [4, 3, 2, 1, 0],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '五次独立实验，不能累计取走。',
    },
    {
      id: 'bnu-upper-five-subtract-q11',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '相应分出与剩余：1+4、2+3、3+2、4+1、5+0，依次填结果。',
      rule: {
        kind: 'steps',
        values: [5, 5, 5, 5, 5],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '五种分法各合回同一原有总数5。',
    },
    {
      id: 'bnu-upper-five-subtract-q12',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '本站纸面5人每人一杯，只有3个杯卡，缺几个杯？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '一一配对有2人没有杯，不混入勺数。',
    },
    {
      id: 'bnu-upper-five-subtract-q13',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '同样5人每人一勺，只有2个勺卡，缺几把勺？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '勺另行配对，缺3把。',
    },
    {
      id: 'bnu-upper-five-subtract-q14',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '依次算5−2、0+3、4−0、4+1、3−2、5−4、5−5、1−1。',
      rule: {
        kind: 'steps',
        values: [3, 3, 4, 5, 1, 1, 0, 0],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '各算式独立，减0与全部取走分别核对。',
    },
    {
      id: 'bnu-upper-five-subtract-q15',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '盒内没有观察也没有记录，能直接填剩余0吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '未知不是已知没有。',
      choices: [
        {
          id: '能',
          label: '能',
        },
        {
          id: '不能',
          label: '不能',
        },
      ],
    },
    {
      id: 'bnu-upper-five-subtract-actual-take',
      knowledge: 'bnu-upper-five-subtract',
      prompt:
        '实际用纸卡做取走部分、全部取走和一张不取，分别核对三个量；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-subtract-actual-draw',
      knowledge: 'bnu-upper-five-subtract',
      prompt:
        '实际自画原有标记、画去指定部分，另数剩余并写读减法；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-subtract-actual-five',
      knowledge: 'bnu-upper-five-subtract',
      prompt:
        '实际每次恢复5张，完整做分出1～5及剩余，写相应减法和加法；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-subtract-actual-method',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '实际在同一例子中用数剩余和逐张倒数两种方法核对；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-subtract-actual-chain',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '实际摆5张依次取1、2、2，每次记录当时剩余；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-subtract-actual-match',
      knowledge: 'bnu-upper-five-subtract',
      prompt:
        '实际摆本站5人名字卡，分别配3杯卡与2勺卡，核对两种缺少量；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-subtract-actual-book',
      knowledge: 'bnu-upper-five-subtract',
      prompt:
        '实际回看合法原书32～36页，完成取走、画去、减号、气球/蜡笔、小猫/五珠、泡泡/纽扣、八式和杯勺原图任务；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-subtract-reflection-zero',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '记录一次自己解释减0、加0或全部取走的实际方法；没做可记待做。',
      rule: {
        kind: 'reflection',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '开放记录不评分，计划与已做分开，不自动评定掌握。',
    },
    {
      id: 'bnu-upper-five-subtract-reflection-question',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '记录一个关于取走或剩余的疑问，不确定可以如实说明。',
      rule: {
        kind: 'reflection',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '开放记录不评分，计划与已做分开，不自动评定掌握。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-upper-five-subtract-review-zero',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '新情境4张卡全部取走4张，剩几张？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '换为4张，全部取走仍无剩余。',
    },
    {
      id: 'bnu-upper-five-subtract-review-group',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '新图第一组是剩余，第二组是取走，只问剩余。',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '剩余第一组两张。',
      visual: {
        kind: 'count-groups',
        groups: [2, 1],
      },
    },
    {
      id: 'bnu-upper-five-subtract-review-chain',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '新题4张先取2，再从剩余取1。依次填每次剩余。',
      rule: {
        kind: 'steps',
        values: [2, 1],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '条件与阶段均改变，每次从当前剩余出发。',
    },
    {
      id: 'bnu-upper-five-subtract-review-add-zero',
      knowledge: 'bnu-upper-five-subtract',
      prompt: '新题0+2的结果是多少？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '原有0与新增2共同计入。',
    },
  ],
};

export const bnuFiveOrganizeLesson: Lesson = {
  id: 'bnu-upper-five-organize',
  textbookTitle: '5以内数加与减',
  title: '五以内加减整理、连续变化与算式卡',
  page: 37,
  version: 1,
  status: 'available',
  goal: '整理整体与部分、零和完整计算，核对缺数多解、不同变化量与同结果的所有候选算式卡。',
  prerequisite: '已理解五以内加减含义与0，能顺数倒数0～10。',
  parentTip:
    '对应37～39页；原创纸卡范围两数0～5、和不超过5及非负减法。原图实做、自主知识图和42卡制作分别记录，不宣称原盒未知内容就是本站卡片。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷37～39页已实际查看：整体/地点与同式图说、自主问题、12式、顺倒缺数、变化率、结果匹配、连续取走与开放卡片。',
  },
  steps: [
    {
      title: '整体、部分和地点',
      text: '本站有5张卡，桌面3张、盒内2张。求全部是5；只问桌面是3。静态所在位置不能自动当刚刚取走，若要说减法故事必须另外明确原有与变化条件。',
      activity: '实际说明同一对象的整体、部分和所求。',
      visual: {
        kind: 'count-groups',
        groups: [3, 2],
      },
    },
    {
      title: '算式、零与自己的故事',
      text: '3+0和3−0都得3，但分别是没有增加和没有取走；意义不同。用自己的明确情境说一次合并和一次取走，条件、单位与问题都要完整。',
      activity: '实际画两种故事，并说明其中的零。',
    },
    {
      title: '完整算式与方法',
      text: '整理计算时，每条算式独立看，不把上一题结果当下一题原有。12道原书计算分别核对，自己再用物品或画图解释一条方法，不以只写结果代替解释。',
      activity: '实际完成原书整组算式并解释方法。',
    },
    {
      title: '缺数先确定方向',
      text: '本站五格中间是6；明确全程相邻多1或全程相邻少1时，4、5、6、7、8与8、7、6、5、4都合法。没有给方向不能猜唯一。已明确顺数或倒数的另一条路，必须按该条件填。',
      activity: '实际画顺倒数路，分别检查所有空格与相邻数。',
    },
    {
      title: '固定变化量与连续取走',
      text: '本站草莓数7、5、3、1每次少2；樱桃数4、6、8、10每次多2。这是点数和相邻变化比较，不要求列10以内加法。另有5张依次取2、1、2，剩3、2、0，三次取走量并不相同。',
      activity: '实际摆两种固定变化和一次不同取走量的纸卡变化。',
    },
    {
      title: '算式卡片找结果盒',
      text: '本站规定两数都是0～5、减法结果非负。标签1～5指算式结果，不是盒内卡片张数；同一结果可以有多张不同算式卡。先算再放，0结果卡另列，不冒原书盒内所有未知卡。',
      activity: '实际制作规定范围内的42张不同加减卡并按结果0～5分类。',
    },
    {
      title: '原书整理与开放回顾',
      text: '实际回看37～39页，完成地点与整体口径、国旗大小星和鹤图说式、自主问题、12式、三条缺数、两变化、找家、猴子连续变化与可能的盒内卡。本站卡片范围是原创约定，原书图与本站模型分开。',
      activity: '实际回看完整任务，再说方法、疑问和下一步打算。',
    },
  ],
  questions: [
    {
      id: 'bnu-upper-five-organize-q1',
      knowledge: 'bnu-upper-five-organize',
      prompt: '本站3张纸卡全部取走，3−3的结果是多少？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '全部取走剩0。',
    },
    {
      id: 'bnu-upper-five-organize-q2',
      knowledge: 'bnu-upper-five-organize',
      prompt: '本站桌面3张、盒内2张，问两处全部共有几张？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '全部包括两个地点。',
      visual: {
        kind: 'count-groups',
        groups: [3, 2],
      },
    },
    {
      id: 'bnu-upper-five-organize-q3',
      knowledge: 'bnu-upper-five-organize',
      prompt: '同图只问桌面第一组几张？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '地点范围改为第一组三张。',
      visual: {
        kind: 'count-groups',
        groups: [3, 2],
      },
    },
    {
      id: 'bnu-upper-five-organize-q4',
      knowledge: 'bnu-upper-five-organize',
      prompt: '3+0与3−0结果相同，能说两个情境都是取走3张吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '分别没有增加与没有取走，均不是取走3张。',
      choices: [
        {
          id: '能',
          label: '能',
        },
        {
          id: '不能',
          label: '不能',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-q5',
      knowledge: 'bnu-upper-five-organize',
      prompt: '已有5张取走2张，求剩余，该选哪个运算符号？',
      rule: {
        kind: 'choice',
        value: '−',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '明确取走后剩余，用减法。',
      choices: [
        {
          id: '+',
          label: '+',
        },
        {
          id: '−',
          label: '−',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-q6',
      knowledge: 'bnu-upper-five-organize',
      prompt: '整理第一组：依次算5−1、3+1、4−3、2+3。',
      rule: {
        kind: 'steps',
        values: [4, 4, 1, 5],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '各题分别看条件。',
    },
    {
      id: 'bnu-upper-five-organize-q7',
      knowledge: 'bnu-upper-five-organize',
      prompt: '整理第二组：依次算3+0、2−0、5−3、3−3。',
      rule: {
        kind: 'steps',
        values: [3, 2, 2, 0],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '零与全部取走区别核对。',
    },
    {
      id: 'bnu-upper-five-organize-q8',
      knowledge: 'bnu-upper-five-organize',
      prompt: '整理第三组：依次算3+2、4−1、4−2、2+1。',
      rule: {
        kind: 'steps',
        values: [5, 3, 2, 3],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '按算式顺序记录结果。',
    },
    {
      id: 'bnu-upper-five-organize-q9',
      knowledge: 'bnu-upper-five-organize',
      prompt: '明确顺数1～5：空格、2、3、空格、5。依次填两空。',
      rule: {
        kind: 'steps',
        values: [1, 4],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '方向已给，不倒着填。',
    },
    {
      id: 'bnu-upper-five-organize-q10',
      knowledge: 'bnu-upper-five-organize',
      prompt: '明确从10倒数到6：空格、9、8、空格、空格。依次填三空。',
      rule: {
        kind: 'steps',
        values: [10, 7, 6],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '每次少1，填10、7、6。',
    },
    {
      id: 'bnu-upper-five-organize-q11',
      knowledge: 'bnu-upper-five-organize',
      prompt: '五格中间6，整条相邻每次多1或整条每次少1。选出所有合法完整数路。',
      rule: {
        kind: 'set',
        values: ['4、5、6、7、8', '8、7、6、5、4'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '两个方向都可；跳数或不变不满足题目条件。',
      choices: [
        {
          id: '4、5、6、7、8',
          label: '4、5、6、7、8',
        },
        {
          id: '8、7、6、5、4',
          label: '8、7、6、5、4',
        },
        {
          id: '1、2、6、7、8',
          label: '1、2、6、7、8',
        },
        {
          id: '6、6、6、6、6',
          label: '6、6、6、6、6',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-q12',
      knowledge: 'bnu-upper-five-organize',
      prompt: '本站草莓数7、5、3、1，相邻每次少几颗？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '分别相邻比较，每次少2。',
    },
    {
      id: 'bnu-upper-five-organize-q13',
      knowledge: 'bnu-upper-five-organize',
      prompt: '本站樱桃数4、6、8、10，相邻每次多几颗？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '当前总数与每次增加量分开。',
    },
    {
      id: 'bnu-upper-five-organize-q14',
      knowledge: 'bnu-upper-five-organize',
      prompt: '本站5张先取2，再取1，最后取2。依次填三次剩余。',
      rule: {
        kind: 'steps',
        values: [3, 2, 0],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '从每次当时剩余出发，取走量2、1、2不同。',
    },
    {
      id: 'bnu-upper-five-organize-q15',
      knowledge: 'bnu-upper-five-organize',
      prompt: '本站两部分2张和3张，依次填全部数与从全部取走2张后的剩余。',
      rule: {
        kind: 'steps',
        values: [5, 3],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '分别求整体和另一个部分。',
    },
    {
      id: 'bnu-upper-five-organize-q16',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '本站结果1盒：两数0～5，减法非负。选出本题候选中所有结果为1的不同算式卡。',
      rule: {
        kind: 'set',
        values: ['0+1', '1+0', '1−0', '2−1', '3−2', '4−3', '5−4'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '标签指算式结果，不是卡片张数；所有符合候选都要选，0加数或减数不漏。',
      choices: [
        {
          id: '0+1',
          label: '0+1',
        },
        {
          id: '1+0',
          label: '1+0',
        },
        {
          id: '1−0',
          label: '1−0',
        },
        {
          id: '2−1',
          label: '2−1',
        },
        {
          id: '3−2',
          label: '3−2',
        },
        {
          id: '4−3',
          label: '4−3',
        },
        {
          id: '5−4',
          label: '5−4',
        },
        {
          id: '0+0',
          label: '0+0',
        },
        {
          id: '0−0',
          label: '0−0',
        },
        {
          id: '1−1',
          label: '1−1',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-q17',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '本站结果2盒：两数0～5，减法非负。选出本题候选中所有结果为2的不同算式卡。',
      rule: {
        kind: 'set',
        values: ['0+2', '1+1', '2+0', '2−0', '3−1', '4−2', '5−3'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '标签指算式结果，不是卡片张数；所有符合候选都要选，0加数或减数不漏。',
      choices: [
        {
          id: '0+2',
          label: '0+2',
        },
        {
          id: '1+1',
          label: '1+1',
        },
        {
          id: '2+0',
          label: '2+0',
        },
        {
          id: '2−0',
          label: '2−0',
        },
        {
          id: '3−1',
          label: '3−1',
        },
        {
          id: '4−2',
          label: '4−2',
        },
        {
          id: '5−3',
          label: '5−3',
        },
        {
          id: '0+0',
          label: '0+0',
        },
        {
          id: '0−0',
          label: '0−0',
        },
        {
          id: '1−1',
          label: '1−1',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-q18',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '本站结果3盒：两数0～5，减法非负。选出本题候选中所有结果为3的不同算式卡。',
      rule: {
        kind: 'set',
        values: ['0+3', '1+2', '2+1', '3+0', '3−0', '4−1', '5−2'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '标签指算式结果，不是卡片张数；所有符合候选都要选，0加数或减数不漏。',
      choices: [
        {
          id: '0+3',
          label: '0+3',
        },
        {
          id: '1+2',
          label: '1+2',
        },
        {
          id: '2+1',
          label: '2+1',
        },
        {
          id: '3+0',
          label: '3+0',
        },
        {
          id: '3−0',
          label: '3−0',
        },
        {
          id: '4−1',
          label: '4−1',
        },
        {
          id: '5−2',
          label: '5−2',
        },
        {
          id: '0+0',
          label: '0+0',
        },
        {
          id: '0−0',
          label: '0−0',
        },
        {
          id: '1−1',
          label: '1−1',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-q19',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '本站结果4盒：两数0～5，减法非负。选出本题候选中所有结果为4的不同算式卡。',
      rule: {
        kind: 'set',
        values: ['0+4', '1+3', '2+2', '3+1', '4+0', '4−0', '5−1'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '标签指算式结果，不是卡片张数；所有符合候选都要选，0加数或减数不漏。',
      choices: [
        {
          id: '0+4',
          label: '0+4',
        },
        {
          id: '1+3',
          label: '1+3',
        },
        {
          id: '2+2',
          label: '2+2',
        },
        {
          id: '3+1',
          label: '3+1',
        },
        {
          id: '4+0',
          label: '4+0',
        },
        {
          id: '4−0',
          label: '4−0',
        },
        {
          id: '5−1',
          label: '5−1',
        },
        {
          id: '0+0',
          label: '0+0',
        },
        {
          id: '0−0',
          label: '0−0',
        },
        {
          id: '1−1',
          label: '1−1',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-q20',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '本站结果5盒：两数0～5，减法非负。选出本题候选中所有结果为5的不同算式卡。',
      rule: {
        kind: 'set',
        values: ['0+5', '1+4', '2+3', '3+2', '4+1', '5+0', '5−0'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '标签指算式结果，不是卡片张数；所有符合候选都要选，0加数或减数不漏。',
      choices: [
        {
          id: '0+5',
          label: '0+5',
        },
        {
          id: '1+4',
          label: '1+4',
        },
        {
          id: '2+3',
          label: '2+3',
        },
        {
          id: '3+2',
          label: '3+2',
        },
        {
          id: '4+1',
          label: '4+1',
        },
        {
          id: '5+0',
          label: '5+0',
        },
        {
          id: '5−0',
          label: '5−0',
        },
        {
          id: '0+0',
          label: '0+0',
        },
        {
          id: '0−0',
          label: '0−0',
        },
        {
          id: '1−1',
          label: '1−1',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-actual-story',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际自画一个合并和一个取走故事，写完整条件、单位、问题与算式；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-actual-zero',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际用同一原有量分别演示没有增加与没有取走，并说明零；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-actual-calculation',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际完成合法原书12条算式，另用图或物品解释至少一条方法；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-actual-sequence',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际画并填顺数、倒数和中间给数的两种合法方向，核对每个位置；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-actual-change',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际摆每次多2、每次少2和依次取2/1/2的三种变化，逐次记录；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-actual-cards',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际制作两数0～5、和不超过5及非负减法的全部42张不同卡，按结果0～5分类；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-actual-map',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际画一个自己的加减知识图，明确部分/整体/取走/剩余，并提出一个问题；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-actual-book',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '实际回看合法原书37～39页，完成图说式、自主问题、12式、缺数、变化、找家、猴子连续变化和可能的盒内卡；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation:
        '真实做过才确认；未做或只计划做可以跳过，不由网页答对代替实做。',
    },
    {
      id: 'bnu-upper-five-organize-reflection-method',
      knowledge: 'bnu-upper-five-organize',
      prompt: '记录一次自己实际使用的计算或分类方法；未做可记待做。',
      rule: {
        kind: 'reflection',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '开放记录不评分，计划与已做分开，不自动评定掌握。',
    },
    {
      id: 'bnu-upper-five-organize-reflection-question',
      knowledge: 'bnu-upper-five-organize',
      prompt: '记录一个尚待研究的加减问题，不把提问冒已解决。',
      rule: {
        kind: 'reflection',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '开放记录不评分，计划与已做分开，不自动评定掌握。',
    },
    {
      id: 'bnu-upper-five-organize-reflection-plan',
      knowledge: 'bnu-upper-five-organize',
      prompt: '记录下一步准备做什么，计划与已经做过分开。',
      rule: {
        kind: 'reflection',
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '开放记录不评分，计划与已做分开，不自动评定掌握。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-upper-five-organize-review-calculate',
      knowledge: 'bnu-upper-five-organize',
      prompt: '新整理依次算3−1、2−1、1−1。',
      rule: {
        kind: 'steps',
        values: [2, 1, 0],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '新三式和结果各自核对。',
    },
    {
      id: 'bnu-upper-five-organize-review-card',
      knowledge: 'bnu-upper-five-organize',
      prompt:
        '新任务只从0+2、5−3、4−2、2+0、1+1、3−1、2−0、3+0中选出所有结果2的卡。',
      rule: {
        kind: 'set',
        values: ['0+2', '1+1', '2+0', '2−0', '3−1', '4−2', '5−3'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '七种合法候选结果2；结果3的3+0不选。',
      choices: [
        {
          id: '0+2',
          label: '0+2',
        },
        {
          id: '1+1',
          label: '1+1',
        },
        {
          id: '2+0',
          label: '2+0',
        },
        {
          id: '2−0',
          label: '2−0',
        },
        {
          id: '3−1',
          label: '3−1',
        },
        {
          id: '4−2',
          label: '4−2',
        },
        {
          id: '5−3',
          label: '5−3',
        },
        {
          id: '3+0',
          label: '3+0',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-review-route',
      knowledge: 'bnu-upper-five-organize',
      prompt: '新五格中间4，整条相邻多1或整条相邻少1，选出所有合法数路。',
      rule: {
        kind: 'set',
        values: ['2、3、4、5、6', '6、5、4、3、2'],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '中间改为4，两种方向均核对。',
      choices: [
        {
          id: '2、3、4、5、6',
          label: '2、3、4、5、6',
        },
        {
          id: '6、5、4、3、2',
          label: '6、5、4、3、2',
        },
        {
          id: '1、2、4、5、6',
          label: '1、2、4、5、6',
        },
      ],
    },
    {
      id: 'bnu-upper-five-organize-review-chain',
      knowledge: 'bnu-upper-five-organize',
      prompt: '新情境4张先取1，再把剩余全部取走。依次填剩余。',
      rule: {
        kind: 'steps',
        values: [3, 0],
      },
      hint: '明确当前对象、已知条件和所求，零与空白分别核对。',
      explanation: '条件改变，第二次从当前3出发全部取走。',
    },
  ],
};
