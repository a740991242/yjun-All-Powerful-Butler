import type { Question } from '../learning/types';

const id = 'sj-upper-ten-review';
type Calculation = readonly [number, '+' | '-', number];
type Sequential = readonly [number, '+' | '-', number, '+' | '-', number];
type Equality = readonly [number, '+' | '-', number, number];
const result = ([a, op, b]: Calculation) => (op === '+' ? a + b : a - b);

/** Original practice, with complete group sizes; textbook work is recorded separately. */
export function tenPracticeGroups(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}-full`;
  const oral: Calculation[] = review
    ? [
        [6, '+', 4],
        [10, '-', 6],
        [1, '+', 9],
        [10, '-', 3],
        [7, '+', 3],
        [10, '-', 5],
        [5, '+', 5],
        [10, '-', 2],
        [4, '+', 6],
        [10, '-', 1],
        [2, '+', 8],
        [10, '-', 10],
      ]
    : [
        [4, '+', 6],
        [10, '-', 2],
        [8, '+', 2],
        [10, '-', 6],
        [5, '+', 5],
        [10, '-', 10],
        [1, '+', 9],
        [10, '-', 4],
        [2, '+', 8],
        [10, '-', 7],
        [6, '+', 4],
        [10, '-', 5],
      ];
  const matching: Calculation[] = review
    ? [
        [6, '+', 4],
        [9, '-', 4],
        [3, '+', 4],
        [10, '-', 1],
        [2, '+', 6],
        [8, '-', 2],
        [10, '-', 5],
        [5, '+', 5],
        [1, '+', 3],
        [9, '-', 2],
      ]
    : [
        [7, '-', 3],
        [3, '+', 2],
        [9, '-', 3],
        [5, '+', 2],
        [10, '-', 2],
        [6, '+', 3],
        [8, '+', 2],
        [7, '+', 3],
        [10, '-', 5],
        [8, '-', 1],
      ];
  const sequential: Sequential[] = review
    ? [
        [1, '+', 4, '+', 3],
        [10, '-', 5, '-', 2],
        [3, '+', 6, '-', 4],
        [2, '+', 3, '+', 5],
        [10, '-', 8, '+', 7],
        [10, '-', 2, '+', 1],
      ]
    : [
        [2, '+', 4, '+', 3],
        [10, '-', 6, '-', 2],
        [5, '+', 4, '-', 3],
        [3, '+', 2, '+', 5],
        [10, '-', 7, '+', 6],
        [10, '-', 4, '+', 2],
      ];
  const equalities: Equality[] = review
    ? [
        [1, '+', 9, 4],
        [8, '-', 3, 2],
        [2, '+', 8, 5],
        [10, '-', 4, 1],
        [3, '+', 5, 2],
        [9, '-', 2, 4],
      ]
    : [
        [3, '+', 7, 2],
        [9, '-', 4, 1],
        [4, '+', 6, 3],
        [10, '-', 3, 2],
        [2, '+', 6, 1],
        [9, '-', 3, 4],
      ];
  const first = review ? 4 : 6;
  const second = review ? 6 : 3;
  const total = first + second;
  return [
    ...oral.map((calculation, index): Question => ({
      id: `${prefix}-oral-${index}`,
      knowledge: `${id}-full-oral-${index}`,
      prompt: `本站原创十二式，第${index + 1}条：${calculation.join(' ')} = □。填结果。`,
      rule: { kind: 'number', value: result(calculation) },
      hint: '先看加号还是减号，可用十个物件分合；全部拿走时结果为0。',
      explanation: `${calculation.join(' ')} = ${result(calculation)}。逐条核对，不因前一条结果相同而跳过。`,
    })),
    ...matching.map((calculation, index): Question => ({
      id: `${prefix}-matching-${index}`,
      knowledge: `${id}-full-matching-${index}`,
      prompt: `本站原创十式配对，第${index + 1}条：${calculation.join(' ')}。选它对应的结果。相同结果可以对应多条算式。`,
      choices: Array.from({ length: 7 }, (_, n) => ({
        id: String(n + 4),
        label: String(n + 4),
      })),
      rule: { kind: 'choice', value: String(result(calculation)) },
      hint: '每条都先计算再找结果；结果卡可以重复使用，不能配过一次就排除。',
      explanation: `${calculation.join(' ')} = ${result(calculation)}。不同算式可以得到同一个数，十条都要分别核对。`,
    })),
    ...sequential.map(([a, op, b, nextOp, c], index): Question => {
      const middle = result([a, op, b]);
      const end = result([middle, nextOp, c]);
      return {
        id: `${prefix}-sequential-${index}`,
        knowledge: `${id}-full-sequential-${index}`,
        prompt: `本站原创六条连算，第${index + 1}条：${a} ${op} ${b} ${nextOp} ${c}。依次填第一步结果、最后结果。`,
        rule: { kind: 'steps', values: [middle, end] },
        hint: '从左往右。第二步接着中间结果算，不重新使用第一个数。',
        explanation: `${a} ${op} ${b} = ${middle}；${middle} ${nextOp} ${c} = ${end}。两个结果分别对应两步。`,
      };
    }),
    ...(
      [
        [
          `一盒有${first}张方形卡和${second}张圆形卡，两类没有重叠。一共几张卡？`,
          first,
          second,
          total,
          'add',
        ],
        [
          `同一盒共${total}张卡，其中方形卡${first}张，其余都是圆形卡。圆形卡几张？`,
          total,
          first,
          second,
          'subtract',
        ],
        [
          `同一盒共${total}张卡，其中圆形卡${second}张，其余都是方形卡。方形卡几张？`,
          total,
          second,
          first,
          'subtract',
        ],
      ] satisfies [string, number, number, number, 'add' | 'subtract'][]
    ).map(([story, left, right, answer, operation], index): Question => ({
      id: `${prefix}-application-${index}`,
      knowledge: `${id}-full-application-${index}`,
      prompt: `本站原创三问题，第${index + 1}题：${story}依次填写算式的两个数和结果，单位都是张。${operation === 'add' ? '本题用加法求总数。' : '本题用减法求另一部分。'}`,
      rule: {
        kind: 'steps',
        values: [left, right, answer],
      },
      hint: '先分清给定的是两部分还是总数和一部分，再确定所求对象。总数减去已知部分，不代表实际拿走了卡片。',
      explanation: `${left} ${operation === 'add' ? '+' : '-'} ${right} = ${answer}（张）。三题用同一组事实，所求不同，要分别写完整答句。`,
    })),
    ...equalities.map(([a, op, b, right], index): Question => {
      const left = result([a, op, b]);
      return {
        id: `${prefix}-equality-${index}`,
        knowledge: `${id}-full-equality-${index}`,
        prompt: `本站原创等式两边，第${index + 1}条：${a} ${op} ${b} = ${right} + □。填空使两边一样大。`,
        rule: { kind: 'number', value: left - right },
        hint: '先算完整左边，再找右边还需加几；填好要把两边分别算一遍。',
        explanation: `左边是${left}；右边${right} + ${left - right} = ${left}。等号不是只抄左边结果到空格。`,
      };
    }),
  ];
}
