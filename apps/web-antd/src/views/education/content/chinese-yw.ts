import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

const id = 'cu-u3-5-yw-whole';
const tones = {
  yi: ['yī', 'yí', 'yǐ', 'yì'],
  wu: ['wū', 'wú', 'wǔ', 'wù'],
  yu: ['yū', 'yú', 'yǔ', 'yù'],
};
function choose(
  suffix: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
  material?: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
  };
}
const reviewForms = { yi: 'yǐ', wu: 'wù', yu: 'yú' };
const recognize = (suffix: string, value: 'wu' | 'yi' | 'yu', review = false) =>
  choose(
    suffix,
    `cu-yw-${value}-whole`,
    review
      ? '去掉材料中的声调标记，找出完整的整体认读写法。'
      : `选择整体认读音节${value}的写法。`,
    ['yi', 'wu', 'yu'],
    value,
    '把整个音节作为一组看，不把字母分开念。',
    review
      ? `${reviewForms[value]}去掉声调标记是${value}，保留整个音节，不拆成两个部分拼读；这里只辨写法，不评价发音。`
      : `这里选择${value}。实际认读参考标准示范，字形选择不代替发音评价。`,
    review ? reviewForms[value] : undefined,
  );
const tone = (suffix: string, syllable: keyof typeof tones, index: number) =>
  choose(
    suffix,
    'cu-yw-whole-tone',
    `选择${syllable}的${['第一声', '第二声', '第三声', '第四声'][index]}写法。`,
    tones[syllable],
    required(tones[syllable][index]),
    '看清整个音节，再看元音上方的声调标记。',
    `${tones[syllable][index]}保留整个音节的写法及指定声调标记；不按两个英文字母读音分别读。`,
  );
export const ywLesson: Lesson = {
  id,
  textbookTitle: 'y w',
  title: 'y w：整体音节与带调写法（原创活动）',
  page: 40,
  goal: '辨认y、w，整体观察yi、wu、yu及四声，区分yu的拼写和ü所对应的韵母；普通拼读音节与整体认读分开。',
  prerequisite:
    '认识i、u、ü及四声标记；可由家长读题和示范，本站不做听音自动判分。',
  parentTip:
    'y w按2024官方目录单列，不合并到i u ü或21个声母活动。本站用原创材料讲解拼写，未逐页核验整课正文；朗读、纸笔均采用人工确认，不新增汉字会认会写范围。',
  version: 2,
  status: 'available',
  steps: [
    {
      title: '字母y、w与音节分开看',
      text: '先辨认小写y和w。字母不是完整的音节；学习汉语拼音时，不把英文字母名称当作这里的读音。普通屏幕字体仅用于辨形，规范占格和笔顺看教材或教师示范。',
      visual: { kind: 'characters', grid: 'pinyin', characters: ['y', 'w'] },
      activity: '家长任意指一个字母，孩子辨认y或w，再说说形状有什么不同。',
    },
    {
      title: 'yi、wu、yu整体认读',
      text: 'yi、wu、yu在本活动中作为整体认读音节，直接看整个音节跟读，不套用声母与韵母分别读再相拼的方法。它们分别对应i、u、ü自成音节时的拼写；这里说的是普通话拼音，不是英语字母读音。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['yi', 'wu', 'yu'],
      },
      activity:
        '参考教材或教师示范跟读，每次看完整音节；没有示范时可先完成辨形。',
    },
    {
      title: 'yu省两点，仍对应ü',
      text: 'ü自成音节时写成yu，ü的两点省略。yu虽然含有字母u，这里对应的是ü，不是u。加声调后写成yū、yú、yǔ、yù；省去的是两点，不是声调标记。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['ü', 'yu', 'yū', 'yú', 'yǔ', 'yù'],
      },
      activity: '比较ü与yu，再在四个带调音节中找出第一声和第四声。',
    },
    {
      title: '四声写法逐组比较',
      text: 'yi的四声是yī、yí、yǐ、yì；wu的四声是wū、wú、wǔ、wù。i标调后省去原来的小点；整个音节的调号仍要保留。图示只是声调标记方向，不能代替实际声音。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: [...tones.yi, ...tones.wu],
      },
      activity: '任意选择一个音节，指出调号，跟标准示范尝试认读。',
    },
    {
      title: '普通拼读音节另看，纸笔另记',
      text: '本课另用yā、wā、wō作普通拼读写法观察，不把它们加入yi、wu、yu的整体认读清单。这里只按所示前后部分选择写法，实际拼读请参考标准示范。再对照规范示范用纸笔练习y、w及一个音节，人工确认不等于自动评分。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['yā', 'wā', 'wō'],
      },
      activity:
        '与家长说说哪些是本包练习的整体认读音节；没有规范示范时，纸笔和跟读活动可以跳过。',
    },
  ],
  questions: [
    choose(
      'q1',
      'cu-yw-letter-shape',
      '选出小写字母y。',
      ['y', 'w', 'u'],
      'y',
      '比较主体与向下的部分。',
      '这里选择y，不用英文字母名称读它。',
    ),
    choose(
      'q2',
      'cu-yw-letter-shape',
      '选出小写字母w。',
      ['u', 'y', 'w'],
      'w',
      '观察连续的折转。',
      '这里选择w，字母与整个音节分开看。',
    ),
    recognize('q3', 'yi'),
    recognize('q4', 'wu'),
    recognize('q5', 'yu'),
    tone('q6', 'yi', 1),
    tone('q7', 'wu', 2),
    tone('q8', 'yu', 3),
    choose(
      'q9',
      'cu-yw-yu-spelling',
      '单韵母ü自成音节，在本课写成哪个形式？',
      ['yu', 'yü', 'wu'],
      'yu',
      'ü自成音节写成yu，省去两点。',
      '这里写成yu；两点省略，仍对应ü。',
    ),
    choose(
      'q10',
      'cu-yw-yu-sound',
      'yú的拼写中虽然有u，这里对应哪个韵母？',
      ['u', 'i', 'ü'],
      'ü',
      '回想yu省去两点的规则。',
      'yú这里仍对应ü，不能因拼写外观读成u。',
      'yú',
    ),
    choose(
      'q11',
      'cu-yw-ordinary-spelling',
      '只按所示写法，y与ā连起来选择哪个音节？',
      ['yā', 'yī', 'wā'],
      'yā',
      '先看前面y，再看后面ā。',
      '写作yā，本包不把它列入yi、wu、yu整体认读清单。',
      'y + ā',
    ),
    choose(
      'q12',
      'cu-yw-ordinary-spelling',
      '只按所示写法，w与ō连起来选择哪个音节？',
      ['wū', 'yō', 'wō'],
      'wō',
      '前面是w，后面是带第一声的o。',
      '写作wō；实际拼读跟标准示范。',
      'w + ō',
    ),
    {
      id: `${id}-read`,
      knowledge: 'cu-yw-manual',
      prompt:
        '参考教材或教师标准示范，认读y、w和yi、wu、yu及一种带调写法。没有示范可跳过，由家长确认完成，不自动评判发音。',
      material: 'y　w　yi　wu　yu',
      rule: { kind: 'manual' },
      hint: '按字母和整体音节分别观察，跟标准示范读。',
      explanation: '朗读采用人工确认，不纳入客观首次正确率。',
    },
    {
      id: `${id}-write`,
      knowledge: 'cu-yw-manual',
      prompt:
        '有教材或教师规范示范时，用纸笔练习y、w和一个带调音节。比较笔顺、占格与调号，不照普通屏幕字体描红。没有示范可以跳过。',
      rule: { kind: 'manual' },
      hint: '先看规范示范，再写；由家长查看后交流。',
      explanation: '纸笔采用人工确认，不自动评判字形、笔顺或占格。',
    },
  ],
  reviewQuestions: [
    choose(
      'r1',
      'cu-yw-letter-shape',
      '观察材料中的音节，选择开头的字母。',
      ['w', 'u', 'y'],
      'y',
      '先观察音节开头，再比较选项字形，不按英文字母名称读。',
      'yà开头的字母是y；这里只辨字母，不把这个普通拼读音节当作yi。',
      'yà',
    ),
    choose(
      'r2',
      'cu-yw-letter-shape',
      '观察材料中的音节，选择开头的字母。',
      ['y', 'w', 'u'],
      'w',
      '先观察音节开头，再比较选项字形，不按英文字母名称读。',
      'wǒ开头的字母是w；这里只辨字母，不把这个普通拼读音节当作wu。',
      'wǒ',
    ),
    recognize('r3', 'yi', true),
    recognize('r4', 'wu', true),
    recognize('r5', 'yu', true),
    tone('r6', 'yi', 2),
    tone('r7', 'wu', 3),
    tone('r8', 'yu', 0),
    choose(
      'r9',
      'cu-yw-yu-spelling',
      'yu这种写法省略了原来ü上的什么？',
      ['两点', '整个韵母', '字母y'],
      '两点',
      '比较ü与yu。',
      '省去两点，不是省去韵母或调号。',
      'ü　yu',
    ),
    choose(
      'r10',
      'cu-yw-yu-sound',
      'yǔ的拼写中有u，这里对应哪个韵母？',
      ['i', 'ü', 'u'],
      'ü',
      'yu由ü自成音节时换写，读音对应不变。',
      'yǔ这里仍对应ü。',
      'yǔ',
    ),
    choose(
      'r11',
      'cu-yw-ordinary-spelling',
      '只按所示写法，y与à连起来选择哪个音节？',
      ['yì', 'yà', 'wà'],
      'yà',
      '观察à的字母和调号。',
      '写作yà，保留第四声标记。',
      'y + à',
    ),
    choose(
      'r12',
      'cu-yw-ordinary-spelling',
      '只按所示写法，w与ǒ连起来选择哪个音节？',
      ['wǒ', 'wǔ', 'yǒ'],
      'wǒ',
      '前面w，后面ǒ。',
      '写作wǒ，保留第三声标记。',
      'w + ǒ',
    ),
  ],
  review: {
    date: '2026-09-30',
    reviewer: '官方目录与原创拼音规则校验',
    notes:
      '目录第40页y w、2024拼音修订研究支持单列；yi/wu/yu自成音节拼写参考湖南第一师范学院教务处《怎么使用汉语拼音方案》及教育部拼音教学资料。活动、问题与解释原创，不复制教材图文、韵文、录音或笔顺；尚待2024正文逐页核验与教师人工审校。',
  },
};
