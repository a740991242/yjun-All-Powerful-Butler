import type { BnuFinalPracticeVisual } from '../learning/bnu-final-practice';
import type { Lesson, Question, Visual } from '../learning/types';

const id = 'bnu-lower-final-practice';
const visual = (
  scene: BnuFinalPracticeVisual['scene'],
  variant: 'main' | 'review' = 'main',
): Visual => ({ kind: 'bnu-final-practice', scene, variant });
const q = (
  key: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  figure?: Visual,
): Question => ({
  id: `${id}-${key}`,
  knowledge: id,
  prompt,
  rule,
  explanation,
  hint: '按完整重复组和方向核对每个位置；网页选择与真实续画、交流、合作分开。',
  ...(figure ? { visual: figure } : {}),
});
const choice = (
  key: string,
  prompt: string,
  value: string,
  labels: [string, string][],
  explanation: string,
  figure?: Visual,
): Question => ({
  ...q(key, prompt, { kind: 'choice', value }, explanation, figure),
  choices: labels.map(([id, label]) => ({ id, label })),
});
const actual = (key: string, prompt: string) =>
  q(
    key,
    prompt,
    { kind: 'manual' },
    '实际完成这项才确认；未做可跳过或待做。纸面作画、真实讲述和合作不能由网页选择自动完成，可请家人协助，不能把未来计划当已经发生。',
  );
const record = (key: string, prompt: string) =>
  q(
    key,
    prompt,
    { kind: 'reflection' },
    '保留实际原话、作品方法和待做之处，correct为null；不定唯一生活表达或故事，不把计划评为实际完成。',
  );
const labels = {
  faces: [
    ['happy', '笑脸'],
    ['sad', '伤心脸'],
  ],
  cups: [
    ['right', '把手朝右'],
    ['left', '把手朝左'],
  ],
  divisions: [
    ['horizontal', '横分线'],
    ['vertical', '竖分线'],
  ],
} satisfies Record<BnuFinalPracticeVisual['scene'], [string, string][]>;
const mainAnswers = {
  faces: ['happy', 'happy', 'sad'],
  cups: ['right', 'left', 'right'],
  divisions: ['horizontal', 'vertical', 'horizontal'],
};
const reviewAnswers = {
  faces: ['sad', 'happy', 'happy'],
  cups: ['left', 'right', 'left'],
  divisions: ['vertical', 'horizontal', 'vertical'],
};
const names = { faces: '表情', cups: '杯子把手', divisions: '分线图' };
const units = { faces: '笑、笑、伤心', cups: '右、左', divisions: '横、竖' };
const newUnits = { faces: '伤心、笑、笑', cups: '左、右', divisions: '竖、横' };
const scenes = ['faces', 'cups', 'divisions'] as const;
const continuations = (variant: 'main' | 'review') =>
  scenes.flatMap((scene) =>
    (variant === 'main' ? mainAnswers : reviewAnswers)[scene].map(
      (answer, index) =>
        choice(
          `${variant === 'review' ? 'review-' : ''}${scene}-${index + 1}`,
          `${variant === 'review' ? '本站换起点的新图：' : ''}${names[scene]}一行续画空位${String.fromCodePoint(65 + index)}应画哪一种？`,
          answer,
          labels[scene],
          `完整重复组为“${(variant === 'main' ? units : newUnits)[scene]}”；从最后一个已给图继续，逐个核对A、B、C，不能把三个空位全画同一种。此选择不自动完成纸面续画。`,
          visual(scene, variant),
        ),
    ),
  );
export const bnuLowerFinalPracticeLesson: Lesson = {
  id,
  title: '接着画、表达规律与合作数学故事',
  textbookTitle: '总复习：综合与实践',
  page: 95,
  version: 1,
  status: 'available',
  goal: '回顾数学连环画、重复规律和图案设计，逐一续画三组图，用自己的方式表达三处生活规律，并实际合作讲故事、画连环画和交流。',
  prerequisite:
    '已学习重复图案与数学故事，准备纸笔；合作可找同伴或家人，暂无合作条件如实待做。',
  parentTip:
    '三行各三个空位必须逐个核对。生活照片的完整重复组受可见边界、遮挡和观察标准影响，不冒唯一颜色顺序；允许文字、符号、图形和合理解释。真实创作与合作分别确认，不以网站答对替代。已有人教/苏教/北师大学习记录保持，学校不是通用课程前置。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描印刷95页',
    notes:
      '四项原活动逐项映射，本站重画给定结构、不复制照片和完整现代插画；不冒人工最终审校或全年完成。',
  },
  steps: [
    {
      title: '回顾三件已学过的实践',
      text: '原95页回顾小组数学连环画、用不同方式表示重复、用规律设计图案。分别拿出实际做过的作品，说明数学信息、重复组或设计方法；没有旧作品可以重新制作，但不能把想做说成已经做完。',
      activity: '实际回顾连环画、表示重复和图案设计，逐项说明。',
    },
    {
      title: '表情：两个笑脸和一个伤心脸成一组',
      text: '已给六个表情依次是笑、笑、伤心、笑、笑、伤心，完整重复组有三个。接着画的A、B、C依次是笑、笑、伤心；不能只看最后两个图误认一笑一伤心交替。本站重画表情结构，空位保留空白。',
      visual: visual('faces'),
      activity: '在纸上实际画完三个表情空位，逐个读出完整重复组。',
    },
    {
      title: '杯子：把手方向也属于规律',
      text: '四个已给杯子把手依次朝右、左、右、左，按右、左两图重复。A、B、C应为右、左、右。杯身画在同一方向基准，不能把左右称为杯子的前后或只看杯子数量忽略把手。',
      visual: visual('cups'),
      activity: '实际分别续画三个杯子，核对每个把手方向。',
    },
    {
      title: '分线：横与竖分别核对',
      text: '四个已给图内部依次横分线、竖分线、横分线、竖分线，完整组为横、竖。A、B、C接着画横、竖、横。这里看内部线方向，不用外框颜色或图形叫法替换所问规律。',
      visual: visual('divisions'),
      activity: '实际续画三图并分别核对内部横竖线。',
    },
    {
      title: '同样是重复，表达可以不同',
      text: '可指读图案、用文字说重复组、用不同符号代替不同图案，再连续写两组。符号前先说明各代表什么，同一种图案保持同一种符号。规律设计需要能说清怎样重复，不是随意放几张图就宣布有固定规律。',
      activity: '用自己的第二种表达解释已给规律，保存实际表达。',
    },
    {
      title: '城墙：说明观察对象和范围',
      text: '观察原95页城墙照片，可从反复出现的墙体构件或可见结构描述规律。沿观察路径指出哪一段重复、用什么符号表示，遮挡或不清处记录待核对；不从照片比例量厘米，不把弯曲方向当每件都同尺寸。',
      activity: '实际观察原城墙图，用自己的文字、符号或图形表达并解释。',
    },
    {
      title: '彩色台阶：沿同一方向寻找重复组',
      text: '观察原彩色台阶图，先选从下往上或从上往下，再沿这个方向描述可见色带。上端可能显示不完整组，不能强行补成照片已有；自己的符号先定义，若只能确认一部分就把范围写清。网页不代填整幅照片唯一颜色串。',
      activity: '实际观察台阶图，明确方向并表达可见规律。',
    },
    {
      title: '花纹织物：花纹和条带可以各观察',
      text: '观察原织物图，可看反复的花纹，也可看条带。选定一种观察标准后用自己的方式表示，并指出与图中哪些位置对应。不同合理标准可以产生不同表达，不以完全相同一句话或符号作为唯一答案。',
      activity: '实际观察织物图，表达并解释选定的重复结构。',
    },
    {
      title: '合作故事：先商量真实分工',
      text: '与实际在场同伴或家人商量一个数学故事：写清开始数量、发生的增加或减少、最后数量和单位。可轮流讲、画、核对；只有自己练习时可以记录独立草稿，合作活动仍待做，不虚构同伴评价。',
      activity: '实际与同伴或家人商量故事和分工。',
    },
    {
      title: '先讲明白，再按顺序画连环画',
      text: '本站示例：架上12本书，又放上3本，最后15本，12+3=15。三段对应开始、变化、结果；这只是原创示例，自己的生活故事可以不同。真实把故事讲给合作的人听，再依次画格子，每幅的数量与讲述对应，保留实际作品。',
      activity: '实际合作讲述并画出自己的数学连环画。',
    },
    {
      title: '交流核对，实际反馈与计划分开',
      text: '把真实完成的连环画向合作的人展示，核对数量、变化、单位和顺序，记录实际收到的反馈。暂未交流就写待做，不把选择了正确算式当已经合作。最后另写下一步计划，开放记录不自动打对错或替同伴评分。',
      activity: '实际展示交流并记录反馈，再单独写计划。',
    },
  ],
  questions: [
    ...continuations('main'),
    q(
      'faces-unit',
      '表情图最小完整重复组含几个表情？',
      { kind: 'number', value: 3 },
      '笑、笑、伤心共3个，不是一笑一伤心交替。',
      visual('faces'),
    ),
    q(
      'cups-unit',
      '杯子把手方向最小完整重复组含几个杯子？',
      { kind: 'number', value: 2 },
      '右、左共2个。',
      visual('cups'),
    ),
    q(
      'divisions-unit',
      '内部线方向最小完整重复组含几个图？',
      { kind: 'number', value: 2 },
      '横、竖共2个。',
      visual('divisions'),
    ),
    q(
      'site-zero',
      '本站图中续画A、B、C仍空白，已经画好续画图的空位有几个？',
      { kind: 'number', value: 0 },
      '三个续画格均未画好，0与未填写不同；网站不替你完成纸面作画。',
      visual('faces'),
    ),
    choice(
      'expression',
      '两人对同一织物选了不同合理重复结构，怎样核对？',
      'clear',
      [
        ['clear', '各说明观察标准、符号和图中对应位置'],
        ['other', '只有完全相同一句话才能正确'],
      ],
      '开放表达允许合理不同方式，仍须与观察结构对应。',
    ),
    choice(
      'cooperation',
      '只在网站选对续画，尚未找同伴讲画故事，应怎样记录？',
      'clear',
      [
        ['clear', '网页题已做，实际合作待做'],
        ['other', '自动确认已经合作画好连环画'],
      ],
      '网页识别和合作实作是不同任务。',
    ),
    choice(
      'story-order',
      '本站架上12本书又放3本的故事，哪种三格顺序对应变化？',
      'clear',
      [
        ['clear', '原来12本→放上3本→共有15本'],
        ['other', '共有15本→原来12本→放上3本'],
      ],
      '三格按事件发生的顺序；12+3=15，单位保持本。这不替代自主故事创作。',
    ),
    actual(
      'actual-recall-comic',
      '实际拿出或重新制作数学连环画，说明其中的数学信息。',
    ),
    actual(
      'actual-recall-repeat',
      '实际用两种方式表示一组重复规律，并解释符号对应。',
    ),
    actual(
      'actual-recall-design',
      '实际回顾或重新设计规律图案，指出完整重复组。',
    ),
    actual('actual-draw-faces', '在纸上实际续画表情A、B、C，逐个核对。'),
    actual('actual-draw-cups', '在纸上实际续画杯子A、B、C，核对把手方向。'),
    actual('actual-draw-divisions', '在纸上实际续画分线图A、B、C，核对横竖。'),
    actual('actual-wall', '实际观察原城墙图，用自己的方式表达并解释可见规律。'),
    actual('actual-stairs', '实际观察原台阶图，说明观察方向并表达可见规律。'),
    actual('actual-fabric', '实际观察原织物图，表达选定的花纹或条带规律。'),
    actual('actual-cooperate-plan', '实际与同伴或家人商量数学故事和分工。'),
    actual(
      'actual-cooperate-tell',
      '实际把自己的数学故事讲给合作的人听并核对数量。',
    ),
    actual(
      'actual-cooperate-draw',
      '实际合作画出数学连环画，按事件顺序安排各格。',
    ),
    actual(
      'actual-cooperate-show',
      '实际向合作的人展示交流，核对顺序、数量和单位。',
    ),
    record(
      'recall-record',
      '记录实际旧作品或新作的数学信息、重复表达和图案方法；未做之处如实待做。',
    ),
    record('wall-record', '记录城墙的观察范围、重复结构和自己的符号含义。'),
    record('stairs-record', '记录台阶观察方向、可见重复组和未核清位置。'),
    record('fabric-record', '记录织物选择的观察标准和图中对应位置。'),
    record(
      'story-record',
      '记录真实合作人、分工、故事数量变化、作品和实际反馈；无合作条件如实说明。',
    ),
    record(
      'future-plan',
      '另写下一步想完善哪项作品或待做活动；这不是已经完成的记录。',
    ),
  ],
  reviewQuestions: [
    ...continuations('review'),
    choice(
      'review-cooperation',
      '新情境：已独立画草稿，但暂未与家人讨论，怎样记？',
      'clear',
      [
        ['clear', '独立草稿已做，合作讨论仍待做'],
        ['other', '用独立草稿替代合作确认'],
      ],
      '新情境区分独立练习与真实合作，不抹去已做的草稿，也不虚构讨论。',
    ),
  ],
};
export const bnuLowerFinalPracticeMapping = [
  {
    page: 95,
    sourceActivity: 'recall-comic-patterns-and-design',
    steps: [1, 5],
    objective: [],
    manual: [
      'actual-recall-comic',
      'actual-recall-repeat',
      'actual-recall-design',
    ],
    records: ['recall-record'],
  },
  {
    page: 95,
    sourceActivity: 'continue-three-drawing-patterns',
    steps: [2, 3, 4],
    objective: [
      'faces-1',
      'faces-2',
      'faces-3',
      'cups-1',
      'cups-2',
      'cups-3',
      'divisions-1',
      'divisions-2',
      'divisions-3',
      'faces-unit',
      'cups-unit',
      'divisions-unit',
      'site-zero',
    ],
    manual: ['actual-draw-faces', 'actual-draw-cups', 'actual-draw-divisions'],
    records: [],
  },
  {
    page: 95,
    sourceActivity: 'express-three-life-patterns-in-own-way',
    steps: [6, 7, 8],
    objective: ['expression'],
    manual: ['actual-wall', 'actual-stairs', 'actual-fabric'],
    records: ['wall-record', 'stairs-record', 'fabric-record'],
  },
  {
    page: 95,
    sourceActivity: 'actual-cooperative-math-story-and-comic',
    steps: [9, 10, 11],
    objective: ['cooperation', 'story-order'],
    manual: [
      'actual-cooperate-plan',
      'actual-cooperate-tell',
      'actual-cooperate-draw',
      'actual-cooperate-show',
    ],
    records: ['story-record', 'future-plan'],
  },
].map((m) => ({ ...m, lesson: id }));
