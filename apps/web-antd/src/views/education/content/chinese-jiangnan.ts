import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const jiangnanPageAudit = {
  itemId: 'u5-2',
  title: '江南',
  pages: [62, 63],
  recognize: '江南可采莲戏间东北',
  write: '可叶东西',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  activities: ['朗读课文', '背诵课文', '认读九字', '规范书写四字'],
  sourceNote: '原页署汉乐府，不补造个人作者。',
};
const id = 'cu-u5-2';
const poem =
  '《江南》\n汉乐府\n江南可采莲，\n莲叶何田田。\n鱼戏莲叶间。\n鱼戏莲叶东，\n鱼戏莲叶西，\n鱼戏莲叶南，\n鱼戏莲叶北。';
const characters = [
  ['江', '江南中的第一个字。', '江水中的第一个字。'],
  ['南', '江南中的第二个字。', '南方中的第一个字。'],
  ['可', '可以中的第一个字。', '可爱中的第一个字。'],
  ['采', '采莲中的第一个字。', '采摘中的第一个字。'],
  ['莲', '采莲中的第二个字。', '莲叶中的第一个字。'],
  ['戏', '鱼戏莲叶间中的第二个字。', '游戏中的第二个字。'],
  ['间', '莲叶间中的第三个字。', '中间中的第二个字。'],
  ['东', '东方中的第一个字。', '东西两个方向中的第一个字。'],
  ['北', '北方中的第一个字。', '南北两个方向中的第二个字。'],
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
    key: 'reading-plant',
    prompts: ['古诗开头写可以采什么？', '古诗下一句写什么长得茂盛？'],
    labels: ['莲', '莲叶', '松果'],
    values: ['莲', '莲叶'],
    materials: [poem, poem],
    explanation:
      '先分清采莲与写莲叶的句子；诗中景象不表示每个现实水域都适合采摘。',
  },
  {
    key: 'reading-fish',
    prompts: [
      '古诗中，谁在莲叶间游动嬉戏？',
      '古诗中哪个字写鱼游动嬉戏的样子？',
    ],
    labels: ['鱼', '戏', '树'],
    values: ['鱼', '戏'],
    materials: [poem, poem],
    explanation:
      '鱼是诗中所写动物，戏写游动嬉戏的样子；文学描写不是鱼实际在演戏或读诗。',
  },
  {
    key: 'reading-leaves',
    prompts: ['古诗用哪个叠词描写莲叶？', '诗中田田在这里说莲叶怎样？'],
    labels: ['田田', '茂盛的样子', '稀少的样子'],
    values: ['田田', '茂盛的样子'],
    materials: [poem, poem],
    explanation:
      '田田写莲叶茂盛的样子，不把田田理解为要写两个田地或增加本课会写字。',
  },
  {
    key: 'reading-direction',
    prompts: [
      '在古诗四句方位诗句中，东与西哪个先写？',
      '换看古诗四句方位诗句，南与北哪个先写？',
    ],
    labels: ['东', '西', '南', '北'],
    values: ['东', '南'],
    materials: [poem, poem],
    explanation:
      '原诗方位句依次为东、西、南、北。本题看诗句先后，不表示鱼现实必须按固定路线游。',
  },
  {
    key: 'reading-location',
    prompts: ['古诗写鱼在哪里游动嬉戏？', '换看古诗开头，可以采什么？'],
    labels: ['莲叶间', '莲', '树干上'],
    values: ['莲叶间', '莲'],
    materials: [poem, poem],
    explanation: '莲叶间是鱼活动的位置，莲是开头采的对象，位置和对象不能混同。',
  },
  {
    key: 'poem-label',
    prompts: ['原书题目下所署的是哪一项？', '江南这篇课文属于哪类作品？'],
    labels: ['汉乐府', '唐代李绅', '古诗'],
    values: ['汉乐府', '古诗'],
    materials: [poem, poem],
    explanation:
      '原页署汉乐府，这是一首古诗，不补造具体个人作者或把此前李绅署名搬来。',
  },
  {
    key: 'sequence',
    prompts: [
      '古诗写鱼戏莲叶东后，下一句写哪个方位？',
      '换看古诗，写鱼戏莲叶西后，下一句写哪个方位？',
    ],
    labels: ['东', '西', '南', '北'],
    values: ['西', '南'],
    materials: [poem, poem],
    explanation: '按诗句东、西、南、北的排列回看，不凭鱼在插画的屏幕左右判断。',
  },
  {
    key: 'opposite',
    prompts: [
      '在东、西、南、北四张方向字卡里，与东相对的是哪一张？',
      '换看四张方向字卡，与南相对的是哪一张？',
    ],
    labels: ['东', '西', '南', '北'],
    values: ['西', '北'],
    explanation:
      '东与西、南与北分别是相对方向；字卡放在屏幕左边或右边不自动表示现实方向。',
  },
  {
    key: 'word-sound',
    prompts: [
      '在莲叶间这个语境里，间的本课注音是哪项？',
      '换看采莲这个词，采的本课注音是哪项？',
    ],
    labels: ['jiān', 'jiàn', 'cǎi'],
    values: ['jiān', 'cǎi'],
    materials: ['莲叶间：对照第62—63页注音。', '采莲：对照第62—63页注音。'],
    explanation:
      '本课莲叶间的间读jiān，采读cǎi；间在其他语境可能有不同读音，不从选字形自动评实际发音。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '本课会写可叶东西。只比较叶与南，哪一个在会写清单？',
      '本课会写可叶东西。只比较西与北，哪一个在会写清单？',
    ],
    labels: ['叶', '西', '南', '北'],
    values: ['叶', '西'],
    materials: ['本题指定比较叶 / 南。', '本题指定比较西 / 北。'],
    explanation:
      '叶和西都在会写清单，但本题分别限定叶/南或西/北；不能因此增加南北为本课会写字。',
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
    hint: '回看本题指定的诗句或比较对象，不用屏幕位置代替诗中的方向。',
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
        `这里认${row[0]}。本课会写为可叶东西，会认与会写清单分别看。`,
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
    hint: '实际尝试后由家长确认；缺原书或规范示范、纸笔可以跳过。',
    explanation: '只记录真实活动，不自动评发音、背诵、字形笔顺或交流质量。',
  };
}
export const jiangnanLesson: Lesson = {
  id,
  title: '江南',
  textbookTitle: '江南',
  page: 62,
  version: 1,
  status: 'available',
  goal: '朗读与尝试背诵汉乐府江南，认九字写可叶东西；联系莲叶和鱼理解诗意，比较诗句中的四个方位。',
  prerequisite:
    '已尝试拼音与简单阅读，可请家长陪读；准备第62—63页原书与田字格纸。',
  parentTip:
    '依据第三方原书公开预览实际62—63页制作，ISBN版印次未知、教师最终审校待完成。古诗公有领域文本署原书汉乐府，不补造个人作者；原图和标准声音不打包。认江南可采莲戏间东北，写可叶东西，不要求上传真实地点或实际采莲。',
  steps: [
    {
      title: '读江南，看署名',
      text: `${poem}\n这是公有领域古诗文字，原书署汉乐府，不是本站原创，也不补造个人作者。先看第62页题目和注音，家长用可靠示范陪读；本站不播放普通机器声音代替标准朗读。`,
      activity: '听家长示范，再尝试逐句读；实际朗读与背诵分别记录。',
    },
    {
      title: '九个会认字放回词语',
      text: '认江、南、可、采、莲、戏、间、东、北。把它们放回江南、可采莲、鱼戏莲叶间与东、北等诗句或词语中；间在本课语境读jiān，采读cǎi。会认清单没有叶西，但会写清单有叶西，两个范围分别对照，不能按选择题自动扩充。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '打乱九字顺序分别指读，再选两字放回诗句；家长确认实际尝试。',
    },
    {
      title: '莲叶与鱼分别找信息',
      text: '开头写江南可采莲，下一句田田描述莲叶茂盛的样子；再写鱼在莲叶间游动嬉戏。鱼、莲叶、采莲对象和游动位置分别找，不把田田当田地，也不把鱼戏理解成鱼真的登台演戏。诗歌景象不是所有现实水域的说明。',
      activity:
        '指读相关诗句，用自己的话说看见怎样的莲叶和鱼；也可回看原书插画，本站不复制原画。',
    },
    {
      title: '四个方位与诗句顺序',
      text: '后四句依次写东、西、南、北，重复鱼戏莲叶的开头，让我们体会鱼游来游去。东与西相对，南与北相对。这里看诗句顺序和方向字，不要求鱼真实按固定路线游，也不用网页左右推断实际地理方位。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['东', '西', '南', '北'],
      },
      activity:
        '用四张纸卡写方向字，按诗句顺序排；再把相对的两组找出来，实际摆卡单独确认。',
    },
    {
      title: '看原画，用自己的话表达',
      text: '打开第62—63页，观察原图中的莲叶与鱼，把诗句和图画联系起来。图中未标指南针，不能只因鱼在屏幕左侧就说那是西；可以说图上左侧，也可以引用诗中的方位，说明所依据的材料。自己的想象不冒充原书文字。',
      activity:
        '用自己的话描述一处莲叶或鱼的景象，允许合理表达；不要求真实采莲、涉水或填写个人地点。',
    },
    {
      title: '按示范写可、叶、东、西',
      text: '本课会写可、叶、东、西。对照第63页逐笔和田字格示范，比较可与叶的组成、东与西的字形和笔画位置；不因诗中还有南北而加入会写。普通屏幕字体只供认字，纸笔按教材或教师规范示范写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['可', '叶', '东', '西'],
      },
      activity:
        '在田字格纸分别尝试写四字，请家长查看实际字形、笔顺和位置；没有示范或纸笔可跳过。',
    },
    {
      title: '朗读与背诵分别尝试',
      text: '第63页要求朗读课文、背诵课文。可以先逐句读，再连起来读，熟悉后尝试背诵，注意方位句顺序。朗读完成不等于已经背诵，选对方位也不证明真实读背完成；两项由家长分别确认。',
      activity:
        '先实际朗读，再另行尝试背诵；未完成的项暂时跳过，不自动记成完成。',
    },
    {
      title: '记下发现与问题',
      text: '可以记录一个诗中景象、记方位的办法，或还想练的字与读背问题。反思没有统一答案，计划再读不当今天已经读过；不需要姓名、照片、位置或学校信息。',
      activity: '用自己的话表达一个发现和一个还想练的问题，家长可以代写。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '打乱九字顺序实际指读江南可采莲戏间东北，再选两字放回词语或诗句。',
    ),
    manual(
      'read',
      '与家长实际朗读江南，注意诗句与方位顺序；家长确认尝试，不自动评声音。',
      poem,
    ),
    manual(
      'recite',
      '与家长实际尝试背诵江南；与朗读分开确认，未背诵可暂时跳过。',
      poem,
    ),
    manual(
      'cards',
      '用纸卡实际排东、西、南、北的诗句顺序，再找东/西、南/北两组相对方向；不根据屏幕左右推断现实方向。',
    ),
    manual(
      'picture',
      '实际观察原书第62—63页插画，指一处莲叶或鱼联系诗句说说；原图未标指南针，不补造图中地理方位。',
    ),
    manual(
      'write',
      '对照第63页规范示范，用田字格纸实际尝试写可叶东西，请家长查看字形、笔顺与位置。',
    ),
    manual(
      'say',
      '与家长实际交流诗中莲叶或鱼的景象，可以用自己的话；只确认交流，不强求固定句子或实际采莲。',
    ),
    {
      id: `${id}-reflect-scene`,
      knowledge: `${id}-reflect-scene`,
      prompt:
        '记录一个诗中景象或记四个方位的办法；说明是诗句信息还是自己的想法。',
      rule: { kind: 'reflection' },
      hint: '允许自己的表达，不需要个人身份地点信息。',
      explanation: '保留原话，正确性为null，不把想象改写成原文。',
    },
    {
      id: `${id}-reflect-practice`,
      knowledge: `${id}-reflect-practice`,
      prompt: '记录还想练的字、朗读或背诵问题，或者下一次计划。',
      rule: { kind: 'reflection' },
      hint: '按真实情况写，计划保持为计划。',
      explanation: '开放记录不自动评分，不自动确认未来活动完成。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读第三方预览印刷62—63页，署汉乐府、九会认四会写、朗读背诵按原页核对。公有领域古诗文字保留来源署名，现代原图声音不打包；未知ISBN版印次不补造。诗句方位、屏幕位置和现实地理分开，实际任务人工确认，反思null；教师最终审校及全年完成仍待逐项验收。',
  },
};
