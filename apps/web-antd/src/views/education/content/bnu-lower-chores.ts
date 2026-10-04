import type { Lesson, Question } from '../learning/types';

const id = 'bnu-lower-household-chores';
/** Custom card order, not IDs or positions from the printed illustration. */
export const bnuChoreExpressions = [
  [5, '+', 9],
  [9, '+', 5],
  [8, '+', 7],
  [5, '+', 7],
  [7, '−', 3],
  [6, '+', 7],
  [4, '+', 8],
  [3, '+', 9],
  [6, '+', 9],
  [3, '+', 10],
  [4, '+', 7],
  [18, '−', 6],
  [10, '+', 2],
  [6, '+', 6],
  [5, '+', 6],
  [15, '−', 3],
  [8, '+', 4],
  [8, '+', 9],
  [7, '+', 9],
  [2, '+', 9],
  [8, '+', 3],
  [6, '+', 5],
  [6, '−', 1],
  [7, '+', 6],
  [5, '+', 10],
  [8, '−', 4],
  [6, '+', 8],
  [5, '+', 8],
] as const;
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint: '先明确问题、对象和单位，再完整计算；同类结果必须选全，不能只选一个例子。',
    explanation,
  };
}
function number(
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
): Question {
  return task(suffix, prompt, { kind: 'number', value }, explanation);
}
function method(
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
): Question {
  return task(suffix, prompt, { kind: 'steps', values }, explanation);
}
function actual(suffix: string, prompt: string): Question {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际读图、摆拨、圈画或交流后才确认；尚未做请跳过，网页答题不表示已完成实物或纸面活动。',
  );
}
function cardSet(
  suffix: string,
  values: readonly (readonly [number, '+' | '−', number])[],
  target: number,
): Question {
  const choices = values.map(([a, op, b], index) => ({
    id: `${suffix}-${index + 1}`,
    label: `卡${index + 1} · ${a}${op}${b}`,
  }));
  return {
    ...task(
      suffix,
      `本站${values.length}张文字卡片重新排列：选出全部结果为${target}的卡片。没有选中的卡片也要核对，不按原书图形位置猜。`,
      {
        kind: 'set',
        values: values.flatMap(([a, op, b], index) =>
          (op === '+' ? a + b : a - b) === target
            ? [`${suffix}-${index + 1}`]
            : [],
        ),
      },
      `每张独立计算，再按结果${target}分类。本站只有文字卡，不复制原书颜色区域或最终图案。`,
    ),
    choices,
  };
}

export const bnuLowerChoresLesson: Lesson = {
  id,
  textbookTitle: '一起做家务',
  title: '根据生活信息提问、凑十与整组分类',
  page: 10,
  version: 1,
  status: 'available',
  goal: '根据给定生活信息提出可用加法解决的问题，分清个与件，完整说明凑十和换十过程，逐项计算后按结果分类。',
  prerequisite: '认识十与一，掌握20以内凑十加法及已学的不退位减法。',
  parentTip:
    '对应北师大下册第10～11页。生活信息与数序依据已读原页，本站讲解、纸卡与文字分类原创，28张算式卡用本站顺序，不冒原图区域编号。原书涂色图与计数器实际操作另列人工；其它合理提问、分解和口算方法允许说明，不把指定方法填空当唯一算法。',
  review: {
    date: '2026-10-04',
    reviewer: '公开扫描第10～11页与放大整图逐项核对',
    notes:
      '实际核对洗盘7/6、叠衣6/5、接数与13个一换十、6+5两凑十、两组果蔬图、7起两跳各3、涂色图全部28式（12八项、11五项）。文字卡原创重排，不复制区域轮廓，真实提问/原图拨画/涂色独立manual，反思计划null。',
  },
  steps: [
    {
      title: '先问什么，再选信息',
      text: '本站故事中甲洗7个盘子，乙洗6个不同盘子，可以问两人一共洗几个盘子。另有两人分别叠6件和5件不同衣服，可问一共叠几件。盘子和衣服是两类对象，不能把7个盘子与5件衣服合答为12个盘子。',
      activity:
        '实际对照第10页四条信息，各提出一个与洗盘、叠衣有关的加法问题，说明所用信息。',
    },
    {
      title: '七加六的两种凑十',
      text: '7+6先凑7，把6分3与3：7+3=10，再添3为13。也可先凑6，把7分4与3：6+4=10，再添3仍13。指定四空方法要按所问的路径填，不能因此说另一合理方法错。',
      visual: { kind: 'ten-frame', left: 7, right: 6 },
      activity: '实际用材料表示7与6，分别尝试两种凑十并解释。',
    },
    {
      title: '十三个一换成十与一',
      text: '把13个一中的10个一换成1个十，数量仍13；最后十位1、个位3。换十不是另添10个一，也不是总量变成1。教材计数器中接着拨和换十是不同操作时刻，先说在哪个时刻观察。',
      visual: { kind: 'place-value', value: 13 },
      activity:
        '实际对照原书计数器拨或画13个一的换十过程；只有纸面模拟时如实说明材料。',
    },
    {
      title: '六加五也能换路径',
      text: '6+5先凑6：把5分4与1，6+4=10，再添1为11。先凑5：把6分5与1，5+5=10，再添1也为11。衣服的单位是件，不能把答句改为盘子。',
      visual: { kind: 'ten-frame', left: 6, right: 5 },
      activity: '实际对照第11页叠衣情境，分别摆拨或画记两种方法。',
    },
    {
      title: '两次加三不是只加三',
      text: '本站数序从7起，先加3到10，再加3到13。两次一共加6，因此完整算式7+6=13；不能只记第一次7+3=10。数序上的长短只作图示，次数与给定加数才是依据。',
      activity: '实际指出或画出第11页两次加3的起点、中间数、最后数及总加数。',
    },
    {
      title: '每张都算，再按结果分类',
      text: '本站把原页的28个算式改放到文字卡中并重新编号。先独立计算每张，再分别找结果12和11的全部卡；其它结果不加入这两组。同一个结果可来自不同算式，重复漏选都要核对，本站编号不等于原图区域位置。',
      activity:
        '实际逐区计算原书完整图，再按原题的12和11两种要求涂色并核对所有区域。',
    },
    {
      title: '实际生活与纸面练习分开',
      text: '对照果蔬图先点数、圈十、列完整式与单位；家务活动可在家长同意和陪伴下尝试自己能做的简单整理。只讨论或计划不算已完成家务。自己的提问、困难与未来计划分别记录，不用网页分数证明实际合作或劳动。',
      activity:
        '实际完成两组果蔬圈算，讲清单位；自选安全整理是否已做如实记录。',
    },
  ],
  questions: [
    ...(
      [
        [7, 6, 13, '个盘子'],
        [6, 5, 11, '件衣服'],
        [7, 7, 14, '个原创纸卡标记'],
        [8, 5, 13, '根原创小棒'],
      ] as const
    ).map(([a, b, total, unit], index) =>
      number(
        `sum-${index}`,
        `本站两组互不重叠，${a}${unit}与${b}${unit}，合计多少？`,
        total,
        `${a}+${b}=${total}，答句按本题${unit}的对象和单位。`,
      ),
    ),
    method(
      'seven-first',
      '本站7+6先凑7，依次填：从6分出多少、剩多少、凑成多少、总量。',
      [3, 3, 10, 13],
      '6分3与3；7+3=10，10+3=13。',
    ),
    method(
      'six-first',
      '同一7+6先凑6，依次填：从7分出多少、剩多少、凑成多少、总量。',
      [4, 3, 10, 13],
      '7分4与3；6+4=10，10+3=13。',
    ),
    method(
      'clothes-six',
      '本站6+5先凑6，依次填：从5分出多少、剩多少、凑成多少、总量。',
      [4, 1, 10, 11],
      '5分4与1；6+4=10，10+1=11。',
    ),
    method(
      'clothes-five',
      '同一6+5先凑5，依次填：从6分出多少、剩多少、凑成多少、总量。',
      [5, 1, 10, 11],
      '6分5与1；5+5=10，10+1=11。',
    ),
    method(
      'exchange',
      '本站先有13个一，换10个一为1个十。依次填换前几个一、换出几个十、换后十位数字、个位数字。',
      [13, 1, 1, 3],
      '13个一换成1个十3个一，合计仍13，两个时刻不混。',
    ),
    method(
      'two-jumps',
      '本站从7起先加3再加3，依次填第一次加数、第二次加数、总加数、最后数。',
      [3, 3, 6, 13],
      '两个加数3与3共6，最后7+6=13。',
    ),
    number(
      'total-add',
      '本站从7先加3再加3，一共加了多少？',
      6,
      '3+3=6，不能只计算一次。',
    ),
    number(
      'last-number',
      '同样从7先加3再加3，最后到多少？',
      13,
      '先10，再13。',
    ),
    number(
      'zero-ones',
      '本站7与3张卡共10张，全部组成1个十，散着的一有几个？',
      0,
      '散着的一0个，总量仍10。',
    ),
    ...bnuChoreExpressions.map(([a, op, b], index) =>
      number(
        `card-${index + 1}`,
        `本站文字卡${index + 1}：${a}${op}${b}，结果是多少？`,
        op === '+' ? a + b : a - b,
        `${a}${op}${b}=${op === '+' ? a + b : a - b}，按运算符分别核对。`,
      ),
    ),
    cardSet('result-twelve', bnuChoreExpressions, 12),
    cardSet('result-eleven', bnuChoreExpressions, 11),
    actual(
      'actual-questions',
      '实际读第10页四条信息，分别提出洗盘与叠衣加法问题，说明对象、条件与所求；两类做过再确认。',
    ),
    actual(
      'actual-plates',
      '实际对照洗盘情境，摆拨或画7与6，计算并说明两种凑十；做过再确认。',
    ),
    actual(
      'actual-exchange',
      '实际对照原计数器做或画13个一换成十与一，说明换前换后数量相同；做过再确认。',
    ),
    actual(
      'actual-clothes',
      '实际对照叠衣情境，摆拨或画6与5，完成整式并说明两种凑十；做过再确认。',
    ),
    actual(
      'actual-oranges',
      '实际对照第11页橙子两组，逐一点数、圈十并填写完整算式和单位；做过再确认。',
    ),
    actual(
      'actual-cabbages',
      '实际对照第11页白菜两组，逐一点数、圈十并填写完整算式和单位；做过再确认。',
    ),
    actual(
      'actual-jumps',
      '实际对照两次加3图，指出全部起点、中间、终点与总加数并填整式；做过再确认。',
    ),
    actual(
      'actual-color',
      '实际对照原书完整28区域，逐项计算，结果12涂原题粉色、11涂原题绿色，其余不冒这两类；全部核对后确认。',
    ),
    actual(
      'actual-household',
      '经家长同意陪伴，实际尝试力所能及的简单整理；只计划、只讨论或不适合做请跳过。',
    ),
    task(
      'reflection',
      '记录自己实际怎样提问或计算，尚未动手请如实说明。',
      { kind: 'reflection' },
      '记录不自动评分，不证明实际操作或家务完成。',
    ),
    task(
      'plan',
      '记录下一次准备怎样练习或整理，计划单独记，不当已完成。',
      { kind: 'reflection' },
      '未来计划与已做活动分别保存。',
    ),
  ],
  reviewQuestions: [
    number(
      'review-sum',
      '换一组：8张与7张纸卡无重叠，共几张？',
      15,
      '8+7=15。',
    ),
    method(
      'review-method',
      '换一组8+7先凑8，依次填从7分出多少、剩多少、凑成多少、总量。',
      [2, 5, 10, 15],
      '7分2与5，8+2=10，再添5为15。',
    ),
    cardSet(
      'review-twelve',
      [
        [8, '+', 4],
        [7, '+', 5],
        [15, '−', 3],
        [9, '+', 2],
        [6, '+', 5],
        [14, '−', 2],
        [4, '+', 6],
        [16, '−', 4],
      ],
      12,
    ),
    number(
      'review-zero',
      '换一组14张卡拿走4张，剩10张组成1个十，散着的一有几个？',
      0,
      '剩余总量10，散着的一0个。',
    ),
  ],
};
