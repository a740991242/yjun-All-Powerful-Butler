import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const duiyunPageAudit = {
  itemId: 'u6-1',
  title: '对韵歌',
  pages: [73],
  recognize: '对歌雨风虫清绿桃红',
  write: '云雨虫山水',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  author: null,
  activities: ['朗读课文', '背诵课文', '认读九字', '规范书写五字'],
};
const id = 'cu-u6-1';
const reading =
  '先与家长共读教材印刷第73页《对韵歌》，再回看指定一组词。原页未署个人作者，不补造署名；本站不提供教材全文、原画或录音。缺原书可跳过，不能凭题目猜原文。';
const characters = [
  ['对', '对话中的第一个字。', '面对中的第二个字。'],
  ['歌', '歌声中的第一个字。', '唱歌中的第二个字。'],
  ['雨', '雨水中的第一个字。', '下雨中的第二个字。'],
  ['风', '风声中的第一个字。', '大风中的第二个字。'],
  ['虫', '虫子中的第一个字。', '小虫中的第二个字。'],
  ['清', '清水中的第一个字。', '清早中的第一个字。'],
  ['绿', '绿色中的第一个字。', '绿叶中的第一个字。'],
  ['桃', '桃花中的第一个字。', '桃树中的第一个字。'],
  ['红', '红色中的第一个字。', '红花中的第一个字。'],
];
export const duiyunPairs = [
  ['云', '雨'],
  ['雪', '风'],
  ['花', '树'],
  ['鸟', '虫'],
  ['山清', '水秀'],
  ['柳绿', '桃红'],
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
    hint: '看清指定词语，先共读原书，再找依据。',
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
        `本课认${row[0]}；会写另看云雨虫山水，不把会认全当会写。`,
        review,
      ),
    ),
    ...duiyunPairs.map(([a, b], n) =>
      choice(
        `pair-${n}`,
        review
          ? `按原书，与${b}成对的是哪项？`
          : `按原书，与${a}成对的是哪项？`,
        [a, b, '时间'],
        review ? a : b,
        '按原书指定的一对找对应词。这些成对用语不全是严格反义词，也不表示自然现象总同时出现。',
        review,
        reading,
      ),
    ),
    choice(
      'landscape',
      review ? '柳绿中写柳树颜色的字是哪项？' : '桃红中写桃花颜色的字是哪项？',
      ['红', '绿', '清'],
      review ? '绿' : '红',
      '柳绿、桃红是景物描写；不同地点、季节和品种的实际颜色不一定相同。',
      review,
    ),
    choice(
      'writing-scope',
      review
        ? '只比较山与歌，哪项在本课会写清单？'
        : '只比较云与对，哪项在本课会写清单？',
      ['云', '对', '山', '歌'],
      review ? '山' : '云',
      '本课会写云雨虫山水；仅比较题目指定的一对，不自行增加写字范围。',
      review,
    ),
    choice(
      'sound',
      review ? '对照本课注音，雨是哪项？' : '对照本课注音，绿是哪项？',
      ['lǜ', 'yǔ', 'lù'],
      review ? 'yǔ' : 'lǜ',
      '绿读lǜ，雨读yǔ。字形选择不能自动评实际声音；听规范示范后尝试读。',
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
    hint: '实际尝试后由家长确认；缺原书、规范示范或纸笔可跳过。',
    explanation: '只记录真实尝试，不自动评声音、笔顺或表达，不把计划当完成。',
  };
}
export const duiyunLesson: Lesson = {
  id,
  title: '对韵歌',
  textbookTitle: '对韵歌',
  page: 73,
  version: 1,
  status: 'available',
  goal: '认对歌雨风虫清绿桃红，写云雨虫山水；联系成对词和景物描写，实际朗读与背诵。',
  prerequisite: '准备第73页原书和田字格纸，可请家长借助拼音陪读。',
  parentTip:
    '依据第三方原书公开预览实读第73页。未知ISBN版印次不补造，原页未署个人作者；教材全文原画录音外部共读。实际朗读和背诵分别确认，教师最终审校仍待完成。',
  steps: [
    {
      title: '先共读，再认识九字',
      text: `${reading}本课认对、歌、雨、风、虫、清、绿、桃、红，先借助原书拼音听示范，再放回词语。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '实际打乱九字顺序指读；字形题答对不代替认读声音。',
    },
    {
      title: '分别找成对词',
      text: '对照原书，分别找自然现象、植物和动物的成对用语。看清每一组，不把上一组的答案搬到下一组；成对词不全是严格反义词，不表示两种现象总会一起出现。',
      activity: '用纸卡实际摆出原书中的一组成对词，回看原书说依据。',
    },
    {
      title: '景物怎样写',
      text: '山清、水秀联系山水景色；柳绿、桃红写柳树和桃花的颜色。先按原书找描述，再说自己的合理观察，不要求各地、各季节、各品种都一样。',
      activity: '与家长实际交流一处景物描写，也可以说自己看到的不同景象。',
    },
    {
      title: '听节奏，实际朗读',
      text: '按第73页课后要求朗读课文，先听标准示范，再按成对词的停顿尝试读。不强迫只用一种速度，不用选择题或普通合成声音自动评朗读。',
      activity: '与家长实际朗读，听一条回应再尝试调整；只确认真实尝试。',
    },
    {
      title: '另做背诵活动',
      text: '第73页另要求背诵课文。可以先借助词卡回想，再合上原书尝试；背诵与朗读分别记录，不因读过就自动算背过。暂时不会或资料未备好可跳过后再练。',
      activity: '实际尝试背诵，请家长按原书查看；不自动评分声音或记忆。',
    },
    {
      title: '按规范示范写五字',
      text: '本课会写云、雨、虫、山、水。对照第73页逐笔与田字格示范，分别观察笔画和位置；普通网页字体只供认字，不能代替规范笔顺或描红。九个会认字不全部加入会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'云雨虫山水'],
      },
      activity: '在田字格纸实际尝试五字，请家长看真实字形、笔顺与位置。',
    },
    {
      title: '说发现，记录还想练什么',
      text: '可说一组成对词或一处景物描写的发现。观察和表达开放，没有唯一喜欢的景物；记录自己的原话，不需要姓名照片地点身份信息，未来计划与已完成活动分开。',
      activity: '实际交流后确认；反思可以由家长代写，不自动判对错。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱九字顺序指读对歌雨风虫清绿桃红；只确认真实尝试。',
    ),
    manual(
      'read',
      '与家长实际朗读第73页对韵歌，注意成对词和停顿；不自动评声音。',
      reading,
    ),
    manual(
      'recite',
      '按原书第73页另行实际尝试背诵；不把朗读确认当背诵完成。',
      reading,
    ),
    manual(
      'pairs',
      '用纸卡实际摆出原书的一组成对词，回看原书说依据；不把答题当已摆卡。',
      reading,
    ),
    manual(
      'write',
      '按第73页规范示范，用田字格纸实际尝试写云雨虫山水；家长查看字形、笔顺和位置。',
    ),
    manual(
      'observation',
      '实际与家长交流一处景物描述或自己的观察，分清课文描写与现实情况；表达开放。',
    ),
    {
      id: `${id}-reflect-practice`,
      knowledge: `${id}-reflect-practice`,
      prompt:
        '记录一组成对词的发现，或还想练的字、朗读、背诵问题；未来计划请明确写出。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可以代写。',
      explanation: '保留原话，正确性为null，不把计划当完成或自动认定掌握。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书单页与原创教学范围校验',
    notes:
      '第73页九会认五会写、成对词和景物描写、朗读与背诵分别核对。原页未署作者，未知ISBN版印次不补造，现代教材全文原画录音外部共读。认读/读/背/摆卡/写/交流独立人工确认，反思null，成对词不全当反义词或自然必然事实。教师最终审校、整册与全年仍待逐项验收。',
  },
};
