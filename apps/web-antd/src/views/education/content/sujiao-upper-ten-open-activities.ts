import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-ten-open-activities';
function tasks(review: boolean): Question[] {
  const add = review ? 3 : 2;
  const total = review ? 9 : 10;
  const fixed = review ? 5 : 4;
  const difference = review ? 4 : 3;
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
    hint: '只用0～10整数，先读所求和符号，再代回原式；0是数，未填不是0。',
    explanation,
  });
  const chain = (
    values: (null | number)[],
    direction: 'ascending' | 'descending',
  ): Question['rule'] => ({
    kind: 'number-chain',
    minimum: 0,
    maximum: 10,
    values,
    direction,
  });
  const red = review ? 7 : 4;
  const blue = 10 - red;
  const storyBase = review ? 2 : 3;
  const storyTotal = review ? 5 : 4;
  return [
    q(
      'add-equal',
      `只用0～10整数，${add}+□=${total}。填另一个加数。`,
      { kind: 'number', value: total - add },
      `${total}减已有${add}得${total - add}，代回${add}+${total - add}=${total}。`,
    ),
    q(
      'add-less',
      `只用0～10整数，${add}+□＜${total}。填一种合法写法即可，不是等于；不同合法答案都接受。`,
      chain([null, total - add], 'ascending'),
      `原式要求空格小于${total - add}，可0～${total - add - 1}；${total - add}会相等，不能通过。`,
    ),
    q(
      'zero-equal',
      `只用0～10整数，□+0=${fixed}。填空。`,
      { kind: 'number', value: fixed },
      `加0不变，空格是${fixed}。`,
    ),
    q(
      'zero-greater',
      `只用0～10整数，□+0＞${fixed}。填一种合法写法，不与${fixed}相等。`,
      chain([fixed, null], 'ascending'),
      `加0不变，空格可${fixed + 1}～10；所有合法数都接受。`,
    ),
    q(
      'subtract-equal',
      `只用0～10整数，10−□=${difference}。填拿走的数，不填剩下的数。`,
      { kind: 'number', value: 10 - difference },
      `拿走${10 - difference}剩${difference}。`,
    ),
    q(
      'subtract-less',
      `只用0～10整数，10−□＜${difference}。填一种合法写法；剩下更少，需要拿走更多。`,
      chain([10 - difference, null], 'ascending'),
      `需拿走${11 - difference}～10，剩下${difference - 1}～0。拿走${10 - difference}时相等不符合。`,
    ),
    q(
      'three-drawings',
      review
        ? '三幅分别已有6个方形、3个三角形、8个圆形，各补到10个。依次填每幅要新增几个。'
        : '三幅分别已有9个方形、2个三角形、5个圆形，各补到10个。依次填每幅要新增几个。',
      { kind: 'steps', values: review ? [4, 7, 2] : [1, 8, 5] },
      '每一幅独立目标10，10减原有得到新增；不能将三幅原有数量合算。',
    ),
    q(
      'two-colours',
      `一次示例点数为A面${red}片、B面${blue}片，总共十片。依次填${red}+${blue}、${blue}+${red}、10−${red}、10−${blue}的得数。示例不是你实际抛片的结果。`,
      { kind: 'steps', values: [10, 10, blue, red] },
      '同一十片的两部分可交换相加；总数减一部分得另一部分。实际抛片另记，不用示例冒作实测。',
    ),
    {
      ...q(
        'same-equation',
        `原式${storyBase}+□=${storyTotal}。选出全部能用这个缺少加数式表示的故事，不只选一个。`,
        { kind: 'set', values: ['join', 'parts'] },
        '原有再来求新增、已知一部分和总数求另一部分，都能表示成已知部分加未知部分等于总数；明确所求。',
      ),
      choices: [
        {
          id: 'join',
          label: `原有${storyBase}支，又来一些后共${storyTotal}支，求又来几支`,
        },
        {
          id: 'parts',
          label: `共${storyTotal}个，其中${storyBase}个方形，其余圆形，求圆形几个`,
        },
        {
          id: 'remove',
          label: `原有${storyTotal}个，拿走${storyBase}个，求原来几个`,
        },
      ],
    },
  ];
}
export const sujiaoUpperTenOpenActivitiesLesson: Lesson = {
  id,
  title: '十片抛分、三幅补画与开放故事',
  textbookTitle: '练习七·实际操作与多种写法',
  page: 66,
  version: 1,
  status: 'available',
  goal: '真实抛十片记录同部分三算式，三幅各补到十；编同式不同故事，0～10开放等不等接受全部合法写法。',
  prerequisite:
    '会点数0～10、分合与加减和＜＞。准备十张两面标A/B的纸片、纸笔；可用两色但同时标字，不单靠颜色。',
  parentTip: `ISBN ${source.isbn}同版66/67/71/73页已实际查看。原创分组符号每个一物，不复制扫描。网页算例只是示例，实际抛片结果须实测记录；不用随机网页结果冒作真实实验。抛片、三幅补画、同式不同故事、六类开放式纸面多解与解释各自manual，反思null/计划分开。已有number-chain表达等价的整数界限，解释必须代回原算式；不固定单一候选或要求所有答案正数。教师最终审校未核验。`,
  steps: [
    {
      title: '真抛十片，每次记录同一结果',
      text: '用十张安全纸片，每片一面标A、另一面标B；可同时涂两色，但看字也能分。轻抛在桌面后逐片点数，A片+B片必须10。若落桌外或重叠看不清，先找齐摊开再数，不能假定5与5。记录一次两部分，写一加两减；A为0或B为0也合法。',
      activity:
        '实际轻抛至少三次，每次找齐同十片、写A/B片数、一个相加式与两个相减式并核对。相同结果可重复，不为了不同而编造；纸片不要入口。',
    },
    {
      title: '三幅图，各自补到十',
      text: '这三组原创符号每个代表一个：方形组 ■ ■ ■ ■ ■ ■ ■ ■ ■；三角形组 ▲ ▲；圆形组 ● ● ● ● ●。每一组独立补到10，不把三组混成一组。先按原有数量画好三个框，再用不同记号画新增，逐框点清原有、新增、合计。每次补画不是把网页数字写一下。',
      activity:
        '实际纸上分别画已有9个方形、2个三角形、5个圆形，再在各框补到10。标出原有和新增，分别写9+□=10、2+□=10、5+□=10并点数核对；复习改6/3/8重新画。',
    },
    {
      title: '同一个算式，可以有不同故事',
      text: '3+□=4可以说原有3支铅笔、又来一些后共4支，问又来几支；也可以共4个纽扣、3个方形、其余圆形，问圆形几个。两个故事条件与所求不同，未知部分都用同一式表示。不是只换物品名；说清合并还是总数里另一部分。',
      activity:
        '实际自主编至少两种3+□=4的故事，分别保留条件、问题、图或摆物、填式与带单位答案；至少一种加入、一种总数求另一部分，给家人说为何同式。',
    },
    {
      title: '六种式，等于和严格比较分别检查',
      text: '0～10内：2+□=10只有8，2+□＜10可0～7；□+0=4只有4，□+0＞4可5～10；10−□=3只有7，10−□＜3可8、9、10。逐数代回原式，严格小于/大于不含相等。减法中拿走越多剩下越少，不能见小于就把减数选得更小。',
      activity:
        '实际纸面独立写这六种式的全部合法填数，每种逐一代回；另写三个恰好相等的不合法比较例子，说明符号为何失败。复习变化加数/目标/差，重新核对，不抄旧列表。',
    },
    {
      title: '核对真实作品和多种合法答案',
      text: '只要整数在0～10且原式成立，不同合法填写都正确。网页一次填一种，纸面要自主找齐；实际三次抛片、三幅补画、两种不同结构故事和开放写式分别保存证据。没实际做暂跳，计划不是完成；自己的抛片结果不能复制示例。',
      activity:
        '实际把自己的记录逐项给家人看，解释一个含0式、一个减法比较和两种同式故事。记录真实帮助/困难，下一步准备做的事另列。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-toss',
        '实际用同十片A/B双面纸片轻抛至少三次，每次找齐摊开，写A/B实际片数，并按该次结果写一个加法与两条减法，核对总数10。含0或结果重复如实记，不复制示例或网页随机数当实测。',
      ],
      [
        'actual-draw',
        '实际纸上完成三幅：原有9方形、2三角形、5圆形，各补到10；新增和原有标记分清，每幅点数并写补足式。再用6/3/8的变化原有量分别重新补画，六幅逐一核对，未画暂跳。',
      ],
      [
        'actual-stories',
        '实际自己编两种3+□=4故事：一种原有又来求新增，一种总数已知部分求另一部分；每种条件/问题/摆物或图/式/单位答案完整。至少结构不同，不只改物品名称；真实解释和帮助如实记。',
      ],
      [
        'actual-open-writings',
        '实际纸面自主写全0～10内2+□=10与2+□＜10、□+0=4与□+0＞4、10−□=3与10−□＜3六类合法填法。逐个代回，另写三个相等而不符合严格比较的反例解释。复习改3+□=9/＜9、□+0=5/＞5、10−□=4/＜4重新找齐。',
      ],
      [
        'actual-explain',
        '实际拿自己的三次抛片记录、三幅及变式补画、两种结构故事和六类开放式给家人核对。解释同部分三算式、补画各自目标和减法比较为何拿走更多；不同合法答案核对原式。未做和帮助如实记，计划另列。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '独立实际写画抛分和说明后再确认；没做暂跳，不用示例替实测。',
      explanation: '真实操作与自主作品独立人工，网页客观题不能代替。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实抛片、补画、同式故事或开放多解的一例和如何核对；说清帮助/困难。未做如实说，未来计划另列。',
      rule: { kind: 'reflection' },
      hint: '记录真实例子，不要求一次全掌握。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '真实开放操作与全部合法范围核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷66/67/71/73页已实际查看。复习改变条件、图原有量、双面示例两部分及同式故事，不把示例当实测，最终教师审校未核验。',
  },
};
