import type { Lesson, Question, Visual } from '../learning/types';

type Draft = Omit<Question, 'id' | 'knowledge'>;
type Calculation = [number, '+' | '-', number];

// Explicit alternatives preserve the revised book's lesson-specific ranges.
// Do not expand these into unconstrained random arithmetic.
const alternatives: Record<string, Calculation[]> = {
  'mu-five-add': [
    [1, '+', 2],
    [3, '+', 1],
    [1, '+', 4],
    [2, '+', 3],
    [1, '+', 1],
    [2, '+', 1],
  ],
  'mu-five-sub': [
    [3, '-', 1],
    [4, '-', 3],
    [5, '-', 1],
    [5, '-', 2],
    [2, '-', 2],
    [4, '-', 4],
  ],
  'mu-zero': [
    [0, '+', 1],
    [0, '+', 2],
    [2, '+', 0],
    [3, '-', 0],
    [2, '-', 2],
    [4, '-', 4],
  ],
  'mu-ten-addsub': [
    [2, '+', 6],
    [3, '+', 6],
    [1, '+', 8],
    [7, '-', 2],
    [8, '-', 6],
    [10, '-', 3],
  ],
  'mu-twenty-addsub': [
    [11, '+', 5],
    [13, '+', 4],
    [15, '+', 2],
    [17, '-', 5],
    [18, '-', 6],
    [19, '-', 4],
  ],
  'mu-carry-nine': [
    [9, '+', 6],
    [9, '+', 8],
    [2, '+', 9],
    [4, '+', 9],
    [6, '+', 9],
    [8, '+', 9],
  ],
  'mu-carry-eight': [
    [8, '+', 4],
    [8, '+', 5],
    [7, '+', 5],
    [7, '+', 6],
    [6, '+', 6],
    [6, '+', 7],
  ],
  'mu-carry-small': [
    [5, '+', 7],
    [5, '+', 9],
    [4, '+', 9],
    [3, '+', 8],
    [3, '+', 9],
    [2, '+', 9],
  ],
  'mu-review': [
    [2, '+', 5],
    [10, '-', 6],
    [16, '-', 5],
    [7, '+', 8],
    [6, '+', 9],
    [19, '-', 7],
  ],
  'ml-borrow-nine': [
    [13, '-', 9],
    [15, '-', 9],
    [19, '-', 9],
    [11, '-', 9],
    [14, '-', 9],
    [17, '-', 9],
  ],
  'ml-borrow-eight': [
    [11, '-', 8],
    [14, '-', 8],
    [12, '-', 7],
    [11, '-', 7],
    [12, '-', 6],
    [15, '-', 7],
  ],
  'ml-borrow-small': [
    [11, '-', 5],
    [13, '-', 4],
    [11, '-', 3],
    [14, '-', 5],
    [12, '-', 5],
    [11, '-', 4],
  ],
  'ml-oral-add': [
    [24, '+', 5],
    [24, '+', 30],
    [38, '+', 7],
    [55, '+', 8],
    [47, '+', 20],
    [72, '+', 8],
  ],
  'ml-oral-sub': [
    [59, '-', 4],
    [59, '-', 30],
    [43, '-', 7],
    [72, '-', 9],
    [86, '-', 40],
    [50, '-', 6],
  ],
  'ml-written-add': [
    [34, '+', 25],
    [42, '+', 16],
    [37, '+', 28],
    [58, '+', 24],
    [69, '+', 7],
    [27, '+', 43],
  ],
  'ml-written-sub': [
    [79, '-', 34],
    [86, '-', 52],
    [63, '-', 28],
    [72, '-', 45],
    [90, '-', 17],
    [54, '-', 8],
  ],
  'ml-review': [
    [14, '-', 8],
    [56, '+', 7],
    [78, '-', 30],
    [47, '+', 25],
    [82, '-', 46],
    [59, '+', 31],
  ],
};
function number(
  prompt: string,
  value: number,
  hint: string,
  explanation: string,
  visual?: Visual,
): Draft {
  return { prompt, rule: { kind: 'number', value }, hint, explanation, visual };
}
function choice(
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
  visual?: Visual,
): Draft {
  return {
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
    visual,
  };
}
function calculations(lesson: Lesson, rows: Calculation[]): Draft[] {
  return rows.map(([left, operator, right]) => {
    const value = operator === '+' ? left + right : left - right;
    // Some very small skill sets exhaust all operand pairs. Such alternatives
    // ask for an inverse relationship, not the original result again.
    const original = lesson.questions.some(
      (q) => q.prompt === `${left} ${operator} ${right} = ？`,
    );
    return original
      ? number(
          `${left} ${operator} □ = ${value}，方框里填几？`,
          right,
          '用已知结果检查：把填入的数代回算式。',
          `${left}${operator}${right}=${value}，方框填${right}。`,
        )
      : number(
          `${left} ${operator} ${right} = ？`,
          value,
          lesson.steps[0]?.text ?? '用学具说明数量变化。',
          `${left}${operator}${right}=${value}。${lesson.steps[0]?.text ?? ''}`,
          lesson.id.includes('written')
            ? { kind: 'column', left, operator, right }
            : undefined,
        );
  });
}

function draftsFor(lesson: Lesson): Draft[] {
  const rows = alternatives[lesson.id];
  if (rows) return calculations(lesson, rows);
  if (['mu-count', 'mu-five', 'mu-ten'].includes(lesson.id)) {
    const pairs = (() => {
      if (lesson.id === 'mu-five')
        return [
          [1, 1],
          [1, 2],
          [1, 3],
          [1, 4],
          [2, 2],
          [2, 3],
        ];
      return lesson.id === 'mu-ten'
        ? [
            [1, 5],
            [2, 5],
            [3, 5],
            [4, 5],
            [5, 5],
            [2, 6],
          ]
        : [
            [1, 2],
            [2, 2],
            [2, 3],
            [3, 3],
            [3, 4],
            [4, 4],
          ];
    })();
    return pairs.map(([left = 1, right = 1]) =>
      number(
        '两组圆点合起来一共有几个？请逐一点数。',
        left + right,
        '先数第一组，接着数第二组，不要从1重新开始。',
        `逐一点数，两组共有${left + right}个。`,
        { kind: 'count', count: left, other: right },
      ),
    );
  }
  if (lesson.id.includes('compare')) {
    const pairs = lesson.questions.flatMap((q) =>
      q.visual?.kind === 'count' && q.visual.other !== undefined
        ? [[q.visual.count, q.visual.other]]
        : [],
    );
    return pairs.map(([left = 0, right = 0], index) => {
      const more = index % 2 === 0;
      return choice(
        `第一组${left}个，第二组${right}个。哪一组${more ? '多' : '少'}？`,
        ['第一组', '第二组', '同样多'],
        (() => {
          if (left === right) return '同样多';
          return (more ? left > right : left < right) ? '第一组' : '第二组';
        })(),
        '一个对一个配对，看哪一组有剩下。',
        left === right
          ? '两组都没有剩下，同样多。'
          : `第一组${left}个，第二组${right}个，比较数量后选出${more ? '较多' : '较少'}的一组。`,
        { kind: 'count', count: left, other: right },
      );
    });
  }
  if (lesson.id.includes('partition')) {
    return lesson.questions.flatMap((q, index) => {
      if (q.rule.kind !== 'partition') return [];
      const total = q.rule.total;
      const first = 1 + (index % (total - 1));
      const second = total - first;
      return [
        number(
          `把${total}个圆点分成两组，第一组${first}个，第二组几个？`,
          second,
          `总数${total}分成${first}和几？`,
          `${first}+${second}=${total}，第二组${second}个。`,
          { kind: 'bars', parts: [first, second], unknown: 1 },
        ),
      ];
    });
  }
  if (lesson.id.endsWith('place')) {
    const values = lesson.id.startsWith('mu-')
      ? [13, 14, 16, 18, 10, 20]
      : [31, 45, 60, 78, 92, 100];
    return values.map((value) =>
      number(
        value === 100
          ? '10个十合起来是多少？'
          : `${Math.floor(value / 10)}个十和${value % 10}个一合起来是多少？`,
        value,
        lesson.id.startsWith('mu-')
          ? '每个十表示10，个位表示几个一。'
          : '每个十表示10，个位表示几个一；10个十就是1个百。',
        value === 100
          ? '10个十是100，也就是1个百。'
          : `${Math.floor(value / 10)}个十和${value % 10}个一组成${value}。`,
      ),
    );
  }
  if (lesson.id === 'mu-solid' || lesson.id === 'ml-flat') {
    const solid = lesson.id === 'mu-solid';
    const descriptions: [string, string][] = solid
      ? [
          ['有六个完全一样的正方形面的立体图形', '正方体'],
          ['有两个平平的圆面，中间是弯曲面的立体图形', '圆柱'],
          ['没有平平的面，表面都是弯曲的立体图形', '球'],
          ['三个方向的长度不一样，像长盒子的立体图形', '长方体'],
        ]
      : [
          ['有三条直边的平面图形', '三角形'],
          ['四条边一样长、四个角都是直角的平面图形', '正方形'],
          ['没有直边、轮廓是圆圆的平面图形', '圆'],
          ['图上四个角是直角，相邻两条边长度不一样的平面图形', '长方形'],
          ['图上两组对边平行、四个角都不是直角的平面图形', '平行四边形'],
        ];
    const labels = descriptions.map(([, label]) => label);
    return descriptions.map(([description, value]) =>
      choice(
        `${description}叫什么？`,
        labels,
        value,
        solid
          ? '先区分平平的面和弯曲的面。'
          : '数一数直边，再观察角和边的特点。',
        `题目描述的是${value}。`,
      ),
    );
  }
  if (lesson.id === 'mu-ordinal') {
    const cards = ['星星', '月亮', '太阳', '小花', '树叶'];
    return [0, 1, 2, 3, 4, 1].map((target, index) => {
      const fromRight = index % 2 === 1;
      const value = fromRight ? cards.length - target : target + 1;
      return number(
        `从左到右依次是星星、月亮、太阳、小花、树叶五张卡。${cards[target]}从${fromRight ? '右' : '左'}数第几个？`,
        value,
        `从${fromRight ? '树叶' : '星星'}卡开始，每张卡只数一次。`,
        `${cards[target]}从${fromRight ? '右' : '左'}数第${value}个。`,
      );
    });
  }
  if (lesson.id === 'mu-chain') {
    const chains: [number, '+' | '-', number, '+' | '-', number][] = [
      [3, '+', 2, '+', 4],
      [10, '-', 4, '-', 2],
      [6, '+', 3, '-', 5],
      [9, '-', 6, '+', 4],
      [2, '+', 4, '+', 3],
      [8, '-', 3, '-', 2],
    ];
    return chains.map(([a, op, b, op2, c]) => {
      const first = op === '+' ? a + b : a - b;
      const last = op2 === '+' ? first + c : first - c;
      return {
        prompt: `${a}${op}${b}${op2}${c}，依次填第一步结果和最后结果。`,
        rule: { kind: 'steps', values: [first, last] },
        hint: '先算左边两个数，再接着算。',
        explanation: `第一步${a}${op}${b}=${first}，再算${first}${op2}${c}=${last}。`,
      };
    });
  }
  if (lesson.id.includes('story') || lesson.id === 'ml-relations') {
    const lower = lesson.id.startsWith('ml-');
    const sets: [number, number][] = lower
      ? [
          [24, 17],
          [35, 16],
          [19, 26],
          [43, 28],
          [60, 34],
          [32, 9],
        ]
      : [
          [2, 4],
          [8, 2],
          [3, 5],
          [9, 4],
          [10, 6],
          [7, 3],
        ];
    return sets.map(([a, b], index) => {
      const sum = index === 0 || index === 2;
      const value = sum ? a + b : a - b;
      const prompt = (() => {
        if (index === 0 || index === 2)
          return `蓝盒有${a}块积木，红盒有${b}块，一共有几块？`;
        return index % 2 === 1
          ? `原来有${a}块积木，拿走${b}块，还剩几块？`
          : `一共有${a}块积木，其中红积木${b}块，其他都是蓝积木，蓝积木几块？`;
      })();
      return number(
        prompt,
        value,
        sum ? '合起来求总数，用加法。' : '知道总数和一部分，求另一部分用减法。',
        `${a}${sum ? '+' : '-'}${b}=${value}块。`,
        {
          kind: 'bars',
          parts: sum ? [a, b] : [b, value],
          unknown: sum ? 2 : 1,
        },
      );
    });
  }
  if (lesson.id.startsWith('mu-') && lesson.id.endsWith('-sequence')) {
    const offset = (() => {
      if (lesson.id === 'mu-five-sequence') return 0;
      return lesson.id === 'mu-ten-sequence' ? 5 : 10;
    })();
    return [
      [2, 1, 3],
      [3, 2, 4],
      [5, 3, 4],
      [4, 1, 2],
      [5, 1, 3],
      [4, 2, 3],
    ].map((values) => {
      const labels = values.map((value) => String(value + offset));
      return {
        prompt: `把${labels.join('、')}按从小到大的顺序排列，依次选择。`,
        choices: labels.map((label) => ({ id: label, label })),
        rule: {
          kind: 'sequence',
          values: values
            .toSorted((a, b) => a - b)
            .map((value) => String(value + offset)),
        },
        hint: '先找最小的数，再找下一个，不能重复选择。',
        explanation: `从小到大依次是${values
          .toSorted((a, b) => a - b)
          .map((value) => value + offset)
          .join('、')}。`,
      };
    });
  }
  if (lesson.id === 'ml-hundred-sequence') {
    return [
      [19, 1],
      [49, 1],
      [69, 1],
      [79, 1],
      [30, 10],
      [80, 10],
    ].map(([a = 0, step = 1]) =>
      number(
        `${a}往后再数${step === 1 ? '一个' : '十个'}，是多少？`,
        a + step,
        '跨过整十数时，个位从9变成0，十位多1。',
        `${a}后面增加${step}，得到${a + step}。`,
      ),
    );
  }
  if (lesson.id === 'ml-hundred-chart') {
    return [
      number(
        '百数表中，72在同一行左邻的数是多少？',
        71,
        '同一行向左减少1。',
        '72的同一行左邻是71。',
      ),
      number(
        '百数表中，84在同一行右邻的数是多少？',
        85,
        '同一行向右增加1。',
        '84的同一行右邻是85。',
      ),
      number(
        '百数表中，19在同一列下一行的数是多少？',
        29,
        '同一列向下增加10。',
        '19+10=29。',
      ),
      number(
        '百数表中，93在同一列上一行的数是多少？',
        83,
        '同一列向上减少10。',
        '93-10=83。',
      ),
      choice(
        '百数表中，21在第三行第一格，它有同一行的左邻格子吗？',
        ['有', '没有'],
        '没有',
        '先判断它在这一行的哪一格。',
        '21在第三行第一格；20在上一行，不能把它说成同一行左邻。',
      ),
      number(
        '百数表中，100在同一列上一行的数是多少？',
        90,
        '同一列向上减少10。',
        '100-10=90。',
      ),
    ];
  }
  if (lesson.id === 'ml-money') {
    return [
      number('2元等于多少角？', 20, '1元=10角。', '2元=20角。'),
      number('5角等于多少分？', 50, '1角=10分。', '5角=50分。'),
      number('6元等于多少角？', 60, '每元换10角。', '6元=60角。'),
      number(
        '38角是3元多少角？只填写角数。',
        8,
        '30角换成3元。',
        '38角=3元8角。',
      ),
      number('7元2角一共多少角？', 72, '7元=70角。', '70+2=72角。'),
      choice(
        '4元和39角哪个金额大？',
        ['4元', '39角', '同样多'],
        '4元',
        '先把4元换成40角。',
        '40角比39角多。',
      ),
    ];
  }
  if (lesson.id === 'ml-shop') {
    return [
      number(
        '一本本子4元，一块橡皮1元，一共多少元？',
        5,
        '把两件价格合起来。',
        '4+1=5元。',
      ),
      number(
        '买8元的积木，付10元，找回多少元？',
        2,
        '付款减去价格。',
        '10-8=2元。',
      ),
      number(
        '一个本子3元5角，一支笔5角，一共多少角？',
        40,
        '3元5角=35角。',
        '35+5=40角。',
      ),
      number(
        '买6元的笔和9元的本子，付20元，找回多少元？',
        5,
        '先求总价。',
        '6+9=15元，20-15=5元。',
      ),
      choice(
        '有16元，能同时买9元和8元两件商品吗？',
        ['能', '不能'],
        '不能',
        '两件总价和16元比较。',
        '9+8=17元，比16元多。',
      ),
      number(
        '2元、5角和2角的金额卡合起来是多少角？',
        27,
        '全部换成角。',
        '20+5+2=27角。',
        { kind: 'money', cents: [200, 50, 20] },
      ),
    ];
  }
  return [];
}

/** Stable authored bank. Snapshots, choices and explanations are saved per session. */
export function mathReviewQuestions(lesson: Lesson): Question[] {
  const drafts = draftsFor(lesson);
  const signatures = new Set<string>();
  return drafts
    .filter((draft) => {
      const signature = JSON.stringify([
        draft.prompt,
        draft.material,
        draft.visual,
        draft.rule,
      ]);
      if (signatures.has(signature)) return false;
      signatures.add(signature);
      return true;
    })
    .map((draft, index) => ({
      ...draft,
      id: `${lesson.id}-r${index + 1}`,
      knowledge: lesson.id,
    }));
}
