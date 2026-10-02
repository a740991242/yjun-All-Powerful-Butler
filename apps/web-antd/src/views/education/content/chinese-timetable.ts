import type { Lesson, Question, Visual } from '../learning/types';

import { required } from '../learning/required';

const firstTable: Extract<Visual, { kind: 'timetable' }> = {
  kind: 'timetable',
  days: ['星期一', '星期二', '星期三'],
  rows: [
    { period: '第一节', subjects: ['语文', '数学', '美术'] },
    { period: '第二节', subjects: ['数学', '科学', '语文'] },
    { period: '第三节', subjects: ['音乐', '美术', '体育'] },
  ],
};
const reviewTable: typeof firstTable = {
  kind: 'timetable',
  days: ['星期三', '星期四', '星期五'],
  rows: [
    { period: '第一节', subjects: ['科学', '语文', '音乐'] },
    { period: '第二节', subjects: ['美术', '数学', '体育'] },
    { period: '第三节', subjects: ['数学', '音乐', '语文'] },
  ],
};
function locate(
  table: typeof firstTable,
  day: number,
  period: number,
  index: number,
  review = false,
): Question {
  const subject = required(required(table.rows[period]).subjects[day]);
  return {
    id: `cu-timetable-${review ? 'r' : 'q'}${index}`,
    knowledge: 'cu-timetable-locate',
    prompt: `只看下面这张练习表：${table.days[day]}的${required(table.rows[period]).period}是什么课？`,
    visual: table,
    rule: { kind: 'choice', value: subject },
    choices: ['语文', '数学', '美术', '科学', '音乐', '体育'].map((label) => ({
      id: label,
      label,
    })),
    hint: '先在上面找到星期，再沿这一列找到所问节次；两者交叉的格子就是课程。',
    explanation: `${table.days[day]}这一列与${required(table.rows[period]).period}这一行交叉，格子中写着“${subject}”。`,
  };
}
const questions = [
  [0, 0],
  [1, 1],
  [2, 2],
  [0, 2],
  [2, 1],
  [1, 0],
].map(([day, period], index) =>
  locate(firstTable, required(day), required(period), index + 1),
);
export const timetableLesson: Lesson = {
  id: 'cu-u3-6-timetable',
  textbookTitle: '语文园地三',
  title: '读课程表：找星期与节次（原创活动）',
  page: 42,
  goal: '对照已核验的课程表活动范围，用行、列交叉定位信息；这张表是原创练习材料，不替代整个语文园地。',
  prerequisite: '知道星期和第一、第二等顺序词；家长可以帮读题和课程名称。',
  parentTip:
    '本课只练习读表，不新增识字或会写要求。实际课程以学校安排为准，不要求填写姓名、学校或上传个人课程表。',
  version: 1,
  status: 'available',
  steps: [
    {
      title: '先看星期和节次',
      text: '课程表有两种信息：上面的列标题告诉我们是星期几，左边的行标题告诉我们是哪一节。这里每天只列三节课，是读表用的原创例子。',
      visual: firstTable,
      activity:
        '指一指星期一、星期三，再指一指第一节和第三节；不要只看课程名称猜答案。',
    },
    {
      title: '找交叉的格子',
      text: '找星期二第二节时，先找到星期二这一列，再找到第二节这一行。交叉的格子写着科学。题目问法改变时，也要重新确认星期和节次。',
      visual: firstTable,
      activity:
        '请家长问一个星期和节次，孩子指格子并说出课程名。可以先帮读，逐步自己找。',
    },
    {
      title: '换张表也要重新找',
      text: '换表后，星期标题和格子里的课程会改变，不能记住上一张表的答案。先读标题，再找行、列。遇到实际课程临时调整，要看学校的新安排。',
      visual: reviewTable,
      activity: '分别找出星期四第一节、星期五第三节；说一说自己的查找顺序。',
    },
  ],
  questions: [
    ...questions,
    {
      id: 'cu-timetable-read',
      knowledge: 'cu-timetable-manual',
      prompt:
        '请孩子任选这张表的一个星期和节次，指到对应格子，说出课程并解释查找顺序。家长可以帮读课程名，完成后人工确认。',
      visual: firstTable,
      rule: { kind: 'manual' },
      hint: '说清先找哪一列，再找哪一行。',
      explanation: '口头解释采用人工确认，不自动判断表达水平或是否掌握读表。',
    },
    {
      id: 'cu-timetable-apply',
      knowledge: 'cu-timetable-manual',
      prompt:
        '与家长一起看自己的学校课程安排，找出明天需要准备的学习用品；不用把实际课程表输入本站。暂时没有课程安排时可以跳过。',
      rule: { kind: 'manual' },
      hint: '先确认明天是星期几，再逐节看课程。',
      explanation:
        '这是生活应用的人工完成记录，不纳入客观正确率，不收集个人学校信息。',
    },
  ],
  reviewQuestions: [
    [2, 0],
    [1, 2],
    [0, 1],
    [2, 2],
    [0, 2],
    [1, 1],
  ].map(([day, period], index) =>
    locate(reviewTable, required(day), required(period), index + 1, true),
  ),
  review: {
    date: '2026-09-30',
    reviewer: '官方页面范围与原创内容校验',
    notes:
      '上册第42页已查看，确认有课程表信息读取活动。这里使用不同日期、课程、结构和问题的原创表格，不复制教材表格；不新增字表要求，不宣称整个园地已审校，尚待教师人工审校。',
  },
};
