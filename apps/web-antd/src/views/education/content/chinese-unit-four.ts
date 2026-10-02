import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { compoundVowelPacks } from './chinese-compound-vowels';

/** Actual printed body pages; source inspection does not publish a course. */
export const unitFourPageAudits = [
  {
    itemId: 'u4-1',
    pages: [45, 46],
    recognize: '白菜西瓜果',
    write: '',
    topics: [
      'ai/ei/ui四声',
      '两拼与三拼',
      'pái duì书写',
      '蔬菜水果词语',
      '洗手歌',
    ],
  },
  {
    itemId: 'u4-2',
    pages: [47, 48],
    recognize: '小桥流柳',
    write: '',
    topics: [
      'ao/ou/iu四声',
      '音节拼读',
      'xiǎo niú书写',
      '小桥流水垂柳桃花',
      '欢迎台湾小朋友',
    ],
  },
  {
    itemId: 'u4-3',
    pages: [49, 50],
    recognize: '开雪夜色美',
    write: '',
    topics: [
      'ie/üe/er',
      'ye/yue整体认读',
      'n/l保留ü两点与j/q/x省点',
      'xiě zuò yè书写',
      '月儿弯弯',
    ],
  },
  {
    itemId: 'u4-4',
    pages: [51, 52, 53],
    recognize: '蓝云草原',
    write: '',
    topics: [
      'an/en/in/un/ün',
      'yuan/yin/yun整体认读',
      '三拼与省点',
      'lún chuán书写',
      '蓝天白云草原森林',
      '家',
    ],
  },
  {
    itemId: 'u4-5',
    pages: [54, 55],
    recognize: '冰自行车',
    write: '',
    topics: [
      'ang/eng/ing/ong',
      'ying整体认读',
      'míng liàng书写',
      '运动词语',
      '两只羊',
    ],
  },
  {
    itemId: 'u4-6',
    pages: [56, 57, 58, 59],
    recognize: '晚昨今明个这去年',
    write: '个去',
    topics: [
      '时间词',
      '音节与韵母比较',
      '秋游选择',
      '拼音表',
      '车字词语网',
      '填写已学汉字',
      '悯农其二',
      '小鸟念书',
    ],
  },
].map((audit) => ({
  ...audit,
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
}));

const id = 'cu-u4-1';
const base = structuredClone(required(compoundVowelPacks['u4-1']));
const oldId = base.id;
const rekey = (q: Question): Question => ({
  ...q,
  id: q.id.replace(oldId, id),
  knowledge: `${id}-${q.knowledge}`,
});
const choose = (
  suffix: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  material?: string,
): Question => ({
  id: `${id}-${suffix}`,
  knowledge: `${id}-${knowledge}`,
  prompt,
  material,
  choices: labels.map((label) => ({ id: label, label })),
  rule: { kind: 'choice', value },
  hint: '回看本题材料，按完整字形与顺序选择；原书阅读题先共读第46页。',
  explanation,
});
const words = [
  ['白', '白菜中的第一个字。', '白云中的第一个字。'],
  ['菜', '白菜中的第二个字。', '蔬菜中的第二个字。'],
  ['西', '西瓜中的第一个字。', '东西中的第二个字。'],
  ['瓜', '西瓜中的第二个字。', '瓜子中的第一个字。'],
  ['果', '水果中的第二个字。', '果园中的第一个字。'],
];
const reading =
  '先与家长共读教材印刷第46页《洗手歌》，再回看课文找信息。本站不提供现代作品全文、原图或录音；没有原书可跳过，不凭常识替代课文材料。';
function additions(review = false): Question[] {
  const prefix = review ? 'r' : 'q';
  return [
    ...words.map((row, index) =>
      choose(
        `${prefix}-char-${index}`,
        `char-${index}`,
        review ? required(row[2]) : required(row[1]),
        words.map((x) => required(x[0])),
        required(row[0]),
        `应选${row[0]}，这里练习认字；本课没有新增汉字会写要求。`,
      ),
    ),
    choose(
      `${prefix}-triple`,
      'triple',
      review
        ? '看新三拼组合，缺少的中间部分是什么？'
        : '根据三部分，选完整的三拼音节。',
      review ? ['u', 'i', 'ai'] : ['guāi', 'gāi', 'guī'],
      review ? 'u' : 'guāi',
      review
        ? 'k + u + ài组成kuài，中间是u；声调仍在ai的a上。'
        : 'g + u + āi组成guāi，不能漏掉中间的u，也不能把ai改成ui。',
      review ? 'k + □ + ài → kuài' : 'g + u + āi',
    ),
    choose(
      `${prefix}-song-material`,
      'song-material',
      review
        ? '《洗手歌》中，哪样东西用来擦手？'
        : '《洗手歌》中，哪样东西用来搓手？',
      ['肥皂', '毛巾', '书本'],
      review ? '毛巾' : '肥皂',
      '根据原书歌谣回看搓手和擦手各用的物品。字词题不自动证明实际洗手或朗读已完成。',
      reading,
    ),
    choose(
      `${prefix}-song-action`,
      'song-action',
      review
        ? '《洗手歌》中，毛巾对应哪一个动作？'
        : '《洗手歌》中，清水对应哪一个动作？',
      ['冲手', '擦手', '排队'],
      review ? '擦手' : '冲手',
      '按课文中的物品与动作配对，再回读相关部分；不要只背上一题答案。',
      reading,
    ),
  ];
}
function manual(suffix: string, prompt: string, material?: string): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: `${id}-${suffix}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '实际活动由家长陪同查看，未发生或没有材料可暂时跳过。',
    explanation:
      '只记录人工确认，不根据选择题自动判断实际发音、书写或共读质量。',
  };
}

export const formalAiEiUiLesson: Lesson = {
  ...base,
  id,
  title: 'ai ei ui',
  textbookTitle: 'ai ei ui',
  goal: '认识ai、ei、ui及四声，比较两拼与三拼，尝试规范书写；认读白菜西瓜果，与家长共读洗手歌。',
  parentTip:
    '正文范围依据第三方原书公开预览印刷45—46页核对，ISBN、版次与印次未见，教师最终审校仍待完成。普通屏幕字体仅供辨认，发音与四线格书写参考教材或教师示范；本课只认白菜西瓜果，没有新增汉字会写。',
  steps: [
    {
      title: '从情境中找拼音',
      text: '与家长查看教材第45页情境图，说一说图中人们在做什么，再听标准示范认识ai、ei、ui。原图只在教材查看，本站不复制；看图联想不能代替实际发音。',
      activity: '不记录家中人员姓名或照片；任选一个韵母尝试跟读，由家长陪同。',
    },
    ...base.steps.slice(0, 4),
    {
      title: '两拼与三拼都要看完整',
      text: 'g + āi → gāi是两部分；g + u + āi → guāi是三部分。三拼中间的u不能漏掉。新组合k + u + ài → kuài也要连贯读，不能把三个英文字母名称拼起来。ai的调号在a上。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['g', 'u', 'āi', 'guāi', 'kuài'],
      },
      activity:
        '用三个纸卡摆出g、u、āi，听规范示范再连贯拼读；复习时换成k、u、ài，重新比较。',
    },
    {
      title: '规范示范下练写音节',
      text: '对照第45页四线格示范练写pái duì，先观察字母位置与调号，再用纸笔写。本网站普通字体不当描红范本，也不自动判笔顺或占格。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['pái', 'duì'],
      },
      activity:
        '分别进行实际跟读与纸笔练习；已有韵母书写任务仍保留，音节书写另由家长查看。',
    },
    {
      title: '蔬菜水果里的字词',
      text: '与家长读luó bo萝卜、bái cài白菜、shū cài蔬菜、yā lí鸭梨、xī guā西瓜、shuǐ guǒ水果。按教材用语理解词语，不把这组分类当严格植物学分类。本课会认白、菜、西、瓜、果；词语里出现的其他字不自动新增为会认，会写清单为空。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['白', '菜', '西', '瓜', '果'],
      },
      activity:
        '找一找白菜、西瓜、水果中的目标字，再换一句话认同一个字；不要求购买或食用这些物品。',
    },
    {
      title: '与家长共读洗手歌',
      text: `${reading}原书注明作者常福生，选作课文时有改动。共读后找出搓手、冲手和擦手各对应的物品，尝试读准已学音节。`,
      activity:
        '可以先用手势交流歌谣动作；实际朗读与生活中的洗手分别确认。安全洗手按家庭和学校指导，不把这一首歌当完整卫生操作标准。',
    },
    {
      title: '说说自己的发现',
      text: '想一想哪两个韵母容易看反，或哪一次三拼还需要练习。记录原话即可，想再练的计划不当作已完成的活动。',
      activity:
        '可以用“我发现……”“我还想……”说一句，不要求填真实学校或家庭资料。',
    },
  ],
  questions: [
    ...base.questions.map((item) => rekey(item)),
    ...additions(),
    manual(
      'triple-read',
      '摆出g、u、āi三个纸卡，参考规范示范实际尝试三拼；再换k、u、ài读一次。家长确认尝试完成，没有示范可跳过。',
    ),
    manual(
      'syllable-write',
      '对照教材第45页规范示范，用纸笔尝试写pái duì，检查字母顺序、调号和四线格占位；家长查看后确认。',
    ),
    manual(
      'words-read',
      '实际指认白、菜、西、瓜、果，尝试读白菜、西瓜、水果三个词；家长确认尝试，不要求写这五个汉字。',
    ),
    manual(
      'song-read',
      '与家长实际共读第46页洗手歌，交流物品和动作；没有原书可跳过。答题或计划阅读不等于已经共读。',
      reading,
    ),
    {
      id: `${id}-reflect`,
      knowledge: `${id}-reflect`,
      prompt: '记录一个容易看反的韵母、自己的三拼发现，或下一次想练的地方。',
      rule: { kind: 'reflection' },
      hint: '只记自己的想法，不填真实学校或个人身份信息。',
      explanation:
        '开放反思没有唯一答案，保存原话，不自动判断掌握或确认未来计划完成。',
    },
  ],
  reviewQuestions: [
    ...required(base.reviewQuestions).map((item) => rekey(item)),
    ...additions(true),
  ],
  review: {
    date: '2026-10-01',
    reviewer: '原书公开预览正文与原创活动校验',
    notes:
      '第三方预览印刷45—46页实际核对；不冒充出版社官方来源，ISBN版印次未知。正式课与旧辨形补充独立ID及快照；现代作品外部共读，不复制全文原画录音。实际读写和共读人工确认、反思null，教师最终审校与整册覆盖仍待完成。',
  },
};
