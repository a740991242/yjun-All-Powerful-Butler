import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-full-cards';
const add = Array.from({ length: 8 }, (_, i) => i + 1).flatMap((a) =>
  Array.from({ length: 9 - a }, (_, i) => [a, i + 1]),
);
const subtract = Array.from({ length: 8 }, (_, i) => i + 2).flatMap((a) =>
  Array.from({ length: a - 1 }, (_, i) => [a, i + 1]),
);

function tasks(review: boolean): Question[] {
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  const groupOrder = review
    ? [3, 8, 2, 6, 4, 7, 5, 9]
    : [2, 3, 4, 5, 6, 7, 8, 9];
  const differenceOrder = review
    ? [7, 2, 8, 4, 1, 6, 3, 5]
    : [1, 2, 3, 4, 5, 6, 7, 8];
  const positiveSum = review ? 8 : 9;
  const zeroNumber = review ? 7 : 8;
  return [
    ...(['add', 'subtract'] as const).flatMap((kind) =>
      Array.from({ length: 4 }, (_, chunk): Question => {
        const sourceCards = kind === 'add' ? add : subtract;
        const slice = sourceCards.slice(chunk * 9, (chunk + 1) * 9);
        const cards = review ? slice.toReversed() : slice;
        const results = cards.map(([a, b]) =>
          kind === 'add'
            ? required(a) + required(b)
            : required(a) - required(b),
        );
        const values = review ? cards.map(([, b]) => required(b)) : results;
        return {
          ...base(
            `${kind}-chunk-${chunk}`,
            review
              ? `重新整理${kind === 'add' ? '加法' : '减法'}36卡的第${chunk + 1}组，给定${kind === 'add' ? '第一加数与和' : '被减数与差'}。按顺序补九个□中的${kind === 'add' ? '第二加数' : '减数'}：${cards.map(([a], i) => `${a}${kind === 'add' ? '＋' : '－'}□＝${required(results[i])}`).join('、')}。不是填等号后的得数。`
              : `完整${kind === 'add' ? '加法' : '减法'}36卡的第${chunk + 1}组，四组各九张。按这里给出的顺序填九个得数：${cards.map(([a, b]) => `${a}${kind === 'add' ? '＋' : '－'}${b}`).join('、')}。每张独立算，不把上一张得数继续加减。`,
          ),
          rule: { kind: 'steps', values },
          hint: review
            ? '可摆出第一份与总数找缺的那份，或恢复被减数后试着取走再核对差；把填的数代回原式。'
            : '逐张核对两个数与运算符，按给出的顺序记录；交换加数仍是另一张有序卡。',
          explanation: `依次${values.join('、')}。本组只有九张，另外三组也要分别记录，不能当作已经整理全部卡。`,
        };
      }),
    ),
    {
      ...base(
        'add-result-groups',
        `全部36张卡的两个加数至少1，和不超过9。按和${groupOrder.join('、')}的顺序，分别填这一得数有几张有序加法卡。`,
      ),
      rule: { kind: 'steps', values: groupOrder.map((sum) => sum - 1) },
      hint: '比如和4有1+3、2+2、3+1三张，交换的写法分别记；不加含0卡。',
      explanation: `张数依次${groupOrder.map((sum) => sum - 1).join('、')}。各组总共36张，不把卡上得数当作张数。`,
    },
    {
      ...base(
        'subtract-result-groups',
        `全部36张减法卡，被减数2～9，减数与差至少1。按差${differenceOrder.join('、')}的顺序，分别填这一得数有几张卡。`,
      ),
      rule: {
        kind: 'steps',
        values: differenceOrder.map((difference) => 9 - difference),
      },
      hint: '差1有2−1到9−8八张；差8只有9−1。不能交换被减数与减数。',
      explanation: `张数依次${differenceOrder.map((difference) => 9 - difference).join('、')}，各差的分组不漏卡。`,
    },
    {
      ...base(
        'zero-arithmetic',
        `依次填${zeroNumber}+0、0+${zeroNumber}、${zeroNumber}−0、${zeroNumber}−${zeroNumber}的结果。虽然不属于本次正数卡表，仍要正确计算。`,
      ),
      rule: { kind: 'steps', values: [zeroNumber, zeroNumber, zeroNumber, 0] },
      hint: '没有添或没有取走，总量不变；全部取走后剩0，空白不是0。',
      explanation: `依次${zeroNumber}、${zeroNumber}、${zeroNumber}、0；算式正确与属于本次卡范围分开。`,
    },
    {
      ...base(
        'positive-sum-pairs',
        `选择全部符合“两个加数至少1，和为${positiveSum}”的有序加法卡，交换两数是另一张。含0项不能选进本次正数卡表。`,
      ),
      choices: Array.from({ length: positiveSum + 1 }, (_, a) => ({
        id: `${a}+${positiveSum - a}`,
        label: `${a}＋${positiveSum - a}`,
      })),
      rule: {
        kind: 'set',
        values: Array.from(
          { length: positiveSum - 1 },
          (_, i) => `${i + 1}+${positiveSum - i - 1}`,
        ),
      },
      hint: '逐张检查两个加数都至少1，不能只选其中一种交换写法。',
      explanation: `本组有${positiveSum - 1}张；0+${positiveSum}和${positiveSum}+0算得对，但不符合两数至少1。`,
    },
    {
      ...base(
        'table-membership',
        review
          ? '8−8=0计算正确。它属于本次“差至少1”的36张减法卡表吗？'
          : '9−0=9计算正确。它属于本次“减数至少1”的36张减法卡表吗？',
      ),
      choices: [
        { id: 'outside', label: '不属于，没有满足本次卡的全部条件' },
        { id: 'inside', label: '属于，计算正确就一定属于' },
      ],
      rule: { kind: 'choice', value: 'outside' },
      hint: '分别核对被减数、减数、差的范围。',
      explanation: '含0运算没有算错，只不在本次正数卡集合中。',
    },
    {
      ...base(
        'row-column-rule',
        review
          ? '减法表同一行被减数都是9，减数从1增到2。差怎样变化？'
          : '加法表同一行第二加数都是2，第一加数从3增到4。和怎样变化？',
      ),
      choices: [
        { id: 'plus', label: '增加1' },
        { id: 'minus', label: '减少1' },
        { id: 'same', label: '不变' },
      ],
      rule: { kind: 'choice', value: review ? 'minus' : 'plus' },
      hint: '先具体计算两个相邻格，再说哪个数不变、哪个数改变。',
      explanation: review
        ? '9−1=8，9−2=7，差减少1。'
        : '3+2=5，4+2=6，和增加1。',
    },
  ];
}

const additionRows = Array.from({ length: 8 }, (_, i) => {
  const b = i + 1;
  return `第二加数${b}这一行：${Array.from({ length: 9 - b }, (_, j) => `${j + 1}+${b}`).join('，')}`;
}).join('\n');
const subtractionRows = Array.from({ length: 8 }, (_, i) => {
  const a = i + 2;
  return `被减数${a}这一行：${Array.from({ length: a - 1 }, (_, j) => `${a}−${j + 1}`).join('，')}`;
}).join('\n');

export const sujiaoUpperFullCardsLesson: Lesson = {
  id,
  title: '9以内完整整理：36加卡与36减卡',
  textbookTitle: '6～9·回顾与整理',
  page: 49,
  version: 1,
  status: 'available',
  goal: '完整整理两组各36张算式卡，观察横竖排列和按得数分组；实际抽卡计算，正确处理6～9的含0运算。',
  prerequisite:
    '会算9以内加减；准备纸笔和0～9数字纸卡，可直接写卡而不用剪刀。可以分次整理，未完成实际任务如实待做。',
  parentTip: `对应ISBN ${source.isbn}印刷44、49～51页已读活动。36是家长核对用的卡数，不要求孩子提前学习两位数计算。本站用原创文字清单与实际摆表，正数卡范围只是本次整理约定，不否定含0的正确算式。四组练习覆盖全部加卡、四组覆盖全部减卡，不能把某一组答完当整表实际已完成。`,
  steps: [
    {
      title: '先定卡片范围，再逐项整理',
      text: '加法卡两个加数至少1，和不超过9；第一加数1可配1～8，2可配1～7，依此到8配1。减法卡被减数2～9，减数至少1，差也至少1；被减数2配减数1，3配1～2，依此到9配1～8。两组各36张，实际有没有漏卡比背总张数更重要。',
      activity:
        '先逐项写出两套卡，不漏交换后的加法写法；每张独立算。没有整理完可以分次继续，不把计划确认成实际完成。',
    },
    {
      title: '加法完整八行，横竖观察',
      text: `自己画表，列标签第一加数1～8，行标签第二加数1～8，只放和≤9的卡，越界格不放卡。\n${additionRows}\n竖看同列第一加数不变，第二加数增加1，和增加1；横看第二加数不变，第一加数增加1，和也增加1。换一种排列可以，但要说清自己规定的行列。`,
      activity:
        '实际把全部36加卡放进表，核对八行八列，逐张只放一次；再按和2～9分组，保留完整记录并举两格解释规律。',
    },
    {
      title: '减法完整八行，不交换两个数',
      text: `另画减法表，行标签被减数2～9，列标签减数1～8，只放减数小于被减数的卡。\n${subtractionRows}\n横看被减数不变，减数增加1，差减少1；竖看减数不变，被减数增加1，差增加1。不是把被减数和减数交换，也不是连续用上一张差继续减。`,
      activity:
        '实际放全36减卡，核对各行不漏、各列不重；再按差1～8分组，逐张核对并实际解释横竖各一对相邻卡。',
    },
    {
      title: '含0的计算正确，卡范围另看',
      text: '6、7、8、9各自加0、不添物，结果还是原数；0加这个数也得到这个数。减0不取物，仍是原数；减去全部，结果0。这些运算正确，但0+8、8−0、8−8不符合本次两加数正或减数/差正的卡约定。不能把“不在这套卡里”说成“算错”。',
      activity:
        '实际用6～9个纸片，每个总数分别表示加0、0加原数、减0、减去全部；每道恢复原数量，记录十六项并说清没有动作与全部取走。',
    },
    {
      title: '抽卡、讲算法，再检查完整性',
      text: '把0～9数字卡打乱，两次抽卡，每次读完放回，使下次仍可抽到同一个数。另抽或轮流选择加减符号；加法和≤9、减法结果在0～9才作本次练习，超出范围如实记超范围再抽，不改成假结果。从两张完整表各任选一道，讲自己怎么计算，再用摆片或数线核对。',
      activity:
        '实际完成至少六轮范围内抽卡口算，保留抽到的数、符号、结果或超范围记录；两表各自主选一道说方法，检查有没有重复卡、漏卡和未写0。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-add-table',
        '实际写全两加数至少1、和≤9的36加卡，列标签第一加数1～8、行标签第二加数1～8，摆完整八行表，每张只出现一次。再按和2～9重新分组，记录各组张数、横竖各一对相邻格及规律。没有整表实际摆写完如实待做。',
      ],
      [
        'actual-subtract-table',
        '实际写全被减数2～9、减数和差至少1的36减卡。按被减数作行、减数作列摆全八行，每张只出现一次，再按差1～8分组。实际说明横看差少1、竖看差多1各一对，不把上一卡差连续再减。',
      ],
      [
        'actual-zero-operations',
        '实际用6、7、8、9个纸片，每个总数各表示n+0、0+n、n−0、n−n，十六项全部记录。每道恢复原量，说明“不添/不取”和“全部取走”的不同，结果0明确写0；说明计算正确与本次正数卡范围分开。',
      ],
      [
        'actual-draw-cards',
        '实际用0～9数字卡，两次抽取都读完放回，另选择或抽加减符号。完成至少六轮范围内计算，记录数字、符号、结果；和大于9或负差如实记超出本次范围再抽，不能删除事实或编结果。请家人查看真实游戏记录。',
      ],
      [
        'actual-own-method',
        '从自己完整加法表和减法表各任选一道不同算式，先独立口述怎么算，再实际用摆片或纸面数线核对，两道都做，记录自己的方法与需要帮助之处。不能只抄示例或把未来准备解释确认成已做。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实操作、完整记录和交流后再确认，未做如实待做，计划另记。',
      explanation:
        '人工查看实际整理、抽卡、摆片与表达，不由数字练习正确自动确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '已读整表与含0口算范围核对',
    notes:
      '各九卡复习反转卡序并改为求缺少的第二加数或减数、代回原式核对，两类按得数分组改变指定次序，含0数量、和目标、卡范围与行列情境变化；全表与真实操作独立记录。旧ID和会话保留，最终教师审校未核验，第二单元其余缺口保留。',
  },
};
