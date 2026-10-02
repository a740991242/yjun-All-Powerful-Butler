import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

/** Only the ancient poem is reproduced; modern text and original art remain in the book. */
const goosePoem =
  '咏鹅\n[唐] 骆宾王\n鹅，鹅，鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。';
export const firstGardenReadingAudits = [
  {
    itemId: 'u1-5',
    pages: [15, 16, 17, 18],
    sections: [
      '识字加油站',
      '字词句运用',
      '书写提示',
      '日积月累：咏鹅',
      '口语交际：我说你做',
      '和大人一起读：剪窗花',
    ],
    recognize: '六七八九十',
    write: '六七八十',
  },
  {
    itemId: 'u1-6',
    pages: [19],
    sections: [
      '亲子共读故事书',
      '讲故事与分享',
      '书店图画书',
      '学拼音帮助认字阅读',
    ],
    recognize: '',
    write: '',
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
function choose(
  id: string,
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  material?: string,
): Question {
  return {
    id,
    knowledge,
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '请家长陪读题目，回看材料或题目条件，找到支持答案的依据。',
    explanation,
    material,
  };
}
function manual(
  id: string,
  knowledge: string,
  prompt: string,
  material?: string,
): Question {
  return {
    id,
    knowledge,
    prompt,
    material,
    rule: { kind: 'manual' },
    hint: '先准备材料和陪同；尚未实际完成可跳过，稍后补做。',
    explanation:
      '记录人工确认，不自动评价朗读、书写、表达或实际作品，不纳入客观正确率。',
  };
}
function reflection(id: string, knowledge: string, prompt: string): Question {
  return {
    id,
    knowledge,
    prompt,
    rule: { kind: 'reflection' },
    hint: '保存自己的话，家长可以代写；不要求标准答案。',
    explanation: '只保存原话，不自动评分，不把记录文字当作实际活动已完成。',
  };
}
const gid = 'cu-u1-5';
function gardenTasks(review: boolean): Question[] {
  const prefix = `${gid}-${review ? 'r' : 'q'}`;
  const numbers = ['六', '七', '八', '九', '十'];
  const tasks: Question[] = numbers.map((character, index) => ({
    ...choose(
      `${prefix}-number-${index}`,
      `cu-recognize-u${required(character.codePointAt(0)).toString(16)}`,
      review
        ? '这张汉字卡表示哪个数量？'
        : '数一数圆片，选出表示这个数量的汉字。',
      review ? ['6', '7', '8', '9', '10'] : numbers,
      review ? String(index + 6) : character,
      `“${character}”表示数量${index + 6}。认读与口算分别练习。`,
    ),
    visual: review
      ? { kind: 'characters', characters: [character], grid: 'tian' }
      : { kind: 'count', count: index + 6 },
  }));
  const rows: [
    string,
    string,
    string,
    string[],
    string,
    string,
    string,
    string,
  ][] = [
    [
      'shape-person',
      '人和天相比，哪个字有两条横画？',
      '人和天相比，哪个字没有横画？',
      ['人', '天'],
      '天',
      '人',
      '天有两条横画，人没有横画。',
      '',
    ],
    [
      'shape-field',
      '口和田相比，哪个字的框里有横竖相交的笔画？',
      '口和田相比，哪个字的框里没有笔画？',
      ['口', '田'],
      '田',
      '口',
      '田里面有横竖相交的笔画，口的框里没有。',
      '',
    ],
    [
      'shape-eye',
      '日和目相比，哪个字框里有两条横线？',
      '日和目相比，哪个字框里只有一条横线？',
      ['日', '目'],
      '目',
      '日',
      '日框里有一条横线，目框里有两条。',
      '',
    ],
    [
      'cross-stroke',
      '按教材示范写十，先写哪一笔？',
      '写十时，横和竖哪一笔在前？',
      ['横', '竖'],
      '横',
      '横',
      '十先横后竖；具体笔顺仍须对照原书示范，不能把规则机械推广所有字。',
      '',
    ],
    [
      'spread-stroke',
      '按教材示范写八，撇和捺哪一笔在前？',
      '写八时，先捺后撇符合教材示范吗？',
      review ? ['符合', '不符合'] : ['撇', '捺'],
      '撇',
      '不符合',
      '八先撇后捺。观察教材第16页示范，再在纸面练习。',
      '',
    ],
    [
      'poem-animal',
      '《咏鹅》主要描写哪种动物？',
      '诗中反复出现的动物名称是什么？',
      ['鹅', '鸭', '鸡'],
      '鹅',
      '鹅',
      '标题和开头都点明鹅。',
      goosePoem,
    ],
    [
      'poem-color',
      '诗中鹅的毛是什么颜色？',
      '诗中鹅的掌是什么颜色？',
      review ? ['红色', '白色', '绿色'] : ['白色', '红色', '绿色'],
      '白色',
      '红色',
      '诗中分别描写白毛与红掌；要找问题指定的部位。',
      goosePoem,
    ],
    [
      'poem-action',
      '诗中哪个词描写鹅的毛在水上的状态？',
      '诗中哪个词描写鹅掌拨动水的动作？',
      ['浮', '拨', '歌'],
      '浮',
      '拨',
      '浮写毛在水上，拨写掌拨动水，歌与鸣叫有关。',
      goosePoem,
    ],
    [
      'command-first',
      '原创指令：先把卡片放进盒子，再合上书。应该先做什么？',
      '原创指令：先合上书，再把卡片放进盒子。应该先做什么？',
      ['卡片放进盒子', '合上书'],
      '卡片放进盒子',
      '合上书',
      '先听清先后条件，再按本次指令执行，不能背上次顺序。',
      '',
    ],
    [
      'command-last',
      '原创指令：先放下笔，再把书放到桌上，最后举手。最后做什么？',
      '原创指令：先举手，再放下笔，最后把书放到桌上。最后做什么？',
      ['放下笔', '书放到桌上', '举手'],
      '举手',
      '书放到桌上',
      '多步指令要听完整，最后一项以本次条件为准。',
      '',
    ],
    [
      'listen',
      '对方还没说完指令，怎样做更合适？',
      '没有听清指令，怎样做更合适？',
      review
        ? ['请对方再说清楚', '随便猜一个动作']
        : ['听完整再做', '立刻打断并乱做'],
      '听完整再做',
      '请对方再说清楚',
      '认真倾听；不清楚时礼貌询问，说话清楚且音量让对方听见即可。',
      '',
    ],
    [
      'window-helper',
      '对照教材第18页：《剪窗花》里，孩子向谁学习剪窗花？',
      '回看教材第18页，诗中的奶奶与孩子的关系是哪一种？',
      review ? ['孩子向奶奶学习', '奶奶向孩子学习'] : ['奶奶', '同学', '老师'],
      '奶奶',
      '孩子向奶奶学习',
      '请在原文找到支持答案的句子；亲子共读不要求孩子独立读懂所有字。',
      '请先亲子共读教材第18页《剪窗花》。本站不展示这篇现代作品全文。',
    ],
    [
      'window-picture',
      '对照教材第18页，文中出现哪一种花的窗花图案？',
      '对照教材第18页，文中出现哪一种鱼的窗花图案？',
      review ? ['鲤鱼', '鲨鱼', '鲸鱼'] : ['梅花', '向日葵', '荷花'],
      '梅花',
      '鲤鱼',
      '答案依据本次指定原文，不把自己的作品图案当作课文事实。',
      '请回看教材第18页对应文字；不要只看插图猜所有原文内容。',
    ],
  ];
  for (const [
    skill,
    main,
    retry,
    labels,
    first,
    second,
    explanation,
    material,
  ] of rows)
    tasks.push(
      choose(
        `${prefix}-${skill}`,
        `${gid}-${skill}`,
        review ? retry : main,
        labels,
        review ? second : first,
        explanation,
        material || undefined,
      ),
    );
  tasks.push(
    choose(
      `${prefix}-riddle`,
      `${gid}-riddle`,
      review
        ? '原创谜语：天空落下小水滴，路面湿，花草喝到水。是什么？'
        : '原创谜语：冷天白片从天落，暖了融化变成水。是什么？',
      ['雪', '雨', '落叶'],
      review ? '雨' : '雪',
      '联系全部线索猜谜，再说出依据。本站谜语不是教材韵文。',
    ),
  );
  return tasks;
}
const auditNotes = (itemId: string) => {
  const audit = required(
    firstGardenReadingAudits.find((item) => item.itemId === itemId),
  );
  return `实际查看${audit.provider}（${audit.sourceUrl}）印刷第${audit.pages.join('、')}页及新版封面、编写出版信息与目录。范围：${audit.sections.join('；')}。预览ISBN、版权版次与印次未知，不称为官方入口。讲解与练习原创；除公有领域古诗《咏鹅》外不复制教材全文、图片或音频。纸面、亲子共读与表达人工确认；尚待教师最终人工审校。本课包开放不证明全册或全年完成。`;
};
export const gardenOneLesson: Lesson = {
  id: gid,
  title: '语文园地一',
  textbookTitle: '语文园地一',
  page: 15,
  version: 1,
  status: 'available',
  goal: '复习数字与形近字，按示范写字；读古诗、听清指令并交流，和大人一起读《剪窗花》。',
  prerequisite: '准备教材第15—18页、田字格纸和安全的卡片、盒子；请家长陪读。',
  parentTip:
    '一次可学一个活动，随时恢复。普通字体不是描红范本；网站不自动评价真实发音、笔顺或交流。现代作品与原图请对照纸质或官方电子教材。',
  steps: [
    {
      title: '数字与猜谜',
      text: '认六、七、八、九、十，联系6至10个小物品的数量。请家长朗读教材第15页谜语，孩子找到线索，说说自己的猜想；网站另有原创谜语练习。',
      visual: {
        kind: 'characters',
        characters: ['六', '七', '八', '九', '十'],
        grid: 'tian',
      },
      activity: '逐个数安全小物品，再指读对应汉字，亲子读谜语并说理由。',
    },
    {
      title: '比较相近字形',
      text: '观察人/天、口/田、日/目。比较有没有横画、外框里面有哪些笔画；再读大人、天气、开口、田地、日光、目光这些原创词语。',
      visual: {
        kind: 'characters',
        characters: ['人', '天', '口', '田', '日', '目'],
        grid: 'tian',
      },
      activity: '每组指读，并说一处区别。',
    },
    {
      title: '按示范书写',
      text: '第15页会写六、七、八、十；第16页用十、田说明先横后竖，用八、禾说明先撇后捺。田的内部先写横，再写竖，不表示整个田字先写横。规则帮助观察，但不能取代每个字的具体笔顺。对照原书逐笔示范，注意坐姿握笔与田字格位置。',
      visual: {
        kind: 'characters',
        characters: ['六', '七', '八', '十', '田', '禾'],
        grid: 'tian',
      },
      activity:
        '先看示范，再描写临写。本园地新增会写字仍只有六、七、八、十，田禾用于复习规则。',
    },
    {
      title: '读古诗《咏鹅》',
      text: `${goosePoem}\n先听家长示范，再分句跟读。诗中描写鹅的叫声、身体颜色和水上的动作；在诗句里找到依据，不只凭生活印象回答。`,
      activity:
        '对照教材第16页原图，指一指诗中描写的景物，尝试朗读与背诵；背诵作为本站积累活动，不自动评分。',
    },
    {
      title: '把指令说清楚',
      text: '“我说你做”由一个人说指令，另一个人认真听并做。原创例子：先把卡片放进盒子，再合上书。说明动作、物品和先后；声音让对方听见，吐字清楚，不必喊叫。',
      activity: '两人轮流说一句安全的桌面指令，先让对方复述再做。',
    },
    {
      title: '听完整，再做',
      text: '指令有多步时要听完，按顺序执行。没听清可以请对方重说；身体不适合某个动作时说明并换安全动作。网页选择题只检查理解，不能代替真实听说。',
      activity: '交换说话者，使用不同次序的桌面指令，做完再核对。',
    },
    {
      title: '和大人一起读《剪窗花》',
      text: '打开教材第18页，家长先读，孩子边听边看图，再试着接读或跟读。说说文中孩子向谁学习，剪出了哪些图案；分清原文内容和自己想剪的图案。原文作者为莫植，选作课文时有改动，本站不展示全文。',
      activity:
        '找到原文中的一处依据，再讲一个喜欢的图案；本活动不要求使用剪刀。',
    },
    {
      title: '分享并回看',
      text: '回看数字、字形、书写、古诗、指令和共读活动，选择还想练的一项。写字、朗读、实际交流分别由孩子或家长确认；做完不是自动掌握。',
      activity: '用自己的话说今天学到的内容，家长听完再回应。',
    },
  ],
  questions: [
    ...gardenTasks(false),
    manual(
      `${gid}-manual-recognize`,
      `${gid}-oral-recognize`,
      '请家长打乱六至十与三组形近字，孩子指认并读；再亲子读教材第15页谜语，孩子说出猜想依据。',
    ),
    manual(
      `${gid}-manual-write`,
      `${gid}-writing`,
      '对照教材第15—16页，在田字格纸描写后临写六、七、八、十；再观察田与禾的逐笔示范，说说先横后竖、先撇后捺。没有示范可跳过。',
      '本园地新增会写：六、七、八、十。田与禾为规则观察，不新增写字范围。',
    ),
    manual(
      `${gid}-manual-poem`,
      `${gid}-poem-reading`,
      '亲子朗读《咏鹅》，结合原书图说一处诗句描写；本站还可尝试背诵，家长记录实际情况，不自动判断发音。',
      goosePoem,
    ),
    manual(
      `${gid}-manual-command`,
      `${gid}-real-dialogue`,
      '家长与孩子各说一次安全桌面指令，另一人听完整、复述并执行；交换角色和先后次序，没听清时礼貌询问。网页答对不代替此次实际交流。',
    ),
    manual(
      `${gid}-manual-window`,
      `${gid}-shared-reading`,
      '和大人一起读教材第18页《剪窗花》，孩子跟读或接读，并指出文中一种图案。无需实际剪纸，不自动确认阅读能力。',
    ),
    manual(
      `${gid}-manual-share`,
      `${gid}-expression`,
      '孩子用自己的话介绍喜欢的窗花图案或《咏鹅》中的画面，家长听完后回应；表达允许不同说法。',
    ),
    reflection(
      `${gid}-reflection-picture`,
      `${gid}-picture-note`,
      '想象一张自己的窗花：你想表现什么图案？写一句自己的想法，家长可代写；这是原创想象，不把它当课文里的图案。',
    ),
    reflection(
      `${gid}-reflection-next`,
      `${gid}-reflection`,
      '园地里哪一项还想再练？写具体的字、诗句或活动。',
    ),
  ],
  reviewQuestions: gardenTasks(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书四页栏目范围核验与原创任务校验',
    notes: auditNotes('u1-5'),
  },
};
const rid = 'cu-u1-6';
const readingTasks = (review: boolean): Question[] => {
  const scene = review
    ? '小安和爷爷读完图画书，准备向同学介绍。书中有一只迷路的小猫，最后它找到了家。小安还不认识一些字。'
    : '小宁和妈妈读完图画书，准备向同学介绍。书中有一只小鸟，最后它找到了朋友。小宁还不认识一些字。';
  const rows: [string, string, string, string[], string, string][] = [
    [
      'shared',
      '还不认识一些字，怎样继续读更合适？',
      '遇到暂时不认识的字，怎样继续读更合适？',
      ['请大人陪读并看图', '只能等所有字都学完'],
      '请大人陪读并看图',
      '可以亲子共读并结合图画，不要求全部独立识字才阅读。',
    ],
    [
      'story',
      '向同学分享故事，怎样说更合适？',
      '向朋友介绍读过的书，怎样说更合适？',
      ['说书名、人物和喜欢的内容', '只说自己读了很多书'],
      '说书名、人物和喜欢的内容',
      '介绍具体的书与内容，比仅比较读书数量更能帮助交流。',
    ],
    [
      'ending',
      '这个原创故事里，小鸟最后找到了什么？',
      '这个原创故事里，小猫最后找到了什么？',
      review ? ['家', '朋友', '铅笔'] : ['朋友', '家', '铅笔'],
      '朋友',
      '按实际材料找信息，不借用另一篇故事的结尾。',
    ],
    [
      'unknown',
      '材料没有写这本书的书名，能猜一个并当作真实书名记录吗？',
      '材料没有给真实书名，应该怎样记录？',
      review
        ? ['待找到封面再记录', '随便编一个当真实书名']
        : ['不能，先看真实封面', '可以随便编'],
      review ? '待找到封面再记录' : '不能，先看真实封面',
      '缺少书名不补造；真实阅读卡以封面为依据。',
    ],
    [
      'picture',
      '读图画书，看图可以怎样帮助阅读？',
      '听大人读故事时，怎样利用图画？',
      ['观察人物和场景，联系文字', '只数图片张数就算读懂'],
      '观察人物和场景，联系文字',
      '看图与文字相互联系，图片数量不能证明阅读理解。',
    ],
    [
      'listen',
      '同学正在介绍书，怎样做更合适？',
      '家长正在讲喜欢的情节，怎样做更合适？',
      ['先认真听，听完再提问', '不断打断对方'],
      '先认真听，听完再提问',
      '分享需要说与听；不同喜好可以交流，不评谁更好。',
    ],
    [
      'pinyin',
      '教材提到学拼音能帮助阅读，现在还没学会时必须停止读书吗？',
      '拼音还在学习中，能和大人继续看图共读吗？',
      review ? ['能', '不能'] : ['不用，可以亲子共读', '必须停止读书'],
      review ? '能' : '不用，可以亲子共读',
      '拼音会帮助认字阅读，但亲子共读与看图现在也可以开始。',
    ],
  ];
  return rows.map(([skill, main, retry, labels, value, explanation]) =>
    choose(
      `${rid}-${review ? 'r' : 'q'}-${skill}`,
      `${rid}-${skill}`,
      review ? retry : main,
      labels,
      skill === 'ending' && review ? '家' : value,
      explanation,
      `本站原创阅读情境，不是教材原文：\n${scene}`,
    ),
  );
};
export const happyReadingLesson: Lesson = {
  id: rid,
  title: '快乐读书吧 · 读书真快乐',
  textbookTitle: '快乐读书吧 · 读书真快乐',
  page: 19,
  version: 1,
  status: 'available',
  goal: '选择合适的图画书，和大人共读，记录真实书名与喜欢的内容，再分享和倾听。',
  prerequisite:
    '准备一本能合法阅读的真实图画书，请家长陪同；不要求先学完拼音或独立识字。',
  parentTip:
    '网站不预装未授权图书、不规定必须购买或去书店。阅读卡仅存在当前浏览器，可家长代写；不填写真实姓名等个人资料，记录文字不等于阅读完成。',
  steps: [
    {
      title: '看教材中的阅读生活',
      text: '打开第19页，观察亲子共读、向同学讲故事、书店看图画书和用拼音帮助读书四种场景。选择自己想尝试的一种，回想自己的阅读经历，不要求每个家庭都去过书店。',
    },
    {
      title: '挑选一本合适的书',
      text: '从家里、学校或图书馆已有的合法图画书中选择一本，也可与家长在书店挑选。看封面书名与图画，说说为什么想读；不设置必须购买的任务。',
      activity: '实际找到一本书，对照封面确认书名。',
    },
    {
      title: '和大人一起读',
      text: '家长可以先读，孩子看图、听故事，再接读熟悉的内容；不认识的字可以请教。读一小段就停下来聊聊人物和发生的事，不需要追求一次读完或比较数量。',
      activity: '进行一次真实共读，允许按兴趣和时间分段。',
    },
    {
      title: '把阅读记下来',
      text: '阅读卡记录真实书名、喜欢的人物或画面、一个问题与下一次想读的内容；家长可以代写。记不清的书名先回看封面，不随便补造。没有读到的内容不假装已经读完。',
    },
    {
      title: '分享也要倾听',
      text: '告诉家长或同学书名，介绍一个人物或喜欢的情节，说明为什么喜欢；听对方说完，再提一个问题。喜好可以不同，不用读书数量或谁说得长评高低。',
      activity: '实际进行一次分享，再听对方介绍。',
    },
    {
      title: '继续读书的计划',
      text: '以后学拼音会帮助认字阅读，但现在也能看图、听读和共读。选一段还想读的内容或另一本书，写下自己的下一次安排；计划还未发生，不记录为已完成。',
    },
  ],
  questions: [
    ...readingTasks(false),
    manual(
      `${rid}-manual-select`,
      `${rid}-real-selection`,
      '实际选择一本能合法阅读的图画书，看看封面并确认书名，和家长说为什么想读。没有书可以稍后完成，不编造选择结果。',
    ),
    manual(
      `${rid}-manual-read`,
      `${rid}-real-reading`,
      '和家长实际共读一小段，孩子看图、听读或接读，说说发生了什么；不要求整本读完。实际完成后再确认。',
    ),
    manual(
      `${rid}-manual-share`,
      `${rid}-real-sharing`,
      '实际介绍自己的书名与喜欢的内容，然后听家长或同伴介绍，问一个问题。填写阅读卡不能自动代替此次交流。',
    ),
    reflection(
      `${rid}-record-book`,
      `${rid}-book-title`,
      '阅读卡：请看真实封面，记录书名。若还未找到书，可以写“尚未选书”；不把原创例子的故事当真实读过的书。',
    ),
    reflection(
      `${rid}-record-favorite`,
      `${rid}-favorite`,
      '阅读卡：写一个你喜欢的人物、画面或情节，以及喜欢的理由。尚未阅读可以如实写目前的想法，家长可代写。',
    ),
    reflection(
      `${rid}-record-next`,
      `${rid}-next-plan`,
      '阅读卡：还有什么问题想问？下一次想读哪一段或哪本书？这是自己的计划，不作为已完成阅读。',
    ),
  ],
  reviewQuestions: readingTasks(true),
  review: {
    date: '2026-10-01',
    reviewer: '原书第19页阅读建议核验与原创活动校验',
    notes: auditNotes('u1-6'),
  },
};
