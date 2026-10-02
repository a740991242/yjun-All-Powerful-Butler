import type { Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-final-calculation';
type Operation = '+' | '−';
type Basic = readonly [number, Operation, number];
type Chain = readonly [number, Operation, number, Operation, number];
export function finalCalculationBoard(review: boolean) {
  const basic: readonly Basic[] = review
    ? [
        [2, '+', 8],
        [5, '+', 4],
        [9, '−', 0],
        [2, '+', 7],
        [3, '+', 7],
        [6, '+', 3],
        [8, '−', 5],
        [4, '+', 4],
        [7, '−', 2],
        [9, '−', 3],
        [3, '+', 3],
        [9, '−', 4],
      ]
    : [
        [3, '+', 7],
        [6, '+', 3],
        [8, '−', 0],
        [1, '+', 8],
        [4, '+', 6],
        [4, '+', 5],
        [7, '−', 4],
        [5, '+', 3],
        [6, '−', 1],
        [10, '−', 4],
        [2, '+', 4],
        [10, '−', 5],
      ];
  const chains: readonly Chain[] = review
    ? [
        [8, '+', 2, '+', 3],
        [14, '+', 4, '−', 8],
        [15, '−', 5, '+', 7],
        [4, '+', 6, '−', 7],
        [2, '+', 2, '+', 2],
        [9, '−', 5, '−', 4],
      ]
    : [
        [9, '+', 1, '+', 2],
        [13, '+', 3, '−', 6],
        [12, '−', 2, '+', 9],
        [2, '+', 8, '−', 6],
        [3, '+', 3, '+', 3],
        [8, '−', 4, '−', 4],
      ];
  const calc = (a: number, op: Operation, b: number) =>
    op === '+' ? a + b : a - b;
  return {
    basic: basic.map(([a, op, b]) => ({
      label: `${a}${op}${b}`,
      value: calc(a, op, b),
    })),
    chains: chains.map(([a, op, b, op2, c]) => {
      const intermediate = calc(a, op, b);
      return {
        label: `${a}${op}${b}${op2}${c}`,
        intermediate,
        value: calc(intermediate, op2, c),
      };
    }),
  };
}
function tasks(review: boolean): Question[] {
  const board = finalCalculationBoard(review);
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
    hint: '看清符号，按题目顺序逐格填写；连算先前两数，再把中间数接着算。0是有效结果。',
    explanation,
  });
  return [
    ...Array.from({ length: 3 }, (_, row) => {
      const cells = board.basic.slice(row * 4, row * 4 + 4);
      return q(
        `basic-row-${row}`,
        `第${row + 1}行，按①至④各填最终得数，不把上一题结果带入下一题：${cells.map((c, i) => `${'①②③④'[i]} ${c.label}=□`).join('；')}。`,
        { kind: 'steps', values: cells.map((c) => c.value) },
        `本行四题分别是${cells.map((c) => `${c.label}=${c.value}`).join('；')}。每题独立，检查符号和各自起始数。`,
      );
    }),
    ...board.chains.map((c, i) =>
      q(
        `chain-${i}`,
        `连算${i + 1}：${c.label}。①填前两数计算后的中间结果；②填接着算后的最终得数，两个空都填。`,
        { kind: 'steps', values: [c.intermediate, c.value] },
        `从左往右，先得到${c.intermediate}，再用这个中间数继续，最终${c.value}。中间与最后不是同一个位置；0要写出来。`,
      ),
    ),
    {
      ...q(
        'order',
        review
          ? '新连算15−5+7能先算5+7，再从15中减去吗？'
          : '12−2+9能先算2+9，再从12中减去吗？',
        { kind: 'choice', value: 'left' },
        '这类连算按从左往右，先减得10，再加后一个数。把后两数先合并会改变题意；不教乘除或括号运算。',
      ),
      choices: [
        { id: 'left', label: '不能，先算前两数，再用中间结果继续' },
        { id: 'last', label: '能，任意两数先算都相同' },
      ],
    },
    {
      ...q(
        'zero',
        review
          ? '9−5−4最后得0，0这个答案是未填还是确实没有剩余？'
          : '8−4−4最后得0，0这个答案是未填还是确实没有剩余？',
        { kind: 'choice', value: 'filled' },
        '空白没有提交数量，0是经过计算确认没有剩余；两者不能混同。',
      ),
      choices: [
        { id: 'filled', label: '0是有效结果，确实没有剩余' },
        { id: 'blank', label: '0就是没填，可以空着' },
      ],
    },
  ];
}
const manual = (key: string, prompt: string): Question => ({
  id: `${id}-${key}`,
  knowledge: `${id}-${key}`,
  prompt,
  rule: { kind: 'manual' },
  hint: '实际独立做完后再确认；帮读、学具、改正如实记，没做暂跳，未来计划另列。',
  explanation: '网页答对不代替实际完整计算、操作与说明。',
});
export const sujiaoUpperFinalCalculationLesson: Lesson = {
  id,
  title: '期末计算：十二基础式与六连算',
  textbookTitle: '期末复习·完整计算练习',
  page: 91,
  version: 1,
  status: 'available',
  goal: '完整十二基础式逐题、六连算中间与最终逐项，运算次序和0边界明确，实际完整计算及方法说明分开记录。',
  prerequisite: '会10以内及十几不进位不退位加减；备纸笔、19枚纸片或小棒。',
  parentTip: `ISBN ${source.isbn}同版91页已实际查看，原练习十二基础式与六连算逐项核对。本站按三行四式和六个双字段连算呈现，变式全部换数；11客观/3实际/1反思，不把六例题当完整练习，0与未填区分。实际纸面、操作方法与独立说明各人工，计划分开，教师最终审校未核验，旧ID会话备份不改。`,
  steps: [
    {
      title: '三行十二式，每题重新读',
      text: '第一行3+7、6+3、8−0、1+8；第二行4+6、4+5、7−4、5+3；第三行6−1、10−4、2+4、10−5。每行四题共十二题，每题从自己的数开始，不把前题的答案拿来继续。8−0没有拿走，仍有8。',
      activity:
        '实际把十二式按原三行写在纸上，每行从左到右独立填四得数；圈出拿走0的题并用物品确认。',
    },
    {
      title: '前三连算，先算前两数',
      text: '9+1+2先9+1得10再加2得12；13+3−6先得16再减6得10；12−2+9先得10再加9得19。先读符号，从左向右，每题分别记录中间及最后。加完再减与减完再加不能跳掉第一步。',
      activity:
        '实际分别摆9/13/12枚纸片，从各自初始量按符号添取；写每题中间和最后，一题做完再复原下一题。',
    },
    {
      title: '后三连算，结果0也要写',
      text: '2+8−6先得10再减6得4；3+3+3先得6再加3得9；8−4−4先得4再减4得0。第二次加3不是再加已经合成的6；最后0表示没有剩余，不等于空白或漏填。',
      activity:
        '实际每题从初始量重新摆，保留中间/最终两个记录；最后一题拿完核对，写0，不用空白代替。',
    },
    {
      title: '独立检查与新数练习',
      text: '基础式可以想数的组成、接着数或倒数检查，选择适合自己的方法，不要求速度排名。连算两次添取每步都对才算完整；可以实物回放。新题换全部数，不能沿上一张纸抄答案，也不能把后两数先算当成原题。',
      activity:
        '实际再做新十二式2+8/5+4/9−0/2+7/3+7/6+3/8−5/4+4/7−2/9−3/3+3/9−4及新六连算8+2+3/14+4−8/15−5+7/4+6−7/2+2+2/9−5−4，均独立写。',
    },
    {
      title: '展示完整作品，说明自己的方法',
      text: '纸面主练习和新练习各十二基础式及六连算完整保留；任选一加、一减、一连算实际说自己的方法并核对。帮读、用了学具、哪里改错如实记，网页正确不能证明纸笔已做。没有完成就记待做，未来安排另列，不自动评星。',
      activity:
        '实际展示完整两份作品，说明一加一减一连算及最后0的意义，让家人记录实际帮助和改正。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'actual-full-board',
      '实际纸面完整三行十二式及六连算全部18题，每连算写中间及最终，主练习和新数练习各独立一份；保留逐题核对/改正/帮助，0真实填，没做暂跳。',
    ),
    manual(
      'actual-six-chains',
      '实际主六连算逐题用19枚以内纸片或小棒添取，每题从各自初始数复原，记录六对中间/最终；两道减加与两道加减均观察，最后8−4−4拿完写0，实物复用如实记。',
    ),
    manual(
      'actual-methods',
      '实际对自己的完整作品选一加一减一连算，说真实计算与核对方法；说明为何先前两数、最后0与未填不同。保留原话、帮助与改正，网页正确不代替，未来计划另列。',
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实完整计算/操作中的一例、自己的方法及改正或帮助；未做如实说，未来练习计划另列。',
      rule: { kind: 'reflection' },
      hint: '实际与计划分开。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整十二基础式及六连算核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷91页18式逐项已实际查看；本站三行独立四字段、六连算各中间/最终双字段，复习全换数且保留减0/最终0边界。教师最终审校未核验。',
  },
};
