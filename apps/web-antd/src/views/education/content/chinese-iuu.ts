import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

const id = 'cu-u2-2-shape-tone';
const shapeSkill = 'cu-phonics-iuu-shape';
const toneSkill = 'cu-phonics-iuu-tone';
function choice(
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
const toneRows = {
  i: ['ī', 'í', 'ǐ', 'ì'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};
function tone(
  suffix: string,
  vowel: keyof typeof toneRows,
  index: number,
  review = false,
) {
  const number = required(['第一声', '第二声', '第三声', '第四声'][index]);
  const value = required(toneRows[vowel][index]);
  return choice(
    suffix,
    toneSkill,
    review
      ? `这里要找${number}。下面哪个写法是${vowel}的${number}？`
      : `请选择${vowel}的${number}写法。`,
    toneRows[vowel],
    value,
    '先辨认字母，再观察调号：横线、向右上、折转、向右下。',
    `${value}是${vowel}的${number}写法。此题判断标记，不自动评价发音。`,
  );
}
export const iuuPhonics: Lesson = {
  id,
  textbookTitle: 'i u ü',
  title: 'i u ü：辨形、两点与标调（原创活动）',
  page: 22,
  goal: '辨认i、u、ü及带调写法，比较字母上的点与声调标记；发音和书写分别人工确认。',
  prerequisite: '先认识a o e及四声标记；可由家长读题，不需要自己输入拼音。',
  parentTip:
    '本包不合并y w、不增加汉字会认会写范围。请参考教材或教师的标准示范陪读和纸笔练习；这里的普通字体和声调示意不是规范描红范本，也不是录音。',
  version: 1,
  status: 'available',
  steps: [
    {
      title: '先比较i、u、ü',
      text: '小写i由主体和上方的小点组成；u上方没有两点；ü在u形主体上方有两点。先看清字母，不根据英文字母的读音来读汉语拼音。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['i', 'u', 'ü'],
      },
      activity: '家长任意指一个字母，孩子认出字形；再找出u和ü不同的地方。',
    },
    {
      title: 'i标调，原来的小点不保留',
      text: 'i的四声写作ī、í、ǐ、ì。标调时省去i原有的小点，在上方写声调标记。声调图示是标记走向，不是发音记录；跟读请参考标准示范。',
      visual: { kind: 'characters', grid: 'pinyin', characters: toneRows.i },
      activity: '按顺序指出四个调号，再打乱比较。暂时没有示范时可以先做辨形。',
    },
    {
      title: 'u与ü的带调写法要分清',
      text: 'u的四声是ū、ú、ǔ、ù；本课单独展示ü时，四声是ǖ、ǘ、ǚ、ǜ，两点与声调标记同时保留。两点表示字母ü，不是第二声的调号；第二声的调号是一条向右上的线。后续与其他字母相拼的省略规则在对应课程学习，本包不混入。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: [...toneRows.u, ...toneRows.ü],
      },
      activity: '把u和ü分别带同一个调号的写法放在一起比较，看两点是否存在。',
    },
    {
      title: '跟读和纸笔分开记录',
      text: '有教材或教师标准示范时，家长陪孩子跟读；再观察规范书写示范，用纸笔练习。本站选择题只判断所选写法，不能据此确认发音、笔顺或占格是否正确。没有示范时可跳过人工活动。',
      activity:
        '家长查看一次跟读和一次纸笔活动。可以分次完成，不自动做发音或书写评分。',
    },
  ],
  questions: [
    choice(
      'q1',
      shapeSkill,
      '下面哪个是小写拼音字母i？',
      ['i', 'u', 'ü'],
      'i',
      '找上方有一个小点的字母。',
      '这里选i；未标调的i上方有一个小点。',
    ),
    choice(
      'q2',
      shapeSkill,
      '下面哪个字母是u，上方没有两点？',
      ['ü', 'i', 'u'],
      'u',
      '比较u与ü的上方。',
      'u与ü是不同的字母，不能仅凭主体相似混作一个字母。',
    ),
    choice(
      'q3',
      shapeSkill,
      '下面哪个字母是ü，主体上方有两点？',
      ['u', 'ü', 'i'],
      'ü',
      '找u形主体上方的两点。',
      'ü上方有两点，这两点不是声调标记。',
    ),
    tone('q4', 'i', 1),
    tone('q5', 'i', 3),
    tone('q6', 'u', 2),
    tone('q7', 'ü', 0),
    tone('q8', 'ü', 3),
    {
      id: `${id}-read`,
      knowledge: 'cu-phonics-iuu-manual',
      prompt:
        '与家长参考教材或教师标准示范，尝试认读i、u、ü和四声。没有示范可跳过；由家长确认完成，不自动评价发音。',
      material: `i　u　ü
ī　í　ǐ　ì
ū　ú　ǔ　ù
ǖ　ǘ　ǚ　ǜ`,
      rule: { kind: 'manual' },
      hint: '每次选一行，先看字母再跟读。',
      explanation: '人工确认只记录完成，不纳入客观首次正确率。',
    },
    {
      id: `${id}-write`,
      knowledge: 'cu-phonics-iuu-manual',
      prompt:
        '有教材或教师规范示范时，在纸上练习i、u、ü及一种带调写法。对照示范看小点、两点、调号与占格。没有示范可以跳过。',
      rule: { kind: 'manual' },
      hint: '先观察示范，再动笔；普通屏幕字体不是描红范本。',
      explanation: '纸笔活动由孩子或家长确认，系统不自动判断笔顺、字形或占格。',
    },
  ],
  reviewQuestions: [
    choice(
      'r1',
      shapeSkill,
      '字卡上写着ü。下面哪个写法与字卡相同？',
      ['ü', 'u', 'i'],
      'ü',
      '比较字卡上的两点。',
      '这里要选ü，不能省去两点。',
      'ü',
    ),
    choice(
      'r2',
      shapeSkill,
      '字卡上写着u。下面哪个写法与字卡相同？',
      ['ü', 'i', 'u'],
      'u',
      '字卡上方没有两点。',
      '这里要选u。',
      'u',
    ),
    tone('r3', 'i', 2, true),
    tone('r4', 'u', 1, true),
    tone('r5', 'ü', 2, true),
    tone('r6', 'ü', 1, true),
    choice(
      'r7',
      toneSkill,
      '写i的带调形式时，i原来的小点怎样处理？',
      ['省去原来的小点', '调号和小点都保留', '只留小点不写调号'],
      '省去原来的小点',
      '比较i与ī、í。',
      '标调时省去i原来的小点，例如ī、í、ǐ、ì。',
    ),
    choice(
      'r8',
      shapeSkill,
      '本课单独展示ü的带调形式ǜ，字母的两点与调号怎样写？',
      ['两点和调号同时保留', '只保留调号变成ù', '只有两点不写调号'],
      '两点和调号同时保留',
      '观察ǜ的两点与向右下的调号。',
      '这里单独展示的是ü；ǜ保留两点及第四声标记。其他拼写环境的省略规则不在此题讨论。',
      'ǜ',
    ),
  ],
  review: {
    date: '2026-09-30',
    reviewer: '官方目录、拼音规则与原创任务校验',
    notes:
      '对应已核验官方目录第22页i u ü；2024修订研究确认与y w分课。i标调省点规则核对教育部发布GB/T 16159—2012第6.5.1条，带调ü示例可见同条cèlüè/kǎolǜ。本包为原创活动，尚未逐页核验教材正文或经教师人工审校，不复制教材说明、插图、录音或笔顺。',
  },
};
