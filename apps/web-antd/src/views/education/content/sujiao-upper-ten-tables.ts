import type { TenTablesVisual } from '../learning/ten-tables';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { tenArithmeticRows, tenTableRows } from '../learning/ten-tables';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-ten-tables';
const model = (
  display: TenTablesVisual['display'],
  review: boolean,
): TenTablesVisual => ({
  kind: 'ten-tables',
  display,
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
  const arithmetic = tenArithmeticRows(model('add-sub', review));
  const chains = tenTableRows(model('five-chains', review));
  const rows = tenTableRows(model('nine-rows', review));
  const q = (
    key: string,
    prompt: string,
    display: TenTablesVisual['display'],
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    visual: model(display, review),
    rule,
    hint: '按当前图从上到下逐行核对；每行十个，先看实心部分，再看另一部分，不沿用旧行次。',
    explanation,
  });
  return [
    q(
      'chains-other',
      '五条链每条10颗。按上到下依次填各条空心部分有几颗。双圈仍是一颗，串线不算珠。',
      'five-chains',
      { kind: 'steps', values: chains.map((n) => 10 - n) },
      `实心分别${chains.join('、')}，空心分别${chains.map((n) => 10 - n).join('、')}，每条两部分合10。`,
    ),
    q(
      'chains-both',
      '按五条链从上到下，每条先填实心颗数、再填空心颗数，共十个空。第1/2空属于第一条，第3/4空属于第二条，依此。不是填链条总数。',
      'five-chains',
      { kind: 'steps', values: chains.flatMap((n) => [n, 10 - n]) },
      '同一条先实心后空心，各条两数合10；空心部分并不是没珠。',
    ),
    q(
      'rows-complements',
      '九行图每行10个圈。按上到下依次填每个加法中第二个加数（空心圈数），共九个空。只填另一部分，不填合计。',
      'nine-rows',
      { kind: 'steps', values: rows.map((n) => 10 - n) },
      `另一部分依次${rows.map((n) => 10 - n).join('、')}；最后仍有圈，不是0。`,
    ),
    q(
      'rows-totals',
      '继续看九行图，按上到下依次填九个加法的合计（等号后空格）。不是第二个加数，也不是把九行全部圈相加。',
      'nine-rows',
      { kind: 'steps', values: rows.map(() => 10) },
      '每行单独十个，九个合计都填10；同一批十个可以实际重摆记录九种分法。',
    ),
    q(
      'add-complements',
      '按左边五行从上到下，依次填补足到10的未知加数。看本次行次，不能只把上一张表的顺序抄来。',
      'add-sub',
      { kind: 'steps', values: arithmetic.add.map((n) => 10 - n) },
      `${arithmetic.add.map((n) => `${n}+${10 - n}=10`).join('；')}。`,
    ),
    q(
      'sub-differences',
      '按右边五行从上到下，依次填10减去指定数的差。差可以为0，未填不能代替0。',
      'add-sub',
      { kind: 'steps', values: arithmetic.subtract.map((n) => 10 - n) },
      `${arithmetic.subtract.map((n) => `10-${n}=${10 - n}`).join('；')}。`,
    ),
    {
      ...q(
        'trend',
        '五条链从上到下，实心部分和空心部分各怎样变化？只看本次方向，每条总数始终10。',
        'five-chains',
        { kind: 'choice', value: review ? 'more' : 'less' },
        review
          ? '实心每条少一，空心每条多一，总数不变。'
          : '实心每条多一，空心每条少一，总数不变。',
      ),
      choices: [
        { id: 'less', label: '实心每条多一，空心每条少一' },
        { id: 'more', label: '实心每条少一，空心每条多一' },
        { id: 'same', label: '两部分都不变' },
      ],
    },
    q(
      'equal-parts',
      '九行图中，实心与空心同样多的是从上往下第几行？填行次，不填每部分圈数。',
      'nine-rows',
      { kind: 'number', value: 5 },
      '5和5同样多，主/反向九行图都在第5行；其它行虽总数10，两部分不一定同样多。',
    ),
  ];
}
export const sujiaoUpperTenTablesLesson: Lesson = {
  id,
  title: '十的完整表：五链、九行与加减两列',
  textbookTitle: '10的分解整表与补足、减法',
  page: 65,
  version: 1,
  status: 'available',
  goal: '按完整图表逐行填全，区别一部分/另一部分/合计、行次与数量，反向表重新读，保留差0。',
  prerequisite:
    '认识0～10和10的分合；准备纸笔、十个安全小物件、五条每条十珠的安全链或自画对应记录。无真实珠链可记录纸面替代，不冒实际串珠已完成。',
  parentTip: `ISBN ${source.isbn}同版65/67/71页已实际查看。本站图与输入原创，五条十珠实心1～5或5～1，九行每行十圈实心1～9或9～1，两列补足/减法五行顺序换向。图用实心/双圈空心区分两部分，双圈仍一物；九行是十个的九种分法，不引入整表圈数或乘除法。完整涂填/逐行算式与解释实际分别人工，不用一题答案替整表；每个物件只数一次。纸面涂色与实际链区分，备份/schemaVersion/旧快照保持。`,
  steps: [
    {
      title: '五条十珠，从一颗到五颗涂满表',
      text: '五条每条十颗，实心部分依次1、2、3、4、5，空心部分9、8、7、6、5。双圈只是空心标记，一颗不数两次。把同一条的两部分写在一起，合计都10；实心增加一，空心减少一。屏幕已示意分好，实际请自己逐条涂和填完整五组。',
      visual: model('five-chains', false),
      activity:
        '实际准备五条每条十颗的安全珠链逐条标1～5颗并分别数余珠；若纸面五行记录替代如实写，不冒真实串珠。完整两部分十项填齐。',
    },
    {
      title: '九行合十，每行三个数量读清',
      text: '九行每行十圈，实心依次1～9，空心9～1，逐行写1+9=10到9+1=10。本页九行都要求两部分有圈；0+10仍是正确分法，只不属于本次九行正数表。每行等号后都10，不把另一部分如9当合计。图的每行是独立分法记录，不把全表合成一次数量。',
      visual: model('nine-rows', false),
      activity:
        '纸上画完整九行每行十圈，分别涂1～9，再填每行另一部分与合计，逐行指图读式。不只写几个示例；同十个实物可逐次重摆核对各行，记录材料复用。',
    },
    {
      title: '五行补足到十，逐行看已有数',
      text: '左列已有1、3、5、7、9，另部分9、7、5、3、1，各合10。每次先从原十个恢复，摆已有部分，再找剩余部分，不把前一行移走后剩的数量作新总数。右列另是减法表，不能混答。',
      visual: model('add-sub', false),
      activity:
        '实际用同十个物件按左列五行逐次重摆，写完整五个加法，核对加数与总数。',
    },
    {
      title: '五行减法，全部拿走时差为零',
      text: '主表右列10减2、4、6、8、10，差依次8、6、4、2、0。本步新图反向从10减10、8、6、4、2，差从0、2、4、6到8。每行重摆十个再拿走指定数；最后全拿走，差0是有意义的答案，空白是尚未填。复习将两列行次反向，不能固记第一空9或8。',
      visual: model('add-sub', true),
      activity:
        '实际按主/反向五行分别重摆十个、拿走，记录减数和差；全取走写0，再加回检查，不把备用区纳入剩余数量。',
    },
    {
      title: '反向重读完整九行',
      text: '新图从实心9到1，空心从1到9；变化方向反过来，合计仍10。逐行核对而不是抄旧顺序。每行先实心、后空心，再合计；哪次真实涂填、帮助与困难如实写，尚未做可待做，未来计划另记。',
      visual: model('nine-rows', true),
      activity:
        '纸面重排九种分法反向读表，给家人指出一行每个数的对象，再选差0和两部分相同的情况真实解释。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-five-chains',
        '实际完成五条每条十珠按1～5颗标记与余珠核对，填每条两部分；反向再读5～1。纸面替代需如实记录，不冒串珠或拨珠；全部五条和十项填齐才确认。',
      ],
      [
        'actual-nine-rows',
        '纸上画完整九行每行十圈，分别涂1～9，逐行填另一部分及合计，读九个完整加法；反向重排再读。同十个实物可逐次重摆核对并如实记录，不只做网页题。',
      ],
      [
        'actual-add-sub',
        '实际用同十个物件，按左右列全部五行分别恢复原十个再合分/拿走，写完整五个补足加法和五个减法；反向表重读，全取走差0有效。保留真实过程和帮助。',
      ],
      [
        'actual-explain',
        '实际向家人指完整图表解释某行两部分/合计、双圈仍一颗、反向变化和差0与未填的区别。记录真实例子及帮助/困难，未来打算不当已发生交流。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '完整真实操作/记录后再确认，尚未做暂跳，材料替代如实写。',
      explanation: '实际涂填、完整表和说明分别人工，不由网页答对推已完成。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实完成的一张表，怎样逐行检查，遇到的帮助或困难。尚未涂填如实写，未来计划另记。',
      rule: { kind: 'reflection' },
      hint: '真实例子不要求全部已经会。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整十珠/圈表/加减整表核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷65/67/71页实际读到。复习重排所有行，保持每行十个但改变答案顺序；差0与未填区分，实际涂填独立记录。最终教师审校未核验。',
  },
};
