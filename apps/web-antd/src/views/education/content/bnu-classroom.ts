import type { Lesson } from '../learning/types';

export const bnuClassroomLesson: Lesson = {
  id: 'bnu-upper-classroom',
  textbookTitle: '介绍我的教室',
  title: '介绍教室、相对位置与座位定位',
  page: 40,
  version: 1,
  status: 'available',
  goal: '固定观察方向，结合排与排内位置定位，演练介绍、倾听与真实改进。',
  prerequisite: '能点数到3并理解第几个，不要求公开真实同伴资料。',
  parentTip:
    '对应40～42页。本站三排纸图原创；原书示例不冒真实教室。没有现场时用家中学习角或纸卡替代，分别记录，不阻塞通用课程。',
  review: {
    date: '2026-10-03',
    reviewer: '公开原书逐页阅读与原创任务核对',
    notes:
      '第三方0061印刷40～42页已实际查看；观察教室、位置、角色演练、开放日寻找与介绍改进。ISBN和印次未知，来源不冒出版社官方。',
  },
  steps: [
    {
      title: '观察与选择介绍对象',
      text: '先观察已有教室或家中安全学习角，选愿意介绍的物品。原书教室是示例，不表示你的环境也有相同设施；无法进教室可以画学习角纸图，分别记录替代与实地。',
      activity: '观察并列出物品，选出要介绍的对象，不必公开学校或同伴姓名。',
    },
    {
      title: '固定观察方向',
      text: '本站纸面教室上边是前、下边是后，所有座位面朝上边黑板。从坐在座位者面朝前的方向谈左右：左是图左、右是图右。上下指物体高低，前后指教室位置，不把图上方一律当物体上面。',
      activity: '用已有纸卡演示前后、左右及物体上下，先说观察方向。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      title: '排与第几个一起定位',
      text: '从靠近黑板的排数起，戊在第二排；再从该排左边数，戊是第二个。只说第二排还有丁、戊、己三个候选，不能唯一定位。人数和序位是不同所求。',
      activity: '实际摆三排纸卡，互相用排与排内位置找一个座位。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      title: '相邻位置与位置相对',
      text: '戊前面是乙、后面是辛、左边是丁、右边是己。丁右边是戊，而戊左边是丁；换参照对象要重新说。在最左边的丁，其左边没有本站图中座位，不猜一个新同伴。',
      activity: '用同一排两张卡交换介绍对象，再比较说法。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      title: '同伴介绍与角色演练',
      text: '一人介绍纸图物品或座位，另一人根据介绍寻找并复述；再交换角色。只说第几排若找不到，应补排内位置。面对面时两人的左右以各自身体为准，不因看起来在同侧就说同一只手。',
      activity:
        '实际双角色介绍、寻找、复述和修改，不强迫触摸身体或披露同伴信息。',
    },
    {
      title: '回看原书与实际改进',
      text: '回看40～42页，分别做物品观察、座位与周围、向同伴介绍困难、上下左右前后、角色扮演、开放日寻找与听后收获，再实际改进一次介绍。校园实景的外部方向不能从本站固定座位图推断；无现场条件可纸面替代。',
      activity: '原书任务与本站替代分别记录；倾听与实际改进后再确认。',
    },
  ],
  questions: [
    {
      id: 'bnu-upper-classroom-q1',
      knowledge: 'bnu-upper-classroom',
      prompt: '本站第二排丁、戊、己，只知道在第二排，有几个可能座位？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '同排三张候选；只给排号不能唯一定位。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q2',
      knowledge: 'bnu-upper-classroom',
      prompt: '本站所有人面向图上方黑板，戊从前往后在第几排？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '第一排甲乙丙，第二排丁戊己。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q3',
      knowledge: 'bnu-upper-classroom',
      prompt: '仍面朝图上方，戊在本排从左数第几个？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '本排顺序丁、戊、己。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q4',
      knowledge: 'bnu-upper-classroom',
      prompt: '按本站座位方向，戊前面相邻是谁？',
      rule: {
        kind: 'choice',
        value: '乙',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '前一排同列是乙。',
      choices: [
        {
          id: '乙',
          label: '乙',
        },
        {
          id: '辛',
          label: '辛',
        },
        {
          id: '丁',
          label: '丁',
        },
        {
          id: '己',
          label: '己',
        },
      ],
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q5',
      knowledge: 'bnu-upper-classroom',
      prompt: '按本站座位方向，戊后面相邻是谁？',
      rule: {
        kind: 'choice',
        value: '辛',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '后一排同列是辛。',
      choices: [
        {
          id: '乙',
          label: '乙',
        },
        {
          id: '辛',
          label: '辛',
        },
        {
          id: '丁',
          label: '丁',
        },
        {
          id: '己',
          label: '己',
        },
      ],
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q6',
      knowledge: 'bnu-upper-classroom',
      prompt: '按本站座位方向，戊左边相邻是谁？',
      rule: {
        kind: 'choice',
        value: '丁',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '同排左边是丁。',
      choices: [
        {
          id: '乙',
          label: '乙',
        },
        {
          id: '辛',
          label: '辛',
        },
        {
          id: '丁',
          label: '丁',
        },
        {
          id: '己',
          label: '己',
        },
      ],
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q7',
      knowledge: 'bnu-upper-classroom',
      prompt: '按本站座位方向，丁的右边相邻是谁？',
      rule: {
        kind: 'choice',
        value: '戊',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '换成丁作参照，右边是戊。',
      choices: [
        {
          id: '乙',
          label: '乙',
        },
        {
          id: '戊',
          label: '戊',
        },
        {
          id: '庚',
          label: '庚',
        },
      ],
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q8',
      knowledge: 'bnu-upper-classroom',
      prompt: '按本站座位方向，丁左边还有图中座位吗？',
      rule: {
        kind: 'choice',
        value: '没有',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '丁位于该排左边缘，不猜图外人物。',
      choices: [
        {
          id: '有',
          label: '有',
        },
        {
          id: '没有',
          label: '没有',
        },
      ],
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q9',
      knowledge: 'bnu-upper-classroom',
      prompt: '本站只说第2排，能唯一找到戊吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '还须说明本排从哪边数第几个。',
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
      visual: {
        kind: 'seat-grid',
        rows: [
          ['甲', '乙', '丙'],
          ['丁', '戊', '己'],
          ['庚', '辛', '壬'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-q10',
      knowledge: 'bnu-upper-classroom',
      prompt: '只看到原书示例教室有图书柜，就能认定自己的教室也有吗？',
      rule: {
        kind: 'choice',
        value: '不能认定',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '示例与实际环境分开，实际需观察。',
      choices: [
        {
          id: '能认定',
          label: '能认定',
        },
        {
          id: '不能认定',
          label: '不能认定',
        },
      ],
    },
    {
      id: 'bnu-upper-classroom-q11',
      knowledge: 'bnu-upper-classroom',
      prompt:
        '面对面的人分别举自己的右手，看起来在相反两侧，能据此认定其中一人举错了吗？',
      rule: {
        kind: 'choice',
        value: '不能',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '左右以各自身体现有方向判断，不凭画面同侧或异侧。',
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
      id: 'bnu-upper-classroom-q12',
      knowledge: 'bnu-upper-classroom',
      prompt: '虚构学习角说明钟在书架上方，此处上方主要指什么？',
      rule: {
        kind: 'choice',
        value: '高低位置',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '物体上下关系不等于座位前后或图上方。',
      choices: [
        {
          id: '高低位置',
          label: '高低位置',
        },
        {
          id: '座位排号',
          label: '座位排号',
        },
        {
          id: '一定在教室前面',
          label: '一定在教室前面',
        },
      ],
    },
    {
      id: 'bnu-upper-classroom-actual-observe',
      knowledge: 'bnu-upper-classroom',
      prompt:
        '实际观察已有教室或安全学习角，列出物品并选择介绍对象；说明实地或纸面替代，做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '只记录实际活动；屏幕回答不代替。',
    },
    {
      id: 'bnu-upper-classroom-actual-directions',
      knowledge: 'bnu-upper-classroom',
      prompt:
        '实际用安全纸卡分别演示上下、左右、前后，并先说清方向；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '只记录实际活动；屏幕回答不代替。',
    },
    {
      id: 'bnu-upper-classroom-actual-seat',
      knowledge: 'bnu-upper-classroom',
      prompt:
        '实际摆三排卡，用排号和排内位置定位，再只说排号比较；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '只记录实际活动；屏幕回答不代替。',
    },
    {
      id: 'bnu-upper-classroom-actual-relative',
      knowledge: 'bnu-upper-classroom',
      prompt: '实际互换两张相邻卡的参照对象，分别说明位置关系；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '只记录实际活动；屏幕回答不代替。',
    },
    {
      id: 'bnu-upper-classroom-actual-role',
      knowledge: 'bnu-upper-classroom',
      prompt:
        '实际与同伴轮流介绍、寻找并复述，记录一次发现的问题；做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '只记录实际活动；屏幕回答不代替。',
    },
    {
      id: 'bnu-upper-classroom-actual-improve',
      knowledge: 'bnu-upper-classroom',
      prompt: '根据真实反馈实际修改介绍并让对方再找一次；未来打算不算已做。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '只记录实际活动；屏幕回答不代替。',
    },
    {
      id: 'bnu-upper-classroom-actual-book',
      knowledge: 'bnu-upper-classroom',
      prompt:
        '实际回看40～42页，完成观察物品、座位周围、介绍困难、方向、角色演练、寻找听后收获及改进；原书与纸面替代分开，做过再确认。',
      rule: {
        kind: 'manual',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '只记录实际活动；屏幕回答不代替。',
    },
    {
      id: 'bnu-upper-classroom-reflection-find',
      knowledge: 'bnu-upper-classroom',
      prompt: '这次哪一句介绍帮助对方找到对象？记录实际原话或尚未解决的问题。',
      rule: {
        kind: 'reflection',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '开放记录不统一评分，不冒实际已完成。',
    },
    {
      id: 'bnu-upper-classroom-reflection-relative',
      knowledge: 'bnu-upper-classroom',
      prompt: '今天怎样核对观察方向和参照对象？记录实际做法，不自动评星。',
      rule: {
        kind: 'reflection',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '开放记录不统一评分，不冒实际已完成。',
    },
    {
      id: 'bnu-upper-classroom-reflection-plan',
      knowledge: 'bnu-upper-classroom',
      prompt: '下一次准备怎样改进？这是未来计划，与已经完成的介绍分开。',
      rule: {
        kind: 'reflection',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '开放记录不统一评分，不冒实际已完成。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-upper-classroom-review-row',
      knowledge: 'bnu-upper-classroom',
      prompt: '新座位图从前往后数，柳在第几排？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '柳在第三排；条件与主课目标不同。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['松', '竹', '梅'],
          ['兰', '菊', '荷'],
          ['桃', '柳', '杏'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-review-left',
      knowledge: 'bnu-upper-classroom',
      prompt: '新图所有人面朝图上方，荷左边相邻是谁？',
      rule: {
        kind: 'choice',
        value: '菊',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '同排兰菊荷，荷左邻菊。',
      choices: [
        {
          id: '兰',
          label: '兰',
        },
        {
          id: '菊',
          label: '菊',
        },
        {
          id: '梅',
          label: '梅',
        },
        {
          id: '杏',
          label: '杏',
        },
      ],
      visual: {
        kind: 'seat-grid',
        rows: [
          ['松', '竹', '梅'],
          ['兰', '菊', '荷'],
          ['桃', '柳', '杏'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-review-edge',
      knowledge: 'bnu-upper-classroom',
      prompt: '新图所有人面朝图上方，杏右边还有图中座位吗？',
      rule: {
        kind: 'choice',
        value: '没有',
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '杏在右边缘，不猜图外座位。',
      choices: [
        {
          id: '有',
          label: '有',
        },
        {
          id: '没有',
          label: '没有',
        },
      ],
      visual: {
        kind: 'seat-grid',
        rows: [
          ['松', '竹', '梅'],
          ['兰', '菊', '荷'],
          ['桃', '柳', '杏'],
        ],
      },
    },
    {
      id: 'bnu-upper-classroom-review-column',
      knowledge: 'bnu-upper-classroom',
      prompt: '新图从前往后在第二排、从右数第三个，是本排从左数第几个？',
      rule: {
        kind: 'number',
        value: 1,
      },
      hint: '先明确观察方向、所指对象和已经给出的条件。',
      explanation: '三列从右第三就是左第一。',
      visual: {
        kind: 'seat-grid',
        rows: [
          ['松', '竹', '梅'],
          ['兰', '菊', '荷'],
          ['桃', '柳', '杏'],
        ],
      },
    },
  ],
};
