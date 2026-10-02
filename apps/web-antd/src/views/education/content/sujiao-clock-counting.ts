import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-clock-counting';
function tasks(review: boolean): Question[] {
  const visual = { kind: 'clock-counting' } as const;
  const q = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    visual,
  });
  const choice = (
    key: string,
    prompt: string,
    good: string,
    bad: string,
  ): Question => ({
    ...q(key),
    prompt,
    choices: [
      { id: 'good', label: good },
      { id: 'bad', label: bad },
    ],
    rule: { kind: 'choice', value: 'good' },
    hint: '问题问小格、分组或刻线，先明确单位；本图不表示时刻。',
    explanation: good,
  });
  return [
    {
      ...q('group-size'),
      prompt: '从12沿顺时针到紧挨着的号码1，一共经过几个小格？',
      rule: { kind: 'number', value: 5 },
      hint: '数经过的间隔，不把起点长刻线算一格。',
      explanation: '号码之间均分成5个小格；起点到第一个短刻线才是第1格。',
    },
    {
      ...q('groups'),
      prompt:
        '从12顺时针绕完整一圈回到12，按相邻号码之间5格作为一组，一共经过几组？',
      rule: { kind: 'number', value: 12 },
      hint: '每走到下一个号码完成一组，直到回到起点。',
      explanation: '依次到1、2等直到12，共12组；5是每组格数，不是组数。',
    },
    {
      ...q('total'),
      prompt: '同一钟面按5格一组，完整一圈一共有多少个小格？',
      rule: { kind: 'number', value: 60 },
      hint: '从5开始按5继续，完整走一圈，最后不额外计起点。',
      explanation:
        '12组依次5、10、15、20、25、30、35、40、45、50、55、60，共60格。',
    },
    {
      ...q('part'),
      prompt: review
        ? '从10沿顺时针经过11、12、1到2，共经过多少个小格？'
        : '从12沿顺时针经过1、2到3，共经过多少个小格？',
      rule: { kind: 'number', value: review ? 20 : 15 },
      hint: '先数经过几个相邻号码间隔，再每组5格计数。经过12后仍继续，不归零。',
      explanation: review
        ? '走过4组，共20格，不是只看终点号码2。'
        : '走过3组，共15格，不是只看终点号码3。',
    },
    {
      ...q('continue'),
      prompt: `已经数到${review ? 15 : 5}个小格，继续每次走5格，接着三个格数依次是多少？`,
      rule: { kind: 'steps', values: review ? [20, 25, 30] : [10, 15, 20] },
      hint: '填写小格累计数，不是号码或经过的组数。',
      explanation: review ? '接着20、25、30格。' : '接着10、15、20格。',
    },
    {
      ...q('portion'),
      prompt: `只走${review ? 8 : 6}个相邻号码之间的间隔，每个有5格，共走了多少小格？`,
      rule: { kind: 'number', value: review ? 40 : 30 },
      hint: '每组5格，按5报累计数。',
      explanation: review ? '8组5格，共40格。' : '6组5格，共30格。',
    },
    choice(
      'closing',
      '绕完整一圈时，起点12怎样计数？',
      '起点只用于标记，计经过的间隔，回到起点不再多加1格。',
      '起点和终点是同一刻线，但必须额外多加1格。',
    ),
    choice(
      'time',
      '这幅没有指针的计数图，可以确定现在几点吗？',
      '不能，它只说明号码与小格分组，没有时刻信息。',
      '能，只要有钟面号码就能确定当前时刻。',
    ),
  ];
}
export const sujiaoClockCountingDraft: Lesson = {
  id,
  title: '钟面小格计数：按5分组与整圈核对',
  textbookTitle: '练习六·钟面分组计数',
  page: 50,
  version: 1,
  status: 'preparing',
  goal: '沿钟面小格按5计数，区分号码、组数、格数与起点刻线，整圈回到起点不重复计格，不把计数扩展成时刻判断。',
  prerequisite:
    '已会按5数及两位数；准备纸笔、安全计数片，有实物钟面时由家长指导观察。',
  parentTip: `依据ISBN ${source.isbn}已读印刷50页钟面每两号码间5小格与总格数范围。本站原创无指针图，长短刻线划分小格，不复制原图，不教授任意分钟或经过时间。网页只读，实际指认画记与分组计数单独确认，不由答题认定实际完成。`,
  steps: [
    {
      title: '看号码之间的小格',
      text: '号码是位置标记，不是经过的格数。顶部12，顺时针到1之间有5个小格，长刻线和短刻线是边界。起点本身不是一格，从起点到下一刻线才经过第1格。',
      visual: { kind: 'clock-counting' },
      activity: '实际在纸上画两条长刻线，其间补4条短刻线，逐段指认5个小格。',
    },
    {
      title: '每经过一个号码，按5累计',
      text: '从12开始，走到1累计5格，到2累计10格，到3累计15格。填的是格数，不是钟面号码。换起点从10经过11、12、1到2是4组，共20格，跨过12后不把累计数清零。',
      visual: { kind: 'clock-counting' },
      activity:
        '实际沿纸面或实物钟面边界逐格指认，再每5格报一次累计数。只观察，不拆钟或拨动内部零件。',
    },
    {
      title: '整圈回到同一条刻线',
      text: '完整一圈按相邻号码分成12组，每组5格，累计到60格。起点与终点是同一位置，回到12只表示最后一组已走完，不再额外加1。数的是间隔而非把首尾同一刻线重复数的次数。',
      visual: { kind: 'clock-counting' },
      activity:
        '纸上另画一圈并标同一起点，按组逐段记5、10等到60，核对没漏一组或多记起点。',
    },
    {
      title: '计数、摆物和时刻分开',
      text: '本图不画指针，只做分组计数，不能推当前几点，也不把小格自动当作这节课要计算的经过时间。可以另用同样计数片，每5片为一组摆放；组数、每组数量与全部数量分别说。真实观察摆放和纸笔任务独立确认。',
      activity:
        '实际用30片安全纸片每5片一组，先说6组，再按5数出30片。换40片重新摆数，不把材料张数当号码。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际画一段两长刻线之间有4条短刻线的图，逐格指认5个小格，并说明起点为什么不是第1格。',
      '实际用纸面钟面或安全实物钟面沿整圈逐组指认，纸上记录5、10等到60并核对首尾同一刻线不多加1。无实物可用纸图，不能只确认看过网页。',
      '实际用30片安全纸片按5片一组摆放，说清组数、每组片数与全部片数；换40片重新摆数。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际指认、画记或摆物后确认，没有操作保留待做。',
      explanation: '网页选择与填写不替代实际纸笔、指认或摆物。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '我怎样区分号码、组数和经过的小格？记录一次实际核对或还需要练习的地方，未做也如实写。',
      rule: { kind: 'reflection' },
      hint: '开放说明保留自己的表达，计划与已做分开。',
      explanation: '反思correct=null，不确认实际任务或计算能力。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '钟面计数范围和闭环边界核对',
    notes: `依据ISBN ${source.isbn}已读50页，原创无指针钟面。复习改变起点、部分圈跨度、分组数量与累计起点；完整钟面事实仍相同。版次印次未知，不宣称全单元最终审校完成。`,
  },
};
