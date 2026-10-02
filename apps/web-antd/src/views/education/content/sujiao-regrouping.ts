import type { RegroupSticksVisual } from '../learning/regroup-sticks';
import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

function pack(add: boolean): Lesson {
  const id = add ? 'sj-lower-carry-add' : 'sj-lower-borrow-subtract';
  const visual = (
    a: number,
    b: number,
    stage: RegroupSticksVisual['stage'],
  ): RegroupSticksVisual => ({
    kind: 'regroup-sticks',
    operation: add ? 'add' : 'subtract',
    tens: Math.floor(a / 10),
    ones: a % 10,
    amount: b,
    stage,
  });
  const a = add ? 27 : 32;
  const b = add ? 5 : 6;
  function tasks(review: boolean): Question[] {
    const x = (() => {
      if (review) return add ? 46 : 51;
      return a;
    })();
    const y = (() => {
      if (review) return add ? 7 : 8;
      return b;
    })();
    const tens = Math.floor(x / 10);
    const ones = x % 10;
    const answer = add ? x + y : x - y;
    const first = add ? ones + y : ones + 10;
    const bridge = add ? 10 - ones : ones;
    const rest = y - bridge;
    const operator = add ? '＋' : '－';
    const number = (
      key: string,
      prompt: string,
      value: number,
      explanation: string,
      show = false,
    ): Question => ({
      id: `${id}-${review ? 'r' : 'q'}-${key}`,
      knowledge: `${id}-${key}`,
      prompt,
      ...(show ? { visual: visual(x, y, 'original') } : {}),
      rule: { kind: 'number', value },
      hint: add
        ? '个位相加满10，要将10个一换成1个十；先凑整十时别忘剩下还要加的部分。'
        : '个位不够减，先从十位拆出1个十成10个一；拆捆不等于已经取走小棒。',
      explanation,
    });
    const choice = (
      key: string,
      prompt: string,
      options: string[],
      value: string,
      explanation: string,
    ): Question => ({
      id: `${id}-${review ? 'r' : 'q'}-${key}`,
      knowledge: `${id}-${key}`,
      prompt,
      choices: options.map((label, i) => ({ id: String(i), label })),
      rule: { kind: 'choice', value },
      hint: '区分增加/取走与换捆/拆捆，核对同单位的数量和当前步骤。',
      explanation,
    });
    const edge = (() => {
      if (add) return review ? 57 : 38;
      return review ? 60 : 30;
    })();
    const edgeB = (() => {
      if (add) return review ? 3 : 2;
      return review ? 7 : 4;
    })();
    return [
      number(
        'result',
        `${x}${operator}${y}＝多少？`,
        answer,
        add
          ? `${ones}＋${y}＝${first}，换1个十后，${tens + 1}个十和${first - 10}个一是${answer}。`
          : `拆1个十后有${tens - 1}个十和${first}个一，${first}－${y}＝${first - y}，剩${answer}。`,
        true,
      ),
      number(
        'loose',
        add
          ? `${x}增加${y}根散棒后、还未换捆，散棒有多少根？`
          : `${x}先拆1捆、还未取走${y}根，散棒有多少根？`,
        first,
        '散棒数可能超过9；它是当前材料数量，不能直接写成个位数字。',
        true,
      ),
      number(
        'tens',
        `算完${x}${operator}${y}后，得数的十位数字是多少？`,
        Math.floor(answer / 10),
        add
          ? '新换的1个十要和原有十位合起来。'
          : '拆出1个十后，十位减少1，不能保留原来的十位不变。',
        true,
      ),
      number(
        'ones',
        `算完${x}${operator}${y}后，得数的个位数字是多少？`,
        answer % 10,
        add
          ? '10个一换走后，个位只写剩下的散根。'
          : '从拆开后的散棒取走所减数量，剩余散根写个位。',
        true,
      ),
      number(
        'bridge',
        add
          ? `用先凑整十的方法算${x}＋${y}，先从${y}中拿出几，才能让${x}变成下一个整十？`
          : `用先减到整十的方法算${x}－${y}，先减几，才能让${x}变成前一个整十？`,
        bridge,
        add
          ? `${x}＋${bridge}＝${(tens + 1) * 10}；${y}拆成${bridge}和${rest}。`
          : `${x}－${bridge}＝${tens * 10}；${y}拆成${bridge}和${rest}。`,
      ),
      number(
        'rest',
        `用整十过渡算${x}${operator}${y}，先${add ? '加' : '减'}${bridge}之后，还需${add ? '加' : '减'}多少？`,
        rest,
        `${y}分成${bridge}与${rest}，不能只做第一步；还需${add ? '加' : '减'}${rest}。`,
      ),
      choice(
        'exchange',
        `${x}${operator}${y}的过程中，单独${add ? '把10根散棒换成1捆' : '把1捆拆成10根'}，这个换组动作怎样改变总根数？`,
        ['不改变总根数，只改变捆与散根的表示', '总根数增加10', '总根数减少10'],
        '0',
        '换组前后仍是同样多的小棒。真正的增加或取走才改变总量。',
      ),
      number(
        'change',
        `从原来的${x}到${x}${operator}${y}的最终结果，总根数实际${add ? '增加' : '减少'}了多少？`,
        y,
        `增加/取走的是${y}，不能把换组用的10算作额外变化。`,
      ),
      choice(
        'why',
        `为什么${x}${operator}${y}不能照搬十位不变的方法？`,
        add
          ? [
              '个位相加满10，要把新的1个十合入十位',
              '所有加法都让十位不变',
              '加一位数就是加到十位',
            ]
          : [
              '个位不够减，要拆1个十，十位少1',
              '所有减法十位都不变',
              '个位不够减就把两个个位交换相减',
            ],
        '0',
        add
          ? '加的是一位数，但满十时十位也改变。'
          : '个位不够减不能交换两个个位，必须保持原数量并正确拆十。',
      ),
      choice(
        'mistake',
        add
          ? `有人算${x}＋${y}，只写${first}。怎样纠正？`
          : `有人拆1捆后就把${x}－${y}当作已经完成。怎样纠正？`,
        add
          ? [
              `${first}只是散棒中间量，还要合回原有${tens}个十`,
              '中间量就是最后总数',
            ]
          : [
              `拆捆尚未取走${y}根，需要取走后再合回剩余的十`,
              '拆捆就是完成减法',
            ],
        '0',
        '中间过程不冒充最终得数，保留部分必须合回。',
      ),
      number(
        'edge',
        `${edge}${operator}${edgeB}＝多少？${add ? '个位恰满10时' : '原数个位为0时'}也要说明换组。`,
        add ? edge + edgeB : edge - edgeB,
        add
          ? `${edge % 10}＋${edgeB}＝10，换成1个十后个位0仍占位。`
          : '个位0没有散根，需拆1个十成10个一再减，十位减少1。',
      ),
      {
        id: `${id}-${review ? 'r' : 'q'}-conditions`,
        knowledge: `${id}-conditions`,
        prompt: add
          ? `下面哪些算式需要进位？全部选出。起始数为${x}。`
          : `下面哪些算式需要退位？全部选出。起始数为${x}。`,
        choices: add
          ? [
              { id: 'plain', label: `${x}＋${2}` },
              { id: 'exact', label: `${x}＋${10 - ones}` },
              { id: 'more', label: `${x}＋${y}` },
            ]
          : [
              { id: 'plain', label: `${x}－${ones}` },
              { id: 'more', label: `${x}－${ones + 1}` },
              { id: 'target', label: `${x}－${y}` },
            ],
        rule: {
          kind: 'set',
          values: add ? ['exact', 'more'] : ['more', 'target'],
        },
        hint: add
          ? '个位之和达到10就要换十，包括恰好等于10。'
          : '被减数个位小于所减一位数时需要拆十，恰好减完不用拆。',
        explanation: add
          ? '不满10不进位，等于或大于10都进位，需选全。'
          : '个位够减（含恰好减完）不退位，不够减才退位，需选全。',
      },
      number(
        'application',
        add
          ? `有${x}张纸卡，又收到${y}张，共有多少张？`
          : `有${x}张纸卡，送出${y}张，还剩多少张？`,
        answer,
        `按${add ? '合并' : '剩余'}关系列${x}${operator}${y}＝${answer}（张）。`,
      ),
      number(
        'inverse',
        add
          ? `两部分纸卡共有${answer}张，一部分${y}张，另一部分多少张？`
          : `送出${y}张后剩${answer}张，原来有多少张？`,
        x,
        add
          ? `总数减去已知部分，${answer}－${y}＝${x}（张）。`
          : `剩余加上送出的，${answer}＋${y}＝${x}（张）。`,
      ),
    ];
  }
  return {
    id,
    title: add ? '两位数加一位数：满十进位' : '两位数减一位数：拆十退位',
    textbookTitle: '两位数加、减整十数和一位数',
    page: add ? 64 : 66,
    version: 1,
    status: 'preparing',
    goal: add
      ? '理解满10个一换1个十，比较换十与先凑整十两种过程，保持单位和总量正确。'
      : '理解个位不够减先拆1个十，比较拆十与先减到整十，区分换组和取走。',
    prerequisite:
      '理解十位个位、10个一是1个十，会20以内加减与不进位/不退位计算；准备每捆10根的小棒和纸笔。',
    parentTip: `依据ISBN ${source.isbn}已实际读印刷${add ? '64～65' : '66～67'}页，例子和图示原创。图按当前阶段显示成捆与散根，不把中间12根当个位数字12。换组本身总量不变，实际摆拨/书写/口述分别人工确认；不声称完整练习八已实现。`,
    steps: add
      ? [
          {
            title: '先判断是否满十',
            text: '27是2个十和7个一，要增加5个一，7＋5＝12，超过10。原图还没有增加5根；原有27与增加后数量不同，不能照搬十位不变的方法。',
            visual: visual(27, 5, 'original'),
            activity: '实际摆2捆7根，每捆核对10根，另准备5根，不混入原数。',
          },
          {
            title: '增加后先看散棒',
            text: '添5根后有2捆和12根散棒。12是当前散棒数量，不是规范写数的个位数字；十位也不能就固定为2。这里增加5根让总量增加5。',
            visual: visual(27, 5, 'regroup'),
            activity: '实际把5根加到7根中，数清12根散棒，再圈出其中10根。',
          },
          {
            title: '十个一换一个十',
            text: '把12根中的10根换成1捆，原有2捆加上新1捆，共3捆，另2根，是32。换捆前后仍32根，换捆不再增加10。新十不能漏记。',
            visual: visual(27, 5, 'result'),
            activity: '实际捆起10根，与原有捆合并，解释3个十和2个一。',
          },
          {
            title: '另一条路：先凑整十',
            text: '5拆成3和2，27＋3＝30，再30＋2＝32。先凑整十与先算7＋5再换十结果相同；只做到30还没有加完5。',
            activity: '纸面记录两种方法，每一步说明新增数量，合计增加5。',
          },
          {
            title: '恰好满十也要进位',
            text: '38＋2的个位8＋2＝10，换出新1个十后得到40，个位0仍占位。27＋2不满十，27＋3恰满十，27＋5超过十，后两题都要进位。',
            visual: visual(38, 2, 'result'),
            activity: '实际摆38再添2，核对40并与不进位例子对照。',
          },
        ]
      : [
          {
            title: '先判断散根够不够取',
            text: '32是3捆与2根，要取走6根，2根不够。原图还没有拆捆或取走；不能把个位2和6交换相减，也不能说十位不变。',
            visual: visual(32, 6, 'original'),
            activity: '实际摆3捆2根，说明为何不能仅从2根散棒取6根。',
          },
          {
            title: '拆一个十，总量不变',
            text: '从3捆中拆开1捆成为10根，加原有2根，共12根散棒，另外2捆未拆。此时仍32根，并没有减少10，也还没取走6根。12是散棒数量，不是个位数字。',
            visual: visual(32, 6, 'regroup'),
            activity: '实际拆1捆、逐根数出10，再和2根合起来，核对仍32根。',
          },
          {
            title: '再取走，合回剩余的十',
            text: '从12根中取走6根，还剩6根，加上保留2捆，是26。十位从3变2，因为拆了1个十；真正取走6根才让32减少为26。',
            visual: visual(32, 6, 'result'),
            activity: '实际取6根，保留2捆6根，分开说明拆十与减少。',
          },
          {
            title: '另一条路：先减到整十',
            text: '6拆成2和4，32－2＝30，再30－4＝26。只减2还没减完6，需继续减4；这与拆十后12－6得到6、再合20结果相同。',
            activity: '纸面分别记录两种方法，核对总共只减去6。',
          },
          {
            title: '原数个位为0也能拆十',
            text: '30－4要从3捆中拆1捆，成为2捆10根，再取4根，剩2捆6根，是26。若32－2，个位恰够减，得30而不用拆捆；若32－3或32－6，才要拆十。',
            visual: visual(30, 4, 'regroup'),
            activity: '实际对照30－4与32－2，说明个位0和够减条件。',
          },
        ],
    questions: [
      ...tasks(false),
      ...[
        add
          ? '实际摆2捆7根，添5根、把10根换1捆，核对结果32与换组总量守恒；另做38＋2，保留个位0。'
          : '实际摆3捆2根，拆1捆、再取6根，核对结果26并分开解释两个动作；另做30－4。',
        add
          ? '实际拨计数器或画双杆说明27＋5满十换位，解释新1个十必须合入原十位。'
          : '实际拨计数器或画双杆说明32－6先从十位拆1个十，解释十位少1与个位增加10。',
        add
          ? '实际在纸上记录27＋5的两种口算方法，口述同样共增加5，指出中间30尚非结果。'
          : '实际在纸上记录32－6的两种口算方法，口述同样共减少6，指出中间30尚非结果。',
      ].map((prompt, index): Question => ({
        id: `${id}-manual-${index}`,
        knowledge: `${id}-manual-${index}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '实际完成后再确认，尚未做可以暂跳。',
        explanation: '网页图示和得分不替代实物操作、纸面记录与表达。',
      })),
      {
        id: `${id}-reflection`,
        knowledge: `${id}-reflection`,
        prompt: '你怎样分清换组与增加或取走？记录一个发现或仍需核对的问题。',
        rule: { kind: 'reflection' },
        hint: '保留真实想法，不要求唯一表达。',
        explanation: '反思不评分，不能自动确认实际活动。',
      },
    ],
    reviewQuestions: tasks(true),
    review: {
      date: source.checkedAt,
      reviewer: '已读进退位范围与原创教学核验',
      notes: `ISBN ${source.isbn}印刷${add ? '64～65' : '66～67'}页，复习改真实原数和操作数，版次印次未知，本课不代替整单元覆盖审核。`,
    },
  };
}
export const sujiaoCarryAddDraft = pack(true);
export const sujiaoBorrowSubtractDraft = pack(false);
