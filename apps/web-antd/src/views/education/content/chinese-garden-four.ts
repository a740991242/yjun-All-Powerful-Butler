import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { unitFourPageAudits } from './chinese-unit-four';

export const gardenFourPageAudit = required(
  unitFourPageAudits.find((a) => a.itemId === 'u4-6'),
);
const id = 'cu-u4-6';
const characters = [
  ['晚', '晚上中的第一个字。', '晚饭中的第一个字。'],
  ['昨', '昨天中的第一个字。', '昨日中的第一个字。'],
  ['今', '今天中的第一个字。', '今年中的第一个字。'],
  ['明', '明天中的第一个字。', '明年中的第一个字。'],
  ['个', '上个月中的第二个字。', '一个人中的第二个字。'],
  ['这', '这个月中的第一个字。', '这里中的第一个字。'],
  ['去', '去年中的第一个字。', '过去中的第二个字。'],
  ['年', '去年中的第二个字。', '今年中的第二个字。'],
];
const poem =
  '《悯农（其二）》\n[唐] 李绅\n锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。';
const reading =
  '先与家长共读教材印刷第59页《小鸟念书》，再回看课文找信息。本站不提供现代作品全文、原画或录音；没有原书可跳过，不凭标题猜内容。风教鸟念书是故事中的拟人，不表示风或鸟实际会阅读。';
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
    key: 'time-day',
    prompts: [
      '在同一天的上午、下午、晚上中，哪段时间在下午之后？',
      '换看同一天，哪段时间在下午之前？',
    ],
    labels: ['上午', '下午', '晚上'],
    values: ['晚上', '上午'],
    explanation:
      '同一天上午在下午前，晚上在下午后；不把前一天的晚上混入这一组。',
  },
  {
    key: 'time-date',
    prompts: [
      '以今天为参照，刚过去的一天叫什么？',
      '以今天为参照，接下来的一天叫什么？',
    ],
    labels: ['昨天', '今天', '明天'],
    values: ['昨天', '明天'],
    explanation:
      '昨天是今天之前的一天，明天是今天之后的一天；参照日期改变时叫法也会改变。',
  },
  {
    key: 'time-month',
    prompts: [
      '以这个月为参照，接下来的一个月叫什么？',
      '以这个月为参照，刚过去的一个月叫什么？',
    ],
    labels: ['上个月', '这个月', '下个月'],
    values: ['下个月', '上个月'],
    explanation:
      '上一月与下一月都以指定的这个月为参照；不要求填写真实生日或家庭日期。',
  },
  {
    key: 'time-year',
    prompts: [
      '以今年为参照，刚过去的一年叫什么？',
      '以今年为参照，接下来的一年叫什么？',
    ],
    labels: ['去年', '今年', '明年'],
    values: ['去年', '明年'],
    explanation: '去年在今年之前，明年在今年之后；这些相对词不是固定公历年份。',
  },
  {
    key: 'compare-medial',
    prompts: [
      '比较yǎn、yuǎn，哪个中间多写了u？',
      '再比较这两个，哪个没有写中间的u？',
    ],
    labels: ['yǎn', 'yuǎn'],
    values: ['yuǎn', 'yǎn'],
    materials: ['yǎn / yuǎn', 'yuǎn / yǎn'],
    explanation:
      '这里只比较完整拼写，yuǎn多写u，不能因此把整体音节机械拆读。实际发音另听示范。',
  },
  {
    key: 'compare-ending',
    prompts: ['比较yīn、yīng，哪项末尾有g？', '换看这两个，哪项末尾没有g？'],
    labels: ['yīn', 'yīng'],
    values: ['yīng', 'yīn'],
    materials: ['yīn / yīng', 'yīng / yīn'],
    explanation: 'yīng末尾有g，yīn没有；字形题不能代替前后鼻音听辨。',
  },
  {
    key: 'compare-middle',
    prompts: ['比较jiǎn、juǎn，哪项中间写i？', '换看这两个，哪项中间写u？'],
    labels: ['jiǎn', 'juǎn'],
    values: ['jiǎn', 'juǎn'],
    materials: ['jiǎn / juǎn', 'juǎn / jiǎn'],
    explanation:
      'jiǎn写i，juǎn书写u对应省点后的ü；不能按表面字母把韵母当普通u。',
  },
  {
    key: 'compare-initial',
    prompts: ['比较zuān、zhuān，哪项声母写zh？', '换看这两个，哪项声母写z？'],
    labels: ['zuān', 'zhuān'],
    values: ['zhuān', 'zuān'],
    materials: ['zuān / zhuān', 'zhuān / zuān'],
    explanation: '分别看z与zh，不漏h；真实平翘舌发音请跟标准示范。',
  },
  {
    key: 'compare-three',
    prompts: [
      '在指定的三个音节中，哪项以ng结尾？',
      '换看这三个，哪项既没有中间u，也没有结尾g？',
    ],
    labels: ['chán', 'chuán', 'chuáng'],
    values: ['chuáng', 'chán'],
    materials: ['chán / chuán / chuáng', 'chuáng / chuán / chán'],
    explanation:
      'chuáng带ng，chuán有u但无g，chán没有u和g；条件不同要重新选择。',
  },
  {
    key: 'word-ie-ei',
    prompts: [
      '看指定音节xié，其中韵母是ie还是ei？',
      '换成指定音节léi，其中韵母是ie还是ei？',
    ],
    labels: ['ie', 'ei'],
    values: ['ie', 'ei'],
    materials: ['xié zi，观察xié。', 'dǎ léi，观察léi。'],
    explanation:
      'xié对应ie，léi对应ei，两个字母的顺序不同。实际词语朗读另由家长陪同。',
  },
  {
    key: 'word-iu-ui',
    prompts: [
      '看指定音节chuī，其中韵母是iu还是ui？',
      '换成指定音节diū，其中韵母是iu还是ui？',
    ],
    labels: ['iu', 'ui'],
    values: ['ui', 'iu'],
    materials: ['chuī qì qiú，观察chuī。', 'diū shǒu juàn，观察diū。'],
    explanation: 'chuī对应ui，diū对应iu，顺序不同，调号在后一个元音上。',
  },
  {
    key: 'outing-object-0',
    prompts: ['看拼音，选择对应物品名称。', '换一个拼音，选择对应物品名称。'],
    labels: ['帽子', '水壶', '面包'],
    values: ['帽子', '水壶'],
    materials: ['mào zi', 'shuǐ hú'],
    explanation:
      'mào zi是帽子，shuǐ hú是水壶；这里只认读物品，不判断每次秋游都必须带什么。',
  },
  {
    key: 'outing-object-1',
    prompts: ['按本题拼音找物品名称。', '按新拼音重新找物品名称。'],
    labels: ['面包', '饼干', '跳棋'],
    values: ['面包', '饼干'],
    materials: ['miàn bāo', 'bǐng gān'],
    explanation:
      '分别是面包、饼干。真实携带物品应按活动安排讨论，不把读词题变成固定清单。',
  },
  {
    key: 'outing-object-2',
    prompts: ['读指定拼音，选择物品名称。', '读新的指定拼音，选择物品名称。'],
    labels: ['雨伞', '望远镜', '水彩笔'],
    values: ['雨伞', '望远镜'],
    materials: ['yǔ sǎn', 'wàng yuǎn jìng'],
    explanation: '分别是雨伞、望远镜；想带什么与为什么带属于开放表达。',
  },
  {
    key: 'table-initial',
    prompts: ['比较b与ai，哪项在声母组？', '换成m与ao，哪项在声母组？'],
    labels: ['b', 'ai', 'm', 'ao'],
    values: ['b', 'm'],
    materials: ['本题只比较b / ai。', '本题只比较m / ao。'],
    explanation:
      'b、m属于声母，ai、ao属于韵母；按本题指定一对选择，不从其他选项凑答案。',
  },
  {
    key: 'table-final',
    prompts: ['比较er与zhi，哪项在韵母组？', '比较an与chi，哪项在韵母组？'],
    labels: ['er', 'zhi', 'an', 'chi'],
    values: ['er', 'an'],
    materials: ['本题只比较er / zhi。', '本题只比较an / chi。'],
    explanation: 'er、an列在韵母组；zhi、chi列在整体认读音节组。',
  },
  {
    key: 'table-whole',
    prompts: [
      '比较yun与un，哪项属于整体认读音节？',
      '比较ying与ing，哪项属于整体认读音节？',
    ],
    labels: ['yun', 'un', 'ying', 'ing'],
    values: ['yun', 'ying'],
    materials: ['本题只比较yun / un。', '本题只比较ying / ing。'],
    explanation:
      'yun、ying是整体认读音节，un、ing是韵母，完整写法与分类分开看。',
  },
  {
    key: 'car-place',
    prompts: [
      '等车、乘车出发常说的地方是哪一个词？',
      '车上供人乘坐的部分是哪一个词？',
    ],
    labels: ['车站', '车厢', '上车'],
    values: ['车站', '车厢'],
    explanation:
      '车站与车厢含义不同，上车是动作；这组词围绕车积累，不是都指车的种类。',
  },
  {
    key: 'car-action',
    prompts: [
      '进入车里，常用本组哪个词？',
      '在车上乘坐、出行，常用本组哪个词？',
    ],
    labels: ['上车', '坐车', '火车'],
    values: ['上车', '坐车'],
    explanation: '上车、坐车表达动作，火车是车辆名称；再说自己的同类词也可以。',
  },
  {
    key: 'fill-0',
    prompts: [
      '按拼音填已有汉字：mén kǒu，门□。',
      '换个词按拼音填：rén kǒu，人□。',
    ],
    labels: ['口', '日', '目', '田'],
    values: ['口', '口'],
    explanation: 'kǒu写口，门口和人口都用口；这里只认已有字，实际纸笔另确认。',
  },
  {
    key: 'fill-1',
    prompts: [
      '按拼音填已有汉字：shēng rì，生□。',
      '换个词按拼音填：rì chū，□出。',
    ],
    labels: ['口', '日', '目', '田'],
    values: ['日', '日'],
    explanation: 'rì写日，不与目混同；生日、日出中的日是已学汉字。',
  },
  {
    key: 'fill-2',
    prompts: [
      '按拼音填已有汉字：tí mù，题□。',
      '换个词按拼音填：mù guāng，□光。',
    ],
    labels: ['口', '日', '目', '田'],
    values: ['目', '目'],
    explanation: '本题给mù，应写目；拼音条件避免把目光和日光混成同一答案。',
  },
  {
    key: 'fill-3',
    prompts: [
      '按拼音填已有汉字：tián yě，□野。',
      '换个词按拼音填：shuǐ tián，水□。',
    ],
    labels: ['口', '日', '目', '田'],
    values: ['田', '田'],
    explanation: 'tián写田，田野与水田里都用田；新词不是新增汉字会写要求。',
  },
  {
    key: 'poem-time',
    prompts: [
      '《悯农（其二）》开头写的劳动时间是什么？',
      '换看第二句，汗滴到了哪里？',
    ],
    labels: ['中午', '禾下的土', '夜晚'],
    values: ['中午', '禾下的土'],
    materials: [poem, poem],
    explanation: '日当午写中午，下一句写汗滴禾下土，回看指定句的信息。',
  },
  {
    key: 'poem-food',
    prompts: ['诗中“盘中餐”指什么？', '“粒粒皆辛苦”让我们关注什么？'],
    labels: ['盘中的饭食', '粮食背后的劳动', '天空的白云'],
    values: ['盘中的饭食', '粮食背后的劳动'],
    materials: [poem, poem],
    explanation:
      '饭食与劳动相联系，诗提醒理解劳动、珍惜粮食；不把体力劳动场景要求成孩子亲自完成。',
  },
  {
    key: 'poem-author',
    prompts: ['这首诗的作者是谁？', '这首诗所注明的朝代是什么？'],
    labels: ['李绅', '唐', '骆宾王'],
    values: ['李绅', '唐'],
    materials: [poem, poem],
    explanation: '原书明确署[唐]李绅；作者与朝代是两个不同信息。',
  },
  {
    key: 'poem-title',
    prompts: ['本页古诗的题目是哪一个？', '本页《悯农》的括号中标的是哪一首？'],
    labels: ['悯农', '其二', '咏鹅'],
    values: ['悯农', '其二'],
    materials: [poem, poem],
    explanation: '题目是悯农，注明其二，不与此前咏鹅混同。',
  },
  {
    key: 'reading-sound',
    prompts: [
      '《小鸟念书》中，窗外的风发出哪种声音？',
      '《小鸟念书》中，窗外的鸟发出哪种声音？',
    ],
    labels: ['淅淅沙沙', '叽叽喳喳', '轰隆隆'],
    values: ['淅淅沙沙', '叽叽喳喳'],
    materials: [reading, reading],
    explanation:
      '按故事材料对应风声、鸟声。拟声词是文学表达，不要求所有现实风声或鸟声相同。',
  },
  {
    key: 'reading-person',
    prompts: [
      '《小鸟念书》中，谁说风也在教小鸟念书？',
      '《小鸟念书》中，听了以后谁都笑了？',
    ],
    labels: ['老师', '孩子们', '窗户'],
    values: ['老师', '孩子们'],
    materials: [reading, reading],
    explanation:
      '按原书分别找说话的人和笑了的人；不借小鸟念错的幽默取笑孩子真实朗读错误。',
  },
  {
    key: 'reading-follow',
    prompts: [
      '《小鸟念书》中，老师念一句，孩子们怎样读？',
      '老师玩笑中的风在教谁念书？',
    ],
    labels: ['跟着念一句', '小鸟', '没有人读'],
    values: ['跟着念一句', '小鸟'],
    materials: [reading, reading],
    explanation:
      '教室里实际跟读与窗外的拟人玩笑是两个层次，不把鸟实际鸣叫当成识字阅读。',
  },
];

const choose = (
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
  hint: '先看本题材料和参照范围；阅读题先共读原书，实际读写另行确认。',
  explanation,
});
function objective(review: boolean): Question[] {
  const index = review ? 1 : 0;
  return [
    ...characters.map((row, n) =>
      choose(
        `char-${n}`,
        required(row[index + 1]),
        characters.map((r) => required(r[0])),
        required(row[0]),
        `这里认${row[0]}；本园地新增会写只有个、去，不能据认字题增加其他会写。`,
        review,
      ),
    ),
    ...pairs.map((q) =>
      choose(
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
    id: `${id}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '实际活动完成后由家长确认；没有原书或规范示范可跳过。',
    explanation:
      '只记录实际尝试，不自动评声音、笔顺、交流质量，也不把未来计划当完成。',
  };
}
export const gardenFourLesson: Lesson = {
  id,
  title: '语文园地四',
  textbookTitle: '语文园地四',
  page: 56,
  version: 1,
  status: 'available',
  goal: '认时间词，写个去；比较拼音并表达秋游想法，积累车字词语、填写已学字，与家长读古诗和小鸟念书。',
  prerequisite:
    '已尝试本册拼音与第一单元汉字；可请家长帮读题，缺原书活动可以跳过。',
  parentTip:
    '依据第三方原书公开预览实际印刷56—59页核对，ISBN版次印次未知，教师最终审校待完成。认晚昨今明个这去年、写个去；填写口日目田为复用已学字，不新增会写。实际声音、规范纸笔和共读由家长分别查看；只用虚构姓名示例，网站不收集真实学校或名字。',
  steps: [
    {
      title: '时间词要有参照',
      text: '先与家长读上午、下午、晚上；昨天、今天、明天；上个月、这个月、下个月；去年、今年、明年。同一天的早晚与相邻日、月、年分别比较，不把昨天当成固定日期。',
      activity:
        '选择一组，用前、后说一说顺序；再换参照观察词语怎样变化，不记录真实生日。',
    },
    {
      title: '把八个目标字放回词语',
      text: '认晚、昨、今、明、个、这、去、年，在晚上、昨天、今天、明天、上个月、这个月、去年里找字，再换一个词认。这里的今、明与第六单元合体字学习不同，不预先加新会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '分别指八个字，请家长陪读目标词语；普通字体只供认字。',
    },
    {
      title: '个与去按规范示范写',
      text: '本园地新增会写只有个、去。查看第56页规范笔顺与田字格示范，观察个的撇捺与竖、去的横竖和下部写法；普通屏幕字体不是描红或笔顺动画。',
      visual: { kind: 'characters', grid: 'tian', characters: ['个', '去'] },
      activity:
        '对照教材或教师规范示范，在纸上各尝试写一次，家长查看实际尝试后确认。',
    },
    {
      title: '五组音节先看完整写法',
      text: '比较yǎn/yuǎn、yīn/yīng、jiǎn/juǎn、zuān/zhuān、chán/chuán/chuáng，看中间字母、声母或n/ng哪里不同。整体认读不机械拆读，juǎn省点前对应ü。看对字形不等于实际发音正确，还需要听标准示范陪读。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: [
          'yǎn',
          'yuǎn',
          'yīn',
          'yīng',
          'jiǎn',
          'juǎn',
          'zuān',
          'zhuān',
          'chán',
          'chuán',
          'chuáng',
        ],
      },
      activity:
        '任选两组参考规范示范实际尝试读，再比较字形差异；没有标准示范可跳过实际发音。',
    },
    {
      title: 'ie ei和iu ui不能看反',
      text: '读xié zi鞋子、dǎ léi打雷、dié bèi zi叠被子；chuī qì qiú吹气球、duī xuě rén堆雪人、diū shǒu juàn丢手绢。按指定音节看ie/ei、iu/ui顺序；不同词中可能有多个音节，不能把整个词当一个韵母。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['ie', 'ei', 'iu', 'ui', 'xié', 'léi', 'chuī', 'diū'],
      },
      activity:
        '参考规范示范读六个词，任选一个词指出本次比较的音节；实际朗读单独确认。',
    },
    {
      title: '秋游想带什么，说明理由',
      text: '读mào zi帽子、shuǐ hú水壶、píng guǒ苹果、tiào qí跳棋、miàn bāo面包、shuǐ cǎi bǐ水彩笔、bǐng gān饼干、yǔ sǎn雨伞、wàng yuǎn jìng望远镜。读词可找对应名称；想带哪些应按活动、天气、老师和家长安排讨论，没有全班通用唯一清单。',
      activity:
        '说想带一两样物品及理由，也可说不需要某样的理由；模拟想法不等于已经准备或实际秋游。',
    },
    {
      title: '拼音表分组查看',
      text: '声母组：b p m f，d t n l，g k h，j q x，zh ch sh r，z c s，另列括号（y w）。韵母组：a o e i u ü；ai ei ui ao ou iu ie üe er；an en in un ün；ang eng ing ong。整体认读组：zhi chi shi ri zi ci si yi wu yu ye yue yuan yin yun ying。先按原书三组查看，再任意指读，不把y/w的括号排版当成英文。虚构昵称“丁丁dīng dīng”示范找声母d、韵母ing；真实名字只在纸面或现场查看，不上传或录入。',
      activity:
        '参考规范示范读表；可以用虚构昵称分析，也可仅在纸面看自己名字，网站不记录名字内容。',
    },
    {
      title: '围绕车积累词语',
      text: '读火车、马车、汽车；上车、坐车；车站、车厢。这些词都与车有关，但有车辆名称、动作与地方/部分的区别，不把所有词都当同一类别。本站用原创分组文字说明，不复制原词语网图。',
      activity:
        '说一个自己知道的含车词，说明意思；也可以重新整理本课词语，允许不同合理分组。',
    },
    {
      title: '拼一拼，填已学汉字',
      text: '按mén kǒu门口、shēng rì生日、tí mù题目、tián yě田野填写口、日、目、田。它们是已学字的应用，不把题、野等词中其他字自动加入会写。认字选择题与纸面实际写字分别确认。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['口', '日', '目', '田'],
      },
      activity:
        '对照第58页及已有规范示范在纸上填四个字，请家长看字形与笔顺；不照普通屏幕字体描红。',
    },
    {
      title: '读悯农，理解劳动',
      text: `${poem}\n先听标准朗读再尝试读；诗写劳动和粮食的关系，不要求孩子模仿田间劳动。理解珍惜粮食，可以说一件自己能做的小事，表达允许多种答案。`,
      activity:
        '家长陪读古诗，回看中午、汗滴与饭食的信息；可以尝试记诵，但不由选对题自动确认读背完成。',
    },
    {
      title: '和家长读小鸟念书',
      text: `${reading}原书注明作者胡木仁，选作课文时有改动。先分清教室里实际跟读和窗外风、鸟的声音；拟人带来幽默，不借这个情节嘲笑孩子真实读错。`,
      activity:
        '实际共读第59页，分别找老师、孩子、风和鸟的信息；可以交流自己觉得有趣的地方，缺原书可跳过。',
    },
    {
      title: '记录发现和还想练的地方',
      text: '记录自己想带的物品与理由，或一个还想练的音节、共读发现。未来计划保持为计划，不当实际活动完成；反思没有统一正确答案。',
      activity: '用自己的话记录即可，不要求填写姓名、学校或家庭住址。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'time-read',
      '实际读四组时间词，任选一组说出参照和先后；家长确认尝试，不填写个人日期。',
    ),
    manual(
      'write-new',
      '参考第56页或教师规范示范，用纸笔尝试写个、去，请家长查看；没有规范示范可跳过。',
    ),
    manual(
      'compare-read',
      '从第56页五组音节中任选两组，参考标准示范实际陪听、尝试读并比较写法；字形题不代替发音。',
    ),
    manual(
      'words-read',
      '实际尝试读第57页ie/ei、iu/ui对应的六个词，指定一个音节比较；家长确认尝试，不自动评声音。',
    ),
    manual(
      'outing-say',
      '实际与家长说一说秋游想带的物品和理由，听听安排再讨论；只确认交流尝试，不确认物品已经准备。',
    ),
    manual(
      'table-read',
      '参考第57页三组拼音表陪读；用虚构丁丁dīng dīng或只在纸面看自己的名字分析声母韵母，不录入真实名字。',
    ),
    manual(
      'car-say',
      '实际读含车词语，再说一个自己知道的词或一种分组理由；家长确认交流，自己的词不要求与示例相同。',
    ),
    manual(
      'fill-write',
      '参考第58页和已有规范示范，在纸上填门口、生日、题目、田野中的口日目田；家长查看实际书写尝试。',
    ),
    manual(
      'poem-read',
      '与家长实际读悯农（其二），交流粮食与劳动的关系；可尝试记诵，家长确认实际尝试，不以选择题自动判背诵。',
      poem,
    ),
    manual(
      'reading-read',
      '与家长实际共读第59页小鸟念书，交流教室跟读和窗外声音的区别；没有原书可跳过。',
      reading,
    ),
    {
      id: `${id}-reflect-outing`,
      knowledge: `${id}-reflect-outing`,
      prompt:
        '记录一个秋游想带或不想带的物品及理由；这是想法，不等于已经准备。',
      rule: { kind: 'reflection' },
      hint: '按自己的活动条件表达，不需唯一清单或个人身份信息。',
      explanation: '开放记录保存原话，正确性为null，不自动确认未来活动。',
    },
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个拼音、词语或共读发现，或还想练的问题。',
      rule: { kind: 'reflection' },
      hint: '可以说自己的发现，不要求复制示例。',
      explanation: '反思没有唯一答案，不自动认定已经掌握。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书四页栏目与原创活动校验',
    notes:
      '第三方预览实际印刷56—59页，ISBN版印次未知。按各栏目补齐，公有领域古诗注明原书作者，现代作品外部共读；不复制现代全文原画录音。实际声音、纸笔和交流人工确认，反思null；教师最终审校、整册与全年覆盖仍未完成。',
  },
};
