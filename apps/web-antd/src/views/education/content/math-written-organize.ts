import type { Lesson } from '../learning/types';

export const writtenOrganizeLesson: Lesson = {
  id: 'ml-written-organize',
  textbookTitle: '100以内的笔算加、减法',
  title: '独立计算、开放探索与自主整理',
  page: 64,
  version: 1,
  status: 'available',
  prerequisite:
    '会基本加减、比较和竖式，能区分已知所求；实际纸笔材料按家庭条件准备。',
  goal: '按完整原条件计算和分类，自主提出问题、整理方法与探索所有合法数卡排列。',
  parentTip:
    '依据实际核读官方56～68页编写原创数据；原书全练习/自主问题和本站题分开。独立计算不累计，活动人数先确认无重叠，未知不当0；实物与交流按实际记录。',
  review: {
    date: '2026-10-03',
    reviewer: '官方逐页核读与原创整理探索核对',
    notes:
      '资源1221001102241图片62～74已实际查看，本课补60～61、63～68页整理应用与自主活动，不冒本校人数或旅行，不替教师最终审校。',
  },
  steps: [
    {
      title: '独立式每次回原条件',
      text: '同两数求和与差、三式关系与多个箭头，各式均回到自己的原数。求和后不能用新和再求原两数的差；同组逆式不是连续拿走。',
      activity: '实际给每道原数作记号并说明所求。',
    },
    {
      title: '连算使用真正的中间量',
      text: '连续变化按从左到右计算，第一步剩余或合计成为第二步起点。它与每次恢复的独立箭头不同，记录中间量和最终量，0要明确写。',
      activity: '实际画两步变化并标中间量。',
    },
    {
      title: '分类边界和信息是否足够',
      text: '大于50与小于50都不包含50。三组报名相加能否当不同人数，要先知道有无重复；单位或类别不同也不能乱合并。条件缺失不能当0。',
      activity: '实际比较等于与大于、小于，并指出题目缺的信息。',
    },
    {
      title: '四卡各一次，完整式子检查',
      text: '四张卡分别填A/B/C/D，使A+B−C=D。加两个数后减第三个得到第四个，也可把它看作两对数的和相同。四卡不重复、不遗漏，多种合法排列都接受，不固定一个示例。',
      activity: '实际摆两种不同排列并核对。',
      visual: {
        kind: 'card-equation',
        values: [18, 19, 20, 21],
      },
    },
    {
      title: '自己的知识图和新问题',
      text: '分别整理四类笔算并自己举例。根据完整情境或表格自主提出不同问题，说明条件、所求、关系、算式、单位答句和检查；有未知信息时如实保留。纸笔、摆卡、口述、交流与计划分别记录。',
      activity: '实际画知识图、提出问题并求解，再记录自己的收获与疑问。',
    },
  ],
  questions: [
    {
      id: 'ml-written-organize-q1',
      knowledge: 'ml-written-organize',
      prompt:
        '六张数对卡依次为29与14、42与7、35与18、46与23、58与12、39与26。每卡先求两数的和，再求大数减小数的差，按卡顺序填写12项。和与差均从原两数开始，不拿新和再减。',
      rule: {
        kind: 'steps',
        values: [43, 15, 49, 35, 53, 17, 69, 23, 70, 46, 65, 13],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '每卡两个独立所求：如29+14=43、29−14=15，不是43−14。',
    },
    {
      id: 'ml-written-organize-q2',
      knowledge: 'ml-written-organize',
      prompt:
        '四组各三式，逐组依次填结果：37+8、45−8、45−37；54+20、74−20、74−54；28+17、45−17、45−28；63+9、72−9、72−63。每式从原数开始，不连续套上一式结果。',
      rule: {
        kind: 'steps',
        values: [45, 37, 8, 74, 54, 20, 45, 28, 17, 72, 63, 9],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '各组体现两部分和整体，三式独立互相检查。',
    },
    {
      id: 'ml-written-organize-q3',
      knowledge: 'ml-written-organize',
      prompt:
        '分别给5、60、18各加27；再分别从24、38、57各减16。按这六个箭头顺序填结果；每箭头回到各自原数，不连续累计。',
      rule: {
        kind: 'steps',
        values: [32, 87, 45, 8, 22, 41],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '独立六式5+27、60+27、18+27、24−16、38−16、57−16。',
    },
    {
      id: 'ml-written-organize-q4',
      knowledge: 'ml-written-organize',
      prompt: '下列哪些算式的结果严格大于50？选全。',
      rule: {
        kind: 'set',
        values: ['57+8', '86−22', '31+20'],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '65、64、51大于50；等于50不能归入。',
      choices: [
        {
          id: '57+8',
          label: '57+8',
        },
        {
          id: '86−22',
          label: '86−22',
        },
        {
          id: '31+20',
          label: '31+20',
        },
        {
          id: '25+25',
          label: '25+25',
        },
        {
          id: '71−21',
          label: '71−21',
        },
        {
          id: '62−19',
          label: '62−19',
        },
        {
          id: '34+9',
          label: '34+9',
        },
      ],
    },
    {
      id: 'ml-written-organize-q5',
      knowledge: 'ml-written-organize',
      prompt: '下列哪些算式的结果严格小于50？选全。',
      rule: {
        kind: 'set',
        values: ['62−19', '34+9'],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '两式结果43；等于50不能归入小于50。',
      choices: [
        {
          id: '57+8',
          label: '57+8',
        },
        {
          id: '86−22',
          label: '86−22',
        },
        {
          id: '31+20',
          label: '31+20',
        },
        {
          id: '25+25',
          label: '25+25',
        },
        {
          id: '71−21',
          label: '71−21',
        },
        {
          id: '62−19',
          label: '62−19',
        },
        {
          id: '34+9',
          label: '34+9',
        },
      ],
    },
    {
      id: 'ml-written-organize-q6',
      knowledge: 'ml-written-organize',
      prompt: '25+25结果等于50，应放在“大于50”或“小于50”哪一组？',
      rule: {
        kind: 'choice',
        value: '两组都不属于',
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '大于和小于都是严格比较，等于50须另列，不能硬塞。',
      choices: [
        {
          id: '两组都不属于',
          label: '两组都不属于',
        },
        {
          id: '大于50',
          label: '大于50',
        },
        {
          id: '小于50',
          label: '小于50',
        },
      ],
    },
    {
      id: 'ml-written-organize-q7',
      knowledge: 'ml-written-organize',
      prompt:
        '三道连算86−24−35、73−28−19、41+26−18。每道按从左到右依次填第一步结果和最终结果，共6项；各道独立。',
      rule: {
        kind: 'steps',
        values: [62, 27, 45, 26, 67, 49],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '第一道用62再减35，第二道用45再减19，第三道用67再减18。',
    },
    {
      id: 'ml-written-organize-q8',
      knowledge: 'ml-written-organize',
      prompt:
        '外圈数98、75、89、80，内圈数36、13、27、18。每次独立选一外数减一内数，哪些组合的差等于62？选全。',
      rule: {
        kind: 'set',
        values: ['98−36', '75−13', '89−27', '80−18'],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '每次独立选，不把卡消耗掉；共有四组，按全部16种组合检查。',
      choices: [
        {
          id: '98−36',
          label: '98−36',
        },
        {
          id: '98−13',
          label: '98−13',
        },
        {
          id: '98−27',
          label: '98−27',
        },
        {
          id: '98−18',
          label: '98−18',
        },
        {
          id: '75−36',
          label: '75−36',
        },
        {
          id: '75−13',
          label: '75−13',
        },
        {
          id: '75−27',
          label: '75−27',
        },
        {
          id: '75−18',
          label: '75−18',
        },
        {
          id: '89−36',
          label: '89−36',
        },
        {
          id: '89−13',
          label: '89−13',
        },
        {
          id: '89−27',
          label: '89−27',
        },
        {
          id: '89−18',
          label: '89−18',
        },
        {
          id: '80−36',
          label: '80−36',
        },
        {
          id: '80−13',
          label: '80−13',
        },
        {
          id: '80−27',
          label: '80−27',
        },
        {
          id: '80−18',
          label: '80−18',
        },
      ],
    },
    {
      id: 'ml-written-organize-q9',
      knowledge: 'ml-written-organize',
      prompt:
        '活动三组分别25人、14人、48人，每人恰好参加一组，三组没有重复的人。共有多少不同的人？',
      rule: {
        kind: 'number',
        value: 87,
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '明确无重叠，25+14+48=87。',
    },
    {
      id: 'ml-written-organize-q10',
      knowledge: 'ml-written-organize',
      prompt:
        '活动三组分别25人、14人、48人，但不知道有没有人重复参加。能确定共有多少不同的人吗？',
      rule: {
        kind: 'choice',
        value: '不能确定，缺少是否重复的信息',
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '报名次数可以相加，但不同人数取决于重叠，未知不是0。',
      choices: [
        {
          id: '不能确定，缺少是否重复的信息',
          label: '不能确定，缺少是否重复的信息',
        },
        {
          id: '一定是87人',
          label: '一定是87人',
        },
        {
          id: '一定是0人',
          label: '一定是0人',
        },
      ],
    },
    {
      id: 'ml-written-organize-q11',
      knowledge: 'ml-written-organize',
      prompt: '原有44盒，卖出一些后剩29盒。卖出了多少盒？',
      rule: {
        kind: 'number',
        value: 15,
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '原整体44减剩余29，得到卖出的部分15，写答句时单位是盒。',
    },
    {
      id: 'ml-written-organize-q12',
      knowledge: 'ml-written-organize',
      prompt:
        '原创明信片表有四类：动物28张、植物21张、建筑24张、运动17张。分别求动物与植物的合计、建筑与运动的合计，依次填两项。',
      rule: {
        kind: 'steps',
        values: [49, 41],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '两问分别取自己的两类，28+21=49、24+17=41，不连续套用合计。',
    },
    {
      id: 'ml-written-organize-q13',
      knowledge: 'ml-written-organize',
      prompt:
        '四张数卡18、19、20、21各用一次，按A、B、C、D填数，使A+B−C=D。接受所有合法排列，不固定一种答案。',
      rule: {
        kind: 'card-equation',
        values: [18, 19, 20, 21],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation:
        '合法排列有多种，例如把两对等和数放在等式两侧；须四卡各一次并检查整条式子。',
      visual: {
        kind: 'card-equation',
        values: [18, 19, 20, 21],
      },
    },
    {
      id: 'ml-written-organize-q14',
      knowledge: 'ml-written-organize',
      prompt: '48−20−28，从左到右依次填第一步结果和最终结果。0不是空白。',
      rule: {
        kind: 'steps',
        values: [28, 0],
      },
      hint: '先确认每题原条件、所求和字段次序；独立算式与连续变化不同，0要明确填写。',
      explanation: '48−20=28，再减28剩0。',
    },
    {
      id: 'ml-written-organize-original-cards',
      knowledge: 'ml-written-organize',
      prompt:
        '实际合法阅读教材64页数对卡，逐卡求和与差，两个所求均从原卡数开始。另按67页完整四组三式和六个箭头分别计算检查。没有教材可跳过原书活动。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-original-classify',
      knowledge: 'ml-written-organize',
      prompt:
        '实际合法阅读教材65页，计算全部分类卡并按严格大于/小于50归类；等于50另列。完成三道连算并记录中间量，再找出内外数差62的所有组合。没有教材可跳过原书活动。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-original-final',
      knowledge: 'ml-written-organize',
      prompt:
        '实际合法阅读教材67～68页，逐项列式计算、比较和解决生活问题，写清单位答句并检查已知与所求。完整原书练习与本站原创数值分开，没有教材可跳过。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-original-question',
      knowledge: 'ml-written-organize',
      prompt:
        '实际合法阅读教材56页参观信息与63页自提问题要求，至少另提一个完整加法问题和一个减法问题；说明已知、所求、关系，列式计算，写单位答句。原书人数不冒本校实际人数，不要求外出。没有教材可跳过原图活动。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-knowledge-map',
      knowledge: 'ml-written-organize',
      prompt:
        '实际按66页整理要求，在纸上自己画知识图，分别列不进位加法、进位加法、不退位减法、退位减法的例子和关键方法。解释为什么这样分，实际展示交流可由家庭替代；没有交流如实记录，不把本站现成图当自己的作品。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-new-table-questions',
      knowledge: 'ml-written-organize',
      prompt:
        '实际根据本站四类明信片表另提至少两个不同问题，每题条件完整，明确所求，列式求解，带单位答句并核对。可提不同合计、比较或剩余问题，但不能凭空猜未知信息。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-card-explore',
      knowledge: 'ml-written-organize',
      prompt:
        '实际用纸卡18、19、20、21各一张摆A+B−C=D，找至少两种不同合法排列，每次四卡全部各用一次，逐一计算检查。再合法阅读68页原四数探索并尝试原题，原题与本站新卡分开；缺教材可跳过原题，网页排列不确认纸卡已做。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-independent-check',
      knowledge: 'ml-written-organize',
      prompt:
        '实际在纸上分别整理一组和差卡、三式、箭头和连算，给独立式标回原条件、给连续式标中间量。指着说明差别，不能把网页结果正确当纸笔和口述完成。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际阅读、书写、摆卡与表达记录，未做或只计划请跳过。',
      explanation: '原创练习与教材完整活动分别核对，不自动确认实物或交流完成。',
    },
    {
      id: 'ml-written-organize-reflect-rule',
      knowledge: 'ml-written-organize',
      prompt:
        '如实记录：你实际怎样区分独立算式、连续变化和分类边界？未做或不明白可写下来。',
      rule: {
        kind: 'reflection',
      },
      hint: '保存孩子原话，允许家长代写；计划与实做分开。',
      explanation: 'correct为null，不评星，不代替实际活动。',
    },
    {
      id: 'ml-written-organize-reflect-question',
      knowledge: 'ml-written-organize',
      prompt:
        '如实记录：你实际自己提出了什么问题，条件和单位是否够用，还有哪些问题不能确定？',
      rule: {
        kind: 'reflection',
      },
      hint: '保存孩子原话，允许家长代写；计划与实做分开。',
      explanation: 'correct为null，不评星，不代替实际活动。',
    },
    {
      id: 'ml-written-organize-reflect-map',
      knowledge: 'ml-written-organize',
      prompt:
        '如实记录：你实际知识整理或摆卡有什么收获、疑问和交流反馈？未来打算另外记，不当已完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '保存孩子原话，允许家长代写；计划与实做分开。',
      explanation: 'correct为null，不评星，不代替实际活动。',
    },
  ],
  reviewQuestions: [
    {
      id: 'ml-written-organize-review1',
      knowledge: 'ml-written-organize',
      prompt:
        '两张数对卡分别31与18、56与27。每卡先求和再求大数减小数的差，依次填4项，每式从原两数开始。',
      rule: {
        kind: 'steps',
        values: [49, 13, 83, 29],
      },
      hint: '换了数值与原条件，重新计算，不照搬旧答案。',
      explanation: '31+18=49/31−18=13；56+27=83/56−27=29。',
    },
    {
      id: 'ml-written-organize-review2',
      knowledge: 'ml-written-organize',
      prompt:
        '分别给7、51、24各加32；再分别从31、46、62各减19，依次填6项，每箭头回原数。',
      rule: {
        kind: 'steps',
        values: [39, 83, 56, 12, 27, 43],
      },
      hint: '换了数值与原条件，重新计算，不照搬旧答案。',
      explanation: '六式独立，不连续累计。',
    },
    {
      id: 'ml-written-organize-review3',
      knowledge: 'ml-written-organize',
      prompt: '两道连算92−28−37、35+29−24，每道依次填中间量与最终结果。',
      rule: {
        kind: 'steps',
        values: [64, 27, 64, 40],
      },
      hint: '换了数值与原条件，重新计算，不照搬旧答案。',
      explanation: '92−28=64再减37；35+29=64再减24。',
    },
    {
      id: 'ml-written-organize-review4',
      knowledge: 'ml-written-organize',
      prompt:
        '新卡22、23、24、25各一次，填A、B、C、D使A+B−C=D，所有合法排列都接受。',
      rule: {
        kind: 'card-equation',
        values: [22, 23, 24, 25],
      },
      hint: '换了数值与原条件，重新计算，不照搬旧答案。',
      explanation: '两对之和各47，四卡各用一次检查整式。',
      visual: {
        kind: 'card-equation',
        values: [22, 23, 24, 25],
      },
    },
  ],
};
