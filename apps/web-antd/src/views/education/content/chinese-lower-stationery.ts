import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  reviewLabels?: string[];
  explanation: string;
  material: string;
};
type Entry = {
  itemId: string;
  goal: string;
  title: string;
  pages: number[];
  recognize: string;
  write: string;
  author: null | string;
  sourceCredit: string;
  newRadicals: string[];
  additionalReadings: string;
  pairs: Pair[];
  reciteRequired: boolean;
  steps: Lesson['steps'];
  actual: [string, string][];
  reflections: string[];
};
const recognitionRows: Record<string, [string, string, string][]> = {
  'u7-1': [
    ['具', '文具中的第2个字是哪项？', '换词语：工具中的第2个字是哪项？'],
    ['铅', '铅笔中的第1个字是哪项？', '换词语：铅芯中的第1个字是哪项？'],
    ['新', '新书中的第1个字是哪项？', '换词语：清新中的第2个字是哪项？'],
    ['平', '平安中的第1个字是哪项？', '换词语：平地中的第1个字是哪项？'],
    ['盒', '文具盒中的第3个字是哪项？', '换词语：盒子中的第1个字是哪项？'],
    ['些', '这些中的第2个字是哪项？', '换词语：一些中的第2个字是哪项？'],
    ['此', '从此中的第2个字是哪项？', '换词语：此时中的第1个字是哪项？'],
    ['仔', '仔细中的第1个字是哪项？', '换词语：仔细看中的第1个字是哪项？'],
    ['检', '检查中的第1个字是哪项？', '换词语：检验中的第1个字是哪项？'],
    ['查', '检查中的第2个字是哪项？', '换词语：查找中的第1个字是哪项？'],
    ['所', '所有中的第1个字是哪项？', '换词语：住所中的第2个字是哪项？'],
    ['伙', '伙伴中的第1个字是哪项？', '换词语：伙计中的第1个字是哪项？'],
    ['伴', '伙伴中的第2个字是哪项？', '换词语：相伴中的第2个字是哪项？'],
  ],
};
const entries: Entry[] = [
  {
    itemId: 'u7-1',
    title: '文具的家',
    pages: [78, 79, 80],
    recognize: '具铅新平盒些此仔检查所伙伴',
    write: '笔道平知放安',
    author: '圣野',
    sourceCredit: '圣野，选作课文时有改动',
    newRadicals: ['皿字底'],
    additionalReadings: '',
    reciteRequired: false,
    goal: '认识十三字与皿字底、写六字，朗读课文，说明贝贝怎样不再丢文具，读记十二词，试做文具整理与检查。',
    pairs: [
      {
        key: 'story-home',
        prompts: [
          '故事中，贝贝先丢的是哪种文具？',
          '换场景：妈妈建议贝贝为文具找什么？',
        ],
        values: ['铅笔', '自己的家'],
        labels: ['铅笔', '自己的家', '新玩具'],
        explanation:
          '先回看78页的困难，再读79页妈妈的建议。文具的家是拟人说法。',
        material:
          '先共读指定原书页，再观察本站原创信息卡与问题；不打包现代课文全文。',
      },
      {
        key: 'story-place',
        prompts: [
          '第79页，文具的家具体是哪项？',
          '换问题：贝贝在什么时候仔细检查文具？',
        ],
        values: ['文具盒', '每天放学时'],
        labels: ['文具盒', '每天放学时', '等到又丢了才看'],
        explanation: '文具盒是存放处，放学检查是动作和时机，两类信息分别找。',
        material:
          '先共读指定原书页，再观察本站原创信息卡与问题；不打包现代课文全文。',
      },
      {
        key: 'story-action',
        prompts: [
          '文中贝贝最后用什么办法检查文具是否回家？',
          '换到故事开头：文具找不到时贝贝先向妈妈要什么？',
        ],
        values: ['仔细检查文具', '新的铅笔和橡皮'],
        labels: ['仔细检查文具', '新的铅笔和橡皮', '保证以后什么都不用'],
        explanation: '前后的办法发生变化；按故事说，不据一个失误评价真实孩子。',
        material:
          '先共读指定原书页，再观察本站原创信息卡与问题；不打包现代课文全文。',
      },
      {
        key: 'sequence',
        prompts: [
          '开头丢文具与后来仔细检查，哪项先发生？',
          '换先后：听妈妈建议与放学检查，哪项后发生？',
        ],
        values: ['丢文具', '放学检查'],
        labels: ['丢文具', '放学检查', '两件同时发生'],
        explanation: '沿78—79页先后找线索，建议和实际行为不混同。',
        material:
          '先共读指定原书页，再观察本站原创信息卡与问题；不打包现代课文全文。',
      },
      {
        key: 'meaning',
        prompts: [
          '仔细检查中的仔细，在故事里更接近哪项？',
          '换词：伙伴在本文指的是哪项？',
        ],
        values: ['认真看一遍', '铅笔橡皮等文具'],
        labels: ['认真看一遍', '铅笔橡皮等文具', '真实的人类家人'],
        explanation: '拟人表达帮助理解爱惜文具，不当真实身份记录。',
        material:
          '先共读指定原书页，再观察本站原创信息卡与问题；不打包现代课文全文。',
      },
      {
        key: 'radical',
        prompts: [
          '第79页盒上方红标偏旁的名称是哪项？',
          '换观察对象：本课哪个会认字上方标了皿字底？',
        ],
        values: ['皿字底', '盒'],
        labels: ['皿字底', '盒', '所'],
        explanation:
          '放大原页确认红标在盒上方，为皿字底；所没有这个新偏旁红标。',
        material:
          '先共读指定原书页，再观察本站原创信息卡与问题；不打包现代课文全文。',
      },
      {
        key: 'writing',
        prompts: [
          '笔与具中，本课会写的是哪项？',
          '换字：知与仔中，本课会写的是哪项？',
        ],
        values: ['笔', '知'],
        labels: ['笔', '具'],
        reviewLabels: ['知', '仔'],
        explanation: '六会写笔道平知放安与十三会认字分开，选择不代替纸面书写。',
        material:
          '先共读指定原书页，再观察本站原创信息卡与问题；不打包现代课文全文。',
      },
      {
        key: 'word-0',
        prompts: [
          '第80页词语新书放在哪个字的组词列？',
          '换情境：本站原创卡“刚得到的一本书”更适合用哪个词？',
        ],
        values: ['新', '新书'],
        labels: ['新', '新书', '任意词语都一样'],
        explanation:
          '新书归在新的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：刚得到的一本书。',
      },
      {
        key: 'word-1',
        prompts: [
          '第80页词语新年放在哪个字的组词列？',
          '换情境：本站原创卡“新的一年”更适合用哪个词？',
        ],
        values: ['新', '新年'],
        labels: ['新', '新年', '任意词语都一样'],
        explanation:
          '新年归在新的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：新的一年。',
      },
      {
        key: 'word-2',
        prompts: [
          '第80页词语新手放在哪个字的组词列？',
          '换情境：本站原创卡“刚开始学习做一件事的人”更适合用哪个词？',
        ],
        values: ['新', '新手'],
        labels: ['新', '新手', '任意词语都一样'],
        explanation:
          '新手归在新的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：刚开始学习做一件事的人。',
      },
      {
        key: 'word-3',
        prompts: [
          '第80页词语清新放在哪个字的组词列？',
          '换情境：本站原创卡“雨后空气清爽”更适合用哪个词？',
        ],
        values: ['新', '清新'],
        labels: ['新', '清新', '任意词语都一样'],
        explanation:
          '清新归在新的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：雨后空气清爽。',
      },
      {
        key: 'word-4',
        prompts: [
          '第80页词语平安放在哪个字的组词列？',
          '换情境：本站原创卡“人安全地回来了”更适合用哪个词？',
        ],
        values: ['平', '平安'],
        labels: ['平', '平安', '任意词语都一样'],
        explanation:
          '平安归在平的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：人安全地回来了。',
      },
      {
        key: 'word-5',
        prompts: [
          '第80页词语平时放在哪个字的组词列？',
          '换情境：本站原创卡“平常的时候”更适合用哪个词？',
        ],
        values: ['平', '平时'],
        labels: ['平', '平时', '任意词语都一样'],
        explanation:
          '平时归在平的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：平常的时候。',
      },
      {
        key: 'word-6',
        prompts: [
          '第80页词语平常放在哪个字的组词列？',
          '换情境：本站原创卡“普通常见的事”更适合用哪个词？',
        ],
        values: ['平', '平常'],
        labels: ['平', '平常', '任意词语都一样'],
        explanation:
          '平常归在平的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：普通常见的事。',
      },
      {
        key: 'word-7',
        prompts: [
          '第80页词语平地放在哪个字的组词列？',
          '换情境：本站原创卡“平坦的地方”更适合用哪个词？',
        ],
        values: ['平', '平地'],
        labels: ['平', '平地', '任意词语都一样'],
        explanation:
          '平地归在平的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：平坦的地方。',
      },
      {
        key: 'word-8',
        prompts: [
          '第80页词语伙伴放在哪个字的组词列？',
          '换情境：本站原创卡“一起活动的同伴”更适合用哪个词？',
        ],
        values: ['伴', '伙伴'],
        labels: ['伴', '伙伴', '任意词语都一样'],
        explanation:
          '伙伴归在伴的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：一起活动的同伴。',
      },
      {
        key: 'word-9',
        prompts: [
          '第80页词语做伴放在哪个字的组词列？',
          '换情境：本站原创卡“和别人一起陪伴”更适合用哪个词？',
        ],
        values: ['伴', '做伴'],
        labels: ['伴', '做伴', '任意词语都一样'],
        explanation:
          '做伴归在伴的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：和别人一起陪伴。',
      },
      {
        key: 'word-10',
        prompts: [
          '第80页词语相伴放在哪个字的组词列？',
          '换情境：本站原创卡“彼此陪伴”更适合用哪个词？',
        ],
        values: ['伴', '相伴'],
        labels: ['伴', '相伴', '任意词语都一样'],
        explanation:
          '相伴归在伴的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：彼此陪伴。',
      },
      {
        key: 'word-11',
        prompts: [
          '第80页词语结伴放在哪个字的组词列？',
          '换情境：本站原创卡“约好一起走”更适合用哪个词？',
        ],
        values: ['伴', '结伴'],
        labels: ['伴', '结伴', '任意词语都一样'],
        explanation:
          '结伴归在伴的词语组。结合语境读记，再用自己的话理解，不把字形选择当实际认读。',
        material:
          '原书第80页：新书新年新手清新／平安平时平常平地／伙伴做伴相伴结伴。复习情境由本站原创：约好一起走。',
      },
    ],
    steps: [
      {
        title: '十三会认字，六会写字',
        text: '78—80页会认具铅新平盒些此仔检查所伙伴；会写笔道平知放安。认字、写字范围分开；普通网页字体只供观察，实际声音由家长听。',
        activity: '实际指读十三字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '具',
            '铅',
            '新',
            '平',
            '盒',
            '些',
            '此',
            '仔',
            '检',
            '查',
            '所',
            '伙',
            '伴',
          ],
        },
      },
      {
        title: '共读78页：发现困难',
        text: '准备圣野改选原书第78页，与家长分句读。贝贝用了铅笔、橡皮后找不到，回家向妈妈要新的；先说书中遇到的困难，不评论孩子性格或真实家庭。本站只组织阅读，现代全文原画声音在原书或合法资源共读。',
        activity: '实际共读78页，说开头的困难。',
      },
      {
        title: '共读79页：给文具找家',
        text: '继续共读第79页。妈妈提醒自己的东西也该有家；文具盒是文具的存放处，贝贝放学时仔细检查。比较开头与结尾的行为，再说明为不再丢文具她怎么做；允许不同措辞，不要求照背一句。',
        activity: '实际共读79页，说贝贝的办法。',
      },
      {
        title: '盒与皿字底',
        text: '第79页识字行红标在盒上方，是皿字底；观察盒字下部。可借原书规范示范比较盒与盘的下部，这不增加盘的认写要求；所没有此红标，别把它教成新偏旁。',
        activity: '实际指认盒的皿字底。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['盒'],
        },
      },
      {
        title: '朗读完整课文',
        text: '按第80页课后要求朗读78—79页全文。读清开头困难、妈妈提醒、贝贝改变，可以分段或听家长示范后再读；朗读单独实际确认。本课没有必背要求，不强制录音或上传。',
        activity: '实际朗读全文。',
      },
      {
        title: '十二词，三个组',
        text: '第80页读记新书新年新手清新；平安平时平常平地；伙伴做伴相伴结伴。每组找共同字，比较它在词中的位置；例如新书的新在前，清新的新在后。认字选择只检查观察，实际读记要另确认。',
        activity: '实际读记十二个词，选词说意思。',
      },
      {
        title: '六字纸面写',
        text: '按第80页田字格和逐笔示范，实际写笔道平知放安；看结构与笔画位置。网页普通字体不能作规范描红或笔顺示范，十三认字不全部要求写。',
        activity: '实际纸面写六字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['笔', '道', '平', '知', '放', '安'],
        },
      },
      {
        title: '整理、检查与下一次',
        text: '本站原创衔接活动：用自己的安全文具或纸卡，找一个存放处，再实际检查是否收齐；不要求购买、操作转笔刀或记录住址。把已经做的操作与下次想做的计划分开。最后轮流交流和倾听一个发现，可跳过无材料活动。',
        activity: '实际整理并检查，再交流发现。',
      },
    ],
    actual: [
      ['recognize', '实际指读十三会认字。'],
      ['read-first', '实际共读第78页。'],
      ['read-second', '实际共读第79页。'],
      ['retell', '实际说贝贝为不再丢文具是怎么做的，表达可不同。'],
      ['radical', '实际观察盒的皿字底。'],
      ['read', '实际朗读全文，不当背诵确认。'],
      ['words', '实际读记十二词，选词说意思。'],
      ['write', '实际纸面写笔道平知放安。'],
      ['organize', '用安全文具或纸卡实际整理并检查，这是本站原创衔接活动。'],
      ['exchange', '实际交流发现并倾听回应。'],
    ],
    reflections: [
      '记录本次阅读、认字、写字或整理的一个发现。',
      '下一次你想练什么？记为未来计划，不当已完成。',
    ],
  },
];
export const lowerStationerySource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const lowerStationeryPageAudits = entries.map((e) => ({
  itemId: e.itemId,
  pages: e.pages,
  recognize: e.recognize,
  write: e.write,
  author: e.author,
  sourceCredit: e.sourceCredit,
  newRadicals: e.newRadicals,
  additionalReadings: e.additionalReadings,
  reciteRequired: e.reciteRequired,
}));
function makeLesson(e: Entry): Lesson {
  const id = `cl-${e.itemId}`;
  const choice = (
    key: string,
    prompt: string,
    labels: string[],
    value: string,
    explanation: string,
    review: boolean,
    material?: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先看指定字词与原书信息，需要时请家长帮读。',
    explanation,
  });
  const objective = (review: boolean): Question[] => [
    ...required(recognitionRows[e.itemId]).map((r, i) =>
      choice(
        `char-${i}`,
        r[review ? 2 : 1],
        required(recognitionRows[e.itemId]).map((x) => x[0]),
        r[0],
        '按指定词语认字，会认与会写清单分开，实际声音需另行确认。',
        review,
      ),
    ),
    ...e.pairs.map((p) =>
      choice(
        p.key,
        p.prompts[review ? 1 : 0],
        review ? (p.reviewLabels ?? p.labels) : p.labels,
        p.values[review ? 1 : 0],
        p.explanation,
        review,
        p.material,
      ),
    ),
  ];
  return {
    id,
    title: e.title,
    textbookTitle: e.title,
    page: required(e.pages[0]),
    status: 'available',
    version: 2,
    goal: e.goal,
    prerequisite: `准备第${e.pages.join('—')}页原书与田字格纸，可由家长陪读。`,
    parentTip: `${e.sourceCredit}。请先准备原书、纸笔，陪孩子听示范、读一读、说一说。诗文可分段练，实际读写完成后再确认；没有材料可暂时跳过，下一次想做的事另记为计划。`,
    steps: e.steps,
    questions: [
      ...objective(false),
      ...e.actual.map(([key, prompt]): Question => ({
        id: `${id}-manual-${key}`,
        knowledge: `${id}-manual-${key}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '实际尝试后确认，缺书、示范或纸笔可以暂时跳过。',
        explanation:
          '实际读背写说与客观答案分开，不自动评发音字迹，正确性null；计划不当已完成。',
      })),
      ...e.reflections.map((prompt, i): Question => ({
        id: `${id}-reflect-${i}`,
        knowledge: `${id}-reflect-${i}`,
        prompt,
        rule: { kind: 'reflection' },
        hint: '自己的话，家长可代写。',
        explanation:
          '保留原话、正确性null，开放表达不唯一判分，未来计划不当完成。',
      })),
    ],
    reviewQuestions: objective(true),
    review: {
      date: '2026-10-01',
      reviewer: '下册原书课文与活动范围校验',
      notes: `实际查看第三方原书公开预览（${lowerStationerySource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以本单元课文开放声明下册或全年完成。`,
    },
  };
}
export const lowerStationeryLessons: Record<string, Lesson> =
  Object.fromEntries(entries.map((e) => [e.itemId, makeLesson(e)]));
