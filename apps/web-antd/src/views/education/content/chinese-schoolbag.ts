import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const schoolbagPageAudit = {
  itemId: 'u6-3',
  title: '小书包',
  pages: [76, 77],
  recognize: '包尺作业笔刀宝贝少课早',
  write: '尺本刀不少',
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  author: null,
  words: ['橡皮', '尺子', '作业本', '笔袋', '铅笔', '转笔刀'],
  activities: [
    '朗读课文',
    '说书包里的学习用品',
    '读用品词语',
    '摆放文具整齐',
    '自己整理书包',
    '认读十一字',
    '规范书写五字',
  ],
};
const id = 'cu-u6-3';
const reading =
  '先与家长共读教材印刷第76—77页《小书包》，再回看指定信息。原页未署个人作者，不补造署名；本站不提供教材全文、原画或录音。缺原书可跳过，不凭题目猜原文。';
const characters = [
  ['包', '书包中的第二个字。', '包裹中的第一个字。'],
  ['尺', '尺子中的第一个字。', '直尺中的第二个字。'],
  ['作', '作业中的第一个字。', '工作中的第二个字。'],
  ['业', '作业中的第二个字。', '业余中的第一个字。'],
  ['笔', '铅笔中的第二个字。', '笔袋中的第一个字。'],
  ['刀', '转笔刀中的第三个字。', '小刀中的第二个字。'],
  ['宝', '宝贝中的第一个字。', '宝物中的第一个字。'],
  ['贝', '宝贝中的第二个字。', '贝壳中的第一个字。'],
  ['少', '不少中的第二个字。', '多少中的第二个字。'],
  ['课', '课本中的第一个字。', '上课中的第二个字。'],
  ['早', '早晨中的第一个字。', '清早中的第二个字。'],
];
export const schoolbagTools = [
  ['橡皮', '擦去铅笔痕迹'],
  ['尺子', '画直线或测长度'],
  ['作业本', '记录作业'],
  ['笔袋', '收纳笔等小文具'],
  ['铅笔', '写字或画图'],
  ['转笔刀', '削铅笔用，成人协助'],
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
    hint: '先看清指定字词和条件，不用题目替代实际整理。',
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
        `本课认${row[0]}；写尺本刀不少另看会写清单，不把所有用品名字都加入新增认写。`,
        review,
      ),
    ),
    ...schoolbagTools.map(([tool, use], n) =>
      choice(
        `tool-${n}`,
        review
          ? `本题原创用途分类，${tool}主要用于哪项？`
          : `本题原创用途分类，哪种用品用于${use}？`,
        schoolbagTools.map((r) => r[review ? 1 : 0]),
        review ? use : tool,
        '这是用品基本用途的原创分类，实际物品可能有不同设计。转笔刀由成人协助安全处理，不要求打开刀片或试用危险工具。',
        review,
        '先对照第76页六个用品词，用品名称与用途分开看。',
      ),
    ),
    choice(
      'reading-destination',
      review ? '按原书，宝贝在这里指什么？' : '按原书，学习用品陪我去哪里？',
      ['学校', '学习用品', '金银首饰'],
      review ? '学习用品' : '学校',
      '宝贝是爱惜学习用品的表达，不是书包必须装金银；陪我去学校的表达不表示物品自己会走。',
      review,
      reading,
    ),
    choice(
      'sound',
      review ? '对照本课注音，笔是哪项？' : '对照本课注音，不少的少是哪项？',
      ['shǎo', 'shào', 'bǐ'],
      review ? 'bǐ' : 'shǎo',
      '不少的少读shǎo，笔读bǐ；本题字形选择不自动评发音，不把少的其他语境读音搬过来。',
      review,
    ),
    choice(
      'writing-scope',
      review
        ? '只比较本与课，哪项在本课会写清单？'
        : '只比较尺与包，哪项在本课会写清单？',
      ['尺', '包', '本', '课'],
      review ? '本' : '尺',
      '本课会写尺本刀不少。只比较指定一对，不把包课自动增加会写。',
      review,
    ),
    choice(
      'fiction-plan',
      review
        ? '按本题虚构安排，第二天需要取哪本书？'
        : '按本题虚构安排，第一天需要取哪本书？',
      ['语文书', '数学书', '两天都不要书'],
      review ? '数学书' : '语文书',
      '这是本站虚构示例，不是学校实际课表；真实整理须按本人次日安排和教师要求，不强制所有用品每天携带。',
      review,
      '本站虚构练习安排：第一天读语文书，第二天读数学书。只按这两个已给条件选书。',
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
    hint: '实际尝试后由家长确认；缺原书、示范或用品可跳过。',
    explanation: '只记录真实尝试，不自动评声音笔顺或整理效果，不把计划当完成。',
  };
}
export const schoolbagLesson: Lesson = {
  id,
  title: '小书包',
  textbookTitle: '小书包',
  page: 76,
  version: 1,
  status: 'available',
  goal: '认十一字写尺本刀不少；朗读、认用品、说自己的书包，分别摆好文具和整理书包。',
  prerequisite: '准备第76—77页原书、田字格纸及手边安全学习用品，可请家长陪读。',
  parentTip:
    '按第三方公开原书76—77两页核对，未知ISBN版印次和个人作者不补造。课后要求朗读、说学习用品、摆文具、整理书包，不加背诵必做。实际物品与学校要求可能不同，不强制购买指定用品，不要求录入学校或课表身份信息；转笔刀由成人协助。教师最终审校待完成。',
  steps: [
    {
      title: '共读并认十一字',
      text: `${reading}本课认包、尺、作、业、笔、刀、宝、贝、少、课、早，先借助原书拼音听规范示范，再放回词语。少在不少中读shǎo，认字和实际声音分别看。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '实际打乱十一字顺序指读，家长确认尝试。',
    },
    {
      title: '读六个用品名称',
      text: '按第76页读橡皮、尺子、作业本、笔袋、铅笔、转笔刀。把名称与手边安全物品对应，也可用自己写的词卡；不要求购买所有用品。仅观察转笔刀的外部名称，成人协助安全处理，不打开刀片。',
      activity: '实际读六个词，并指出一种对应的物品或词卡。',
    },
    {
      title: '名称与用途分开看',
      text: '本课用品可联系擦铅笔痕迹、画直线或测长度、记录作业、收纳小文具、写字画图、削铅笔等基本用途。这里是本站原创用途分类，不是教材原句；物品设计可能不同，不能把分类答对当已经实际使用。',
      activity: '向家长说一种用品及合理用途；不要求实际试用刀具。',
    },
    {
      title: '朗读后说自己的书包',
      text: '按第77页要求朗读课文，再说自己的书包里有哪些学习用品。宝贝表达爱惜用品，不指必须装金银，陪我去学校不是物品自己会走。真实用品可以与插图不同，表达开放；课后没有背诵必做。',
      activity: '实际朗读后，说两种手边用品；无需上传照片、真实学校或姓名。',
    },
    {
      title: '先把文具摆放整齐',
      text: '按第77页读一读做一做，先在平稳桌面把安全文具摆放整齐。可按自己的取用习惯放，没有唯一摆放位置；先放好物品，再检查是否方便取用，不只看选择题结果。',
      activity:
        '实际尝试摆放文具，请家长查看；刀具由成人处理，缺物品可暂时跳过。',
    },
    {
      title: '再自己整理书包',
      text: '对照本人次日安排和教师要求，查看需要哪些书本用品，再装入合适位置并检查遗漏。本站练习安排只是虚构示例，不是学校课表，不强制每件东西每天带；可以请家长适当帮助，整理文具与整理书包分别记录。',
      activity:
        '实际尝试整理书包，向家长说明取用位置，再检查需要物品；未来计划不记完成。',
    },
    {
      title: '按规范示范写五字',
      text: '本课会写尺、本、刀、不、少。对照第77页逐笔和田字格示范，观察笔画与位置；普通网页字体只供认字，不能代替规范笔顺或描红，不把用品全部名字加入会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'尺本刀不少'],
      },
      activity: '用田字格纸实际尝试五字，请家长看字形、笔顺和位置。',
    },
    {
      title: '记录整理发现',
      text: '记录一种用品或一次真实整理的发现。自己的用品、摆放习惯和还想练的内容可以不同，反思不判对错；未来计划要明确，家长可以代写，不需要个人身份资料。',
      activity: '用自己的话记录，不从反思推定已经掌握或已完成未来整理。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱顺序指读包尺作业笔刀宝贝少课早十一字；不扩大认写范围。',
    ),
    manual(
      'read',
      '与家长实际朗读原书第76—77页小书包；本课不加背诵必做。',
      reading,
    ),
    manual(
      'words',
      '按第76页实际读橡皮尺子作业本笔袋铅笔转笔刀六词，指出安全物品或词卡。',
    ),
    manual(
      'say',
      '实际向家长说自己的书包里有哪些学习用品；允许与原图不同，不上传个人资料。',
    ),
    manual(
      'stationery',
      '在平稳桌面实际尝试把安全文具摆放整齐，请家长查看；不要求试用刀具。',
    ),
    manual(
      'pack',
      '按次日实际需要尝试整理自己的书包并检查遗漏；不把摆桌面文具或未来计划算装包完成。',
    ),
    manual(
      'write',
      '按第77页规范示范用田字格纸实际尝试写尺本刀不少；家长看字形笔顺位置。',
    ),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个用品或整理发现，也可明确写下一次想练的计划。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可以代写。',
      explanation: '保留原话，正确性为null，不把未来计划当完成。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读76—77两页，十一会认五会写、六用品词、朗读、说用品、摆放文具和整理书包分别核对，无背诵必做。原页无个人署名、未知ISBN版印次不补造，全文原画录音外部共读。用途/练习安排明确原创，实物与学校要求可不同，不要求购买或使用刀具。实际活动人工确认，反思null，教师最终审校与全年仍待逐项验收。',
  },
};
