import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const snowPaintersPageAudit = {
  itemId: 'u5-3',
  title: '雪地里的小画家',
  pages: [64, 65],
  recognize: '的家鸡竹牙用几步没参加',
  write: '竹马牙用几',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  author: '程宏明',
  adapted: true,
  activities: [
    '朗读课文',
    '背诵课文',
    '说哪些小画家与所画事物',
    '青蛙为何没参加',
    '认读十一字',
    '规范书写五字',
  ],
};
const id = 'cu-u5-3';
const reading =
  '先与家长共读教材印刷第64页《雪地里的小画家》，再回看指定信息。原书作者程宏明，选作课文时有改动。本站不打包现代作品全文、原画或录音；缺原书可跳过，不凭标题猜答案。动物走过雪地留下的脚印被比作画，不能当成动物拿笔或脚印长出植物。';
const characters = [
  ['的', '雪地里的中的第四个字。', '我的中的第二个字。'],
  ['家', '小画家中的第三个字。', '家里中的第一个字。'],
  ['鸡', '小鸡中的第二个字。', '鸡蛋中的第一个字。'],
  ['竹', '竹叶中的第一个字。', '竹子中的第一个字。'],
  ['牙', '月牙中的第二个字。', '牙齿中的第一个字。'],
  ['用', '不用中的第二个字。', '用笔中的第一个字。'],
  ['几', '几步中的第一个字。', '几个中的第一个字。'],
  ['步', '几步中的第二个字。', '脚步中的第二个字。'],
  ['没', '没参加中的第一个字。', '没有中的第一个字。'],
  ['参', '参加中的第一个字。', '参观中的第一个字。'],
  ['加', '参加中的第二个字。', '加上中的第一个字。'],
];
export const snowFootprintPairs = [
  ['小鸡', '竹叶'],
  ['小狗', '梅花'],
  ['小鸭', '枫叶'],
  ['小马', '月牙'],
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
    key: 'frog-reason',
    prompts: [
      '按课文，青蛙为什么没有参加雪地里的活动？',
      '换看课文，哪种动物没有参加雪地里的活动？',
    ],
    labels: ['在洞里睡着', '青蛙', '去画梅花'],
    values: ['在洞里睡着', '青蛙'],
    materials: [reading, reading],
    explanation:
      '课文写青蛙在洞里睡着，没有参加。这是本篇情境，不判断所有地区、季节或种类青蛙的状态。',
  },
  {
    key: 'frog-place',
    prompts: [
      '按课文，青蛙睡在哪里？',
      '换看课文，四位小画家在什么地方留下脚印？',
    ],
    labels: ['洞里', '雪地里', '教室里'],
    values: ['洞里', '雪地里'],
    materials: [reading, reading],
    explanation:
      '分清青蛙的地方与四位小画家的活动地点；不为了验证诗句寻找、唤醒或触碰野生动物。',
  },
  {
    key: 'drawing-way',
    prompts: [
      '课文的小画家怎样留下被比作画的痕迹？',
      '课文说小画家画画不需要哪组用品？',
    ],
    labels: ['走过雪地留下脚印', '颜料和笔', '拿笔给雪涂色'],
    values: ['走过雪地留下脚印', '颜料和笔'],
    materials: [reading, reading],
    explanation:
      '文学表达把脚印比作画，课文没有要求动物拿笔和颜料；也不要求孩子到雪地留下脚印。',
  },
  {
    key: 'comparison',
    prompts: [
      '课文把小鸡脚印写成竹叶，应该怎样理解？',
      '课文写小马画月牙，月牙在这里联系什么？',
    ],
    labels: ['脚印形状的比喻', '小马脚印的形状', '雪地真的长出竹子'],
    values: ['脚印形状的比喻', '小马脚印的形状'],
    materials: [reading, reading],
    explanation:
      '竹叶、月牙等是脚印形状的文学比喻，不把它们当成真实长出的植物或月亮。',
  },
  {
    key: 'sound-de',
    prompts: ['本课题目中的的，注音是哪项？', '本课参加中的参，注音是哪项？'],
    labels: ['de', 'cān', 'cēn'],
    values: ['de', 'cān'],
    materials: [
      '雪地里的小画家：对照第64—65页注音。',
      '参加：对照第64—65页注音。',
    ],
    explanation:
      '的在题目中读轻声de，参加的参读cān；轻声不当第一声，参在其他词可能有不同读音。',
  },
  {
    key: 'sound-mei',
    prompts: ['本课没参加中的没，注音是哪项？', '本课几步中的几，注音是哪项？'],
    labels: ['méi', 'jǐ', 'mò'],
    values: ['méi', 'jǐ'],
    materials: ['没参加：按本课语境看注音。', '几步：按本课语境看注音。'],
    explanation:
      '本课没读méi、几读jǐ，其他语境不能机械照搬；字形选择不自动评价实际发音。',
  },
  {
    key: 'sound-jia',
    prompts: ['本课小画家中的家，注音是哪项？', '本课参加中的加，注音是哪项？'],
    labels: ['jiā', 'jiǎ', 'jià'],
    values: ['jiā', 'jiā'],
    materials: [
      '小画家：对照第65页会认字注音。',
      '参加：对照第65页会认字注音。',
    ],
    explanation:
      '家与加在这两个词中同读jiā，但字形和词义不同，不因同音把两个字当相同。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '本课写竹马牙用几。只比较马与鸡，哪个在本课会写清单？',
      '换看本课会写清单，只比较牙与家，哪个在本课会写清单？',
    ],
    labels: ['马', '鸡', '牙', '家'],
    values: ['马', '牙'],
    materials: ['本题只比较马 / 鸡。', '本题只比较牙 / 家。'],
    explanation:
      '马和牙在会写清单，鸡与家本课仅会认；按指定一对比较，不自行扩大会写范围。',
  },
  {
    key: 'opening',
    prompts: ['课文开头写什么天气？', '开头所写的一群小画家来到哪里？'],
    labels: ['下雪', '雪地里', '海边'],
    values: ['下雪', '雪地里'],
    materials: [reading, reading],
    explanation:
      '天气与活动地方分别查找；开头反复表达下雪的情境，不要求当地实际下雪才学习。',
  },
  {
    key: 'author',
    prompts: [
      '第64页脚注明确的作者是谁？',
      '第64页脚注说明选作课文时怎样处理？',
    ],
    labels: ['程宏明', '有改动', '李绅'],
    values: ['程宏明', '有改动'],
    materials: ['对照教材第64页作者脚注。', '对照教材第64页选作课文脚注。'],
    explanation:
      '按原书脚注保留程宏明与有改动，不把本站原创题目当作者作品原文。',
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
    hint: '先共读原书，再找本题指定的动物、字或脚注；比喻不当实际拿笔画画。',
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
        `这里认${row[0]}。本课会写为竹马牙用几，会认与会写分别看。`,
        review,
      ),
    ),
    ...snowFootprintPairs.map(([animal, shape], n) =>
      choice(
        `footprint-${n}`,
        review
          ? `按课文，哪位小画家的脚印被比作${shape}？`
          : `按课文，${animal}的脚印被比作什么？`,
        snowFootprintPairs.map((r) => r[review ? 0 : 1]),
        review ? animal : shape,
        `本课${animal}脚印被比作${shape}；只是课文里的形状对应，不要求所有实际脚印与画面完全一样。`,
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
    hint: '实际尝试后家长确认；没有原书、规范示范或纸笔可跳过。',
    explanation:
      '只记录真实尝试，不自动评声音、背诵、笔顺或交流质量，不把计划记为完成。',
  };
}
export const snowPaintersLesson: Lesson = {
  id,
  title: '雪地里的小画家',
  textbookTitle: '雪地里的小画家',
  page: 64,
  version: 1,
  status: 'available',
  goal: '朗读并尝试背诵，认十一字写竹马牙用几；联系四种动物的脚印比喻，按课文说明青蛙没有参加的原因。',
  prerequisite:
    '已尝试拼音和简单阅读，请家长陪读；准备对应第64—65页原书与田字格纸。',
  parentTip:
    '依据第三方公开原书实读64—65页，ISBN版印次未知，教师最终审校待完成。原书明确作者程宏明、课文有改动；现代全文原画录音不打包。比喻与现实分开，不要求实际踏雪、采植物或找青蛙；朗读背诵与规范纸笔分别确认。',
  steps: [
    {
      title: '先共读，听下雪的情境',
      text: `${reading}先看题目与第64页开头的天气情境，再听家长借助拼音示范，逐句尝试读。声音来自实际陪读，不用本站字形题代替发音检查。`,
      activity:
        '准备原书实际共读，缺原书可稍后再做；没有雪的地方也可学习诗歌。',
    },
    {
      title: '十一字放回词语',
      text: '认的、家、鸡、竹、牙、用、几、步、没、参、加。联系小画家、竹叶、月牙、不用、几步、没参加等词认字；的在本课题目读轻声de，没读méi、参读cān，几步的几读jǐ。不同语境另看注音，不从同音判断字形相同。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '打乱顺序实际指读十一字，再选两字放回课文词语。',
    },
    {
      title: '四位小画家，对应四种形状',
      text: '回看第64页，找小鸡、小狗、小鸭、小马，再分别联系竹叶、梅花、枫叶、月牙的形状。课文比喻它们走过雪地留下的脚印，不是动物拿笔画出真实花叶。本站用原创对应文字帮助回看，不复制原画或原脚印图。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['鸡', '狗', '鸭', '马'],
      },
      activity:
        '用纸卡把小鸡/小狗/小鸭/小马与竹叶/梅花/枫叶/月牙配对，再参考原书解释一个比喻；狗鸭只是活动词，不增加本课正式会认会写。',
    },
    {
      title: '不拿笔，为什么也像画',
      text: '课文说不用颜料和笔，联系动物走过雪地留下的形状，就能理解小画家这个说法。真实脚印会受动物姿态、雪面等影响，不能用诗中形状当所有真实脚印的识别标准；不用实际踏雪或寻找动物验证。',
      activity:
        '用自己的话解释一个脚印与形状的联系，允许不同表达；不强求模仿动物动作。',
    },
    {
      title: '青蛙没有参加，回看原因',
      text: '第65页问青蛙为什么没有参加；回看第64页结尾，课文写它在洞里睡着。分清没有参加的动物、所在地方和原因。这里只按这篇课文找信息，不说所有青蛙在每种冬天气候中都在洞里睡，也不需要寻找或唤醒青蛙。',
      activity:
        '指给家长看课文结尾，用自己的话回答为什么没有参加；资料没准备好可暂时跳过。',
    },
    {
      title: '按规范示范写五字',
      text: '本课会写竹、马、牙、用、几。按第65页逐笔与田字格示范看字形、笔顺和笔画位置，不把鸡家等会认字加入会写。网页普通字体仅供认字，不是描红或标准笔顺动画。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['竹', '马', '牙', '用', '几'],
      },
      activity:
        '在田字格纸分别尝试写五字，家长查看真实纸面；缺示范或纸笔可以跳过。',
    },
    {
      title: '朗读与背诵分别记录',
      text: '第65页要求朗读课文、背诵课文。先逐句读，再尝试连读和背诵，注意四位小画家与形状的对应、最后的问答。朗读完成不等于已经背诵，配对答对也不证明实际读背完成，两项由家长分别确认。',
      activity: '实际朗读后再另行尝试背诵；未完成项可以暂时跳过，稍后继续。',
    },
    {
      title: '说发现，保留真实想法',
      text: '说一个有趣的脚印比喻、课文发现，或还想练的字与读背问题。自己的想象与原书信息分开，计划以后再读不当今天已经完成；不需要名字、照片或家庭地点。',
      activity: '与家长交流一个发现，反思可以由家长代写，不要求固定答案。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱顺序指读的家鸡竹牙用几步没参加，再选两字放回词语；家长确认尝试。',
    ),
    manual(
      'read',
      '与家长实际朗读第64页雪地里的小画家，注意开头天气与最后问答；不自动评声音。',
      reading,
    ),
    manual(
      'recite',
      '与家长实际尝试背诵第64页雪地里的小画家；与朗读分开确认，未背诵可暂时跳过。',
      reading,
    ),
    manual(
      'pairs',
      '用纸卡实际配四位动物与课文脚印形状，参考原书说明一组联系；不把配对选择题代替真实摆卡。',
      reading,
    ),
    manual(
      'frog',
      '回看第64页结尾实际指读、用自己的话向家长说明青蛙为何没参加；不寻找或唤醒真实动物。',
      reading,
    ),
    manual(
      'write',
      '按第65页规范示范，用田字格纸实际尝试写竹马牙用几，家长查看字形、笔顺与位置。',
    ),
    manual(
      'say',
      '与家长实际说一个脚印比喻或课文发现，说明是原书信息还是自己的想法；只确认交流。',
    ),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个脚印比喻或课文发现，也可以写自己觉得有趣的地方。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，不用上传图片或个人地点。',
      explanation: '保留原话，正确性为null，不把自拟情节当原书内容。',
    },
    {
      id: `${id}-reflect-practice`,
      knowledge: `${id}-reflect-practice`,
      prompt: '记录一个还想练的字、朗读或背诵问题，或下一次计划。',
      rule: { kind: 'reflection' },
      hint: '按实际情况写，未来计划保持为计划。',
      explanation: '开放记录不自动评分，不自动确认计划已经完成。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读第三方公开预览64—65页，程宏明改选、十一会认五会写、四动物脚印比喻、青蛙原因与朗读背诵按原页核对。未知ISBN版印次不补造，现代全文原画声音不打包；比喻不当动物拿笔，课文状态不推广所有现实物种气候。实际活动分别人工确认，反思null；教师最终审校及全年完成仍待逐项验收。',
  },
};
