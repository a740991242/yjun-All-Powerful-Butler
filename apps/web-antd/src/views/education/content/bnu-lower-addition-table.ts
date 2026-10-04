import type { Lesson, Question } from '../learning/types';

import { teenAdditionRows } from '../learning/teen-addition-table';
const id = 'bnu-lower-make-addition-table';
export const bnuAdditionSourceCards = [
  [9, 5],
  [9, 9],
  [6, 9],
  [7, 7],
  [6, 8],
  [3, 9],
  [9, 8],
  [5, 9],
  [9, 3],
  [5, 7],
  [8, 5],
  [8, 7],
  [8, 4],
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
    hint: '先说清按得数、第一加数还是表格位置整理；每张卡、每一处都要检查，字母不是数。',
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
function actual(suffix: string, prompt: string): Question {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际制卡、分类、纸面填表或交流后确认；只看网页或未做请跳过，答对不证明实际制作已完成。',
  );
}
const rows = teenAdditionRows({ kind: 'teen-addition-table', variant: 'main' });
function sourceSet(
  suffix: string,
  prompt: string,
  qualifies: (a: number, b: number) => boolean,
): Question {
  const choices = bnuAdditionSourceCards.map(([a, b], i) => ({
    id: `${suffix}-${i + 1}`,
    label: `卡${i + 1} · ${a}+${b}`,
  }));
  return {
    ...task(
      suffix,
      prompt,
      {
        kind: 'set',
        values: bnuAdditionSourceCards.flatMap(([a, b], i) =>
          qualifies(a, b) ? [`${suffix}-${i + 1}`] : [],
        ),
      },
      '按本题给定标准逐张检查，位置和交换后的另一个式子不代替这张实际卡。',
    ),
    choices,
  };
}
export const bnuLowerAdditionTableLesson: Lesson = {
  id,
  textbookTitle: '做个加法表',
  title: '完整加法表、按标准分类与行列规律',
  page: 14,
  version: 1,
  status: 'available',
  goal: '完整填写26处两加数，核对36个表格位置；按得数或第一加数选全卡片，说明同一行与同一列不同变化条件。',
  prerequisite: '能说明20以内凑十，知道两个加数与得数，按给定顺序观察。',
  parentTip:
    '依据实际读取并放大的北师大下册第14页。原桌面13式改为本站编号文字卡，原表数学结构采用原创Ant Design Vue表格，不复制插画。每加数2～9且和11～18，共36式，不冒0～10全部加法表；原给定10式和26处待填明确区分。网页字母位置是本站编号，实际纸卡与填原表独立人工。',
  review: {
    date: '2026-10-04',
    reviewer: '公开扫描第14页整页及桌面、表格放大逐项核对',
    notes:
      '实际核对13张桌面卡、得数14四张与第一加数8三张、八行8至1个位置，原10给定及26空。主表每行左加数递减、第一列9固定；复习反排各行并重编号，第一列改为右加数9固定，不复制原画。实际任务manual、反思null。',
  },
  steps: [
    {
      title: '先给卡片一个整理标准',
      text: '本站13张文字卡重新编号，来源是原页桌面13式。得数14是一种标准，第一加数8是另一种；9+8与8+9交换后得数相同，却不能把不存在的8+9卡算进这批第一加数8的卡。',
      activity: '实际制作或对照原13卡，分别按两种标准找全并说明。',
    },
    {
      title: '原表的范围与位置',
      text: '这张表每个加数是2～9，得数11～18；每行位置数8、7、6、5、4、3、2、1，共36。未占用位置用—表示，不是0；本站26个字母各代表一条待填算式，10条原给定式保留。',
      visual: { kind: 'teen-addition-table', variant: 'main' },
      activity:
        '实际确认原表八行、给定式和全部待填处，不把空缺位置当另一条0算式。',
    },
    {
      title: '横着看，得数不变',
      text: '主表得数11这一行从9+2到2+9，向右第一加数减1、第二加数加1，合计仍11。其余行也按同一位置规律，不能只找到一种凑数就任意放到任何字母处。每道位置题按指定两加数顺序填写。',
      visual: { kind: 'teen-addition-table', variant: 'main' },
      activity: '实际补满原表所有26处，再逐行说明完整变化。',
    },
    {
      title: '竖着看，固定条件不同',
      text: '主表第一列9+2、9+3直到9+9，第一加数9不变，第二加数与得数各增加1；这与横着看得数不变不同。具体列的范围要先确认，不把—接成一条虚构算式。',
      visual: { kind: 'teen-addition-table', variant: 'main' },
      activity: '实际观察原表一列并说明保持的量、变化的量和终点。',
    },
    {
      title: '按位置与自由凑数分开',
      text: '7+7、9+5、5+9等都得14；只说和为14时有多种合理答案。表中某一字母却有所在行和排列顺序，必须满足这两个位置条件。交换两数产生另一个有序式，但7+7交换不增一条。',
      activity:
        '实际选一行找交换关系，并说明为什么一个正确和不能随便填另一个位置。',
    },
    {
      title: '每一式也可回到凑十',
      text: '9+9可把第二个9分1与8：9+1=10，再添8为18。分类与规律帮助整理，不能代替核对每一式；同样10个一组成1个十，散个为0，未填写不是0。',
      visual: { kind: 'ten-frame', left: 9, right: 9 },
      activity: '实际选一式摆或画凑十，再检查相应表格位置。',
    },
    {
      title: '新排列要重新看条件',
      text: '本站新复习把每行左右顺序反过来并重新给空处编号。原先竖着第一列固定左加数9，现在固定右加数9；不能直接抄主表字母答案。实际分类、纸面补表和自己的发现分别记录，未来计划不当已完成。',
      activity: '实际与同伴交流两种分类与一种行列发现，核对说的是哪张表。',
    },
  ],
  questions: [
    ...bnuAdditionSourceCards.map(([a, b], i) =>
      number(
        `card-${i + 1}`,
        `本站原桌面改成文字卡${i + 1}：${a}+${b}，结果是多少？`,
        a + b,
        `${a}+${b}=${a + b}，本站编号不冒原画位置。`,
      ),
    ),
    sourceSet(
      'result-fourteen',
      '本站这13张实际文字卡，选出全部得数14的卡，不添不存在的式子。',
      (a, b) => a + b === 14,
    ),
    sourceSet(
      'first-eight',
      '本站同一批13卡，选出全部第一加数8的卡；第二加数8的卡不混入。',
      (a) => a === 8,
    ),
    ...rows.flatMap((row) =>
      row.cells
        .filter((cell) => cell.label !== null)
        .map((cell) => ({
          ...task(
            `blank-${cell.label}`,
            `本站主表${cell.label}处：按所在行及从左到右的排列，依次填第一、第二加数。不是任意两个数凑成该行得数。`,
            { kind: 'steps', values: [cell.left, cell.right] },
            `本处${cell.left}+${cell.right}=${row.total}，同时满足该行得数与位置规律。`,
          ),
          visual: { kind: 'teen-addition-table', variant: 'main' } as const,
        })),
    ),
    ...[8, 7, 6, 5, 4, 3, 2, 1].map((count, i) => ({
      ...number(
        `row-count-${i + 11}`,
        `本站主表得数${i + 11}这一行，有几个属于该行的算式位置？“—”不计。`,
        count,
        `这一行${count}处，给定与待填都属于该行。`,
      ),
      visual: { kind: 'teen-addition-table', variant: 'main' } as const,
    })),
    {
      ...task(
        'horizontal',
        '本站主表得数11一行，按从左到右依次填八个第一加数。',
        { kind: 'steps', values: [9, 8, 7, 6, 5, 4, 3, 2] },
        '第一加数每次减1；第二加数相应加1，和仍11。',
      ),
      visual: { kind: 'teen-addition-table', variant: 'main' },
    },
    {
      ...task(
        'vertical',
        '本站主表第一列，从得数11到18依次填八个第二加数。',
        { kind: 'steps', values: [2, 3, 4, 5, 6, 7, 8, 9] },
        '第一加数固定9，第二加数每次加1，合计也加1。',
      ),
      visual: { kind: 'teen-addition-table', variant: 'main' },
    },
    task(
      'nine-path',
      '本站9+9先凑第一个9，依次填从另一个9分出多少、剩多少、凑成数、总量。',
      { kind: 'steps', values: [1, 8, 10, 18] },
      '9分1与8，先10再18。',
    ),
    number(
      'zero-ones',
      '本站9张与1张卡共10张，组成1个十后散着的一有几个？',
      0,
      '散个0，总量10；这是本站另一个凑十例子，不扩展原表的范围。',
    ),
    actual(
      'actual-cards',
      '实际对照或制作原桌面13张算式卡，逐项计算，本站重编号如实说明；做过再确认。',
    ),
    actual(
      'actual-fourteen',
      '实际把得数14的原卡全部找出并核对不漏不多；做过再确认。',
    ),
    actual(
      'actual-eight',
      '实际按第一加数8再次整理同批原卡，区别第二加数8；做过再确认。',
    ),
    actual(
      'actual-table',
      '实际完成原表全部26空并核对10给定式，共36处，纸面完整填过再确认。',
    ),
    actual(
      'actual-horizontal',
      '实际逐行观察并完整说一行的变化、不变及交换关系；做过再确认。',
    ),
    actual(
      'actual-vertical',
      '实际逐列观察，说清具体列范围与变化，不把缺席位置当0式；做过再确认。',
    ),
    actual(
      'actual-peer',
      '实际与同伴交流一种分类和行列发现，说明两张表的条件；只计划请跳过。',
    ),
    task(
      'reflection',
      '记录自己实际采用的分类标准或发现；没有操作请如实写。',
      { kind: 'reflection' },
      '开放记录不自动评分或确认制表。',
    ),
    task(
      'plan',
      '记录下次准备怎样整理或检查，未来计划单独记。',
      { kind: 'reflection' },
      '计划不当已经完成。',
    ),
  ],
  reviewQuestions: [
    {
      ...task(
        'review-position',
        '本站新复习表左右反排后，A处在得数11一行最左的待填位置，按新排列依次填两个加数。',
        { kind: 'steps', values: [2, 9] },
        '反排后该处2+9，不能套用主表A处6+5。',
      ),
      visual: { kind: 'teen-addition-table', variant: 'review' },
    },
    task(
      'review-pair',
      '换成自由凑数：每个加数2～9，依次填两个数，和为16。不限定表中位置。',
      {
        kind: 'arithmetic-pair',
        minimum: 2,
        maximum: 9,
        operation: 'add',
        result: 16,
      },
      '7与9、8与8、9与7都合法；自由凑数不同于位置题。',
    ),
    {
      ...task(
        'review-sort',
        '换一批8张新候选卡，选出全部得数15的卡。',
        {
          kind: 'set',
          values: [
            'review-sort-1',
            'review-sort-2',
            'review-sort-3',
            'review-sort-4',
          ],
        },
        '9+6、8+7、7+8、6+9为15，其它卡不混入。',
      ),
      choices: [
        [9, 6],
        [8, 7],
        [7, 8],
        [6, 9],
        [8, 8],
        [9, 5],
        [7, 7],
        [9, 9],
      ].map(([a, b], i) => ({
        id: `review-sort-${i + 1}`,
        label: `新卡${i + 1} · ${a}+${b}`,
      })),
    },
    {
      ...task(
        'review-vertical',
        '本站反排的新复习表第一列，右加数固定9，从上到下前四行得数分别是多少？依次填四个数。',
        { kind: 'steps', values: [11, 12, 13, 14] },
        '左加数2、3、4、5，右加数9不变，合计11、12、13、14。',
      ),
      visual: { kind: 'teen-addition-table', variant: 'review' },
    },
  ],
};
