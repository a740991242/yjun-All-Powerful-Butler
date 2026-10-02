import type { Lesson, Question } from '../learning/types';

export const sujiaoTeensSource = {
  checkedAt: '2026-10-01',
  bodyLinks: [38_201, 38_202].map(
    (id) => `http://app.xxsx.cn/resources-detail/${id}/63`,
  ),
  previewLink: 'http://app.xxsx.cn/resources-detail/38203/63',
};

function tasks(review: boolean): Question[] {
  const id = `sj-upper-recognize-teens-${review ? 'r' : 'q'}`;
  const digits = review ? [11, 16, 19] : [12, 15, 18];
  const lower = review ? 12 : 16;
  const upper = review ? 15 : 19;
  const near = review ? 18 : 12;
  const total = review ? 17 : 15;
  return [
    ...Array.from({ length: 9 }, (_, index): Question => {
      const ones = review ? 9 - index : index + 1;
      return {
        id: `${id}-quantity-${index}`,
        knowledge: `sj-teens-quantity-${index}`,
        prompt: review
          ? `盒里1捆小棒，每捆10根，另有${ones}根散棒。一共有几根？`
          : `1个十和${ones}个一合起来是多少？`,
        visual: { kind: 'place-value', value: 10 + ones },
        rule: { kind: 'number', value: 10 + ones },
        hint: '一捆按10根数，再接着数单根，不把捆数当根数。',
        explanation: `10和${ones}合起来是${10 + ones}，不是1和${ones}合起来。拆捆不改变总根数。`,
      };
    }),
    ...digits.map((value, index): Question => ({
      id: `${id}-digits-${index}`,
      knowledge: `sj-teens-digits-${index}`,
      prompt: review
        ? `写数字${value}，依次填十位数字、个位数字。即使拆开整捆，这两个数字也不随摆法变。`
        : `${value}由几个十和几个一组成？依次填十的个数、单个一的个数（按每10个一组成一个十）。`,
      visual: { kind: 'place-value', value },
      rule: { kind: 'steps', values: [1, value % 10] },
      hint: '按标准分组，1捆十和几个单个一；拆捆后的散棒数量不是个位数字。',
      explanation: `${value}有1个十和${value % 10}个一，十位写1，个位写${value % 10}。`,
    })),
    ...(
      (review
        ? [
            [16, 19],
            [17, 12],
            [14, 14],
          ]
        : [
            [12, 17],
            [18, 13],
            [15, 15],
          ]) as [number, number][]
    ).map(([a, b], index): Question => ({
      id: `${id}-compare-${index}`,
      knowledge: `sj-teens-compare-${index}`,
      prompt: `${a} ○ ${b}，选出正确的大小关系。${review ? '先说明两数各有几个一。' : '两个数都有1个十，再比较单个一。'}`,
      choices: [
        { id: 'less', label: '<' },
        { id: 'greater', label: '>' },
        { id: 'equal', label: '=' },
      ],
      rule: {
        kind: 'choice',
        value: (() => {
          if (a < b) return 'less';
          return a > b ? 'greater' : 'equal';
        })(),
      },
      hint: '两个数的十位相同，比较个位；单个一也相同则相等。',
      explanation: `${a}与${b}都按1个十和几个一表示；${a % 10}${(() => {
        if (a < b) return '小于';
        return a > b ? '大于' : '等于';
      })()}${b % 10}，所以选${(() => {
        if (a < b) return '<';
        return a > b ? '>' : '=';
      })()}。`,
    })),
    {
      id: `${id}-order`,
      knowledge: 'sj-teens-order',
      prompt: review
        ? '数字卡已经倒放，仍请按从小到大排列11～19。'
        : '把11～19的数字卡按从小到大排好。',
      choices: Array.from({ length: 9 }, (_, index) => {
        const n = review ? 19 - index : 11 + index;
        return { id: String(n), label: String(n) };
      }),
      rule: {
        kind: 'sequence',
        values: Array.from({ length: 9 }, (_, index) => String(11 + index)),
      },
      hint: '从11接着数，每次多1，不按卡片最初摆放位置判断。',
      explanation: '依次是11、12、13、14、15、16、17、18、19。',
    },
    {
      id: `${id}-between`,
      knowledge: 'sj-teens-strict-between',
      prompt: `在这些卡片中选出所有比${lower}大、比${upper}小的数。`,
      choices: Array.from({ length: 9 }, (_, i) => ({
        id: String(i + 11),
        label: String(i + 11),
      })),
      rule: { kind: 'set', values: [String(lower + 1), String(lower + 2)] },
      hint: '“比……大”“比……小”都不能把端点选进去，符合条件的要选全。',
      explanation: `${lower + 1}、${lower + 2}在两个端点之间；${lower}和${upper}不符合严格大小条件。`,
    },
    {
      id: `${id}-near`,
      knowledge: 'sj-teens-number-distance',
      prompt: `${near}在数线上更接近10还是19？`,
      visual: { kind: 'number-line', minimum: 10, maximum: 19, value: near },
      choices: [
        { id: 'ten', label: '10' },
        { id: 'nineteen', label: '19' },
      ],
      rule: { kind: 'choice', value: review ? 'nineteen' : 'ten' },
      hint: '比较到两个数各有几格，不只看数字写得像不像。',
      explanation: `${near}距10有${near - 10}格，距19有${19 - near}格，更接近${review ? 19 : 10}。`,
    },
    {
      id: `${id}-ones-total`,
      knowledge: 'sj-teens-total-single-units',
      prompt: review
        ? `${total}根小棒全部按单根数，共有几个一？`
        : `${total}个物品若全按一个一个数，共有几个一？`,
      rule: { kind: 'number', value: total },
      hint: '问所有单个一的总数，不只是扎捆后余下的散棒。',
      explanation: `${total}个一也可以组成1个十和${total - 10}个一，但问所有单个一，答案仍是${total}。`,
    },
  ];
}

export const sujiaoTeensRecognitionDraft: Lesson = {
  id: 'sj-upper-recognize-teens',
  textbookTitle: '认识11～19',
  title: '一个十和几个一：认识十几',
  page: 79,
  status: 'preparing',
  version: 2,
  goal: '理解11～19的数量与组成，先数10再接着数，区分单位个数和数字写法，按顺序比较与观察接近程度。',
  prerequisite:
    '认识10，知道10个一是1个十，能点数10个；准备19根小棒、松紧带、数字卡和纸笔。',
  parentTip:
    '问清根数、捆数、十位数字或所有单个一。拆捆只改变摆法，不改变写成数字的数。十位与个位的两个1表示的数量不同，不能相加为2。',
  steps: [
    {
      title: '10再添1，是11',
      text: '先数10根扎成1捆，再添1根，合起来11根。11可以读作十一，有1个十和1个一，两个1代表不同单位。',
      visual: { kind: 'place-value', value: 11 },
      activity: '实际摆10根再添1根，先按根数，再按十和一说组成。',
    },
    {
      title: '继续添1，认识12～19',
      text: '从11继续逐根添，依次12、13，直到19。这些数都有1个十和几个一。也可先圈出10个，再数剩下的单个一，不能把一捆当成一根。',
      visual: { kind: 'place-value', value: 19 },
      activity: '逐根添加到19，再拿走散棒逐个倒数回11，每次指出总数。',
    },
    {
      title: '组成与写数不随摆法改变',
      text: '15是1个十和5个一，十位写1、个位写5。把捆拆开，会有15根散棒，总数与数字15不变。15共有15个一，不只是5个一。对照教材或教师示范实际练写11～19。',
      visual: { kind: 'place-value', value: 15 },
      activity:
        '实际拆开与重扎一捆，说明总数；纸上写几个十几的数，指出各位含义。',
    },
    {
      title: '排列、比较与生活观察',
      text: '11排在10后，比10大；11～19每次增1。判断在两数之间时要读清是否包含端点。数线上12距10较近，18距19较近。先数物品，再说数量，不把物品摆得分散当成更多。',
      visual: { kind: 'number-line', minimum: 10, maximum: 19, value: 12 },
      activity:
        '摆数字卡排序，找生活中十几个物品，先估一估再按十和一数清；观察估计与实数差多少。',
    },
    {
      title: '同样的纸，先数再比较',
      text: '从同一叠同样大小、同样厚的纸里，先数10张，再数18张。整理齐后观察厚薄，纸的种类相同才适合这样比较；厚薄观察不能替代实际逐张计数，也不能据此说出厘米厚度。',
      activity:
        '由家长协助取同样的纸，分别点数10张和18张并整齐叠放。说出张数、十和一的组成，再观察厚薄，不混用不同种类纸。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-teens-manual-paper-count',
      knowledge: 'sj-teens-paper-thickness',
      prompt:
        '实际从同一叠纸分别数出10张和18张，叠齐比较厚薄，并说出张数与十和一的组成，请家长查看。',
      rule: { kind: 'manual' },
      hint: '同样种类纸，逐张点数，不凭厚薄猜定张数。',
      explanation:
        '纸张计数、组成说明与厚薄观察人工确认，不自动测量厘米或评价掌握。',
    },
    {
      id: 'sj-teens-manual-count',
      knowledge: 'sj-teens-physical-count',
      prompt:
        '实际摆11～19中的三个不同数量，先数出10根再数剩余，扎捆拆捆后重新确认总根数。',
      rule: { kind: 'manual' },
      hint: '逐根点数，不漏掉整捆中的10根。',
      explanation: '实际计数与操作人工查看，不自动计入客观正确率。',
    },
    {
      id: 'sj-teens-manual-write',
      knowledge: 'sj-teens-paper',
      prompt:
        '对照教材或教师示范在纸上写11～19，选三个数说明十位、个位及所有单个一的总数。',
      rule: { kind: 'manual' },
      hint: '屏幕字体不替代书写示范。',
      explanation: '实际书写、位置与表达人工确认，不自动评价笔顺。',
    },
    {
      id: 'sj-teens-manual-life',
      knowledge: 'sj-teens-life-estimate',
      prompt:
        '观察十几个身边物品，先估计，再实际点数，分别说估计与实数；摆放疏密改变后再数一次。',
      rule: { kind: 'manual' },
      hint: '估计不是猜完就算，最后实际核对；没有添拿，数量应不变。',
      explanation: '生活观察、估计和数量守恒人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoTeensSource.checkedAt,
    reviewer: '公开正文及预览范围核验与原创课程草稿',
    notes: `实际查看content正文印刷第79～80页：${sujiaoTeensSource.bodyLinks.join('；')}，及第81页mainPic预览：${sujiaoTeensSource.previewLink}。小棒、数字卡与故事原创，不复制原书计数器或插画；不声明各更新页与未读版权封面同一版次，也不声明第五单元全部实现。未注册正式课程。`,
  },
};
