import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-nine-subtract';

function tasks(review: boolean): Question[] {
  const prefix = review ? 'r' : 'q';
  const total = review ? 16 : 14;
  const ones = total - 10;
  const base = { knowledge: `${id}-subtract-nine` };
  return [
    {
      ...base,
      id: `${id}-${prefix}-count-back`,
      knowledge: `${id}-count-back`,
      prompt: `从${total}往回数9次，最后到几？起点不算作往回数的第一次。`,
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: total },
      rule: { kind: 'number', value: total - 9 },
      hint: `第一步到${total - 1}，每次往回走1，共走9次。`,
      explanation: `从${total - 1}开始倒数，走9次到${total - 9}。不要把起点${total}算成第一步。`,
    },
    {
      ...base,
      id: `${id}-${prefix}-reach-ten`,
      knowledge: `${id}-subtract-to-ten`,
      prompt: `算${total}减9，先拿走几件，正好剩10件？`,
      rule: { kind: 'number', value: ones },
      hint: `把${total}看作10和${ones}两部分。`,
      explanation: `${total}先减${ones}剩10。这只是第一步，还没有减够9。`,
    },
    {
      ...base,
      id: `${id}-${prefix}-remaining-removal`,
      knowledge: `${id}-subtract-to-ten`,
      prompt: `一共要拿走9件，已经拿走${ones}件，还要从10件里拿走几件？`,
      rule: { kind: 'number', value: 9 - ones },
      hint: '已经拿走的与还要拿走的合起来必须正好是9。',
      explanation: `9分成${ones}和${9 - ones}。再减${9 - ones}，剩${total - 9}。两次减去的数不是各减9。`,
    },
    {
      ...base,
      id: `${id}-${prefix}-break-ten`,
      knowledge: `${id}-break-ten`,
      prompt: `${total}件分成10件和${ones}件。只从10件里拿走9件，再合上旁边没动的${ones}件，共剩几件？`,
      rule: { kind: 'number', value: total - 9 },
      hint: '10减9剩1；旁边的散件没有拿走，要加回来。',
      explanation: `10−9=1，1+${ones}=${total - 9}。不能把未动的${ones}件漏掉。`,
    },
    {
      ...base,
      id: `${id}-${prefix}-inverse`,
      knowledge: `${id}-addition-subtraction`,
      prompt: `9加几等于${total}？用它检查${total}减9。`,
      rule: { kind: 'number', value: total - 9 },
      hint: '9与剩下的部分合起来，应该回到原来的总数。',
      explanation: `9+${total - 9}=${total}，所以${total}−9=${total - 9}。相加检查要用拿走数与剩下数。`,
    },
    {
      id: `${id}-${prefix}-ten-boundary`,
      knowledge: `${id}-ten-boundary`,
      prompt: review
        ? '9加几回到10？用来检查10减9剩下的数量。'
        : '正好10根小棒，拿走9根，还剩几根？',
      rule: { kind: 'number', value: 1 },
      hint: '这里只有一个完整的十，没有旁边散棒。',
      explanation: '10−9=1，9+1=10。不要额外添上不存在的散棒。',
    },
    {
      id: `${id}-${prefix}-nineteen-boundary`,
      knowledge: `${id}-nineteen-boundary`,
      prompt: review
        ? '盒有19张卡片，拿走9张，还剩几张？'
        : '1捆10根与9根散棒，一共19根；拿走散棒中的9根，还剩几根？',
      rule: { kind: 'number', value: 10 },
      hint: '散棒已经够拿走9根，可以保留完整的一捆，不需要拆捆。',
      explanation: '19−9=10，剩一个完整的十。不是每道减9都必须破十。',
    },
    ...[review ? 12 : 11, review ? 17 : 18].map((value) => ({
      ...base,
      id: `${id}-${prefix}-difference-${value}`,
      prompt: `${value} − 9 = ？选择接着倒数、先减到10或破十的方法。`,
      rule: { kind: 'number' as const, value: value - 9 },
      hint: `把${value}分成10和${value - 10}；10减9后，再加未动的部分。`,
      explanation: `${value}−9=1+${value - 10}=${value - 9}。可用9+${value - 9}=${value}检查。`,
    })),
    {
      ...base,
      id: `${id}-${prefix}-story`,
      knowledge: `${id}-remaining-story`,
      prompt: review
        ? '盒子里有16张卡片，取出9张，还剩几张？'
        : '书架上有14本书，借出9本，还剩几本？',
      rule: { kind: 'number', value: total - 9 },
      hint: '原来的总数减去拿走的9，求的是剩下部分。',
      explanation: `${total}−9=${total - 9}，剩${total - 9}${review ? '张' : '本'}。答案的单位和物品对应。`,
    },
    {
      ...base,
      id: `${id}-${prefix}-same-result`,
      knowledge: `${id}-strategy-check`,
      prompt: `两种算法：${total}−${ones}−${9 - ones}；10−9+${ones}。哪种能算出${total}−9？`,
      choices: [
        { id: 'first', label: '只有第一种' },
        { id: 'second', label: '只有第二种' },
        { id: 'both', label: '两种都可以' },
      ],
      rule: { kind: 'choice', value: 'both' },
      hint: '检查第一种共拿走多少；第二种旁边的散件有没有少掉。',
      explanation: `第一种共减${ones}+${9 - ones}=9；第二种从10里减9后合上未动的${ones}。都剩${total - 9}。方法不同，原数量和拿走数量相同。`,
    },
  ];
}

export const sujiaoNineSubtractDraft: Lesson = {
  id,
  textbookTitle: '进位加法和退位减法',
  title: '十几减9：倒数、减到十与破十',
  page: 4,
  version: 2,
  status: 'preparing',
  goal: '用实物说明十几减9的不同算法，区分拿走的总数与分步拿走数，并用加法检查剩余量。',
  prerequisite: '已会9加几、11～19的组成。准备19根小棒、橡皮筋与纸笔。',
  parentTip:
    '允许孩子选择熟悉的方法。先看操作和解释，不只背口诀；帮助与人工确认照实记录。',
  steps: [
    {
      title: '从原数接着倒数',
      text: '先摆14根，每拿走1根就往回数一次。第一根拿走后剩13根，依次接着数，拿走9根后剩5根。14是起点，不是第一次倒数后的数。',
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: 14 },
      activity: '实际逐根拿走9根，指着余下的小棒检查倒数结果。',
    },
    {
      title: '先减到十，再减剩下的',
      text: '把要拿走的9根分成4根和5根。14先拿走4根剩10根，再拿走5根剩5根。两步合起来只拿走9根，不能两次各拿9根。',
      activity: '分别把第一次与第二次拿走的小棒放在两处，合起来确认是9根。',
    },
    {
      title: '拆开一捆，从十里面减',
      text: '14根原本是1捆10根和4根散棒。将一捆拆开，总数仍是14。只从10根中拿走9根剩1根，再和旁边没有动的4根合起来，共5根。',
      visual: { kind: 'place-value', value: 14 },
      activity: '亲手拆捆、拿走、合并；解释旁边4根为什么还要保留。',
    },
    {
      title: '用加法检查，并说实际问题',
      text: '拿走9根，剩5根，9加5正好是原来的14根。用这个关系检查减法。10减9只剩1；19减9时9根散棒够拿，剩完整的十，不必拆捆。换成书、卡片也可以，先说清原有多少、拿走多少、要求什么，再算剩余数量。',
      activity: '换成16根减9根，选一种方法算，再用另一种方法或加法检查。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: `${id}-manual-methods`,
      knowledge: `${id}-physical-methods`,
      prompt: '摆14根小棒，用两种不同方法拿走9根；解释为什么两次剩余数量相同。',
      rule: { kind: 'manual' },
      hint: '检查原有与一共拿走的数量，允许自己选择两种算法。',
      explanation: '实物操作与口述由人工查看，填对数字不替代操作。',
    },
    {
      id: `${id}-manual-unbundle`,
      knowledge: `${id}-quantity-conservation`,
      prompt:
        '将一捆10根与4根散棒摆好，拆捆后再数一遍；只从拆开的10根中取走9根，合上散棒检查。',
      rule: { kind: 'manual' },
      hint: '拆捆只是改变分组。未取走的散棒不能消失。',
      explanation: '拆捆守恒、拿走范围与剩余合并分别由人工查看。',
    },
    {
      id: `${id}-manual-story`,
      knowledge: `${id}-own-story`,
      prompt:
        '编一个原有11～18件物品、拿走9件、求剩下数量的问题，画图或摆物并用加法检查。',
      rule: { kind: 'manual' },
      hint: '说清原有、拿走、剩下三种数量以及物品单位。',
      explanation: '不同情境均可，由孩子或家长核对问题、解答与检查。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同一公开扫描正文范围核验与原创草稿检查',
    notes: `已实际读到${source.preview}下册印刷第4～5页，封底书号${source.isbn}。原书13减9用于核验算法范围，本站改用14、16等原创情境与问答。未复制教材图文。版权版次与印次仍待核验，暂不注册正式课包；不声称第6～7页综合练习已覆盖。`,
  },
};
