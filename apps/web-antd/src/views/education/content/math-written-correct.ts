import type { Lesson } from '../learning/types';

export const writtenCorrectLesson: Lesson = {
  id: 'ml-written-correct',
  textbookTitle: '100以内的笔算加、减法',
  title: '辨错改正与竖式缺位填数',
  page: 60,
  version: 1,
  status: 'available',
  prerequisite: '会基本笔算与进退位，能区分已知数字和待填字母。',
  goal: '说清具体错因再改正，按整条竖式检验缺位填数，保留所有合法解。',
  parentTip:
    '依据实际核读人教下册60～61、64～65页编写原创算式；不复制原练习全集。空格不是0，多解不能固定示例。原书完整计算与真实纸笔/讲解分别人工记录。',
  review: {
    date: '2026-10-03',
    reviewer: '官方正文核读与原创辨错/缺位约束核对',
    notes:
      '官方资源1221001102241图片62～74逐页读取。独立原创数值、原书活动分开，完整单元及教师审校另核。',
  },
  steps: [
    {
      title: '先找具体错因再改正',
      text: '结果错误不能只换成正确数字。对照数位，检查进来的十有没有计入、退去的十有没有扣掉、一位数是否对个位，说明哪一步不符合原数量。',
      activity: '实际指着一处错误说明，再写正确记录。',
    },
    {
      title: '个位0不能漏，减法不能倒过来',
      text: '32+48个位满十写0，结果80不能写8。75−38个位不够，需要换十再减，不能把8−5当个位结果。进退位前后的十和一要分时记录。',
      activity: '实际改写两种错误并验算。',
    },
    {
      title: '字母表示位置，不是现成答案',
      text: '图从第一数、第二数到结果，每行先十位后个位，把空格按A、B、C编号。各格仅0～9数字，两个运算数为两位数，十位不能是0；结果0～99，结果十位可为0。',
      activity: '实际指每个字母所在的行与数位。',
    },
    {
      title: '多个空格要共同满足整条算式',
      text: '每个空格能放某些数字，不意味着这些数字随便组合都成立。补全后把所有数完整读出并计算。可能有多种合法填法，不能只接受老师举的一种；也不能把未尝试当无解。',
      activity: '实际找到至少两种合法填法并逐一验证。',
    },
    {
      title: '原书练习与自己的表达',
      text: '完整原书练习、自己创编错误卡和填数题需要真实纸笔，网站答对不替代。检查原因与改法，保留孩子疑问；说计划时不要当成已完成。',
      activity: '实际说明一个错误和改法，记录还不清楚的地方。',
    },
  ],
  questions: [
    {
      id: 'ml-written-correct-q1',
      knowledge: 'ml-written-correct',
      prompt: '有人把58+25写成73。重新计算，依次填正确结果个位、十位、结果。',
      rule: {
        kind: 'steps',
        values: [3, 8, 83],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '8+5=13，写3进1；5+2+1=8，得83。',
    },
    {
      id: 'ml-written-correct-q2',
      knowledge: 'ml-written-correct',
      prompt: '有人把58+25写成73，个位写3、十位只算5+2。这是什么问题？',
      rule: {
        kind: 'choice',
        value: '漏掉个位进来的1个十',
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '个位满十换来的1个十要加进十位。',
      choices: [
        {
          id: '漏掉个位进来的1个十',
          label: '漏掉个位进来的1个十',
        },
        {
          id: '58变成了5',
          label: '58变成了5',
        },
        {
          id: '先算个位一律不对',
          label: '先算个位一律不对',
        },
      ],
    },
    {
      id: 'ml-written-correct-q3',
      knowledge: 'ml-written-correct',
      prompt: '32+48有人只写8作为结果。改正后完整结果是多少？',
      rule: {
        kind: 'number',
        value: 80,
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '个位2+8满十，个位写0，十位3+4+1得8，即80。',
    },
    {
      id: 'ml-written-correct-q4',
      knowledge: 'ml-written-correct',
      prompt: '32+48有人只写8。他把十位8写了，为什么完整结果仍不对？',
      rule: {
        kind: 'choice',
        value: '个位0没有写进结果',
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '80的个位0不能省，8与80不是同一数量。',
      choices: [
        {
          id: '个位0没有写进结果',
          label: '个位0没有写进结果',
        },
        {
          id: '8和80表示同一数',
          label: '8和80表示同一数',
        },
        {
          id: '所有0都能省',
          label: '所有0都能省',
        },
      ],
    },
    {
      id: 'ml-written-correct-q5',
      knowledge: 'ml-written-correct',
      prompt: '34+6有人把6对在十位算成94。正确结果是多少？',
      rule: {
        kind: 'number',
        value: 40,
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '6是6个一，与4对齐；4+6进1，结果40。',
    },
    {
      id: 'ml-written-correct-q6',
      knowledge: 'ml-written-correct',
      prompt: '34+6有人把6对在十位。怎样改正对齐？',
      rule: {
        kind: 'choice',
        value: '一位数应对个位',
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '一位数表示几个一，不因行位置改变成几个十。',
      choices: [
        {
          id: '一位数应对个位',
          label: '一位数应对个位',
        },
        {
          id: '一位数都对十位',
          label: '一位数都对十位',
        },
        {
          id: '加数较小就对十位',
          label: '加数较小就对十位',
        },
      ],
    },
    {
      id: 'ml-written-correct-q7',
      knowledge: 'ml-written-correct',
      prompt:
        '60−27有人写43。依次填退位后原数的个十数、个一数、正确结果十位、个位、结果。前两项在减27之前记录。',
      rule: {
        kind: 'steps',
        values: [5, 10, 3, 3, 33],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '60换成5十10一，减2十7一，余3十3一即33。',
    },
    {
      id: 'ml-written-correct-q8',
      knowledge: 'ml-written-correct',
      prompt: '60−27个位退1后，十位仍按6−2算，得到43。错在哪里？',
      rule: {
        kind: 'choice',
        value: '退位后仍用了原来的6个十',
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '退1后只有5个十，不能仍用6个十。',
      choices: [
        {
          id: '退位后仍用了原来的6个十',
          label: '退位后仍用了原来的6个十',
        },
        {
          id: '个位0永远不能减',
          label: '个位0永远不能减',
        },
        {
          id: '十位少1就整个数少10',
          label: '十位少1就整个数少10',
        },
      ],
    },
    {
      id: 'ml-written-correct-q9',
      knowledge: 'ml-written-correct',
      prompt:
        '75−38有人将个位反过来算8−5，写43。按原减法改正：依次填退位后原数的个十数、个一数、结果十位、个位、结果。',
      rule: {
        kind: 'steps',
        values: [6, 15, 3, 7, 37],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation:
        '75换6十15一，15−8=7，6−3=3，得37，不能把减数与被减数倒过来。',
    },
    {
      id: 'ml-written-correct-q10',
      knowledge: 'ml-written-correct',
      prompt: '按图依次填A、B，使两个两位数相加得到87。',
      rule: {
        kind: 'column-digits',
        operator: '+',
        left: [5, null],
        right: [null, 4],
        result: [8, 7],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '个位A+4=7，所以A=3；十位5+B=8，所以B=3。',
      visual: {
        kind: 'column-digits',
        operator: '+',
        left: [5, null],
        right: [null, 4],
        result: [8, 7],
      },
    },
    {
      id: 'ml-written-correct-q11',
      knowledge: 'ml-written-correct',
      prompt:
        '按图依次填A、B、C，使两个两位数相减得到68。可以有多种填法，只要满足完整算式；每格只填一个数字。',
      rule: {
        kind: 'column-digits',
        operator: '-',
        left: [null, null],
        right: [2, null],
        result: [6, 8],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation:
        '所有使两位数减两位数等于68的合法填法都接受，不固定示例答案。首数88～97对应减20～29。',
      visual: {
        kind: 'column-digits',
        operator: '-',
        left: [null, null],
        right: [2, null],
        result: [6, 8],
      },
    },
    {
      id: 'ml-written-correct-q12',
      knowledge: 'ml-written-correct',
      prompt: '按图依次填A、B，使两个两位数相加得到58。',
      rule: {
        kind: 'column-digits',
        operator: '+',
        left: [null, 5],
        right: [2, null],
        result: [5, 8],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '个位5+B=8得到B=3；十位A+2=5得到A=3。',
      visual: {
        kind: 'column-digits',
        operator: '+',
        left: [null, 5],
        right: [2, null],
        result: [5, 8],
      },
    },
    {
      id: 'ml-written-correct-q13',
      knowledge: 'ml-written-correct',
      prompt:
        '按图依次填A、B、C，补全减法。结果可以是一位数；图中十位若为0也请填写0。接受所有满足原条件的合法填法。',
      rule: {
        kind: 'column-digits',
        operator: '-',
        left: [null, 7],
        right: [2, null],
        result: [null, 2],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation:
        '个位7−B得到2，B=5；A为2～9，结果十位C=A−2。A=2时27−25=2，十位空格填0。',
      visual: {
        kind: 'column-digits',
        operator: '-',
        left: [null, 7],
        right: [2, null],
        result: [null, 2],
      },
    },
    {
      id: 'ml-written-correct-original-add',
      knowledge: 'ml-written-correct',
      prompt:
        '实际合法阅读教材60～61页，逐项完成加法列式、补数、结果配对、比较、辨错改正和生活问题。每题写单位答句并检查，不能只看例题。没有教材可跳过原书活动。',
      rule: {
        kind: 'manual',
      },
      hint: '先实际做阅读、纸笔或口述，未做或只计划请跳过。',
      explanation: '实物与书写按实际记录，网页填数不自动确认完成；计划另记。',
    },
    {
      id: 'ml-written-correct-original-sub',
      knowledge: 'ml-written-correct',
      prompt:
        '实际合法阅读教材64～65页，逐项计算减法与混合练习，按原要求配对/分类、补数、辨错与改正；有多解时试不同填法，逐个检验。没有教材可跳过原书活动。',
      rule: {
        kind: 'manual',
      },
      hint: '先实际做阅读、纸笔或口述，未做或只计划请跳过。',
      explanation: '实物与书写按实际记录，网页填数不自动确认完成；计划另记。',
    },
    {
      id: 'ml-written-correct-error-cards',
      knowledge: 'ml-written-correct',
      prompt:
        '实际在纸上写3张错误竖式，分别表示漏进位、退位后十位未改和一位数错位。每张先指出具体错误，再写正确竖式，用逆运算检查。',
      rule: {
        kind: 'manual',
      },
      hint: '先实际做阅读、纸笔或口述，未做或只计划请跳过。',
      explanation: '实物与书写按实际记录，网页填数不自动确认完成；计划另记。',
    },
    {
      id: 'ml-written-correct-joint-digits',
      knowledge: 'ml-written-correct',
      prompt:
        '实际在纸上画图中的3空格减法，至少找两种不同合法填法，并逐一列竖式核对；不能只填各格独立可选数字却不检查组合。',
      rule: {
        kind: 'manual',
      },
      hint: '先实际做阅读、纸笔或口述，未做或只计划请跳过。',
      explanation: '实物与书写按实际记录，网页填数不自动确认完成；计划另记。',
    },
    {
      id: 'ml-written-correct-explain',
      knowledge: 'ml-written-correct',
      prompt:
        '实际向家人说明本课一个改错过程：原来哪里不对、怎样改、如何检验。家人也可指出仍不清楚的地方，不以网页得分代替交流。',
      rule: {
        kind: 'manual',
      },
      hint: '先实际做阅读、纸笔或口述，未做或只计划请跳过。',
      explanation: '实物与书写按实际记录，网页填数不自动确认完成；计划另记。',
    },
    {
      id: 'ml-written-correct-autonomous',
      knowledge: 'ml-written-correct',
      prompt:
        '实际自己设计一个有空格的两位数加减竖式，先检查至少有一组合法填法，再找不同填法或说明只有一种；记录条件与结果，不把未尝试当无解。',
      rule: {
        kind: 'manual',
      },
      hint: '先实际做阅读、纸笔或口述，未做或只计划请跳过。',
      explanation: '实物与书写按实际记录，网页填数不自动确认完成；计划另记。',
    },
    {
      id: 'ml-written-correct-reflect-error',
      knowledge: 'ml-written-correct',
      prompt:
        '如实记录：你实际发现过什么竖式错误，改正后怎样检查？未做或不明白可如实写。',
      rule: {
        kind: 'reflection',
      },
      hint: '记录孩子原话，可由家长代写；未来计划与实际完成分开。',
      explanation: '反思correct为null，不评星，不自动确认实际活动。',
    },
    {
      id: 'ml-written-correct-reflect-fill',
      knowledge: 'ml-written-correct',
      prompt:
        '如实记录：你实际找过哪些不同填法，怎样知道整条算式都成立？还有什么疑问？',
      rule: {
        kind: 'reflection',
      },
      hint: '记录孩子原话，可由家长代写；未来计划与实际完成分开。',
      explanation: '反思correct为null，不评星，不自动确认实际活动。',
    },
  ],
  reviewQuestions: [
    {
      id: 'ml-written-correct-review1',
      knowledge: 'ml-written-correct',
      prompt: '按图填A，补全结果的十位；每格一个数字。',
      rule: {
        kind: 'column-digits',
        operator: '+',
        left: [4, 7],
        right: [2, 6],
        result: [null, 3],
      },
      visual: {
        kind: 'column-digits',
        operator: '+',
        left: [4, 7],
        right: [2, 6],
        result: [null, 3],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '47+26=73，十位填7。',
    },
    {
      id: 'ml-written-correct-review2',
      knowledge: 'ml-written-correct',
      prompt: '按图依次填A、B，完成加法。',
      rule: {
        kind: 'column-digits',
        operator: '+',
        left: [4, null],
        right: [null, 7],
        result: [7, 2],
      },
      visual: {
        kind: 'column-digits',
        operator: '+',
        left: [4, null],
        right: [null, 7],
        result: [7, 2],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '个位5+7满十，十位4+2+1=7，所以A=5、B=2。',
    },
    {
      id: 'ml-written-correct-review3',
      knowledge: 'ml-written-correct',
      prompt: '按图依次填A、B、C，使减法结果为57。接受所有合法填法。',
      rule: {
        kind: 'column-digits',
        operator: '-',
        left: [null, null],
        right: [3, null],
        result: [5, 7],
      },
      visual: {
        kind: 'column-digits',
        operator: '-',
        left: [null, null],
        right: [3, null],
        result: [5, 7],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: '首数87～96减30～39都得57；每个合法组合接受。',
    },
    {
      id: 'ml-written-correct-review4',
      knowledge: 'ml-written-correct',
      prompt: '按图依次填A、B、C补全减法；结果十位可以为0。',
      rule: {
        kind: 'column-digits',
        operator: '-',
        left: [null, 8],
        right: [3, null],
        result: [null, 3],
      },
      visual: {
        kind: 'column-digits',
        operator: '-',
        left: [null, 8],
        right: [3, null],
        result: [null, 3],
      },
      hint: '先核对相同数位、进退位和每个空格的位置；0必须明确填写。',
      explanation: 'B=5，A为3～9，C=A−3。38−35=3对应C=0。',
    },
  ],
};
