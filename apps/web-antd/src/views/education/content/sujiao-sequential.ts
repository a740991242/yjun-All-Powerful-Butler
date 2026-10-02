import type { Lesson, Question } from '../learning/types';

export const sujiaoSequentialSources = {
  checkedAt: '2026-10-01',
  pages: [
    'http://app.xxsx.cn/resources-detail/38168/63',
    'http://app.xxsx.cn/resources-detail/38169/63',
  ],
} as const;

type Operation = '+' | '-';
type Example = [number, Operation, number, Operation, number];

function tasks(review: boolean): Question[] {
  const id = 'sj-upper-sequential-arithmetic';
  const examples: Example[] = review
    ? [
        [1, '+', 4, '+', 2],
        [9, '-', 2, '-', 4],
        [8, '-', 3, '+', 1],
        [3, '+', 5, '-', 2],
      ]
    : [
        [2, '+', 3, '+', 1],
        [9, '-', 4, '-', 2],
        [6, '-', 2, '+', 3],
        [2, '+', 5, '-', 3],
      ];
  const questions = examples.map(
    ([start, first, a, second, b], index): Question => {
      const middle = first === '+' ? start + a : start - a;
      const end = second === '+' ? middle + b : middle - b;
      return {
        id: `${id}-${review ? 'r' : 'q'}-expression-${index}`,
        knowledge: `${id}-expression-${index}`,
        prompt: `${start} ${first} ${a} ${second} ${b}：从左往右算，依次填第一次计算后的数量、第二次计算后的数量。`,
        visual: { kind: 'number-line', minimum: 0, maximum: 9, value: start },
        rule: { kind: 'steps', values: [middle, end] },
        hint: '先用前两个数计算，再用得到的数量做第二次变化；这两个空填变化后的数量，不填起点。',
        explanation: `先算${start} ${first} ${a} = ${middle}，再算${middle} ${second} ${b} = ${end}。`,
      };
    },
  );
  return [
    ...questions,
    {
      id: `${id}-${review ? 'r' : 'q'}-story-add`,
      knowledge: `${id}-story-add`,
      prompt: review
        ? '盒里先有3张卡，先放入2张，再放入3张。依次填第一次放入后、第二次放入后的张数。'
        : '盒里先有1张卡，先放入3张，再放入2张。依次填第一次放入后、第二次放入后的张数。',
      rule: { kind: 'steps', values: review ? [5, 8] : [4, 6] },
      hint: '每次都从盒里当前的数量接着添，不把原来数量重复加一次。',
      explanation: review ? '3 + 2 = 5，5 + 3 = 8。' : '1 + 3 = 4，4 + 2 = 6。',
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-story-mixed`,
      knowledge: `${id}-story-mixed`,
      prompt: review
        ? '盒里有7块积木，拿出4块，再放回2块。依次填写两次变化后的块数。'
        : '盒里有5块积木，放入3块，再拿出2块。依次填写两次变化后的块数。',
      rule: { kind: 'steps', values: review ? [3, 5] : [8, 6] },
      hint: '先弄清每次是添上还是拿走，再按发生顺序计算。',
      explanation: review ? '7 - 4 = 3，3 + 2 = 5。' : '5 + 3 = 8，8 - 2 = 6。',
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-meaning`,
      knowledge: `${id}-current-quantity`,
      prompt: review
        ? '8 - 2 + 1中，第二次计算应从哪个数量开始？'
        : '3 + 2 - 1中，第二次计算应从哪个数量开始？',
      choices: review
        ? [
            { id: 'original', label: '原来的8' },
            { id: 'middle', label: '第一次计算得到的6' },
          ]
        : [
            { id: 'original', label: '原来的3' },
            { id: 'middle', label: '第一次计算得到的5' },
          ],
      rule: { kind: 'choice', value: 'middle' },
      hint: '第一次变化已经发生，第二次处理的是变化后的数量。',
      explanation: '用第一次计算的结果继续算，不能每次都回到原来的数量。',
    },
  ];
}

export const sujiaoSequentialDraft: Lesson = {
  id: 'sj-upper-sequential-arithmetic',
  textbookTitle: '连加、连减与加减混合',
  title: '两次变化：先算一步，再接着算',
  page: 46,
  status: 'preparing',
  version: 1,
  goal: '理解连续两次数量变化，按从左到右计算连加、连减和加减混合，并说明中间数量。',
  prerequisite: '认识0～9及9以内加减法；准备9块积木、两个盒子和纸笔。',
  parentTip:
    '每次变化都在当前数量上进行。先让孩子摆物说明，再写算式；不以两个数字答对代替实际操作。',
  steps: [
    {
      title: '连续添两次',
      text: '先摆2块，添3块变成5块，再添1块变成6块。2 + 3 + 1先算2 + 3，再用5加1。三个部分只各数一次。',
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: 2 },
      activity: '按顺序实际添两次，每次都停下来报当前数量。',
    },
    {
      title: '连续拿走两次',
      text: '先有9块，拿走4块剩5块，再拿走2块剩3块。9 - 4 - 2先算9 - 4，再从剩下的5块拿走2块。不能把4 - 2当作第一步。',
      activity: '实际分两次拿走，指出每次拿走与剩下的数量。',
    },
    {
      title: '添上和拿走可以接着发生',
      text: '6 - 2 + 3先拿走2块剩4块，再添3块到7块。2 + 5 - 3先添到7块，再拿走3块剩4块。每一步看清符号，按从左到右计算。',
      activity: '分别摆一次先拿后添、先添后拿，写下中间结果。',
    },
    {
      title: '讲清过程，再写算式',
      text: '讲清原来多少、第一次发生什么、第二次发生什么、最后问什么。用数线时从原来数量出发，加法向较大的数走，减法向较小的数走；中间数量是第二次变化的起点。',
      activity:
        '自己讲一个两次变化的故事，用积木验证，保证所有数量都在0～9范围内。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-upper-sequential-arithmetic-manual-physical',
      knowledge: 'sj-upper-sequential-arithmetic-physical',
      prompt:
        '实际摆积木演示连加、连减各一次。每次变化后停下来，指出并说出当前数量，请家长查看。',
      rule: { kind: 'manual' },
      hint: '第二次操作从第一次操作后的积木继续。',
      explanation: '实际操作与口述单独人工确认。',
    },
    {
      id: 'sj-upper-sequential-arithmetic-manual-story',
      knowledge: 'sj-upper-sequential-arithmetic-story',
      prompt:
        '原创一个先添后拿或先拿后添的故事，摆物解释，并在纸上写出算式与中间结果，请家长查看。',
      rule: { kind: 'manual' },
      hint: '数量和故事要对应，全部数量保持0～9。',
      explanation: '故事、书写与表达人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoSequentialSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据印刷第46～47页：${sujiaoSequentialSources.pages.join('；')}。原创数量、故事及数线；同版第48～50页也已实际查看，其中算式整理、横竖求和、队列活动由独立整理课包承接。本课不声称完整单元；2024年7月第1版、2025年7月第2次印刷身份已核验，正式课包另行注册。`,
  },
};
