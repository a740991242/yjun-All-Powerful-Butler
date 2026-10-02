import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-ten-counter';
function tasks(review: boolean): Question[] {
  const before = review ? 8 : 9;
  const values = review ? [3, 9, 10] : [4, 8, 10];
  const task = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    visual: Question['visual'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    visual,
    hint: '先看标出的十位、个位；每颗珠代表的计数单位不同，不把珠子总颗数当物品总数。',
    explanation,
  });
  return [
    ...values.map((n, i) =>
      task(
        `read-${i}`,
        '读这个计数器表示的物品数量。十位一颗表示一个十，个位一颗表示一个一，不直接相加珠颗数。',
        { kind: 'number', value: n },
        { kind: 'digit-counter', tens: Math.floor(n / 10), ones: n % 10 },
        `表示${n}，个位与十位珠代表不同单位。`,
      ),
    ),
    task(
      'before-parts',
      `添珠前，按十位珠颗数、个位珠颗数、代表物品总数的顺序填三个数。注意总数不是添完的10。`,
      { kind: 'steps', values: [0, before, before] },
      { kind: 'digit-counter', tens: 0, ones: before },
      `添珠前没有整十，个位${before}颗代表${before}个一，数量${before}。`,
    ),
    task(
      'need',
      `计数器原来表示${before}，要表示10，还要先在个位添几颗一单位珠？之后才换十。`,
      { kind: 'number', value: 10 - before },
      { kind: 'digit-counter', tens: 0, ones: before },
      `${before}添${10 - before}到10，不把起点也算一次新增。`,
    ),
    task(
      'ten-ones',
      '图中圆点暂作刚添满时十个一单位珠的逐颗计数记录，不是新的标准计数器状态。一共代表几个一？',
      { kind: 'number', value: 10 },
      { kind: 'count', count: 10 },
      '十个一代表10个物品；接着换成十位一颗，不能把临时记录直接写成个位数字10。',
    ),
    task(
      'after-parts',
      '换十完成，十位放一颗、个位原十颗已取下。依次填十位珠颗数、个位珠颗数、代表物品数量。',
      { kind: 'steps', values: [1, 0, 10] },
      { kind: 'digit-counter', tens: 1, ones: 0 },
      '十位1颗表示1个十、个位0颗表示没有剩余单个一，合起来10。',
    ),
    {
      ...task(
        'bead-vs-total',
        '换十后只有十位一颗珠。怎样解释这一颗和10个物品的关系？',
        { kind: 'choice', value: 'unit' },
        { kind: 'digit-counter', tens: 1, ones: 0 },
        '1是整十单位个数，10是物品数量；珠颗数不能直接当原物品数。',
      ),
      choices: [
        { id: 'unit', label: '一颗十位珠表示一个十，物品数量是10' },
        { id: 'one', label: '只有一颗珠，所以只剩1个物品' },
        { id: 'zero', label: '个位没有珠，所以物品全没有了' },
      ],
    },
    {
      ...task(
        'exchange-conserves',
        '刚添满的十个一与换十后的一个十相比较，换十这个步骤有没有增加或拿走代表的物品数量？只比较换十前后，不与添珠前混比。',
        { kind: 'choice', value: 'same' },
        { kind: 'digit-counter', tens: 1, ones: 0 },
        '添珠改变9到10或8到10；随后换十只改变表示方法，两边数量都是10。珠本身换了单位，不声称珠颗数也不变。',
      ),
      choices: [
        { id: 'same', label: '没有，代表的物品数量仍是10，表示方式变了' },
        { id: 'less', label: '变少了，因为十颗珠换成一颗珠' },
        { id: 'more', label: '变多了，因为十位上多了一颗珠' },
      ],
    },
  ];
}
export const sujiaoUpperTenCounterLesson: Lesson = {
  id,
  title: '计数器换十：十个一与一个十',
  textbookTitle: '认识10·计数器表示',
  page: 63,
  version: 1,
  status: 'available',
  goal: '按数位读珠，亲自演示9添1/8添2后十个一换一个十，分清添珠与换十、珠颗数与代表数量。',
  prerequisite:
    '认识0～10和十个一是一个十；有标明十位/个位的儿童计数器或自制两杆计数架及安全珠。每颗在个位代表一，在十位代表十；不是上珠五的传统算盘。',
  parentTip: `ISBN ${source.isbn}同版63～65页已查看。复用原生digit-counter仅表示个位0～9的整理完成状态；临时十个一用逐颗记录并明确不是新标准状态，不放宽旧模型/备份校验。真实先添再交换且每次恢复起始，物品数量与计数器珠本身颗数分清。不把传统算盘规则带入，不丢掉原十个一后遗漏补十位珠。没计数器可用明确两杆计数架，但纸画记录不冒实际拨珠；计划分开。`,
  steps: [
    {
      title: '先读添珠前，个位九个一',
      text: '左杆标十位、右杆标个位。十位无珠，个位九颗一单位珠，表示9。要到10，先在个位添一颗；9是起点，不把起点再当一次新增。复习从8开始，要添两颗才能到10。',
      visual: { kind: 'digit-counter', tens: 0, ones: 9 },
      activity:
        '实际在儿童两杆计数器摆个位9颗，十位无珠，指出各杆名称、珠颗数和代表数量；先摆回再另试8颗。',
    },
    {
      title: '暂时十个一，先数清再换十',
      text: '在九颗之后添一颗，暂时得到十个一。这里十个圆点只是每珠一单位的计数记录，不是让个位一直留下十颗的标准表示。先说现在代表10，再把个位这十颗全部取下，换为十位一颗；不直接把两个杆的珠颗数相加。',
      visual: { kind: 'count', count: 10 },
      activity:
        '真实先添到十颗，逐颗核对再交换；把取下珠放备用区，备用区不计入杆上表示，记录添珠和换十两个步骤。',
    },
    {
      title: '整理后十位一颗，个位没有珠',
      text: '换十后左杆十位一颗代表一个十，右杆个位没有剩余单个一，读作10。珠颗数是1，代表物品数量是10，两种问题不能互换。个位0不表示整个数量空了；换十前后都表示10，只有此前添珠才让9成为10。',
      visual: { kind: 'digit-counter', tens: 1, ones: 0 },
      activity:
        '实际指出换后两杆珠颗数与含义；恢复原9再重复，另恢复8先添两颗再换十，分别记录代表数量。',
    },
    {
      title: '再读其它数，位置与单位一起看',
      text: '这个计数器十位无珠、个位四颗，表示4。读个位8颗表示8；十位一颗/个位无珠表示10。即使后者实际珠更少，代表物品反而更多；不能只看屏幕珠大小、颜色或颗数判断物品量。',
      visual: { kind: 'digit-counter', tens: 0, ones: 4 },
      activity:
        '实际分别拨4、8、10，先恢复空架再拨，记录十位颗数、个位颗数和代表数量；请家人换一种摆法自己读，再核对。',
    },
    {
      title: '把真实拨珠与记录分开',
      text: '一次换十里先添珠，再改变单位。说清换前10个一、换后1个十数量一样，不把备用珠加进计数器数量。今天真实读了哪组、如何交换、帮助或困难如实记录；没有材料可以待做，图题正确不确认实物已做。',
      activity:
        '向家人说明添珠阶段与换十阶段的区别，给一个真实例子；纸面记录标清实际/帮助/未做与未来计划。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-exchange',
        '实际用有明确十位/个位标签的儿童计数器做9添1→取下个位十颗→十位放一颗，再恢复8做8添2换十。备用区不计，记录各步珠颗数与代表数量；不用上珠五算盘规则，没材料待做。',
      ],
      [
        'actual-read',
        '实际分别拨4、8、10，每次恢复空架，读出十位珠颗数、个位珠颗数和物品数量；请家人另摆3、9、10再独立读并核对。不是只读网页图。',
      ],
      [
        'actual-explain',
        '实际向家人用刚才的例子解释添珠改变数量、换十只改变表示方法，及十位一颗与10个物品的关系，记录真实原话、帮助/困难。未来打算不当已发生交流。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实完成再确认，无材料暂跳，记录与未来计划分开。',
      explanation: '实际拨珠与解释独立人工，不由网页正确代替。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天实际拨珠的一例，添珠与换十怎样区分、哪一步遇到帮助或困难。尚未做如实写，未来计划另记。',
      rule: { kind: 'reflection' },
      hint: '只记录真实例子，不要求已经掌握。',
      explanation: '反思correct null，不自动打星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '计数器单位与真实交换检查',
    notes:
      '2024年7月第1版、2025年7月第2次印刷63～65页实际读到。原创改初始读珠与添珠数量，固定目标10不变；临时十个一与整理后的个位0分清。最终教师审校未核验。',
  },
};
