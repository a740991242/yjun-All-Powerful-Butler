import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { textbooks } from './textbooks';

interface SoundRow {
  initial: string;
  vowel: string;
  reviewVowel: string;
}
interface ConsonantPack {
  itemId: string;
  title: string;
  page: number;
  comparison: string;
  rows: SoundRow[];
}
const packs: ConsonantPack[] = [
  {
    itemId: 'u2-3',
    title: 'b p m f',
    page: 24,
    comparison:
      'b和p的主体都有直线与右侧弯曲部分，弯曲部分的位置不同；m有两段拱形，f有竖向主体和短横。先比较形状，不把视觉辨形等同于已经发音准确。',
    rows: [
      { initial: 'b', vowel: 'ā', reviewVowel: 'ǐ' },
      { initial: 'p', vowel: 'ō', reviewVowel: 'à' },
      { initial: 'm', vowel: 'ǐ', reviewVowel: 'ǔ' },
      { initial: 'f', vowel: 'ǔ', reviewVowel: 'ā' },
    ],
  },
  {
    itemId: 'u2-4',
    title: 'd t n l',
    page: 26,
    comparison:
      'd的弯曲部分在竖向主体左侧；t有短横，l没有这一横；n只有一段拱形，可与已见过的m比较。字体外观可能有差异，规范书写看教材或教师示范。',
    rows: [
      { initial: 'd', vowel: 'ǎ', reviewVowel: 'ì' },
      { initial: 't', vowel: 'è', reviewVowel: 'ǔ' },
      { initial: 'n', vowel: 'ǐ', reviewVowel: 'à' },
      { initial: 'l', vowel: 'ù', reviewVowel: 'í' },
    ],
  },
  {
    itemId: 'u3-1',
    title: 'g k h',
    page: 32,
    comparison:
      '观察g、k、h的主体和分支。普通屏幕字体可能显示不同的g字形；字母辨认与规范手写分开，纸笔活动必须参考教材或教师示范，不照屏幕字体描红。',
    rows: [
      { initial: 'g', vowel: 'ē', reviewVowel: 'ǔ' },
      { initial: 'k', vowel: 'ǔ', reviewVowel: 'è' },
      { initial: 'h', vowel: 'ǎ', reviewVowel: 'é' },
    ],
  },
  {
    itemId: 'u3-2',
    title: 'j q x',
    page: 34,
    comparison:
      'j上方有点，q的主体与尾部可和已见过的p比较，x由交叉的两笔构成。本组先观察与i相拼；与ü相拼的省略规则另作说明，不把写出的u误认为韵母变成u。',
    rows: [
      {
        initial: 'j',
        vowel: 'ī',
        reviewVowel: 'í',
      },
      {
        initial: 'q',
        vowel: 'ī',
        reviewVowel: 'ǐ',
      },
      {
        initial: 'x',
        vowel: 'ī',
        reviewVowel: 'ì',
      },
    ],
  },
  {
    itemId: 'u3-3',
    title: 'z c s',
    page: 36,
    comparison:
      'z有上下横向部分，c有开口，s有上下弯曲。字形相似不能替代发音示范，本包用已学单韵母作两拼观察，zi、ci、si等整体认读另作活动，不按这里的两拼方式拆读。',
    rows: [
      {
        initial: 'z',
        vowel: 'ǔ',
        reviewVowel: 'é',
      },
      {
        initial: 'c',
        vowel: 'ā',
        reviewVowel: 'ù',
      },
      {
        initial: 's',
        vowel: 'è',
        reviewVowel: 'ǎ',
      },
    ],
  },
  {
    itemId: 'u3-4',
    title: 'zh ch sh r',
    page: 38,
    comparison:
      'zh、ch、sh分别是一个声母，要把两个字母作为整体辨认；不能拆成z与h等两个声母。r是另一声母。平舌与翘舌的实际读音跟教师标准示范，本包不自动判定舌位或发音；zhi、chi、shi、ri等整体认读另作活动。',
    rows: [
      {
        initial: 'zh',
        vowel: 'è',
        reviewVowel: 'ǔ',
      },
      {
        initial: 'ch',
        vowel: 'á',
        reviewVowel: 'ē',
      },
      {
        initial: 'sh',
        vowel: 'ū',
        reviewVowel: 'é',
      },
      {
        initial: 'r',
        vowel: 'è',
        reviewVowel: 'ú',
      },
    ],
  },
];
function makePack(pack: ConsonantPack): Lesson {
  const item = required(
    textbooks.find(
      (book) => book.subject === 'chinese' && book.volume === 'upper',
    ),
  )
    .units.flatMap((unit) => unit.items)
    .find((item) => item.id === pack.itemId);
  if (
    item?.title !== pack.title ||
    item.page !== pack.page ||
    pack.rows.map((row) => row.initial).join(' ') !== pack.title
  )
    throw new Error('educationLearning.invalidRecord');
  const id = `cu-${pack.itemId}-initial-blend`;
  const choose = (
    suffix: string,
    knowledge: string,
    prompt: string,
    labels: string[],
    value: string,
    hint: string,
    explanation: string,
    material?: string,
  ): Question => ({
    id: `${id}-${suffix}`,
    knowledge,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
  });
  const shape = (row: SoundRow, index: number, review = false) =>
    choose(
      `${review ? 'r' : 'q'}-shape-${index}`,
      `cu-initial-${row.initial}-shape`,
      review
        ? `只看下面这个音节的字形，选择最前面的声母。`
        : `在本组字母中，找出小写声母${row.initial}。`,
      pack.rows.map((row) => row.initial),
      row.initial,
      pack.comparison,
      `这里应选${row.initial}。字形选择不能自动确认发音准确。`,
      review ? row.initial + row.reviewVowel : undefined,
    );
  const blend = (row: SoundRow, index: number, review = false) => {
    const vowel = review ? row.reviewVowel : row.vowel;
    const syllable = row.initial + vowel;
    return choose(
      `${review ? 'r' : 'q'}-blend-${index}`,
      `cu-initial-${row.initial}-blend`,
      `只按所示两部分的写法，选择连起来的音节。`,
      pack.rows.map(
        (other) => other.initial + (review ? other.reviewVowel : other.vowel),
      ),
      syllable,
      '先辨认前面的声母，再看后面的带调韵母，两部分连起来；不要丢掉调号。',
      `${row.initial}与${vowel}连起来写作${syllable}。这是拼写对应题；实际拼读请跟标准示范练习，不自动评分。`,
      `${row.initial} + ${vowel}`,
    );
  };
  const lesson: Lesson = {
    id,
    textbookTitle: pack.title,
    title: `${pack.title}：辨形与两拼观察（原创活动）`,
    page: pack.page,
    goal: '辨认本组声母，观察声母与带调单韵母组成两拼音节；视觉题与实际拼读分开记录。',
    prerequisite: '先认识六个单韵母及四声标记；家长可帮读题。',
    parentTip:
      '本包不新增汉字会认会写，不把英语字母读音当作拼音，不用普通TTS当标准示范。字形和拼写客观判分，发音与纸笔由家长确认；没有教材或教师示范时可以跳过人工活动。',
    version: 1,
    status: 'available',
    steps: [
      {
        title: '先认本组声母',
        text: pack.comparison,
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: pack.rows.map((row) => row.initial),
        },
        activity:
          '任意指一个字母，让孩子辨认；不要求背诵屏幕字体的笔顺或占格。',
      },
      {
        title: '先看两部分，再连起来',
        text: '这里用声母与一个带调单韵母作两拼观察。先看到声母，再看到带调韵母，把写法连起来；实际读音需要标准示范。读声母时轻而短，与韵母连读，不能把两个英语字母名称分开读。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: pack.rows.map((row) => row.initial + row.vowel),
        },
        activity: `${pack.rows
          .map(
            (row) =>
              `${row.initial} + ${row.vowel} → ${row.initial + row.vowel}`,
          )
          .join('；')}。请家长参考教材或教师示范陪读。`,
      },
      {
        title: '换韵母，重新看',
        text: '后面的带调韵母改变，连起来的写法也会改变。先看这一题的两部分，不沿用上一题的答案。声调标在这里的韵母上，字形选择不能证明听辨或发音已掌握。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: pack.rows.map((row) => row.initial + row.reviewVowel),
        },
        activity: '任选一对新组合，指着声母和韵母，再尝试跟读整个音节。',
      },
      {
        title: '跟读与纸笔分开记录',
        text: '参考规范示范跟读字母和两拼音节，再用纸笔练习本组字母。家长查看后可以交流；没有示范可先完成视觉题，人工任务允许跳过。本站不自动判断送气、舌位、发音或书写质量。',
        activity: '请家长分别确认是否完成跟读和纸笔活动；不是自动评分。',
      },
    ],
    questions: [
      ...pack.rows.flatMap((row, index) => [
        shape(row, index + 1),
        blend(row, index + 1),
      ]),
      {
        id: `${id}-read`,
        knowledge: `${id}-manual`,
        prompt:
          '参考教材或教师标准示范，逐个认读本组声母，再尝试跟读所示两拼音节。完成后人工确认；没有示范可以跳过，不自动评判发音。',
        material: pack.rows
          .map((row) => `${row.initial}　${row.initial + row.vowel}`)
          .join('　'),
        rule: { kind: 'manual' },
        hint: '一组一组跟读，先听示范再尝试，不用英文字母读音。',
        explanation: '跟读采用人工确认，不纳入客观首次正确率。',
      },
      {
        id: `${id}-write`,
        knowledge: `${id}-manual`,
        prompt:
          '有教材或教师规范示范时，在纸上练习本组字母，观察笔顺和占格；屏幕字体不作描红范本。没有示范可以跳过。',
        material: pack.title,
        rule: { kind: 'manual' },
        hint: '先观察标准示范，再动笔；写完与示范比较。',
        explanation: '纸笔活动只记录人工完成，不自动判断书写质量。',
      },
    ],
    reviewQuestions: pack.rows.flatMap((row, index) => [
      shape(row, index + 1, true),
      blend(row, index + 1, true),
    ]),
    review: {
      date: '2026-09-30',
      reviewer: '官方目录与原创拼写一致性校验',
      notes:
        '课目和页码来自人教社2024上册官方目录；两拼教学方式参考教育部网站《汉语拼音的教学特色》。组合、题目和讲解为原创，不复用教材插画或韵文，不宣称整课正文已逐页核验；尚待教师人工审校。',
    },
  };
  if (pack.itemId === 'u3-2') {
    lesson.steps.splice(2, 0, {
      title: 'j q x与ü相拼：省去两点，韵母不变',
      text: 'j、q、x与ü相拼时，拼写中省去ü的两点，调号仍按声调保留。例如j + ǖ写作jū，q + ǚ写作qǔ，x + ǜ写作xù。这里写作u的部分仍对应ü，不能因此读成单韵母u。先看拼写规则，再参考教师示范实际拼读。',
      visual: {
        kind: 'characters',
        grid: 'pinyin',
        characters: ['ǖ', 'jū', 'ǚ', 'qǔ', 'ǜ', 'xù'],
      },
      activity:
        '说一说省去的是两点还是声调标记；再请家长陪读一个组合，不自动评价发音。',
    });
    lesson.questions.splice(
      -2,
      0,
      choose(
        'q-umlaut-1',
        'cu-jqx-umlaut-spelling',
        '按本课规则，j与ǖ相拼应写成哪一个？',
        ['jū', 'jǖ', 'ju'],
        'jū',
        'j与ü相拼省去两点，但第一声标记仍保留。',
        'j + ǖ写作jū，韵母仍对应ü，不是换成u。',
        'j + ǖ',
      ),
      choose(
        'q-umlaut-2',
        'cu-jqx-umlaut-sound',
        'qǔ中后面的字母虽然写成u，在这里对应哪个韵母？',
        ['ü', 'u', 'i'],
        'ü',
        'q与ü相拼省去两点，韵母的读音并未变成u。',
        'qǔ这里对应ü，跟标准示范读，不靠字母外观误读。',
        'qǔ',
      ),
    );
    required(lesson.reviewQuestions).push(
      choose(
        'r-umlaut-1',
        'cu-jqx-umlaut-spelling',
        '按本课规则，x与ǜ相拼应写成哪一个？',
        ['xu', 'xǜ', 'xù'],
        'xù',
        '省去ü的两点，第四声调号保留。',
        'x + ǜ写作xù；不是省去所有附加标记。',
        'x + ǜ',
      ),
      choose(
        'r-umlaut-2',
        'cu-jqx-umlaut-sound',
        'jú中后面的字母写成u，这里对应哪个韵母？',
        ['i', 'u', 'ü'],
        'ü',
        'j与ü相拼省去两点，韵母不改变。',
        'jú这里对应ü，实际读音由教师或家长示范。',
        'jú',
      ),
    );
  }
  return lesson;
}
export const consonantPacks: Record<string, Lesson> = Object.fromEntries(
  packs.map((pack) => [pack.itemId, makePack(pack)]),
);
