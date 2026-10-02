import type { Lesson, Question, ReadingTableVisual } from '../learning/types';

import { required } from '../learning/required';

const id = 'sj-upper-final-exploration';
export const sujiaoReadingTable: ReadingTableVisual = {
  kind: 'reading-table',
  names: ['小禾', '小宁'],
  days: ['第一天', '第二天', '第三天'],
  pages: [
    [4, 3, 6],
    [6, 4, 5],
  ],
};
export const sujiaoReadingReviewTable: ReadingTableVisual = {
  kind: 'reading-table',
  names: ['小禾', '小宁'],
  days: ['第一天', '第二天', '第三天'],
  pages: [
    [7, 5, 4],
    [5, 6, 3],
  ],
};
export function sujiaoReadingTasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}-reading`;
  const visual = review ? sujiaoReadingReviewTable : sujiaoReadingTable;
  const choices = [
    { id: 'first', label: '小禾' },
    { id: 'second', label: '小宁' },
    { id: 'same', label: '两人同样多' },
  ];
  return [
    {
      id: `${prefix}-lookup`,
      knowledge: `${id}-reading-lookup`,
      prompt: '找小禾这一行和第二天这一列。小禾第二天读了几页？',
      visual,
      rule: { kind: 'number', value: review ? 5 : 3 },
      hint: '先找人物行，再找日期列；各格是当天页数，不是累计页码。',
      explanation: review
        ? '小禾第二天5页，不是第一天7页或第三天4页。'
        : '小禾第二天3页，不是第一天4页或第三天6页。',
    },
    ...visual.days.map((day, i): Question => ({
      id: `${prefix}-day-${i}`,
      knowledge: `${id}-reading-day-${i}`,
      prompt: `${day}，谁读的页数多？只比较同一天。`,
      visual,
      choices,
      rule: {
        kind: 'choice',
        value:
          required(visual.pages[0][i]) > required(visual.pages[1][i])
            ? 'first'
            : 'second',
      },
      hint: '沿同一天的列看两人，不拿不同天的数量直接比较。',
      explanation: `${day}小禾${visual.pages[0][i]}页，小宁${visual.pages[1][i]}页，逐列比较。`,
    })),
    {
      id: `${prefix}-every-day`,
      knowledge: `${id}-reading-every-day`,
      prompt: '能说同一个人三天中的每一天都读得更多吗？',
      visual,
      choices: [
        { id: 'no', label: '不能，不同天有不同的人更多' },
        { id: 'yes', label: '能，只看第一天就知道其他天' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '检查三列，不把第一天的比较当成每天的比较。',
      explanation:
        '两人都有读得更多的某一天；每天更多与三天合起来更多不是同一结论。',
    },
    {
      id: `${prefix}-combined`,
      knowledge: `${id}-reading-combined`,
      prompt:
        '三天合起来，谁读的页数更多？可以先逐日比较多几页、少几页，再核对。',
      visual,
      choices,
      rule: { kind: 'choice', value: review ? 'first' : 'second' },
      hint: '每一天读得多不一定是同一人；看三天各自多的页数能否抵掉少的页数。',
      explanation: review
        ? '小禾第一天多2、第二天少1、第三天多1，合起来多2页。也可核对小禾16页、小宁14页。'
        : '小宁前两天分别多2、多1，第三天少1，合起来多2页。也可核对小禾13页、小宁15页。',
    },
    {
      id: `${prefix}-unit`,
      knowledge: `${id}-reading-unit`,
      prompt: '表里“页”表示什么？',
      visual,
      choices: [
        { id: 'daily', label: '当天实际读的页数' },
        { id: 'page-number', label: '当天最后一页的页码' },
        { id: 'books', label: '读了多少本书' },
      ],
      rule: { kind: 'choice', value: 'daily' },
      hint: '读清题目和表格说明，数量与编号不同。',
      explanation: '每格记录当天读的页数；页码、书本数与当天页数不是同一数量。',
    },
    {
      id: `${prefix}-ability`,
      knowledge: `${id}-reading-ability`,
      prompt: '只凭这张三天页数表，就能判断谁阅读理解能力更好吗？',
      visual,
      choices: [
        { id: 'unknown', label: '不能，表里没有理解情况或其他证据' },
        { id: 'known', label: '能，页数更多就一定理解得更好' },
      ],
      rule: { kind: 'choice', value: 'unknown' },
      hint: '只判断表里实际记录的量，不推出没有记录的能力。',
      explanation:
        '表只说明这三天的页数；理解、难度与长期能力没有记录，不能推断。',
    },
  ];
}
export const sujiaoReadingSteps: Lesson['steps'] = [
  {
    title: '阅读数量表，先找行与列',
    text: '小禾和小宁读同一本示例书，表记录每天读了几页。先找人物行，再找第一、第二或第三天列。各格不是最后页码，也不是累计数量。第二天小禾3页、小宁4页，只比较这一天。',
    visual: sujiaoReadingTable,
    activity: '纸上画两行三天表，口述每格属于谁、哪一天、什么单位。',
  },
  {
    title: '逐日比较，再看三天整体',
    text: '小宁第一天多2页、第二天多1页、第三天少1页，合起来仍多2页。不是每一天都更多；单日结论不能替代三天结论。页数也不能证明理解能力，实际阅读和口述另由家长查看。',
    visual: sujiaoReadingTable,
    activity:
      '用小棒表示两人每天页数，逐日比较多几少几，抵掉后再核对三天总量。',
  },
];
