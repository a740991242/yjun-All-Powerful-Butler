import type { CubeColumnsVisual, Lesson, Question } from '../learning/types';

import { cubeColumnsTotal } from '../learning/cube-columns';
import { sujiaoBeadSteps, sujiaoBeadTasks } from './sujiao-hidden-beads';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-final-building';
const cubes = (heights: number[]): CubeColumnsVisual => ({
  kind: 'cube-columns',
  heights,
});
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const initial = cubes(review ? [1, 3, 3, 1, 1] : [1, 2, 3, 2, 1]);
  const moved = cubes(review ? [2, 3, 3, 1] : [2, 2, 3, 2]);
  return [
    ...sujiaoBeadTasks(review),
    {
      id: `${prefix}-count`,
      knowledge: `${id}-count`,
      prompt:
        '图中积木只有一块深，没有隐藏后排。每列从下向上数，一共有几块同样大小的正方体？',
      visual: initial,
      rule: { kind: 'number', value: cubeColumnsTotal(initial) },
      hint: '数方块，不数露出的面；按每列块数相加。',
      explanation: `${initial.heights.join(' + ')} = 9，共9块。`,
    },
    {
      id: `${prefix}-columns`,
      knowledge: `${id}-columns`,
      prompt: '同样的这堆积木，从左到右有几个连续的列？只数列，不问方块总数。',
      visual: initial,
      rule: { kind: 'number', value: 5 },
      hint: '每个上下堆叠的位置是一列，每列可能有不同块数。',
      explanation: '有5列，共9块；列数与块数不是同一个数量。',
    },
    {
      id: `${prefix}-highest`,
      knowledge: `${id}-highest`,
      prompt: '最高的列堆了几块？',
      visual: initial,
      rule: { kind: 'number', value: 3 },
      hint: '逐列从下往上数，选块数最多的一列。',
      explanation: '最高的列有3块，不能把整堆9块当作一列高度。',
    },
    {
      id: `${prefix}-preserve`,
      knowledge: `${id}-preserve`,
      prompt:
        '只移动原来的一块，重新摆成图中这样，没有增加或丢掉积木。现在一共有几块？',
      visual: moved,
      rule: { kind: 'number', value: 9 },
      hint: '只改变摆放位置，没有改变总数量；也可按新图逐列核对。',
      explanation: `${moved.heights.join(' + ')} = 9，重排后仍有9块。`,
    },
    {
      id: `${prefix}-cuboid`,
      knowledge: `${id}-cuboid`,
      prompt:
        '把原来9块全部重新摆成图中三列各3块，仍只有一块深。整体是什么形状？',
      visual: cubes([3, 3, 3]),
      choices: [
        { id: 'cuboid', label: '长方体' },
        { id: 'cube', label: '正方体' },
        { id: 'sphere', label: '球' },
      ],
      rule: { kind: 'choice', value: 'cuboid' },
      hint: '正面看着方，不代表整个物体各个方向一样长；这里只有一块深。',
      explanation: '整体宽3块、高3块、深1块，是长方体；每个小积木才是正方体。',
    },
    {
      id: `${prefix}-moving`,
      knowledge: `${id}-moving`,
      prompt: review
        ? '同一底线固定前3列，原来从左到右各有1、3、3、1、1块。把最后两列的块移到前3列，使前3列各3块，最少移动几块？'
        : '同一底线固定前3列，原来从左到右各有1、2、3、2、1块。把最后两列的块移到前3列，使前3列各3块，最少移动几块？',
      visual: initial,
      rule: { kind: 'number', value: review ? 2 : 3 },
      hint: '前3列已有的块保留，只把第4、5列的块移走，并补足前面不足3块的列。',
      explanation: review
        ? '第一列缺2块，末两列共有2块，移动这2块即可；这两块都必须移走，所以最少2块。'
        : '第一列缺2块、第二列缺1块，末两列共有3块，都必须移走，最少3块。',
    },
    {
      id: `${prefix}-same-size`,
      knowledge: `${id}-same-size`,
      prompt: review
        ? '把9块重新拼成长方体后，每一小块也自动变成长方体了吗？'
        : '将9块重新拼搭后，原来的每块小正方体变成别的形状了吗？',
      choices: [
        { id: 'no', label: '没有，每块仍是原来的正方体；整体摆放变了' },
        { id: 'yes', label: '变了，所有小块都变成长方体' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '区分每一块积木与拼成的整个物体。',
      explanation: '移动不改变单块形状；整体可以从阶梯状变成长方体。',
    },
    {
      id: `${prefix}-regular`,
      knowledge: `${id}-regular`,
      prompt: review
        ? '按约定每次增加2块：1块、3块、5块，接下来是多少块？'
        : '按约定每次增加2块：2块、4块、6块，接下来是多少块？',
      rule: { kind: 'number', value: review ? 7 : 8 },
      hint: '明确的规则是每次增加2，不是只增加1或把前面所有数量相加。',
      explanation: review ? '5 + 2 = 7。' : '6 + 2 = 8。',
    },
    {
      id: `${prefix}-stairs`,
      knowledge: `${id}-stairs`,
      prompt: review
        ? '图中从左到右四列分别有1、2、3、4块，只有一块深。全部有几块？'
        : '图中从左到右四列分别有4、3、2、1块，只有一块深。全部有几块？',
      visual: cubes(review ? [1, 2, 3, 4] : [4, 3, 2, 1]),
      rule: { kind: 'number', value: 10 },
      hint: '逐列合起来，不能只数列数；不同高度下也有下面的块。',
      explanation: review
        ? '1 + 2 + 3 + 4 = 10，共10块，不是4块。'
        : '4 + 3 + 2 + 1 = 10，共10块，不是4块。',
    },
    {
      id: `${prefix}-rule`,
      knowledge: `${id}-rule`,
      prompt: review
        ? '约定下一次增加4块，前一次有6块，下一次一共几块？'
        : '约定每次新增的一层比上次多1块：先1块，再增加2块成为3块，再增加3块成为6块，接着增加4块，一共几块？',
      rule: { kind: 'number', value: 10 },
      hint: '知道具体增加的块数再计算；只看到有限的几个数，不能假定一定只有一种规则。',
      explanation:
        '6 + 4 = 10。这里已给出增加规则，所以可以确定；没有规则的自创排列允许解释不同答案。',
    },
  ];
}
const sourceManual: [string, string][] = [
  [
    'paired-pattern',
    '实际回同版教材第94页第21项左组，逐幅按整块数核对已有三组，再用实物或纸片延续一组、填写空并说明你的规则。新增块数与全部块数分清，原图的成对摆法与本站数字示例分开；规则未明确时说明依据，不把一次猜测当唯一规律，没摆填暂跳。',
  ],
  [
    'stair-pattern',
    '实际回同版教材第94页第21项右组，逐层数已有三幅阶梯的全部块数，再继续摆下一幅、写总数并说明本次新增哪一层。两组各自处理，不把完成左组或自创一种排列当右组已做；保留全部摆画与帮助，没实际做暂跳。',
  ],
  [
    'original-beads',
    '实际回同版教材第94页原黄绿珠串，分别记录两端看得见的颜色次序与数量，说出你采用的规律及遮挡范围假设，再推测黄珠和绿珠各有几颗并摆卡核对。本站A/B四组明确条件例示不能直接当原图条件或答案；如果条件不足，记录不能唯一确定与所需信息，不猜作已核验事实，未读原图暂跳。',
  ],
];
const manual: [string, string][] = [
  [
    'beads',
    '按明确规则用A、B标记卡摆四组，遮住中间两组，分别推两类数量再实际揭开核对；另编规则并说明，不把合理不同解释判为错误。',
  ],
  [
    'build',
    '实际用9个同样大小积木摆一个只有一块深的阶梯状物体，逐列数数，重新排成长方体并核对总数不变。',
  ],
  [
    'move',
    '固定前3列的底线，摆成1、2、3、2、1块，实际移动末两列的3块，补成前3列各3块，说清为何最少移动3块。',
  ],
  [
    'pattern',
    '用积木按每次增加2块摆出2、4、6、8块，再设计另一种有明确规则的排列，让家长按规则继续摆并解释。',
  ],
  [
    'reflect',
    '对照本学期数的认识、加减法、形状、位置和实际操作，说一个自己做得好的例子和一个仍需要帮助的地方，请家长实际查看。',
  ],
];
export const sujiaoFinalBuildingLesson: Lesson = {
  id,
  textbookTitle: '期末复习：积木重排、规律与评价',
  title: '期末复习：积木重排与数量规律',
  page: 94,
  status: 'available',
  version: 3,
  goal: '逐列计数，理解重排不改变总数、单块与整体形状的区别，按明确规则继续排列，实际操作并反思。',
  prerequisite:
    '会10以内加法，认识长方体与正方体；准备10个同样大小积木与纸笔。',
  parentTip:
    '图示只有一块深，无隐藏后排。最少移动题明确固定底线和目标列，避免同一张图有不同摆放约定。自创规律必须口述，不能把有限数列的某个续项当作唯一正确答案；操作与反思独立人工确认。',
  steps: [
    ...sujiaoBeadSteps,
    {
      title: '逐列数，不数面或列数',
      text: '每列从下往上数，再合起来。图中五列1、2、3、2、1块，共9块。最高列3块、列数5、总数9问的是不同对象；图中只有一块深，没有隐藏后排。',
      visual: cubes([1, 2, 3, 2, 1]),
      activity: '实际摆出五列，分别说总块数、列数与最高列块数，逐块核对。',
    },
    {
      title: '移动改变摆法，不改变块数',
      text: '用原来全部9块重排，既没有增加也没有丢掉，总数仍是9。单块始终是正方体；整体三列各3块且只有一块深，拼成的是长方体，不能只看正面就说正方体。',
      visual: cubes([3, 3, 3]),
      activity: '重排9块积木，观察整体长、宽、高与每一小块，重新数一遍。',
    },
    {
      title: '说明最少移动的条件',
      text: '同一底线固定前3列，原来1、2、3、2、1块，目标前3列各3块。最后两列的3块必须移走，前面正好缺3块，因此移动3块能完成，也是最少。先说清底线、列位置与目标，再讨论移动。',
      activity:
        '实际移最后两列的3块，补足第一和第二列；说清哪些块保留、哪些块必须移动。',
    },
    {
      title: '找明确规律，再摆、再检查',
      text: '约定每次增加2块，2、4、6后是8。另一种约定每层比上一层多1块，1、3、6后再增加4得10。数列本身不一定只有一种解释，设计时把自己的规则讲给同伴，并用实物验证。最后说出学得好的地方和需要帮助的地方。',
      visual: cubes([4, 3, 2, 1]),
      activity:
        '摆两种明确规则，再自创一种并解释，和家长回顾本学期学习，不用完成次数自动判断掌握。',
    },
    {
      title: '两组原积木规律与原珠串分别观察',
      text: '第94页第21项两组积木规律须分别观察、继续摆、填数并说明规则；第一组按成对增加观察，第二组按新增一层观察，新增层块数与合计分清。原珠串要先记录可见两端，再说明遮挡范围与规律假设；本站A/B四组的明确规则只适用本站示例，不自动证明原串遮了两组或答案相同。实际活动独立记录，条件不明就待核对。',
      activity:
        '实际回原书逐项观察、读写、摆画并核对，保留作品和原话；没有原书或未做可暂跳，未来计划另记，不由网页答对自动确认。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际摆放、移动、计数和口述后再由家长确认。',
      explanation:
        '图示答案不替代实际拼搭、移动和反思；人工确认不算客观题独立答对。',
    })),
    ...sourceManual.map(([key, prompt]): Question => ({
      id: `${id}-manual-source-${key}`,
      knowledge: `${id}-actual-source-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '先实际处理原图的完整任务，再独立确认；帮助、未知与未完成部分如实记录。',
      explanation:
        '原图实际活动独立人工记录，correct为null；本站示例或计划不能替代已经读写和摆画。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-04',
    reviewer: '同版已保存原书正文与原创教学检查',
    notes: `依据实际查看ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第94页（${source.preview}）的积木移动、数量规律、评价与反思。原创图、列高、题目及目标条件，不复制教材插图；仅开放该页对应复习，遮挡珠串加入明确条件的原创例示；2026-10-04重看第94页，新增两组原积木规律及原黄绿珠串三个实际任务；旧v2的22主任务、17复习和前6步骤保持，新版25主任务，旧快照不改。不复刻原图，不据例示宣称全册已完成。`,
  },
};
