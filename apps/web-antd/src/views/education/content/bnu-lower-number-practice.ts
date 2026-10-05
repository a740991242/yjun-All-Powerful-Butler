import type { Lesson } from '../learning/types';

export const bnuLowerNumberPracticeLesson: Lesson = {
  id: 'bnu-lower-number-practice',
  textbookTitle: '巩固与应用',
  title: '百以内数巩固：四材料、完整数列与全部组数',
  page: 58,
  version: 1,
  status: 'available',
  goal: '完整表示四种原数量、合作拨写，结合全部候选与线索比较，填齐四条数列、四珠全部五种和三卡全部六种组数。',
  prerequisite:
    '理解十和一与数量守恒，能比较100以内的数，知道候选与条件须完整核对。',
  parentTip:
    '依据已读58～59页七项原活动。逐物43、捆棒38、两杆25、两十条十五散一35原数量完整；原散一15与换十后个位5分开。34双角色游戏实际确认；定性比较不补普遍阈值，故事书必须两线索。四列车保留9/8/7/8位置与全部十六空，本站按明示+5/+2/+10/−5判分，有限前缀不冒所有续法唯一。四珠仅原十/个位两杆，包含一位数4及40个位0，共享空百位不新增珠；原空次序开放与本站升序分开。两张不同卡全列六数，不复制同一张。十六实际人工、四反思null与未来计划独立，原图不打包，无需学校或指定审校人前置，最终教师审校未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '58～59两整页、四材料与四列车放大、四珠及三卡穷举核对',
    notes: '七项活动全部对应；本站单位重画不冒原照片，最终教师试用未核验。',
  },
  steps: [
    {
      title: '完整点数，分十写数',
      text: '原第一图四排各10加3，共43。逐物点数不漏最后3；完整分十是4个十3个一。原页没写物品名称，本站用圆点重画只表示对象，不按图形颜色猜种类。',
      activity: '实际点数并写完整三个空。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'objects',
        variant: 'main',
      },
    },
    {
      title: '捆数与根数分别读',
      text: '原三捆，每捆10根，另8单根，共38。每捆是十，不算成3+8=11；绑带和边框不增加根数，三个空按十/一/总量填。',
      activity: '实际回原图数捆数与单根，解释每捆十。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'sticks',
        variant: 'main',
      },
    },
    {
      title: '数位、材料与拨写游戏',
      text: '原计数器2十5一表示25，材料珠7颗不同于25。另一个我拨你写原示范34为3十4一，两人一人拨或画、一人读写，核对再交换角色；网页填34不是已经做过双角色活动。',
      activity: '实际画原25，再与陪伴者完成两轮不同角色拨写。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'counter',
        variant: 'main',
      },
    },
    {
      title: '十五散一先完整数，再换十',
      text: '原两条十格条和十五单个，共35。先按原材料2个十15个一填；15个散一不是个位数字15。把其中10换成一十后为3个十5个一，值仍35，不能删十单个却忘补一十。本站方格是单位示意，不冒原积木尺寸。',
      activity: '原十五散一全部点数，再实际画记换十并检查不变。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'cubes',
        variant: 'main',
      },
    },
    {
      title: '候选比较要保留参照',
      text: '原已摘38，多一些在96/42/35中选42；96远多、35少。树上未摘不加进已摘38，定性词只结合本题候选，不设差4或某比例在所有题通用。',
      activity: '实际圈42并说明比较对象与方向。',
    },
    {
      title: '两条线索一起读',
      text: '图画书36，故事书比36多得多，又比90少一些，在85/99/40中选85。若只大于36三个全符合，若只小于90还有85/40，不能单一不完整条件定85；99超过90，40只比36略多。',
      activity: '实际圈85，完整说两条关系，不冒真实书架调查。',
    },
    {
      title: '第一条全部九个位置',
      text: '原15、20、25、空、35、空、45、空、空。网页明确每次加5，四空为30、40、50、55。给定数保持原位置，空格A～D依次对应四字段。',
      activity: '实际填写全部四空并读齐九项。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'five-up',
        variant: 'main',
      },
    },
    {
      title: '第二条全部八个位置',
      text: '原22、空、26、28、空、32、空、空。明确每次加2，四空24、30、34、36；人物车轮和位置编号不计成数列值。',
      activity: '实际填写四空并读齐八项。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'two-up',
        variant: 'main',
      },
    },
    {
      title: '第三条全部七个位置',
      text: '原10、20、30、空、空、空、空。明确每次加10，四空40、50、60、70，不因空格少就减少位置。',
      activity: '实际填齐并读七项。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'ten-up',
        variant: 'main',
      },
    },
    {
      title: '第四条换成向下数',
      text: '原100、95、90、85、空、空、空、空。明确每次减5，四空80、75、70、65；不能套前面加5，100也要保留。有限前缀的其它自拟续法可另讨论，本网页按明示等步长判分。',
      activity: '实际填齐四空，读八项并解释减的方向。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'five-down',
        variant: 'main',
      },
    },
    {
      title: '四珠的原示范13',
      text: '原只有十/个位两杆合四颗，十位1颗、个位3颗为13。本站共享辅助有空百位，这是额外空栏，不允许将珠拨到百位来增加本题情况。',
      activity: '实际画或拨原示例并核对总四珠。',
      visual: {
        kind: 'place-counters',
        values: [13],
      },
    },
    {
      title: '其余四图都要做',
      text: '十位还可0、2、3、4颗，对应4、22、31、40。与13合五种全部完整；4是一位数也符合题意，40个位0是真实已知。原四空允许不同次序，本站八数位题及升序题明确要求顺序，不强称原书唯一排列。',
      activity: '实际做齐五图，逐图核对十/个位合四，不自动确认。',
      visual: {
        kind: 'place-counters',
        values: [4, 22, 31, 40],
      },
    },
    {
      title: '三卡选两张，全部六种',
      text: '卡2、5、8各一张，每个数用两张不同卡；以2为十位有25/28，以5有52/58，以8有82/85。六数按升序25、28、52、58、82、85，不能复制卡成22/55/88或只列三个。',
      activity: '实际写卡全列，再从小到大摆齐六种并说明不漏不重。',
    },
    {
      title: '回看实际任务和自己的记录',
      text: '回看四材料、两轮拨写、两次候选圈选、四条完整数列、全部五个四珠图及六种两位数。网站答题不替代纸笔/实物/交流；自己的方法、发现、困难如实记，未来计划另列。',
      activity: '记录已做与未做，开放原话不评分，计划不当完成。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-number-practice-objects',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '原第一图有四排各10个对象，另3个。完整分十后依次填几个十、几个一、总数。',
      rule: {
        kind: 'steps',
        values: [4, 3, 43],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '四排十为4个十，余3个一，总43；图中每对象一次，物品名称不影响数量。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'objects',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-sticks',
      knowledge: 'bnu-lower-number-practice',
      prompt: '原三捆每捆十根和8单根，依次填几个十、几个一、总根数。',
      rule: {
        kind: 'steps',
        values: [3, 8, 38],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '3个十和8个一是38，捆数与根数不能混为3+8。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'sticks',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-counter',
      knowledge: 'bnu-lower-number-practice',
      prompt: '原十位两颗、个位五颗，依次填几个十、几个一、表示的数。',
      rule: {
        kind: 'steps',
        values: [2, 5, 25],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '按数位2个十5个一是25，不把7颗材料珠当表示值。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'counter',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-cubes-raw',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '按原两条十格条和15个散格，先不换十。依次填原几个十、散几个一、总值。',
      rule: {
        kind: 'steps',
        values: [2, 15, 35],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '原2个十和15个一共35；散一数量15不是规范个位数字15。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'cubes',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-cubes-regrouped',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '仍是原两十条和15散一，把10散一换成一十，再依次填几个十、几个一、总值。',
      rule: {
        kind: 'steps',
        values: [3, 5, 35],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '换十总值不变为3个十5个一35；不能删除十散一却不补一十。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'cubes',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-cubes-loose',
      knowledge: 'bnu-lower-number-practice',
      prompt: '原积木图除了两条十格长条，还有多少个散格？',
      rule: {
        kind: 'number',
        value: 15,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '散格完整十五个，不能只读整理后的个位5。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'cubes',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-game-digits',
      knowledge: 'bnu-lower-number-practice',
      prompt: '原我拨你写示范34，按先十位后个位填两个数位数字。',
      rule: {
        kind: 'steps',
        values: [3, 4],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '3个十和4个一表示34；年龄或图中人数不是数位。',
      visual: {
        kind: 'place-counters',
        values: [34],
      },
    },
    {
      id: 'bnu-lower-number-practice-game-value',
      knowledge: 'bnu-lower-number-practice',
      prompt: '原示范十位3颗、个位4颗，表示多少？',
      rule: {
        kind: 'number',
        value: 34,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '数位表示34，不是材料件数7。',
      visual: {
        kind: 'place-counters',
        values: [34],
      },
    },
    {
      id: 'bnu-lower-number-practice-game-beads',
      knowledge: 'bnu-lower-number-practice',
      prompt: '34计数器十位3颗、个位4颗，材料珠共有多少颗？',
      rule: {
        kind: 'number',
        value: 7,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '3+4=7颗材料珠，与表示值34分别读。',
    },
    {
      id: 'bnu-lower-number-practice-peach-reference',
      knowledge: 'bnu-lower-number-practice',
      prompt: '原小猴已摘38个，比较大猴的数量时已知参照是多少个？',
      rule: {
        kind: 'number',
        value: 38,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '参照是已摘38，树上还未摘的桃不加进去。',
    },
    {
      id: 'bnu-lower-number-practice-peach-selected',
      knowledge: 'bnu-lower-number-practice',
      prompt: '参照已摘38个，大猴说多一些，在96、42、35中选哪个？',
      rule: {
        kind: 'number',
        value: 42,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '当前候选42比38略多，96远多，35少；不把差4设成通用阈值。',
    },
    {
      id: 'bnu-lower-number-practice-peach-less',
      knowledge: 'bnu-lower-number-practice',
      prompt: '候选96、42、35中，哪个比参照38少，方向就不符合多一些？',
      rule: {
        kind: 'number',
        value: 35,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '35<38，先核对多/少方向。',
    },
    {
      id: 'bnu-lower-number-practice-book-selected',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '图画书36本，故事书比36多得多，又比90少一些。在85、99、40中选哪个？',
      rule: {
        kind: 'number',
        value: 85,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '结合全部两条定性线索选85；99超过90、40只比36多一点，不能只读一半条件。',
    },
    {
      id: 'bnu-lower-number-practice-book-only-greater',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '如果只知道大于36，不保留多得多和90的线索，原85、99、40哪些都符合？按原候选顺序填全部。',
      rule: {
        kind: 'steps',
        values: [85, 99, 40],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '严格大于36三个都成立，不能由这一不完整条件唯一选85。',
    },
    {
      id: 'bnu-lower-number-practice-book-only-less',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '如果只知道小于90，在原85、99、40中哪些符合？按原候选顺序填全部。',
      rule: {
        kind: 'steps',
        values: [85, 40],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '85与40都小于90；单这一条件仍不能唯一确定85。',
    },
    {
      id: 'bnu-lower-number-practice-book-incomplete',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '只给大于36而不说明其它线索，能在85、99、40中唯一确定故事书数吗？',
      rule: {
        kind: 'choice',
        value: '不能，三个候选都大于36',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '完整线索与单个不等式不同；定性词按本候选理解，不设普遍比例。',
      choices: [
        {
          id: '不能，三个候选都大于36',
          label: '不能，三个候选都大于36',
        },
        {
          id: '能，必定85',
          label: '能，必定85',
        },
        {
          id: '能，必定99',
          label: '能，必定99',
        },
      ],
    },
    {
      id: 'bnu-lower-number-practice-five-up',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '原数列在网页明确按每次加5，9个位置是15、20、25、A、35、B、45、C、D。按A、B、C、D顺序填写全部四空。',
      rule: {
        kind: 'steps',
        values: [30, 40, 50, 55],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原给定位置不改，方向和等步长已明示；空格不0，人物车轮不计作位置。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'five-up',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-two-up',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '原数列在网页明确按每次加2，8个位置是22、A、26、28、B、32、C、D。按A、B、C、D顺序填写全部四空。',
      rule: {
        kind: 'steps',
        values: [24, 30, 34, 36],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原给定位置不改，方向和等步长已明示；空格不0，人物车轮不计作位置。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'two-up',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-ten-up',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '原数列在网页明确按每次加10，7个位置是10、20、30、A、B、C、D。按A、B、C、D顺序填写全部四空。',
      rule: {
        kind: 'steps',
        values: [40, 50, 60, 70],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原给定位置不改，方向和等步长已明示；空格不0，人物车轮不计作位置。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'ten-up',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-five-down',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '原数列在网页明确按每次减5，8个位置是100、95、90、85、A、B、C、D。按A、B、C、D顺序填写全部四空。',
      rule: {
        kind: 'steps',
        values: [80, 75, 70, 65],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原给定位置不改，方向和等步长已明示；空格不0，人物车轮不计作位置。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'five-down',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-number-practice-descending-step',
      knowledge: 'bnu-lower-number-practice',
      prompt: '原100、95、90、85后按同样等步长继续，接下来应怎样变化？',
      rule: {
        kind: 'choice',
        value: '每次减5',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '是从大到小减5，不能套另三条向上数列。',
      choices: [
        {
          id: '每次减5',
          label: '每次减5',
        },
        {
          id: '每次加5',
          label: '每次加5',
        },
        {
          id: '每次减10',
          label: '每次减10',
        },
      ],
    },
    {
      id: 'bnu-lower-number-practice-beads-remaining',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '十/个位两杆合4颗珠，原已示13。网页要求按从小到大填写其它全部四种表示值。',
      rule: {
        kind: 'steps',
        values: [4, 22, 31, 40],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '其它四种是4、22、31、40；4是一位数也合法，不能漏全在个位或全在十位。',
    },
    {
      id: 'bnu-lower-number-practice-beads-all',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '仍只用十位和个位合4颗珠，按从小到大填写全部五种表示值，包含原示例13。',
      rule: {
        kind: 'steps',
        values: [4, 13, 22, 31, 40],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '十位依次0、1、2、3、4颗，个位依次4、3、2、1、0颗，每种合4。',
    },
    {
      id: 'bnu-lower-number-practice-beads-digits',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '原示例13除外，按表示值4、22、31、40顺序，每个先十位后个位填全部八个数位数字。',
      rule: {
        kind: 'steps',
        values: [0, 4, 2, 2, 3, 1, 4, 0],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '4十位0个、个位4个；40十位4、个位0，真实0不是未知。',
    },
    {
      id: 'bnu-lower-number-practice-beads-zero',
      knowledge: 'bnu-lower-number-practice',
      prompt: '只用十/个位两杆合4珠，表示40时个位应有几颗？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '四颗都在十位，个位已知0颗，不是没有记录。',
      visual: {
        kind: 'place-counters',
        values: [40],
      },
    },
    {
      id: 'bnu-lower-number-practice-beads-count',
      knowledge: 'bnu-lower-number-practice',
      prompt: '只用十位与个位共4珠，总共有几种不同表示值？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '十位珠数可为0、1、2、3、4五种，对应4、13、22、31、40。',
    },
    {
      id: 'bnu-lower-number-practice-cards-six',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '原卡2、5、8，每次选两张不同卡组成两位数。按从小到大填写全部六个。',
      rule: {
        kind: 'steps',
        values: [25, 28, 52, 58, 82, 85],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '以2/5/8作十位，各有两种不同个位，六个完整，不复制同一张。',
    },
    {
      id: 'bnu-lower-number-practice-cards-count',
      knowledge: 'bnu-lower-number-practice',
      prompt: '卡2、5、8每次选两张不同卡组成两位数，共有几个不同的数？',
      rule: {
        kind: 'number',
        value: 6,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '每一种十位各两种个位，共六个，不能只数三种十位。',
    },
    {
      id: 'bnu-lower-number-practice-cards-duplicate',
      knowledge: 'bnu-lower-number-practice',
      prompt: '只有一张2、一张5、一张8，每个数用两张不同卡。22能组成吗？',
      rule: {
        kind: 'choice',
        value: '不能，需要两张2',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '同一数中每张只一次，不临时增加第二张2。',
      choices: [
        {
          id: '不能，需要两张2',
          label: '不能，需要两张2',
        },
        {
          id: '能，复制同一张2',
          label: '能，复制同一张2',
        },
        {
          id: '能，只看十位',
          label: '能，只看十位',
        },
      ],
    },
    {
      id: 'bnu-lower-number-practice-actual-objects',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际回原第一图逐个点数，圈完整十组并写十/一/总量。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-sticks',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际回原捆棒图数捆与单根，写完整三个空并说明每捆十。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-counter',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际按原十/个位两杆画2十5一，写完整三个空并核对25。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-cubes',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际回原两十条和全部十五散块，逐个核对，先按原数量填三个空。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-regroup',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际用画记或安全材料把十五散一中的十换成一十，检查总量35保持。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-game-first',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '实际与陪伴者做第一轮我拨你写，一人拨或画十/个位，另一人读写并核对。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-game-switch',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际交换角色，再做一轮拨或画、读写与相互核对。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-peach',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际在原96/42/35候选下圈42，说清参照已摘38与多一些方向。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-books',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际在原85/99/40候选下圈85，完整说故事书对36和90的两条关系。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-train-five',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际完整填写原加5数列的全部四空，读齐九个位置。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-train-two',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际完整填写原加2数列的全部四空，读齐八个位置。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-train-ten',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际完整填写原加10数列的全部四空，读齐七个位置。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-train-down',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际完整填写原减5数列的全部四空，读齐八个位置。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-four-beads',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '实际画或拨十/个位合四珠的全部五图，写4/13/22/31/40并核对每图都四珠。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-six-cards',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际用2/5/8卡各选两张，全列六种两位数并从小到大摆齐。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-actual-explain',
      knowledge: 'bnu-lower-number-practice',
      prompt: '实际向陪伴者说明六个数如何避免重复或漏列，并核对排序。',
      rule: {
        kind: 'manual',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '原书或自画纸面真实操作另做并由本人确认；网页正确答案不自动完成实物、圈写或交流。可用已有纸笔，不强迫购买。',
    },
    {
      id: 'bnu-lower-number-practice-own-method',
      knowledge: 'bnu-lower-number-practice',
      prompt: '记录自己实际用的点数、分十或比较方法。',
      rule: {
        kind: 'reflection',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '自己的原话开放、不统一判对错；未做可以如实说明，未来计划不能自动确认实做。',
    },
    {
      id: 'bnu-lower-number-practice-discovery',
      knowledge: 'bnu-lower-number-practice',
      prompt: '记录自己发现的四珠五种表示关系。',
      rule: {
        kind: 'reflection',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '自己的原话开放、不统一判对错；未做可以如实说明，未来计划不能自动确认实做。',
    },
    {
      id: 'bnu-lower-number-practice-difficulty',
      knowledge: 'bnu-lower-number-practice',
      prompt: '记录还不清楚的条件或完整列举步骤。',
      rule: {
        kind: 'reflection',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '自己的原话开放、不统一判对错；未做可以如实说明，未来计划不能自动确认实做。',
    },
    {
      id: 'bnu-lower-number-practice-plan',
      knowledge: 'bnu-lower-number-practice',
      prompt: '单独记录下一次准备怎样练习。',
      rule: {
        kind: 'reflection',
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation:
        '自己的原话开放、不统一判对错；未做可以如实说明，未来计划不能自动确认实做。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-number-practice-review-cubes',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '新图三条十格长条和12个散格，先不换十，依次填原几个十、几个一、总值。',
      rule: {
        kind: 'steps',
        values: [3, 12, 42],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '三十加十二为42；原散一12与整理后个位2分开。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'cubes',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-number-practice-review-game',
      knowledge: 'bnu-lower-number-practice',
      prompt: '新示范十位3颗、个位2颗，先十位后个位填两个数位数字。',
      rule: {
        kind: 'steps',
        values: [3, 2],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '新图表示32，不沿用原示例34。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'counter',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-number-practice-review-peach',
      knowledge: 'bnu-lower-number-practice',
      prompt: '新参照47，候选45、52、94；要选比47多一些的候选，选哪个？',
      rule: {
        kind: 'number',
        value: 52,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '按新完整候选选较接近且多的52，不沿用42，不补通用阈值。',
    },
    {
      id: 'bnu-lower-number-practice-review-books',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '新图画书28，故事书比28多得多又比80少一些。在35、76、91中选哪个？',
      rule: {
        kind: 'number',
        value: 76,
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '完整两线索本候选选76，不沿用85。',
    },
    {
      id: 'bnu-lower-number-practice-review-five-up',
      knowledge: 'bnu-lower-number-practice',
      prompt:
        '新数列12、17、22、A、32、B、42、C、D，每次加5。依A～D填全部四空。',
      rule: {
        kind: 'steps',
        values: [27, 37, 47, 52],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '新起点保留同一明示步长，不能沿用原四空答案。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'five-up',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-number-practice-review-two-up',
      knowledge: 'bnu-lower-number-practice',
      prompt: '新数列41、A、45、47、B、51、C、D，每次加2。依A～D填全部四空。',
      rule: {
        kind: 'steps',
        values: [43, 49, 53, 55],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '新起点保留同一明示步长，不能沿用原四空答案。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'two-up',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-number-practice-review-ten-up',
      knowledge: 'bnu-lower-number-practice',
      prompt: '新数列9、19、29、A、B、C、D，每次加10。依A～D填全部四空。',
      rule: {
        kind: 'steps',
        values: [39, 49, 59, 69],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '新起点保留同一明示步长，不能沿用原四空答案。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'ten-up',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-number-practice-review-five-down',
      knowledge: 'bnu-lower-number-practice',
      prompt: '新数列99、94、89、84、A、B、C、D，每次减5。依A～D填全部四空。',
      rule: {
        kind: 'steps',
        values: [79, 74, 69, 64],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '新起点保留同一明示步长，不能沿用原四空答案。',
      visual: {
        kind: 'bnu-number-review',
        scene: 'five-down',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-number-practice-review-beads',
      knowledge: 'bnu-lower-number-practice',
      prompt: '这次十/个位两杆共3颗珠，按从小到大填写全部不同表示值。',
      rule: {
        kind: 'steps',
        values: [3, 12, 21, 30],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '总珠数改成三，十位0～3共四种，3与30个位0都合法。',
    },
    {
      id: 'bnu-lower-number-practice-review-cards',
      knowledge: 'bnu-lower-number-practice',
      prompt: '新卡1、3、7，每次两张不同卡组成两位数。从小到大填全部六种。',
      rule: {
        kind: 'steps',
        values: [13, 17, 31, 37, 71, 73],
      },
      hint: '读完整已知条件与所求，数位/材料、方向/步长分别检查；全部位置或候选都核对，实物与纸笔另确认。',
      explanation: '新数字卡重新全列，不沿用2/5/8六数。',
    },
  ],
};
