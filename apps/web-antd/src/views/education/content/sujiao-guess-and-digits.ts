import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-guess-and-digits';
function tasks(review: boolean): Question[] {
  const answer = review ? 64 : 43;
  const last = review ? 70 : 50;
  const lower = review ? 40 : 30;
  const narrow = review ? 60 : 40;
  const upper = review ? 80 : 60;
  const ones = review ? 7 : 5;
  const tens = review ? 6 : 5;
  const onesValues = Array.from({ length: 10 }, (_, i) => i * 10 + ones);
  const tensValues = Array.from({ length: 10 }, (_, i) => tens * 10 + i);
  const zeroValues = Array.from({ length: 9 }, (_, i) => (i + 1) * 10);
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const set = (
    key: string,
    prompt: string,
    values: number[],
    decoys: number[],
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    choices: [...values, ...decoys]
      .toSorted((a, b) => a - b)
      .map((n) => ({ id: String(n), label: String(n) })),
    rule: { kind: 'set', values: values.map(String) },
    hint: '符合本次范围和全部条件的都选，不漏选；不把一个例子当成全部。',
    explanation,
  });
  return [
    set(
      'first',
      `未知整数在1～99内。猜${lower}得到“少了”，猜${upper}得到“多了”。以下卡片中，哪些数仍可能？全部选出。`,
      [lower + 1, answer, upper - 1],
      [lower, upper],
      `可在${lower + 1}～${upper - 1}，两端排除；这些卡片是部分候选，不是全范围。`,
    ),
    {
      ...common('next'),
      prompt: `同一未知整数，已有大于${lower}、小于${upper}线索，又猜${narrow}得到“少了”。哪种处理正确？`,
      choices: [
        {
          id: 'keep',
          label: `保留所有线索，可在${narrow + 1}～${upper - 1}，还没确定唯一数。`,
        },
        { id: 'forget', label: `忘掉先前线索，只要大于${narrow}都可以。` },
      ],
      rule: { kind: 'choice', value: 'keep' },
      hint: '新回应缩小范围，不能删除先前仍有效的上界。',
      explanation: `范围缩小到${narrow + 1}～${upper - 1}，不是已经猜中。`,
    },
    set(
      'narrow',
      `已知大于${narrow}、小于${upper}，再猜${last}得到“多了”。以下卡片哪些还可能？`,
      [narrow + 1, answer, last - 1],
      [narrow, last],
      `同时满足大于${narrow}和小于${last}，不含等号。`,
    ),
    {
      ...common('answer'),
      prompt: `一个整数大于${narrow}、小于${last}，又明确知道个位是${answer % 10}。它是多少？`,
      rule: { kind: 'number', value: answer },
      hint: '在最后范围里核对个位，三条条件同时满足。',
      explanation: `十位是${Math.floor(answer / 10)}，个位${answer % 10}，所以是${answer}；得到足够条件前仍应保留多个候选。`,
    },
    set(
      'ones-all',
      `在1～99中找出所有个位是${ones}的数，全部选出。这里已列出所有符合者与少量不符合卡片。`,
      onesValues,
      [0, ones + 1, ones * 10],
      `全部是${onesValues.join('、')}；${ones}也是范围内的一位数，不能漏掉。`,
    ),
    set(
      'tens-all',
      `在1～99中找出所有十位是${tens}的数，全部选出。这里已列出所有符合者与少量不符合卡片。`,
      tensValues,
      [tens, tens * 10 - 1, (tens + 1) * 10],
      `全部是${tensValues.join('、')}；一位数${tens}不具有十位${tens}，个位0可以。`,
    ),
    set(
      'zero-all',
      '在1～99中找出所有个位是0的数，全部选出。',
      zeroValues,
      [0, 1, 99],
      '10、20、30、40、50、60、70、80、90，共9个；0不在1～99范围。',
    ),
    {
      ...common('ones-count'),
      prompt: `1～99内，个位是${ones}的数共有几个？从一位数到九十几检查不遗漏。`,
      rule: { kind: 'number', value: 10 },
      hint: '包括一位数，再数十几至九十几，不能只数两位数。',
      explanation: `${onesValues.join('、')}共10个。`,
    },
    {
      ...common('zero-count'),
      prompt: '1～99内，个位是0的数共有几个？',
      rule: { kind: 'number', value: 9 },
      hint: '从10开始每次多10，到90，不包括0与100。',
      explanation: '10至90共9个，不把0或100扩大到本题范围。',
    },
    {
      ...common('feedback'),
      prompt: '猜数得到“少了”，这次猜测应怎样记录？',
      choices: [
        {
          id: 'useful',
          label:
            '保留猜测和回应，它说明未知数更大；这次没有猜中，但线索仍有用。',
        },
        { id: 'erase', label: '没有猜中就是无用错误，应删掉记录。' },
      ],
      rule: { kind: 'choice', value: 'useful' },
      hint: '实际游戏猜测和判断线索的客观练习不同。',
      explanation:
        '未猜中不当作无用记录；需要核对和合并反馈，不自动评分真实猜数表现。',
    },
  ];
}
export const sujiaoGuessAndDigitsDraft: Lesson = {
  id,
  title: '猜数与数位筛选：保留线索、找全候选',
  textbookTitle: '练习六·猜数与数位分类',
  page: 51,
  status: 'preparing',
  version: 1,
  goal: '合并多轮猜数反馈，区分可能范围与唯一结果；在1～99找全个位、十位条件的数，保留一位数及正确边界。',
  prerequisite:
    '已会认读两位数、数位与严格大小比较；准备纸笔和1～99数表或数字卡。',
  parentTip: `依据ISBN ${source.isbn}已读印刷51～52页多轮猜数与数位筛选范围。反馈场景、数值和卡片原创，不复制原兔子情境。猜测未中不等于没有学习，所有有效线索合并；题目随机出现也独立提供完整条件，不依赖先前作答。筛选范围是1～99，区别只找两位数，0和100都排除。真实轮流猜数、纸笔列全与口述独立人工确认，不能由固定示例答题认定游戏实际完成。`,
  steps: [
    {
      title: '第一条线索不等于猜中',
      text: '未知整数在1～99，猜30回应“少了”，只知道它大于30；再猜60回应“多了”，合并为31～59。43可以，31和59也可能，不能因为举43就认定答案只有43。原猜测与回应逐条留下。',
      activity:
        '纸上依次写30少了、60多了，列出两个不同的合法候选，说明为何30与60本身排除。',
    },
    {
      title: '新线索缩小范围，旧线索仍有效',
      text: '又猜40少了，范围缩到41～59；再猜50多了，缩到41～49。此时还不是唯一数。另明确给个位3才确定43；若实际游戏没有额外数位提示，就继续猜并保留回应，不能凭示例补造提示。',
      activity:
        '按这个示例纸面模拟每轮反馈并画范围，示例猜43回应猜对才结束。另做真实游戏时目标可能不同，双方轮流，固定未知数不偷偷更换。',
    },
    {
      title: '1～99中个位是5，包括5',
      text: '逐十段检查：5、15、25、35、45、55、65、75、85、95，共10个。只写两位数会漏5。找全与任写三个不同的两位数不同；这里不能用只举三个例子代替全部。',
      activity:
        '在纸面1～99数表逐十段圈记，再单独写出完整列表，检查没有重复、漏项或多加0/100。',
    },
    {
      title: '个位0和十位5各有不同边界',
      text: '个位0的数是10至90的9个整十数，0不在范围，100也排除。十位5是50至59的10个数，50的个位0合法；5本身不是十位5。改变条件到个位7或十位6必须重新找，不能直接搬旧列表。',
      activity:
        '纸上分别列全两类，对照每个数的数位与范围，说出为什么5、0、100不能错归本次类别。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际与同伴做一次固定1～99整数猜数，纸上保留每次猜测和少了/多了/猜对反馈，合并范围后再猜；未完成保留待做，不用课中预设目标冒充真实游戏。',
      '实际在纸面1～99数表圈出并写全个位5、个位0及十位5的三类列表，逐段核对一位数、0和100边界，再换个位7或十位6重新找。',
      '口述一次范围缩小过程和一次数位筛选方法，举出两个在信息不足时仍可能的不同数，说明示例不是唯一答案。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实游戏、纸笔与口述后才确认，未做如实待做。',
      explanation: '预设条件练习不会自动确认实际游戏或纸面列全。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '记录实际游戏每次猜测和回应，或写出尚未做过与下一步计划；说明怎样保留旧线索、怎样核对数位列表不漏项。',
      rule: { kind: 'reflection' },
      hint: '按原话记录，计划与已完成经历分开，不编造游戏记录。',
      explanation: '开放记录correct=null，不据未猜中的次数自动评分。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '猜数线索与数位全量边界核对',
    notes: `依据ISBN ${source.isbn}已读51～52页，原创数字与反馈，复习改猜测上下界、数位条件和答案。范围完整、自主任务人工确认、反思null，未知版次印次；不证明完整单元最终审校。`,
  },
};
