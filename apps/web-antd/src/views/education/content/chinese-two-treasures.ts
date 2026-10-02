import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const twoTreasuresPageAudit = {
  itemId: 'u7-3',
  title: '两件宝',
  pages: [88, 89],
  recognize: '件有和做也办到又才能',
  write: '和也又才',
  author: '陶行知',
  adapted: true,
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
  activities: [
    '朗读课文',
    '背诵课文',
    '说两件宝能做什么及为什么一起用',
    '认读十字',
    '规范书写四字',
  ],
};
const id = 'cu-u7-3';
const reading =
  '先与家长共读教材印刷第88—89页《两件宝》，再按所问信息回看。原书脚注署陶行知、选作课文时有改动；本站不提供教材全文、原画或录音。缺原书可跳过，不凭选择题代替共读。';
const characters = [
  ['件', '两件中的第二个字。', '一件中的第二个字。'],
  ['有', '有人中的第一个字。', '拥有中的第二个字。'],
  ['和', '和好中的第一个字。', '温和中的第二个字。'],
  ['做', '做工中的第一个字。', '做事中的第一个字。'],
  ['也', '也好中的第一个字。', '也是中的第一个字。'],
  ['办', '办法中的第一个字。', '办理中的第一个字。'],
  ['到', '到家中的第一个字。', '来到中的第二个字。'],
  ['又', '又来中的第一个字。', '又见中的第一个字。'],
  ['才', '才能中的第一个字。', '人才中的第二个字。'],
  ['能', '才能中的第二个字。', '能力中的第一个字。'],
];
// The printed recognition row has ten individual characters; keep the literal source scope.
type Pair = {
  key: string;
  prompts: [string, string];
  labels: string[];
  values: [string, string];
  explanation: string;
  material?: string;
};
const pairs: Pair[] = [
  {
    key: 'treasure-use',
    prompts: ['按课文，双手联系哪一种作用？', '按课文，大脑联系哪一种作用？'],
    labels: ['做工', '思考', '不用实际尝试'],
    values: ['做工', '思考'],
    explanation:
      '分别查找课文两种作用，再联系动手和思考配合，不用此题推定个人身体能力。',
    material: reading,
  },
  {
    key: 'treasures',
    prompts: ['按课文，两件宝指哪一组？', '按课文，哪一项同时联系动手与思考？'],
    labels: ['双手与大脑', '用手又用脑', '金银首饰'],
    values: ['双手与大脑', '用手又用脑'],
    explanation:
      '宝是重视身体与思考的表达，不是首饰；配合理念不要求每人只能用同一种身体方式。',
    material: reading,
  },
  {
    key: 'sound',
    prompts: ['对照本课注音，和是哪项？', '对照本课注音，做是哪项？'],
    labels: ['hé', 'zuò', 'huó'],
    values: ['hé', 'zuò'],
    explanation:
      '按本课语境和注音比较，和的其他语境可能有其他读音；字形题不自动评发音。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '只比较和与件，哪项在本课会写清单？',
      '只比较才与能，哪项在本课会写清单？',
    ],
    labels: ['和', '件', '才', '能'],
    values: ['和', '才'],
    explanation: '本课写和也又才，件能不自动加入会写；只比较指定一对。',
  },
  {
    key: 'plan-action',
    prompts: [
      '按原创整理卡，先看图想摆法属于哪项？',
      '按原创整理卡，按想好的办法摆纸片属于哪项？',
    ],
    labels: ['先想办法', '实际尝试', '已经完成未来计划'],
    values: ['先想办法', '实际尝试'],
    explanation: '思考安排与实际尝试分别记录，计划不当完成；合理摆法可以不同。',
    material:
      '本站原创活动卡：用几张安全纸片摆自己喜欢的形状，先看图想一种摆法，再实际尝试，最后观察并调整。不使用刀具，没有唯一作品。',
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
    hint: '看清指定字词或条件，原书信息先共读再查找。',
    explanation,
  };
}
function objective(review: boolean): Question[] {
  const i = review ? 1 : 0;
  return [
    ...characters.map((r, n) =>
      choice(
        `char-${n}`,
        required(r[i + 1]),
        characters.map((c) => required(c[0])),
        required(r[0]),
        '按指定词语认字，会认与会写分别看，不自动评声音或笔顺。',
        review,
      ),
    ),
    ...pairs.map((p) =>
      choice(
        p.key,
        p.prompts[i],
        p.labels,
        p.values[i],
        p.explanation,
        review,
        p.material,
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
    hint: '实际尝试后家长确认，缺资料可跳过。',
    explanation: '只记录实际尝试，不自动评分，不把计划当完成。',
  };
}
export const twoTreasuresLesson: Lesson = {
  id,
  title: '两件宝',
  textbookTitle: '两件宝',
  page: 88,
  version: 1,
  status: 'available',
  goal: '认十字写和也又才，读背课文，说动手与思考怎样配合，并实际尝试一个安全小活动。',
  prerequisite: '准备第88—89页原书、田字格纸及可选安全纸片，请家长陪读。',
  parentTip:
    '依据原书两页陶行知改选，认件有和做也办到又才能十字、写和也又才四字；课后朗读背诵和说两件宝作用分别记录。原文表达配合理念，不据身体方式评价人，活动可按自身情况用辅助工具或家长协助。未知ISBN版印次不补造，现代全文原画录音外部共读，教师最终审校待完成。',
  steps: [
    {
      title: '共读并认十字',
      text: `${reading}本课会认件、有、和、做、也、办、到、又、才、能十字，听规范注音示范，再放回词语认读。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '实际打乱十字顺序指读，家长查看尝试。',
    },
    {
      title: '两件宝是什么',
      text: '回看原书双手与大脑两种作用，宝是重视的表达，不是金银首饰。按课文信息找做工与思考，再用自己的话说；不把词语选择答对当实际做过。',
      activity: '实际向家长说课文中两件宝各能做什么。',
    },
    {
      title: '为什么要配合',
      text: '第89页要求说为什么要用手又用脑，可以联系先想办法、实际尝试、再观察调整。课文强调动手与思考结合，不当每个现实任务的绝对能力判定，也不以身体差异评价人；可以按自身情况使用辅助工具或请人协助。',
      activity: '实际说一种配合办法，自己的合理例子开放，不要求唯一答案。',
    },
    {
      title: '想办法再安全尝试',
      text: '本站原创纸片活动不是教材原题：选择安全纸片，先想自己喜欢的摆法，再实际摆并观察是否需要调整。没有唯一作品，不要求购买材料或使用刀具；缺材料可跳过。先想与后做分开，未来计划不当已经完成。',
      activity:
        '实际尝试一种安全摆法并向家长说明一次调整，可使用辅助工具或协助。',
    },
    {
      title: '按规范示范写四字',
      text: '会写和、也、又、才四字，对照第89页逐笔和田字格示范。普通网页字体只供认字，不替代规范笔顺或描红，不将全部会认字加入会写；也与又分别观察字形和位置。',
      visual: { kind: 'characters', grid: 'tian', characters: [...'和也又才'] },
      activity: '实际用田字格纸尝试四字，家长看字形笔顺位置。',
    },
    {
      title: '分别朗读与背诵',
      text: '第89页要求朗读和背诵，先借注音听规范示范，实际朗读后，再合书尝试背诵。和在本课读hé，做读zuò；家长回看原书确认实际声音，不把朗读记录自动算背过。',
      activity: '分别尝试朗读与背诵，缺资料或暂时不会可跳过后再练。',
    },
    {
      title: '交流并记录',
      text: '实际交流一个动手与思考的发现，自己的活动与感受开放。反思保留原话，家长可代写；还想练的字或未来活动要明确写成计划，不据反思推定已经完成。',
      activity: '实际向家长说一个发现后记录，不要求姓名学校或照片。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱顺序指读件有和做也办到又才能十字，不扩大新增认写清单。',
    ),
    manual('read', '与家长实际朗读第88—89页两件宝，不自动评声音。', reading),
    manual(
      'recite',
      '另行合书实际尝试背诵两件宝，不能用朗读确认替代。',
      reading,
    ),
    manual(
      'explain',
      '按课后要求，实际说两件宝各能做什么及为什么配合；合理例子开放。',
      reading,
    ),
    manual(
      'try',
      '实际尝试原创安全纸片活动并说明调整，可按自身情况使用协助；计划不当完成。',
    ),
    manual(
      'write',
      '按第89页规范示范实际写和也又才四字，家长查看字形笔顺位置。',
    ),
    manual('talk', '实际向家长交流一个动手与思考的发现，不推定个人身体能力。'),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个认字、读背或配合活动发现，也可明确写下一次计划。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可以代写。',
      explanation: '反思不判对错，正确性null，未来计划不当实际完成。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读88—89页，陶行知改选、十会认四会写、朗读背诵与作用交流分别核对。原角色作用不扩成现实绝对能力判定，原创安全纸片活动与原书问题分开，允许不同身体方式与协助。未知ISBN版印次不补造，现代全文原画录音外部共读；实际人工确认、反思null、计划不当完成，教师最终审校与全年待逐项验收。',
  },
};
