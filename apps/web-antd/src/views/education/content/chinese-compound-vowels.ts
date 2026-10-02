import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { textbooks } from './textbooks';

interface Combination {
  initial: string;
  final: string;
  syllable: string;
}
interface VowelRow {
  final: string;
  tones: string[];
  first: Combination;
  review: Combination;
}
interface VowelPack {
  itemId: string;
  title: string;
  page: number;
  note: string;
  rows: VowelRow[];
  markQuestion: [string, string[], string, string];
}
const packs: VowelPack[] = [
  {
    itemId: 'u4-1',
    title: 'ai ei ui',
    page: 45,
    note: 'ai与ei的第一个字母不同；ui与iu字母顺序不同。ai标在a上，ei标在e上，ui标在后面的i上。复韵母读音连贯，不能用两个英语字母名称拼凑声音。',
    markQuestion: [
      'ui加声调时，调号标在哪个字母上？',
      ['u', 'i'],
      'i',
      'ui中的调号标在后一个元音i上，例如uǐ。',
    ],
    rows: [
      {
        final: 'ai',
        tones: ['āi', 'ái', 'ǎi', 'ài'],
        first: { initial: 'd', final: 'ǎi', syllable: 'dǎi' },
        review: { initial: 'l', final: 'ái', syllable: 'lái' },
      },
      {
        final: 'ei',
        tones: ['ēi', 'éi', 'ěi', 'èi'],
        first: { initial: 'l', final: 'èi', syllable: 'lèi' },
        review: { initial: 'b', final: 'ēi', syllable: 'bēi' },
      },
      {
        final: 'ui',
        tones: ['uī', 'uí', 'uǐ', 'uì'],
        first: { initial: 'sh', final: 'uǐ', syllable: 'shuǐ' },
        review: { initial: 't', final: 'uì', syllable: 'tuì' },
      },
    ],
  },
  {
    itemId: 'u4-2',
    title: 'ao ou iu',
    page: 47,
    note: 'ao与ou要看清字母顺序；iu与ui不是同一写法。ao标在a上，ou标在o上，iu标在后面的u上；这里练习字形与标调，实际连贯读音由家长参考教师标准示范。',
    markQuestion: [
      'iu加声调时，调号标在哪个字母上？',
      ['i', 'u'],
      'u',
      'iu中的调号标在后一个元音u上，例如iù。',
    ],
    rows: [
      {
        final: 'ao',
        tones: ['āo', 'áo', 'ǎo', 'ào'],
        first: { initial: 'h', final: 'ǎo', syllable: 'hǎo' },
        review: { initial: 'm', final: 'āo', syllable: 'māo' },
      },
      {
        final: 'ou',
        tones: ['ōu', 'óu', 'ǒu', 'òu'],
        first: { initial: 'd', final: 'òu', syllable: 'dòu' },
        review: { initial: 'k', final: 'ǒu', syllable: 'kǒu' },
      },
      {
        final: 'iu',
        tones: ['iū', 'iú', 'iǔ', 'iù'],
        first: { initial: 'l', final: 'iù', syllable: 'liù' },
        review: { initial: 'q', final: 'iū', syllable: 'qiū' },
      },
    ],
  },
  {
    itemId: 'u4-3',
    title: 'ie üe er',
    page: 49,
    note: 'ie与ei字母顺序不同；üe保留ü的两点，声调标在e上。er单独观察，不当作e加声母r的两拼。ü或üe与j、q、x相拼时拼写省去两点，但对应的韵母不改变；与n、l相拼仍保留两点，如lüè。',
    markQuestion: [
      '本课所示的üe加声调时，调号标在哪个字母上？',
      ['ü', 'e'],
      'e',
      'üe的调号标在e上，例如üě；原字母ü的两点保留。',
    ],
    rows: [
      {
        final: 'ie',
        tones: ['iē', 'ié', 'iě', 'iè'],
        first: { initial: 'x', final: 'iě', syllable: 'xiě' },
        review: { initial: 't', final: 'iē', syllable: 'tiē' },
      },
      {
        final: 'üe',
        tones: ['üē', 'üé', 'üě', 'üè'],
        first: { initial: 'x', final: 'üě', syllable: 'xuě' },
        review: { initial: 'l', final: 'üè', syllable: 'lüè' },
      },
      {
        final: 'er',
        tones: ['ēr', 'ér', 'ěr', 'èr'],
        first: { initial: '', final: 'ér', syllable: 'ér' },
        review: { initial: '', final: 'ěr', syllable: 'ěr' },
      },
    ],
  },
  {
    itemId: 'u4-4',
    title: 'an en in un ün',
    page: 51,
    note: '本组前鼻韵母写法都以n结尾，an、en、in看清前面的元音；un和ün要看清两点。声调分别标在a、e、i、u、ü上，带调i省去原来的点。j、q、x与ün相拼时省去ü的两点，如jūn、qún，但对应的韵母仍是ün，不能认成un。这里观察字形，实际前鼻音参考教师标准示范。',
    markQuestion: [
      'jūn中省去两点后，实际对应本组哪个韵母？',
      ['un', 'ün'],
      'ün',
      'j后省去ü的两点，jūn对应ün；不能因为写成u就当作un。',
    ],
    rows: [
      {
        final: 'an',
        tones: ['ān', 'án', 'ǎn', 'àn'],
        first: { initial: 'sh', final: 'ān', syllable: 'shān' },
        review: { initial: 'k', final: 'àn', syllable: 'kàn' },
      },
      {
        final: 'en',
        tones: ['ēn', 'én', 'ěn', 'èn'],
        first: { initial: 'r', final: 'én', syllable: 'rén' },
        review: { initial: 'm', final: 'én', syllable: 'mén' },
      },
      {
        final: 'in',
        tones: ['īn', 'ín', 'ǐn', 'ìn'],
        first: { initial: 'l', final: 'ín', syllable: 'lín' },
        review: { initial: 'x', final: 'īn', syllable: 'xīn' },
      },
      {
        final: 'un',
        tones: ['ūn', 'ún', 'ǔn', 'ùn'],
        first: { initial: 'c', final: 'ūn', syllable: 'cūn' },
        review: { initial: 'l', final: 'ùn', syllable: 'lùn' },
      },
      {
        final: 'ün',
        tones: ['ǖn', 'ǘn', 'ǚn', 'ǜn'],
        first: { initial: 'j', final: 'ǖn', syllable: 'jūn' },
        review: { initial: 'q', final: 'ǘn', syllable: 'qún' },
      },
    ],
  },
  {
    itemId: 'u4-5',
    title: 'ang eng ing ong',
    page: 54,
    note: '本组后鼻韵母以ng结尾。比较an与ang、en与eng、in与ing，不能漏写最后的g；ong与已学单韵母o也不同。声调分别标在a、e、i、o上，带调i省去原来的点。ng是本组韵母末尾的一部分，不能把g拆作另一个声母。视觉题不能替代前后鼻音听辨，实际发音参考教师标准示范。',
    markQuestion: [
      '本组后鼻韵母共同的结尾写法是什么？',
      ['n', 'ng'],
      'ng',
      'ang、eng、ing、ong都以ng结尾；不要漏写g。',
    ],
    rows: [
      {
        final: 'ang',
        tones: ['āng', 'áng', 'ǎng', 'àng'],
        first: { initial: 'b', final: 'āng', syllable: 'bāng' },
        review: { initial: 't', final: 'áng', syllable: 'táng' },
      },
      {
        final: 'eng',
        tones: ['ēng', 'éng', 'ěng', 'èng'],
        first: { initial: 'f', final: 'ēng', syllable: 'fēng' },
        review: { initial: 'd', final: 'ěng', syllable: 'děng' },
      },
      {
        final: 'ing',
        tones: ['īng', 'íng', 'ǐng', 'ìng'],
        first: { initial: 't', final: 'īng', syllable: 'tīng' },
        review: { initial: 'm', final: 'íng', syllable: 'míng' },
      },
      {
        final: 'ong',
        tones: ['ōng', 'óng', 'ǒng', 'òng'],
        first: { initial: 'zh', final: 'ōng', syllable: 'zhōng' },
        review: { initial: 'h', final: 'óng', syllable: 'hóng' },
      },
    ],
  },
];
function makePack(pack: VowelPack): Lesson {
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
    pack.rows.map((row) => row.final).join(' ') !== pack.title
  )
    throw new Error('educationLearning.invalidRecord');
  const id = `cu-${pack.itemId}-vowel-tone`;
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
  const shape = (row: VowelRow, index: number, review = false) =>
    choose(
      `${review ? 'r' : 'q'}-shape-${index}`,
      `cu-vowel-${(() => {
        if (row.final === 'üe') return 'ue-diaeresis';
        return row.final === 'ün' ? 'un-diaeresis' : row.final;
      })()}-shape`,
      review
        ? '根据本课学过的组合，所示音节对应本组哪个韵母？'
        : `在本组中找出${row.final}。`,
      pack.rows.map((row) => row.final),
      row.final,
      pack.note,
      `这里对应${row.final}；不要颠倒字母顺序。字形题不代替实际听辨或发音评价。`,
      review ? row.review.syllable : undefined,
    );
  const tone = (row: VowelRow, index: number, review = false) => {
    const number = (() => {
      if (pack.rows.length === 3) return review ? 3 - index : index;
      return (index + (review ? 1 : 0)) % 4;
    })();
    const value = required(row.tones[number]);
    return choose(
      `${review ? 'r' : 'q'}-tone-${index + 1}`,
      `cu-vowel-${(() => {
        if (row.final === 'üe') return 'ue-diaeresis';
        return row.final === 'ün' ? 'un-diaeresis' : row.final;
      })()}-tone`,
      `选择${row.final}的${['第一声', '第二声', '第三声', '第四声'][number]}写法。`,
      row.tones,
      value,
      pack.note,
      `应选${value}，观察声调标记及位置；图示不是声学曲线或发音评分。`,
    );
  };
  const blend = (row: VowelRow, index: number, review = false) => {
    const combination = review ? row.review : row.first;
    return choose(
      `${review ? 'r' : 'q'}-combine-${index}`,
      `cu-vowel-${(() => {
        if (row.final === 'üe') return 'ue-diaeresis';
        return row.final === 'ün' ? 'un-diaeresis' : row.final;
      })()}-combine`,
      combination.initial
        ? '根据所示声母与韵母，选择符合本课拼写规则的音节。'
        : '这里er自成音节，没有另加声母。选择与所示带调写法相同的一项。',
      pack.rows.map((row) => (review ? row.review : row.first).syllable),
      combination.syllable,
      pack.note,
      `正确写法是${combination.syllable}。${(() => {
        if (row.final === 'üe')
          return 'x后省去两点，l后保留两点；韵母都仍对应üe。';
        return row.final === 'ün' ? 'j、q后省去两点，韵母仍对应ün。' : '';
      })()}实际拼读参考标准示范，不自动评分。`,
      combination.initial
        ? `${combination.initial} + ${combination.final}`
        : combination.final,
    );
  };
  const [prompt, labels, answer, explanation] = pack.markQuestion;
  return {
    id,
    textbookTitle: pack.title,
    title: `${pack.title}：辨形、标调与组合（原创活动）`,
    page: pack.page,
    goal: `观察本组韵母写法、声调位置与原创组合；${pack.rows.some((row) => row.final === 'er') ? 'er另作单独观察；' : ''}视觉题不替代实际拼读。`,
    prerequisite: '认识六个单韵母、已学声母与四声；家长可以帮读题和示范。',
    parentTip:
      '不新增汉字会认会写；本包按官方目录对应制作原创活动，尚待教材正文逐页核验和教师审校。标准发音、笔顺与占格请参考教材或教师示范，本站不自动评判听辨、发音或纸笔质量。',
    version: 1,
    status: 'available',
    steps: [
      {
        title: '先比较写法与顺序',
        text: pack.note,
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: pack.rows.map((row) => row.final),
        },
        activity:
          '任意指出本组一个写法；比较前后字母顺序，不用字母数量推断发音。',
      },
      {
        title: '声调的位置也要看',
        text: `${pack.rows
          .map((row) => `${row.final}的四声写法：${row.tones.join('、')}。`)
          .join(
            '\n',
          )}\n先看完整韵母，再找调号。下方线段只表示声调标记方向，不替代标准发音。`,
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: pack.rows.flatMap((row) => row.tones),
        },
        activity:
          '家长任意说一个声调序号，孩子指出对应写法；实际听辨另由家长陪读确认。',
      },
      {
        title: '看组合，保留调号',
        text: pack.note,
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: pack.rows.map((row) => row.first.syllable),
        },
        activity: `${pack.rows
          .map((row) =>
            row.first.initial
              ? `${row.first.initial} + ${row.first.final} → ${row.first.syllable}`
              : `er单独带调：${row.first.syllable}`,
          )
          .join('；')}。观察写法后，跟教材或教师标准示范尝试读。`,
      },
      {
        title: '换一个组合，再重新看',
        text: '这一组练习用了新的声母或声调。要根据这一题的材料重新找韵母、调号和拼写规则，不能背上一题的位置。',
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: pack.rows.map((row) => row.review.syllable),
        },
        activity: '选一个新写法，与前一组比较哪里变化；表达由家长陪同。',
      },
      {
        title: '跟读和纸笔分开记录',
        text: '参考标准示范尝试跟读本组韵母与组合，再对照规范示范用纸笔练习。普通屏幕字体只供辨认，不作为描红范本。没有标准示范时，人工活动可以跳过。',
        activity:
          '家长分别查看跟读和纸笔活动，不能根据客观选择题自动认定实际读音或书写已掌握。',
      },
    ],
    questions: [
      ...pack.rows.flatMap((row, index) => [
        shape(row, index + 1),
        tone(row, index),
        blend(row, index + 1),
      ]),
      choose(
        'q-mark',
        `${id}-mark-position`,
        prompt,
        labels,
        answer,
        pack.note,
        explanation,
      ),
      {
        id: `${id}-read`,
        knowledge: `${id}-manual`,
        prompt:
          '参考教材或教师标准示范，跟读本组韵母及一个组合；由家长确认完成，没有示范可跳过，不自动评判发音。',
        material: pack.title,
        rule: { kind: 'manual' },
        hint: '一组一组看完整写法，先听标准示范，再跟读。',
        explanation: '跟读只记录人工确认，不纳入客观首次正确率。',
      },
      {
        id: `${id}-write`,
        knowledge: `${id}-manual`,
        prompt:
          '有规范示范时，用纸笔练习本组写法和一种带调形式，比较字母顺序、两点和声调位置。没有示范可跳过，不照屏幕字体描红。',
        rule: { kind: 'manual' },
        hint: '先观察标准书写示范，再写；写完请家长查看。',
        explanation: '纸笔活动人工确认，不自动判断笔顺、占格或书写质量。',
      },
    ],
    reviewQuestions: [
      ...pack.rows.flatMap((row, index) => [
        shape(row, index + 1, true),
        tone(row, index, true),
        blend(row, index + 1, true),
      ]),
      choose(
        'r-mark',
        `${id}-mark-position`,
        (() => {
          if (pack.itemId === 'u4-4') return 'qún中的韵母是哪一个？';
          return pack.itemId === 'u4-5'
            ? '根据结尾写法，哪一项属于本组后鼻韵母？'
            : '选择符合本组标调规则的写法。';
        })(),
        (() => {
          if (pack.itemId === 'u4-4') return ['un', 'ün'];
          return pack.itemId === 'u4-5'
            ? ['en', 'eng']
            : required(pack.rows[pack.itemId === 'u4-3' ? 1 : 2]).tones;
        })(),
        (() => {
          if (pack.itemId === 'u4-4') return 'ün';
          return pack.itemId === 'u4-5'
            ? 'eng'
            : required(
                required(pack.rows[pack.itemId === 'u4-3' ? 1 : 2]).tones[3],
              );
        })(),
        pack.note,
        explanation,
        (() => {
          if (pack.itemId === 'u4-4') return 'q + ǘn → qún';
          return pack.itemId === 'u4-5'
            ? '看清n与ng'
            : `找出第四声：${required(pack.rows[pack.itemId === 'u4-3' ? 1 : 2]).final}`;
        })(),
      ),
    ],
    review: {
      date: '2026-09-30',
      reviewer: '官方目录、拼音规则与原创组合校验',
      notes:
        '课目与页码核对人教社2024上册目录；声调位置参考教育部发布GB/T 16159—2012第6.5.1条，省略规则参考教育部拼音教学资料与高校公开汉语拼音方案说明。题目、组合和讲解原创，未复制教材韵文、图画或录音；尚待2024正文逐页核验与教师人工审校。',
    },
  };
}
export const compoundVowelPacks: Record<string, Lesson> = Object.fromEntries(
  packs.map((pack) => [pack.itemId, makePack(pack)]),
);
