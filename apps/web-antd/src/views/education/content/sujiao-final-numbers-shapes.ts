import type { PairArrangement } from '../learning/two-piece-join';
import type { Lesson, Question, Shape } from '../learning/types';

import { pairJoinResult } from '../learning/two-piece-join';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-final-numbers-shapes';
const shapeNames: Partial<Record<Shape, string>> = {
  square: '正方形',
  rectangle: '长方形',
  triangle: '三角形',
  circle: '圆',
  parallelogram: '平行四边形',
};
const families = [
  'square',
  'triangle',
  'circle',
  'rectangle',
  'parallelogram',
] as const;
function tasks(review: boolean): Question[] {
  const lower = review ? 50 : 70;
  const upper = lower + 10;
  const values = Array.from({ length: 9 }, (_, i) => lower + i + 1);
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const q: Question[] = [
    {
      ...common('all-between'),
      prompt: `从小到大写出所有比${lower}大、比${upper}小的整数，一个都不能漏，也不包含两端。依次填写九项。`,
      rule: { kind: 'steps', values },
      hint: '从比左端大1的数开始，每次加1，到比右端小1的数为止。',
      explanation: `完整清单为${values.join('、')}，两端${lower}和${upper}都不符合严格大小条件。`,
    },
  ];
  values.forEach((value, index) =>
    q.push({
      ...common(`composition-${index}`),
      prompt: `完整区间清单中的${value}由几个十和几个一组成？先写十的个数，再写一的个数。`,
      rule: { kind: 'steps', values: [Math.floor(value / 10), value % 10] },
      hint: '十位表示有几个十，不把整个数写成十的个数；个位是余下几个一。',
      explanation: `${value}由${Math.floor(value / 10)}个十和${value % 10}个一组成。每个数都独立说，不能只说区间首尾。`,
    }),
  );
  const shapes: Shape[] = review
    ? ['parallelogram', 'circle', 'square', 'triangle', 'rectangle']
    : [...families];
  shapes.forEach((shape, index) =>
    q.push({
      ...common(`name-${index}`),
      prompt:
        '说出这张原创平面图形的名称，再选出对应名字。只看完整外轮廓，不把朝向当作类别。',
      visual: { kind: 'shape', shape },
      choices: families.map((s) => ({ id: s, label: shapeNames[s] ?? s })),
      rule: { kind: 'choice', value: shape },
      hint: '看边和弯曲轮廓；长方形与正方形按本题各自单独命名。',
      explanation: `这张图是${shapeNames[shape]}。图形名字与摆放方向、大小无关。`,
    }),
  );
  const joins: PairArrangement[] = review
    ? ['square-rectangle', 'rectangle-square', 'triangle-big']
    : ['square-rectangle', 'rectangle-long', 'triangle-square'];
  joins.forEach((arrangement, index) =>
    q.push({
      ...common(`join-${index}`),
      prompt:
        '看两片完全相同纸片沿图示边贴合后的完整外轮廓，它是什么图形？内部接缝不作为外边。',
      visual: { kind: 'two-piece-join', arrangement, reflected: review },
      choices: families.map((s) => ({ id: s, label: shapeNames[s] ?? s })),
      rule: { kind: 'choice', value: pairJoinResult(arrangement) },
      hint: '先沿外轮廓看完整形状，再分别看原来的两片。结果只用于本图示材料和拼接条件。',
      explanation: `本图完整外轮廓是${shapeNames[pairJoinResult(arrangement)]}。两片仍是两片；接缝不把完整外轮廓拆成两个答案。`,
    }),
  );
  for (const item of [
    {
      key: 'endpoints',
      prompt: `列比${lower}大、比${upper}小的数，能把${lower}和${upper}也算进去吗？`,
      good: '不能，两端不符合严格大于和小于',
      bad: '能，区间两端永远都包含',
    },
    {
      key: 'same-dictionary',
      prompt: '从四个位置观察同一本字典，怎样保持比较条件？',
      good: '保持字典摆放稳定，观察者换位置，分别记录真实看到的样子',
      bad: '每换一个位置就换一本不同字典，并说都是同一本',
    },
    {
      key: 'views-not-fixed',
      prompt: '同一本字典四个方向的记录一定要画四种完全不同样子才算完成吗？',
      good: '不一定，照真实观察记录；可以相似，摆放和高度改变需重新观察',
      bad: '一定，为凑四种不同样子可以编造没看见的面',
    },
  ])
    q.push({
      ...common(item.key),
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '按题目边界和真实观察条件记录，不补造为了过关的结果。',
      explanation:
        '区间边界须核对；四向观察真实记相似或差异，不凭模型指定每本字典固定面貌。',
    });
  return q;
}
export const sujiaoFinalNumbersShapesDraft: Lesson = {
  id,
  title: '期末数与形：列全、拼组和四向观察',
  textbookTitle: '期末复习：开区间组成、图形命名拼组与观察',
  page: 88,
  version: 1,
  status: 'preparing',
  goal: '自主列全严格区间的九个数并逐个说组成，命名五类平面图形；三种两片同形纸片分别实际拼组，从四个位置观察同一本字典并记录。',
  prerequisite:
    '认识100以内数和十位个位、五类平面图形；准备纸笔、成对同形纸片及一本字典，家长可预备纸片。',
  parentTip:
    '来源已读印刷88/89页；本站区间、纸片比例和拼图原创。列全与逐数组成独立于候选选数。图示用单位正方形、2比1长方形、两等腰直角三角片；接缝不是外边，换比例/边重新观察，不概括任意三角形。实际分别准备两片完全相同的正方形、长方形、三角形再拼；孩子描画后家长可剪或用预裁片。字典放稳定位置，同一摆放和观察高度，四人一组各记所见；没有四人可一人依次观察并如实记方式，不冒称全组。真实图可能相似，不指定每面固定图案；没有字典待做不偷偷换为模型。人工实际与网页客观分开，反思null，计划不当已做，旧快照保持。',
  steps: [
    {
      title: '列全九个数，每个都说组成',
      text: '原创条件是比70大、比80小。自主从71依次写到79，共九个，70和80都不符合。逐个说：71为7个十和1个一，一直到79为7个十和9个一；不能只列候选或只说一个数的组成。复习换端点，要重新列全并逐个核对。',
      activity:
        '实际纸面自主列全九数，逐个写或摆十和一并完整说组成，核对无遗漏无两端。',
    },
    {
      title: '五个名字，分别指认',
      text: '正方形、长方形、三角形、圆和平行四边形分别命名。本站示例中正方形与非正方形长方形单独回答；大小、摆放和颜色改变不改名字。家长给五种实际纸片，孩子逐个指并说完整名字，不由选择题自动确认口头命名。',
      visual: { kind: 'shape', shape: 'parallelogram' },
      activity: '实际指认五种纸片或教材图，逐个说名称；不认识的如实记录待练。',
    },
    {
      title: '两片正方形，沿完整边拼',
      text: '两片完全相同单位正方形并排，完整一条边贴合，没有重叠和空隙。整体是一个长方形，内部有一条接缝；不能把接缝当外边。实际可换方向拼，看外轮廓而不是固定屏幕位置。',
      visual: {
        kind: 'two-piece-join',
        arrangement: 'square-rectangle',
        reflected: false,
      },
      activity:
        '实际准备两片完全相同正方形，沿完整边贴合拼，描整体外轮廓并说结果。',
    },
    {
      title: '两片长方形，拼接边改变结果',
      text: '本例每片长2单位宽1单位。沿短边接成4比1长方形；沿长边上下合成2比2正方形。同样两片，换拼接边结果可变；实际长方形比例不同，不一定能拼成正方形。',
      visual: {
        kind: 'two-piece-join',
        arrangement: 'rectangle-square',
        reflected: false,
      },
      activity:
        '实际两片完全相同长方形试不同拼接边，保持不重叠，描或画观察结果；按实际比例说明。',
    },
    {
      title: '两片三角形，先说清材料',
      text: '本例两片完全相同等腰直角三角形，沿斜边完整贴合可拼正方形；沿图示一条直角边贴合可拼更大三角形。任意三角片不保证这些结果。实际先核对两片同形同大，再探索拼法，不能把每片名字当完整拼图名字。',
      visual: {
        kind: 'two-piece-join',
        arrangement: 'triangle-big',
        reflected: false,
      },
      activity:
        '实际两片完全相同三角形沿适合的边拼，描整体外轮廓并说结果；可用家长预裁同形片。',
    },
    {
      title: '同一本字典，从四个位置观察',
      text: '把真实字典稳定放在桌上，先说明摆放和观察高度。四人一组分别从四个方向看并画或说自己真正看到的样子，再交流相似和不同。不要边换位置边翻动字典，也不强求四图完全不同。没有四人可依次换位如实记录，不能称做过四人小组活动；没有字典则待做。',
      activity:
        '实际保持同一本字典摆放稳定，从四个位置分别观察并画或说，记录真实参与方式和所见，不上传身份。',
    },
    {
      title: '真实活动与下次计划分开',
      text: '列全逐数说、五类命名、三种两片拼组和四向观察分别确认。网页正确只证明当前问题回答，不替代剪拼和真实观察。保留相同或不同结果、错误与调整；尚未做的写待做，未来计划不当实际完成。',
      activity: '交流一次自己真实做过的调整和仍想继续探索的问题。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际自主写出全部比70大比80小的九个整数，逐个写、摆或说几个十和几个一，核对无遗漏且不包含端点；只选候选或只说一个数不确认本活动。',
      '实际指认并口头命名正方形、长方形、三角形、圆、平行四边形五类纸片或教材图；网页选择不代替真实口头命名。',
      '实际准备两片完全相同正方形纸片（可家长剪或预裁），沿完整边贴合拼且不重叠，描整体外轮廓并说结果。',
      '实际准备两片完全相同长方形纸片，分别试不同拼接边、不重叠不留空，描整体外轮廓并记录实际比例对应结果；不要求所有长方形都拼成正方形。',
      '实际准备两片完全相同三角形纸片，先说所选材料条件再探索拼法、描整体外轮廓并说结果；不能只看网页图就确认实际剪拼。',
      '实际保持真实同一本字典摆放和观察高度，从四个位置分别画或说所见并交流；四人分工或依次换位方式如实记，没有字典则待做，不用模型替代真实字典。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实完成后分别确认，家长可预裁片，没有条件可暂时跳过。',
      explanation: '独立实际任务不由网页正确答案或未来计划自动确认。',
    })),
    ...[
      '列全九数和逐个说组成时，你怎样检查遗漏和端点？实际困难与下次计划分开。',
      '你实际用哪种两片纸片、沿什么边拼，外轮廓变成什么？未拼过如实说明待做。',
      '同一本字典四个位置的实际观察有哪些相似与差异？如实记方式，没有观察就记待做。',
    ].map((prompt, index): Question => ({
      id: `${id}-reflection-${index}`,
      knowledge: `${id}-reflection-${index}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '记真实过程，不要求固定图形或句子。',
      explanation:
        'correct=null，不给开放记录自动星级，也不代替实际任务完成确认。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '期末88/89区间与图形实作逐项核对',
    notes: `依据ISBN ${source.isbn}已读印刷88、89页；区间70～80/50～60、纸片比例与拼图原创，五图复习换序，长方形和三角形换拼接边。真实列全逐数组成、五类命名、三种成对剪拼及四向字典观察分别人工，实际观察不强求不同，旧ID版本快照不改，版次与印次仍未核验；其余期末缺口与教师最终审校保留。`,
  },
};
