import type { TeenArithmeticGridVisual } from '../learning/teen-arithmetic-grid';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import {
  teenArithmeticRodState,
  teenArithmeticRows,
} from '../learning/teen-arithmetic-grid';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-teens-tables';
const visual = (
  display: TeenArithmeticGridVisual['display'],
  review = false,
): TeenArithmeticGridVisual => ({
  kind: 'teen-arithmetic-grid',
  display,
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
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
    hint: '先读已知与所求，保留十与单个一的关系；每道独立重摆，不沿上一道结果。',
    explanation,
  });
  const calc = (a: number, op: string, b: number) =>
    op === '+' ? a + b : a - b;
  const equations: [number, string, number][] = review
    ? [
        [12, '+', 6],
        [16, '-', 2],
        [18, '-', 5],
        [13, '+', 5],
        [3, '+', 16],
        [17, '-', 10],
      ]
    : [
        [11, '+', 7],
        [17, '-', 3],
        [19, '-', 6],
        [14, '+', 5],
        [4, '+', 15],
        [18, '-', 10],
      ];
  const chains: [number, string, number, string, number][] = review
    ? [
        [6, '+', 4, '+', 5],
        [13, '-', 3, '+', 4],
        [10, '-', 6, '+', 5],
        [8, '+', 2, '-', 7],
      ]
    : [
        [8, '+', 2, '+', 3],
        [11, '-', 1, '+', 3],
        [10, '-', 7, '+', 6],
        [7, '+', 3, '-', 8],
      ];
  const comparisons: [number, string, number, number][] = review
    ? [
        [10, '+', 6, 15],
        [18, '-', 3, 17],
        [4, '+', 10, 14],
        [10, '-', 3, 10],
        [10, '+', 7, 7],
        [18, '-', 10, 8],
      ]
    : [
        [10, '+', 4, 10],
        [16, '-', 2, 18],
        [3, '+', 10, 13],
        [10, '-', 4, 10],
        [10, '+', 5, 5],
        [19, '-', 10, 9],
      ];
  const stories = review
    ? ([
        ['add-story', '两盒分别12张和4张卡，合起来几张？', 16],
        ['subtract-story', '共有18个贴纸，红色4个，其余蓝色，蓝色几个？', 14],
        ['ten-add-story', '盒里10个模型，又添7个，现在几个？', 17],
        ['ten-subtract-story', '共有17张卡，取走10张，还剩几张？', 7],
      ] as const)
    : ([
        ['add-story', '盒里原有13张卡，又添2张，现在共几张？', 15],
        ['subtract-story', '原有15个贴纸，送出2个，还剩几个？', 13],
        ['ten-add-story', '两盒分别10个和8个模型，合起来几个？', 18],
        ['ten-subtract-story', '共有18张卡，红色10张，其余蓝色，蓝色几张？', 8],
      ] as const);
  const rows = teenArithmeticRows(review ? 'review' : 'main');
  return [
    ...(['join', 'take', 'ten'] as const).map((display) => {
      const v = visual(display, review);
      const r = teenArithmeticRodState(v);
      return {
        ...q(
          `rods-${display}`,
          `看圈划棒图：${r.start} ${r.operation} ${r.operand} = □。圈表示合并，斜划表示取走。`,
          {
            kind: 'number',
            value:
              r.operation === '+' ? r.start + r.operand : r.start - r.operand,
          },
          (() => {
            if (r.operation === '+') return '十保留，合并原散棒和新散棒。';
            return r.operand === 10
              ? '划去的是整捆十，不是一根，余散棒。'
              : '十保留，只去指定散棒。';
          })(),
        ),
        visual: v,
      };
    }),
    ...(['add', 'subtract'] as const).map((column) => ({
      ...q(
        `table-${column}`,
        `按图${column === 'add' ? '左列加法' : '右列减法'}从上到下四行，依次填四个得数。每行是一道独立题。`,
        {
          kind: 'steps',
          values: rows.map((r) =>
            column === 'add'
              ? r.add[0] + r.add[1]
              : r.subtract[0] - r.subtract[1],
          ),
        },
        '各行按十和单个一独立算，最后一行不是前四行合计。',
      ),
      visual: visual('tables', review),
    })),
    ...equations.map(([a, op, b], i) =>
      q(
        `equation-${i}`,
        `${a} ${op} ${b} = □，说明保留或取走哪部分。`,
        { kind: 'number', value: calc(a, op, b) },
        `${a} ${op} ${b} = ${calc(a, op, b)}，不进位不退位；减10取整十。`,
      ),
    ),
    ...chains.map(([a, op, b, op2, c], i) => {
      const middle = calc(a, op, b);
      const end = calc(middle, op2, c);
      return q(
        `chain-${i}`,
        `${a} ${op} ${b} ${op2} ${c}，从左到右填第一次和第二次结果。`,
        { kind: 'steps', values: [middle, end] },
        `先${middle}，再从${middle}继续到${end}。`,
      );
    }),
    ...comparisons.map(([a, op, b, c], i) => {
      const n = calc(a, op, b);
      const sign = (() => {
        if (n > c) return 'greater';
        return n < c ? 'less' : 'equal';
      })();
      return {
        ...q(
          `compare-${i}`,
          `${a} ${op} ${b} ○ ${c}，先算再选符号。`,
          { kind: 'choice', value: sign },
          `先算得${n}，再与${c}比较。`,
        ),
        choices: [
          { id: 'greater', label: '>' },
          { id: 'less', label: '<' },
          { id: 'equal', label: '=' },
        ],
      };
    }),
    q(
      'complete-ten',
      review
        ? '依次补全6+□=10、5+□=10、4+□=10三个空。'
        : '依次补全9+□=10、8+□=10、7+□=10三个空。',
      { kind: 'steps', values: review ? [4, 5, 6] : [1, 2, 3] },
      '每个式子独立补到10，不把三个空相加。',
    ),
    ...stories.map(([key, prompt, value]) =>
      q(
        key,
        prompt,
        { kind: 'number', value },
        '先讲已知和所求，写算式、单位与答句，用物品或关系核对。',
      ),
    ),
    ...(['add', 'subtract'] as const).map((op) => ({
      ...q(
        `story-structure-${op}`,
        (() => {
          if (op === 'add')
            return review
              ? '12张与4张两盒合并，求总数：有实际先后增加吗？'
              : '13张又添2张，求现在总数：这是数量随时间增加还是静态两部分？';
          return review
            ? '18个中红色4个，求蓝色：一定实际送出了4个吗？'
            : '15个送出2个，求剩余：这是实际减少还是没有拿走的部分整体关系？';
        })(),
        { kind: 'choice', value: review ? 'parts' : 'change' },
        '相同加减关系可用于变化或部分整体，先按故事读清，不靠“又”“剩”硬猜。',
      ),
      choices: [
        {
          id: 'change',
          label: op === 'add' ? '有先后，数量实际增加' : '有先后，数量实际减少',
        },
        {
          id: 'parts',
          label:
            op === 'add'
              ? '没有先后，两部分合起来'
              : '没有取走，从总数求另一部分',
        },
      ],
    })),
  ];
}
const manual = (key: string, prompt: string): Question => ({
  id: `${id}-${key}`,
  knowledge: `${id}-${key}`,
  prompt,
  rule: { kind: 'manual' },
  hint: '保留实际摆画、自己的故事与纸上答案；未做暂跳，未来计划另列。',
  explanation: '实际操作和自主创编独立人工，网页题不替代。',
});
export const sujiaoUpperTeensTablesLesson: Lesson = {
  id,
  title: '四行算式与自己的十几故事',
  textbookTitle: '十几加减·完整练习表与自主故事',
  page: 85,
  version: 1,
  status: 'available',
  goal: '完整两列各四行独立算式，真实圈划三式，区分变化与部分整体，自创四指定式的故事并检验。',
  prerequisite:
    '会11～19组成及不进位不退位加减，备19根棒或等长纸棒、一条代表十的十格长棒、纸笔。',
  parentTip: `ISBN ${source.isbn}同版82/83/85/86页已实际查看。原生固定teen-arithmetic-grid显示原创长棒十格与短棒每根一、圈散块/划取，四行两列算式；无教材扫描插画。不新增进位退位，整捆减10与单根分清，每题复原。28客观、6实做人工、1反思；四指定式各写两个不同情境/结构，未来计划分开，反思null，旧会话备份保持，教师最终审校未核验。`,
  steps: [
    {
      title: '圈合并和划取，表示同一关系',
      text: '14+3把原来4根散棒与新3根合起来，十格长棒不变。16−4从6根散棒划去4，长棒保留；19−10划去整条十格长棒，剩9散棒，不能把减10当减1。每幅图从原数开始，划线标本次取走，圈线不增加棒数。',
      visual: visual('join'),
      activity:
        '实际分别画14+3/16−4/19−10三幅，先圈合并或划取后写得数；再做新三幅13+5/18−6/17−10，每幅恢复原量，核对十和一变化。',
    },
    {
      title: '两列四行，各式独立',
      text: '左列10+1、10+3、10+5、10+7；右列18−2、18−4、18−6、18−8。按每列从上到下记录，左右同一行仍是两道。左列十保留，右列从8个一逐道取指定数，每行重新从18开始，不连续减2再4。复习换加数与原总数，不能照抄旧表。',
      visual: visual('tables'),
      activity:
        '实际画两列四行表，八式各摆棒检验并填结果，解释列内改变什么；再做新表10加2/4/6/8与19减1/3/5/7，独立核对每行。',
    },
    {
      title: '先计算再比较，连续变化另记',
      text: '10+4与10比，先算14；16−2与18比，先算14，不只比第一个数。连算8+2+3先得10，再从10添3得13；中间数与最终数分别记录。9+□=10、8+□=10、7+□=10三个空各自补十，不相互累加。',
      visual: visual('take'),
      activity:
        '实际任选一加一减、一组连算和三道补十，记录中间或缺项，再用棒检查与讲计算理由。',
    },
    {
      title: '同一个式，不同故事结构',
      text: '13+2可讲原有13又添2，也可讲两盒分别13和2合并。15−2可讲15送出2，也可讲总共15其中红色2求其它，后者没有实际送出。自己换场景，明确原数/变化/结果或总数/部分/所求，写单位答句；只换人名照抄本站句不算自创两个结构。',
      visual: visual('ten'),
      activity:
        '实际自创13+2和15−2各两故事：一个随时间变化、一个静态部分整体。每个分别画摆、列式、单位、答句与关系检查，不靠关键词决定。',
    },
    {
      title: '十与八，以及自己的检查',
      text: '10+8的合并与18−10的剩余/另一部分也可用于不同情境。各写两个自己的故事，取走十和取走一不能混。请家人读你的已知和问题，再按故事摆物检查，记录真实帮助、困难与改正；准备明天做的不是今天完成。',
      activity:
        '实际自创10+8、18−10各两故事并图示检验，展示两列完整表和圈划图；未做写待做。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'actual-circle-mark',
      '实际画或摆14+3、16−4、19−10，先圈合并散棒/划去指定散棒/划去整十后写结果，三幅独立；再做13+5、18−6、17−10新三幅，每次复原，长棒十格不是十根长棒。保留圈划图。',
    ),
    manual(
      'actual-full-tables',
      '实际纸画左列10加1/3/5/7、右列18减2/4/6/8四行表，八道分别摆棒/填得数/说变化；再独立画10加2/4/6/8与19减1/3/5/7新表，每行复原，不连续套前行结果。',
    ),
    ...[
      ['actual-story-add', '13+2'],
      ['actual-story-subtract', '15−2'],
      ['actual-story-ten-add', '10+8'],
      ['actual-story-ten-subtract', '18−10'],
    ].map(([key, equation]) =>
      manual(
        required(key),
        `实际用${required(equation)}自创两个不同场景/结构的完整故事：一个数量随时间${required(equation).includes('+') ? '增加' : '减少'}，一个静态部分整体${required(equation).includes('+') ? '求合计' : '求另一部分'}。各写已知、所求、算式、单位、答句，画摆核对并向家人解释；不能只抄例句换姓名。两份作品都保存，未做暂跳。`,
      ),
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实圈划/表格/自己的故事一例，怎样核对十与一、已知与问题，帮助或困难及改正；实际未做如实写，未来计划另列。',
      rule: { kind: 'reflection' },
      hint: '真实经历与未来安排分开。',
      explanation: '反思correct null不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '同版算式表与故事结构实际核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷82/83/85/86页已实际查看。原创棒图/表和故事变化，不复制扫描，完整六比较/四连算/三补十另核对；教师最终审校未核验。',
  },
};
