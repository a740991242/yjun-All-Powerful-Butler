import type { Lesson, Question, Visual } from '../learning/types';

import { natureModel, plantCards } from '../learning/nature-cards';
import { required } from '../learning/required';
import { timetableLesson } from './chinese-timetable';

export const gardenThreePageAudit = {
  itemId: 'u3-6',
  pages: [42, 43, 44],
  recognize: '午星期语文数写会',
  write: '午下',
  sections: [
    '课程表识字与书写',
    '摆拼音字母',
    '平舌翘舌比较',
    '拼音词语动作',
    '看图找事物与数量词',
    '含数字词语积累',
    '亲子读谁会飞',
  ],
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
const id = 'cu-u3-6';
const readMaterial =
  '先与家长共读教材印刷第44页《谁会飞》，然后回看歌谣找信息；网页不提供教材原图或全文。没读原书可以先跳过，不凭标题猜。问题只指这首歌谣里的动物，不表示所有鸟都能飞。';
const characterRows = [
  ['午', '中午中的第二个字。', '午休中的第一个字。'],
  ['星', '星期中的第一个字。', '星空中的第一个字。'],
  ['期', '星期中的第二个字。', '日期中的第二个字。'],
  ['语', '语文中的第一个字。', '语音中的第一个字。'],
  ['文', '语文中的第二个字。', '文章中的第一个字。'],
  ['数', '数学中的第一个字。', '数字中的第一个字。'],
  ['写', '写字中的第一个字。', '书写中的第二个字。'],
  ['会', '班会中的第二个字。', '会写字中的第一个字。'],
];
const idioms = [
  '一模一样',
  '一心一意',
  '独一无二',
  '三头六臂',
  '五颜六色',
  '十全十美',
];
const shapeWords = [
  ['zì mǔ', 'z', 'zhī zhū', 'zh'],
  ['cā bō li', 'c', 'hē chá', 'ch'],
  ['sù shè', 's', 'shǔ jià', 'sh'],
];
const actionRows = [
  ['shuā yá', '刷牙', 'tuō dì', '拖地'],
  ['qí mǎ', '骑马', 'lǐ fà', '理发'],
  ['chī xī guā', '吃西瓜', 'bá luó bo', '拔萝卜'],
];
const choose = (
  suffix: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  material?: string,
  visual?: Visual,
): Question => ({
  id: `${id}-${suffix}`,
  knowledge: `${id}-${knowledge}`,
  prompt,
  material,
  visual,
  choices: labels.map((label) => ({ id: label, label })),
  rule: { kind: 'choice', value },
  hint: '先看本题材料和条件，请家长陪读；实际读音、动作与书写另行确认。',
  explanation,
});
const copied = (questions: Question[]) =>
  structuredClone(questions).map((q) => ({
    ...q,
    id: q.id.replace('cu-timetable', id),
    knowledge: `${id}-${q.knowledge}`,
  }));
function extras(review: boolean): Question[] {
  const prefix = review ? 'r' : 'q';
  const cards = plantCards(review);
  return [
    ...characterRows.map(([character, main, changed], i) =>
      choose(
        `${prefix}-character-${i}`,
        `character-${i}`,
        '选择材料中指定的字。',
        characterRows.map((row) => required(row[0])),
        required(character),
        `选${character}；这是认字观察，实际读音请家长示范。`,
        review ? changed : main,
        {
          kind: 'characters',
          grid: 'tian',
          characters: characterRows.map((row) => required(row[0])),
        },
      ),
    ),
    ...shapeWords.map(([main, initial, changed, reviewInitial], i) =>
      choose(
        `${prefix}-initial-${i}`,
        `initial-${i}`,
        '只观察材料的写法，选择第一个音节的声母。',
        ['z', 'zh', 'c', 'ch', 's', 'sh'],
        required(review ? reviewInitial : initial),
        `本题最前面的声母是${review ? reviewInitial : initial}；两个字母写成的zh/ch/sh各为一个声母，不自动据字形确认实际发音。`,
        review ? changed : main,
      ),
    ),
    ...actionRows.map(([main, value, changed, reviewValue], i) =>
      choose(
        `${prefix}-action-${i}`,
        `action-${i}`,
        '请家长陪读拼音词语，选择它表示的动作。',
        ['刷牙', '骑马', '吃西瓜', '拖地', '理发', '拔萝卜'],
        required(review ? reviewValue : value),
        '回看本题拼音词语；选择词义与实际拼读/做动作分开记录。',
        review ? changed : main,
      ),
    ),
    ...(['tree', 'bird', 'flower'] as const).map((object, i) => {
      const count = cards.filter((card) => card.object === object).length;
      const noun = { tree: '树', bird: '鸟', flower: '花' }[object];
      const unit = { tree: '棵', bird: '只', flower: '朵' }[object];
      return choose(
        `${prefix}-picture-${i}`,
        `picture-${i}`,
        `只看这组原创图卡，哪一个说法同时写对${noun}的数量和量词？`,
        [
          `${count}${unit}${noun}`,
          `${count}${unit === '棵' ? '只' : '棵'}${noun}`,
          `${count + 1}${unit}${noun}`,
        ],
        `${count}${unit}${noun}`,
        `图卡有${count}${unit}${noun}，每张卡只表示一个事物；卡片字母不是数量。图中的鸟没有指定品种，不称为鸽子。`,
        '这是原创练习卡，不是原书第43页的场景。',
        natureModel('plants', review),
      );
    }),
    choose(
      `${prefix}-mountain`,
      'mountain',
      '选择通常用来表示山的量词。',
      ['座', '棵', '朵'],
      '座',
      '通常说一座山、两座山；数量改变，量词仍用于同类事物。',
      review ? '三__山' : '一__山',
    ),
    ...[
      ['一样，相同', '一模一样', '专心做一件事', '一心一意'],
      [
        '形容本领很大，不是要求真的长出更多头和手臂',
        '三头六臂',
        '颜色很多，很丰富',
        '五颜六色',
      ],
      ['形容很完美', '十全十美', '只有这一个，没有相同的', '独一无二'],
    ].map(([main, value, changed, reviewValue], i) =>
      choose(
        `${prefix}-idiom-${i}`,
        `idiom-${i}`,
        '家长读意思，选择相应的积累词语。',
        idioms,
        required(review ? reviewValue : value),
        '本组词语用于积累；数字有时不是对真实身体或事物逐个数数，不要求背熟所有词义。',
        review ? changed : main,
      ),
    ),
    choose(
      `${prefix}-song-animal`,
      'song-animal',
      review ? '歌谣里谁会跑？' : '歌谣里谁会飞？',
      ['鸟', '马', '鱼'],
      review ? '马' : '鸟',
      '回看原书问答；本题只问歌谣中的角色，不推广为动物分类的全部规律。',
      readMaterial,
    ),
    choose(
      `${prefix}-song-how`,
      'song-how',
      review ? '歌谣描述鱼怎样游？' : '歌谣描述鸟怎样飞？',
      review
        ? ['摇尾巴、摆头', '扇翅膀', '坐着读书']
        : ['扇翅膀', '坐着读书', '摇尾巴'],
      review ? '摇尾巴、摆头' : '扇翅膀',
      '回看歌谣所写的动作，再与家长用简单手势模拟。',
      readMaterial,
    ),
    choose(
      `${prefix}-song-action`,
      'song-action',
      review ? '歌谣里的鸟对应什么活动？' : '歌谣里的鱼对应什么活动？',
      ['游', '飞', '跑'],
      review ? '飞' : '游',
      '只按歌谣的这组问答定位活动，朗读与交流另行确认。',
      readMaterial,
    ),
  ];
}
const manual = (
  suffix: string,
  prompt: string,
  material?: string,
  visual?: Visual,
): Question => ({
  id: `${id}-${suffix}`,
  knowledge: `${id}-${suffix}`,
  prompt,
  material,
  visual,
  rule: { kind: 'manual' },
  hint: '实际任务还没完成可以跳过，稍后再做。',
  explanation:
    '记录家长或孩子人工确认，不自动评价实际发音、书写、动作或表达，不计客观正确率。',
});
const reflection = (suffix: string, prompt: string): Question => ({
  id: `${id}-${suffix}`,
  knowledge: `${id}-${suffix}`,
  prompt,
  rule: { kind: 'reflection' },
  hint: '写自己的话，家长可代写；未发生的活动如实记计划。',
  explanation: '保留原话、不评分，也不当作真实任务已经完成。',
});
export const gardenThreeLesson: Lesson = {
  ...structuredClone(timetableLesson),
  id,
  title: '语文园地三',
  textbookTitle: '语文园地三',
  page: 42,
  goal: '读课程表，认午星期语文数写会、写午下；摆字母、辨平翘舌写法、读词做动作，联系图与量词，积累词语并亲子共读。',
  parentTip:
    '已查看第三方原书公开预览42—44页，来源不冒充官方。课程表与图卡为原创例子；语音、纸面、动作及共读人工确认，不采集学校课表或家庭信息。会写午下，其它会认字不自动加入写字范围。',
  steps: [
    ...structuredClone(timetableLesson.steps),
    {
      title: '认课程表里的字',
      text: '第42页会认午、星、期、语、文、数、写、会。可联系中午、星期、语文、数学、写字、班会等词；数在数学中读shù，会在班会中读huì。家长示范词语，孩子指字，不要求填真实学校名称。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characterRows.map((row) => required(row[0])),
      },
      activity: '打乱字卡，再指认会认字，实际发音另由家长确认。',
    },
    {
      title: '纸面写午和下',
      text: '第42页会写午、下。看原书逐笔和占格示范，先观察再用田字格纸练习；屏幕字体只用于辨形，不提供规范描红或笔顺动画，不把其它会认字都列作会写。',
      visual: { kind: 'characters', grid: 'tian', characters: ['午', '下'] },
      activity: '先对照教材或教师示范，再实际动笔；请家长查看后交流。',
    },
    {
      title: '用手势或材料摆字母',
      text: '第42页用手势、绳子、棒形材料联系拼音字母形状。先从c、s、x的形状试起，还可试别的已学字母；手势/材料是形状线索，不表示发音已经正确。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['c', 's', 'x'],
      },
      activity:
        '任选一种柔软材料或手势摆字母，家长猜一猜，再说依据。不要求身体完成特定姿态。',
    },
    {
      title: '平舌与翘舌成对比较',
      text: '第43页比较z/zh、c/ch、s/sh以及相关词语。先看zh、ch、sh各有两个字母但各是一个声母；再听规范示范、跟读词语。zì mǔ、zhī zhū；cā bō li、hē chá；sù shè、shǔ jià。字形选择不能证明平舌翘舌读音已掌握。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['z', 'zh', 'c', 'ch', 's', 'sh'],
      },
      activity: '先家长示范，再成对跟读，不用普通TTS冒充标准音。',
    },
    {
      title: '读拼音词语，做动作',
      text: '第43页有shuā yá（刷牙）、qí mǎ（骑马）、chī xī guā（吃西瓜）、tuō dì（拖地）、lǐ fà（理发）、bá luó bo（拔萝卜）。先尝试拼读，家长帮读后理解意思；动作只需手势或原地模拟，不要求真实骑马、剪发或使用工具。',
      activity: '家长读一个词，孩子用手势表示；交换角色，猜词并说明。',
    },
    {
      title: '在图里找事物与数量词',
      text: '第43页先读鸡、鱼、河，再看山、树、鸽子、花与数量词。打开原书指图找对应事物，再用本站原创图卡练“棵、只、朵”；图卡不是原书场景、鸟未指定品种，不能叫作鸽子。山常用座，树用棵，鸟用只，花用朵。',
      visual: natureModel('plants', false),
      activity:
        '逐张点数，选一个完整说法；再回看原书，说一座山、一棵树、四只鸽子、七朵花所指的部分。',
    },
    {
      title: '积累含数字的词语',
      text: `${idioms.join(
        '、',
      )}。先听家长读再尝试跟读，找已认识的数字字。理解词语的常用意思，不按字面要求真实身体有三头六臂，也不要求一次背熟所有意思。`,
      activity: '选一个词，家长举生活例子，孩子说自己的理解。',
    },
    {
      title: '与大人一起读谁会飞',
      text: `${
        readMaterial
      }这是一问一答的民间歌谣，先听家长示范，再交换问与答的角色。注意问题问的是谁和怎样，先找角色、再找动作；不要求认全所有字。`,
      activity: '与家长实际共读，可用手势配合歌谣角色的动作。',
    },
    {
      title: '仿问答，说自己的发现',
      text: '可以另选一种熟悉动物，提出一个“谁会……/怎样……”的问题，再说有依据的回答。不是所有动物都适合原歌谣的动作；不知道时请教家长，不随意补造。自己的说法不要求和课文完全一样。',
      activity: '交换一个自己的问答，倾听对方后再回应。',
    },
  ],
  questions: [
    ...copied(timetableLesson.questions),
    ...extras(false),
    manual(
      'manual-write',
      '对照第42页规范示范，用田字格纸写午和下，再请家长查看。',
      '会写午、下；其它字不自动加入。',
    ),
    manual(
      'manual-shape',
      '用手势或柔软材料实际摆一个已学拼音字母，让家长猜并说依据。',
    ),
    manual(
      'manual-sounds',
      '跟规范示范实际读z/zh、c/ch、s/sh及一组词语，家长确认活动，不自动评发音。',
    ),
    manual(
      'manual-actions',
      '和家长实际进行读词猜动作；手势模拟即可，再交换角色。',
    ),
    manual(
      'manual-picture',
      '对照原书第43页指图找鸡、鱼、河及山、树、鸽子、花；用一个完整数量词说法描述，再在原创图卡中找相应事物。',
      undefined,
      natureModel('plants', false),
    ),
    manual(
      'manual-idioms',
      '实际跟读六个积累词语，选一个举生活例子或说自己的理解。',
      idioms.join('、'),
    ),
    manual(
      'manual-reading',
      '和家长实际共读第44页谁会飞，交换问答，并试一个自己的问答。',
      readMaterial,
    ),
    reflection(
      'reflection-find',
      '写一个你从课程表、词语或图里找到的信息。未做的活动如实记计划，不写学校名称。',
    ),
    reflection(
      'reflection-question',
      '写一个自己的动物问答，或一个还想请教的问题。家长可代写，不要求唯一作品。',
    ),
  ],
  reviewQuestions: [
    ...copied(required(timetableLesson.reviewQuestions)),
    ...extras(true),
  ],
  review: {
    date: '2026-10-01',
    reviewer: '原书三页栏目与原创课包核对',
    notes:
      '实际查看第三方原书公开预览 https://keben.app/book/0025 封面、编写出版信息、目录及印刷42—44页。课程表识字、书写午下、摆字母、平翘舌、词语动作、图与量词、六词积累、亲子民间歌谣分别覆盖。ISBN、版次、印次未知，不冒充官方入口。不打包原表/原图/现代作品或规范录音/笔顺图；课程表与图卡为原创，真实发音、纸面、动作与共读人工确认，尚待教师最终审校，开放不代表整册或全年完成。',
  },
};
