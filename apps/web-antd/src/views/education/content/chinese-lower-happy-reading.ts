import type { Lesson, Question } from '../learning/types';
export const lowerHappyReadingPageAudit = {
  itemId: 'u1-6',
  pages: [15],
  recognize: '',
  write: '',
  reciteRequired: false,
  readings: [
    { title: '摇摇船', sourceKind: '传统童谣', author: null },
    { title: '小刺猬理发', sourceKind: '儿歌', author: '鲁兵' },
  ],
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
const id = 'cl-u1-6';
type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  explanation: string;
  material: string;
};
const pairs: Pair[] = [
  {
    key: 'traditional',
    prompts: [
      '第15页哪种来源标在摇摇船下方？',
      '换方向：哪篇对应传统童谣脚注？',
    ],
    values: ['传统童谣', '摇摇船'],
    labels: ['传统童谣', '摇摇船', '鲁兵'],
    explanation: '传统来源没有个人作者署名，不补造姓名。',
    material:
      '先与家长共读原书印刷第15页，再按指定标题找信息。原文、原画与声音在外部原书，缺书可以暂时跳过。',
  },
  {
    key: 'author',
    prompts: ['小刺猬理发脚注作者是谁？', '换方向：鲁兵署名对应哪篇？'],
    values: ['鲁兵', '小刺猬理发'],
    labels: ['鲁兵', '小刺猬理发', '摇摇船'],
    explanation: '作者与童谣类型分开，不把传统当个人署名。',
    material:
      '先与家长共读原书印刷第15页，再按指定标题找信息。原文、原画与声音在外部原书，缺书可以暂时跳过。',
  },
  {
    key: 'destination',
    prompts: ['按摇摇船，摇到哪个地方？', '按摇摇船，外婆对我的称呼是什么？'],
    values: ['外婆桥', '好宝宝'],
    labels: ['外婆桥', '好宝宝', '学校'],
    explanation: '按童谣叙述找信息，不当学习者真实家庭或出行安排。',
    material:
      '先与家长共读原书印刷第15页，再按指定标题找信息。原文、原画与声音在外部原书，缺书可以暂时跳过。',
  },
  {
    key: 'food',
    prompts: [
      '按摇摇船，糖一包后面与果相关的词是什么？',
      '换一个信息：果一包之前与糖相关的词是什么？',
    ],
    values: ['果一包', '糖一包'],
    labels: ['果一包', '糖一包', '只有面条'],
    explanation: '只找童谣原词，不要求吃糖或提供真实家庭资料。',
    material:
      '先与家长共读原书印刷第15页，再按指定标题找信息。原文、原画与声音在外部原书，缺书可以暂时跳过。',
  },
  {
    key: 'character',
    prompts: [
      '按小刺猬理发，开头去理发的形象是谁？',
      '按结尾，变换后的形象是什么？',
    ],
    values: ['小刺猬', '小娃娃'],
    labels: ['小刺猬', '小娃娃', '真实理发记录'],
    explanation:
      '儿歌是想象与形象变化，不推断刺猬现实变成人，也不实际给动物理发。',
    material:
      '先与家长共读原书印刷第15页，再按指定标题找信息。原文、原画与声音在外部原书，缺书可以暂时跳过。',
  },
  {
    key: 'sound',
    prompts: [
      '按小刺猬理发，哪项是理发声音的拟声词？',
      '换一个信息：这里的嚓嚓嚓与哪个动作联系？',
    ],
    values: ['嚓嚓嚓', '理发'],
    labels: ['嚓嚓嚓', '理发', '赶牛'],
    explanation: '拟声和节奏用于儿歌表达，不当真实录音或学生操作剪刀指令。',
    material:
      '先与家长共读原书印刷第15页，再按指定标题找信息。原文、原画与声音在外部原书，缺书可以暂时跳过。',
  },
  {
    key: 'rhythm',
    prompts: ['按本站原创节奏卡，第1行重复哪个词？', '换行：第2行重复哪个词？'],
    values: ['轻轻', '慢慢'],
    labels: ['轻轻', '慢慢', '天天'],
    explanation: '只按原创卡观察词语重复，不当原教材台词或实际声音评测。',
    material:
      '本站原创节奏卡：第1行“轻轻，轻轻，说一句”；第2行“慢慢，慢慢，读一段”。这不是教材儿歌原文。',
  },
  {
    key: 'reading-state',
    prompts: ['按原创阅读卡，哪项已经发生？', '换条件：哪项仍是明天计划？'],
    values: ['今天读了一段', '明天想再读一段'],
    labels: ['今天读了一段', '明天想再读一段', '计划等于已经读完'],
    explanation:
      '按卡中时态分清实际阅读和未来计划，选择卡信息不自动增加学习者真实阅读记录。',
    material:
      '本站原创虚构阅读卡：小禾今天实际读了一段，明天想再读一段。此卡不是学生真实记录。',
  },
  {
    key: 'roles',
    prompts: ['原创分享卡第一轮，谁在说？', '换方向：第一轮谁在听？'],
    values: ['小禾', '小安'],
    labels: ['小禾', '小安', '每次都必须小禾说'],
    explanation: '按指定轮次比较角色，第二轮可交换，不固定真实身份或喜好。',
    material:
      '本站原创虚构分享卡：第一轮小禾说自己喜欢重复词，小安听后回应；第二轮两人交换。',
  },
  {
    key: 'roles-next',
    prompts: ['原创分享卡第二轮，谁在说？', '第二轮谁在听？'],
    values: ['小安', '小禾'],
    labels: ['小安', '小禾', '角色永远不能换'],
    explanation: '交换说与听，合理真实分享表达没有唯一答案，不强制录音。',
    material:
      '本站原创虚构分享卡：第一轮小禾说、小安听；第二轮小安说、小禾听。',
  },
  {
    key: 'more-reading',
    prompts: [
      '原页标题读读童谣和儿歌，包含哪两类阅读材料？',
      '本站原创安排中，哪项是实际阅读动作？',
    ],
    values: ['童谣和儿歌', '打开选好的书读一段'],
    labels: ['童谣和儿歌', '打开选好的书读一段', '只写明天计划就算读完'],
    explanation:
      '按标题观察阅读类别，自主选书和实际阅读分开，无书可跳过，不强制购买。',
    material:
      '先看原页标题；本站原创安排区分打开书实际阅读与写下一次阅读计划。',
  },
  {
    key: 'method',
    prompts: [
      '本站原创练习安排里，先遇到不熟悉的一行可以怎么做？',
      '换任务：完成一段后可以怎样交流？',
    ],
    values: ['请家长示范后慢读', '说一个自己喜欢的地方'],
    labels: [
      '请家长示范后慢读',
      '说一个自己喜欢的地方',
      '必须一次读快才算完成',
    ],
    explanation:
      '本题比较指定原创安排，不对所有阅读方法唯一判分；可以自己选择合适节奏。',
    material:
      '本站原创练习安排：不熟悉的一行先请家长示范并慢读；读完一段后说一个自己喜欢的地方。',
  },
];
const actual: [string, string][] = [
  ['left', '实际与家长共读第15页摇摇船。'],
  ['right', '实际与家长共读第15页鲁兵小刺猬理发。'],
  ['info', '实际说一处童谣信息或儿歌形象变化，不当真实家庭或动物操作。'],
  ['rhythm', '实际听示范后尝试一段童谣儿歌节奏，按自己的情况慢读。'],
  [
    'accumulation',
    '实际交流或尝试一首已熟悉的童谣，可回看；没有材料可跳过，不强制背固定篇目。',
  ],
  ['choose', '实际从已有合法读物选一段童谣儿歌，不强制购买。'],
  ['read-more', '实际阅读刚选的那一段；只选书或写计划不能确认此项。'],
  ['share', '实际分享一个喜欢的词、节奏或形象，并说自己的理由。'],
  ['listen', '实际听家长分享，回应一处后交换角色。'],
];
const objective = (review: boolean): Question[] =>
  pairs.map((p) => ({
    id: `${id}-${review ? 'r' : 'q'}-${p.key}`,
    knowledge: `${id}-${p.key}`,
    prompt: p.prompts[review ? 1 : 0],
    material: p.material,
    choices: p.labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value: p.values[review ? 1 : 0] },
    hint: '先共读原书或看明确标注的本站原创卡，再按指定条件找信息。',
    explanation: p.explanation,
  }));
export const lowerHappyReadingLesson: Lesson = {
  id,
  title: '快乐读书吧 · 读读童谣和儿歌',
  textbookTitle: '快乐读书吧 · 读读童谣和儿歌',
  page: 15,
  version: 1,
  status: 'available',
  goal: '实际阅读童谣和儿歌，感受节奏、交流积累、再选一段阅读并分享；没有新增认写要求。',
  prerequisite: '准备原书第15页和已有合法读物，可请家长陪读，无材料可跳过。',
  parentTip:
    '摇摇船是传统童谣，小刺猬理发署鲁兵；不补造出版元数据或背诵必做要求。现代全文原画声音外部共读，本站卡与活动组织原创；实际阅读与计划分开，人工确认不自动判声音，反思null。',
  steps: [
    {
      title: '先看原书阅读主题',
      text: '第15页快乐读书吧主题为读读童谣和儿歌。没有新增会认会写清单，不按故事字词补造必须认写要求。现代全文原画与录音外部共读，未知ISBN版印次不补造。',
      activity: '与家长准备原书第15页。',
    },
    {
      title: '两篇来源分别认',
      text: '摇摇船原页注明传统童谣、未署个人作者；小刺猬理发署鲁兵，不补造改动或其他作者。原页两篇不是所有童谣儿歌的固定清单，可以再读合适读物。',
      activity: '分别指标题与脚注，看阅读材料来源。',
    },
    {
      title: '读摇摇船',
      text: '先与家长读原书，再找外婆桥、称呼与食品词。童谣叙述不当真实家庭或实际摇船活动，不需要录入外婆姓名或住址。',
      activity: '实际共读摇摇船，挑一处信息说一说。',
    },
    {
      title: '读小刺猬理发',
      text: '先读鲁兵儿歌，看开头与结尾的形象变化以及嚓嚓嚓的声音表达。拟人和想象不当刺猬真实变成人，也不要求给动物剪毛。',
      activity: '实际共读小刺猬理发，说一个形象或声音发现。',
    },
    {
      title: '试节奏与慢读',
      text: '按原页建议感受童谣儿歌的节奏。先听合法示范再慢读，可以重复或停顿；本站原创卡“轻轻，轻轻，说一句；慢慢，慢慢，读一段”只用于重复词练习，不冒充教材原文。',
      activity: '实际尝试一段节奏，家长听过程，不自动评声音。',
    },
    {
      title: '交流已有积累',
      text: '原页小朋友说自己还会背其他童谣，这不等于学习者已经会背。可尝试说一首已熟悉的童谣或回看原书；不强制背诵固定全文，不补造必须读的书名。',
      activity: '实际尝试交流一首已熟悉的童谣，没有材料可跳过。',
    },
    {
      title: '自己再选一段读',
      text: '可从已有合法读物选一段童谣儿歌，先看标题，再实际阅读。选好书不等于读过，写下一次计划不算本次完成，不强制购买或上传书页。',
      activity: '实际选一段合适材料并尝试阅读。',
    },
    {
      title: '轮流说与听',
      text: '分享自己喜欢的词、节奏或形象，用自己的话说理由；家长可帮助。听完回应一处，再交换角色，合理偏好和表达可以不同，不强迫持续对视或录音。',
      activity: '各说一次、听一次并作回应。',
    },
    {
      title: '记录本次发现与计划',
      text: '记录本次真正读了什么或发现什么，不要求真实个人身份。另写下一次想读什么，明确是计划；家长代写也可，反思不唯一判分。',
      activity: '保留实际发现和下次计划。',
    },
  ],
  questions: [
    ...objective(false),
    ...actual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-manual-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际尝试后确认，缺材料可暂时跳过。',
      explanation:
        '人工确认只记录实际完成，不自动评发音、偏好或掌握程度；计划不是完成。',
    })),
    ...[
      '记录本次实际阅读或一个发现。',
      '记录下一次想读什么，明确这是计划。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflect-${i}`,
      knowledge: `${id}-reflect-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '自己的话，家长可代写。',
      explanation: '保存原话、正确性null，未来计划不当已完成。',
    })),
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '下册原书第15页阅读活动范围校验',
    notes:
      '实际查看第三方原书公开预览https://keben.app/book/0026印刷15页：传统摇摇船与鲁兵小刺猬理发，节奏、已有积累、自主再读与分享分别覆盖。不新增认写或强制背诵，无材料可跳过，实际任务人工确认、反思null、计划不当完成。现代全文原画声音外部共读，未知ISBN版印次不补造；单课开放不证明全年和教师最终审校。',
  },
};
