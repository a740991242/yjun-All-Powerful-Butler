import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-final-data-questions';
function tasks(review: boolean): Question[] {
  const base = review ? 40 : 30;
  const close = review ? 42 : 31;
  const much = review ? 79 : 68;
  const less = review ? 34 : 24;
  const jumps: [number, number, number] = review ? [63, 45, 52] : [58, 41, 50];
  const objects: [number, number] = review ? [16, 9] : [14, 8];
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
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
    hint: '先按姓名或组别找两条正确数据，再按问题比较或合并。',
    explanation,
  });
  const choice = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    value: string,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    choices,
    rule: { kind: 'choice', value },
    hint: '结合本题全部条件，不把相对描述当固定差值或只看一个关键词。',
    explanation,
  });
  const reading = `原创阅读记录：小安读${base}本；小贝与小安差不多，小晨比小安多得多，小冬比小安少一些。四个数量各用一次：${base}、${much}、${less}、${close}本。`;
  const jumpTable = `同一次原创跳绳记录：小雨${jumps[0]}下、小晴${jumps[1]}下、小风${jumps[2]}下。`;
  const objectTable = `A组有${objects[0]}张纸卡，B组有${objects[1]}张纸卡，两组纸卡没有重复。`;
  return [
    {
      ...common('joint-reading'),
      prompt: `${reading}按小安、小贝、小晨、小冬的顺序填他们的数量。`,
      rule: { kind: 'steps', values: [base, close, much, less] },
      hint: '先固定已知小安，再看另外三数与他接近、多很多、少一些，最后检查四数各用一次。',
      explanation: `按顺序为${base}、${close}、${much}、${less}。这里的说法结合这一组数理解，不规定所有情境的固定差值。`,
    },
    choice(
      'relative-not-equal',
      '小贝与小安差不多，是否一定表示他们读的本数相等？',
      [
        { id: 'no', label: '不一定，差不多可以接近但不完全相等' },
        { id: 'yes', label: '一定相等，不允许差一本' },
      ],
      'no',
      '差不多是相对接近，不能直接改为完全相等。',
    ),
    choice(
      'relative-no-threshold',
      '在另一组新数据里，能规定多得多永远就是多十本吗？',
      [
        { id: 'context', label: '不能，要结合比较标准和这组数据理解' },
        { id: 'ten', label: '能，多得多总是固定多十本' },
      ],
      'context',
      '本课没有规定固定阈值；换了标准和数据，需要重新观察。',
    ),
    number(
      'jump-rain-sun',
      `${jumpTable}小雨比小晴多跳多少下？`,
      jumps[0] - jumps[1],
      `${jumps[0]}－${jumps[1]}＝${jumps[0] - jumps[1]}下。只读这两人的数据。`,
    ),
    number(
      'jump-sun-wind',
      `${jumpTable}小晴比小风少跳多少下？`,
      jumps[2] - jumps[1],
      `${jumps[2]}－${jumps[1]}＝${jumps[2] - jumps[1]}下。求少多少也求两人相差。`,
    ),
    number(
      'jump-rain-wind',
      `${jumpTable}换一对：小雨比小风多跳多少下？`,
      jumps[0] - jumps[2],
      `${jumps[0]}－${jumps[2]}＝${jumps[0] - jumps[2]}下。不借用上一对的差。`,
    ),
    choice(
      'jump-data-limit',
      `${jumpTable}能据此确定他们明天各跳多少下吗？`,
      [
        { id: 'unknown', label: '不能，这是本次记录，明天需要重新记录' },
        { id: 'same', label: '能，明天必定与本次相同' },
      ],
      'unknown',
      '一次记录不预言以后的结果，也不据此评价真实同学的能力。',
    ),
    number(
      'objects-total',
      `${objectTable}两组一共多少张？`,
      objects[0] + objects[1],
      `${objects[0]}＋${objects[1]}＝${objects[0] + objects[1]}张。`,
    ),
    number(
      'objects-difference',
      `${objectTable}B比A少多少张？`,
      objects[0] - objects[1],
      `${objects[0]}－${objects[1]}＝${objects[0] - objects[1]}张。`,
    ),
    choice(
      'question-conditions',
      `${objectTable}哪一个新问题可以只用这两条已知量解答？`,
      [
        { id: 'difference', label: 'A比B多多少张？' },
        { id: 'tomorrow', label: '明天A会增加多少张？' },
        { id: 'third', label: 'C组有多少张？' },
      ],
      'difference',
      '两组数量可求合计和相差，明天增加多少与第三组数量都需要新条件。',
    ),
    choice(
      'own-question-record',
      '做自主提问任务时，只点选网页已有的问题但没有自己提出问题，应该怎样记录？',
      [
        {
          id: 'pending',
          label: '自主提问仍待做；实际写出、解答并交流后再确认',
        },
        { id: 'done', label: '网页答对就当已经自主提问并交流' },
      ],
      'pending',
      '固定题检验理解，不能替代自主提出问题、说明条件与实际交流。',
    ),
  ];
}
export const sujiaoFinalDataQuestionsDraft: Lesson = {
  id,
  title: '期末读数据：联合配对与自己提问',
  textbookTitle: '期末复习：相对数量、三人数据与自主提问',
  page: 91,
  status: 'preparing',
  version: 1,
  goal: '联合核对四人的相对数量描述，按三人记录比较不同两人，并根据两条已知数量自己提出、解答和交流问题。',
  prerequisite:
    '能读100以内数、求合计与相差；准备纸笔或纸卡，不需上传姓名和个人成绩。',
  parentTip:
    '依据已读取91页第4题及92页第10、11题的活动范围设计原创数据，不照搬教材人物原画。相对描述没有固定差值；本课不安排真实跳绳竞赛、不根据一次记录给孩子贴能力标签。',
  steps: [
    {
      title: '四条描述一起核对',
      text: '原创阅读记录：小安30本，小贝与他差不多，小晨比他多得多，小冬比他少一些。候选30、68、24、31本各用一次。先把30给小安，再结合其他三数判断：31接近30，68多很多，24少一些。结果按四人顺序为30、31、68、24。',
      activity:
        '在纸面做姓名卡和数量卡，先不看结果，联合配对，再逐条读条件核对；不能只比较一对就结束。',
    },
    {
      title: '差不多不等于相等',
      text: '31和30接近但不相等。多得多、少一些、差不多需结合标准和这一组数理解；不把它们分别规定成固定多几、少几或完全相等。换新的一组数量，就重新看条件。',
      activity:
        '自己换一组四个数，注明标准，口述哪里接近、哪里多很多或少一些；如不适合这些说法，可以改条件而不勉强配对。',
    },
    {
      title: '三人记录，分别比较',
      text: '原创同次跳绳数据：小雨58下，小晴41下，小风50下。小雨比小晴多17下；小晴比小风少9下；另换小雨与小风，差8下。每次先圈问题涉及的两人，再读他们各自的数量，不能把第三人的数或上一对的差搬来。',
      activity:
        '实际抄成姓名和数量对应的小表，圈三组不同配对，写算式并说单位。纸面记录是原创例子，不冒称自己的实际成绩。',
    },
    {
      title: '从三人数据自己提问',
      text: '除了已经给出的两个问题，你还可以提出一个本次数据能回答的新问题，例如另两人的差或两人的合计。先说问谁、求什么，再选择条件、解答和解释。你自己提出的问题可以不同；点选现成答案不等于自己提问。',
      activity:
        '自己提出一个不同于已给两题的问题，写问题、条件、算式、答案和单位，再实际向家长或同伴说明；不能只抄网页示例当自主完成。',
    },
    {
      title: '两条已知量，提出不同问题',
      text: '原创纸卡情境：A组14张、B组8张，没有重复。一共多少张可以算14加8为22；A比B多多少、B比A少多少都求14减8为6，但问法不同。明天增加多少、C组有多少都缺新条件。需要自己提出至少两个不同问题并解答、交流，固定示例不替代这个过程。',
      activity:
        '实际摆两组纸卡或画纸卡，如实记录本次两组数量；自己提出至少两个问题，分别指出条件、计算、单位并说明方法。可采用本课数量或自己另选100以内且可计算的数量。',
    },
    {
      title: '记录已做与下一步',
      text: '人工任务只有实际配对、读表、自己提问解答与交流后才确认。尚未找到交流对象或只计划明天做，就记待做。反思保留你的原话，没有唯一答案；一次记录不能预测明天，也不能代替学校的真实学习评价。',
      activity:
        '指出一次找错配对或条件不足的问题，并写真实改进想法；未来计划单独记录。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际做四人姓名卡与四数量卡联合配对，按每条相对描述核对，再自己换一组数并说明标准；未操作不确认。',
      '实际写出三人对应数据小表，分别圈三对人物并求差，解释每次使用哪两条记录与单位；不记录真实姓名成绩。',
      '根据三人数据自己提出一个不同于已给两题的新问题，实际写条件、解答和单位，并向家长或同伴解释；抄示例或计划交流不当已完成。',
      '实际摆或画两组纸卡，如实写两组已知数量，自己提出至少两个不同问题、解答并实际交流；没有新条件的问题指出还缺什么。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '家长查看实际记录后确认；未做或仅计划可以暂时跳过。',
      explanation: '网页答对不自动确认自主提问、解答或实际交流。',
    })),
    ...[
      '联合配对时，你怎样检查四条描述和每个数只用一次？记录真实困难或方法。',
      '换两个人比较时，哪里容易读错？说一个自己发现并改正的例子，尚未发现也如实写。',
      '自己提出了什么问题？哪些已实际解答交流，哪些只是下一步计划？分别记录，不要求唯一问法。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflection-${i}`,
      knowledge: `${id}-reflection-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '记录真实想法，计划与已做分开。',
      explanation: '反思correct为null，不自动打分或确认实际任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '91、92页具体活动与原创数据核对',
    notes: `依据实际读取ISBN ${source.isbn}印刷91、92页联合配对、三人比较和两组已知量自主提问范围；本站数量及姓名原创，未复制原画，不代表全年或最终教师审校完成。`,
  },
};
