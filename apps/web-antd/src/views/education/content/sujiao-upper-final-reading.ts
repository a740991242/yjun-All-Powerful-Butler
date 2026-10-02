import type { Lesson, Question, ReadingTableVisual } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-final-reading';
export function finalReadingTable(review: boolean): ReadingTableVisual {
  return {
    kind: 'reading-table',
    names: review ? ['小禾', '小宁'] : ['姐姐', '弟弟'],
    days: ['第一天', '第二天', '第三天'],
    pages: review
      ? [
          [4, 7, 6],
          [6, 5, 8],
        ]
      : [
          [6, 5, 7],
          [8, 6, 5],
        ],
  };
}
function story(review: boolean) {
  const t = finalReadingTable(review);
  return `${t.names[0]}和${t.names[1]}从头阅读同一本故事书，每天只记当天新读、不重复的页数。${t.names[0]}第一天${t.pages[0][0]}页、第二天${t.pages[0][1]}页、第三天${t.pages[0][2]}页；${t.names[1]}第一天${t.pages[1][0]}页、第二天${t.pages[1][1]}页、第三天${t.pages[1][2]}页。书的总页数没有给出，两人都没有读完。`;
}
function tasks(review: boolean): Question[] {
  const table = finalReadingTable(review);
  const a = table.pages[0];
  const b = table.pages[1];
  const totalA = a[0] + a[1] + a[2];
  const totalB = b[0] + b[1] + b[2];
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    hint: '先确定人和第几天，记新读页数，不记页码；同一本书、起点相同，已读更多就未读更少，未知总页数不虚填。',
    explanation,
  });
  const choose = (
    key: string,
    prompt: string,
    value: string,
    explanation: string,
    choices: { id: string; label: string }[],
  ): Question => ({
    ...q(key, prompt, { kind: 'choice', value }, explanation),
    choices,
  });
  return [
    {
      ...q(
        'six-cells',
        `${story(review)}根据这段记录把空表六格全部填齐。按①②③（${table.names[0]}三天）再④⑤⑥（${table.names[1]}三天）顺序在下方填六项。`,
        { kind: 'steps', values: [...a, ...b] },
        `六格依次是${[...a, ...b].join('、')}页。人是行、天是列，圆圈数字只是位置编号，不能填累计页码或三天合计。`,
      ),
      visual: { ...table, display: 'blanks' },
    },
    ...a.map((n, i) => ({
      ...q(
        `day-${i}`,
        `第${i + 1}天，两人谁当天新读页数更多？`,
        { kind: 'choice', value: n > required(b[i]) ? 'a' : 'b' },
        `${table.names[0]}当天${n}页，${table.names[1]}当天${required(b[i])}页，只比较同一天，不把不同天错配。`,
      ),
      visual: table,
      choices: [
        { id: 'a', label: table.names[0] },
        { id: 'b', label: table.names[1] },
        { id: 'equal', label: '同样多' },
      ],
    })),
    {
      ...q(
        'totals',
        `分别记录三天新读页数，中间先合前两天再加第三天。①${table.names[0]}前两天合计；②${table.names[0]}三天合计；③${table.names[1]}前两天合计；④${table.names[1]}三天合计，按此顺序填四项（页）。`,
        { kind: 'steps', values: [a[0] + a[1], totalA, b[0] + b[1], totalB] },
        `${table.names[0]}${a.join('+')}=${totalA}页，${table.names[1]}${b.join('+')}=${totalB}页。三天均新读、不重复才能相加，不把书的页码直接相加。`,
      ),
      visual: table,
    },
    choose(
      'read-more',
      `${story(review)}三天一共谁已读更多？`,
      'b',
      `${table.names[0]}共${totalA}页，${table.names[1]}共${totalB}页，后者已读更多。`,
      [
        { id: 'a', label: table.names[0] },
        { id: 'b', label: table.names[1] },
        { id: 'unknown', label: '没有总页数就无法比较已读' },
      ],
    ),
    choose(
      'unread-more',
      `同一本书、都从头读、不重复，三天后谁没有读的页数更多？`,
      'a',
      `同一个总量扣去已读，${table.names[0]}只读${totalA}页，比${table.names[1]}少读，所以未读更多。不能把已读更多的人说成未读更多。`,
      [
        { id: 'a', label: table.names[0] },
        { id: 'b', label: table.names[1] },
        { id: 'equal', label: '同一本书所以未读相同' },
      ],
    ),
    q(
      'unread-difference',
      `在同书同起点条件下，${table.names[0]}没读的页数比${table.names[1]}多几页？仅填差（页），不填未知剩余总数。`,
      { kind: 'number', value: totalB - totalA },
      `已读相差${totalB - totalA}页，同一本书未读反向相差同样多；不需要知道总页数就能比差。`,
    ),
    choose(
      'unknown-total',
      '书的总页数没给出，能直接写两人各剩多少页吗？',
      'unknown',
      '只能判断谁未读更多及相差几页，不能凭空确定每人剩余页数。补总页数才能算具体剩余，未来阅读计划也不是已读。',
      [
        { id: 'unknown', label: '不能，只能比较，具体剩余要有总页数' },
        { id: 'read', label: '能，已读总数就是未读总数' },
        { id: 'guess', label: '能，把这本书猜成20页' },
      ],
    ),
    choose(
      'meaning',
      '每个格记录当天新读页数，与读到第几页有什么区别？',
      'new',
      '每天新读且不重复的数量可合计；页码表示位置，不是各天的新读量。当天确实未新读要填0，未记录是未知不能默认为0。',
      [
        { id: 'new', label: '格填当天新读量，不是累计页码；0与未记录不同' },
        { id: 'page', label: '每天格都写最后读到的页码，再相加' },
        { id: 'plan', label: '可以把明天计划阅读量也当今天已读量' },
      ],
    ),
  ];
}
const manual = (key: string, prompt: string): Question => ({
  id: `${id}-${key}`,
  knowledge: `${id}-${key}`,
  prompt,
  rule: { kind: 'manual' },
  hint: '真实填写、计算、记录或说明后独立确认；未做暂跳，未来计划分开。',
  explanation: '实际作品与帮助如实记录，不由网页正确自动确认。',
});
export const sujiaoUpperFinalReadingLesson: Lesson = {
  id,
  title: '期末读表：六格填写与已读未读',
  textbookTitle: '期末复习·阅读记录',
  page: 93,
  version: 1,
  status: 'available',
  goal: '先由两人三天记录填全六格，再同日/三天比较；同书已读与未读反向比较，未知总页数不猜剩余，真实记录分开。',
  prerequisite:
    '会10以内与十几不进位加减，备空六格纸表、纸笔及自己的阅读记录；家人可以帮读题。',
  parentTip: `ISBN ${source.isbn}同版93页已实际查看。原姐姐6/5/7与弟弟8/6/5六空先填后比；明确同书从头每天新读不重复的学习条件，已读18/19使未读姐姐更多但未知总页数不能写具体剩余。新小禾4/7/6与小宁6/5/8重新对应六格。10客观/4实际/1反思，实际纸表/比较/本人记录/解释各人工，未来计划分开、reflection null，旧快照及教师最终审校未核验保留。`,
  steps: [
    {
      title: '六个空格，先对人再对天',
      text: `${story(false)} 空表两行三列，①②③对应姐姐三天，④⑤⑥对应弟弟三天；编号不是页数，依据每天记录逐格填写。不要把第二天写成前两天合计，也不只填两个示例格。`,
      visual: { ...finalReadingTable(false), display: 'blanks' },
      activity:
        '实际画空两行三列表，写人名/三天/单位页，按记录完整填六格；逐格读人和天，保留原纸表。',
    },
    {
      title: '同一天比较，不跨天错配',
      text: '姐姐三天6/5/7，弟弟8/6/5。第一天比6与8，第二天比5与6，第三天比7与5。比较同一列；不能拿姐姐第三天和弟弟第一天当当天比较，也不能只因某天多就认三天必多。',
      visual: finalReadingTable(false),
      activity:
        '实际在已填写表分别圈三列所求两格，每天说谁多及依据，不只说人名。',
    },
    {
      title: '新读量相加，分清中间与总数',
      text: '每天记的是新读、不重复的页数。姐姐先6+5得11，再加7得18；弟弟先8+6得14，再加5得19。三天合计单位仍是页，不是天。若实际记录是累计页码或重复阅读，不能直接用这条相加规则。',
      visual: finalReadingTable(false),
      activity:
        '实际纸写两条连算，中间11/14与最后18/19分别核对，按三天新读量归并，可以用纸片。',
    },
    {
      title: '同一本书，未读比较反过来',
      text: '同一本书、都从头读且每天新读不重复，弟弟已读19比姐姐18多1页；所以姐姐未读更多，也多1页。书的总页数没给出，不能知道两人各剩多少页，更不能擅自把书设成20页。比较数量与求具体剩余不是同一个问题。',
      activity:
        '实际说已读谁多、未读谁多及相差1页，指出缺总页数所以不能求具体剩余；新小禾17/小宁19重新说未读差2页。',
    },
    {
      title: '自己的记录，真实与计划分开',
      text: '可以和家人各记录三天当天新读量，逐格写单位。确实没有新读填0，尚未记录是未知，不用0替；未来计划另记。不同书的总页数可能不同，不直接从已读多少推未读谁多。读重页如实注明，累计页码另列；未做就待做。',
      activity:
        '实际两人记录三天新读量，填全六格，并注明书名/是否同书/是否从头/是否有重复；无同伴或三天未结束记待做，不能拿模拟记录冒实际。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'actual-six-cells',
      '实际纸画两行三列空表，姐姐6/5/7与弟弟8/6/5逐格完整填六空；再小禾4/7/6与小宁6/5/8重新空表独立填写。写人名/天/单位，编号不当页数，保留全部作品与帮助。',
    ),
    manual(
      'actual-comparison',
      '实际在两份完整表逐日圈同列比较，分别写三天中间与最终合计；主18/19未读反向差1、新17/19未读反向差2，并指出总页数未知不能求具体剩余。',
    ),
    manual(
      'actual-record',
      '实际与家人各记录三天当天新读量，完整六格，0仅确实未新读，未知暂留说明；书名/是否同书同起点/重复或累计页码另记，未来计划不充已读。三天或同伴未齐暂跳，模拟表不能冒本人记录。',
    ),
    manual(
      'actual-explain',
      '实际展示自己两份填表及真实记录，说明人/天/新读单位、已读与未读为何反向及具体剩余缺总页数；不同书不能直接反推。保留原话/帮助/困难，未来计划另列。',
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实填表/比较或阅读记录的一例，以及帮助、改正或缺少条件；未做如实说，未来三天计划另列。',
      rule: { kind: 'reflection' },
      hint: '真实与计划分开。',
      explanation: '反思correct null不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整六格及已读未读条件核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷93页已实际查看，六空由记录填写，不由已给值表替代；全新两人六值重填，同书未读反向比较/未知具体剩余边界明确。教师最终审校未核验。',
  },
};
