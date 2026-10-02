import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-number-unit-review';
function tasks(review: boolean): Question[] {
  const ones = review ? 4 : 3;
  const tens = review ? 5 : 4;
  const value = tens * 10 + ones;
  const rank = review ? 47 : 38;
  const start = review ? 38 : 28;
  const q = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const choices = (items: [string, string][]) =>
    items.map(([id, label]) => ({ id, label }));
  return [
    {
      ...q('life-meaning'),
      prompt: `虚构街道有一间教室，门上写“${review ? 56 : 36}号”。只看这个门牌，能知道什么？`,
      choices: choices([
        ['label', '它是教室的编号，不能据此确定里面的人数。'],
        ['count', '教室一定有与门牌相同数量的人。'],
      ]),
      rule: { kind: 'choice', value: 'label' },
      hint: '先问这个数用于标记、数物品还是说明顺序。',
      explanation: '门牌是编号，实际人数需另行计数；示例不记录真实住址。',
    },
    {
      ...q('compose'),
      prompt: `${tens}个十和${ones}个一合起来是多少？`,
      visual: { kind: 'place-value', value },
      rule: { kind: 'number', value },
      hint: '按十数整捆，再加单个一。',
      explanation: `${tens * 10}和${ones}合起来是${value}。`,
    },
    {
      ...q('zero-digit'),
      prompt: `${tens * 10}的十位数字和个位数字依次是多少？`,
      rule: { kind: 'steps', values: [tens, 0] },
      hint: '个位没有剩余的单个一，写0占位。',
      explanation: `十位是${tens}，个位是0；空白不能代替0。`,
    },
    {
      ...q('count-by-two'),
      prompt: `从${start}开始，每次增加2，接着两个数依次是多少？`,
      rule: { kind: 'steps', values: [start + 2, start + 4] },
      hint: '跨过整十仍按同样步长继续，不只改个位。',
      explanation: `依次是${start + 2}、${start + 4}。`,
    },
    {
      ...q('compare'),
      prompt: `比较${review ? '45 ○ 54' : '43 ○ 34'}，填哪个符号？`,
      choices: choices([
        ['>', '>'],
        ['<', '<'],
        ['=', '='],
      ]),
      rule: { kind: 'choice', value: review ? '<' : '>' },
      hint: '都是两位数，先比较十位。',
      explanation: review
        ? '45的十位4小于54的十位5，所以45＜54。'
        : '43的十位4大于34的十位3，所以43＞34。',
    },
    {
      ...q('order'),
      prompt: `纸面排号游戏从1号起，前面没有漏号，每次完成一位；现在正要轮到${rank}号，已经完成了多少位？`,
      rule: { kind: 'number', value: rank - 1 },
      hint: '当前这一位还没完成，已完成到前一号。',
      explanation: `已完成1～${rank - 1}号，共${rank - 1}位；编号、正在轮到和完成数量分开。`,
    },
    {
      ...q('estimate'),
      prompt: '面对一盘散放的纸片，哪种做法能真实区分估计与核对？',
      choices: choices([
        ['estimate', '先用一组10片作参照估计并记录，再逐项或分组数清。'],
        ['copy', '先数出总数，再把准确总数填写成先前的估计。'],
      ]),
      rule: { kind: 'choice', value: 'estimate' },
      hint: '先估后数，允许估计和实数不同。',
      explanation: '不倒填估计，不把偏差自动当失败；观察摆放疏密，再实际核对。',
    },
    {
      ...q('reason'),
      prompt: `一个两位数大于${tens * 10}、小于${(tens + 1) * 10}，个位是${ones}。这个数是多少？`,
      rule: { kind: 'number', value },
      hint: '同时满足范围和个位条件，不能只看一条线索。',
      explanation: `十位只能是${tens}，个位${ones}，所以是${value}；代回两条条件核对。`,
    },
    {
      ...q('unknown'),
      prompt: '桌子数量尚未数过，记录表空着。下面哪种说法正确？',
      choices: choices([
        ['unknown', '空白是未记录，不能说桌子有0张。'],
        ['zero', '没填写就表示桌子有0张。'],
      ]),
      rule: { kind: 'choice', value: 'unknown' },
      hint: '确实数过没有与尚未记录不同。',
      explanation: '分别计数桌子和椅子，未做保留待做，不编造班级数量。',
    },
    {
      ...q('relation'),
      prompt: `同一单位的两组纸片分别有${review ? '54和45' : '43和34'}片，哪个说法正确？`,
      choices: choices([
        ['greater', '第一组比第二组多，第二组比第一组少。'],
        ['less', '第一组比第二组少，第二组比第一组多。'],
      ]),
      rule: { kind: 'choice', value: 'greater' },
      hint: '两种说法换比较对象，数量事实不变。',
      explanation: review
        ? '54大于45，两种反向说法说明同一关系。'
        : '43大于34，两种反向说法说明同一关系；不建立“多一些”的固定差值阈值。',
    },
  ];
}
export const sujiaoNumberUnitReviewDraft: Lesson = {
  id,
  title: '认识20～99单元整理：生活中的数与核对',
  textbookTitle: '认识20～99·整理与评价',
  page: 52,
  version: 1,
  status: 'preparing',
  goal: '区分生活数字的编号、顺序和数量，综合核对组成、跨十数数、比较与简单推理，实际计数并分别反思三项学习内容。',
  prerequisite:
    '已学习数位、数数、数表、比较、估数和本单元探索；准备纸笔、小棒或纸片，教室活动有条件时由老师组织。',
  parentTip: `依据ISBN ${source.isbn}印刷42～52页核对，补充42页生活数字、45页教室桌椅实际计数和52页三项评价。数值与场景原创，不复制原街景和班级人数。其余数表、数阵、条件找数、月历与有限珠等在独立课中学习。实际观察计数书写表达需人工确认，未做保留待做，自评不作为自动能力分数；不要求保存真实住址、个人名单或照片。`,
  steps: [
    {
      title: '同一个数字，用途可能不同',
      text: '虚构门牌36号只是标记。纸卡按顺序排到第36位表示位置。确实数了36张纸片才是数量。容量最多36人表示上限，不能由此断言已经坐满。先说情境和单位，再解释数字。',
      activity:
        '观察手边教材或安全室内物品上的数字，分别找编号、顺序或数量例子。无需去道路观察或保存真实地址。',
    },
    {
      title: '组成与顺序分别核对',
      text: '43按每10根一捆表示4个十和3个一。40个位写0占位，不是漏写。纸面排号从1开始、没有漏号且每次完成一位，正要轮到38号时只完成到37号；如果有跳号或一次多人，不能照搬这个数量。',
      visual: { kind: 'place-value', value: 43 },
      activity:
        '实际摆一个整十数和一个个位非0的两位数，读、写、说明组成。用纸卡模拟轮号，区分正在轮到和已经完成。',
    },
    {
      title: '桌子和椅子分开数，先估再核对',
      text: '有条件时在老师安排下分别数教室桌子与椅子，不能假定一张桌子对应一把椅子，也不能由人数倒推出家具数。未数过保留空白，实际没有才记录0。另一盘安全纸片请家长预备，暂不告知孩子总数；孩子先估、记录，再数出准确总数，估计与实数可以不同。',
      activity:
        '无教室条件时桌椅任务保留待做；可另数家中物品但不能写成全班结果。数清后在纸上分别记录名称、数量和单位，不保存人员或地点信息。',
    },
    {
      title: '比较和推理需要完整条件',
      text: '43大于34，第一组多等价于第二组少，但“多一些/多得多”需结合题境，不给所有情况规定同一差值。猜数同时看范围与数位，再代回核对；只满足一条不够。数表、圆形数阵等各自按原位置规则，不能把不同版型的邻格规律混用。',
      activity:
        '选两个同单位数量实际比较，说两种相反方向的关系。写一组20～99的范围与个位线索，请同伴猜数并核对每一条。',
    },
    {
      title: '三项学习内容分别评价',
      text: '分别回顾：数的组成与数量/顺序；数的大小与数量关系表达；在认数和比较中进行简单推理。能举哪次实际任务？哪项还需练习？没有做过就如实记录，下一步计划与已完成经历分开，填写反思不自动给星级或确认真实任务。',
      activity:
        '逐项写自己的发现或待核对内容。可说给家长听后按原话记录，不照抄统一答案。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'life',
        '实际观察一个安全室内物品或教材上的数字，说清它表示编号、顺序、数量或容量；不要保存真实住址、名单或照片。',
      ],
      [
        'classroom',
        '有教室条件且老师组织时，实际分别数桌子和椅子，纸上记录数量与单位并逐项核对。不由人数推算、不假定一桌一椅；无条件保留待做，家庭计数不冒充全班。',
      ],
      [
        'compose',
        '实际摆一个20～99整十数和一个个位非0的两位数，在纸上写数、读数、说明十位个位；再用纸卡实际模拟从1号逐位轮到当前号码并数已完成数量。',
      ],
      [
        'estimate',
        '请家长预备20～99片安全纸片，暂不告知孩子总数；孩子先用10片作参照估计并写下估计，再分组或逐项数清记录实数，口述差异。不先数再倒填估计，不要求两数完全一样。',
      ],
      [
        'reason',
        '选择两个同单位的实际数量比较，分别说谁比谁多/少；在纸上写一组20～99猜数线索，让同伴猜并逐条核对。多种合法线索都可，不强求唯一表达。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-manual-${key}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实操作、纸笔与表达后才确认，无条件暂跳，计划另列。',
      explanation: '客观答题和填写反思不自动代替真实观察、计数或表达。',
    })),
    ...[
      [
        'composition',
        '回顾数的组成、数量与顺序：用一次实际摆写或轮号例子说明哪里清楚、哪里还要核对。',
      ],
      [
        'comparison',
        '回顾数的大小与数量关系表达：举一次实际比较，说出自己的发现或需要练习的地方。',
      ],
      [
        'reasoning',
        '回顾简单推理：自己怎样同时检查范围、数位或比较线索？写实际发现或下一步计划，未做也如实记。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-evaluation-${key}`,
      knowledge: `${id}-evaluation-${key}`,
      prompt: required(prompt),
      rule: { kind: 'reflection' },
      hint: '保留自己的评价和多种表达，实际经历与计划分开。',
      explanation:
        '开放评价correct=null，不计客观正确率，不自动产生星级或能力结论。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '逐页范围与原创整理教学核对',
    notes: `依据ISBN ${source.isbn}已读42～52页。数字含义、教室实际计数、三项评价独立覆盖，复习改变组成、跨十、比较、顺序与推理条件。未知版次印次，不复制原图，不据此宣称全单元或全册最终教师审校完成。`,
  },
};
