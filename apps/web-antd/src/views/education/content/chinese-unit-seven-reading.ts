import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const unitSevenReadingPageAudits = {
  boat: {
    itemId: 'u7-1',
    title: '小小的船',
    pages: [84, 85],
    recognize: '船弯儿两头在里看见闪',
    write: '月儿头里见',
    author: '叶圣陶',
    adaptedNote: false,
    activities: [
      '朗读课文',
      '背诵课文',
      '读词语照样子说',
      '认读十字',
      '规范书写五字',
    ],
  },
  shadow: {
    itemId: 'u7-2',
    title: '影子',
    pages: [86, 87],
    recognize: '影前常黑狗左右它好朋友',
    write: '在我左右',
    author: '林焕彰',
    adaptedNote: true,
    activities: [
      '朗读课文',
      '交流实际前后左右都是谁',
      '认读十一字',
      '规范书写四字',
    ],
  },
};
const source = {
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const unitSevenReadingSource = source;
const boatId = 'cu-u7-1';
const shadowId = 'cu-u7-2';
const boatReading =
  '先与家长共读教材印刷第84—85页《小小的船》，再回看指定信息。原书脚注署叶圣陶，未注明选作课文有改动，不自行增加说明；本站不提供现代作品全文、原画或录音。缺原书可跳过。月亮像船以及坐在月亮里是诗中比喻与想象，不是实际乘船或登月活动。';
const shadowReading =
  '先与家长共读教材印刷第86—87页《影子》，再回看指定信息。原书脚注署林焕彰、选作课文时有改动；本站不提供现代作品全文、原画或录音。缺原书可跳过。影子像小黑狗和好朋友是诗中表达，不是实际动物或人；前后左右按所说人物朝向参照，不把诗中不同位置当一时同时出现。';
const boatChars = [
  ['船', '小船中的第二个字。', '船只中的第一个字。'],
  ['弯', '弯弯中的第一个字。', '弯曲中的第一个字。'],
  ['儿', '月儿中的第二个字。', '船儿中的第二个字。'],
  ['两', '两头中的第一个字。', '两个中的第一个字。'],
  ['头', '两头中的第二个字。', '头顶中的第一个字。'],
  ['在', '我在中的第二个字。', '在家中的第一个字。'],
  ['里', '船里中的第二个字。', '里面中的第一个字。'],
  ['看', '看见中的第一个字。', '看到中的第一个字。'],
  ['见', '看见中的第二个字。', '见面中的第一个字。'],
  ['闪', '闪闪中的第一个字。', '闪光中的第一个字。'],
];
const shadowChars = [
  ['影', '影子中的第一个字。', '身影中的第二个字。'],
  ['前', '前后中的第一个字。', '前面中的第一个字。'],
  ['常', '常常中的第一个字。', '经常中的第二个字。'],
  ['黑', '黑狗中的第一个字。', '黑色中的第一个字。'],
  ['狗', '黑狗中的第二个字。', '小狗中的第二个字。'],
  ['左', '左右中的第一个字。', '左边中的第一个字。'],
  ['右', '左右中的第二个字。', '右边中的第一个字。'],
  ['它', '它是中的第一个字。', '它们中的第一个字。'],
  ['好', '好朋友中的第一个字。', '你好中的第二个字。'],
  ['朋', '朋友中的第一个字。', '亲朋中的第二个字。'],
  ['友', '朋友中的第二个字。', '友好中的第一个字。'],
];
export const boatDescriptionPairs = [
  ['船', '小小'],
  ['月儿', '弯弯'],
  ['星星', '闪闪'],
  ['天', '蓝蓝'],
] as const;
type Pair = {
  key: string;
  prompts: [string, string];
  labels: string[];
  values: [string, string];
  explanation: string;
  materials?: [string, string];
};
const boatPairs: Pair[] = [
  {
    key: 'reading-object',
    prompts: ['按课文，我想象自己坐在哪里？', '按课文，我看见哪些景物？'],
    labels: ['小小的船里', '星星与天', '真实登月舱'],
    values: ['小小的船里', '星星与天'],
    explanation:
      '坐在月亮像船的情境与看到星星和天是诗中想象，不是实际登月经历。',
    materials: [boatReading, boatReading],
  },
  {
    key: 'metaphor',
    prompts: [
      '按课文，弯弯的月儿被想象成什么？',
      '课文坐在月儿里属于怎样的表达？',
    ],
    labels: ['小船', '诗中想象', '现实真的乘坐月亮'],
    values: ['小船', '诗中想象'],
    explanation: '月儿像小船是形状联系，实际月亮不是船，读诗不当真实活动记录。',
    materials: [boatReading, boatReading],
  },
  {
    key: 'sound',
    prompts: [
      '对照本课注音，月儿的儿是哪项？',
      '对照本课注音，小小的船的的是哪项？',
    ],
    labels: ['ér', 'de', 'dì'],
    values: ['ér', 'de'],
    explanation:
      '本课儿读ér，的读轻声de；按原书语境看，不自动评声音或改成其他读法。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '只比较月与船，哪项在本课会写清单？',
      '只比较见与闪，哪项在本课会写清单？',
    ],
    labels: ['月', '船', '见', '闪'],
    values: ['月', '见'],
    explanation: '本课写月儿头里见，船闪等本课仅会认；只比较指定的一对。',
  },
];
const bodyCard =
  '本站原创虚构位置卡：孩子面向桌子；小安在孩子自己的左边，小禾在孩子自己的右边。按孩子朝向作参照，不按面对孩子的观察者左右。这里只存虚构名字。';
const shadowPairs: Pair[] = [
  {
    key: 'simile',
    prompts: [
      '按课文，第一段把影子比作什么？',
      '按课文，第二段说影子是我的什么？',
    ],
    labels: ['小黑狗', '好朋友', '真的会说话的人'],
    values: ['小黑狗', '好朋友'],
    explanation:
      '是诗中比喻与亲近表达，影子不真的成为动物或人；自己的感受另作开放交流。',
    materials: [shadowReading, shadowReading],
  },
  {
    key: 'position',
    prompts: [
      '按课文，第一段列出哪一组位置？',
      '按课文，第二段列出哪一组位置？',
    ],
    labels: ['前与后', '左与右', '上与下'],
    values: ['前与后', '左与右'],
    explanation:
      '按两段分别找，影子位置与光源和人物朝向有关，不表示同一时刻固定同时在四面。',
    materials: [shadowReading, shadowReading],
  },
  {
    key: 'sound-light',
    prompts: [
      '对照本课注音，影子的子是哪项？',
      '对照本课注音，朋友的友是哪项？',
    ],
    labels: ['zi', 'you', 'zǐ'],
    values: ['zi', 'you'],
    explanation:
      '本课子、友在相应词里读轻声，轻声不当第一声；实际声音听规范示范。',
  },
  {
    key: 'writing-scope',
    prompts: [
      '只比较在与影，哪项在本课会写清单？',
      '只比较我与朋，哪项在本课会写清单？',
    ],
    labels: ['在', '影', '我', '朋'],
    values: ['在', '我'],
    explanation: '本课写在我左右，影朋等仅会认；只比较指定的一对。',
  },
  {
    key: 'body-reference',
    prompts: [
      '按虚构位置卡，孩子自己的左边是谁？',
      '按虚构位置卡，孩子自己的右边是谁？',
    ],
    labels: ['小安', '小禾', '卡上没给'],
    values: ['小安', '小禾'],
    explanation:
      '参照对象是孩子自己的朝向，面对面观察者左右不能直接替换；不是实际同学信息。',
    materials: [bodyCard, bodyCard],
  },
  {
    key: 'opposite',
    prompts: [
      '只比较前与后，与前相对的是哪项？',
      '只比较左与右，与左相对的是哪项？',
    ],
    labels: ['前', '后', '左', '右'],
    values: ['后', '右'],
    explanation: '按指定的一对比较，实际描述人物位置还需明确参照对象。',
  },
];
function choice(
  id: string,
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
    hint: '先看清指定字词或参照，原书信息先共读后找依据。',
    explanation,
  };
}
function objective(
  id: string,
  characters: string[][],
  pairs: Pair[],
  review: boolean,
): Question[] {
  const index = review ? 1 : 0;
  return [
    ...characters.map((row, n) =>
      choice(
        id,
        `char-${n}`,
        required(row[index + 1]),
        characters.map((r) => required(r[0])),
        required(row[0]),
        '按指定词语认字，新增会认与会写清单分别看；字形题不自动评声音。',
        review,
      ),
    ),
    ...(id === boatId
      ? boatDescriptionPairs.map(([noun, description], n) =>
          choice(
            id,
            `description-${n}`,
            review
              ? `按第85页，${description}修饰哪个景物词？`
              : `按第85页，${noun}对应哪一个叠词？`,
            boatDescriptionPairs.map((r) => r[review ? 0 : 1]),
            review ? noun : description,
            '按原书对应词找信息；自己的合理叠词仿说开放，不要求所有景物只能这样描写。',
            review,
            boatReading,
          ),
        )
      : []),
    ...pairs.map((q) =>
      choice(
        id,
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
function manual(
  id: string,
  key: string,
  prompt: string,
  material?: string,
): Question {
  return {
    id: `${id}-manual-${key}`,
    knowledge: `${id}-manual-${key}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '实际尝试后家长确认，缺原书、纸笔或规范示范可跳过。',
    explanation: '不自动评声音笔顺或表达，不把将来计划当完成。',
  };
}
function reflection(id: string): Question {
  return {
    id: `${id}-reflect-discovery`,
    knowledge: `${id}-reflect-discovery`,
    prompt: '记录一个字词、朗读或表达发现，也可明确写下一次想练的计划。',
    rule: { kind: 'reflection' },
    hint: '用自己的话，家长可以代写。',
    explanation: '保留原话，正确性为null，不把未来计划当实际完成。',
  };
}
export const littleBoatLesson: Lesson = {
  id: boatId,
  title: '小小的船',
  textbookTitle: '小小的船',
  page: 84,
  version: 1,
  status: 'available',
  goal: '认十字写月儿头里见，联系月亮像船的想象，读背课文并照叠词样子仿说。',
  prerequisite: '准备第84—85页原书与田字格纸，可请家长陪读。',
  parentTip:
    '依据第三方原书公开预览两页，原署叶圣陶未注明有改动，未知ISBN版印次不补造。朗读背诵与叠词仿说分别确认，诗中坐月亮不是实际乘船或登月。现代全文原画录音外部共读，教师最终审校仍待完成。',
  steps: [
    {
      title: '共读并认十字',
      text: `${boatReading}本课认船、弯、儿、两、头、在、里、看、见、闪，先借拼音听规范示范，再放回词语。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: boatChars.map((r) => required(r[0])),
      },
      activity: '实际打乱十字顺序指读，家长确认尝试。',
    },
    {
      title: '月亮像船的想象',
      text: '回看原书怎样把弯弯的月儿联系到小船形状，分清我坐在其中是诗中想象。月亮不是真的船，图中人物坐在月亮上也不是可照做的现实动作；不要求乘船或夜间外出。',
      activity: '向家长实际说一处想象及原书依据，也可说自己觉得有趣的地方。',
    },
    {
      title: '读四组叠词',
      text: '第85页分别读小小的船、弯弯的月儿、闪闪的星星、蓝蓝的天，观察词语重复怎样写大小、形状、状态或颜色。先按原书对应找词，自己的景物描述可合理不同，不说所有时候的天空都蓝。',
      activity: '实际读四组词，向家长说明一组词与景物的联系。',
    },
    {
      title: '照样子自己说',
      text: '按第85页要求照样子说，可以换自己见过的景物及合适叠词。本站原创启发例：绿绿的叶子、圆圆的皮球。不是教材原句，没有唯一答案，不要求照抄示例；可以说实际观察，也可以明确说自己的想象。',
      activity: '实际向家长仿说一两组，听回应后按自己意思调整。',
    },
    {
      title: '按规范示范写五字',
      text: '本课会写月、儿、头、里、见。对照第84页逐笔和田字格示范，观察笔画位置；普通网页字体只供认字，不能代替规范笔顺或描红，船闪等不自动加入会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'月儿头里见'],
      },
      activity: '用田字格纸实际尝试五字，请家长看字形、笔顺和位置。',
    },
    {
      title: '实际朗读',
      text: '第85页要求朗读课文，先听借助拼音的规范示范，再试着读词语和语句，注意的读轻声de，月儿的儿原页读ér。读音节奏由家长查看，不因客观题答对自动算已读。',
      activity: '实际朗读后听一条回应，试着调整。',
    },
    {
      title: '另做背诵',
      text: '第85页另要求背诵课文。可先借词卡回想，再合上书尝试；读和背分开记录，不因朗读完成就自动算背过。暂时不会或缺资料可跳过后再练。',
      activity: '实际尝试背诵，请家长回看原书确认尝试。',
    },
    {
      title: '交流并记录发现',
      text: '可以说一个叠词、景物或诗中想象的发现。表达开放，自己的感受不同也可以；反思保留原话，未来计划不当已经完成，不要求姓名、照片或地点身份资料。',
      activity: '实际交流后记录，还想练的字或句子可请家长代写。',
    },
  ],
  questions: [
    ...objective(boatId, boatChars, boatPairs, false),
    manual(
      boatId,
      'recognize',
      '实际打乱顺序指读船弯儿两头在里看见闪十字；不扩认写范围。',
    ),
    manual(
      boatId,
      'read',
      '与家长实际朗读第84—85页小小的船，注意字词和语句；不自动评声音。',
      boatReading,
    ),
    manual(
      boatId,
      'recite',
      '按第85页另行实际尝试背诵，不把朗读确认当背诵完成。',
      boatReading,
    ),
    manual(boatId, 'words', '实际读第85页四组叠词与景物，再说一组联系。'),
    manual(
      boatId,
      'imitate',
      '照原书样子实际向家长仿说一两组合理叠词景物，听回应再调整；表达开放。',
    ),
    manual(
      boatId,
      'write',
      '按第84页规范示范实际用田字格纸写月儿头里见，家长看字形笔顺位置。',
    ),
    manual(
      boatId,
      'talk',
      '实际与家长交流诗中想象或叠词发现，区分想象与真实活动。',
      boatReading,
    ),
    reflection(boatId),
  ],
  reviewQuestions: objective(boatId, boatChars, boatPairs, true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读84—85，叶圣陶署名十认五写、朗读背诵和叠词仿说分别核对，原页未注明有改动不自行加。现代全文原画录音外部共读，月亮比喻与想象不当真实活动，仿说开放。未知ISBN版印次不补造，实际活动人工确认、反思null、计划不当完成，教师最终审校与全年待逐项验收。',
  },
};
export const shadowLesson: Lesson = {
  id: shadowId,
  title: '影子',
  textbookTitle: '影子',
  page: 86,
  version: 1,
  status: 'available',
  goal: '认十一字写在我左右，朗读与比喻理解，按自身朝向交流实际前后左右。',
  prerequisite:
    '准备第86—87页原书和田字格纸，可请家长陪读；位置交流只需身边安全环境。',
  parentTip:
    '第三方原书公开预览86—87页，林焕彰改选、十一认四写、朗读及前后左右交流核对；本课不加背诵必做。诗中比喻不当真实动物/人，位置依参照和光源，不用同一时刻固定四面解释。真实人名只口头/纸面，网站不要求录入。未知ISBN版印次不补造，教师最终审校待完成。',
  steps: [
    {
      title: '共读并认十一字',
      text: `${shadowReading}本课认影、前、常、黑、狗、左、右、它、好、朋、友，先听原书注音规范示范，再放回词语。影子的子、朋友的友在本课读轻声。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: shadowChars.map((r) => required(r[0])),
      },
      activity: '实际打乱十一字顺序指读，再尝试读影子、朋友。',
    },
    {
      title: '分别看两段位置',
      text: '回看第一段列前后、第二段列左右，按段落找信息。影子位置与光源、人的位置和朝向有关，课文列出的不同情况不是一时同时固定出现在四面；不从原书静态图推算运动或速度。',
      activity: '实际指读两组位置词，向家长指出分别在哪一段。',
    },
    {
      title: '小黑狗与好朋友的表达',
      text: '原书用小黑狗和好朋友联系影子跟随的样子及亲近感。是比喻和诗中表达，影子不是实际动物或人，不会自己说话；个人对影子的感受开放，不以喜不喜欢影子判对错。',
      activity:
        '与家长实际交流一个有趣的表达或自己的感受，说明想象与现实区别。',
    },
    {
      title: '以自己的朝向认前后左右',
      text: '按第87页问题，先确定自己的面向，再说自己的前后左右是谁或是什么。面对自己的观察者左右不能直接替换自己的左右；可以用家长或安全物品作参照，也可在纸面用虚构名字，不要求录入真实同学姓名。',
      activity:
        '实际在安全位置辨认四个方向，向家长说明参照；身体情况不适合移动时可以原位指认。',
    },
    {
      title: '读词后交流实际位置',
      text: '本课虚构位置卡只用于客观练习，不是实际同学资料。真实位置会随朝向和站位改变，交流时说清是谁的哪一侧，不用选择题答对自动确认已做身体活动；没有人或物的方向可以如实说没有。',
      activity:
        '实际向家长说一两句身边位置，或指读两组方向词并说明不同，不需要照片地址。',
    },
    {
      title: '按规范示范写四字',
      text: '本课会写在、我、左、右。对照第87页逐笔和田字格示范，观察笔画与位置；普通网页字体只供认字，不能代替规范笔顺或描红，不把影朋等加入会写。',
      visual: { kind: 'characters', grid: 'tian', characters: [...'在我左右'] },
      activity: '用田字格纸实际尝试四字，请家长看字形笔顺和位置。',
    },
    {
      title: '实际朗读并记录',
      text: '第87页要求朗读课文与前后左右交流，没有背诵必做。实际朗读后听家长回应，再记录一个字词、位置或表达发现；反思保留原话，未来计划不当完成，不以自动评分代替真实声音观察。',
      activity: '实际朗读并交流后分别确认；还想练什么可请家长代写。',
    },
  ],
  questions: [
    ...objective(shadowId, shadowChars, shadowPairs, false),
    manual(
      shadowId,
      'recognize',
      '实际打乱顺序指读影前常黑狗左右它好朋友十一字，再读影子和朋友。',
    ),
    manual(
      shadowId,
      'read',
      '与家长实际朗读第86—87页影子；不增加背诵必做，不自动评声音。',
      shadowReading,
    ),
    manual(
      shadowId,
      'words',
      '按原书实际指读前后、左右两组位置词，分别说一个联系。',
    ),
    manual(
      shadowId,
      'direction',
      '确定自己朝向，实际指认身边前后左右的人或物，向家长说明参照；不录入真实同学资料。',
    ),
    manual(
      shadowId,
      'write',
      '按第87页规范示范实际用田字格纸写在我左右，家长看字形笔顺位置。',
    ),
    manual(
      shadowId,
      'talk',
      '实际与家长交流一个位置或诗中比喻发现；没有身边人/物可如实说没有，不自动判喜欢与感受。',
    ),
    reflection(shadowId),
  ],
  reviewQuestions: objective(shadowId, shadowChars, shadowPairs, true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '实读86—87，林焕彰改选、十一认四写、朗读及实际前后左右交流核对，不增加背诵必做。现代全文原画录音外部共读，比喻不当实际动物人，四位置不当一时固定同时出现，朝向参照明确，虚构卡不当真实资料。未知ISBN版印次不补造，实际活动人工确认、反思null、计划不当完成，教师最终审校及全年待逐项验收。',
  },
};
