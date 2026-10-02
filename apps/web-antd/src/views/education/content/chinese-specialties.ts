import type { Lesson, Question, Volume } from '../learning/types';

import { required } from '../learning/required';

interface Group {
  id: string;
  title: string;
  goal: string;
  source: (lesson: Lesson) => boolean;
  manual?: boolean;
}
const recognition = (lesson: Lesson) =>
  lesson.id.endsWith('-recognition') ||
  lesson.id === 'ct-words' ||
  lesson.id === 'cu-u1-1' ||
  lesson.id === 'cu-u1-5-comparison';
const phonics = (lesson: Lesson) =>
  (/^cu-u[234]-/.test(lesson.id) && !lesson.id.endsWith('-timetable')) ||
  lesson.id === 'ct-phonics';
const reading = (lesson: Lesson) =>
  lesson.id.endsWith('-original-reading') || lesson.id === 'ct-reading';
const groups: Group[] = [
  {
    id: 'recognition',
    title: '语文专项：识字与词句',
    goal: '集中辨认当前已开放的字词和语境；不增加教材会认会写范围。',
    source: recognition,
  },
  {
    id: 'phonics',
    title: '语文专项：拼音辨形与拼写',
    goal: '辨认声母、韵母和标调写法；客观题不评价实际发音或听辨。',
    source: phonics,
  },
  {
    id: 'reading',
    title: '语文专项：阅读信息与先后',
    goal: '回看完整原创材料，找信息、原因与事件顺序；不当作教材课文测验。',
    source: reading,
  },
  {
    id: 'timetable',
    title: '语文专项：课程表读表',
    goal: '从所示课程表查找星期、节次与课程，材料始终随题显示。',
    source: (lesson) => lesson.id.endsWith('-timetable'),
  },
  {
    id: 'manual',
    title: '语文专项：亲子认读与表达',
    goal: '集中完成已开放课包的认读、表达与纸笔活动，人工确认单列。',
    source: () => true,
    manual: true,
  },
];

/** Only authored available lessons are pooled; future textbook entries never become tasks. */
export function chineseSpecialties(
  volume: Volume,
  lessons: Lesson[],
): Lesson[] {
  const available = lessons.filter((lesson) => lesson.status === 'available');
  return groups.flatMap((group) => {
    const sources = available.filter((item) => group.source(item));
    const tasks = sources
      .flatMap((lesson) => lesson.questions)
      .filter(
        (question) =>
          (question.rule.kind === 'manual') === Boolean(group.manual),
      );
    if (tasks.length === 0) return [];
    const questions = [
      ...new Map(tasks.map((question) => [question.id, question])).values(),
    ];
    const skills = new Set(questions.map((question) => question.knowledge));
    const reviewTasks = sources
      .flatMap((lesson) => lesson.reviewQuestions ?? [])
      .filter(
        (question) =>
          skills.has(question.knowledge) &&
          (question.rule.kind === 'manual') === Boolean(group.manual),
      );
    const reviews = [
      ...new Map(
        reviewTasks.map((question) => [question.id, question]),
      ).values(),
    ];
    const origins = sources.filter((lesson) =>
      lesson.questions.some((question) => questions.includes(question)),
    );
    const describeSource = (question: Question) =>
      required(available.find((lesson) => lesson.questions.includes(question)));
    return [
      {
        id: `cs-${volume}-${group.id}`,
        title: group.title,
        textbookTitle: '平台语文专项练习',
        page: Math.min(...origins.map((lesson) => lesson.page)),
        goal: group.goal,
        prerequisite:
          '按孩子当前学习范围自由选择；只包括目前已经开放的原创任务，未制作课目不进入题库。',
        parentTip: group.manual
          ? '本组全部是人工确认活动。可以跳过，不自动评分认读、发音、复述、笔顺或书写质量，也不计入客观正确率。按原题说明准备教材或教师示范，缺示范可跳过。'
          : '复用原课包题目，保留原ID与知识点，不冒充全新题或完整教材测验。提示与家长帮读分别记录；选择6/12/20题时以实际题库数量为上限。',
        version: 1,
        status: 'available' as const,
        steps: [{ title: '按已开放范围选择专项', text: group.goal }],
        questions,
        reviewQuestions: reviews,
        review: {
          date: '2026-09-30',
          reviewer: '已开放课包范围组织与程序校验',
          notes: `复用来源：${[...new Set(questions.map((question) => describeSource(question).title))].join('；')}。原题ID、知识点、材料与判分规则不变；不是教材正式单元，不代表未开放正式课目完成。`,
        },
      },
    ];
  });
}
