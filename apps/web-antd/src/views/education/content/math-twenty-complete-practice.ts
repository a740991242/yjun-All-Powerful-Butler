import type { Question } from '../learning/types';

const id = 'mu-twenty-links';
type Expression = readonly [number, '+' | '−', number];
const answer = ([a, op, b]: Expression) => (op === '+' ? a + b : a - b);
const label = ([a, op, b]: Expression) => `${a}${op}${b}`;
/** Original numbers and ordering; source page exercises remain separate paper tasks. */
export function twentyCompleteQuestions(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}-complete`;
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
  ): Question => ({
    id: `${prefix}-${key}`,
    knowledge: `${id}-complete-${key}`,
    prompt,
    rule,
    hint: '每条独立算；连算先保留中间量，比较先算两边。配对以结果相等为准，0不是未填。',
    explanation: '逐项计算后代回核对；这一条完成不能代替整组或实际原书作业。',
  });
  const oral: Expression[] = review
    ? [
        [10, '+', 6],
        [16, '−', 10],
        [12, '+', 4],
        [16, '−', 4],
        [13, '+', 3],
        [16, '−', 3],
        [18, '−', 5],
        [7, '+', 10],
        [14, '+', 0],
        [11, '+', 6],
        [10, '−', 8],
        [19, '−', 5],
      ]
    : [
        [10, '+', 5],
        [15, '−', 10],
        [13, '+', 4],
        [17, '−', 4],
        [12, '+', 6],
        [18, '−', 6],
        [17, '−', 5],
        [6, '+', 10],
        [15, '+', 0],
        [12, '+', 3],
        [10, '−', 9],
        [18, '−', 3],
      ];
  const pairs: readonly (readonly [Expression, Expression])[] = review
    ? [
        [
          [12, '+', 4],
          [18, '−', 2],
        ],
        [
          [10, '+', 9],
          [9, '+', 10],
        ],
        [
          [18, '−', 10],
          [3, '+', 5],
        ],
        [
          [15, '−', 2],
          [10, '+', 3],
        ],
      ]
    : [
        [
          [11, '+', 3],
          [17, '−', 3],
        ],
        [
          [10, '+', 7],
          [7, '+', 10],
        ],
        [
          [18, '−', 10],
          [2, '+', 6],
        ],
        [
          [14, '−', 2],
          [10, '+', 2],
        ],
      ];
  const chains: readonly (readonly [
    number,
    '+' | '−',
    number,
    '+' | '−',
    number,
  ])[] = review
    ? [
        [8, '+', 2, '+', 7],
        [5, '+', 5, '+', 8],
        [7, '+', 3, '+', 4],
        [6, '+', 4, '−', 5],
        [13, '−', 3, '+', 6],
        [17, '−', 7, '−', 10],
      ]
    : [
        [6, '+', 4, '+', 8],
        [4, '+', 6, '+', 7],
        [9, '+', 1, '+', 5],
        [8, '+', 2, '−', 6],
        [12, '−', 2, '+', 4],
        [16, '−', 6, '−', 10],
      ];
  const comparisons: readonly (readonly [Expression, number])[] = review
    ? [
        [[14, '+', 0], 13],
        [[8, '+', 0], 12],
        [[19, '+', 0], 20],
        [[10, '+', 6], 15],
        [[18, '−', 4], 14],
        [[17, '−', 7], 11],
      ]
    : [
        [[13, '+', 0], 14],
        [[7, '+', 0], 11],
        [[20, '−', 0], 18],
        [[10, '+', 5], 13],
        [[18, '−', 5], 13],
        [[15, '−', 5], 12],
      ];
  const blanks: readonly (readonly [number, number])[] = review
    ? [
        [6, 10],
        [10, 15],
        [12, 17],
      ]
    : [
        [8, 10],
        [10, 14],
        [13, 18],
      ];
  return [
    ...oral.map((e, i) =>
      q(`oral-${i}`, `${label(e)}=几？这条独立开始，不接上一题结果。`, {
        kind: 'number',
        value: answer(e),
      }),
    ),
    ...pairs.map(([left, right], i): Question => {
      const candidates = pairs.map((p) => label(p[1]));
      return {
        ...q(
          `pair-${i}`,
          `为${label(left)}选一个结果相等的完整算式；四题各自核对，不能只看运算符或位置。`,
          { kind: 'choice', value: label(right) },
        ),
        choices: candidates.map((c) => ({ id: c, label: c })),
      };
    }),
    ...chains.map(([a, op, b, second, c], i) => {
      const first = answer([a, op, b]);
      return q(
        `chain-${i}`,
        `${a}${op}${b}${second}${c}：先填前两个数运算的中间结果，再填最终结果。`,
        { kind: 'steps', values: [first, answer([first, second, c])] },
      );
    }),
    ...comparisons.map(([e, other], i): Question => {
      const value = answer(e);
      let relation = '＝';
      if (value < other) relation = '＜';
      else if (value > other) relation = '＞';
      return {
        ...q(`compare-${i}`, `${label(e)} □ ${other}，选正确比较符号。`, {
          kind: 'choice',
          value: relation,
        }),
        choices: ['＜', '＞', '＝'].map((c) => ({ id: c, label: c })),
      };
    }),
    ...blanks.map(([a, total], i) =>
      q(`blank-${i}`, `${a}+□=${total}，只填缺少的加数，再代回检查。`, {
        kind: 'number',
        value: total - a,
      }),
    ),
  ];
}
export const twentyCompleteSourceTasks = [
  [
    'calculations',
    '实际回同版第81页做一做第3项、第84页练一练第3项，两组各六式全部独立计算并逐条核对，记录需要帮助或改正的式子；本站十二条数值不同，不抄本站结果到原书。',
  ],
  [
    'matching',
    '实际回第83页练一练第1项，把全部八张算式算清，再核对四组结果相等的连线，包括已画示例。每卡只对应本组另一式，不因交换加数或不同运算符排除相等；保留完整连线，本站四题不冒原图完成。',
  ],
  [
    'chains',
    '实际回第84页第6项完成全部六条连算，每条记录中间结果和最终结果，依原先后计算，不拿前一条结果作后一条起点；最后结果0照写，未填不当0。',
  ],
  [
    'comparisons',
    '实际回第84页第7项完成全部六处比较，纯数与算式比较分别核对，算式先算再比；遇到相等明确写等号，不强求每题都填大小。',
  ],
  [
    'blanks',
    '实际回第86页第5项填全三个缺少的加数，每式代回使两边相等；三个空分别处理，不只任选一式。',
  ],
  [
    'route',
    '实际回第86页第4项，核对原四行五列全部二十式，从原入口逐步检查下一步得数大1的路线及终点，并保留每步算式、结果和位置。原图与本站先前自制三行五列小路不同，不能用自制图代替原路线；不清楚相邻方向先核对原页和陪读要求，不猜隐藏路线。',
  ],
  [
    'color',
    '实际回第87页数学游戏，逐个区域先算式再按原给定得数与颜色涂完并核对。同值不同区域都要处理，不能只做四个例子、按位置或面积猜；本站自制六式分区图不是原图，保留自己的完整原书作品。',
  ],
] as const;
