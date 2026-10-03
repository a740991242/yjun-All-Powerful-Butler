import type { ClockVisual, Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-everyday-time';
const clock = (hour: number, minute: 0 | 30): ClockVisual => ({
  kind: 'clock',
  hour,
  minute,
});
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const hour = review ? 6 : 8;
  const half = review ? 9 : 7;
  const choices = (value: string) => [
    { id: 'correct', label: value },
    { id: 'other', label: value.endsWith('时半') ? `${half}时` : '0时' },
    { id: 'minute', label: value.endsWith('时半') ? '6时' : '6时半' },
  ];
  return [
    {
      id: `${prefix}-whole`,
      knowledge: `${id}-whole`,
      prompt: '长针指向12，短针指向图中的数字。现在是几时？只填小时数。',
      visual: clock(hour, 0),
      rule: { kind: 'number', value: hour },
      hint: '整时长针在12，小时数看短针，不把长针所指的12当小时数。',
      explanation: `短针指向${hour}，长针指向12，是${hour}时。`,
    },
    {
      id: `${prefix}-half`,
      knowledge: `${id}-half`,
      prompt: '长针指向6，短针在两个相邻数字中间。图中是哪个时刻？',
      visual: clock(half, 30),
      choices: choices(`${half}时半`),
      rule: { kind: 'choice', value: 'correct' },
      hint: '长针在6表示半时。短针已经经过哪个小时数字，就是那个小时的“半”，不把6当小时数。',
      explanation: `短针在${half}和${half + 1}中间，长针指向6，是${half}时半。`,
    },
    {
      id: `${prefix}-long-whole`,
      knowledge: `${id}-long-whole`,
      prompt: '观察这个整时钟面，较长的虚线针指向哪个数字？',
      visual: clock(review ? 11 : 4, 0),
      rule: { kind: 'number', value: 12 },
      hint: '这里问长针所指数字，不是问现在几时。',
      explanation: '整时长针指向12；时刻中的小时数看短针。',
    },
    {
      id: `${prefix}-long-half`,
      knowledge: `${id}-long-half`,
      prompt: '观察这个半时钟面，较长的虚线针指向哪个数字？',
      visual: clock(review ? 10 : 3, 30),
      rule: { kind: 'number', value: 6 },
      hint: '长针较长且画成虚线，半时指向表盘下方。',
      explanation: '半时长针在6，短针在相邻两个小时数字中间。',
    },
    {
      id: `${prefix}-short-half`,
      knowledge: `${id}-short-half`,
      prompt: `图中的短针在${half}和${half + 1}之间，应该怎样理解？`,
      visual: clock(half, 30),
      choices: [
        { id: 'between', label: `已经过${half}时，还没到${half + 1}时` },
        { id: 'next', label: `已经是${half + 1}时整` },
        { id: 'six', label: '长针指6，所以是6时整' },
      ],
      rule: { kind: 'choice', value: 'between' },
      hint: '半时时短针也会往下一个数字移动，不会停在前一个整点数字上。',
      explanation: `是${half}时半，还没到${half + 1}时。长针在6不代表6时。`,
    },
    {
      id: `${prefix}-order`,
      knowledge: `${id}-order`,
      prompt: review
        ? '模拟同一天上午的安排：6时起床，6时半早餐，7时出门。按先后选择三项。'
        : '模拟同一天上午的安排：8时到校，8时半活动，9时上课。按先后选择三项。',
      choices: review
        ? [
            { id: 'a', label: '6时起床' },
            { id: 'b', label: '6时半早餐' },
            { id: 'c', label: '7时出门' },
          ]
        : [
            { id: 'a', label: '8时到校' },
            { id: 'b', label: '8时半活动' },
            { id: 'c', label: '9时上课' },
          ],
      rule: { kind: 'sequence', values: ['a', 'b', 'c'] },
      hint: '这是同一天上午，先整时，再该小时的半时，然后到下一个整时。按顺序点击，实际学校安排另看通知。',
      explanation: review
        ? '6时→6时半→7时，示例活动按这个顺序发生。'
        : '8时→8时半→9时，示例活动按这个顺序发生。',
    },
    {
      id: `${prefix}-meaning`,
      knowledge: `${id}-meaning`,
      prompt: review
        ? '“9号教室”中的9一定表示9时吗？'
        : '“8路公交”中的8一定表示8时吗？',
      choices: [
        { id: 'code', label: '不一定，这是编号；时刻要另看钟表或时间说明' },
        { id: 'time', label: '一定，所有数字都表示时刻' },
      ],
      rule: { kind: 'choice', value: 'code' },
      hint: '先看数字在什么情境中使用。编号、数量、时刻不是同一个意思。',
      explanation: '教室或线路编号不是活动时刻，不能看到数字就当作几点。',
    },
    {
      id: `${prefix}-twelve`,
      knowledge: `${id}-twelve`,
      prompt: review
        ? '短针在12和1中间，长针在6，图中时刻是什么？'
        : '图中长针和短针都指向12，时刻是什么？',
      visual: clock(12, review ? 30 : 0),
      choices: [
        { id: 'twelve', label: review ? '12时半' : '12时' },
        { id: 'zero', label: '0时' },
        { id: 'one', label: '1时' },
      ],
      rule: { kind: 'choice', value: 'twelve' },
      hint: '这里使用1～12的表盘读法。经过12后下一个小时数字是1，半时不等于已经到1时。',
      explanation: review
        ? '短针已经过12，还未到1，长针在6，读12时半。'
        : '两针指12，按这个表盘读法读12时。',
    },
    {
      id: `${prefix}-context`,
      knowledge: `${id}-context`,
      prompt: `只看这个${hour}时钟面，没有日期或活动说明，能确定是上午还是晚上吗？`,
      visual: clock(hour, 0),
      choices: [
        { id: 'no', label: '不能，还需要看活动或上午、晚上等说明' },
        { id: 'yes', label: '能，这个钟面只能表示上午' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '同样的指针位置一天会再出现，结合生活情境说时刻。',
      explanation:
        '钟面本身没有标上午或晚上，需要时间情境；不能凭图猜实际作息。',
    },
  ];
}
function activityTasks(review: boolean): Question[] {
  const activities: [string, number, 0 | 30][] = review
    ? [
        ['起床', 6, 0],
        ['早餐', 6, 30],
        ['出门', 7, 0],
        ['午后整理', 12, 30],
      ]
    : [
        ['到校', 8, 0],
        ['升旗', 8, 30],
        ['上课', 9, 0],
        ['吃饭', 12, 0],
      ];
  const label = (hour: number, minute: 0 | 30) =>
    `${hour}时${minute === 30 ? '半' : ''}`;
  const labels = activities.map(([, hour, minute]) => label(hour, minute));
  return [
    ...activities.map(([activity, hour, minute], index): Question => ({
      id: `${id}-${review ? 'r' : 'q'}-activity-${index}`,
      knowledge: `${id}-activity-${index}`,
      prompt: `${review ? '本站原创家庭示例' : '教材第85页活动示例'}：“${activity}”。观察原创重绘的钟面，选择相应时刻。这个示例不代表你家或学校的实际安排。`,
      visual: clock(hour, minute),
      choices: [...new Set([...labels, '6时', '12时'])].map((value) => ({
        id: value,
        label: value,
      })),
      rule: { kind: 'choice', value: label(hour, minute) },
      hint: '先看长针指12还是6，再看短针指向或已过哪个小时数字；活动名称不能代替看针。',
      explanation:
        minute === 0
          ? `长针在12，短针在${hour}，读${hour}时；“${activity}”只是本图示例。`
          : `长针在6，短针在${hour}与${(hour % 12) + 1}之间，读${hour}时半；“${activity}”只是本图示例。`,
    })),
    {
      id: `${id}-${review ? 'r' : 'q'}-activity-order`,
      knowledge: `${id}-activity-order`,
      prompt: review
        ? '本站原创同一天家庭示例：6时起床、6时半早餐、7时出门、12时半午后整理。按示例先后选择四项，不把这当自己家实际记录。'
        : '教材的同一天示例：8时到校、8时半升旗、9时上课、12时吃饭。按图示先后选择四项，不把这当你学校的规定。',
      choices: activities.map(([activity, hour, minute], index) => ({
        id: String(index),
        label: `${activity} · ${label(hour, minute)}`,
      })),
      rule: { kind: 'sequence', values: ['0', '1', '2', '3'] },
      hint: '本题已说明是同一天的示例，从早到午后按所给时刻排，不能仅凭习惯猜活动顺序。',
      explanation: `按这个示例，${activities.map(([activity, hour, minute]) => `${label(hour, minute)}${activity}`).join('→')}。真实作息须另看实际安排。`,
    },
  ];
}
const manual: [string, string][] = [
  [
    'real',
    '请家长带领看真实钟表，指出长针与短针，观察一个整时和一个半时，并说说当时在做什么。',
  ],
  [
    'dial',
    '用纸画钟面或使用学习钟，实际摆出一个整时和一个半时，说出两针的位置；半时短针应在相邻数字中间。',
  ],
  [
    'day',
    '和家长记录自己一天三项活动的大致时刻，说明上午或晚上，按实际先后整理；学校安排以实际通知为准。',
  ],
  [
    'reflect',
    '举例解释“长针指6”和“6时”为什么不是一回事，再说说看时间时还需要注意什么。',
  ],
];
export const sujiaoEverydayTimeLesson: Lesson = {
  id,
  textbookTitle: '练习八：活动与时刻',
  title: '一天中的活动：整时与半时观察',
  page: 85,
  status: 'available',
  version: 2,
  goal: '观察整时、半时的长短针，联系活动先后和时间情境；区分编号与时刻，实际操作另行确认。',
  prerequisite: '认识1～12；准备真实钟表或可摆动的学习钟、纸笔，由家长协助。',
  parentTip:
    '本课围绕已核验生活时刻观察补原创教学，不扩展到任意分钟读数、经过时间计算或24小时制。例示作息不是学校规定。长针虚线只是原创图例，实际钟表可能不一样。人工活动不由看图答对自动确认。第85页四场景分别按原钟面核验：到校8时、升旗8时半、上课9时、吃饭12时，仅属原书示例；不推断具体学校上午/下午制度。',
  steps: [
    {
      title: '找长针与短针',
      text: '钟面上有1～12。先找到较长和较短的两根针：较长的是分针，较短的是时针。原创图用细虚线画长针、粗实线画短针；真实钟表请家长一起辨认。',
      visual: clock(8, 0),
      activity: '在真实钟表或学习钟上找到两根针，指出哪根较长，哪根较短。',
    },
    {
      title: '整时看短针指几',
      text: '长针指12时，看短针指向哪个小时数字。图中短针指8，长针指12，读8时。两针都指12时，按表盘读法读12时，不把长针的12当成每个时刻的小时数。',
      visual: clock(8, 0),
      activity: '在学习钟上摆出两个不同整时，分别指出两针并口述。',
    },
    {
      title: '半时短针在两个数字中间',
      text: '长针指6，短针在两个相邻小时数字中间时，读前面小时数的“半”。图中短针已经过8、还没到9，是8时半。长针在6不表示6时；半时时短针也移动，不停在8上。',
      visual: clock(8, 30),
      activity:
        '摆出8时和8时半，比较两根针位置变化；家长检查半时短针在8和9中间。',
    },
    {
      title: '联系一天中的活动',
      text: '在同一天上午，8时→8时半→9时有先后。活动时间以实际生活安排为准。只有钟面不能确定上午或晚上，还要结合情境；8路公交是编号，也不表示8时。',
      activity:
        '记录实际三项活动，说明大致时刻与上午、晚上，再按先后整理并解释。',
    },
    {
      title: '四个场景，分别看钟面再联系活动',
      text: '同版教材第85页四幅图：到校钟面长针12短针8；升旗长针6、短针在8与9中间；上课长针12短针9；吃饭两针在12。分别读8时、8时半、9时、12时。本站只原创重绘钟面并文字说明活动，不复制人物插画。每幅都看两针，不能因为叫升旗或吃饭就猜几点。',
      visual: clock(8, 30),
      activity:
        '实际回原书逐幅说活动和时刻，共四幅一个不漏；纸面或学习钟分别摆出这四个钟面，整时/半时长短针都核对，再按该例先后说明。你的真实作息另记，没原书或没实际读摆可暂跳。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '先实际观察、操作或记录，再请家长确认；不只点按钮。',
      explanation:
        '真实钟表、手工摆针、口述和记录人工确认；图示答对不替代这些活动。',
    })),
    ...activityTasks(false),
    {
      id: `${id}-manual-source-four`,
      knowledge: `${id}-actual-source-four`,
      prompt:
        '实际回同版教材第85页练习八第8项，四幅图分别说红红在做什么、钟面是什么时刻，再分别在纸面或学习钟摆针核对。四幅均处理，不只观察一个整时一个半时；原书图示和自己的实际作息分开，未读或未摆如实记录。',
      rule: { kind: 'manual' },
      hint: '看原书实际图与两针，再说活动/时刻；本站重绘答对不能替原书已读或实物已摆。',
      explanation:
        '原书四图读取、真实摆针和口述独立人工，完成不代表掌握或学校实际安排相同。',
    },
  ],
  reviewQuestions: [...tasks(true), ...activityTasks(true)],
  review: {
    date: '2026-10-04',
    reviewer: '同版正文核验与原创教学检查',
    notes: `依据已实际查看ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第85页（${source.preview}）活动与时刻观察。原创钟面、情境、例示安排及题目，不复制教材插图；半时时短针位置按实际比例绘制，不扩展至任意分钟或经过时间计算。2026-10-04重新查看78～87页，第85页四场景逐钟核对并增加四图题、先后题与独立实际任务；旧13题和9复习保留，旧v1快照不改。本课不宣称全第五单元或全年完成。`,
  },
};
