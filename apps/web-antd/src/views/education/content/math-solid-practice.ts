import type { Lesson, Question, SolidShape, Visual } from '../learning/types';

const names: Record<SolidShape, string> = {
  cube: '正方体',
  cuboid: '长方体',
  cylinder: '圆柱',
  sphere: '球',
};
const counts: Record<SolidShape, number> = {
  cube: 3,
  cuboid: 2,
  cylinder: 0,
  sphere: 1,
};
const base = {
  textbookTitle: '认识立体图形',
  page: 67,
  version: 1,
  status: 'available' as const,
  prerequisite: '先认识四种立体图形；家中缺少某种材料时可跳过对应实物任务。',
  parentTip:
    '参考人教上册67～72页，图示、材料组合和题目为本站原创。按本课四类分类时，正方体单独放一类；数学上正方体是特殊的长方体。只用轻小、完整、允许使用的物品在低处试，缺材料不需要购买。屏幕图示不是实际稳定性实验，纸画或看图不能代替摸、滚与搭。',
  review: {
    date: '2026-10-03',
    reviewer: '官方教材67～72页实际阅读与原创活动程序核对',
    notes:
      '资源1221001101241官方图片73～78实际核读。保留原mu-solid v1/ID；补充分类、特征观察、口述活动、稳定搭摆、拼组与计数规律。未发布教材扫描页、原画、原题或全文；实际操作人工确认不算自动答对。',
  },
};
function objective(
  id: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  hint: string,
  explanation: string,
  visual?: Visual,
  labels?: string[],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint,
    explanation,
    visual,
    choices: labels?.map((label) => ({ id: label, label })),
  };
}
function manual(
  id: string,
  suffix: string,
  prompt: string,
  hint: string,
  visual?: Visual,
): Question {
  return objective(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    hint,
    '仅记录实际操作和表达；未做可以跳过。不自动判断稳定性、触摸感受或理解程度，不计客观正确率。',
    visual,
  );
}
function reflection(id: string, suffix: string, prompt: string): Question {
  return objective(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '按真实经历记录，缺材料或尚未做也如实说明；可由家长代录。',
    '这是自己的观察和想法，没有统一正确答案，也不自动认定已掌握。',
  );
}
const observeId = 'mu-solid-observe';
const buildId = 'mu-solid-build';
const cards: Visual = {
  kind: 'block-cards',
  cards: [
    { shape: 'cube', color: 'red' },
    { shape: 'cuboid', color: 'blue' },
    { shape: 'sphere', color: 'yellow' },
    { shape: 'cube', color: 'blue' },
    { shape: 'cuboid', color: 'yellow' },
    { shape: 'cube', color: 'yellow' },
  ],
};
const rows: SolidShape[] = [
  'sphere',
  'cube',
  'cylinder',
  'sphere',
  'cube',
  'cylinder',
  'sphere',
  'cube',
];
export const solidPracticeLessons: Lesson[] = [
  {
    ...base,
    id: observeId,
    title: '分形状、摸一摸与口述拿取',
    goal: '结合实际物品按四类分类，比较表面与滚动，并用名称和特征交流。',
    steps: [
      {
        title: '物品和数学形状',
        text: '看看已有小盒、积木、完整圆柱学具和小球。物品通常只是接近数学形状，盖子、圆角或把手可能不一样。分别转着看，再按四种形状分类，不只按颜色或大小。',
        visual: cards,
        activity: '实际找出可用物品，说明接近哪一种形状。缺某种就说明缺少。',
      },
      {
        title: '平面、曲面与滚动',
        text: '在桌面或地垫上轻轻摸、转。比较盒子的平面、球的弯曲表面、圆柱的平底与弯曲侧面。圆柱侧放与底面朝下的表现不同；球可向不同方向滚动。观察现象，不从一幅图判真实物品一定站稳。',
        visual: { kind: 'shape', shape: 'cylinder' },
        activity:
          '实际比较一次圆柱侧放、底面朝下与球的轻轻滚动；不要让物品滚到桌沿。没有材料跳过。',
      },
      {
        title: '听名称拿取',
        text: '同伴说一种形状的名称，你从自己的材料中拿出对应物品，说明为什么；交换角色。看着或手摸都可以，不要求蒙眼、闭眼或走动。',
        visual: {
          kind: 'solid-row',
          shapes: ['cube', 'cuboid', 'sphere', 'cylinder'],
        },
        activity:
          '两人实际轮流完成四种名称的拿取；没有同伴时先读名称，不确认已完成交流。',
      },
      {
        title: '听特征猜一猜',
        text: '说形状的特征让同伴猜，尽量说出足够的信息。例如有两个平平圆面和弯曲侧面。不只用“能滚”来猜，因为球和侧放的圆柱都可能滚。猜到后再拿实物核对。',
        activity:
          '各提出一条明确特征，听对方猜后核对；可以改进不够明确的描述。',
      },
      {
        title: '按位置口令搭摆',
        text: '先由一人说哪块在下面、哪块在上面，再由另一人搭；每一步复述并检查。没有看对方示例也可以先听清位置，不拿高塔比赛代替说明。最后说说家中还有哪些接近这四种形状。',
        activity:
          '用一个小长方体、一个正方体和一个圆柱，实际完成三步低矮搭摆，再交换说与搭的角色。',
      },
    ],
    questions: [
      ...(['cube', 'cuboid', 'cylinder', 'sphere'] as const).map(
        (shape, index) =>
          objective(
            observeId,
            `q${index + 1}`,
            `按本课四类分别统计：图中归入${names[shape]}这一类的有几个？正方体单独算一类。`,
            {
              kind: 'number',
              value: counts[shape],
            },
            '逐张看形状，颜色不改变分类；没有这一类就填0。',
            `六张卡依次为正方体、长方体、球、正方体、长方体、正方体；${names[shape]}类别逐张计数。`,
            cards,
          ),
      ),
      objective(
        observeId,
        'q5',
        '只说“可以滚动”，能唯一确定是球吗？',
        { kind: 'choice', value: '不能' },
        '比较球和侧放的圆柱。',
        '侧放的圆柱也能滚，需补充表面或形状特征。',
        undefined,
        ['能', '不能'],
      ),
      objective(
        observeId,
        'q6',
        '圆柱底面朝下与侧放时，底面接触情况是否相同？',
        { kind: 'choice', value: '不相同' },
        '想想接触桌面的是平底还是弯曲侧面。',
        '底面朝下由平底接触，侧放时由弯曲侧面接触；放置方向影响观察。',
        { kind: 'shape', shape: 'cylinder' },
        ['相同', '不相同'],
      ),
      manual(
        observeId,
        'classify',
        '实际把已有材料按四种形状分类并说理由；缺少的形状明确说明。做过再确认。',
        '物品只能近似理想形状，颜色不同也可能同类。',
      ),
      manual(
        observeId,
        'roll',
        '实际比较圆柱两种放法和球的轻轻滚动，描述观察。缺材料可跳过。',
        '在低处操作，不把看图或猜测当真实实验。',
      ),
      manual(
        observeId,
        'take',
        '与同伴实际轮流完成名称拿取，互相核对四种形状。做过再确认。',
        '不必蒙眼，先听清名称；没有同伴先跳过。',
      ),
      manual(
        observeId,
        'guess',
        '与同伴轮流说特征猜形状，至少改进一次不够明确的描述。做过再确认。',
        '补充能区别图形的特征，不只说大小、颜色或能滚。',
      ),
      manual(
        observeId,
        'instruct',
        '实际完成口述三步搭摆并交换角色，核对上下位置。做过再确认。',
        '选择轻小完整的学具，在低处搭，不要求搭很高。',
      ),
      reflection(
        observeId,
        'experience',
        '记录一件家里实际看到的物品、接近的形状和观察依据；没有找到也如实说明。',
      ),
      reflection(
        observeId,
        'learning',
        '哪条特征最能帮助你分清形状？写下自己的发现或仍有的疑问。',
      ),
    ],
    reviewQuestions: [
      objective(
        observeId,
        'r1',
        '把一个正方体转向后，按本课四类分类会变成球吗？',
        { kind: 'choice', value: '不会' },
        '转向没有改变整体形状。',
        '旋转只改变朝向，正方体仍归正方体类。',
        { kind: 'shape', shape: 'cube' },
        ['会', '不会'],
      ),
      objective(
        observeId,
        'r2',
        '一个物品有两个平圆面和弯曲侧面，它接近哪一类？',
        { kind: 'choice', value: '圆柱' },
        '按表面特征判断。',
        '这组特征对应圆柱，不只根据能滚判断。',
        undefined,
        ['球', '圆柱'],
      ),
      objective(
        observeId,
        'r3',
        '同样的两个小球，一个红一个蓝，按形状分应怎样放？',
        { kind: 'choice', value: '同一类' },
        '本活动只按形状分类。',
        '颜色不同不改变球的形状类别。',
        undefined,
        ['同一类', '不同类'],
      ),
      reflection(
        observeId,
        'r4',
        '回顾一次实际拿取或特征描述：怎样说得更清楚？没做过就记录还没做。',
      ),
    ],
  },
  {
    ...base,
    id: buildId,
    title: '搭得稳、拼得完整与数规律',
    goal: '用实物比较摆放、组合完整外形，计数所有积木，并按明确重复单位续摆。',
    steps: [
      {
        title: '先明确搭摆条件',
        text: '从自己的小积木中选一组，先列出要用哪些、是否要全部用上，再考虑怎样稳和怎样高。这两个目标可能需要调整放法。同一长方体平放或竖放，高度和支撑面会变；没有固定尺寸，不设唯一最高方案。',
        activity:
          '选定自己的材料，实际试两种低处摆法；轻触检查后说哪种更稳。球不容易叠住时，可以比较用三块平面积木围出支撑处，做不到先记录问题。',
      },
      {
        title: '口述、尝试、调整与核对',
        text: '先商量方案再搭，看看每块的接触与支撑。每次改动前后数一数，确认选定材料全部用上，且同一块不重复计数。不能从屏幕图断定现实不会倒。',
        visual: { kind: 'cube-columns', heights: [2, 1, 1] },
        activity:
          '实际使用选定全部材料试搭，记录一处调整和原因；若缺某种材料，仅按自己的材料比较，不确认完成不存在的组合。',
      },
      {
        title: '拼成完整图形',
        text: '两个同样大小的正方体面贴面能组成一个长方体。四个相同小正方体可以排一长排，也可排两行两列；检查完整外轮廓和内部是否留空。再用四个相同长方体探索不同完整外形，转方向不自动算成新形状，不设未经实际核对的唯一方案数。',
        visual: { kind: 'cube-columns', heights: [2, 2] },
        activity:
          '实际分别用2、4个相同正方体拼完整外形，再尝试4个相同长方体。缺材料的对应活动跳过，不用画图冒实物操作。',
      },
      {
        title: '看不见的积木也要数',
        text: '图示每一列从地面连续放到标出的高度，没有悬空。逐列数整个小正方体，不数可见的面。两堆数量凑够目标，只说明块数合适，还需实际检查空间位置能否拼成完整目标。',
        visual: { kind: 'cube-columns', heights: [2, 2, 1] },
        activity:
          '在实物中拿走或转向看看被挡住的块；分别记录每类和合计。再把6个正方体分成两堆，尝试拼成两行三列一层的目标。',
      },
      {
        title: '找重复组，再续摆',
        text: '先从左到右找反复出现的完整一组，再判断接下来放什么。例如球、正方体、圆柱这组三种重复；也可以长方体、圆柱、圆柱这组重复，重复组的长度不能随意改变。',
        visual: { kind: 'solid-row', shapes: rows },
        activity:
          '用实际积木摆出两种重复规律，给同伴续摆并说一组包含哪些。最后记录认识物品和拼组的收获；没有材料或同伴则说明未做。',
      },
    ],
    questions: [
      objective(
        buildId,
        'q1',
        '图中每列都从地面连续放满，依次2、1、1块。一共有几个小正方体？',
        { kind: 'number', value: 4 },
        '逐列数整个块，再相加；不要数面。',
        '2+1+1=4块。每列底部也计入，不因遮挡漏掉。',
        { kind: 'cube-columns', heights: [2, 1, 1] },
      ),
      objective(
        buildId,
        'q2',
        '只检查数量：把6个小正方体分成两堆，每堆至少1个。依次填写两堆数量，可有不同分法。',
        { kind: 'partition', parts: 2, minimum: 1, total: 6 },
        '两堆合计6；数量合适后还需实际检查目标形状。',
        '两堆都是正整数，合计6即可；交换两堆也可以。该题只判块数，不判断任意两堆空间形状一定能拼。',
      ),
      objective(
        buildId,
        'q3',
        '图中两列都从底部连续放满，每列2块。一共有几块小正方体？',
        { kind: 'number', value: 4 },
        '各列都数完整块。',
        '2+2=4块，不能只数前面的面。',
        { kind: 'cube-columns', heights: [2, 2] },
      ),
      objective(
        buildId,
        'q4',
        '图中每列从底部连续放满，依次2、2、1块。总共几块？',
        { kind: 'number', value: 5 },
        '逐列相加。',
        '2+2+1=5块，整个块只数一次。',
        { kind: 'cube-columns', heights: [2, 2, 1] },
      ),
      objective(
        buildId,
        'q5',
        '从左到右按“球、正方体、圆柱”一组反复摆，图中已有8个。第9个应是什么？',
        { kind: 'choice', value: '圆柱' },
        '前两组三种完整，第三组还差最后一个。',
        '第7个球、第8个正方体，第9个补圆柱。',
        { kind: 'solid-row', shapes: rows },
        ['球', '正方体', '圆柱'],
      ),
      objective(
        buildId,
        'q6',
        '从左到右按“长方体、圆柱、圆柱”反复摆，已有长方体、圆柱、圆柱、长方体、圆柱，接下来摆什么？',
        { kind: 'choice', value: '圆柱' },
        '一组有三个，其中圆柱有两个。',
        '第二组还缺第二个圆柱。',
        {
          kind: 'solid-row',
          shapes: ['cuboid', 'cylinder', 'cylinder', 'cuboid', 'cylinder'],
        },
        ['长方体', '圆柱'],
      ),
      manual(
        buildId,
        'steady',
        '实际用选定的轻小材料比较两种低处摆法，说明稳与高的差别，再确认。',
        '轻轻观察支撑，不设唯一最高方案；不要在高处追求竞赛。',
      ),
      manual(
        buildId,
        'all',
        '实际把选定的全部材料用上，并逐块核对、调整一次摆法，再确认。',
        '实际选了哪些就检查哪些，不补造缺少材料。',
      ),
      manual(
        buildId,
        'join-two',
        '实际用2个同样大的小正方体面贴面拼完整长方体，再确认。',
        '外轮廓完整，内部不重叠，不能只有角碰到。',
      ),
      manual(
        buildId,
        'join-four',
        '实际用4个相同小正方体分别排一长排和两行两列，比较完整外形，再确认。',
        '两种都要用全部4块，计数每块，不数面。',
      ),
      manual(
        buildId,
        'cuboids',
        '实际用4个相同小长方体探索不同完整外形，描述摆法与检查，再确认。',
        '缺相同材料可跳过；转向不自动算新形状，不要求未核验方案数。',
      ),
      manual(
        buildId,
        'hidden',
        '实际转动或拆开一次自己的搭摆，数清被挡住的块及每类合计，再确认。',
        '先记录总数，再拆看，不把屏幕练习答对记为实际拆看。',
      ),
      manual(
        buildId,
        'two-piles',
        '实际把6个相同正方体分成两堆，再尝试合成两行三列一层，核对无重叠和空缺，再确认。',
        '先检查块数，再检查每块占的位置；缺材料可跳过。',
      ),
      manual(
        buildId,
        'patterns',
        '实际摆两种明确重复组的规律，自己或与同伴续摆并说明组，再确认。',
        '把完整一组说清，再续摆；只看图答题不是实际摆放。',
      ),
      reflection(
        buildId,
        'reflection',
        '记录实际搭摆中调整的一处、原因与结果；没试过或没稳住也如实记录。',
      ),
      reflection(
        buildId,
        'growth',
        '说说认识生活物品或完整拼组的一个收获与一个仍需帮助的地方；没有经历就记录未做。',
      ),
    ],
    reviewQuestions: [
      objective(
        buildId,
        'r1',
        '三列小正方体从底部连续放满，每列1、2、2块。合计几块？',
        { kind: 'number', value: 5 },
        '逐列加完整块。',
        '1+2+2=5块。',
        { kind: 'cube-columns', heights: [1, 2, 2] },
      ),
      objective(
        buildId,
        'r2',
        '从左到右“圆柱、球、球”一组重复，已有圆柱、球、球、圆柱。下一块是什么？',
        { kind: 'choice', value: '球' },
        '下一块是第二组的第2项。',
        '第二组还需球、球，所以下一块是球。',
        {
          kind: 'solid-row',
          shapes: ['cylinder', 'sphere', 'sphere', 'cylinder'],
        },
        ['圆柱', '球'],
      ),
      objective(
        buildId,
        'r3',
        '只检查块数：把5个小正方体分成两堆，每堆至少1个。填写一种分法。',
        { kind: 'partition', parts: 2, minimum: 1, total: 5 },
        '两堆合起来要是5。',
        '正整数合计5即可；数量判断不代替实际空间拼组。',
      ),
      reflection(
        buildId,
        'r4',
        '回顾自己已有一次续摆或拆开计数的经历，哪里需要核对？未做过就如实记录。',
      ),
    ],
  },
];
