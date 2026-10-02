import type { Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-fill-arithmetic';
function tasks(review: boolean): Question[] {
  const prefix = review ? 'r' : 'q';
  const addA = review ? 1 : 2;
  const addB = review ? 3 : 1;
  const total = addA + addB;
  const original = review ? 4 : 5;
  const removed = review ? 1 : 2;
  const remaining = original - removed;
  const expressions = [
    {
      suffix: 'add-second',
      knowledge: 'add-second',
      text: `${addA} + □ = ${total}`,
      answer: addB,
      hint: '先摆已有的数量，逐个添到总数，数新添的数量。',
    },
    {
      suffix: 'add-first',
      knowledge: 'add-first',
      text: `□ + ${addB} = ${total}`,
      answer: addA,
      hint: '把总数分成两部分，已知其中一部分，找另一部分。',
    },
    {
      suffix: 'add-total',
      knowledge: 'add-total',
      text: `${addA} + ${addB} = □`,
      answer: total,
      hint: '两部分合起来，再点数全部物品。',
    },
    {
      suffix: 'subtract-removed',
      knowledge: 'subtract-removed',
      text: `${original} - □ = ${remaining}`,
      answer: removed,
      hint: '先摆原来的数量，拿到只剩指定数量，数拿走了几件。',
    },
    {
      suffix: 'subtract-remaining',
      knowledge: 'subtract-remaining',
      text: `${original} - ${removed} = □`,
      answer: remaining,
      hint: '实际拿走指定数量，只数剩下的。',
    },
    {
      suffix: 'subtract-original',
      knowledge: 'subtract-original',
      text: `□ - ${removed} = ${remaining}`,
      answer: original,
      hint: '把剩下的与已经拿走的两部分合起来，找到原来的数量。',
    },
  ];
  const firstGroup = review ? 1 : 2;
  const secondGroup = review ? 4 : 2;
  const visibleRemaining = review ? 2 : 4;
  const visibleOriginal = review ? 4 : 5;
  return [
    ...expressions.map((expression): Question => ({
      id: `${id}-${prefix}-${expression.suffix}`,
      knowledge: `${id}-${expression.knowledge}`,
      prompt: `${expression.text}。空格中填几？用摆物或画圆帮助检查。`,
      rule: { kind: 'number', value: expression.answer },
      hint: expression.hint,
      explanation: `把${expression.answer}填回原空格，得到${expression.text.replace('□', String(expression.answer))}。再计算两边，检查数量相等。`,
    })),
    {
      id: `${id}-${prefix}-two-addends`,
      knowledge: `${id}-two-addends`,
      prompt: `图中两组圆点合起来有${firstGroup + secondGroup}个。按第一组、第二组的顺序填写两个加数：□ + □ = ${firstGroup + secondGroup}。`,
      visual: { kind: 'count', count: firstGroup, other: secondGroup },
      rule: { kind: 'steps', values: [firstGroup, secondGroup] },
      hint: '每组分别数，两个加数要与图中第一组、第二组对应，不能只凑出同一个总数。',
      explanation: `第一组${firstGroup}个，第二组${secondGroup}个，按图写${firstGroup}+${secondGroup}=${firstGroup + secondGroup}。`,
    },
    {
      id: `${id}-${prefix}-two-subtraction`,
      knowledge: `${id}-two-subtraction`,
      prompt: `原来有${visibleOriginal}块积木，下面圆点只表示剩下的积木。按拿走、剩下的顺序填写：${visibleOriginal} - □ = □。`,
      visual: { kind: 'count', count: visibleRemaining },
      rule: {
        kind: 'steps',
        values: [visibleOriginal - visibleRemaining, visibleRemaining],
      },
      hint: '先点数图中剩余，再用原来数量与剩余数量找拿走了多少；两个空格表示不同的量。',
      explanation: `拿走${visibleOriginal - visibleRemaining}块，剩${visibleRemaining}块，${visibleOriginal}-${visibleOriginal - visibleRemaining}=${visibleRemaining}。`,
    },
    {
      id: `${id}-${prefix}-add-meaning`,
      knowledge: `${id}-add-meaning`,
      prompt: review
        ? '原有1支笔，又添一些，现在有4支。1 + □ = 4的空格表示什么？'
        : '原有2支笔，又添一些，现在有5支。2 + □ = 5的空格表示什么？',
      choices: [
        { id: 'new', label: '新添的数量' },
        { id: 'original', label: '原来的数量' },
        { id: 'total', label: '现在的总数量' },
      ],
      rule: { kind: 'choice', value: 'new' },
      hint: '逐个数对应故事中的量，再看哪个量还不知道。',
      explanation: '原有数量和现在总数已知，空格是新添的数量。',
    },
    {
      id: `${id}-${prefix}-subtract-meaning`,
      knowledge: `${id}-subtract-meaning`,
      prompt: review
        ? '原有4张卡，拿走一些，剩2张。4 - □ = 2的空格表示什么？'
        : '原有5张卡，拿走一些，剩2张。5 - □ = 2的空格表示什么？',
      choices: [
        { id: 'removed', label: '拿走的数量' },
        { id: 'original', label: '原来的数量' },
        { id: 'remaining', label: '剩下的数量' },
      ],
      rule: { kind: 'choice', value: 'removed' },
      hint: '减号后面的数表示拿走的量，等号后的数才是剩余量。',
      explanation: '原有和剩余数量已知，要找拿走了几张。',
    },
  ];
}

export const sujiaoFillArithmeticLesson: Lesson = {
  id,
  textbookTitle: '想想做做与练习二',
  title: '画图与补全算式：空格表示哪个数量',
  page: 26,
  status: 'available',
  version: 1,
  goal: '说明已知与未知的数量，用画图和实物补全加减算式，区分原有、新添、拿走和剩余，再代回检查。',
  prerequisite:
    '会点数0～5，理解5以内加减法。准备5块积木、小棒、纸笔；不使用代数移项口诀。',
  parentTip:
    '本课为平台按已核验活动细分的原创教学；空格位置改变时需重新说明数量，不能机械写得数。画图、写算式和摆小棒由家长实际查看。',
  steps: [
    {
      title: '先说空格表示什么',
      text: '2 + □ = 4中，已知原有2和现在4，要找新添的数量。4 - □ = 1中，已知原有4和剩下1，要找拿走的数量。等号后有空格时通常在找结果，但不能只因有一个空格就不看位置。',
      activity: '家长出一道5以内缺项算式，孩子先说哪个数量知道、哪个还不知道。',
    },
    {
      title: '画圆或摆物，把数量联系起来',
      text: '用圆表示物品。已知两部分时合起来；已知总数和其中一部分时圈出这一部分，看另外有多少。拿走的和剩下的也合成原来全部数量，求原来时可以把这两部分摆回一起。',
      activity:
        '摆2块，逐个添到4；另摆4块，拿到只剩1块，分别说明新添和拿走了多少。',
    },
    {
      title: '多个空格，逐个填写再检查',
      text: '先明确每个空格表示哪一部分，按要求顺序分别填写。图中两组表示不同加数时，填数要与各组对应；图只画剩下的物品时，不能把它当作原有数量。填好后代回算式检查，不只看两个数能否凑出一个结果。',
      activity:
        '在纸上画两组不同数量的圆，再写两个加数；拿走一些物品后只画剩余，写完整减法。',
    },
    {
      title: '点数、纸笔与表达都要实际做',
      text: '数小棒拼成的封闭轮廓时，每根只数一次，不把共用的端点当作一根棒。数量可以用圆表示，再写数和算式。说出图、物品与每个数对应什么，纸笔完成不能用屏幕答对代替。',
      activity:
        '用3、4、5根等长小棒分别围出封闭轮廓并点数；另画一个5以内加减故事，写完整算式，请家长查看。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: `${id}-manual-draw`,
      knowledge: `${id}-draw`,
      prompt:
        '实际画两组圆，分别点数，写一道完整加法；再画原有物品并圈出或划掉拿走部分，写完整减法。每个总数不超过5，请家长查看。',
      rule: { kind: 'manual' },
      hint: '表示拿走部分与剩余部分时说清你的记号，再检查图与算式对应。',
      explanation: '实际画图与写算式人工确认，不自动评定书写或图画。',
    },
    {
      id: `${id}-manual-missing`,
      knowledge: `${id}-physical-missing`,
      prompt:
        '用5块以内积木演示一次求新添数量、一次求拿走数量，再把拿走和剩余合起来说明原来有多少。',
      rule: { kind: 'manual' },
      hint: '每次重新摆好原有数量，不混用上一轮物品。',
      explanation: '实物变化与说明人工查看，不用填写正确代替实际操作。',
    },
    {
      id: `${id}-manual-sticks`,
      knowledge: `${id}-sticks`,
      prompt:
        '用3、4、5根等长小棒分别围出封闭轮廓，逐根点数，把每次用的根数画圆表示并写数，请家长查看。',
      rule: { kind: 'manual' },
      hint: '每根只数一次，回到起点时不重复数第一根；数的是棒，不是端点。',
      explanation:
        '实际拼摆、点数、画圆和写数由人工确认，不将这项当作完整几何单元。',
    },
    {
      id: `${id}-manual-check`,
      knowledge: `${id}-paper-check`,
      prompt:
        '自己编一道5以内缺项算式，先说明空格代表的量，用物品或画图找答案，再填回并计算检查，讲给家长听。',
      rule: { kind: 'manual' },
      hint: '可以缺一个加数、拿走量或原有量；不得只说一个数字。',
      explanation: '编题、检查和表达单列人工确认，完成不等于已经掌握。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版原书正文与原创活动核验',
    notes: `依据ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷第15、26、28～29页（${source.preview}）。本站原创算式、图示与场景，保留真实画图、点数、缺项与检查，不复制原图和原题全文；不是全册完成证明。`,
  },
};
