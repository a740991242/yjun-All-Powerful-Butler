import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-month-calendar';
function tasks(review: boolean): Question[] {
  const count = review ? 31 : 30;
  const first = review ? 3 : 1;
  const last = review ? 5 : 2;
  const month = review ? 7 : 6;
  const sunday = review ? 5 : 7;
  const visual = { kind: 'month-calendar' as const, year: 2026, month };
  const weekdays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual,
    rule: { kind: 'number', value },
    hint: '先确认2026年和月份，再沿日期与星期列逐项读取。',
    explanation,
  });
  const weekday = (key: string, day: number, value: number): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt: `2026年${month}月${day}日是星期几？`,
    visual,
    choices: weekdays.map((label, i) => ({ id: String(i), label })),
    rule: { kind: 'choice', value: String(value) },
    hint: '找日期格，向上对应星期列，不把每排第一个有日期的格都当星期日。',
    explanation: `${day}日位于${weekdays[value]}列；月初空格仍占原来的列。`,
  });
  return [
    number(
      'count',
      `图中2026年${month}月一共有多少天？`,
      count,
      `本月日期从1到${count}，共${count}天。空格不算，表格行数也不是天数。`,
    ),
    weekday('first', 1, first),
    weekday('last', count, last),
    number(
      'sunday',
      `2026年${month}月第一个星期日是几日？`,
      sunday,
      `先找星期日列，第一个本月日期是${sunday}。`,
    ),
    number(
      'next-sunday',
      `2026年${month}月第一个星期日之后7天，是几日？`,
      sunday + 7,
      `同一星期列向下一排多7天，从${sunday}到${sunday + 7}。`,
    ),
    number(
      'after',
      `2026年${month}月14日后一天是几日？`,
      15,
      '日期每次向后一天多1，14日后一天是15日，不因为换排跳过日期。',
    ),
    number(
      'week-gap',
      `2026年${month}月1日到8日经过几天？不问含两端有几个日期。`,
      7,
      '从1日到8日经过7天；含两端有8个日期，两个问题不同。',
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-blank`,
      knowledge: `${id}-blank`,
      prompt: `2026年${month}月日历开头还没有本月日期的格，怎样理解？`,
      visual,
      choices: [
        { id: 'outside', label: '只是本月没有日期的空格，不算本月天数' },
        { id: 'zero', label: '表示本月0日，也是一天' },
      ],
      rule: { kind: 'choice', value: 'outside' },
      hint: '本月从1日开始，空格仅保留星期列位置。',
      explanation: '没有0日，空格也不意味着漏掉本月日期。',
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-festival`,
      knowledge: `${id}-festival`,
      prompt: review
        ? '资料说明6月1日是儿童节。现在看的是2026年7月日历，能把7月1日当成资料说的同一天吗？'
        : '资料说明6月1日是儿童节。图中2026年6月1日虽然在星期一列，能仅凭星期一认定每个人当天都放假吗？',
      visual,
      choices: review
        ? [
            { id: 'check', label: '不能，月份不同，需确认资料中的年月日' },
            { id: 'yes', label: '能，每个月1日都是同一天' },
          ]
        : [
            {
              id: 'check',
              label: '不能，节日名称和星期不自动证明个人放假安排',
            },
            { id: 'yes', label: '能，星期一就是所有人的假期' },
          ],
      rule: { kind: 'choice', value: 'check' },
      hint: '分别确认月份、日期、星期与资料范围，不添加资料没说的结论。',
      explanation: review
        ? '6月1日与7月1日不是同一个日期。'
        : '6月1日是儿童节，图中是星期一；实际活动与放假安排另以学校通知为准。',
    },
  ];
}
export const sujiaoMonthCalendarDraft: Lesson = {
  id,
  title: '读月历：日期、星期与本月天数',
  textbookTitle: '认识20～99·月历阅读',
  page: 52,
  version: 1,
  status: 'preparing',
  goal: '先确认年月，再读取日期与星期，区分月初空格、总天数和经过天数，提出自己的月历问题。',
  prerequisite: '会读1～31，认识星期日到星期六；准备纸笔和指定年月月历。',
  parentTip:
    '依据已读第52页2026年6月月历相关活动范围，原创公历表。主课6月、复习7月，日期按UTC计算，既非当前月也不标今天；不复制农历或教材原图。6月1日儿童节为教材活动信息，星期不推断学校假期。',
  steps: [
    {
      title: '先看年月和七个星期列',
      text: '这是2026年6月，七列从星期日到星期六。1日在星期一列，因此前面留空格；这不是0日。读另一张月历前要重新看年月，不能沿用上一月的星期位置。',
      visual: { kind: 'month-calendar', year: 2026, month: 6 },
      activity: '实际在纸面月历圈出年月和星期列，指出1日所在列，不移动空格。',
    },
    {
      title: '日期连续，月末决定本月天数',
      text: '本月从1日到30日，共30天。日期换到下一排仍连续，空格不是额外日期，也不把5排当5天。2026年7月则到31日，须重新读取，不能说每月都30天。',
      visual: { kind: 'month-calendar', year: 2026, month: 7 },
      activity:
        '实际对照两张月历数到最后一日，分别记录天数，说明月初月末空格。',
    },
    {
      title: '同星期列相隔7天',
      text: '在2026年6月，7日和14日同为星期日，相隔7天。1日到8日经过7天，含两端却有8个日期；先听清问经过多少天还是有几个日期。',
      visual: { kind: 'month-calendar', year: 2026, month: 6 },
      activity: '实际在纸上圈同星期的两个日期，逐日数间隔，再换一组核对。',
    },
    {
      title: '节日、星期和自己的问题',
      text: '教材月历活动提示6月1日是儿童节。图中2026年6月1日是星期一，不能只凭星期认定每个人放假。可以提出本月几个星期日、某日是星期几等问题，明确所看年月；不把教材历史月历当今天。',
      visual: { kind: 'month-calendar', year: 2026, month: 6 },
      activity:
        '实际提出一个指定年月的月历问题，用日期格与星期列向家人说明依据。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在纸上按2026年6月七个星期列填写1～30日，保留开头空格，核对每个日期不漏不重。',
      '实际对照2026年6月和7月月历，圈出月末、1日星期及一组同星期日期，分别说明天数和经过天数。',
      '实际提出一个明确年月的月历问题，指着日期与星期列口述依据；若查看家里当前月历，明确它与教材示例月份不同。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '纸面填写、核对和实际表达完成后才确认，可留待做。',
      explanation: '网页日历只读，不自动确认纸面活动。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '你怎样先确认年月再找日期？记录一个月历发现或还需核对的问题。',
      rule: { kind: 'reflection' },
      hint: '保留真实想法，不要求唯一答案。',
      explanation: '反思null，不评分或替代真实任务。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '指定公历月历与阅读范围核验',
    notes: `依据ISBN ${source.isbn}印刷52页部分月历范围，原创日历。复习更换实际月份与星期天数，版次印次未知，不证明完整单元。`,
  },
};
