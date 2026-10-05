import type { Lesson } from '../learning/types';

export const bnuLowerHundredChartLesson: Lesson = {
  id: 'bnu-lower-hundred-chart',
  textbookTitle: '做个百数表',
  title: '做个百数表：完整填表、行列规律与全部局部练习',
  page: 55,
  version: 1,
  status: 'available',
  goal: '完整补1～100十行80空，解释行列与具体斜向，按四规则完整寻找并分清重叠，填写所有局部表和两条刻度。',
  prerequisite: '能读写比较100以内的数，理解100百十个位，不把未填当0。',
  parentTip:
    '依据核读55～56七项原活动，保留20给定数并完整做80空，拆成十题各八空，不放宽steps每题20字段旧备份上限。填空图只给原线索与位置字母；完整表用于已填后观察/条件分类，不预涂正确集合。左右不跨行，上下同列，斜向指具体方向。原十个位同条件未限两位数，本站全表含100时十个位0/0也满足，若明确仅两位数则九数；条件重叠可复原表分轮，不冒原唯一答案。全部局部5/8/5/5/8空和数线3/4空完整；真实纸面、涂标、指图及交流各人工，发现/困难不评分、未来计划另列。原创AntD表格不复制原图，不需新购买、学校资料或指定审校人，最终教师试用未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '55～56完整表/全部原给定、空格、刻度和规则来源核对',
    notes: '来源核对与最终教师试用分开，原未给唯一涂法和本站明示范围独立。',
  },
  steps: [
    {
      title: '完整十行，给定与空分清',
      text: '原百数表1～100，十行十列。每行已给两个数，共20个给定，剩下八十空都要填写。本站填空表保留原给定，空不是0；十道逐行题各填八空，合起来覆盖全部80空，不以第一行示例代整表。行号与表头列号是位置。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
      },
      activity: '实际完整补十行八十空，保留原给定数并读1～100。',
    },
    {
      title: '横竖和具体斜向观察',
      text: '同一行向右相邻数多1，同一列下一行多10。第三列3、13直到93个位都3；第三列不是第三行。10到11换行，11不是同一行右邻。34右下45、左下43，两条斜向不同，不把所有斜线都加11。完整表用于已填后观察，100十个位都是确定0。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
      activity: '实际指整行、第三列和具体斜向，分别说自己的发现。',
    },
    {
      title: '58局部表，五空全部补',
      text: '原四角58、60、78、80保留。第一行58/59/60，第二行68/69/70，第三行78/79/80。按从左到右再从上到下五空59、68、69、70、79；横竖条件共同核对，不只补中心。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'fifty-eight',
        variant: 'main',
      },
      activity: '实际写五空并读九格，说明横竖两种参照。',
    },
    {
      title: '67是中心，不是左上角',
      text: '原中心67，横向右邻68、左邻66，下一行同列77、上一行57。完整三行56/57/58、66/67/68、76/77/78，八空全部做，不只答原两段示例。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'sixty-seven',
        variant: 'main',
      },
      activity: '实际补全部八空，逐行读并解释右邻与下邻。',
    },
    {
      title: '四种涂标规则，每轮完整观察',
      text: '原个位0绿、个位7蓝、十个位相同黄、个位比十位少1红。分别完整找数，不只涂几个例子，条件可重叠，本站允许每轮复原表观察。原句未限两位数：本站若明确看全表含100，100十位0/个位0也相同；若明确仅两位数，黄色对应11至99九数。限制与开放原观察分清，不冒原书已给唯一涂法。实际涂标与交流分别确认。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
      activity: '实际按四条规则各完整涂标并说范围、重叠和发现。',
    },
    {
      title: '两条刻度，不混间隔和两侧',
      text: '第一条已给30/32/34，相邻每格多2，三空36/38/40。第二条70/80相邻，按每格10，70左两空50/60、80右两空90/100，四空全部做。不能把都是数线就用同一间隔，不漏左侧或100。',
      activity: '实际填写两条原等距刻度的全部七空并解释。',
    },
    {
      title: '三张局部表，各给定都保留',
      text: '第一张给27/28/38/49，全部五空补齐，三行27～29、37～39、47～49。第二张给31/40/42/51，五空补齐，三行30～32、40～42、50～52。第三张中心85，八空补齐，三行74～76、84～86、94～96。三图各九格，不能只做一张或改已给数。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'practice-one',
        variant: 'main',
      },
      activity: '实际完成全部三张局部表，再分别解释给定位置和方法。',
    },
    {
      title: '回看已做，再记困难和计划',
      text: '核对完整80空、行列斜向观察、58五空、67八空、四轮规则、两刻度七空、三局部表5/5/8空。网页答对不确认原书纸面、实际涂色或同伴交流；记录自己的真实发现和困难，未来准备另列，未知不当0。',
      activity: '回看实际完成和未做项目，写自己的困难与下一次计划。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-hundred-chart-row-1',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第1行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [2, 3, 4, 5, 6, 7, 8, 9],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 1,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-2',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第2行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [11, 13, 14, 15, 16, 17, 18, 20],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 2,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-3',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第3行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [21, 22, 24, 25, 26, 27, 29, 30],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 3,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-4',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第4行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [31, 32, 33, 35, 36, 38, 39, 40],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 4,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-5',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第5行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [41, 42, 43, 44, 47, 48, 49, 50],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 5,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-6',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第6行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [51, 52, 53, 54, 57, 58, 59, 60],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 6,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-7',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第7行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [61, 62, 63, 65, 66, 68, 69, 70],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 7,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-8',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第8行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [71, 72, 74, 75, 76, 77, 79, 80],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 8,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-9',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第9行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [81, 83, 84, 85, 86, 87, 88, 90],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 9,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-10',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原百数表第10行，按A～H顺序填写全部八空。表头为列位置，不是待填数。',
      rule: {
        kind: 'steps',
        values: [92, 93, 94, 95, 96, 97, 98, 99],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保留两个原给定数，八空从左到右补齐，本题不代替其它九行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'main',
        row: 10,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-minimum',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整原百数表从哪个数开始？',
      rule: {
        kind: 'number',
        value: 1,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '原范围1～100，不在表前补0格。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-maximum',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整原百数表最后一个数是多少？',
      rule: {
        kind: 'number',
        value: 100,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '第十行第十列是100，不截99；100百位1、十个位0。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-given-count',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '原十行表每行给定两个数，已给数一共多少个？',
      rule: {
        kind: 'number',
        value: 20,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '十行各两个，一共20个，给定数不是80个待填空。',
    },
    {
      id: 'bnu-lower-hundred-chart-blank-count',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '原十行表每行八空，全部需要补多少个空？',
      rule: {
        kind: 'number',
        value: 80,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '十行各八空为80；不能只填一行或一部分当全表完成。',
    },
    {
      id: 'bnu-lower-hundred-chart-hundred-tens-zero',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整表中的100，十位上是几？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '百位1、十位0、个位0。这里0是确定的数位数字，不是空格或未知。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-actual-full-chart',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际保留20给定数，填写原十行全部80空，完整读1～100并回看每行。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '可按原书或复用纸画十行十列；十道网页逐行题不自动确认纸面完整填写。',
    },
    {
      id: 'bnu-lower-hundred-chart-third-column',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整表第三列，从上到下填写全部十个数。',
      rule: {
        kind: 'steps',
        values: [3, 13, 23, 33, 43, 53, 63, 73, 83, 93],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '第三列个位都3，同列逐行多10；不是第三行。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-right-neighbour',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '在完整表中，23右边同一行相邻数是多少？',
      rule: {
        kind: 'number',
        value: 24,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '同一行右邻多1，23在第三行第三列。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-below-neighbour',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '在完整表中，23下一行同一列的数是多少？',
      rule: {
        kind: 'number',
        value: 33,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '同列下一行多10，不误当24。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-row-boundary',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '10在第一行最后一列。11是10同一行的右邻吗？',
      rule: {
        kind: 'choice',
        value: '不是，11换到第二行第一列',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '右邻不能越过本行边界；按全表次序的下一个数与同一行右邻不同。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
      choices: [
        {
          id: '是，同一行右邻',
          label: '是，同一行右邻',
        },
        {
          id: '不是，11换到第二行第一列',
          label: '不是，11换到第二行第一列',
        },
        {
          id: '10右边还有100',
          label: '10右边还有100',
        },
      ],
    },
    {
      id: 'bnu-lower-hundred-chart-two-diagonals',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整表中34往右下相邻、往左下相邻，依次是什么？',
      rule: {
        kind: 'steps',
        values: [45, 43],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '具体方向分别加11、加9；这是两条不同方向斜线，不说所有斜向都加11。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-actual-discovery',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '实际指完整第三列、某一整行和两种具体斜向位置，向同伴说横竖斜发现。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '须指真实位置并说方向；只看屏幕例句不自动确认自己的观察或同伴交流。',
    },
    {
      id: 'bnu-lower-hundred-chart-own-horizontal',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '记录自己在某一整行实际发现什么。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '指明行与位置，自己的说法开放，不统一自动评星。',
    },
    {
      id: 'bnu-lower-hundred-chart-own-vertical',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '记录自己在某一整列实际发现什么。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '列不是行，不冒同伴也已同意。',
    },
    {
      id: 'bnu-lower-hundred-chart-own-diagonal',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '记录自己看哪条斜线、什么方向和发现。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '不同斜线方向分清；若未观察可如实写未做。',
    },
    {
      id: 'bnu-lower-hundred-chart-fragment-58',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '图中58、60、78、80已给，按A～E填写全部五空。',
      rule: {
        kind: 'steps',
        values: [59, 68, 69, 70, 79],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '按行列两条件补59、68、69、70、79，不能只补中心。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'fifty-eight',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-fragment-58-centre',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '同一局部表的中心应是多少？',
      rule: {
        kind: 'number',
        value: 69,
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '58下一行是68，68右邻69；中心同时满足横竖参照。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'fifty-eight',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-actual-fragment-58',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际完整填58局部表五空，逐行读九格并解释横竖两种参照。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '原表或自画三行三列，全部五空实际填写，不只口答中心。',
    },
    {
      id: 'bnu-lower-hundred-chart-fragment-67',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '中心67已给，按A～H填写图中全部八空。',
      rule: {
        kind: 'steps',
        values: [56, 57, 58, 66, 68, 76, 77, 78],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '三行分别56/57/58、66/67/68、76/77/78，中心不改，八空都做。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'sixty-seven',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-fragment-67-neighbours',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '中心67的右邻和下邻，依次是多少？',
      rule: {
        kind: 'steps',
        values: [68, 77],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '横向右多1与同列向下多10分开。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'sixty-seven',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-actual-fragment-67',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际完整填写67局部表八空，并解释右邻、下邻及其它相邻关系。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '两段原示例之外的六空也实际完成，不把两个示例当整表。',
    },
    {
      id: 'bnu-lower-hundred-chart-ones-zero',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整1～100表，按从小到大写出个位是0的全部数。',
      rule: {
        kind: 'steps',
        values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '十个数，包括100；0不在原表范围，不能补0格。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-ones-seven',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整1～100表，按从小到大写出个位是7的全部数。',
      rule: {
        kind: 'steps',
        values: [7, 17, 27, 37, 47, 57, 67, 77, 87, 97],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '同一列十个数，包含一位数7，不只找两位数。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-equal-digits-full',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '本题明确看全表1～100，按从小到大写十位与个位相同的全部数，含100。',
      rule: {
        kind: 'steps',
        values: [11, 22, 33, 44, 55, 66, 77, 88, 99, 100],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '九个两位数与100；100十位0/个位0也相同。原观察未给唯一标准涂法，本题明确范围。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-equal-digits-two',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '这次明确只看两位数，按从小到大写十位与个位相同的全部数。',
      rule: {
        kind: 'steps',
        values: [11, 22, 33, 44, 55, 66, 77, 88, 99],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '只看两位数排除100，九个数；与全表题的限定分开。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-ones-one-less',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '完整1～100表，按从小到大写个位比十位少1的全部数。',
      rule: {
        kind: 'steps',
        values: [10, 21, 32, 43, 54, 65, 76, 87, 98],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '九个数，10个位0比十位1少1；100十个位相等，不符合少1。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-colour-overlap',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '本题看全表1～100，100能同时满足哪两种原条件？',
      rule: {
        kind: 'choice',
        value: '个位0，且十个位相同',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '100十个位都是0，条件可以重叠，不能强分每个数只属一类。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'main',
      },
      choices: [
        {
          id: '个位比十位少1，且个位7',
          label: '个位比十位少1，且个位7',
        },
        {
          id: '个位7，且十个位相同',
          label: '个位7，且十个位相同',
        },
        {
          id: '个位0，且十个位相同',
          label: '个位0，且十个位相同',
        },
      ],
    },
    {
      id: 'bnu-lower-hundred-chart-actual-green',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际在完整表找齐个位0的数，按原绿色规则涂标并说明。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '可用写颜色名或符号替代材料；完整找十个含100，实际标记不由网页填写确认。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-blue',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际找齐个位7的数，按原蓝色规则涂标并说明。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '完整十个含7，已标其它规则的数不自动漏掉，可另用复原表。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-yellow',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际按原十个位相同规则涂黄色，说明是否只看两位数或全表含100。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '如实说明范围与100两位0，不冒原书已经给唯一涂色答案；重叠条件可复原表逐轮观察。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-red',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际找齐个位比十位少1的数，按原红色规则涂标并说明。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '全部九个，包含10，不把100两个0当少1。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-colour-explain',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际回看四种规则和重叠，向同伴说你的完整发现。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation:
        '四轮分别看，不强分成互不重叠类别；真实交流另记，不自动评星。',
    },
    {
      id: 'bnu-lower-hundred-chart-own-colour',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '记录自己在四轮实际涂标中发现什么。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '写真实条件与范围，不冒未做的涂色或交流。',
    },
    {
      id: 'bnu-lower-hundred-chart-line-two',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '原第一条刻度已给30、32、34，接着三个等距空依次填什么？',
      rule: {
        kind: 'steps',
        values: [36, 38, 40],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '每格多2，三空全部36、38、40，不逐一填35、36、37。',
    },
    {
      id: 'bnu-lower-hundred-chart-line-ten',
      knowledge: 'bnu-lower-hundred-chart',
      prompt:
        '原第二条刻度70、80之间一格。70左边两空、80右边两空，按从左到右填全部四空。',
      rule: {
        kind: 'steps',
        values: [50, 60, 90, 100],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '每格多10，左50/60，右90/100，不能漏左侧或100。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-line-two',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际在原逐二刻度填写36、38、40并解释间隔。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '原图或自画等距刻度，三空完整填写，不能由网页答案确认纸面。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-line-ten',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际在原逐十刻度两侧填写50、60、90、100并解释。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '两侧四空都做；70/80左侧和右侧不同，不只补右边。',
    },
    {
      id: 'bnu-lower-hundred-chart-practice-one',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '第一张局部表按A～E填写全部五空。',
      rule: {
        kind: 'steps',
        values: [29, 37, 39, 47, 48],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保持27/28/38/49给定数，完整三行27～29、37～39、47～49。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'practice-one',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-practice-two',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '第二张局部表按A～E填写全部五空。',
      rule: {
        kind: 'steps',
        values: [30, 32, 41, 50, 52],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保持31/40/42/51，三行30～32、40～42、50～52。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'practice-two',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-practice-three',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '第三张局部表中心85已给，按A～H填写全部八空。',
      rule: {
        kind: 'steps',
        values: [74, 75, 76, 84, 86, 94, 95, 96],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '三行74～76、84～86、94～96，不把85当左上角。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'practice-three',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-actual-practice-one',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际完成第一张局部表全部五空并读九格。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保持已给27、28、38、49，全部空逐个填写。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-practice-two',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际完成第二张局部表全部五空并读九格。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '保持已给31、40、42、51，不沿用前一张数。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-practice-three',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际完成第三张局部表全部八空并读九格。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '85在中心，不仅写右邻和下邻。',
    },
    {
      id: 'bnu-lower-hundred-chart-actual-fragment-explain',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '实际比较三张局部表的给定位置，分别说明怎样用横竖关系补完整。',
      rule: {
        kind: 'manual',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '三表各独立恢复条件，自己的方法不自动当同伴也理解。',
    },
    {
      id: 'bnu-lower-hundred-chart-difficulty',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '记录还不清楚的空格、条件或方向。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '未知不填0，可如实写未做，不自动诊断能力。',
    },
    {
      id: 'bnu-lower-hundred-chart-plan',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '单独写下一次准备练习的行列或活动。',
      rule: {
        kind: 'reflection',
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '未来计划不算已经完成，和实际填表、涂标、交流分开。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-hundred-chart-review-row-two',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '新表第2行只给13和18，按A～H填写全部八空。',
      rule: {
        kind: 'steps',
        values: [11, 12, 14, 15, 16, 17, 19, 20],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '新给定位置与原12/19不同，重新找八空。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'full',
        variant: 'review',
        row: 2,
      },
    },
    {
      id: 'bnu-lower-hundred-chart-review-fragment',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '新局部表给48、50、68、70，按A～E填写五空。',
      rule: {
        kind: 'steps',
        values: [49, 58, 59, 60, 69],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '新锚点，仍需五空全部满足横竖参照。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'fifty-eight',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-review-centre',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '新中心76，按A～H填写全部八空。',
      rule: {
        kind: 'steps',
        values: [65, 66, 67, 75, 77, 85, 86, 87],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '中心换76，不沿用67的八空。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'sixty-seven',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-hundred-chart-review-line',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '新等距刻度已给41、43、45，接着三个空依次是什么？',
      rule: {
        kind: 'steps',
        values: [47, 49, 51],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '逐二但换起点，不沿用36/38/40。',
    },
    {
      id: 'bnu-lower-hundred-chart-review-one-more',
      knowledge: 'bnu-lower-hundred-chart',
      prompt: '新条件改为个位比十位多1，限定两位数并从小到大写全部数。',
      rule: {
        kind: 'steps',
        values: [12, 23, 34, 45, 56, 67, 78, 89],
      },
      hint: '先确认图中行列、已给数与目标空格。横向相邻差1，同列上下差10；不跨行当右邻，完整逐个检查。',
      explanation: '条件反向且限定两位数，不沿用少1的一组。',
      visual: {
        kind: 'bnu-hundred-table',
        scene: 'complete',
        variant: 'review',
      },
    },
  ],
};
