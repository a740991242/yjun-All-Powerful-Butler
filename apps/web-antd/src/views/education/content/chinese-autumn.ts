import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const autumnPageAudit = {
  itemId: 'u5-1',
  title: '秋天',
  pages: [60, 61],
  recognize: '秋气了树叶黄片从来飞',
  write: '了子大人',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  activities: [
    '借助拼音朗读',
    '背诵课文',
    '数自然段',
    '注意一的读音',
    '认读十字',
    '规范书写四字',
  ],
  sourceNote:
    '原页注明选自人民教育出版社五年制小学课本语文第一册，有改动；未署个人作者。',
};
const id = 'cu-u5-1';
const reading =
  '先与家长共读教材印刷第60页《秋天》，再回看对应自然段找信息。本站不打包课文全文、原画或录音；没有原书可跳过，不凭标题猜答案。这里的天气、树叶和雁阵是课文所写景象，不表示所有地方、树种或鸟每到秋天都相同。';
const characters = [
  ['秋', '秋天中的第一个字。', '秋风中的第一个字。'],
  ['气', '天气中的第二个字。', '空气中的第二个字。'],
  ['了', '来了中的第二个字。', '凉了中的第二个字。'],
  ['树', '树叶中的第一个字。', '大树中的第二个字。'],
  ['叶', '树叶中的第二个字。', '叶子中的第一个字。'],
  ['黄', '黄色中的第一个字。', '黄叶中的第一个字。'],
  ['片', '一片中的第二个字。', '两片中的第二个字。'],
  ['从', '从树上中的第一个字。', '从这里中的第一个字。'],
  ['来', '来了中的第一个字。', '回来中的第二个字。'],
  ['飞', '飞走中的第一个字。', '飞来中的第一个字。'],
];
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
    key: 'reading-weather',
    prompts: [
      '回看课文第一自然段，天气怎样变化？',
      '回看课文第一自然段，树叶的颜色怎样变化？',
    ],
    labels: ['凉了', '黄了', '变成蓝色'],
    values: ['凉了', '黄了'],
    materials: [reading, reading],
    explanation:
      '分清所问的是天气还是树叶，依据第一自然段找信息，不推广为所有现实季节景象。',
  },
  {
    key: 'reading-leaf',
    prompts: [
      '课文第一自然段的叶子从哪里落下来？',
      '课文第一自然段写叶子怎样移动？',
    ],
    labels: ['树上', '落下来', '飞往南方'],
    values: ['树上', '落下来'],
    materials: [reading, reading],
    explanation: '叶子的出处和移动方式是不同信息；不要混入下一段大雁的动作。',
  },
  {
    key: 'reading-sky',
    prompts: [
      '课文第二自然段写天空是什么颜色？',
      '课文第二自然段还写天空那么怎样？',
    ],
    labels: ['蓝', '高', '低'],
    values: ['蓝', '高'],
    materials: [reading, reading],
    explanation: '蓝描述颜色，高描述另一特征；分别回看题目所问的信息。',
  },
  {
    key: 'reading-geese',
    prompts: [
      '课文第二自然段中的大雁往哪个方向飞？',
      '课文写大雁一会儿排成人字，另一会儿排成哪个字？',
    ],
    labels: ['南', '一', '口'],
    values: ['南', '一'],
    materials: [reading, reading],
    explanation:
      '南是课文中的方向，一是所写队形；只依据这篇课文，不说所有鸟秋天都向南飞。',
  },
  {
    key: 'paragraph-count',
    prompts: [
      '对照原书第60页，课文一共有几个自然段？',
      '看第61页提示，每个自然段前面空几个字的位置？',
    ],
    labels: ['3', '2', '1'],
    values: ['3', '2'],
    materials: [reading, '对照教材第61页的自然段提示。'],
    explanation:
      '课文有三个自然段；自然段起头空两个字的位置。自然段数量与空格数量不能混同。',
  },
  {
    key: 'paragraph-rule',
    prompts: [
      '找新自然段时，更应看什么？',
      '哪一种情况不能单独说明开始了新自然段？',
    ],
    labels: ['段首空两个字的位置', '屏幕太窄自动换行'],
    values: ['段首空两个字的位置', '屏幕太窄自动换行'],
    explanation:
      '原书段首缩进帮助辨认自然段；屏幕换行由宽度决定，不等于另起自然段。数段请对照原书。',
  },
  {
    key: 'tone-single',
    prompts: [
      '单独读数字一，选择本题对应读音。',
      '单独读一时，本题标的是第几声的写法？',
    ],
    labels: ['yī', 'yí', 'yì'],
    values: ['yī', 'yī'],
    materials: ['一：单独读数字，不接量词。', '一：单独读数字。'],
    explanation:
      '本题单独读一为yī，第一声；不能把一片片中的变调搬来。实际声音需标准示范。',
  },
  {
    key: 'tone-piece',
    prompts: [
      '按本课第61页注音，一片片中的一读哪项？',
      '换看本课第61页注音，一会儿中的一读哪项？',
    ],
    labels: ['yī', 'yí', 'yì'],
    values: ['yí', 'yí'],
    materials: [
      '一片片：后接piàn，按原书注音比较。',
      '一会儿：后接huì，按原书注音比较。',
    ],
    explanation:
      '本课一片片和一会儿都标yí，与单独一的yī不同；听示范后实际读，不据选择题评分发音。',
  },
  {
    key: 'tone-group',
    prompts: [
      '按本课第61页注音，一群中的一读哪项？',
      '换看本课第61页注音，一片片中的一读哪项？',
    ],
    labels: ['yī', 'yí', 'yì'],
    values: ['yì', 'yí'],
    materials: [
      '一群：后接qún，按原书注音比较。',
      '一片片：后接piàn，换条件再读。',
    ],
    explanation:
      '一群标yì，一片片标yí；要看当前词语，不把一的变调固定为一种声调。',
  },
  {
    key: 'word-sound',
    prompts: [
      '本课来了中的了，对照注音选哪项？',
      '本课会写字子，对照注音选哪项？',
    ],
    labels: ['le', 'zǐ', 'liǎo'],
    values: ['le', 'zǐ'],
    materials: [
      '来了：看本课第60页与第61页注音。',
      '子：看本课第61页会写字注音。',
    ],
    explanation:
      '本课语境中了读轻声le；会写字子标zǐ。轻声不是第一声，也不把了的另一读音混入这个语境。',
  },
  {
    key: 'reading-order',
    prompts: ['课文开头先写哪组景物？', '课文最后一个自然段表达什么？'],
    labels: ['天气和树叶', '秋天来了的感叹', '孩子过生日'],
    values: ['天气和树叶', '秋天来了的感叹'],
    materials: [reading, reading],
    explanation:
      '第一段与最后一段承担不同表达，按原书顺序查找，不把自己的观察补写成课文内容。',
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
    hint: '先看本题指定词语；阅读题先回看原书，自然段不按网页自动换行数。',
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
        `这里认${row[0]}；本课会写只有了子大人，认字题不增加其他会写字。`,
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
    hint: '实际尝试后由家长确认；缺原书、规范示范或纸笔可跳过。',
    explanation: '仅记录真实活动，不自动评声音、笔顺或背诵，不把计划当完成。',
  };
}
export const autumnLesson: Lesson = {
  id,
  title: '秋天',
  textbookTitle: '秋天',
  page: 60,
  version: 1,
  status: 'available',
  goal: '借助拼音朗读并尝试背诵，认十字写了子大人；找到三个自然段，比较一在指定词语中的读音。',
  prerequisite:
    '已尝试本册拼音，可请家长陪读；准备对应原书和田字格纸，不要求独立理解全部句子。',
  parentTip:
    '依据第三方原书公开预览实读60—61页制作，未知ISBN版印次不补造，教师最终审校待完成。原页注明人民教育出版社五年制小学课本语文第一册改选，未署个人作者，不补造署名。全文原图录音外部查看；真实朗读、背诵、写字和交流分别记录。',
  steps: [
    {
      title: '先共读，再找秋天景象',
      text: `${reading}原页注明选自人民教育出版社五年制小学课本语文第一册，有改动，未署个人作者。先看第60页标题和配图，再听家长借助拼音示范。`,
      activity:
        '准备原书，与家长实际共读；缺原书可以稍后再做，不从本站问答猜整篇课文。',
    },
    {
      title: '十个目标字放回词语',
      text: '认秋、气、了、树、叶、黄、片、从、来、飞。用秋天、天气、来了、树叶、黄叶、一片、从树上等语境认字；了在本课语境读轻声le，轻声不标成第一声。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '打乱十字顺序，分别指读，再选两个放回词语；家长确认实际尝试。',
    },
    {
      title: '分段找信息',
      text: '回看原书：第一自然段写天气和树叶，第二自然段写天空和大雁，第三自然段表达秋天到来的感叹。天气变化、叶子颜色、雁飞方向与队形分别查找；这些是课文情境，不推广为所有地区和物种。',
      activity:
        '指给家长看自己找到的段落，再用自己的话说两项信息；不要把原图或自拟情节当本站原作。',
    },
    {
      title: '自然段不等于屏幕一行',
      text: '第61页提醒自然段前面空两个字的位置；第60页正文共三个自然段。先找段首缩进，再顺序数一数。一个自然段可能排成多行，手机窄屏的自动换行不能作为另起自然段的依据。本站讲解不是原书排版，数段回到原书。',
      activity:
        '对照原书第60页，用手指分别指出三个段首并计数；不需要在书上留下标记。',
    },
    {
      title: '一的读音随指定词语看',
      text: '按第61页注音：单独一yī、一片片yí piàn piàn、一会儿yí huìr、一群yì qún。先分清单独数字和指定词语，再听标准示范实际读；本课这里只比较这些词，不用一个声调代替所有一，也不把字形选择当实际发音正确。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['yī', 'yí', 'yì'],
      },
      activity:
        '参考教材规范示范实际读四项，家长听孩子尝试；没有标准示范可跳过声音活动。',
    },
    {
      title: '写了、子、大、人',
      text: '本课会写只有了、子、大、人。对照第61页逐笔和田字格示范，比较了与子、人与大：子与了不完全相同，大与人也不能漏看横画。网页普通字体只供认字，不是笔顺动画或描红；纸笔按原书规范示范来。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['了', '子', '大', '人'],
      },
      activity:
        '在田字格纸分别尝试写四字，家长查看实际纸面；未尝试不自动确认。',
    },
    {
      title: '朗读和背诵分开记录',
      text: '借助拼音朗读第60页课文，再尝试背诵。可以先分段读、再连起来读；暂时不会就回看原书听示范。朗读完成不等于已经背诵，选择题正确也不能证明读背完成，两项实际活动分别由家长确认。',
      activity:
        '先完成实际朗读，再另行尝试背诵；尚未完成的项可跳过，稍后再练。',
    },
    {
      title: '用自己的观察交流',
      text: '可以说自己观察到的一种季节变化，或记下一件还想练的事。真实观察与未来计划分开，不要求上传照片、地址或学校；不同地方、天气与植物可能不同，不强求照课文景象回答。',
      activity:
        '与家长交流一个实际观察或一个想观察的问题，明确哪项已经看到、哪项只是计划。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱顺序指读秋气了树叶黄片从来飞，再选两字放回词语；家长确认尝试。',
    ),
    manual(
      'read',
      '借助拼音实际朗读第60页秋天；家长听读后确认尝试，不自动评发音。',
      reading,
    ),
    manual(
      'recite',
      '与家长实际尝试背诵第60页秋天；这项与朗读分开，未背诵可暂时跳过。',
      reading,
    ),
    manual(
      'paragraph',
      '对照第60页实际指三个自然段的段首，结合第61页提示说计数依据；不要按网页自动换行数段。',
    ),
    manual(
      'tone-read',
      '参考第61页注音和标准示范，实际尝试读单独一、一片片、一会儿、一群；家长确认尝试，选择题不代替声音。',
    ),
    manual(
      'write',
      '按第61页规范示范，用田字格纸实际尝试写了子大人；家长查看笔顺与位置，缺示范或纸笔可跳过。',
    ),
    manual(
      'talk',
      '与家长实际交流一种季节观察或想观察的问题，分清已看到与计划；只确认交流，不确认计划已发生。',
    ),
    {
      id: `${id}-reflect-reading`,
      knowledge: `${id}-reflect-reading`,
      prompt: '记录一个还想练的字、读音或朗读背诵问题。',
      rule: { kind: 'reflection' },
      hint: '用自己的话即可，可以请家长代写。',
      explanation: '保留原话，正确性为null，不自动判断掌握。',
    },
    {
      id: `${id}-reflect-observe`,
      knowledge: `${id}-reflect-observe`,
      prompt:
        '记录一个实际观察或想观察的问题，说明是已看到还是计划；不用写地点身份信息。',
      rule: { kind: 'reflection' },
      hint: '不同地方季节景象可以不同，不需要照课文编经历。',
      explanation: '开放记录无唯一答案，未来观察不自动算完成。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读第三方预览印刷60—61页；认十字写四字、三自然段与一的四项读音按原页核对。未知ISBN版印次与个人作者不补造，现代全文原画录音不打包。朗读背诵分开人工确认，反思null；教师最终审校及全年完成仍待逐项验收。',
  },
};
