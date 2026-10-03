import type { CountGroupsVisual, Lesson, Question } from '../learning/types';

import { countGroupsTotal } from '../learning/count-groups';
import { required } from '../learning/required';
import { tenPracticeGroups } from './sujiao-ten-practice-groups';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-ten-review';

function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const groups: CountGroupsVisual = {
    kind: 'count-groups',
    groups: review ? [5, 5] : [2, 2, 2, 2, 2],
  };
  const available = review ? 6 : 7;
  const pair = review ? [3, 7] : [4, 6];
  const fixed = review ? 4 : 2;
  const threshold = 10 - fixed;
  const subtract = review ? 4 : 3;
  const makeChoices = () =>
    Array.from({ length: 11 }, (_, n) => ({ id: String(n), label: String(n) }));
  return [
    {
      id: `${prefix}-groups`,
      knowledge: `${id}-groups`,
      prompt: review
        ? '每盒装5个圆点。图中一共有几盒？只数盒子。'
        : '每盘装2个圆点。图中一共有几盘？只数盘子。',
      visual: groups,
      rule: { kind: 'number', value: groups.groups.length },
      hint: '每一个边框是一组，组里的圆点不是组数。',
      explanation: `图中有${groups.groups.length}组，共10个圆点；这题问组数。`,
    },
    {
      id: `${prefix}-objects`,
      knowledge: `${id}-objects`,
      prompt: review
        ? '同样的两盒圆点，合起来一共有几个圆点？'
        : '同样的五盘圆点，合起来一共有几个圆点？',
      visual: groups,
      rule: { kind: 'number', value: countGroupsTotal(groups) },
      hint: '逐一数各组的圆点，不把边框算进去。也可以把各组数量相加。',
      explanation: `${groups.groups.join(' + ')} = 10，这题问物品总数。`,
    },
    {
      id: `${prefix}-count-back`,
      knowledge: `${id}-count-back`,
      prompt: review
        ? '从10倒着数，10、9后面接着的三个数依次是什么？'
        : '从10倒着数，10后面接着的三个数依次是什么？',
      rule: { kind: 'steps', values: review ? [8, 7, 6] : [9, 8, 7] },
      hint: '每次比前一个数少1，不按从小到大填写。',
      explanation: review
        ? '10、9、8、7、6，所以填8、7、6。'
        : '10、9、8、7，所以填9、8、7。',
    },
    {
      id: `${prefix}-shortage`,
      knowledge: `${id}-shortage`,
      prompt: review
        ? '10个杯子各需要1个杯垫，已经准备6个杯垫，还缺几个？'
        : '10本作业本各需要1个姓名贴，已经准备7个姓名贴，还缺几个？',
      visual: { kind: 'count', count: available },
      rule: { kind: 'number', value: 10 - available },
      hint: '每个物品只配一个，先确定一共需要10个，再减去已准备数量。',
      explanation: `10 - ${available} = ${10 - available}。`,
    },
    {
      id: `${prefix}-family`,
      knowledge: `${id}-family`,
      prompt: `两组卡片分别有${pair[0]}张、${pair[1]}张。依次填两组总数、从总数中去掉第一组后剩下的张数、去掉第二组后剩下的张数。`,
      visual: { kind: 'count-groups', groups: pair },
      rule: {
        kind: 'steps',
        values: [10, required(pair[1]), required(pair[0])],
      },
      hint: '两部分合成总数；总数减去一部分，得到另一部分。每次从原来的10张重新开始。',
      explanation: `${pair[0]} + ${pair[1]} = 10；10 - ${pair[0]} = ${pair[1]}；10 - ${pair[1]} = ${pair[0]}。`,
    },
    {
      id: `${prefix}-less-than`,
      knowledge: `${id}-inequality`,
      prompt: `从0～10中选出所有能让 ${fixed} + □ < 10 成立的数，可以选多个。`,
      choices: makeChoices(),
      rule: {
        kind: 'set',
        values: Array.from({ length: threshold }, (_, n) => String(n)),
      },
      hint: `先找和等于10时空格是多少，再找和比10小的情况；等于10不能选。`,
      explanation: `空格填${threshold}时和等于10；要严格小于10，填0～${threshold - 1}。`,
    },
    {
      id: `${prefix}-sub-less`,
      knowledge: `${id}-sub-inequality`,
      prompt: `从0～10中选出所有能让 10 - □ < ${subtract} 成立的数，可以选多个。`,
      choices: makeChoices(),
      rule: {
        kind: 'set',
        values: Array.from({ length: subtract }, (_, n) =>
          String(11 - subtract + n),
        ),
      },
      hint: '原来的数量不变，拿走越多，剩下越少。先找恰好等于右边的情况，再检查更大的减数。',
      explanation: `填${10 - subtract}时差等于${subtract}，不能选；填${11 - subtract}～10时差更小。`,
    },
    {
      id: `${prefix}-equality`,
      knowledge: `${id}-equality`,
      prompt: review
        ? '8 - 2 = 4 + □，空格填几？'
        : '3 + 7 = 6 + □，空格填几？',
      rule: { kind: 'number', value: review ? 2 : 4 },
      hint: '先算等号一边的结果，再使另一边的结果相同。等号表示两边相等，不是只把左边的得数抄进空格。',
      explanation: review
        ? '左边是6，4 + 2 = 6，两边相等。'
        : '左边是10，6 + 4 = 10，两边相等。',
    },
    {
      id: `${prefix}-sequence`,
      knowledge: `${id}-sequential`,
      prompt: review
        ? '10 - 6 + 3，依次填先算的结果和最后的结果。'
        : '4 + 6 - 2，依次填先算的结果和最后的结果。',
      rule: { kind: 'steps', values: review ? [4, 7] : [10, 8] },
      hint: '从左到右，第二步接着第一步的结果算，不重新用原来的数。',
      explanation: review
        ? '10 - 6 = 4，4 + 3 = 7。'
        : '4 + 6 = 10，10 - 2 = 8。',
    },
    {
      id: `${prefix}-partition`,
      knowledge: `${id}-partition`,
      prompt: review
        ? '10个纽扣装进两盒，允许一盒为空。依次写一种两盒的数量。'
        : '10块积木放在两盘，允许一盘为空。依次写一种两盘的数量。',
      rule: { kind: 'partition', total: 10, parts: 2, minimum: 0 },
      hint: '两个数都不能小于0，合起来必须是10；不同分法都可以。',
      explanation: '如0和10、1和9、5和5，都是总数为10的分法。',
    },
  ];
}

export const sujiaoTenReviewLesson: Lesson = {
  id,
  textbookTitle: '想想做做、练习七、评价与反思',
  title: '10的综合活动：分组、补足与等式',
  page: 67,
  status: 'available',
  version: 2,
  goal: '区分组数与总数，完整练十二式/十式配对/六连算/三应用/六等式；独立完成原页整组，检查两边与严格比较。',
  prerequisite:
    '认识0～10，会10的分与合及加减法；准备10个安全小物件、容器、数字卡和纸笔。',
  parentTip:
    '允许用实物、画图和数数；帮读、提示与独立作答分开记录。多解题不只接受示例。实际分组、画图和口述需人工查看。',
  steps: [
    {
      title: '每组几个，一共有几组',
      text: '把10个物品每2个放在一组，可以装5组。5是组数，10是物品总数；换成每5个一组，组数变成2，物品总数仍是10。这里通过逐组摆放和数数解决，不要求提前使用乘除法。',
      visual: { kind: 'count-groups', groups: [2, 2, 2, 2, 2] },
      activity:
        '实际摆10个积木，先每2个装一盘，再每5个装一盘。分别报告盘数和积木总数，确认没有重复数或漏数。',
    },
    {
      title: '先说已知，再说要找什么',
      text: '配对物品时，一人需要一个，人数就是需要的总数量。用需要的数量减去已经有的数量，得到还缺的数量。也可从已有数量接着数，数到目标，数增加了几次；起点不算增加一步。',
      activity:
        '画10个杯子和6个杯垫，一一配对，圈出没有杯垫的杯子，再用加法检查补足后的总数。',
    },
    {
      title: '等号两边一样多，小于不包括相等',
      text: '3 + 7 = 6 + 4，两边的结果都是10。找空格时要看完整两边。2 + □ < 10不能填8，因为2 + 8恰好等于10。10 - □ < 3则要拿走比7更多，剩下才比3少。只在给定0～10整数范围内找数。',
      activity:
        '用数字卡逐一试填空格，写出每种结果，把等于、严格小于、严格大于的情况分别放在一边，说清分类依据。',
    },
    {
      title: '画图、检查和说出自己的办法',
      text: '把问题中的两部分画清，再按问题选择合起来还是求剩下。连加、连减和加减混合从左到右；先得到中间结果，再继续算。检查算式、物品名称和数量是否一致。完成练习不等于已经熟练掌握。',
      activity:
        '自己编一个总数不超过10的小故事，画图列式，解释为何用加法或减法。再挑一题说出不同办法，实际摆物验证。',
    },
    {
      title: '十二式与十式配对，逐条不漏',
      text: '本站新增十二条原创加减练习，分别看符号和实际数量，含全部拿走得到0。十式配对则先算每条，再选结果；同一个结果可以配多条，不能配过一次就删去结果卡。它们帮助练方法，不自动证明原书整组已完成。',
      activity:
        '实际回第67页第4项完成全部12式，再回第72页第5项完成十条配对。逐条核对并保留错误修正，本站练习与原书作业分别记录。',
    },
    {
      title: '六条连算与三个相关问题',
      text: '连算先算左边一步，再用中间结果继续；每条都写中间与最后结果。三个相关问题给的是同一组数量事实，分别问总数或不同的另一部分，不能因为数字相同就用同一种算式。本站卡片情境与原书情境独立，列式后用两部分合起来核对总数。',
      activity:
        '实际完成第73页第9项全部六条及第10项三问题，每题圈条件/问题、画图或摆物、列式、写单位与答句。未实际做可暂跳，不把未来计划当完成。',
    },
    {
      title: '连接算式后，仍要检查完整两边',
      text: '先分别求两条算式的结果，如果一样，再写成两边相等的关系。本站先用两条连接例练习，再练四条等式空格；填空须让整个右边与左边一样，空格通常不是左边的结果。把填数代回两边，分别计算作检查。',
      activity:
        '实际完成第73页第11项两组连接前后，再完成第74页第12项全部四空，每个等式逐边核对。拿自己的纸面作品说明一次错误怎样修正，记录真实帮助。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'grouping',
        '实际把10个小物件每2个分一组，再每5个分一组。分别说出组数与物品总数，请家长查看。',
        '分组没有漏放或重复；按所问对象分别报数。',
      ],
      [
        'drawing',
        '自己画一个总数不超过10的配对或两部分故事，说明知道什么、求什么，列式并检查，请家长查看。',
        '画图、列式、单位与口述人工确认，图示答对不能替代。',
      ],
      [
        'cards',
        '实际用0～10数字卡试填一个小于10的加法空格，找出所有可用数字，并说明为何不能选恰好等于10的数。',
        '按同一范围逐一检查，严格小于不包含相等。',
      ],
      [
        'reflection',
        '选一道刚才的题，说出自己的办法、检查过程和还需要帮助的地方，请家长一起记录。',
        '反思人工记录，不由练习完成自动标记掌握。',
      ],
    ].map(([key, prompt, explanation]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '按讲解实际完成，不只在页面点击确认。',
      explanation: required(explanation),
    })),
    ...tenPracticeGroups(false),
    ...[
      [
        'source-oral',
        '回同版教材第67页想想做做第4项，实际纸面逐条完成全部12式，再逐条核对。遇错保留原结果并修正；本站十二式是原创练习，不能替原书已做记录。',
      ],
      [
        'source-matching',
        '回同版教材第72页练习七第5项，实际处理全部十条算式，再逐条与结果配对。相同结果可对应多条，不遗漏两行任何一条；本站十式不替原页已做。',
      ],
      [
        'source-sequential',
        '回同版教材第73页练习七第9项，实际完成全部六条连算，每条写第一步中间结果和最后结果，逐条说明从左往右怎样接着算。未做或有困难如实记录。',
      ],
      [
        'source-applications',
        '回同版教材第73页练习七第10项，实际分别完成三个相关问题。每题圈清已知数量和所求对象，画两部分或摆物，写算式、单位与完整答句；求总数与求另一部分不能混，本站卡片故事不冒原书三题已完成。',
      ],
      [
        'source-equalities',
        '回同版教材第73页练习七第11项，实际完成两组连接前的算式和连接后的等式，再完成第74页第12项全部四个空格。每个等式都把填数代回两边检查，不能将左边得数直接抄进空格；原书共两组连接与四空分别核对。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-manual-${required(key)}`,
      knowledge: `${id}-actual-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '需要实际原书与纸笔，完整处理该组后再确认；未做暂跳，不由网页答对自动确认。',
      explanation:
        '实际原页练习独立人工记录，错误修正、帮助和未完成如实记；不复制完整题文或原扫描。',
    })),
  ],
  reviewQuestions: [...tasks(true), ...tenPracticeGroups(true)],
  review: {
    date: '2026-10-04',
    reviewer: '同版原书正文核验与原创教学检查',
    notes: `已实际核对ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第67、69、71～74页（${source.preview}）。原创分组与配对情境、算式和反思活动，不复制教材插图与题文。2026-10-04重新查看62～74页，补原页12式/十式配对/六连算/三应用/两组连接及四等式空格的完整实践，并提供对应完整数量的原创练习。旧14题与10复习保持，v1历史继续按快照恢复。只开放本课范围，不代表全单元全部拓展或全册完成，保留人教版独立记录。`,
  },
};
