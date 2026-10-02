import type { Book, Lesson, Question, Unit } from '../learning/types';

import { required } from '../learning/required';

function unit(book: Book, id: string): Unit {
  return required(book.units.find((item) => item.id === id));
}
function originalLessons(item: Unit) {
  return item.lessons.filter(
    (lesson) => lesson.status === 'available' && !lesson.reference,
  );
}
/** Practice groups retain the current edition's original task IDs and snapshots. */
export function sujiaoSpecialties(book: Book): Lesson[] {
  return book.units.map((item) => {
    const sources = originalLessons(item);
    if (sources.length === 0)
      throw new Error(`Missing Sujiao practice source: ${item.id}`);
    return {
      id: `sj-special-${book.volume}-${item.id}`,
      title: `${item.title} · 专项练习`,
      textbookTitle: '平台专项练习',
      page: item.page,
      version: 1,
      status: 'available',
      goal: `按当前学习进度练习“${item.title}”，从本册已开放原创课包中轮流选取知识点。`,
      prerequisite: '可直接选择，不要求先完成原课；没有材料的实物任务可跳过。',
      parentTip:
        '复用苏教本册已编写题目，保留原ID和知识点，不把重复练习当新题，不用完成状态代替掌握评价。',
      steps: [
        {
          title: '选定本册范围',
          text: '这是平台练习分组，不是教材新增单元，也不是完整教材测验。',
        },
      ],
      questions: sources.flatMap((lesson) => lesson.questions),
      reviewQuestions: sources.flatMap(
        (lesson) => lesson.reviewQuestions ?? [],
      ),
      review: {
        date: '2026-10-03',
        reviewer: '本册已开放原创课包范围与快照组织检查',
        notes: `只复用${book.id}的${sources.map((lesson) => lesson.id).join('、')}；保留原题来源和实际操作/反思记录边界，不宣称重新审校教材正文或学校选用。`,
      },
    };
  });
}
function objectives(source: Unit, count: number): Question[] {
  const course = required(originalLessons(source)[0]);
  const questions = course.questions
    .filter((q) => q.rule.kind !== 'manual' && q.rule.kind !== 'reflection')
    .slice(0, count);
  if (questions.length !== count)
    throw new Error(`Insufficient bridge source: ${course.id}`);
  return questions;
}
/** Connections follow Sujiao's actual chapter order, never substitute PEP IDs. */
export function sujiaoTransitions(upper: Book, lower: Book): Lesson[] {
  const specs = [
    {
      id: 'numbers',
      title: '数位衔接：十几到20～99',
      from: unit(upper, 'u5'),
      to: unit(lower, 'u4'),
      goal: '回顾一个十和几个一，再联系多个十与个位的组成。',
    },
    {
      id: 'calculation',
      title: '计算衔接：十的分合到进退位',
      from: unit(upper, 'u4'),
      to: unit(lower, 'u1'),
      goal: '先回顾十与数量关系，再尝试下册进位加法和退位减法的起始任务。',
    },
    {
      id: 'shapes',
      title: '图形衔接：立体物体到平面轮廓',
      from: unit(upper, 'u3'),
      to: unit(lower, 'u2'),
      goal: '区分立体物体、物体的一个面和描出的平面轮廓。',
    },
  ];
  return specs.map((spec) => ({
    id: `sj-transition-${spec.id}`,
    title: spec.title,
    textbookTitle: `${spec.from.title} → ${spec.to.title}`,
    page: spec.to.page,
    version: 1,
    status: 'available',
    goal: spec.goal,
    prerequisite: '不要求先完成上册，也不将这组结果当作进入下册的门槛。',
    parentTip:
      '这是平台原创课包的跨册组织，先让孩子尝试；帮读与方法提示分别记录。原题可以在原课中再遇到，不称从未见过的新题。',
    steps: [
      { title: '连接上下册', text: spec.goal },
      {
        title: '说出自己的方法',
        text: '可以用纸片、积木或自己的话解释；未进行的实物操作不确认已完成。',
        activity: '选择一个实际完成的问题说明理由。',
      },
    ],
    questions: [...objectives(spec.from, 2), ...objectives(spec.to, 4)],
    reviewQuestions: [
      ...originalLessons(spec.from),
      ...originalLessons(spec.to),
    ].flatMap((lesson) => lesson.reviewQuestions ?? []),
    review: {
      date: '2026-10-03',
      reviewer: '苏教已开放上下册课包组织与来源检查',
      notes: `对应${upper.id}/${spec.from.id}与${lower.id}/${spec.to.id}，保留所选原题的ID、知识点、提示、图示和判题规则；不是教材新增单元或能力测评。`,
    },
  }));
}
