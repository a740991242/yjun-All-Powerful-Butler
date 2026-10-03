import type { Lesson } from '../learning/types';

export const bnuRoomSortLesson: Lesson = {
  id: 'bnu-upper-room-sort',
  textbookTitle: '整理与分类',
  title: '按用途整理与同批物品换标准',
  page: 43,
  version: 1,
  status: 'available',
  goal: '明确分类对象与标准，完整分类后核对；换标准重新分，实际活动另记。',
  prerequisite: '能点数到10并按明确的属性识别物品。',
  parentTip:
    '对应43～45页。本站编号纸卡与条件原创，不复制原画。只整理已有安全物品，附页剪裁由成人协助或画卡替代，不强迫购置材料。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷43～45页已实际查看；来源不冒出版社托管，ISBN和印次未知。原书实做与本站纸卡分别记录。',
  },
  steps: [
    {
      title: '整理前先观察',
      text: '原书房间只是情境，不用来评价自己的家庭。观察已有安全物品，选择可以整理的一小处。先说数和分的对象，用品容器与里面物品不是同一层级。',
      activity: '实际观察一小处，说明实地或纸图替代。',
    },
    {
      title: '按用途同类放一起',
      text: '本站8张编号纸卡：A数学书、B练习本、C铅笔、D橡皮、E玩具纸球、F玩具车、G外套、H鞋。本题只按学习用品、玩具、服装鞋帽三个用途分类；各卡只放一类。整理前后仍八张，三类不是三件物品；逐张放入并检查。',
      activity: '实际摆八张卡并核对三类及总数。',
    },
    {
      title: '同一批书换标准',
      text: '同一批4张卡：A语文书、B数学书、C语文练习本、D数学练习本。按科目语文A/C、数学B/D；恢复后按书本A/B、练习本C/D。换标准要重新看全部四张，不沿用旧组名。',
      activity: '实际恢复卡片后分别做两轮。',
    },
    {
      title: '笔的两种标准',
      text: '同一批4张卡：A带橡皮的铅笔、B不带橡皮的铅笔、C带橡皮的彩笔、D不带橡皮的彩笔。只按本题注明的两个属性判断。按带橡皮A/C与不带B/D；按笔种铅笔A/B与彩笔C/D。明确标准可得到不同合法分法。',
      activity: '实际摆分并说明分组依据。',
    },
    {
      title: '按已给定条件筛选',
      text: '纸面能力卡已明确：A鸟卡能飞、B昆虫卡能飞、C兔卡不能飞、D狗卡不能飞、E另一昆虫卡能飞、F鱼卡不能飞。本题只按卡上已给定的信息分类，不推所有动物。选能飞时逐张核对，不只选一张；未说明的对象不能自动归某类。',
      activity: '逐卡筛选，完整检查所有卡。',
    },
    {
      title: '原书与实际书包',
      text: '回看43～45页的房间、动物、三类编号、书包、书本和笔的分类任务。实际整理自己已有书包或原创纸图，说明标准；不由网页成功冒实际整理。',
      activity: '实际完整任务与未来计划分开记录。',
    },
  ],
  questions: [
    {
      id: 'bnu-upper-room-sort-q1',
      knowledge: 'bnu-upper-room-sort',
      prompt: '按给定用途，这8张卡中学习用品有几张？',
      rule: {
        kind: 'number',
        value: 4,
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: 'A、B、C、D四张，类别数不是物品数。',
      material:
        '本站8张编号纸卡：A数学书、B练习本、C铅笔、D橡皮、E玩具纸球、F玩具车、G外套、H鞋。本题只按学习用品、玩具、服装鞋帽三个用途分类；各卡只放一类。',
    },
    {
      id: 'bnu-upper-room-sort-q2',
      knowledge: 'bnu-upper-room-sort',
      prompt: '完整选出学习用品卡编号。',
      rule: {
        kind: 'set',
        values: ['A', 'B', 'C', 'D'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '不混入另两类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
      ],
      material:
        '本站8张编号纸卡：A数学书、B练习本、C铅笔、D橡皮、E玩具纸球、F玩具车、G外套、H鞋。本题只按学习用品、玩具、服装鞋帽三个用途分类；各卡只放一类。',
    },
    {
      id: 'bnu-upper-room-sort-q3',
      knowledge: 'bnu-upper-room-sort',
      prompt: '完整选出玩具卡编号。',
      rule: {
        kind: 'set',
        values: ['E', 'F'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '仅E、F是本题明确的玩具。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
      ],
      material:
        '本站8张编号纸卡：A数学书、B练习本、C铅笔、D橡皮、E玩具纸球、F玩具车、G外套、H鞋。本题只按学习用品、玩具、服装鞋帽三个用途分类；各卡只放一类。',
    },
    {
      id: 'bnu-upper-room-sort-q4',
      knowledge: 'bnu-upper-room-sort',
      prompt: '完整选出服装鞋帽卡编号。',
      rule: {
        kind: 'set',
        values: ['G', 'H'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: 'G、H归该类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
      ],
      material:
        '本站8张编号纸卡：A数学书、B练习本、C铅笔、D橡皮、E玩具纸球、F玩具车、G外套、H鞋。本题只按学习用品、玩具、服装鞋帽三个用途分类；各卡只放一类。',
    },
    {
      id: 'bnu-upper-room-sort-q5',
      knowledge: 'bnu-upper-room-sort',
      prompt: '依次填学习用品、玩具、服装鞋帽三类卡片数。',
      rule: {
        kind: 'steps',
        values: [4, 2, 2],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '全部八张不漏不重复。',
      material:
        '本站8张编号纸卡：A数学书、B练习本、C铅笔、D橡皮、E玩具纸球、F玩具车、G外套、H鞋。本题只按学习用品、玩具、服装鞋帽三个用途分类；各卡只放一类。',
    },
    {
      id: 'bnu-upper-room-sort-q6',
      knowledge: 'bnu-upper-room-sort',
      prompt: '整理前后还是同一批卡，没有增减，一共有几张卡？',
      rule: {
        kind: 'number',
        value: 8,
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '分类改变摆放，不改变数量。',
      material:
        '本站8张编号纸卡：A数学书、B练习本、C铅笔、D橡皮、E玩具纸球、F玩具车、G外套、H鞋。本题只按学习用品、玩具、服装鞋帽三个用途分类；各卡只放一类。',
    },
    {
      id: 'bnu-upper-room-sort-q7',
      knowledge: 'bnu-upper-room-sort',
      prompt: '改按科目分，完整选出语文这一类。',
      rule: {
        kind: 'set',
        values: ['A', 'C'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '语文书与语文练习本同一科目。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
      ],
      material: '同一批4张卡：A语文书、B数学书、C语文练习本、D数学练习本。',
    },
    {
      id: 'bnu-upper-room-sort-q8',
      knowledge: 'bnu-upper-room-sort',
      prompt: '恢复同一批卡，改按书或练习本分，完整选出书这一类。',
      rule: {
        kind: 'set',
        values: ['A', 'B'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '标准改变后数学书和语文书归同一类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
      ],
      material: '同一批4张卡：A语文书、B数学书、C语文练习本、D数学练习本。',
    },
    {
      id: 'bnu-upper-room-sort-q9',
      knowledge: 'bnu-upper-room-sort',
      prompt: '按是否带橡皮分，完整选出带橡皮的笔卡。',
      rule: {
        kind: 'set',
        values: ['A', 'C'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '按明确特征，不按笔种。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
      ],
      material:
        '同一批4张卡：A带橡皮的铅笔、B不带橡皮的铅笔、C带橡皮的彩笔、D不带橡皮的彩笔。只按本题注明的两个属性判断。',
    },
    {
      id: 'bnu-upper-room-sort-q10',
      knowledge: 'bnu-upper-room-sort',
      prompt: '恢复同一批笔卡，按笔种分，完整选出铅笔卡。',
      rule: {
        kind: 'set',
        values: ['A', 'B'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '铅笔带或不带橡皮都归铅笔。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
      ],
      material:
        '同一批4张卡：A带橡皮的铅笔、B不带橡皮的铅笔、C带橡皮的彩笔、D不带橡皮的彩笔。只按本题注明的两个属性判断。',
    },
    {
      id: 'bnu-upper-room-sort-q11',
      knowledge: 'bnu-upper-room-sort',
      prompt: '按已给定能力，完整选出能飞的卡编号。',
      rule: {
        kind: 'set',
        values: ['A', 'B', 'E'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只按本题明确能力，不猜未给定动物。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
      ],
      material:
        '纸面能力卡已明确：A鸟卡能飞、B昆虫卡能飞、C兔卡不能飞、D狗卡不能飞、E另一昆虫卡能飞、F鱼卡不能飞。本题只按卡上已给定的信息分类，不推所有动物。',
    },
    {
      id: 'bnu-upper-room-sort-q12',
      knowledge: 'bnu-upper-room-sort',
      prompt: '本题明确不能飞的卡共有几张？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: 'C、D、F三张。',
      material:
        '纸面能力卡已明确：A鸟卡能飞、B昆虫卡能飞、C兔卡不能飞、D狗卡不能飞、E另一昆虫卡能飞、F鱼卡不能飞。本题只按卡上已给定的信息分类，不推所有动物。',
    },
    {
      id: 'bnu-upper-room-sort-q13',
      knowledge: 'bnu-upper-room-sort',
      prompt: '仅看原书房间图，能认定自己的房间也有同样物品吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '原书场景不冒家庭现状。',
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
      id: 'bnu-upper-room-sort-actual-observe',
      knowledge: 'bnu-upper-room-sort',
      prompt:
        '实际观察已有安全学习角或纸面替代，说明哪些同类物品在一起；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-room-sort-actual-cards',
      knowledge: 'bnu-upper-room-sort',
      prompt: '实际按本站八卡的三类用途摆放，逐张检查不漏不重复；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-room-sort-actual-books',
      knowledge: 'bnu-upper-room-sort',
      prompt:
        '实际用四书卡先按科目分，再恢复后按书或练习本分，并说标准；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-room-sort-actual-pens',
      knowledge: 'bnu-upper-room-sort',
      prompt:
        '实际用四笔卡分别按带橡皮与笔种分，恢复后重分并解释；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-room-sort-actual-bag',
      knowledge: 'bnu-upper-room-sort',
      prompt:
        '实际整理已有书包或画出的物品卡，说出标准和实际做法；有危险物品请成人处理。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-room-sort-actual-book',
      knowledge: 'bnu-upper-room-sort',
      prompt:
        '实际回看43～45页，完成房间比较与整理、飞行筛选、编号三类、书包、书本和笔的两种分类；原书与本站替代分别记录，做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-room-sort-reflection-standard',
      knowledge: 'bnu-upper-room-sort',
      prompt: '今天怎样先说标准再整理？记录实际做法或疑问。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '开放记录correct:null；计划与已做分开。',
    },
    {
      id: 'bnu-upper-room-sort-reflection-plan',
      knowledge: 'bnu-upper-room-sort',
      prompt: '下一次还准备怎样整理？未来计划不算今天已经完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '开放记录correct:null；计划与已做分开。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-upper-room-sort-review-total',
      knowledge: 'bnu-upper-room-sort',
      prompt: '新卡有2本书、1支笔、2个玩具；只数全部卡，共几张？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '五张卡，不是两类。',
    },
    {
      id: 'bnu-upper-room-sort-review-books',
      knowledge: 'bnu-upper-room-sort',
      prompt:
        '新四卡：J语文书、K数学练习本、L数学书、M语文练习本。按数学科目选完整编号。',
      rule: {
        kind: 'set',
        values: ['K', 'L'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '所求科目改变，需重新核对。',
      choices: [
        {
          id: 'J',
          label: 'J',
        },
        {
          id: 'K',
          label: 'K',
        },
        {
          id: 'L',
          label: 'L',
        },
        {
          id: 'M',
          label: 'M',
        },
      ],
      material: 'J语文书；K数学练习本；L数学书；M语文练习本。',
    },
    {
      id: 'bnu-upper-room-sort-review-pens',
      knowledge: 'bnu-upper-room-sort',
      prompt:
        '新四卡：J无橡皮彩笔、K有橡皮铅笔、L有橡皮彩笔、M无橡皮铅笔。按不带橡皮选完整编号。',
      rule: {
        kind: 'set',
        values: ['J', 'M'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '所求特征改变，检查全部卡。',
      choices: [
        {
          id: 'J',
          label: 'J',
        },
        {
          id: 'K',
          label: 'K',
        },
        {
          id: 'L',
          label: 'L',
        },
        {
          id: 'M',
          label: 'M',
        },
      ],
      material: 'J无橡皮彩笔；K有橡皮铅笔；L有橡皮彩笔；M无橡皮铅笔。',
    },
    {
      id: 'bnu-upper-room-sort-review-unknown',
      knowledge: 'bnu-upper-room-sort',
      prompt: '一张新能力卡没有写能否飞，只凭空白能确定它不能飞吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '未知不当明确否定。',
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
  ],
};

export const bnuClassificationLesson: Lesson = {
  id: 'bnu-upper-classification',
  textbookTitle: '整理与分类',
  title: '完整分类、更换标准与自主整理',
  page: 46,
  version: 1,
  status: 'available',
  goal: '明确分类对象与标准，完整分类后核对；换标准重新分，实际活动另记。',
  prerequisite: '能点数到10并按明确的属性识别物品。',
  parentTip:
    '对应46～47页。本站编号纸卡与条件原创，不复制原画。只整理已有安全物品，附页剪裁由成人协助或画卡替代，不强迫购置材料。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷46～47页已实际查看；来源不冒出版社托管，ISBN和印次未知。原书实做与本站纸卡分别记录。',
  },
  steps: [
    {
      title: '先确定对象与标准',
      text: '分类先明确这次分哪些对象和按什么属性。本站九卡用颜色、形状、大小文字注明属性，不只靠颜色辨别；编号只用来指认卡片，不表示数量。',
      activity: '实际准备原创纸卡，逐张核对条件。',
    },
    {
      title: '按颜色完整分三类',
      text: '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。按颜色红A/C/F、蓝B/D/H、黄E/G/I；每张只归一色，不漏不重复。',
      activity: '实际分好并独立核对总数。',
    },
    {
      title: '恢复再按形状',
      text: '先把九张卡恢复，按圆A/D/G、三角B/F/I、方C/E/H重分。对象相同而分组改变；不能只修改旧组标题。',
      activity: '实际恢复、重分、比较。',
    },
    {
      title: '两类与多条件',
      text: '恢复后按大小分，小A/E/F/H，大B/C/D/G/I。两类与三类都可能合理，先明确标准；若同时要求红且小，则只A/F，不能把红且大C混入。',
      activity: '实际分两类，再逐卡核对两个条件。',
    },
    {
      title: '完整检查与生活分类',
      text: '分好后检查所有对象、标准一致和总量不变。商品可按用途或种类分；垃圾图只用来观察标准，真实投放看所在地要求，不要求儿童操作真实垃圾或危险物品。',
      activity: '用安全纸卡说依据，请同伴核对。',
    },
    {
      title: '回看原书与自主发现',
      text: '原书46页颜色/形状与附页卡分别做；47页同类涂同色、按两类或三类说依据、商品和垃圾分类图及单元喜好/疑问分别完成。本站九卡不同于原图，不用本站答案冒原图作答。',
      activity: '完整原书任务、实际纸卡及未来计划分别记录。',
    },
  ],
  questions: [
    {
      id: 'bnu-upper-classification-q1',
      knowledge: 'bnu-upper-classification',
      prompt: '本站明确给出九张卡，先数全部卡有几张？',
      rule: {
        kind: 'number',
        value: 9,
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: 'A～I九张；类别数不当卡数。',
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q2',
      knowledge: 'bnu-upper-classification',
      prompt: '按颜色，完整选出红色卡。',
      rule: {
        kind: 'set',
        values: ['A', 'C', 'F'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q3',
      knowledge: 'bnu-upper-classification',
      prompt: '按颜色，完整选出蓝色卡。',
      rule: {
        kind: 'set',
        values: ['B', 'D', 'H'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q4',
      knowledge: 'bnu-upper-classification',
      prompt: '按颜色，完整选出黄色卡。',
      rule: {
        kind: 'set',
        values: ['E', 'G', 'I'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q5',
      knowledge: 'bnu-upper-classification',
      prompt: '恢复同一批卡，按形状，完整选出圆卡。',
      rule: {
        kind: 'set',
        values: ['A', 'D', 'G'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q6',
      knowledge: 'bnu-upper-classification',
      prompt: '按形状，完整选出三角卡。',
      rule: {
        kind: 'set',
        values: ['B', 'F', 'I'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q7',
      knowledge: 'bnu-upper-classification',
      prompt: '按形状，完整选出方卡。',
      rule: {
        kind: 'set',
        values: ['C', 'E', 'H'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q8',
      knowledge: 'bnu-upper-classification',
      prompt: '恢复同一批卡，按大小，完整选出小卡。',
      rule: {
        kind: 'set',
        values: ['A', 'E', 'F', 'H'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q9',
      knowledge: 'bnu-upper-classification',
      prompt: '按大小，完整选出大卡。',
      rule: {
        kind: 'set',
        values: ['B', 'C', 'D', 'G', 'I'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '检查每个编号是否满足本题标准，不能漏选或加入其它类。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q10',
      knowledge: 'bnu-upper-classification',
      prompt: '依次填红、蓝、黄三类的卡片数。',
      rule: {
        kind: 'steps',
        values: [3, 3, 3],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '三类完整覆盖九张。',
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q11',
      knowledge: 'bnu-upper-classification',
      prompt: '恢复后依次填圆、三角、方三类的卡片数。',
      rule: {
        kind: 'steps',
        values: [3, 3, 3],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '同一批卡按另一个属性重分。',
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q12',
      knowledge: 'bnu-upper-classification',
      prompt: '恢复后依次填小、大两类的卡片数。',
      rule: {
        kind: 'steps',
        values: [4, 5],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '类别变两类，但仍九张。',
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q13',
      knowledge: 'bnu-upper-classification',
      prompt:
        '按颜色分类时把A红圆与D蓝圆放同一类，只因都是圆，这符合本轮标准吗？',
      rule: {
        kind: 'choice',
        value: '不符合',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '本轮按颜色，不混形状标准。',
      choices: [
        {
          id: '符合',
          label: '符合',
        },
        {
          id: '不符合',
          label: '不符合',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q14',
      knowledge: 'bnu-upper-classification',
      prompt: '改为同时满足红色且小，完整选出编号。',
      rule: {
        kind: 'set',
        values: ['A', 'F'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '同时核对两条件，C是红但大，不能选。',
      choices: [
        {
          id: 'A',
          label: 'A',
        },
        {
          id: 'B',
          label: 'B',
        },
        {
          id: 'C',
          label: 'C',
        },
        {
          id: 'D',
          label: 'D',
        },
        {
          id: 'E',
          label: 'E',
        },
        {
          id: 'F',
          label: 'F',
        },
        {
          id: 'G',
          label: 'G',
        },
        {
          id: 'H',
          label: 'H',
        },
        {
          id: 'I',
          label: 'I',
        },
      ],
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q15',
      knowledge: 'bnu-upper-classification',
      prompt: '分别做颜色和形状两轮分类，恢复后还是同一批卡，一共几张？',
      rule: {
        kind: 'number',
        value: 9,
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '不是两轮数量相加，也不等于类别数。',
      material:
        '本站原创九张卡：A红圆小、B蓝三角大、C红方大、D蓝圆大、E黄方小、F红三角小、G黄圆大、H蓝方小、I黄三角大。红/蓝/黄是颜色；圆/三角/方是形状；大/小是本题明确的大小等级。',
    },
    {
      id: 'bnu-upper-classification-q16',
      knowledge: 'bnu-upper-classification',
      prompt:
        '同一批卡有人按颜色分、有人按形状分，各自说清标准且完整分好，可以都合理吗？',
      rule: {
        kind: 'choice',
        value: '可以',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '明确标准不同可以有不同合理分法。',
      choices: [
        {
          id: '可以',
          label: '可以',
        },
        {
          id: '不可以',
          label: '不可以',
        },
      ],
    },
    {
      id: 'bnu-upper-classification-q17',
      knowledge: 'bnu-upper-classification',
      prompt: '仅看教材垃圾桶示意图，能断定自己所在地每种垃圾的投放要求吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '现场说明和当地规则需另核；此处只学习按标准分类。',
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
      id: 'bnu-upper-classification-actual-color',
      knowledge: 'bnu-upper-classification',
      prompt:
        '实际制作或画出本站九张卡，按颜色完整分三类，核对不漏不重复；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-classification-actual-shape',
      knowledge: 'bnu-upper-classification',
      prompt:
        '恢复同一批九卡，实际按形状完整分三类，并比较组内对象的改变；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-classification-actual-size',
      knowledge: 'bnu-upper-classification',
      prompt:
        '再次恢复同一批九卡，按明确大小完整分两类，核对仍九张；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-classification-actual-own',
      knowledge: 'bnu-upper-classification',
      prompt:
        '实际选择一小批安全物品或纸卡，说清标准后完整分类，再换一个可用标准重分；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-classification-actual-book',
      knowledge: 'bnu-upper-classification',
      prompt:
        '实际完成46页颜色/形状与附页卡任务，47页同类涂同色、两类/三类、商品及垃圾图中分类依据；原书与本站原创分开，剪裁可成人协助或画卡替代，做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-classification-actual-explain',
      knowledge: 'bnu-upper-classification',
      prompt:
        '实际向同伴说明自己的标准，请对方检查每个对象，按真实反馈调整一次；未来打算不算已做。',
      rule: {
        kind: 'manual',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '只记录实际完成的活动，不由屏幕答对替代。',
    },
    {
      id: 'bnu-upper-classification-reflection-found',
      knowledge: 'bnu-upper-classification',
      prompt:
        '实际更换标准后发现了什么？说明喜欢的活动或还没解决的问题，不统一评分。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '开放记录correct:null；计划与已做分开。',
    },
    {
      id: 'bnu-upper-classification-reflection-plan',
      knowledge: 'bnu-upper-classification',
      prompt: '下一次准备分类什么、用什么标准？这是计划，与已做活动分开。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '开放记录correct:null；计划与已做分开。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-upper-classification-review-blue',
      knowledge: 'bnu-upper-classification',
      prompt: '新六卡改按颜色，只选完整蓝色卡编号。',
      rule: {
        kind: 'set',
        values: ['K', 'N'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '全部检查新属性。',
      choices: [
        {
          id: 'J',
          label: 'J',
        },
        {
          id: 'K',
          label: 'K',
        },
        {
          id: 'L',
          label: 'L',
        },
        {
          id: 'M',
          label: 'M',
        },
        {
          id: 'N',
          label: 'N',
        },
        {
          id: 'O',
          label: 'O',
        },
      ],
      material:
        '新六卡：J红圆小、K蓝圆大、L黄方小、M红方大、N蓝三角小、O黄三角大。',
    },
    {
      id: 'bnu-upper-classification-review-small',
      knowledge: 'bnu-upper-classification',
      prompt: '恢复新六卡，按大小，只选完整小卡编号。',
      rule: {
        kind: 'set',
        values: ['J', 'L', 'N'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '换标准重分。',
      choices: [
        {
          id: 'J',
          label: 'J',
        },
        {
          id: 'K',
          label: 'K',
        },
        {
          id: 'L',
          label: 'L',
        },
        {
          id: 'M',
          label: 'M',
        },
        {
          id: 'N',
          label: 'N',
        },
        {
          id: 'O',
          label: 'O',
        },
      ],
      material:
        '新六卡：J红圆小、K蓝圆大、L黄方小、M红方大、N蓝三角小、O黄三角大。',
    },
    {
      id: 'bnu-upper-classification-review-count',
      knowledge: 'bnu-upper-classification',
      prompt: '新六卡按圆、方、三角分类，依次填各类卡片数。',
      rule: {
        kind: 'steps',
        values: [2, 2, 2],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: '形状三类各两张，共六张。',
      material:
        '新六卡：J红圆小、K蓝圆大、L黄方小、M红方大、N蓝三角小、O黄三角大。',
    },
    {
      id: 'bnu-upper-classification-review-red-large',
      knowledge: 'bnu-upper-classification',
      prompt: '新六卡同时满足红色且大，完整选出编号。',
      rule: {
        kind: 'set',
        values: ['M'],
      },
      hint: '先读清对象、标准和编号，每张卡都要检查；换标准后重新分。',
      explanation: 'J红但小，不能选。',
      choices: [
        {
          id: 'J',
          label: 'J',
        },
        {
          id: 'K',
          label: 'K',
        },
        {
          id: 'L',
          label: 'L',
        },
        {
          id: 'M',
          label: 'M',
        },
        {
          id: 'N',
          label: 'N',
        },
        {
          id: 'O',
          label: 'O',
        },
      ],
      material:
        '新六卡：J红圆小、K蓝圆大、L黄方小、M红方大、N蓝三角小、O黄三角大。',
    },
  ],
};
