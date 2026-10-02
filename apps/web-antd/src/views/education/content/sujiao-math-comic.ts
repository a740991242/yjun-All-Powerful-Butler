import type { Lesson, Question } from '../learning/types';

import { mathStoryFacts } from '../learning/math-story';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-math-comic';
function tasks(review: boolean): Question[] {
  const variant = review ? 'review' : 'main';
  const facts = mathStoryFacts(variant);
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    hint: '按画面顺序找已知数量、变化和单位，分清编号与数量；不要编造缺少的条件。',
  });
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    rule: { kind: 'number', value },
    explanation,
    visual: { kind: 'math-story', variant },
  });
  const choice = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    value: string,
    explanation: string,
    withStory = false,
  ): Question => ({
    ...common(key),
    prompt,
    choices,
    rule: { kind: 'choice', value },
    explanation,
    ...(withStory ? { visual: { kind: 'math-story' as const, variant } } : {}),
  });
  return [
    number(
      'initial',
      '第1幅中，这个书架开始有多少本书？不要把书架编号当本数。',
      facts.initial,
      `编号${facts.shelf}用来区分书架，记录的本数是${facts.initial}本。`,
    ),
    number(
      'after-borrow',
      '只看第1、2幅，借出后、归还前，这个书架还剩多少本书？',
      facts.initial - facts.borrowed,
      `借出使书架本数减少，${facts.initial}－${facts.borrowed}＝${facts.initial - facts.borrowed}。这是中间结果，还没有计入归还。`,
    ),
    number(
      'after-return',
      '读完第1～3幅，归还后这个书架有多少本书？',
      facts.initial - facts.borrowed + facts.returned,
      `先借出，再归还：${facts.initial}－${facts.borrowed}＋${facts.returned}＝${facts.initial - facts.borrowed + facts.returned}，归还使书架本数增加。`,
    ),
    number(
      'on-loan',
      '这次借出的书中，归还后还有多少本尚未归还？',
      facts.borrowed - facts.returned,
      `借出${facts.borrowed}本，归还其中${facts.returned}本，尚未归还${facts.borrowed - facts.returned}本；不是用原书架总数减归还数。`,
    ),
    choice(
      'identifier',
      `故事中的书架编号${facts.shelf}说明什么？`,
      [
        { id: 'identity', label: '区分这是哪个书架，不代表书架有多少本书' },
        { id: 'count', label: `一定有${facts.shelf}本书` },
      ],
      'identity',
      '编号和数量用途不同，不能将所有出现的数字直接放进算式。',
      true,
    ),
    {
      ...common('relevant'),
      prompt: '想求归还后书架的本数，应使用哪些数量信息？选出全部需要的信息。',
      visual: { kind: 'math-story', variant },
      choices: [
        { id: 'initial', label: `原有${facts.initial}本` },
        { id: 'borrowed', label: `借出${facts.borrowed}本` },
        { id: 'returned', label: `归还${facts.returned}本` },
        { id: 'shelf', label: `书架编号${facts.shelf}` },
      ],
      rule: { kind: 'set', values: ['initial', 'borrowed', 'returned'] },
      explanation:
        '用原有本数和两次变化，编号不参与本数运算；归还不能漏记或重复记。',
    },
    choice(
      'sequence',
      review
        ? '另画一份“借书后归还”的连环画，哪种安排能看清发生先后？'
        : '想画这份借书故事，哪种安排能看清发生先后？',
      [
        {
          id: 'ordered',
          label: '先画原有，再画借出，接着画归还，最后核对记录',
        },
        { id: 'mixed', label: '只画最后结果，不说明原有和发生过的变化' },
      ],
      'ordered',
      '画面可以多少幅不同，但应让读者看清开始、变化与结果；本站四幅是原创示例，不要求所有故事都四幅。',
    ),
    choice(
      'units',
      review
        ? '另一位小朋友只写“取走7”，读者不知道取走什么。怎样改清楚？'
        : '小朋友只写“借走8”，读者不知道借了什么。怎样改清楚？',
      [
        { id: 'clarify', label: '补上对象和单位，并让文字与画面一致' },
        { id: 'decorate', label: '只把数字涂得更漂亮，不补任何说明' },
      ],
      'clarify',
      '数学信息要能解释数量和变化，装饰不能替代清楚的记录。',
    ),
    choice(
      'check',
      review
        ? '同伴读新故事时说“我分不清哪幅先发生”。怎样提出有用的建议？'
        : '同伴说“我不知道归还的书是哪次借出的”。怎样提出有用的建议？',
      [
        {
          id: 'specific',
          label: '指出不清楚的地方，建议补充条件或画面顺序，再一起核对',
        },
        { id: 'force', label: '要求照抄自己的故事，并给所有作品同一个答案' },
      ],
      'specific',
      '交流是帮助故事表达准确；可以有不同题材、画法和标题，不按美术水平或照抄程度评分。',
    ),
    choice(
      'unknown',
      review
        ? '另一个新故事只说原有35本、借出7本，没有说明是否归还或归还几本，能唯一确定最终书架本数吗？'
        : '另一个新故事只说原有24本、借出8本，没有说明是否归还或归还几本，能唯一确定最终书架本数吗？',
      [
        { id: 'ask', label: '不能，先补充归还情况；未说明不等于归还0本' },
        { id: 'zero', label: '能，所有没有写的数量都当0' },
      ],
      'ask',
      '这是独立的新场景，不能套用示例的归还量；缺少条件不编造唯一结果。',
    ),
  ];
}
export const sujiaoMathComicDraft: Lesson = {
  id,
  title: '数学连环画：找信息、画故事与交流修改',
  textbookTitle: '数学连环画',
  page: 85,
  status: 'preparing',
  version: 1,
  goal: '从生活故事中找数学信息，分清编号和数量，按顺序画原创连环画，交流、核对并修改自己的作品。',
  prerequisite:
    '会读两位数，能计算两位数加减一位数；准备纸、笔或安全图形纸片，可以请家长帮读题。',
  parentTip:
    '已实际读85～87页活动范围。本站借书情节与图均原创；图标仅示意，数量按文字。故事、标题、画法与建议多样，真实绘画及交流分别人工确认，不把计算通过当创作完成，不要求上传孩子作品或记录真实姓名。',
  steps: [
    {
      title: '读故事，找数量与用途',
      text: '示例第1幅有12号书架和24本书。12是编号，24是本数；两者都用数字，却不能一起算本数。再找借出8本、归还其中3本和先后顺序。图标仅示意，不能数图标当真实本数。',
      visual: { kind: 'math-story', variant: 'main' },
      activity: '指着四幅图说发生了什么，指出每个数字的对象与单位。',
    },
    {
      title: '顺着变化核对',
      text: '借出后，24－8＝16本还在书架上。归还后，16＋3＝19本。借出的8本中归还3本，还有5本未还；19与5合起来仍是原有24本。各问法所用范围不同。没有说明是否归还的新故事，不能自行当作归还0本。',
      activity:
        '用纸卡或文字分别表示书架与借出部分，核对每次变化，不重复计数。',
    },
    {
      title: '选一个自己的数学故事',
      text: '可以从整理物品、比较数量、拼图或不同位置观察中选一件事，先口述发生了什么和用到了什么数学知识。真实经历如实记录；自己编的示例标明想象。不要写真实姓名、住址或其他个人资料。不是所有数学故事都要列加减算式。',
      activity:
        '选择自己的题材，写下对象、已知信息、变化或观察以及想问的问题。',
    },
    {
      title: '规划、绘画与说明',
      text: '先想先画什么、再画什么，要分几幅，每幅人物说什么。标清对象和单位，给人物代号，给故事起一个名字。四幅只是本站示例，并非唯一格式；编号、数量、画面和顺序要能对应，不强求美术效果。',
      activity:
        '在纸上画出自己的数学故事，配上说明和标题；暂时没画就记录待做。',
    },
    {
      title: '交流修改与故事会',
      text: '邀请家人或同伴阅读，问他们找到了哪些数学信息、是否看清顺序。针对具体不清楚的地方提出建议，核对数据并修改。再讲自己的故事，听别人的故事，讨论数学问题。可以有不同题材和标题，不用统一模板替代真实作品；反思收获和待改进之处。',
      activity:
        '实际分享一次作品，记录一条具体建议和改动，最后说出自己的发现。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际口述一件自己的生活数学故事或标明原创想象的示例，说明所用的数学知识；不记录个人身份信息。',
      '实际在纸上规划每幅内容和先后，写出对象、单位、人物代号与标题，不要求所有故事固定四幅。',
      '实际画出自己的连环画并配说明；核对画面、文字和数学信息一致，网页计算答对不能替代此项。',
      '实际邀请家人或同伴阅读和交流，记录一条具体建议，并对作品作修改或说明为何保留原画法。',
      '实际讲述修改后的故事，听一份同伴或家人的数学故事，讨论其中可回答的问题和还缺少的条件。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '只有真实做过此项才人工确认，尚未进行可暂时跳过。',
      explanation:
        '题目正确不自动确认纸面创作、交流或分享；真实作品不要求唯一画法。',
    })),
    ...[
      '记录自己的故事标题、数学信息和还想问的问题；如果作品还没有做完，请如实写待做。',
      '交流后你修改了什么，为什么？记录一项收获或下次想改进的地方，不编造已经发生的交流。',
    ].map((prompt, index): Question => ({
      id: `${id}-reflection-${index}`,
      knowledge: `${id}-reflection-${index}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '保留自己的真实想法，没有标准作品或唯一答案。',
      explanation: '开放表达保留原话、correct为null，不评分也不替代人工任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '85～87页活动范围与原创故事核验',
    notes: `实际读ISBN ${source.isbn}印刷85～87页，按生活数学故事、规划、绘画、交流修改和反思范围原创；复习更改数量和编号，不复制原书图文，不据此宣称整册或全年完成。`,
  },
};
