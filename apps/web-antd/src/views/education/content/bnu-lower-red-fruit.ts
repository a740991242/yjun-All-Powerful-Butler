import type { Lesson } from '../learning/types';

export const bnuLowerRedFruitLesson: Lesson = {
  id: 'bnu-lower-red-fruit',
  textbookTitle: '谁的红果多',
  title: '谁的红果多：数位比较、数线与开放填数',
  page: 50,
  version: 1,
  status: 'available',
  goal: '用接数、参照数、数位和数线比较100以内的数；完整读写比较式，理解严格大小与多种合法填法，并按同一标准完整分类。',
  prerequisite: '能读写0～100的数，知道百十个位和珠子所代表的值。',
  parentTip:
    '依据已查看的公开扫描50～51页七项活动，本站图为原创数位示意，不复制原插画。原21与18给定、材料与计数器是同数不同表示；100的一百位珠不与99的18颗珠按件数比。完整三组45/54、79/80、100/89均独立比较。原开放题未另设统一上限；本站数字输入明确0～100整数并接受全部满足条件的答案，未标刻度的数也合法、0与空答分清。九卡全部分类、相等60不入严格两边。实物或纸面完整操作与解释各独立人工，记录不评分、未来计划另列；无需学校资料或购买指定材料，最终教师审校未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '50～51完整页与计数器放大来源核对',
    notes:
      '覆盖两比较方法、同数两表示、五组原比较、完整数线、六个开放空与九卡全部分类；来源核对不冒最终教师试用。',
  },
  steps: [
    {
      title: '两种方法比较21与18',
      text: '原两位给出21和18个红果。可以从18往后接数19、20、21，21比18大；也可以拿20作参照，21在20以上、18不到20。两种方法都需要说清对象和依据。不再数树上装饰或角色线条来改给定数量。这里比较的是同单位红果，不把不同对象的数任意相加。',
      activity: '实际用材料或纸面从18完整接数到21，再另用20参照解释比较。',
    },
    {
      title: '做、填、说：同数换表示',
      text: '21是2个十1个一，18是1个十8个一；先看十位就能判断21>18。符号开口朝21，尖端朝18。原材料图与计数器分别表示同一21和同一18，不是把两幅21图加成42或把两幅18图加成36。实际做和填式是两项动作，屏幕答对不自动证明摆过、拨过或写过。',
      visual: {
        kind: 'place-counters',
        values: [21, 18],
      },
      activity: '实际做21与18、拨或画计数器，纸面完整填比较式并指符号两侧。',
    },
    {
      title: '十位相同看个位，一百按百位看',
      text: '32和34十位都是3，继续看个位2和4，得到32<34。100是1个百0个十0个一，99是9个十9个一，所以100>99。100图实际1颗珠，99图实际18颗珠，每颗在不同数位的权重不同，不能用珠子颗数直接判断表示数大小。本站统一三轨示意，原两轨计数器另实际看。',
      visual: {
        kind: 'place-counters',
        values: [32, 34, 100, 99],
      },
      activity:
        '原两组各读出、写出两个数再填符号，分别解释个位比较与百位意义。',
    },
    {
      title: '数线位置和开放填数',
      text: '原数线从35到100，每隔5标数，从左到右依次35、40、45、50、55、60、65、70、75、80、85、90、95、100。45<空和90>空有多种填法，46虽不是标出的刻度也大于45。本站练习明确只填0～100整数；这是一条网页范围约定，不冒原题另有统一上限。45<空在网页可填46至100任何整数，90>空可填0至89；相等不满足严格大小。',
      activity:
        '实际读原十四标数，分别填两空并再找不同合理填法，说明右侧较大。',
    },
    {
      title: '三组练习全部比一比',
      text: '原练习三组分别是45与54、79与80、100与89。前两组先比较十位：4<5、7<8，因此45<54、79<80，不能只因个位9大于0就反判。最后原蓝图是8个十9个一，表示89；不要照搬上一页99。一百大于89。表示80的个位已确定无珠是0，未知条件不能当0。',
      visual: {
        kind: 'place-counters',
        values: [45, 54],
      },
      activity: '实际完整读写三组全部数与符号，逐组指出比较的依据。',
    },
    {
      title: '四个空，逐个检查条件',
      text: '原四处是15<空、空>89、空<30、80>空。本站0～100整数范围分别允许16～100、90～100、0～29、0～79全部写法。填一个例子不意味着只有这个答案；等于边界不合，0在小于30和小于80里合法。原纸面空>89若写101，大小关系仍成立，但101超出这次网页明说范围，不能把网页约定改称原题限制。',
      activity: '在纸面实际填完四处，每处解释条件，另找合理不同填法。',
    },
    {
      title: '九张卡全部分类，等于另看',
      text: '原卡为8、29、73、62、59、100、55、17、86。小于60的为8、29、59、55、17；大于60的为73、62、100、86，全部九卡各去一处，不漏不重复。原没有60卡，若换入60，它等于60，两边严格小于或大于都不能放。卡上数值与卡张数不同，9张不是把卡值相加的结果。',
      activity: '实际将全部九卡连向对应的家，逐张检查并说明为什么。',
    },
    {
      title: '解释方法，分清实际与计划',
      text: '回看七项原活动：两种红果比较、实际做填、两组写比、完整数线两空、三组练习、四开放空、九卡连线。先看对象和条件，再比较高位或数线位置，完整写数和符号。记录自己的真实方法、发现与困难，未来练习另列，不从网页答对自动确认纸面动作或同伴理解。',
      activity:
        '实际向同伴说明一组数位比较和分类标准，记录真实交流与下次计划。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-red-fruit-story-counts',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '按给定顺序填写第一位与第二位的红果数量。',
      rule: {
        kind: 'steps',
        values: [21, 18],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '原条件是21与18，不由树上的装饰红果补数量。',
    },
    {
      id: 'bnu-lower-red-fruit-count-up',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '从18往后接数到21，完整填接下来三个数。',
      rule: {
        kind: 'steps',
        values: [19, 20, 21],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '18之后19、20、21，21在18后面，21更大。',
    },
    {
      id: 'bnu-lower-red-fruit-benchmark',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '用20作参照，哪种说明符合21与18？',
      rule: {
        kind: 'choice',
        value: '21比20多，18不到20',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '两个数分别在20两侧，所以21大于18。',
      choices: [
        {
          id: '21比20多，18不到20',
          label: '21比20多，18不到20',
        },
        {
          id: '两个数都不到20',
          label: '两个数都不到20',
        },
        {
          id: '18比20多，21不到20',
          label: '18比20多，21不到20',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-larger-fruit',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '原两位分别有21与18个，较多的一位有多少个？',
      rule: {
        kind: 'number',
        value: 21,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '比较同单位红果的数量，不数角色身上线条。',
    },
    {
      id: 'bnu-lower-red-fruit-decorations',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '树上画的红果能再加到给定21或18里吗？',
      rule: {
        kind: 'choice',
        value: '不能，图中装饰不是新增给定数量',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '原条件已经指定各自数量，装饰不改变对象与条件。',
      choices: [
        {
          id: '不能，图中装饰不是新增给定数量',
          label: '不能，图中装饰不是新增给定数量',
        },
        {
          id: '能，见到红色就加',
          label: '能，见到红色就加',
        },
        {
          id: '不知道就加0当已核定',
          label: '不知道就加0当已核定',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-actual-count-up',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '实际在纸面或材料上从18完整接数到21，说明谁的红果多。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-actual-benchmark',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '实际另用20作参照解释21与18，不只是重复接数。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-do-read',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '从左到右读两个计数器表示的数。',
      rule: {
        kind: 'steps',
        values: [21, 18],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '十位和个位共同表示21与18，不数总珠子颗数。',
      visual: {
        kind: 'place-counters',
        values: [21, 18],
      },
    },
    {
      id: 'bnu-lower-red-fruit-do-sign',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '做一做的比较：看两个计数器，左表示的数与右表示的数之间填哪个符号？',
      rule: {
        kind: 'choice',
        value: '>',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '21的十位2比18的十位1大，21>18。',
      visual: {
        kind: 'place-counters',
        values: [21, 18],
      },
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-same-representations',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '小棒方块表示21，旁边计数器也表示21，该把它们相加成42吗？',
      rule: {
        kind: 'choice',
        value: '不相加，是同一个21的两种表示',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '同数换表示不增物；18的两种表示也不合成36。',
      choices: [
        {
          id: '不相加，是同一个21的两种表示',
          label: '不相加，是同一个21的两种表示',
        },
        {
          id: '相加，两幅图就42',
          label: '相加，两幅图就42',
        },
        {
          id: '只数珠子就是3',
          label: '只数珠子就是3',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-actual-do',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '实际用合适材料做出21与18，并拨珠或画珠；同数的两种表示分别对应。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-actual-fill',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '在纸面完整填写21>18并说明符号开口朝较大的一边。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-write-read',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '按四个计数器的顺序写数。',
      rule: {
        kind: 'steps',
        values: [32, 34, 100, 99],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '三十与二一为32，三十四为34，一百为100，九十九为99。',
      visual: {
        kind: 'place-counters',
        values: [32, 34, 100, 99],
      },
    },
    {
      id: 'bnu-lower-red-fruit-write-thirties',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '写一写第一组：看两个计数器，左表示的数与右表示的数之间填哪个符号？',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '十位同为3，再比较个位2<4，所以32<34。',
      visual: {
        kind: 'place-counters',
        values: [32, 34],
      },
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-write-hundred',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '写一写第二组：看两个计数器，左表示的数与右表示的数之间填哪个符号？',
      rule: {
        kind: 'choice',
        value: '>',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '1个百为100，大于9个十与9个一的99。',
      visual: {
        kind: 'place-counters',
        values: [100, 99],
      },
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-hundred-beads',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '百十个位图表示100，图中实际有几颗珠？',
      rule: {
        kind: 'number',
        value: 1,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '百位一珠表示100；珠子颗数不是所代表的数。',
      visual: {
        kind: 'place-counters',
        values: [100],
      },
    },
    {
      id: 'bnu-lower-red-fruit-ninety-nine-beads',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '图表示99，两个数位实际合计几颗珠？',
      rule: {
        kind: 'number',
        value: 18,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '十位9珠、个位9珠，18颗珠表示99。',
      visual: {
        kind: 'place-counters',
        values: [99],
      },
    },
    {
      id: 'bnu-lower-red-fruit-bead-comparison',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '100图1珠，99图18珠。能由1<18推出100<99吗？',
      rule: {
        kind: 'choice',
        value: '不能，要按数位表示的数比较',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '珠子的数位权重不同，1个百大于9个十9个一。',
      choices: [
        {
          id: '不能，要按数位表示的数比较',
          label: '不能，要按数位表示的数比较',
        },
        {
          id: '能，珠少就是数小',
          label: '能，珠少就是数小',
        },
        {
          id: '两个数都一样',
          label: '两个数都一样',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-same-tens',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '32与34十位相同，应继续看哪里？',
      rule: {
        kind: 'choice',
        value: '看个位的2与4',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '从较高数位开始，十位相同再看个位。',
      choices: [
        {
          id: '看个位的2与4',
          label: '看个位的2与4',
        },
        {
          id: '只看珠总数',
          label: '只看珠总数',
        },
        {
          id: '十位相同就是相等',
          label: '十位相同就是相等',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-actual-write-thirties',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '实际读原32/34计数器，分别写出两个数、填写<并说明比较过程。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-actual-write-hundred',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '实际读原100/99计数器，分别写数与>，指出数位意义而非珠数。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-ruler-ticks',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '按原数线从左到右填写全部14个标数。',
      rule: {
        kind: 'steps',
        values: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '这里图示每隔5标一个数，标数全部按从小到大排列。',
    },
    {
      id: 'bnu-lower-red-fruit-ruler-above45',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填45<□。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 46,
        maximum: 100,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '46～100任何整数都符合；46虽未标在原数线上也合法。',
    },
    {
      id: 'bnu-lower-red-fruit-ruler-below90',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填90>□。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 0,
        maximum: 89,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '0～89任何整数都符合，90相等不能填。',
    },
    {
      id: 'bnu-lower-red-fruit-ruler-nontick',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填45<□，在本站0～100范围内能填46吗？',
      rule: {
        kind: 'choice',
        value: '能，46大于45，不要求是刻度标数',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '数线标数提供位置参照，不是合法填法的全部清单。',
      choices: [
        {
          id: '能，46大于45，不要求是刻度标数',
          label: '能，46大于45，不要求是刻度标数',
        },
        {
          id: '不能，只能填5的倍数',
          label: '不能，只能填5的倍数',
        },
        {
          id: '不能，46等于45',
          label: '不能，46等于45',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-ruler-direction',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '原数线从左到右怎样排列？',
      rule: {
        kind: 'choice',
        value: '从小到大',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '在同一递增数线上较大的数在较小数右侧。',
      choices: [
        {
          id: '从小到大',
          label: '从小到大',
        },
        {
          id: '从大到小',
          label: '从大到小',
        },
        {
          id: '大小交替',
          label: '大小交替',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-actual-ruler',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '实际指原数线从35到100读全部标数，说明右侧较大。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-actual-ruler-open',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '在纸面分别完成45<空与90>空，各另找一种符合条件的填法并解释。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-practice-read',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '原三组给出45/54、79/80、100/89。按组顺序填写六个数。',
      rule: {
        kind: 'steps',
        values: [45, 54, 79, 80, 100, 89],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '原三组全部是45/54、79/80、100/89；最后蓝图十位8、个位9，不能误读99。',
    },
    {
      id: 'bnu-lower-red-fruit-practice-forty',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '练习第一组：看两个计数器，左表示的数与右表示的数之间填哪个符号？',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '4个十小于5个十，所以45<54。',
      visual: {
        kind: 'place-counters',
        values: [45, 54],
      },
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-practice-seventy',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '练习第二组：看两个计数器，左表示的数与右表示的数之间填哪个符号？',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '7个十小于8个十，所以79<80，不因个位9大于0就反判。',
      visual: {
        kind: 'place-counters',
        values: [79, 80],
      },
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-practice-last',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '练习第三组：看两个计数器，左表示的数与右表示的数之间填哪个符号？',
      rule: {
        kind: 'choice',
        value: '>',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '1个百大于8个十9个一，所以100>89。',
      visual: {
        kind: 'place-counters',
        values: [100, 89],
      },
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-practice-eighty-ones',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '表示80的图，已确认个位没有珠。个位为几？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '已确认的空个位是0，不等于不知道有没有。',
      visual: {
        kind: 'place-counters',
        values: [80],
      },
    },
    {
      id: 'bnu-lower-red-fruit-actual-practice-pairs',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '实际在原书或纸面把三组45/54、79/80、100/89都读出、写全数与符号，逐组说明。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-open-above15',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填15<□。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 16,
        maximum: 100,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '网页范围内16～100均合法；15相等不合。',
    },
    {
      id: 'bnu-lower-red-fruit-open-above89',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填□>89。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 90,
        maximum: 100,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '90～100均合法，100也可以；89不合。',
    },
    {
      id: 'bnu-lower-red-fruit-open-below30',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填□<30。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 0,
        maximum: 29,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '0～29均合法，0是已填写的数，不是空答。',
    },
    {
      id: 'bnu-lower-red-fruit-open-below80',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填80>□。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 0,
        maximum: 79,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '0～79均合法，80相等不合。',
    },
    {
      id: 'bnu-lower-red-fruit-open-equal',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '填15<空，可以填15吗？',
      rule: {
        kind: 'choice',
        value: '不能，相等不满足小于',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '严格小于排除相等，严格大于也排除相等。',
      choices: [
        {
          id: '不能，相等不满足小于',
          label: '不能，相等不满足小于',
        },
        {
          id: '能，数一样就行',
          label: '能，数一样就行',
        },
        {
          id: '能，只要是整数',
          label: '能，只要是整数',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-open-original-range',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '在原纸面题空>89中写101，和本站限定0～100有何区别？',
      rule: {
        kind: 'choice',
        value: '101符合原大小关系，但超出本次网页范围',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '原题未另设统一上限，网页范围须单独说明，不把本站限制改称原题要求。',
      choices: [
        {
          id: '101符合原大小关系，但超出本次网页范围',
          label: '101符合原大小关系，但超出本次网页范围',
        },
        {
          id: '原题明文限定只能到100',
          label: '原题明文限定只能到100',
        },
        {
          id: '101小于89',
          label: '101小于89',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-actual-open-four',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '实际完整做原四处开放填数，每处至少说明一例；另找不同合理填法，不把一个示例当唯一。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-connect-less',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '原九卡8、29、73、62、59、100、55、17、86，选出全部小于60的卡。',
      rule: {
        kind: 'set',
        values: ['8', '29', '59', '55', '17'],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '五张是8、29、59、55、17，全部选齐且不选较大数。',
      choices: [
        {
          id: '8',
          label: '8',
        },
        {
          id: '29',
          label: '29',
        },
        {
          id: '73',
          label: '73',
        },
        {
          id: '62',
          label: '62',
        },
        {
          id: '59',
          label: '59',
        },
        {
          id: '100',
          label: '100',
        },
        {
          id: '55',
          label: '55',
        },
        {
          id: '17',
          label: '17',
        },
        {
          id: '86',
          label: '86',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-connect-greater',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '同九卡中选出全部大于60的卡。',
      rule: {
        kind: 'set',
        values: ['73', '62', '100', '86'],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '四张是73、62、100、86，与小于60的五张共同覆盖原九卡。',
      choices: [
        {
          id: '8',
          label: '8',
        },
        {
          id: '29',
          label: '29',
        },
        {
          id: '73',
          label: '73',
        },
        {
          id: '62',
          label: '62',
        },
        {
          id: '59',
          label: '59',
        },
        {
          id: '100',
          label: '100',
        },
        {
          id: '55',
          label: '55',
        },
        {
          id: '17',
          label: '17',
        },
        {
          id: '86',
          label: '86',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-equal-sixty',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '换一张新卡60，按严格小于60或大于60能放哪边？',
      rule: {
        kind: 'choice',
        value: '两边都不能，60等于60',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '新条件60等于60，不能偷改成小于等于或大于等于。',
      choices: [
        {
          id: '两边都不能，60等于60',
          label: '两边都不能，60等于60',
        },
        {
          id: '小于60那边',
          label: '小于60那边',
        },
        {
          id: '大于60那边',
          label: '大于60那边',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-all-card-count',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '原给定数字卡一共有几张？',
      rule: {
        kind: 'number',
        value: 9,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '九张不同卡全部分类，卡张数与各卡数值不同。',
    },
    {
      id: 'bnu-lower-red-fruit-actual-connect',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '实际将原九张数字卡全部连向小于60或大于60的家，逐卡核对遗漏与重复。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-actual-explain',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '实际向同伴解释至少一组数位比较和九卡分类；对方是否听懂如实记，不自动保证。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '实际完整做过才确认；没有做如实跳过，网页答对不能替代摆拨、纸面填写或交流。',
    },
    {
      id: 'bnu-lower-red-fruit-own-method',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '说说自己实际采用的比较方法：比较哪两个数，从哪里开始？没有做过可如实写。',
      rule: {
        kind: 'reflection',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '保存自己的原话，不评分；实际经过与未来打算分开，未确定不补成0。',
    },
    {
      id: 'bnu-lower-red-fruit-discovery',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '记录今天对符号开口、数位或多种填法的一条发现。',
      rule: {
        kind: 'reflection',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '保存自己的原话，不评分；实际经过与未来打算分开，未确定不补成0。',
    },
    {
      id: 'bnu-lower-red-fruit-difficulty',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '记录仍不清楚的一处比较或填法，可以写暂时没有困难。',
      rule: {
        kind: 'reflection',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '保存自己的原话，不评分；实际经过与未来打算分开，未确定不补成0。',
    },
    {
      id: 'bnu-lower-red-fruit-plan',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '单独记录下一次准备练习什么；这是未来计划，不当本次已完成活动。',
      rule: {
        kind: 'reflection',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation:
        '保存自己的原话，不评分；实际经过与未来打算分开，未确定不补成0。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-red-fruit-review-pair',
      knowledge: 'bnu-lower-red-fruit',
      prompt:
        '换数后的新比较：看两个计数器，左表示的数与右表示的数之间填哪个符号？',
      rule: {
        kind: 'choice',
        value: '<',
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '新条件5个十小于8个十，58<85；不能套原左右数位。',
      visual: {
        kind: 'place-counters',
        values: [58, 85],
      },
      choices: [
        {
          id: '<',
          label: '<',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '>',
          label: '>',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-review-above99',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '新题填□>99。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 100,
        maximum: 100,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '网页0～100范围内只有100；原纸面更大范围另论。',
    },
    {
      id: 'bnu-lower-red-fruit-review-below1',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '新题填□<1。 本站填0～100的整数，所有符合条件的数都可以。',
      rule: {
        kind: 'number-interval',
        minimum: 0,
        maximum: 0,
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '在明说0～100整数范围内只有0，空答不能替代0。',
    },
    {
      id: 'bnu-lower-red-fruit-review-less',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '新卡60、61、0、99、59，选全部小于60的卡；相等卡不入两边。',
      rule: {
        kind: 'set',
        values: ['0', '59'],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '0和59小于60，60相等排除，61与99较大。',
      choices: [
        {
          id: '60',
          label: '60',
        },
        {
          id: '61',
          label: '61',
        },
        {
          id: '0',
          label: '0',
        },
        {
          id: '99',
          label: '99',
        },
        {
          id: '59',
          label: '59',
        },
      ],
    },
    {
      id: 'bnu-lower-red-fruit-review-greater',
      knowledge: 'bnu-lower-red-fruit',
      prompt: '同五张新卡选全部大于60的卡；相等卡不入两边。',
      rule: {
        kind: 'set',
        values: ['61', '99'],
      },
      hint: '先明确所比对象，按百十个位或数线位置比较；开放题在明说的网页范围内逐个检查大小条件。',
      explanation: '61和99大于60，60相等排除，0与59较小。',
      choices: [
        {
          id: '60',
          label: '60',
        },
        {
          id: '61',
          label: '61',
        },
        {
          id: '0',
          label: '0',
        },
        {
          id: '99',
          label: '99',
        },
        {
          id: '59',
          label: '59',
        },
      ],
    },
  ],
};
