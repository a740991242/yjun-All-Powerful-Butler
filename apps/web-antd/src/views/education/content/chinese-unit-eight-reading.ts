import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
export const unitEightReadingSource = {
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const unitEightReadingPageAudits = {
  crow: {
    itemId: 'u8-2',
    title: '乌鸦喝水',
    pages: [97, 98],
    recognize: '喝只处找许石出法放进高',
    write: '只多办石出',
    familiar: '着',
    author: null,
    sourceNote: '根据《伊索寓言》相关内容改写',
    activities: [
      '朗读课文',
      '说明喝水办法',
      '认读十一字',
      '熟字着新读音',
      '规范书写五字',
    ],
  },
  rain: {
    itemId: 'u8-3',
    title: '雨点儿',
    pages: [99, 100],
    recognize: '点彩半空问回答方久更',
    write: '来半你有',
    familiar: '数长',
    author: '金波',
    adapted: true,
    activities: [
      '分角色朗读课文',
      '五词不字读音',
      '长句停顿',
      '认读十字',
      '熟字数长新读音',
      '规范书写四字',
    ],
  },
};
type Pair = {
  key: string;
  prompts: [string, string];
  labels: string[];
  values: [string, string];
  explanation: string;
  material?: string;
};
const crowReading =
  '先与家长共读第97—98页《乌鸦喝水》，再按所问回看。原书脚注为根据《伊索寓言》相关内容改写，未署个人改写者，不补造。本站不提供这版教材全文、原画或录音，缺书可跳过；不拿这一个情境推广所有容器、材料或动物行为。';
const rainReading =
  '先与家长共读第99—100页《雨点儿》，再按所问回看。原脚注署金波、选作课文时有改动，本站不提供全文、原画或录音，缺书可跳过。雨点说话是拟人，植物变化是故事表达，不当每次下雨立即开花的科学保证。';
const crowChars = [
  ['喝', '喝水中的第一个字。', '喝着中的第一个字。'],
  ['只', '一只中的第二个字。', '只数中的第一个字。'],
  ['处', '到处中的第二个字。', '处处中的第一个字。'],
  ['找', '找水中的第一个字。', '找到中的第一个字。'],
  ['许', '许多中的第一个字。', '不许中的第二个字。'],
  ['石', '石子中的第一个字。', '石头中的第一个字。'],
  ['出', '想出中的第二个字。', '出来中的第一个字。'],
  ['法', '办法中的第二个字。', '方法中的第二个字。'],
  ['放', '放进中的第一个字。', '放下中的第一个字。'],
  ['进', '放进中的第二个字。', '进去中的第一个字。'],
  ['高', '升高中的第二个字。', '高低中的第一个字。'],
];
const rainChars = [
  ['点', '雨点中的第二个字。', '点点中的第一个字。'],
  ['彩', '云彩中的第二个字。', '彩色中的第一个字。'],
  ['半', '半空中的第一个字。', '一半中的第二个字。'],
  ['空', '半空中的第二个字。', '天空中的第二个字。'],
  ['问', '问答中的第一个字。', '提问中的第二个字。'],
  ['回', '回答中的第一个字。', '回来中的第一个字。'],
  ['答', '回答中的第二个字。', '答案中的第一个字。'],
  ['方', '地方中的第二个字。', '方向中的第一个字。'],
  ['久', '不久中的第二个字。', '长久中的第二个字。'],
  ['更', '更红中的第一个字。', '更加中的第一个字。'],
];
const crowPairs: Pair[] = [
  {
    key: 'reading-problem',
    prompts: ['按课文，瓶里的水量怎样？', '按课文，瓶口大小怎样？'],
    labels: ['水不多', '瓶口小', '已经轻易喝到'],
    values: ['水不多', '瓶口小'],
    explanation: '两种条件共同导致喝不着，不把水量与瓶口混为一件事。',
    material:
      '先与家长共读第97—98页《乌鸦喝水》，再按所问回看。原书脚注为根据《伊索寓言》相关内容改写，未署个人改写者，不补造。本站不提供这版教材全文、原画或录音，缺书可跳过；不拿这一个情境推广所有容器、材料或动物行为。',
  },
  {
    key: 'reading-method',
    prompts: ['按课文，乌鸦把什么放进瓶里？', '按课文，放入之后水怎样变化？'],
    labels: ['小石子', '渐渐升高', '瓶子自己长高'],
    values: ['小石子', '渐渐升高'],
    explanation: '原书先放石再水升，不把水面升高当瓶身变高或突然多出水。',
    material:
      '先与家长共读第97—98页《乌鸦喝水》，再按所问回看。原书脚注为根据《伊索寓言》相关内容改写，未署个人改写者，不补造。本站不提供这版教材全文、原画或录音，缺书可跳过；不拿这一个情境推广所有容器、材料或动物行为。',
  },
  {
    key: 'reading-ending',
    prompts: [
      '按课文，最后乌鸦的结果是哪项？',
      '按课文，哪个变化使它能喝到水？',
    ],
    labels: ['喝着水了', '水面升高', '石子变成饮用水'],
    values: ['喝着水了', '水面升高'],
    explanation: '原书信息按条件解释，故事答案不当实际动物行为承诺。',
    material:
      '先与家长共读第97—98页《乌鸦喝水》，再按所问回看。原书脚注为根据《伊索寓言》相关内容改写，未署个人改写者，不补造。本站不提供这版教材全文、原画或录音，缺书可跳过；不拿这一个情境推广所有容器、材料或动物行为。',
  },
  {
    key: 'reading-order',
    prompts: ['按课文，想出办法之前看见什么？', '按课文，想出办法之后做什么？'],
    labels: ['许多小石子', '把石子放进瓶子', '已经结束再找石子'],
    values: ['许多小石子', '把石子放进瓶子'],
    explanation: '先观察再采取行动，想办法与实际做分别找；未来计划不当已做。',
    material:
      '先与家长共读第97—98页《乌鸦喝水》，再按所问回看。原书脚注为根据《伊索寓言》相关内容改写，未署个人改写者，不补造。本站不提供这版教材全文、原画或录音，缺书可跳过；不拿这一个情境推广所有容器、材料或动物行为。',
  },
  {
    key: 'quantity',
    prompts: ['按课文，旁边石子数量怎样写？', '按课文，放石子过程怎样写？'],
    labels: ['许多', '一颗一颗', '原书指定三颗'],
    values: ['许多', '一颗一颗'],
    explanation: '许多未给精确数量，逐颗与总数不同，不从插图推指定三颗。',
    material:
      '先与家长共读第97—98页《乌鸦喝水》，再按所问回看。原书脚注为根据《伊索寓言》相关内容改写，未署个人改写者，不补造。本站不提供这版教材全文、原画或录音，缺书可跳过；不拿这一个情境推广所有容器、材料或动物行为。',
  },
  {
    key: 'sound',
    prompts: ['按本课注音，喝不着的着是哪项？', '按本课注音，一只的只是哪项？'],
    labels: ['zháo', 'zhī', 'zhe'],
    values: ['zháo', 'zhī'],
    explanation:
      '着为熟字在本课学新读音，不增加新会认数，不能在所有语境统一读轻声。',
  },
  {
    key: 'writing-scope',
    prompts: ['只比较只与喝，哪个本课会写？', '只比较石与许，哪个本课会写？'],
    labels: ['只', '喝', '石', '许'],
    values: ['只', '石'],
    explanation: '会写只多办石出五字，不将全部会认或熟字新读音增加会写。',
  },
];
const rainPairs: Pair[] = [
  {
    key: 'reading-destination',
    prompts: [
      '按课文，小雨点儿想去怎样的地方？',
      '按课文，大雨点儿想去怎样的地方？',
    ],
    labels: ['有花有草', '没有花没有草', '原书指定城市'],
    values: ['有花有草', '没有花没有草'],
    explanation: '两角色的目的地不同，不根据大小推现实雨滴意图。',
    material:
      '先与家长共读第99—100页《雨点儿》，再按所问回看。原脚注署金波、选作课文时有改动，本站不提供全文、原画或录音，缺书可跳过。雨点说话是拟人，植物变化是故事表达，不当每次下雨立即开花的科学保证。',
  },
  {
    key: 'reading-growth',
    prompts: [
      '按课文，有花有草的地方后来怎样？',
      '按课文，没有花没有草的地方后来怎样？',
    ],
    labels: ['花更红草更绿', '开花长草', '立即变成沙漠'],
    values: ['花更红草更绿', '开花长草'],
    explanation:
      '更与原本没有再长出分别看；故事效果不推广所有土壤气候或每次降雨。',
    material:
      '先与家长共读第99—100页《雨点儿》，再按所问回看。原脚注署金波、选作课文时有改动，本站不提供全文、原画或录音，缺书可跳过。雨点说话是拟人，植物变化是故事表达，不当每次下雨立即开花的科学保证。',
  },
  {
    key: 'reading-place',
    prompts: ['按课文，雨点从哪里落下来？', '按课文，两种雨点在哪里交流？'],
    labels: ['云彩里', '半空中', '地下'],
    values: ['云彩里', '半空中'],
    explanation: '查课文场所，拟人对话不当现实雨滴语言。',
    material:
      '先与家长共读第99—100页《雨点儿》，再按所问回看。原脚注署金波、选作课文时有改动，本站不提供全文、原画或录音，缺书可跳过。雨点说话是拟人，植物变化是故事表达，不当每次下雨立即开花的科学保证。',
  },
  {
    key: 'reading-dialogue',
    prompts: ['按课文，谁先问去哪里？', '按课文，谁回答后又问你呢？'],
    labels: ['大雨点儿', '小雨点儿', '花草'],
    values: ['大雨点儿', '小雨点儿'],
    explanation: '找问与答的角色联系，分角色朗读实际声音另由家长确认。',
    material:
      '先与家长共读第99—100页《雨点儿》，再按所问回看。原脚注署金波、选作课文时有改动，本站不提供全文、原画或录音，缺书可跳过。雨点说话是拟人，植物变化是故事表达，不当每次下雨立即开花的科学保证。',
  },
  {
    key: 'bu-one',
    prompts: [
      '按第100页注音，不多的不读哪项？',
      '按第100页注音，不用的不读哪项？',
    ],
    labels: ['bù', 'bú', 'bū'],
    values: ['bù', 'bú'],
    explanation:
      '不在第四声用前变读bú，在多前读bù，按词的语境，不把bú当唯一读法。',
  },
  {
    key: 'bu-two',
    prompts: [
      '按第100页注音，不行的不读哪项？',
      '按第100页注音，不去的不读哪项？',
    ],
    labels: ['bù', 'bú', 'bū'],
    values: ['bù', 'bú'],
    explanation: '不在行前读bù、去前读bú；不久的不也读bù，实际声音听示范。',
  },
  {
    key: 'familiar-sounds',
    prompts: [
      '按本课注音，数不清的数是哪项？',
      '按本课注音，长出了的长是哪项？',
    ],
    labels: ['shǔ', 'zhǎng', 'shù'],
    values: ['shǔ', 'zhǎng'],
    explanation:
      '数长是熟字学新读音，不增加本课新会认十字；不按字形自动评声音。',
  },
  {
    key: 'writing-scope',
    prompts: ['只比较来与点，哪个本课会写？', '只比较你与彩，哪个本课会写？'],
    labels: ['来', '点', '你', '彩'],
    values: ['来', '你'],
    explanation:
      '本课写来半你有四字，活动角色字与熟字新读音不自动加入新增会写。',
  },
];
function objective(
  id: string,
  characters: string[][],
  pairs: Pair[],
  review: boolean,
): Question[] {
  const i = review ? 1 : 0;
  const make = (
    key: string,
    prompt: string,
    labels: string[],
    value: string,
    explanation: string,
    material?: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '共读后按指定信息或注音找依据，熟字新读音与新增认写分开。',
    explanation,
  });
  return [
    ...characters.map((r, n) =>
      make(
        `char-${n}`,
        required(r[i + 1]),
        characters.map((c) => required(c[0])),
        required(r[0]),
        '按指定词语认字，不自动评声音，新增会认与会写分别看。',
      ),
    ),
    ...pairs.map((p) =>
      make(
        p.key,
        p.prompts[i],
        p.labels,
        p.values[i],
        p.explanation,
        p.material,
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
    hint: '实际尝试后家长确认，缺书纸笔或示范可跳过。',
    explanation: '不自动评声音笔顺表达，不把未来计划当完成。',
  };
}
function reflection(id: string, key: string, prompt: string): Question {
  return {
    id: `${id}-reflect-${key}`,
    knowledge: `${id}-reflect-${key}`,
    prompt,
    rule: { kind: 'reflection' },
    hint: '保留自己的话，家长可代写。',
    explanation: '正确性null，未来计划不当实际活动完成。',
  };
}
const crowId = 'cu-u8-2';
const rainId = 'cu-u8-3';
export const crowLesson: Lesson = {
  id: crowId,
  title: '乌鸦喝水',
  textbookTitle: '乌鸦喝水',
  page: 97,
  version: 1,
  status: 'available',
  goal: '认十一字写只多办石出，朗读故事，说清条件、办法与结果，学着的新读音。',
  prerequisite: '准备第97—98页原书与田字格纸，可请家长陪读。',
  parentTip:
    '原书根据伊索寓言相关内容改写，未署个人改写者；十一认五写与熟字着读zháo分开。课后只朗读与说明办法，不增加背诵必做。原书情境不推广所有容器和材料，不要求实际用石子饮水或接近动物，教师最终审校待完成。未知ISBN版印次不补造。',
  steps: [
    {
      title: '共读并认十一字',
      text: `${crowReading}认喝、只、处、找、许、石、出、法、放、进、高十一字，先听注音规范示范，再放回词语。蓝色着是熟字新读音zháo，不增加新认字数。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: crowChars.map((r) => required(r[0])),
      },
      activity: '实际打乱十一字顺序认读，再按注音读喝不着与喝着。',
    },
    {
      title: '看清喝不着的条件',
      text: '回看瓶里有水，却水不多、瓶口小，乌鸦喝不着。水不多与瓶口小是两个条件，不能只说完全没有水，也不把所有瓶子都当同样情况。先观察问题再想办法，不用问句自动确认已经解决。',
      activity: '实际向家长说一个问题及原书给出的两个条件。',
    },
    {
      title: '从观察到想出办法',
      text: '原书先看到旁边许多小石子，再想出办法；许多没有给精确颗数，不从原画推唯一总数。把想法、采取动作、观察变化依次说清，想出办法不当已经放石完成。',
      activity: '实际按原书指出观察和办法的先后。',
    },
    {
      title: '逐颗放入与水面升高',
      text: '回看石子一颗一颗放进瓶里，水渐渐升高，最后喝着水。水面升高不是瓶身长高，也不是石子变成水；本课说明原书情境，不推广所有容器/材料都能同样成功，不要求用石子和瓶子做饮水实验。',
      activity: '实际向家长说明办法、变化与结果，用自己的话也可以。',
    },
    {
      title: '按示范写五字',
      text: '会写只、多、办、石、出五字，对照第98页逐笔和田字格示范。网页字体只供认字，不替代规范笔顺或描红；着与其他会认字不自动增加会写。',
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: [...'只多办石出'],
      },
      activity: '实际用田字格纸尝试五字，家长查看字形笔顺位置。',
    },
    {
      title: '实际朗读与读词',
      text: '第98页只要求朗读和说明喝水办法，没有背诵必做。听规范示范再读，注意一只读zhī、喝不着的着读zháo；实际读音由家长听，不靠字形选择题确认已经读准。',
      activity: '实际朗读原书，再尝试读到处、办法、放进、升高等词。',
    },
    {
      title: '交流发现',
      text: '再按问题、办法、变化和结果说故事，可向家长提问自己还不明白的地方。自己的合理表达开放，反思保留原话，下一次计划明确写为未来，不当已经完成。',
      activity: '实际交流后记录，不要求真实身份或照片。',
    },
  ],
  questions: [
    ...objective(crowId, crowChars, crowPairs, false),
    manual(
      crowId,
      'recognize',
      '实际指读喝只处找许石出法放进高十一字，着为熟字新读音不新增。',
    ),
    manual(
      crowId,
      'read',
      '实际与家长朗读乌鸦喝水，不加背诵必做，不自动评声音。',
      crowReading,
    ),
    manual(
      crowId,
      'explain',
      '按第98页实际说明乌鸦用什么办法喝到水，合理措辞开放。',
      crowReading,
    ),
    manual(crowId, 'write', '按第98页规范示范实际写只多办石出五字。'),
    manual(
      crowId,
      'words',
      '实际读一只、喝不着、到处、办法、放进、升高，听回应后再试。',
    ),
    manual(
      crowId,
      'order',
      '实际向家长按观察问题、想办法、放石子、水面变化与结果说先后，不用计划算完成。',
      crowReading,
    ),
    reflection(
      crowId,
      'discovery',
      '记录一个字词、问题条件或办法发现，也可明确写下一次想练的计划。',
    ),
  ],
  reviewQuestions: objective(crowId, crowChars, crowPairs, true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '97—98伊索寓言相关内容改写、十一认五写熟字着新读音，朗读及办法说明核对，不加背诵。条件和过程分开，许多不推精确数，不推广所有容器材料，不要求实际石子饮水。全文原画声音外部共读、未知元数据不补造；实际人工确认、反思null、计划不当完成，全年和教师审校待验。',
  },
};
export const rainLesson: Lesson = {
  id: rainId,
  title: '雨点儿',
  textbookTitle: '雨点儿',
  page: 99,
  version: 1,
  status: 'available',
  goal: '认十字写来半你有，分角色朗读，辨不的语境读音、熟字数长的新音和长句停顿。',
  prerequisite: '准备第99—100页原书与田字格纸，可请家长陪读。',
  parentTip:
    '金波改选、十认四写及熟字数长新读音分开；分角色朗读、不字五词和长句停顿分别尝试，不加背诵必做。拟人与植物变化是课文表达，不推广每次下雨即时生长；不要求到雨中或雷雨中观察，教师最终审校待完成。未知ISBN版印次不补造。',
  steps: [
    {
      title: '共读并认十字',
      text: `${rainReading}认点、彩、半、空、问、回、答、方、久、更十字；数不清的数读shǔ，长出的长读zhǎng，是熟字新读音不新增会认。`,
      visual: {
        kind: 'characters',
        grid: 'tian',
        characters: rainChars.map((r) => required(r[0])),
      },
      activity: '实际指读十字，再借注音尝试数不清与长出。',
    },
    {
      title: '谁问谁答去哪里',
      text: '回看大雨点儿先问，小雨点儿回答后再问你呢；小雨点儿想去有花有草的地方，大雨点儿想去没有花没有草的地方。按角色分别找，不把大小与目的地混在一起；雨点说话是拟人，不当现实语言。',
      activity: '实际指读问答角色和两个目的地，向家长说明联系。',
    },
    {
      title: '两处后来怎样变化',
      text: '原书有花草的一处花更红草更绿，原先没花草的一处开花长草。更与原来没有再长出是两种不同表达，按课文找信息，不声称所有土壤气候都每逢下雨立即长花草。',
      activity: '实际向家长说两处变化及原书依据，不要求雨中外出观察。',
    },
    {
      title: '读五词注意不',
      text: '第100页读不多、不行、不久、不用、不去。按注音先听示范，前三词的不读bù，不用/不去的后字为第四声，这里的“不”变读bú；变化按语境，不把不统一读bú或把轻声当一声。实际声音由家长听，字母选择题不自动评发音。',
      activity: '实际读五词并听回应，再尝试一组不同读法。',
    },
    {
      title: '长句停顿不等于段落',
      text: '按第100页所列长句，先借逗号句号与意思分组听示范再读。逗号与句号帮助停顿，但不要求每个停顿长度一样；屏幕换行不是教材自然段，也不凭逗号数判原书段落数。网页不复制这版完整长句，实际指读原书。',
      activity: '实际朗读原书两个长句，听家长回应后调整停顿。',
    },
    {
      title: '分角色实际朗读',
      text: '第100页要求分角色朗读，可由孩子与家长分担叙述、大雨点儿、小雨点儿，角色可轮换。先听问题，再读相应回答，叙述与人物话分开；不要求固定声音高低扮演大小，读音表达不自动评分，本课无背诵必做。',
      activity: '实际分角色朗读一轮，听回应再轮换或调整。',
    },
    {
      title: '按示范写四字',
      text: '本课会写来、半、你、有，对照第100页逐笔与田字格示范。网页字体只供认字，不替代规范笔顺或描红，点彩等会认字及熟字数长不自动增加会写。',
      visual: { kind: 'characters', grid: 'tian', characters: [...'来半你有'] },
      activity: '实际用田字格纸尝试四字，家长看字形笔顺位置。',
    },
    {
      title: '交流并记录发现',
      text: '自己的阅读发现、角色体验或问题可以不同，反思保留原话。还想练的字、读音或句子写为下次计划，不当已经完成；家长可代写，不要求姓名地址或照片。',
      activity: '实际与家长交流后记录，反思不判对错。',
    },
  ],
  questions: [
    ...objective(rainId, rainChars, rainPairs, false),
    manual(
      rainId,
      'recognize',
      '实际指读点彩半空问回答方久更十字，数长是熟字新读音。',
    ),
    manual(
      rainId,
      'familiar',
      '实际按本课注音读数不清与长出，听规范示范，不增加新增认写。',
    ),
    manual(
      rainId,
      'roles',
      '按第100页实际与家长分角色朗读雨点儿，轮换或调整，不加背诵必做。',
      rainReading,
    ),
    manual(
      rainId,
      'bu',
      '实际读不多不行不久不用不去五词，注意不的语境读音，不自动评声音。',
    ),
    manual(
      rainId,
      'pause',
      '按第100页两个长句实际读好停顿，原书句子不按网页换行分自然段。',
    ),
    manual(rainId, 'write', '按第100页规范示范实际写来半你有四字。'),
    manual(
      rainId,
      'talk',
      '实际向家长说角色问答或两处变化发现，原书信息与自己的合理疑问分开。',
      rainReading,
    ),
    reflection(
      rainId,
      'discovery',
      '记录一个角色、字词、读音或停顿发现，也可写自己的疑问。',
    ),
    reflection(rainId, 'plan', '明确写下一次想练的字、分角色朗读或长句计划。'),
  ],
  reviewQuestions: objective(rainId, rainChars, rainPairs, true),
  review: {
    date: '2026-10-01',
    reviewer: '原书两页与原创教学范围校验',
    notes:
      '99—100金波改选、十认四写数长新音，分角色、不字五词和长句停顿分别覆盖，不加背诵。拟人目的地与变化不推广现实即时生长；换行不当自然段，角色不强制高低音，不要求雨中雷雨观察。全文原画声音外部共读、未知元数据不补造；实际人工确认、反思null、计划不当完成，全年和教师审校待验。',
  },
};
