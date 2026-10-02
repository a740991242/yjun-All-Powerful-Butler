import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const fourSeasonsPageAudit = {
  itemId: 'u5-4',
  title: '四季',
  pages: [66, 67],
  recognize: '鸟说是春青蛙夏着皮就冬',
  write: '四小鸟是天',
  familiarCharacter: '地',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  author: '薛卫民',
  adapted: true,
  activities: [
    '朗读课文',
    '选喜欢的季节仿照课文说',
    '认读十一字',
    '熟字地在此读de',
    '规范书写五字',
  ],
};
const id = 'cu-u5-4';
const reading =
  '先与家长共读教材印刷第66—67页《四季》，再回看指定信息。原书作者薛卫民，选作课文时有改动。本站不提供现代作品全文、原画或录音；缺原书可跳过，不凭题目猜答案。植物与雪人的话是拟人，所写景象不表示所有地区在同一季节都有相同物候。';
const characters = [
  ['鸟', '小鸟中的第二个字。', '飞鸟中的第二个字。'],
  ['说', '说话中的第一个字。', '听说中的第二个字。'],
  ['是', '我是中的第二个字。', '就是中的第二个字。'],
  ['春', '春天中的第一个字。', '春风中的第一个字。'],
  ['青', '青蛙中的第一个字。', '青草中的第一个字。'],
  ['蛙', '青蛙中的第二个字。', '蛙声中的第一个字。'],
  ['夏', '夏天中的第一个字。', '夏日中的第一个字。'],
  ['着', '躬着身中的第二个字。', '看着中的第二个字。'],
  ['皮', '顽皮中的第二个字。', '皮球中的第一个字。'],
  ['就', '就是中的第一个字。', '就来中的第一个字。'],
  ['冬', '冬天中的第一个字。', '冬日中的第一个字。'],
];
export const seasonalScenes = [
  ['草芽', '春天'],
  ['荷叶', '夏天'],
  ['谷穗', '秋天'],
  ['雪人', '冬天'],
] as const;
export const seasonalShapes = [
  ['草芽', '尖尖'],
  ['荷叶', '圆圆'],
  ['谷穗', '弯弯'],
] as const;
type Pair = {
  key: string;
  prompts: [string, string];
  labels: string[];
  values: [string, string];
  materials?: [string, string];
  explanation: string;
};
const pairs: Pair[] = [
  {
    key: 'snow-person',
    prompts: [
      '按课文，雪人说话的样子用哪个词写？',
      '换看课文，谁顽皮地说自己是冬天？',
    ],
    labels: ['顽皮', '雪人', '真的会说话的植物'],
    values: ['顽皮', '雪人'],
    materials: [reading, reading],
    explanation:
      '雪人说话是诗中的拟人，顽皮是表现样子的用语，不能当现实雪人实际会说话。',
  },
  {
    key: 'listeners',
    prompts: ['按课文，草芽对谁说话？', '换看课文，荷叶对谁说话？'],
    labels: ['小鸟', '青蛙', '天空'],
    values: ['小鸟', '青蛙'],
    materials: [reading, reading],
    explanation: '按诗中不同段落分别找听话对象，不把上一个对象搬到新的段落。',
  },
  {
    key: 'sound-familiar',
    prompts: [
      '课文顽皮地说里的地，本页蓝色熟字注音是哪项？',
      '课文躬着身里的着，本页注音是哪项？',
    ],
    labels: ['de', 'zhe', 'dì'],
    values: ['de', 'zhe'],
    materials: [
      '顽皮地说：对照第67页蓝色熟字注音。',
      '躬着身：对照第66—67页注音。',
    ],
    explanation:
      '地在这里读轻声de，着在这里读轻声zhe；地是熟字在新语境的应用，不增加本课会认会写清单。轻声不当第一声。',
  },
  {
    key: 'sound-speech',
    prompts: [
      '课文说话的说，对照注音是哪项？',
      '课文我是的是，对照注音是哪项？',
    ],
    labels: ['shuō', 'shì', 'shí'],
    values: ['shuō', 'shì'],
    materials: ['说：对照本课认字注音。', '是：对照本课认字注音。'],
    explanation:
      '本课说读shuō、是读shì，实际声音听标准示范；字形选择不自动评发音。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '本课写四小鸟是天。只比较四与春，哪项在本课会写清单？',
      '换看本课会写清单，只比较小与夏，哪项在本课会写清单？',
    ],
    labels: ['四', '春', '小', '夏'],
    values: ['四', '小'],
    materials: ['本题只比较四 / 春。', '本题只比较小 / 夏。'],
    explanation:
      '四小在会写清单，春夏在本课仅会认；看指定一对，不自行扩大范围。',
  },
  {
    key: 'author',
    prompts: ['第66页作者脚注署名是谁？', '第66页脚注说明选作课文时怎样处理？'],
    labels: ['薛卫民', '有改动', '程宏明'],
    values: ['薛卫民', '有改动'],
    materials: ['对照原书第66页脚注。', '对照原书第66页选作课文脚注。'],
    explanation: '原书明确薛卫民与有改动，不能把上一课程宏明的署名移来。',
  },
  {
    key: 'order',
    prompts: [
      '按课文春、夏、秋、冬顺序，春之后写哪个季节？',
      '换看课文顺序，秋之后写哪个季节？',
    ],
    labels: ['春天', '夏天', '秋天', '冬天'],
    values: ['夏天', '冬天'],
    materials: [reading, reading],
    explanation: '本题按课文四段顺序查找，个人最喜欢哪个季节另作开放表达。',
  },
];
function choice(
  key: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  review: boolean,
  material?: string,
): Question {
  return {
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先共读原书，再回看指定段落或字；喜欢哪个季节没有固定正确答案。',
    explanation,
  };
}
function objective(review: boolean): Question[] {
  const index = review ? 1 : 0;
  return [
    ...characters.map((row, n) =>
      choice(
        `char-${n}`,
        required(row[index + 1]),
        characters.map((r) => required(r[0])),
        required(row[0]),
        `这里认${row[0]}；本课写四小鸟是天，地为熟字用法，认写范围分别看。`,
        review,
      ),
    ),
    ...seasonalScenes.map(([scene, season], n) =>
      choice(
        `season-${n}`,
        review
          ? `按课文，哪种景物对应${season}？`
          : `按课文，${scene}说自己代表哪个季节？`,
        seasonalScenes.map((r) => r[review ? 0 : 1]),
        review ? scene : season,
        `本课用${scene}联系${season}，是诗歌情境，不要求所有地方物候相同。`,
        review,
        reading,
      ),
    ),
    ...seasonalShapes.map(([scene, shape], n) =>
      choice(
        `shape-${n}`,
        review
          ? `按课文，${shape}描写哪种景物？`
          : `按课文，${scene}用哪个叠词写形状？`,
        seasonalShapes.map((r) => r[review ? 0 : 1]),
        review ? scene : shape,
        `本课${scene}与${shape}对应，按原书找信息；自己的合理描述不强求只用这一词。`,
        review,
        reading,
      ),
    ),
    ...pairs.map((q) =>
      choice(
        q.key,
        q.prompts[index],
        q.labels,
        q.values[index],
        q.explanation,
        review,
        q.materials?.[index],
      ),
    ),
  ];
}
function manual(key: string, prompt: string, material?: string): Question {
  return {
    id: `${id}-manual-${key}`,
    knowledge: `${id}-manual-${key}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '实际尝试后由家长确认；缺原书、规范示范或纸笔可跳过。',
    explanation: '只记录真实尝试，不自动评声音、笔顺或表达，不把计划当完成。',
  };
}
export const fourSeasonsLesson: Lesson = {
  id,
  title: '四季',
  textbookTitle: '四季',
  page: 66,
  version: 1,
  status: 'available',
  goal: '朗读四季，认十一字写四小鸟是天；联系景物与季节、形状和拟人，选择喜欢的季节仿照课文说。',
  prerequisite:
    '已尝试拼音和简单阅读，可请家长陪读；准备第66—67页原书与田字格纸。',
  parentTip:
    '依据第三方原书公开预览实读66—67页，ISBN版印次未知，教师最终审校待完成。原书作者薛卫民，课文有改动；现代全文原画录音外部查看。本课课后仅要求朗读和喜欢的季节仿说，不移植前课背诵要求；蓝色地为熟字新用法，不自动加入本课会认会写。',
  steps: [
    {
      title: '先共读四季',
      text: `${reading}先听家长借助拼音示范，按原书四段看看各写什么。第67页要求朗读及选喜欢的季节仿说，本课不增加强制背诵任务。`,
      activity: '准备原书实际共读；资料未准备好可以暂时跳过，稍后再读。',
    },
    {
      title: '认十一字，另看熟字地',
      text: '认鸟、说、是、春、青、蛙、夏、着、皮、就、冬，放回小鸟、青蛙、春天、夏天、顽皮、就是、冬天等词语。第67页蓝色地在顽皮地说中读轻声de，是已学字的新语境；躬着身的着读轻声zhe。两处都不当第一声，不把地增为本课新会认会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity:
        '打乱十一字顺序分别指读；再参考原书注音尝试读顽皮地说与躬着身。',
    },
    {
      title: '四段景物与季节',
      text: '按原书四段，分别找草芽与春天、荷叶与夏天、谷穗与秋天、雪人与冬天的联系。可以用四张景物词卡和四张季节词卡配对，再回看依据；课文顺序春夏秋冬与个人最喜欢哪个季节是两件事。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['春', '夏', '秋', '冬'],
      },
      activity:
        '用纸卡实际配四组景物与季节，并说明一处诗句依据；不把答题正确当已经摆卡。',
    },
    {
      title: '看形状，再看对谁说',
      text: '回看草芽尖尖、荷叶圆圆、谷穗弯弯等形状词，比较叠词怎样描述景物；草芽对小鸟说，荷叶对青蛙说。形状、说话景物与听话对象分别找，不把一个段落的信息搬到另一个。自己的景物描述允许用其他合理词语。',
      activity:
        '实际指读一组形状词，再对家长说它描写哪个景物；也可说自己的合理描述。',
    },
    {
      title: '拟人的有趣表达',
      text: '植物和雪人像人一样说话，是诗歌的拟人表达。雪人顽皮的样子让冬天显得有趣，不能理解成现实雪人真的能说话。所写季节景象与各地天气、植物情况可能不同，喜欢不下雪的冬天也可以，不必编造当地有雪。',
      activity:
        '与家长交流一个觉得有趣的表达，说清这是诗中想象还是自己的观察。',
    },
    {
      title: '选择喜欢的季节仿说',
      text: '先选自己喜欢的季节，再想一个相关景物及它的样子，参考原书表达方式试着说。可以按景物、样子、想对谁说什么来组织句子。本站原创启发例：风筝高高，它对春风说：“我来迎接春天。”例子不是教材原文，也没有唯一正确答案；可以换自己的景物，不要求逐字复制或模仿不适合的动作。',
      activity:
        '实际向家长说一两句，听对方回应，再按自己想法调整；说过才确认表达，计划以后说不算完成。',
    },
    {
      title: '按规范示范写五字',
      text: '本课会写四、小、鸟、是、天。对照第67页逐笔与田字格示范，看框内笔画、点画和各笔位置，不把春夏冬等会认字加入会写。普通网页字体只供认字，不能代替规范笔顺或描红。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['四', '小', '鸟', '是', '天'],
      },
      activity:
        '在田字格纸分别尝试写五字，请家长查看真实字形、笔顺和位置；缺示范或纸笔可跳过。',
    },
    {
      title: '朗读后记录自己的发现',
      text: '按第67页要求实际朗读课文，再交流喜欢的季节和仿说发现。朗读由家长确认，不因选对季节题自动完成；本课不把背诵列为必做。反思保留自己原话，未来计划不记成已完成，不需要姓名、照片或地点身份信息。',
      activity:
        '完成实际朗读或交流后再确认；还想练什么可以记录，家长可以代写。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱十一字顺序指读鸟说是春青蛙夏着皮就冬，再看蓝色地在本课中的读音；不扩大会认会写清单。',
    ),
    manual(
      'read',
      '与家长实际朗读第66—67页四季，注意四段景物与语境；家长确认尝试，本课不加背诵必做任务。',
      reading,
    ),
    manual(
      'cards',
      '用纸卡实际配草芽/荷叶/谷穗/雪人与春夏秋冬，回看原书说依据；不要求所有地方景象相同。',
      reading,
    ),
    manual(
      'shape',
      '回看原书，实际指读尖尖、圆圆、弯弯各描写什么，再向家长说一组联系或自己的合理描述。',
      reading,
    ),
    manual(
      'imitate',
      '选择自己喜欢的季节和一个景物，参考课文表达方式实际向家长仿说一两句，再听回应；答案开放。',
    ),
    manual(
      'write',
      '按第67页规范示范，用田字格纸实际尝试写四小鸟是天；家长查看字形、笔顺与位置。',
    ),
    manual(
      'talk',
      '与家长实际交流一种季节观察或课文有趣的拟人，分清现实观察与诗中想象；只确认交流。',
    ),
    {
      id: `${id}-reflect-season`,
      knowledge: `${id}-reflect-season`,
      prompt:
        '记录喜欢的季节、一个景物和自己试说的话；也可明确记录下次想试的计划。',
      rule: { kind: 'reflection' },
      hint: '没有固定最喜欢的季节，不需照示例复制。',
      explanation: '保留原话，正确性为null，不把未来仿说计划算实际完成。',
    },
    {
      id: `${id}-reflect-practice`,
      knowledge: `${id}-reflect-practice`,
      prompt: '记录一个还想练的字、朗读或表达问题。',
      rule: { kind: 'reflection' },
      hint: '可以请家长代写，用自己的话即可。',
      explanation: '开放记录不自动评分，不自动认定已经掌握。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读第三方公开预览66—67页，薛卫民改选、十一会认/五会写与熟字地读de、四段情境、朗读和喜欢季节仿说按原页核对；不增加背诵必做。未知ISBN版印次不补造，现代全文原画录音外部共读。拟人不当实际说话，物候不推广各地；实际活动人工确认、反思null，教师最终审校及全年完成仍待逐项验收。',
  },
};
