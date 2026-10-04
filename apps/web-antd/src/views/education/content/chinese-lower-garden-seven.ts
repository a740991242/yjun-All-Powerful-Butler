import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  reviewLabels?: string[];
  explanation: string;
  material: string;
};
type Entry = {
  itemId: string;
  goal: string;
  title: string;
  pages: number[];
  recognize: string;
  write: string;
  author: null | string;
  sourceCredit: string;
  newRadicals: string[];
  additionalReadings: string;
  pairs: Pair[];
  reciteRequired: boolean;
  steps: Lesson['steps'];
  actual: [string, string][];
  reflections: string[];
};
const recognitionRows: Record<string, [string, string, string][]> = {
  'u7-5': [
    ['刷', '牙刷中的第2个字是哪项？', '换词语：刷牙中的第1个字是哪项？'],
    ['梳', '梳子中的第1个字是哪项？', '换词语：梳头中的第1个字是哪项？'],
    ['巾', '毛巾中的第2个字是哪项？', '换词语：纸巾中的第2个字是哪项？'],
    ['皂', '香皂中的第2个字是哪项？', '换词语：肥皂中的第2个字是哪项？'],
    ['洗', '洗澡中的第1个字是哪项？', '换词语：洗脸中的第1个字是哪项？'],
    ['澡', '洗澡中的第2个字是哪项？', '换词语：澡盆中的第1个字是哪项？'],
    ['脸', '洗脸中的第2个字是哪项？', '换词语：脸盆中的第1个字是哪项？'],
    ['盆', '脸盆中的第2个字是哪项？', '换词语：水盆中的第2个字是哪项？'],
  ],
};
const entries: Entry[] = [
  {
    itemId: 'u7-5',
    title: '语文园地七',
    pages: [93, 94, 95, 96, 97],
    recognize: '刷梳巾皂洗澡脸盆',
    write: '巾洗',
    author: null,
    sourceCredit: '日积月累按原页署名；狐狸和乌鸦根据《伊索寓言》相关内容改写',
    newRadicals: ['立刀旁'],
    additionalReadings: '',
    reciteRequired: false,
    goal: '认识八字、写巾洗与立刀旁，读用品动作和偏旁字组，想象说话，练复用字书写，积累古句，听后讲故事，完成两页共读。',
    pairs: [
      {
        key: 'hygiene-0',
        prompts: ['原页牙刷对应哪个动作？', '换方向：原页刷牙对应哪个用品？'],
        values: ['刷牙', '牙刷'],
        labels: ['刷牙', '牙刷', '任意项都相同'],
        explanation:
          '本题按教材五组例子对应；现实用品可能有其他用途，不能据本题要求实际使用。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'hygiene-1',
        prompts: ['原页梳子对应哪个动作？', '换方向：原页梳头对应哪个用品？'],
        values: ['梳头', '梳子'],
        labels: ['梳头', '梳子', '任意项都相同'],
        explanation:
          '本题按教材五组例子对应；现实用品可能有其他用途，不能据本题要求实际使用。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'hygiene-2',
        prompts: ['原页毛巾对应哪个动作？', '换方向：原页擦手对应哪个用品？'],
        values: ['擦手', '毛巾'],
        labels: ['擦手', '毛巾', '任意项都相同'],
        explanation:
          '本题按教材五组例子对应；现实用品可能有其他用途，不能据本题要求实际使用。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'hygiene-3',
        prompts: ['原页香皂对应哪个动作？', '换方向：原页洗澡对应哪个用品？'],
        values: ['洗澡', '香皂'],
        labels: ['洗澡', '香皂', '任意项都相同'],
        explanation:
          '本题按教材五组例子对应；现实用品可能有其他用途，不能据本题要求实际使用。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'hygiene-4',
        prompts: ['原页脸盆对应哪个动作？', '换方向：原页洗脸对应哪个用品？'],
        values: ['洗脸', '脸盆'],
        labels: ['洗脸', '脸盆', '任意项都相同'],
        explanation:
          '本题按教材五组例子对应；现实用品可能有其他用途，不能据本题要求实际使用。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'radical',
        prompts: [
          '刷上方红标偏旁名称是哪项？',
          '换对象：本页哪个会认字标了立刀旁？',
        ],
        values: ['立刀旁', '刷'],
        labels: ['立刀旁', '刷', '任意项都相同'],
        explanation: '刂按本册名称表称立刀旁，不增加其他字的认写要求。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'writing',
        prompts: [
          '巾与刷中，本园地新增会写字是哪项？',
          '换字：洗与澡中，新增会写字是哪项？',
        ],
        values: ['巾', '洗'],
        labels: ['巾', '刷'],
        reviewLabels: ['洗', '澡'],
        explanation: '新增两写巾洗，房老着包只为已学字复用。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'group-0',
        prompts: [
          '蝴蝶、蜻蜓、蚂蚁里共同观察哪个偏旁？',
          '换组：鸡、鸭、鸦共同观察哪个偏旁？',
        ],
        values: ['虫字旁', '鸟字旁'],
        labels: ['虫字旁', '鸟字旁', '任意项都相同'],
        explanation: '按原页例字观察，大多有关不等于所有虫旁字都是昆虫。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'group-1',
        prompts: [
          '猫、猴、狮里共同观察哪个偏旁？',
          '换组：鸡、鸭、鸦里共同观察哪个偏旁？',
        ],
        values: ['反犬旁', '鸟字旁'],
        labels: ['反犬旁', '鸟字旁', '任意项都相同'],
        explanation:
          '偏旁帮助联系字义，是已学字复用；马鱼旁提示另行观察，不扩新字。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'order',
        prompts: [
          '房、老、着、包的本页笔顺提示是哪项？',
          '换问题：这四字属于新增两写还是已学字复用？',
        ],
        values: ['先外后内', '已学字复用'],
        labels: ['先外后内', '已学字复用', '任意项都相同'],
        explanation:
          '本页提示左上包围、右上包围先外后内，具体笔顺看原书或教师示范。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-0',
        prompts: [
          '原页词语花朵中第一个字是哪项？',
          '换读词：以花开头的本页完整词是哪项？',
        ],
        values: ['花', '花朵'],
        labels: ['花', '花朵', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-1',
        prompts: [
          '原页词语笑声中第一个字是哪项？',
          '换读词：以笑开头的本页完整词是哪项？',
        ],
        values: ['笑', '笑声'],
        labels: ['笑', '笑声', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-2',
        prompts: [
          '原页词语阳光中第一个字是哪项？',
          '换读词：以阳开头的本页完整词是哪项？',
        ],
        values: ['阳', '阳光'],
        labels: ['阳', '阳光', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-3',
        prompts: [
          '原页词语草地中第一个字是哪项？',
          '换读词：以草开头的本页完整词是哪项？',
        ],
        values: ['草', '草地'],
        labels: ['草', '草地', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-4',
        prompts: [
          '原页词语告诉中第一个字是哪项？',
          '换读词：以告开头的本页完整词是哪项？',
        ],
        values: ['告', '告诉'],
        labels: ['告', '告诉', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-5',
        prompts: [
          '原页词语歌唱中第一个字是哪项？',
          '换读词：以歌开头的本页完整词是哪项？',
        ],
        values: ['歌', '歌唱'],
        labels: ['歌', '歌唱', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-6',
        prompts: [
          '原页词语跑步中第一个字是哪项？',
          '换读词：以跑开头的本页完整词是哪项？',
        ],
        values: ['跑', '跑步'],
        labels: ['跑', '跑步', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'word-7',
        prompts: [
          '原页词语喜欢中第一个字是哪项？',
          '换读词：以喜开头的本页完整词是哪项？',
        ],
        values: ['喜', '喜欢'],
        labels: ['喜', '喜欢', '任意项都相同'],
        explanation:
          '先实际读八词，再任选几个想象说话；选择题不能代替开放表达。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'quote-0',
        prompts: [
          '原页“不知则问，不能则学。”署名是哪项？',
          '换句：“一日无书，百事荒芜。”署名是哪项？',
        ],
        values: ['《荀子》', '陈寿'],
        labels: ['《荀子》', '陈寿', '任意项都相同'],
        explanation:
          '按教材署名读积累，古句的万是表达，不是必须完成一万本/一万里的任务。',
        material:
          '第94页古句：不知则问，不能则学。—《荀子》；一日无书，百事荒芜。—陈寿；读万卷书，行万里路。—董其昌。',
      },
      {
        key: 'quote-1',
        prompts: [
          '原页“一日无书，百事荒芜。”署名是哪项？',
          '换句：“读万卷书，行万里路。”署名是哪项？',
        ],
        values: ['陈寿', '董其昌'],
        labels: ['陈寿', '董其昌', '任意项都相同'],
        explanation:
          '按教材署名读积累，古句的万是表达，不是必须完成一万本/一万里的任务。',
        material:
          '第94页古句：不知则问，不能则学。—《荀子》；一日无书，百事荒芜。—陈寿；读万卷书，行万里路。—董其昌。',
      },
      {
        key: 'quote-2',
        prompts: [
          '原页“读万卷书，行万里路。”署名是哪项？',
          '换句：“不知则问，不能则学。”署名是哪项？',
        ],
        values: ['董其昌', '《荀子》'],
        labels: ['董其昌', '《荀子》', '任意项都相同'],
        explanation:
          '按教材署名读积累，古句的万是表达，不是必须完成一万本/一万里的任务。',
        material:
          '第94页古句：不知则问，不能则学。—《荀子》；一日无书，百事荒芜。—陈寿；读万卷书，行万里路。—董其昌。',
      },
      {
        key: 'oral-help',
        prompts: [
          '听故事时，本页建议借助什么记内容？',
          '换任务：讲故事时，要让听者怎样？',
        ],
        values: ['借助图画', '听清声音'],
        labels: ['借助图画', '听清声音', '任意项都相同'],
        explanation: '看图与倾听、讲述是不同实际任务，不用文字选择评声音。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'fox-first',
        prompts: ['第96页乌鸦嘴里叼着哪项？', '换到97页：狐狸最后叼走哪项？'],
        values: ['一片肉', '掉下来的肉'],
        labels: ['一片肉', '掉下来的肉', '任意项都相同'],
        explanation: '同一物品在故事中状态与持有者变化，按两页线索找。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'fox-answer',
        prompts: ['狐狸第一次问好时乌鸦怎样？', '换到后来夸赞之后：乌鸦怎样？'],
        values: ['没有回答', '开口唱歌'],
        labels: ['没有回答', '开口唱歌', '任意项都相同'],
        explanation: '按故事前后两种反应理解，不把所有赞美当骗局。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
      {
        key: 'fox-result',
        prompts: ['乌鸦开口唱歌时发生什么？', '换到结尾：狐狸拿到肉后怎样？'],
        values: ['肉掉下来了', '叼起肉跑掉'],
        labels: ['肉掉下来了', '叼起肉跑掉', '任意项都相同'],
        explanation: '先后因果按故事，不要求真实喂动物或复演叼物。',
        material:
          '先观察原书93—97页指定栏目，本站卡片与问答为原创组织；原图与现代全文外部共读。',
      },
    ],
    steps: [
      {
        title: '八认两写与立刀旁',
        text: '93页会认刷梳巾皂洗澡脸盆，会写巾洗；刷上方标刂，本册名称表称立刀旁。会认、会写范围分开，网页普通字体只供认字，实际发音由家长听。',
        activity: '实际指读八字并观察刷。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['刷', '梳', '巾', '皂', '洗', '澡', '脸', '盆'],
        },
      },
      {
        title: '五组用品和动作',
        text: '牙刷—刷牙，梳子—梳头，毛巾—擦手，香皂—洗澡，脸盆—洗脸。先看原书卫生间图，再读用品与动作，比较名称和做什么；现实用途可能不止一种，本题按教材例子练，不要求购买用品。',
        activity: '实际读五组词。',
      },
      {
        title: '偏旁联系字义',
        text: '93页复用虫字旁的蝴蝶蜻蜓蚂蚁、鸟字旁的鸡鸭鸦、反犬旁的猫猴狮。说共同部件和自己的发现；虫旁大多与虫有关，不说所有都是昆虫。原页还提示马字旁、鱼字旁，可以观察已认识的例字，不扩大本园地八认两写。',
        activity: '实际读三组并交流发现。',
      },
      {
        title: '八词读一读',
        text: '花朵、笑声、阳光、草地、告诉、歌唱、跑步、喜欢。先实际读词语，区分声音、景物和动作等意思，暂时读不顺可请家长示范。',
        activity: '实际读八词。',
      },
      {
        title: '选词想象说几句话',
        text: '按94页从八词选几个，展开想象说几句话；情境和组合可以不同。本站原创组织例：想象纸偶在草地上看花朵，听到笑声。示例只帮助起头，不当原书句子或唯一答案；家长倾听内容。',
        activity: '实际选词想象说话。',
      },
      {
        title: '已学字：房老着包',
        text: '94页书写提示复用房、老、着、包，左上包围和右上包围的字先外后内。先观察原书逐笔与田字格，再实际纸面练；网页字体不当描红示范。这四字不加入新增两写清单。',
        activity: '实际纸面练复用四字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['房', '老', '着', '包'],
        },
      },
      {
        title: '新增两字：巾洗',
        text: '对照93页规范示范，实际写巾、洗，观察笔画与位置。书写提示复用字和本园地新增会写字分别练，不把所有卫生用品词都要求写。',
        activity: '实际纸面写巾洗。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['巾', '洗'],
        },
      },
      {
        title: '三句积累与理解',
        text: '不知则问，不能则学。—《荀子》；一日无书，百事荒芜。—陈寿；读万卷书，行万里路。—董其昌。按94页读，结合提问、学习、读书说一个理解；万是古句表达，不是必须完成的固定本数里数。本园地没有新增必背要求。',
        activity: '实际读三句并说理解。',
      },
      {
        title: '听故事：图画帮助记忆',
        text: '95页《小猫种鱼》六图：前四图小猫看人播种或收获，最后两图小猫埋鱼并想象收获。先边看原图边听老师或家长依据合法故事材料讲；具体教师讲述原文未核验，本站不编造原文台词。原图帮助记忆，不当实际种鱼操作。没有故事材料可先跳过，之后补听。',
        activity: '实际看六图并听故事。',
      },
      {
        title: '讲故事：让别人听清',
        text: '听完后借原页六图，自己讲《小猫种鱼》，用自己的话说先后。调整声音，让伙伴听清，再听伙伴回应；不以选对一题判实际声音。本站只组织讲述，原图和外部讲述不打包。',
        activity: '实际借图讲故事并听反馈。',
      },
      {
        title: '共读96页：第一次问好',
        text: '与大人实际共读96页《狐狸和乌鸦》开篇：乌鸦嘴叼一片肉，狐狸问好，乌鸦没有回答。找角色、物品与第一次反应。原书脚注说根据伊索寓言相关内容改写；现代改写全文原画声音外部共读。',
        activity: '实际共读96页。',
      },
      {
        title: '共读97页：变化与结尾',
        text: '继续实际共读97页：问孩子好仍没回答，夸赞羽毛和嗓子后乌鸦开口唱，肉掉下，狐狸叼走。比较前后，交流为什么结果改变；不同理解可以说，不把所有赞美都当骗局。',
        activity: '实际共读97页并交流发现。',
      },
      {
        title: '回顾与未来计划',
        text: '说一个认字、书写、讲故事或共读发现，轮流倾听。实际读写说听分别确认，缺资料可如实跳过；下一次想练的事另记计划。',
        activity: '实际回顾并倾听。',
      },
    ],
    actual: [
      ['recognize', '实际指读八会认字。'],
      ['radical', '实际观察刷的立刀旁。'],
      ['hygiene', '实际读五组用品和动作词。'],
      ['groups', '实际读三组偏旁字并交流发现。'],
      ['words', '实际读八个词语。'],
      ['imagine', '实际选几个词想象说几句话，表达可不同。'],
      ['write-reused', '实际纸面练房老着包四个复用字。'],
      ['write', '实际纸面写巾洗两个新增字。'],
      ['quotes', '实际读三句古句并说理解。'],
      ['listen-story', '实际边看六图边听小猫种鱼故事。'],
      ['tell-story', '实际借图讲小猫种鱼，让听者听清。'],
      ['feedback', '实际倾听讲故事伙伴的反馈。'],
      ['read-first', '实际共读狐狸和乌鸦96页。'],
      ['read-second', '实际共读狐狸和乌鸦97页。'],
      ['exchange', '实际交流共读或本园地发现并倾听。'],
    ],
    reflections: [
      '记录本次认字、写字或词语表达的一个发现。',
      '记录本次实际听讲故事或共读的体验，未尝试可如实说明。',
      '下一次想练什么？这是未来计划。',
    ],
  },
];
export const lowerGardenSevenSource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const lowerGardenSevenPageAudits = entries.map((e) => ({
  itemId: e.itemId,
  pages: e.pages,
  recognize: e.recognize,
  write: e.write,
  author: e.author,
  sourceCredit: e.sourceCredit,
  newRadicals: e.newRadicals,
  additionalReadings: e.additionalReadings,
  reciteRequired: e.reciteRequired,
}));
function makeLesson(e: Entry): Lesson {
  const id = `cl-${e.itemId}`;
  const choice = (
    key: string,
    prompt: string,
    labels: string[],
    value: string,
    explanation: string,
    review: boolean,
    material?: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先看指定字词与原书信息，需要时请家长帮读。',
    explanation,
  });
  const objective = (review: boolean): Question[] => [
    ...required(recognitionRows[e.itemId]).map((r, i) =>
      choice(
        `char-${i}`,
        r[review ? 2 : 1],
        required(recognitionRows[e.itemId]).map((x) => x[0]),
        r[0],
        '按指定词语认字，会认与会写清单分开，实际声音需另行确认。',
        review,
      ),
    ),
    ...e.pairs.map((p) =>
      choice(
        p.key,
        p.prompts[review ? 1 : 0],
        review ? (p.reviewLabels ?? p.labels) : p.labels,
        p.values[review ? 1 : 0],
        p.explanation,
        review,
        p.material,
      ),
    ),
  ];
  return {
    id,
    title: e.title,
    textbookTitle: e.title,
    page: required(e.pages[0]),
    status: 'available',
    version: 2,
    goal: e.goal,
    prerequisite: `准备第${e.pages.join('—')}页原书与田字格纸，可由家长陪读。`,
    parentTip: `${e.sourceCredit}。请先准备原书、纸笔，陪孩子听示范、读一读、说一说。课文可分段练，实际读写完成后再确认；没有材料可暂时跳过，下一次想做的事另记为计划。`,
    steps: e.steps,
    questions: [
      ...objective(false),
      ...e.actual.map(([key, prompt]): Question => ({
        id: `${id}-manual-${key}`,
        knowledge: `${id}-manual-${key}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '实际尝试后确认，缺书、示范或纸笔可以暂时跳过。',
        explanation:
          '实际读背写说与客观答案分开，不自动评发音字迹，正确性null；计划不当已完成。',
      })),
      ...e.reflections.map((prompt, i): Question => ({
        id: `${id}-reflect-${i}`,
        knowledge: `${id}-reflect-${i}`,
        prompt,
        rule: { kind: 'reflection' },
        hint: '自己的话，家长可代写。',
        explanation:
          '保留原话、正确性null，开放表达不唯一判分，未来计划不当完成。',
      })),
    ],
    reviewQuestions: objective(true),
    review: {
      date: '2026-10-01',
      reviewer: '下册原书课文与活动范围校验',
      notes: `实际查看第三方原书公开预览（${lowerGardenSevenSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以本单元课文开放声明下册或全年完成。`,
    },
  };
}
export const lowerGardenSevenLessons: Record<string, Lesson> =
  Object.fromEntries(entries.map((e) => [e.itemId, makeLesson(e)]));
