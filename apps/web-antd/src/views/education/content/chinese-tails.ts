import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
export const tailsPageAudit = {
  itemId: 'u8-1',
  title: '比尾巴',
  pages: [95, 96],
  recognize: '比尾巴谁长短把伞兔最公',
  write: '比巴长公',
  author: '崔宏明',
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
    '照样子做问答游戏',
    '认读十一字',
    '规范书写四字',
  ],
};
const id = 'cu-u8-1';
const reading =
  '先与家长共读教材印刷第95—96页《比尾巴》，再按问题回看。原书脚注署崔宏明、选作课文时有改动；本站不提供教材全文、原画或录音。课文动物与描述是指定阅读信息，不当所有现实种类个体的统一标准。缺原书可跳过；自己的好看与可爱偏好开放。';
const characters = [
  ['比', '比一比中的第一个字。', '比较中的第一个字。'],
  ['尾', '尾巴中的第一个字。', '结尾中的第二个字。'],
  ['巴', '尾巴中的第二个字。', '巴士中的第一个字。'],
  ['谁', '谁的中的第一个字。', '是谁中的第二个字。'],
  ['长', '长短中的第一个字。', '很长中的第二个字。'],
  ['短', '长短中的第二个字。', '短小中的第一个字。'],
  ['把', '一把中的第二个字。', '把手中的第一个字。'],
  ['伞', '一把伞中的第三个字。', '雨伞中的第二个字。'],
  ['兔', '兔子中的第一个字。', '白兔中的第二个字。'],
  ['最', '最好看中的第一个字。', '最先中的第一个字。'],
  ['公', '公鸡中的第一个字。', '公共中的第一个字。'],
];
export const tailPairs = [
  ['猴子', '长'],
  ['兔子', '短'],
  ['松鼠', '好像一把伞'],
  ['公鸡', '弯'],
  ['鸭子', '扁'],
  ['孔雀', '最好看'],
] as const;
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
    key: 'sound',
    prompts: [
      '对照本课注音，尾巴的巴是哪项？',
      '对照本课注音，谁的的的是哪项？',
    ],
    labels: ['ba', 'de', 'bā'],
    values: ['ba', 'de'],
    explanation:
      '本课两个指定词中巴与的读轻声，轻声不当第一声；实际声音先听规范示范。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '只比较比与尾，哪个是本课会写？',
      '只比较公与伞，哪个是本课会写？',
    ],
    labels: ['比', '尾', '公', '伞'],
    values: ['比', '公'],
    explanation:
      '本课写比巴长公四字，会认十一字不全部加入会写；只比较指定一对。',
  },
  {
    key: 'question-answer',
    prompts: [
      '按原创问答卡，哪句在提出问题？',
      '按原创问答卡，哪句在回应这个问题？',
    ],
    labels: ['你喜欢哪一种动物？', '我喜欢小猫。', '没有实际交流也算完成'],
    values: ['你喜欢哪一种动物？', '我喜欢小猫。'],
    explanation:
      '看问句与回答的联系，这是原创示例不是教材原句；孩子可以喜欢其他动物，不能按示例唯一判偏好。',
    material:
      '本站原创问答卡：家长问你喜欢哪一种动物，虚构孩子回答我喜欢小猫。只比较语句作用，真实偏好允许不同。',
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
        '新增会认与会写分别核对，字形题不自动评声音。',
        review,
      ),
    ),
    ...tailPairs.map(([animal, description], n) =>
      choice(
        `tail-${n}`,
        review
          ? `按课文，尾巴描述${description}对应哪个动物？`
          : `按课文，${animal}的尾巴对应哪项描述？`,
        tailPairs.map((r) => r[review ? 0 : 1]),
        review ? animal : description,
        '只按课文所列对象找对应，不推广所有种类或个体；最好看是课文表述，个人偏好开放。',
        review,
        reading,
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
export const tailsLesson: Lesson = {
  id,
  title: '比尾巴',
  textbookTitle: '比尾巴',
  page: 95,
  version: 1,
  status: 'available',
  goal: '认十一字写比巴长公，按课文找六组尾巴描述，读背课文并做开放问答游戏。',
  prerequisite: '准备第95—96页原书与田字格纸，可请家长陪读。',
  parentTip:
    '原书两页崔宏明改选、十一认四写及朗读背诵/问答游戏分别核对。课文孔雀最好看与个人偏好分开，动物描述不推广所有现实种类个体；不要求接近或拉扯动物。现代全文原画声音外部共读，未知ISBN版印次不补造，实际活动人工确认，教师最终审校待完成。',
  steps: [
    {
      title: '共读并认十一字',
      text: `${reading}新增认比、尾、巴、谁、长、短、把、伞、兔、最、公，听注音示范，再放回词语认读。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: characters.map((r) => required(r[0])),
      },
      activity: '实际打乱十一字顺序指读，听家长回应再试。',
    },
    {
      title: '先看长短与像伞',
      text: '第95页第一组问答分别看猴子、兔子、松鼠，回原书找长、短、好像一把伞的联系。像伞是形状比喻，不是真的雨伞，不说所有种类或个体尾巴一定相同；只按课文描述查信息，不要求实际触摸或拉动物尾巴。',
      activity: '实际指读三组对应，向家长说一处比喻与实际物品不同。',
    },
    {
      title: '再看弯扁与好看',
      text: '第95—96页另一组分别看公鸡、鸭子、孔雀，回原书找弯、扁、最好看的描述。课文所说孔雀最好看只是文本表述；你也可以觉得别的动物好看或可爱，不以个人偏好唯一判分，不要求模仿动物身体动作。',
      activity: '实际按课文说三组对应，再交流自己愿意说的偏好。',
    },
    {
      title: '按规范示范写四字',
      text: '本课会写比、巴、长、公四字。按第96页逐笔和田字格示范观察笔画、位置，再实际尝试；网页字体只供认字，不替代规范笔顺或描红，尾谁伞等不增加本课会写。',
      visual: { kind: 'characters', grid: 'tian', characters: [...'比巴长公'] },
      activity: '实际用田字格纸尝试四字，家长查看字形笔顺位置。',
    },
    {
      title: '实际朗读问与答',
      text: '第96页要求朗读课文，回看问句和答句的联系，听规范示范后尝试问句语气。尾巴的巴、本课谁的的读轻声；朗读由家长听实际声音，不以字形或注音选择题自动认定已经读准。',
      activity: '实际朗读问句及回应，听家长回应后调整。',
    },
    {
      title: '另行尝试背诵',
      text: '课后另要求背诵，可以借六组动物描述回想，再合书实际尝试。不因朗读完成就算背过，缺原书或暂时不会可跳过后再练，背诵确认与客观答对分别记录。',
      activity: '另行实际尝试背诵，家长回看原书确认尝试。',
    },
    {
      title: '照样子做问答游戏',
      text: '按第96页照样子问与答，可用原书一组，也可以自选动物或安全物品换一个合理问题。先听清对方问什么，再给相关回答，轮换提问者；原创喜欢小猫卡不是教材原句，自己觉得可爱好看可以不同，不要求照抄唯一答案。',
      activity:
        '实际与家长问答一轮，换提问者再尝试；没有真实交流不自动算完成。',
    },
    {
      title: '记录发现与计划',
      text: '可以记录一个认字、描写、问答或读背发现，个人偏好和自己的合理例子开放。还想练什么写为下一次计划，不当已经完成；家长可代写，不需要真实姓名、地址或照片。',
      activity: '实际交流后保留自己的话，反思不判对错。',
    },
  ],
  questions: [
    ...objective(false),
    manual(
      'recognize',
      '实际打乱顺序指读比尾巴谁长短把伞兔最公十一字，不扩大认写范围。',
    ),
    manual(
      'pairs',
      '按第95—96页实际指读六组动物尾巴描述，不推广所有现实种类个体。',
      reading,
    ),
    manual('write', '按第96页规范示范实际写比巴长公四字，家长看字形笔顺位置。'),
    manual(
      'read',
      '实际朗读比尾巴的问句及回应，注意轻声与问句语气，不自动评声音。',
      reading,
    ),
    manual('recite', '另行实际尝试背诵，不以朗读确认替代。', reading),
    manual(
      'game',
      '按第96页照样子实际与家长问答并轮换提问者，合理问题答案开放。',
    ),
    manual(
      'talk',
      '实际向家长说一个描述发现或自己的动物偏好，不唯一判好看可爱。',
    ),
    {
      id: `${id}-reflect-discovery`,
      knowledge: `${id}-reflect-discovery`,
      prompt: '记录一个字词、描述或问答发现，也可以写自己的偏好。',
      rule: { kind: 'reflection' },
      hint: '用自己的话，家长可代写。',
      explanation: '原话保留，正确性null，不把个人偏好唯一判分。',
    },
    {
      id: `${id}-reflect-plan`,
      knowledge: `${id}-reflect-plan`,
      prompt: '明确写下一次想练的字、读背或问答计划。',
      rule: { kind: 'reflection' },
      hint: '未来计划与实际完成分开。',
      explanation: '正确性null，不把未来计划算完成。',
    },
  ],
  reviewQuestions: objective(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读95—96，崔宏明改选、十一认四写、六组描述与朗读背诵/问答游戏分别核对。现代全文原画声音外部共读，未知ISBN版印次不补造。按课文对应与开放个人偏好分开，像伞不当实物、动物描述不推广所有现实个体，不触摸拉扯动物；实际人工确认、反思null、计划不当完成，教师最终审校与全年待逐项验收。',
  },
};
