import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-teens-numberline';
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
    hint: '先看范围、起终点、填写顺序和每组的单位；0不是未填，起点不是一跳。',
    explanation,
  });
  const a = review ? 18 : 13;
  const b = review ? 14 : 15;
  const scattered = review ? 17 : 16;
  const forward = review ? 12 : 15;
  const forwardSteps = review ? 4 : 3;
  const back = review ? 19 : 18;
  const backSteps = review ? 4 : 3;
  const near = review ? 18 : 12;
  const lower = review ? 12 : 16;
  const upper = review ? 16 : 19;
  return [
    q(
      'complete-0-19',
      review
        ? '从19到0倒着读完整数线，依次填全二十个数，包括两端19与0。'
        : '从0到19顺着读完整数线，依次填全二十个数，包括两端0与19。',
      {
        kind: 'steps',
        values: Array.from({ length: 20 }, (_, i) => (review ? 19 - i : i)),
      },
      '这里数的是列出的二十个数，不要求计算20，也不把二十个刻度当成二十个间隔；相邻十九个间隔。',
    ),
    q(
      'complete-12-19',
      review
        ? '从19倒到12停止，依次写完整八个数，首尾都填。'
        : '从12顺到19停止，依次写完整八个数，首尾都填。',
      {
        kind: 'steps',
        values: Array.from({ length: 8 }, (_, i) => (review ? 19 - i : 12 + i)),
      },
      '先读两端和方向，每次变1，不漏中间数。',
    ),
    q(
      'complete-19-15',
      review
        ? '从18倒到14停止，依次填完整五个数。'
        : '从19倒到15停止，依次填完整五个数。',
      {
        kind: 'steps',
        values: Array.from({ length: 5 }, (_, i) => (review ? 18 : 19) - i),
      },
      '包含起点和终点，五个数之间四个间隔。',
    ),
    q(
      'missing-ticks',
      `0～19等距数线，第一个刻度是0，刻度从1编号。依次填第${(review ? [13, 14, 16, 18, 19] : [12, 15, 17, 19, 20]).join('、')}个刻度表示的数，不填刻度的编号。`,
      {
        kind: 'steps',
        values: review ? [12, 13, 15, 17, 18] : [11, 14, 16, 18, 19],
      },
      '刻度的第几比该刻度数值多1，第一个表示0。',
    ),
    {
      ...q(
        'group-totals',
        `图中上排A、下排B，每个圆或方形各代表一件；依次填A、B总数，不把两排合成一组。`,
        { kind: 'steps', values: [a, b] },
        `A是10+${a - 10}=${a}，B是10+${b - 10}=${b}；相同十组各归自己的总数。`,
      ),
      visual: { kind: 'comparison-rows', counts: [a, b] },
    },
    {
      ...q(
        'equal-ten-compare',
        `A有相同十组和${a - 10}件多余，B有相同十组和${b - 10}件多余。A ○ B，应选哪个？`,
        { kind: 'choice', value: review ? 'greater' : 'less' },
        `两边都有10，比较多余${a - 10}和${b - 10}，所以${a}${review ? '>' : '<'}${b}。不是摆得更开就更多。`,
      ),
      choices: [
        { id: 'less', label: '<' },
        { id: 'greater', label: '>' },
        { id: 'equal', label: '=' },
      ],
    },
    {
      ...q(
        'circle-ten-total',
        `图中每个圆一件，先点十个，再接着数余下，共多少个？真实在散放物品里圈十另做，不用看图确认实做。`,
        { kind: 'number', value: scattered },
        `先10再接数${scattered - 10}个，共${scattered}。`,
      ),
      visual: { kind: 'count', count: scattered },
    },
    q(
      'forward-landings',
      `完整0～19数线上，从${forward}每次向右一格，跳${forwardSteps}格。依次填每次落点，不把起点算第一跳。`,
      {
        kind: 'steps',
        values: Array.from({ length: forwardSteps }, (_, i) => forward + i + 1),
      },
      `起点${forward}还没跳，依次${Array.from({ length: forwardSteps }, (_, i) => forward + i + 1).join('、')}。`,
    ),
    q(
      'backward-landings',
      `从${back}每次向左一格，跳${backSteps}格。依次填各落点，每题重新站题目起点。`,
      {
        kind: 'steps',
        values: Array.from({ length: backSteps }, (_, i) => back - i - 1),
      },
      `每走一个间隔少1，依次${Array.from({ length: backSteps }, (_, i) => back - i - 1).join('、')}。`,
    ),
    q(
      'distance',
      `同一等距0～19数线上，依次填${near}到10、${near}到19各有几格。这里格表示相邻数差1，不当厘米。`,
      { kind: 'steps', values: [near - 10, 19 - near] },
      `分别${near - 10}格与${19 - near}格，不按数字字形宽度比较。`,
    ),
    {
      ...q(
        'near-end',
        `${near}更接近10还是19？按等距数线间隔比较。`,
        { kind: 'choice', value: review ? 'nineteen' : 'ten' },
        review
          ? '18到19一格，到10八格，更近19。'
          : '12到10两格，到19七格，更近10。',
      ),
      choices: [
        { id: 'ten', label: '10' },
        { id: 'nineteen', label: '19' },
      ],
    },
    {
      ...q(
        'all-between',
        `选全0～19中比${lower}大、比${upper}小的整数，两个端点都排除。`,
        {
          kind: 'set',
          values: Array.from({ length: upper - lower - 1 }, (_, i) =>
            String(lower + i + 1),
          ),
        },
        `全部是${Array.from({ length: upper - lower - 1 }, (_, i) => lower + i + 1).join('、')}；不是只找一个，也不能带端点。`,
      ),
      choices: Array.from({ length: 20 }, (_, i) => ({
        id: String(i),
        label: String(i),
      })),
    },
  ];
}
export const sujiaoUpperTeensNumberlineLesson: Lesson = {
  id,
  title: '0～19完整数线：圈十、比较与画跳线',
  textbookTitle: '认识11～19·数线与先圈十',
  page: 80,
  version: 1,
  status: 'available',
  goal: '完整标读0～19和指定起终点，实际圈十接数、相同十组比较、画加减跳线与核对严格范围和距离。',
  prerequisite:
    '认识0～19和十与一；准备十九件安全小物、纸笔和方格纸，0～19数字卡可自写。',
  parentTip: `ISBN ${source.isbn}同版80/81/84/85页已实际查看。数线复用原生等距刻度可横向滚动，两端完整；纸线每格差1不虚称厘米。列出0～19含二十个数是材料/刻度计数，不要求提前学习20的位值。原生两排对齐图上排A/下排B每个不同形状记号都表示一件，不将两排总加。网页点数不是实际圈散物；五项纸面/实物证据人工，反思null，计划分开。旧0～9模型与会话保持，教师最终审校未核验。`,
  steps: [
    {
      title: '从零到十九，两端中间都完整',
      text: '在同一条直线上画等距刻度，逐一标0、1、2、3、4、5、6、7、8、9、10、11、12、13、14、15、16、17、18、19。顺读每次多1，倒读每次少1；0占一个刻度，是明确的数。横向滚动能看完整两端；纸面要亲自画全，不只写十几个数。',
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: 0 },
      activity:
        '实际纸上画全0～19等距数线，逐一顺读再倒读，写起终点；遮住11/14/16/18/19再补回。另完整写12到19、19倒到15，首尾都含。',
    },
    {
      title: '散放物品，先圈十再接着数',
      text: '十六件先逐一点出十件圈成一组，再从10接数11、12、13、14、15、16。网页圆只供点数，不能当自己已圈过；实际从散放物品独立找齐十件。把一组十当一件会把总数错说七，不论摆得密或散都一物一数。',
      visual: { kind: 'count', count: 16 },
      activity:
        '实际散放16件，先估一估，再独立圈十，数余下并写总数。恢复散放17件另圈十、接数到17，分别记录估计和实数，不移动疏密就认数量变。',
    },
    {
      title: '两边都有十，只比较多余的部分',
      text: '本图上排A每个圆代表一件，下排B每个方形代表一件，同位对齐。各数前十个，A再多3件，B再多5件；同样十配齐，3少于5，所以13少于15。不要把两排合成一个总数，也不只看图面积。变化A有18、B有14时同十后8多于4，结论反向。',
      visual: { kind: 'comparison-rows', counts: [13, 15] },
      activity:
        '实际各摆A十三件/B十五件，分别圈同样十组，对齐多余3/5并比较；再重摆18/14独立圈组比较，画两套自己的完整图写关系。每套A/B各自总量核对。',
    },
    {
      title: '加减画跳线，每题恢复自己的起点',
      text: '15+3从15向右三跳，落点16、17、18；18−3从18向左三跳，落点17、16、15。起点还没跳，不算第一步。变化12+4与19−4各从12或19重新开始，不从上一题落点接。网页走格辅助观察，纸上实际画箭头和起终点另记。',
      visual: { kind: 'number-line', minimum: 0, maximum: 19, value: 15 },
      activity:
        '实际画四条独立完整0～19数线，分别画15+3、18−3、12+4、19−4。每次标起点、方向、全部逐格落点和终点，再写式；一题一条，不能只填最后结果。',
    },
    {
      title: '范围与接近程度，都沿完整数线查',
      text: '0～19中比12小的是0～11，不漏0；比16大比19小只有17、18，不含两端。12到10两格、到19七格，更近10；18到10八格、到19一格，更近19。相同等距间隔可比较，不据网页字形大小或纸画歪斜猜。',
      activity:
        '实际在自己的完整数线上找齐比12小、16与19严格之间的数；换比14小、12与16严格之间再找齐。另标12/18，逐格数到10/19比较，写自己的范围列表和理由。未做如实待做，未来计划另列。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-full-line',
        '实际纸上完整画等距0～19数线，顺读/倒读两端中间全含；遮11/14/16/18/19再补回。另完整写12到19、19到15及变化19到12/18到14，不把刻度编号当数值。纸线与网页填写分别记录。',
      ],
      [
        'actual-circle-ten',
        '实际散放16件先估计，再独立圈出10件、接数余下并记录；恢复散放17件另圈十核对。每件只计一次，估计与实数分开，不用网页点数或密疏猜测代替。',
      ],
      [
        'actual-two-groups',
        '实际摆A十三件/B十五件，各圈十，对齐比较多余并画完整两组关系；再重摆18/14另画比较。两套中A/B各自总数核对，不合加两排，不只画多余忘十组。',
      ],
      [
        'actual-jump-lines',
        '实际四条独立完整0～19数线分别画15+3、18−3、12+4、19−4。每条标自己的起点、向右或向左箭头、全部落点与终点，写结果并说明起点不算一跳；不只看网页或填结果。',
      ],
      [
        'actual-range-distance',
        '实际在完整等距纸线上自主写全0～19内比12小、比16大比19小的数，换比14小和12/16严格之间再写全；标12/18各逐格数到10与19比较接近。端点/0/间隔与刻度分别检查，真实说明和帮助如实记。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实完整画线、圈散物和比较完成后确认，计划另列、未做暂跳。',
      explanation: '实际作品与解释独立人工，网页答对不确认已画或圈十。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实完整数线、圈十或比较画跳线的一例，怎样核对起终点/数量/范围和帮助/困难；未做如实说，未来计划另列。',
      rule: { kind: 'reflection' },
      hint: '真实例子不要求全部掌握。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '完整数线与两套圈十/全部落点核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷80/81/84/85页已实际查看。复习改变完整方向/起终点、缺位、A/B数量比较、散物量、跳线条件和严格范围，不只重复末值；教师最终审校未核验。',
  },
};
