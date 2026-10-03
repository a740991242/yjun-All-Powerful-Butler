import type { Lesson } from '../learning/types';

export const bnuSixNineRelationsLesson: Lesson = {
  id: 'bnu-upper-six-nine-relations',
  textbookTitle: '10以内数加与减',
  title: '六到九完整分合与加减关系',
  page: 48,
  version: 1,
  status: 'available',
  goal: '完整列举六到九含0分法与相应算式，区分部分、总数、已知隐藏量和连续变化。',
  prerequisite: '会点数0～9并理解五以内合并和取走。',
  parentTip:
    '对应48～54页。本站纸卡与点图原创，不复制原画；原书任务、实际完整摆分、写读与方法说明独立记录。长组分法可分次完成，网页作答不代替实做。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷48～54页已实际查看；猜数、六七分合与拨珠、土豆变化、课间、八九分合/补画/涂格、图题与开放结果盒。ISBN和印次未知。',
  },
  steps: [
    {
      title: '猜数要有已知总量',
      text: '本站6张纸卡露出4张、遮住2张；可想4添2成6，或从6去掉可见4。总数若未知，不能只凭露出4就确定隐藏量。每次猜数先核对所有卡，没有增减。',
      activity: '实际用安全纸卡演示已知总量和未知条件。',
    },
    {
      title: '接着数与所求不同',
      text: '从5添2时，接着报6、7；新增2张和现在7张是不同问题。可以从头点数、接着数或分合核对，方法原话和实际操作另记。',
      activity: '实际演示两种方法，分别说新增和全部。',
    },
    {
      title: '六与七完整分合',
      text: '每个总量分别恢复后，第一部分从0到总数逐个变化，第二部分由总数减少到0。6有7组有序分法，7有8组；组数不是总卡数。每张只在一个部分，不漏不重复。',
      activity: '实际完整摆分，含空部分与全部取走。',
    },
    {
      title: '八与九完整分合',
      text: '本站6张红与2张蓝同时出现，合起来8张；静态分组不说明有卡后来到来。九格涂1未涂8仍9格。8、9的全部分法也包含0；每次恢复，不能将几次实验当连续取走。',
      activity: '实际按两种总量逐一摆分、补画并核对。',
      visual: {
        kind: 'count-groups',
        groups: [6, 2],
      },
    },
    {
      title: '加减法对应与零',
      text: '两部分合起来是总量，总量去掉一部分剩另一部分。每种分法可以写加法及减法；0表示已知空部分，减0数量不变，减去全部剩0。交换部分要重新看式子所求。',
      activity: '实际写读并用同一批卡核对。',
    },
    {
      title: '缺数题与连续变化',
      text: '空格有时求结果，有时求一个部分；先读完整等式。独立式子每次回原条件；若明确先取再取，第二次从当时剩余出发。本站7先取1，再取剩余全部，分别剩6、0。',
      activity: '实际摆卡和画点说明缺数位置与阶段条件。',
    },
    {
      title: '原书与自主故事',
      text: '回看48～54页全部图题、分合、拨珠、补画与结果盒卡片，原图与本站原创题分开。结果盒标签表示得数，不表示未知盒中有几张卡。自画故事说条件、单位与答句，不把网页填对当原书实做。',
      activity: '完成原书范围并实际说一次方法，计划另记。',
    },
  ],
  questions: [
    {
      id: 'bnu-upper-six-nine-relations-q1',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '本站6张纸卡全部取走6张，剩余几张？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '全部取走后已知没有，填0而不是空白。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q2',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '本站一共6张纸卡，露出4张，其余全部遮住且没有增减，遮住几张？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '总数6减露出4得遮住2。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q3',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '本站从5开始，再实际添2张，接着数报6、7；后来添了几张？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '接着报两个数，起始5不当后来新增。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q4',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '上一情境起始5张，再实际添2张，现在总共几张？',
      rule: {
        kind: 'number',
        value: 7,
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '求现在总量，5+2=7。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q5',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '本站同一时刻纸图分为6张红卡和2张蓝卡，仅凭这两部分能说后来新增2张吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '静态部分合并不冒发生过增加事件。',
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
      id: 'bnu-upper-six-nine-relations-q6',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '本站第一组6张、第二组2张，两组互不重复；只问全部卡共有几张？',
      rule: {
        kind: 'number',
        value: 8,
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '全部数两组，6+2=8。',
      visual: {
        kind: 'count-groups',
        groups: [6, 2],
      },
    },
    {
      id: 'bnu-upper-six-nine-relations-q7',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '本站九格有1格已涂、8格未涂；只问全部格共有几格？',
      rule: {
        kind: 'number',
        value: 9,
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '已涂与未涂两部分合起来是9格，不只数涂色。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q8',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '只知露出4张卡，没有给总数，也没打开遮挡处，能确定遮住2张吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '已知总量才能由总减可见求遮挡，未知不猜确定数。',
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
      id: 'bnu-upper-six-nine-relations-partition-6',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '每次先恢复6张卡。第一部分依次取0、1、2、3、4、5、6张，依次填第二部分的张数，每次只填该次剩余。',
      rule: {
        kind: 'steps',
        values: [6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation:
        '从取0到全部取走完整列举，独立实验都先恢复，不连着累计取走。',
    },
    {
      id: 'bnu-upper-six-nine-relations-add-6',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：0+6；1+5；2+4；3+3；4+2；5+1；6+0。',
      rule: {
        kind: 'steps',
        values: [6, 6, 6, 6, 6, 6, 6],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '同一个总量的全部有序分法对应加法，包含两端的0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-sub-6',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：6−0；6−1；6−2；6−3；6−4；6−5；6−6。',
      rule: {
        kind: 'steps',
        values: [6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '每条减法独立从同一个总量出发；减0不变，减全部得0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-partition-7',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '每次先恢复7张卡。第一部分依次取0、1、2、3、4、5、6、7张，依次填第二部分的张数，每次只填该次剩余。',
      rule: {
        kind: 'steps',
        values: [7, 6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation:
        '从取0到全部取走完整列举，独立实验都先恢复，不连着累计取走。',
    },
    {
      id: 'bnu-upper-six-nine-relations-add-7',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：0+7；1+6；2+5；3+4；4+3；5+2；6+1；7+0。',
      rule: {
        kind: 'steps',
        values: [7, 7, 7, 7, 7, 7, 7, 7],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '同一个总量的全部有序分法对应加法，包含两端的0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-sub-7',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：7−0；7−1；7−2；7−3；7−4；7−5；7−6；7−7。',
      rule: {
        kind: 'steps',
        values: [7, 6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '每条减法独立从同一个总量出发；减0不变，减全部得0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-partition-8',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '每次先恢复8张卡。第一部分依次取0、1、2、3、4、5、6、7、8张，依次填第二部分的张数，每次只填该次剩余。',
      rule: {
        kind: 'steps',
        values: [8, 7, 6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation:
        '从取0到全部取走完整列举，独立实验都先恢复，不连着累计取走。',
    },
    {
      id: 'bnu-upper-six-nine-relations-add-8',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：0+8；1+7；2+6；3+5；4+4；5+3；6+2；7+1；8+0。',
      rule: {
        kind: 'steps',
        values: [8, 8, 8, 8, 8, 8, 8, 8, 8],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '同一个总量的全部有序分法对应加法，包含两端的0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-sub-8',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：8−0；8−1；8−2；8−3；8−4；8−5；8−6；8−7；8−8。',
      rule: {
        kind: 'steps',
        values: [8, 7, 6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '每条减法独立从同一个总量出发；减0不变，减全部得0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-partition-9',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '每次先恢复9张卡。第一部分依次取0、1、2、3、4、5、6、7、8、9张，依次填第二部分的张数，每次只填该次剩余。',
      rule: {
        kind: 'steps',
        values: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation:
        '从取0到全部取走完整列举，独立实验都先恢复，不连着累计取走。',
    },
    {
      id: 'bnu-upper-six-nine-relations-add-9',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：0+9；1+8；2+7；3+6；4+5；5+4；6+3；7+2；8+1；9+0。',
      rule: {
        kind: 'steps',
        values: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '同一个总量的全部有序分法对应加法，包含两端的0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-sub-9',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '分别填下面每条独立算式的结果，按列出顺序填写：9−0；9−1；9−2；9−3；9−4；9−5；9−6；9−7；9−8；9−9。',
      rule: {
        kind: 'steps',
        values: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '每条减法独立从同一个总量出发；减0不变，减全部得0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q21',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '按给定顺序独立计算：6−3；1+5；6−6；4+2；0+5；3+3；4+0；6−0。',
      rule: {
        kind: 'steps',
        values: [3, 6, 0, 6, 5, 6, 4, 6],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '零和空白分清，完整八式逐项核对。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q22',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '逐项填空：5+1=□；4+□=6；3+□=6；2+□=6；6−5=□；6−□=4；6−□=3；6−2=□。',
      rule: {
        kind: 'steps',
        values: [6, 2, 3, 4, 1, 2, 3, 4],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '有的空是结果，有的空是部分；减去的数与剩余不同。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q23',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '逐项填空：6+1=□；3+□=7；2+□=7；7−6=□；7−3=□；7−2=□。',
      rule: {
        kind: 'steps',
        values: [7, 4, 5, 1, 4, 5],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '每一项重新看所求，不机械填同一个数。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q24',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '逐项填空：4+□=8；2+□=8；2+□=9；□+5=9。',
      rule: {
        kind: 'steps',
        values: [4, 6, 7, 4],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '明确总量再求缺少的部分，完整四项。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q25',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '逐项填空：4+□=7；2+□=8；□+3=9。',
      rule: {
        kind: 'steps',
        values: [3, 6, 6],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '对应不同总量；各项独立。',
    },
    {
      id: 'bnu-upper-six-nine-relations-q26',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '本站7张先取1张，再把当时剩下的全部取走。依次填第一次和第二次取走后剩余。',
      rule: {
        kind: 'steps',
        values: [6, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '第一次剩6，第二次取剩余全部6，所以最终0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-actual-guess',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '实际用6张卡做总数已知的遮挡猜数，分别用添卡与取卡核对；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '只记录实际操作与完整原书任务，不由网页答对代替。',
    },
    {
      id: 'bnu-upper-six-nine-relations-actual-partitions',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '实际分别摆6、7、8、9张，每个总量逐一完成含0和全部的所有分法；每次恢复再分，做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '只记录实际操作与完整原书任务，不由网页答对代替。',
    },
    {
      id: 'bnu-upper-six-nine-relations-actual-equations',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '实际写读六到九每种分法对应的加法及两种减法，交换两部分时仍核对所求；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '只记录实际操作与完整原书任务，不由网页答对代替。',
    },
    {
      id: 'bnu-upper-six-nine-relations-actual-missing',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '实际用纸卡或画点核对本课全部缺数式，区分求部分和求结果；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '只记录实际操作与完整原书任务，不由网页答对代替。',
    },
    {
      id: 'bnu-upper-six-nine-relations-actual-stories',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '实际自画一个静态分组故事和一个明确新增/取走故事，分别写条件、算式、单位与答句；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '只记录实际操作与完整原书任务，不由网页答对代替。',
    },
    {
      id: 'bnu-upper-six-nine-relations-actual-book',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '实际回看48～54页，完成猜数与分合、果/猫/蚂蚁/鸟图、八式与拨珠、背土豆和掉落、7的图与拨珠、课间两类范围、8/9补图涂格与分法、鱼/狗/吃瓜/结果盒开放卡片；原书与本站纸卡分别记录，做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '只记录实际操作与完整原书任务，不由网页答对代替。',
    },
    {
      id: 'bnu-upper-six-nine-relations-actual-explain',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '实际向同伴说明一种接着数、去掉或分合方法，再根据实际反馈核对一次；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '只记录实际操作与完整原书任务，不由网页答对代替。',
    },
    {
      id: 'bnu-upper-six-nine-relations-reflection-method',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '今天实际用了哪种方法？记录原话或仍有疑问，不自动评星。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '开放记录correct:null。',
    },
    {
      id: 'bnu-upper-six-nine-relations-reflection-plan',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '下次准备怎样核对遗漏的分法或缺数？这是未来计划，不当今天已经完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '计划与实际完成分开。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-upper-six-nine-relations-review-partition',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt:
        '换成8张纸卡，每次先恢复；第一部分按8、6、4、2、0张取，依次填第二部分。',
      rule: {
        kind: 'steps',
        values: [0, 2, 4, 6, 8],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '次序和取数改变，独立核对。',
    },
    {
      id: 'bnu-upper-six-nine-relations-review-hidden',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '新纸卡总数9张，露出6张，无增减，其余全部遮住，遮住几张？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '9−6=3；新总量与露出改变。',
    },
    {
      id: 'bnu-upper-six-nine-relations-review-missing',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '新条件逐项填空：□+4=8；9−□=5；7+□=9；8−8=□。',
      rule: {
        kind: 'steps',
        values: [4, 4, 2, 0],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '每项所求和条件改变，包含正确0。',
    },
    {
      id: 'bnu-upper-six-nine-relations-review-continuous',
      knowledge: 'bnu-upper-six-nine-relations',
      prompt: '新情境9张先取3张，再从剩余取2张。依次填两次取走后剩余。',
      rule: {
        kind: 'steps',
        values: [6, 4],
      },
      hint: '先确定总数、部分和所求；各题按明确次序逐项核对，不把空白当0。',
      explanation: '先剩6再剩4，不每次从9出发。',
    },
  ],
};
