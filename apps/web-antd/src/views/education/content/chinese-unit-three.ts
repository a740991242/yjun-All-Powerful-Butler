import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { consonantPacks } from './chinese-consonants';
import { ywLesson } from './chinese-yw';

/** Body pages actually inspected; availability is independent of source access. */
export const unitThreePageAudits = [
  {
    itemId: 'u3-1',
    title: 'g k h',
    pages: [32, 33],
    recognize: '哥弟画花',
    write: '',
    topics: ['情境声母', '两拼与三拼', '四线格示范', '生活词语', '陪读说话'],
  },
  {
    itemId: 'u3-2',
    title: 'j q x',
    pages: [34, 35],
    recognize: '打棋积木',
    write: '',
    topics: [
      '情境声母',
      '两拼与三拼',
      'j/q/x与ü省两点',
      '四线格示范',
      '陪读在一起',
    ],
  },
  {
    itemId: 'u3-3',
    title: 'z c s',
    pages: [36, 37],
    recognize: '字词句子',
    write: '',
    topics: [
      '声母与整体认读',
      '两拼与三拼',
      '四线格示范',
      '字词句',
      '陪读过桥',
    ],
  },
  {
    itemId: 'u3-4',
    title: 'zh ch sh r',
    pages: [38, 39],
    recognize: '桌纸读书',
    write: '',
    topics: [
      '声母与整体认读',
      '两拼与三拼',
      '四线格示范',
      '生活词语',
      '陪读绕口令',
    ],
  },
  {
    itemId: 'u3-5',
    title: 'y w',
    pages: [40, 41],
    recognize: '鱼鸭乌鸦',
    write: '',
    topics: [
      '情境字母',
      'yi/wu/yu整体认读与省点',
      '普通拼读',
      '四线格示范',
      '生活词语',
      '陪读哪座房子最漂亮',
    ],
  },
].map((entry) => ({
  ...entry,
  sourceUrl: 'https://keben.app/book/0025',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
}));
const recognitionReviewCards: Record<string, [string, number][]> = {
  'u3-1': [
    ['大哥', 1],
    ['小弟', 1],
    ['图画', 1],
    ['花朵', 0],
  ],
  'u3-2': [
    ['拍打', 1],
    ['棋子', 0],
    ['积累', 0],
    ['木头', 0],
  ],
  'u3-3': [
    ['写字', 1],
    ['诗词', 1],
    ['语句', 1],
    ['孩子', 1],
  ],
  'u3-4': [
    ['书桌', 1],
    ['纸张', 0],
    ['朗读', 1],
    ['书包', 0],
  ],
  'u3-5': [
    ['金鱼', 1],
    ['鸭子', 0],
    ['乌云', 0],
    ['寒鸦', 1],
  ],
};
const id = 'cu-u3-5';
const sourceMaterial =
  '先与家长共读教材印刷第41页《哪座房子最漂亮》，然后回看课文找信息。本站不提供现代作品全文或原图；没有原书可先跳过，勿凭标题猜内容。';
const characterRows = [
  ['鱼', '鱼在水里游。', '鱼的尾巴摆动。'],
  ['鸭', '小鸭跟着妈妈游。', '鸭子在岸边走。'],
  ['乌', '乌鸦中的第一个字。', '乌黑中的第一个字。'],
  ['鸦', '乌鸦中的第二个字。', '乌鸦停在树枝上，找这个鸟名的第二个字。'],
];
const letters = characterRows.map((row) => required(row[0]));
function choose(
  suffix: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  material?: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: `${id}-${knowledge}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '回看本题字卡或原书材料，请家长陪读，不凭题目位置猜答案。',
    explanation,
  };
}
function extraQuestions(review: boolean): Question[] {
  return [
    ...characterRows.map(([character, main], index) => ({
      ...choose(
        `${review ? 'r' : 'q'}-character-${index}`,
        `character-${index}`,
        review
          ? `看词语，选出左起第${required(required(recognitionReviewCards['u3-5'])[index])[1] + 1}个字。`
          : '选择材料中指定的字。',
        letters,
        required(character),
        `本题选${character}。认字与规范发音分开确认，本课没有新增会写汉字。`,
        review
          ? required(required(recognitionReviewCards['u3-5'])[index])[0]
          : main,
      ),
      visual: {
        kind: 'characters' as const,
        grid: 'tian' as const,
        characters: letters,
      },
    })),
    choose(
      `${review ? 'r' : 'q'}-poem-best`,
      'poem-best',
      review ? '课文最后把哪一种房子说成最漂亮？' : '课文说墙是什么颜色？',
      review ? ['小学堂', '乌鸦的巢', '鱼池'] : ['白白的', '黑黑的', '红红的'],
      review ? '小学堂' : '白白的',
      review
        ? '回看原书最后部分，说的是孩子们的小学堂。'
        : '在原书相应句子里找到墙的颜色。',
      sourceMaterial,
    ),
    choose(
      `${review ? 'r' : 'q'}-poem-outside`,
      'poem-outside',
      review ? '课文说房前有什么？' : '课文说屋后什么成行？',
      review ? ['花果', '小鸭', '积木'] : ['树', '鱼', '鸭'],
      review ? '花果' : '树',
      '按原书这首韵文找信息，不把诗中情境推广成所有房子的样子。',
      sourceMaterial,
    ),
  ];
}
const manual = (
  suffix: string,
  prompt: string,
  material?: string,
): Question => ({
  id: `${id}-${suffix}`,
  knowledge: `${id}-${suffix}`,
  prompt,
  material,
  rule: { kind: 'manual' },
  hint: '实际活动还没有完成可以跳过，稍后再做。',
  explanation:
    '由孩子或家长确认实际完成，不自动判断发音或朗读水平，不计客观正确率。',
});
const copyQuestions = (questions: Question[]) =>
  structuredClone(questions).map((question) => ({
    ...question,
    id: question.id.replace(ywLesson.id, id),
    knowledge: `${id}-${question.knowledge}`,
  }));
export const formalYwLesson: Lesson = {
  ...structuredClone(ywLesson),
  version: 4,
  id,
  title: 'y w',
  textbookTitle: 'y w',
  page: 40,
  goal: '认y、w与yi、wu、yu，观察整体写法和普通拼读，认鱼鸭乌鸦，完成情境观察、实际拼读/书写与课文共读。',
  parentTip:
    '已查看原书公开预览40—41页，认鱼鸭乌鸦、无新增会写汉字。跟读用教材或教师规范示范，网页不自动判断声音；课文全文与原画不打包，需对照原书共读。保留原原创补充课及其历史。',
  steps: [
    {
      title: '看教材情境，找y与w',
      text: '打开教材第40页，观察雨中的房屋情境，再看y、w与音节图。图帮助联系写法，不把英文字母名称当作汉语拼音。请孩子描述看到的东西，不要求复述固定答案。',
      activity: '与家长指图说一说，再指认y与w，实际观察单独确认。',
    },
    ...structuredClone(ywLesson.steps),
    {
      title: '认鱼、鸭、乌、鸦',
      text: '第41页用鱼、鸭子、乌鸦、蚂蚁联系生活词语，会认清单是鱼、鸭、乌、鸦。乌鸦是两个字组成的鸟名，“乌”可联系乌黑；不因为读词而把蚂、蚁加进本课会认范围。没有新增会写汉字。',
      visual: { kind: 'characters', grid: 'tian', characters: letters },
      activity:
        '家长示范词语，孩子指字跟读并联系图中的事物，认字与声音分开记录。',
    },
    {
      title: '陪读《哪座房子最漂亮》',
      text: `${
        sourceMaterial
      }先听家长示范，尝试跟读；观察瓦、墙、房前与屋后，再找最后说到的地方。这是课文情境，不要求评价自家房子或提供家庭信息。`,
      activity:
        '实际共读后再尝试朗读，不要求认全所有字，不用选择题代替真实共读。',
    },
  ],
  questions: [
    ...copyQuestions(ywLesson.questions),
    ...extraQuestions(false),
    manual(
      'manual-scene',
      '对照教材第40页情境图指认字母，再看第41页生活词语，跟家长读鱼、鸭、乌、鸦。',
    ),
    manual(
      'manual-poem',
      '与家长实际共读第41页《哪座房子最漂亮》，尝试跟读并说一个自己找到的信息。',
      sourceMaterial,
    ),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写一个还想练的音节，或共读时自己发现的信息。家长可代写，不补造未发生的阅读。',
      rule: { kind: 'reflection' },
      hint: '记录自己的话；尚未共读可以写想做的计划。',
      explanation: '保留原话，不自动评分，不当作真实共读已完成。',
    },
  ],
  reviewQuestions: [
    ...copyQuestions(required(ywLesson.reviewQuestions)),
    ...extraQuestions(true),
  ],
  review: {
    date: '2026-10-01',
    reviewer: '原书范围与原创课包核对',
    notes:
      '实际查看第三方原书公开预览 https://keben.app/book/0025 封面、出版编写信息、目录与印刷40—41页。认鱼鸭乌鸦，无新增会写汉字；覆盖情境、字母/整体认读/普通拼读、四线格示范与现代韵文陪读。ISBN、版次、印次未知，不冒充官方来源。讲解练习原创，现代全文、原画、声音、规范笔顺图不打包；实际发音、纸面及共读人工确认，尚待教师最终人工审校，不据开放状态宣布整册完成。',
  },
};

interface InitialBody {
  itemId: string;
  version?: number;
  scene: string;
  words: string;
  characters: [string, string, string][];
  triples: [string, string, string, string][];
  whole?: string[];
  wholeReview?: string[];
  readingTitle: string;
  reading: [string, string[], string, string, string[], string][];
}
const initialBodies: InitialBody[] = [
  {
    itemId: 'u3-1',
    scene:
      '观察第32页鸽子、水边与坐着喝水的孩子等情境，联系g、k、h；找图中事物再找字母，不要求按固定故事复述。',
    words:
      '哥哥、弟弟、画画、荷花；两个相同字组成的词也要观察第二个音节是否轻声，跟规范示范，不根据无调号猜第一声。',
    characters: [
      ['哥', '哥哥中的第一个字。', '哥哥来了，找称呼中的第一个字。'],
      ['弟', '弟弟中的第一个字。', '弟弟拿来一本书，找这个称呼里的字。'],
      ['画', '画画中的字。', '画一朵花，找表示画的字。'],
      ['花', '荷花中的第二个字。', '花开了，找表示花的字。'],
    ],
    triples: [
      ['g', 'u', 'ā', 'ō'],
      ['k', 'u', 'ā', 'ò'],
      ['h', 'u', 'ā', 'ǒ'],
    ],
    readingTitle: '说话',
    reading: [
      [
        '韵文里小溪流的声音是哪一种？',
        ['哗哗', '喵喵', '沙沙'],
        '哗哗',
        '韵文里小雨点的声音是哪一种？',
        ['沙沙', '哗哗', '喵喵'],
        '沙沙',
      ],
      [
        '韵文里小鸭子的声音是哪一种？',
        ['嘎嘎', '喵喵', '咕咕'],
        '嘎嘎',
        '韵文里小花猫的声音是哪一种？',
        ['喵喵', '嘎嘎', '呱呱'],
        '喵喵',
      ],
    ],
  },
  {
    itemId: 'u3-2',
    scene:
      '观察第34页树、母鸡、小鸡、西瓜和拿气球的孩子等情境，联系j、q、x的字形。图只是联系线索，真正发音看规范示范。',
    words:
      '打鼓、下棋、搭积木；认打、棋、积、木，词中其它字不自动加入本课会认清单。',
    characters: [
      ['打', '打鼓中的第一个字。', '打球中的第一个字。'],
      ['棋', '下棋中的第二个字。', '棋盘中的第一个字。'],
      ['积', '积木中的第一个字。', '积木叠起来，找物品名的第一个字。'],
      ['木', '积木中的第二个字。', '木头中的第一个字。'],
    ],
    triples: [
      ['j', 'i', 'ā', 'à'],
      ['q', 'i', 'ā', 'ǎ'],
      ['x', 'i', 'ā', 'à'],
    ],
    readingTitle: '在一起',
    reading: [
      [
        '韵文写哪两种颜色的小鸡在一起？',
        ['小黄鸡与小黑鸡', '小白鸡与小红鸡', '小蓝鸡与小绿鸡'],
        '小黄鸡与小黑鸡',
        '韵文里小鸡在哪里做游戏？',
        ['青草地上', '书架上', '鱼池里'],
        '青草地上',
      ],
      [
        '韵文写小鸡刨什么？',
        ['土', '云', '书'],
        '土',
        '韵文写小鸡捉什么？',
        ['虫', '书', '云'],
        '虫',
      ],
    ],
  },
  {
    itemId: 'u3-3',
    scene:
      '观察第36页课堂情境及z、c、s的形状，再看zi、ci、si整组字母。情境里的字母名称不是英语字母读音。',
    words:
      '字、词、句子；第37页用字、学生、我是小学生的例子比较层次，本课只认字、词、句、子，不要求认全示例里的其它字。',
    characters: [
      ['字', '字母中的第一个字。', '写字中的第二个字。'],
      ['词', '词语中的第一个字。', '认一个词，找表示词的字。'],
      ['句', '句子中的第一个字。', '一句话中的第二个字。'],
      ['子', '句子中的第二个字。', '桌子中的第二个字。'],
    ],
    triples: [
      ['z', 'u', 'ō', 'ò'],
      ['c', 'u', 'ō', 'ò'],
      ['s', 'u', 'ō', 'ǒ'],
    ],
    whole: ['zi', 'ci', 'si'],
    wholeReview: ['zǐ', 'cǐ', 'sǐ'],
    readingTitle: '过桥',
    reading: [
      [
        '韵文把哪一种数学符号比作桥？',
        ['等号', '括号', '小数点'],
        '等号',
        '韵文写做错了会怎样？',
        ['过不了桥', '直接过桥', '变成小鸡'],
        '过不了桥',
      ],
      [
        '韵文里的题是什么学科的题？',
        ['数学', '美术', '音乐'],
        '数学',
        '韵文写先做哪些事再快乐过桥？',
        ['想一想、算一算', '闭眼猜、不看题', '收起书、不再做'],
        '想一想、算一算',
      ],
    ],
  },
  {
    itemId: 'u3-4',
    version: 3,
    scene:
      '观察第38页课堂、日出和字母形状的情境；zh、ch、sh各是一个声母，不把两个字母拆成两个声母。平舌、翘舌发音跟规范示范，网站不判舌位。',
    words:
      '擦桌子、折纸、读书；会认桌、纸、读、书，不把活动词的所有字都加入会认范围。',
    characters: [
      ['桌', '桌子中的第一个字。', '桌面中的第一个字。'],
      ['纸', '折纸中的第二个字。', '白纸中的第二个字。'],
      ['读', '读书中的第一个字。', '读一句话中的第一个字。'],
      ['书', '读书中的第二个字。', '书包中的第一个字。'],
    ],
    triples: [
      ['zh', 'u', 'ā', 'ó'],
      ['ch', 'u', 'ō', 'ò'],
      ['sh', 'u', 'ā', 'ò'],
      ['r', 'u', 'ò', 'ò'],
    ],
    whole: ['zhi', 'chi', 'shi', 'ri'],
    // Explicit examples: do not manufacture a third tone for every syllable.
    wholeReview: ['zhǐ', 'chǐ', 'shǐ', 'rì'],
    readingTitle: '绕口令',
    reading: [
      [
        '按绕口令，十四是不是四十？',
        ['不是', '是'],
        '不是',
        '按绕口令，四十是不是十四？',
        ['是', '不是'],
        '不是',
      ],
      [
        '绕口令里表示14的词是哪一个？',
        ['十四', '四十', '四'],
        '十四',
        '绕口令里表示40的词是哪一个？',
        ['十', '十四', '四十'],
        '四十',
      ],
    ],
  },
];
function makeInitialBody(body: InitialBody): Lesson {
  const base = required(consonantPacks[body.itemId]);
  const audit = required(
    unitThreePageAudits.find((a) => a.itemId === body.itemId),
  );
  const lessonId = `cu-${body.itemId}`;
  const copied = (questions: Question[]) =>
    structuredClone(questions).map((question) => ({
      ...question,
      id: question.id.replace(base.id, lessonId),
      knowledge: `${lessonId}-${question.knowledge}`,
    }));
  const pick = (
    suffix: string,
    knowledge: string,
    prompt: string,
    labels: string[],
    value: string,
    explanation: string,
    material?: string,
  ): Question => ({
    id: `${lessonId}-${suffix}`,
    knowledge: `${lessonId}-${knowledge}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '看清本题声母、介音、韵母和调号；原书阅读题先共读再找信息。',
    explanation,
  });
  const readMaterial = `先与家长共读教材印刷第${audit.pages[1]}页《${body.readingTitle}》，然后回看材料找信息。本站不提供现代作品全文或原画；没有原书可以先跳过，不凭标题猜。`;
  const extra = (review: boolean): Question[] => [
    ...body.triples.map(([initial, medial, main, changed], index) =>
      pick(
        `${review ? 'r' : 'q'}-triple-${index}`,
        `triple-${index}`,
        review
          ? '补上所示三拼写法中缺少的介音。'
          : '按所示三部分写法，选出连起来的音节。',
        review
          ? ['i', 'u', 'ü']
          : body.triples.map((row) => row[0] + row[1] + row[2]),
        review ? medial : initial + medial + main,
        review
          ? `这里缺少介音${medial}，完整写法是${initial + medial + changed}。`
          : `三部分是${initial}、${medial}、${main}，写作${initial + medial + main}；实际连读另跟规范示范。`,
        review
          ? `${initial} + __ + ${changed} → ${initial + medial + changed}`
          : `${initial} + ${medial} + ${main}`,
      ),
    ),
    ...(body.whole || []).map((syllable, index) =>
      pick(
        `${review ? 'r' : 'q'}-whole-${index}`,
        `whole-${index}`,
        review
          ? '去掉本题调号，找出完整的整体认读写法。'
          : '选择本题列出的整体认读音节，不能按两个部分拆读。',
        review ? required(body.whole) : [syllable, syllable.slice(0, -1), 'i'],
        syllable,
        review && syllable === 'ri'
          ? 'rì去掉第四声调号写作ri，可联系已学的日。这里辨整体认读的完整写法，不把ri拆成r与单韵母i；实际读音跟规范示范。'
          : '这里只辨完整音节的写法；整体认读的实际读音跟规范示范，不把末尾i都当作单韵母i。',
        review ? required(required(body.wholeReview)[index]) : syllable,
      ),
    ),
    ...body.characters.map(([character, main], index) => ({
      ...pick(
        `${review ? 'r' : 'q'}-character-${index}`,
        `character-${index}`,
        review
          ? `看词语，选出左起第${required(required(recognitionReviewCards[body.itemId])[index])[1] + 1}个字。`
          : '选择材料中指定的字。',
        body.characters.map((row) => row[0]),
        character,
        `选${character}；本课无新增会写汉字，辨形不代表发音已确认。`,
        review
          ? required(required(recognitionReviewCards[body.itemId])[index])[0]
          : main,
      ),
      visual: {
        kind: 'characters' as const,
        grid: 'tian' as const,
        characters: body.characters.map((row) => row[0]),
      },
    })),
    ...body.reading.map(
      (
        [prompt, choices, value, reviewPrompt, reviewChoices, reviewValue],
        index,
      ) =>
        pick(
          `${review ? 'r' : 'q'}-reading-${index}`,
          `reading-${index}`,
          review ? reviewPrompt : prompt,
          review ? reviewChoices : choices,
          review ? reviewValue : value,
          '回看本课原书韵文相应内容找信息，不把文学比喻或情境当作所有现实情况。',
          readMaterial,
        ),
    ),
  ];
  const actual = (
    suffix: string,
    prompt: string,
    material?: string,
  ): Question => ({
    id: `${lessonId}-${suffix}`,
    knowledge: `${lessonId}-${suffix}`,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '真实任务未完成可跳过，稍后跟规范示范再做。',
    explanation:
      '人工确认实际活动，不能由字形或拼写题代替，不自动判断读音、书写或表达。',
  });
  const baseSteps = structuredClone(base.steps);
  const writingStep = required(baseSteps.at(-1));
  writingStep.text += `对照教材第${audit.pages[0]}页底部四线三格逐笔示范，先指四条线和上、中、下三格，再看起笔和占格；屏幕普通字体不作为规范手写。`;
  return {
    ...structuredClone(base),
    version: body.version ?? 2,
    id: lessonId,
    title: audit.title,
    textbookTitle: audit.title,
    goal: `认本组声母，分别观察两拼与三拼${body.whole ? '、整体认读' : ''}，认${audit.recognize}，完成规范跟读/纸笔与《${body.readingTitle}》共读。`,
    parentTip: `已查看原书公开预览${audit.pages.join('—')}页，认${audit.recognize}，无新增会写汉字。实际发音、三拼${body.whole ? '与整体认读' : ''}、四线格纸笔和共读分别人工确认；不提供标准录音、规范笔顺图或现代韵文全文，不用普通TTS冒充示范。旧补充及历史保留。`,
    steps: [
      {
        title: '对照教材情境认声母',
        text: body.scene,
        activity: '请孩子指图、描述再指字母，表达不限固定答案。',
      },
      ...baseSteps,
      {
        title: '三拼：声母、介音、韵母',
        text: `教材第${audit.pages[0]}页还有三拼音节。这里中间的${required(body.triples[0])[1]}是介音，不应漏掉；分别看三部分再跟规范示范连读。本站检查写法，不自动判断连读。`,
        visual: {
          kind: 'characters',
          grid: 'pinyin',
          characters: body.triples.map((row) => row[0] + row[1] + row[2]),
        },
        activity: body.triples
          .map(
            (row) =>
              `${row[0]} + ${row[1]} + ${row[2]} → ${row[0] + row[1] + row[2]}`,
          )
          .join('；'),
      },
      ...(body.whole
        ? [
            {
              title: '整体认读与声母分开',
              text: `${body.whole.join('、')}是本课整体认读音节，直接整体认读，不按声母加单韵母i的方法拆读。字母多不表示有多个声母，例如${required(body.whole[0]).slice(0, -1)}是一个声母，${body.whole[0]}是一个完整音节。普通话读音跟标准示范，网站字卡不能自动确认发音。`,
              visual: {
                kind: 'characters' as const,
                grid: 'pinyin' as const,
                characters: body.whole,
              },
              activity: '比较声母与完整音节，家长示范，孩子整体跟读。',
            },
          ]
        : []),
      {
        title: '联系词语认字',
        text: `${body.words}真实认读与屏幕辨形分开，汉字没有新增会写要求。`,
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: body.characters.map((row) => row[0]),
        },
        activity: '家长读词、孩子指字，打乱顺序再试；无需介绍真实家庭信息。',
      },
      {
        title: `陪读《${body.readingTitle}》`,
        text: `${
          readMaterial
        }先听示范、尝试跟读，再找本课音节与明确信息；不要求识字量外的所有字都独立认读。`,
        activity: '实际共读后说一个发现，发音和表达不限固定标准答案。',
      },
    ],
    questions: [
      ...copied(base.questions),
      ...extra(false),
      actual(
        'manual-scene',
        '对照原书本课情境图，指认声母并说一个看到的事物。',
      ),
      actual(
        'manual-triple',
        `参考规范示范，实际跟读本课三拼音节${body.whole ? '与整体认读音节' : ''}；没有示范可以跳过。`,
        body.triples.map((row) => row[0] + row[1] + row[2]).join('、') +
          (body.whole ? '；' + body.whole.join('、') : ''),
      ),
      actual(
        'manual-words',
        '跟家长读本课生活词语，打乱会认汉字的顺序再指读。',
        `会认${audit.recognize}；无新增会写汉字。`,
      ),
      actual(
        'manual-reading',
        `与家长实际共读《${body.readingTitle}》，尝试跟读，说一个自己找到的信息。`,
        readMaterial,
      ),
      {
        id: `${lessonId}-reflection`,
        knowledge: `${lessonId}-reflection`,
        prompt:
          '写一个还想练的声母/音节，或共读时自己的发现。家长可代写，未共读可记计划。',
        rule: { kind: 'reflection' },
        hint: '保存自己的话，不补造未发生的活动。',
        explanation: '反思保留原话、不评分，不自动确认真实活动已完成。',
      },
    ],
    reviewQuestions: [
      ...copied(required(base.reviewQuestions)),
      ...extra(true),
    ],
    review: {
      date: '2026-10-01',
      reviewer: '原书范围与原创课包核对',
      notes: `实际查看${audit.provider} https://keben.app/book/0025 封面、出版编写信息、目录及印刷${audit.pages.join('、')}页；范围${audit.topics.join('、')}。认${audit.recognize}、无新增会写汉字。ISBN、版次、印次未知，不冒充官方来源。原创讲解练习，不打包现代韵文全文、原画、录音或规范笔顺图；发音、纸面与共读人工确认，尚待教师最终审校，不据开放状态证明整册完成。`,
    },
  };
}
export const formalUnitThreeInitials: Record<string, Lesson> =
  Object.fromEntries(
    initialBodies.map((body) => [body.itemId, makeInitialBody(body)]),
  );
