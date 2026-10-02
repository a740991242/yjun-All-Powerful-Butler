import type {
  Lesson,
  Question,
  Shape,
  SolidRowVisual,
} from '../learning/types';

import { fold } from '../learning/fold';
import { required } from '../learning/required';
import { solidCounts, solidPositions } from '../learning/solid-row';

export const sujiaoSolidSources = {
  checkedAt: '2026-10-01',
  recognize: [38_176, 38_177, 38_178, 38_181].map(
    (id) => `http://app.xxsx.cn/resources-detail/${id}/63`,
  ),
  build: [38_179, 38_180, 38_182, 38_183].map(
    (id) => `http://app.xxsx.cn/resources-detail/${id}/63`,
  ),
} as const;
const solids: { shape: Shape; name: string }[] = [
  { shape: 'cuboid', name: '长方体' },
  { shape: 'cube', name: '正方体' },
  { shape: 'cylinder', name: '圆柱' },
  { shape: 'sphere', name: '球' },
];
const choices = () =>
  solids.map(({ shape, name }) => ({ id: shape, label: name }));

function rowTasks(review: boolean): Question[] {
  const id = 'sj-upper-recognize-solids';
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const visual: SolidRowVisual = {
    kind: 'solid-row',
    shapes: review
      ? [
          'cuboid',
          'cube',
          'cylinder',
          'cuboid',
          'sphere',
          'cube',
          'cylinder',
          'cuboid',
        ]
      : ['cube', 'cylinder', 'sphere', 'cuboid', 'cylinder', 'cube', 'cuboid'],
  };
  const counts = solidCounts(visual);
  const spherePosition = required(solidPositions(visual, 'sphere')[0]);
  const neighbours = [
    required(visual.shapes[spherePosition - 2]),
    required(visual.shapes[spherePosition]),
  ];
  return [
    {
      id: `${prefix}-row-total`,
      knowledge: `${id}-row-total`,
      prompt: '这一排模型一共有几个？数整个模型，不数它的面。',
      visual,
      rule: { kind: 'number', value: visual.shapes.length },
      hint: '每个完整模型只数一次。窄屏先左右滑动看完整一排。',
      explanation: `整排共${visual.shapes.length}个模型，不把一个物体的多个面分别计数。`,
    },
    {
      id: `${prefix}-row-rank`,
      knowledge: `${id}-row-rank`,
      prompt: '从左往右数，球是第几个模型？',
      visual,
      rule: { kind: 'number', value: spherePosition },
      hint: '先找到最左边模型，从第1个开始数到球。',
      explanation: `从左往右数，球在第${spherePosition}个位置。位置和总数量是不同问题。`,
    },
    {
      id: `${prefix}-row-cubes`,
      knowledge: `${id}-row-cubes`,
      prompt:
        '从左往右数，两个正方体分别在第几个位置？按先左后右填写两个位置。',
      visual,
      rule: { kind: 'steps', values: solidPositions(visual, 'cube') },
      hint: '看完整物体找方方正正的正方体，写它们在整排中的位置，不填正方体的总个数。',
      explanation: `两个正方体在第${solidPositions(visual, 'cube').join('和第')}个位置。`,
    },
    ...neighbours.map((shape, index): Question => ({
      id: `${prefix}-row-neighbour-${index}`,
      knowledge: `${id}-row-neighbour-${index}`,
      prompt: `球${index === 0 ? '左' : '右'}边紧挨着的模型是什么形状？`,
      visual,
      choices: choices(),
      rule: { kind: 'choice', value: shape },
      hint: '先找到球，再只看指定方向紧挨着的一个模型，不跳到更远处。',
      explanation: `紧挨球的${index === 0 ? '左' : '右'}边模型是${required(solids.find((item) => item.shape === shape)).name}。`,
    })),
    {
      id: `${prefix}-row-counts`,
      knowledge: `${id}-row-counts`,
      prompt:
        '这排模型里，按正方体、长方体、圆柱、球的顺序，依次填写每类有几个。',
      visual,
      rule: {
        kind: 'steps',
        values: [counts.cube, counts.cuboid, counts.cylinder, counts.sphere],
      },
      hint: '每次只数同一形状，再换下一类；四类合起来应等于整排总数。',
      explanation: `四类分别${counts.cube}、${counts.cuboid}、${counts.cylinder}、${counts.sphere}个，共${visual.shapes.length}个。颜色、大小或摆放位置不是本题的分类标准。`,
    },
  ];
}

function recognitionTasks(review: boolean): Question[] {
  const id = 'sj-upper-recognize-solids';
  const prefix = review ? 'r' : 'q';
  const stories = review
    ? [
        '一个理想的直直的细长纸盒，整体长长方方的，不是六个面同样大的小方块。',
        '一个理想的方块积木，整体方方正正，每个面都是同样大的正方形。',
        '一个理想的直筒模型，上下同样粗，两端平平的、圆圆的，侧面弯曲。',
        '一个理想的圆球模型，整体圆滚滚，表面都是弯曲的，没有平平的面。',
      ]
    : [
        '一个理想的薄薄的长方形盒子，整体长长方方的，不是六个面同样大的小方块。',
        '一个理想的小方块，整体方方正正，每个面都是同样大的正方形。',
        '一个理想的直圆柱积木，上下同样粗，两端圆圆平平，侧面弯曲。',
        '一个理想的球形积木，整体圆滚滚，没有平平的面。',
      ];
  return [
    ...rowTasks(review),
    ...solids.map(({ shape }, index): Question => ({
      id: `${id}-${prefix}-diagram-${index}`,
      knowledge: `${id}-diagram-${index}`,
      prompt: review
        ? '这张模型图显示的是哪种立体形状？观察整个物体，不只看一个面。'
        : '图示整个物体是什么立体形状？',
      visual: { kind: 'shape', shape },
      choices: choices(),
      rule: { kind: 'choice', value: shape },
      hint: '看整个物体，比较长长方方、方方正正、直筒形和圆滚滚的特点。',
      explanation: `这个示意模型是${required(solids[index]).name}。画在屏幕上的图只是帮助观察，真正物体要拿起来从不同方向看。`,
    })),
    ...solids.map(({ shape, name }, index): Question => ({
      id: `${id}-${prefix}-description-${index}`,
      knowledge: `${id}-description-${index}`,
      prompt: `${stories[index]}它更接近哪种立体形状？`,
      choices: choices(),
      rule: { kind: 'choice', value: shape },
      hint: '根据整体形状判断，不用颜色或用途代替形状。',
      explanation: `题目描述的理想模型是${name}。实际物品可能带把手、底座或其它部分，不能据名称把所有同用途物品都归为同一形状。`,
    })),
    {
      id: `${id}-${prefix}-cylinder`,
      knowledge: `${id}-cylinder-orientation`,
      prompt: review
        ? '圆柱模型已经横放在平桌面上，想观察它能否滚动，应该怎样做？'
        : '观察圆柱模型滚动时，为什么要分别试试竖放和横放？',
      choices: review
        ? [
            { id: 'observe', label: '轻推并观察，再换竖放比较' },
            { id: 'guess', label: '只凭颜色猜测，不试摆放' },
          ]
        : [
            { id: 'observe', label: '摆放方式不同，要实际观察' },
            { id: 'guess', label: '任何摆放方式都会一样滚动' },
          ],
      rule: { kind: 'choice', value: 'observe' },
      hint: '同一个圆柱的平面和曲面接触桌面时不同，要实际试验。',
      explanation:
        '圆柱直立时平面着地，横放时曲面着地；实际滚动与摆放和桌面条件有关，不能一概说圆柱永远会滚。',
    },
    {
      id: `${id}-${prefix}-classification`,
      knowledge: `${id}-classification-shape`,
      prompt: review
        ? '把模型分成四类时，同一形状但大小不同的两块应怎样处理？'
        : '把模型按立体形状分类时，同一形状但颜色不同的两块应怎样处理？',
      choices: [
        { id: 'same', label: '仍可放在同一形状类里' },
        { id: 'different', label: '必须放在不同形状类里' },
      ],
      rule: { kind: 'choice', value: 'same' },
      hint: '这次按形状分，不能换成按颜色或大小分。',
      explanation: '分类标准是形状；颜色或大小不同不一定改变所属的形状类。',
    },
  ];
}

export const sujiaoSolidRecognitionDraft: Lesson = {
  id: 'sj-upper-recognize-solids',
  textbookTitle: '认识长方体、正方体、圆柱和球',
  title: '看、分、摸：认识四种立体形状',
  page: 54,
  status: 'preparing',
  version: 2,
  goal: '观察四种立体形状，按整体形状分类，比较平面与曲面接触桌面时的滚动和堆放情况。',
  prerequisite: '准备安全的四种形状模型、平桌面和布袋；请家长帮读题。',
  parentTip:
    '不用易碎杯子、尖锐或过小物品，不必蒙眼走动。实物常只是近似形状，带把手或底座的整个物体不一定属于理想模型；图示识别不代替摸物和滚动观察。',
  steps: [
    {
      title: '看整个物体',
      text: '长方体长长方方，正方体方方正正。拿起模型从不同方向看，正方体的每个面都是同样大的正方形；不要只凭其中一个面判断整体。',
      visual: { kind: 'shape', shape: 'cuboid' },
      activity: '实际观察长方体与正方体，把同一种形状的模型放在一起。',
    },
    {
      title: '圆柱与球',
      text: '直圆柱上下同样粗，两端圆圆平平，侧面弯曲；球整体圆滚滚，没有平平的面。改变颜色、位置或大小不一定改变形状类别。',
      visual: { kind: 'shape', shape: 'cylinder' },
      activity: '实际比较圆柱和球，指出摸到的平面与弯曲表面。',
    },
    {
      title: '滚一滚、堆一堆',
      text: '在平桌面上轻推四种模型，观察哪些容易滚，再试试堆放。圆柱要分别试竖放和横放。观察真实结果并说清摆放方式，不只背形状名称。',
      activity: '在家长陪同下轻推与堆放，避免物品滚落；说出自己看到的情况。',
    },
    {
      title: '你说我摸，生活里找',
      text: '把安全模型放进布袋，一人说特点，另一人摸出对应模型，再拿出来验证。身边物品可以近似模型，但要观察实际整体，不根据用途直接判形状。',
      activity: '各摸一次四种形状，在身边找一个近似的物品并说明理由。',
    },
    {
      title: '整排里找位置、数各类',
      text: '先看完整一排，从左往右逐个数。第几个是位置，一共几个是总数；球左边或右边紧挨的模型只指相邻一个，不是所有在那一侧的物体。按四种形状分别数，每个完整模型只分到一类，再检查四类合起来等于总数。',
      visual: {
        kind: 'solid-row',
        shapes: [
          'cube',
          'cylinder',
          'sphere',
          'cuboid',
          'cylinder',
          'cube',
          'cuboid',
        ],
      },
      activity:
        '用四种安全模型实际排一排，分别说总数、球的位置和两侧相邻形状，再数各类；换排列重新说明。',
    },
  ],
  questions: [
    ...recognitionTasks(false),
    {
      id: 'sj-upper-recognize-solids-manual-classify',
      knowledge: 'sj-upper-recognize-solids-physical',
      prompt:
        '拿四种安全实物模型，从不同方向看并分类，摸一摸，指出分类理由，请家长查看。',
      rule: { kind: 'manual' },
      hint: '按整体形状分，不按颜色或用途分。',
      explanation: '实际观察、触摸与分类人工确认。',
    },
    {
      id: 'sj-upper-recognize-solids-manual-roll',
      knowledge: 'sj-upper-recognize-solids-roll',
      prompt:
        '在平桌面轻推、堆放四种安全模型，圆柱分别竖放与横放。说清观察到的结果，请家长查看。',
      rule: { kind: 'manual' },
      hint: '轻推，防止滚落；比较不同接触面的摆放情况。',
      explanation: '实际滚动和堆放人工确认，选择题不代替实验。',
    },
    {
      id: 'sj-upper-recognize-solids-manual-touch',
      knowledge: 'sj-upper-recognize-solids-life',
      prompt:
        '用布袋玩你说我摸，再找一个生活中的近似物品，说明它接近哪种形状及不同的部分。',
      rule: { kind: 'manual' },
      hint: '袋里只放安全模型，摸出后拿出来检查，不要求闭眼走动。',
      explanation: '触摸、生活观察和表达人工确认，完成不等于熟练掌握。',
    },
    {
      id: 'sj-upper-recognize-solids-manual-row',
      knowledge: 'sj-upper-recognize-solids-row-physical',
      prompt:
        '实际排出一排至少两种形状的模型，标出最左边，说明总个数、某个模型的位置及紧邻的形状，再数各类。换位置后重新解释，请家长查看。',
      rule: { kind: 'manual' },
      hint: '每个模型只数一次，不把面数当块数；位置随排列变化，总数不因只换位置改变。',
      explanation: '实物排列、分类、点数与表达人工确认，图示答题不能代替。',
    },
  ],
  reviewQuestions: recognitionTasks(true),
  review: {
    date: sujiaoSolidSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据第54～56、59页：${sujiaoSolidSources.recognize.join('；')}。本站原创模型与问答，未复制教材图片，图示答对不代替实物活动。2024年7月第1版、2025年7月第2次印刷同版正文已核验；源草稿保留，正式课包另行注册。`,
  },
};

function buildTasks(review: boolean): Question[] {
  const id = 'sj-upper-build-solids';
  const prefix = review ? 'r' : 'q';
  const arrangements = review
    ? [[1, 1, 1], [1, 2], [1, 1, 1, 1], [2]]
    : [[1, 1], [2, 1], [2, 2], [3]];
  const whole = review
    ? [[2], [3, 1], [3, 3]]
    : [
        [1, 1, 1],
        [2, 1],
        [2, 2],
      ];
  return [
    ...arrangements.map((heights, index): Question => ({
      id: `${id}-${prefix}-count-${index}`,
      knowledge: `${id}-count-${index}`,
      prompt:
        '图中积木只有一排深，每个正面小方格是一块同样大小的正方体。共有几块？',
      visual: { kind: 'cube-columns', heights },
      rule: {
        kind: 'number',
        value: fold(heights, 0, (sum, value) => sum + value),
      },
      hint: '每列从下往上数，再合起来，不把一个面算成一块额外积木。',
      explanation: `每列块数合起来：${heights.join(' + ')} = ${fold(heights, 0, (sum, value) => sum + value)}。图中没有后排隐藏的积木。`,
    })),
    ...whole.map((heights, index): Question => ({
      id: `${id}-${prefix}-whole-${index}`,
      knowledge: `${id}-whole-${index}`,
      prompt: '看全部积木拼成的整体（仅一块深）。这个完整外形是什么？',
      visual: { kind: 'cube-columns', heights },
      choices: [
        { id: 'cuboid', label: '长方体' },
        { id: 'cube', label: '正方体' },
        { id: 'other', label: '阶梯形，不是完整长方体或正方体' },
      ],
      rule: { kind: 'choice', value: index === 1 ? 'other' : 'cuboid' },
      hint: '看整体是否有阶梯缺口，再看宽、高、深；正面像正方形并不能证明整个物体是正方体。',
      explanation:
        index === 1
          ? '列高不同，整体有阶梯，不是完整长方体或正方体。'
          : '完整整体是长方体。图中只有一块深，宽或高大于一块；即使正面是正方形，整体也不是正方体。',
    })),
    {
      id: `${id}-${prefix}-pattern`,
      knowledge: `${id}-pattern`,
      prompt: review
        ? '按“球、正方体、圆柱”一组重复摆：球、正方体、圆柱、球、正方体、圆柱。下一件摆什么？'
        : '按“圆柱、球、正方体”一组重复摆：圆柱、球、正方体、圆柱、球、正方体。下一件摆什么？',
      choices: choices(),
      rule: { kind: 'choice', value: review ? 'sphere' : 'cylinder' },
      hint: '找完整重复小组，下一组从第一个物体开始。',
      explanation: review ? '下一组从球开始。' : '下一组从圆柱开始。',
    },
    {
      id: `${id}-${prefix}-instructions`,
      knowledge: `${id}-instructions`,
      prompt: review
        ? '先放一个正方体，再在它右边放一个圆柱，最后在圆柱上放一个球。球在谁的上面？'
        : '先放一个长方体，再在它左边放一个正方体，最后在正方体上放一个球。球在谁的上面？',
      choices: choices(),
      rule: { kind: 'choice', value: review ? 'cylinder' : 'cube' },
      hint: '按给定指令顺序理解，明确最后一步的参照物。实际能否稳住还要摆物观察。',
      explanation: review
        ? '最后一步说球在圆柱上。这里只检查给定语言，不表示已实际搭稳。'
        : '最后一步说球在正方体上。这里只检查给定语言，不表示已实际搭稳。',
    },
  ];
}

export const sujiaoSolidBuildDraft: Lesson = {
  id: 'sj-upper-build-solids',
  textbookTitle: '立体图形的拼搭与综合活动',
  title: '数积木、看整体、按指令拼搭',
  page: 57,
  status: 'preparing',
  version: 1,
  goal: '区分单块与整体、块数与面数，通过实际拼搭理解位置指令和形状规律。',
  prerequisite:
    '认识四种立体形状和0～9；准备8块同样大小的正方体及安全圆柱、球、长方体模型。',
  parentTip:
    '原创积木图仅一块深，没有隐蔽后排。实际三维模型要拿起来检查，包括看不到的块；不把单排图题答对当作已完成空间拼搭。',
  steps: [
    {
      title: '相同方块可以不同拼法',
      text: '两块相同正方体可以左右、上下或前后紧贴，整体都可形成长方体。换位置不增加或减少块数；小方块的名字与拼好整体的名字不同。',
      visual: { kind: 'cube-columns', heights: [1, 1] },
      activity: '用两块实际尝试左右、上下、前后拼法，观察整个外形。',
    },
    {
      title: '数块数，不数面数',
      text: '每块积木有多个面，不能把看到的面数当作块数。本站图只有一排深，按列数正面方格即可；实际多排模型必须检查后面的积木。',
      visual: { kind: 'cube-columns', heights: [2, 1] },
      activity: '用三块搭一条和一个阶梯，检查两种拼法总块数相同。',
    },
    {
      title: '看整体与补成大方块',
      text: '一排深、两列各两块的正面像正方形，但整体厚度只有一块，是长方体。要做最小的更大正方体，可以实际用两层，每层两排、每排两块，共8块。不能只按正面猜整体。',
      visual: { kind: 'cube-columns', heights: [2, 2] },
      activity:
        '实际用8块摆两层的大正方体，转过来检查宽、高、深，再拆开数块数。',
    },
    {
      title: '你说我搭与按规律接着摆',
      text: '一人说清参照物及前后左右上下，另一人按顺序搭，再检查是否对应。先看清规则是两件交替还是三件重复，再继续摆；用形状模型创作一个物体并说明用到哪些形状。',
      activity:
        '各做一次你说我搭和重复排列，再原创一个安全的小模型，数清各类积木。',
    },
  ],
  questions: [
    ...buildTasks(false),
    {
      id: 'sj-upper-build-solids-manual-join',
      knowledge: 'sj-upper-build-solids-physical',
      prompt:
        '用2、3、4块相同正方体分别试不同拼法，数清块数并说明整体形状；别把看到的面数当块数。',
      rule: { kind: 'manual' },
      hint: '紧贴拼搭，拿起来从不同方向检查。',
      explanation: '实际拼搭与解释人工确认。',
    },
    {
      id: 'sj-upper-build-solids-manual-eight',
      knowledge: 'sj-upper-build-solids-three-dimensional',
      prompt:
        '用8块相同正方体实际搭两层、每层两排、每排两块的大正方体，转过来查看并拆开验证块数，请家长查看。',
      rule: { kind: 'manual' },
      hint: '每层4块，两层8块，宽、高、深都是两块长。',
      explanation: '真实三维拼搭人工确认，不以单排图题代替。',
    },
    {
      id: 'sj-upper-build-solids-manual-instructions',
      knowledge: 'sj-upper-build-solids-position',
      prompt:
        '与家长轮流说清参照物和位置，按顺序实际搭一个模型；检查位置与能否稳住，说明用到哪些形状及各有几块。',
      rule: { kind: 'manual' },
      hint: '先说参照对象，轻放模型防止掉落。',
      explanation: '语言、实际位置与搭建人工确认。',
    },
    {
      id: 'sj-upper-build-solids-manual-pattern',
      knowledge: 'sj-upper-build-solids-pattern-reflection',
      prompt:
        '原创一个形状重复规律，实际摆下一组并说明规则；再说一个自己仍想尝试的拼法，请家长听你解释。',
      rule: { kind: 'manual' },
      hint: '找完整小组，按固定顺序重复。',
      explanation: '实际摆放、表达与反思人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: buildTasks(true),
  review: {
    date: sujiaoSolidSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据第57～58、60～61页：${sujiaoSolidSources.build.join('；')}。原创一排深积木图，不复制教材搭建造型。图示题与实际8块立方体搭建单独记录，未覆盖教材每一道原练习，不声明单元完整；2024年7月第1版、2025年7月第2次印刷同版正文已核验；正式课包另行注册。`,
  },
};

export const sujiaoSolidDrafts = [
  sujiaoSolidRecognitionDraft,
  sujiaoSolidBuildDraft,
];
