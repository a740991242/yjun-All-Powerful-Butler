import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const gardenFivePageAudit = {
  itemId: 'u5-5',
  title: '语文园地五',
  pages: [68, 69, 70, 71, 72],
  recognize: '男女关正反先后内外',
  write: '女开关先',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  activities: [
    '相对词与同类表达',
    '规范写字',
    '四季与景物词及喜欢理由',
    '认识同学名字',
    '珍惜时光传统语句',
    '口语交际交朋友',
    '亲子共读拔萝卜与续讲',
  ],
  storyAuthor: '阿·尼·托尔斯泰',
  translator: '司徒贞',
  adapted: true,
};
const id = 'cu-u5-5';
const proverb =
  '一年之计在于春，一日之计在于晨。\n一寸光阴一寸金，寸金难买寸光阴。';
const reading =
  '先与家长共读教材印刷第71—72页《拔萝卜》，再回看指定信息。原书脚注明苏联阿·尼·托尔斯泰、译者司徒贞、选作课文时有改动。本站不打包现代译文全文、原画或录音；缺原书可跳过。第72页文字在叫小猫帮忙后省略，并问后来怎样；图中信息与孩子续讲须区别，不把熟悉的另一版本补写成这里的印刷原文。';
const characters = [
  ['男', '男孩中的第一个字。', '男女中的第一个字。'],
  ['女', '女孩中的第一个字。', '男女中的第二个字。'],
  ['关', '关门中的第一个字。', '开关中的第二个字。'],
  ['正', '正面中的第一个字。', '正反中的第一个字。'],
  ['反', '反面中的第一个字。', '正反中的第二个字。'],
  ['先', '先后中的第一个字。', '首先中的第二个字。'],
  ['后', '先后中的第二个字。', '后来中的第一个字。'],
  ['内', '内外中的第一个字。', '室内中的第二个字。'],
  ['外', '内外中的第二个字。', '门外中的第二个字。'],
];
export const gardenFiveOppositePairs = [
  ['南', '北'],
  ['男', '女'],
  ['开', '关'],
  ['正', '反'],
  ['先', '后'],
  ['内', '外'],
] as const;
const names =
  '本站原创虚构卡：小安——喜欢画画；小禾——喜欢拼积木。这里不是真实同学资料，不要把真实姓名或学校填入网站。';
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
    key: 'word-season',
    prompts: [
      '指定的春天与青草两个词，哪个是季节名称？',
      '换看指定的冬天与雪人，哪个是季节名称？',
    ],
    labels: ['春天', '青草', '冬天', '雪人'],
    values: ['春天', '冬天'],
    materials: ['本题只比较春天 / 青草。', '本题只比较冬天 / 雪人。'],
    explanation:
      '春天、冬天是季节名称，青草、雪人是景物词；按指定一对比较，个人喜欢哪个季节开放。',
  },
  {
    key: 'word-animal',
    prompts: [
      '指定的飞鸟与树叶，哪个表示动物？',
      '换看指定的小鱼与莲花，哪个表示动物？',
    ],
    labels: ['飞鸟', '树叶', '小鱼', '莲花'],
    values: ['飞鸟', '小鱼'],
    materials: ['本题只比较飞鸟 / 树叶。', '本题只比较小鱼 / 莲花。'],
    explanation:
      '飞鸟、小鱼是动物词，树叶、莲花是植物相关词；不因此固定它们只能在哪个季节出现。',
  },
  {
    key: 'word-plant',
    prompts: [
      '指定的青草与青蛙，哪个是植物相关词？',
      '换看指定的莲花与雪人，哪个是植物相关词？',
    ],
    labels: ['青草', '青蛙', '莲花', '雪人'],
    values: ['青草', '莲花'],
    materials: ['本题只比较青草 / 青蛙。', '本题只比较莲花 / 雪人。'],
    explanation:
      '青草与青蛙有相同青字但意义不同，莲花是植物相关词，雪人不是植物。',
  },
  {
    key: 'name-interest',
    prompts: ['按虚构卡，谁喜欢画画？', '换看虚构卡，谁喜欢拼积木？'],
    labels: ['小安', '小禾'],
    values: ['小安', '小禾'],
    materials: [names, names],
    explanation:
      '只按所示虚构卡找信息，兴趣与性别无固定对应，不推断真实同学资料。',
  },
  {
    key: 'name-source',
    prompts: [
      '按原创情境，小安从什么材料认识朋友名字？',
      '换看原创情境，小禾从什么材料认识朋友名字？',
    ],
    labels: ['姓名卡', '写字本', '未显示的住址'],
    values: ['姓名卡', '写字本'],
    materials: [
      '本站原创虚构情境：小安看姓名卡，认识一个朋友名字。',
      '本站原创虚构情境：小禾看写字本，认识一个朋友名字。',
    ],
    explanation:
      '按给出的虚构材料辨认认识方式；自己真实同学名字只在纸面或现场交流，不录入网站。',
  },
  {
    key: 'proverb-time',
    prompts: [
      '按本页传统语句，一年之计联系什么？',
      '换看本页传统语句，一日之计联系什么？',
    ],
    labels: ['春', '晨', '夜晚'],
    values: ['春', '晨'],
    materials: [proverb, proverb],
    explanation:
      '两句分别提到春与晨，提醒早作安排；不表示其他时间不能学习或必须一大早完成所有学习。',
  },
  {
    key: 'proverb-meaning',
    prompts: [
      '光阴与金的语句主要提醒什么？',
      '寸金难买寸光阴，在这里怎样理解？',
    ],
    labels: ['珍惜时间', '不能用钱买回过去的时间', '可以买回过去的时间'],
    values: ['珍惜时间', '不能用钱买回过去的时间'],
    materials: [proverb, proverb],
    explanation:
      '这是珍惜时光的比喻，不是把每一段时间兑换金币，也不要求花钱学习。',
  },
  {
    key: 'proverb-plan',
    prompts: [
      '按虚构计划，先安排什么活动？',
      '按新的虚构计划，先安排什么活动？',
    ],
    labels: ['读一小段书', '休息一会儿', '一直不停读'],
    values: ['读一小段书', '休息一会儿'],
    materials: [
      '本站原创虚构计划：先读一小段书，再休息一会儿。',
      '本站原创虚构计划：先休息一会儿，再读一小段书。',
    ],
    explanation:
      '本题只找给出的先后顺序，两个合理计划都允许，不能把计划书写当活动已经完成。',
  },
  {
    key: 'talk-interest',
    prompts: ['按虚构对话，小安喜欢什么？', '按新的虚构对话，小禾喜欢什么？'],
    labels: ['画画', '拼积木', '要求别人改变喜好'],
    values: ['画画', '拼积木'],
    materials: [
      '本站原创对话：小安说，我喜欢画画。你喜欢什么？',
      '本站原创对话：小禾说，我喜欢拼积木。你喜欢什么？',
    ],
    explanation:
      '主动介绍兴趣，再听对方说，兴趣不同也可以交流，不强迫别人改喜好。',
  },
  {
    key: 'talk-listen',
    prompts: [
      '在这段虚构对话里，对方说完后适合怎样回应？',
      '换个虚构场景，谈话时关注对方可以怎样做？',
    ],
    labels: ['回应听到的兴趣', '朝向对方并倾听', '不停打断'],
    values: ['回应听到的兴趣', '朝向对方并倾听'],
    materials: [
      '本站原创场景：对方刚说自己喜欢画画，你已听完。',
      '本站原创场景：你正在听对方介绍兴趣。',
    ],
    explanation:
      '倾听、回应和朝向对方帮助交流；原书看眼睛提示可理解为关注对方，不强迫持续对视。',
  },
  {
    key: 'talk-real',
    prompts: [
      '按下面记录，哪项已经实际发生？',
      '换看新记录，哪项已经实际发生？',
    ],
    labels: ['已经向家长介绍兴趣', '已经听家长回应', '计划明天找朋友'],
    values: ['已经向家长介绍兴趣', '已经听家长回应'],
    materials: [
      '本站原创记录：刚刚已经向家长介绍兴趣；明天找朋友是计划。',
      '本站原创记录：刚刚已经听家长回应；明天找朋友是计划。',
    ],
    explanation: '仅按虚构记录区分实际与计划，网站不凭选对题确认孩子真实交谈。',
  },
  {
    key: 'reading-caller',
    prompts: [
      '按原书，最先叫老婆婆来帮忙的是谁？',
      '换看原书，叫小姑娘来帮忙的是谁？',
    ],
    labels: ['老公公', '老婆婆', '小狗'],
    values: ['老公公', '老婆婆'],
    materials: [reading, reading],
    explanation:
      '先后两次求助的人不同，回看71与72页印刷文字，不套另一版本人物名字。',
  },
  {
    key: 'reading-next',
    prompts: ['按原书，小姑娘叫谁来帮忙？', '换看原书，小狗叫谁来帮忙？'],
    labels: ['小狗', '小猫', '天空'],
    values: ['小狗', '小猫'],
    materials: [reading, reading],
    explanation:
      '按本版已印文字的求助顺序找信息；小猫后的省略不补造新的印刷原文。',
  },
  {
    key: 'reading-object',
    prompts: ['按原书，老公公种的是什么？', '按原书，最先去地里拔的是谁？'],
    labels: ['萝卜', '老公公', '梅花'],
    values: ['萝卜', '老公公'],
    materials: [reading, reading],
    explanation:
      '种的对象和最先行动的人分开看；故事阅读不要求真实拉扯人员或拔重物。',
  },
  {
    key: 'reading-result',
    prompts: [
      '按印刷文字，老公公独自尝试时怎样？',
      '换看第72页下方图画，最后图示怎样？',
    ],
    labels: ['拔不动', '萝卜已拔出', '文字已完整印出所有结尾'],
    values: ['拔不动', '萝卜已拔出'],
    materials: [
      reading,
      `${reading}本题只观察第72页下方结尾图，不把图示改称印刷结尾文字。`,
    ],
    explanation:
      '独自尝试的印刷信息是拔不动；结尾图示萝卜拔出。文字、图示与自己续讲必须分开。',
  },
  {
    key: 'reading-credit',
    prompts: ['第71页脚注明确的译者是谁？', '第71页脚注明确的作者是谁？'],
    labels: ['司徒贞', '阿·尼·托尔斯泰', '薛卫民'],
    values: ['司徒贞', '阿·尼·托尔斯泰'],
    materials: ['对照原书第71页脚注。', '对照原书第71页脚注。'],
    explanation: '作者与译者是不同署名，原书注明有改动，不把本站续讲当原译文。',
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
    hint: '先看指定材料和比较对象；阅读题先共读原书，自己的喜好与想法不强求固定答案。',
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
        `这里认${row[0]}；本园地新增会写女开关先，不从认字题增加会写。`,
        review,
      ),
    ),
    ...gardenFiveOppositePairs.map(([a, b], n) =>
      choice(
        `pair-${n}`,
        review
          ? `按本页指定的${a}/${b}这一对，${b}对应另一项是什么？`
          : `按本页指定的${a}/${b}这一对，${a}对应另一项是什么？`,
        [a, b],
        review ? a : b,
        `本页${a}/${b}成对积累，男女用语不推定能力、颜色、职业或兴趣；成对词不全当成同一类严格反义词。`,
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
    hint: '实际尝试后家长确认；没有材料或规范示范可暂时跳过。',
    explanation:
      '只记录真实尝试，不自动评读音、笔顺、表达或交友结果，计划不当已完成。',
  };
}
export const gardenFiveLesson: Lesson = {
  id,
  title: '语文园地五',
  textbookTitle: '语文园地五',
  page: 68,
  version: 1,
  status: 'available',
  goal: '认九字写女开关先，积累相对词与季节景物词；交流认识同学的方法，读惜时语句，练介绍倾听，与家长共读拔萝卜并续讲。',
  prerequisite:
    '请家长陪读，准备第68—72页原书与田字格纸；真实同学名字只在纸面或现场查看，不录入网站。',
  parentTip:
    '依据第三方公开原书实读68—72页制作，ISBN版印次未知，教师最终审校待完成。第70页交朋友与园地一起覆盖；虚构姓名卡练找信息，不收集真实姓名学校。现代故事作者译者按原脚注保留、全文原图录音外部共读；喜欢季节和续讲开放，实际交流与未来计划分开。',
  steps: [
    {
      title: '六组成对词分别看',
      text: '读南北、男女、开关、正反、先后、内外，再说自己知道的一组成对词。这些词表示不同关系，不全用同一套严格反义定义；男女只练词语，不据此推定谁适合什么颜色、职业、活动或兴趣。',
      activity: '与家长实际读六组，任选两组解释或再说类似用语。',
    },
    {
      title: '九个会认字放回词',
      text: '认男、女、关、正、反、先、后、内、外，放回男孩女孩、关门、正面反面、先后、内外等词。男女关正反先后内外共九字，南北开在这里复用，不自动增加本园地新认字。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '打乱九字顺序实际指读，再选两字放回词语。',
    },
    {
      title: '写女、开、关、先',
      text: '新增会写女、开、关、先。对照第68页逐笔和田字格示范看笔顺与位置，普通屏幕字体只供认字，不是描红或笔顺动画。不要把男后内外等会认字增加为本园地会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['女', '开', '关', '先'],
      },
      activity:
        '用田字格纸实际尝试写四字，家长查看真实纸面；缺示范或纸笔可跳过。',
    },
    {
      title: '读景物词，说喜欢的理由',
      text: '读春天夏天秋天冬天；大地树叶青草莲花、飞鸟小鱼青蛙雪人。季节名称与景物词分别看，再说最喜欢哪个季节及理由。选择与理由开放，各地气候、景物和活动可能不同，不强求冬天都能堆雪人或所有动物只出现在固定季节。',
      activity:
        '实际尝试读这些词，再对家长说自己的季节偏好及一个理由，允许不同答案。',
    },
    {
      title: '认识名字的方法，用虚构卡练',
      text: `${names}原书第69页交流认识哪些同学名字、怎样认识；可以通过卡片、写字本或当面介绍认识。真实姓名只在原书/纸面或现场说，不要求录入网站；找虚构卡信息与孩子真实交流是两项不同活动。`,
      activity:
        '现场与家长或熟悉同学说一种认识名字的方法，真实姓名不需要记录。',
    },
    {
      title: '读惜时语句，理解安排',
      text: `${proverb}\n原页未署个人作者，不补造署名。春与晨提醒早作安排，光阴与金是珍惜时间的比喻，不要求买课或把时间兑换金币。合理安排也包括休息；写出计划不等于已完成读书。`,
      activity:
        '家长陪读两组传统语句，用自己的话说一个意思或安排；实际朗读单独确认。',
    },
    {
      title: '交朋友，先试着介绍',
      text: '对照第70页，主动介绍自己、聊兴趣，再听对方说。本站用虚构小安、小禾示范，可以说喜欢画画或拼积木，不照搬真实名字学校。兴趣不同也能交流，不要求对方改变喜好或立刻成为朋友。',
      activity:
        '先实际向家长试一次简短介绍，可以用昵称或虚构角色；没说过只记录计划。',
    },
    {
      title: '关注对方，听完再回应',
      text: '原页提示主动交流、说话看对方眼睛，教学中理解为关注对方。可以朝向对方、看面部或用自己舒适的方式倾听，不强迫持续对视。听到兴趣后回应、问一个相关问题，真实交谈与未来打算分开记录，不凭选择题确认已交朋友。',
      activity:
        '实际进行一小段介绍—倾听—回应，与家长或熟悉伙伴即可；家长确认交流尝试。',
    },
    {
      title: '和家长读拔萝卜',
      text: reading,
      activity:
        '实际共读第71—72页，家长陪读反复出现的情节；缺原书可跳过，不预装另一版本全文。',
    },
    {
      title: '按已印文字找求助顺序',
      text: '回看原书已写部分：先是老公公尝试，再叫老婆婆；老婆婆叫小姑娘，小姑娘叫小狗，小狗叫小猫。按指定人物找谁叫谁，不把熟悉的另一版人名或顺序搬入。文字中的拔不动与最后图中的拔出属于不同材料。',
      activity: '用纸卡或口头实际复述已写的求助顺序，不模仿拉扯人或拔重物。',
    },
    {
      title: '图中结尾与自己续讲分开',
      text: '第72页在叫小猫帮忙后用省略号，问后来怎么样；下方图示更多伙伴参与、萝卜拔出。先说明已印文字写到哪里，再说图中看见什么，最后可以用自己的话续讲。自己的结尾是想法，不声称印刷正文已经完整写出；合作方式也允许不同表达。',
      activity:
        '与家长实际说一个续讲，明确是根据图示还是自己的想象；不复制现代原图。',
    },
    {
      title: '记录想法，保留真实尝试',
      text: '可以记录喜欢的季节、交流发现、续讲或还想练的问题。真实名字不用写，计划以后介绍/阅读不能算今天已做；开放表达与反思没有固定正确答案，家长可以代写。',
      activity: '写自己的发现或明确标为计划的下一步。',
    },
  ],
  questions: [
    ...objective(false),
    manual('recognize', '实际指读男女关正反先后内外九字，再选两字放回词语。'),
    manual(
      'pairs',
      '实际读南北男女开关正反先后内外六组，任选两组说意思或类似用语；不推定性别能力兴趣。',
    ),
    manual(
      'write',
      '按第68页规范示范用田字格纸实际尝试写女开关先，家长看字形、笔顺与位置。',
    ),
    manual(
      'words',
      '实际读第68页四季和大地树叶青草莲花飞鸟小鱼青蛙雪人等词语；家长确认尝试。',
    ),
    manual(
      'season',
      '实际向家长说喜欢哪个季节及一个理由，答案开放，不要求各地都有雪或同样物候。',
    ),
    manual(
      'names',
      '现场与家长或熟悉伙伴交流一种认识同学名字的方法；真实姓名学校不要录入网站。',
    ),
    manual(
      'proverb',
      '与家长实际读第69页两组传统语句，再交流珍惜时间或合理安排的意思。',
      proverb,
    ),
    manual(
      'intro',
      '实际向家长试一次简短自我介绍，可用昵称或虚构角色与兴趣；未来打算不当已经说过。',
    ),
    manual(
      'conversation',
      '实际进行一段介绍、倾听、回应的交流，用舒适方式关注对方；只确认尝试，不自动认定已经交到朋友。',
    ),
    manual(
      'read',
      '与家长实际共读第71—72页拔萝卜，按本版原文找信息，不用另一版补造正文。',
      reading,
    ),
    manual(
      'retell',
      '与家长实际复述已写求助顺序，再参考第72页图或自己的想法续讲，明确已印文字/图示/自拟内容。',
      reading,
    ),
    {
      id: `${id}-reflect-expression`,
      knowledge: `${id}-reflect-expression`,
      prompt:
        '记录季节偏好、交流发现或自己续讲的想法；不用真实姓名学校，计划请明确为计划。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，原书信息与自拟想法分开。',
      explanation: '保留原话，正确性为null，不自动确认计划已完成。',
    },
    {
      id: `${id}-reflect-practice`,
      knowledge: `${id}-reflect-practice`,
      prompt: '记录一个还想练的字、朗读、交流或共读问题。',
      rule: { kind: 'reflection' },
      hint: '家长可以代写，不要求固定答案。',
      explanation: '开放反思不自动评分，不自动认定掌握。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书五页栏目与原创教学范围校验',
    notes:
      '实读第三方公开预览68—72页，九会认四会写、成对词、四季景物、姓名认识方式、传统惜时语句、交朋友与拔萝卜共读完整覆盖栏目。未知ISBN版印次不补造；故事按阿·尼·托尔斯泰/司徒贞改选，现代全文原图录音不打包，文字/图示/续讲分开。实际读写交流人工确认、反思null、计划不当完成；教师最终审校及全年完成仍待逐项验收。',
  },
};
