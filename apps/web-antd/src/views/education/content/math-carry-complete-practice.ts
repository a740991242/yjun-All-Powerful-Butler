import type { Question } from '../learning/types';

import { required } from '../learning/required';

const process = 'mu-carry-process';
const organize = 'mu-carry-organize';
function question(
  id: string,
  key: string,
  review: boolean,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  labels?: string[],
): Question {
  return {
    id: `${id}-${review ? 'r' : 'q'}-complete-${key}`,
    knowledge: `${id}-complete-${key}`,
    prompt,
    rule,
    explanation,
    hint: '先逐个计算并保留中间量，再核对所求；每个空都要填，0不是未填写。',
    choices: labels?.map((label) => ({ id: label, label })),
  };
}
type Comparison = readonly [number, number, number, number];
const expression = (a: number, b: number) =>
  b === 0 ? String(a) : `${a}+${b}`;
function comparisons(
  id: string,
  group: string,
  rows: readonly Comparison[],
  review: boolean,
): Question[] {
  return rows.map(([a, b, c, d], i) => {
    const left = a + b;
    const right = c + d;
    let result = '=';
    if (left > right) result = '>';
    else if (left < right) result = '<';
    return question(
      id,
      `${group}-${i}`,
      review,
      `比较${expression(a, b)}与${expression(c, d)}，前一边应填哪种关系？`,
      { kind: 'choice', value: result },
      `前一边是${left}，后一边是${right}；${left}${result}${right}。先算两边，不把某个加数直接当和比较。`,
      ['>', '<', '='],
    );
  });
}
export function carryProcessCompleteQuestions(review: boolean): Question[] {
  const first: Comparison[] = review
    ? [
        [9, 6, 14, 0],
        [9, 2, 12, 0],
        [9, 4, 13, 0],
        [9, 7, 16, 0],
        [9, 1, 9, 0],
        [9, 10, 20, 0],
      ]
    : [
        [9, 4, 14, 0],
        [9, 2, 11, 0],
        [9, 8, 16, 0],
        [9, 6, 16, 0],
        [9, 5, 14, 0],
        [9, 9, 17, 0],
      ];
  const second: Comparison[] = review
    ? [
        [8, 6, 13, 0],
        [7, 5, 12, 0],
        [4, 7, 12, 0],
        [6, 8, 13, 0],
        [8, 7, 15, 0],
        [9, 8, 18, 0],
      ]
    : [
        [8, 5, 12, 0],
        [7, 4, 11, 0],
        [4, 6, 11, 0],
        [6, 7, 12, 0],
        [8, 6, 14, 0],
        [9, 7, 17, 0],
      ];
  const missing = [
    [6, 14],
    [5, 12],
    [4, 12],
    [5, 10],
    [4, 11],
    [2, 10],
  ] as const;
  const cards = review ? [10, 7, 5, 6, 8, 3, 9, 4] : [4, 9, 3, 8, 6, 5, 7, 10];
  const pairs = cards.slice(0, -1).map((n, i) => n + required(cards[i + 1]));
  const chains: [number, number, number][] = review
    ? [
        [9, 1, 4],
        [9, 1, 6],
        [9, 1, 8],
        [7, 3, 3],
        [6, 4, 2],
        [8, 2, 4],
      ]
    : [
        [9, 1, 3],
        [9, 1, 5],
        [9, 1, 7],
        [7, 3, 2],
        [6, 4, 3],
        [8, 2, 3],
      ];
  const pattern = [
    [5, 5],
    [4, 6],
    [5, 6],
    [6, 6],
    [5, 7],
  ] as const;
  return [
    ...comparisons(process, 'nine-compare', first, review),
    ...comparisons(process, 'mixed-compare', second, review),
    ...missing.map(([known, sum], i) => {
      let total = sum;
      if (review) total += i === 2 || i === 4 ? 2 : 1;
      return question(
        process,
        `missing-${i}`,
        review,
        `${known}+□=${total}，缺少的加数是多少？`,
        { kind: 'number', value: total - known },
        `把整体${total}分成已知的${known}和另一部分，缺少${total - known}；填回原式再相加核对。`,
      );
    }),
    question(
      process,
      'adjacent-pairs',
      review,
      `原创纸卡从左到右为${cards.join('、')}。分别计算第1和2、第2和3，直到第7和8张的和，依次填全部七个结果；共用的中间卡分别参加两边。`,
      { kind: 'steps', values: pairs },
      `七对分别为${cards
        .slice(0, -1)
        .map((n, i) => `${n}+${required(cards[i + 1])}=${required(pairs[i])}`)
        .join('；')}。不是把全部八张卡连加，也不是每隔两张取一对。`,
    ),
    ...chains.map(([a, b, c], i) =>
      question(
        process,
        `chain-pair-${i}`,
        review,
        `依次填${a}+${b}+${c}的第一步${a}+${b}、最终和，以及${a}+${b + c}的和。`,
        { kind: 'steps', values: [a + b, a + b + c, a + b + c] },
        `先得${a + b}，再加${c}得${a + b + c}；另一式把${b}和${c}合成${b + c}，仍得${a + b + c}。中间量不当最终和。`,
      ),
    ),
    question(
      process,
      'five-patterns',
      review,
      `依次填这五个原创算式的和：${pattern.map(([a, b]) => `${a}+${b + (review ? 1 : 0)}`).join('、')}。`,
      {
        kind: 'steps',
        values: pattern.map(([a, b]) => a + b + (review ? 1 : 0)),
      },
      `五个和依次为${pattern.map(([a, b]) => a + b + (review ? 1 : 0)).join('、')}。一边少1另一边多1时和不变；只增一边1时和增1，须分别读每条条件。`,
    ),
  ];
}
export function carryOrganizeCompleteQuestions(review: boolean): Question[] {
  const rows: Comparison[] = review
    ? [
        [14, 0, 5, 8],
        [4, 9, 14, 0],
        [7, 7, 14, 0],
        [13, 0, 5, 9],
        [6, 6, 11, 0],
        [3, 9, 12, 0],
      ]
    : [
        [13, 0, 5, 7],
        [4, 8, 13, 0],
        [7, 6, 13, 0],
        [12, 0, 5, 8],
        [6, 5, 10, 0],
        [3, 8, 11, 0],
      ];
  const missing = [
    [7, 15, false],
    [9, 13, false],
    [4, 12, true],
    [6, 14, false],
    [8, 16, false],
    [5, 14, true],
  ] as const;
  const signs: [number, number, number][] = review
    ? [
        [8, 4, 12],
        [10, 3, 7],
        [9, 6, 15],
        [16, 10, 6],
      ]
    : [
        [7, 5, 12],
        [10, 4, 6],
        [8, 7, 15],
        [15, 10, 5],
      ];
  return [
    ...comparisons(organize, 'result-compare', rows, review),
    ...missing.map(([known, sum, onLeft], i) => {
      const total = sum + (review ? 1 : 0);
      return question(
        organize,
        `missing-${i}`,
        review,
        `${onLeft ? `□+${known}` : `${known}+□`}=${total}，缺少的加数是多少？`,
        { kind: 'number', value: total - known },
        `整体${total}里已有${known}，另一部分是${total - known}。未知加数在左或右不改变整体与部分关系；填回核对。`,
      );
    }),
    ...signs.map(([a, b, total], i) =>
      question(
        organize,
        `sign-${i}`,
        review,
        `在${a}○${b}=${total}中选择“+”或“−”，使等式成立。`,
        { kind: 'choice', value: a + b === total ? '+' : '−' },
        `相加得${a + b}，相减得${a - b}；本式要求${total}，应选${a + b === total ? '+' : '−'}。不能只看数字大小选符号。`,
        ['+', '−'],
      ),
    ),
    ...(review ? [12, 19] : [11, 20]).map((total, i) =>
      question(
        organize,
        `zero-partition-${i}`,
        review,
        `补充范围：两个0～20的整数相加，可以有0，和为${total}。依次填自己的一种分法，两数都要填写。`,
        { kind: 'partition', parts: 2, total, minimum: 0 },
        `从0和${total}、1和${total - 1}，直到${total}和0，都是本题允许的分法；左右交换分别记，共${total + 1}种。这里允许0，与前面的两个正整数分法范围不同；未填不能当0。`,
      ),
    ),
  ];
}
export const carryProcessSourceTasks = [
  [
    'page-89',
    '实际回第89页：原两幅圈十图全部圈画、拆数、中间式与结果分别填完；底部三组连加/加法配对的全部六式逐条算并解释联系。本站指定方法例子不能代替原两图和三组。',
  ],
  [
    'page-90',
    '实际回第90页：移动9按原十一格顺序全部口算；原两类事物图分别点数并写两条加法；九行圆片全部圈十填数并说发现；六个关系全部计算后比较。不得只做一行或把图中两种事物混为同一单位。',
  ],
  [
    'page-91',
    '实际回第91页：原两幅物品图的圈十、拆分、凑成10与最后和全部填写；底部三组连加和加法共六式逐项核对。原图与本站十格操作分开记录。',
  ],
  [
    'page-92',
    '实际回第92页：同一原算式的两种凑十各实际摆并填完整，另用交换加数说明；做一做两式、三组交换加数六式、三个轮盘全部八/六/五个外围数分别说得数并写式。个人喜欢的方法不统一评分，也不把轮盘中心算成外围。',
  ],
  [
    'page-93',
    '实际回第93页：原小数加几示例实际说明算法；试一试四组交换共八式与做一做三枝共九式全部处理；按原游戏全部卡片找目标和并核对，独自做不冒同伴交流。原卡与本站六张卡分别记录。',
  ],
  [
    'page-94',
    '实际回第94页前三项：移动8完成原十格，再分别换3、4、5各完成同十格；九张动物算式全部分配相应得数；八个数的七条相邻连接全部算，含已给的示例也核对。不是把八数全部连加，也不忽略中间数同时参加左右两对。',
  ],
  [
    'page-95',
    '实际回第95页运算部分：六个关系、五个规律算式、六个缺加数分别全部核对并说条件变化；原思考题两人各持三个数，从双方各交换一个，使两边新和相等。本站两张卡交换例子不能代替原各三个气球的条件。',
  ],
] as const;
export const carryRelationsSourceTasks = [
  [
    'page-94-monkeys',
    '实际回第94页原猴子情境，记录原有与新来两个已知部分，按图核对新来数量并完整写式、单位和答句，再回看；只数当前一部分不当原有或全部。',
  ],
  [
    'page-95-table',
    '实际回第95页原三行体育用品表，逐行读两班数量和单位，三个合计全部填写并各自核对；不同物品的个/根不能混成一个总物品，本站鱼花两行表不代替原三行。',
  ],
  [
    'page-96',
    '实际回第96页原整幅分类例题，读原明确身份条件，按两种标准补全全部空格、列两式、答句并回看同一整体；人物外貌不当现实身份依据，不把两次分类合并成双倍人数。',
  ],
  [
    'page-97',
    '实际回第97页领走与剩下的原例题，分别填已知、所求、两部分图、算式、单位、答句，再解释求原来总数为何合并两部分；划去的数量仍属原来整体，缺图不猜0。',
  ],
  [
    'page-98-swans',
    '实际回第98页做一做原天鹅图，按自己明确的标准完整点数、写式与答句并回看；同群换标准不增加总数，静态两类不冒新增事件。',
  ],
  [
    'page-98-football',
    '实际回第98页原借走与剩下足球题，已知、所求、表示、算式、单位与答句完整核对；不要因“借走”就自动用减法。',
  ],
  [
    'page-98-stage',
    '实际回第98页练一练舞台原图，用两种明确分类标准各完整列式和答句，回看同一批人数；不把两次总数再相加，遮挡数量未核清保留待核对。',
  ],
  [
    'page-99-stories',
    '实际回第99页草莓和游乐情境分别解答，记录已吃/剩下与已进去/外面等实际已知范围，分别画表示、列式、单位与答句并回看；工作人员不未经说明算成同学，本站纸片故事不代替这两题。',
  ],
  [
    'page-101-blocks',
    '实际回第101页积木原题，按两个孩子的说明核对两种分法得到同一整体，写式、单位与答句；不是把两种描述各总量再相加，也不按看见的面重复数块。',
  ],
  [
    'page-102-stories',
    '实际回第102页原饺子题和排队思考题分别完整处理，吃掉与剩下合为原来整体，前后人数都不含自己时另计本人；原两题与本站变式分别记录，图中省略位置不当没人。',
  ],
] as const;
export const carryOrganizeSourceTasks = [
  [
    'page-99-oral',
    '实际回第99页第3项十二条原算式，包含加法和已学减法，全部计算并逐条核对；不要只做进位的部分。',
  ],
  [
    'page-99-sticks',
    '实际回第99页原三个小棒图，逐根点数各自完整图，解答指定两个图案共用量，再自主提出完整问题并解答；先确定哪些边/棒共用，本站正方形或三角形不是原三个图案。',
  ],
  [
    'page-99-compare',
    '实际回第99页第6项六个关系全部计算两边后填写，注意有的前一边是数、有的是算式；不只比较加数。',
  ],
  [
    'page-100-table',
    '实际回第100页完整原加法表补全所有待填算式，说明原整理方式、任指算式说得数、计算完整第一列和第一行并说发现三个要求分别完成；网页通用81格和自己按和排的45卡排列不同，不当原表。',
  ],
  [
    'page-101-oral',
    '实际回第101页第1项十二条原算式全部计算并核对，包括恰好10、加10、减法和两个相同加数；已有少数网页题不代替整组。',
  ],
  [
    'page-101-game',
    '实际按第101页原比较得数游戏把全部原算式卡逐条算对，按原两张所选卡比较，再恢复牌组轮流或独自试新选择；准备卡片不等于已玩，同和要如实记相等。',
  ],
  [
    'page-101-fill',
    '实际回第101页两组同和填式，把两个示例及四个剩余加法都核对，完整填写并说同和不同分法；合理不同加数组合保留，不强制照抄一个示例。',
  ],
  [
    'page-101-signs',
    '实际回第101页第6项四个等式分别填写加/减符号，逐个代回核对，不能只做加法的两项。',
  ],
  [
    'page-102-missing',
    '实际回第102页第8项六个缺加数全部填写，未知数在加号左右都有，逐条代回核对；不把未知位置不同当作不同数量关系。',
  ],
  [
    'page-102-growth',
    '实际回第102页成长小档案，计算方法与解决实际问题两方面分别给真实尝试和自己的原话；尚未做的活动另记待做，不自动评星或由网页正确率确认口算熟练。',
  ],
  [
    'page-101-all-sums',
    '实际回第101页第5项，把和11～20的加法分组说出并逐组核对。原题没有明写两加数必须为正数；本站补充活动用已学0～20的整数，包含0与和本身，交换次序分别记，每组从0开始到和本身，共和加1种。与前面只用正数的原创纸卡分开记录；如原书课堂另限定范围，按实际要求说明，不能将本站限制冒称原题条件。',
  ],
] as const;
