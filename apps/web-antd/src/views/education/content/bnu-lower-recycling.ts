import type { Lesson } from '../learning/types';

export const bnuLowerRecyclingLesson: Lesson = {
  id: 'bnu-lower-recycling',
  textbookTitle: '回收废品',
  title: '按问题找信息、摆棒画图与检查',
  page: 72,
  version: 1,
  status: 'available',
  goal: '完整对应72～73七原活动，筛选小佳所需条件，用全部配对圆和小棒表示13多3，列式检查并实际交流自己的方法。',
  prerequisite:
    '认识百以内数，能做不进位加法和不退位减法，知道一捆小棒表示10根。',
  parentTip:
    '原两整页核对；只求小佳时少4暂不用，换问小强才有用。原图与本站原创图分开；纸面活动人工确认、开放记录null、计划独立。无需真实废品或学校信息，最终教师试用未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '72～73完整条件与棒图圆图核对',
    notes: '原七活动对应；页面三宽已验，最终教师试用未核验。',
  },
  steps: [
    {
      title: '知道什么，问题问谁',
      text: '原72页三人信息分别是小林13个、小佳比小林多3个、小强比小佳少4个。原问题问小佳有多少个塑料瓶。先指人物和比较关系，13是数量，3和4是不同的差。',
      activity: '回合法教材真实读信息并指所求。',
    },
    {
      title: '只找当前所需信息',
      text: '小佳的数量与小林有关，用13和多3就能求。小强少4暂时不用，不是说这条信息永远没用；当前问题不是小强或三人合计。',
      activity: '实际圈信息，说明理由。',
    },
    {
      title: '用小棒表示',
      text: '一根小棒对应一个塑料瓶，原13可用一捆10根和3根表示，另外添3根。图里一捆是10根的约定，不能把一捆当1根或按扫描图可见线数猜捆内根数。本站原创图不自动确认真实操作。',
      activity: '实际摆棒或干净纸条。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'rods',
        variant: 'main',
      },
    },
    {
      title: '画完整的一一对应圆图',
      text: '小林一行画13个，小佳先画同样13个并逐一对齐，再在右边添3个。上行和下行对齐部分不是两个加数26；小佳的对齐部分与额外部分才是13+3。',
      activity: '实际画全部圆并逐一配对。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'main',
      },
    },
    {
      title: '列式与完整回答',
      text: '13+3=16（个），小佳收集16个塑料瓶。13是小林的数量，3是小佳比他多的数量，16是小佳全部。原塑料瓶单位个，小棒单位根，人数单位人。',
      activity: '实际写算式、单位和答句。',
    },
    {
      title: '回到条件检查',
      text: '检查16比13多3，可以16−13=3，也可以回自己的图找同样13和多3。不能把16+13当检查差，也不能多减4得到小强而错答小佳。',
      activity: '真实回到图和条件检查。',
    },
    {
      title: '换问题，信息也可能换',
      text: '本站扩展改问小强，已求小佳16，再16−4=12；这时少4有用。这是换所求任务，不把12当原小佳答案。本站新复习换成17、多2、少5，要重新判断。',
      activity: '实际比较两个所求的信息用途。',
    },
    {
      title: '我的方法与收获',
      text: '摆棒、画图与根据问题找信息都可帮助解题。用自己的话说明做过什么和还有何疑惑，开放原话不统一评分，未发生交流不当已经做过。',
      activity: '实际交流方法，如实记原话。',
    },
    {
      title: '真实活动与网站答题分开',
      text: '纸面圈信息、摆棒、画图、列式、检查和讨论各自记录。无需收集或接触真实废品，可用干净纸片模拟；模拟不冒真实回收活动。',
      activity: '真实做过才确认对应活动。',
    },
    {
      title: '零与下一次计划',
      text: '本站另给画13圆擦去13，剩0，空格未填不是0。下一次自编题的计划单独保存，不自动计为已经完成。',
      activity: '分别记已做、疑惑和未来计划。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-recycling-asked',
      knowledge: 'bnu-lower-recycling',
      prompt: '原题“小佳收集了多少个塑料瓶”，问的是谁？',
      rule: {
        kind: 'choice',
        value: '小佳',
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '先找到所求对象，不是看到最后一个人就算最后一个人。',
      choices: [
        {
          id: '小佳',
          label: '小佳',
        },
        {
          id: '小林',
          label: '小林',
        },
        {
          id: '小强',
          label: '小强',
        },
      ],
    },
    {
      id: 'bnu-lower-recycling-conditions',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '原三条信息依次填：小林的个数、小佳比小林多的个数、小强比小佳少的个数。',
      rule: {
        kind: 'steps',
        values: [13, 3, 4],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '13是已有数量，3与4分别是不同两人的差。',
    },
    {
      id: 'bnu-lower-recycling-relevant',
      knowledge: 'bnu-lower-recycling',
      prompt: '求小佳的数量，需要哪组信息？',
      rule: {
        kind: 'choice',
        value: '小林13个，小佳比小林多3个',
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '13是比较起点，多3是小佳与这个起点的关系。',
      choices: [
        {
          id: '小林13个，小佳比小林多3个',
          label: '小林13个，小佳比小林多3个',
        },
        {
          id: '小林13个，小强比小佳少4个',
          label: '小林13个，小强比小佳少4个',
        },
        {
          id: '只用“小强比小佳少4个”',
          label: '只用“小强比小佳少4个”',
        },
      ],
    },
    {
      id: 'bnu-lower-recycling-unused',
      knowledge: 'bnu-lower-recycling',
      prompt: '当前只求小佳，哪条信息暂时不用？',
      rule: {
        kind: 'choice',
        value: '小强比小佳少4个',
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '少4涉及小强，当前不求他；换问小强时可能要用。',
      choices: [
        {
          id: '小强比小佳少4个',
          label: '小强比小佳少4个',
        },
        {
          id: '小林13个',
          label: '小林13个',
        },
        {
          id: '小佳比小林多3个',
          label: '小佳比小林多3个',
        },
      ],
    },
    {
      id: 'bnu-lower-recycling-direction',
      knowledge: 'bnu-lower-recycling',
      prompt: '小佳比小林多3个，小佳的数量应怎样求？',
      rule: {
        kind: 'choice',
        value: '在13的基础上加3',
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '“多3”意味着比小林的13增加3，不能继续减成小强。',
      choices: [
        {
          id: '在13的基础上加3',
          label: '在13的基础上加3',
        },
        {
          id: '从13里减3',
          label: '从13里减3',
        },
        {
          id: '先加3再减4',
          label: '先加3再减4',
        },
      ],
    },
    {
      id: 'bnu-lower-recycling-baseline',
      knowledge: 'bnu-lower-recycling',
      prompt: '小棒先表示小林的数量，需要多少根？一根对应一个塑料瓶。',
      rule: {
        kind: 'number',
        value: 13,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '对应已知小林13个。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'rods',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-recycling-one-to-one',
      knowledge: 'bnu-lower-recycling',
      prompt: '本课一根小棒对应几个塑料瓶？',
      rule: {
        kind: 'number',
        value: 1,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '一根对应一个；小棒根数与瓶子个数是不同单位。',
    },
    {
      id: 'bnu-lower-recycling-rod-groups',
      knowledge: 'bnu-lower-recycling',
      prompt: '按图依次填：一捆代表几根、原有单根几根、另外多出单根几根。',
      rule: {
        kind: 'steps',
        values: [10, 3, 3],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '一捆按已学约定10根，原有3根，再添3根。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'rods',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-recycling-circle-groups',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '圆图依次填：小林这一行、小佳与小林对齐的部分、小佳另外多的部分，各有几个圆。',
      rule: {
        kind: 'steps',
        values: [13, 13, 3],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '两行的13逐一对齐，右边另有3。每个圆对应一个塑料瓶。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-recycling-matched',
      knowledge: 'bnu-lower-recycling',
      prompt: '小佳与小林一一对齐的这一部分对应几个塑料瓶？',
      rule: {
        kind: 'number',
        value: 13,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '同样多的部分是13，不是两行相加26。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-recycling-extra',
      knowledge: 'bnu-lower-recycling',
      prompt: '小佳右边另外多的部分对应几个塑料瓶？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '右边分开的3是多出的数量，不是全部。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-recycling-total',
      knowledge: 'bnu-lower-recycling',
      prompt: '小佳一共收集多少个塑料瓶？',
      rule: {
        kind: 'number',
        value: 16,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '13+3=16，所求是小佳。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-recycling-equation',
      knowledge: 'bnu-lower-recycling',
      prompt: '填写小佳的加法算式：第一加数、第二加数、结果，依次填三个数。',
      rule: {
        kind: 'steps',
        values: [13, 3, 16],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '13+3=16（个），完整回答：小佳收集16个塑料瓶。',
    },
    {
      id: 'bnu-lower-recycling-unit',
      knowledge: 'bnu-lower-recycling',
      prompt: '回答原题“小佳收集16___塑料瓶”，空格用哪个单位？',
      rule: {
        kind: 'choice',
        value: '个',
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '原题用个；小棒用根，人数用人，不混用。',
      choices: [
        {
          id: '个',
          label: '个',
        },
        {
          id: '根',
          label: '根',
        },
        {
          id: '人',
          label: '人',
        },
      ],
    },
    {
      id: 'bnu-lower-recycling-check',
      knowledge: 'bnu-lower-recycling',
      prompt: '把结果放回条件，依次填小佳的数量、小林的数量、两人相差的数量。',
      rule: {
        kind: 'steps',
        values: [16, 13, 3],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '16−13=3，确实比小林多3。',
    },
    {
      id: 'bnu-lower-recycling-check-method',
      knowledge: 'bnu-lower-recycling',
      prompt: '哪种办法是在检查“小佳比小林多3个”？',
      rule: {
        kind: 'choice',
        value: '用16减13，看是不是3',
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '检查比较关系，不是把两个人合并，也不是改变所求对象。',
      choices: [
        {
          id: '用16减13，看是不是3',
          label: '用16减13，看是不是3',
        },
        {
          id: '把16加13，看是不是3',
          label: '把16加13，看是不是3',
        },
        {
          id: '用13加3再减4，把12当小佳',
          label: '用13加3再减4，把12当小佳',
        },
      ],
    },
    {
      id: 'bnu-lower-recycling-changed-ask',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站改问小强：小佳已求得16个，小强比小佳少4个。小强有几个？',
      rule: {
        kind: 'number',
        value: 12,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation:
        '16−4=12。这是本站换所求题，不是原小佳题的答案；4不是永远无用。',
    },
    {
      id: 'bnu-lower-recycling-site-zero',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站另给：一张纸上画13个圆，擦去全部13个，剩几个圆？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '13−13=0。明确已知剩0，不是空格未填。',
    },
    {
      id: 'bnu-lower-recycling-actual-read',
      knowledge: 'bnu-lower-recycling',
      prompt: '回到合法教材72页，真实读三条条件和问题，并指明每条讲的是谁。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-actual-info',
      knowledge: 'bnu-lower-recycling',
      prompt: '在纸上实际圈出当前求小佳所需信息，说明少4这条为何暂时不用。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-actual-rods',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '用干净小棒或纸条真实摆13根，再另外摆3根；约定一捆10根，解释一根对应一个。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-actual-circles',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '纸面真实画小林13个圆，小佳下面对齐画13个，再添分开的3个；逐一配对检查。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-actual-equation',
      knowledge: 'bnu-lower-recycling',
      prompt: '纸笔真实列13+3=16（个）并写完整答句，说明每个数指什么。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-actual-check',
      knowledge: 'bnu-lower-recycling',
      prompt: '真实指自己的图或小棒检查16比13多3，再检查算式与单位。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-actual-discuss',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '真实交流自己如何根据所求选信息、用摆棒或画图解决问题，不把计划当讨论已做。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-actual-own',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '纸面实际自编一题，明确谁比谁多或少、所求是谁，列式并检查；可用纸片，不需真实回收废品。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只是计划可跳过，不自动确认实际活动。',
      explanation:
        '只有真实做过相应纸面、摆棒或交流才确认，网页答对不替代；未做可以跳过。',
    },
    {
      id: 'bnu-lower-recycling-method-record',
      knowledge: 'bnu-lower-recycling',
      prompt: '记录自己实际使用的摆棒或画图方法，以及如何一一对应。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放原话记录correct:null，实际已做与下一次计划分别保存。',
    },
    {
      id: 'bnu-lower-recycling-information-record',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '记录为什么要先看问题，哪条信息在当前所求中不用；也可记仍不明白之处。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放原话记录correct:null，实际已做与下一次计划分别保存。',
    },
    {
      id: 'bnu-lower-recycling-difficulty-record',
      knowledge: 'bnu-lower-recycling',
      prompt: '记录本次真实收获和需要帮助的地方，允许自己的原话，不统一评分。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放原话记录correct:null，实际已做与下一次计划分别保存。',
    },
    {
      id: 'bnu-lower-recycling-plan',
      knowledge: 'bnu-lower-recycling',
      prompt: '单独记录下一次准备做的事情；计划不算这次已完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放原话记录correct:null，实际已做与下一次计划分别保存。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-recycling-review-total',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站新条件：小林17个，小佳比小林多2个。小佳有几个塑料瓶？',
      rule: {
        kind: 'number',
        value: 19,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '17+2=19，不复制原16。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-recycling-review-circles',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站新圆图，依次填小林这一行、小佳对齐部分、额外部分的圆数。',
      rule: {
        kind: 'steps',
        values: [17, 17, 2],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '完整17一一对应，再额外2。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-recycling-review-rods',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站新小棒图，依次填一捆根数、原有单根数、额外单根数。',
      rule: {
        kind: 'steps',
        values: [10, 7, 2],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '一捆10，旁边7，额外2，不复制10/3/3。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'rods',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-recycling-review-qiang',
      knowledge: 'bnu-lower-recycling',
      prompt:
        '本站新题：小林17个，小佳比小林多2个，小强比小佳少5个。现在问小强有几个？',
      rule: {
        kind: 'number',
        value: 14,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '先求小佳19，再19−5=14，三条条件都有作用。',
    },
    {
      id: 'bnu-lower-recycling-review-needed',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站改问小强：小佳19个，小强比小佳少5个。要用哪组信息？',
      rule: {
        kind: 'choice',
        value: '小佳19个，小强比小佳少5个',
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '所求改变，用19和少5求小强。',
      choices: [
        {
          id: '小佳19个，小强比小佳少5个',
          label: '小佳19个，小强比小佳少5个',
        },
        {
          id: '只用小佳19个',
          label: '只用小佳19个',
        },
        {
          id: '继续只用原13和多3',
          label: '继续只用原13和多3',
        },
      ],
    },
    {
      id: 'bnu-lower-recycling-review-lin',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站换所求：小佳19个，且比小林多2个。问小林有几个？',
      rule: {
        kind: 'number',
        value: 17,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '19−2=17，不能因为文字有“多”就加2。',
    },
    {
      id: 'bnu-lower-recycling-review-check',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站小佳19、小林17，依次填两人差是多少、19−17的结果。',
      rule: {
        kind: 'steps',
        values: [2, 2],
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '两人差2，不复制原差3。',
    },
    {
      id: 'bnu-lower-recycling-review-extra',
      knowledge: 'bnu-lower-recycling',
      prompt: '本站图小佳19个，小林17个，问小佳比小林多几个？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '先确定问题问谁，再找与这个人有关的信息。摆棒或画图按一一对应比较，列式后回到原条件检查。',
      explanation: '19−17=2，问差不是问小佳全部。',
      visual: {
        kind: 'bnu-recycling',
        scene: 'circles',
        variant: 'review',
      },
    },
  ],
};
