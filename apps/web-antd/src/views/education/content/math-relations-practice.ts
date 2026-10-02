import type { Lesson } from '../learning/types';

export const relationPracticeLessons: Lesson[] = [
  {
    textbookTitle: '数量间的加减关系',
    version: 1,
    status: 'available',
    prerequisite:
      '会100以内数及加减；纸卡或纸笔按实际准备，不要求真实外出采集。',
    parentTip:
      '依据实际阅读的人教下册69～76页编写原创情境，原教材图与本站原创题分开。先说已知与所求，不能按多/少关键词选运算；纸面、口述、真实操作与反思分别记录，未做请跳过。',
    review: {
      date: '2026-10-03',
      reviewer: '官方69～76页实际核读与原创数量关系程序核对',
      notes:
        '资源1221001102241图片75～82逐页实际查看，页码69～76。保留原ml-relations v1六题；补整体部分、求差与求数量、共同参照/连续变化/两步依赖、自主表达及成长记录。原扫描插画原题集合不打包，教师最终审校另行核验。',
    },
    id: 'ml-relations-parts',
    page: 69,
    title: '整体、部分与不同所求',
    goal: '区分添入、合并、求原量与求另一部分，不按关键词选运算。',
    steps: [
      {
        title: '先明确所求',
        text: '纸卡两部分24和17合并，求整体；原41拿走17求另一部分。已知数可以相同，所求变了，算式不同。',
        activity: '实际把两种问法各说一次。',
      },
      {
        title: '用去和剩余也是两个部分',
        text: '用去26、还剩19，求原有，用加法合起来。看到用去或剩下不能机械决定减法，先指出题目问原来还是剩余。',
        activity: '实际画原整体的两部分并标问号。',
      },
      {
        title: '每一道重新回到原条件',
        text: '整体20分成8与12，对应两加减关系。20减8得12，20减12得8，各自从20开始，不连续拿两次。',
        activity: '实际摆20，做两种拿法时恢复原量。',
      },
      {
        title: '未知与0、计划与完成分开',
        text: '确定19张全部用去可得剩0；不知道用了多少不能当0。已经做与还要做能合成目标，但还要做不是已完成。',
        activity: '实际写两种问题并说明加减原因。',
      },
    ],
    questions: [
      {
        id: 'ml-relations-parts-q1',
        knowledge: 'ml-relations-parts',
        prompt: '两盒纸卡分别24张和17张，合起来多少张？',
        rule: {
          kind: 'number',
          value: 41,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '两部分24和17，合起来41。',
      },
      {
        id: 'ml-relations-parts-q2',
        knowledge: 'ml-relations-parts',
        prompt: '原来41张纸卡，拿走17张，还剩多少张？',
        rule: {
          kind: 'number',
          value: 24,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '已知整体41和拿走的部分17，另一部分24。',
      },
      {
        id: 'ml-relations-parts-q3',
        knowledge: 'ml-relations-parts',
        prompt: '用去26张，还剩19张，原来有多少张纸卡？',
        rule: {
          kind: 'number',
          value: 45,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '用去和剩下都是原整体的部分，26+19=45；不能看到剩下就减。',
      },
      {
        id: 'ml-relations-parts-q4',
        knowledge: 'ml-relations-parts',
        prompt: '共38张纸卡，其中16张蓝卡，其余红卡。红卡多少张？',
        rule: {
          kind: 'number',
          value: 22,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '38−16=22，不重复加蓝卡。',
      },
      {
        id: 'ml-relations-parts-q5',
        knowledge: 'ml-relations-parts',
        prompt:
          '整体20的两部分是8和12。分别求8+12、20−8、20−12，依次填结果；每式都从原条件开始。',
        rule: {
          kind: 'steps',
          values: [20, 12, 8],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '整体与部分保持一致，三式不是连续拿走。',
      },
      {
        id: 'ml-relations-parts-q6',
        knowledge: 'ml-relations-parts',
        prompt: '已经做18张，还要做7张，共要做多少张？应按什么关系列式？',
        rule: {
          kind: 'choice',
          value: '两部分合成整体',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '已做与还要做都是总目标的部分。',
        choices: [
          {
            id: '两部分合成整体',
            label: '两部分合成整体',
          },
          {
            id: '已做减还要做',
            label: '已做减还要做',
          },
          {
            id: '还要做就是已经完成',
            label: '还要做就是已经完成',
          },
        ],
      },
      {
        id: 'ml-relations-parts-q7',
        knowledge: 'ml-relations-parts',
        prompt:
          '已知用去26张、剩19张，要求原来的数量，哪些量属于原整体的两个部分？选全。',
        rule: {
          kind: 'set',
          values: ['用去的26张', '剩下的19张'],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '用去与剩余互不重复且合成原量。',
        choices: [
          {
            id: '用去的26张',
            label: '用去的26张',
          },
          {
            id: '剩下的19张',
            label: '剩下的19张',
          },
          {
            id: '把剩余再计两次',
            label: '把剩余再计两次',
          },
        ],
      },
      {
        id: 'ml-relations-parts-q8',
        knowledge: 'ml-relations-parts',
        prompt: '原来19张，确实全部用去19张，还剩多少张？',
        rule: {
          kind: 'number',
          value: 0,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '19−19=0；已确认没有剩余与未记录不同。',
      },
      {
        id: 'ml-relations-parts-original',
        knowledge: 'ml-relations-parts',
        prompt:
          '实际合法阅读教材69页，分别说明添入、左右合并、用去与剩余求原量的已知和所求，再举一个用减法求另一部分的例子。没有教材可跳过原图活动。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-parts-draw',
        knowledge: 'ml-relations-parts',
        prompt:
          '实际在纸上画整体与两部分，分别标出已知两部分求整体、已知整体与一部分求另一部分；每幅明确问号与单位。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-parts-objects',
        knowledge: 'ml-relations-parts',
        prompt:
          '实际摆两部分纸卡，合起来数；恢复原整体，再拿走一部分核对剩余。每次重新开始，不能接着再拿。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-parts-questions',
        knowledge: 'ml-relations-parts',
        prompt:
          '实际自主编一个求整体和一个求另一部分的故事，分别写已知、所求、算式、单位和答句；不只照抄网页例子。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-parts-explain',
        knowledge: 'ml-relations-parts',
        prompt:
          '实际把为什么加或减讲给家长，或独自说清并回看纸面；指出原量、用去与剩余的对应，不以能背关键词代替。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-parts-reflection-1',
        knowledge: 'ml-relations-parts',
        prompt: '如实记录一次整体与部分的检查，以及仍不明白的地方。',
        rule: {
          kind: 'reflection',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '如实保留个人原话，没有统一感想，不计客观正确率或自动能力分。',
      },
      {
        id: 'ml-relations-parts-reflection-2',
        knowledge: 'ml-relations-parts',
        prompt:
          '记录一次自主提问或讲解的实际过程；没做可写未做，未来计划另记。',
        rule: {
          kind: 'reflection',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '如实保留个人原话，没有统一感想，不计客观正确率或自动能力分。',
      },
    ],
    reviewQuestions: [
      {
        id: 'ml-relations-parts-review1',
        knowledge: 'ml-relations-parts',
        prompt: '两盒卡分别16和29张，合起来多少张？',
        rule: {
          kind: 'number',
          value: 45,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '两部分合起来。',
      },
      {
        id: 'ml-relations-parts-review2',
        knowledge: 'ml-relations-parts',
        prompt: '原53张，用去18张，剩多少？',
        rule: {
          kind: 'number',
          value: 35,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '整体减去已知部分。',
      },
      {
        id: 'ml-relations-parts-review3',
        knowledge: 'ml-relations-parts',
        prompt: '用去27张，还剩14张，原来多少？',
        rule: {
          kind: 'number',
          value: 41,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '原整体由两部分组成。',
      },
      {
        id: 'ml-relations-parts-review4',
        knowledge: 'ml-relations-parts',
        prompt: '整体24两部分9和15，依次填9+15、24−9、24−15。',
        rule: {
          kind: 'steps',
          values: [24, 15, 9],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '各式恢复原条件。',
      },
    ],
  },
  {
    textbookTitle: '数量间的加减关系',
    version: 1,
    status: 'available',
    prerequisite:
      '会100以内数及加减；纸卡或纸笔按实际准备，不要求真实外出采集。',
    parentTip:
      '依据实际阅读的人教下册69～76页编写原创情境，原教材图与本站原创题分开。先说已知与所求，不能按多/少关键词选运算；纸面、口述、真实操作与反思分别记录，未做请跳过。',
    review: {
      date: '2026-10-03',
      reviewer: '官方69～76页实际核读与原创数量关系程序核对',
      notes:
        '资源1221001102241图片75～82逐页实际查看，页码69～76。保留原ml-relations v1六题；补整体部分、求差与求数量、共同参照/连续变化/两步依赖、自主表达及成长记录。原扫描插画原题集合不打包，教师最终审校另行核验。',
    },
    id: 'ml-relations-comparison',
    page: 70,
    title: '求差、较多量与较少量',
    goal: '把参照量、比较量与差分别说清，根据所求选择运算并验看关系。',
    steps: [
      {
        title: '一对一配对找差',
        text: 'A17张、B11张，从同起点一一配对。去掉同样多的11，A多出6；反过来说B比A少6。求差不是求两组合计。',
        activity: '实际摆卡并说两个方向。',
        visual: {
          kind: 'comparison-rows',
          counts: [17, 11],
        },
      },
      {
        title: '所求较多量',
        text: 'A34，B比A多9，B由与A一样多的34和多出的9构成。图只标已知与B问号；图线长度不是精确数量比例。',
        activity: '实际画同样多与多出两部分。',
        visual: {
          kind: 'comparison-bars',
          reference: 34,
          difference: 9,
          direction: 'more',
        },
      },
      {
        title: '所求较少量',
        text: 'A34，B少9。把34分成与B同样多的部分和差9，所求用34减9。核对得到25后，再看34−25是否为9。',
        activity: '实际画图说明少的是多少。',
        visual: {
          kind: 'comparison-bars',
          reference: 34,
          difference: 9,
          direction: 'less',
        },
      },
      {
        title: '换所求重新判断',
        text: 'B25比A少9，求A是25加9；B43比A多9，求A是43减9。词没有变，所求对象改变，不能背少就减、多就加。',
        activity: '实际换一种问法并说理由。',
      },
      {
        title: '用原关系检查',
        text: '相同两组差0；差可等于标准量，此时较少量0。数未知不当0，不从示意线段长短量出答案。',
        activity: '实际写一道结果并代回比较关系。',
      },
    ],
    questions: [
      {
        id: 'ml-relations-comparison-q1',
        knowledge: 'ml-relations-comparison',
        prompt: 'A有17张卡，B有11张。依次填A比B多几张、B比A少几张。',
        rule: {
          kind: 'steps',
          values: [6, 6],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '两个方向都是同一差6。',
        visual: {
          kind: 'comparison-rows',
          counts: [17, 11],
        },
      },
      {
        id: 'ml-relations-comparison-q2',
        knowledge: 'ml-relations-comparison',
        prompt: 'A有34张，B比A多9张，B多少张？',
        rule: {
          kind: 'number',
          value: 43,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '34+9=43，参照是A。',
        visual: {
          kind: 'comparison-bars',
          reference: 34,
          difference: 9,
          direction: 'more',
        },
      },
      {
        id: 'ml-relations-comparison-q3',
        knowledge: 'ml-relations-comparison',
        prompt: 'A有34张，B比A少9张，B多少张？',
        rule: {
          kind: 'number',
          value: 25,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '34−9=25，所求比参照少。',
        visual: {
          kind: 'comparison-bars',
          reference: 34,
          difference: 9,
          direction: 'less',
        },
      },
      {
        id: 'ml-relations-comparison-q4',
        knowledge: 'ml-relations-comparison',
        prompt: 'B有25张，B比A少9张。A多少张？',
        rule: {
          kind: 'number',
          value: 34,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: 'A是较多量，25+9=34；少字并不决定减。',
      },
      {
        id: 'ml-relations-comparison-q5',
        knowledge: 'ml-relations-comparison',
        prompt: 'B有43张，B比A多9张，A多少张？',
        rule: {
          kind: 'number',
          value: 34,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '所求A较少，用43−9=34；多字并不决定加。',
      },
      {
        id: 'ml-relations-comparison-q6',
        knowledge: 'ml-relations-comparison',
        prompt: '两组各13张，相差几张？',
        rule: {
          kind: 'number',
          value: 0,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '数量相同，差0不是合计26。',
        visual: {
          kind: 'comparison-rows',
          counts: [13, 13],
        },
      },
      {
        id: 'ml-relations-comparison-q7',
        knowledge: 'ml-relations-comparison',
        prompt: 'A17张、B11张，选出全部能表示这两组差6的关系。',
        rule: {
          kind: 'set',
          values: ['17−11=6', '11+6=17', '17−6=11'],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '从多量、少量、差三个量看同一关系。',
        choices: [
          {
            id: '17−11=6',
            label: '17−11=6',
          },
          {
            id: '11+6=17',
            label: '11+6=17',
          },
          {
            id: '17−6=11',
            label: '17−6=11',
          },
          {
            id: '17+11=6',
            label: '17+11=6',
          },
        ],
      },
      {
        id: 'ml-relations-comparison-q8',
        knowledge: 'ml-relations-comparison',
        prompt: 'A8张，B比A少8张。B多少张？',
        rule: {
          kind: 'number',
          value: 0,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '较少量可为0，8−8=0。',
        visual: {
          kind: 'comparison-bars',
          reference: 8,
          difference: 8,
          direction: 'less',
        },
      },
      {
        id: 'ml-relations-comparison-q9',
        knowledge: 'ml-relations-comparison',
        prompt: 'A与B相比多多少，问的是哪种数量？',
        rule: {
          kind: 'choice',
          value: '相差数量',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '求差与合计是不同问题。',
        choices: [
          {
            id: '相差数量',
            label: '相差数量',
          },
          {
            id: '两组总数量',
            label: '两组总数量',
          },
          {
            id: 'A本身的数量',
            label: 'A本身的数量',
          },
        ],
      },
      {
        id: 'ml-relations-comparison-q10',
        knowledge: 'ml-relations-comparison',
        prompt: 'A21张，B比A多9张，依次填B数量、B−A的差，用差核对原条件。',
        rule: {
          kind: 'steps',
          values: [30, 9],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '21+9=30，30−21=9，回看条件。',
      },
      {
        id: 'ml-relations-comparison-original',
        knowledge: 'ml-relations-comparison',
        prompt:
          '实际合法阅读教材70～72页，分别指出求差、已知标准求较多量、已知标准求较少量的已知与所求，讲解回顾反思中的核对。没教材可跳过原图活动。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-comparison-pair',
        knowledge: 'ml-relations-comparison',
        prompt:
          '实际从同一起点摆两排同样纸卡，一对一配对；分别指出同样多的部分、多出的部分，并说反向少多少。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-comparison-draw-more',
        knowledge: 'ml-relations-comparison',
        prompt:
          '实际画标准量与较多量的关系图，把同样多部分、差和较多量问号分别标出，写式并回看差。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-comparison-draw-less',
        knowledge: 'ml-relations-comparison',
        prompt:
          '实际画标准量与较少量的关系图，标出差与问号，说明减掉的是差，检查结果是否确实少相应数量。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-comparison-explain',
        knowledge: 'ml-relations-comparison',
        prompt:
          '实际换一次所求：先已知标准与差求比较量，再用自己的量反问标准是多少；逐题说清所求对象，不能只说多就加。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-comparison-reflection-1',
        knowledge: 'ml-relations-comparison',
        prompt: '记录一次求差和求数量的区分检查，不给自己自动能力分。',
        rule: {
          kind: 'reflection',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '如实保留个人原话，没有统一感想，不计客观正确率或自动能力分。',
      },
      {
        id: 'ml-relations-comparison-reflection-2',
        knowledge: 'ml-relations-comparison',
        prompt: '如实记录一对一摆卡或画图对解释的帮助，未做如实写，计划另记。',
        rule: {
          kind: 'reflection',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '如实保留个人原话，没有统一感想，不计客观正确率或自动能力分。',
      },
    ],
    reviewQuestions: [
      {
        id: 'ml-relations-comparison-review1',
        knowledge: 'ml-relations-comparison',
        prompt: 'A19张、B12张，依次填A多几、B少几。',
        rule: {
          kind: 'steps',
          values: [7, 7],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '反向仍同一差。',
        visual: {
          kind: 'comparison-rows',
          counts: [19, 12],
        },
      },
      {
        id: 'ml-relations-comparison-review2',
        knowledge: 'ml-relations-comparison',
        prompt: 'A46张，B多8张，B多少？',
        rule: {
          kind: 'number',
          value: 54,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '46+8=54。',
        visual: {
          kind: 'comparison-bars',
          reference: 46,
          difference: 8,
          direction: 'more',
        },
      },
      {
        id: 'ml-relations-comparison-review3',
        knowledge: 'ml-relations-comparison',
        prompt: 'A46张，B少8张，B多少？',
        rule: {
          kind: 'number',
          value: 38,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '46−8=38。',
        visual: {
          kind: 'comparison-bars',
          reference: 46,
          difference: 8,
          direction: 'less',
        },
      },
      {
        id: 'ml-relations-comparison-review4',
        knowledge: 'ml-relations-comparison',
        prompt: 'B38张且比A少8张，A多少？',
        rule: {
          kind: 'number',
          value: 46,
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '求较多标准量38+8=46。',
      },
    ],
  },
  {
    textbookTitle: '数量间的加减关系',
    version: 1,
    status: 'available',
    prerequisite:
      '会100以内数及加减；纸卡或纸笔按实际准备，不要求真实外出采集。',
    parentTip:
      '依据实际阅读的人教下册69～76页编写原创情境，原教材图与本站原创题分开。先说已知与所求，不能按多/少关键词选运算；纸面、口述、真实操作与反思分别记录，未做请跳过。',
    review: {
      date: '2026-10-03',
      reviewer: '官方69～76页实际核读与原创数量关系程序核对',
      notes:
        '资源1221001102241图片75～82逐页实际查看，页码69～76。保留原ml-relations v1六题；补整体部分、求差与求数量、共同参照/连续变化/两步依赖、自主表达及成长记录。原扫描插画原题集合不打包，教师最终审校另行核验。',
    },
    id: 'ml-relations-organize',
    page: 73,
    title: '两步问题、共同参照与自主表达',
    goal: '区分两步依赖、共同参照、连续变化和不同单位，并创编表达与反思。',
    steps: [
      {
        title: '第二问需要先求第一问',
        text: '甲23，乙比甲少8，先求乙15，才能求合计38。差8不是乙的数量；两问有依赖，不直接23加8。',
        activity: '实际画图说第一问怎样帮助第二问。',
        visual: {
          kind: 'comparison-bars',
          reference: 23,
          difference: 8,
          direction: 'less',
        },
      },
      {
        title: '共同参照与连续变化不同',
        text: '甲35，乙多12、丙少9，两问都参照35，不用乙47替代甲。原72先拿24再拿19则不同：第二次必须从新剩余48拿。',
        activity: '实际把两类各写一次并圈参照。',
      },
      {
        title: '按所求范围读数量和单位',
        text: '桌子18与14可合计和求差，另有9把椅子不能混入桌数。两类书先求一类再合计，整体与部分不能重复计数。',
        activity: '实际画一份图，把单位标清。',
      },
      {
        title: '自己提出不同问题并解答',
        text: '同一两组数量可以问合计和差，还可换所求；新问题必须有够用条件，未知不当0。自主创编与抄例不同，可用虚构卡片故事，不要求外出活动或私人信息。',
        activity: '实际至少提两问、解答、交流。',
      },
      {
        title: '整理与成长记录',
        text: '数量关系可用画图看清，再决定加减；有时解决一个问题要先解决另一个。根据实际表达收获与困难，不自动评星，过去教材年份不当当前数据。',
        activity: '实际画说比多少故事并回顾。',
      },
    ],
    questions: [
      {
        id: 'ml-relations-organize-q1',
        knowledge: 'ml-relations-organize',
        prompt: '甲23张卡，乙比甲少8张。依次填乙数量、两人合计。',
        rule: {
          kind: 'steps',
          values: [15, 38],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '先23−8=15，再23+15=38。',
        visual: {
          kind: 'comparison-bars',
          reference: 23,
          difference: 8,
          direction: 'less',
        },
      },
      {
        id: 'ml-relations-organize-q2',
        knowledge: 'ml-relations-organize',
        prompt: '甲23张卡，乙比甲少8张。求两人合计，应先做什么？',
        rule: {
          kind: 'choice',
          value: '先求乙，再求合计',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '第二问需要第一问求出的乙数量。',
        choices: [
          {
            id: '先求乙，再求合计',
            label: '先求乙，再求合计',
          },
          {
            id: '直接23+8',
            label: '直接23+8',
          },
          {
            id: '把差8当乙数量',
            label: '把差8当乙数量',
          },
        ],
      },
      {
        id: 'ml-relations-organize-q3',
        knowledge: 'ml-relations-organize',
        prompt: '甲35张，乙比甲多12张，丙比甲少9张。依次填乙、丙数量。',
        rule: {
          kind: 'steps',
          values: [47, 26],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '两问都参照甲35，丙不是参照乙47。',
      },
      {
        id: 'ml-relations-organize-q4',
        knowledge: 'ml-relations-organize',
        prompt:
          '原72张，先拿走24张，再从剩下的卡拿走19张。依次填第一次剩余、第二次剩余。',
        rule: {
          kind: 'steps',
          values: [48, 29],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '第二次从新剩余48开始，不又从72开始。',
      },
      {
        id: 'ml-relations-organize-q5',
        knowledge: 'ml-relations-organize',
        prompt: '甲27张，乙比甲多5张。依次填乙数量、合计。',
        rule: {
          kind: 'steps',
          values: [32, 59],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '先27+5=32，再27+32=59。',
      },
      {
        id: 'ml-relations-organize-q6',
        knowledge: 'ml-relations-organize',
        prompt:
          '甲整理18张桌子。乙整理14张桌子和9把椅子。依次填两人整理桌子合计、甲比乙多整理的桌数。',
        rule: {
          kind: 'steps',
          values: [32, 4],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '只比较桌子，9把椅子不计入桌数。',
      },
      {
        id: 'ml-relations-organize-q7',
        knowledge: 'ml-relations-organize',
        prompt:
          '虚构阅读记录：甲读20分钟，乙比甲少6分钟，丙比甲多9分钟。依次填乙、丙分钟数。',
        rule: {
          kind: 'steps',
          values: [14, 29],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '各自参照甲20；只是例子，不当真实家庭记录。',
      },
      {
        id: 'ml-relations-organize-q8',
        knowledge: 'ml-relations-organize',
        prompt:
          '甲有31本故事书，科普书比故事书少7本，依次填科普书数量、两类合计。',
        rule: {
          kind: 'steps',
          values: [24, 55],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '先求一类再求总量，书不能重复计数。',
      },
      {
        id: 'ml-relations-organize-q9',
        knowledge: 'ml-relations-organize',
        prompt: '只知道A比B多6张，不知道A或B各有多少，能确定两人合计吗？',
        rule: {
          kind: 'choice',
          value: '不能确定',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '差不等于两个量或总数；缺条件不默认为0。',
        choices: [
          {
            id: '不能确定',
            label: '不能确定',
          },
          {
            id: '合计就是6',
            label: '合计就是6',
          },
          {
            id: '合计一定12',
            label: '合计一定12',
          },
        ],
      },
      {
        id: 'ml-relations-organize-q10',
        knowledge: 'ml-relations-organize',
        prompt: '甲12张，乙比甲少12张。依次填乙数量、两人合计。',
        rule: {
          kind: 'steps',
          values: [0, 12],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '乙0已由条件求出，0+12=12。',
      },
      {
        id: 'ml-relations-organize-q11',
        knowledge: 'ml-relations-organize',
        prompt: '两组共45张，A17张。依次填B数量、B比A多几张。',
        rule: {
          kind: 'steps',
          values: [28, 11],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '先45−17=28，再28−17=11。',
      },
      {
        id: 'ml-relations-organize-q12',
        knowledge: 'ml-relations-organize',
        prompt: '已知甲18张、乙13张，哪些问题可由这两个条件确定？选全。',
        rule: {
          kind: 'set',
          values: ['两人合计多少张', '甲比乙多多少张'],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '同一已知可以问合计或差，第三人没有条件。',
        choices: [
          {
            id: '两人合计多少张',
            label: '两人合计多少张',
          },
          {
            id: '甲比乙多多少张',
            label: '甲比乙多多少张',
          },
          {
            id: '第三个人有多少张',
            label: '第三个人有多少张',
          },
        ],
      },
      {
        id: 'ml-relations-organize-original-chain',
        knowledge: 'ml-relations-organize',
        prompt:
          '实际合法阅读教材73页，读出已知与两个所求，分别列式计算、带单位写答句并回看原条件；说明第一问所求怎样成为第二问的已知。没教材可跳过原图任务。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-organize-original-apply',
        knowledge: 'ml-relations-organize',
        prompt:
          '实际合法阅读教材74页五项应用与75～76页练习，逐项读出已知与所求，分别列式计算、带单位写答句并检查；说明共同参照、连续变化与不同物品不混计。没教材可跳过原题活动。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-organize-two-step',
        knowledge: 'ml-relations-organize',
        prompt:
          '实际画一份自选数量记录，先求比较量再求合计，写每步算式、单位与答句，并用原差回看结果。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-organize-common-reference',
        knowledge: 'ml-relations-organize',
        prompt:
          '实际纸上写一个共同参照的三组故事，两问都标清同一标准量；重新画图检查，不把第一问新结果误用作第二问标准。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-organize-own-questions',
        knowledge: 'ml-relations-organize',
        prompt:
          '实际针对自己的图提出至少两个不同且条件够用的问题，分别解答并交流或独自说清；不能只抄本站问题。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-organize-own-story',
        knowledge: 'ml-relations-organize',
        prompt:
          '实际创编一个比多少的故事，用喜欢的纸画、纸卡或文字表示并讲完整，允许虚构，不要求真实班级或家庭信息。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-organize-original-review',
        knowledge: 'ml-relations-organize',
        prompt:
          '实际合法阅读教材75页整理与76页成长记录，画一画说一说自己的数量关系，并区分所掌握的关系和仍需帮助的地方。书中的年份或记录不是今天或本人经历；无教材跳过原图活动。',
        rule: {
          kind: 'manual',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '只记录实际完成；网页观察与正确作答不替代纸笔、摆卡或讲解。未做或只准备请跳过，计划另记。',
      },
      {
        id: 'ml-relations-organize-reflection-1',
        knowledge: 'ml-relations-organize',
        prompt: '记录一次用数量关系选加减的实际检查；不按成绩自动评星。',
        rule: {
          kind: 'reflection',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '如实保留个人原话，没有统一感想，不计客观正确率或自动能力分。',
      },
      {
        id: 'ml-relations-organize-reflection-2',
        knowledge: 'ml-relations-organize',
        prompt: '记录一次第二问需要先解决第一问的理由与实际过程，未做如实写。',
        rule: {
          kind: 'reflection',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '如实保留个人原话，没有统一感想，不计客观正确率或自动能力分。',
      },
      {
        id: 'ml-relations-organize-reflection-3',
        knowledge: 'ml-relations-organize',
        prompt:
          '记录本单元的新收获、仍有的问题或自主故事表达；未来计划单列，不当已经完成。',
        rule: {
          kind: 'reflection',
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation:
          '如实保留个人原话，没有统一感想，不计客观正确率或自动能力分。',
      },
    ],
    reviewQuestions: [
      {
        id: 'ml-relations-organize-review1',
        knowledge: 'ml-relations-organize',
        prompt: '甲26张，乙比甲少9张，依次填乙、合计。',
        rule: {
          kind: 'steps',
          values: [17, 43],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '先求乙再求总。',
      },
      {
        id: 'ml-relations-organize-review2',
        knowledge: 'ml-relations-organize',
        prompt: '甲42张，乙比甲多7张，丙比甲少13张，依次填乙、丙。',
        rule: {
          kind: 'steps',
          values: [49, 29],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '各自参照42。',
      },
      {
        id: 'ml-relations-organize-review3',
        knowledge: 'ml-relations-organize',
        prompt: '原65张先拿18再拿12，依次填两次剩余。',
        rule: {
          kind: 'steps',
          values: [47, 35],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '第二次接新剩余。',
      },
      {
        id: 'ml-relations-organize-review4',
        knowledge: 'ml-relations-organize',
        prompt:
          '甲整理21张桌，乙整理16张桌与8把椅，依次填桌子合计、甲多几张桌。',
        rule: {
          kind: 'steps',
          values: [37, 5],
        },
        hint: '先找已知、所求和参照对象，按字段顺序填写；0是已知数量，不是空白。',
        explanation: '椅子不混桌子。',
      },
    ],
  },
];
