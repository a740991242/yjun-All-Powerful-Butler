import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const lowerGardenTwoPageAudit = {
  itemId: 'u2-4',
  pages: [22, 23, 24, 25],
  recognize: '认连选圈涂填试练',
  write: '写认',
  letters: [...'NRDTLABGHEQ'],
  sharedParts: { 日: [...'明星早阳'], 土: [...'地尘场'] },
  shoppingWords: [
    '直尺',
    '橡皮',
    '水彩笔',
    '牙膏',
    '水杯',
    '洗手液',
    '衬衫',
    '外套',
    '运动鞋',
  ],
  poem: '寻隐者不遇',
  poet: '贾岛',
  dynasty: '唐',
  reading: '快乐的节日',
  readingAuthor: '管桦',
  readingAdapted: true,
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
const a = lowerGardenTwoPageAudit;
const id = 'cl-u2-4';
const poem = '松下问童子，言师采药去。\n只在此山中，云深不知处。';
type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  explanation: string;
  material: string;
};
const recognition: [string, string, string][] = [
  ['认', '认一认中的第1个字是哪项？', '换词语：认识中的第1个字是哪项？'],
  ['连', '连一连中的第1个字是哪项？', '换词语：连线中的第1个字是哪项？'],
  ['选', '选一选中的第1个字是哪项？', '换词语：选择中的第1个字是哪项？'],
  ['圈', '圈一圈中的第1个字是哪项？', '换词语：圆圈中的第2个字是哪项？'],
  ['涂', '涂一涂中的第1个字是哪项？', '换词语：涂色中的第1个字是哪项？'],
  ['填', '填一填中的第1个字是哪项？', '换词语：填写中的第1个字是哪项？'],
  ['试', '试一试中的第1个字是哪项？', '换词语：尝试中的第2个字是哪项？'],
  ['练', '练一练中的第1个字是哪项？', '换词语：练习中的第1个字是哪项？'],
];
const instructions = [
  ['拼一拼', '按拼音拼读'],
  ['写一写', '照要求写字'],
  ['认一认', '辨认指定字'],
  ['连一连', '把配对项连起来'],
  ['选一选', '从指定选项选择'],
  ['圈一圈', '把指定项圈出'],
  ['涂一涂', '在指定范围涂色'],
  ['填一填', '在空白处填内容'],
  ['试一试', '尝试给定方法'],
  ['练一练', '练习给定内容'],
] as const;
const pairs: Pair[] = [
  ...instructions.map(([instruction, action], i): Pair => ({
    key: `instruction-${i}`,
    prompts: [
      `按本站示意卡，${instruction}对应哪项操作说明？`,
      `反向查卡：${action}对应哪条学习指令？`,
    ],
    values: [action, instruction],
    labels: [action, instruction, '不用看具体题目要求'],
    explanation:
      '这些是原书学习指令；本站操作说明为原创示意，不冒充原书题目，具体做什么需看实际题目，不以示意限定全部用法。',
    material: `本站原创指令示意卡：${instruction} → ${action}。不是原书原题或实际完成记录。`,
  })),
  ...a.letters.map((c, i): Pair => ({
    key: `letter-${i}`,
    prompts: [
      `第22页连线：小写${c.toLowerCase()}对应哪个大写？`,
      `换方向：大写${c}对应哪个小写？`,
    ],
    values: [c, c.toLowerCase()],
    labels: [
      c,
      c.toLowerCase(),
      required(a.letters[(i + 1) % a.letters.length]),
      required(a.letters[(i + 1) % a.letters.length]).toLowerCase(),
    ],
    explanation:
      '按汉语拼音字母大小写配对，覆盖本页十一组，不把字母连线当英语读音课。',
    material: '先与家长共读第22页原书大小写连线，示例L与l相连。',
  })),
  ...Object.entries(a.sharedParts).flatMap(([part, words]) =>
    words.map((word, i): Pair => ({
      key: `part-${part === '日' ? 'sun' : 'soil'}-${i}`,
      prompts: [
        `第23页图中，${word}连到哪个共同部件？`,
        `换方向：只比较${word}与${part === '日' ? '地' : '星'}，哪字属于本页${part}组？`,
      ],
      values: [part, word],
      labels: [
        part,
        word,
        part === '日' ? '土' : '日',
        part === '日' ? '地' : '星',
      ],
      explanation:
        '按限定图观察共同字形，部件位置可以不同；不是新增认写范围，也不以部件证明全部字义相同。',
      material:
        '第23页日组明、星、早、阳；土组地、尘、场。实际观察原书字形后再比较。',
    })),
  ),
  ...a.shoppingWords.map((word, i): Pair => ({
    key: `shopping-${i}`,
    prompts: [
      `第23页示例词${word}的第1个字是什么？`,
      `反向查本题：示例词${word}最后一个字是什么？`,
    ],
    values: [required([...word][0]), required([...word].at(-1))],
    labels: [
      ...new Set([
        required([...word].at(-1)),
        required([...word][0]),
        '与指定词无关',
      ]),
    ],
    explanation:
      '按限定生活词认字，不扩园地新增认写清单；现实用品名称可不同，不要求去商店购买或上传家庭物品。',
    material: `本题指定原书示例词：${word}。实际朗读与生活识字交流另行确认。`,
  })),
  {
    key: 'poet',
    prompts: ['寻隐者不遇原页署名是谁？', '原页署名朝代是哪项？'],
    values: ['贾岛', '唐'],
    labels: ['贾岛', '唐', '孟浩然'],
    explanation: '第23页署唐贾岛，公有领域古诗保留署名；不把插画当诗人实照。',
    material: poem,
  },
  {
    key: 'poem-dialogue',
    prompts: ['诗中问的是谁？', '按第一句，问话发生在什么位置？'],
    values: ['童子', '松下'],
    labels: ['童子', '松下', '已经见到师父'],
    explanation:
      '问者、回答者与被寻找者分开；原诗未给童子姓名或问答全过程，不补造实际身份。',
    material: poem,
  },
  {
    key: 'poem-absence',
    prompts: ['童子说师父去做什么？', '最后一句能否确定师父的具体位置？'],
    values: ['采药', '不知道具体在哪里'],
    labels: ['采药', '不知道具体在哪里', '知道准确坐标'],
    explanation:
      '在此山中不等于知道确切位置；云深不知处的未知保留，不要求现实进山采药。',
    material: poem,
  },
  {
    key: 'reading-place',
    prompts: [
      '共读第24页：诗中我们来到的两个地方是哪项？',
      '换信息：同页衣裳的美丽与哪样事物作比？',
    ],
    values: ['花园和草地', '开放的花儿'],
    labels: ['花园和草地', '开放的花儿', '孩子真的变成花'],
    explanation:
      '按管桦改选诗中信息找地点与比喻；像不当变成，现代全文原画声音外部共读。',
    material: '先与家长共读原书第24页快乐的节日，不提供现代诗全文。',
  },
  {
    key: 'reading-personification',
    prompts: ['按第24页，向我们点头的是哪项？', '按第24页，哗啦啦响的是哪项？'],
    values: ['花儿', '白杨树'],
    labels: ['花儿', '白杨树', '全部植物真的会说话'],
    explanation: '拟人描写与现实植物行为分开，不当所有现实植物都能祝贺或歌唱。',
    material: '先共读原书第24页，找作者怎样写花儿与白杨树。',
  },
  {
    key: 'reading-future',
    prompts: [
      '共读第25页：像小鸟一样是怎样的表达？',
      '诗中飞向理想，是否证明孩子已经实际完成某个愿望？',
    ],
    values: ['比喻', '没有证明实际完成'],
    labels: ['比喻', '没有证明实际完成', '所有孩子都真的长出羽毛'],
    explanation:
      '儿童成长与理想的比喻不当现实飞行、个人态度/能力或实际完成记录；理想可不同。',
    material: '先与家长共读原书第25页，比较诗中表达与实际生活。',
  },
  {
    key: 'reading-together',
    prompts: [
      '第25页结尾邀请哪组人一起过节？',
      '同页表达自由成长的感谢对象是哪项？',
    ],
    values: ['叔叔阿姨们', '祖国'],
    labels: ['叔叔阿姨们', '祖国', '要求每个孩子填个人政治态度'],
    explanation:
      '只找诗中角色与表达对象，不记录学习者真实身份或政治态度，不推定实际节日日期或参与经历。',
    material: '先共读原书第25页结尾与成长一节。',
  },
  {
    key: 'writing',
    prompts: [
      '只比较写与选，本园地新增会写是哪字？',
      '只比较认与练，本园地新增会写是哪字？',
    ],
    values: ['写', '认'],
    labels: ['写', '认', '选', '练'],
    explanation:
      '本页两新增会写写认，不把其它生活示例字或字形观察字加入新增写字范围。',
    material: '先与家长看第22页两个田字格示范。',
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
    hint: '先看本题限定字词和原书信息，家长可以帮读。',
    explanation,
  };
}
function objective(review: boolean): Question[] {
  return [
    ...recognition.map(([c, main, next], i) =>
      choice(
        `char-${i}`,
        review ? next : main,
        recognition.map((r) => r[0]),
        c,
        '按指定词认字，实际读音需另行确认，会认与会写清单分开。',
        review,
      ),
    ),
    ...pairs.map((p) =>
      choice(
        p.key,
        p.prompts[review ? 1 : 0],
        p.labels,
        p.values[review ? 1 : 0],
        p.explanation,
        review,
        p.material,
      ),
    ),
  ];
}
const actual: [string, string][] = [
  [
    'instructions',
    '实际读第22页十条学习要求，并按当前题目要求尝试一种操作；不是只看示意卡。',
  ],
  ['recognize', '实际指读认连选圈涂填试练八字。'],
  ['write', '按第22页规范示范实际纸面写写、认两个字。'],
  ['letters', '实际在第22页找出并配对十一组大小写，先观察L与l示例。'],
  ['parts', '实际观察第23页两组字形，用自己的话说共同部件与位置发现。'],
  [
    'shopping',
    '实际读九个生活用品示例词，交流一个生活中见过的字；也可用虚构例子。',
  ],
  ['poem', '与家长实际朗读寻隐者不遇，交流问答与没找到的意思；不自动评朗读。'],
  ['reading-first', '实际与大人共读快乐的节日第24页，交流一处景物或声音发现。'],
  [
    'reading-second',
    '实际继续共读第25页，理解成长/理想与结尾一起过节，不把计划记成活动完成。',
  ],
  [
    'exchange',
    '实际轮流说一处字形、古诗或共读发现，听对方回应；表达开放，不要求现实过节。',
  ],
];
export const lowerGardenTwoLesson: Lesson = {
  id,
  title: '语文园地二',
  textbookTitle: '语文园地二',
  page: 22,
  status: 'available',
  version: 1,
  goal: '读学习要求，认八字写两字，配对十一组大小写，观察日土部件，生活识字、读古诗与亲子共读。',
  prerequisite: '准备原书22—25页与纸笔，家长可陪读；无材料可暂时跳过实际任务。',
  parentTip:
    '按实际四页全部栏目组织，保留旧识字补充和历史身份。本站字词问答与活动组织原创，现代全文原画声音外部共读，唐诗为公有领域文本；未知ISBN版印次不补造。实际任务人工确认、反思null、未来计划不当已完成，本课开放不证明整册全年或最终审校完成。',
  steps: [
    {
      title: '四页园地一起看',
      text: '印刷22—25页涵盖识字加油站、字词句运用、日积月累和两页亲子共读。原书第三方公开预览已逐页核对，目录或单页识字补充不能代替四页活动。',
      activity: '与家长查看四页栏目，准备原书与纸笔。',
    },
    {
      title: '读学习要求，再看题目',
      text: '拼、写、认、连、选、圈、涂、填、试、练十条指令，先读清具体题目再操作。本站指令卡为原创示意，能解释一种作用，不限定现实所有题目的用法。',
      activity: '实际读十条要求，按指定任务尝试一种操作。',
    },
    {
      title: '八会认与两会写',
      text: '认连选圈涂填试练八个新增会认；写认两个新增会写，范围分别看。纸面按原书规范示范写，不以网页普通字体作标准笔顺或描红。',
      activity: '实际指读八字，并观察两字写法。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'认连选圈涂填试练'],
      },
    },
    {
      title: '十一组大小写配对',
      text: '本页N/R/D/T/L/A/B/G/H/E/Q十一字母各与小写对应，原图L已连到l。按汉语拼音字母表配对，不是英语读音课；实际读音依规范示范，不按浏览器字体猜声音。',
      activity: '实际找并配对原书十一组字母。',
    },
    {
      title: '共同部件，位置可以不同',
      text: '日组明、星、早、阳；土组地、尘、场。分别观察日/土出现在不同位置，再说发现；共同部件不证明所有字义相同，也不是新增认写清单。',
      activity: '实际指每组共同部件，说一处位置发现。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'明星早阳地尘场'],
      },
    },
    {
      title: '在生活用品里认字',
      text: '直尺、橡皮、水彩笔、牙膏、水杯、洗手液、衬衫、外套、运动鞋九词按原页共读。生活识字可用家里或虚构例子，不要求消费、拍照上传或公开真实家庭信息。',
      activity: '实际读九词，轮流说一个生活识字发现。',
    },
    {
      title: '唐贾岛：寻隐者不遇',
      text: `[唐]贾岛\n${poem}\n问童子，得知师父采药；知道在山中，却不知具体位置。原诗未给姓名、坐标、完整对话，不补造细节。`,
      activity: '实际朗读，说明问谁与为什么没有遇见。',
    },
    {
      title: '快乐的节日：先读第24页',
      text: '原页署管桦，选作课文时有改动。花园、草地、衣裳与花儿的比喻，花儿/白杨树/小鸟的拟人需读原书；不当孩子变花或植物真实说话，全文原画录音外部共读。',
      activity: '与家长实际共读第24页，找一处景物或声音。',
    },
    {
      title: '再读第25页：成长与一起过节',
      text: '继续共读成长、理想和结尾邀请一起过节两部分。像小鸟不当实际飞行或长羽毛；诗中我们与表达对象不推定学习者身份态度，不强制唱歌背诵或参加节庆。',
      activity: '实际共读第25页，交流比喻和结尾邀请。',
    },
    {
      title: '写字与开放分享',
      text: '实际按第22页示范写写、认。与伙伴轮流说一个字形、古诗或现代共读发现，听对方回应；可表达不同感受，不按唯一例句或个人态度判分。',
      activity: '完成纸面两字与轮流说听，缺材料可暂时跳过。',
      visual: { kind: 'characters', grid: 'tian', characters: [...'写认'] },
    },
    {
      title: '记录发现与下一次计划',
      text: '家长可代写实际发现。另列下次想练的内容，计划不当已经完成；选看材料与实际读过分开记录。',
      activity: '保留实际发现和未来练习计划。',
    },
  ],
  questions: [
    ...objective(false),
    ...actual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-manual-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际尝试后确认，缺书纸笔或示范可以暂时跳过。',
      explanation:
        '实际读写说听由孩子或家长确认，不自动评声音字迹，正确性null，计划不当完成。',
    })),
    ...[
      '记录一个指令、字形、古诗或共读发现。',
      '记录下次练习计划，明确不是已经完成。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflect-${i}`,
      knowledge: `${id}-reflect-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '自己的话，家长可代写。',
      explanation:
        '反思保留原话、正确性null，开放表达不唯一判分，未来计划不当活动完成。',
    })),
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '下册园地二四页活动范围校验',
    notes: `实际查看第三方原书公开预览（${a.sourceUrl}）22—25四页，八认两写、十指令、十一字母、日土两组、九生活词、唐贾岛古诗与管桦改选两页共读分别核对。本站问答/活动组织原创，现代全文原画声音外部共读，未知出版元数据不补造；实际任务人工确认、反思null、计划不当完成，旧补充与历史保留，全年与最终审校另验。`,
  },
};
