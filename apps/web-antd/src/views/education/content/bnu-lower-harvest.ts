import type { Lesson } from '../learning/types';

export const bnuLowerHarvestLesson: Lesson = {
  id: 'bnu-lower-harvest',
  textbookTitle: '整理与复习：我的收获与问题银行',
  title: '百以内数的收获：四计数器、完整比较与自己的表示',
  page: 57,
  version: 1,
  status: 'available',
  goal: '按四条给定记录完整画写和比较，区别数位值与材料件数，为85做两个自主表示并交流自己的数学问题。',
  prerequisite: '能读写100以内的数，理解十和一的数位并比较两位数。',
  parentTip:
    '依据已核读第57页三项完整活动。四人年龄与统一一分钟次数分别读，题目情境不作医疗或普遍年龄结论，不要求真实测量。原十个位图与本站共享空百位辅助分开；材料件数不是表示值。八长方形五三角形原图未独立写图例，本站约定若使用须明确十/一单位。两个空表示保留自主合理形式，问题银行开放不设是非唯一答案；实际画写、解释、交流人工确认，反思null，未做与未来计划分开。原图不打包，无需学校或指定审校人前置，最终教师审校未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '第57页完整情境、四计数器与85图及问题银行来源核对',
    notes: '范围仅第57页；58～59巩固应用继续独立制作，来源读取不冒教师试用。',
  },
  steps: [
    {
      title: '先读四个人与一分钟记录',
      text: '原冬冬6岁95次、希希9岁92次、果果12岁85次、田田18岁79次，时长都是一分钟。岁是年龄、次是次数，标签和记录不能交换；本课只比较给定记录，不要求实际测量或身体数据。',
      activity: '回原页核对全部四个标签、次数与共同时间。',
    },
    {
      title: '画四个计数器，写全部四个数',
      text: '95是9个十5个一、92是9个十2个一、85是8个十5个一、79是7个十9个一。原纸面为十/个位两栏；本站共享辅助有空百位，不是原图新增珠。珠子件数和表示值不同，95图14颗仍表示95。',
      activity: '实际逐个画四图、写四数并核对数位。',
      visual: {
        kind: 'place-counters',
        values: [95, 92, 85, 79],
      },
    },
    {
      title: '完整从多到少比较',
      text: '95>92>85>79，三个相邻关系分别读。95与92十位同9，继续比个位5和2；92与85先比十位9和8。最多是冬冬95，不按年龄大小判断，不推为所有人的年龄与心率规律。本站另给90，个位0是已知数位而不是未填。',
      activity: '实际写读完整比较顺序，说明先十位再个位的方法。',
    },
    {
      title: '85的数位与分组约定',
      text: '中心数85：8个十和5个一，80+5；计数器材料8+5=13颗，表示值85不变。原小图有八长方形五三角形，没有独立写单位图例；本站若用它表示85，需明确每长方形代表十、每三角形代表一，不凭形状默认含义。',
      activity: '实际回看三种原表示，说清表示值、物件数和数量约定。',
      visual: {
        kind: 'place-counters',
        values: [85],
      },
    },
    {
      title: '两个空分支，保留自己的表示',
      text: '第57页还有两个空分支，实际分别画或写自己的不同合理表示，并说明为什么都为85。可选择不同的分组、文字或分解，不把本站一个示例当唯一答案；画写、核对和口述分别确认，自己的原话另存。',
      activity: '两空各做一种表示，再实际解释并检查总值。',
    },
    {
      title: '问题银行与自己的学习记录',
      text: '可以讨论生活中的数与现在学习范围，也可以提自己的问题。本课1～100只是当前范围，不声称全部数止于100；这个开放问题不设是或否唯一判分。自己的问题、理由、发现和困难如实记，实际交流与未来计划分开。',
      activity:
        '真实讨论并记录原话，回看做过与尚未做的项目，最后单独写未来计划。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-harvest-counts',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '四人一分钟记录按冬冬、希希、果果、田田顺序为95、92、85、79次，填写全部四条记录。',
      rule: {
        kind: 'steps',
        values: [95, 92, 85, 79],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '年龄6、9、12、18不是次数；顺序依照题中四个姓名。',
    },
    {
      id: 'bnu-lower-harvest-counter-digits',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '四图依次表示冬冬95、希希92、果果85、田田79；按每图先十位后个位，填写全部八个数位数字。',
      rule: {
        kind: 'steps',
        values: [9, 5, 9, 2, 8, 5, 7, 9],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '数位数字顺序9/5、9/2、8/5、7/9，不能把9个十当9个一。',
      visual: {
        kind: 'place-counters',
        values: [95, 92, 85, 79],
      },
    },
    {
      id: 'bnu-lower-harvest-descending',
      knowledge: 'bnu-lower-harvest',
      prompt: '同一分钟四条记录95、92、85、79。按从多到少填写全部四个数。',
      rule: {
        kind: 'steps',
        values: [95, 92, 85, 79],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '95>92>85>79，逐个相邻比较，保留姓名对应。',
    },
    {
      id: 'bnu-lower-harvest-most',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '冬冬95、希希92、果果85、田田79，记录时长都为一分钟。谁的次数最多？',
      rule: {
        kind: 'choice',
        value: '冬冬',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '95是这四条给定记录最多，不是年龄最大者最多。',
      choices: [
        {
          id: '冬冬',
          label: '冬冬',
        },
        {
          id: '希希',
          label: '希希',
        },
        {
          id: '果果',
          label: '果果',
        },
        {
          id: '田田',
          label: '田田',
        },
      ],
    },
    {
      id: 'bnu-lower-harvest-unit',
      knowledge: 'bnu-lower-harvest',
      prompt: '原四条心跳记录都对应多长时间，才在本题直接比较？',
      rule: {
        kind: 'choice',
        value: '一分钟',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '记录时长相同；本题只比较给定次数，不做真实测量或健康判断。',
      choices: [
        {
          id: '一分钟',
          label: '一分钟',
        },
        {
          id: '只看年龄不用时长',
          label: '只看年龄不用时长',
        },
        {
          id: '任意不同的时间',
          label: '任意不同的时间',
        },
      ],
    },
    {
      id: 'bnu-lower-harvest-age-not-counts',
      knowledge: 'bnu-lower-harvest',
      prompt: '冬冬标签6岁，一分钟记录95次。6在这两项信息中表示什么？',
      rule: {
        kind: 'choice',
        value: '年龄',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '年龄单位岁与次数单位次分开；6不能代替95。',
      choices: [
        {
          id: '年龄',
          label: '年龄',
        },
        {
          id: '心跳次数',
          label: '心跳次数',
        },
        {
          id: '十位数字',
          label: '十位数字',
        },
      ],
    },
    {
      id: 'bnu-lower-harvest-tens95',
      knowledge: 'bnu-lower-harvest',
      prompt: '95的十位数字是几？',
      rule: {
        kind: 'number',
        value: 9,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '十位9表示9个十。',
      visual: {
        kind: 'place-counters',
        values: [95],
      },
    },
    {
      id: 'bnu-lower-harvest-ones95',
      knowledge: 'bnu-lower-harvest',
      prompt: '95的个位数字是几？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '个位5表示5个一。',
      visual: {
        kind: 'place-counters',
        values: [95],
      },
    },
    {
      id: 'bnu-lower-harvest-beads95',
      knowledge: 'bnu-lower-harvest',
      prompt: '计数器表示95，十位9颗、个位5颗。图中实际共有多少颗珠？',
      rule: {
        kind: 'number',
        value: 14,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '9+5=14颗材料珠，表示的数仍是95。',
      visual: {
        kind: 'place-counters',
        values: [95],
      },
    },
    {
      id: 'bnu-lower-harvest-compare-method',
      knowledge: 'bnu-lower-harvest',
      prompt: '同为两位数的92和85，先比较哪一位才能判断大小？',
      rule: {
        kind: 'choice',
        value: '十位',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '十位9比8大，92>85；只有十位相同才继续比个位。',
      choices: [
        {
          id: '十位',
          label: '十位',
        },
        {
          id: '只看个位',
          label: '只看个位',
        },
        {
          id: '数年龄标签',
          label: '数年龄标签',
        },
      ],
    },
    {
      id: 'bnu-lower-harvest-not-health-rule',
      knowledge: 'bnu-lower-harvest',
      prompt: '这四条一分钟记录能直接证明所有人年龄越大心跳就一定越少吗？',
      rule: {
        kind: 'choice',
        value: '不能，只比较题中四条记录',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '数学情境给定记录不推出普遍健康规律，不要求真实测量或个人身体数据。',
      choices: [
        {
          id: '不能，只比较题中四条记录',
          label: '不能，只比较题中四条记录',
        },
        {
          id: '能，对所有人都成立',
          label: '能，对所有人都成立',
        },
        {
          id: '能，不需要其它条件',
          label: '能，不需要其它条件',
        },
      ],
    },
    {
      id: 'bnu-lower-harvest-site-zero',
      knowledge: 'bnu-lower-harvest',
      prompt: '本站另给计数器表示90，十位9颗、个位没有珠。个位数字是多少？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '个位真实0是已知的数位，不是未填或未知。',
      visual: {
        kind: 'place-counters',
        values: [90],
      },
    },
    {
      id: 'bnu-lower-harvest-eighty-five',
      knowledge: 'bnu-lower-harvest',
      prompt: '第57页中心数是85，原十位8颗、个位5颗计数器表示多少？',
      rule: {
        kind: 'number',
        value: 85,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '8个十和5个一是85，不把材料珠数13当表示值。',
      visual: {
        kind: 'place-counters',
        values: [85],
      },
    },
    {
      id: 'bnu-lower-harvest-tens85',
      knowledge: 'bnu-lower-harvest',
      prompt: '85的十位数字是多少？',
      rule: {
        kind: 'number',
        value: 8,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '8在十位，表示8个十。',
      visual: {
        kind: 'place-counters',
        values: [85],
      },
    },
    {
      id: 'bnu-lower-harvest-ones85',
      knowledge: 'bnu-lower-harvest',
      prompt: '85的个位数字是多少？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '5在个位，表示5个一。',
      visual: {
        kind: 'place-counters',
        values: [85],
      },
    },
    {
      id: 'bnu-lower-harvest-beads85',
      knowledge: 'bnu-lower-harvest',
      prompt: '85计数器十位8颗、个位5颗，材料珠共有多少颗？',
      rule: {
        kind: 'number',
        value: 13,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '8+5=13颗珠，但数位约定下表示85。',
      visual: {
        kind: 'place-counters',
        values: [85],
      },
    },
    {
      id: 'bnu-lower-harvest-decomposition',
      knowledge: 'bnu-lower-harvest',
      prompt: '把85表示成整十部分与个位部分相加，依次填两个部分。',
      rule: {
        kind: 'steps',
        values: [80, 5],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '8个十是80，所以80+5=85；8+5=13不是85的这个拆法。',
    },
    {
      id: 'bnu-lower-harvest-symbols',
      knowledge: 'bnu-lower-harvest',
      prompt: '原小图有8个长方形和5个三角形，按这个类别顺序填写图形件数。',
      rule: {
        kind: 'steps',
        values: [8, 5],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '记录物件8和5，不把长方形每个代表十的约定当原图写明的图例。',
    },
    {
      id: 'bnu-lower-harvest-symbol-count',
      knowledge: 'bnu-lower-harvest',
      prompt: '原小图8个长方形和5个三角形，图形件数一共有多少？',
      rule: {
        kind: 'number',
        value: 13,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '物件共有13；若约定长方形代表十、三角形代表一，才表示85。',
    },
    {
      id: 'bnu-lower-harvest-symbol-convention',
      knowledge: 'bnu-lower-harvest',
      prompt: '本站若用8个长方形、5个三角形表示85，需要说明哪一种数量约定？',
      rule: {
        kind: 'choice',
        value: '每长方形代表十，每三角形代表一',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '本站明确单位约定；原图未独立写图例，不声称形状在所有题中都代表同样数量。',
      choices: [
        {
          id: '每长方形代表十，每三角形代表一',
          label: '每长方形代表十，每三角形代表一',
        },
        {
          id: '每个图形都只代表一',
          label: '每个图形都只代表一',
        },
        {
          id: '只看形状就能默认意思',
          label: '只看形状就能默认意思',
        },
      ],
    },
    {
      id: 'bnu-lower-harvest-actual-four-counters',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '实际在纸上按95、92、85、79依次画出全部四个计数器，逐个核对十位和个位。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '四个都做，不以网页填八个数字代替实际画图；纸面原书两栏，共享图的空百位只是本站辅助。',
    },
    {
      id: 'bnu-lower-harvest-actual-four-records',
      knowledge: 'bnu-lower-harvest',
      prompt: '实际按冬冬、希希、果果、田田的顺序写95、92、85、79及次数单位。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '年龄标签与次数分开，这是给定情境，不记录自己或家人的身体数据。',
    },
    {
      id: 'bnu-lower-harvest-actual-comparisons',
      knowledge: 'bnu-lower-harvest',
      prompt: '实际完整写并读95>92>85>79，说明冬冬最多和怎样比较数位。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '三个相邻关系全部核对，网站答案不自动确认纸笔和口述。',
    },
    {
      id: 'bnu-lower-harvest-actual-original85',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '实际查看第57页85的原表示图，解释计数器、80+5和图形数的各自数量约定。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '原图和本站辅助分开；未知图例先说明约定，不把材料13误写为表示值85。',
    },
    {
      id: 'bnu-lower-harvest-actual-own85-a',
      knowledge: 'bnu-lower-harvest',
      prompt: '实际在第一个空分支写或画自己的一种85表示，说明并核对总值。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '合理表示开放，可用文字、分组或不同分解；不限定一种标准作品，不以网页记录代替实做。',
    },
    {
      id: 'bnu-lower-harvest-actual-own85-b',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '实际在第二个空分支写或画另一种85表示，说明它与第一种有何不同并核对总值。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '两个空分支都实际尝试；另一种可以改变表示形式或分组，不用本站固定例子冒自己的作品。',
    },
    {
      id: 'bnu-lower-harvest-actual-explain85',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '实际向陪伴者解释自己的两种表示怎样都表示85，并核对数位与材料件数。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '真实解释由本人确认，不虚构同伴回复或自动评图画质量。',
    },
    {
      id: 'bnu-lower-harvest-actual-question-talk',
      knowledge: 'bnu-lower-harvest',
      prompt: '实际和陪伴者交流自己关于生活中的数的问题，听取或说明想法。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '开放讨论没有唯一是非答案；尚未讨论可跳过，不冒自己或同伴已经同意。',
    },
    {
      id: 'bnu-lower-harvest-actual-revisit',
      knowledge: 'bnu-lower-harvest',
      prompt:
        '实际回看本课四计数器、完整比较、两个85表示与问题交流，指出做过和还未做的项目。',
      rule: {
        kind: 'manual',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '学习正确率不证明真实画写或交流已完成；未做如实保留。',
    },
    {
      id: 'bnu-lower-harvest-own85-a',
      knowledge: 'bnu-lower-harvest',
      prompt: '记录自己在第一个空分支想怎样表示85，以及这个表示的数量约定。',
      rule: {
        kind: 'reflection',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '开放原话不评分；没实际做可说明是想法，与实做状态分开。',
    },
    {
      id: 'bnu-lower-harvest-own85-b',
      knowledge: 'bnu-lower-harvest',
      prompt: '记录第二种85表示和与第一种的不同。',
      rule: {
        kind: 'reflection',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '允许不同合理表示，不逼写统一样例；实际作品另确认。',
    },
    {
      id: 'bnu-lower-harvest-own-question',
      knowledge: 'bnu-lower-harvest',
      prompt: '记录自己关于生活中的数、现在学习范围或本课数位的一个问题。',
      rule: {
        kind: 'reflection',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation:
        '可以沿原问题，也可提出自己的问题；1～100是本课范围，不是全部数只到100。',
    },
    {
      id: 'bnu-lower-harvest-own-idea',
      knowledge: 'bnu-lower-harvest',
      prompt: '记录自己对问题的想法、理由或还不确定的地方。',
      rule: {
        kind: 'reflection',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '不设是或否唯一正确答案，不自动判掌握或品德。',
    },
    {
      id: 'bnu-lower-harvest-discovery',
      knowledge: 'bnu-lower-harvest',
      prompt: '记录本课一个真实发现。',
      rule: {
        kind: 'reflection',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '自己的发现开放记录，不由正确率自动确认交流。',
    },
    {
      id: 'bnu-lower-harvest-difficulty',
      knowledge: 'bnu-lower-harvest',
      prompt: '记录还有哪里不清楚。',
      rule: {
        kind: 'reflection',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '未知不当0，困难可以如实记录。',
    },
    {
      id: 'bnu-lower-harvest-plan',
      knowledge: 'bnu-lower-harvest',
      prompt: '单独记录下一次准备怎样练习数位、表示或比较。',
      rule: {
        kind: 'reflection',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '未来计划不记成已经画写、测量或交流。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-harvest-review-descending',
      knowledge: 'bnu-lower-harvest',
      prompt: '新四条数量记录甲87、乙89、丙76、丁94，按从多到少填全部四个。',
      rule: {
        kind: 'steps',
        values: [94, 89, 87, 76],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '重新比较新数，丁94最多、乙89第二、甲87第三、丙76最后。',
    },
    {
      id: 'bnu-lower-harvest-review-digits',
      knowledge: 'bnu-lower-harvest',
      prompt: '新四图按甲87、乙89、丙76、丁94，先十位后个位填全部八个数字。',
      rule: {
        kind: 'steps',
        values: [8, 7, 8, 9, 7, 6, 9, 4],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '新数位条件不同，不能沿用主课9/5、9/2、8/5、7/9。',
      visual: {
        kind: 'place-counters',
        values: [87, 89, 76, 94],
      },
    },
    {
      id: 'bnu-lower-harvest-review-beads',
      knowledge: 'bnu-lower-harvest',
      prompt: '新图表示99，十位9颗、个位9颗，材料珠共有多少颗？',
      rule: {
        kind: 'number',
        value: 18,
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '9+9=18颗，按数位表示99。',
      visual: {
        kind: 'place-counters',
        values: [99],
      },
    },
    {
      id: 'bnu-lower-harvest-review-decomposition',
      knowledge: 'bnu-lower-harvest',
      prompt: '这次把68表示为整十部分加个位部分，依次填两部分。',
      rule: {
        kind: 'steps',
        values: [60, 8],
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '6个十为60，60+8=68，不套用原80+5。',
    },
    {
      id: 'bnu-lower-harvest-review-most',
      knowledge: 'bnu-lower-harvest',
      prompt: '新甲87、乙89、丙76、丁94四条数量记录，哪个标签对应最多？',
      rule: {
        kind: 'choice',
        value: '丁',
      },
      hint: '先分清数位数字、材料件数和表示的数；读完整已知条件，再检查全部所求。真实画写和交流另行确认。',
      explanation: '丁94最多；按新标签和数量比较，不用原冬冬。',
      choices: [
        {
          id: '丁',
          label: '丁',
        },
        {
          id: '甲',
          label: '甲',
        },
        {
          id: '乙',
          label: '乙',
        },
        {
          id: '丙',
          label: '丙',
        },
      ],
    },
  ],
};
