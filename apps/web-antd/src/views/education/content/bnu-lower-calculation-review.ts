import type { Lesson } from '../learning/types';

export const bnuLowerCalculationReviewLesson: Lesson = {
  id: 'bnu-lower-calculation-review',
  textbookTitle: '整理与复习',
  title: '完整计算、八篮连线与开放预算搭配',
  page: 74,
  version: 1,
  status: 'available',
  goal: '完整对应74～75八原活动，整理计算方法、保留问题、全算全比较与连线、读价应用、自主问题及接受所有合法预算搭配。',
  prerequisite:
    '会做百以内不进位加法和不退位减法，知道十位与个位，能比较两个数。',
  parentTip:
    '完整两页核对，问题银行疑问开放；本站探索与原题分开。搭配上衣加裤子条件明示，原五合法买法都接受，不要求购买或披露家庭信息。真实活动人工，开放原话null，计划单列；最终教师试用未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '74～75全部活动、八篮与六比较核对',
    notes: '课程程序与三宽页面已验，最终教师试用未核验。',
  },
  steps: [
    {
      title: '四式完整算',
      text: '原收获15+4=19、35+24=59、15−4=11、35−24=11。相同结果不代表同一道任务，每式都说明过程。',
      activity: '实际计算四式。',
    },
    {
      title: '整理自己的方法',
      text: '同数位加减。35+24可30+20=50、5+4=9，合59；35−24可30−20=10、5−4=1，合11。原方法图有空白，自己可整理摆棒、计数器、画图或竖式，不强制一套作品。',
      activity: '真实整理并解释自己的方法图。',
    },
    {
      title: '保留真正的问题',
      text: '原问题银行提出个位不够减怎么办，30−4=?；原栏目没有给完整退位算法。可以保留到后续学习。本站另给探索：30拆20与10，10减4得6，20+6=26，注明本站补充，不冒原书已教。',
      activity: '真实写仍不明白的问题。',
    },
    {
      title: '四道拨珠与计算',
      text: '原练1是7+60、76−14、20+43、57−3，结果67、62、63、54。观察数位，先拨原量再按条件添或去。网站图只给两个已知数，不自动确认真实拨珠。',
      activity: '实际完成四式拨画。',
    },
    {
      title: '四道竖式逐格对齐',
      text: '原练2为78−32=46、65+34=99、56+23=79、99−35=64。十位对十位、个位对个位，网页A/B是结果的十位/个位，不用错位横加。',
      activity: '实际在纸上列全部四式。',
    },
    {
      title: '八篮全部算再连',
      text: '原小熊68，按本站上行左到右、下行左到右编号。八篮依次68、64、68、68、78、68、68、68，六篮等68；不是只找到一个就结束，64与78不能连。表格不显示结果。',
      activity: '真实算八篮并连全部正确篮。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'baskets',
        variant: 'main',
      },
    },
    {
      title: '六个大小比较',
      text: '先算左右，再填>、<、=。原两列依行左再右依次>、<、>、=、<、<；34+23与41+16都57，不能因式子不同就认为不等。86−40与86−4不同，不能只看相同86。',
      activity: '实际完成并解释六题。',
    },
    {
      title: '四球价与购物问题',
      text: '原四价42、30、23、6元；买篮球和小彩球42+6=48。有20想买23，问还差，23−20=3，不能答负找零。另自己提出有完整已知和所求的数学题并解答。',
      activity: '真实读价、解两题、自主提问。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'balls',
        variant: 'main',
      },
    },
    {
      title: '预算内想一种买法',
      text: '原100元想买一套衣服，要求想一种。本站明确一件上衣加一条裤子，五商品编号价46/52/34/53/41；所有五合法买法均接受，不强制花光或只认①④。复习70元且换价，要重新检查。纸面模拟不要求真实买。',
      activity: '实际搭配并说明总价与剩钱。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'clothes',
        variant: 'main',
      },
    },
    {
      title: '实际、原话与计划分开',
      text: '四式纸算、方法图、问题银行、四拨珠、四竖式、八篮连线、六比较、两购物与自编问题、搭配分别真实确认。自己的问题和方法开放记录，正确0不是空白，未来计划单列。',
      activity: '如实保存已做、疑问和下一次计划。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-calculation-review-harvest-all',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原四式15+4、35+24、15−4、35−24，依次填写全部结果。',
      rule: {
        kind: 'steps',
        values: [19, 59, 11, 11],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '四式分别计算，同结果11是两道不同任务。',
    },
    {
      id: 'bnu-lower-calculation-review-place-alignment',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '整理百以内加减的做法，数位怎样对应？',
      rule: {
        kind: 'choice',
        value: '十位对十位，个位对个位',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '同数位加减，不能只看图的物品总颗数。',
      choices: [
        {
          id: '十位对十位，个位对个位',
          label: '十位对十位，个位对个位',
        },
        {
          id: '任意对齐都可以',
          label: '任意对齐都可以',
        },
        {
          id: '个位对十位，十位对个位',
          label: '个位对十位，十位对个位',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-add-parts',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原35+24，先十位30+20，再个位5+4，最后合并，依次填三个结果。',
      rule: {
        kind: 'steps',
        values: [50, 9, 59],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '不进位加法50+9=59。',
    },
    {
      id: 'bnu-lower-calculation-review-sub-parts',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原35−24，先十位30−20，再个位5−4，最后合并，依次填三个结果。',
      rule: {
        kind: 'steps',
        values: [10, 1, 11],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '不退位减法10+1=11，不是把两个差再相减。',
    },
    {
      id: 'bnu-lower-calculation-review-problem-exploration',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '本站补充探索原问题银行30−4，结果是多少？可先用30拆成20与10再算。',
      rule: {
        kind: 'number',
        value: 26,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation:
        '本站解释：10−4=6，20+6=26；原栏目只提出问题，不冒原书已给此算法。',
    },
    {
      id: 'bnu-lower-calculation-review-counter-1',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练1第1式7+60，结果是多少？拨计数器活动另确认。',
      rule: {
        kind: 'number',
        value: 67,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '7+60=67，十位与个位分别处理。',
      visual: {
        kind: 'place-counters',
        values: [7, 60],
      },
    },
    {
      id: 'bnu-lower-calculation-review-counter-2',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练1第2式76−14，结果是多少？拨计数器活动另确认。',
      rule: {
        kind: 'number',
        value: 62,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '76−14=62，十位与个位分别处理。',
      visual: {
        kind: 'place-counters',
        values: [76, 14],
      },
    },
    {
      id: 'bnu-lower-calculation-review-counter-3',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练1第3式20+43，结果是多少？拨计数器活动另确认。',
      rule: {
        kind: 'number',
        value: 63,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '20+43=63，十位与个位分别处理。',
      visual: {
        kind: 'place-counters',
        values: [20, 43],
      },
    },
    {
      id: 'bnu-lower-calculation-review-counter-4',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练1第4式57−3，结果是多少？拨计数器活动另确认。',
      rule: {
        kind: 'number',
        value: 54,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '57−3=54，十位与个位分别处理。',
      visual: {
        kind: 'place-counters',
        values: [57, 3],
      },
    },
    {
      id: 'bnu-lower-calculation-review-written-1',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原竖式78-32，填写A（结果十位）和B（结果个位）。',
      rule: {
        kind: 'column-digits',
        operator: '-',
        left: [7, 8],
        right: [3, 2],
        result: [null, null],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '78-32=46；数位对齐。',
      visual: {
        kind: 'column-digits',
        operator: '-',
        left: [7, 8],
        right: [3, 2],
        result: [null, null],
      },
    },
    {
      id: 'bnu-lower-calculation-review-written-2',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原竖式65+34，填写A（结果十位）和B（结果个位）。',
      rule: {
        kind: 'column-digits',
        operator: '+',
        left: [6, 5],
        right: [3, 4],
        result: [null, null],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '65+34=99；数位对齐。',
      visual: {
        kind: 'column-digits',
        operator: '+',
        left: [6, 5],
        right: [3, 4],
        result: [null, null],
      },
    },
    {
      id: 'bnu-lower-calculation-review-written-3',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原竖式56+23，填写A（结果十位）和B（结果个位）。',
      rule: {
        kind: 'column-digits',
        operator: '+',
        left: [5, 6],
        right: [2, 3],
        result: [null, null],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '56+23=79；数位对齐。',
      visual: {
        kind: 'column-digits',
        operator: '+',
        left: [5, 6],
        right: [2, 3],
        result: [null, null],
      },
    },
    {
      id: 'bnu-lower-calculation-review-written-4',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原竖式99-35，填写A（结果十位）和B（结果个位）。',
      rule: {
        kind: 'column-digits',
        operator: '-',
        left: [9, 9],
        right: [3, 5],
        result: [null, null],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '99-35=64；数位对齐。',
      visual: {
        kind: 'column-digits',
        operator: '-',
        left: [9, 9],
        right: [3, 5],
        result: [null, null],
      },
    },
    {
      id: 'bnu-lower-calculation-review-baskets-all',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '原小熊投中68，选择全部结果为68的篮筐编号。本站按上行左到右、再下行左到右编号1～8。',
      rule: {
        kind: 'set',
        values: ['1', '3', '4', '6', '7', '8'],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '1/3/4/6/7/8都得68；2得64、5得78。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'baskets',
        variant: 'main',
      },
      choices: [
        {
          id: '1',
          label: '1',
        },
        {
          id: '2',
          label: '2',
        },
        {
          id: '3',
          label: '3',
        },
        {
          id: '4',
          label: '4',
        },
        {
          id: '5',
          label: '5',
        },
        {
          id: '6',
          label: '6',
        },
        {
          id: '7',
          label: '7',
        },
        {
          id: '8',
          label: '8',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-baskets-results',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原八篮，按当前表编号1～8填写全部结果。',
      rule: {
        kind: 'steps',
        values: [68, 64, 68, 68, 78, 68, 68, 68],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '每篮都计算，结果不是篮筐编号。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'baskets',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-calculation-review-compare-1',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练4：87+10 ○ 78+10，○填哪一个符号？',
      rule: {
        kind: 'choice',
        value: '>',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '左右分别是97与88，应填>。',
      choices: [
        {
          id: '>',
          label: '>',
        },
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-compare-2',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练4：46−5 ○ 46−4，○填哪一个符号？',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '左右分别是41与42，应填<。',
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '>',
          label: '>',
        },
        {
          id: '=',
          label: '=',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-compare-3',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练4：72+6 ○ 71+6，○填哪一个符号？',
      rule: {
        kind: 'choice',
        value: '>',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '左右分别是78与77，应填>。',
      choices: [
        {
          id: '>',
          label: '>',
        },
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-compare-4',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练4：34+23 ○ 41+16，○填哪一个符号？',
      rule: {
        kind: 'choice',
        value: '=',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '左右分别是57与57，应填=。',
      choices: [
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
        {
          id: '<',
          label: '<',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-compare-5',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练4：86−40 ○ 86−4，○填哪一个符号？',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '左右分别是46与82，应填<。',
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '>',
          label: '>',
        },
        {
          id: '=',
          label: '=',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-compare-6',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原练4：96−50 ○ 6+50，○填哪一个符号？',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '左右分别是46与56，应填<。',
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '>',
          label: '>',
        },
        {
          id: '=',
          label: '=',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-ball-prices',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '依次读出表中四种球价格（元），编号1～4全部填写。',
      rule: {
        kind: 'steps',
        values: [42, 30, 23, 6],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '篮球42、足球30、排球23、彩色小球6，不把商品编号当价格。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'balls',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-calculation-review-buy-two',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原买1个篮球和1个彩色小球，一共多少元？',
      rule: {
        kind: 'number',
        value: 48,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '42+6=48（元）。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'balls',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-calculation-review-shortfall',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '原有20元，想买23元的排球，还差多少元？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '23−20=3（元），问还差，不是负3元找零。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'balls',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-calculation-review-outfit',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '原100元预算。本站约定一件上衣和一条裤子。第1项填上衣编号1～3，第2项填裤子编号4～5；选择任何不超预算的搭配。',
      rule: {
        kind: 'outfit',
        variant: 'main',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation:
        '合法1/4、1/5、2/5、3/4、3/5均接受；2/4需105超预算。不要求花光100。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'clothes',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-calculation-review-outfit-example-total',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站示例选①46元上衣和④53元裤子，共多少元？',
      rule: {
        kind: 'number',
        value: 99,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '46+53=99，此示例不是唯一合法买法。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'clothes',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-calculation-review-outfit-example-change',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站示例①与④共99元，100元预算剩多少元？',
      rule: {
        kind: 'number',
        value: 1,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '100−99=1，剩钱合法。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'clothes',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-calculation-review-site-zero',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站另给20元纸面预算，用去20元，剩几元？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '20−20=0，已知0不同于未填。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-harvest',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '纸笔真实计算原收获全部四式，并说明自己怎样算。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-map',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '实际整理自己的数位加减方法图，可以摆棒、画图、口述或竖式，不冒只有一种整理。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-problem',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '真实把自己还不明白的问题写进问题银行；可保留疑问，不假装已经解决。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-counters',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '真实用计数器或画数位珠，分别完成原练1全部四式，拨珠/擦添动作与计算分别检查。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-written',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '纸面真实列原练2全部四道竖式，逐格对齐并计算，不只写网页数字。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-baskets',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '回合法教材真实算全部八篮并把所有等68的篮与小熊连线，检查不漏不多。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-comparisons',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '纸笔实际完成原六个比较符号，并说明至少一题的左右结果。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-shopping',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '纸面真实读四球价并解买两球与还差问题，用自己的话写条件、式、单位与答句。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-own-question',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '实际另提出一个有明确条件和所求的购物数学问题，并完整解答与交流；不把计划当已经做过。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-actual-outfit',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '用纸卡真实选择一件上衣一条裤子的预算内买法，说明价格合计与剩钱，不要求真实购买或披露家庭压岁钱。',
      rule: {
        kind: 'manual',
      },
      hint: '按实际情况确认，未做或仅计划可跳过。',
      explanation:
        '真实纸面、拨画、连线或交流做过才确认；未做可跳过，不自动记录实物完成。',
    },
    {
      id: 'bnu-lower-calculation-review-method-record',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '记录自己实际整理出的计算方法与例子。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放记录correct:null，真实活动与未来计划分开。',
    },
    {
      id: 'bnu-lower-calculation-review-problem-record',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '开放记问题银行中的疑问，已解决与仍待解决分别说明。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放记录correct:null，真实活动与未来计划分开。',
    },
    {
      id: 'bnu-lower-calculation-review-own-question-record',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '记录自己实际提出的购物题、解答和条件；没有提出可以如实说明。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放记录correct:null，真实活动与未来计划分开。',
    },
    {
      id: 'bnu-lower-calculation-review-reflection',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '记本次真实收获和需要帮助的地方，不统一评原话对错。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放记录correct:null，真实活动与未来计划分开。',
    },
    {
      id: 'bnu-lower-calculation-review-plan',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '单独记下一次准备做的事，不算已完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记自己的话，也可跳过。',
      explanation: '开放记录correct:null，真实活动与未来计划分开。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-calculation-review-review-harvest',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站新四式24+3、54+23、24−3、54−23，依次算全部。',
      rule: {
        kind: 'steps',
        values: [27, 77, 21, 31],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '换数重新计算。',
    },
    {
      id: 'bnu-lower-calculation-review-review-counters',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站新四式8+70、85−23、30+42、68−4，依次算。',
      rule: {
        kind: 'steps',
        values: [78, 62, 72, 64],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '同数位处理，不能复制原顺序。',
    },
    {
      id: 'bnu-lower-calculation-review-review-written',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站新竖式33+24，填结果十位A、个位B。',
      rule: {
        kind: 'column-digits',
        operator: '+',
        left: [3, 3],
        right: [2, 4],
        result: [null, null],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '33+24=57。',
      visual: {
        kind: 'column-digits',
        operator: '+',
        left: [3, 3],
        right: [2, 4],
        result: [null, null],
      },
    },
    {
      id: 'bnu-lower-calculation-review-review-baskets',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站目标改为66，八篮算式也改变，选全部等66的编号。',
      rule: {
        kind: 'set',
        values: ['1', '2', '4', '6', '7'],
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '1/2/4/6/7得66，3/8得67，5得68。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'baskets',
        variant: 'review',
      },
      choices: [
        {
          id: '1',
          label: '1',
        },
        {
          id: '2',
          label: '2',
        },
        {
          id: '3',
          label: '3',
        },
        {
          id: '4',
          label: '4',
        },
        {
          id: '5',
          label: '5',
        },
        {
          id: '6',
          label: '6',
        },
        {
          id: '7',
          label: '7',
        },
        {
          id: '8',
          label: '8',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-review-compare',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站新比较：54−23 ○ 43−11。',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '31<32，需要按当前两式计算。',
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '>',
          label: '>',
        },
        {
          id: '=',
          label: '=',
        },
      ],
    },
    {
      id: 'bnu-lower-calculation-review-review-buy',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站新价格：买1个篮球和1个彩色小球共多少元？',
      rule: {
        kind: 'number',
        value: 49,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '41+8=49。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'balls',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-calculation-review-review-shortfall',
      knowledge: 'bnu-lower-calculation-review',
      prompt: '本站新价格：有20元，想买24元排球，还差几元？',
      rule: {
        kind: 'number',
        value: 4,
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation: '24−20=4。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'balls',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-calculation-review-review-outfit',
      knowledge: 'bnu-lower-calculation-review',
      prompt:
        '本站预算70元，价格已改。第1项填上衣编号1～3，第2项填裤子编号4～5，选择任何预算内搭配。',
      rule: {
        kind: 'outfit',
        variant: 'review',
      },
      hint: '按当前已知数和所求计算，十位与十位、个位与个位对应。先计算再比较或选全部满足条件的编号，换条件不能照抄。',
      explanation:
        '1/5共64、3/4共69、3/5共57均接受；1/4共76、2/4共87、2/5共75超预算。',
      visual: {
        kind: 'bnu-calculation-review',
        scene: 'clothes',
        variant: 'review',
      },
    },
  ],
};
