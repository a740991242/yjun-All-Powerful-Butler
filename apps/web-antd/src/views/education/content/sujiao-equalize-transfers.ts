import type { Lesson, Question, Visual } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-equalize-transfers';
function tasks(review: boolean): Question[] {
  const a = review ? 20 : 18;
  const b = review ? 8 : 10;
  const gap = a - b;
  const move = gap / 2;
  const visual: Visual = { kind: 'comparison-rows', counts: [a, b] };
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual,
    hint: '先分清只添一边、只拿走一边，还是从一边移到另一边。每移一张要同时核对两边，不直接把相差数当移动张数。每种方法先恢复原数，不混用条件。',
  });
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    rule: { kind: 'number', value },
    explanation,
  });
  return [
    number(
      'only-add',
      `A有${a}张，B有${b}张。A保持不动，只从外面给B添卡，使两边同样多，应添几张？`,
      gap,
      `只添B，${b}＋${gap}＝${a}，A仍${a}。`,
    ),
    number(
      'only-remove',
      `恢复A${a}、B${b}。B保持不动，只从A拿走卡并放在两行之外，要拿走几张才同样多？`,
      gap,
      `只拿A，${a}－${gap}＝${b}，B仍${b}。`,
    ),
    number(
      'transfer',
      `再恢复A${a}、B${b}。只把整张卡从A移到B，两行外不添也不拿，移几张后两边同样多？`,
      move,
      `逐张核对，A移出${move}后${a - move}，B添入${move}后${b + move}，两边相等；不用相差${gap}直接作移动数。`,
    ),
    {
      ...base(
        'after-transfer',
        `从原来A${a}、B${b}中，A给B移${move}张。先填现在A，再填现在B的张数。`,
      ),
      rule: { kind: 'steps', values: [a - move, b + move] },
      explanation: `A${a}－${move}＝${a - move}，B${b}＋${move}＝${b + move}，两边都变。`,
    },
    number(
      'conserved-total',
      `只把A${a}里的${move}张移到B${b}，不添不丢，移完两行合计几张？`,
      a + b,
      `仍${a + b}张，换位置不改变合计；只添或只拿则合计会变。`,
    ),
    {
      ...base(
        'move-entire-gap',
        `如果误把相差${gap}张全部从A${a}移给B${b}，先填新A，再填新B。`,
      ),
      rule: { kind: 'steps', values: [b, a] },
      explanation: `A变${b}，B变${a}，谁多反过来了，仍没有同样多。`,
    },
    {
      ...base(
        'not-equal-after-gap',
        `A${a}、B${b}，把相差${gap}张全部从A移到B，能同样多吗？`,
      ),
      choices: [
        { id: 'no', label: '不能，两边数量对调，仍有差' },
        { id: 'yes', label: '能，移动相差数总是正确' },
      ],
      rule: { kind: 'choice', value: 'no' },
      explanation: `移后${b}与${a}不等，须同时看两边变化。`,
    },
    {
      ...base(
        'all-methods',
        `原来A${a}、B${b}。下面每种都独立从原数开始，选出全部能使同样多的方法。不是要求所有方法合计不变。`,
      ),
      choices: [
        { id: 'add', label: `A不动，给B从外面添${gap}张` },
        { id: 'remove', label: `B不动，从A拿${gap}张放到两行外` },
        { id: 'move', label: `从A移${move}张到B` },
        { id: 'wrong-direction', label: '从较少的B移1张到较多的A' },
      ],
      rule: { kind: 'set', values: ['add', 'remove', 'move'] },
      explanation:
        '只添、只拿、两边移动都可达成同样多，但合计变化不同；从少移向多会更不一样。',
    },
    {
      ...number(
        'already-equal',
        `另两行已各有${review ? 9 : 12}张。只求同样多，至少还要从一行移几张给另一行？`,
        0,
        '已经一样多，不需要移动，0是有效数量，不是漏填。',
      ),
      visual: { kind: 'comparison-rows', counts: review ? [9, 9] : [12, 12] },
    },
    {
      ...base(
        'whole-card-limit',
        `另一探索A${review ? 14 : 13}张、B${review ? 9 : 8}张，只在两边移整张卡，不撕开、不从外面添或拿。可能变成同样多吗？可逐张试与核对。`,
      ),
      visual: { kind: 'comparison-rows', counts: review ? [14, 9] : [13, 8] },
      choices: [
        { id: 'no', label: '不能，整张逐个移也达不到两边相等' },
        { id: 'yes', label: '总能，随便把差的一部分移过去即可' },
      ],
      rule: { kind: 'choice', value: 'no' },
      explanation: `合计${review ? 23 : 21}张，逐一配成两边相同会剩1张；移2后差1，移3后谁多反过来仍差1，不撕卡条件下不能同样多。这是原创探索，不要求学除法或分数。`,
    },
  ];
}
export const sujiaoEqualizeTransfersDraft: Lesson = {
  id,
  title: '同样多探索：只添只拿与两边移物',
  textbookTitle: '简单的数量关系·多种办法探索',
  page: 77,
  version: 1,
  status: 'preparing',
  goal: '独立核对不同达成同样多的办法，区分一边变化与两边变化，知道移动不改变合计且有整物限制。',
  prerequisite: '会求相差数，准备两种纸卡；只用整张卡，不实际搬动重物。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷77页两边同样多开放探索。本站原创18/10、复习20/8，逐张试移与核对，不要求除法或分数；奇数合计的整张限制是单列原创拓展，不冒充书页原题或必须教材知识。多种合法方法分别记录，网页答案不确认真实摆物。`,
  steps: [
    {
      title: '同样多目标，先读改变规则',
      text: 'A18张、B10张，相差8。若只给B添8张，得到18与18；若只拿走A8张，得到10与10。两种都同样多，但添和拿的规则、最后合计不同，不能把方法混在一起。',
      visual: { kind: 'comparison-rows', counts: [18, 10] },
      activity: '实际分别试只添与只拿，每次先恢复18和10，记录两边。',
    },
    {
      title: '移一张，两边同时变化',
      text: '从A移1张给B，A17、B11，差从8变6。移动不是只给B添：A也少了。继续逐张核对，不能把差8直接当移8。',
      visual: { kind: 'comparison-rows', counts: [17, 11] },
      activity: '实际移1张，说清从哪边来、到哪边去，分别数两边。',
    },
    {
      title: '试到相等，并核对合计',
      text: '移4张后A14、B14，相等，合计仍28。移动只是换位置，不添、不丢。若把差8张全部移过去，会变成A10、B18，数量对调仍不相等。',
      visual: { kind: 'comparison-rows', counts: [14, 14] },
      activity: '实际逐张试到相等，恢复后再试误移8，记录两边结果。',
    },
    {
      title: '多种方法都可以，条件要明确',
      text: '只添8、只拿8、从A移4，都能从18和10变同样多。只有第三种同时保持合计28。若题目只问同样多，可以有多种方法；若要求不添不拿，只能检查移动办法。',
      activity: '纸面分类三种方法，注明合计是否变化，口述题目条件。',
    },
    {
      title: '已经相等与整张限制',
      text: '两边各12张，不必再移，0有效。原创拓展13与8，整张只在两边移，不撕开不添不拿；移2后11与10，移3后10与11，仍不等，可以逐个试和配对，不要求分数或除法。复习换20与8，重新尝试。',
      activity: '实际分别试已经相等和13/8整张限制，记录发现，不拆卡凑答案。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际准备18张与10张纸卡，分别完成只添、只拿和两边移动，每次先恢复原数，并记录两边与合计。',
      '实际从较多边逐个移卡，每次同时数两边，比较移4与误移8后是否相等并口述原因。',
      '实际用13张与8张完整纸卡试移，不撕开不从外面添或拿；记录相差1时继续移会怎样。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实摆卡、纸面记录或口述后分别确认，可暂跳。',
      explanation: '网页判断不自动确认实际移动或记录。',
    })),
    {
      id: `${id}-own-method`,
      knowledge: `${id}-own-method`,
      prompt:
        '记录一种你实际试过的同样多办法，说明允许添、拿还是只移，两边最后怎样；允许不同合法方法。',
      rule: { kind: 'reflection' },
      hint: '写真实方法与条件，不强制固定表述。',
      explanation: '开放方法null保存，不评分。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '为什么移动一张要同时检查两边？记录发现、错误尝试或尚未明白的地方。',
      rule: { kind: 'reflection' },
      hint: '保留原话。',
      explanation: '反思null，与人工任务独立。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读开放同样多范围与原创整物限制核验',
    notes: `ISBN ${source.isbn}印刷77页开放探索；原创数值及整张拓展，多种方法按条件分别接受，版次印次未知。`,
  },
};
