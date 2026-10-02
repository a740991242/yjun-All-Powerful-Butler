import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const riyuemingPageAudit = {
  itemId: 'u6-2',
  title: '日月明',
  pages: [74, 75],
  recognize: '力尖尘众双林森不条心金',
  write: '力男土木心',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  author: null,
  compiledBy: '人民教育出版社小学语文室',
  words: ['力气', '尘土', '双手', '金黄', '树林', '森林', '关心', '开心'],
  guessCharacters: ['泪', '苗', '歪'],
  activities: [
    '朗读课文',
    '读一读八个词语',
    '猜泪苗歪的意思',
    '认读十一字',
    '规范书写五字',
  ],
};
const id = 'cu-u6-2';
const reading =
  '先与家长共读教材印刷第74—75页《日月明》，再回看指定信息。原书脚注说明由人民教育出版社小学语文室编写，不补造个人作者。本站不提供教材全文、原画或录音；缺原书可跳过，不凭题目猜原文。';
const characters = [
  ['力', '力气中的第一个字。', '用力中的第二个字。'],
  ['尖', '笔尖中的第二个字。', '尖角中的第一个字。'],
  ['尘', '尘土中的第一个字。', '灰尘中的第二个字。'],
  ['众', '众人中的第一个字。', '群众中的第二个字。'],
  ['双', '双手中的第一个字。', '一双中的第二个字。'],
  ['林', '树林中的第二个字。', '林间中的第一个字。'],
  ['森', '森林中的第一个字。', '森严中的第一个字。'],
  ['不', '不能中的第一个字。', '不是中的第一个字。'],
  ['条', '一条中的第二个字。', '条纹中的第一个字。'],
  ['心', '关心中的第二个字。', '心里中的第一个字。'],
  ['金', '金黄中的第一个字。', '金色中的第一个字。'],
];
export const riyuemingCompositions = [
  ['日＋月', '明'],
  ['田＋力', '男'],
  ['小＋大', '尖'],
  ['小＋土', '尘'],
  ['两个 人', '从'],
  ['三个 人', '众'],
  ['两个 木', '林'],
  ['三个 木', '森'],
] as const;
const guesses = [
  ['泪', '眼泪', '氵＋目'],
  ['苗', '幼小的植物', '艹＋田'],
  ['歪', '不正或倾斜', '不＋正'],
] as const;
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
    hint: '先看清指定字词，再共读原书找依据；字形不是科学定义。',
    explanation,
  };
}
function objective(review: boolean): Question[] {
  return [
    ...characters.map((row, n) =>
      choice(
        `char-${n}`,
        required(row[review ? 2 : 1]),
        characters.map((r) => required(r[0])),
        required(row[0]),
        `本课认${row[0]}；本课写力男土木心，认写范围分别看。`,
        review,
      ),
    ),
    ...riyuemingCompositions.map(([parts, result], n) =>
      choice(
        `compose-${n}`,
        review
          ? `按课文，${result}用哪组字形组成帮助记忆？`
          : `按课文，用${parts}的字形组成帮助记忆的是哪项？`,
        riyuemingCompositions.map((r) => r[review ? 0 : 1]),
        review ? parts : result,
        '这是本课帮助记字的组成联系，不是所有汉字的造字规则；不据字形定义性别、人数规模或森林生态。',
        review,
        reading,
      ),
    ),
    ...guesses.map(([character, meaning, parts], n) =>
      choice(
        `guess-${n}`,
        review
          ? `第75页猜字，${character}分成哪两部分帮助理解？`
          : `第75页猜字，${character}的意思最接近哪项？`,
        review ? guesses.map((r) => r[2]) : guesses.map((r) => r[1]),
        review ? parts : meaning,
        '按字形提出猜想，再结合生活语境和家长解释核对。泪苗歪是课后猜字，不增加本课新会认会写清单，也不推广为全部汉字规则。',
        review,
        '先看原书第75页泪、苗、歪与分解图，再回看本题指定的一个字。',
      ),
    ),
    choice(
      'word-physical',
      review
        ? '按第75页词语，哪项指细小的土或灰？'
        : '按第75页词语，哪项指使劲所需的力量？',
      ['力气', '尘土', '金黄'],
      review ? '尘土' : '力气',
      '力气与尘土的意思不同；联系指定语境，不把两个词混用。',
      review,
    ),
    choice(
      'word-body-color',
      review
        ? '按第75页词语，哪项写一种黄色？'
        : '按第75页词语，哪项指两只手？',
      ['双手', '金黄', '开心'],
      review ? '金黄' : '双手',
      '双手指两只手，金黄写颜色，分别看所问对象。',
      review,
    ),
    choice(
      'word-heart',
      review
        ? '按第75页词语，感到高兴可以用哪项？'
        : '按第75页词语，在意别人并愿意帮助，可以用哪项？',
      ['关心', '开心', '森林'],
      review ? '开心' : '关心',
      '关心与开心有共同的心，词义不同；孩子的实际感受与表达开放。',
      review,
    ),
    choice(
      'writing-scope',
      review
        ? '只比较木与森，哪项在本课会写清单？'
        : '只比较男与众，哪项在本课会写清单？',
      ['男', '众', '木', '森'],
      review ? '木' : '男',
      '本课写力男土木心；只比较指定的一对，林森众不因客观题出现就新增会写。',
      review,
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
    hint: '实际尝试后由家长确认，缺原书、纸笔或规范示范可跳过。',
    explanation: '不自动评声音、笔顺或表达，不把计划当完成。',
  };
}
export const riyuemingLesson: Lesson = {
  id,
  title: '日月明',
  textbookTitle: '日月明',
  page: 74,
  version: 1,
  status: 'available',
  goal: '认十一字、写力男土木心；联系字形和词义，朗读、读词、猜泪苗歪，交流合作。',
  prerequisite: '准备第74—75页原书、词卡和田字格纸，可请家长陪读。',
  parentTip:
    '实读第三方原书公开预览74—75两页。原页小学语文室编写，未知ISBN版印次不补造。课后要求朗读、读词、猜字义，没有背诵必做；字形组成帮助记忆，不代替科学定义或推定性别能力。教师最终审校待完成。',
  steps: [
    {
      title: '共读并认识十一字',
      text: `${reading}本课认力、尖、尘、众、双、林、森、不、条、心、金。先听原书拼音规范示范，再放回词语，字形题不代替实际发音。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '实际打乱十一字顺序指读，家长确认真实尝试。',
    },
    {
      title: '用组成联系记字',
      text: '回看日月与明、田力与男、小大与尖、小土与尘的字形联系。按原书记字，不把加号当数学加法，不要求普通字体中的部件与独立字完全同形同宽。男的组成不意味着男性才有力量或才可劳动。',
      activity: '实际用纸卡配一个字与组成，回看规范字形说依据。',
    },
    {
      title: '分清从众与林森',
      text: '原书分别用两个人与从、三个人与众、两个木与林、三个木与森联系字形。先观察组成，再放回词语；不能据木的笔画数量定义现实树林森林，也不能把众人的意思限制为恰好三个人。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['从', '众', '林', '森'],
      },
      activity: '比较两组字形，实际指给家长看共同部件和不同数量。',
    },
    {
      title: '读一读八个词语',
      text: '对照第75页读力气、尘土、双手、金黄、树林、森林、关心、开心。树林与森林都联系树木，但不能只按字里几个木给实际地方分类；关心与开心都有心，意思不同，可以分别放进自己的合理句子。',
      activity: '实际读八个词语，再选择一个向家长说合理语境。',
    },
    {
      title: '猜字义，再核对',
      text: '按第75页泪、苗、歪分解图观察氵与目、艹与田、不与正，先猜意思，再联系眼泪、幼苗、歪斜的生活语境核对。泪苗歪是课后猜字活动，不加入本课新增会认会写清单；并非所有汉字都可以这样猜。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: ['泪', '苗', '歪'],
      },
      activity: '实际说一个猜想和依据，请家长帮助核对；允许先猜错再修改。',
    },
    {
      title: '朗读并说合作',
      text: '第75页要求朗读课文，没有背诵必做。结合第74页众人合作的表达和植树图，说不同的人怎样配合；黄土变成金是比喻，不是泥土真的变黄金。可以讨论一起整理纸卡等小事，不要求植树或使用工具，也不推定同伴必须意见完全相同。',
      activity:
        '实际朗读后，与家长共同整理一次纸卡或交流一种合作办法；只有真实发生才确认。',
    },
    {
      title: '按规范示范写五字',
      text: '本课会写力、男、土、木、心。对照第75页逐笔与田字格示范，观察笔画和位置；普通网页字体只供认字，不能代替规范笔顺或描红，不把猜字活动字加入会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'力男土木心'],
      },
      activity: '用田字格纸实际尝试五字，请家长看字形、笔顺和位置。',
    },
    {
      title: '记录自己的发现',
      text: '可记录一个字形、词义或合作发现，保留自己的话。反思不判对错，未来练习计划与实际活动分开，不需要姓名、照片或地点身份信息。',
      activity: '家长可以代写；还想练什么可以写成下一次计划。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱十一字顺序指读力尖尘众双林森不条心金；不扩认写清单。',
    ),
    manual(
      'read',
      '与家长实际朗读原书第74—75页日月明；本课不增加背诵必做。',
      reading,
    ),
    manual(
      'words',
      '按第75页实际读力气尘土双手金黄树林森林关心开心八词，再说一个合理语境。',
    ),
    manual(
      'cards',
      '实际用纸卡比较一组字形组成，向家长指出部件及数量；不把选择题当已经摆卡。',
      reading,
    ),
    manual(
      'guess',
      '观察第75页泪苗歪图，实际说一个猜字义的依据，听家长帮助核对；不新增认写范围。',
    ),
    manual(
      'cooperate',
      '与家长实际合作整理纸卡，或实际交流一种合作办法；不把将来计划当完成。',
    ),
    manual(
      'write',
      '按第75页规范示范，用田字格纸实际尝试写力男土木心；家长看字形、笔顺、位置。',
    ),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个字形或词语发现，也可明确写下一次想练的计划。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可以代写。',
      explanation: '保留原话，正确性为null，不把计划当完成。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读74—75两页，十一会认五会写、八词、三字猜义、朗读核对。课后没有背诵必做。小学语文室编写与个人作者分开，未知ISBN版印次不补造；全文原画录音外部共读。组成不是科学定义或性别推断，黄土成金是比喻，猜字不扩大认写清单。实际活动人工确认、反思null，教师最终审校及全年仍待逐项验收。',
  },
};
