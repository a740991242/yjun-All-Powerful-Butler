import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const gardenSixPageAudit = {
  itemId: 'u6-5',
  title: '语文园地六',
  pages: [80, 81, 82, 83],
  recognize: '老师工厂医院生门卫',
  write: '工厂门卫',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  poem: '古朗月行（节选）',
  poet: '李白',
  dynasty: '唐',
  story: '小松鼠找花生',
  storyAuthorPrinted: '稽鸿',
  adapted: true,
  activities: [
    '职业与工作地点',
    '八个词语读音',
    '木旁草字头观察',
    '生活识字交流',
    '看图写词语并说话',
    '规范写四字',
    '复用四字笔顺',
    '古诗积累',
    '亲子共读与结尾讨论',
  ],
};
const id = 'cu-u6-5';
const poem = '小时不识月，呼作白玉盘。\n又疑瑶台镜，飞在青云端。';
const reading =
  '先与家长共读教材印刷第83页《小松鼠找花生》，再回看指定信息。原书脚注署稽鸿，并注明选作课文时有改动；这里只转录原页署名，不据搜索摘要改名。本站不提供现代作品全文、原画或录音。缺原书可跳过。结尾是小松鼠的疑问，不把孩子猜想或自编续讲补成原文答案。';
const characters = [
  ['老', '老师中的第一个字。', '老人中的第一个字。'],
  ['师', '老师中的第二个字。', '师生中的第一个字。'],
  ['工', '工厂中的第一个字。', '工人中的第一个字。'],
  ['厂', '工厂中的第二个字。', '厂房中的第一个字。'],
  ['医', '医院中的第一个字。', '医生中的第一个字。'],
  ['院', '医院中的第二个字。', '院子中的第一个字。'],
  ['生', '医生中的第二个字。', '学生中的第二个字。'],
  ['门', '门卫中的第一个字。', '大门中的第二个字。'],
  ['卫', '门卫中的第二个字。', '护卫中的第二个字。'],
];
export const gardenSixJobs = [
  ['学校', '老师'],
  ['工厂', '工人'],
  ['医院', '医生'],
  ['传达室', '门卫'],
] as const;
const soundPairs = [
  ['你们', 'nǐ', '家里', 'lǐ'],
  ['男生', 'nán', '蓝色', 'lán'],
  ['上山', 'shān', '三年', 'sān'],
  ['写字', 'xiě', '报纸', 'zhǐ'],
] as const;
type Pair = {
  key: string;
  prompts: [string, string];
  labels: string[];
  values: [string, string];
  explanation: string;
  materials?: [string, string];
};
const pictureCard =
  '本站原创文字情境：天空有白云，小鸟在飞。它不是教材原图，不代替第81页实际看图写词说话。';
const pairs: Pair[] = [
  {
    key: 'component-wood',
    prompts: [
      '第81页树林桃桥这一组，常见的共同部件是什么？',
      '换看第81页花草莲菜这一组，常见的共同部件是什么？',
    ],
    labels: ['木字旁', '草字头', '口字旁'],
    values: ['木字旁', '草字头'],
    explanation:
      '分别看指定组，偏旁常提示与树木或植物有关，但不是所有字义都能只靠偏旁猜出。桥字的联系可请教师解释，不直接套所有现代桥材料。',
  },
  {
    key: 'component-example',
    prompts: ['只比较桃与花，哪项有木字旁？', '只比较莲与桥，哪项有草字头？'],
    labels: ['桃', '花', '莲', '桥'],
    values: ['桃', '莲'],
    explanation: '按指定一对看部件，活动字不自动加入本园地新增会认会写。',
  },
  {
    key: 'sign-cinema',
    prompts: [
      '按第81页招牌词，只比较电影院与银行，哪项是看电影的场所名称？',
      '换看第81页招牌词，只比较生活超市与银行，哪项是生活用品商店名称？',
    ],
    labels: ['电影院', '银行', '生活超市'],
    values: ['电影院', '生活超市'],
    explanation: '按指定词语认识场所，不要求单独去商店或记录真实地址。',
  },
  {
    key: 'sign-character',
    prompts: [
      '电影院这个词的第一个字是什么？',
      '生活超市这个词的最后一个字是什么？',
    ],
    labels: ['电', '院', '市', '生'],
    values: ['电', '市'],
    explanation: '在生活招牌词中找字，不把所有遇见字增加新增认写数。',
  },
  {
    key: 'picture-word',
    prompts: [
      '按原创情境，只比较白云与小鸟，哪个是动物词？',
      '按原创情境，只比较白云与小鸟，哪个写天空景象？',
    ],
    labels: ['白云', '小鸟'],
    values: ['小鸟', '白云'],
    explanation:
      '这里只按给出的原创文字找信息；第81页看图写词另由家长按真实图和孩子合理答案确认。',
    materials: [pictureCard, pictureCard],
  },
  {
    key: 'picture-sentence',
    prompts: ['按原创情境，哪句写鸟的动作？', '按原创情境，哪句写天空景象？'],
    labels: ['小鸟在飞', '天空有白云', '小鸟在石头里面'],
    values: ['小鸟在飞', '天空有白云'],
    explanation:
      '按明确情境选句，孩子自己看图说话有多种合理说法，不要求照抄这里的句子。',
    materials: [pictureCard, pictureCard],
  },
  {
    key: 'order',
    prompts: [
      '第82页云与男的书写提示是哪项？',
      '第82页叶与竹的书写提示是哪项？',
    ],
    labels: ['从上到下', '从左到右', '随意顺序'],
    values: ['从上到下', '从左到右'],
    explanation:
      '原页两组提示分别对应四个已学字，不是新增会写。网页字形不能代替逐笔规范示范。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '只比较工与云，哪项是本园地新增会写？',
      '只比较门与叶，哪项是本园地新增会写？',
    ],
    labels: ['工', '云', '门', '叶'],
    values: ['工', '门'],
    explanation: '新增会写工厂门卫，云男叶竹是复用笔顺；只比较指定的一对。',
  },
  {
    key: 'poem-author',
    prompts: ['第82页古朗月行节选署名是谁？', '第82页署名朝代是哪项？'],
    labels: ['李白', '唐', '李绅'],
    values: ['李白', '唐'],
    explanation: '原页明确唐李白与节选，不把其他课古诗作者移来。',
  },
  {
    key: 'poem-image',
    prompts: [
      '按节选，小时不识月时把月亮呼作什么？',
      '按节选，又疑月亮是什么？',
    ],
    labels: ['白玉盘', '瑶台镜', '现实真的餐盘'],
    values: ['白玉盘', '瑶台镜'],
    explanation: '白玉盘和瑶台镜是诗中想象与比喻，不是月亮真的餐具或镜子。',
    materials: [poem, poem],
  },
  {
    key: 'poem-place',
    prompts: [
      '按节选，想象中的月亮飞在哪里？',
      '按本页标题，这里是整首还是节选？',
    ],
    labels: ['青云端', '节选', '地下'],
    values: ['青云端', '节选'],
    explanation: '按本页四句与标题查找；节选不当全文，也不当月球科学轨迹。',
    materials: [poem, poem],
  },
  {
    key: 'reading-listener',
    prompts: [
      '按原书，小松鼠问什么花时问谁？',
      '按原书，谁每天到地里看有没有结花生？',
    ],
    labels: ['鼹鼠', '小松鼠', '小鸟'],
    values: ['鼹鼠', '小松鼠'],
    explanation: '按不同人物行动分别找，不把听话对象当提出问题的人。',
    materials: [reading, reading],
  },
  {
    key: 'reading-season',
    prompts: [
      '按原书，鼹鼠说到了哪个季节会结花生？',
      '按原书，小松鼠想留着哪个季节吃？',
    ],
    labels: ['秋天', '冬天', '春天'],
    values: ['秋天', '冬天'],
    explanation:
      '说秋天结果与计划冬天吃是不同信息，不能把计划当已经摘到或吃到。',
    materials: [reading, reading],
  },
  {
    key: 'reading-flower',
    prompts: ['按原书，花的颜色是哪项？', '按原书，花都落光后小松鼠感到怎样？'],
    labels: ['金黄色', '奇怪', '已经找到花生'],
    values: ['金黄色', '奇怪'],
    explanation: '按故事不同位置找颜色与感受；原文没有写已经找到花生。',
    materials: [reading, reading],
  },
  {
    key: 'reading-picture',
    prompts: [
      '只看第83页结尾图示，花生画在哪一部分？',
      '换看本题依据，地下花生的提示来自哪项？',
    ],
    labels: ['植物地下部分', '本页图示', '原文确认别人偷走'],
    values: ['植物地下部分', '本页图示'],
    explanation:
      '图示提示花生在植物地下部分；原文结尾仍是疑问，不能把图示、孩子猜想和已印文字当同一种证据。',
    materials: [reading, reading],
  },
  {
    key: 'reading-ending',
    prompts: [
      '按原书结尾，谁把花生摘走是怎样的信息？',
      '孩子自己编接下来的故事，应当标为什么？',
    ],
    labels: ['小松鼠的疑问', '自己的续讲', '原文已经确认别人偷走'],
    values: ['小松鼠的疑问', '自己的续讲'],
    explanation:
      '结尾疑问不是已经确认的事实。猜想、生活知识解释和自编续讲与印刷原文分开，不用疑问认定别人偷走。',
    materials: [reading, reading],
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
    hint: '看清指定字词或条件，先读原书找依据；自己的表达允许合理不同。',
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
        `本园地认${row[0]}；新增会写工厂门卫，其他活动字不自动扩认写清单。`,
        review,
      ),
    ),
    ...gardenSixJobs.map(([place, person], n) =>
      choice(
        `job-${n}`,
        review
          ? `按第80页词语，${person}与哪一处工作地点成对列出？`
          : `按第80页词语，${place}与哪一种工作人员成对列出？`,
        gardenSixJobs.map((r) => r[review ? 0 : 1]),
        review ? place : person,
        '按教材所列一组找联系，不表示职业只能在这个地方工作，也不按职业评价人的高低或推定性别。',
        review,
      ),
    ),
    ...soundPairs.map(([a, av, b, bv], n) =>
      choice(
        `sound-${n}`,
        review
          ? `第80页${b}中被标出的字，对照注音是哪项？`
          : `第80页${a}中被标出的字，对照注音是哪项？`,
        [av, bv, '不能仅凭相同字母确定'],
        review ? bv : av,
        '按本页标出的字与注音辨n/l、平翘舌或声韵，字形题不自动评发音；实际声音须听规范示范。',
        review,
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
    hint: '实际尝试后由家长确认；缺原书、示范或纸笔可跳过。',
    explanation:
      '只记录真实尝试，不自动评声音笔顺表达或观察，不把未来计划当完成。',
  };
}
export const gardenSixLesson: Lesson = {
  id,
  title: '语文园地六',
  textbookTitle: '语文园地六',
  page: 80,
  version: 2,
  status: 'available',
  goal: '认九字写工厂门卫，联系职业读音和偏旁，生活识字、看图写说、复用笔顺、古诗与亲子共读。',
  prerequisite: '准备第80—83页原书、田字格纸和安全纸卡，可请家长陪读。',
  parentTip:
    '按第三方原书公开预览80—83四页分别核对，未知ISBN版印次不补造。新增认写与偏旁/招牌/笔顺复用字分开，职业不推定性别或高低。古诗为唐李白节选，现代故事全文原画录音外部共读，结尾疑问与自编续讲分开。真实路上认字可以陪同观察或用记忆资料，不要求外出或录入地址；教师最终审校待完成。',
  steps: [
    {
      title: '认九字，另写四字',
      text: '第80页认老、师、工、厂、医、院、生、门、卫，新会写工、厂、门、卫。先听原书拼音示范，再放回老师、工厂、医院、医生、门卫等词，其他活动字不自动扩大会认会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '实际打乱九字顺序指读，家长确认尝试。',
    },
    {
      title: '职业与工作地点',
      text: '按第80页四组词联系学校与老师、工厂与工人、医院与医生、传达室与门卫。这里只按所列一组记词，不表示职业只能在一个地点，也不根据职业判断性别或高低；还知道别的职业可以开放说。',
      activity:
        '实际读四组词，向家长介绍一个职业或合理工作例子，不需家庭职业资料。',
    },
    {
      title: '读准八个词的字音',
      text: '第80页读你们、家里、男生、蓝色、上山、三年、写字、报纸，按原页标出的字分别注意n/l、平翘舌和字音。先听规范示范，再尝试；文字选择不能自动评实际发音，也不能把英语字母名称当声母读音。',
      activity:
        '实际读八个词，听家长回应后再读一组，不因选对注音自动确认发音。',
    },
    {
      title: '观察木旁与草字头',
      text: '按第81页观察树林桃桥一组和花草莲菜一组，交流共同部件及意义联系。许多字有相关意义，但不是所有字都能只靠偏旁解释；桥与木的联系可继续向教师提问，不要求所有现实桥用木头。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['树', '林', '桃', '桥', '花', '草', '莲', '菜'],
      },
      activity:
        '可以先读一组入门，再分别尝试树林桃桥、花草莲菜两组全部八字，观察两种共同部件并交流发现或疑问；活动字不扩大新增认写清单。',
    },
    {
      title: '在生活中认识字',
      text: '第81页鼓励交流路上认识的字。可先看原书招牌里的电影院、生活超市、银行等，再说自己见过的字；不必独自外出或记录真实地址，可以请家长陪同观察或回忆。看到字与已经能规范书写是两件事。',
      activity:
        '实际分享一个生活中见过的字，说在哪类资料上看见，不录入具体地址。',
    },
    {
      title: '看原图写词语',
      text: '按第81页原图观察天空、鸟和景物，在纸面尝试写相应词语。原图给出几处空格，不把网站原创文字情境冒充原图，也不把这里列出的词当唯一标准答案；家长按孩子合理所指核对，缺会写字可借原书或请家长帮助。',
      activity:
        '可以先写一个词入门，再逐一观察原图三处空格，在纸面分别尝试一个合理词语并说出所指；暂不确定的保留待核对，不强制唯一答案。',
    },
    {
      title: '再说一两句话',
      text: '在实际看图写词之后，再说一两句描述。可以用自己的合理句子，把景物、人物和动作说清楚；不要求照抄网站例句，选择题答对不当已经开口表达。',
      activity: '实际向家长说一两句，请对方回应，写词与说话分别确认。',
    },
    {
      title: '按规范示范写工厂门卫',
      text: '第80页新增会写工、厂、门、卫。看逐笔和田字格示范，再在纸面尝试，普通网页字体只供认字，不能替代规范笔顺或描红。',
      visual: { kind: 'characters', grid: 'tian', characters: [...'工厂门卫'] },
      activity: '用田字格纸实际尝试四字，请家长看字形笔顺和位置。',
    },
    {
      title: '复用四字看笔顺',
      text: '第82页云、男提示从上到下，叶、竹提示从左到右。这四字已学，本园地复用，不增加新增会写数；两组规则分别对应原页示范，不表示每一个字都只按一种空间顺序。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['云', '男', '叶', '竹'],
      },
      activity: '看原书逐笔示范，在纸面分别尝试四字，再指出两个规则的对应组。',
    },
    {
      title: '积累古朗月行节选',
      text: `第82页署唐李白，标题说明节选。\n${poem}\n白玉盘与瑶台镜是想象和比喻，不是月亮真的餐具或镜子，青云端也不是月球科学轨迹。先听示范再读，可在理解后尝试积累，不把节选当整首。`,
      activity:
        '与家长实际读四句，说一个觉得有趣的想象；背诵可按学习安排尝试，不以自动评分代替。',
    },
    {
      title: '与大人共读找花生',
      text: `${reading}先听家长示范，再回看小松鼠、鼹鼠、花朵颜色、结果季节与储存计划。童话中的动物说话与现实不同，计划冬天吃不表示已经摘到花生。`,
      activity: '实际与家长共读第83页，再找一处人物行动或信息依据。',
    },
    {
      title: '分清疑问与续讲',
      text: '结尾小松鼠提出疑问，印刷原文没有确认谁偷走花生。回看本页植物图，地下部分画有花生，可据图讨论为什么只在地上看会找不到；图示提示与原文疑问是不同信息。可以说猜想、向家长提问，或明确自己编一段续讲；不把另一个版本或生活知识补成已印答案，不要求挖植物或品尝陌生物。记录真实交流与还想学什么，未来计划不当完成。',
      activity:
        '实际交流一个疑问或自编续讲，标明自己的想法；反思由家长代写也可以。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱顺序指读老师工厂医院生门卫九字，不扩大新增认写范围。',
    ),
    manual(
      'jobs',
      '实际读学校老师、工厂工人、医院医生、传达室门卫四组词，并介绍一个合理职业例子。',
    ),
    manual(
      'sound',
      '按第80页规范示范实际读你们家里男生蓝色上山三年写字报纸八词，家长回应后再读。',
    ),
    manual(
      'components',
      '实际指读树林桃桥或花草莲菜，交流共同部件、意义联系或疑问；不把所有字义都只凭偏旁推断。',
    ),
    manual(
      'components-complete',
      '实际对照第81页分别尝试读树林桃桥、花草莲菜两组全部八字，观察每组共同部件，再向家长交流两组发现或疑问。两组都尝试后才确认；尚未读全可跳过，原任选一组只作入门。',
      '两组分别观察木字旁与草字头，许多字有相关意义，但不能只靠偏旁解释所有字，也不要求所有现实桥都是木头；这些活动字不增加本园地新增认写数。',
    ),
    manual(
      'sign',
      '实际分享生活中认识的一个字及所见资料类型，不要求外出、真实地址或照片。',
    ),
    manual(
      'picture-write',
      '按第81页原图在纸面实际写一个或几个合理景物词，请家长核对所指和字形；不强制唯一答案。',
    ),
    manual(
      'picture-write-complete',
      '对照第81页原图三处空格，逐处观察所指景物，在纸面分别尝试一个合理词语，并向家长说明每个词指什么。三处都尝试后才确认；没有原图或尚未尝试完整可跳过，原写一个词只作入门。',
      '不预设唯一的三个答案，不把本站原创文字情境当原图。暂不确定可保留待核对，允许借原书规范示范或家长帮助；普通字体不能替代真实纸笔。写词与后续说一两句话分别记录。',
    ),
    manual(
      'picture-say',
      '按第81页原图实际说一两句话，听家长回应；与纸面写词分别记录。',
    ),
    manual(
      'write',
      '按第80页规范示范实际用田字格纸写工厂门卫四字，家长看字形笔顺位置。',
    ),
    manual(
      'order',
      '按第82页规范示范实际尝试云男叶竹，并指出从上到下和从左到右对应组；这是复用字。',
    ),
    manual(
      'poem',
      '与家长实际读第82页唐李白古朗月行节选四句，交流一个想象；不把比喻当月亮物理事实。',
      poem,
    ),
    manual(
      'read',
      '与家长实际共读第83页小松鼠找花生，再找一处人物行动或信息依据。',
      reading,
    ),
    manual(
      'retell',
      '实际向家长说结尾疑问或自己编一段续讲，明确自己的想法与印刷原文分开。',
      reading,
    ),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt:
        '记录一个职业、偏旁、招牌、古诗或故事发现，也可以记录自己的疑问。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可以代写。',
      explanation: '保留原话，正确性为null，疑问和续讲不冒充原文事实。',
    },
    {
      id: `${id}-reflect-plan`,
      knowledge: `${id}-reflect-plan`,
      prompt: '明确记录下一次想练的字、读音、写词或阅读计划。',
      rule: { kind: 'reflection' },
      hint: '计划与已完成活动分开。',
      explanation: '不把未来计划当完成，不自动推定掌握。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-04',
    reviewer: '原书四页与两组偏旁、三处写词完整尝试范围复核',
    notes:
      '实读80—83四页，职业九认四写、八词读音、偏旁生活字、看图写词说话、复用笔顺、李白节选与亲子共读分别覆盖。未知ISBN版印次不补造，现代全文原画录音外部共读。开放表达不唯一判分，新增认写与活动字分开，实际活动人工确认、反思null、计划不当完成。教师最终审校与全年仍待逐项验收。2026-10-04重新查看此前正常公开预览保存的80～83页：保留任选一组与写一个词的入门记录，另补两组全部八字及原图三处写词的完整尝试；不预设开放图词唯一答案，也不自动确认纸笔质量。',
  },
};
