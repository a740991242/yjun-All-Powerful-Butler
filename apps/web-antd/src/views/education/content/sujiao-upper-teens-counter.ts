import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-teens-counter';
function tasks(review: boolean): Question[] {
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
    hint: '先看珠在十位还是个位；十位一珠表示一个十，个位一珠表示一个一。',
    explanation,
  });
  const added = review ? 4 : 2;
  const beforeAdd = review ? 12 : 13;
  const beforeSubtract = review ? 18 : 15;
  const removed = review ? 4 : 2;
  return [
    ...Array.from({ length: 9 }, (_, index): Question => {
      const ones = review ? 9 - index : index + 1;
      return {
        ...q(
          `read-${index}`,
          `图中十位、个位的珠表示多少？写完整数，不只数珠颗数。${review ? '重新观察这次各位珠数，不能照抄上次。' : ''}`,
          { kind: 'number', value: 10 + ones },
          `十位一颗是10，个位${ones}颗是${ones}，合起来${10 + ones}；共${ones + 1}颗珠不表示${ones + 1}个物品。`,
        ),
        visual: { kind: 'digit-counter', tens: 1, ones },
      };
    }),
    {
      ...q(
        'add-after',
        `计数器先表示${beforeAdd}，现在只在个位添${added}颗珠。依次填操作后十位有几颗、个位有几颗；问操作后，不填原来的珠数。`,
        { kind: 'steps', values: [1, (beforeAdd % 10) + added] },
        `个位${beforeAdd % 10}+${added}=${(beforeAdd % 10) + added}，十位仍一颗，结果${beforeAdd + added}。没有满十，不换十。`,
      ),
      visual: { kind: 'digit-counter', tens: 1, ones: beforeAdd % 10 },
    },
    {
      ...q(
        'subtract-after',
        `计数器先表示${beforeSubtract}，现在从个位取下${removed}颗珠。依次填操作后十位有几颗、个位有几颗；问剩下，不填取下的颗数。`,
        { kind: 'steps', values: [1, (beforeSubtract % 10) - removed] },
        `个位${beforeSubtract % 10}−${removed}=${(beforeSubtract % 10) - removed}，散珠够取，十位仍一颗，结果${beforeSubtract - removed}。本题不拆十。`,
      ),
      visual: { kind: 'digit-counter', tens: 1, ones: beforeSubtract % 10 },
    },
  ];
}
export const sujiaoUpperTeensCounterLesson: Lesson = {
  id,
  title: '计数器的十几：逐珠添取与加减',
  textbookTitle: '认识11～19·计数器操作',
  page: 79,
  version: 1,
  status: 'available',
  goal: '计数器完整表示11～19，分清珠颗数与物品量，实际逐珠添取和不进位不退位计算。',
  prerequisite:
    '认识十与一及11～19；准备有十位/个位两杆标记的儿童计数器，或自制两栏可移动大纸珠模型。小珠由家长保管，不入口。',
  parentTip: `ISBN ${source.isbn}同版79～83页已实际查看。每珠按所在位单位计量，不用传统算盘上珠五规则；上方备用珠不计。自制十位/个位两栏大纸珠属于实际可移动模型替代，如实标注，不称实体原教具。个位保持0～9，本课11～19只一颗十位与1～9个位，不引入20或借位进位。扎棒与拨珠分别记录；真实九种表示、拨珠加减、说明三项人工，反思null，计划另列。旧会话与备份格式保持，教师最终审校未核验。`,
  steps: [
    {
      title: '两个一，所在位不同',
      text: '计数器十位一颗珠表示一个十，个位一颗表示一个一。所以左一颗、右一颗是11，虽然只有两颗珠，却表示十一件物品。十位与个位标签必须明确；看杆的位置与单位，不能把两颗相加说成数量2。',
      visual: { kind: 'digit-counter', tens: 1, ones: 1 },
      activity:
        '实际在标十位/个位的计数器或两栏可移动纸珠模型放好各一颗，指杆说单位，另点十一件物品核对。自制替代如实注明。',
    },
    {
      title: '逐颗添加，九种十几一个不漏',
      text: '十位保持一颗，个位从一颗开始，每次添一颗，依次表示11、12、13、14、15、16、17、18、19。到19个位九颗就停，不把十颗塞进个位当规范状态。再每次取一颗，读19到11，到个位一颗停止。',
      visual: { kind: 'digit-counter', tens: 1, ones: 9 },
      activity:
        '实际完整做11到19九种表示，每次指十位/个位、读总数并写数字，再反向逐颗取回11。每次操作后核对，不只看网页图或只做三例。',
    },
    {
      title: '十三加二，只添个位两颗',
      text: '先表示13，十位一颗、个位三颗。实际往个位添两颗，三颗变五颗，十位没有改变；最后一个十与五个一表示15。也可从13接数14、15。起点13不算第一颗新增，所得不是“珠共六颗所以数量6”。',
      visual: { kind: 'digit-counter', tens: 1, ones: 3 },
      activity:
        '实际重摆13，逐颗添个位两颗，分别读14、15；写13+2=15并说明十位为何不动。变化练习重摆12添4到16，不沿上次结果接着操作。',
    },
    {
      title: '十五减二，只取个位两颗',
      text: '先恢复15，十位一颗、个位五颗。从个位取两颗，剩三颗，整十还在，结果13。散珠够取，不拆十；取下两颗不是剩下两颗。也可从15倒数14、13，每取一颗数一步。',
      visual: { kind: 'digit-counter', tens: 1, ones: 5 },
      activity:
        '实际重摆15取个位两颗到13，写15−2=13。再重摆18取4到14，用总量或反向添回核对；不要从上道题已变化的状态开始。',
    },
    {
      title: '指单位，说真实做过的过程',
      text: '11～19都由一个十和几个一组成；位上珠数、全部珠颗数、表示的物品总数是不同问题。实际手动添取、核对与讲理由分别记录，网页答对不能自动确认手已经操作。未做可待做，下一次想做的另列计划。',
      activity:
        '实际纸上画出有十位/个位标记的13、16、19、18四个计数器，逐珠核对；比较13与16、19与18，都先看相同的一个十再看个位。任选三种说两位珠数、珠总颗数与表示总量，再解释一次加减哪位变化；帮助如实记。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-nine-states',
        '实际用有明确十位/个位标记的计数器或可移动大纸珠模型，十位一颗保持，个位逐颗从1到9表示11～19九种，再逐颗取回11。每种指杆、读数、写数并核对；材料替代如实记，不以看图或扎棒代替拨珠。',
      ],
      [
        'actual-add-subtract',
        '实际分别恢复起始13添个位2到15、15取个位2到13，再重摆12添4到16、18取4到14。每次记两位操作前后珠数、算式和总量；用逐颗接数/倒数或反向变化核对，不接着上道题状态误算。',
      ],
      [
        'actual-explain',
        '实际纸上分别画十位/个位标记清楚的13、16、19、18四个计数器，逐珠核对并比较13与16、19与18。任选三种指杆说单位、两位珠数、珠总颗数与物品总量；再解释实际加减十位为何保持、哪位添取。真实帮助/困难及计划分开，未操作或未画暂跳。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际移动珠并核对后确认，自制替代/帮助如实记；未做暂跳。',
      explanation: '实际拨珠与说明人工独立记录，不以客观题答对替代。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实计数器表示或添取的一例，注明两位如何变化、怎样核对和帮助/困难。未做如实说；未来计划另列。',
      rule: { kind: 'reflection' },
      hint: '实际例子和将来打算分开。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整十几计数器与添取单位核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷79～83页已实际查看。复习九图个位次序改变，加法12添4、减法18取4重新读条件；全部实际操作与网页图分开。教师最终审校未核验。',
  },
};
