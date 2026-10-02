import type { Lesson, Question, SumLinesVisual } from '../learning/types';

import { required } from '../learning/required';
import { sumLineAnswers } from '../learning/sum-lines';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-sum-lines';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const triangle: SumLinesVisual = {
    kind: 'sum-lines',
    layout: 'triangle',
    given: review ? [3, 2, 1] : [2, 1, 4],
  };
  const cross: SumLinesVisual = {
    kind: 'sum-lines',
    layout: 'cross',
    given: review ? [1, 3, 5] : [2, 3, 4],
  };
  const zero: SumLinesVisual = {
    kind: 'sum-lines',
    layout: 'triangle',
    given: review ? [6, 4, 2] : [4, 6, 1],
  };
  const [top, left] = triangle.given;
  const trial = 9 - top - left;
  return [
    {
      id: `${prefix}-triangle`,
      knowledge: `${id}-triangle`,
      prompt: `图中${review ? '新三角形' : '三角形'}的每一边都有三个数，它们的和都要是10。依次填左边A、底边B、右边C。`,
      visual: triangle,
      rule: { kind: 'steps', values: sumLineAnswers(triangle) },
      hint: '每边只取两角和中间空格，先把两角相加，再从10中找还缺的数。',
      explanation: `A、B、C依次是${sumLineAnswers(triangle).join('、')}。每条边单独检查，不能把全部角一起相加。`,
    },
    {
      id: `${prefix}-cross`,
      knowledge: `${id}-cross`,
      prompt: `图中${review ? '新十字' : '十字'}的竖线和横线各有三个数，和都要是10。依次填下端A、右端B。`,
      visual: cross,
      rule: { kind: 'steps', values: sumLineAnswers(cross) },
      hint: '竖线取上端、中心、下端；横线取左端、中心、右端。中心属于两条不同的线。',
      explanation: `下端A是${sumLineAnswers(cross)[0]}，右端B是${sumLineAnswers(cross)[1]}；分别代回竖线和横线，和都是10。`,
    },
    {
      id: `${prefix}-zero`,
      knowledge: `${id}-zero`,
      prompt: `这张${review ? '新的' : ''}三角图也要求每边三个数的和是10。只问左边A填几？`,
      visual: zero,
      rule: { kind: 'number', value: 0 },
      hint: '左边两个角已经合成10。还缺的数量可以是0，不必总填一个大于0的数。',
      explanation: `${zero.given[0]} + ${zero.given[1]} = 10，所以A填0。`,
    },
    {
      id: `${prefix}-line`,
      knowledge: `${id}-line-members`,
      prompt: `观察${review ? '新三角图' : '三角图'}，检查左边A时应该加哪三个数？`,
      visual: triangle,
      choices: [
        { id: 'left', label: `${top}、A、${left}` },
        { id: 'all', label: `${top}、${left}、${triangle.given[2]}` },
        { id: 'bottom', label: `${left}、B、${triangle.given[2]}` },
      ],
      rule: { kind: 'choice', value: 'left' },
      hint: '用手指沿左边线从上角走到左下角；不跳到右下角或底边。',
      explanation: `左边经过${top}、A、${left}，只有这三个属于左边线。`,
    },
    {
      id: `${prefix}-centre`,
      knowledge: `${id}-shared-centre`,
      prompt: `这张${review ? '新十字图' : '十字图'}的中心${cross.given[2]}应该怎样使用？`,
      visual: cross,
      choices: [
        { id: 'each', label: '检查竖线时用一次，检查横线时也用一次' },
        { id: 'once', label: '竖线用过后，横线不能再用' },
        { id: 'twice', label: '同一条线里把中心加两次' },
      ],
      rule: { kind: 'choice', value: 'each' },
      hint: '每次检查的是不同一条线，两条线在中心相交。',
      explanation:
        '中心在两条线上，每条线中各算一次；不是在同一条线里重复加，也不是整图只能使用一次。',
    },
    {
      id: `${prefix}-check`,
      knowledge: `${id}-check`,
      prompt: `在这张${review ? '新三角图' : '三角图'}中，先试把A填${trial}。左边三个数的和是多少？`,
      visual: triangle,
      rule: { kind: 'number', value: 9 },
      hint: '把试填值代入左边：上角 + A + 左下角。检查实际得数，不能因为目标是10就直接写10。',
      explanation: `${top} + ${trial} + ${left} = 9，未达到10，还需要把A增加1。`,
    },
  ];
}

export const sujiaoSumLinesLesson: Lesson = {
  id,
  textbookTitle: '练习七：三数连线拓展',
  title: '三数连线：每条线的和都是10',
  page: 74,
  status: 'available',
  version: 1,
  goal: '识别同一条线上的三个数，求缺数，并逐条检查；理解相交两线共用中心，缺数可以是0。',
  prerequisite: '认识0～10，会10以内加减法和连加；准备纸笔与0～10数字卡。',
  parentTip:
    'A、B、C只是空格名称。可帮读，但按图识线与计算仍由孩子完成；不要求代数方程术语。实际指线、纸笔绘图和口述单列人工确认。',
  steps: [
    {
      title: '先找一条线上的三个位置',
      text: '三角形每一边上有两角和一个中间空格。沿着一边看，只取这条边的三个位置，不把另一条边的空格或第三个角混进来。A在左边、B在底边、C在右边，填写顺序按问题要求。',
      visual: { kind: 'sum-lines', layout: 'triangle', given: [2, 1, 4] },
      activity:
        '在纸上画三角图并标三个空格，用手指沿左边、底边、右边分别走一遍，说出各边的位置。',
    },
    {
      title: '两个已知数先合起来，找还缺多少',
      text: '先把同一条线两个已知数合起来，再找补到10还需要多少。已经合成10时空格填0；不同边的空格可能不同，不能只找一个数填遍全图。',
      activity:
        '准备数字卡，分别尝试各边空格，每次把三个数重新相加；试一次错误数字，再调整到10。',
    },
    {
      title: '十字中心属于两条线',
      text: '竖线经过上端、中心、下端；横线经过左端、中心、右端。检查竖线时中心用一次，检查横线时中心也用一次。同一条线里不能加中心两次，不能把全图数加起来当一条线。',
      visual: { kind: 'sum-lines', layout: 'cross', given: [2, 3, 4] },
      activity:
        '画十字图，分别沿竖线和横线指认三个位置，填下端和右端，再口述两条线各自的加法。',
    },
    {
      title: '填好后逐条检查',
      text: '填写只是第一步，还要逐条代回。某条线和是9，就还差1；检查其他线时只用那条线的数。可以用数字卡或小棒确认，实际操作与练习答对分开记录。',
      activity:
        '自己画一张三数连线图，使每条线和为10，请家长帮忙检查所有线；允许空格填0。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'trace',
        '实际画一张三角连线图，用手指分别沿三边说出三个位置，填空后逐边列式，请家长查看。',
        '图示理解、纸笔绘图与逐边检查人工确认。',
      ],
      [
        'cross',
        '实际画十字图，分别沿竖线和横线指认并解释中心为何在两条线里各用一次，请家长查看。',
        '指线和口述分开查看，不由一次选择题自动确认。',
      ],
      [
        'design',
        '自己设计三角或十字连线，使每条线三个数的和都是10，留空后用数字卡填写并逐条验证，请家长查看。',
        '自创图、试填与检查人工确认；如果空格是0，也应保留。',
      ],
    ].map(([key, prompt, explanation]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际完成画图、指线和验证，不只点击确认。',
      explanation: required(explanation),
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版原书正文核验与原创教学检查',
    notes: `依据已实际核对ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第74页（${source.preview}）的三数连线拓展。图示数字、位置标识与任务均原创，十字图增加已知上端以形成明确解，不把多解情况错误限制成单一答案。不复制教材插图，保留人教版独立记录；本课不代表全册完成。`,
  },
};
