import type { Lesson, Question } from '../learning/types';

import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-final-organize';
export function finalOrganizeCards(review: boolean) {
  const data: readonly (readonly [number, '+' | '−', number])[] = review
    ? [
        [7, '−', 3],
        [18, '−', 5],
        [2, '+', 6],
        [9, '−', 4],
        [10, '+', 7],
        [17, '−', 10],
        [13, '+', 5],
        [1, '+', 8],
      ]
    : [
        [3, '+', 4],
        [8, '−', 2],
        [10, '+', 3],
        [16, '−', 4],
        [2, '+', 5],
        [9, '−', 6],
        [10, '+', 8],
        [19, '−', 10],
      ];
  return data.map(([a, op, b], i) => ({
    id: String(i),
    label: `${a}${op}${b}`,
    a,
    op,
    b,
    value: op === '+' ? a + b : a - b,
  }));
}
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
    hint: '先说明规则与记录顺序，全部范围都查；0与10边界、十与一、运算范围和得数分清。',
    explanation,
  });
  const cards = finalOrganizeCards(review);
  const numbers = Array.from({ length: 20 }, (_, i) => i);
  const missing = review ? [1, 2, 5, 9, 12, 14, 18] : [4, 6, 8, 10, 11, 15, 16];
  return [
    {
      ...q(
        'full-sequence',
        review
          ? '完整数线0～19，按从大到小依次写所有二十个刻度值，19至0都含。'
          : '完整数线0～19，按从小到大依次写所有二十个刻度值，0至19都含。',
        { kind: 'steps', values: review ? numbers.toReversed() : numbers },
        '二十个标签包含0，数值最大19；0不是未填，不把端点20写进本范围。',
      ),
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: 0 },
    },
    q(
      'missing-values',
      `完整0～19数线下列位置未写值，按从左到右填七空：${numbers.map((n) => (missing.includes(n) ? '□' : String(n))).join('、')}。`,
      { kind: 'steps', values: missing },
      '相邻值差一，各空只占一个位置，跨10仍继续11；不是把所有空填同一数。',
    ),
    {
      ...q(
        'all-strict',
        review
          ? '在完整0～19里，选所有严格小于10的数，0也要判断。'
          : '在完整0～19里，选所有严格大于10的数，一个不漏，10自己也要判断。',
        {
          kind: 'set',
          values: numbers.filter((n) => (review ? n < 10 : n > 10)).map(String),
        },
        review
          ? '0至9共十个数，10等于10不属于小于。'
          : '11至19全部九个数，10等于10不属于大于。',
      ),
      choices: numbers.map((n) => ({ id: String(n), label: String(n) })),
    },
    q(
      'strict-count',
      review
        ? '0～19里所有严格小于10的数有几个？包括数量0这个数标签。'
        : '0～19里所有严格大于10的数有几个？只填数的个数。',
      { kind: 'number', value: review ? 10 : 9 },
      '比较边界与标签个数分清，0是一个数，不代表此题不计它。',
    ),
    ...Array.from({ length: 9 }, (_, i) => {
      const n = review ? 19 - i : 11 + i;
      return {
        ...q(
          `composition-${i}`,
          `${n}由几个十和几个单个一组成？${review ? '先填单个一，再填十' : '先填十，再填单个一'}，不是全部一的总量。`,
          { kind: 'steps', values: review ? [n - 10, 1] : [1, n - 10] },
          `${n}是1个十及${n - 10}个单个一，全部仍${n}个一；只换整理方法，不少物品。`,
        ),
        visual: { kind: 'digit-counter' as const, tens: 1, ones: n - 10 },
      };
    }),
    {
      ...q(
        'scatter',
        review
          ? '散物图共有几件？每件只算一次，不能只看一排。'
          : '散物图共有几件？不因为分成两排就只数两件。',
        { kind: 'number', value: review ? 14 : 12 },
        '逐件一一对应，排数不是物品总数。',
      ),
      visual: { kind: 'count', count: review ? 14 : 12 },
    },
    {
      ...q(
        'bundle',
        review
          ? '一捆十及8根散棒，全部有几根？'
          : '一捆十及1根散棒，全部有几根？',
        { kind: 'number', value: review ? 18 : 11 },
        '捆代表十根，不能只数一捆加散棒的外观件数。',
      ),
      visual: { kind: 'place-value', value: review ? 18 : 11 },
    },
    {
      ...q(
        'counter',
        review
          ? '儿童计数器十位0颗、个位7颗，表示几件？'
          : '儿童计数器十位0颗、个位2颗，表示几件？',
        { kind: 'number', value: review ? 7 : 2 },
        '十位没有十，只有个位几个一，不说有0件或把空十位当一颗。',
      ),
      visual: { kind: 'digit-counter', tens: 0, ones: review ? 7 : 2 },
    },
    {
      ...q(
        'equation-operator',
        review
          ? '对这一组新卡按运算符分两类，选所有减法式，不能按得数大小判断。'
          : '对卡片按运算符分加法/减法两类，选所有加法式，不能按得数大小判断。',
        {
          kind: 'set',
          values: cards
            .filter((c) => c.op === (review ? '−' : '+'))
            .map((c) => c.id),
        },
        '每卡是一个完整算式，符号决定这次分类，含十几也可加可减。',
      ),
      choices: cards.map(({ id, label }) => ({ id, label })),
    },
    {
      ...q(
        'equation-range',
        review
          ? '同一组新卡改按范围分类，选所有10以内的加减法式；19/17等减去十即使得数小也仍来自十几。'
          : '同一组卡改按范围分类，选所有十几范围的加减法式；得数小于10不等于原算式是10以内。',
        {
          kind: 'set',
          values: cards
            .filter((c) =>
              review
                ? c.a <= 10 && c.b <= 10 && c.value <= 10
                : c.a > 10 || c.value > 10,
            )
            .map((c) => c.id),
        },
        '10+几得到十几及十几−几/十归十几组；19−10得9仍是十几范围，不按最后得数单独分。',
      ),
      choices: cards.map(({ id, label }) => ({ id, label })),
    },
    {
      ...q(
        'classification-rule',
        review
          ? '同一组新卡先按范围再按符号，组别会改变，是否证明卡片上的数量被改变？'
          : '同一组卡先按符号再按范围，卡换到别组，是否算式就变了？',
        { kind: 'choice', value: 'rule' },
        '改变分类规则可以改变组别，不改变原算式或数量。实际整理要每卡一次且说明规则。',
      ),
      choices: [
        { id: 'rule', label: '不是，规则变了，原算式与数量没变' },
        { id: 'quantity', label: '是，换组就改变原数量' },
      ],
    },
  ];
}
const manual = (key: string, prompt: string): Question => ({
  id: `${id}-${key}`,
  knowledge: `${id}-${key}`,
  prompt,
  rule: { kind: 'manual' },
  hint: '真实读写、摆物或整理后独立确认，保留作品与帮助，未来计划分开。',
  explanation: '实际各项独立人工，网页答题不代替。',
});
export const sujiaoUpperFinalOrganizeLesson: Lesson = {
  id,
  title: '期末整理：完整数线与两种算式分类',
  textbookTitle: '期末复习·完整整理与多种表示',
  page: 88,
  version: 1,
  status: 'available',
  goal: '完整0～19数序/缺位/严格范围及全部九十几组成，三种独立数量表示，完整算式卡按符号与范围各整理一次。',
  prerequisite:
    '会0～19及不进位不退位加减，备数字卡、小棒/儿童计数器或标位可移动纸珠、纸笔和八张式卡。',
  parentTip: `ISBN ${source.isbn}同版88/90页已实际查看。原创八完整式卡按两规则整理，十几减十虽得数小仍属十几范围；完整二十值含0及九十几逐一组成，不以五选数替完整范围，散物12/小棒11/计数器2三表征独立。19客观/5实际人工/1反思，二十标签最大19不教20位值；实际和计划分开，reflection null，旧ID会话备份不改，教师最终审校未核验。`,
  steps: [
    {
      title: '完整0至19，一个位置一个值',
      text: '从0到19完整二十个刻度，最小值0、最大值19。刻度个数二十不是最大值20。逐个写、读正序和倒序，跨10继续11；相邻一格差一，不把空格当0，也不用只填两个空代替全数序。',
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: 0 },
      activity:
        '实际纸画0～19完整数线，写全部二十值，正倒读，再遮4/6/8/10/11/15/16七位补全核对；换七空再做，0要确实写。',
    },
    {
      title: '所有十几，组成逐个核对',
      text: '11～19都是一十加几个一，九个不同数量逐个说，不只会一个例子。严格大于10有全部九个11至19，10本身不包括；0至9严格小于10有十个数，0也一个数。可以按小于10与10和十几分类，或0单列/1至19另一类，先说规则。',
      visual: { kind: 'digit-counter', tens: 1, ones: 9 },
      activity:
        '实际11至19每数依次点、成十、写数字及组成九项，全部物品重新核对；数字卡按两种数分类各一次并不漏卡，全部大于10逐个读组成。',
    },
    {
      title: '三种独立图，先读单位',
      text: '散物12件要逐件数，排数不是数量；一捆十和一根散棒是11根，不是2根；计数器十位0、个位2是2个一，不是十几。变化14散物/一捆十和八散棒是18/个位七是7各重新读，不因为同课就都答同一数。',
      visual: { kind: 'place-value', value: 11 },
      activity:
        '实际分别摆12散物、11棒成捆、计数器十0个2，再分别改14/18/7读写核对，三组独立重摆，纸珠替代注明。',
    },
    {
      title: '八式先按符号，再按范围',
      text: '主卡3+4、8−2、10+3、16−4、2+5、9−6、10+8、19−10。先依加法/减法分两类，各四张；恢复全八卡，再依10以内/十几分两类。19−10得9，但起点十几，所以仍十几组；10+3虽第一个数10，结果13属十几。不是按最终得数单独分类。',
      activity:
        '实际八张式卡按符号分，再重新按范围分，每种每卡一次，记录各组卡式与理由；再新7−3/18−5/2+6/9−4/10+7/17−10/13+5/1+8独立两分类核对，不沿旧位置抄组。',
    },
    {
      title: '说规则、保留作品、另记计划',
      text: '改变分类规则，卡片组别可以变，算式不变。展示完整数线、九组成记录、三种表示和两轮分类，家人看真实读写操作。帮读、提示、困难或改正如实写；网页正确不替这些实际记录，未来准备复习另列。',
      activity:
        '实际展示自己的全部作品，解释0与10边界、十位单位、19−10为何仍十几式及一种分类改变；未做写待做，计划另列。',
    },
  ],
  questions: [
    ...tasks(false),
    manual(
      'actual-full-line',
      '实际纸画完整0～19二十刻度写每值，正倒读，遮4/6/8/10/11/15/16七位再补全；换1/2/5/9/12/14/18七位再做。0真实写，格表示相邻数差一不虚称厘米；保留全线与核对。',
    ),
    manual(
      'actual-nine-compositions',
      '实际依次点11至19全部九数，成一十与几个一，纸写全部九数/组成并核对总量。数字卡再按小于10/10和十几及0单列/1至19两规则各完整整理，不漏不重；全部九个严格大于10逐一解释。',
    ),
    manual(
      'actual-three-representations',
      '实际独立摆12散物、11棒一十加一、儿童计数器或可移动纸珠十位0/个位2，分别点数读写；再重摆14散物/18棒/个位7，三种单位分别核对，替代/材料先后复用如实记。',
    ),
    manual(
      'actual-two-card-sorts',
      '实际主八式3+4/8−2/10+3/16−4/2+5/9−6/10+8/19−10先按加减、再复原按10以内/十几，两轮每卡一次，解释十几减十不按得数分类；新八式7−3/18−5/2+6/9−4/10+7/17−10/13+5/1+8独立两规则重做并保留。',
    ),
    manual(
      'actual-explain',
      '实际展示完整线/九组成/三表示/两规则式卡整理，说明0与10边界、十的单位以及19−10得9仍十几式，记录自己的核对与帮助/困难；未做暂跳，未来计划分开。',
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实整理或读写核对一例、怎样区分边界/单位/规则及帮助困难，未做如实说；未来练习计划另列。',
      rule: { kind: 'reflection' },
      hint: '实际与计划分开。',
      explanation: '反思correct null不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '同版完整整理与多表示逐项核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷88/90页已实际查看。完整范围/九组成/三表示/两种八式分类原创，复习改变方向/缺位/所求范围/全部式卡，教师最终审校未核验。',
  },
};
