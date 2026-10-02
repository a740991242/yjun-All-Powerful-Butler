import type { CardGameVisual, Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-take-ten';
function game(mode: CardGameVisual['mode']): CardGameVisual {
  return {
    kind: 'card-game',
    mode,
    decks: [
      [1, 4, 8, 3, 6, 2, 9, 5, 7],
      [9, 2, 1, 7, 4, 6, 3, 8, 5],
    ],
  };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const left = review ? 7 : 4;
  return [
    {
      id: `${prefix}-pair`,
      knowledge: `${id}-pair`,
      prompt: `两张牌玩法中，一张是${left}，另一张是几才能收牌？`,
      rule: { kind: 'number', value: 10 - left },
      hint: '所选两张牌相加应当是10。',
      explanation: `${left} + ${10 - left} = 10。`,
    },
    {
      id: `${prefix}-ace`,
      knowledge: `${id}-ace`,
      prompt: '一张牌写A，它表示1。要和A配成10，另一张要是几？',
      rule: { kind: 'number', value: 9 },
      hint: 'A表示1，不是0或10。',
      explanation: '1 + 9 = 10。',
    },
    {
      id: `${prefix}-interval`,
      knowledge: `${id}-interval`,
      prompt: review
        ? '桌面从左到右是2、7、4、5、8。选最左的2和最右的8，应该收走多少张？'
        : '桌面从左到右是4、2、3、6。选最左的4和最右的6，应该收走多少张？',
      rule: { kind: 'number', value: review ? 5 : 4 },
      hint: '收牌包括两个端点以及它们中间的所有牌；算和时只加所选的牌。',
      explanation: review
        ? '2 + 8 = 10，中间三张也收走，共5张。'
        : '4 + 6 = 10，中间的2和3也收走，共4张，不是只收两张。',
    },
    {
      id: `${prefix}-outside`,
      knowledge: `${id}-outside`,
      prompt: review
        ? '桌面是9、3、2、7、1。选3和7，最左的9和最右的1也要收走吗？'
        : '桌面是8、4、3、6、2。选4和6，最左的8和最右的2也要收走吗？',
      choices: [
        { id: 'no', label: '不要，它们在所选范围外' },
        { id: 'yes', label: '要，桌面全部收走' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '从最左所选牌走到最右所选牌，范围外的牌留在桌上。',
      explanation: '只收所选牌及它们之间的牌，不能把范围外的牌一起收走。',
    },
    {
      id: `${prefix}-multi`,
      knowledge: `${id}-multi`,
      prompt: review
        ? '多张牌玩法选1、4、5，这三个数的和是多少？'
        : '多张牌玩法选1、1、8，这三个数的和是多少？',
      rule: { kind: 'number', value: 10 },
      hint: '逐个相加；两副牌中可以有相同数字，但必须是不同的牌。',
      explanation: review
        ? '1 + 4 + 5 = 10。'
        : '1 + 1 + 8 = 10，两张1是两张不同的牌。',
    },
    {
      id: `${prefix}-mode`,
      knowledge: `${id}-mode`,
      prompt: '两张牌玩法中可以一次选1、1、8三张来收牌吗？',
      choices: [
        { id: 'no', label: '不可以，这个玩法规定选两张' },
        { id: 'yes', label: '可以，只要和为10' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '先看本次约定是两张玩法还是多张玩法。',
      explanation: '三个数和为10，但不符合两张玩法；多张玩法才允许这样选。',
    },
    {
      id: `${prefix}-score`,
      knowledge: `${id}-score`,
      prompt: review
        ? '玩家1收了8张，玩家2收了7张，谁收得多？'
        : '玩家1收了6张，玩家2收了9张，谁收得多？',
      choices: [
        { id: 'one', label: '玩家1' },
        { id: 'two', label: '玩家2' },
      ],
      rule: { kind: 'choice', value: review ? 'one' : 'two' },
      hint: '比较收牌张数，不比较牌面数字的总和。',
      explanation: review ? '8比7多，玩家1收得多。' : '9比6多，玩家2收得多。',
    },
  ];
}
function manual(
  key: string,
  prompt: string,
  visual?: CardGameVisual,
): Question {
  return {
    id: `${id}-manual-${key}`,
    knowledge: `${id}-physical-${key}`,
    prompt,
    ...(visual ? { visual } : {}),
    rule: { kind: 'manual' },
    hint: '先实际完成活动，再由家长确认；游戏分数不自动生成答对记录。',
    explanation:
      '查看孩子是否说出算式、遵守收牌范围并能解释；人工确认不代表客观题独立答对。',
  };
}
export const sujiaoTakeTenLesson: Lesson = {
  id,
  textbookTitle: '抢10',
  title: '抢10：翻牌、凑十与收牌',
  page: 75,
  status: 'available',
  version: 1,
  goal: '用两张或多张牌凑十，区分参与相加的牌与收走范围，比较收牌张数，并能解释规则。',
  prerequisite: '会10以内加法；两人各准备A～9九张数字牌，A表示1。',
  parentTip:
    '先约定两张或多张玩法。先答出的人由参与者协商认定，不强制速度比赛。示例牌序原创，重新玩保留本副牌顺序便于复盘；纸牌活动分别打乱两副牌。',
  steps: [
    {
      title: '准备两副数字牌',
      text: '每人准备A～9各一张，共九张，A表示1。分别打乱自己的牌，扣在桌上。两人轮流翻一张，把翻开的牌接到桌面一行的末尾。',
      activity: '核对每副都有1～9，没有重复和缺牌，再分别打乱、扣好。',
    },
    {
      title: '选两张凑成10',
      text: '两张玩法只选两张。发现所选两个数和为10时，说出算式和得数，先说出的人收牌。没有合适的两张就继续轮流翻牌。',
      activity: '用两张牌举例说出凑十算式，再试一个不能凑十的例子。',
    },
    {
      title: '中间的牌也收走',
      text: '从最左所选牌到最右所选牌，包括两端和中间所有牌，一起收走。只有所选的数字参与凑十，中间牌不需要一起加成10。范围外的牌留在桌面。',
      activity: '摆出4、2、3、6，选4和6，说出4+6=10，再实际收走四张牌。',
    },
    {
      title: '换成多张玩法',
      text: '约定多张玩法后，可以选两张或更多张，只要所选数字的和为10。两副牌里数字会重复，例如两张不同的1可以一起用。仍收走最左和最右所选牌之间的全部牌。',
      activity: '摆出两张1和一张8，说出1+1+8=10，解释为何这是多张玩法。',
    },
    {
      title: '比较、复盘和设计',
      text: '牌翻完后，把还能凑十的组合收完，再比较各人收了多少张。平台示例结束时剩余不能凑十的牌不计入双方，先明确这个约定。回顾漏掉的组合或收牌范围，再设计一个自己的规则并请同伴复述。',
      activity:
        '实际比一比收牌张数，说出一个改进方法；自己设计游戏，讲清准备、翻牌、收牌和结束规则。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'pair',
      '和家长玩两张牌抢10。先说算式，选择先答出的玩家，再收牌；完成后说明中间牌为什么也要拿走。',
      game('pair'),
    ),
    manual(
      'multi',
      '和家长玩多张牌抢10。尝试用三张以上凑十，说出算式，按范围收牌，完成后比较张数。',
      game('multi'),
    ),
    manual(
      'paper',
      '实际准备两副A～9纸牌，分别打乱并轮流翻牌；口述凑十、收走范围，比较最后张数。',
    ),
    manual(
      'design',
      '设计自己的数字牌游戏，讲清规则，让家长复述并试玩；说说原规则哪里要改进。',
    ),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版正文核验与原创教学检查',
    notes: `依据ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷第75～77页（${source.preview}）已核验玩法。牌序、题目和界面原创，不复制教材图。平台明确剩余牌不计分的结束约定，操作日志可回放，计分不自动确认实际活动或掌握；本课不代表全册完成。`,
  },
};
